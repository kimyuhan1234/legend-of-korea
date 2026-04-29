/**
 * kfood-images.json → food-dupes.ts 자동 patch.
 *
 * 사전 조건: scripts/fetch-kfood-images.ts 실행으로 lib/data/kfood-images.json 생성됨.
 *
 * 동작
 *   - food-dupes.ts 의 'id: "<food-id>"' 라인 직후에 'image: "<URL>",' 한 줄 삽입.
 *   - 중복 방지: id 라인 다음 500 자 안에 이미 image 필드가 있으면 skip.
 *   - 들여쓰기 보존 (id 라인의 indent 그대로 적용).
 *   - nested object 안전 — line 단위 매칭으로 'name: { ... }' 같은 구조와 충돌 X.
 *
 * 실행
 *   pnpm tsx scripts/patch-food-dupes.ts
 *
 * 결과 보고: updated / skipped(이미 있음) / no-image / not-matched 카운트.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const IMAGES_PATH = join(ROOT, 'lib/data/kfood-images.json')
const DUPES_PATH = join(ROOT, 'lib/data/food-dupes.ts')

const images = JSON.parse(readFileSync(IMAGES_PATH, 'utf8')) as Record<string, string | null>
let source = readFileSync(DUPES_PATH, 'utf8')

let updated = 0
let skippedExisting = 0
let noImage = 0
let notMatched = 0

// 끝에서부터 처리 (앞쪽 인덱스가 변경되어도 안전)
const entries = Object.entries(images).reverse()

for (const [id, imageUrl] of entries) {
  if (!imageUrl) {
    noImage++
    continue
  }

  // 'id: "<food-id>"' 라인을 정확히 매칭 (줄 단위, indent 캡처)
  const escapedId = id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  const linePattern = new RegExp(`^(\\s*)id:\\s*["']${escapedId}["'],?\\s*$`, 'm')
  const match = linePattern.exec(source)
  if (!match) {
    notMatched++
    continue
  }

  const indent = match[1]
  const insertAt = match.index + match[0].length

  // 같은 객체 안 (다음 500 자) 에 이미 image 필드 있는지 확인
  const window = source.slice(insertAt, insertAt + 500)
  if (/^\s*image:\s*["']/m.test(window)) {
    skippedExisting++
    continue
  }

  // id 라인 직후에 image 라인 삽입 (들여쓰기 보존)
  const insertion = `\n${indent}image: ${JSON.stringify(imageUrl)},`
  source = source.slice(0, insertAt) + insertion + source.slice(insertAt)
  updated++
}

writeFileSync(DUPES_PATH, source)

console.log('Done.')
console.log(`  Updated:           ${updated}`)
console.log(`  Skipped (exists):  ${skippedExisting}`)
console.log(`  No image:          ${noImage}`)
console.log(`  Not matched:       ${notMatched}`)
console.log('')
console.log('Verify:')
console.log('  pnpm tsc --noEmit')
console.log('  grep -c "image:" lib/data/food-dupes.ts')
