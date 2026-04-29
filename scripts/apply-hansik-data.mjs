/**
 * Step 4 — hansik-image-urls.json → food-dupes.ts 의 image 필드 자동 적용.
 *
 * 입력:
 *   - lib/data/hansik-image-urls.json (upload-to-supabase.mjs 산출물)
 *   - lib/data/food-dupes.ts
 *
 * 출력: lib/data/food-dupes.ts (수정됨)
 *
 * 동작:
 *   - 'id: "<food-id>"' 라인 직후에 'image: "<URL>",' 추가
 *   - 이미 image 필드 있으면 새 URL 로 갱신
 *   - nested object (name: { ko, ja, en }) 안전 — line 단위 처리
 *   - 끝에서부터 처리 (앞쪽 인덱스 유효성 보존)
 *
 * 실행: node scripts/apply-hansik-data.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs'

const URLS_PATH = 'lib/data/hansik-image-urls.json'
const DUPES_PATH = 'lib/data/food-dupes.ts'

const urls = JSON.parse(readFileSync(URLS_PATH, 'utf8'))
let src = readFileSync(DUPES_PATH, 'utf8')

let added = 0
let updated = 0
let notMatched = 0
let noUrl = 0

// 끝에서부터 처리 — source 변경되어도 앞쪽 인덱스 유효성 보존
const entries = Object.entries(urls).reverse()

for (const [id, imageUrl] of entries) {
  if (!imageUrl) {
    noUrl++
    continue
  }

  const escapedId = id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

  // 'id' 라인 매칭 (줄 단위)
  const idLineRe = new RegExp(`^(\\s*)id:\\s*["']${escapedId}["'],?\\s*$`, 'm')
  const idMatch = idLineRe.exec(src)
  if (!idMatch) {
    notMatched++
    continue
  }

  const indent = idMatch[1]
  const insertAt = idMatch.index + idMatch[0].length

  // 같은 객체 안 (다음 800 자) 에서 기존 image 라인 검색
  const window = src.slice(insertAt, insertAt + 800)
  const existingImageRe = /^(\s*)image:\s*["'][^"']*["'],?\s*$/m
  const existingMatch = window.match(existingImageRe)

  if (existingMatch) {
    // 갱신 — 기존 image 라인 새 URL 로 교체
    const existingStart = insertAt + (existingMatch.index ?? 0)
    const existingEnd = existingStart + existingMatch[0].length
    const replaced = `${existingMatch[1]}image: ${JSON.stringify(imageUrl)},`
    src = src.slice(0, existingStart) + replaced + src.slice(existingEnd)
    updated++
  } else {
    // 추가 — id 라인 직후에 image 라인 삽입
    const insertion = `\n${indent}image: ${JSON.stringify(imageUrl)},`
    src = src.slice(0, insertAt) + insertion + src.slice(insertAt)
    added++
  }
}

writeFileSync(DUPES_PATH, src)

console.log('Done.')
console.log(`  Added       : ${added}`)
console.log(`  Updated     : ${updated}`)
console.log(`  Not matched : ${notMatched}`)
console.log(`  No URL      : ${noUrl}`)
console.log('')
console.log('Verify:')
console.log('  pnpm tsc --noEmit')
console.log('  grep -c "image:" lib/data/food-dupes.ts')
