/**
 * 공공데이터 한식 CSV 매칭 + AI 이미지 프롬프트 자동 생성 (옵션 E-3 Phase 1.5).
 *
 * 사전 조건:
 *   1. data/hansik-raw/ 안에 공공데이터 CSV 1 개 이상 위치
 *   2. node scripts/analyze-hansik-data.mjs 로 컬럼명 미리 확인 권장
 *
 * 동작:
 *   1. data/hansik-raw/ 안의 *.csv 자동 발견 (가장 큰 행수 1 개 선택)
 *   2. 컬럼명 multi-fallback (한국어 / 영문 둘 다 대응)
 *   3. food-dupes.ts 의 regions[].foods 와 음식명 정확 + fuzzy 매칭
 *   4. AI 프롬프트 자동 생성 (매칭 시 description / ingredients 활용)
 *   5. lib/data/hansik-enriched.json 출력
 *
 * 의존성: 0 — 자체 CSV 파서 (RFC 4180: quoted field / escaped quotes 처리).
 *
 * 실행: node scripts/extract-hansik-recipes.mjs
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

// ────────────────────────────────────────────────
// 미니 CSV 파서 (RFC 4180 호환)
// ────────────────────────────────────────────────

function parseCSV(text) {
  // BOM 제거
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1)
  const rows = []
  let row = ['']
  let i = 0
  let inQuote = false
  while (i < text.length) {
    const c = text[i]
    if (inQuote) {
      if (c === '"') {
        if (text[i + 1] === '"') { row[row.length - 1] += '"'; i += 2; continue }
        inQuote = false; i++; continue
      }
      row[row.length - 1] += c; i++; continue
    }
    if (c === '"') { inQuote = true; i++; continue }
    if (c === ',') { row.push(''); i++; continue }
    if (c === '\r') { i++; continue }
    if (c === '\n') {
      rows.push(row); row = ['']; i++; continue
    }
    row[row.length - 1] += c; i++
  }
  if (row.length > 1 || row[0].length > 0) rows.push(row)
  if (rows.length === 0) return []
  const header = rows[0].map((h) => h.trim())
  return rows.slice(1).filter((r) => r.some((c) => c.length > 0)).map((r) => {
    const obj = {}
    for (let j = 0; j < header.length; j++) obj[header[j]] = (r[j] ?? '').trim()
    return obj
  })
}

// ────────────────────────────────────────────────
// food-dupes.ts 음식 추출 (TS 직접 import 대신 파일 정규식 — node ESM 안정성)
// ────────────────────────────────────────────────

function extractFoodsFromDupes() {
  const src = readFileSync('lib/data/food-dupes.ts', 'utf8')
  const items = []
  // { id: "X", ... name: { ko: "Y", ja: "...", en: "..." }, ... } 패턴
  const idPattern = /id:\s*["']([\w-]+)["']/g
  let m
  while ((m = idPattern.exec(src)) !== null) {
    const id = m[1]
    const after = src.slice(m.index, m.index + 800)
    const nameKo = (after.match(/name:\s*\{\s*ko:\s*["']([^"']+)["']/) || [])[1]
    const tagsRaw = (after.match(/tags:\s*\[([^\]]*)\]/) || [])[1] || ''
    const tags = tagsRaw.split(',').map((s) => s.replace(/['"]/g, '').trim()).filter(Boolean)
    if (nameKo) items.push({ id, name_ko: nameKo, tags })
  }
  return items
}

// ────────────────────────────────────────────────
// 매칭
// ────────────────────────────────────────────────

const NAME_KEYS_KO = ['name_ko', '음식명', '한글명', '메뉴명', '명칭', '대표메뉴', 'NAME_KO', 'menu_name']
const NAME_KEYS_EN = ['name_en', 'NAME_EN', 'english_name']
const DESC_KEYS = ['설명', '요약', '소개', 'description', 'desc', 'summary']
const INGREDIENT_KEYS = ['재료', '주재료', 'ingredients', 'main_ingredients']
const RECIPE_KEYS = ['조리법', '레시피', 'recipe', 'cooking', '만드는법']

function pick(record, keys) {
  for (const k of keys) {
    if (record[k] && String(record[k]).trim()) return String(record[k]).trim()
  }
  return ''
}

const REGION_PREFIX = /^(안동|전주|서울|부산|제주|경주|통영|천안|용인|이천|속초|여수|광주|대구|인천|수원|대전|춘천|강릉)\s*/

function fuzzyMatch(haystack, needle) {
  if (!haystack || !needle) return false
  if (haystack === needle) return true
  if (haystack.includes(needle) || needle.includes(haystack)) return true
  // 지역 prefix 제거 후 재시도
  const stripped = needle.replace(REGION_PREFIX, '')
  if (stripped !== needle && stripped.length >= 2) {
    if (haystack.includes(stripped) || stripped.includes(haystack)) return true
  }
  return false
}

// ────────────────────────────────────────────────
// AI 프롬프트 빌더
// ────────────────────────────────────────────────

