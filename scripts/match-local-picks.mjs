/**
 * Phase 8 Step 4 — Local Picks → TourAPI contentid 자동 매칭.
 *
 * 흐름
 *   1. lib/data/local-picks.ts 에서 LOCAL_PICKS 추출 (정규식 파싱)
 *   2. 각 픽의 searchName + 광역 areaCode → searchKeyword2 호출
 *   3. 첫 번째 매칭 결과의 contentid + contenttypeid + title 추출
 *   4. data/local-picks-matches.json 저장
 *   5. 다음 단계: scripts/apply-local-picks-matches.mjs (local-picks.ts 자동 갱신)
 *
 * 실행
 *   1. .env.local 의 TOUR_API_KEY 가 process env 에 export 되어야 함
 *   2. node scripts/match-local-picks.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'

const LOCAL_PICKS_PATH = 'lib/data/local-picks.ts'
const OUTPUT_PATH = 'data/local-picks-matches.json'

const TOUR_API_KEY = process.env.TOUR_API_KEY
if (!TOUR_API_KEY) {
  console.error('[error] TOUR_API_KEY 환경변수 부재.')
  console.error('  PowerShell:  Get-Content .env.local | ForEach-Object { if ($_ -match "^([^#=]+)=(.*)$") { Set-Item "env:$($matches[1])" $matches[2] } }')
  process.exit(1)
}

// 광역 → areaCode 매핑 (lib/tour-api/area-codes.ts 와 동기화)
const PROVINCE_AREA_CODE = {
  seoul: 1, incheon: 2, daejeon: 3, daegu: 4, gwangju: 5, busan: 6, ulsan: 7, sejong: 8,
  gyeonggi: 31, gangwon: 32, chungbuk: 33, chungnam: 34, gyeongbuk: 35, gyeongnam: 36, jeonbuk: 37, jeonnam: 38, jeju: 39,
}

if (!existsSync('data')) mkdirSync('data', { recursive: true })

// ─────────────────────────────────────────────────────────────
// local-picks.ts 정규식 파싱 — { id, searchName, rank } 추출
// ─────────────────────────────────────────────────────────────

const src = readFileSync(LOCAL_PICKS_PATH, 'utf8')

/**
 * LOCAL_PICKS 의 각 광역 블록 추출.
 * 패턴: `{province}: [\n  { id: '...', searchName: '...', rank: N, ... },\n  ...\n  ],`
 */
function parseLocalPicks(source) {
  const result = {}
  const provinces = Object.keys(PROVINCE_AREA_CODE)

  for (const prov of provinces) {
    // 광역 블록 시작 — 들여쓰기 + 'province: [' 매칭
    const blockStart = new RegExp(`^\\s+${prov}:\\s*\\[`, 'm')
    const startMatch = blockStart.exec(source)
    if (!startMatch) continue

    // 블록 끝 ']' 찾기 — balanced bracket
    let i = startMatch.index + startMatch[0].length
    let depth = 1
    while (i < source.length && depth > 0) {
      const c = source[i]
      if (c === '"' || c === "'") {
        const q = c
        i++
        while (i < source.length && source[i] !== q) {
          if (source[i] === '\\') i++
          i++
        }
        i++
        continue
      }
      if (c === '`') {
        i++
        while (i < source.length && source[i] !== '`') {
          if (source[i] === '\\') i++
          i++
        }
        i++
        continue
      }
      if (c === '[') depth++
      else if (c === ']') {
        depth--
        if (depth === 0) break
      }
      i++
    }
    const blockText = source.slice(startMatch.index, i)

    // 각 픽 추출 — 단일 라인에 id 와 searchName 둘 다
    const itemRe = /\{\s*id:\s*['"]([\w-]+)['"]\s*,\s*searchName:\s*['"]([^'"]+)['"]\s*,\s*rank:\s*(\d+)/g
    const picks = []
    let m
    while ((m = itemRe.exec(blockText)) !== null) {
      picks.push({ id: m[1], searchName: m[2], rank: Number(m[3]) })
    }
    if (picks.length > 0) result[prov] = picks
  }
  return result
}

const parsed = parseLocalPicks(src)
const totalPicks = Object.values(parsed).reduce((acc, list) => acc + list.length, 0)
console.log(`[parse] ${Object.keys(parsed).length} 광역 / ${totalPicks} 픽`)

// ─────────────────────────────────────────────────────────────
// TourAPI searchKeyword2 호출
// ─────────────────────────────────────────────────────────────

async function searchKeyword(keyword, areaCode) {
  const url = new URL('https://apis.data.go.kr/B551011/KorService2/searchKeyword2')
  url.searchParams.set('serviceKey', TOUR_API_KEY)
  url.searchParams.set('MobileOS', 'ETC')
  url.searchParams.set('MobileApp', 'LegendOfKorea')
  url.searchParams.set('_type', 'json')
  url.searchParams.set('keyword', keyword)
  url.searchParams.set('numOfRows', '5')
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('contentTypeId', '39')
  url.searchParams.set('areaCode', String(areaCode))

  try {
    const res = await fetch(url.toString())
    if (!res.ok) return []
    const json = await res.json()
    const items = json?.response?.body?.items?.item
    if (Array.isArray(items)) return items
    if (items) return [items]
    return []
  } catch (err) {
    console.error(`  [error] "${keyword}":`, err.message || err)
    return []
  }
}

// ─────────────────────────────────────────────────────────────
// 메인 — 전체 매칭
// ─────────────────────────────────────────────────────────────

const matches = []
let idx = 0
for (const [province, picks] of Object.entries(parsed)) {
  const areaCode = PROVINCE_AREA_CODE[province]
  console.log(`\n=== ${province} (areaCode ${areaCode}) ===`)

  for (const pick of picks) {
    idx++
    const tag = `[${idx}/${totalPicks}]`
    const results = await searchKeyword(pick.searchName, areaCode)
    if (results.length > 0) {
      const first = results[0]
      console.log(`  ${tag} ✓ ${pick.searchName} → ${first.contentid} (${first.title})`)
      matches.push({
        province,
        id: pick.id,
        searchName: pick.searchName,
        rank: pick.rank,
        contentid: first.contentid,
        contenttypeid: first.contenttypeid,
        matchedTitle: first.title,
      })
    } else {
      console.log(`  ${tag} ✗ ${pick.searchName} — NO MATCH`)
      matches.push({
        province,
        id: pick.id,
        searchName: pick.searchName,
        rank: pick.rank,
        contentid: null,
        contenttypeid: null,
        matchedTitle: null,
      })
    }
    // rate limit 방지 (250ms 간격)
    await new Promise((r) => setTimeout(r, 250))
  }
}

writeFileSync(OUTPUT_PATH, JSON.stringify(matches, null, 2) + '\n')

const matched = matches.filter((m) => m.contentid).length
const total = matches.length
console.log(`\n=== 매칭 결과: ${matched}/${total} (${((matched / total) * 100).toFixed(1)}%) ===`)
console.log(`Output: ${OUTPUT_PATH}`)
console.log(`다음: node scripts/apply-local-picks-matches.mjs`)
