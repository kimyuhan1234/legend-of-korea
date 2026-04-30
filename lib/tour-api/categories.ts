/**
 * TourAPI 음식점 (contentTypeId=39) 분류 코드 — cat1=A05, cat2=A0502.
 * cat3 단일 값만 입력 가능 — 다중 카테고리 노출은 호출 측에서 병렬 fetch + merge.
 */

export const FOOD_CATEGORIES = {
  KOREAN: 'A05020100',
  WESTERN: 'A05020200',
  JAPANESE: 'A05020300',
  CHINESE: 'A05020400',
  EXOTIC: 'A05020700',
  CAFE: 'A05020900',
  CLUB: 'A05021000',
} as const

/** K-Food Spot 에서 노출할 카테고리 — 한식 + 이색음식 + 카페/찻집 */
export const KFOOD_SPOT_CATEGORIES = [
  FOOD_CATEGORIES.KOREAN,
  FOOD_CATEGORIES.EXOTIC,
  FOOD_CATEGORIES.CAFE,
] as const

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

/** 카드 뱃지용 5 개국어 라벨 — 노출 카테고리 만 정의 */
export const FOOD_CATEGORY_LABELS: Record<string, Record<Locale, string>> = {
  [FOOD_CATEGORIES.KOREAN]: { ko: '한식', ja: '韓食', en: 'Korean', 'zh-CN': '韩食', 'zh-TW': '韓食' },
  [FOOD_CATEGORIES.EXOTIC]: { ko: '이색음식', ja: '異色料理', en: 'Fusion', 'zh-CN': '特色', 'zh-TW': '特色' },
  [FOOD_CATEGORIES.CAFE]: { ko: '카페/찻집', ja: 'カフェ', en: 'Cafe', 'zh-CN': '咖啡', 'zh-TW': '咖啡' },
}
