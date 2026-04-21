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
}
