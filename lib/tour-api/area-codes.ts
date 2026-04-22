/**
 * 9개 도시 → TourAPI 지역코드 매핑
 * 표준 TourAPI areaCode:
 *  1=서울, 6=부산, 31=경기, 34=충남, 35=경북, 36=경남, 37=전북, 39=제주
 * sigunguCode는 지역 하위 시군구 — 반드시 TourAPI의 areaCode2 엔드포인트로 확인 후 조정 필요.
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
  stay: 32,
} as const

/**
 * 전국 17개 광역시도 → TourAPI areaCode 매핑 (숙박 전국 검색용)
 * 출처: TourAPI areaCode2 표준
 */
export const PROVINCE_AREA_CODES: Record<string, { areaCode: number; nameKo: string }> = {
  seoul:     { areaCode: 1,  nameKo: '서울' },
  incheon:   { areaCode: 2,  nameKo: '인천' },
  daejeon:   { areaCode: 3,  nameKo: '대전' },
  daegu:     { areaCode: 4,  nameKo: '대구' },
  gwangju:   { areaCode: 5,  nameKo: '광주' },
  busan:     { areaCode: 6,  nameKo: '부산' },
  ulsan:     { areaCode: 7,  nameKo: '울산' },
  sejong:    { areaCode: 8,  nameKo: '세종' },
  gyeonggi:  { areaCode: 31, nameKo: '경기도' },
  gangwon:   { areaCode: 32, nameKo: '강원도' },
  chungbuk:  { areaCode: 33, nameKo: '충청북도' },
  chungnam:  { areaCode: 34, nameKo: '충청남도' },
  gyeongbuk: { areaCode: 35, nameKo: '경상북도' },
  gyeongnam: { areaCode: 36, nameKo: '경상남도' },
  jeonbuk:   { areaCode: 37, nameKo: '전라북도' },
  jeonnam:   { areaCode: 38, nameKo: '전라남도' },
  jeju:      { areaCode: 39, nameKo: '제주도' },
}
