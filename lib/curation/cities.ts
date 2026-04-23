type I18n = { ko: string; en: string; ja: string; 'zh-CN': string; 'zh-TW': string }

export interface CityInfo {
  code: string
  emoji: string
  name: I18n
}

// 전국 17개 광역시도 + 레거시 6개 하위 시군 (기존 코스·SIGHTS 정적 데이터 호환 유지)
export const CITIES: CityInfo[] = [
  // ── 17개 광역시도 (TourAPI PROVINCE_AREA_CODES 기반) ──
  { code: 'seoul',     emoji: '🏙️', name: { ko: '서울', en: 'Seoul', ja: 'ソウル', 'zh-CN': '首尔', 'zh-TW': '首爾' } },
  { code: 'incheon',   emoji: '✈️', name: { ko: '인천', en: 'Incheon', ja: '仁川', 'zh-CN': '仁川', 'zh-TW': '仁川' } },
  { code: 'daejeon',   emoji: '🔬', name: { ko: '대전', en: 'Daejeon', ja: '大田', 'zh-CN': '大田', 'zh-TW': '大田' } },
  { code: 'daegu',     emoji: '🍎', name: { ko: '대구', en: 'Daegu', ja: '大邱', 'zh-CN': '大邱', 'zh-TW': '大邱' } },
  { code: 'gwangju',   emoji: '🌻', name: { ko: '광주', en: 'Gwangju', ja: '光州', 'zh-CN': '光州', 'zh-TW': '光州' } },
  { code: 'busan',     emoji: '🌊', name: { ko: '부산', en: 'Busan', ja: '釜山', 'zh-CN': '釜山', 'zh-TW': '釜山' } },
  { code: 'ulsan',     emoji: '🐳', name: { ko: '울산', en: 'Ulsan', ja: '蔚山', 'zh-CN': '蔚山', 'zh-TW': '蔚山' } },
  { code: 'sejong',    emoji: '🏛️', name: { ko: '세종', en: 'Sejong', ja: '世宗', 'zh-CN': '世宗', 'zh-TW': '世宗' } },
  { code: 'gyeonggi',  emoji: '🌆', name: { ko: '경기도', en: 'Gyeonggi', ja: '京畿道', 'zh-CN': '京畿道', 'zh-TW': '京畿道' } },
  { code: 'gangwon',   emoji: '⛰️', name: { ko: '강원도', en: 'Gangwon', ja: '江原道', 'zh-CN': '江原道', 'zh-TW': '江原道' } },
  { code: 'chungbuk',  emoji: '🌾', name: { ko: '충청북도', en: 'Chungbuk', ja: '忠清北道', 'zh-CN': '忠清北道', 'zh-TW': '忠清北道' } },
  { code: 'chungnam',  emoji: '🌊', name: { ko: '충청남도', en: 'Chungnam', ja: '忠清南道', 'zh-CN': '忠清南道', 'zh-TW': '忠清南道' } },
  { code: 'gyeongbuk', emoji: '🏯', name: { ko: '경상북도', en: 'Gyeongbuk', ja: '慶尚北道', 'zh-CN': '庆尚北道', 'zh-TW': '慶尚北道' } },
  { code: 'gyeongnam', emoji: '⛵', name: { ko: '경상남도', en: 'Gyeongnam', ja: '慶尚南道', 'zh-CN': '庆尚南道', 'zh-TW': '慶尚南道' } },
  { code: 'jeonbuk',   emoji: '🏮', name: { ko: '전라북도', en: 'Jeonbuk', ja: '全羅北道', 'zh-CN': '全罗北道', 'zh-TW': '全羅北道' } },
  { code: 'jeonnam',   emoji: '🎋', name: { ko: '전라남도', en: 'Jeonnam', ja: '全羅南道', 'zh-CN': '全罗南道', 'zh-TW': '全羅南道' } },
  { code: 'jeju',      emoji: '🌴', name: { ko: '제주', en: 'Jeju', ja: '済州', 'zh-CN': '济州', 'zh-TW': '濟州' } },
  // ── 레거시 하위 시군 (SIGHTS 정적 데이터·코스 region 호환용) ──
  { code: 'gyeongju',  emoji: '👑', name: { ko: '경주', en: 'Gyeongju', ja: '慶州', 'zh-CN': '庆州', 'zh-TW': '慶州' } },
  { code: 'jeonju',    emoji: '🏮', name: { ko: '전주', en: 'Jeonju', ja: '全州', 'zh-CN': '全州', 'zh-TW': '全州' } },
  { code: 'tongyeong', emoji: '⛵', name: { ko: '통영', en: 'Tongyeong', ja: '統営', 'zh-CN': '统营', 'zh-TW': '統營' } },
  { code: 'cheonan',   emoji: '🎋', name: { ko: '천안', en: 'Cheonan', ja: '天安', 'zh-CN': '天安', 'zh-TW': '天安' } },
  { code: 'yongin',    emoji: '🎢', name: { ko: '용인', en: 'Yongin', ja: '龍仁', 'zh-CN': '龙仁', 'zh-TW': '龍仁' } },
  { code: 'icheon',    emoji: '🏺', name: { ko: '이천', en: 'Icheon', ja: '利川', 'zh-CN': '利川', 'zh-TW': '利川' } },
]

export function getCityInfo(code: string): CityInfo | undefined {
  return CITIES.find(c => c.code === code)
}

export function getCityName(code: string, locale: string): string {
  const info = getCityInfo(code)
  if (!info) return code
  return (info.name as Record<string, string>)[locale] || info.name.en || info.name.ko
}
