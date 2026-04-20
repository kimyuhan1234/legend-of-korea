// =============================================
// 패스(Pass) 정적 데이터 — Move / Live / Story / All in One
// DB 매핑: subscription_plans.plan_type (TEXT) ↔ PASSES[].id
// 5개 로케일 지원 (ko / ja / en / zh-CN / zh-TW)
// =============================================

export type PassId = 'move' | 'live' | 'story' | 'allinone'
export type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

export interface PassI18n {
  ko: string
  ja: string
  en: string
  'zh-CN': string
  'zh-TW': string
}

export interface Pass {
  id: PassId
  name: string
  price: number
  icon: string
  color: string
  features: string[]
  tagline: PassI18n
  description: PassI18n
  badge?: PassI18n
}

export const PASSES: Pass[] = [
  {
    id: 'move',
    name: 'Move',
    price: 6900,
    icon: '🚗',
    color: '#3B82F6',
    features: ['traffic', 'spot', 'ai_curation'],
    tagline: {
      ko: '동선이 곧 여행이다',
      ja: '動線こそが旅のすべて',
      en: 'Your route IS the trip',
      'zh-CN': '路线就是旅行',
      'zh-TW': '路線就是旅行',
    },
    description: {
      ko: 'TRAFFIC 경로 최적화 + SPOT 추천 + AI 큐레이션. 길 위에서 시간을 아낀다.',
      ja: 'TRAFFICルート最適化 + SPOT推薦 + AIキュレーション。道の上で時間を節約。',
      en: 'Traffic optimization + SPOT picks + AI curation. Save hours on the road.',
      'zh-CN': '交通路线优化 + SPOT 推荐 + AI 精选。节省路上的时间。',
      'zh-TW': '交通路線優化 + SPOT 推薦 + AI 精選。節省路上的時間。',
    },
  },
  {
    id: 'live',
    name: 'Live',
    price: 6900,
    icon: '🍜',
    color: '#F59E0B',
    features: ['kfood', 'stay', 'ootd'],
    tagline: {
      ko: '진짜 현지처럼 먹고 자고 입는다',
      ja: '本物のローカルのように食べ・泊まり・着る',
      en: 'Eat, sleep, dress like a local',
      'zh-CN': '像本地人一样吃住穿',
      'zh-TW': '像本地人一樣吃住穿',
    },
    description: {
      ko: 'K-Food 맛집 + 숙소 추천 + OOTD 스타일 가이드. 현지 감성 풀코스.',
      ja: 'K-Foodグルメ + 宿泊推薦 + OOTDスタイルガイド。ローカル感フルコース。',
      en: 'K-Food spots + stay picks + OOTD style guide. Full local vibe.',
      'zh-CN': 'K-Food 美食 + 住宿推荐 + OOTD 穿搭指南。完整本地体验。',
      'zh-TW': 'K-Food 美食 + 住宿推薦 + OOTD 穿搭指南。完整本地體驗。',
    },
  },
  {
    id: 'story',
    name: 'Story',
    price: 9900,
    icon: '📖',
    color: '#8B5CF6',
    features: ['quest', 'diy', 'memories'],
    tagline: {
      ko: '남는 건 이야기뿐이다',
      ja: '残るのは物語だけ',
      en: 'Stories are what you keep',
      'zh-CN': '留下的只有故事',
      'zh-TW': '留下的只有故事',
    },
    description: {
      ko: 'QUEST 미션 + DIY 공방 + MEMORIES 기록관. 이야기가 남는 여행.',
      ja: 'QUESTミッション + DIY工房 + MEMORIES記録室。物語が残る旅。',
      en: 'QUEST missions + DIY workshops + MEMORIES archive. A trip that leaves stories.',
      'zh-CN': 'QUEST 任务 + DIY 工坊 + MEMORIES 记录室。留下故事的旅行。',
      'zh-TW': 'QUEST 任務 + DIY 工坊 + MEMORIES 記錄室。留下故事的旅行。',
    },
  },
  {
    id: 'allinone',
    name: 'All in One',
    price: 19900,
    icon: '👑',
    color: '#EF4444',
    features: ['all', 'vip_badge', 'lp_multiplier_2x', 'monthly_credits_100'],
    tagline: {
      ko: '고민할 시간에 여행하자',
      ja: '悩む時間があるなら旅に出よう',
      en: 'Stop debating, start traveling',
      'zh-CN': '与其犹豫不如出发',
      'zh-TW': '與其猶豫不如出發',
    },
    description: {
      ko: '전 기능 무제한 + VIP 뱃지 + LP 2배 + 매달 100 크레딧. 3,800원 절약.',
      ja: '全機能無制限 + VIPバッジ + LP 2倍 + 毎月100クレジット。3,800ウォン節約。',
      en: 'All features + VIP badge + 2x LP + 100 monthly credits. Save ₩3,800.',
      'zh-CN': '全功能无限 + VIP 徽章 + LP 双倍 + 每月 100 积分。节省 3,800 韩元。',
      'zh-TW': '全功能無限 + VIP 徽章 + LP 雙倍 + 每月 100 積分。節省 3,800 韓元。',
    },
    badge: {
      ko: '인기',
      ja: '人気',
      en: 'Popular',
      'zh-CN': '热门',
      'zh-TW': '熱門',
    },
  },
]

// Move + Live + Story 개별 구매 = 23,700원
// All in One = 19,900원 → 3,800원 절약
export const ALLINONE_SAVINGS = 6900 + 6900 + 9900 - 19900 // 3800

export function getPassById(id: PassId): Pass | undefined {
  return PASSES.find((p) => p.id === id)
}

export function getPassByPlanType(planType: string): Pass | undefined {
  return PASSES.find((p) => p.id === planType)
}
