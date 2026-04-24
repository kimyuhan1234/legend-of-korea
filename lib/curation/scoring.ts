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
  // ── 기존 9개 (변경 금지) ────────────────────────────────────────
  jeonju:    { traditional: 0.9, food: 1.0, experience: 0.9, historic: 0.8, market: 0.7, cafe: 0.6, walking: 0.9, 'street-food': 0.8, budget: 0.7, photo: 0.7, daytime: 0.7, 'night-market': 0.6 },
  gyeongju:  { traditional: 1.0, historic: 1.0, scenic: 0.8, temple: 0.9, relax: 0.7, nature: 0.6, walking: 0.8, driving: 0.6, romantic: 0.7, daytime: 0.8, meditation: 0.6, photo: 0.8 },
  busan:     { ocean: 1.0, city: 0.8, food: 0.9, nightlife: 0.7, instagram: 0.8, active: 0.6, coastal: 0.9, 'night-market': 0.7, sunset: 0.8, driving: 0.7, group: 0.7, shopping: 0.6 },
  seoul:     { city: 1.0, modern: 0.9, trendy: 0.9, shopping: 0.8, nightlife: 0.9, food: 0.8, instagram: 0.8, luxury: 0.7, cafe: 0.8, walking: 0.7, bar: 0.7, 'fine-dining': 0.6 },
  jeju:      { nature: 1.0, ocean: 0.9, scenic: 0.9, relax: 0.8, hiking: 0.7, cafe: 0.6, driving: 1.0, 'scenic-road': 0.9, romantic: 0.8, photo: 0.8, family: 0.7, countryside: 0.7 },
  tongyeong: { ocean: 0.9, scenic: 1.0, relax: 0.8, food: 0.7, nature: 0.7, romantic: 0.8, coastal: 0.9, sunset: 0.8, walking: 0.6, budget: 0.6, photo: 0.7, 'street-food': 0.6 },
  cheonan:   { active: 0.7, food: 0.6, historic: 0.5, cafe: 0.5, nature: 0.4, solo: 0.5, budget: 0.7, walking: 0.5, daytime: 0.6, market: 0.5, experience: 0.5 },
  yongin:    { themepark: 1.0, group: 0.8, active: 0.7, traditional: 0.5, family: 0.9, driving: 0.7, daytime: 0.8, shopping: 0.5, adventure: 0.6 },
  icheon:    { traditional: 0.8, relax: 0.7, food: 0.6, nature: 0.5, experience: 0.7, cafe: 0.5, walking: 0.5, budget: 0.6, countryside: 0.6, daytime: 0.7, spa: 0.5 },

  // ── 14개 광역시도 추가 (전국 확장) ──────────────────────────────
  // 인천 — 공항 관문, 차이나타운, 월미도, 송도
  incheon:    { city: 0.8, modern: 0.8, shopping: 0.7, food: 0.7, 'street-food': 0.7, market: 0.6, ocean: 0.5, walking: 0.6, nightlife: 0.6, instagram: 0.6, trendy: 0.6, family: 0.6 },
  // 대전 — 과학도시, 유성온천, 보문산, 한밭수목원
  daejeon:    { modern: 0.7, spa: 0.7, food: 0.6, cafe: 0.5, city: 0.6, relax: 0.6, nature: 0.4, walking: 0.5, family: 0.5, daytime: 0.6, budget: 0.6, experience: 0.5 },
  // 대구 — 팔공산, 서문시장, 약전골목, 김광석 거리
  daegu:      { food: 0.9, market: 0.9, 'street-food': 0.8, traditional: 0.6, historic: 0.6, nightlife: 0.7, temple: 0.6, hiking: 0.6, walking: 0.7, budget: 0.7, 'night-market': 0.7, cafe: 0.5 },
  // 광주 — 예향, 무등산, 아시아문화전당, 양림동
  gwangju:    { food: 0.8, historic: 0.7, traditional: 0.6, experience: 0.6, cafe: 0.7, market: 0.6, modern: 0.6, nature: 0.5, hiking: 0.7, walking: 0.6, trendy: 0.5, budget: 0.6 },
  // 울산 — 태화강, 대왕암, 간절곶 일출, 장생포
  ulsan:      { nature: 0.7, ocean: 0.8, scenic: 0.7, coastal: 0.7, sunset: 0.7, food: 0.6, family: 0.6, walking: 0.5, hiking: 0.5, market: 0.5, driving: 0.6, relax: 0.5 },
  // 세종 — 행정중심, 호수공원, 영평사
  sejong:     { modern: 0.8, relax: 0.6, nature: 0.5, walking: 0.5, cafe: 0.5, daytime: 0.6, family: 0.5, budget: 0.5, solo: 0.5 },
  // 경기도 — 수원화성, 파주, 가평, 포천, 양평
  gyeonggi:   { historic: 0.7, traditional: 0.6, nature: 0.6, family: 0.7, themepark: 0.6, hiking: 0.6, driving: 0.7, 'scenic-road': 0.6, market: 0.5, food: 0.6, cafe: 0.6, experience: 0.6, walking: 0.5 },
  // 강원도 — 설악산, 강릉, 속초, 양양 서핑, 평창 스키
  gangwon:    { nature: 1.0, hiking: 0.9, ocean: 0.9, scenic: 0.9, coastal: 0.8, adventure: 0.8, active: 0.8, driving: 0.8, 'scenic-road': 0.9, relax: 0.7, cafe: 0.7, sunset: 0.8, countryside: 0.7, romantic: 0.7, family: 0.6 },
  // 충청북도 — 단양, 충주호, 속리산, 청주
  chungbuk:   { nature: 0.8, hiking: 0.7, scenic: 0.7, temple: 0.7, traditional: 0.6, relax: 0.7, driving: 0.7, countryside: 0.7, 'scenic-road': 0.7, historic: 0.6, walking: 0.6 },
  // 충청남도 — 공주 백제, 부여, 태안, 대천 해수욕장, 덕산온천
  chungnam:   { historic: 0.9, traditional: 0.8, temple: 0.7, ocean: 0.6, scenic: 0.6, food: 0.6, coastal: 0.6, spa: 0.7, nature: 0.5, walking: 0.6, experience: 0.6, daytime: 0.6 },
  // 경상북도 — 안동 하회마을, 영주 부석사, 청송, 문경
  gyeongbuk:  { traditional: 1.0, historic: 1.0, temple: 0.9, nature: 0.7, hiking: 0.6, scenic: 0.7, experience: 0.7, walking: 0.7, meditation: 0.7, countryside: 0.7, romantic: 0.6, relax: 0.6 },
  // 경상남도 — 거제, 남해, 진주, 하동, 통영 권역
  gyeongnam:  { ocean: 0.8, scenic: 0.9, coastal: 0.8, nature: 0.7, food: 0.7, driving: 0.7, romantic: 0.7, sunset: 0.8, 'scenic-road': 0.7, historic: 0.6, relax: 0.7, walking: 0.6 },
  // 전라북도 — 변산반도, 무주 덕유산, 남원, 고창, 전주 권역
  jeonbuk:    { traditional: 0.8, food: 0.9, nature: 0.7, historic: 0.7, hiking: 0.7, market: 0.7, experience: 0.7, walking: 0.7, romantic: 0.6, temple: 0.6, 'street-food': 0.6, countryside: 0.6 },
  // 전라남도 — 여수 밤바다, 순천만, 담양, 목포, 보성
  jeonnam:    { ocean: 0.9, scenic: 0.9, nature: 0.8, food: 0.8, sunset: 0.9, coastal: 0.9, nightlife: 0.6, 'night-market': 0.6, relax: 0.7, romantic: 0.8, 'scenic-road': 0.8, driving: 0.7, cafe: 0.6 },
}

