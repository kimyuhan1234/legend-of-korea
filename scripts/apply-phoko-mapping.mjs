/**
 * Phase 6.7 Step 2 — phoko-mapping.draft.json 일괄 적용.
 *
 * 입력
 *   - data/phoko-mapping.draft.json
 *   - data/phoko-images/{원본 파일명}.jpg
 *   - lib/data/food-dupes.ts
 *
 * 출력
 *   - Supabase Storage food-images/phoko/{food-id}.jpg (158 개)
 *   - lib/data/food-dupes.ts (mapping 음식만 image / imageCredit patch)
 *   - data/phoko-apply-log.json (성공/실패 로그)
 *
 * 핵심 — 보존 정책 강제
 *   - mapping 안 된 음식 (81 개) 의 image URL 절대 변경 X
 *   - 사후 검증 — 81 음식의 image 가 .bak 와 동일한지 비교 (불일치 시 즉시 exit)
 *
 * 모드
 *   dry-run (기본): 계획만 출력 (Supabase / food-dupes.ts 변경 X)
 *   --execute     : 실 적용 (백업 + 업로드 + patch + 검증)
 *
 * 환경변수 (--execute 시 필수)
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *
 * 실행
 *   dry-run:  node scripts/apply-phoko-mapping.mjs
 *   실 적용:  node scripts/apply-phoko-mapping.mjs --execute
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'

const MAPPING_PATH = 'data/phoko-mapping.draft.json'
const PHOKO_IMAGES_DIR = 'data/phoko-images'
const DUPES_PATH = 'lib/data/food-dupes.ts'
const LOG_PATH = 'data/phoko-apply-log.json'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'food-images'
const PREFIX = 'phoko'

const EXECUTE = process.argv.includes('--execute')

// ─────────────────────────────────────────────────────────────
// 입력 검증
// ─────────────────────────────────────────────────────────────

if (!existsSync(MAPPING_PATH)) {
  console.error(`[error] ${MAPPING_PATH} 부재. 먼저 generate-phoko-mapping.mjs 실행.`)
  process.exit(1)
}

if (EXECUTE) {
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('[error] --execute 모드 — NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수 필요.')
    console.error('  PowerShell:  Get-Content .env.local | ForEach-Object { if ($_ -match "^([^#=]+)=(.*)$") { Set-Item "env:$($matches[1])" $matches[2] } }')
    process.exit(1)
  }
  if (!existsSync(PHOKO_IMAGES_DIR)) {
    console.error(`[error] --execute 모드 — ${PHOKO_IMAGES_DIR} 부재 (원본 jpg 있어야 업로드 가능).`)
    process.exit(1)
  }
}

const mappingDoc = JSON.parse(readFileSync(MAPPING_PATH, 'utf8'))
const mappings = mappingDoc.mappings || {}
const unmatchedFoodIds = (mappingDoc.unmatched_food_ids || []).map((f) => f.id)

const totalFiles = Object.keys(mappings).length
const totalMatches = Object.values(mappings).reduce((acc, m) => acc + m.matches.length, 0)

console.log(`[load] mapping files: ${totalFiles}, total food matches: ${totalMatches}`)
console.log(`[load] unmatched (보존 대상): ${unmatchedFoodIds.length}`)
console.log(`[mode] ${EXECUTE ? '⚠ 실 적용 (Supabase 업로드 + food-dupes.ts patch)' : 'dry-run (변경 없음)'}`)

// ─────────────────────────────────────────────────────────────
// food-dupes.ts 객체 boundary 추출 (apply-region-corrections.mjs 와 동일 로직)
// ─────────────────────────────────────────────────────────────

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findFoodObjectRange(src, id) {
  const idRe = new RegExp(`id:\\s*["']${escapeRegex(id)}["']`)
  const m = idRe.exec(src)
  if (!m) return null
  let depth = 0
  let openIdx = -1
  for (let i = m.index; i >= 0; i--) {
    const c = src[i]
    if (c === '}') depth++
    else if (c === '{') {
      if (depth === 0) {
        openIdx = i
        break
      }
      depth--
    }
  }
  if (openIdx < 0) return null
  depth = 0
  let closeIdx = -1
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i]
    if (c === '"' || c === "'") {
      const q = c
      i++
      while (i < src.length && src[i] !== q) {
        if (src[i] === '\\') i++
        i++
      }
      continue
    }
    if (c === '`') {
      i++
      while (i < src.length && src[i] !== '`') {
        if (src[i] === '\\') i++
        i++
      }
      continue
    }
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) {
        closeIdx = i
        break
      }
    }
  }
  if (closeIdx < 0) return null
  return { openIdx, closeIdx, text: src.slice(openIdx, closeIdx + 1) }
}

function extractImageUrl(objText) {
  const m = objText.match(/image:\s*["']([^"']+)["']/)
  return m ? m[1] : null
}

function extractImageCredit(objText) {
  const m = objText.match(/imageCredit:\s*["']([^"']+)["']/)
  return m ? m[1] : null
}

/**
 * 음식 객체 텍스트 안의 image / imageCredit 필드를 patch.
 * 둘 중 하나라도 없으면 region 다음 라인에 추가.
 */
