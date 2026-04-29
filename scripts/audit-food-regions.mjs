/**
 * Phase 7 — 음식 지역 분류 감사 (한국관광공사 + 나무위키 크로스 검증용 raw dump).
 *
 * 입력:
 *   - lib/data/food-dupes.ts (현재 region 분류)
 *   - lib/data/hansik-enriched.json (한식진흥원 매칭 정보 — 표준명/설명)
 *
 * 출력:
 *   - data/food-region-audit.md   (사람이 검토)
 *   - data/food-region-audit.json (apply-region-corrections 입력)
 *
 * 다음 단계
 *   1. data/food-region-audit.md 검토 (한국관광공사/나무위키 향토음식 페이지 대조)
 *   2. data/region-corrections.json 작성 — { oldId: { newId?, newRegion?, delete?, reason } }
 *   3. node scripts/apply-region-corrections.mjs 로 일괄 적용
 *
 * 실행: node scripts/audit-food-regions.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'

const DUPES_PATH = 'lib/data/food-dupes.ts'
const ENRICHED_PATH = 'lib/data/hansik-enriched.json'
const OUTPUT_MD = 'data/food-region-audit.md'
const OUTPUT_JSON = 'data/food-region-audit.json'

if (!existsSync('data')) mkdirSync('data', { recursive: true })

const src = readFileSync(DUPES_PATH, 'utf8')

// id → 첫 ko (= name.ko) → region 순으로 추출.
// food-dupes.ts 구조: id → name.ko → name.ja → name.en → region.
const matches = [
  ...src.matchAll(
    /id:\s*["']([\w-]+)["'][\s\S]{0,800}?ko:\s*["']([^"']+)["'][\s\S]{0,500}?region:\s*["']([\w-]+)["']/g,
  ),
]

let enriched = []
try {
  enriched = JSON.parse(readFileSync(ENRICHED_PATH, 'utf8'))
} catch {
  console.warn(`[warn] ${ENRICHED_PATH} 부재 — 한식진흥원 매칭 정보 없이 진행`)
}

const enrichedMap = new Map(enriched.map((e) => [e.id, e]))

const foods = matches.map((m) => {
  const id = m[1]
  const name_ko = m[2].trim()
  const region = m[3]
  const e = enrichedMap.get(id)
  return {
    id,
    name_ko,
    region,
    hansik_match: e?.hansik?.name_ko || null,
    hansik_desc: e?.hansik?.desc_ko || null,
    needs_review: false,
  }
})

console.log(`Total foods: ${foods.length}`)

// 지역별 집계
const byRegion = {}
for (const f of foods) {
  byRegion[f.region] = byRegion[f.region] || []
  byRegion[f.region].push(f)
}

const regionOrder = Object.keys(byRegion).sort((a, b) => byRegion[b].length - byRegion[a].length)

let output = '# Food Region Audit\n\n'
output += `_${foods.length} foods, ${regionOrder.length} regions_\n\n`
output += '## 검토 가이드\n\n'
output += '- 한국관광공사: https://korean.visitkorea.or.kr (공식 향토음식)\n'
output += '- 나무위키: https://namu.wiki/w/한국 요리/지역별\n'
output += '- 잘못된 분류는 `data/region-corrections.json` 에 다음 형식으로 작성:\n'
output += '  ```json\n'
output += '  { "old-id": { "newRegion": "andong", "reason": "..." } }\n'
output += '  ```\n\n'
output += '## 지역 분포\n\n'
output += '| 지역 | 음식 수 |\n|---|---|\n'
for (const r of regionOrder) output += `| ${r} | ${byRegion[r].length} |\n`

for (const region of regionOrder) {
  const list = byRegion[region]
  output += `\n## ${region} (${list.length})\n\n`
  list.forEach((f) => {
    let line = `- \`${f.id}\` — ${f.name_ko}`
    if (f.hansik_match && f.hansik_match !== f.name_ko) {
      line += ` _(한식진흥원: ${f.hansik_match})_`
    }
    output += line + '\n'
  })
}

writeFileSync(OUTPUT_MD, output)
writeFileSync(OUTPUT_JSON, JSON.stringify(foods, null, 2) + '\n')

console.log(`\nReports:`)
console.log(`  ${OUTPUT_MD} (사람용)`)
console.log(`  ${OUTPUT_JSON} (스크립트용)`)
console.log(`\n지역 분포:`)
for (const r of regionOrder) console.log(`  ${r.padEnd(20)} ${byRegion[r].length}`)
console.log(`\nNext: ${OUTPUT_MD} 검토 후 data/region-corrections.json 작성`)
