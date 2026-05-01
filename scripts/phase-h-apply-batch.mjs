/**
 * Phase H Stage 2 — JSON spec 의 dupe candidates 를 food-dupes.ts 에 적용.
 *
 * 입력: data/dupes-stage2/<batch>.json
 *   {
 *     "<foodId>": {
 *       "JP": [{ name, tasteProfile, ingredients, similarityPercent, strengths, limitations, tip?, description, matchReason }, ...],
 *       ...
 *     }
 *   }
 *
 * 동작:
 *   - 각 foodId 의 `dupes: { ... }` 블록을 spec 으로 통째로 교체
 *   - spec 에 없는 country 는 빈 배열 유지
 *   - JSON 구조 → TypeScript 객체 리터럴로 변환 (정렬된 들여쓰기)
 */

import fs from 'node:fs'
import path from 'node:path'

const FILE = 'lib/data/food-dupes.ts'
const BATCH = process.argv[2] || 'data/dupes-stage2/batch.json'

if (!fs.existsSync(BATCH)) {
  console.error(`[error] batch JSON 부재: ${BATCH}`)
  process.exit(1)
}

const spec = JSON.parse(fs.readFileSync(BATCH, 'utf8'))
const src = fs.readFileSync(FILE, 'utf8')
const lines = src.split('\n')

const COUNTRIES = ['JP', 'CN', 'TH', 'VN', 'MY', 'ID', 'US', 'IT', 'FR', 'IN', 'ES', 'MX']
const FOOD_ID_RE = /^( {6,16})id:\s*"([^"]+)"/

function stripStrings(line) {
  let out = ''
  let inStr = false
  let i = 0
  while (i < line.length) {
    const ch = line[i]
    if (inStr) {
      if (ch === '\\' && i + 1 < line.length) { i += 2; continue }
      if (ch === '"') { inStr = false; out += ' '; i++; continue }
      i++
    } else {
      if (ch === '"') { inStr = true; out += ' '; i++; continue }
      out += ch
      i++
    }
  }
  return out
}

// JS object literal serializer (food-dupes.ts 스타일 — quotes / newlines 정리)
function emitObj(obj, indentLevel) {
  const pad = ' '.repeat(indentLevel)
  const inner = ' '.repeat(indentLevel + 2)
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    const parts = obj.map((x) => emitObj(x, indentLevel + 2))
    return `[\n${parts.map((p) => `${inner}${p}`).join(',\n')}\n${pad}]`
  }
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj)
  const keys = Object.keys(obj)
  if (keys.length === 0) return '{}'
  const parts = []
  for (const k of keys) {
    const v = obj[k]
    parts.push(`${k}: ${emitObj(v, indentLevel + 2)}`)
  }
  return `{\n${parts.map((p) => `${inner}${p}`).join(',\n')}\n${pad}}`
}

// food 별 dupes block range 찾기
function findDupesRange(foodId) {
  for (let i = 0; i < lines.length; i++) {
    const idM = lines[i].match(FOOD_ID_RE)
    if (!idM || idM[2] !== foodId) continue
    // dupes: 라인 forward 스캔
    let dupesOpen = -1
    let dupesIndent = -1
    for (let j = i + 1; j < lines.length; j++) {
      const dM = lines[j].match(/^( +)dupes:\s*\{/)
      if (dM) { dupesOpen = j; dupesIndent = dM[1].length; break }
      if (j !== i && lines[j].match(FOOD_ID_RE)) break
    }
    if (dupesOpen < 0) return null
    // brace count to end
    let depth = 0
    let started = false
    let endLine = -1
    for (let j = dupesOpen; j < lines.length; j++) {
      const cleaned = stripStrings(lines[j])
      for (const ch of cleaned) {
        if (ch === '{') { depth++; started = true }
        else if (ch === '}') depth--
      }
      if (started && depth === 0) { endLine = j; break }
    }
    if (endLine < 0) return null
    return { start: dupesOpen, end: endLine, indent: dupesIndent }
  }
  return null
}

let appliedCount = 0
const errors = []

for (const foodId of Object.keys(spec)) {
  const entries = spec[foodId]  // { JP: [...], CN: [...], ... }
  const range = findDupesRange(foodId)
  if (!range) {
    errors.push(`${foodId}: dupes block not found`)
    continue
  }

  // 12개국 모두 보장
  const dupesObj = {}
  for (const cc of COUNTRIES) {
    dupesObj[cc] = entries[cc] ?? []
  }

  // serialize: dupes: {\n  JP: [...],\n  ...\n  MX: [...]\n},
  const indent = ' '.repeat(range.indent)
  const inner = ' '.repeat(range.indent + 2)
  const parts = []
  for (const cc of COUNTRIES) {
    const arr = dupesObj[cc]
    if (arr.length === 0) {
      parts.push(`${inner}${cc}: []`)
    } else {
      parts.push(`${inner}${cc}: ${emitObj(arr, range.indent + 2)}`)
    }
  }
  // dupes 블록의 마지막 라인이 `},` 인지 `}` 인지 보존
  const lastLine = lines[range.end]
  const trailingComma = lastLine.trimEnd().endsWith(',') ? ',' : ''
  const replacement = [
    `${indent}dupes: {`,
    parts.join(',\n'),
    `${indent}}${trailingComma}`,
  ]

  // 실제 라인 치환 (뒤에서 처리할거라 일단 표시만)
  range.replacement = replacement
  appliedCount++
}

// 라인 치환 — 뒤에서부터
const targets = []
for (const foodId of Object.keys(spec)) {
  const range = findDupesRange(foodId)
  if (!range) continue
  // 위에서 만든 replacement 재계산 — 간단화 위해 다시
  const entries = spec[foodId]
  const dupesObj = {}
  for (const cc of COUNTRIES) dupesObj[cc] = entries[cc] ?? []
  const indent = ' '.repeat(range.indent)
  const inner = ' '.repeat(range.indent + 2)
  const parts = []
  for (const cc of COUNTRIES) {
    const arr = dupesObj[cc]
    if (arr.length === 0) parts.push(`${inner}${cc}: []`)
    else parts.push(`${inner}${cc}: ${emitObj(arr, range.indent + 2)}`)
  }
  const lastLine = lines[range.end]
  const trailingComma = lastLine.trimEnd().endsWith(',') ? ',' : ''
  const replacement = [
    `${indent}dupes: {`,
    parts.join(',\n'),
    `${indent}}${trailingComma}`,
  ].join('\n').split('\n')
  targets.push({ foodId, ...range, replacement })
}

targets.sort((a, b) => b.start - a.start)
const newLines = [...lines]
for (const t of targets) {
  newLines.splice(t.start, t.end - t.start + 1, ...t.replacement)
}

fs.writeFileSync(FILE, newLines.join('\n'))

console.log(`Applied: ${appliedCount} foods`)
if (errors.length) {
  console.log(`Errors:`)
  for (const e of errors) console.log(`  ${e}`)
}

// candidate 통계
let total = 0
let perCountry = Object.fromEntries(COUNTRIES.map((c) => [c, 0]))
for (const foodId of Object.keys(spec)) {
  for (const cc of COUNTRIES) {
    const arr = spec[foodId][cc] ?? []
    total += arr.length
    perCountry[cc] += arr.length
  }
}
console.log(`Total candidates added: ${total}`)
console.log(`Per country:`, perCountry)
