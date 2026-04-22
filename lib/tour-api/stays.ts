import { PROVINCE_AREA_CODES } from './area-codes'

const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2'
const ENDPOINT = 'searchStay2'

/**
 * TourAPI searchStay2 원본 응답 항목
 * 숙박은 contenttypeid = 32 고정.
 */
export interface TourAPIStay {
  contentid: string
  contenttypeid: string
  title: string
  addr1?: string
  addr2?: string
  tel?: string
  firstimage?: string
  firstimage2?: string
  mapx?: string
  mapy?: string
  areacode?: string
  sigungucode?: string
  cat1?: string
  cat2?: string
  cat3?: string
}

/**
 * 앱에서 사용하는 표준 숙박 타입
 */
export interface NormalizedStay {
  id: string
  name: string
  address: string
  tel: string | null
  latitude: number
  longitude: number
  image: string | null
  imageSmall: string | null
  stayType: string
  areaCode: string
  sigunguCode: string
  source: 'tourapi'
}

/**
 * TourAPI 숙박 카테고리 코드(cat3) → 사람이 읽는 타입 문자열
 * 출처: TourAPI 분류체계 서비스분류코드 B02 > B0201
 */
const STAY_TYPE_MAP: Record<string, string> = {
  B02010100: '관광호텔',
  B02010500: '콘도미니엄',
  B02010600: '유스호스텔',
  B02010700: '펜션',
  B02010900: '모텔',
  B02011000: '민박',
  B02011100: '게스트하우스',
  B02011200: '홈스테이',
  B02011300: '서비스드레지던스',
  B02011600: '한옥',
}

function inferStayType(cat3: string | undefined): string {
  if (!cat3) return '기타'
  return STAY_TYPE_MAP[cat3] ?? '기타'
}

function normalizeStay(item: TourAPIStay): NormalizedStay {
  return {
    id: item.contentid,
    name: item.title,
    address: [item.addr1, item.addr2].filter(Boolean).join(' ').trim(),
    tel: item.tel?.trim() || null,
    latitude: item.mapy ? parseFloat(item.mapy) : 0,
    longitude: item.mapx ? parseFloat(item.mapx) : 0,
    image: item.firstimage || null,
    imageSmall: item.firstimage2 || null,
    stayType: inferStayType(item.cat3),
    areaCode: item.areacode ?? '',
    sigunguCode: item.sigungucode ?? '',
    source: 'tourapi',
  }
}

export interface FetchStaysResult {
  stays: NormalizedStay[]
  resultCode: string
  resultMsg: string
  totalCount: number
  /** 디버깅용: 키 마스킹된 요청 URL */
  requestUrl?: string
  /** 디버깅용: 응답 본문 앞부분(최대 2000자) */
  rawSnippet?: string
}

/**
 * 단일 지역(areaCode) 숙박 목록 조회.
 * serviceKey는 process.env.TOUR_API_KEY 에서만 읽고, 로그에 출력하지 않는다.
 */
export async function fetchStaysByArea(
  areaCode: number,
  options: { numOfRows?: number; pageNo?: number } = {}
): Promise<FetchStaysResult> {
  const key = process.env.TOUR_API_KEY
  if (!key) {
    console.error('[TourAPI Stays] TOUR_API_KEY not set')
    return { stays: [], resultCode: 'NO_KEY', resultMsg: 'TOUR_API_KEY missing', totalCount: 0 }
  }

  const url = new URL(`${BASE_URL}/${ENDPOINT}`)
  url.searchParams.set('serviceKey', key)
  url.searchParams.set('MobileOS', 'ETC')
  url.searchParams.set('MobileApp', 'CloudWithYou')
  url.searchParams.set('_type', 'json')
  url.searchParams.set('numOfRows', String(options.numOfRows ?? 100))
  url.searchParams.set('pageNo', String(options.pageNo ?? 1))
  url.searchParams.set('areaCode', String(areaCode))

  // 키 제외한 URL만 로그/반환
  const safeUrl = url.toString().replace(/serviceKey=[^&]+/, 'serviceKey=***')
  console.log(`[TourAPI Stays] Fetching stays for area ${areaCode}...`)
  console.log(`[TourAPI Stays] URL: ${safeUrl}`)

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    const rawText = await res.text()
    const rawSnippet = rawText.slice(0, 2000)

    if (!res.ok) {
      const condensed = rawSnippet.replace(/\s+/g, ' ')
      console.error(`[TourAPI Stays] HTTP ${res.status} for area ${areaCode}: ${condensed}`)
      return {
        stays: [],
        resultCode: `HTTP_${res.status}`,
        resultMsg: condensed || `HTTP error ${res.status}`,
        totalCount: 0,
        requestUrl: safeUrl,
        rawSnippet,
      }
    }

    // 성공 응답은 JSON, 에러 응답은 XML로 올 수 있음
    let json: unknown = null
    try {
      json = JSON.parse(rawText)
    } catch {
      // 비-JSON 응답 (XML 에러 등)
      const condensed = rawSnippet.replace(/\s+/g, ' ')
      console.error(`[TourAPI Stays] Non-JSON response for area ${areaCode}: ${condensed}`)
      return {
        stays: [],
        resultCode: 'NON_JSON',
        resultMsg: condensed,
        totalCount: 0,
        requestUrl: safeUrl,
        rawSnippet,
      }
    }

    const response = (json as { response?: { header?: { resultCode?: string; resultMsg?: string }; body?: { items?: { item?: TourAPIStay | TourAPIStay[] }; totalCount?: number } } }).response
    const header = response?.header
    const resultCode: string = header?.resultCode ?? 'UNKNOWN'
    const resultMsg: string = header?.resultMsg ?? ''
    const totalCount: number = response?.body?.totalCount ?? 0

    console.log(`[TourAPI Stays] Response status: ${resultCode} (${resultMsg})`)

    if (resultCode !== '0000') {
      return { stays: [], resultCode, resultMsg, totalCount: 0, requestUrl: safeUrl, rawSnippet }
    }

    const rawItems = response?.body?.items?.item
    const items: TourAPIStay[] = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : []
    const stays = items.map(normalizeStay)

    console.log(`[TourAPI Stays] Got ${stays.length} stays (total available: ${totalCount})`)

    return { stays, resultCode, resultMsg, totalCount, requestUrl: safeUrl, rawSnippet }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[TourAPI Stays] Network error for area ${areaCode}:`, msg)
    return { stays: [], resultCode: 'NETWORK_ERROR', resultMsg: msg, totalCount: 0, requestUrl: safeUrl }
  }
}

/**
 * 전국 17개 광역시도 숙박 병렬 조회 후 병합.
 * 각 지역당 numOfRows(기본 100)개씩.
 */
export async function fetchAllStays(
  options: { numOfRows?: number } = {}
): Promise<NormalizedStay[]> {
  const entries = Object.entries(PROVINCE_AREA_CODES)
  console.log(`[TourAPI Stays] Fetching all provinces (${entries.length} regions)...`)

  const results = await Promise.all(
    entries.map(([, { areaCode }]) =>
      fetchStaysByArea(areaCode, { numOfRows: options.numOfRows ?? 100 })
    )
  )

  const all: NormalizedStay[] = []
  for (const r of results) all.push(...r.stays)

  // 중복 제거 (contentid 기준)
  const seen = new Set<string>()
  const deduped = all.filter((s) => {
    if (seen.has(s.id)) return false
    seen.add(s.id)
    return true
  })

  console.log(`[TourAPI Stays] Total unique stays: ${deduped.length}`)
  return deduped
}
