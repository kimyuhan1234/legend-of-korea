/**
 * Phase 5 — Replicate Flux Pro 로 음식 AI 이미지 재생성 (퀄리티 업그레이드).
 *
 * 입력:  lib/data/hansik-enriched.json (extract-hansik-xlsx.mjs 산출물)
 * 출력:  data/ai-images-pro/<id>.webp
 *        lib/data/ai-images-pro-map.json
 *
 * 비용:  Flux Pro ≈ $0.04 / 이미지. 240 → ~$9.60.
 *        Schnell 대비 ~13 배 비싸지만 음식 사진 퀄리티 큰 차이.
 *
 * 시간:  Pro 는 Schnell 보다 느림 — wait=120 sec 동기 + 11 sec 호출 간격.
 *        240 × 11s ≈ 44 분 (rate limit 안전). 429 발생 시 추가 대기.
 *
 * 사용자 작업 (실행 전)
 *   1. https://replicate.com 신용카드 등록 + 충분한 잔액 (~$10)
 *   2. $env:REPLICATE_API_TOKEN="r8_..."
 *   3. node scripts/generate-ai-images-pro.mjs
 *
 * 견고성
 *   - 이미 생성된 파일 skip (재실행 안전)
 *   - Prefer: wait=120 sec 동기 응답 + 폴링 fallback (90 회 / 1.5 sec)
 *   - 429 자동 retry (최대 5 회)
 *   - 402 (insufficient credit) 즉시 break — 잔액 부족 시 안전 중단
 *   - 매번 map 저장 (중단 대비)
 *   - 호출 사이 11s (rate limit 안전)
 *
 * Supabase 업로드
 *   완료 후 scripts/upload-pro-to-supabase.mjs 실행 → 같은 경로로 덮어쓰기.
 *   food-dupes.ts URL 그대로 작동 (URL 변경 X — Schnell 이미지가 Pro 로 자동 교체).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN
if (!REPLICATE_TOKEN) {
  console.error('[error] REPLICATE_API_TOKEN 환경변수 부재.')
  console.error('  발급: https://replicate.com/account/api-tokens')
  process.exit(1)
}

const ENRICHED_PATH = 'lib/data/hansik-enriched.json'
const OUTPUT_DIR = 'data/ai-images-pro'
const MAP_PATH = 'lib/data/ai-images-pro-map.json'
const COST_PER_IMAGE = 0.04 // USD — Flux Pro

const INTER_CALL_DELAY_MS = 11_000
const MAX_RATE_LIMIT_RETRY = 5
const DEFAULT_RETRY_AFTER_MS = 12_000

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const enriched = JSON.parse(readFileSync(ENRICHED_PATH, 'utf8'))
mkdirSync(OUTPUT_DIR, { recursive: true })

const results = existsSync(MAP_PATH)
  ? JSON.parse(readFileSync(MAP_PATH, 'utf8'))
  : {}

const toGenerate = enriched.filter(
  (f) => !existsSync(join(OUTPUT_DIR, `${f.id}.webp`)),
).length
const estimatedMin = Math.round((toGenerate * INTER_CALL_DELAY_MS) / 60_000)
const estimatedCost = (toGenerate * COST_PER_IMAGE).toFixed(2)
console.log(`[plan] total: ${enriched.length} / to generate: ${toGenerate} / est: ~${estimatedMin} min / cost: ~$${estimatedCost}`)

async function pollPrediction(id, maxAttempts = 90) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(1500)
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    })
    if (!res.ok) continue
    const data = await res.json()
    if (data.status === 'succeeded') return data
    if (data.status === 'failed' || data.status === 'canceled') return data
  }
  return null
}

async function generateOne(food, retryCount = 0) {
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REPLICATE_TOKEN}`,
      'Content-Type': 'application/json',
      Prefer: 'wait=120',
    },
    body: JSON.stringify({
      // Flux Pro — 퀄리티 우선
      version: 'black-forest-labs/flux-pro',
      input: {
        prompt: food.ai_prompt,
        aspect_ratio: '1:1',
        output_format: 'webp',
        output_quality: 90,
        steps: 25,
        guidance: 3,
        interval: 2,
        safety_tolerance: 2,
      },
    }),
  })

  // 402 — insufficient credit. 즉시 throw (메인 루프에서 break).
  if (res.status === 402) {
    const txt = await res.text().catch(() => '')
    throw new Error(`INSUFFICIENT_CREDIT: ${txt.slice(0, 200)}`)
  }

  // 429 — rate limit. Retry-After 우선, fallback 12 초.
  if (res.status === 429) {
    if (retryCount >= MAX_RATE_LIMIT_RETRY) {
      throw new Error(`rate limit max retries (${MAX_RATE_LIMIT_RETRY}) exceeded`)
    }
    const retryAfterHeader = res.headers.get('retry-after')
    const retryMs = retryAfterHeader
      ? Math.max(parseInt(retryAfterHeader, 10) * 1000, 1000)
      : DEFAULT_RETRY_AFTER_MS
    console.log(`  rate limit (429), waiting ${Math.round(retryMs / 1000)}s (retry ${retryCount + 1}/${MAX_RATE_LIMIT_RETRY})`)
    await sleep(retryMs)
    return generateOne(food, retryCount + 1)
  }

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${errBody.slice(0, 200)}`)
  }

  let prediction = await res.json()

  if (prediction.status !== 'succeeded' && prediction.id) {
    prediction = (await pollPrediction(prediction.id)) ?? prediction
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(`prediction status: ${prediction.status} ${prediction.error || ''}`)
  }

  const output = prediction.output
  const imageUrl = Array.isArray(output) ? output[0] : output
  if (!imageUrl) throw new Error('no image url in prediction.output')

  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error(`image download ${imgRes.status}`)
  return Buffer.from(await imgRes.arrayBuffer())
}

let success = 0
let skipped = 0
let failed = 0
let stoppedReason = null

for (let i = 0; i < enriched.length; i++) {
  const food = enriched[i]
  const outPath = join(OUTPUT_DIR, `${food.id}.webp`)
  const tag = `[${i + 1}/${enriched.length}] ${food.id}`

  if (existsSync(outPath)) {
    console.log(`${tag} - SKIP (exists)`)
    results[food.id] = `/ai-images-pro/${food.id}.webp`
    skipped++
    continue
  }

  try {
    const buffer = await generateOne(food)
    await writeFile(outPath, buffer)
    results[food.id] = `/ai-images-pro/${food.id}.webp`
    success++
    console.log(`${tag} ✓`)
  } catch (e) {
    failed++
    const msg = e instanceof Error ? e.message : String(e)
    console.error(`${tag} ✗ ${msg}`)
    if (msg.startsWith('INSUFFICIENT_CREDIT')) {
      stoppedReason = 'insufficient credit'
      console.error('  잔액 부족 — Replicate 충전 후 재실행. 진행분은 자동 skip.')
      break
    }
  }

  writeFileSync(MAP_PATH, JSON.stringify(results, null, 2) + '\n')

  if (i < enriched.length - 1) {
    await sleep(INTER_CALL_DELAY_MS)
  }
}

writeFileSync(MAP_PATH, JSON.stringify(results, null, 2) + '\n')

console.log('---')
console.log(`Success : ${success}`)
console.log(`Skipped : ${skipped}`)
console.log(`Failed  : ${failed}`)
console.log(`Total   : ${enriched.length}`)
if (stoppedReason) console.log(`Stopped : ${stoppedReason}`)
console.log(`Map     : ${MAP_PATH}`)
console.log(`Images  : ${OUTPUT_DIR}/`)
console.log('')
console.log('Next: node scripts/upload-pro-to-supabase.mjs')