// ─── 슬라이더 9축 + 동행 1개 ──────────────────────────────────────
export interface SliderAxis {
  id: string
  left: { icon: string; label: I18nString }
  right: { icon: string; label: I18nString }
  leftTags: string[]
  rightTags: string[]
}

// I18nString import 없이 인라인 정의로 충돌 방지
type I18nString = { ko: string; en: string; ja: string; 'zh-CN': string; 'zh-TW': string }

export const SLIDER_AXES: SliderAxis[] = [
  {
    id: 'tradition-modern',
    left: { icon: '🏛️', label: { ko: '전통 & 역사', en: 'Traditional', ja: '伝統', 'zh-CN': '传统', 'zh-TW': '傳統' } },
    right: { icon: '✨', label: { ko: '현대 & 트렌디', en: 'Modern', ja: 'モダン', 'zh-CN': '现代', 'zh-TW': '現代' } },
    leftTags: ['traditional', 'historic', 'temple'],
    rightTags: ['modern', 'trendy', 'nightlife', 'instagram'],
  },
  {
    id: 'nature-city',
    left: { icon: '🌿', label: { ko: '자연', en: 'Nature', ja: '自然', 'zh-CN': '自然', 'zh-TW': '自然' } },
    right: { icon: '🏙️', label: { ko: '도시', en: 'City', ja: '都市', 'zh-CN': '城市', 'zh-TW': '城市' } },
    leftTags: ['nature', 'hiking', 'ocean', 'mountain'],
    rightTags: ['city', 'shopping', 'nightlife', 'cafe'],
  },
  {
    id: 'experience-photo',
    left: { icon: '🎭', label: { ko: '체험', en: 'Experience', ja: '体験', 'zh-CN': '体验', 'zh-TW': '體驗' } },
    right: { icon: '📸', label: { ko: '감상 & 사진', en: 'Sightseeing & Photo', ja: '観光＆写真', 'zh-CN': '观光拍照', 'zh-TW': '觀光拍照' } },
    leftTags: ['experience', 'workshop', 'food', 'market'],
    rightTags: ['landmark', 'scenic', 'instagram', 'sunset', 'photo'],
  },
  {
    id: 'shopping-healing',
    left: { icon: '🛍️', label: { ko: '쇼핑', en: 'Shopping', ja: 'ショッピング', 'zh-CN': '购物', 'zh-TW': '購物' } },
    right: { icon: '🧖', label: { ko: '힐링', en: 'Healing', ja: 'ヒーリング', 'zh-CN': '疗愈', 'zh-TW': '療癒' } },
    leftTags: ['shopping', 'market', 'city', 'trendy'],
    rightTags: ['spa', 'relax', 'nature', 'temple', 'meditation'],
  },
  {
    id: 'active-relax',
    left: { icon: '🏃', label: { ko: '활동적', en: 'Active', ja: 'アクティブ', 'zh-CN': '活跃', 'zh-TW': '活躍' } },
    right: { icon: '☕', label: { ko: '여유롭게', en: 'Relaxed', ja: 'ゆったり', 'zh-CN': '悠闲', 'zh-TW': '悠閒' } },
    leftTags: ['active', 'hiking', 'adventure', 'themepark'],
    rightTags: ['relax', 'cafe', 'spa', 'scenic'],
  },
  {
    id: 'solo-group',
    left: { icon: '🧘', label: { ko: '혼자', en: 'Solo', ja: 'ひとり', 'zh-CN': '独自', 'zh-TW': '獨自' } },
    right: { icon: '👥', label: { ko: '그룹', en: 'Group', ja: 'グループ', 'zh-CN': '团体', 'zh-TW': '團體' } },
    leftTags: ['solo', 'meditation', 'cafe', 'nature'],
    rightTags: ['group', 'festival', 'themepark', 'nightlife'],
  },
  {
    id: 'budget-luxury',
    left: { icon: '💰', label: { ko: '알뜰', en: 'Budget', ja: '節約', 'zh-CN': '经济', 'zh-TW': '經濟' } },
    right: { icon: '💎', label: { ko: '풍족', en: 'Luxury', ja: 'リッチ', 'zh-CN': '奢华', 'zh-TW': '奢華' } },
    leftTags: ['budget', 'market', 'street-food', 'nature'],
    rightTags: ['luxury', 'resort', 'fine-dining', 'shopping'],
  },
  {
    id: 'walking-driving',
    left: { icon: '🚶', label: { ko: '걷기', en: 'Walking', ja: '歩き', 'zh-CN': '步行', 'zh-TW': '步行' } },
    right: { icon: '🚗', label: { ko: '드라이브', en: 'Driving', ja: 'ドライブ', 'zh-CN': '自驾', 'zh-TW': '自駕' } },
    leftTags: ['walking', 'hiking', 'city', 'market'],
    rightTags: ['driving', 'coastal', 'scenic-road', 'countryside'],
  },
  {
    id: 'night-day',
    left: { icon: '🌙', label: { ko: '야경 & 야시장', en: 'Nightlife', ja: 'ナイトライフ', 'zh-CN': '夜景夜市', 'zh-TW': '夜景夜市' } },
    right: { icon: '☀️', label: { ko: '낮 활동', en: 'Daytime', ja: '昼間', 'zh-CN': '白天', 'zh-TW': '白天' } },
    leftTags: ['nightlife', 'night-market', 'sunset', 'bar'],
    rightTags: ['daytime', 'hiking', 'nature', 'landmark'],
  },
]

