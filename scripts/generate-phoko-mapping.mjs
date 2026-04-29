/**
 * Phase 6.7 — 1:N 포토코리아 매핑 초안 생성.
 *
 * 입력
 *   - data/phoko-files-list.txt (Type1_{keyword}_{작성자}_{코드}.jpg 라인 목록)
 *   - data/food-list.json ([{ id, name_ko }, ...] — Phase 7 적용 후 239 개)
 *
 * 출력
 *   - data/phoko-mapping.draft.json (apply 단계 입력)
 *   - data/phoko-mapping-report.md (사람용 검토)
 *
 * 매칭 룰 (rule + score)
 *   1. exact_match (high)         — 정규화 후 keyword == name_ko, score=100
 *   2. keyword_in_name (medium)   — keyword ⊂ name_ko, score=keyword.length*10
 *   3. name_in_keyword (medium)   — name_ko ⊂ keyword, score=name_ko.length*5
 *   4. normalized_partial (low)   — 정규화 부분 일치 (공통 부분 ≥2자), score=1
 *
 * 음식별로 가장 high score 의 file 1 개와만 매핑 (1:1 from food's POV)
 * 한 file 은 여러 음식과 매핑 (1:N from file's POV) — spec 의 핵심.
 *
 * 보존 정책 (apply 단계 강제 — 이 스크립트는 매핑만 생성)
 *   - mapping 안 된 음식의 image URL 절대 변경 X (기존 AI/포토코리아 보존)
 *   - apply-phoko-mapping.mjs (후속) 가 mapping 있는 음식만 patch
 *
 * 실행: node scripts/generate-phoko-mapping.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const FILES_LIST_PATH = 'data/phoko-files-list.txt'
const FOOD_LIST_PATH = 'data/food-list.json'
const OUT_JSON = 'data/phoko-mapping.draft.json'
const OUT_MD = 'data/phoko-mapping-report.md'

// ─────────────────────────────────────────────────────────────
// 비음식 keyword (skip)
// ─────────────────────────────────────────────────────────────

const NON_FOOD_KEYWORDS = new Set([
  '광장시장',
  '부산 온천장 곰장어골목',
  '신사동 아귀찜골목',
  '안지랑곱창골목',
  '장충동 족발골목',
  '정남진 장흥토요시장',
  '한가원',
  '다찌',
  '디저트',
  '생과일모찌',
  '애담찹쌀떡',
  '맥주',
  '막걸리',
  '한강라면',
  '토스트',
])

// ─────────────────────────────────────────────────────────────
// 입력
// ─────────────────────────────────────────────────────────────

if (!existsSync(FILES_LIST_PATH) || !existsSync(FOOD_LIST_PATH)) {
  console.error(`[error] 입력 부재. ${FILES_LIST_PATH} / ${FOOD_LIST_PATH} 확인.`)
  process.exit(1)
}

const fileLines = readFileSync(FILES_LIST_PATH, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
const foods = JSON.parse(readFileSync(FOOD_LIST_PATH, 'utf8'))

console.log(`[load] files: ${fileLines.length}, foods: ${foods.length}`)

// ─────────────────────────────────────────────────────────────
// 파일명 파싱
// ─────────────────────────────────────────────────────────────

// Type1_{keyword}_{작성자}_{코드}.jpg
// 마지막 '_<코드>.jpg' 분리 후 앞부분을 첫 _ 로 split (keyword/작성자)
const FILENAME_RE = /^Type\d+_(.+)_([A-Za-z0-9]+)\.jpe?g$/i

function parseFilename(filename) {
  const m = filename.match(FILENAME_RE)
  if (!m) return null
  const mid = m[1]
  const sepIdx = mid.indexOf('_')
  if (sepIdx < 0) return null
  return {
    filename,
    keyword: mid.slice(0, sepIdx).trim(),
    author: mid.slice(sepIdx + 1).trim(),
  }
}

const parsedFiles = []
const skippedNonParsed = []
for (const fn of fileLines) {
  const p = parseFilename(fn)
  if (!p) {
    skippedNonParsed.push({ filename: fn, reason: 'pattern_mismatch' })
    continue
  }
  parsedFiles.push(p)
}

// ─────────────────────────────────────────────────────────────
// 정규화 + 매칭
// ─────────────────────────────────────────────────────────────

function normalize(s) {
  return String(s).replace(/\s+/g, '').replace(/\([^)]*\)/g, '').toLowerCase()
}

function classifyMatch(keyword, name_ko) {
  const kn = normalize(keyword)
  const nn = normalize(name_ko)
  if (!kn || !nn) return null

  if (kn === nn) return { rule: 'exact_match', confidence: 'high', score: 100 }
  if (nn.includes(kn) && kn.length >= 2) {
    return { rule: 'keyword_in_name', confidence: 'medium', score: kn.length * 10 }
  }
  if (kn.includes(nn) && nn.length >= 2) {
    return { rule: 'name_in_keyword', confidence: 'medium', score: nn.length * 5 }
  }
  // normalized partial — 둘 모두 ≥2자 공통 substring 검사
  if (kn.length >= 2 && nn.length >= 2) {
    // 가장 긴 공통 부분 찾기 (단순화: 더 짧은 쪽이 다른 쪽 substring 인지)
    // 위 두 룰에서 안 잡힘 → 부분 일치 X. 보수적으로 매칭 안 함.
    return null
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// 음식별 best file 결정
// ─────────────────────────────────────────────────────────────

const skippedNonFood = []
const eligibleFiles = []
for (const p of parsedFiles) {
  if (NON_FOOD_KEYWORDS.has(p.keyword)) {
    skippedNonFood.push({ filename: p.filename, keyword: p.keyword, reason: 'non-food keyword' })
    continue
  }
  eligibleFiles.push(p)
}

console.log(`[parse] eligible: ${eligibleFiles.length}, non-food skip: ${skippedNonFood.length}`)

// 각 음식 마다 모든 파일 candidate 수집 + best 선택
const foodToBestFile = new Map() // foodId → { filename, keyword, author, rule, confidence, score }
const filesUsedForFoods = new Set() // 매칭된 적 있는 파일 추적

for (const food of foods) {
  let best = null
  for (const f of eligibleFiles) {
    const m = classifyMatch(f.keyword, food.name_ko)
    if (!m) continue
    const cand = {
      filename: f.filename,
      keyword: f.keyword,
      author: f.author,
      rule: m.rule,
      confidence: m.confidence,
      score: m.score,
    }
    if (!best || cand.score > best.score) best = cand
  }
  if (best) {
    foodToBestFile.set(food.id, { food, ...best })
    filesUsedForFoods.add(best.filename)
  }
}

console.log(`[match] matched foods: ${foodToBestFile.size} / ${foods.length}`)

// ─────────────────────────────────────────────────────────────
// file → matches[] (1:N) 형태로 invert
// ─────────────────────────────────────────────────────────────

const mappings = {}
for (const [foodId, info] of foodToBestFile.entries()) {
  if (!mappings[info.filename]) {
    mappings[info.filename] = {
      keyword: info.keyword,
      credit: `ⓒ한국관광공사 포토코리아-${info.author}`,
      author: info.author,
      matches: [],
    }
  }
  mappings[info.filename].matches.push({
    id: foodId,
    name_ko: info.food.name_ko,
    confidence: info.confidence,
    rule: info.rule,
    score: info.score,
  })
}

// 각 파일의 matches 를 score desc 정렬
for (const m of Object.values(mappings)) {
  m.matches.sort((a, b) => b.score - a.score)
}

// 매칭 0 인 eligible 파일 (non-matched files)
const unmatchedFiles = eligibleFiles
  .filter((f) => !filesUsedForFoods.has(f.filename))
  .map((f) => ({ filename: f.filename, keyword: f.keyword, author: f.author }))

// 매칭 0 인 음식
const unmatchedFoodIds = foods
  .filter((f) => !foodToBestFile.has(f.id))
  .map((f) => ({ id: f.id, name_ko: f.name_ko }))

// ─────────────────────────────────────────────────────────────
// 통계
// ─────────────────────────────────────────────────────────────

const byConfidence = { high: 0, medium: 0, low: 0 }
let totalMatchEntries = 0
for (const m of Object.values(mappings)) {
  for (const e of m.matches) {
    byConfidence[e.confidence]++
    totalMatchEntries++
  }
}

const meta = {
  generated_at: new Date().toISOString(),
  total_files: fileLines.length,
  parsed_files: parsedFiles.length,
  skipped_non_food: skippedNonFood.length,
  skipped_non_parsed: skippedNonParsed.length,
  eligible_files: eligibleFiles.length,
  files_with_matches: Object.keys(mappings).length,
  files_unmatched: unmatchedFiles.length,
  total_food_ids: foods.length,
  total_food_ids_matched: foodToBestFile.size,
  unmatched_food_ids_count: unmatchedFoodIds.length,
  total_match_entries: totalMatchEntries,
  by_confidence: byConfidence,
  preservation_policy: 'mapping 안 된 음식의 image URL 은 apply 단계에서 절대 변경 X (기존 AI/포토코리아 이미지 유지). apply-phoko-mapping.mjs 가 mapping 있는 음식만 patch.',
}

// ─────────────────────────────────────────────────────────────
// 출력 — JSON
// ─────────────────────────────────────────────────────────────

writeFileSync(
  OUT_JSON,
  JSON.stringify(
    {
      _meta: meta,
      mappings,
      skipped_files: [...skippedNonFood, ...skippedNonParsed],
      unmatched_files: unmatchedFiles,
      unmatched_food_ids: unmatchedFoodIds,
    },
    null,
    2,
  ) + '\n',
)

// ─────────────────────────────────────────────────────────────
// 출력 — Markdown report
// ─────────────────────────────────────────────────────────────

let md = `# 포토코리아 매핑 결과 (Phase 6.7 draft)\n\n`
md += `_생성: ${meta.generated_at}_\n\n`
md += `## ⚠ 보존 정책\n\n`
md += `**mapping 안 된 음식의 image URL 은 apply 단계에서 절대 변경 X.**\n`
md += `- mapping 있는 음식만 phoko 이미지로 교체\n`
md += `- mapping 없는 음식은 기존 image (Replicate Flux AI 또는 기존 포토코리아) 그대로 보존\n`
md += `- food-dupes.ts.bak 백업으로 실패 시 복원\n\n`
md += `## 통계\n\n`
md += `| 항목 | 값 |\n|---|---|\n`
md += `| 총 파일 | ${meta.total_files} |\n`
md += `| 비음식 제외 | ${meta.skipped_non_food} |\n`
md += `| 파싱 실패 | ${meta.skipped_non_parsed} |\n`
md += `| 처리 (eligible) | ${meta.eligible_files} |\n`
md += `| 매핑된 파일 | ${meta.files_with_matches} |\n`
md += `| 매칭 안 된 파일 | ${meta.files_unmatched} |\n`
md += `| 매핑된 음식 | ${meta.total_food_ids_matched} / ${meta.total_food_ids} (${((meta.total_food_ids_matched / meta.total_food_ids) * 100).toFixed(1)}%) |\n`
md += `| 매칭 안 된 음식 | ${meta.unmatched_food_ids_count} (보존) |\n`
md += `| 총 매칭 entry | ${meta.total_match_entries} |\n`
md += `| - high (exact) | ${byConfidence.high} |\n`
md += `| - medium | ${byConfidence.medium} |\n`
md += `| - low | ${byConfidence.low} |\n`

// 1:N 케이스만 따로 (matches.length ≥ 2)
const oneToManyEntries = Object.entries(mappings)
  .filter(([, m]) => m.matches.length >= 2)
  .sort((a, b) => b[1].matches.length - a[1].matches.length)

md += `\n## 1:N 매핑 — ${oneToManyEntries.length}건 (한 파일 → 여러 음식)\n\n`
for (const [filename, m] of oneToManyEntries) {
  md += `### \`${m.keyword}\` (${m.matches.length}개 음식)\n`
  md += `_파일: ${filename} / by ${m.author}_\n\n`
  for (const e of m.matches) {
    md += `- \`${e.id}\` — ${e.name_ko} _(${e.confidence}, ${e.rule})_\n`
  }
  md += `\n`
}

// 1:1 high confidence
const oneToOneHigh = Object.entries(mappings).filter(
  ([, m]) => m.matches.length === 1 && m.matches[0].confidence === 'high',
)
md += `\n## 1:1 High Confidence — ${oneToOneHigh.length}건 (정확 일치)\n\n`
md += `| keyword | 음식 ID | name_ko |\n|---|---|---|\n`
for (const [, m] of oneToOneHigh) {
  const e = m.matches[0]
  md += `| ${m.keyword} | \`${e.id}\` | ${e.name_ko} |\n`
}

// 매칭 안 된 음식 — 그룹화 (region prefix 기준)
md += `\n## 매칭 안 된 음식 ${unmatchedFoodIds.length}건 (image 기존 보존)\n\n`
const byRegion = {}
for (const f of unmatchedFoodIds) {
  const region = f.id.split('-')[0]
  byRegion[region] = byRegion[region] || []
  byRegion[region].push(f)
}
for (const region of Object.keys(byRegion).sort()) {
  md += `### ${region} (${byRegion[region].length})\n\n`
  for (const f of byRegion[region]) md += `- \`${f.id}\` — ${f.name_ko}\n`
  md += `\n`
}

// 매칭 안 된 파일 (참고)
md += `\n## 매칭 안 된 파일 ${unmatchedFiles.length}건 (음식 후보 없음)\n\n`
for (const f of unmatchedFiles) md += `- \`${f.keyword}\` — ${f.filename}\n`

// 비음식 skip 파일
md += `\n## 비음식 skip ${skippedNonFood.length}건\n\n`
for (const f of skippedNonFood) md += `- \`${f.keyword}\` — ${f.filename}\n`

writeFileSync(OUT_MD, md)

// ─────────────────────────────────────────────────────────────
// 콘솔 요약
// ─────────────────────────────────────────────────────────────

console.log(`\n=== Phase 6.7 매핑 결과 ===`)
console.log(`총 파일       : ${meta.total_files}`)
console.log(`비음식 skip   : ${meta.skipped_non_food}`)
console.log(`파싱 실패     : ${meta.skipped_non_parsed}`)
console.log(`처리 eligible : ${meta.eligible_files}`)
console.log(`매핑 파일     : ${meta.files_with_matches} (1:N ${oneToManyEntries.length}, 1:1 ${meta.files_with_matches - oneToManyEntries.length})`)
console.log(`매핑 안 된 파일: ${meta.files_unmatched}`)
console.log(`매핑된 음식   : ${meta.total_food_ids_matched} / ${meta.total_food_ids} (${((meta.total_food_ids_matched / meta.total_food_ids) * 100).toFixed(1)}%)`)
console.log(`보존 (매칭 X) : ${meta.unmatched_food_ids_count}`)
console.log(`총 매칭 entry : ${meta.total_match_entries}`)
console.log(`  high   : ${byConfidence.high}`)
console.log(`  medium : ${byConfidence.medium}`)
console.log(`  low    : ${byConfidence.low}`)
console.log(`\nOutput:`)
console.log(`  ${OUT_JSON}`)
console.log(`  ${OUT_MD}`)
console.log(`\n다음 단계: 사용자가 ${OUT_MD} 검토 → apply-phoko-mapping.mjs (mapping 있는 음식만 patch — 보존 정책 강제)`)
