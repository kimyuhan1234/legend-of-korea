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

// 헤더 row 자동 감지 — 한식진흥원 800선의 '요리명' 라벨 포함 행 검색.
// 다른 데이터셋 호환 위해 한국어 / 영어 키워드 다양하게 포함.
function findHeaderRow() {
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const row = rows[i] || []
    const hasNameKo = row.some((c) =>
      typeof c === 'string' && /(요리명|한글|한국어|음식명|메뉴명|NAME_KO|name_ko)/i.test(c),
    )
    if (hasNameKo) return i
  }
  return 1 // fallback (Excel row 2 — 0-indexed 1, 빈 Col 1 자동 trim 후 기준)
}

const HEADER_ROW = findHeaderRow()
const headerCells = rows[HEADER_ROW] || []
console.log(`[xlsx] header row: ${HEADER_ROW} (Excel row ${HEADER_ROW + 1})`)
console.log(`[xlsx] header: ${headerCells.map((c) => c ?? '').join(' | ').slice(0, 300)}`)

// 헤더 검증 — row[2] 가 '요리명' 포함해야 정상 (한식진흥원 800선 기준).
// hotfix v2: sheet_to_json({header:1}) 가 빈 Col 1 자동 trim → 0-indexed 시작이
// Excel Col B (요리번호) 부터. 따라서 요리명 인덱스는 row[3] 가 아닌 row[2].
if (!headerCells[2] || !String(headerCells[2]).includes('요리명')) {
  console.error('[error] 헤더 인식 실패. row[2] 가 "요리명" 포함하지 않음.')
  console.error(`  현재 row[2]: ${JSON.stringify(headerCells[2])}`)
  console.error('  실제 헤더 row 위치 + row[2] 컬럼 직접 확인 후 스크립트 조정 필요.')
  process.exit(1)
}

const records = []
for (let i = HEADER_ROW + 1; i < rows.length; i++) {
  const row = rows[i]
  if (!row) continue
  // 한식진흥원 800선 컬럼 매핑 (hotfix v2 — 빈 Col 1 trim 반영, -1 오프셋):
  //   row[0] 요리번호 / row[1] 카테고리 / row[2] 요리명(한글) / row[3] 라틴어
  //   row[4] 요리명(중복 한글) — skip / row[5] 설명(한글)
  //   row[6] 영어 요리명 / row[7] 영어 설명
  //   row[8] 일본어 요리명 / row[9] 일본어 설명
  //   row[10] 중문1 요리명 / row[11] 중문1 설명
  //   row[12] 중문2 요리명 / row[13] 중문2 설명
  const name_ko = row[2]
  if (!name_ko || typeof name_ko !== 'string') continue
  records.push({
    id: row[0],
    category: row[1],
    name_ko: String(name_ko).trim(),
    latin: row[3],
    desc_ko: row[5],
    name_en: row[6],
    desc_en: row[7],
    name_ja: row[8],
    desc_ja: row[9],
    name_zh_cn: row[10],
    desc_zh_cn: row[11],
    name_zh_tw: row[12],
    desc_zh_tw: row[13],
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

// hotfix v3 — 매칭 알고리즘 5 단계 (정규화 + suffix + keyword 추가)
const REGION_PREFIX = /^(안동|전주|서울|부산|제주|경주|통영|천안|용인|이천|속초|여수|광주|대구|인천|수원|대전|춘천|강릉|영광|부안|영주|남원|홍성|보성|군산|진주|순천|광양|서울식|전주식|경주식|이천식)\s*/

const SUFFIX_TO_TRY = ['', '정식', '상']
const COMMON_SUFFIXES = ['찌개', '국밥', '국수', '탕', '갈비', '비빔밥', '전골', '구이', '볶음', '조림', '무침', '밥']

function normalizeForMatch(name) {
  return String(name)
    .replace(/\s+/g, '')
    .replace(/\([^)]*\)/g, '')
    .toLowerCase()
}

function extractKeywords(name) {
  const result = [name]
  for (const sfx of COMMON_SUFFIXES) {
    if (name.endsWith(sfx)) {
      result.push(sfx)
      const base = name.slice(0, -sfx.length)
      if (base.length >= 2) result.push(base)
    }
  }
  if (name.length >= 4) result.push(name.slice(0, 3))
  return [...new Set(result)]
}

function findMatch(dupeName) {
  const dupeNorm = normalizeForMatch(dupeName)
  const stripped = dupeName.replace(REGION_PREFIX, '').trim()
  const strippedNorm = normalizeForMatch(stripped)

  // 1. 정확 매칭 (정규화 — 공백 / 괄호 제거 후)
  let m = records.find((r) => normalizeForMatch(r.name_ko) === dupeNorm)
  if (m) return { record: m, type: 'exact' }

  // 2. 지역 prefix 제거 후 정확
  if (stripped !== dupeName && stripped.length >= 2) {
    m = records.find((r) => normalizeForMatch(r.name_ko) === strippedNorm)
    if (m) return { record: m, type: 'fuzzy_prefix' }
  }

  // 3. suffix variant 시도 (stripped + 정식 / 상)
  if (stripped.length >= 2) {
    for (const suffix of SUFFIX_TO_TRY) {
      const variantNorm = normalizeForMatch(stripped + suffix)
      if (!variantNorm) continue
      m = records.find((r) => normalizeForMatch(r.name_ko) === variantNorm)
      if (m) return { record: m, type: 'fuzzy_suffix' }
    }
  }

  // 4. 부분 매칭 (3 자 이상 — 오매칭 방지)
  if (stripped.length >= 3) {
    m = records.find((r) => {
      const hNorm = normalizeForMatch(r.name_ko)
      if (hNorm.length < 3) return false
      return hNorm.includes(strippedNorm) || strippedNorm.includes(hNorm)
    })
    if (m) return { record: m, type: 'fuzzy_contain' }
  }

  // 5. 핵심 키워드 매칭 (찌개/국밥/탕 suffix 분리 후 base 매칭)
  for (const kw of extractKeywords(stripped)) {
    if (kw.length < 3) continue
    const kwNorm = normalizeForMatch(kw)
    m = records.find((r) => normalizeForMatch(r.name_ko) === kwNorm)
    if (m) return { record: m, type: 'fuzzy_keyword' }
  }

  return null
}

// ────────────────────────────────────────────────
// AI 프롬프트
// ────────────────────────────────────────────────

function buildPromptMatched(dupeName, h) {
  const en = h.name_en || dupeName
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
const counts = { exact: 0, fuzzy_prefix: 0, fuzzy_suffix: 0, fuzzy_contain: 0, fuzzy_keyword: 0, unmatched: 0 }

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

const matched = counts.exact + counts.fuzzy_prefix + counts.fuzzy_suffix + counts.fuzzy_contain + counts.fuzzy_keyword
console.log('---')
console.log(`Exact         : ${counts.exact}`)
console.log(`Fuzzy prefix  : ${counts.fuzzy_prefix}`)
console.log(`Fuzzy suffix  : ${counts.fuzzy_suffix}`)
console.log(`Fuzzy contain : ${counts.fuzzy_contain}`)
console.log(`Fuzzy keyword : ${counts.fuzzy_keyword}`)
console.log(`Unmatched     : ${counts.unmatched}`)
console.log(`Total         : ${enriched.length}`)
console.log(`Match rate    : ${((matched / enriched.length) * 100).toFixed(1)}%`)
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
