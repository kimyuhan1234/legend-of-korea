/**
 * Phase 6 — food-dupes.ts 의 image URL 갱신 + imageCredit 필드 추가.
 *
 * 입력:
 *   - lib/data/phoko-image-urls.json (upload-phoko-to-supabase.mjs 산출물)
 *   - data/phoko-credits.json (사용자 수동 매핑: { id: photographer })
 *
 * 동작
 *   - 'id: "<food-id>"' 라인 다음 800 자 안에서:
 *     1. image 필드 신규 URL 로 갱신 / 없으면 추가
 *     2. imageCredit 필드 'ⓒ한국관광공사 포토코리아-{photographer}' 추가 / 갱신
 *   - line-based 안전 패치 (cleanup-image-undefined / patch-food-dupes 교훈)
 *
 * 실행:  node scripts/apply-phoko-credits.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const URLS_PATH = 'lib/data/phoko-image-urls.json'
const CREDITS_PATH = 'data/phoko-credits.json'
const DUPES_PATH = 'lib/data/food-dupes.ts'

if (!existsSync(URLS_PATH)) {
  console.error(`[error] ${URLS_PATH} 부재. 먼저 upload-phoko-to-supabase.mjs 실행.`)
  process.exit(1)
}

const urls = JSON.parse(readFileSync(URLS_PATH, 'utf8'))
const credits = existsSync(CREDITS_PATH)
  ? JSON.parse(readFileSync(CREDITS_PATH, 'utf8'))
  : {}

if (!existsSync(CREDITS_PATH)) {
  console.warn(`[warn] ${CREDITS_PATH} 부재 — imageCredit 필드는 추가 X (URL 만 갱신).`)
}

let src = readFileSync(DUPES_PATH, 'utf8')

let imageUpdated = 0
let imageAdded = 0
let creditUpdated = 0
let creditAdded = 0
let notMatched = 0

function patchOne(id, imageUrl, photographer) {
  const escapedId = id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

  // 'id: "X"' 라인 매칭
  const idLineRe = new RegExp(`^(\\s*)id:\\s*["']${escapedId}["'],?\\s*$`, 'm')
  const idMatch = idLineRe.exec(src)
  if (!idMatch) {
    notMatched++
    return
  }

  const indent = idMatch[1]
  const insertAt = idMatch.index + idMatch[0].length

  // 같은 객체 안 (다음 800 자) 에서 image / imageCredit 검색
  const window = src.slice(insertAt, insertAt + 800)

  // ── image 필드 갱신 / 추가 ──
  if (imageUrl) {
    const imageLineRe = /^(\s*)image:\s*["'][^"']*["'],?\s*$/m
    const imageMatch = window.match(imageLineRe)
    if (imageMatch) {
      const start = insertAt + (imageMatch.index ?? 0)
      const end = start + imageMatch[0].length
      const replaced = `${imageMatch[1]}image: ${JSON.stringify(imageUrl)},`
      src = src.slice(0, start) + replaced + src.slice(end)
      imageUpdated++
    } else {
      // 추가 — id 라인 직후
      const insertion = `\n${indent}image: ${JSON.stringify(imageUrl)},`
      src = src.slice(0, insertAt) + insertion + src.slice(insertAt)
      imageAdded++
    }
  }

  // ── imageCredit 필드 갱신 / 추가 ──
  if (photographer) {
    const credit = `ⓒ한국관광공사 포토코리아-${photographer}`
    // src 변경됐을 수 있으므로 id 위치 다시 계산
    const idMatch2 = idLineRe.exec(src)
    if (!idMatch2) return
    const insertAt2 = idMatch2.index + idMatch2[0].length
    const indent2 = idMatch2[1]
    const window2 = src.slice(insertAt2, insertAt2 + 800)

    const creditLineRe = /^(\s*)imageCredit:\s*["'][^"']*["'],?\s*$/m
    const creditMatch = window2.match(creditLineRe)
    if (creditMatch) {
      const start = insertAt2 + (creditMatch.index ?? 0)
      const end = start + creditMatch[0].length
      const replaced = `${creditMatch[1]}imageCredit: ${JSON.stringify(credit)},`
      src = src.slice(0, start) + replaced + src.slice(end)
      creditUpdated++
    } else {
      const insertion = `\n${indent2}imageCredit: ${JSON.stringify(credit)},`
      src = src.slice(0, insertAt2) + insertion + src.slice(insertAt2)
      creditAdded++
    }
  }
}

// 끝에서부터 처리 (인덱스 유효성 보존)
const ids = new Set([...Object.keys(urls), ...Object.keys(credits)])
const sortedIds = [...ids].reverse()

for (const id of sortedIds) {
  patchOne(id, urls[id], credits[id])
}

writeFileSync(DUPES_PATH, src)

console.log('Done.')
console.log(`  image updated     : ${imageUpdated}`)
console.log(`  image added       : ${imageAdded}`)
console.log(`  imageCredit upd   : ${creditUpdated}`)
console.log(`  imageCredit added : ${creditAdded}`)
console.log(`  not matched       : ${notMatched}`)
console.log('')
console.log('Verify:')
console.log('  pnpm tsc --noEmit')
console.log('  grep -c "imageCredit:" lib/data/food-dupes.ts')
