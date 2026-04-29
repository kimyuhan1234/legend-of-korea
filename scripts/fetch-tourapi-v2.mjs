/**
 * Phase 6 — TourAPI 강화 검색 + 다중 쿼리 시도.
 *
 * 입력:  lib/data/hansik-enriched.json
 * 출력:  data/tourapi-v2-images/<id>.jpg (firstimage 다운로드)
 *        lib/data/tourapi-v2-map.json (id → { url, title, addr, contentTypeId, query })
 *
 * 라이선스 — TourAPI 는 공공누리 1 유형 (출처 표기 시 상업 이용 OK).
 *           Footer 또는 약관 페이지에 '이미지 출처: 한국관광공사 TourAPI' 표기.
 *
 * 검색어 우선순위 (정확 매칭 우선)
 *   1. food.name_ko                — "전주비빔밥"
 *   2. food.hansik?.name_ko        — "비빔밥" (한식진흥원 매칭명)
 *   3. food.name_ko + " 한식"      — fallback
 *   4. food.name_ko - 지역 prefix  — "비빔밥"
 *
 * 시간 / 한도
 *   - TourAPI: 일일 한도 충분 (활용 신청 시 보통 1000+/day).
 *   - 호출 간격 1 sec — 240 × 1s ≈ 4 분.
 *
 * 사용자 작업 — TOUR_API_KEY 환경변수
 *   PowerShell:
 *     $env:TOUR_API_KEY = (Get-Content .env.local | Select-String "TOUR_API_KEY" |
 *       ForEach-Object { ($_ -split "=", 2)[1].Trim() })
 *   bash:
 *     export TOUR_API_KEY=$(grep TOUR_API_KEY .env.local | cut -d= -f2)
 *
 * 실행: node scripts/fetch-tourapi-v2.mjs
 *
 * 다음 단계 (큐레이션 — 사용자 작업)
 *   1. data/tourapi-v2-images/ 수동 검토 — 음식점 외관 사진 삭제, 음식 사진만 keep
 *   2. 좋은 매칭만 data/tourapi-v2-curated/ 로 분리
 *   3. upload-pro-to-supabase.mjs 의 SOURCE_DIR 변경 후 업로드
 *      → food-dupes.ts URL 그대로 (덮어쓰기)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const TOUR_API_KEY = process.env.TOUR_API_KEY
if (!TOUR_API_KEY) {
  console.error('[error] TOUR_API_KEY 환경변수 부재.')
  console.error('  발급: https://api.visitkorea.or.kr')
  process.exit(1)
}

const ENRICHED_PATH = 'lib/data/hansik-enriched.json'
const OUTPUT_DIR = 'data/tourapi-v2-images'
const MAP_PATH = 'lib/data/tourapi-v2-map.json'
const INTER_CALL_DELAY_MS = 1_000 // TourAPI 충분 — 1 sec 간격
const REGION_PREFIX = /^(안동|전주|서울|부산|제주|경주|통영|천안|용인|이천|속초|여수|광주|대구|인천|수원|대전|춘천|강릉)\s*/

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const enriched = JSON.parse(readFileSync(ENRICHED_PATH, 'utf8'))
mkdirSync(OUTPUT_DIR, { recursive: true })

const results = existsSync(MAP_PATH)
  ? JSON.parse(readFileSync(MAP_PATH, 'utf8'))
  : {}

// 쿼리 후보 생성 (중복 제거 + 우선순위 보존)
function buildQueries(food) {
  const stripped = food.name_ko.replace(REGION_PREFIX, '').trim()
  const candidates = [
    food.name_ko,
    food.hansik?.name_ko,
    `${food.name_ko} 한식`,
    stripped !== food.name_ko ? stripped : null,
  ]
  const seen = new Set()
  const queries = []
  for (const q of candidates) {
    if (!q || typeof q !== 'string') continue
    const trimmed = q.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    queries.push(trimmed)
  }
  return queries
}

