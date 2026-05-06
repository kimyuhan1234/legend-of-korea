export interface TourAPIItem {
  contentid: string
  contenttypeid: string
  title: string
  addr1?: string
  addr2?: string
  firstimage?: string
  firstimage2?: string
  mapx?: string
  mapy?: string
  tel?: string
  areacode?: string
  sigungucode?: string
  cat1?: string
  cat2?: string
  cat3?: string
  eventstartdate?: string
  eventenddate?: string
  // TourAPI 4.0 행정구역 코드 — areacode 가 비어있을 때 광역 결정용 (KS X 1062)
  lDongRegnCd?: string
  lDongSignguCd?: string
}

export type SpotCategory = 'hotspot' | 'landmark' | 'festival'

export interface I18nString {
  ko: string
  en: string
  ja: string
  'zh-CN': string
  'zh-TW': string
  [key: string]: string
}

export interface NormalizedSpot {
  id: string
  source: 'tourapi' | 'static'
  name: I18nString
  region: string
  category: SpotCategory
  description: I18nString
  image: string
  address?: string
  lat?: number
  lng?: number
  startDate?: string
  endDate?: string
  tags: string[]
  // 상세 모달이 detailCommon2/detailIntro2 호출 시 필요. source='tourapi' 일 때만 보존.
  contentId?: string
  contentTypeId?: string
}

/**
 * detailCommon2 응답 — 모든 contentTypeId 공통 필드.
 * overview/homepage 는 HTML 태그 포함 가능 → sanitize 필수.
 */
export interface TourAPIDetailCommon {
  contentid: string
  contenttypeid: string
  title: string
  overview?: string
  homepage?: string
  tel?: string
  telname?: string
  firstimage?: string
  firstimage2?: string
  addr1?: string
  addr2?: string
  zipcode?: string
  mapx?: string
  mapy?: string
  mlevel?: string
}

/**
 * detailIntro2 응답 — contentTypeId 별 필드 다름.
 * 12=관광지 / 14=문화시설 / 15=축제 / 25=여행코스 / 28=레저.
 * 모든 필드 optional — TourAPI 응답에서 누락 흔함.
 */
export interface TourAPIDetailIntro {
  contentid: string
  contenttypeid: string
  // 축제 (15)
  eventstartdate?: string
  eventenddate?: string
  playtime?: string
  eventplace?: string
  usetimefestival?: string
  sponsor1?: string
  sponsor2?: string
  subevent?: string
  program?: string
  agelimit?: string
  bookingplace?: string
  discountinfofestival?: string
  spendtimefestival?: string
  festivalgrade?: string
  // 관광지 (12)
  infocenter?: string
  restdate?: string
  usetime?: string
  parking?: string
  chkbabycarriage?: string
  chkpet?: string
  // 문화시설 (14)
  infocenterculture?: string
  restdateculture?: string
  usetimeculture?: string
  parkingculture?: string
  parkingfee?: string
  usefee?: string
  // 레저 (28)
  infocenterleports?: string
  restdateleports?: string
  usetimeleports?: string
  parkingleports?: string
  parkingfeeleports?: string
  usefeeleports?: string
  // 여행코스 (25)
  distance?: string
  schedule?: string
  taketime?: string
}

export interface TourAPIDetailResponse {
  common: TourAPIDetailCommon | null
  intro: TourAPIDetailIntro | null
}
