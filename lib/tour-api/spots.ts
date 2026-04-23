import { SIGHTS, type Sight } from '@/lib/data/sights'
import { PROVINCE_AREA_CODES, CONTENT_TYPES } from './area-codes'
import { fetchTourSpots, fetchCurrentFestivals } from './client'
import { NormalizedSpot, SpotCategory, TourAPIItem, I18nString } from './types'

function toI18n(text: string): I18nString {
  return { ko: text, en: text, ja: text, 'zh-CN': text, 'zh-TW': text }
}

function inferTourTags(item: TourAPIItem, category: SpotCategory): string[] {
  const tags: string[] = []
  if (category === 'festival') tags.push('festival', 'group', 'experience')
  if (category === 'landmark') tags.push('landmark', 'historic', 'scenic')
  if (category === 'hotspot') tags.push('active', 'instagram', 'trendy')

  const addr = (item.addr1 || '').toLowerCase()
  if (addr.includes('해수욕') || addr.includes('바다') || addr.includes('해변')) tags.push('ocean')
  if (addr.includes('산') || addr.includes('공원')) tags.push('nature', 'hiking')
  if (addr.includes('시장')) tags.push('food', 'market')
  if (addr.includes('사') || addr.includes('절') || addr.includes('궁')) tags.push('temple', 'traditional')
  if (addr.includes('카페') || addr.includes('거리')) tags.push('cafe', 'trendy')
  return Array.from(new Set(tags))
}

function normalizeTourItem(item: TourAPIItem, region: string): NormalizedSpot {
  const contentType = String(item.contenttypeid || '')
  let category: SpotCategory = 'landmark'
  if (contentType === '15') category = 'festival'
  else if (contentType === '28') category = 'hotspot'

  const tags = inferTourTags(item, category)

  return {
    id: `tour-${item.contentid}`,
    source: 'tourapi',
    name: toI18n(item.title),
    region,
    category,
    description: toI18n(item.addr1 || item.title),
    image: item.firstimage || item.firstimage2 || '/images/placeholder-spot.jpg',
    address: item.addr1,
    lat: item.mapy ? parseFloat(item.mapy) : undefined,
    lng: item.mapx ? parseFloat(item.mapx) : undefined,
    startDate: item.eventstartdate,
    endDate: item.eventenddate,
    tags,
  }
}

function inferStaticTags(category: SpotCategory): string[] {
  const tags: string[] = []
  if (category === 'hotspot') tags.push('instagram', 'trendy', 'active')
  if (category === 'landmark') tags.push('landmark', 'historic', 'scenic', 'traditional')
  if (category === 'festival') tags.push('festival', 'group', 'experience')
  return tags
}

function toI18nFromUnion(v: string | { ko: string; en: string; ja: string; 'zh-CN'?: string; 'zh-TW'?: string }): I18nString {
  if (typeof v === 'string') return toI18n(v)
  return {
    ko: v.ko,
    en: v.en,
    ja: v.ja,
    'zh-CN': v['zh-CN'] ?? v.en,
    'zh-TW': v['zh-TW'] ?? v.en,
  }
}

function normalizeStaticSight(s: Sight): NormalizedSpot {
  return {
    id: `static-${s.id}`,
    source: 'static',
    name: toI18nFromUnion(s.name),
    region: s.region,
    category: s.category,
    description: toI18nFromUnion(s.description),
    image: s.image,
    startDate: s.startDate,
    endDate: s.endDate,
    tags: s.tags && s.tags.length > 0 ? s.tags : inferStaticTags(s.category),
  }
}

/**
 * 정적 SIGHTS + TourAPI 전국 17개 광역시도 관광지/축제 병합
 * TourAPI 키 없으면 정적 데이터만 반환 (graceful fallback)
 */
export async function getAllSpots(): Promise<NormalizedSpot[]> {
  const all: NormalizedSpot[] = []

  for (const s of SIGHTS) {
    all.push(normalizeStaticSight(s))
  }

  // 전국 17개 광역시도 순회 — 각 지역당 관광지 8개 + 축제 현재 진행 중
  const provinceEntries = Object.entries(PROVINCE_AREA_CODES)
  const tourFetches = provinceEntries.map(async ([region, codes]) => {
    const [tourists, festivals] = await Promise.all([
      fetchTourSpots({
        areaCode: codes.areaCode,
        contentTypeId: CONTENT_TYPES.tourist,
        numOfRows: 8,
      }),
      fetchCurrentFestivals(codes.areaCode),
    ])
    const items: NormalizedSpot[] = []
    for (const it of tourists) items.push(normalizeTourItem(it, region))
    for (const it of festivals) items.push(normalizeTourItem(it, region))
    return items
  })

  const results = await Promise.all(tourFetches)
  for (const arr of results) all.push(...arr)

  // 중복 제거 (이름 + 지역 기준)
  const seen = new Set<string>()
  return all.filter(s => {
    const key = `${s.region}:${s.name.ko}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
