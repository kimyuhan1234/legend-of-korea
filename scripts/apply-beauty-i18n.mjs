/**
 * Phase 9.3 — food-health.ts 의 76 음식 5 언어 완전 지원.
 *
 * 변경
 *   1. FoodHealthData 인터페이스 — name / healthDescription / keyNutrients 5 언어
 *   2. 76 음식 데이터:
 *      - name 에 zh-CN, zh-TW 추가 (기존 ko/ja/en 보존)
 *      - healthDescription 에 zh-CN, zh-TW 추가
 *      - keyNutrients: string[] → { ko, ja, en, zh-CN, zh-TW: string[] } 객체화
 *
 * 입력
 *   - data/beauty-i18n-translated.json (nested 형식)
 *     {
 *       "foodId": {
 *         "name":        { "zh-CN": "...", "zh-TW": "..." },
 *         "description": { "zh-CN": "...", "zh-TW": "..." },
 *         "nutrients":   { "ko": [...], "ja": [...], "en": [...], "zh-CN": [...], "zh-TW": [...] }
 *       }
 *     }
 *
 * 백업: lib/data/food-health.ts.bak{N} (다음 사용 가능 인덱스 자동 결정)
 * 실행: node scripts/apply-beauty-i18n.mjs
 * idempotent — 재실행 시 변경 없음 (이미 5 언어 객체면 skip).
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'

const PATH = 'lib/data/food-health.ts'
const I18N_PATH = 'data/beauty-i18n-translated.json'

if (!existsSync(I18N_PATH)) {
  console.error(`[error] ${I18N_PATH} 부재.`)
  console.error(`사용자가 76 음식 번역 JSON 작성 후 ${I18N_PATH} 에 저장 필요.`)
  console.error(`형식: { foodId: { name:{zh-CN,zh-TW}, description:{zh-CN,zh-TW}, nutrients:{ko,ja,en,zh-CN,zh-TW} } }`)
  process.exit(1)
}

const i18n = JSON.parse(readFileSync(I18N_PATH, 'utf8'))
console.log(`[load] i18n entries: ${Object.keys(i18n).length}`)

// 다음 .bakN 자동 결정
let bakIdx = 0
while (existsSync(`${PATH}.bak${bakIdx === 0 ? '' : bakIdx}`)) bakIdx++
const BAK = `${PATH}.bak${bakIdx === 0 ? '' : bakIdx}`
copyFileSync(PATH, BAK)
console.log(`[backup] ${BAK}`)

let src = readFileSync(PATH, 'utf8')
const before = src

// ─────────────────────────────────────────────────────────────
// 1. 인터페이스 — name / healthDescription / keyNutrients 5 언어 변환
// ─────────────────────────────────────────────────────────────

// name: { ko: string; ja: string; en: string } → 5 언어
src = src.replace(
  /(name:\s*)\{\s*ko:\s*string;\s*ja:\s*string;\s*en:\s*string\s*\}/,
  `$1{ ko: string; ja: string; en: string; 'zh-CN': string; 'zh-TW': string }`,
)

// healthDescription: { ko: string; ja: string; en: string } → 5 언어
src = src.replace(
  /(healthDescription:\s*)\{\s*ko:\s*string;\s*ja:\s*string;\s*en:\s*string\s*\}/,
  `$1{ ko: string; ja: string; en: string; 'zh-CN': string; 'zh-TW': string }`,
)

// keyNutrients: string[] → 5 언어 객체
src = src.replace(
  /(keyNutrients:\s*)string\[\]/,
  `$1{ ko: string[]; ja: string[]; en: string[]; 'zh-CN': string[]; 'zh-TW': string[] }`,
)

// ─────────────────────────────────────────────────────────────
// 2. 음식 객체 boundary 추출 + 패치
// ─────────────────────────────────────────────────────────────

function findFoodObjectRange(s, foodId) {
  const idRe = new RegExp(`foodId:\\s*['"]${foodId}['"]`)
  const m = idRe.exec(s)
  if (!m) return null
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
  return { openIdx, closeIdx, text: s.slice(openIdx, closeIdx + 1) }
}

function patchObject(objText, data) {
  let out = objText

  // name: { ko: '...', ja: '...', en: '...' } → 5 언어 (이미 5 언어면 skip)
  out = out.replace(
    /name:\s*\{\s*ko:\s*'([^']+)',\s*ja:\s*'([^']+)',\s*en:\s*'([^']+)'\s*\}/,
    (full, ko, ja, en) => {
      if (full.includes("'zh-CN'")) return full
      const zhCN = (data.name?.['zh-CN'] || '').replace(/'/g, "\\'")
      const zhTW = (data.name?.['zh-TW'] || '').replace(/'/g, "\\'")
      return `name: { ko: '${ko}', ja: '${ja}', en: '${en}', 'zh-CN': '${zhCN}', 'zh-TW': '${zhTW}' }`
    },
  )

  // healthDescription: { ko: '...', ja: '...', en: '...' } → 5 언어
  out = out.replace(
    /healthDescription:\s*\{([^}]*)\}/,
    (full, body) => {
      if (body.includes("'zh-CN'")) return full
      const koMatch = body.match(/ko:\s*'([^']*(?:\\'[^']*)*)'/)
      const jaMatch = body.match(/ja:\s*'([^']*(?:\\'[^']*)*)'/)
      const enMatch = body.match(/en:\s*'([^']*(?:\\'[^']*)*)'/)
      const ko = koMatch ? koMatch[1] : ''
      const ja = jaMatch ? jaMatch[1] : ''
      const en = enMatch ? enMatch[1] : ''
      const zhCN = (data.description?.['zh-CN'] || '').replace(/'/g, "\\'")
      const zhTW = (data.description?.['zh-TW'] || '').replace(/'/g, "\\'")
      return `healthDescription: {
      ko: '${ko}',
      ja: '${ja}',
      en: '${en}',
      'zh-CN': '${zhCN}',
      'zh-TW': '${zhTW}',
    }`
    },
  )

  // keyNutrients: ['..', '..'] → 5 언어 객체
  out = out.replace(
    /keyNutrients:\s*\[([^\]]*)\]/,
    (full, body) => {
      // 이미 객체면 skip (재실행)
      if (out.match(/keyNutrients:\s*\{/)) return full
      const n = data.nutrients || {}
      const ko = n.ko || []
      const ja = n.ja || []
      const en = n.en || []
      const zhCN = n['zh-CN'] || []
      const zhTW = n['zh-TW'] || []
      const fmt = (arr) => '[' + arr.map((x) => `'${x.replace(/'/g, "\\'")}'`).join(', ') + ']'
      return `keyNutrients: {
      ko: ${fmt(ko)},
      ja: ${fmt(ja)},
      en: ${fmt(en)},
      'zh-CN': ${fmt(zhCN)},
      'zh-TW': ${fmt(zhTW)},
    }`
    },
  )

  return out
}

let patched = 0
let skipped = 0
let missing = 0

for (const [foodId, data] of Object.entries(i18n)) {
  const range = findFoodObjectRange(src, foodId)
  if (!range) {
    missing++
    console.warn(`  [missing] ${foodId} not found in food-health.ts`)
    continue
  }
  const newText = patchObject(range.text, data)
  if (newText === range.text) {
    skipped++
    continue
  }
  src = src.slice(0, range.openIdx) + newText + src.slice(range.closeIdx + 1)
  patched++
}

if (src === before) {
  console.log(`\n[no-op] 변경 없음 (이미 5 언어 객체)`)
} else {
  writeFileSync(PATH, src)
  console.log(`\n=== Phase 9.3 결과 ===`)
  console.log(`patched : ${patched}`)
  console.log(`skipped : ${skipped} (이미 5 언어)`)
  console.log(`missing : ${missing} (food-health.ts 에 foodId 없음)`)
  console.log(`Output  : ${PATH}`)
  console.log(`복원: cp ${BAK} ${PATH}`)
}
