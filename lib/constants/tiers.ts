export interface Tier {
  level: number;
  name: { ko: string; ja: string; en: string };
  emoji: string;
  requiredLP: number;
  benefits: { ko: string; ja: string; en: string };
  discount: number;
}

export const TIERS: Tier[] = [
  {
    level: 1,
    name: { ko: '마을 주민', ja: '村の住民', en: 'Villager' },
    emoji: '🏘️',
    requiredLP: 0,
    benefits: { ko: '기본 혜택', ja: '基本特典', en: 'Basic benefits' },
    discount: 0,
  },
  {
    level: 2,
    name: { ko: '여행자', ja: '旅行者', en: 'Traveler' },
    emoji: '🧳',
    requiredLP: 500,
    benefits: { ko: '굿즈샵 3% 할인', ja: 'グッズショップ3%割引', en: 'Goods shop 3% off' },
    discount: 3,
  },
  {
    level: 3,
    name: { ko: '모험가', ja: '冒険家', en: 'Adventurer' },
    emoji: '⚔️',
    requiredLP: 2000,
    benefits: { ko: '굿즈샵 5% 할인', ja: 'グッズショップ5%割引', en: 'Goods shop 5% off' },
    discount: 5,
  },
  {
    level: 4,
    name: { ko: '영웅', ja: '英雄', en: 'Hero' },
    emoji: '🦸',
    requiredLP: 5000,
    benefits: { ko: '굿즈샵 8% 할인 + 전용 굿즈', ja: '8%割引+専用グッズ', en: '8% off + exclusive goods' },
    discount: 8,
  },
  {
    level: 5,
    name: { ko: '전설', ja: '伝説', en: 'Legend' },
    emoji: '👑',
    requiredLP: 10000,
    benefits: { ko: '굿즈샵 12% 할인 + 한정판 키트', ja: '12%割引+限定キット', en: '12% off + limited kit' },
    discount: 12,
  },
  {
    level: 6,
    name: { ko: '신화', ja: '神話', en: 'Myth' },
    emoji: '✨',
    requiredLP: 20000,
    benefits: { ko: '굿즈샵 15% 할인 + VIP 체험 초대', ja: '15%割引+VIP体験招待', en: '15% off + VIP experience' },
    discount: 15,
  },
];

export function getCurrentTier(level: number): Tier {
  return TIERS.find(t => t.level === level) || TIERS[0];
}

export function getNextTier(level: number): Tier | null {
  return TIERS.find(t => t.level === level + 1) || null;
}
