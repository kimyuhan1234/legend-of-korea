/**
 * Phase 4 — Pexels API 로 실제 음식 사진 검색.
 *
 * 입력:  lib/data/hansik-enriched.json (extract-hansik-xlsx.mjs 산출물)
 * 출력:  data/pexels-images/<id>.jpg (Pexels 매칭 시)
 *        lib/data/pexels-map.json (id → { found: boolean, photo_url, src_url, photographer })
 *
 * 전략 (사용자 의도 — Pexels + AI hybrid)
 *   1. 영문 검색어로 Pexels API 호출 (hansik.name_en > 한글 + ' korean food')
 *   2. 첫 결과의 src.large 다운로드 → data/pexels-images/
 *   3. 매칭 안 되면 found: false 로 기록 — 기존 AI 이미지 유지
 *
 * 비용 / 한도
 *   - 무료 (Pexels API)
 *   - 200 req/hour, 20,000 req/month
 *   - 240 req 단일 실행 — hour 한도 안에서 OK. 안전 마진 3 sec 간격.
 *   - 시간: 240 × 3s ≈ 12 분
 *
 * 사용자 작업 (실행 전)
 *   1. https://www.pexels.com/api/ 가입 + API key 발급
 *   2. 환경변수: $env:PEXELS_API_KEY="..."  (PowerShell)
 *               export PEXELS_API_KEY="..."   (bash)
 *
 * 실행:  node scripts/fetch-pexels-images.mjs
 *
 * 다음 단계 (사용자 작업)
 *   1. data/pexels-images/<id>.jpg 수동 검증 (정말 그 음식 사진인지)
 *   2. 좋은 매칭만 별도 폴더 (data/pexels-curated/) 로 분리
 *   3. upload-to-supabase.mjs 의 SOURCE_DIR 를 pexels-curated 로 바꿔 업로드
 *   4. apply-hansik-data.mjs 로 food-dupes.ts patch
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const PEXELS_KEY = process.env.PEXELS_API_KEY
if (!PEXELS_KEY) {
  console.error('[error] PEXELS_API_KEY 환경변수 부재.')
  console.error('  발급: https://www.pexels.com/api/')
  process.exit(1)
}

const ENRICHED_PATH = 'lib/data/hansik-enriched.json'
const OUTPUT_DIR = 'data/pexels-images'
const MAP_PATH = 'lib/data/pexels-map.json'

const INTER_CALL_DELAY_MS = 3_000 // 200/hour 안에서 안전. 3 sec 간격 → 1200/hour 가능하지만 보수적.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const enriched = JSON.parse(readFileSync(ENRICHED_PATH, 'utf8'))
mkdirSync(OUTPUT_DIR, { recursive: true })

const results = existsSync(MAP_PATH)
  ? JSON.parse(readFileSync(MAP_PATH, 'utf8'))
  : {}

function buildQuery(food) {
  // 1순위: 영문명 (정확도 가장 높음)
  if (food.hansik?.name_en && typeof food.hansik.name_en === 'string') {
    return food.hansik.name_en.replace(/\([^)]*\)/g, '').trim()
  }
  // 2순위: 한글명 + ' korean food'
  return `${food.name_ko} korean food`
}

async function searchPexels(query) {
  const url = `https://api.pexels.com/v1/search?${new URLSearchParams({
    query,
    per_page: '3',
    orientation: 'square',
  })}`
  const res = await fetch(url, {
    headers: { Authorization: PEXELS_KEY },
  })
  if (res.status === 429) {
    throw new Error('rate_limit_429')
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

let success = 0
let skipped = 0
let notFound = 0
let failed = 0

const toSearch = enriched.filter((f) => !existsSync(join(OUTPUT_DIR, `${f.id}.jpg`)) && !results[f.id])
console.log(`[plan] total: ${enriched.length} / to search: ${toSearch.length} / est: ~${Math.round((toSearch.length * INTER_CALL_DELAY_MS) / 60_000)} min`)

for (let i = 0; i < enriched.length; i++) {
  const food = enriched[i]
  const tag = `[${i + 1}/${enriched.length}] ${food.id}`
  const outPath = join(OUTPUT_DIR, `${food.id}.jpg`)

  // skip: 이미 다운로드된 파일
  if (existsSync(outPath)) {
    skipped++
    if (!results[food.id]) {
      results[food.id] = { found: true, photo_url: `/pexels-images/${food.id}.jpg` }
    }
    console.log(`${tag} - SKIP (downloaded)`)
    continue
  }

  // skip: 이전 실행에서 not found 로 기록된 음식
  if (results[food.id]?.found === false) {
    skipped++
    console.log(`${tag} - SKIP (not found prev)`)
    continue
  }

  const query = buildQuery(food)

  try {
    const data = await searchPexels(query)
    const first = data.photos?.[0]
    if (!first) {
      notFound++
      results[food.id] = { found: false, query }
      console.log(`${tag} ✗ no result (query: "${query}")`)
    } else {
      const imgUrl = first.src.large
      const imgRes = await fetch(imgUrl)
      if (!imgRes.ok) throw new Error(`download ${imgRes.status}`)
      const buffer = Buffer.from(await imgRes.arrayBuffer())
      await writeFile(outPath, buffer)
      results[food.id] = {
        found: true,
        photo_url: `/pexels-images/${food.id}.jpg`,
        src_url: first.src.large,
        page_url: first.url,
        photographer: first.photographer,
        query,
      }
      success++
      console.log(`${tag} ✓ "${query}" → ${first.photographer}`)
    }
  } catch (e) {
    failed++
    console.error(`${tag} ✗ ${e instanceof Error ? e.message : String(e)}`)
    if (e instanceof Error && e.message === 'rate_limit_429') {
      console.error('  Rate limit 도달. 1 시간 후 재실행.')
      break
    }
  }

  // 매번 map 저장 (중단 대비)
  writeFileSync(MAP_PATH, JSON.stringify(results, null, 2) + '\n')

  if (i < enriched.length - 1) {
    await sleep(INTER_CALL_DELAY_MS)
  }
}

console.log('---')
console.log(`Success   : ${success}`)
console.log(`Skipped   : ${skipped}`)
console.log(`Not found : ${notFound}`)
console.log(`Failed    : ${failed}`)
console.log(`Total     : ${enriched.length}`)
console.log(`Output    : ${OUTPUT_DIR}/ + ${MAP_PATH}`)
console.log('')
console.log('Next steps')
console.log('  1. data/pexels-images/<id>.jpg 수동 검증 — 정말 그 음식 사진인지 확인')
console.log('  2. 좋은 매칭만 data/pexels-curated/ 로 분리')
console.log('  3. upload-to-supabase.mjs 의 SOURCE_DIR 를 pexels-curated 로 변경 후 업로드')
console.log('  4. apply-hansik-data.mjs 로 food-dupes.ts patch (Pexels URL 우선)')
