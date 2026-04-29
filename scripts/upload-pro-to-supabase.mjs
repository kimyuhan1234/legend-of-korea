/**
 * Phase 5 — Flux Pro 재생성 이미지 Supabase Storage 업로드 (덮어쓰기).
 *
 * 입력:  data/ai-images-pro/<id>.webp (generate-ai-images-pro.mjs 산출물)
 * 출력:  lib/data/hansik-image-urls.json 갱신 (id → public URL)
 *        Supabase Storage 의 food-images/hansik/<id>.webp 가 Pro 이미지로 덮어써짐.
 *
 * 핵심 — URL 변경 X
 *   같은 bucket/path 로 upsert: true → food-dupes.ts 의 image URL 그대로 작동.
 *   Schnell 이미지가 Pro 로 자동 교체되며 Vercel 캐시는 다음 요청 시 갱신.
 *
 * 사용자 작업 (실행 전)
 *   1. generate-ai-images-pro.mjs 완료 (data/ai-images-pro/ 채워짐)
 *   2. Supabase Storage 의 food-images 버킷 이미 존재 (이전 단계에서 생성)
 *   3. .env.local 의 NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
 *      셸에 export
 *
 * 실행:  node scripts/upload-pro-to-supabase.mjs
 *
 * 멱등 — x-upsert: true 로 재업로드 안전.
 */

import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('[error] NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수 부재.')
  console.error('  bash:        export $(grep -v "^#" .env.local | xargs)')
  console.error('  PowerShell:  Get-Content .env.local | ForEach-Object { if ($_ -match "^([^#=]+)=(.*)$") { $env:$($matches[1]) = $matches[2] } }')
  process.exit(1)
}

const BUCKET = 'food-images'
const PREFIX = 'hansik' // 같은 PREFIX — 기존 Schnell 이미지 덮어쓰기
const SOURCE_DIR = 'data/ai-images-pro'
const URL_MAP_PATH = 'lib/data/hansik-image-urls.json'

let files
try {
  files = readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.webp'))
} catch {
  console.error(`[error] ${SOURCE_DIR} 부재. 먼저 generate-ai-images-pro.mjs 실행.`)
  process.exit(1)
}

if (files.length === 0) {
  console.error(`[error] ${SOURCE_DIR} 안에 .webp 파일 없음.`)
  process.exit(1)
}

console.log(`[upload-pro] ${files.length} files to ${BUCKET}/${PREFIX}/ (overwrite)`)

const urls = (() => {
  try {
    return JSON.parse(readFileSync(URL_MAP_PATH, 'utf8'))
  } catch {
    return {}
  }
})()

let success = 0
let failed = 0

async function uploadOne(id, buffer) {
  const path = `${PREFIX}/${id}.webp`
  const endpoint = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE}`,
      apikey: SERVICE_ROLE,
      'Content-Type': 'image/webp',
      'x-upsert': 'true', // Schnell 이미지 덮어쓰기
    },
    body: buffer,
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`)
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}

for (let i = 0; i < files.length; i++) {
  const file = files[i]
  const id = basename(file, '.webp')
  const tag = `[${i + 1}/${files.length}] ${id}`

  try {
    const buffer = readFileSync(join(SOURCE_DIR, file))
    const sizeKb = (statSync(join(SOURCE_DIR, file)).size / 1024).toFixed(0)
    const publicUrl = await uploadOne(id, buffer)
    urls[id] = publicUrl
    success++
    console.log(`${tag} ✓ (${sizeKb}KB)`)
  } catch (e) {
    failed++
    console.error(`${tag} ✗ ${e instanceof Error ? e.message : String(e)}`)
  }

  if ((i + 1) % 20 === 0) {
    writeFileSync(URL_MAP_PATH, JSON.stringify(urls, null, 2) + '\n')
  }
}

writeFileSync(URL_MAP_PATH, JSON.stringify(urls, null, 2) + '\n')

console.log('---')
console.log(`Success : ${success}`)
console.log(`Failed  : ${failed}`)
console.log(`Output  : ${URL_MAP_PATH}`)
console.log('')
console.log('food-dupes.ts URL 은 그대로 — 브라우저 캐시만 새로고침하면 Pro 이미지 노출.')
