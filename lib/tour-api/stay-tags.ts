import type { NormalizedStay } from './stays'

/**
 * 9축 성향 태그 — 각 축 -5 ~ +5 (정수).
 * 축 이름은 "왼쪽-오른쪽" 형태이며 양수일수록 오른쪽 성향.
 *
 * 예) "busy-quiet"
 *   -5 = 매우 번화
 *    0 = 중립
 *   +5 = 매우 조용
 */
export interface StayTags {
  'busy-quiet': number
  'modern-traditional': number
  'budget-premium': number
  'solo-family': number
  'short-long': number
  'indoor-outdoor': number
  'urban-nature': number
  'casual-luxury': number
  'insta-practical': number
}

export const STAY_TAG_AXES: (keyof StayTags)[] = [
  'busy-quiet',
  'modern-traditional',
  'budget-premium',
  'solo-family',
  'short-long',
  'indoor-outdoor',
  'urban-nature',
  'casual-luxury',
  'insta-practical',
]

const ZERO: StayTags = {
  'busy-quiet': 0,
  'modern-traditional': 0,
  'budget-premium': 0,
  'solo-family': 0,
  'short-long': 0,
  'indoor-outdoor': 0,
  'urban-nature': 0,
  'casual-luxury': 0,
  'insta-practical': 0,
}

/**
 * stayType 기준 기본 성향.
 * 실제 숙소 타입별로 9축 각각에 +/- 가중치 부여.
 */
const STAY_TYPE_BASELINE: Record<string, Partial<StayTags>> = {
  한옥: {
    'busy-quiet': 2,
    'modern-traditional': 4,
    'solo-family': -1,
    'indoor-outdoor': -1,
    'casual-luxury': 1,
    'insta-practical': -3,
  },
  관광호텔: {
    'busy-quiet': -2,
    'modern-traditional': -3,
    'budget-premium': 2,
    'urban-nature': -3,
    'casual-luxury': 2,
    'insta-practical': 1,
  },
  모텔: {
    'busy-quiet': -1,
    'modern-traditional': -2,
    'budget-premium': -3,
    'short-long': -3,
    'urban-nature': -2,
    'casual-luxury': -3,
    'insta-practical': 3,
  },
  게스트하우스: {
    'busy-quiet': -1,
    'modern-traditional': -1,
    'budget-premium': -3,
    'solo-family': -3,
    'urban-nature': -2,
    'casual-luxury': -3,
    'insta-practical': 0,
  },
  유스호스텔: {
    'busy-quiet': -1,
    'budget-premium': -3,
    'solo-family': -3,
    'casual-luxury': -3,
    'insta-practical': 2,
  },
  펜션: {
    'busy-quiet': 3,
    'modern-traditional': 0,
    'solo-family': 3,
    'short-long': 1,
    'indoor-outdoor': 3,
    'urban-nature': 3,
    'casual-luxury': 0,
    'insta-practical': -1,
  },
  리조트: {
    'busy-quiet': 2,
    'modern-traditional': -2,
    'budget-premium': 4,
    'solo-family': 2,
    'short-long': 3,
    'indoor-outdoor': 2,
    'urban-nature': 2,
    'casual-luxury': 4,
    'insta-practical': -2,
  },
  콘도미니엄: {
    'busy-quiet': 1,
    'modern-traditional': -1,
    'budget-premium': 1,
    'solo-family': 3,
    'short-long': 3,
    'urban-nature': 1,
  },
  민박: {
    'busy-quiet': 2,
    'modern-traditional': 2,
    'budget-premium': -2,
    'solo-family': 1,
    'urban-nature': 2,
    'casual-luxury': -2,
    'insta-practical': -1,
  },
  홈스테이: {
    'busy-quiet': 1,
    'modern-traditional': 1,
    'budget-premium': -2,
    'casual-luxury': -2,
  },
  서비스드레지던스: {
    'modern-traditional': -3,
    'budget-premium': 2,
    'solo-family': 1,
    'short-long': 3,
    'urban-nature': -2,
    'casual-luxury': 2,
    'insta-practical': 2,
  },
}

// 주소 키워드 기반 보정
const URBAN_PROVINCE_CODES = new Set(['1', '2', '3', '4', '5', '6', '7']) // 서울/인천/대전/대구/광주/부산/울산
const NATURE_PROVINCE_CODES = new Set(['32', '33', '35', '36', '38', '39']) // 강원/충북/경북/경남/전남/제주

