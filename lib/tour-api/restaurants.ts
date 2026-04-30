/**
 * TourAPI 4.0 음식점 (contentTypeId=39) — areaBasedList2 / detailCommon2 / detailIntro2 / detailImage2.
 *
 * 5 개 locale 자동 라우팅 (KorService2 / JpnService2 / EngService2 / ChsService2 / ChtService2).
 * revalidate 3600s 캐싱은 callTourApi 내부 처리.
 */

import { callTourApi } from './client'

export type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

export interface TourRestaurant {
  contentid: string
  contenttypeid?: string
  title: string
  addr1?: string
  addr2?: string
  tel?: string
  mapx?: string
  mapy?: string
  firstimage?: string
  firstimage2?: string
  cat3?: string
  areacode?: string
  sigungucode?: string
}

export interface TourRestaurantDetail extends TourRestaurant {
  /** detailCommon2 */
  overview?: string
  homepage?: string
  /** detailIntro2 (식당 전용) */
  opentimefood?: string
  restdatefood?: string
  parkingfood?: string
  treatmenu?: string
  firstmenu?: string
  reservationfood?: string
  scalefood?: string
  packing?: string
  smoking?: string
}

export interface TourRestaurantImage {
  contentid: string
  originimgurl: string
  smallimageurl: string
  serialnum: string
  imgname?: string
}

const FOOD_CONTENT_TYPE_ID = '39'

/**
 * 도시별 식당 리스트 — areaBasedList2.
 * 빈 배열 반환 시 (네트워크 / API 키 없음) silent fail.
 */
export async function fetchRestaurantsByArea(
  areaCode: number,
  options: {
    sigunguCode?: number
    numOfRows?: number
    pageNo?: number
    locale?: Locale
  } = {},
): Promise<TourRestaurant[]> {
  const sp: Record<string, string> = {
    numOfRows: String(options.numOfRows ?? 30),
    pageNo: String(options.pageNo ?? 1),
    arrange: 'P',
    areaCode: String(areaCode),
    contentTypeId: FOOD_CONTENT_TYPE_ID,
  }
  if (options.sigunguCode !== undefined) sp.sigunguCode = String(options.sigunguCode)

  return callTourApi<TourRestaurant>(options.locale ?? 'ko', 'areaBasedList2', sp)
}

/**
 * 식당 상세 — detailCommon2 + detailIntro2 결합.
 * 상세는 contentTypeId 가 detailIntro2 에 필요.
 */
export async function fetchRestaurantDetail(
  contentid: string,
  locale: Locale = 'ko',
): Promise<TourRestaurantDetail | null> {
  type CommonItem = {
    contentid: string
    contenttypeid?: string
    title: string
    addr1?: string
    addr2?: string
    tel?: string
    mapx?: string
    mapy?: string
    firstimage?: string
    firstimage2?: string
    cat3?: string
    areacode?: string
    sigungucode?: string
    overview?: string
    homepage?: string
  }
  type IntroItem = {
    contentid: string
    contenttypeid?: string
    opentimefood?: string
    restdatefood?: string
    parkingfood?: string
    treatmenu?: string
    firstmenu?: string
    reservationfood?: string
    scalefood?: string
    packing?: string
    smoking?: string
  }

  const [commonArr, introArr] = await Promise.all([
    callTourApi<CommonItem>(locale, 'detailCommon2', {
      contentId: contentid,
    }),
    callTourApi<IntroItem>(locale, 'detailIntro2', {
      contentId: contentid,
      contentTypeId: FOOD_CONTENT_TYPE_ID,
    }),
  ])

  const common = commonArr[0]
  if (!common) return null

  const intro = introArr[0] || ({} as IntroItem)

  return {
    contentid: common.contentid,
    contenttypeid: common.contenttypeid,
    title: common.title,
    addr1: common.addr1,
    addr2: common.addr2,
    tel: common.tel,
    mapx: common.mapx,
    mapy: common.mapy,
    firstimage: common.firstimage,
    firstimage2: common.firstimage2,
    cat3: common.cat3,
    areacode: common.areacode,
    sigungucode: common.sigungucode,
    overview: common.overview,
    homepage: common.homepage,
    opentimefood: intro.opentimefood,
    restdatefood: intro.restdatefood,
    parkingfood: intro.parkingfood,
    treatmenu: intro.treatmenu,
    firstmenu: intro.firstmenu,
    reservationfood: intro.reservationfood,
    scalefood: intro.scalefood,
    packing: intro.packing,
    smoking: intro.smoking,
  }
}

/**
 * 식당 갤러리 — detailImage2.
 * imageYN=Y, subImageYN=Y 로 메인/서브 이미지 모두 조회.
 */
export async function fetchRestaurantImages(
  contentid: string,
  locale: Locale = 'ko',
): Promise<TourRestaurantImage[]> {
  return callTourApi<TourRestaurantImage>(locale, 'detailImage2', {
    contentId: contentid,
    imageYN: 'Y',
    subImageYN: 'Y',
  })
}
