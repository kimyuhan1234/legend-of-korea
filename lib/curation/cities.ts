type I18n = { ko: string; en: string; ja: string; 'zh-CN': string; 'zh-TW': string }

export interface CityInfo {
  code: string
  emoji: string
  name: I18n
}

export const CITIES: CityInfo[] = [
  { code: 'seoul',     emoji: '🏙️', name: { ko: '서울', en: 'Seoul', ja: 'ソウル', 'zh-CN': '首尔', 'zh-TW': '首爾' } },
  { code: 'busan',     emoji: '🌊', name: { ko: '부산', en: 'Busan', ja: '釜山', 'zh-CN': '釜山', 'zh-TW': '釜山' } },
  { code: 'jeju',      emoji: '🌴', name: { ko: '제주', en: 'Jeju', ja: '済州', 'zh-CN': '济州', 'zh-TW': '濟州' } },
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