const URBAN_KEYWORDS = ['명동', '강남', '홍대', '이태원', '을지로', '종로', '해운대', '광복동', '동성로']
const OCEAN_KEYWORDS = ['해수욕장', '해변', '바닷가', '해안', '포구']
const MOUNTAIN_KEYWORDS = ['산장', '계곡', '숲', '국립공원', '산자락']
const NATURE_KEYWORDS = [...OCEAN_KEYWORDS, ...MOUNTAIN_KEYWORDS, '한적', '시골']

// 이름 키워드 기반 보정
const LUXURY_KEYWORDS = ['5성', 'Grand', 'grand', 'Royal', 'royal', 'Luxury', 'luxury', '특급', '프리미엄', 'Premium']
const BUSINESS_KEYWORDS = ['비즈니스', 'Business', 'business']
const BOUTIQUE_KEYWORDS = ['부띠끄', '부티크', 'Boutique', 'boutique']

function clamp(v: number, min = -5, max = 5): number {
  return Math.max(min, Math.min(max, v))
}

function add(base: StayTags, key: keyof StayTags, delta: number) {
  base[key] = clamp(base[key] + delta)
}

/**
 * 숙소 1건에서 자동으로 9축 태그를 추론한다.
 * stayType 기본 가중치 + 주소/이름 키워드 보정.
 */
export function inferTagsFromStay(stay: NormalizedStay): StayTags {
  const tags: StayTags = { ...ZERO }

  // 1) 숙소 타입 기반
  const baseline = STAY_TYPE_BASELINE[stay.stayType] ?? {}
  for (const [k, v] of Object.entries(baseline)) {
    if (typeof v === 'number') {
      add(tags, k as keyof StayTags, v)
    }
  }

  // 2) 주소 기반 광역 보정
  if (URBAN_PROVINCE_CODES.has(stay.areaCode)) {
    add(tags, 'urban-nature', -2)
    add(tags, 'busy-quiet', -1)
  } else if (NATURE_PROVINCE_CODES.has(stay.areaCode)) {
    add(tags, 'urban-nature', 2)
    add(tags, 'busy-quiet', 1)
    add(tags, 'indoor-outdoor', 1)
  }

  // 3) 주소 키워드 보정
  const addr = stay.address || ''
  for (const kw of URBAN_KEYWORDS) {
    if (addr.includes(kw)) {
      add(tags, 'urban-nature', -2)
      add(tags, 'busy-quiet', -2)
      add(tags, 'modern-traditional', -1)
      break
    }
  }
  for (const kw of OCEAN_KEYWORDS) {
    if (addr.includes(kw)) {
      add(tags, 'indoor-outdoor', 2)
      add(tags, 'urban-nature', 2)
      add(tags, 'insta-practical', -1)
      break
    }
  }
  for (const kw of MOUNTAIN_KEYWORDS) {
    if (addr.includes(kw)) {
      add(tags, 'indoor-outdoor', 2)
      add(tags, 'urban-nature', 2)
      add(tags, 'busy-quiet', 2)
      break
    }
  }
  if (NATURE_KEYWORDS.some((kw) => addr.includes(kw))) {
    add(tags, 'busy-quiet', 1)
  }

  // 4) 이름 키워드 보정
  const name = stay.name || ''
  if (LUXURY_KEYWORDS.some((kw) => name.includes(kw))) {
    add(tags, 'budget-premium', 3)
    add(tags, 'casual-luxury', 3)
    add(tags, 'insta-practical', -1)
  }
  if (BUSINESS_KEYWORDS.some((kw) => name.includes(kw))) {
    add(tags, 'solo-family', -3)
    add(tags, 'insta-practical', 3)
    add(tags, 'short-long', -2)
  }
  if (BOUTIQUE_KEYWORDS.some((kw) => name.includes(kw))) {
    add(tags, 'casual-luxury', 2)
    add(tags, 'insta-practical', -2)
    add(tags, 'modern-traditional', -1)
  }

  return tags
}

/**
 * 여러 숙소를 한꺼번에 태깅.
 */
export function tagStays(stays: NormalizedStay[]): NormalizedStay[] {
  return stays.map((s) => ({ ...s, tags: inferTagsFromStay(s) }))
}
