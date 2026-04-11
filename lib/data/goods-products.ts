// ─────────────────────────────────────────────
//  lib/data/goods-products.ts
//  굿즈 목업 데이터 (12개 상품 × 5개 카테고리)
// ─────────────────────────────────────────────

export type GoodsCategory = 'keyring' | 'figure' | 'stationery' | 'bag' | 'misc'

export interface GoodsProduct {
  id: string
  name: { ko: string; ja: string; en: string }
  description: { ko: string; ja: string; en: string }
  category: GoodsCategory
  price: number
  lpPrice?: number
  cityId: string
  emoji: string
}

export const GOODS_PRODUCTS: GoodsProduct[] = [
  {
    id: 'goods-01',
    name: { ko: '도깨비 방망이 키링', ja: '鬼の棍棒キーリング', en: 'Dokkaebi Club Keyring' },
    description: { ko: '전주 도깨비 전설의 상징', ja: '全州の鬼伝説のシンボル', en: 'Symbol of Jeonju dokkaebi legend' },
    category: 'keyring',
    price: 8900,
    cityId: 'jeonju',
    emoji: '🗝️',
  },
  {
    id: 'goods-02',
    name: { ko: '해치 미니 피규어', ja: '獬豸ミニフィギュア', en: 'Haechi Mini Figure' },
    description: { ko: '서울을 지키는 수호신', ja: 'ソウルを守る守護神', en: "Seoul's guardian spirit" },
    category: 'figure',
    price: 15000,
    cityId: 'seoul',
    emoji: '🦁',
  },
  {
    id: 'goods-03',
    name: { ko: '인어공주 엽서 세트', ja: '人魚姫ポストカードセット', en: 'Mermaid Postcard Set' },
    description: { ko: '부산 인어 전설 8장 세트', ja: '釜山の人魚伝説8枚セット', en: '8-card set of Busan mermaid legend' },
    category: 'stationery',
    price: 6500,
    cityId: 'busan',
    emoji: '💌',
  },
  {
    id: 'goods-04',
    name: { ko: '전설 스티커팩', ja: '伝説ステッカーパック', en: 'Legend Sticker Pack' },
    description: { ko: '9개 도시 전설 캐릭터 모음', ja: '9都市の伝説キャラクター集', en: '9-city legend character collection' },
    category: 'stationery',
    price: 4900,
    cityId: 'common',
    emoji: '🌟',
  },
  {
    id: 'goods-05',
    name: { ko: '만파식적 북마크', ja: '万波息笛ブックマーク', en: 'Manpasikjeok Bookmark' },
    description: { ko: '경주 전설의 피리 북마크', ja: '慶州伝説の笛ブックマーク', en: 'Flute bookmark from Gyeongju legend' },
    category: 'stationery',
    price: 5500,
    cityId: 'gyeongju',
    emoji: '🎵',
  },
  {
    id: 'goods-06',
    name: { ko: '별주부 에코백', ja: 'ビョルジュブエコバッグ', en: 'Byeoljubu Eco Bag' },
    description: { ko: '통영 별주부 전설 에코백', ja: '統営の伝説エコバッグ', en: 'Tongyeong legend eco bag' },
    category: 'bag',
    price: 12000,
    cityId: 'tongyeong',
    emoji: '🐢',
  },
  {
    id: 'goods-07',
    name: { ko: '호두과자 캔들', ja: 'くるみ菓子キャンドル', en: 'Walnut Cake Candle' },
    description: { ko: '천안 명물 호두과자 향 캔들', ja: '天安名物くるみ菓子の香り', en: 'Cheonan walnut cake scented candle' },
    category: 'misc',
    price: 9900,
    cityId: 'cheonan',
    emoji: '🕯️',
  },
  {
    id: 'goods-08',
    name: { ko: '민속촌 마그넷', ja: '民俗村マグネット', en: 'Folk Village Magnet' },
    description: { ko: '용인 한국민속촌 냉장고 자석', ja: '龍仁韓国民俗村の冷蔵庫マグネット', en: 'Yongin Korean Folk Village fridge magnet' },
    category: 'misc',
    price: 7500,
    cityId: 'yongin',
    emoji: '🧲',
  },
  {
    id: 'goods-09',
    name: { ko: '도자기 미니컵', ja: '陶磁器ミニカップ', en: 'Ceramic Mini Cup' },
    description: { ko: '이천 장인 핸드메이드 도자기', ja: '利川職人ハンドメイド陶磁器', en: 'Icheon artisan handmade ceramic' },
    category: 'misc',
    price: 18000,
    cityId: 'icheon',
    emoji: '🏺',
  },
  {
    id: 'goods-10',
    name: { ko: '선녀와 나무꾼 포스터', ja: '仙女と木こりポスター', en: 'Fairy & Woodcutter Poster' },
    description: { ko: '제주 전설 A3 아트 포스터', ja: '済州伝説A3アートポスター', en: 'Jeju legend A3 art poster' },
    category: 'stationery',
    price: 8000,
    cityId: 'jeju',
    emoji: '🖼️',
  },
  {
    id: 'goods-11',
    name: { ko: 'LP 부스터 패키지', ja: 'LPブースターパッケージ', en: 'LP Booster Package' },
    description: { ko: '일주일간 LP 2배 적립', ja: '1週間LP2倍獲得', en: 'Double LP for one week' },
    category: 'misc',
    price: 5000,
    lpPrice: 300,
    cityId: 'common',
    emoji: '⚡',
  },
  {
    id: 'goods-12',
    name: { ko: '전설 여행 다이어리', ja: '伝説旅行ダイアリー', en: 'Legend Travel Diary' },
    description: { ko: '전설 스탬프 칸 있는 다이어리', ja: '伝説スタンプ欄付きダイアリー', en: 'Diary with legend stamp slots' },
    category: 'stationery',
    price: 14000,
    cityId: 'common',
    emoji: '📔',
  },
]

export const CATEGORIES: GoodsCategory[] = ['keyring', 'figure', 'stationery', 'bag', 'misc']

export const CATEGORY_EMOJI: Record<GoodsCategory, string> = {
  keyring: '🗝️',
  figure: '🎎',
  stationery: '📝',
  bag: '👜',
  misc: '🎁',
}
