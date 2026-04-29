/**
 * food-dupes.ts 의 'image: undefined,' 잔재 일괄 제거.
 *
 * 배경
 * - patch-food-dupes.ts 가 'id' 라인 직후에 'image: "URL",' 추가.
 * - 그러나 기존 객체에 이미 'image: undefined,' 줄이 있어 중복 → TS1117 (34건).
 * - patch 의 중복 검사 정규식이 따옴표 시작만 (`image:\s*["']`) 매칭해
 *   undefined 케이스를 인식 못함.
 *
 * 해결
 * - RegionalFood.image 는 옵셔널 (`image?: string`) → undefined 줄은 의미 없음.
 *   모든 'image: undefined,' 줄을 일괄 제거해도 타입 안전.
 *
 * 실행: node scripts/cleanup-image-undefined.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const path = 'lib/data/food-dupes.ts'
let src = readFileSync(path, 'utf8')

const matches = src.match(/^\s*image:\s*undefined,?\s*\n/gm) || []
src = src.replace(/^\s*image:\s*undefined,?\s*\n/gm, '')

writeFileSync(path, src)
console.log(`Removed ${matches.length} 'image: undefined,' lines.`)
