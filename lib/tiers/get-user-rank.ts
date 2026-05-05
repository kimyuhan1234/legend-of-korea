import { createClient } from '@/lib/supabase/server'
import {
  LEVEL_THRESHOLDS,
  MAX_LEVEL,
  calculateLevelFromRaindrops,
  type UserRankResult,
} from './levels'

export { LEVEL_THRESHOLDS, calculateLevelFromRaindrops }
export type { UserRankResult }

/**
 * 현재 요청 사용자의 랭크 정보를 조회.
 * 비로그인이면 null. scholar/warrior 분기 폐기 후 단순 레벨/빗방울 계산만.
 */
export async function getUserRank(_locale: string): Promise<UserRankResult | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: userRow } = await supabase
    .from('users')
    .select('total_lp, current_level')
    .eq('id', user.id)
    .maybeSingle<{ total_lp: number; current_level: number | null }>()

  const raindrops = userRow?.total_lp ?? 0
  const level = typeof userRow?.current_level === 'number' && userRow.current_level >= 1
    ? Math.min(MAX_LEVEL, userRow.current_level)
    : calculateLevelFromRaindrops(raindrops)
  const isMaxLevel = level >= MAX_LEVEL

  // 진행률 계산: 현재 레벨 ~ 다음 레벨 구간
  const currThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextThreshold = isMaxLevel ? currThreshold : (LEVEL_THRESHOLDS[level] ?? currThreshold)
  const span = Math.max(1, nextThreshold - currThreshold)
  const earned = Math.max(0, raindrops - currThreshold)
  const progressPercent = isMaxLevel ? 100 : Math.min(100, Math.round((earned / span) * 100))
  const raindropsToNext = isMaxLevel ? 0 : Math.max(0, nextThreshold - raindrops)

  return {
    level,
    raindrops,
    raindropsToNext,
    progressPercent,
    isMaxLevel,
  }
}