function buildPrompt(food, hansikMatch) {
  if (hansikMatch) {
    const desc = pick(hansikMatch, DESC_KEYS)
    const ing = pick(hansikMatch, INGREDIENT_KEYS)
    const en = pick(hansikMatch, NAME_KEYS_EN)
    return [
      `Professional food photography of ${food.name_ko}${en ? ` (${en})` : ''}, a Korean traditional dish.`,
      desc ? desc.slice(0, 200) : '',
      ing ? `Main ingredients: ${ing.slice(0, 150)}.` : '',
      'Top-down view on traditional Korean ceramic plate, natural daylight, appetizing presentation, restaurant-quality, photorealistic, 4k.',
    ].filter(Boolean).join(' ')
  }
  return `Professional food photography of ${food.name_ko}, a Korean ${food.tags.length ? food.tags.join(' ') + ' ' : ''}traditional dish, top-down view on ceramic plate, natural daylight, appetizing, photorealistic, 4k.`
}

// ────────────────────────────────────────────────
// 메인
// ────────────────────────────────────────────────

function findBestCsv(rootDir) {
  const csvs = []
  function walk(dir) {
    for (const item of readdirSync(dir)) {
      const path = join(dir, item)
      const s = statSync(path)
      if (s.isDirectory()) walk(path)
      else if (extname(item).toLowerCase() === '.csv') csvs.push(path)
    }
  }
  walk(rootDir)
  if (csvs.length === 0) return null
  // 가장 큰 파일 선택 (행수 비례 가정)
  return csvs.sort((a, b) => statSync(b).size - statSync(a).size)[0]
}

const RAW_DIR = 'data/hansik-raw'
let csvPath
try {
  csvPath = findBestCsv(RAW_DIR)
} catch {
  console.error(`[error] ${RAW_DIR} 부재. 먼저 공공데이터 다운로드 + 압축 해제 필요.`)
  process.exit(1)
}
if (!csvPath) {
  console.error(`[error] ${RAW_DIR} 안에 .csv 파일 없음.`)
  console.error('  data.go.kr 에서 한식진흥원 데이터 다운로드 후 재실행.')
  process.exit(1)
}

console.log(`[csv] ${csvPath}`)
const csvText = readFileSync(csvPath, 'utf8')
const records = parseCSV(csvText)
console.log(`[csv] rows: ${records.length}`)
console.log(`[csv] columns: ${records[0] ? Object.keys(records[0]).join(', ') : '(empty)'}`)

if (records.length === 0) {
  console.error('[error] CSV 비어있음 또는 인코딩 문제 (한글 깨짐 시 EUC-KR 가능 — iconv 변환 필요).')
  process.exit(1)
}

const foods = extractFoodsFromDupes()
console.log(`[dupes] foods: ${foods.length}`)

const enriched = []
let exact = 0
let fuzzy = 0
let unmatched = 0

for (const food of foods) {
  // 정확 매칭
  let match = records.find((r) => pick(r, NAME_KEYS_KO) === food.name_ko)
  let matchType = 'exact'

  // fuzzy
  if (!match) {
    match = records.find((r) => {
      const hName = pick(r, NAME_KEYS_KO)
      return fuzzyMatch(hName, food.name_ko)
    })
    if (match) matchType = 'fuzzy'
  }

  if (match) {
    if (matchType === 'exact') exact++
    else fuzzy++
    enriched.push({
      id: food.id,
      name_ko: food.name_ko,
      hansik_match: pick(match, NAME_KEYS_KO),
      match_type: matchType,
      description: pick(match, DESC_KEYS).slice(0, 500),
      ingredients: pick(match, INGREDIENT_KEYS).slice(0, 300),
      recipe: pick(match, RECIPE_KEYS).slice(0, 500),
      ai_prompt: buildPrompt(food, match),
    })
  } else {
    unmatched++
    enriched.push({
      id: food.id,
      name_ko: food.name_ko,
      hansik_match: null,
      match_type: 'none',
      description: '',
      ingredients: '',
      recipe: '',
      ai_prompt: buildPrompt(food, null),
    })
  }
}

const output = 'lib/data/hansik-enriched.json'
writeFileSync(output, JSON.stringify(enriched, null, 2) + '\n')

console.log('---')
console.log(`Exact match : ${exact}`)
console.log(`Fuzzy match : ${fuzzy}`)
console.log(`Unmatched   : ${unmatched}`)
console.log(`Total       : ${foods.length}`)
console.log(`Output      : ${output}`)

if (unmatched > 0) {
  console.log('')
  console.log('Unmatched samples (first 10):')
  enriched.filter((e) => !e.hansik_match).slice(0, 10).forEach((e) => {
    console.log(`  ${e.id} (${e.name_ko})`)
  })
}

console.log('')
console.log('AI prompt sample (first matched):')
const sample = enriched.find((e) => e.hansik_match)
if (sample) {
  console.log(`  [${sample.id}] ${sample.ai_prompt}`)
}
