/**
 * Phase 9 — food-health.ts 일괄 변환 (one-shot).
 *
 * 변경
 *   1. HealthTag union 정리 — heart/hair/eye/energy 제거 → 6 카테고리
 *   2. healthRadar interface — energy → bone 교체
 *   3. 5 음식 객체 통째 삭제 (energy 단독 — UI 에서 어색)
 *   4. 모든 healthRadar 에서 energy:N 제거 + bone:50 default 추가
 *   5. 모든 healthTags 에서 'energy'/'heart'/'hair'/'eye' 제거
 *
 * 백업: lib/data/food-health.ts.bak
 * 실행: node scripts/cleanup-food-health.mjs
 *
 * 재실행 안전 (idempotent) — 이미 변환된 파일 재실행 시 변경 없음.
 */

import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'

const PATH = 'lib/data/food-health.ts'
const REMOVED_FOOD_IDS = [
  'seoul-tteokbokki',
  'busan-hotteok',
  'gyeongju-hwangnam-ppang',
  'icheon-dojagi-bulgogi',
  'sokcho-dakgangjeong',
]
const REMOVED_TAGS = ['energy', 'heart', 'hair', 'eye']

copyFileSync(PATH, PATH + '.bak')
console.log(`[backup] ${PATH}.bak`)

let src = readFileSync(PATH, 'utf8')
const before = src

// ─────────────────────────────────────────────────────────────
// 1. HealthTag union — 6 카테고리 단일 라인
// ─────────────────────────────────────────────────────────────

src = src.replace(
  /export type HealthTag =\s*[\s\S]*?(?=\n\n|export interface)/,
  `export type HealthTag =\n  | 'skin'\n  | 'antiAging'\n  | 'immunity'\n  | 'digestion'\n  | 'diet'\n  | 'bone'\n\n`,
)

// ─────────────────────────────────────────────────────────────
// 2. healthRadar interface — energy → bone
// ─────────────────────────────────────────────────────────────

src = src.replace(
  /healthRadar:\s*\{[^}]*\}/,
  `healthRadar: {
    skin: number
    antiAging: number
    immunity: number
    digestion: number
    diet: number
    bone: number
  }`,
)

// ─────────────────────────────────────────────────────────────
// 3. 5 음식 객체 삭제 — balanced-brace 추출
// ─────────────────────────────────────────────────────────────

function findFoodObjectRange(s, foodId) {
  const idRe = new RegExp(`foodId:\\s*['"]${foodId}['"]`)
  const m = idRe.exec(s)
  if (!m) return null
  // 뒤로 거슬러 '{' 찾기
  let depth = 0
  let openIdx = -1
  for (let i = m.index; i >= 0; i--) {
    const c = s[i]
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
  // 균형 잡힌 '}' 찾기 (문자열 skip)
  depth = 0
  let closeIdx = -1
  for (let i = openIdx; i < s.length; i++) {
    const c = s[i]
    if (c === '"' || c === "'") {
      const q = c
      i++
      while (i < s.length && s[i] !== q) {
        if (s[i] === '\\') i++
        i++
      }
      continue
    }
    if (c === '`') {
      i++
      while (i < s.length && s[i] !== '`') {
        if (s[i] === '\\') i++
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
  // trailing ',' + 그 다음 newline 흡수
  let endIdx = closeIdx + 1
  if (s[endIdx] === ',') endIdx++
  while (endIdx < s.length && s[endIdx] === ' ') endIdx++
  if (s[endIdx] === '\n') endIdx++
  // leading indent 흡수
  let startIdx = openIdx
  while (startIdx > 0 && /[ \t]/.test(s[startIdx - 1])) startIdx--
  return { startIdx, endIdx }
}

let removedFoodCount = 0
for (const id of REMOVED_FOOD_IDS) {
  const range = findFoodObjectRange(src, id)
  if (!range) {
    console.log(`  [skip] ${id} — not found (already removed?)`)
    continue
  }
  src = src.slice(0, range.startIdx) + src.slice(range.endIdx)
  removedFoodCount++
  console.log(`  [delete] ${id}`)
}

// ─────────────────────────────────────────────────────────────
// 4. healthRadar 의 energy:N 제거 + bone:50 추가
// ─────────────────────────────────────────────────────────────

let radarPatched = 0
src = src.replace(
  /healthRadar:\s*\{([^}]*)\}/g,
  (full, body) => {
    // 인터페이스 정의 (number 만) — 데이터 객체는 number 값
    if (!/\d/.test(body)) return full
    // 기존 값 파싱
    const map = {}
    const partRe = /(\w+):\s*(\d+)/g
    let mm
    while ((mm = partRe.exec(body)) !== null) map[mm[1]] = Number(mm[2])
    // energy 제거
    delete map.energy
    // bone 없으면 50 default
    if (map.bone === undefined) map.bone = 50
    // 6 키 정해진 순서로 출력
    const keys = ['skin', 'antiAging', 'immunity', 'digestion', 'diet', 'bone']
    const parts = keys.map((k) => `${k}: ${map[k] ?? 50}`).join(', ')
    radarPatched++
    return `healthRadar: { ${parts} }`
  },
)
console.log(`  [radar] ${radarPatched} 음식 healthRadar 정리`)

// ─────────────────────────────────────────────────────────────
// 5. healthTags 의 4 카테고리 제거
// ─────────────────────────────────────────────────────────────

let tagsPatched = 0
src = src.replace(
  /healthTags:\s*\[([^\]]*)\]/g,
  (full, body) => {
    const tags = body
      .split(',')
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
      .filter((s) => s.length > 0)
    const filtered = tags.filter((t) => !REMOVED_TAGS.includes(t))
    if (filtered.length === tags.length) return full // 변경 없음
    tagsPatched++
    const out = filtered.map((t) => `'${t}'`).join(', ')
    return `healthTags: [${out}]`
  },
)
console.log(`  [tags] ${tagsPatched} 음식 healthTags 정리`)

// ─────────────────────────────────────────────────────────────
// 6. 결과 쓰기 — 변경 없으면 skip
// ─────────────────────────────────────────────────────────────

if (src === before) {
  console.log(`\n[no-op] 이미 변환됨 — 변경 없음`)
} else {
  writeFileSync(PATH, src)
  console.log(`\n=== 결과 ===`)
  console.log(`삭제 음식       : ${removedFoodCount}/5`)
  console.log(`healthRadar 정리 : ${radarPatched}`)
  console.log(`healthTags 정리  : ${tagsPatched}`)
  console.log(`Output: ${PATH}`)
  console.log(`복원: cp ${PATH}.bak ${PATH}`)
}