export interface CompanionOption {
  id: string
  icon: string
  label: I18nString
  tags: string[]
}

export const COMPANION_OPTIONS: CompanionOption[] = [
  { id: 'family', icon: '👨‍👩‍👧', label: { ko: '가족', en: 'Family', ja: '家族', 'zh-CN': '家庭', 'zh-TW': '家庭' }, tags: ['family', 'themepark', 'nature', 'relax'] },
  { id: 'friends', icon: '👫', label: { ko: '친구', en: 'Friends', ja: '友達', 'zh-CN': '朋友', 'zh-TW': '朋友' }, tags: ['group', 'active', 'nightlife', 'festival', 'instagram'] },
  { id: 'couple', icon: '💑', label: { ko: '연인', en: 'Couple', ja: 'カップル', 'zh-CN': '情侣', 'zh-TW': '情侶' }, tags: ['romantic', 'scenic', 'cafe', 'sunset', 'coastal'] },
]

// 슬라이더 값(-100 ~ +100) + 동행 → UserPreference
export function sliderToPreference(
  sliders: Record<string, number>,
  companion: string | null,
): UserPreference {
  const tags: Record<string, number> = {}

  for (const axis of SLIDER_AXES) {
    const raw = sliders[axis.id] ?? 0
    const value = raw / 100 // -1 ~ +1

    if (value < -0.1) {
      const strength = Math.abs(value)
      for (const tag of axis.leftTags) {
        tags[tag] = (tags[tag] || 0) + strength
      }
    } else if (value > 0.1) {
      for (const tag of axis.rightTags) {
        tags[tag] = (tags[tag] || 0) + value
      }
    } else {
      // 중간값 → 양쪽 약한 가중치
      for (const tag of [...axis.leftTags, ...axis.rightTags]) {
        tags[tag] = (tags[tag] || 0) + 0.3
      }
    }
  }

  if (companion) {
    const comp = COMPANION_OPTIONS.find(c => c.id === companion)
    if (comp) {
      for (const tag of comp.tags) {
        tags[tag] = (tags[tag] || 0) + 0.8
      }
    }
  }

  return { tags }
}

export function calculateCityScores(preference: UserPreference): CityScore[] {
  const results: CityScore[] = Object.entries(CITY_TAG_SCORES).map(([city, cityTags]) => {
    let score = 0
    let maxPossible = 0

    for (const [tag, userWeight] of Object.entries(preference.tags)) {
      if (userWeight <= 0) continue
      const cityWeight = cityTags[tag] || 0
      score += userWeight * cityWeight
      maxPossible += userWeight
    }

    // 정규화: raw 0~100 → 30~98 범위로 매핑 (최소 30% 보장, 최대 98%)
    const rawPercent = maxPossible > 0 ? (score / maxPossible) * 100 : 50
    const mapped = 30 + (rawPercent / 100) * 68
    const matchPercent = Math.min(98, Math.max(30, Math.round(mapped)))

    return { city, score, matchPercent }
  })

  const sorted = results.sort((a, b) => b.score - a.score)

  // 1~2위 격차가 5% 미만이면 1위 +5% 부스트 (구별감 부여)
  if (sorted.length >= 2) {
    const gap = sorted[0].matchPercent - sorted[1].matchPercent
    if (gap < 5) {
      sorted[0].matchPercent = Math.min(98, sorted[0].matchPercent + 5)
    }
  }

  return sorted
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
