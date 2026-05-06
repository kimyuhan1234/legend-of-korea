import { SIGHTS, type Sight } from '@/lib/data/sights'
import { PROVINCE_AREA_CODES, CONTENT_TYPES, resolveRegionFromItem } from './area-codes'
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

/**
 * 키워드 → 한글 태그 매핑 (사용자 노출용 chip).
 * 본 sample 분석 (2026-05-03, n=138) 기반: 자연 21% / 바다 10% / 역사 1% / 야간 0%.
 * 야간은 TourAPI 12=관광지 응답에 거의 없으나 향후 야경 명소 추가/별도 검색 시 매칭되도록 패턴 정의.
 */
const TAG_PATTERNS: Array<{ tag: string; re: RegExp }> = [
  { tag: '야간', re: /야경|야간|일루미네이션|illumination|night/i },
  { tag: '꽃',   re: /꽃|벚|장미|튤립|국화|단풍|매화|코스모스|연꽃/ },
  { tag: '온천', re: /온천|스파|찜질/ },
  { tag: '시장', re: /시장|먹자골목|마켓/ },
  { tag: '바다', re: /해변|해수욕|바다|해안|등대|포구|어촌|바닷가|항\s|항$|섬\s|섬$|돈대/ },
  { tag: '자연', re: /산$|산\s|등산|봉우리|봉$|숲|계곡|폭포|호수|강$|강\s|국립공원|도립공원|군립공원|수목원|식물원|정원|동굴|들판/ },
  { tag: '역사', re: /궁$|궁\s|왕릉|능$|능\s|성$|성곽|사찰|사$|절$|문화재|유적|민속|전통|박물관|기념관|역사관|성문|향교|서원/ },
  { tag: '체험', re: /체험|테마파크|놀이공원|동물원|수족관|아쿠아|미술관|전시관/ },
  { tag: '가족', re: /가족|키즈|어린이|아이/ },
]

/**
 * TourAPI cat3 코드 → 한글 태그 매핑 (분류 코드 기반 정확 매칭).
 * 키워드 매칭이 실패한 경우 보조로 적용 — 무태그 비율 감소.
 * 표준: cat1=A01 자연 / A02 인문(역사·체험·문화) / A03 레포츠.
 */
const CAT3_PREFIX_TAG: Array<{ prefix: string; tag: string }> = [
  { prefix: 'A0101', tag: '자연' }, // 자연관광지 (국립/도립/군립공원, 산, 숲)
  { prefix: 'A0102', tag: '자연' }, // 관광자원
  { prefix: 'A0201', tag: '역사' }, // 역사관광지 (궁/왕릉/사찰/유적)
  { prefix: 'A0203', tag: '체험' }, // 체험관광지
  { prefix: 'A0204', tag: '체험' }, // 산업관광지
  { prefix: 'A0205', tag: '역사' }, // 건축/조형물 (전통건축물 다수)
  { prefix: 'A0206', tag: '체험' }, // 문화시설 (박물관/미술관)
  { prefix: 'A0301', tag: '체험' }, // 레포츠소개
  { prefix: 'A0302', tag: '자연' }, // 육상 레포츠
  { prefix: 'A0303', tag: '바다' }, // 수상 레포츠
]

function inferTourTags(item: TourAPIItem, category: SpotCategory): string[] {
  const tags: string[] = []

  // category 기반 기본 태그 (영문 — scoring 시스템에서 사용 중, 보존)
  if (category === 'festival') tags.push('festival', 'group', 'experience')
  if (category === 'landmark') tags.push('landmark', 'historic', 'scenic')
  if (category === 'hotspot') tags.push('active', 'instagram', 'trendy')

  // 키워드 자동 태깅 — title + addr1 + cat3 통합 검색
  const text = `${item.title || ''} ${item.addr1 || ''} ${item.cat3 || ''}`
  for (const { tag, re } of TAG_PATTERNS) {
    if (re.test(text)) tags.push(tag)
  }

  // cat3 코드 fallback — 키워드 매칭 실패 spot 보강
  if (item.cat3) {
    for (const { prefix, tag } of CAT3_PREFIX_TAG) {
      if (item.cat3.startsWith(prefix) && !tags.includes(tag)) {
        tags.push(tag)
        break
      }
    }
  }

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
    contentId: item.contentid,
    contentTypeId: contentType,
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

  // 전국 17개 광역시도 순회 — 각 지역당 4 contentType (관광지/문화시설/여행코스/레저) × 30 entries.
  // 축제는 areaCode 필터 시 응답 row 의 areacode 가 빈 문자열이라 누락 다수 → 전국 일괄 1회 호출로 분리 (아래).
  const provinceEntries = Object.entries(PROVINCE_AREA_CODES)
  const tourFetches = provinceEntries.map(async ([region, codes]) => {
    const [tourists, cultures, courses, leisures] = await Promise.all([
      fetchTourSpots({ areaCode: codes.areaCode, contentTypeId: CONTENT_TYPES.tourist, numOfRows: 30, locale }),
      fetchTourSpots({ areaCode: codes.areaCode, contentTypeId: CONTENT_TYPES.culture, numOfRows: 30, locale }),
      fetchTourSpots({ areaCode: codes.areaCode, contentTypeId: CONTENT_TYPES.course,  numOfRows: 30, locale }),
      fetchTourSpots({ areaCode: codes.areaCode, contentTypeId: CONTENT_TYPES.leisure, numOfRows: 30, locale }),
    ])
    const items: NormalizedSpot[] = []
    for (const it of tourists) items.push(normalizeTourItem(it, region, locale))
    for (const it of cultures) items.push(normalizeTourItem(it, region, locale))
    for (const it of courses)  items.push(normalizeTourItem(it, region, locale))
    for (const it of leisures) items.push(normalizeTourItem(it, region, locale))
    return items
  })

  const results = await Promise.all(tourFetches)
  for (const arr of results) all.push(...arr)

  // 축제 — 전국 일괄 1회 (페이지네이션 포함). 응답 item 의 lDongRegnCd / areacode 로 region 결정.
  const festivals = await fetchCurrentFestivals(locale)
  for (const it of festivals) {
    const region = resolveRegionFromItem(it)
    all.push(normalizeTourItem(it, region, locale))
  }

  // 중복 제거 (이름 + 지역 기준)
  const seen = new Set<string>()
  return all.filter(s => {
    const key = `${s.region}:${s.name[locale] ?? s.name.ko}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
