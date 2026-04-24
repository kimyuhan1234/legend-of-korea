import { TourAPIItem } from './types'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const SERVICE_BY_LOCALE: Record<Locale, string> = {
  ko: 'KorService2',
  ja: 'JpnService2',
  en: 'EngService2',
  'zh-CN': 'ChsService2',
  'zh-TW': 'ChtService2',
}

function baseUrl(locale: Locale): string {
  return `https://apis.data.go.kr/B551011/${SERVICE_BY_LOCALE[locale]}`
}

function getKey(): string | null {
  return process.env.TOUR_API_KEY || null
}

async function callTourApi(
  locale: Locale,
  endpoint: string,
  searchParams: Record<string, string>
): Promise<TourAPIItem[]> {
  const key = getKey()
  if (!key) return []

  const url = new URL(`${baseUrl(locale)}/${endpoint}`)
  url.searchParams.set('serviceKey', key)
  url.searchParams.set('MobileOS', 'ETC')
  url.searchParams.set('MobileApp', 'LegendOfKorea')
  url.searchParams.set('_type', 'json')
  for (const [k, v] of Object.entries(searchParams)) {
    url.searchParams.set(k, v)
  }

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    const items = json?.response?.body?.items?.item
    if (Array.isArray(items)) return items
    if (items) return [items]
    return []
  } catch (err) {
    console.error(`TourAPI ${endpoint} (${locale}) error:`, err)
    return []
  }
}

export async function fetchTourSpots(params: {
  areaCode: number
  sigunguCode?: number
  contentTypeId?: number
  numOfRows?: number
  locale?: Locale
}): Promise<TourAPIItem[]> {
  const sp: Record<string, string> = {
    numOfRows: String(params.numOfRows || 20),
    pageNo: '1',
    arrange: 'P',
    areaCode: String(params.areaCode),
  }
  if (params.sigunguCode) sp.sigunguCode = String(params.sigunguCode)
  if (params.contentTypeId) sp.contentTypeId = String(params.contentTypeId)

  return callTourApi(params.locale ?? 'ko', 'areaBasedList2', sp)
}

export async function fetchCurrentFestivals(areaCode: number, locale: Locale = 'ko'): Promise<TourAPIItem[]> {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const eventStartDate = `${y}${m}01`

  return callTourApi(locale, 'searchFestival2', {
    numOfRows: '10',
    pageNo: '1',
    arrange: 'P',
    areaCode: String(areaCode),
    eventStartDate,
  })
}
