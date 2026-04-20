// =============================================
// 크레딧 팩 + 피처별 크레딧 비용 + LP↔크레딧 환율
// 5개 로케일 지원
// =============================================

import type { PassI18n, Locale } from './passes'

export type CreditPackId = 'starter' | 'popular' | 'mega'

export interface CreditPack {
  id: CreditPackId
  credits: number       // 기본 크레딧
  bonus: number         // 보너스 크레딧
  price: number         // 원화
  label: PassI18n       // "10 크레딧" / "30+3 크레딧" 등
  badge?: PassI18n      // "가성비 최고" 등
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'starter',
    credits: 10,
    bonus: 0,
    price: 3900,
    label: {
      ko: '10 크레딧',
      ja: '10クレジット',
      en: '10 credits',
      'zh-CN': '10 积分',
      'zh-TW': '10 積分',
    },
  },
  {
    id: 'popular',
    credits: 30,
    bonus: 3,
    price: 9900,
    label: {
      ko: '30 + 3 크레딧',
      ja: '30 + 3クレジット',
      en: '30 + 3 credits',
      'zh-CN': '30 + 3 积分',
      'zh-TW': '30 + 3 積分',
    },
    badge: {
      ko: '인기',
      ja: '人気',
      en: 'Popular',
      'zh-CN': '热门',
      'zh-TW': '熱門',
    },
  },
  {
    id: 'mega',
    credits: 60,
    bonus: 12,
    price: 17900,
    label: {
      ko: '60 + 12 크레딧',
      ja: '60 + 12クレジット',
      en: '60 + 12 credits',
      'zh-CN': '60 + 12 积分',
      'zh-TW': '60 + 12 積分',
    },
    badge: {
      ko: '가성비 최고',
      ja: 'コスパ最高',
      en: 'Best value',
      'zh-CN': '超值',
      'zh-TW': '超值',
    },
  },
]

// 피처별 크레딧 소모량
export const CREDIT_COSTS = {
  ai_curation: 3,         // AI 큐레이션 1회
  mission_unlock: 5,      // 미션 잠금 해제 1개
  retro_camera: 2,        // 레트로 카메라 필터 1회
  diy_workshop: 3,        // DIY 공방 예약 1회
  kfood_dupe: 2,          // K-Food 대체 추천 1회
} as const

export type CreditFeature = keyof typeof CREDIT_COSTS

// LP → 크레딧 환전율 (100 LP = 5 크레딧)
export const LP_TO_CREDIT_RATE = {
  lp: 100,
  credits: 5,
} as const

export function getCreditPackById(id: CreditPackId): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === id)
}

// 총 지급 크레딧 (credits + bonus)
export function getTotalCredits(pack: CreditPack): number {
  return pack.credits + pack.bonus
}

// LP 금액을 크레딧으로 환산
export function lpToCredits(lp: number): number {
  return Math.floor(lp / LP_TO_CREDIT_RATE.lp) * LP_TO_CREDIT_RATE.credits
}

// 필요한 LP 계산 (크레딧 단위 올림)
export function creditsToLpCost(credits: number): number {
  const batches = Math.ceil(credits / LP_TO_CREDIT_RATE.credits)
  return batches * LP_TO_CREDIT_RATE.lp
}

export type { Locale }
