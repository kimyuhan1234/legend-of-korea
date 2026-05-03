/**
 * 한국농어촌공사 계절테마여행 세부 코스 CSV (CP949 / EUC-KR) → JSON 변환.
 *
 * 입력: data/한국농어촌공사_계절테마여행세부코스정보_20260420.csv
 * 출력: lib/data/welchon-spots.json
 *
 * 처리:
 * - TextDecoder('euc-kr') 디코딩 (Node v18+ ICU 내장)
 * - quote-aware CSV 파싱 (주소에 콤마 포함 행 처리)
 * - 한국 영역 검증 (lat 33-39, lng 124-132)
 * - 시도 추출 (주소 첫 토큰)
 *
 * 실행: node scripts/convert-welchon-csv.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const CSV_PATH = 'data/한국농어촌공사_계절테마여행세부코스정보_20260420.csv'
const JSON_PATH = 'lib/data/welchon-spots.json'

const buf = readFileSync(CSV_PATH)
const text = new TextDecoder('euc-kr').decode(buf)
const lines = text.split('\n').filter((l) => l.trim().length > 0)

function parseLine(line) {
  const result = []
  let cur = ''
  let inQuote = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      inQuote = !inQuote
    } else if (c === ',' && !inQuote) {
      result.push(cur.trim())
      cur = ''
    } else {
      cur += c
    }
  }
  result.push(cur.trim())
  return result
}

const items = []
let skipped = 0
const provinceCounts = {}

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].replace(/\r$/, '')
  const parts = parseLine(line)
  if (parts.length < 6) {
    skipped++
    continue
  }

  const [seq, name, image, lat, lng, addr, desc = ''] = parts
  const latNum = parseFloat(lat)
  const lngNum = parseFloat(lng)

  if (isNaN(latNum) || isNaN(lngNum) || latNum < 33 || latNum > 39 || lngNum < 124 || lngNum > 132) {
    skipped++
    continue
  }

  const cleanName = name.replace(/^"|"$/g, '')
  const cleanAddr = addr.replace(/^"|"$/g, '')
  const cleanDesc = (desc || '').replace(/^"|"$/g, '').trim()
  const province = cleanAddr.split(' ')[0]

  provinceCounts[province] = (provinceCounts[province] ?? 0) + 1

  items.push({
    id: `welchon-${seq}`,
    name: cleanName,
    image,
    lat: latNum,
    lng: lngNum,
    address: cleanAddr,
    province,
    description: cleanDesc || null,
  })
}

writeFileSync(JSON_PATH, JSON.stringify(items, null, 2) + '\n')

console.log(`✓ 파싱: ${items.length}건 / 스킵: ${skipped}건`)
console.log(`✓ 출력: ${JSON_PATH}`)
console.log('\n시도별 분포:')
const sorted = Object.entries(provinceCounts).sort((a, b) => b[1] - a[1])
for (const [p, n] of sorted) console.log(`  ${p.padEnd(10)} ${n}건`)
