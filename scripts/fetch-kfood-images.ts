/**
 * 일회성 큐레이션 스크립트 — TourAPI 에서 한국 음식 대표 이미지 fetch.
 *
 * 사용법:
 *   1. .env.local 에 TOUR_API_KEY 설정 (한국관광공사 활용 신청 키)
 *   2. pnpm add -D tsx (없으면)
 *   3. TOUR_API_KEY=$(grep TOUR_API_KEY .env.local | cut -d= -f2) \
 *        pnpm tsx scripts/fetch-kfood-images.ts
 *   4. 결과: lib/data/kfood-images.json 생성
 *   5. lib/data/food-dupes.ts 의 각 음식에 image 필드 채우기 (수동 또는 후속 스크립트)
 *
 * API: https://apis.data.go.kr/B551011/KorService2/searchKeyword2
 *   - keyword: 음식 한글명
 *   - contentTypeId: 39 (음식점) / 28 (체험관광) — 음식 자체는 별도 keyword 검색
 *   - firstimage / firstimage2 필드 활용
 */

import { writeFileSync } from 'node:fs'
import { regions } from '../lib/data/food-dupes'

const TOUR_API_KEY = process.env.TOUR_API_KEY
if (!TOUR_API_KEY) {
  console.error('TOUR_API_KEY 환경변수 부재. .env.local 확인.')
  process.exit(1)
}

const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2/searchKeyword2'

interface TourApiItem {
  firstimage?: string
  firstimage2?: string
  title?: string
  addr1?: string
}

async function fetchImage(keyword: string): Promise<string | null> {
  const params = new URLSearchParams({
    serviceKey: TOUR_API_KEY!,
    MobileOS: 'WEB',
    MobileApp: 'CloudWithYou',
    keyword,
    numOfRows: '5',
    pageNo: '1',
    _type: 'json',
  })

  try {
    const res = await fetch(`${BASE_URL}?${params}`)
    if (!res.ok) return null
    const data = await res.json()
    const items: TourApiItem[] = data?.response?.body?.items?.item || []
    for (const item of items) {
      if (item.firstimage) return item.firstimage
      if (item.firstimage2) return item.firstimage2
    }
    return null
  } catch (e) {
    console.error(`  [fetch error] ${keyword}:`, e instanceof Error ? e.message : String(e))
    return null
  }
}

async function main() {
  const results: Record<string, string | null> = {}

  // food-dupes.ts 의 모든 음식 순회 (regions 배열의 foods)
  const allFoods = regions.flatMap((r) => r.foods)
  console.log(`Total foods to fetch: ${allFoods.length}`)
  console.log('---')

  let found = 0
  for (const food of allFoods) {
    process.stdout.write(`[${food.id}] ${food.name.ko} ... `)
    const image = await fetchImage(food.name.ko)
    results[food.id] = image
    if (image) {
      console.log('✓')
      found++
    } else {
      console.log('✗')
    }
    // API 호출 간격 1 초 (한국관광공사 무료 플랜 보호)
    await new Promise((r) => setTimeout(r, 1000))
  }

  const outputPath = 'lib/data/kfood-images.json'
  writeFileSync(outputPath, JSON.stringify(results, null, 2) + '\n')

  console.log('---')
  console.log(`Done. ${found} / ${allFoods.length} images found.`)
  console.log(`Output: ${outputPath}`)
  console.log('')
  console.log('Next: lib/data/food-dupes.ts 의 각 음식에 image 필드 채우기.')
  console.log('  예: { id: "jeonju-bibimbap", ..., image: "<URL>" }')
}

main()
