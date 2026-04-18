import type { NormalizedSpot } from '@/lib/tour-api/types'
import type { CityScore, SwipeQuestion, UserPreference } from './types'

export const SWIPE_QUESTIONS: SwipeQuestion[] = [
  {
    id: 'experience-vs-sightseeing',
    optionA: {
      label: { ko: '직접 체험하기', en: 'Hands-on experience', ja: '体験する', 'zh-CN': '亲身体验', 'zh-TW': '親身體驗' },
      icon: '🎭',
      tags: ['experience', 'workshop', 'food'],
    },
    optionB: {
      label: { ko: '눈으로 감상하기', en: 'Sightseeing', ja: '観光する', 'zh-CN': '观光', 'zh-TW': '觀光' },
      icon: '📸',
      tags: ['landmark', 'scenic', 'instagram'],
    },
  },
  {
    id: 'traditional-vs-modern',
    optionA: {
      label: { ko: '전통 & 역사', en: 'Traditional & Historic', ja: '伝統と歴史', 'zh-CN': '传统与历史', 'zh-TW': '傳統與歷史' },
      icon: '🏛️',
      tags: ['traditional', 'historic', 'temple'],
    },
    optionB: {
      label: { ko: '현대 & 트렌디', en: 'Modern & Trendy', ja: 'モダン＆トレンディ', 'zh-CN': '现代潮流', 'zh-TW': '現代潮流' },
      icon: '✨',
      tags: ['modern', 'trendy', 'nightlife', 'instagram'],
    },
  },
  {
    id: 'nature-vs-city',
    optionA: {
      label: { ko: '자연 속으로', en: 'Into nature', ja: '自然の中へ', 'zh-CN': '走进自然', 'zh-TW': '走進自然' },
      icon: '🌿',
      tags: ['nature', 'hiking', 'ocean', 'mountain'],
    },
    optionB: {
      label: { ko: '도시 탐험', en: 'City adventure', ja: '都市探検', 'zh-CN': '城市探险', 'zh-TW': '城市探險' },
      icon: '🏙️',
      tags: ['city', 'shopping', 'nightlife', 'cafe'],
    },
  },
  {
    id: 'active-vs-relax',
    optionA: {
      label: { ko: '활동적으로!', en: 'Active & energetic', ja: 'アクティブに！', 'zh-CN': '积极活跃', 'zh-TW': '積極活躍' },
      icon: '🏃',
      tags: ['active', 'hiking', 'adventure', 'themepark'],
    },
    optionB: {
      label: { ko: '느긋하게', en: 'Chill & relax', ja: 'ゆったり', 'zh-CN': '悠闲放松', 'zh-TW': '悠閒放鬆' },
      icon: '☕',
      tags: ['relax', 'cafe', 'spa', 'scenic'],
    },
  },
  {
    id: 'solo-vs-group',
    optionA: {
      label: { ko: '혼자만의 시간', en: 'Solo time', ja: 'ひとり時間', 'zh-CN': '独处时光', 'zh-TW': '獨處時光' },
      icon: '🧘',
      tags: ['solo', 'meditation', 'cafe', 'nature'],
    },
    optionB: {
      label: { ko: '함께 즐기기', en: 'With friends', ja: 'みんなと一緒', 'zh-CN': '一起玩', 'zh-TW': '一起玩' },
      icon: '👥',
      tags: ['group', 'festival', 'themepark', 'nightlife'],
    },
  },
  {
    id: 'food-vs-scenery',
    optionA: {
      label: { ko: '맛집 탐방', en: 'Food tour', ja: 'グルメ巡り', 'zh-CN': '美食探索', 'zh-TW': '美食探索' },
      icon: '🍜',
      tags: ['food', 'market', 'street-food', 'restaurant'],
    },
    optionB: {
      label: { ko: '풍경 감상', en: 'Scenic views', ja: '風景観賞', 'zh-CN': '风景欣赏', 'zh-TW': '風景欣賞' },
      icon: '🌅',
      tags: ['scenic', 'ocean', 'mountain', 'sunset'],
    },
  },
]

export const CITY_TAG_SCORES: Record<string, Record<string, number>> = {
  jeonju:    { traditional: 0.9, food: 1.0, experience: 0.9, historic: 0.8, market: 0.7, cafe: 0.6 },
  gyeongju:  { traditional: 1.0, historic: 1.0, scenic: 0.8, temple: 0.9, relax: 0.7, nature: 0.6 },
  busan:     { ocean: 1.0, city: 0.8, food: 0.9, nightlife: 0.7, instagram: 0.8, active: 0.6 },
  seoul:     { city: 1.0, modern: 0.9, trendy: 0.9, shopping: 0.8, nightlife: 0.9, food: 0.8 },
  jeju:      { nature: 1.0, ocean: 0.9, scenic: 0.9, relax: 0.8, hiking: 0.7, cafe: 0.6 },
  tongyeong: { ocean: 0.9, scenic: 1.0, relax: 0.8, food: 0.7, nature: 0.7, romantic: 0.8 },
  cheonan:   { active: 0.7, food: 0.6, historic: 0.5, cafe: 0.5, nature: 0.4, solo: 0.5 },
  yongin:    { themepark: 1.0, group: 0.8, active: 0.7, traditional: 0.5, family: 0.9 },
  icheon:    { traditional: 0.8, relax: 0.7, food: 0.6, nature: 0.5, experience: 0.7, cafe: 0.5 },
}

export function calculateCityScores(preference: UserPreference): CityScore[] {
  const results: CityScore[] = Object.entries(CITY_TAG_SCORES).map(([city, cityTags]) => {
    let score = 0
    let maxPossible = 0

    for (const [tag, userWeight] of Object.entries(preference.tags)) {
      const cityWeight = cityTags[tag] || 0
      score += userWeight * cityWeight
      maxPossible += Math.abs(userWeight)
    }

    const matchPercent = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 50
    return { city, score, matchPercent: Math.max(0, Math.min(100, matchPercent)) }
  })

  return results.sort((a, b) => b.score - a.score)
}

export interface ScoredSpot extends NormalizedSpot {
  matchScore: number
}

export function scoreSpots(spots: NormalizedSpot[], preference: UserPreference): ScoredSpot[] {
  return spots
    .map(spot => {
      let score = 0
      for (const tag of spot.tags) {
        score += preference.tags[tag] || 0
      }
      return { ...spot, matchScore: score }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}

export function swipeToPreference(answers: Record<string, 'A' | 'B'>): UserPreference {
  const tags: Record<string, number> = {}

  for (const q of SWIPE_QUESTIONS) {
    const answer = answers[q.id]
    if (!answer) continue

    const selected = answer === 'A' ? q.optionA : q.optionB
    const rejected = answer === 'A' ? q.optionB : q.optionA

    for (const tag of selected.tags) {
      tags[tag] = (tags[tag] || 0) + 1
    }
    for (const tag of rejected.tags) {
      tags[tag] = (tags[tag] || 0) - 0.5
    }
  }

  return { tags }
}
