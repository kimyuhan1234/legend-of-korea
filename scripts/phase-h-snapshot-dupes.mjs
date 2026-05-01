/**
 * Phase H — 기존 dupes 데이터 백업.
 *
 * 모든 food 의 dupes block 원문 텍스트를 JSON 으로 스냅샷.
 * 향후 Stage 2 재작성 시 reference (음식별 어떤 country 매칭이 있었는지 참조).
 */

import fs from 'node:fs'

const FILE = 'lib/data/food-dupes.ts'
const OUT = 'data/dupes-original-backup.json'

const src = fs.readFileSync(FILE, 'utf8')
const lines = src.split('\n')

const foods = []
let cur = null

function flushFood(endLine) {
  if (cur) {
    cur.endLine = endLine
    foods.push(cur)
    cur = null
  }
}

const FOOD_ID_RE = /^( {6,16})id:\s*"([^"]+)"/
const REGION_CODE_RE = /^    code:\s*"([^"]+)"/

let currentRegionCode = null

for (let i = 0; i < lines.length; i++) {
  const l = lines[i]
  const codeM = l.match(REGION_CODE_RE)
  if (codeM) {
    flushFood(i - 1)
    currentRegionCode = codeM[1]
    continue
  }
  const idM = l.match(FOOD_ID_RE)
  if (idM) {
    flushFood(i - 1)
    const fieldIndent = idM[1].length
    cur = {
      id: idM[2],
      region: currentRegionCode,
      fieldIndent,
      idLine: i,
      dupesStart: -1,
      dupesEnd: -1,
    }
    continue
  }
  if (cur && cur.dupesStart < 0) {
    const dRe = new RegExp(`^ {${cur.fieldIndent}}dupes:\\s*\\{`)
    if (dRe.test(l)) {
      cur.dupesStart = i
      // brace counting from here
      let depth = 0
      let started = false
      for (let j = i; j < lines.length; j++) {
        // strip strings
        const cleaned = stripStrings(lines[j])
        for (const ch of cleaned) {
          if (ch === '{') { depth++; started = true }
          else if (ch === '}') depth--
        }
        if (started && depth === 0) {
          cur.dupesEnd = j
          break
        }
      }
    }
  }
}
flushFood(lines.length - 1)

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

console.log(`Foods: ${foods.length}`)

const out = {}
for (const f of foods) {
  if (f.dupesStart < 0 || f.dupesEnd < 0) {
    out[f.id] = { region: f.region, dupesText: null }
    continue
  }
  const slice = lines.slice(f.dupesStart, f.dupesEnd + 1).join('\n')
  out[f.id] = { region: f.region, dupesText: slice }
}

fs.writeFileSync(OUT, JSON.stringify(out, null, 2))
console.log(`Saved: ${OUT}`)
console.log(`Sample (jeonju-bibimbap dupes 길이):`, out['jeonju-bibimbap']?.dupesText?.length ?? 'none')
