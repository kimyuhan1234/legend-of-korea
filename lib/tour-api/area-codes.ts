/**
 * 9개 도시 → TourAPI 지역코드 매핑
 * 표준 TourAPI areaCode:
 *  1=서울, 6=부산, 31=경기, 34=충남, 35=경북, 36=경남, 37=전북, 39=제주
 * sigunguCode는 지역 하위 시군구 — 반드시 TourAPI의 areaCode1 엔드포인트로 확인 후 조정 필요.
 */
export const CITY_AREA_CODES: Record<string, { areaCode: number; sigunguCode?: number }> = {
  seoul:     { areaCode: 1 },
  busan:     { areaCode: 6 },
  jeju:      { areaCode: 39 },
  gyeongju:  { areaCode: 35, sigunguCode: 2 },
  jeonju:    { areaCode: 37, sigunguCode: 12 },
  tongyeong: { areaCode: 36, sigunguCode: 10 },
  cheonan:   { areaCode: 34, sigunguCode: 4 },
  yongin:    { areaCode: 31, sigunguCode: 13 },
  icheon:    { areaCode: 31, sigunguCode: 4 },
}

export const CONTENT_TYPES = {
  tourist: 12,
  culture: 14,
  festival: 15,
  leisure: 28,
} as const
