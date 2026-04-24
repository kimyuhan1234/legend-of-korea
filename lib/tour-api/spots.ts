import { SIGHTS, type Sight } from '@/lib/data/sights'
import { PROVINCE_AREA_CODES, CONTENT_TYPES } from './area-codes'
import { fetchTourSpots, fetchCurrentFestivals } from './client'
import { NormalizedSpot, SpotCategory, TourAPIItem, I18nString } from './types'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

/**
 * 단일 언어 문자열을 I18nString으로 감싼다.
 * TourAPI는 서비스 엔드포인트별로 언어가 고정이므로, 요청 로케일에만
 * 실제 문자열이 채워지고 나머지 로케일은 graceful fallback용으로 동일값을 넣는다.
 * (페이지는 요청한 locale만 읽으므로 다른 언어 필드가 노출되지 않는다.)
 */
function toI18nFromLocale(text: string, locale: Locale): I18nString {
  const base = text ?? ''
  return {
    ko: locale === 'ko' ? base : base,
    en: locale === 'en' ? base : base,
    ja: locale === 'ja' ? base : base,
    'zh-CN': locale === 'zh-CN' ? base : base,
    'zh-TW': locale === 'zh-TW' ? base : base,
    // 페이지 렌더는 spot.name[locale]만 참조 — 이 필드가 현재 로케일 언어로 채워지면 충분
  }
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

function normalizeTourItem(item: TourAPIItem, region: string, locale: Locale): NormalizedSpot {
  const contentType = String(item.contenttypeid || '')
  let category: SpotCategory = 'landmark'
  if (contentType === '15') category = 'festival'
  else if (contentType === '28') category = 'hotspot'

  const tags = inferTourTags(item, category)

  return {
    id: `tour-${item.contentid}`,
    source: 'tourapi',
    name: toI18nFromLocale(item.title, locale),
    region,
    category,
    description: toI18nFromLocale(item.addr1 || item.title, locale),
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
  if (typeof v === 'string') {
    // 구 포맷(string) — 한국어만 있는 엔트리. 전체 로케일에 같은 값을 채워 crash 방지.
    return { ko: v, en: v, ja: v, 'zh-CN': v, 'zh-TW': v }
  }
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
 * 정적 SIGHTS + TourAPI 전국 17개 광역시도 관광지/축제 병합.
 * locale에 맞는 TourAPI 서비스 엔드포인트(KorService2/JpnService2/EngService2/
 * ChsService2/ChtService2)를 호출해 해당 언어로 이름·주소를 받는다.
 * TourAPI 키 없으면 정적 데이터만 반환 (graceful fallback)
 */
export async function getAllSpots(locale: Locale = 'ko'): Promise<NormalizedSpot[]> {
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
        locale,
      }),
      fetchCurrentFestivals(codes.areaCode, locale),
    ])
    const items: NormalizedSpot[] = []
    for (const it of tourists) items.push(normalizeTourItem(it, region, locale))
    for (const it of festivals) items.push(normalizeTourItem(it, region, locale))
    return items
  })

  const results = await Promise.all(tourFetches)
  for (const arr of results) all.push(...arr)

  // 중복 제거 (이름 + 지역 기준)
  const seen = new Set<string>()
  return all.filter(s => {
    const key = `${s.region}:${s.name[locale] ?? s.name.ko}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
