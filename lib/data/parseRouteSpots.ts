/**
 * Phase 2 SPOT 이미지 자동 매칭 — 분해 파서.
 *
 * courses.ts 의 highlights.recommendedRoute (5 locale 자유 텍스트 한 줄) 을
 * 컴포넌트 런타임에 spot 단위로 분해. 데이터 구조는 그대로 보존 (하이브리드).
 *
 * 분해 로직 (5 locale 동일):
 *  1. "→" / " → " split
 *  2. 괄호 부연 제거 — 한국어 () + 일본어/중국어 （） 모두
 *  3. "또는" / "または" / " or " / "或" 분리
 *  4. 빈 문자열 / 공백 제거
 *
 * 음식 spot 자동 분류 (kind: 'food'):
 *  - 5 locale 음식 keyword 명단 (운영자 결정 — 호두과자 거리 / 이천 쌀밥 정식)
 *  - 분해 결과 spot 명이 일치하면 kind: 'food' (이미지 매칭 skip)
 *  - 그 외 모두 kind: 'attraction'
 */

export type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

export type SpotKind = 'food' | 'attraction'

export interface ParsedSpot {
  name: string
  kind: SpotKind
}

/**
 * 음식 spot keyword 명단 — 5 locale 운영자 결정 그대로 hardcoded.
 * 분해 결과 spot 명이 정확 일치하면 kind: 'food'.
 */
const FOOD_KEYWORDS: Record<Locale, readonly string[]> = {
  ko: ['호두과자 거리', '이천 쌀밥 정식'],
  ja: ['クルミ菓子通り', '利川コメご飯定食'],
  en: ['Walnut Cookie Street', 'Icheon Rice Course Meal'],
  'zh-CN': ['核桃饼街', '利川米饭定食'],
  'zh-TW': ['核桃餅街', '利川米飯定食'],
}

/**
 * 괄호 부연 제거 — 한국어 () + 일본어/중국어 전각 （） 모두.
 * 중첩 괄호는 단순 비-greedy 매칭 — Phase 1+1.5 기준 데이터에 중첩 사례 없음.
 */
function stripParens(s: string): string {
  return s
    .replace(/\([^)]*\)/g, '')
    .replace(/（[^）]*）/g, '')
    .trim()
}

/**
 * "또는" / "または" / "or" / "或" 분리.
 * 5 locale 모두 처리 — input 이 어느 locale 이든 매칭.
 *
 * 정규식 설계:
 *  - 또는 / または / 或 — 한글/일본어/한자 단독, 다른 단어 안에 포함될 위험 없음
 *  - or — 영단어 안에 포함 가능 (예: "Color" 의 "or") → \bor\b (word boundary)
 *  - 한자/한글 양옆에서도 \b 가 작동 (CJK 는 non-word 로 처리)
 */
function splitAlternatives(s: string): string[] {
  return s
    .split(/또는|または|\bor\b|或/)
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
}

/**
 * 5 locale 자유 텍스트 → spot 배열 분해.
 *
 * @param text I18n3 텍스트 1줄 (예: "경기전 → 한옥마을 골목길 → 풍남문 → 남부시장 야시장")
 * @param locale 음식 keyword 매칭 시 5 locale 명단 중 어느 locale 사용할지
 * @returns ParsedSpot 배열 (name + kind)
 */
export function parseRouteSpots(text: string, locale: Locale): ParsedSpot[] {
  if (!text) return []
  const foodSet = new Set(FOOD_KEYWORDS[locale])

  return text
    .split(/\s*→\s*/)
    .map((s) => stripParens(s))
    .filter((s) => s.length > 0)
    .flatMap((s) => splitAlternatives(s))
    .map((name) => ({
      name,
      kind: foodSet.has(name) ? ('food' as const) : ('attraction' as const),
    }))
}
