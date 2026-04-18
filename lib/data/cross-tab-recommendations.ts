// ─────────────────────────────────────────────
//  lib/data/cross-tab-recommendations.ts
//  "○○ 담았네요 → 이것도 필요하시죠?" 크로스 탭 추천 매핑
// ─────────────────────────────────────────────

export type TabId = 'food' | 'stay' | 'diy' | 'quest' | 'ootd' | 'goods'

export interface CrossTabRecommendation {
  primary: {
    targetTab: TabId
    path: string
    emoji: string
  }
  secondary?: {
    targetTab: TabId
    path: string
    emoji: string
  }
}

// 담은 탭 → 추천 탭 매핑
export const CROSS_TAB_MAP: Record<TabId, CrossTabRecommendation> = {
  stay: {
    primary: { targetTab: 'ootd', path: '/ootd', emoji: '👗' },
    secondary: { targetTab: 'food', path: '/food', emoji: '🍜' },
  },
  food: {
    primary: { targetTab: 'stay', path: '/stay', emoji: '🏯' },
    secondary: { targetTab: 'quest', path: '/story', emoji: '⚔️' },
  },
  quest: {
    primary: { targetTab: 'diy', path: '/diy', emoji: '🏺' },
    secondary: { targetTab: 'stay', path: '/stay', emoji: '🏨' },
  },
  diy: {
    primary: { targetTab: 'goods', path: '/memories', emoji: '✨' },
    secondary: { targetTab: 'food', path: '/food', emoji: '🍴' },
  },
  ootd: {
    primary: { targetTab: 'quest', path: '/story', emoji: '☀️' },
    secondary: { targetTab: 'stay', path: '/stay', emoji: '🏡' },
  },
  goods: {
    primary: { targetTab: 'quest', path: '/story', emoji: '🔥' },
    secondary: { targetTab: 'diy', path: '/diy', emoji: '🎨' },
  },
}
