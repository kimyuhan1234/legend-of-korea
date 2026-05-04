/**
 * 17 광역시도 중심 좌표 — KakaoMap 핀 표시용.
 * 기준: 각 광역의 청사 위치 (광역시는 시청, 광역도는 도청).
 * 사용처: components/features/spots/SpotCityView.tsx 지도 보기.
 */

export interface RegionCoordinate {
  code: string
  lat: number
  lng: number
}

export const REGION_COORDINATES: Record<string, RegionCoordinate> = {
  seoul:     { code: 'seoul',     lat: 37.5665, lng: 126.9780 }, // 서울특별시청
  incheon:   { code: 'incheon',   lat: 37.4563, lng: 126.7052 }, // 인천광역시청
  daejeon:   { code: 'daejeon',   lat: 36.3504, lng: 127.3845 }, // 대전광역시청
  daegu:     { code: 'daegu',     lat: 35.8714, lng: 128.6014 }, // 대구광역시청
  gwangju:   { code: 'gwangju',   lat: 35.1595, lng: 126.8526 }, // 광주광역시청
  busan:     { code: 'busan',     lat: 35.1796, lng: 129.0756 }, // 부산광역시청
  ulsan:     { code: 'ulsan',     lat: 35.5384, lng: 129.3114 }, // 울산광역시청
  sejong:    { code: 'sejong',    lat: 36.4801, lng: 127.2890 }, // 세종특별자치시청
  gyeonggi:  { code: 'gyeonggi',  lat: 37.2750, lng: 127.0094 }, // 경기도청 (수원)
  gangwon:   { code: 'gangwon',   lat: 37.8854, lng: 127.7298 }, // 강원특별자치도청 (춘천)
  chungbuk:  { code: 'chungbuk',  lat: 36.6359, lng: 127.4914 }, // 충청북도청 (청주)
  chungnam:  { code: 'chungnam',  lat: 36.6588, lng: 126.6728 }, // 충청남도청 (홍성·예산)
  gyeongbuk: { code: 'gyeongbuk', lat: 36.5759, lng: 128.5057 }, // 경상북도청 (안동)
  gyeongnam: { code: 'gyeongnam', lat: 35.2380, lng: 128.6921 }, // 경상남도청 (창원)
  jeonbuk:   { code: 'jeonbuk',   lat: 35.8242, lng: 127.1480 }, // 전북특별자치도청 (전주)
  jeonnam:   { code: 'jeonnam',   lat: 34.8161, lng: 126.4630 }, // 전라남도청 (무안)
  jeju:      { code: 'jeju',      lat: 33.4996, lng: 126.5312 }, // 제주특별자치도청
}

/** 한국 중앙 (KakaoMap 초기 중심점) — 17 광역 모두 보이는 위치 */
export const KOREA_CENTER = { lat: 36.3, lng: 127.8 }

/** 한국 전도 zoom level (KakaoMap level 1~14, 클수록 wide) */
export const KOREA_ZOOM_LEVEL = 13
