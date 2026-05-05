/**
 * 서버/클라이언트 양쪽에서 import 가능한 순수 상수 + 타입.
 * scholar/warrior 분기 폐기 (2026-05) — 단일 경로 1~10 레벨.
 */

export const LEVEL_THRESHOLDS = [
  0,      // Lv 1
  100,    // Lv 2
  300,    // Lv 3
  700,    // Lv 4
  1_500,  // Lv 5
  3_000,  // Lv 6
  6_000,  // Lv 7
  12_000, // Lv 8
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

export interface UserRankResult {
  level: number
  raindrops: number
  raindropsToNext: number
  progressPercent: number
  isMaxLevel: boolean
}
