/**
 * Phase 7 Step 4 — region-corrections.json 일괄 적용.
 *
 * 입력
 *   - data/region-corrections.json (사용자가 draft 검증 후 작성)
 *   - lib/data/food-dupes.ts
 *   - lib/data/regions-hierarchy.ts
 *
 * 출력
 *   - lib/data/food-dupes.ts (수정)
 *   - lib/data/regions-hierarchy.ts (national / 신규 광역 entry 추가)
 *   - lib/data/food-dupes.ts.bak (백업)
 *   - lib/data/regions-hierarchy.ts.bak (백업)
 *   - data/id-changes.json (Step 5 Supabase rename 용)
 *
 * 동작
 *   1. corrections 순회
 *      - delete:true → outer region foods 에서 해당 객체 제거
 *      - newRegion (+ optional newId) → 객체 추출 → 내부 id/region 치환 → 신규 outer region foods 끝에 삽입 → 원본 제거
 *   2. 신규 outer region (예: national) 미존재 시 regions[] 끝에 추가 (ko/ja/en, foods:[])
 *   3. regions-hierarchy.ts 에 신규 광역 (national 등) ProvinceItem 부재 시 추가
 *   4. id-changes.json 출력 (oldId → newId 매핑)
 *
 * 안전장치
 *   - food-dupes.ts.bak / regions-hierarchy.ts.bak 백업 (실패 시 복원)
 *   - 객체 boundary 추출은 balanced-brace + 문자열 escape 처리
 *   - 모든 newRegion 이 outer regions[] 에 존재하는지 사후 검증
 *   - newId 중복 검사
 *
 * 실행: node scripts/apply-region-corrections.mjs
 *
 * 다음 단계
 *   - npx tsc --noEmit
 *   - pnpm lint
 *   - pnpm build
 *   - Step 5 — rename-supabase-images.mjs (id-changes.json 입력)
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'

const CORRECTIONS_PATH = 'data/region-corrections.json'
const DUPES_PATH = 'lib/data/food-dupes.ts'
const HIERARCHY_PATH = 'lib/data/regions-hierarchy.ts'
const ID_CHANGES_PATH = 'data/id-changes.json'

if (!existsSync(CORRECTIONS_PATH)) {
  console.error(`[error] ${CORRECTIONS_PATH} 부재.`)
  console.error(`사용자가 region-corrections.draft.json 을 검토 + 검증 후`)
  console.error(`region-corrections.json 으로 rename + audit_hints 중 향토만 수동 추가해야 합니다.`)
  console.error(``)
  console.error(`임시 시험: cp data/region-corrections.draft.json data/region-corrections.json`)
  console.error(`(audit_hints 미반영 — 19 개 자동 항목만 적용됨)`)
  process.exit(1)
}

const correctionsDoc = JSON.parse(readFileSync(CORRECTIONS_PATH, 'utf8'))
const corrections = correctionsDoc.corrections || correctionsDoc // 메타 wrapper 유연 대응

if (!corrections || Object.keys(corrections).length === 0) {
  console.error(`[error] corrections 비어있음. 작업 없음.`)
  process.exit(1)
}

// ─────────────────────────────────────────────────────────────
// 백업
// ─────────────────────────────────────────────────────────────

copyFileSync(DUPES_PATH, DUPES_PATH + '.bak')
copyFileSync(HIERARCHY_PATH, HIERARCHY_PATH + '.bak')
console.log(`[backup] ${DUPES_PATH}.bak, ${HIERARCHY_PATH}.bak 생성`)

let dupesSrc = readFileSync(DUPES_PATH, 'utf8')
let hierarchySrc = readFileSync(HIERARCHY_PATH, 'utf8')

// ─────────────────────────────────────────────────────────────
// food-dupes.ts 객체 boundary 추출 (balanced-brace + 문자열 escape)
// ─────────────────────────────────────────────────────────────

/**
 * id: "X" 위치 기준 음식 객체의 [openBrace, afterCloseBrace) 범위를 찾는다.
 * 문자열 리터럴 안의 { } 는 무시한다.
 */
