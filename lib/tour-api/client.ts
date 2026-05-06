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

export async function callTourApi<T = TourAPIItem>(
  locale: Locale,
  endpoint: string,
  searchParams: Record<string, string>
): Promise<T[]> {
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
    if (Array.isArray(items)) return items as T[]
    if (items) return [items as T]
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

function formatYMD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

/**
 * 진행 중 + 향후 축제 일괄 조회 (전국, 페이지네이션).
 *
 * 버그 fix (2026-05):
 *  - areaCode 파라미터 사용 시 응답 row 의 areacode 가 빈 문자열인 경우 다수 누락
 *    → 전국 일괄 호출 + 클라이언트 측 광역 분류 (lDongRegnCd / areacode hybrid)
 *  - eventStartDate 단방향 (이번 달 1일 이후 시작) 만 사용 → 전월 시작 축제 누락
 *    → 윈도우 확장: 전월 1일 ~ 다다음달 마지막 (3개월). 클라이언트가 보는 month 토글에
 *      충분한 데이터 공급. monthStart/monthEnd 겹침 필터는 FestivalCalendar 가 처리.
 *
 * 페이지네이션: numOfRows=100, items.length < pageSize 면 종료. 안전 상한 5 페이지 (500건).
 */
export async function fetchCurrentFestivals(locale: Locale = 'ko'): Promise<TourAPIItem[]> {
  const now = new Date()
  // 윈도우: 전월 1일 ~ 다다음달 마지막 (현재 월 진행 중 + 다음 달 시작 모두 포함)
  const windowStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const windowEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0)

  const all: TourAPIItem[] = []
  const pageSize = 100
  const maxPages = 5
  for (let pageNo = 1; pageNo <= maxPages; pageNo++) {
    const items = await callTourApi<TourAPIItem>(locale, 'searchFestival2', {
      numOfRows: String(pageSize),
      pageNo: String(pageNo),
      arrange: 'P',
      eventStartDate: formatYMD(windowStart),
      eventEndDate: formatYMD(windowEnd),
    })
    if (items.length === 0) break
    all.push(...items)
    if (items.length < pageSize) break
  }
  return all
}
