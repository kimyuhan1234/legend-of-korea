// 17개 광역시도 좌표 (Open-Meteo API용)
// - id는 OOTD_REGIONS와 일치
// - 기존 CITY_COORDS 이름 유지 (backward compat, 실제로는 광역시도 단위)
export interface CityCoord {
  id: string
  name: { ko: string; en: string; ja: string }
  lat: number
  lon: number
}

export const CITY_COORDS: CityCoord[] = [
  { id: 'seoul',     name: { ko: '서울',   en: 'Seoul',     ja: 'ソウル' },     lat: 37.5665, lon: 126.9780 },
  { id: 'gyeonggi',  name: { ko: '경기',   en: 'Gyeonggi',  ja: '京畿' },       lat: 37.2636, lon: 127.0286 },
  { id: 'incheon',   name: { ko: '인천',   en: 'Incheon',   ja: '仁川' },       lat: 37.4563, lon: 126.7052 },
  { id: 'gangwon',   name: { ko: '강원',   en: 'Gangwon',   ja: '江原' },       lat: 37.8813, lon: 127.7298 },
  { id: 'chungbuk',  name: { ko: '충북',   en: 'Chungbuk',  ja: '忠清北道' },    lat: 36.6424, lon: 127.4890 },
  { id: 'chungnam',  name: { ko: '충남',   en: 'Chungnam',  ja: '忠清南道' },    lat: 36.6014, lon: 126.6610 },
  { id: 'daejeon',   name: { ko: '대전',   en: 'Daejeon',   ja: '大田' },       lat: 36.3504, lon: 127.3845 },
  { id: 'sejong',    name: { ko: '세종',   en: 'Sejong',    ja: '世宗' },       lat: 36.4875, lon: 127.2817 },
  { id: 'jeonbuk',   name: { ko: '전북',   en: 'Jeonbuk',   ja: '全羅北道' },    lat: 35.8242, lon: 127.1480 },
  { id: 'jeonnam',   name: { ko: '전남',   en: 'Jeonnam',   ja: '全羅南道' },    lat: 34.8118, lon: 126.4628 },
  { id: 'gwangju',   name: { ko: '광주',   en: 'Gwangju',   ja: '光州' },       lat: 35.1595, lon: 126.8526 },
  { id: 'gyeongbuk', name: { ko: '경북',   en: 'Gyeongbuk', ja: '慶尚北道' },    lat: 36.5760, lon: 128.7286 },
  { id: 'gyeongnam', name: { ko: '경남',   en: 'Gyeongnam', ja: '慶尚南道' },    lat: 35.2280, lon: 128.6817 },
  { id: 'daegu',     name: { ko: '대구',   en: 'Daegu',     ja: '大邱' },       lat: 35.8714, lon: 128.6014 },
  { id: 'ulsan',     name: { ko: '울산',   en: 'Ulsan',     ja: '蔚山' },       lat: 35.5384, lon: 129.3114 },
  { id: 'busan',     name: { ko: '부산',   en: 'Busan',     ja: '釜山' },       lat: 35.1796, lon: 129.0756 },
  { id: 'jeju',      name: { ko: '제주',   en: 'Jeju',      ja: '済州' },       lat: 33.4996, lon: 126.5312 },
]