function findFoodObjectRange(src, id) {
  const idRe = new RegExp(`id:\\s*["']${escapeRegex(id)}["']`)
  const m = idRe.exec(src)
  if (!m) return null

  // 해당 id 의 부모 객체 시작 '{' 찾기 — 뒤로 거슬러 올라가며 첫 번째 '{' (균형 외).
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

  // openIdx 부터 균형 잡힌 '}' 찾기 (문자열 리터럴 skip)
  depth = 0
  let closeIdx = -1
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i]
    if (c === '"' || c === "'") {
      const quote = c
      i++
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\\') i++
        i++
      }
      continue
    }
    if (c === '`') {
      // template literal — escape 처리
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

  // 닫는 '}' 직후 ',' 도 포함 (foods 배열 사이의 trailing comma)
  let endIdx = closeIdx + 1
  if (src[endIdx] === ',') endIdx++
  // 그 뒤 newline + indent 까지 흡수 (깔끔한 제거)
  while (endIdx < src.length && /[ \t\r\n]/.test(src[endIdx]) && src[endIdx] !== '\n') endIdx++
  if (src[endIdx] === '\n') endIdx++
  // 객체 시작 직전 leading whitespace 흡수
  let startIdx = openIdx
  while (startIdx > 0 && /[ \t]/.test(src[startIdx - 1])) startIdx--

  return { startIdx, endIdx, openIdx, closeIdx, text: src.slice(startIdx, endIdx) }
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * outer region (`code: "X"` 가 들어있는 region 객체) 의 foods 배열 끝 `]` 위치를 찾는다.
 * 신규 음식 객체를 그 직전에 삽입하기 위한 위치.
 */
function findOuterRegionFoodsArrayEnd(src, regionCode) {
  const codeRe = new RegExp(`code:\\s*["']${escapeRegex(regionCode)}["']`)
  const cm = codeRe.exec(src)
  if (!cm) return null
  // 해당 region 객체 안에서 첫 'foods: [' 찾기
  const foodsRe = /foods:\s*\[/g
  foodsRe.lastIndex = cm.index
  const fm = foodsRe.exec(src)
  if (!fm) return null
  // foods: [ 다음의 균형 잡힌 ']' 찾기 (문자열 / 객체 skip)
  let i = fm.index + fm[0].length
  let depth = 1
  while (i < src.length && depth > 0) {
    const c = src[i]
    if (c === '"' || c === "'") {
      const quote = c
      i++
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\\') i++
        i++
      }
      i++
      continue
    }
    if (c === '`') {
      i++
      while (i < src.length && src[i] !== '`') {
        if (src[i] === '\\') i++
        i++
      }
      i++
      continue
    }
    if (c === '[') depth++
    else if (c === ']') {
      depth--
      if (depth === 0) return i // ] 위치
    }
    i++
  }
  return null
}

/**
 * 음식 객체 텍스트 안의 inner field (id, region) 치환.
 */
function replaceInnerFields(objText, { newId, newRegion }) {
  let out = objText
  if (newId) {
    out = out.replace(/(\bid:\s*)["'][^"']+["']/, `$1"${newId}"`)
  }
  if (newRegion) {
    out = out.replace(/(\bregion:\s*)["'][^"']+["']/, `$1"${newRegion}"`)
  }
  return out
}

// ─────────────────────────────────────────────────────────────
// 신규 outer region entry 생성 (food-dupes.ts 용)
// ─────────────────────────────────────────────────────────────

const NEW_OUTER_REGIONS = {
  national: {
    code: 'national',
    name: { ko: '전국 (한국 전통)', ja: '全国（韓国伝統）', en: 'Nationwide (Korean Traditional)' },
    icon: '🇰🇷',
    image: '/images/village/national.jpg',
    description: {
      ko: '특정 지역에 국한되지 않은, 한국 전역에서 사랑받는 한식.',
      ja: '特定の地域に限定されない、韓国全域で愛される韓食。',
      en: 'Korean dishes loved nationwide, not tied to a specific region.',
    },
  },
  // 신규 광역이 더 있으면 여기 추가
}

function buildOuterRegionEntry(regionCode) {
  const meta = NEW_OUTER_REGIONS[regionCode]
  if (!meta) return null
  return `  {
    code: "${meta.code}",
    name: { ko: "${meta.name.ko}", ja: "${meta.name.ja}", en: "${meta.name.en}" },
    icon: "${meta.icon}",
    image: "${meta.image}",
    description: {
      ko: "${meta.description.ko}",
      ja: "${meta.description.ja}",
      en: "${meta.description.en}"
    },
    foods: []
  },
`
}

// ─────────────────────────────────────────────────────────────
// regions-hierarchy.ts 신규 ProvinceItem
// ─────────────────────────────────────────────────────────────

const NEW_HIERARCHY_PROVINCES = {
  national: `  {
    id: 'national',
    name: { ko: '🇰🇷 전국 (한국 전통)', ja: '🇰🇷 全国 (韓国伝統)', en: '🇰🇷 Nationwide (Korean Traditional)', 'zh-CN': '🇰🇷 全国 (韩国传统)', 'zh-TW': '🇰🇷 全國 (韓國傳統)' },
    emoji: '🇰🇷',
    cities: [
      { id: 'national', name: { ko: '한국 전통', ja: '韓国伝統', en: 'Korean Traditional', 'zh-CN': '韩国传统', 'zh-TW': '韓國傳統' } },
    ],
  },
`,
}

// ─────────────────────────────────────────────────────────────
// Phase 1: corrections 분류
// ─────────────────────────────────────────────────────────────

const toDelete = [] // [{ oldId }]
const toMove = [] // [{ oldId, newId, newRegion }]

const idChanges = []

for (const [oldId, c] of Object.entries(corrections)) {
  if (c.delete) {
    toDelete.push({ oldId })
    continue
  }
  if (!c.newRegion) {
    console.warn(`[warn] ${oldId}: newRegion 없음, skip`)
    continue
  }
  const newId = c.newId || oldId
  toMove.push({ oldId, newId, newRegion: c.newRegion })
  if (newId !== oldId) idChanges.push({ oldId, newId })
}

console.log(`[plan] move=${toMove.length} delete=${toDelete.length} idChanges=${idChanges.length}`)

// ─────────────────────────────────────────────────────────────
// Phase 2: 신규 outer region 사전 추가 (food-dupes.ts)
// ─────────────────────────────────────────────────────────────

const allTargetRegions = new Set(toMove.map((m) => m.newRegion))

const existingOuterRegions = new Set(
  [...dupesSrc.matchAll(/code:\s*["']([\w-]+)["']/g)].map((m) => m[1]),
)

const addedOuterRegions = []
for (const r of allTargetRegions) {
  if (existingOuterRegions.has(r)) continue
  const entry = buildOuterRegionEntry(r)
  if (!entry) {
    console.error(`[error] 신규 outer region "${r}" 의 메타 정보 없음 — NEW_OUTER_REGIONS 에 추가 필요.`)
    process.exit(1)
  }
  // regions[] 의 닫는 ']' 직전에 삽입
  const arrayMatch = dupesSrc.match(/export const regions:\s*Region\[\]\s*=\s*\[/)
  if (!arrayMatch) {
    console.error(`[error] regions: Region[] 배열 시작점 못 찾음`)
    process.exit(1)
  }
  // balanced-bracket 으로 ']' 찾기
  let i = arrayMatch.index + arrayMatch[0].length
  let depth = 1
  while (i < dupesSrc.length && depth > 0) {
    const c = dupesSrc[i]
    if (c === '"' || c === "'") {
      const q = c
      i++
      while (i < dupesSrc.length && dupesSrc[i] !== q) {
        if (dupesSrc[i] === '\\') i++
        i++
      }
      i++
      continue
    }
    if (c === '`') {
      i++
      while (i < dupesSrc.length && dupesSrc[i] !== '`') {
        if (dupesSrc[i] === '\\') i++
        i++
      }
      i++
      continue
    }
    if (c === '[') depth++
    else if (c === ']') {
      depth--
      if (depth === 0) break
    }
    i++
  }
  // i 가 regions 배열 닫는 ']' 위치
  dupesSrc = dupesSrc.slice(0, i) + entry + dupesSrc.slice(i)
  addedOuterRegions.push(r)
  console.log(`[outer] 신규 region 추가: ${r}`)
}

// ─────────────────────────────────────────────────────────────
// Phase 3: delete 처리 (이동보다 먼저 — index 변동 최소화)
// ─────────────────────────────────────────────────────────────

let deleteCount = 0
for (const { oldId } of toDelete) {
  const range = findFoodObjectRange(dupesSrc, oldId)
  if (!range) {
    console.warn(`[warn] delete: ${oldId} 찾을 수 없음 — skip`)
    continue
  }
  dupesSrc = dupesSrc.slice(0, range.startIdx) + dupesSrc.slice(range.endIdx)
  deleteCount++
  console.log(`✗ delete: ${oldId}`)
}

// ─────────────────────────────────────────────────────────────
// Phase 4: move 처리 (객체 추출 → 새 outer region 으로 삽입 → 원본 제거)
// ─────────────────────────────────────────────────────────────

let moveCount = 0
for (const { oldId, newId, newRegion } of toMove) {
  const range = findFoodObjectRange(dupesSrc, oldId)
  if (!range) {
    console.warn(`[warn] move: ${oldId} 찾을 수 없음 — skip`)
    continue
  }
  // 객체 텍스트 추출 + inner field 치환
  let objText = dupesSrc.slice(range.openIdx, range.closeIdx + 1)
  objText = replaceInnerFields(objText, { newId, newRegion })

  // 원본 제거 (range 전체 — leading indent + trailing comma 포함)
  const removed = dupesSrc.slice(0, range.startIdx) + dupesSrc.slice(range.endIdx)

  // 새 outer region foods 배열의 닫는 ']' 위치 찾기
  const insertEnd = findOuterRegionFoodsArrayEnd(removed, newRegion)
  if (insertEnd === null) {
    console.error(`[error] move: outer region "${newRegion}" 의 foods[] 못 찾음 (oldId=${oldId})`)
    process.exit(1)
  }

  // 삽입 텍스트 구성: 한 칸 들여쓰기 + 객체 + ',' + '\n      '
  // ']' 직전에 삽입. 직전 char 가 '\n' + spaces 면 들여쓰기 맞춰서.
  const insertText = `      ${objText.replace(/\n/g, '\n      ')},\n    `
  // ']' 직전에 끼워 넣기 — 단 빈 배열 케이스 (foods: []) 도 동작
  const before = removed.slice(0, insertEnd)
  const after = removed.slice(insertEnd)
  // 깔끔한 indent — 직전 char 들이 '[' 직후의 공백이면 앞 공백 정리
  let final = before
  // 빈 배열 케이스 ('foods: []' → before 가 'foods: [') — 들여쓰기 보정
  // 단순히 그대로 끼워 넣고 prettier 가 정리하도록 (테스트에서 검증)
  final += insertText + after
  dupesSrc = final
  moveCount++
  const idTag = newId !== oldId ? `${oldId} → ${newId}` : oldId
  console.log(`✓ move: ${idTag} → region=${newRegion}`)
}

// ─────────────────────────────────────────────────────────────
// Phase 5: regions-hierarchy.ts 신규 광역 추가
// ─────────────────────────────────────────────────────────────

const existingHierarchyIds = new Set(
  [...hierarchySrc.matchAll(/^\s+id:\s*['"]([\w-]+)['"]/gm)].map((m) => m[1]),
)

const addedHierarchyProvinces = []
for (const r of allTargetRegions) {
  if (existingHierarchyIds.has(r)) continue
  const entry = NEW_HIERARCHY_PROVINCES[r]
  if (!entry) {
    console.warn(`[warn] hierarchy: "${r}" 의 ProvinceItem 미정의 — 수동 추가 필요`)
    continue
  }
  // PROVINCES 배열 닫는 ']' 직전 삽입
  const arrayMatch = hierarchySrc.match(/export const PROVINCES:\s*ProvinceItem\[\]\s*=\s*\[/)
  if (!arrayMatch) {
    console.error(`[error] regions-hierarchy.ts 의 PROVINCES 배열 시작점 못 찾음`)
    process.exit(1)
  }
  let i = arrayMatch.index + arrayMatch[0].length
  let depth = 1
  while (i < hierarchySrc.length && depth > 0) {
    const c = hierarchySrc[i]
    if (c === '"' || c === "'") {
      const q = c
      i++
      while (i < hierarchySrc.length && hierarchySrc[i] !== q) {
        if (hierarchySrc[i] === '\\') i++
        i++
      }
      i++
      continue
    }
    if (c === '`') {
      i++
      while (i < hierarchySrc.length && hierarchySrc[i] !== '`') {
        if (hierarchySrc[i] === '\\') i++
        i++
      }
      i++
      continue
    }
    if (c === '[') depth++
    else if (c === ']') {
      depth--
      if (depth === 0) break
    }
    i++
  }
  hierarchySrc = hierarchySrc.slice(0, i) + entry + hierarchySrc.slice(i)
  addedHierarchyProvinces.push(r)
  console.log(`[hierarchy] 신규 ProvinceItem 추가: ${r}`)
}

// ─────────────────────────────────────────────────────────────
// Phase 6: 사후 검증
// ─────────────────────────────────────────────────────────────

// newId 중복 검사
const allIds = [...dupesSrc.matchAll(/\bid:\s*["']([\w-]+)["']/g)].map((m) => m[1])
const idCounts = {}
for (const id of allIds) idCounts[id] = (idCounts[id] || 0) + 1
const dupIds = Object.entries(idCounts).filter(([, n]) => n > 1)
if (dupIds.length > 0) {
  console.error(`[error] 중복 id 발견:`)
  for (const [id, n] of dupIds) console.error(`  ${id}: ${n}회`)
  console.error(`백업 파일로 복원 후 재시도: cp ${DUPES_PATH}.bak ${DUPES_PATH}`)
  process.exit(1)
}

// 모든 newRegion 이 outer regions 에 존재하는지 확인
const finalOuterRegions = new Set(
  [...dupesSrc.matchAll(/code:\s*["']([\w-]+)["']/g)].map((m) => m[1]),
)
for (const r of allTargetRegions) {
  if (!finalOuterRegions.has(r)) {
    console.error(`[error] outer region "${r}" 추가 실패`)
    process.exit(1)
  }
}

// ─────────────────────────────────────────────────────────────
// Phase 7: 파일 쓰기
// ─────────────────────────────────────────────────────────────

writeFileSync(DUPES_PATH, dupesSrc)
writeFileSync(HIERARCHY_PATH, hierarchySrc)
writeFileSync(ID_CHANGES_PATH, JSON.stringify(idChanges, null, 2) + '\n')

// ─────────────────────────────────────────────────────────────
// 요약
// ─────────────────────────────────────────────────────────────

console.log(`\n=== Phase 7 Step 4 적용 결과 ===`)
console.log(`적용된 corrections: ${moveCount + deleteCount}`)
console.log(`  region 변경: ${moveCount}`)
console.log(`  delete    : ${deleteCount}`)
console.log(`ID 변경     : ${idChanges.length} → ${ID_CHANGES_PATH}`)
console.log(`신규 outer region: ${addedOuterRegions.length} (${addedOuterRegions.join(', ') || '-'})`)
console.log(`신규 광역(hierarchy): ${addedHierarchyProvinces.length} (${addedHierarchyProvinces.join(', ') || '-'})`)
console.log(`\n다음 단계`)
console.log(`  1. npx tsc --noEmit`)
console.log(`  2. pnpm lint`)
console.log(`  3. pnpm build`)
console.log(`  4. Step 5 — Supabase 이미지 rename (id-changes.json 입력)`)
console.log(`\n실패 시 복원: cp ${DUPES_PATH}.bak ${DUPES_PATH}; cp ${HIERARCHY_PATH}.bak ${HIERARCHY_PATH}`)
