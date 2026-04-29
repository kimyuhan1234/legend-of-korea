/**
 * Phase 6.5 — 포토코리아 다운로드 파일명 자동 파싱 + food-dupes 매핑.
 *
 * 입력:
 *   - data/phoko-images/Type{N}_{음식명}_{작성자}_{코드}.jpg (사용자 다운로드 그대로)
 *   - lib/data/food-dupes.ts (id + name_ko 추출)
 *   - lib/data/hansik-enriched.json (선택 — hansik.name_ko 도 매칭 후보로 활용)
 *
 * 출력:
 *   - data/phoko-renamed/<food-id>.jpg (음식 ID 기반으로 복사 — 원본 보존)
 *   - data/phoko-credits.json ({ food-id: 작성자 })
 *   - data/phoko-rename-log.json ({ renamed, unmatched })
 *
 * 매칭 알고리즘 (extract-hansik-xlsx 와 일관)
 *   1. exact (정규화)
 *   2. 지역 prefix 제거 후 정확
 *   3. 부분 매칭 (양방향, 길이 차 4 이내)
 *
 * 실행: node scripts/parse-phoko-files.mjs
 *
 * 다음 단계
 *   - upload-phoko-to-supabase.mjs 의 SOURCE_DIR='data/phoko-renamed' 로 변경 후 업로드
 *   - apply-phoko-credits.mjs 로 food-dupes.ts 의 image / imageCredit 갱신
 */

