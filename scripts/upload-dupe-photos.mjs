/**
 * Phase C — 운영자 사진 (61 jpeg) Supabase Storage 업로드.
 *
 * 입력
 *   - data/dupe-photos-mapping.json (Phase B patch 후, status=matched 만 처리)
 *   - C:\Users\ADMIN\Desktop\듀프음식사진\<filename>.jpeg
 *
 * 출력
 *   - Supabase Storage food-images/dupe/<food-id>.jpeg (1 사진 → N 음식 복제)
 *   - data/dupe-upload-log.json (foodId 별 결과)
 *
 * 모드
 *   기본: skip 모드 (이미 있으면 409 → skipped, 멱등 안전)
 *   --upsert: 덮어쓰기 모드 (x-upsert: true)
 *   --dry-run: 시뮬레이션 (실 업로드 X)
 *
 * 환경변수 (필수, 운영자 환경에서 export 또는 dotenv 로드)
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *
 * 실행
 *   PowerShell:
 *     # dry-run
 *     Get-Content .env.local | ForEach-Object { if ($_ -match "^([^#=]+)=(.*)$") { Set-Item "env:$($matches[1])" $matches[2] } }
 *     node scripts/upload-dupe-photos.mjs --dry-run
 *     # 실 업로드
 *     node scripts/upload-dupe-photos.mjs
 *     # 강제 덮어쓰기
 *     node scripts/upload-dupe-photos.mjs --upsert
 *
 * 기존 패턴 (upload-phoko-to-supabase.mjs) 와 동일 — fetch REST, x-upsert 헤더.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const PHOTO_DIR = 'C:/Users/ADMIN/Desktop/듀프음식사진'
const MAPPING_PATH = 'data/dupe-photos-mapping.json'
const LOG_PATH = 'data/dupe-upload-log.json'
const BUCKET = 'food-images'
const PREFIX = 'dupe'

const DRY_RUN = process.argv.includes('--dry-run')
const UPSERT = process.argv.includes('--upsert')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!DRY_RUN) {
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('[error] 환경변수 부재 — NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
    console.error('  PowerShell: Get-Content .env.local | ForEach-Object { if ($_ -match "^([^#=]+)=(.*)$") { Set-Item "env:$($matches[1])" $matches[2] } }')
    process.exit(1)
  }
}
if (!existsSync(PHOTO_DIR)) {
  console.error(`[error] 사진 폴더 부재: ${PHOTO_DIR}`)
  process.exit(1)
}
if (!existsSync(MAPPING_PATH)) {
  console.error(`[error] ${MAPPING_PATH} 부재 — 먼저 Phase B 매핑 실행`)
  process.exit(1)
}

const mapping = JSON.parse(readFileSync(MAPPING_PATH, 'utf8'))
const matched = mapping.filter((m) => m.status === 'matched')

// 폴더 내 파일 인덱스 (대소문자/공백 정규화 X — 파일명 그대로 매칭)
const photoFiles = new Set(readdirSync(PHOTO_DIR))

let totalUploads = 0
matched.forEach((m) => (totalUploads += m.selected.length))

console.log(`[mode] ${DRY_RUN ? 'DRY RUN' : UPSERT ? 'UPSERT (덮어쓰기)' : 'SKIP (멱등)'}`)
console.log(`[plan] matched 사진: ${matched.length}, 총 업로드 대상: ${totalUploads}`)

// ─────────────────────────────────────────────────────────────
// 업로드 helper
// ─────────────────────────────────────────────────────────────

async function uploadOne(targetPath, buffer) {
  const endpoint = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${targetPath}`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE}`,
      apikey: SERVICE_ROLE,
      'Content-Type': 'image/jpeg',
      'x-upsert': UPSERT ? 'true' : 'false',
    },
    body: buffer,
  })

  if (res.status === 409 || res.status === 400) {
    // 409 conflict (already exists) 또는 400 (Duplicate) — skip 모드 의미
    const txt = await res.text().catch(() => '')
    if (/already exists|Duplicate|already_exists/i.test(txt)) {
      return { ok: false, status: 'skipped', reason: 'already exists' }
    }
    return { ok: false, status: 'failed', reason: `HTTP ${res.status}: ${txt.slice(0, 200)}` }
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    return { ok: false, status: 'failed', reason: `HTTP ${res.status}: ${txt.slice(0, 200)}` }
  }
  return {
    ok: true,
    status: 'uploaded',
    publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${targetPath}`,
  }
}

// ─────────────────────────────────────────────────────────────
// 메인 루프
// ─────────────────────────────────────────────────────────────

const log = []
let count = 0
const summary = { uploaded: 0, skipped: 0, failed: 0, dry_run: 0, file_not_found: 0 }

for (const entry of matched) {
  const filePath = join(PHOTO_DIR, entry.filename)

  if (!photoFiles.has(entry.filename) || !existsSync(filePath)) {
    console.warn(`[warn] 파일 없음: ${entry.filename}`)
    for (const foodId of entry.selected) {
      log.push({ filename: entry.filename, foodId, status: 'file_not_found' })
      summary.file_not_found++
    }
    continue
  }

  const buffer = DRY_RUN ? null : readFileSync(filePath)

  for (const foodId of entry.selected) {
    count++
    const targetPath = `${PREFIX}/${foodId}.jpeg`
    const tag = `[${count}/${totalUploads}]`

    if (DRY_RUN) {
      console.log(`${tag} DRY: ${entry.filename} → ${targetPath}`)
      log.push({ filename: entry.filename, foodId, targetPath, status: 'dry_run' })
      summary.dry_run++
      continue
    }

    try {
      const result = await uploadOne(targetPath, buffer)
      if (result.status === 'uploaded') {
        console.log(`${tag} ✓ ${targetPath}`)
        log.push({ filename: entry.filename, foodId, targetPath, publicUrl: result.publicUrl, status: 'uploaded' })
        summary.uploaded++
      } else if (result.status === 'skipped') {
        console.log(`${tag} ⏭  SKIP (exists): ${targetPath}`)
        log.push({ filename: entry.filename, foodId, targetPath, status: 'skipped' })
        summary.skipped++
      } else {
        console.error(`${tag} ✗ ${targetPath} — ${result.reason}`)
        log.push({ filename: entry.filename, foodId, targetPath, status: 'failed', error: result.reason })
        summary.failed++
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error(`${tag} ✗ ${targetPath} — ${msg}`)
      log.push({ filename: entry.filename, foodId, targetPath, status: 'failed', error: msg })
      summary.failed++
    }
  }
}

writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + '\n')

console.log('\n=== Phase C 결과 ===')
console.log(JSON.stringify(summary, null, 2))
console.log(`Log: ${LOG_PATH}`)
if (DRY_RUN) console.log('\n[hint] dry-run 결과 OK 면 --dry-run 빼고 재실행')
else console.log('\n[next] data/dupe-upload-log.json 검토 후 운영자에게 결과 보고 → Phase AD')
