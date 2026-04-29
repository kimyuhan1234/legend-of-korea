/**
 * Phase 7 Step 5 — Supabase Storage 이미지 rename + food-dupes.ts URL 갱신.
 *
 * 입력
 *   - data/id-changes.json — [{ oldId, newId }, ...] (apply-region-corrections.mjs 산출)
 *   - lib/data/food-dupes.ts (rename 후 image URL patch)
 *
 * 동작
 *   1. dry-run (기본) — Supabase 의 oldId.{webp,jpg} 존재 확인 + 계획만 출력
 *   2. --execute 플래그 시 실제 rename:
 *      - download oldPath → upload newPath (upsert) → delete oldPath
 *      - 성공 항목만 food-dupes.ts 의 URL 패치 (oldId.webp → newId.webp)
 *   3. 결과: data/rename-log.json — 성공/실패 기록
 *
 * 안전장치
 *   - dry-run 기본 — 실제 변경 X
 *   - 확장자 자동 감지 (.webp / .jpg)
 *   - 실패 항목은 URL 패치 안 함 (broken image 방지)
 *   - food-dupes.ts.bak 백업 (실 모드 시)
 *
 * 환경변수
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *
 * 실행
 *   dry-run:  node scripts/rename-supabase-images.mjs
 *   실 적용:  node scripts/rename-supabase-images.mjs --execute
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'

const ID_CHANGES_PATH = 'data/id-changes.json'
const DUPES_PATH = 'lib/data/food-dupes.ts'
const LOG_PATH = 'data/rename-log.json'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'food-images'
const PREFIX = 'hansik'

const EXECUTE = process.argv.includes('--execute')

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('[error] NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수 부재.')
  console.error('  bash:        export $(grep -v "^#" .env.local | xargs)')
  console.error('  PowerShell:  Get-Content .env.local | ForEach-Object { if ($_ -match "^([^#=]+)=(.*)$") { Set-Item "env:$($matches[1])" $matches[2] } }')
  process.exit(1)
}

if (!existsSync(ID_CHANGES_PATH)) {
  console.error(`[error] ${ID_CHANGES_PATH} 부재. 먼저 apply-region-corrections.mjs 실행.`)
  process.exit(1)
}

const idChanges = JSON.parse(readFileSync(ID_CHANGES_PATH, 'utf8'))
console.log(`[load] id changes: ${idChanges.length}`)
console.log(`[mode] ${EXECUTE ? '⚠ 실 적용 (rename + URL patch)' : 'dry-run (변경 없음)'}`)

// ─────────────────────────────────────────────────────────────
// Supabase Storage helpers (REST API — npm dep 없이)
// ─────────────────────────────────────────────────────────────

async function headObject(path) {
  const url = `${SUPABASE_URL}/storage/v1/object/info/${BUCKET}/${path}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SERVICE_ROLE}`, apikey: SERVICE_ROLE },
  })
  return res.ok
}

async function downloadObject(path) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SERVICE_ROLE}`, apikey: SERVICE_ROLE },
  })
  if (!res.ok) return null
  return await res.arrayBuffer()
}

async function uploadObject(path, buffer, contentType) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE}`,
      apikey: SERVICE_ROLE,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: buffer,
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`)
  }
}

async function deleteObject(path) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${SERVICE_ROLE}`, apikey: SERVICE_ROLE },
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`)
  }
}

// ─────────────────────────────────────────────────────────────
// 확장자 감지 — .webp 우선, .jpg fallback
// ─────────────────────────────────────────────────────────────

async function detectExtension(id) {
  for (const ext of ['webp', 'jpg', 'jpeg']) {
    if (await headObject(`${PREFIX}/${id}.${ext}`)) return ext
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// 메인 루프
// ─────────────────────────────────────────────────────────────

const log = { success: [], skipped: [], failed: [] }

for (let i = 0; i < idChanges.length; i++) {
  const { oldId, newId } = idChanges[i]
  const tag = `[${i + 1}/${idChanges.length}] ${oldId} → ${newId}`

  const ext = await detectExtension(oldId)
  if (!ext) {
    console.log(`${tag} — Supabase 부재 (skip)`)
    log.skipped.push({ oldId, newId, reason: 'source not found' })
    continue
  }

  const oldPath = `${PREFIX}/${oldId}.${ext}`
  const newPath = `${PREFIX}/${newId}.${ext}`
  const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/webp'

  if (!EXECUTE) {
    console.log(`${tag} — dry-run: ${oldPath} → ${newPath}`)
    log.success.push({ oldId, newId, ext, dry: true })
    continue
  }

  try {
    const buf = await downloadObject(oldPath)
    if (!buf) throw new Error('download failed')
    await uploadObject(newPath, Buffer.from(buf), contentType)
    await deleteObject(oldPath)
    console.log(`${tag} ✓ (${ext}, ${(buf.byteLength / 1024).toFixed(0)}KB)`)
    log.success.push({ oldId, newId, ext })
  } catch (e) {
    console.error(`${tag} ✗ ${e instanceof Error ? e.message : String(e)}`)
    log.failed.push({ oldId, newId, ext, error: String(e) })
  }
}

writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + '\n')

// ─────────────────────────────────────────────────────────────
// food-dupes.ts URL patch (성공 항목만)
// ─────────────────────────────────────────────────────────────

if (EXECUTE && log.success.length > 0) {
  copyFileSync(DUPES_PATH, DUPES_PATH + '.bak')
  let dupesSrc = readFileSync(DUPES_PATH, 'utf8')
  let patched = 0
  for (const { oldId, newId, ext } of log.success) {
    const oldFn = `${oldId}.${ext}`
    const newFn = `${newId}.${ext}`
    const re = new RegExp(`/hansik/${oldId}\\.${ext}`, 'g')
    const before = dupesSrc
    dupesSrc = dupesSrc.replace(re, `/hansik/${newFn}`)
    if (before !== dupesSrc) patched++
  }
  writeFileSync(DUPES_PATH, dupesSrc)
  console.log(`\n[url-patch] food-dupes.ts URL 갱신: ${patched}건`)
}

// ─────────────────────────────────────────────────────────────
// 요약
// ─────────────────────────────────────────────────────────────

console.log(`\n=== Phase 7 Step 5 결과 ===`)
console.log(`성공 : ${log.success.length}`)
console.log(`스킵 : ${log.skipped.length} (Supabase 부재)`)
console.log(`실패 : ${log.failed.length}`)
console.log(`Log  : ${LOG_PATH}`)

if (!EXECUTE) {
  console.log(`\n실 적용: node scripts/rename-supabase-images.mjs --execute`)
}
