/**
 * Step 1 — 한식진흥원 XLSX 800 선 매칭 + AI 프롬프트 생성.
 *
 * 입력:  data/hansik-raw/한식진흥원_한식메뉴_외국어표기_길라잡이_800선_*.xlsx
 *        (사용자가 다운로드 후 위치)
 *
 * 출력:  lib/data/hansik-enriched.json
 *        - id (food-dupes.ts 의 음식 id)
 *        - name_ko
 *        - match_type: 'exact' | 'fuzzy_prefix' | 'fuzzy_contain' | 'unmatched'
 *        - hansik: { 5 lang 명칭 + 설명 + 카테고리 }  (매칭 시)
 *        - ai_prompt: AI 이미지 생성용 영문 프롬프트
 *
 * 헤더 가정 (사용자 보고 기준):
 *   row 0~2 : 메타 / 빈 줄
 *   row 3   : 헤더 (사용자 명시: ID / 카테고리 / 한글명 / Latin / EN ...)
 *   row 4+  : 데이터
 *
 * 의존성: xlsx (devDependency)
 *
 * 실행:  node scripts/extract-hansik-xlsx.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import XLSX from 'xlsx'

const RAW_DIR = 'data/hansik-raw'

// ────────────────────────────────────────────────
// XLSX 자동 발견
// ────────────────────────────────────────────────

function findXlsx(dir) {
  let found = []
  function walk(d) {
    for (const item of readdirSync(d)) {
      const p = join(d, item)
      const s = statSync(p)
      if (s.isDirectory()) walk(p)
      else if (extname(item).toLowerCase() === '.xlsx') found.push(p)
    }
  }
  try {
    walk(dir)
  } catch {
    return null
  }
  // 가장 큰 파일 우선
  found.sort((a, b) => statSync(b).size - statSync(a).size)
  return found[0] || null
}

const xlsxPath = findXlsx(RAW_DIR)
if (!xlsxPath) {
  console.error(`[error] ${RAW_DIR} 안에 .xlsx 파일 없음.`)
  console.error('  data.go.kr 에서 한식진흥원 800선 다운로드 후 재실행.')
  process.exit(1)
}
console.log(`[xlsx] ${xlsxPath}`)

const wb = XLSX.readFile(xlsxPath)
const ws = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null })
console.log(`[xlsx] total rows: ${rows.length} (sheet: ${wb.SheetNames[0]})`)

// ────────────────────────────────────────────────
// 데이터 추출 (사용자 보고 컬럼 매핑)
// ────────────────────────────────────────────────

// 헤더 row 자동 감지 — '한글' / '한국어' / '음식명' / 'NAME_KO' 같은 라벨이 있는 행
function findHeaderRow() {
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const row = rows[i] || []
    const hasNameKo = row.some((c) =>
      typeof c === 'string' && /(한글|한국어|음식명|NAME_KO|name_ko)/i.test(c),
    )
    if (hasNameKo) return i
  }
  return 3 // 사용자 명시 fallback
}

const HEADER_ROW = findHeaderRow()
console.log(`[xlsx] header row: ${HEADER_ROW}`)
console.log(`[xlsx] header: ${(rows[HEADER_ROW] || []).map((c) => c ?? '').join(' | ').slice(0, 300)}`)

const records = []
for (let i = HEADER_ROW + 1; i < rows.length; i++) {
  const row = rows[i]
  if (!row) continue
  // 사용자 명시 컬럼 매핑 (row[3] = 한글명)
  const name_ko = row[3]
  if (!name_ko || typeof name_ko !== 'string') continue
  records.push({
    id: row[1],
    category: row[2],
    name_ko: String(name_ko).trim(),
    latin: row[4],
    name_en_short: row[5],
    desc_ko: row[6],
    name_en: row[7] || row[5],
    desc_en: row[8],
    name_ja: row[9],
    desc_ja: row[10],
    name_zh_cn: row[11],
    desc_zh_cn: row[12],
    name_zh_tw: row[13],
    desc_zh_tw: row[14],
  })
}
console.log(`[hansik] records: ${records.length}`)

// ────────────────────────────────────────────────
// food-dupes.ts 음식 추출 (정규식 — TS 직접 import 회피)
// ────────────────────────────────────────────────

const dupesSrc = readFileSync('lib/data/food-dupes.ts', 'utf8')
const dupes = []
const idPattern = /id:\s*["']([\w-]+)["']/g
let m
while ((m = idPattern.exec(dupesSrc)) !== null) {
  const id = m[1]
  const after = dupesSrc.slice(m.index, m.index + 800)
  const nameKo = (after.match(/name:\s*\{\s*ko:\s*["']([^"']+)["']/) || [])[1]
  if (nameKo) dupes.push({ id, name_ko: nameKo })
}
console.log(`[dupes] foods: ${dupes.length}`)

// ────────────────────────────────────────────────
// 매칭
// ────────────────────────────────────────────────

const REGION_PREFIX = /^(안동|전주|서울|부산|제주|경주|통영|천안|용인|이천|속초|여수|광주|대구|인천|수원|대전|춘천|강릉|영광|부안|영주|남원|홍성|보성|군산|진주|순천|광양)\s*/

