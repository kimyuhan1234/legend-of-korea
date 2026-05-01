/**
 * Phase AD — food-dupes.ts 의 image 필드 일괄 재계산.
 *
 * 우선순위 (D-1):
 *   1순위 dupe — 매핑표 selected 에 있는 foodId → /food-images/dupe/{id}.jpeg
 *   2순위 phoko — 매핑 없으면 phoko 그대로 유지
 *   3순위 hansik — hansik 였는데 매핑 없으면 빈 string (FoodImageWithFallback 이 emoji thumb)
 *
 * 입력
 *   - data/dupe-photos-mapping.json (Phase B/C-fix 후 최종)
 *   - lib/data/food-dupes.ts
 *
 * 출력
 *   - lib/data/food-dupes.ts (in-place, image 필드만 수정)
 *   - data/food-dupes-rebuild-log.json (변경 기록 — 검증용)
 *
 * 사전 백업 권장:
 *   cp lib/data/food-dupes.ts lib/data/food-dupes.ts.bak4
 *
 * 환경변수
 *   - NEXT_PUBLIC_SUPABASE_URL (dupe URL prefix 생성)
 *
 * 실행: node scripts/rebuild-food-dupes-images.mjs
 * idempotent — 재실행 시 이미 dupe URL 인 entry 는 변경 없음.
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'

const MAPPING_PATH = 'data/dupe-photos-mapping.json'
const DUPES_PATH = 'lib/data/food-dupes.ts'
const LOG_PATH = 'data/food-dupes-rebuild-log.json'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
if (!SUPABASE_URL) {
  console.error('[error] NEXT_PUBLIC_SUPABASE_URL 환경변수 부재')
  console.error('  PowerShell: Get-Content .env.local | ForEach-Object { if ($_ -match "^([^#=]+)=(.*)$") { Set-Item "env:$($matches[1])" $matches[2] } }')
  process.exit(1)
}

if (!existsSync(MAPPING_PATH) || !existsSync(DUPES_PATH)) {
  console.error('[error] 입력 파일 부재 (mapping 또는 food-dupes)')
  process.exit(1)
}

const DUPE_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/food-images/dupe`

// ─────────────────────────────────────────────────────────────
// 1. 매핑표에서 dupe 적용 대상 unique foodId
// ─────────────────────────────────────────────────────────────

const mapping = JSON.parse(readFileSync(MAPPING_PATH, 'utf8'))
const dupeFoodIds = new Set()
for (const entry of mapping) {
  if (entry.status === 'matched' && Array.isArray(entry.selected)) {
    entry.selected.forEach((id) => dupeFoodIds.add(id))
  }
}
console.log(`[load] dupe 적용 대상 (매핑표): ${dupeFoodIds.size}`)

// 자동 백업 — 기존 .bak{N} 다음 인덱스
let bakIdx = 0
while (existsSync(`${DUPES_PATH}.bak${bakIdx === 0 ? '' : bakIdx}`)) bakIdx++
const BAK = `${DUPES_PATH}.bak${bakIdx === 0 ? '' : bakIdx}`
copyFileSync(DUPES_PATH, BAK)
console.log(`[backup] ${BAK}`)

// ─────────────────────────────────────────────────────────────
// 2. food-dupes.ts 의 음식 entry 별 image 재계산
// ─────────────────────────────────────────────────────────────

let source = readFileSync(DUPES_PATH, 'utf8')

const stats = {
  to_dupe_from_hansik: 0,
  to_dupe_from_phoko: 0,
  to_dupe_from_empty: 0,
  preserved_phoko: 0,
  preserved_dupe: 0,
  to_empty_from_hansik: 0,
  unchanged_other: 0,
}
const log = []

// id "..." 다음 첫 image: "..." 매칭 (음식 entry 단위, lazy)
// dupes 안 외국 음식은 image 필드 없으니 안전.
source = source.replace(
  /id:\s*"([\w-]+)",([\s\S]*?)image:\s*"([^"]*)"/g,
  (match, foodId, between, currentImage) => {
    const isHansik = currentImage.includes('/hansik/')
    const isPhoko = currentImage.includes('/phoko/')
    const isDupe = currentImage.includes('/dupe/')
    const isEmpty = currentImage === ''

    let newImage = currentImage
    let reason = 'unchanged'

    if (dupeFoodIds.has(foodId)) {
      newImage = `${DUPE_PREFIX}/${foodId}.jpeg`
      if (newImage === currentImage) {
        reason = 'preserved_dupe'
        stats.preserved_dupe++
      } else if (isHansik) {
        reason = 'to_dupe_from_hansik'
        stats.to_dupe_from_hansik++
      } else if (isPhoko) {
        reason = 'to_dupe_from_phoko'
        stats.to_dupe_from_phoko++
      } else if (isEmpty) {
        reason = 'to_dupe_from_empty'
        stats.to_dupe_from_empty++
      } else {
        reason = 'to_dupe_from_other'
        stats.unchanged_other++
      }
    } else if (isPhoko) {
      // 매핑 없음 + 현재 phoko → 그대로 유지
      newImage = currentImage
      reason = 'preserved_phoko'
      stats.preserved_phoko++
    } else if (isHansik) {
      // 매핑 없음 + 현재 hansik → 폐기 (빈 string)
      newImage = ''
      reason = 'to_empty_from_hansik'
      stats.to_empty_from_hansik++
    } else {
      // 그 외 (이미 빈 string, 기타 URL) — 그대로
      newImage = currentImage
      reason = 'unchanged_other'
      stats.unchanged_other++
    }

    if (newImage !== currentImage) {
      log.push({ foodId, before: currentImage, after: newImage, reason })
    }

    return `id: "${foodId}",${between}image: "${newImage}"`
  },
)

writeFileSync(DUPES_PATH, source)
writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + '\n')

// ─────────────────────────────────────────────────────────────
// 3. 결과 출력
// ─────────────────────────────────────────────────────────────

const totalDupe =
  stats.to_dupe_from_hansik +
  stats.to_dupe_from_phoko +
  stats.to_dupe_from_empty +
  stats.preserved_dupe
const totalChanged = log.length
const total =
  totalDupe +
  stats.preserved_phoko +
  stats.to_empty_from_hansik +
  stats.unchanged_other

console.log('\n=== Phase AD 결과 ===')
console.log(`총 음식:                ${total}`)
console.log(`dupe URL 적용:          ${totalDupe}`)
console.log(`  - hansik → dupe:      ${stats.to_dupe_from_hansik}`)
console.log(`  - phoko → dupe:       ${stats.to_dupe_from_phoko}`)
console.log(`  - empty → dupe:       ${stats.to_dupe_from_empty}`)
console.log(`  - 이미 dupe:          ${stats.preserved_dupe}`)
console.log(`phoko 보존:             ${stats.preserved_phoko}`)
console.log(`hansik 폐기 → empty:    ${stats.to_empty_from_hansik}`)
console.log(`기타 unchanged:         ${stats.unchanged_other}`)
console.log(`\nchanged entries:        ${totalChanged}`)
console.log(`Output: ${DUPES_PATH}`)
console.log(`Log:    ${LOG_PATH}`)
console.log(`복원:   cp ${BAK} ${DUPES_PATH}`)
