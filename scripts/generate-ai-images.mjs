/**
 * Step 2 — Replicate Flux Schnell 로 음식 AI 이미지 일괄 생성.
 *
 * 입력:  lib/data/hansik-enriched.json (extract-hansik-xlsx.mjs 산출물)
 * 출력:  data/ai-images/<id>.webp (각 음식 1 장)
 *        lib/data/ai-images-map.json (id → 로컬 경로)
 *
 * 비용:  Flux Schnell ≈ $0.003 / 이미지. 240 → ~$0.72.
 * 시간:  240 × ~3 sec = ~12 분.
 *
 * 사용자 작업 (실행 전)
 *   1. https://replicate.com 가입 + 신용카드 등록 (~$1 충전)
 *   2. https://replicate.com/account/api-tokens 에서 token 발급
 *   3. 환경변수: $env:REPLICATE_API_TOKEN="r8_..." (PowerShell)
 *               export REPLICATE_API_TOKEN="r8_..."         (bash)
 *
 * 실행:  node scripts/generate-ai-images.mjs
 *
 * 견고성
 *   - 이미 생성된 파일 skip (재실행 안전)
 *   - Prefer: wait=60 (sync 응답) — 폴링 fallback 추가
 *   - rate-limit 보호 500 ms 간격
 *   - 개별 실패는 다음 음식으로 진행 (전체 중단 X)
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
const OUTPUT_DIR = 'data/ai-images'
const MAP_PATH = 'lib/data/ai-images-map.json'

const enriched = JSON.parse(readFileSync(ENRICHED_PATH, 'utf8'))
mkdirSync(OUTPUT_DIR, { recursive: true })

// 기존 결과 보존 (재실행 시 누적)
const results = existsSync(MAP_PATH)
  ? JSON.parse(readFileSync(MAP_PATH, 'utf8'))
  : {}

async function pollPrediction(id, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 1500))
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

async function generateOne(food) {
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REPLICATE_TOKEN}`,
      'Content-Type': 'application/json',
      Prefer: 'wait=60',
    },
    body: JSON.stringify({
      // Flux Schnell — 빠르고 저렴
      version: 'black-forest-labs/flux-schnell',
      input: {
        prompt: food.ai_prompt,
        aspect_ratio: '1:1',
        output_format: 'webp',
        output_quality: 90,
        num_outputs: 1,
        go_fast: true,
      },
    }),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${errBody.slice(0, 200)}`)
  }

  let prediction = await res.json()

  // 동기 응답 못 받으면 폴링
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
  const buffer = Buffer.from(await imgRes.arrayBuffer())

  return buffer
}

let success = 0
let skipped = 0
let failed = 0

for (let i = 0; i < enriched.length; i++) {
  const food = enriched[i]
  const outPath = join(OUTPUT_DIR, `${food.id}.webp`)
  const tag = `[${i + 1}/${enriched.length}] ${food.id}`

  if (existsSync(outPath)) {
    console.log(`${tag} - SKIP (exists)`)
    results[food.id] = `/ai-images/${food.id}.webp`
    skipped++
    continue
  }

  try {
    const buffer = await generateOne(food)
    await writeFile(outPath, buffer)
    results[food.id] = `/ai-images/${food.id}.webp`
    success++
    console.log(`${tag} ✓`)
  } catch (e) {
    failed++
    console.error(`${tag} ✗ ${e instanceof Error ? e.message : String(e)}`)
  }

  // rate-limit 보호 + map 중간 저장 (실행 중단 시 진행 분 보존)
  await new Promise((r) => setTimeout(r, 500))
  if ((i + 1) % 10 === 0) {
    writeFileSync(MAP_PATH, JSON.stringify(results, null, 2) + '\n')
  }
}

writeFileSync(MAP_PATH, JSON.stringify(results, null, 2) + '\n')

console.log('---')
console.log(`Success : ${success}`)
console.log(`Skipped : ${skipped}`)
console.log(`Failed  : ${failed}`)
console.log(`Total   : ${enriched.length}`)
console.log(`Map     : ${MAP_PATH}`)
console.log(`Images  : ${OUTPUT_DIR}/`)
