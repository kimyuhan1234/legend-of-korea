/**
 * 9개 도시 → TourAPI 지역코드 매핑
 * 표준 TourAPI areaCode:
 *  1=서울, 6=부산, 31=경기, 34=충남, 35=경북, 36=경남, 37=전북, 39=제주
 * sigunguCode는 지역 하위 시군구 — 반드시 TourAPI의 areaCode2 엔드포인트로 확인 후 조정 필요.
 */
export const CITY_AREA_CODES: Record<string, { areaCode: number; sigunguCode?: number }> = {
  // 7 광역시
  seoul:     { areaCode: 1 },
  incheon:   { areaCode: 2 },
  daejeon:   { areaCode: 3 },
  daegu:     { areaCode: 4 },
  gwangju:   { areaCode: 5 },
  busan:     { areaCode: 6 },
  ulsan:     { areaCode: 7 },
  sejong:    { areaCode: 8 },
  // 광역도 (광역시 외 — Phase 8 Step 4 로컬 픽 17 도시 매핑용)
  gyeonggi:  { areaCode: 31 },
  gangwon:   { areaCode: 32 },
  chungbuk:  { areaCode: 33 },
  chungnam:  { areaCode: 34 },
  gyeongbuk: { areaCode: 35 },
  gyeongnam: { areaCode: 36 },
  jeonbuk:   { areaCode: 37 },
  jeonnam:   { areaCode: 38 },
  // 시군구 단위 (food-dupes 음식 region 과 매칭)
  // sigunguCode 는 TourAPI 4.0 areaCode2 표준 매핑 (검증 완료 — 진단 보고 2026-05-03)
  gyeongju:  { areaCode: 35, sigunguCode: 2 },   // 경주시
  jeonju:    { areaCode: 37, sigunguCode: 12 },  // 전주시
  tongyeong: { areaCode: 36, sigunguCode: 17 },  // 통영시 (구 10=양산시 오류 수정)
  cheonan:   { areaCode: 34, sigunguCode: 12 },  // 천안시 (구 4=당진시 오류 수정)
  yongin:    { areaCode: 31, sigunguCode: 23 },  // 용인시 (구 13=수원시 오류 수정)
  icheon:    { areaCode: 31, sigunguCode: 26 },  // 이천시 (구 4=광명시 오류 수정)
  sokcho:    { areaCode: 32, sigunguCode: 5 },   // 속초시 (구 7=양양군 오류 수정)
  yeosu:     { areaCode: 38, sigunguCode: 13 },  // 여수시 (구 12=신안군 오류 수정)
  andong:    { areaCode: 35, sigunguCode: 11 },  // 안동시 (구 7=문경시 오류 수정)
  // 신규 18 도시 (1단계 등록 — sigunguCode TourAPI 표준 검증 완료)
  suwon:        { areaCode: 31, sigunguCode: 13 },  // 수원시
  hwaseong:     { areaCode: 31, sigunguCode: 31 },  // 화성시
  gapyeong:     { areaCode: 31, sigunguCode: 1 },   // 가평군
  yangpyeong:   { areaCode: 31, sigunguCode: 19 },  // 양평군
  gangneung:    { areaCode: 32, sigunguCode: 1 },   // 강릉시
  pyeongchang:  { areaCode: 32, sigunguCode: 15 },  // 평창군
  yangyang:     { areaCode: 32, sigunguCode: 7 },   // 양양군
  yeongwol:     { areaCode: 32, sigunguCode: 8 },   // 영월군
  gongju:       { areaCode: 34, sigunguCode: 1 },   // 공주시
  buyeo:        { areaCode: 34, sigunguCode: 6 },   // 부여군
  taean:        { areaCode: 34, sigunguCode: 14 },  // 태안군
  pohang:       { areaCode: 35, sigunguCode: 23 },  // 포항시
  ulleung:      { areaCode: 35, sigunguCode: 17 },  // 울릉군
  geoje:        { areaCode: 36, sigunguCode: 1 },   // 거제시
  namhae:       { areaCode: 36, sigunguCode: 5 },   // 남해군
  gunsan:       { areaCode: 37, sigunguCode: 2 },   // 군산시
  damyang:      { areaCode: 38, sigunguCode: 7 },   // 담양군
  boseong:      { areaCode: 38, sigunguCode: 10 },  // 보성군
  // jeju 광역도 = 시군구 단위 (제주특별자치도 = 39, sigungu 분리 X)
  jeju:      { areaCode: 39 },
  // national — 전국 fallback (서울 areaCode 사용)
  national:  { areaCode: 1 },
}

export const CONTENT_TYPES = {
  tourist: 12,
  culture: 14,
  festival: 15,
  course: 25,
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

/**
 * TourAPI areaCode → 광역 region slug 역매핑.
 * 응답 item.areacode 로 region 결정 시 사용.
 */
const AREA_CODE_TO_REGION: Record<string, string> = (() => {
  const map: Record<string, string> = {}
  for (const [region, info] of Object.entries(PROVINCE_AREA_CODES)) {
    map[String(info.areaCode)] = region
  }
  return map
})()

/**
 * lDongRegnCd (KS X 1062 행정구역 코드, 2자리) → 광역 region slug 매핑.
 * TourAPI 4.0 응답에서 areacode 가 빈 문자열인 경우 lDongRegnCd 로 region 결정.
 */
const LDONG_REGN_TO_REGION: Record<string, string> = {
  '11': 'seoul',
  '26': 'busan',
  '27': 'daegu',
  '28': 'incheon',
  '29': 'gwangju',
  '30': 'daejeon',
  '31': 'ulsan',
  '36': 'sejong',
  '41': 'gyeonggi',
  '43': 'chungbuk',
  '44': 'chungnam',
  '46': 'jeonnam',
  '47': 'gyeongbuk',
  '48': 'gyeongnam',
  '50': 'jeju',
  '51': 'gangwon',
  '52': 'jeonbuk',
}

/**
 * 응답 item 의 areacode / lDongRegnCd 로 광역 region 결정.
 * 두 필드 모두 비어있으면 fallback ('national').
 */
export function resolveRegionFromItem(item: { areacode?: string; lDongRegnCd?: string }): string {
  const areaCode = item.areacode?.trim()
  if (areaCode && AREA_CODE_TO_REGION[areaCode]) return AREA_CODE_TO_REGION[areaCode]
  const lDong = item.lDongRegnCd?.trim()
  if (lDong && LDONG_REGN_TO_REGION[lDong]) return LDONG_REGN_TO_REGION[lDong]
  return 'national'
}