function patchObjectFields(objText, { image, imageCredit }) {
  let out = objText

  // image — 있으면 교체, 없으면 region 다음에 추가
  if (/\bimage:\s*["'][^"']+["']/.test(out)) {
    out = out.replace(/\bimage:\s*["'][^"']+["']/, `image: "${image}"`)
  } else {
    // region: "..." 라인 직후에 image 추가 (들여쓰기 동일)
    out = out.replace(
      /(\n(\s+)region:\s*["'][^"']+["'],?)/,
      `$1\n$2image: "${image}",`,
    )
  }

  // imageCredit — 있으면 교체, 없으면 image 다음에 추가
  if (/\bimageCredit:\s*["'][^"']+["']/.test(out)) {
    out = out.replace(/\bimageCredit:\s*["'][^"']+["']/, `imageCredit: "${imageCredit}"`)
  } else {
    out = out.replace(
      /(\n(\s+)image:\s*["'][^"']+["'],?)/,
      `$1\n$2imageCredit: "${imageCredit}",`,
    )
  }

  return out
}

// ─────────────────────────────────────────────────────────────
// Supabase Storage REST helpers
// ─────────────────────────────────────────────────────────────

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
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}

// ─────────────────────────────────────────────────────────────
// 처리 — 각 file → matches 순회
// ─────────────────────────────────────────────────────────────

let dupesSrc = readFileSync(DUPES_PATH, 'utf8')
const log = { uploaded: [], patched: [], failed: [], skipped: [] }

if (EXECUTE) {
  copyFileSync(DUPES_PATH, DUPES_PATH + '.bak')
  console.log(`[backup] ${DUPES_PATH}.bak`)
}

let fileIdx = 0
for (const [filename, m] of Object.entries(mappings)) {
  fileIdx++
  const tag = `[${fileIdx}/${totalFiles}] ${m.keyword}`
  const srcPath = join(PHOKO_IMAGES_DIR, filename)

  if (EXECUTE && !existsSync(srcPath)) {
    console.warn(`${tag} ⚠ 원본 부재 (${srcPath}) — 해당 파일의 ${m.matches.length}개 음식 skip`)
    for (const e of m.matches) log.skipped.push({ id: e.id, filename, reason: 'source missing' })
    continue
  }

  const buffer = EXECUTE ? readFileSync(srcPath) : null

  for (const match of m.matches) {
    const path = `${PREFIX}/${match.id}.jpg`
    const publicUrl = `${SUPABASE_URL || 'https://...supabase.co'}/storage/v1/object/public/${BUCKET}/${path}`

    if (!EXECUTE) {
      // dry-run — 계획만
      log.uploaded.push({ id: match.id, name_ko: match.name_ko, filename, dry: true })
      log.patched.push({ id: match.id, image: publicUrl, credit: m.credit, dry: true })
      continue
    }

    // 1. Supabase 업로드
    try {
      const uploadedUrl = await uploadObject(path, buffer, 'image/jpeg')
      log.uploaded.push({ id: match.id, name_ko: match.name_ko, filename, url: uploadedUrl })
    } catch (e) {
      console.error(`${tag} ✗ ${match.id} 업로드 실패: ${e.message}`)
      log.failed.push({ id: match.id, filename, stage: 'upload', error: e.message })
      continue
    }

    // 2. food-dupes.ts patch
    const range = findFoodObjectRange(dupesSrc, match.id)
    if (!range) {
      log.failed.push({ id: match.id, filename, stage: 'patch', error: 'food id not found in food-dupes.ts' })
      continue
    }
    const patched = patchObjectFields(range.text, { image: publicUrl, imageCredit: m.credit })
    dupesSrc = dupesSrc.slice(0, range.openIdx) + patched + dupesSrc.slice(range.closeIdx + 1)
    log.patched.push({ id: match.id, image: publicUrl, credit: m.credit })
  }
  if (fileIdx % 10 === 0) console.log(`  …${fileIdx}/${totalFiles}`)
}