async function searchOne(query) {
  const url = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?${new URLSearchParams({
    ServiceKey: TOUR_API_KEY,
    MobileApp: 'cloud-with-you',
    MobileOS: 'ETC',
    keyword: query,
    numOfRows: '10',
    pageNo: '1',
    _type: 'json',
    listYN: 'Y',
    arrange: 'O',
  })}`

  const res = await fetch(url)
  if (!res.ok) return null
  let data
  try {
    data = await res.json()
  } catch {
    return null
  }

  const items = data?.response?.body?.items?.item
  if (!items) return null
  const arr = Array.isArray(items) ? items : [items]

  // firstimage 있는 첫 결과 (음식점 = contenttypeid 39 / 관광지 = 12 등 다양)
  const withImage = arr.find((it) => it.firstimage && String(it.firstimage).length > 10)
  if (!withImage) return null

  return {
    url: String(withImage.firstimage),
    title: withImage.title ? String(withImage.title) : '',
    addr: withImage.addr1 ? String(withImage.addr1) : '',
    contentTypeId: withImage.contenttypeid ? String(withImage.contenttypeid) : '',
    query,
  }
}

async function searchWithFallback(food) {
  for (const query of buildQueries(food)) {
    try {
      const result = await searchOne(query)
      if (result) return result
    } catch (e) {
      console.error(`  query "${query}" failed:`, e instanceof Error ? e.message : String(e))
    }
    // 쿼리 사이도 짧게 — TourAPI 폭주 방지
    await sleep(200)
  }
  return null
}

let found = 0
let notFound = 0
let failed = 0

const remaining = enriched.filter((f) => !existsSync(join(OUTPUT_DIR, `${f.id}.jpg`)) && !results[f.id]).length
console.log(`[plan] total: ${enriched.length} / to search: ${remaining} / est: ~${Math.round((remaining * INTER_CALL_DELAY_MS) / 60_000)} min`)

for (let i = 0; i < enriched.length; i++) {
  const food = enriched[i]
  const tag = `[${i + 1}/${enriched.length}] ${food.id}`
  const outPath = join(OUTPUT_DIR, `${food.id}.jpg`)

  if (existsSync(outPath)) {
    if (!results[food.id]) results[food.id] = { found: true, photo_url: `/tourapi-v2-images/${food.id}.jpg` }
    console.log(`${tag} - SKIP (downloaded)`)
    continue
  }

  if (results[food.id]?.found === false) {
    console.log(`${tag} - SKIP (not found prev)`)
    continue
  }

  try {
    const result = await searchWithFallback(food)
    if (result) {
      const imgRes = await fetch(result.url)
      if (!imgRes.ok) throw new Error(`download ${imgRes.status}`)
      const buffer = Buffer.from(await imgRes.arrayBuffer())
      await writeFile(outPath, buffer)
      results[food.id] = {
        found: true,
        photo_url: `/tourapi-v2-images/${food.id}.jpg`,
        url: result.url,
        title: result.title,
        addr: result.addr,
        contentTypeId: result.contentTypeId,
        query: result.query,
      }
      found++
      console.log(`${tag} ✓ "${result.title.slice(0, 40)}" (q: "${result.query}")`)
    } else {
      results[food.id] = { found: false, queries_tried: buildQueries(food) }
      notFound++
      console.log(`${tag} ✗ no result`)
    }
  } catch (e) {
    failed++
    console.error(`${tag} ✗ ${e instanceof Error ? e.message : String(e)}`)
  }

  // 매번 map 저장 (중단 대비)
  writeFileSync(MAP_PATH, JSON.stringify(results, null, 2) + '\n')

  if (i < enriched.length - 1) {
    await sleep(INTER_CALL_DELAY_MS)
  }
}

console.log('---')
console.log(`Found     : ${found}`)
console.log(`Not found : ${notFound}`)
console.log(`Failed    : ${failed}`)
console.log(`Total     : ${enriched.length}`)
console.log(`Map       : ${MAP_PATH}`)
console.log(`Images    : ${OUTPUT_DIR}/`)
console.log('')
console.log('Next — 큐레이션:')
console.log('  1. data/tourapi-v2-images/ 검토 — 음식점 외관 사진 삭제, 음식 사진만 keep')
console.log('  2. 좋은 매칭만 data/tourapi-v2-curated/ 로 복사')
console.log('  3. upload-pro-to-supabase.mjs 의 SOURCE_DIR 변경 후 업로드 (덮어쓰기)')
