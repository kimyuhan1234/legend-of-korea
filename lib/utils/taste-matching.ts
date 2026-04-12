import type { TasteProfile, RegionalFood, Region } from '@/lib/data/food-dupes'
import type { FusionRecipe } from '@/lib/data/flag-cooking'

// ─── 코사인 유사도 기반 맛 매칭 점수 (0~100) ───
export function calculateTasteMatch(
  userPref: TasteProfile,
  foodProfile: TasteProfile
): number {
  const keys: (keyof TasteProfile)[] = ['sweet', 'salty', 'spicy', 'umami', 'sour']
  const a = keys.map((k) => userPref[k])
  const b = keys.map((k) => foodProfile[k])

  const dotProduct = a.reduce((sum, v, i) => sum + v * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0))
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0))

  if (magA === 0 || magB === 0) return 0
  const cosine = dotProduct / (magA * magB)
  return Math.round(cosine * 100)
}

// ─── matchReason 자동 생성 ───
function generateMatchReason(
  pref: TasteProfile,
  food: TasteProfile
): { ko: string; en: string; ja: string } {
  const keys: (keyof TasteProfile)[] = ['sweet', 'salty', 'spicy', 'umami', 'sour']
  const labels = {
    sweet: { ko: '단맛', en: 'sweetness', ja: '甘さ' },
    salty: { ko: '짠맛', en: 'saltiness', ja: '塩味' },
    spicy: { ko: '매운맛', en: 'spiciness', ja: '辛さ' },
    umami: { ko: '감칠맛', en: 'umami', ja: '旨味' },
    sour: { ko: '신맛', en: 'sourness', ja: '酸味' },
  }

  // 유저가 높게 평가한 맛 중 음식도 높은 것 찾기
  const matches = keys
    .filter((k) => pref[k] >= 50 && food[k] >= 50)
    .sort((a, b) => Math.min(pref[b], food[b]) - Math.min(pref[a], food[a]))
    .slice(0, 2)

  if (matches.length === 0) {
    return {
      ko: '전체적으로 균형잡힌 맛',
      en: 'Balanced overall flavor',
      ja: '全体的にバランスの取れた味',
    }
  }

  if (matches.length === 1) {
    const l = labels[matches[0]]
    return {
      ko: `${l.ko}이 딱 맞아요`,
      en: `${l.en} is a perfect match`,
      ja: `${l.ja}がぴったり`,
    }
  }

  const l1 = labels[matches[0]]
  const l2 = labels[matches[1]]
  return {
    ko: `${l1.ko}+${l2.ko} 조합이 잘 맞아요`,
    en: `Great ${l1.en}+${l2.en} combination`,
    ja: `${l1.ja}+${l2.ja}の組み合わせがぴったり`,
  }
}

// ─── 결과 타입 ───
export interface MatchResult {
  food: RegionalFood
  regionCode: string
  regionName: { ko: string; en: string; ja: string }
  matchScore: number
  matchReason: { ko: string; en: string; ja: string }
}

export interface FlagCookingResult {
  recipe: FusionRecipe
  connectionReason: { ko: string; en: string; ja: string }
}

// ─── 90개 음식에서 취향 TOP 3 ───
export function getTopMatchingFoods(
  userPref: TasteProfile,
  regions: Region[]
): MatchResult[] {
  const all: MatchResult[] = []

  for (const region of regions) {
    for (const food of region.foods) {
      const score = calculateTasteMatch(userPref, food.tasteProfile)
      all.push({
        food,
        regionCode: region.code,
        regionName: region.name,
        matchScore: score,
        matchReason: generateMatchReason(userPref, food.tasteProfile),
      })
    }
  }

  return all.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
}

// ─── 플래그 쿠킹에서 서프라이즈 2개 ───
// TOP 3 음식의 koreanBase 와 연결되는 것 우선, 없으면 취향 기반 랜덤
export function getSurpriseFlagCooking(
  userPref: TasteProfile,
  topFoods: MatchResult[],
  recipes: FusionRecipe[]
): FlagCookingResult[] {
  if (recipes.length === 0) return []

  // TOP 3 음식의 한국어 이름으로 koreanBase 매칭
  const topNames = new Set(topFoods.map((f) => f.food.name.ko))

  const connected = recipes.filter((r) =>
    topNames.has(r.koreanBase.ko)
  )

  // 취향 점수 계산 (flag-cooking 의 TasteProfile5 는 0~5 스케일이라 ×20 변환)
  function flagScore(r: FusionRecipe): number {
    const tp = r.tasteProfile
    const scaled: TasteProfile = {
      sweet: tp.sweet * 20,
      salty: tp.salty * 20,
      spicy: tp.spicy * 20,
      umami: tp.umami * 20,
      sour: tp.sour * 20,
    }
    return calculateTasteMatch(userPref, scaled)
  }

  // 연결된 것 우선, 부족하면 전체에서 취향 높은 것
  const result: FlagCookingResult[] = []
  const used = new Set<string>()

  // 우선순위 1: TOP 3 와 연결된 레시피
  const sortedConnected = connected.sort((a, b) => flagScore(b) - flagScore(a))
  for (const r of sortedConnected) {
    if (result.length >= 2) break
    if (used.has(r.id)) continue
    used.add(r.id)
    const baseName = r.koreanBase.ko
    result.push({
      recipe: r,
      connectionReason: {
        ko: `${baseName}을 좋아하신다면 이 퓨전도!`,
        en: `If you like ${r.koreanBase.en}, try this fusion!`,
        ja: `${r.koreanBase.ja}が好きならこのフュージョンも！`,
      },
    })
  }

  // 부족하면 전체에서 점수 높은 것
  if (result.length < 2) {
    const remaining = recipes
      .filter((r) => !used.has(r.id))
      .sort((a, b) => flagScore(b) - flagScore(a))
    for (const r of remaining) {
      if (result.length >= 2) break
      used.add(r.id)
      result.push({
        recipe: r,
        connectionReason: {
          ko: '이 퓨전도 좋아할 거예요!',
          en: "You'll love this fusion too!",
          ja: 'このフュージョンもきっと好き！',
        },
      })
    }
  }

  return result
}
