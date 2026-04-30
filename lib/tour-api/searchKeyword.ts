/**
 * TourAPI searchKeyword2 — 키워드로 contentid 매칭.
 * 식당 이름 → 가장 가까운 식당의 contentid 자동 추출 (local-picks 매칭 스크립트가 사용).
 */

import { callTourApi } from './client'
import type { TourAPIItem } from './types'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

export async function searchKeyword(
  keyword: string,
  options: {
    contentTypeId?: string
    areaCode?: number
    sigunguCode?: number
    numOfRows?: number
    locale?: Locale
  } = {},
): Promise<TourAPIItem[]> {
  const sp: Record<string, string> = {
    keyword,
    numOfRows: String(options.numOfRows ?? 10),
    pageNo: '1',
  }
  if (options.contentTypeId) sp.contentTypeId = options.contentTypeId
  if (options.areaCode !== undefined) sp.areaCode = String(options.areaCode)
  if (options.sigunguCode !== undefined) sp.sigunguCode = String(options.sigunguCode)

  return callTourApi<TourAPIItem>(options.locale ?? 'ko', 'searchKeyword2', sp)
}
