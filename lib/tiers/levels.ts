/**
 * 서버/클라이언트 양쪽에서 import 가능한 순수 상수 + 타입.
 * (get-user-rank.ts 는 server-only cookies() 를 쓰므로 여기로 분리)
 */

export type TechTreeRoute = 'scholar' | 'warrior'

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

export const MAX_LEVEL = LEVEL_THRESHOLDS.length

export function calculateLevelFromRaindrops(raindrops: number): number {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (raindrops >= LEVEL_THRESHOLDS[i]) level = i + 1
    else break
  }
  return Math.min(level, MAX_LEVEL)
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
  needsBranchSelection: boolean
  isMaxLevel: boolean
}
