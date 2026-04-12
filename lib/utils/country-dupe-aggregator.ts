import type { Region, RegionalFood, DupeForeignFood } from '@/lib/data/food-dupes'

export interface CountryMeta {
  name: { ko: string; en: string; ja: string }
  flag: string
  lat: number
  lng: number
}

export const COUNTRIES: Record<string, CountryMeta> = {
  JP: { name: { ko: '일본', en: 'Japan', ja: '日本' }, flag: '🇯🇵', lat: 36.2, lng: 138.2 },
  CN: { name: { ko: '중국', en: 'China', ja: '中国' }, flag: '🇨🇳', lat: 35.8, lng: 104.1 },
  TH: { name: { ko: '태국', en: 'Thailand', ja: 'タイ' }, flag: '🇹🇭', lat: 15.8, lng: 100.9 },
  VN: { name: { ko: '베트남', en: 'Vietnam', ja: 'ベトナム' }, flag: '🇻🇳', lat: 14.0, lng: 108.2 },
  MY: { name: { ko: '말레이시아', en: 'Malaysia', ja: 'マレーシア' }, flag: '🇲🇾', lat: 4.2, lng: 101.9 },
  ID: { name: { ko: '인도네시아', en: 'Indonesia', ja: 'インドネシア' }, flag: '🇮🇩', lat: -0.7, lng: 113.9 },
  US: { name: { ko: '미국', en: 'USA', ja: 'アメリカ' }, flag: '🇺🇸', lat: 37.0, lng: -95.7 },
  IT: { name: { ko: '이탈리아', en: 'Italy', ja: 'イタリア' }, flag: '🇮🇹', lat: 41.8, lng: 12.5 },
  FR: { name: { ko: '프랑스', en: 'France', ja: 'フランス' }, flag: '🇫🇷', lat: 46.2, lng: 2.2 },
  IN: { name: { ko: '인도', en: 'India', ja: 'インド' }, flag: '🇮🇳', lat: 20.5, lng: 78.9 },
  ES: { name: { ko: '스페인', en: 'Spain', ja: 'スペイン' }, flag: '🇪🇸', lat: 40.4, lng: -3.7 },
  MX: { name: { ko: '멕시코', en: 'Mexico', ja: 'メキシコ' }, flag: '🇲🇽', lat: 23.6, lng: -102.5 },
}

export interface DupeItem {
  koreanFood: RegionalFood
  regionCode: string
  regionName: { ko: string; en: string; ja: string }
  foreignFood: DupeForeignFood
}

export interface CountryDupeResult {
  country: CountryMeta
  totalMatches: number
  dupes: DupeItem[]
}

export function getCountryDupes(
  countryCode: string,
  regions: Region[]
): CountryDupeResult {
  const country = COUNTRIES[countryCode]
  if (!country) {
    return { country: { name: { ko: '', en: '', ja: '' }, flag: '', lat: 0, lng: 0 }, totalMatches: 0, dupes: [] }
  }

  const dupes: DupeItem[] = []

  for (const region of regions) {
    for (const food of region.foods) {
      const entry = food.dupes[countryCode]
      if (!entry || 'challenge' in entry) continue
      dupes.push({
        koreanFood: food,
        regionCode: region.code,
        regionName: region.name,
        foreignFood: entry as DupeForeignFood,
      })
    }
  }

  dupes.sort((a, b) => b.foreignFood.similarityPercent - a.foreignFood.similarityPercent)

  return { country, totalMatches: dupes.length, dupes }
}

export function getAllCountryCounts(regions: Region[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const code of Object.keys(COUNTRIES)) {
    let count = 0
    for (const region of regions) {
      for (const food of region.foods) {
        const entry = food.dupes[code]
        if (entry && !('challenge' in entry)) count++
      }
    }
    counts[code] = count
  }
  return counts
}
