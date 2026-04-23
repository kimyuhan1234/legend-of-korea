import { createClient } from '@/lib/supabase/server'

export type TechTreeRoute = 'scholar' | 'warrior'

/**
 * 빗방울(total_lp) → 레벨 임계값 (1~10).
 * 공통 구간 Lv 1~3, 그 이후 분기(Lv 4+).
 * 10단계 체계로 기존 tiers(1~6)와는 독립적으로 동작.
 */
export const LEVEL_THRESHOLDS = [
  0,      // Lv 1
  100,    // Lv 2
  300,    // Lv 3
  700,    // Lv 4 ← 분기 필요
  1_500,  // Lv 5
  3_000,  // Lv 6
  6_000,  // Lv 7
  12_000, // Lv 8 (특수직)
  25_000, // Lv 9
  50_000, // Lv 10
] as const

const MAX_LEVEL = LEVEL_THRESHOLDS.length // 10

export function calculateLevelFromRaindrops(raindrops: number): number {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (raindrops >= LEVEL_THRESHOLDS[i]) level = i + 1
    else break
  }
  return Math.min(level, MAX_LEVEL)
}

interface TierTitleRow {
  level: number
  route: string
  name_ko: string
  name_en: string
  name_ja: string
  name_zh_cn: string
  name_zh_tw: string
  emoji: string
  is_special: boolean
}

function pickName(row: TierTitleRow, locale: string): string {
  switch (locale) {
    case 'en': return row.name_en
    case 'ja': return row.name_ja
    case 'zh-CN': return row.name_zh_cn
    case 'zh-TW': return row.name_zh_tw
    default: return row.name_ko
  }
}

export interface RankTitle {
  name: string
  emoji: string
  isSpecial: boolean
  level: number
  route: string
}

export interface UserRankResult {
  level: number
  route: TechTreeRoute | null
  currentTitle: RankTitle | null
  nextTitle: RankTitle | null
  raindrops: number
  raindropsToNext: number
  progressPercent: number
  /** Lv 4+인데 route=null — 분기 선택 모달 강제 필요 */
  needsBranchSelection: boolean
  /** 최고 레벨 도달 */
  isMaxLevel: boolean
}

function findTitle(rows: TierTitleRow[], level: number, route: string): TierTitleRow | undefined {
  return rows.find((r) => r.level === level && r.route === route)
}

/**
 * 현재 요청 사용자의 랭크 정보를 조회.
 * 비로그인이면 null 반환.
 */
export async function getUserRank(locale: string): Promise<UserRankResult | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: userRow }, { data: titles }] = await Promise.all([
    supabase
      .from('users')
      .select('total_lp, tech_tree_route')
      .eq('id', user.id)
      .maybeSingle<{ total_lp: number; tech_tree_route: string | null }>(),
    supabase
      .from('tier_titles')
      .select('level, route, name_ko, name_en, name_ja, name_zh_cn, name_zh_tw, emoji, is_special')
      .returns<TierTitleRow[]>(),
  ])

  const raindrops = userRow?.total_lp ?? 0
  const rawRoute = userRow?.tech_tree_route
  const route: TechTreeRoute | null = rawRoute === 'scholar' || rawRoute === 'warrior' ? rawRoute : null

  const level = calculateLevelFromRaindrops(raindrops)
  const isMaxLevel = level >= MAX_LEVEL
  const needsBranchSelection = level >= 4 && route === null

  const rows = titles ?? []

  // 현재 직책 선택: Lv 1~3 공통, Lv 4+ route 기반
  const currentRouteKey = level <= 3 ? 'common' : (route ?? null)
  const currentRow = currentRouteKey ? findTitle(rows, level, currentRouteKey) : undefined

  // 다음 직책: 현재 레벨+1, route 결정
  let nextRow: TierTitleRow | undefined
  if (!isMaxLevel) {
    const nextLevel = level + 1
    const nextRouteKey = nextLevel <= 3 ? 'common' : (route ?? currentRouteKey ?? null)
    nextRow = nextRouteKey ? findTitle(rows, nextLevel, nextRouteKey) : undefined
  }

  // 진행률 계산: 현재 레벨 ~ 다음 레벨 구간
  const currThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextThreshold = isMaxLevel ? currThreshold : (LEVEL_THRESHOLDS[level] ?? currThreshold)
  const span = Math.max(1, nextThreshold - currThreshold)
  const earned = Math.max(0, raindrops - currThreshold)
  const progressPercent = isMaxLevel ? 100 : Math.min(100, Math.round((earned / span) * 100))
  const raindropsToNext = isMaxLevel ? 0 : Math.max(0, nextThreshold - raindrops)

  return {
    level,
    route,
    currentTitle: currentRow
      ? { name: pickName(currentRow, locale), emoji: currentRow.emoji, isSpecial: currentRow.is_special, level: currentRow.level, route: currentRow.route }
      : null,
    nextTitle: nextRow
      ? { name: pickName(nextRow, locale), emoji: nextRow.emoji, isSpecial: nextRow.is_special, level: nextRow.level, route: nextRow.route }
      : null,
    raindrops,
    raindropsToNext,
    progressPercent,
    needsBranchSelection,
    isMaxLevel,
  }
}
