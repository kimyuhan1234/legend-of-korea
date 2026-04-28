// =============================================
// 패스 정적 데이터 (PRD-PRICING-2026-001)
// 4 패스 구독 (Move/Live/Story/All in One) 폐기 → 3 패스 1 회 구매 (Short/Standard/Long)
// =============================================

export type PassType = 'short' | 'standard' | 'long'

/** 패스 1 종 정의 — UI 카피는 messages/{locale}.json 의 pricing.passes.{type} 참조 */
export interface Pass {
  type: PassType
  priceKrw: number
  durationDays: 7 | 15 | 30
  /** 인기 배지 등 — i18n 키는 messages 의 pricing.badge.{badge} */
  badge?: 'most_popular'
  /** Feature key 목록 — 잠금 화면 / PassCard 의 체크리스트에 사용 (i18n 매핑) */
  features: readonly string[]
}

const COMMON_FEATURES = [
  'quest.unlimited',
  'kfood.dupe_match',
  'kfood.beauty',
  'kfood.fusion',
  'spot.full',
] as const

export const PASSES: Record<PassType, Pass> = {
  short: {
    type: 'short',
    priceKrw: 2900,
    durationDays: 7,
    features: COMMON_FEATURES,
  },
  standard: {
    type: 'standard',
    priceKrw: 4900,
    durationDays: 15,
    badge: 'most_popular',
    features: COMMON_FEATURES,
  },
  long: {
    type: 'long',
    priceKrw: 7900,
    durationDays: 30,
    features: COMMON_FEATURES,
  },
}

export const PASS_TYPES: readonly PassType[] = ['short', 'standard', 'long'] as const

export function isPassType(value: unknown): value is PassType {
  return typeof value === 'string' && PASS_TYPES.includes(value as PassType)
}
