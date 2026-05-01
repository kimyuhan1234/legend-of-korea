/**
 * Phase B — 운영자 사진 (한국어 파일명) → food-dupes id 매핑표 작성.
 *
 * 입력
 *   - C:\Users\ADMIN\Desktop\듀프음식사진\*.jpeg (61 개)
 *   - lib/data/food-dupes.ts (id + name.ko 추출)
 *
 * 출력
 *   - data/dupe-photos-mapping.json
 *
 * 매칭 규칙
 *   1순위 — 정규화된 파일명 === food.name.ko (정확 일치)
 *   3순위 — 1순위 fail 한 사진만, 파일명이 name.ko 부분 매칭 (다중 후보 OK)
 *   noise — "사진_선명하게_" 시작
 *
 * 파일명 정규화
 *   - 확장자 제거 (.jpeg, .jpg_..._.jpeg)
 *   - (숫자) 괄호 제거
 *   - _ 뒤 6 자리 이상 타임스탬프 + 그 이후 모두 제거
 *   - 남은 _ 는 공백으로 (이천_쌀밥정식 → 이천 쌀밥정식)
 *   - trim
 *
 * 실행: node scripts/match-dupe-photos.mjs
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'

const PHOTO_DIR = 'C:/Users/ADMIN/Desktop/듀프음식사진'
const DUPES_PATH = 'lib/data/food-dupes.ts'
const OUTPUT = 'data/dupe-photos-mapping.json'

if (!existsSync(PHOTO_DIR)) {
  console.error(`[error] 사진 폴더 부재: ${PHOTO_DIR}`)
  process.exit(1)
}
if (!existsSync('data')) mkdirSync('data', { recursive: true })

// ─────────────────────────────────────────────────────────────
// 1. 사진 파일 list
// ─────────────────────────────────────────────────────────────

const photoFiles = readdirSync(PHOTO_DIR).filter((f) => /\.jpe?g$/i.test(f))
console.log(`[load] photos: ${photoFiles.length}`)

// ─────────────────────────────────────────────────────────────
// 2. food-dupes.ts 의 id + name.ko 추출
//    food 객체 안 첫 ko 가 name.ko (food-dupes.ts 구조: id → name → region 순)
// ─────────────────────────────────────────────────────────────

const dupesSrc = readFileSync(DUPES_PATH, 'utf8')
const foods = []
const idRe = /id:\s*["']([\w-]+)["']/g
let m
while ((m = idRe.exec(dupesSrc)) !== null) {
  const id = m[1]
  // 이 id 위치 이후 800 자 안에서 첫 ko: 추출 (= name.ko)
  const after = dupesSrc.slice(m.index, m.index + 800)
  const koMatch = after.match(/name:\s*\{\s*ko:\s*["']([^"']+)["']/)
  if (!koMatch) continue
  const regionMatch = after.match(/region:\s*["']([\w-]+)["']/)
  foods.push({
    id,
    nameKo: koMatch[1].trim(),
    region: regionMatch ? regionMatch[1] : '',
  })
}
console.log(`[load] foods: ${foods.length}`)

// ─────────────────────────────────────────────────────────────
// 3. 파일명 정규화
// ─────────────────────────────────────────────────────────────

function normalizeFilename(filename) {
  // 노이즈 — "사진_선명하게_" 시작
  if (filename.startsWith('사진_선명하게_')) return null

  let s = filename
  // 1. 확장자 제거 (.jpeg, .jpg, 더블 확장자 .jpg_...jpeg 도 처리)
  s = s.replace(/\.jpe?g$/i, '')
  // 2. (숫자) 괄호 제거
  s = s.replace(/\s*\(\d+\)\s*/g, '')
  // 3. _숫자(6+ 자리 타임스탬프) 와 그 이후 모두 제거
  s = s.replace(/_\d{6,}.*$/, '')
  // 4. .jpg / .jpeg 잔존물 제거 (예: 청국장정식.jpg_... → 청국장정식.jpg → 청국장정식)
  s = s.replace(/\.jpe?g$/i, '')
  // 5. 남은 _ 를 공백으로
  s = s.replace(/_/g, ' ')
  // 6. trim + 다중 공백 정리
  s = s.replace(/\s+/g, ' ').trim()
  return s
}

// ─────────────────────────────────────────────────────────────
// 4. 매칭
// ─────────────────────────────────────────────────────────────

function tier1Match(normalized) {
  // 정확 일치 (공백 무관 비교 — 한쪽만 공백 있어도 match)
  const flat = normalized.replace(/\s+/g, '')
  return foods.filter((f) => {
    const flatKo = f.nameKo.replace(/\s+/g, '')
    return flatKo === flat
  })
}

function tier3Match(normalized) {
  // 부분 매칭 — 파일명 핵심 keyword 가 name.ko 에 포함
  // 또는 name.ko 핵심이 파일명에 포함
  const flat = normalized.replace(/\s+/g, '')
  if (flat.length < 2) return []
  return foods.filter((f) => {
    const flatKo = f.nameKo.replace(/\s+/g, '')
    return flatKo.includes(flat) || flat.includes(flatKo)
  })
}

const result = []
for (const filename of photoFiles) {
  const normalized = normalizeFilename(filename)
  if (normalized === null) {
    result.push({
      filename,
      normalized: null,
      matchPriority: null,
      candidates: [],
      selected: null,
      status: 'noise',
    })
    continue
  }

  // 1 순위
  const t1 = tier1Match(normalized)
  if (t1.length > 0) {
    const candidates = t1.map((f) => ({ foodId: f.id, nameKo: f.nameKo, region: f.region }))
    result.push({
      filename,
      normalized,
      matchPriority: 1,
      candidates,
      selected: t1.length === 1 ? t1[0].id : null,
      status: t1.length === 1 ? 'matched' : 'needs_review',
    })
    continue
  }

  // 3 순위
  const t3 = tier3Match(normalized)
  if (t3.length > 0) {
    const candidates = t3.map((f) => ({ foodId: f.id, nameKo: f.nameKo, region: f.region }))
    result.push({
      filename,
      normalized,
      matchPriority: 3,
      candidates,
      selected: null, // 3 순위는 항상 운영자 검수
      status: 'needs_review',
    })
    continue
  }

  result.push({
    filename,
    normalized,
    matchPriority: null,
    candidates: [],
    selected: null,
    status: 'no_match',
  })
}

writeFileSync(OUTPUT, JSON.stringify(result, null, 2) + '\n')

// ─────────────────────────────────────────────────────────────
// 5. 통계
// ─────────────────────────────────────────────────────────────

const stats = result.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] || 0) + 1
  return acc
}, {})
const matched1 = result.filter((r) => r.status === 'matched').length
const review3 = result.filter((r) => r.matchPriority === 3).length
const review1Multi = result.filter((r) => r.matchPriority === 1 && r.status === 'needs_review').length

console.log(`\n=== Phase B 결과 ===`)
console.log(`총 파일       : ${photoFiles.length}`)
console.log(`matched (1순위 단일): ${matched1}`)
console.log(`needs_review (1순위 다중 후보): ${review1Multi}`)
console.log(`needs_review (3순위 부분 매칭): ${review3}`)
console.log(`no_match     : ${stats.no_match || 0}`)
console.log(`noise        : ${stats.noise || 0}`)
console.log(`Output       : ${OUTPUT}`)
