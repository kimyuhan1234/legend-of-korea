/**
 * Phase C-fix — 매핑 충돌 음식 2 건 사진 강제 덮어쓰기.
 *
 * 배경
 *   Phase C 업로드 중 같은 음식 ID 에 여러 사진이 매핑돼서 잘못된 사진이
 *   먼저 업로드된 케이스. 이 스크립트가 올바른 사진으로 강제 덮어쓰기.
 *
 *   - cheonan-makgeolli-ppang: 막걸리.jpeg → 막걸리빵.jpeg
 *   - cheonan-sundae-soup:    순대.jpeg   → 순대국밥.jpeg
 *
 * 동작
 *   - x-upsert: true 강제 덮어쓰기
 *   - 대상 2 건만 hardcoded (다른 사진 영향 X)
 *
 * 환경변수 (필수)
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *
 * 실행: node scripts/fix-dupe-conflicts.mjs
 *
 * 사전 조건: data/dupe-photos-mapping.json 의 selected 에서 잘못된 2 ID
 * (cheonan-makgeolli-ppang / cheonan-sundae-soup) 제거됐어야 함 (Phase C-fix Step 1).
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const PHOTO_DIR = 'C:/Users/ADMIN/Desktop/듀프음식사진'
const BUCKET = 'food-images'
const PREFIX = 'dupe'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('[error] 환경변수 부재 — NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  console.error('  PowerShell: Get-Content .env.local | ForEach-Object { if ($_ -match "^([^#=]+)=(.*)$") { Set-Item "env:$($matches[1])" $matches[2] } }')
  process.exit(1)
}

// 충돌 해결 대상 — { sourceFilename, targetFoodId }
const FIXES = [
  { source: '막걸리빵.jpeg', foodId: 'cheonan-makgeolli-ppang' },
  { source: '순대국밥.jpeg', foodId: 'cheonan-sundae-soup' },
]

async function uploadOne(targetPath, buffer) {
  const endpoint = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${targetPath}`
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
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${targetPath}`
}

let success = 0
let failed = 0

for (let i = 0; i < FIXES.length; i++) {
  const { source, foodId } = FIXES[i]
  const filePath = join(PHOTO_DIR, source)
  const targetPath = `${PREFIX}/${foodId}.jpeg`
  const tag = `[${i + 1}/${FIXES.length}]`

  if (!existsSync(filePath)) {
    console.error(`${tag} ✗ 파일 없음: ${filePath}`)
    failed++
    continue
  }

  try {
    const buf = readFileSync(filePath)
    const url = await uploadOne(targetPath, buf)
    console.log(`${tag} ✓ OVERWRITE ${targetPath}`)
    console.log(`        ← ${source}`)
    console.log(`        URL: ${url}`)
    success++
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(`${tag} ✗ ${targetPath} — ${msg}`)
    failed++
  }
}

console.log('\n=== Phase C-fix 결과 ===')
console.log(`uploaded (overwrite): ${success}`)
console.log(`failed: ${failed}`)
if (failed === 0) {
  console.log('\n[next] 운영자가 브라우저에서 (강한 새로고침 / 다른 시크릿창) 확인 후 Phase AD 진행.')
}
