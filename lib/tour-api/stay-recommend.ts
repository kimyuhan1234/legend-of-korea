import type { NormalizedStay } from './stays'
import { STAY_TAG_AXES, type StayTags } from './stay-tags'

/**
 * 유저 성향 vs 숙소 태그 매칭 점수 (0~100).
 *
 * 각 축 -5~+5이므로 한 축 최대 거리 = 10.
 * 9축 평균 거리로 환산 후 100 스케일로 변환.
 *
 *   완전 일치  (avg_diff=0)  → 100
 *   완전 반대  (avg_diff=10) → 0
 */
export function calculateMatchScore(userPreferences: StayTags, stayTags: StayTags): number {
  let totalDiff = 0
  for (const axis of STAY_TAG_AXES) {
    totalDiff += Math.abs(userPreferences[axis] - stayTags[axis])
  }
  const avgDiff = totalDiff / STAY_TAG_AXES.length
  const score = 100 - (avgDiff / 10) * 100
  return Math.max(0, Math.min(100, Math.round(score)))
}

export interface RankedStay extends NormalizedStay {
  matchScore: number
}

/**
 * 유저 성향으로 숙소 배열 정렬. tags 없는 숙소는 0점 처리.
 */
export function rankStaysByPreferences(
  stays: NormalizedStay[],
  userPreferences: StayTags
): RankedStay[] {
  return stays
    .map((s) => ({
      ...s,
      matchScore: s.tags ? calculateMatchScore(userPreferences, s.tags) : 0,
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * 쿼리 파라미터에서 부분 성향을 읽어 StayTags로 변환.
 * 전달 안 된 축은 0(중립).
 * 키 이름은 StayTags 축 이름 또는 "단축 키":
 *   urban=5 → urban-nature: -5
 *   nature=5 → urban-nature: +5
 *   modern=5 → modern-traditional: -5
 *   traditional=5 → modern-traditional: +5
 *   etc.
 */
export function parsePreferencesFromQuery(params: URLSearchParams): StayTags {
  const prefs: StayTags = {
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

  // 정축(오른쪽 성향) 별칭
  const RIGHT_ALIAS: Record<string, keyof StayTags> = {
    quiet: 'busy-quiet',
    traditional: 'modern-traditional',
    premium: 'budget-premium',
    family: 'solo-family',
    long: 'short-long',
    outdoor: 'indoor-outdoor',
    nature: 'urban-nature',
    luxury: 'casual-luxury',
    practical: 'insta-practical',
  }
  // 역축(왼쪽 성향) 별칭
  const LEFT_ALIAS: Record<string, keyof StayTags> = {
    busy: 'busy-quiet',
    modern: 'modern-traditional',
    budget: 'budget-premium',
    solo: 'solo-family',
    short: 'short-long',
    indoor: 'indoor-outdoor',
    urban: 'urban-nature',
    casual: 'casual-luxury',
    insta: 'insta-practical',
  }

  // 1) 축 이름 그대로 전달 시
  for (const axis of STAY_TAG_AXES) {
    const raw = params.get(axis)
    if (raw !== null) {
      const v = parseInt(raw, 10)
      if (!Number.isNaN(v)) prefs[axis] = Math.max(-5, Math.min(5, v))
    }
  }

  // 2) 단축 키 (오른쪽 성향: 양수)
  for (const [alias, axis] of Object.entries(RIGHT_ALIAS)) {
    const raw = params.get(alias)
    if (raw !== null) {
      const v = parseInt(raw, 10)
      if (!Number.isNaN(v)) prefs[axis] = Math.max(-5, Math.min(5, v))
    }
  }

  // 3) 단축 키 (왼쪽 성향: 음수로 반전)
  for (const [alias, axis] of Object.entries(LEFT_ALIAS)) {
    const raw = params.get(alias)
    if (raw !== null) {
      const v = parseInt(raw, 10)
      if (!Number.isNaN(v)) prefs[axis] = Math.max(-5, Math.min(5, -v))
    }
  }

  return prefs
}
