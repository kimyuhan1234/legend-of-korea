/**
 * Phase AD — Supabase Storage food-images/hansik/* 일괄 삭제 (dead AI 이미지).
 *
 * 배경
 *   Phase AD 의 rebuild-food-dupes-images.mjs 가 모든 hansik URL 을
 *   dupe URL 또는 빈 string 으로 교체. 즉 hansik/ 의 81 webp 는 dead 데이터.
 *
 * 모드
 *   --dry-run: list 만 출력, 삭제 X
 *   기본:      list + 일괄 삭제
 *
 * 환경변수 (필수)
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *
 * 실행
 *   PowerShell:
 *     # 환경변수 export 후
 *     node scripts/delete-hansik-images.mjs --dry-run
 *     # 검토 후 실 삭제
 *     node scripts/delete-hansik-images.mjs
 *
 * 안전장치
 *   - dry-run 권장 (먼저 실행해 list 확인)
 *   - hansik/ 외 prefix 는 절대 손대지 X
 *   - 삭제 결과 data/hansik-delete-log.json 산출
 */

import { writeFileSync } from 'node:fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'food-images'
const PREFIX = 'hansik'
const LOG_PATH = 'data/hansik-delete-log.json'

const DRY_RUN = process.argv.includes('--dry-run')

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('[error] 환경변수 부재 — NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  console.error('  PowerShell: Get-Content .env.local | ForEach-Object { if ($_ -match "^([^#=]+)=(.*)$") { Set-Item "env:$($matches[1])" $matches[2] } }')
  process.exit(1)
}

const headers = {
  Authorization: `Bearer ${SERVICE_ROLE}`,
  apikey: SERVICE_ROLE,
  'Content-Type': 'application/json',
}

// ─────────────────────────────────────────────────────────────
// 1. hansik/ 폴더 list
// ─────────────────────────────────────────────────────────────

async function listHansikFiles() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ prefix: PREFIX, limit: 1000, sortBy: { column: 'name', order: 'asc' } }),
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`list HTTP ${res.status}: ${txt.slice(0, 200)}`)
  }
  const items = await res.json()
  // 폴더 entry (id null) 제외, 실 파일만
  return items
    .filter((x) => x && x.name && (x.id || x.metadata?.size))
    .map((x) => `${PREFIX}/${x.name}`)
}

// ─────────────────────────────────────────────────────────────
// 2. batch 삭제
// ─────────────────────────────────────────────────────────────

async function deleteBatch(paths) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ prefixes: paths }),
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`delete HTTP ${res.status}: ${txt.slice(0, 200)}`)
  }
  return res.json()
}

// ─────────────────────────────────────────────────────────────
// 메인
// ─────────────────────────────────────────────────────────────

console.log(`[mode] ${DRY_RUN ? 'DRY RUN (list 만)' : '실 삭제'}`)
console.log(`[target] ${BUCKET}/${PREFIX}/*`)

let files
try {
  files = await listHansikFiles()
} catch (e) {
  console.error(`[error] list 실패: ${e.message}`)
  process.exit(1)
}

console.log(`\n[list] hansik/ 파일 수: ${files.length}`)
files.slice(0, 10).forEach((f) => console.log(`  - ${f}`))
if (files.length > 10) console.log(`  ... 외 ${files.length - 10}`)

if (files.length === 0) {
  console.log('\n[no-op] 삭제 대상 없음')
  process.exit(0)
}

if (DRY_RUN) {
  writeFileSync(LOG_PATH, JSON.stringify({ mode: 'dry_run', files }, null, 2) + '\n')
  console.log(`\n[hint] dry-run 검토 후 --dry-run 빼고 재실행`)
  console.log(`Log: ${LOG_PATH}`)
  process.exit(0)
}

// 실 삭제
console.log(`\n[delete] ${files.length} 파일 일괄 삭제 시도...`)
try {
  const result = await deleteBatch(files)
  writeFileSync(LOG_PATH, JSON.stringify({ mode: 'delete', files, result }, null, 2) + '\n')
  console.log(`✓ 삭제 완료: ${files.length} 파일`)
  console.log(`Log: ${LOG_PATH}`)
} catch (e) {
  console.error(`✗ 삭제 실패: ${e.message}`)
  writeFileSync(LOG_PATH, JSON.stringify({ mode: 'delete', files, error: e.message }, null, 2) + '\n')
  process.exit(1)
}