function findMatch(dupeName) {
  const exact = records.find((r) => r.name_ko === dupeName)
  if (exact) return { record: exact, type: 'exact' }

  const stripped = dupeName.replace(REGION_PREFIX, '')
  if (stripped !== dupeName && stripped.length >= 2) {
    const byPrefix = records.find((r) => r.name_ko === stripped)
    if (byPrefix) return { record: byPrefix, type: 'fuzzy_prefix' }
  }

  const byContain = records.find(
    (r) => r.name_ko.includes(dupeName) || dupeName.includes(r.name_ko),
  )
  if (byContain) return { record: byContain, type: 'fuzzy_contain' }

  if (stripped !== dupeName && stripped.length >= 2) {
    const byContainStripped = records.find(
      (r) => r.name_ko.includes(stripped) || stripped.includes(r.name_ko),
    )
    if (byContainStripped) return { record: byContainStripped, type: 'fuzzy_contain' }
  }

  return null
}

// ────────────────────────────────────────────────
// AI 프롬프트
// ────────────────────────────────────────────────

function buildPromptMatched(dupeName, h) {
  const en = h.name_en || h.name_en_short || dupeName
  const desc = (h.desc_en || '').replace(/\s+/g, ' ').slice(0, 250)
  return [
    `Professional food photography of ${en} (Korean dish: ${dupeName}).`,
    desc,
    'Top-down view on traditional Korean ceramic plate or bowl, natural daylight, appetizing presentation, restaurant-quality, photorealistic, 4k.',
    'No people, no text, no logos, no watermarks.',
  ].filter(Boolean).join(' ')
}

function buildPromptBasic(dupeName) {
  return `Professional food photography of ${dupeName}, a Korean traditional dish, top-down view on ceramic plate or bowl, natural daylight, appetizing presentation, photorealistic, 4k. No people, no text, no logos, no watermarks.`
}

// ────────────────────────────────────────────────
// 매칭 실행
// ────────────────────────────────────────────────

const enriched = []
const counts = { exact: 0, fuzzy_prefix: 0, fuzzy_contain: 0, unmatched: 0 }

for (const dupe of dupes) {
  const m = findMatch(dupe.name_ko)
  if (m) {
    counts[m.type]++
    const h = m.record
    enriched.push({
      id: dupe.id,
      name_ko: dupe.name_ko,
      match_type: m.type,
      hansik: {
        name_ko: h.name_ko,
        name_en: h.name_en,
        name_ja: h.name_ja,
        name_zh_cn: h.name_zh_cn,
        name_zh_tw: h.name_zh_tw,
        desc_ko: h.desc_ko,
        desc_en: h.desc_en,
        desc_ja: h.desc_ja,
        desc_zh_cn: h.desc_zh_cn,
        desc_zh_tw: h.desc_zh_tw,
        category: h.category,
      },
      ai_prompt: buildPromptMatched(dupe.name_ko, h),
    })
  } else {
    counts.unmatched++
    enriched.push({
      id: dupe.id,
      name_ko: dupe.name_ko,
      match_type: 'unmatched',
      hansik: null,
      ai_prompt: buildPromptBasic(dupe.name_ko),
    })
  }
}

const output = 'lib/data/hansik-enriched.json'
writeFileSync(output, JSON.stringify(enriched, null, 2) + '\n')

console.log('---')
console.log(`Exact         : ${counts.exact}`)
console.log(`Fuzzy prefix  : ${counts.fuzzy_prefix}`)
console.log(`Fuzzy contain : ${counts.fuzzy_contain}`)
console.log(`Unmatched     : ${counts.unmatched}`)
console.log(`Total         : ${enriched.length}`)
console.log(`Output        : ${output}`)

if (counts.unmatched > 0) {
  console.log('')
  console.log('Unmatched samples (first 15):')
  enriched.filter((e) => e.match_type === 'unmatched').slice(0, 15).forEach((e) => {
    console.log(`  ${e.id} (${e.name_ko})`)
  })
}

const sample = enriched.find((e) => e.match_type === 'exact')
if (sample) {
  console.log('')
  console.log('AI prompt sample (exact):')
  console.log(`  [${sample.id}]`)
  console.log(`  ${sample.ai_prompt}`)
}
