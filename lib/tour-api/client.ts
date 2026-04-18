import { TourAPIItem } from './types'

const BASE_URL = 'https://apis.data.go.kr/B551011/KorService1'

function getKey(): string | null {
  return process.env.TOUR_API_KEY || null
}

async function callTourApi(endpoint: string, searchParams: Record<string, string>): Promise<TourAPIItem[]> {
  const key = getKey()
  if (!key) return []

  const url = new URL(`${BASE_URL}/${endpoint}`)
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
    console.error(`TourAPI ${endpoint} error:`, err)
    return []
  }
}

export async function fetchTourSpots(params: {
  areaCode: number
  sigunguCode?: number
  contentTypeId?: number
  numOfRows?: number
}): Promise<TourAPIItem[]> {
  const sp: Record<string, string> = {
    numOfRows: String(params.numOfRows || 20),
    pageNo: '1',
    arrange: 'P',
    areaCode: String(params.areaCode),
  }
  if (params.sigunguCode) sp.sigunguCode = String(params.sigunguCode)
  if (params.contentTypeId) sp.contentTypeId = String(params.contentTypeId)

  return callTourApi('areaBasedList1', sp)
}

export async function fetchCurrentFestivals(areaCode: number): Promise<TourAPIItem[]> {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const eventStartDate = `${y}${m}01`

  return callTourApi('searchFestival1', {
    numOfRows: '10',
    pageNo: '1',
    arrange: 'P',
    areaCode: String(areaCode),
    eventStartDate,
  })
}
