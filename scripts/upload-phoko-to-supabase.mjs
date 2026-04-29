/**
 * Phase 6 — 한국관광공사 포토코리아 (jpg) Supabase Storage 업로드.
 *
 * 입력:  data/phoko-images/<id>.jpg (사용자 다운로드)
 * 출력:  Supabase 의 food-images/hansik/<id>.jpg (jpg 명 — webp 와 별도 경로)
 *        lib/data/phoko-image-urls.json (id → public URL)
 *
 * URL 변경
 *   - 기존 Pro/Schnell webp: food-images/hansik/<id>.webp
 *   - phoko jpg:             food-images/hansik/<id>.jpg
 *   → URL 다름. food-dupes.ts 의 image 필드도 .webp → .jpg 갱신 필요.
 *     scripts/apply-phoko-credits.mjs 가 처리.
 *
 * 라이선스 — 공공누리 1 유형 (출처 표기 시 상업 이용 OK).
 *   각 음식의 imageCredit 필드 (예: 'ⓒ한국관광공사 포토코리아-홍길동') 로 표기.
 *
 * 사용자 작업 (실행 전)
 *   1. data/phoko-images/<id>.jpg 240 개 파일 보유
 *   2. data/phoko-credits.json 의 { id: photographer } 매핑 보유
 *   3. .env.local 의 NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
 *      셸에 export
 *
 * 실행:  node scripts/upload-phoko-to-supabase.mjs
 *
 * 멱등 — x-upsert: true 로 재업로드 안전.
 */

import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('[error] NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수 부재.')
  process.exit(1)
}

const BUCKET = 'food-images'
const PREFIX = 'hansik'
const SOURCE_DIR = 'data/phoko-images'
const URL_MAP_PATH = 'lib/data/phoko-image-urls.json'

let files
try {
  files = readdirSync(SOURCE_DIR).filter((f) => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'))
} catch {
  console.error(`[error] ${SOURCE_DIR} 부재. 먼저 phoko 이미지 다운로드.`)
  process.exit(1)
}

if (files.length === 0) {
  console.error(`[error] ${SOURCE_DIR} 안에 .jpg 파일 없음.`)
  process.exit(1)
}

console.log(`[upload-phoko] ${files.length} files to ${BUCKET}/${PREFIX}/<id>.jpg`)

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
  const path = `${PREFIX}/${id}.jpg`
  const endpoint = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE}`,
      apikey: SERVICE_ROLE,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true',
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
  // 파일명에서 확장자 제거 (.jpg / .jpeg 모두 — id 추출)
  const id = basename(file).replace(/\.(jpg|jpeg)$/i, '')
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
console.log('Next: node scripts/apply-phoko-credits.mjs')
