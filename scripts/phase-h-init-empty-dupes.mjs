/**
 * Phase H — food-dupes.ts 의 모든 food.dupes 블록을 빈 배열 12개국으로 치환.
 *
 *   dupes: {
 *     JP: { ... },
 *     ...
 *   }
 *
 *   →
 *
 *   dupes: {
 *     JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
 *     US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
 *   }
 *
 * field indent (음식 객체 내부 필드 들여쓰기) 가 8 또는 14 둘 다 처리.
 */

import fs from 'node:fs'

const FILE = 'lib/data/food-dupes.ts'

const src = fs.readFileSync(FILE, 'utf8')
const lines = src.split('\n')

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

// 알고리즘 단순화 — id 라인 발견 시 그 직후 첫 dupes:{ 라인 찾고, 같은 indent 의 닫는 } 찾기.
const ranges = []

for (let i = 0; i < lines.length; i++) {
  const idM = lines[i].match(FOOD_ID_RE)
  if (!idM) continue
  const fieldIndent = idM[1].length
  // dupes: 가 다양한 indent (8/14/16/22) 로 등장 — relaxed match.
  const dRe = /^\s+dupes:\s*\{/
  let dupesOpen = -1
  let dupesIndent = -1
  for (let j = i + 1; j < lines.length; j++) {
    const dM = lines[j].match(/^( +)dupes:\s*\{/)
    if (dM) { dupesOpen = j; dupesIndent = dM[1].length; break }
    // 다음 food id (top-level field-indent) 만나면 dupes 없음
    if (j !== i && lines[j].match(FOOD_ID_RE)) break
  }
  if (dupesOpen < 0) {
    console.warn(`[warn] food id="${idM[2]}" line ${i + 1}: dupes block 못 찾음`)
    continue
  }
  // brace counting from dupesOpen
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
  if (endLine < 0) {
    console.error(`[fail] food id="${idM[2]}": dupes 닫는 brace 못 찾음`)
    process.exit(1)
  }
  ranges.push({ id: idM[2], start: dupesOpen, end: endLine, indent: dupesIndent })
}

console.log(`Found ${ranges.length} dupes blocks`)

// 라인 치환 — 뒤에서부터 처리하면 인덱스 보존
ranges.sort((a, b) => b.start - a.start)

const newLines = [...lines]
for (const r of ranges) {
  const indent = ' '.repeat(r.indent)
  const inner = ' '.repeat(r.indent + 2)
  const replacement = [
    `${indent}dupes: {`,
    `${inner}JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],`,
    `${inner}US: [], IT: [], FR: [], IN: [], ES: [], MX: [],`,
    `${indent}},`,
  ]
  // 기존 닫기 라인이 `}` 또는 `},` 일 수 있음 — 마지막 라인 확인 후 결정
  // 현재 r.start..r.end 까지 dupes 블록. 닫는 라인이 `}` (콤마 없음) 이면 다음 라인이 isLocalSpecialty 또는 끝.
  // 안전하게 newLines 에서 r.end 의 콤마 여부 보존:
  const lastLine = lines[r.end]
  const hasTrailingComma = lastLine.trimEnd().endsWith(',')
  if (!hasTrailingComma) {
    // dupes 블록이 food 의 마지막 필드 (콤마 없음) — 그러나 isLocalSpecialty 가 있을 수 있어 사실상 항상 콤마 있음. fallback.
    replacement[replacement.length - 1] = `${indent}}`
  }
  newLines.splice(r.start, r.end - r.start + 1, ...replacement)
}

fs.writeFileSync(FILE, newLines.join('\n'))
console.log(`Replaced ${ranges.length} dupes blocks with empty arrays.`)
console.log(`File length: ${lines.length} → ${newLines.length} lines`)