import { readdirSync, readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const SOURCE_DIR = 'data/phoko-images'
const OUTPUT_DIR = 'data/phoko-renamed'
const CREDITS_PATH = 'data/phoko-credits.json'
const LOG_PATH = 'data/phoko-rename-log.json'
const DUPES_PATH = 'lib/data/food-dupes.ts'
const ENRICHED_PATH = 'lib/data/hansik-enriched.json'

if (!existsSync(SOURCE_DIR)) {
  console.error(`[error] ${SOURCE_DIR} 부재. 포토코리아 jpg 다운로드 후 재실행.`)
  process.exit(1)
}
mkdirSync(OUTPUT_DIR, { recursive: true })

// ────────────────────────────────────────────────
// food-dupes.ts 에서 음식 추출 (id + name_ko)
// ────────────────────────────────────────────────

const dupesSrc = readFileSync(DUPES_PATH, 'utf8')
const foodMap = []
const idPattern = /id:\s*["']([\w-]+)["']/g
let m
while ((m = idPattern.exec(dupesSrc)) !== null) {
  const id = m[1]
  const after = dupesSrc.slice(m.index, m.index + 800)
  const nameKo = (after.match(/name:\s*\{\s*ko:\s*["']([^"']+)["']/) || [])[1]
  if (nameKo) foodMap.push({ id, name_ko: nameKo.trim() })
}
console.log(`[dupes] foods: ${foodMap.length}`)

// 보강 — hansik-enriched 의 hansik.name_ko 도 매칭 후보 (더 짧은 표준명)
let hansikMap = {}
if (existsSync(ENRICHED_PATH)) {
  const enriched = JSON.parse(readFileSync(ENRICHED_PATH, 'utf8'))
  for (const e of enriched) {
    if (e.hansik?.name_ko) hansikMap[e.id] = e.hansik.name_ko
  }
  console.log(`[hansik] enriched matches: ${Object.keys(hansikMap).length}`)
}

// ────────────────────────────────────────────────
// 파일 스캔
// ────────────────────────────────────────────────

const files = readdirSync(SOURCE_DIR).filter((f) => /\.jpe?g$/i.test(f))
console.log(`[scan] ${files.length} jpg files in ${SOURCE_DIR}`)

// ────────────────────────────────────────────────
// 파일명 파싱 + 매칭
// ────────────────────────────────────────────────

// Type{N}_{음식명}_{작성자}_{코드}.jpg
// 마지막 '_<코드>.jpg' 분리 후 앞을 '음식명_작성자' 로 split.
// 음식명에 _ 가 들어가는 케이스는 거의 없음. 작성자에 ' '/'-' 등은 OK.
const FILENAME_RE = /^Type\d+_(.+)_([A-Za-z0-9]+)\.jpe?g$/i

const REGION_PREFIX = /^(안동|전주|서울|부산|제주|경주|통영|천안|용인|이천|속초|여수|광주|대구|인천|수원|대전|춘천|강릉)\s*/

function normalize(s) {
  return String(s).replace(/\s+/g, '').replace(/\([^)]*\)/g, '').toLowerCase()
}

function findMatch(targetName) {
  const targetNorm = normalize(targetName)
  const targetStripped = targetName.replace(REGION_PREFIX, '').trim()
  const targetStrippedNorm = normalize(targetStripped)

  // 1. exact (정규화)
  let f = foodMap.find((x) => normalize(x.name_ko) === targetNorm)
  if (f) return { food: f, type: 'exact' }

  // 2. hansik 매핑 (food-dupes 에 없는 변형명 매칭 가능)
  for (const [id, hansikName] of Object.entries(hansikMap)) {
    if (normalize(hansikName) === targetNorm) {
      f = foodMap.find((x) => x.id === id)
      if (f) return { food: f, type: 'hansik_exact' }
    }
  }

  // 3. 양쪽 prefix 제거 후 매칭
  if (targetStrippedNorm !== targetNorm) {
    f = foodMap.find((x) => normalize(x.name_ko) === targetStrippedNorm)
    if (f) return { food: f, type: 'fuzzy_prefix' }
    f = foodMap.find((x) => normalize(x.name_ko.replace(REGION_PREFIX, '')) === targetStrippedNorm)
    if (f) return { food: f, type: 'fuzzy_prefix_both' }
  }

  // 4. 부분 매칭 (길이 차 4 이내, 2 자 이상)
  if (targetStrippedNorm.length >= 2) {
    f = foodMap.find((x) => {
      const xNorm = normalize(x.name_ko.replace(REGION_PREFIX, ''))
      if (xNorm.length < 2) return false
      if (Math.abs(xNorm.length - targetStrippedNorm.length) > 4) return false
      return xNorm.includes(targetStrippedNorm) || targetStrippedNorm.includes(xNorm)
    })
    if (f) return { food: f, type: 'fuzzy_contain' }
  }

  return null
}

const credits = existsSync(CREDITS_PATH) ? JSON.parse(readFileSync(CREDITS_PATH, 'utf8')) : {}
const renamed = []
const unmatched = []
const used = new Set() // 같은 음식에 여러 파일이 매칭되면 첫 번째만 사용 (중복 방지)

for (const filename of files) {
  const match = filename.match(FILENAME_RE)
  if (!match) {
    unmatched.push({ filename, reason: 'pattern_mismatch' })
    continue
  }

  // m[1] = "음식명_작성자", m[2] = 코드
  const [, mid] = match
  // 첫 _ 로 split — 음식명 / 작성자
  const sepIdx = mid.indexOf('_')
  if (sepIdx < 0) {
    unmatched.push({ filename, reason: 'no_separator_in_mid' })
    continue
  }
  const foodName = mid.slice(0, sepIdx).trim()
  const author = mid.slice(sepIdx + 1).trim()

  if (!foodName || !author) {
    unmatched.push({ filename, reason: 'empty_field' })
    continue
  }

  const result = findMatch(foodName)
  if (!result) {
    unmatched.push({ filename, foodName, author, reason: 'no_food_match' })
    continue
  }

  if (used.has(result.food.id)) {
    unmatched.push({ filename, foodName, author, reason: `duplicate_for_${result.food.id}` })
    continue
  }
  used.add(result.food.id)

  const newPath = join(OUTPUT_DIR, `${result.food.id}.jpg`)
  copyFileSync(join(SOURCE_DIR, filename), newPath)
  credits[result.food.id] = author
  renamed.push({
    from: filename,
    to: `${result.food.id}.jpg`,
    foodName,
    author,
    matchType: result.type,
  })
  console.log(`✓ ${result.food.id} ← "${foodName}" (${result.type}, by ${author})`)
}

writeFileSync(CREDITS_PATH, JSON.stringify(credits, null, 2) + '\n')
writeFileSync(LOG_PATH, JSON.stringify({ renamed, unmatched }, null, 2) + '\n')

console.log('---')
console.log(`Renamed   : ${renamed.length}`)
console.log(`Unmatched : ${unmatched.length}`)
console.log(`Foods used: ${used.size} / ${foodMap.length}`)
console.log(`Credits   : ${CREDITS_PATH}`)
console.log(`Log       : ${LOG_PATH}`)
console.log(`Output    : ${OUTPUT_DIR}/`)

if (unmatched.length > 0) {
  console.log('')
  console.log('Unmatched samples (first 15):')
  unmatched.slice(0, 15).forEach((u) => {
    console.log(`  ${u.filename}  [${u.reason}]${u.foodName ? ` foodName="${u.foodName}"` : ''}`)
  })
}

console.log('')
console.log('Next:')
console.log('  1. data/phoko-renamed/ 검토 (음식 ID 기반 파일명)')
console.log('  2. upload-phoko-to-supabase.mjs SOURCE_DIR 를 phoko-renamed 로 변경 후 업로드')
console.log('  3. apply-phoko-credits.mjs 로 food-dupes.ts patch')
