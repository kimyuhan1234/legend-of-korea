/**
 * K-Food Spot 큐레이션 메타 — TourAPI 데이터에 추가할 우리만의 한 줄 정보.
 *
 * 사용처: app/[locale]/food/kfood-spot/[city]/[contentid]/page.tsx
 * 키: TourAPI 의 contentid (string)
 * 없으면 TourAPI 데이터만 표시 (UI 가 nullish 체크).
 *
 * 운영 중 점진 추가 — 사진/영업시간 외 차별화 정보 (mustTry / 가격대 / 메모) 큐레이션.
 */

export interface KFoodCurationEntry {
  /** 꼭 먹어볼 메뉴 — 다국어 */
  mustTry?: {
    ko: string[]
    ja?: string[]
    en?: string[]
    'zh-CN'?: string[]
    'zh-TW'?: string[]
  }
  /** 추가 태그 (예: "한국 3대 비빔밥") */
  tags?: string[]
  /** 가격대 시그널 */
  priceRange?: '₩' | '₩₩' | '₩₩₩'
  /** 우리 큐레이터 메모 (TourAPI overview 보다 우선) */
  customNote?: { ko: string; ja?: string; en?: string }
}

export const kfoodCuration: Record<string, KFoodCurationEntry> = {
  // 비어있음 — 운영 중 추가
}
