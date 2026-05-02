import type { Region, RegionalFood, DupeCandidate, CountryCode } from '@/lib/data/food-dupes'

export interface CountryMeta {
  name: { ko: string; en: string; ja: string }
  flag: string
  lat: number
  lng: number
}

/** Phase H — 한중일 한정. 9개국 (TH/VN/MY/ID/US/IT/FR/IN/ES/MX) 폐기. */
export const COUNTRIES: Record<string, CountryMeta> = {
  JP: { name: { ko: '일본', en: 'Japan', ja: '日本' }, flag: '🇯🇵', lat: 36.2, lng: 138.2 },
  CN: { name: { ko: '중국', en: 'China', ja: '中国' }, flag: '🇨🇳', lat: 35.8, lng: 104.1 },
}

export interface DupeItem {
  koreanFood: RegionalFood
  regionCode: string
  regionName: { ko: string; en: string; ja: string }
  /** Phase H — 단수 → 복수. 한 한국 음식이 한 국가에 여러 후보를 가질 수 있음. */
  foreignFood: DupeCandidate
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
  const cc = countryCode as CountryCode

  for (const region of regions) {
    for (const food of region.foods) {
      const entries = food.dupes[cc]
      if (!entries || entries.length === 0) continue
      for (const entry of entries) {
        dupes.push({
          koreanFood: food,
          regionCode: region.code,
          regionName: region.name,
          foreignFood: entry,
        })
      }
    }
  }

  dupes.sort((a, b) => b.foreignFood.similarityPercent - a.foreignFood.similarityPercent)

  return { country, totalMatches: dupes.length, dupes }
}

export function getAllCountryCounts(regions: Region[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const code of Object.keys(COUNTRIES)) {
    let count = 0
    const cc = code as CountryCode
    for (const region of regions) {
      for (const food of region.foods) {
        const entries = food.dupes[cc]
        if (entries) count += entries.length
      }
    }
    counts[code] = count
  }
  return counts
}
