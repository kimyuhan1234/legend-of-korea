/**
 * Step 3 — AI 이미지 Supabase Storage 업로드.
 *
 * 입력:  data/ai-images/<id>.webp (generate-ai-images.mjs 산출물)
 * 출력:  lib/data/hansik-image-urls.json (id → public URL)
 *
 * 사용자 작업 (실행 전)
 *   1. Supabase Dashboard → Storage → Create bucket
 *      - Name: food-images
 *      - Public bucket: ON
 *   2. .env.local 에 SUPABASE_SERVICE_ROLE_KEY 등록 (이미 있을 가능성)
 *   3. NEXT_PUBLIC_SUPABASE_URL 도 같이 (이미 있음)
 *
 * 실행:  node scripts/upload-to-supabase.mjs
 *
 * 멱등 — 같은 경로 upsert: true 로 재업로드 안전.
 */

import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('[error] NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수 부재.')
  console.error('  .env.local 을 dotenv 로 직접 로드하지 않으므로 셸에서 export 필요:')
  console.error('  bash:        export $(grep -v "^#" .env.local | xargs)')
  console.error('  PowerShell:  Get-Content .env.local | ForEach-Object { if ($_ -match "^([^#=]+)=(.*)$") { $env:$($matches[1]) = $matches[2] } }')
  process.exit(1)
}

const BUCKET = 'food-images'
const PREFIX = 'hansik' // bucket 안의 폴더
const SOURCE_DIR = 'data/ai-images'
const URL_MAP_PATH = 'lib/data/hansik-image-urls.json'

let files
try {
  files = readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.webp'))
} catch {
  console.error(`[error] ${SOURCE_DIR} 부재. 먼저 generate-ai-images.mjs 실행.`)
  process.exit(1)
}

if (files.length === 0) {
  console.error(`[error] ${SOURCE_DIR} 안에 .webp 파일 없음.`)
  process.exit(1)
}

console.log(`[upload] ${files.length} files to ${BUCKET}/${PREFIX}/`)

// 기존 매핑 보존
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
      'x-upsert': 'true', // 같은 경로 덮어쓰기 허용
    },
    body: buffer,
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`)
  }

  // public URL 구성 (bucket 이 public 이라는 전제)
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

  // 중간 저장 (실패 시 진행분 보존)
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
console.log('Next: node scripts/apply-hansik-data.mjs')