// ─────────────────────────────────────────────────────────────
// food-dupes.ts 쓰기 + 보존 검증
// ─────────────────────────────────────────────────────────────

if (EXECUTE) {
  // 사후 검증 — 보존 정책 강제: unmatched 81 음식의 image URL 이 .bak 와 동일해야
  const bakSrc = readFileSync(DUPES_PATH + '.bak', 'utf8')
  let preservedOK = 0
  const violations = []
  for (const id of unmatchedFoodIds) {
    const beforeRange = findFoodObjectRange(bakSrc, id)
    const afterRange = findFoodObjectRange(dupesSrc, id)
    if (!beforeRange || !afterRange) {
      violations.push({ id, error: 'object not found' })
      continue
    }
    const before = extractImageUrl(beforeRange.text) || ''
    const after = extractImageUrl(afterRange.text) || ''
    const beforeCredit = extractImageCredit(beforeRange.text) || ''
    const afterCredit = extractImageCredit(afterRange.text) || ''
    if (before !== after || beforeCredit !== afterCredit) {
      violations.push({ id, before, after, beforeCredit, afterCredit })
    } else {
      preservedOK++
    }
  }

  if (violations.length > 0) {
    console.error(`\n[CRITICAL] 보존 정책 위반 ${violations.length}건 — 즉시 복원.`)
    for (const v of violations.slice(0, 10)) console.error(`  ${v.id}: ${JSON.stringify(v)}`)
    console.error(`복원: cp ${DUPES_PATH}.bak ${DUPES_PATH}`)
    // 자동 복원
    copyFileSync(DUPES_PATH + '.bak', DUPES_PATH)
    console.error(`✓ 자동 복원 완료. apply 중단.`)
    process.exit(1)
  }

  writeFileSync(DUPES_PATH, dupesSrc)
  console.log(`\n[검증] 보존 정책 통과 — unmatched ${preservedOK}/${unmatchedFoodIds.length} 음식 image/credit 불변`)
}

writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + '\n')

// ─────────────────────────────────────────────────────────────
// 요약
// ─────────────────────────────────────────────────────────────

console.log(`\n=== Phase 6.7 Step 2 결과 ===`)
console.log(`업로드        : ${log.uploaded.length}${EXECUTE ? '' : ' (dry-run, 실제 X)'}`)
console.log(`patch         : ${log.patched.length}${EXECUTE ? '' : ' (dry-run, 실제 X)'}`)
console.log(`skip          : ${log.skipped.length}`)
console.log(`failed        : ${log.failed.length}`)
console.log(`보존 (변경 X) : ${unmatchedFoodIds.length}`)
console.log(`Log           : ${LOG_PATH}`)

if (!EXECUTE) {
  console.log(`\n실 적용:`)
  console.log(`  1. .env.local 환경변수 export`)
  console.log(`  2. node scripts/apply-phoko-mapping.mjs --execute`)
  console.log(`  3. npx tsc --noEmit && pnpm lint && pnpm build`)
} else {
  console.log(`\n다음 단계: npx tsc --noEmit && pnpm lint && pnpm build`)
}
