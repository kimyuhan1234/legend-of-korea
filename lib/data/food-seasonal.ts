export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export interface SeasonalFood {
  id: string
  foodId?: string
  name: { ko: string; ja: string; en: string }
  season: Season
  months: number[]
  region: string
  seasonalIngredients: { ko: string[]; ja: string[]; en: string[] }
  whySeasonal: { ko: string; ja: string; en: string }
  priceRange: string
  instaPoint: { ko: string; ja: string; en: string }
  whereToEat: { ko: string; ja: string; en: string }
  healthTags?: string[]
  dupeCountry?: string
  dupeName?: { ko: string; ja: string; en: string }
}

export interface CalendarIngredient {
  name: string
  emoji: string
  season: Season
}

export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

export function getFoodsBySeason(season: Season): SeasonalFood[] {
  return seasonalFoods.filter((f) => f.season === season)
}

export const SEASON_META: Record<Season, {
  emoji: string
  color: string
  gradientFrom: string
  gradientTo: string
  months: string
  headline: { ko: string; ja: string; en: string; 'zh-CN': string; 'zh-TW': string }
  label: { ko: string; ja: string; en: string; 'zh-CN': string; 'zh-TW': string }
}> = {
  spring: {
    emoji: '🌸',
    color: 'text-pink-600',
    gradientFrom: 'from-pink-50',
    gradientTo: 'to-rose-100',
    months: '3~5월',
    headline: {
      ko: '새순과 봄바람이 만든 한 끼',
      ja: '新芽と春風が作った一食',
      en: 'A Meal Made of Spring Sprouts & Breeze',
      'zh-CN': '嫩芽与春风孕育的一餐',
      'zh-TW': '嫩芽與春風孕育的一餐',
    },
    label: { ko: '🌸 봄', ja: '🌸 春', en: '🌸 Spring', 'zh-CN': '🌸 春', 'zh-TW': '🌸 春' },
  },
  summer: {
    emoji: '🌊',
    color: 'text-blue-600',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-cyan-100',
    months: '6~8월',
    headline: {
      ko: '뜨거운 여름, 시원한 한 그릇',
      ja: '暑い夏、涼しい一杯',
      en: 'Cool Bowls for Hot Summer Days',
      'zh-CN': '炎炎夏日，清凉一碗',
      'zh-TW': '炎炎夏日，清涼一碗',
    },
    label: { ko: '🌊 여름', ja: '🌊 夏', en: '🌊 Summer', 'zh-CN': '🌊 夏', 'zh-TW': '🌊 夏' },
  },
  autumn: {
    emoji: '🍂',
    color: 'text-orange-600',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-amber-100',
    months: '9~11월',
    headline: {
      ko: '풍성한 가을, 바다와 산의 선물',
      ja: '豊かな秋、海と山の贈り物',
      en: "Autumn's Harvest from Sea & Mountain",
      'zh-CN': '丰收秋季，海山馈赠',
      'zh-TW': '豐收秋季，海山饋贈',
    },
    label: { ko: '🍂 가을', ja: '🍂 秋', en: '🍂 Autumn', 'zh-CN': '🍂 秋', 'zh-TW': '🍂 秋' },
  },
  winter: {
    emoji: '❄️',
    color: 'text-slate-600',
    gradientFrom: 'from-slate-50',
    gradientTo: 'to-blue-100',
    months: '12~2월',
    headline: {
      ko: '따뜻한 국물로 겨울을 이기다',
      ja: '温かいスープで冬を乗り越える',
      en: 'Warm Broths to Beat the Winter',
      'zh-CN': '暖汤驱寒，熬过冬日',
      'zh-TW': '暖湯驅寒，熬過冬日',
    },
    label: { ko: '❄️ 겨울', ja: '❄️ 冬', en: '❄️ Winter', 'zh-CN': '❄️ 冬', 'zh-TW': '❄️ 冬' },
  },
}

export const seasonalFoods: SeasonalFood[] = [
  // ── 봄 (Spring) 8개 ──────────────────────────────
  {
    id: 'spring-naengi-doenjang',
    name: { ko: '냉이된장국', ja: 'なずな味噌汁', en: "Shepherd's Purse Doenjang Soup" },
    season: 'spring',
    months: [3, 4],
    region: '전국',
    seasonalIngredients: {
      ko: ['냉이', '된장', '두부', '대파'],
      ja: ['なずな', '味噌', '豆腐', 'ネギ'],
      en: ["Shepherd's purse", 'Doenjang', 'Tofu', 'Green onion'],
    },
    whySeasonal: {
      ko: '냉이는 3~4월 봄에만 자라는 들나물로, 이 시기 수확한 것이 향이 가장 짙습니다.',
      ja: 'なずなは3〜4月の春にしか育たない野草で、この時期に収穫したものが最も香り高いです。',
      en: "Shepherd's purse grows only in spring (Mar–Apr) and is most fragrant at this harvest.",
    },
    priceRange: '₩8,000~12,000',
    instaPoint: {
      ko: '봄 향기 가득한 소박한 밥상',
      ja: '春の香りあふれる素朴な食卓',
      en: 'A humble spring table full of earthy fragrance',
    },
    whereToEat: {
      ko: '전국 한식 백반집, 가정식 전문점',
      ja: '全国の韓食定食屋、家庭料理専門店',
      en: 'Korean set-meal restaurants nationwide',
    },
    healthTags: ['immunity', 'digestion'],
    dupeCountry: 'JP',
    dupeName: { ko: '미소시루 (일본)', ja: '味噌汁 (日本)', en: 'Miso Soup (Japan)' },
  },
  {
    id: 'spring-dalrae-muchim',
    name: { ko: '달래무침', ja: 'ノビル和え', en: 'Wild Garlic Seasoned Dish' },
    season: 'spring',
    months: [3, 4],
    region: '전국',
    seasonalIngredients: {
      ko: ['달래', '간장', '참기름', '고춧가루'],
      ja: ['ノビル', '醤油', 'ごま油', '唐辛子'],
      en: ['Wild garlic', 'Soy sauce', 'Sesame oil', 'Chili powder'],
    },
    whySeasonal: {
      ko: '달래는 3~4월 봄에 자라는 야생 마늘 계열 식물로, 봄이 지나면 구하기 어렵습니다.',
      ja: 'ノビルは3〜4月の春に育つ野生ニンニク系植物で、春が過ぎると手に入りにくくなります。',
      en: 'Wild garlic grows only in spring (Mar–Apr) and becomes scarce once the season ends.',
    },
    priceRange: '₩5,000~8,000',
    instaPoint: {
      ko: '봄나물 반찬의 싱그러운 초록빛',
      ja: '春の山菜おかずの清々しい緑色',
      en: 'Refreshing green of spring herb side dish',
    },
    whereToEat: {
      ko: '전국 한식 반찬 가게, 봄 밥상 전문점',
      ja: '全国の韓食惣菜店、春の食事専門店',
      en: 'Korean side-dish shops and spring-menu restaurants',
    },
    healthTags: ['immunity', 'energy'],
    dupeCountry: 'IT',
    dupeName: { ko: '알리오 올리오 (이탈리아)', ja: 'アーリオオーリオ (イタリア)', en: 'Aglio e Olio (Italy)' },
  },
  {
    id: 'spring-ssuk-tteok',
    name: { ko: '쑥떡', ja: 'よもぎ餅', en: 'Mugwort Rice Cake' },
    season: 'spring',
    months: [3, 4, 5],
    region: '전국',
    seasonalIngredients: {
      ko: ['쑥', '찹쌀', '팥소', '설탕'],
      ja: ['よもぎ', 'もち米', '餡', '砂糖'],
      en: ['Mugwort', 'Glutinous rice', 'Red bean paste', 'Sugar'],
    },
    whySeasonal: {
      ko: '쑥은 3~5월 봄에 새순이 돋아 가장 향기롭고, 이때 만든 쑥떡이 제일 맛있습니다.',
      ja: 'よもぎは3〜5月の春に新芽が出て最も香りが良く、この時期に作ったよもぎ餅が最高です。',
      en: 'Mugwort sprouts its most fragrant new shoots in spring (Mar–May) — the best time for this rice cake.',
    },
    priceRange: '₩3,000~6,000',
    instaPoint: {
      ko: '초록빛 봄색을 담은 한 입 크기 떡',
      ja: '緑の春色を纏ったひと口サイズの餅',
      en: 'Bite-sized rice cake in vibrant spring green',
    },
    whereToEat: {
      ko: '전통 시장, 떡집, 전국 재래시장',
      ja: '伝統市場、餅屋、全国の在来市場',
      en: 'Traditional markets and rice cake shops nationwide',
    },
    healthTags: ['digestion', 'antiAging'],
    dupeCountry: 'JP',
    dupeName: { ko: '요모기 모찌 (일본)', ja: 'よもぎ餅 (日本)', en: 'Yomogi Mochi (Japan)' },
  },
  {
    id: 'spring-jukkumi-bokkeum',
    name: { ko: '주꾸미볶음', ja: 'イイダコ炒め', en: 'Spicy Webfoot Octopus Stir-fry' },
    season: 'spring',
    months: [3, 4, 5],
    region: '서해안 (보령·서산)',
    seasonalIngredients: {
      ko: ['주꾸미', '고추장', '대파', '양파', '마늘'],
      ja: ['イイダコ', 'コチュジャン', 'ネギ', '玉ねぎ', 'ニンニク'],
      en: ['Webfoot octopus', 'Gochujang', 'Green onion', 'Onion', 'Garlic'],
    },
    whySeasonal: {
      ko: '주꾸미는 3~5월 산란 직전 알이 꽉 차 있어, 이 시기에 먹어야 제맛입니다.',
      ja: 'イイダコは3〜5月の産卵直前に卵がぎっしり詰まっていて、この時期が最もおいしいです。',
      en: 'Webfoot octopus is egg-full just before spawning (Mar–May) — the season to taste it at its best.',
    },
    priceRange: '₩15,000~25,000',
    instaPoint: {
      ko: '붉은 양념에 통통한 주꾸미의 봄철 모습',
      ja: '赤いタレにぷりぷりのイイダコの春の姿',
      en: 'Plump octopus glistening in red sauce — spring at its finest',
    },
    whereToEat: {
      ko: '충남 보령·서산 주꾸미 골목, 서울 공덕시장',
      ja: '忠南・保寧・瑞山のイイダコ横丁、ソウル・孔徳市場',
      en: 'Boryeong/Seosan octopus alleys, Seoul Gongdeok Market',
    },
    healthTags: ['energy', 'immunity'],
    dupeCountry: 'ES',
    dupeName: { ko: '풀포 알 가예고 (스페인)', ja: 'プルポ・ア・ガジェガ (スペイン)', en: 'Pulpo a la Gallega (Spain)' },
  },
  {
    id: 'spring-dodari-ssuk-guk',
    foodId: 'tongyeong-dodari-ssuk',
    name: { ko: '도다리쑥국', ja: '春ヒラメよもぎスープ', en: 'Flounder & Mugwort Soup' },
    season: 'spring',
    months: [3, 4],
    region: '통영·거제',
    seasonalIngredients: {
      ko: ['도다리', '쑥', '된장', '대파', '마늘'],
      ja: ['春ヒラメ', 'よもぎ', '味噌', 'ネギ', 'ニンニク'],
      en: ['Spring flounder', 'Mugwort', 'Doenjang', 'Green onion', 'Garlic'],
    },
    whySeasonal: {
      ko: '봄 도다리는 겨울잠에서 깨어나 살이 오른 제철 생선, 쑥과 함께 끓이면 봄 향기가 극대화됩니다.',
      ja: '春のヒラメは冬眠から覚めて身が乗った旬の魚で、よもぎと一緒に煮ると春の香りが最大限に引き出されます。',
      en: 'Spring flounder wakes from winter full of flavor — simmered with mugwort, it captures the essence of spring.',
    },
    priceRange: '₩15,000~20,000',
    instaPoint: {
      ko: '맑은 국물 위 초록 쑥의 봄 감성',
      ja: '澄んだスープに浮かぶ緑のよもぎの春感',
      en: 'Clear broth floating with green mugwort — pure spring energy',
    },
    whereToEat: {
      ko: '통영 중앙시장, 거제 고현시장 주변 식당',
      ja: '統営・中央市場、巨済・古峴市場周辺の食堂',
      en: 'Restaurants near Tongyeong Central Market, Geoje Gohyeon Market',
    },
    healthTags: ['skin', 'immunity'],
    dupeCountry: 'JP',
    dupeName: { ko: '봄 아오사 된장국 (일본)', ja: '春の青海苔味噌汁 (日本)', en: 'Spring Seaweed Miso Soup (Japan)' },
  },
  {
    id: 'spring-namul-bibimbap',
    foodId: 'yongin-sanchae-bibimbap',
    name: { ko: '봄나물비빔밥', ja: '春の山菜ビビンバ', en: 'Spring Herb Bibimbap' },
    season: 'spring',
    months: [3, 4, 5],
    region: '전국 (전주·용인 대표)',
    seasonalIngredients: {
      ko: ['냉이', '달래', '두릅', '쑥', '봄동', '고추장'],
      ja: ['なずな', 'ノビル', 'タラの芽', 'よもぎ', '春キャベツ', 'コチュジャン'],
      en: ["Shepherd's purse", 'Wild garlic', 'Aralia shoots', 'Mugwort', 'Spring cabbage', 'Gochujang'],
    },
    whySeasonal: {
      ko: '봄에만 나는 산나물이 비빔밥 핵심 재료, 제철 나물의 비타민과 향기가 일품입니다.',
      ja: '春にしか採れない山菜がビビンバの核心食材で、旬の山菜のビタミンと香りが絶品です。',
      en: 'Wild spring herbs are the heart of this bibimbap — their seasonal vitamins and fragrance are unmatched.',
    },
    priceRange: '₩12,000~18,000',
    instaPoint: {
      ko: '오색 봄나물이 올라간 화려한 비빔밥 한 그릇',
      ja: '五色の春山菜が盛られた華やかなビビンバ一杯',
      en: 'A vibrant bowl crowned with five-color spring herbs',
    },
    whereToEat: {
      ko: '전주 한옥마을, 용인 산채 전문 식당, 전국 봄 한식 특선',
      ja: '全州韓屋村、龍仁の山菜専門食堂、全国の春の韓食特選',
      en: 'Jeonju Hanok Village, Yongin mountain herb restaurants, spring specials nationwide',
    },
    healthTags: ['skin', 'diet', 'digestion'],
    dupeCountry: 'ID',
    dupeName: { ko: '나시 캄푸르 (인도네시아)', ja: 'ナシ・チャンプル (インドネシア)', en: 'Nasi Campur (Indonesia)' },
  },
  {
    id: 'spring-meongge-bibimbap',
    foodId: 'tongyeong-meongge-bibimbap',
    name: { ko: '멍게비빔밥', ja: 'ホヤビビンバ', en: 'Sea Squirt Bibimbap' },
    season: 'spring',
    months: [4, 5],
    region: '통영',
    seasonalIngredients: {
      ko: ['멍게', '밥', '오이', '깻잎', '참기름'],
      ja: ['ホヤ', 'ご飯', 'キュウリ', 'エゴマの葉', 'ごま油'],
      en: ['Sea squirt', 'Rice', 'Cucumber', 'Perilla leaf', 'Sesame oil'],
    },
    whySeasonal: {
      ko: '멍게는 4~5월 차가운 겨울 바닷속에서 자라 가장 신선하고 향기로운 봄 진미입니다.',
      ja: 'ホヤは4〜5月の冷たい冬の海で育ち、最も新鮮で香り高い春の珍味です。',
      en: 'Sea squirt grows in cold winter waters and peaks in Apr–May as the most fragrant spring delicacy.',
    },
    priceRange: '₩15,000~22,000',
    instaPoint: {
      ko: '오렌지빛 멍게와 초록 나물이 어우러진 바다의 색',
      ja: 'オレンジ色のホヤと緑の野草が調和した海の色',
      en: 'Ocean hues of orange sea squirt and green herbs harmonized in one bowl',
    },
    whereToEat: {
      ko: '통영 서호시장, 통영 항구 주변 식당',
      ja: '統営西湖市場、統営港周辺の食堂',
      en: 'Tongyeong Seoho Market, restaurants around Tongyeong harbor',
    },
    healthTags: ['energy', 'skin', 'immunity'],
    dupeCountry: 'JP',
    dupeName: { ko: '우니동 (일본)', ja: 'うに丼 (日本)', en: 'Sea Urchin Rice Bowl (Japan)' },
  },
  {
    id: 'spring-beojkot-makgeolli',
    name: { ko: '벚꽃막걸리', ja: '桜マッコリ', en: 'Cherry Blossom Makgeolli' },
    season: 'spring',
    months: [3, 4],
    region: '경주·전국',
    seasonalIngredients: {
      ko: ['찹쌀', '누룩', '벚꽃', '물'],
      ja: ['もち米', '麹', '桜の花', '水'],
      en: ['Glutinous rice', 'Nuruk (yeast)', 'Cherry blossom', 'Water'],
    },
    whySeasonal: {
      ko: '벚꽃 시즌(3~4월)에만 한정 출시되는 봄 막걸리로, 분홍빛 색과 향이 특징입니다.',
      ja: '桜のシーズン(3〜4月)にのみ限定販売される春のマッコリで、ピンク色と香りが特徴です。',
      en: 'A spring-limited makgeolli released only during cherry blossom season (Mar–Apr) with a rosy hue.',
    },
    priceRange: '₩5,000~15,000',
    instaPoint: {
      ko: '분홍빛 벚꽃이 담긴 봄 한정 막걸리',
      ja: 'ピンク色の桜が入った春限定マッコリ',
      en: 'Spring-limited makgeolli with delicate cherry blossom pink',
    },
    whereToEat: {
      ko: '경주 보문단지, 전국 전통주 판매점, 봄 축제 현장',
      ja: '慶州普門団地、全国の伝統酒販売店、春祭り会場',
      en: 'Gyeongju Bomun resort, traditional liquor shops, spring festivals',
    },
    healthTags: ['digestion', 'immunity'],
    dupeCountry: 'JP',
    dupeName: { ko: '사쿠라 사케 (일본)', ja: '桜酒 (日本)', en: 'Sakura Sake (Japan)' },
  },

  // ── 여름 (Summer) 8개 ────────────────────────────────
  {
    id: 'summer-naengmyeon',
    foodId: 'busan-milmyeon',
    name: { ko: '냉면', ja: '冷麺', en: 'Naengmyeon (Cold Noodles)' },
    season: 'summer',
    months: [6, 7, 8],
    region: '전국 (평양·함흥·부산 유명)',
    seasonalIngredients: {
      ko: ['메밀면', '냉육수', '오이', '삶은 계란', '배'],
      ja: ['そば麺', '冷たい出汁', 'キュウリ', 'ゆで卵', '梨'],
      en: ['Buckwheat noodles', 'Cold broth', 'Cucumber', 'Boiled egg', 'Pear'],
    },
    whySeasonal: {
      ko: '여름 더위를 이기는 전통 보양식, 얼음이 동동 떠있는 차가운 육수가 여름의 별미입니다.',
      ja: '夏の暑さを乗り越える伝統の補養食で、氷が浮かぶ冷たいスープが夏の醍醐味です。',
      en: 'A traditional summer fortifier — ice-cold broth and smooth noodles are the ultimate summer relief.',
    },
    priceRange: '₩10,000~16,000',
    instaPoint: {
      ko: '새콤달콤 물냉면의 붉은 육수와 둥둥 떠있는 얼음',
      ja: '酸っぱ甘い水冷麺の赤いスープと浮かぶ氷',
      en: 'Tangy-sweet broth with ice floating in a bowl of silk noodles',
    },
    whereToEat: {
      ko: '서울 을지로 평양냉면 골목, 함흥냉면집, 부산 밀면 전문점',
      ja: 'ソウル乙支路の平壌冷麺横丁、咸興冷麺店、釜山ミルミョン専門店',
      en: 'Euljiro Pyongyang cold noodle alley in Seoul, Hamhung cold noodle shops, Busan milmyeon spots',
    },
    healthTags: ['diet', 'digestion'],
    dupeCountry: 'JP',
    dupeName: { ko: '히야시추카 (일본)', ja: '冷やし中華 (日本)', en: 'Hiyashi Chuka (Japan)' },
  },
  {
    id: 'summer-kongguksu',
    foodId: 'icheon-kongguksu',
    name: { ko: '콩국수', ja: 'コングクス', en: 'Cold Soy Milk Noodles' },
    season: 'summer',
    months: [6, 7, 8],
    region: '전국 (이천·서울 유명)',
    seasonalIngredients: {
      ko: ['콩', '소면', '오이', '참깨', '소금'],
      ja: ['大豆', '素麺', 'キュウリ', 'ごま', '塩'],
      en: ['Soybeans', 'Thin noodles', 'Cucumber', 'Sesame', 'Salt'],
    },
    whySeasonal: {
      ko: '여름 햇콩이 가장 신선하며, 차갑게 갈아 만든 콩국물이 폭염을 식혀줍니다.',
      ja: '夏の新大豆が最も新鮮で、冷たくすり潰して作った豆乳スープが猛暑を冷やしてくれます。',
      en: 'Summer fresh soybeans are at their best — blended cold into creamy soup, they cool down the heat.',
    },
    priceRange: '₩10,000~14,000',
    instaPoint: {
      ko: '새하얀 콩물에 담긴 소면, 고소한 여름 비주얼',
      ja: '真っ白な豆乳に浸った素麺、香ばしい夏のビジュアル',
      en: 'Silky noodles submerged in creamy white soy milk — a nutty summer vision',
    },
    whereToEat: {
      ko: '이천 백반집, 서울 전국 콩국수 전문점',
      ja: '利川の定食屋、ソウル全国のコングクス専門店',
      en: 'Icheon set-meal restaurants, cold soy milk noodle shops across Korea',
    },
    healthTags: ['skin', 'diet', 'bone'],
    dupeCountry: 'CN',
    dupeName: { ko: '더우장 (중국)', ja: '豆漿 (中国)', en: 'Doujiang Soy Milk (China)' },
  },
  {
    id: 'summer-samgyetang',
    foodId: 'gyeongju-samgyetang',
    name: { ko: '삼계탕', ja: 'サムゲタン', en: 'Ginseng Chicken Soup' },
    season: 'summer',
    months: [6, 7, 8],
    region: '전국',
    seasonalIngredients: {
      ko: ['영계', '인삼', '대추', '마늘', '찹쌀'],
      ja: ['若鶏', '人参', 'なつめ', 'ニンニク', 'もち米'],
      en: ['Young chicken', 'Ginseng', 'Jujube', 'Garlic', 'Glutinous rice'],
    },
    whySeasonal: {
      ko: '삼복(초복·중복·말복) 무더위에 먹는 이열치열 보양식, 뜨거운 국물로 더위를 이깁니다.',
      ja: '夏の三伏(初伏・中伏・末伏)の暑さに食べる以熱治熱の補養食で、熱いスープで暑さを乗り越えます。',
      en: 'Eaten during the hottest days (sambok) to fight heat with heat — a legendary summer fortifier.',
    },
    priceRange: '₩15,000~25,000',
    instaPoint: {
      ko: '뚝배기에서 김이 피어오르는 황금빛 삼계탕',
      ja: '土鍋から湯気が立ち上る黄金色のサムゲタン',
      en: 'Steam rising from a clay pot of golden ginseng chicken — summer ritual',
    },
    whereToEat: {
      ko: '서울 종로 토속촌, 전국 삼계탕 전문점',
      ja: 'ソウル・鍾路の土俗村、全国のサムゲタン専門店',
      en: 'Tosokchon in Jongno Seoul, ginseng chicken specialists nationwide',
    },
    healthTags: ['immunity', 'energy', 'antiAging'],
    dupeCountry: 'CN',
    dupeName: { ko: '백절계 (중국)', ja: '白切鶏 (中国)', en: 'White Cut Chicken (China)' },
  },
  {
    id: 'summer-jangeo-gui',
    foodId: 'yeosu-jangeo-tang',
    name: { ko: '장어구이', ja: '鰻の焼き物', en: 'Grilled Eel' },
    season: 'summer',
    months: [6, 7, 8],
    region: '여수·부산·목포',
    seasonalIngredients: {
      ko: ['민물장어', '소금', '양념장', '깻잎'],
      ja: ['うなぎ', '塩', 'タレ', 'エゴマの葉'],
      en: ['Freshwater eel', 'Salt', 'Sauce', 'Perilla leaf'],
    },
    whySeasonal: {
      ko: '복날 대표 스태미나 보양식, 장어의 DHA와 비타민이 여름 더위에 떨어진 체력을 보충합니다.',
      ja: '夏の土用の丑の日の代表的なスタミナ補養食で、鰻のDHAとビタミンが夏の疲れを補います。',
      en: "Eel's DHA and vitamins are the ultimate summer stamina food, replenishing energy lost to the heat.",
    },
    priceRange: '₩30,000~50,000',
    instaPoint: {
      ko: '불판 위 지글거리는 황금빛 장어',
      ja: '鉄板でジュージューと焼けるきつね色の鰻',
      en: 'Golden eel sizzling on a hot grill — summer at its finest',
    },
    whereToEat: {
      ko: '여수 웅천장어거리, 부산 기장 장어골목',
      ja: '麗水・熊川鰻横丁、釜山・機張の鰻横丁',
      en: 'Yeosu Ungcheon eel alley, Busan Gijang eel street',
    },
    healthTags: ['energy', 'skin', 'antiAging'],
    dupeCountry: 'JP',
    dupeName: { ko: '우나기동 (일본)', ja: 'うな丼 (日本)', en: 'Unaju Eel Rice Bowl (Japan)' },
  },
  {
    id: 'summer-jeonbok-juk',
    foodId: 'busan-jeonbok-juk',
    name: { ko: '전복죽', ja: 'アワビ粥', en: 'Abalone Porridge' },
    season: 'summer',
    months: [6, 7, 8],
    region: '제주·완도',
    seasonalIngredients: {
      ko: ['전복', '쌀', '참기름', '당근', '간장'],
      ja: ['アワビ', '米', 'ごま油', 'にんじん', '醤油'],
      en: ['Abalone', 'Rice', 'Sesame oil', 'Carrot', 'Soy sauce'],
    },
    whySeasonal: {
      ko: '전복은 여름에도 제철, 더위로 기력이 떨어질 때 전복죽 한 그릇으로 체력을 회복합니다.',
      ja: 'アワビは夏も旬で、暑さで体力が落ちた時にアワビ粥一杯で体力を回復できます。',
      en: 'Abalone is in season in summer too — one bowl of abalone porridge restores energy lost to the heat.',
    },
    priceRange: '₩25,000~40,000',
    instaPoint: {
      ko: '흑진주 같은 전복이 반짝이는 노란 죽',
      ja: '黒真珠のようなアワビが輝く黄色いお粥',
      en: 'Yellow porridge with black-pearl abalone glistening on top',
    },
    whereToEat: {
      ko: '제주 올레길 주변, 완도 전복 요리 전문점',
      ja: '済州オルレ道周辺、莞島アワビ料理専門店',
      en: 'Jeju Olle trail restaurants, Wando abalone specialist restaurants',
    },
    healthTags: ['energy', 'immunity', 'antiAging'],
    dupeCountry: 'JP',
    dupeName: { ko: '아와비가유 (일본)', ja: 'あわびがゆ (日本)', en: 'Awabi Kayo Abalone Porridge (Japan)' },
  },
  {
    id: 'summer-mulhoe',
    foodId: 'jeju-mulhoe',
    name: { ko: '물회', ja: 'ムルフェ', en: 'Cold Raw Fish Soup' },
    season: 'summer',
    months: [6, 7, 8],
    region: '제주·속초·포항',
    seasonalIngredients: {
      ko: ['신선 활어', '오이', '깻잎', '초고추장', '얼음'],
      ja: ['新鮮な活魚', 'キュウリ', 'エゴマの葉', '酢コチュジャン', '氷'],
      en: ['Fresh live fish', 'Cucumber', 'Perilla leaf', 'Vinegar gochujang', 'Ice'],
    },
    whySeasonal: {
      ko: '여름 바다의 신선한 활어를 차갑게 먹는 것이 최고, 얼음을 넣어 더욱 시원하게 즐깁니다.',
      ja: '夏の海の新鮮な活魚を冷たく食べるのが最高で、氷を入れてさらに涼しく楽しみます。',
      en: 'Fresh summer sea fish served ice-cold — a refreshing slice of the ocean for hot days.',
    },
    priceRange: '₩15,000~25,000',
    instaPoint: {
      ko: '형형색색 채소와 회가 어우러진 여름 그릇',
      ja: '色とりどりの野菜と刺身が調和した夏の器',
      en: 'A bowl of colorful vegetables and fish — a summer ocean in a dish',
    },
    whereToEat: {
      ko: '제주 올레시장, 속초 아바이마을, 포항 구룡포',
      ja: '済州オルレ市場、束草アバイ村、浦項九龍浦',
      en: 'Jeju Olle Market, Sokcho Abai village, Pohang Guryongpo',
    },
    healthTags: ['diet', 'skin', 'energy'],
    dupeCountry: 'PE',
    dupeName: { ko: '세비체 (페루)', ja: 'セビーチェ (ペルー)', en: 'Ceviche (Peru)' },
  },
  {
    id: 'summer-patbingsu',
    name: { ko: '팥빙수', ja: 'パッピンス', en: 'Red Bean Shaved Ice' },
    season: 'summer',
    months: [6, 7, 8],
    region: '전국',
    seasonalIngredients: {
      ko: ['얼음', '팥', '떡', '연유', '과일'],
      ja: ['氷', '小豆', '餅', '練乳', 'フルーツ'],
      en: ['Shaved ice', 'Red beans', 'Rice cake', 'Condensed milk', 'Fruit'],
    },
    whySeasonal: {
      ko: '무더위에 먹는 전통 빙과, 한여름 밤의 국민 디저트입니다.',
      ja: '猛暑に食べる伝統的な氷菓、真夏の夜の国民的デザートです。',
      en: 'A beloved traditional iced dessert enjoyed in the heat — a summer night staple.',
    },
    priceRange: '₩8,000~18,000',
    instaPoint: {
      ko: '눈처럼 쌓인 빙수 위 빨간 팥과 초록 떡의 색 대비',
      ja: '雪のように積もった氷の上の赤い小豆と緑の餅の色対比',
      en: 'Snow-white shaved ice topped with vivid red beans and green rice cake — summer art',
    },
    whereToEat: {
      ko: '전국 빙수 전문점, 백화점 식당가, 카페',
      ja: '全国のパッピンス専門店、百貨店フードコート、カフェ',
      en: 'Bingsu shops, department store food halls, cafes nationwide',
    },
    healthTags: ['energy', 'digestion'],
    dupeCountry: 'JP',
    dupeName: { ko: '카키고리 (일본)', ja: 'かき氷 (日本)', en: 'Kakigori Shaved Ice (Japan)' },
  },
  {
    id: 'summer-subak-hwachae',
    name: { ko: '수박화채', ja: 'スイカファチェ', en: 'Watermelon Punch' },
    season: 'summer',
    months: [7, 8],
    region: '전국 (함안·고창 유명)',
    seasonalIngredients: {
      ko: ['수박', '사이다', '얼음', '설탕'],
      ja: ['スイカ', 'サイダー', '氷', '砂糖'],
      en: ['Watermelon', 'Cider soda', 'Ice', 'Sugar'],
    },
    whySeasonal: {
      ko: '7~8월 수박이 절정에 달하는 시기, 수박 속을 파서 만드는 전통 화채는 여름의 시그니처입니다.',
      ja: '7〜8月がスイカの最盛期で、スイカの中身をくりぬいて作る伝統的なファチェは夏のシグネチャーです。',
      en: 'Watermelon peaks in Jul–Aug — scooped and mixed into traditional punch, it is the signature of summer.',
    },
    priceRange: '₩5,000~10,000',
    instaPoint: {
      ko: '수박 껍질 그릇에 담긴 빨간 화채의 여름 감성',
      ja: 'スイカの皮を器にした赤いファチェの夏の感性',
      en: 'Ruby-red punch served in a watermelon bowl — the very picture of summer',
    },
    whereToEat: {
      ko: '전국 과일 카페, 한정식집 후식, 가정 여름 별미',
      ja: '全国のフルーツカフェ、韓定食のデザート、家庭の夏のご馳走',
      en: 'Fruit cafes, Korean-course restaurant desserts, home summer treat',
    },
    healthTags: ['diet', 'energy'],
    dupeCountry: 'ES',
    dupeName: { ko: '가스파초 (스페인)', ja: 'ガスパチョ (スペイン)', en: 'Gazpacho (Spain)' },
  },

  // ── 가을 (Autumn) 8개 ────────────────────────────────
  {
    id: 'autumn-kkotge-jjim',
    name: { ko: '꽃게찜', ja: 'ワタリガニ蒸し', en: 'Steamed Blue Crab' },
    season: 'autumn',
    months: [9, 10],
    region: '인천 소래포구·서해안',
    seasonalIngredients: {
      ko: ['꽃게', '된장', '대파', '마늘'],
      ja: ['ワタリガニ', '味噌', 'ネギ', 'ニンニク'],
      en: ['Blue crab', 'Doenjang', 'Green onion', 'Garlic'],
    },
    whySeasonal: {
      ko: '9~10월 꽃게는 알이 꽉 차고 살이 통통, "가을 꽃게는 봄 참조기보다 낫다"는 말이 있습니다.',
      ja: '9〜10月のワタリガニは卵がぎっしり詰まり身がふっくら、「秋のワタリガニは春のグチより美味しい」と言われます。',
      en: 'Autumn blue crabs (Sep–Oct) are roe-full and plump — "better than any spring fish" goes the saying.',
    },
    priceRange: '₩20,000~40,000',
    instaPoint: {
      ko: '꽉 찬 알배기 꽃게의 주황빛 가을 색감',
      ja: 'たっぷり詰まった卵持ちワタリガニのオレンジ色の秋の彩り',
      en: 'Orange-hued roe-packed crab — a feast for the eyes and palate',
    },
    whereToEat: {
      ko: '인천 소래포구, 충남 서천·태안 어시장',
      ja: '仁川・蘇萊浦口、忠南・舒川・泰安の漁市場',
      en: 'Incheon Sorae Port, Seocheon/Taean fish markets in South Chungnam',
    },
    healthTags: ['immunity', 'skin'],
    dupeCountry: 'CN',
    dupeName: { ko: '상하이 대자해 (중국)', ja: '上海大閘蟹 (中国)', en: 'Shanghai Hairy Crab (China)' },
  },
  {
    id: 'autumn-daeha-gui',
    name: { ko: '대하구이', ja: '大海老の塩焼き', en: 'Salt-Grilled Large Shrimp' },
    season: 'autumn',
    months: [9, 10],
    region: '충남 보령·서천',
    seasonalIngredients: {
      ko: ['대하', '천일염', '참기름'],
      ja: ['大海老', '天日塩', 'ごま油'],
      en: ['Large shrimp', 'Sea salt', 'Sesame oil'],
    },
    whySeasonal: {
      ko: '9~10월 서해 대하 철, 통통하고 달콤한 맛이 절정에 달하는 시기입니다.',
      ja: '9〜10月が西海の大海老の季節で、ぷりぷりで甘い味が最高潮に達する時期です。',
      en: 'Sep–Oct is the peak of West Sea large shrimp season — plump and sweet at their finest.',
    },
    priceRange: '₩25,000~45,000',
    instaPoint: {
      ko: '소금 위에서 굽는 대하의 붉은 빛깔 가을 장면',
      ja: '塩の上で焼く大海老の赤みがかった秋の風景',
      en: 'Crimson shrimp roasting on sea salt — an iconic autumn table scene',
    },
    whereToEat: {
      ko: '충남 보령·서천 대하 축제 현장 및 주변 식당',
      ja: '忠南・保寧・舒川の大海老祭り会場および周辺食堂',
      en: 'Boryeong/Seocheon shrimp festival and nearby restaurants',
    },
    healthTags: ['energy', 'skin'],
    dupeCountry: 'ES',
    dupeName: { ko: '감바스 알 아히요 (스페인)', ja: 'ガンバスアルアヒージョ (スペイン)', en: 'Gambas al Ajillo (Spain)' },
  },
  {
    id: 'autumn-jeoneo-gui',
    name: { ko: '전어구이', ja: 'コノシロの焼き物', en: 'Grilled Gizzard Shad' },
    season: 'autumn',
    months: [9, 10],
    region: '여수·통영·광양',
    seasonalIngredients: {
      ko: ['전어', '소금', '깻잎', '마늘'],
      ja: ['コノシロ', '塩', 'エゴマの葉', 'ニンニク'],
      en: ['Gizzard shad', 'Salt', 'Perilla leaf', 'Garlic'],
    },
    whySeasonal: {
      ko: '"가을 전어는 집 나간 며느리도 돌아오게 한다" — 9~10월 전어가 기름지고 맛있습니다.',
      ja: '「秋のコノシロは家出した嫁も帰らせる」—9〜10月のコノシロが脂がのって美味しいです。',
      en: '"Autumn gizzard shad is so good it brings back a runaway bride" — Oct fish at peak fat.',
    },
    priceRange: '₩20,000~35,000',
    instaPoint: {
      ko: '불판 위 황금빛 전어구이에서 피어오르는 고소한 연기',
      ja: '鉄板の上の黄金色のコノシロ焼きから立ち上る香ばしい煙',
      en: 'Golden-grilled shad with fragrant smoke — the scent of autumn Korea',
    },
    whereToEat: {
      ko: '여수 돌산도, 광양 전어 축제, 통영 항구',
      ja: '麗水・突山島、光陽・コノシロ祭り、統営港',
      en: 'Dolsan Island in Yeosu, Gwangyang gizzard shad festival, Tongyeong harbor',
    },
    healthTags: ['skin', 'heart', 'energy'],
    dupeCountry: 'JP',
    dupeName: { ko: '산마구이 (일본)', ja: 'さんまの塩焼き (日本)', en: 'Grilled Saury (Japan)' },
  },
  {
    id: 'autumn-songi-jeongol',
    foodId: 'cheonan-mushroom-stew',
    name: { ko: '송이버섯전골', ja: '松茸チョンゴル', en: 'Pine Mushroom Hot Pot' },
    season: 'autumn',
    months: [9, 10],
    region: '강원도 양양·경북 봉화',
    seasonalIngredients: {
      ko: ['송이버섯', '소고기', '채소', '육수', '당면'],
      ja: ['松茸', '牛肉', '野菜', '出汁', '春雨'],
      en: ['Pine mushroom', 'Beef', 'Vegetables', 'Broth', 'Glass noodles'],
    },
    whySeasonal: {
      ko: '송이는 9~10월 서늘한 가을 소나무 숲에서만 채취 가능한 한국 최고의 가을 식재료입니다.',
      ja: '松茸は9〜10月の涼しい秋の松林でのみ採取できる韓国最高の秋の食材です。',
      en: 'Pine mushrooms are harvested only in cool autumn pine forests (Sep–Oct) — Korea\'s most prized fall ingredient.',
    },
    priceRange: '₩50,000~100,000',
    instaPoint: {
      ko: '비싸고 귀한 송이가 가득한 황금빛 전골',
      ja: '高価で貴重な松茸がたっぷりの黄金色のチョンゴル',
      en: 'A rare golden hot pot brimming with precious pine mushrooms',
    },
    whereToEat: {
      ko: '양양·봉화 현지 식당, 서울 고급 한식당',
      ja: '양양・鳳化の現地食堂、ソウルの高級韓食堂',
      en: 'Local restaurants in Yangyang/Bonghwa, high-end Korean restaurants in Seoul',
    },
    healthTags: ['immunity', 'antiAging', 'diet'],
    dupeCountry: 'IT',
    dupeName: { ko: '포르치니 리조토 (이탈리아)', ja: 'ポルチーニリゾット (イタリア)', en: 'Porcini Risotto (Italy)' },
  },
  {
    id: 'autumn-ganjang-gejang',
    foodId: 'icheon-ganjang-gejang',
    name: { ko: '간장게장', ja: '醤油カニ漬け', en: 'Soy-Marinated Crab' },
    season: 'autumn',
    months: [9, 10],
    region: '전국 (이천·여수 유명)',
    seasonalIngredients: {
      ko: ['꽃게', '간장', '마늘', '생강', '고추'],
      ja: ['ワタリガニ', '醤油', 'ニンニク', '生姜', '唐辛子'],
      en: ['Blue crab', 'Soy sauce', 'Garlic', 'Ginger', 'Chili'],
    },
    whySeasonal: {
      ko: '가을 꽃게가 알이 풍부해 간장게장 최고의 재료, "밥 도둑"이라는 별명이 생긴 계절 별미.',
      ja: '秋のワタリガニは卵が豊富で醤油カニ漬けの最高の食材。「ご飯泥棒」という異名が生まれた季節の珍味。',
      en: 'Autumn crabs are roe-rich — perfect for marinating. Nicknamed "the rice thief" for good reason.',
    },
    priceRange: '₩30,000~50,000',
    instaPoint: {
      ko: '투명 주황빛 게알이 반짝이는 밥도둑 간장게장',
      ja: '透明なオレンジ色の蟹の卵が輝くご飯泥棒の醤油カニ漬け',
      en: 'Translucent orange crab roe glistening — the legendary "rice thief" of Korean cuisine',
    },
    whereToEat: {
      ko: '이천 게장 전문점, 강남 게장백반집, 여수 현지',
      ja: '利川のケジャン専門店、江南ケジャン定食店、麗水現地',
      en: 'Icheon crab marinade shops, Gangnam gejang set-meal restaurants, Yeosu local',
    },
    healthTags: ['immunity', 'skin', 'digestion'],
    dupeCountry: 'CN',
    dupeName: { ko: '취하마 (중국)', ja: '醉蝦蟹 (中国)', en: 'Drunk Crab in Soy (China)' },
  },
  {
    id: 'autumn-bam-makgeolli',
    foodId: 'yongin-makgeolli',
    name: { ko: '밤막걸리', ja: '栗マッコリ', en: 'Chestnut Makgeolli' },
    season: 'autumn',
    months: [9, 10, 11],
    region: '공주·광주(경기)',
    seasonalIngredients: {
      ko: ['찹쌀', '누룩', '밤', '물'],
      ja: ['もち米', '麹', '栗', '水'],
      en: ['Glutinous rice', 'Nuruk (yeast)', 'Chestnut', 'Water'],
    },
    whySeasonal: {
      ko: '가을 햇밤이 가장 달고 통통해 막걸리 재료로 최적, 밤 향기가 풍부한 시즌 한정 막걸리입니다.',
      ja: '秋の新栗が最も甘くふっくらしてマッコリの食材として最適で、栗の香り豊かなシーズン限定マッコリです。',
      en: "Autumn fresh chestnuts are sweetest and plumpest — perfect for makgeolli and unmistakably seasonal.",
    },
    priceRange: '₩5,000~12,000',
    instaPoint: {
      ko: '황금빛 밤 막걸리의 풍성한 가을 감성',
      ja: '黄金色の栗マッコリの豊かな秋の感性',
      en: 'Golden chestnut makgeolli — the mellow taste of autumn in a glass',
    },
    whereToEat: {
      ko: '공주 밤 축제, 광주(경기) 전통주 판매점',
      ja: '公州・栗祭り、光州(京畿)の伝統酒販売店',
      en: 'Gongju Chestnut Festival, traditional liquor shops in Gwangju (Gyeonggi)',
    },
    healthTags: ['digestion', 'immunity'],
    dupeCountry: 'JP',
    dupeName: { ko: '구리 니혼슈 (일본)', ja: '栗日本酒 (日本)', en: 'Chestnut Sake (Japan)' },
  },
  {
    id: 'autumn-gamjatang',
    foodId: 'seoul-gamjatang',
    name: { ko: '감자탕', ja: 'カムジャタン', en: 'Pork Bone & Potato Stew' },
    season: 'autumn',
    months: [10, 11],
    region: '전국 (서울 유명)',
    seasonalIngredients: {
      ko: ['돼지 등뼈', '감자', '들깻가루', '배추', '고추'],
      ja: ['豚背骨', 'じゃがいも', 'えごまの粉', '白菜', '唐辛子'],
      en: ['Pork spine', 'Potato', 'Perilla powder', 'Napa cabbage', 'Chili'],
    },
    whySeasonal: {
      ko: '가을부터 겨울에 걸쳐 찬바람이 불기 시작하면 생각나는 뜨끈한 뼈 국물 음식입니다.',
      ja: '秋から冬にかけて冷たい風が吹き始めると食べたくなる熱々の骨スープ料理です。',
      en: 'As cold autumn winds begin to blow, this hot pork-bone stew is exactly what the body craves.',
    },
    priceRange: '₩12,000~18,000',
    instaPoint: {
      ko: '진한 뼈 국물 속 통감자의 가을 감성',
      ja: '濃厚な骨スープの中の丸じゃがいもの秋の感性',
      en: 'Whole potatoes bobbing in thick pork-bone broth — autumn in a bowl',
    },
    whereToEat: {
      ko: '서울 청량리·마포 감자탕 골목, 전국 전문점',
      ja: 'ソウル清凉里・麻浦カムジャタン横丁、全国の専門店',
      en: 'Cheongnyangni/Mapo pork stew alleys in Seoul, specialist restaurants nationwide',
    },
    healthTags: ['energy', 'bone'],
    dupeCountry: 'VN',
    dupeName: { ko: '분보남보 (베트남)', ja: 'ブンボーナムボー (ベトナム)', en: 'Bun Bo Nam Bo (Vietnam)' },
  },
  {
    id: 'autumn-hobak-juk',
    name: { ko: '호박죽', ja: 'カボチャ粥', en: 'Pumpkin Porridge' },
    season: 'autumn',
    months: [10, 11],
    region: '전국',
    seasonalIngredients: {
      ko: ['늙은 호박', '찹쌀', '팥', '새알심', '설탕'],
      ja: ['老いかぼちゃ', 'もち米', '小豆', '白玉', '砂糖'],
      en: ['Old pumpkin', 'Glutinous rice', 'Red beans', 'Rice dumplings', 'Sugar'],
    },
    whySeasonal: {
      ko: '가을에 수확한 늙은 호박이 달고 부드러워 죽으로 만들기 최적, 베타카로틴이 풍부합니다.',
      ja: '秋に収穫した老いかぼちゃが甘く柔らかくお粥にするのに最適で、βカロテンが豊富です。',
      en: 'Autumn-harvested old pumpkin is sweet and soft — ideal for porridge and rich in beta-carotene.',
    },
    priceRange: '₩8,000~12,000',
    instaPoint: {
      ko: '주황빛 호박죽에 하얀 새알심, 따뜻한 가을 그릇',
      ja: 'オレンジ色のカボチャ粥に白い白玉、温かい秋の器',
      en: 'Golden pumpkin porridge with white rice dumplings — a warm autumn bowl',
    },
    whereToEat: {
      ko: '전통 죽 전문점, 남대문시장, 광장시장',
      ja: '伝統的なお粥専門店、南大門市場、広蔵市場',
      en: 'Traditional porridge shops, Namdaemun Market, Gwangjang Market',
    },
    healthTags: ['digestion', 'energy', 'eye'],
    dupeCountry: 'JP',
    dupeName: { ko: '가보차노니모노 (일본)', ja: 'かぼちゃの煮物 (日本)', en: 'Simmered Pumpkin (Japan)' },
  },

  // ── 겨울 (Winter) 8개 ────────────────────────────────
  {
    id: 'winter-gul-gukbap',
    foodId: 'tongyeong-oyster-soup',
    name: { ko: '굴국밥', ja: '牡蠣クッパ', en: 'Oyster Rice Soup' },
    season: 'winter',
    months: [11, 12, 1, 2],
    region: '통영·거제',
    seasonalIngredients: {
      ko: ['굴', '밥', '대파', '된장', '참기름'],
      ja: ['牡蠣', 'ご飯', 'ネギ', '味噌', 'ごま油'],
      en: ['Oyster', 'Cooked rice', 'Green onion', 'Doenjang', 'Sesame oil'],
    },
    whySeasonal: {
      ko: '굴은 11월~2월 차가운 겨울 바다에서 가장 통통하고 신선, "바다의 우유"가 절정에 달합니다.',
      ja: '牡蠣は11月〜2月の冷たい冬の海で最もぷりぷりで新鮮で、「海のミルク」が絶頂に達します。',
      en: 'Oysters peak in cold winter waters (Nov–Feb) — their nickname "milk of the sea" rings truest now.',
    },
    priceRange: '₩10,000~15,000',
    instaPoint: {
      ko: '투실투실한 겨울 굴이 가득한 뽀얀 국물',
      ja: 'ぷりぷりの冬の牡蠣がたっぷり入った白いスープ',
      en: 'Milky white broth brimming with plump winter oysters',
    },
    whereToEat: {
      ko: '통영 서호시장, 거제 고현시장',
      ja: '統営・西湖市場、巨済・古峴市場',
      en: 'Tongyeong Seoho Market, Geoje Gohyeon Market',
    },
    healthTags: ['immunity', 'skin', 'heart'],
    dupeCountry: 'FR',
    dupeName: { ko: '위트르 (프랑스)', ja: 'ユイットル/牡蠣 (フランス)', en: 'Huitres / Oysters (France)' },
  },
  {
    id: 'winter-bangeo-hoe',
    name: { ko: '방어회', ja: 'ブリ刺身', en: 'Yellowtail Sashimi' },
    season: 'winter',
    months: [12, 1, 2],
    region: '제주·통영',
    seasonalIngredients: {
      ko: ['방어', '초고추장', '쌈채소', '무채'],
      ja: ['ブリ', '酢コチュジャン', 'サム野菜', '大根千切り'],
      en: ['Yellowtail', 'Vinegar gochujang', 'Ssam vegetables', 'Shredded radish'],
    },
    whySeasonal: {
      ko: '"겨울 방어는 여름 복어보다 낫다" — 차가운 바다에서 지방이 올라 최고조에 달합니다.',
      ja: '「冬のブリは夏のフグより美味しい」—冷たい海で脂が乗って最高潮に達します。',
      en: '"Winter yellowtail beats summer blowfish" — cold waters max out its fat content.',
    },
    priceRange: '₩30,000~60,000',
    instaPoint: {
      ko: '두툼하게 썬 방어회의 기름진 광택',
      ja: '厚切りのブリ刺身の脂ののった光沢',
      en: 'Thick-cut yellowtail with a glistening, fatty sheen — winter luxury on a plate',
    },
    whereToEat: {
      ko: '제주 한림항, 통영 항구 횟집',
      ja: '済州・翰林港、統営港の刺身屋',
      en: 'Hallim Harbor in Jeju, Tongyeong harbor sashimi restaurants',
    },
    healthTags: ['skin', 'heart', 'energy'],
    dupeCountry: 'JP',
    dupeName: { ko: '부리샤부 (일본)', ja: 'ブリしゃぶ (日本)', en: 'Buri Shabu-shabu (Japan)' },
  },
  {
    id: 'winter-daegu-tang',
    name: { ko: '대구탕', ja: 'タラスープ', en: 'Codfish Soup' },
    season: 'winter',
    months: [12, 1, 2],
    region: '경남 (통영·거제)·부산',
    seasonalIngredients: {
      ko: ['대구', '콩나물', '대파', '미나리', '무'],
      ja: ['タラ', 'もやし', 'ネギ', 'セリ', '大根'],
      en: ['Codfish', 'Bean sprouts', 'Green onion', 'Water parsley', 'Radish'],
    },
    whySeasonal: {
      ko: '겨울 대구는 살이 통통하고 국물이 달콤, 차가운 날씨에 뼈까지 따뜻하게 데워줍니다.',
      ja: '冬のタラは身がふっくらでスープが甘く、寒い日に芯まで温めてくれます。',
      en: 'Winter codfish is plump and sweet — its warming broth heats you to the bone on cold days.',
    },
    priceRange: '₩15,000~25,000',
    instaPoint: {
      ko: '맑게 우러난 대구탕 국물의 겨울 감성',
      ja: '澄んだタラスープの冬の感性',
      en: 'Crystal-clear codfish broth — the clean taste of winter Korea',
    },
    whereToEat: {
      ko: '마산 어시장, 통영 중앙시장, 부산 자갈치시장',
      ja: '馬山・漁市場、統営・中央市場、釜山・チャガルチ市場',
      en: 'Masan fish market, Tongyeong Central Market, Busan Jagalchi Market',
    },
    healthTags: ['immunity', 'energy', 'diet'],
    dupeCountry: 'US',
    dupeName: { ko: '클램 차우더 (미국)', ja: 'クラムチャウダー (米国)', en: 'Clam Chowder (USA)' },
  },
  {
    id: 'winter-gwamegi',
    name: { ko: '과메기', ja: 'グァメギ', en: 'Wind-Dried Herring/Saury' },
    season: 'winter',
    months: [12, 1],
    region: '경북 포항·영덕',
    seasonalIngredients: {
      ko: ['꽁치(또는 청어)', '김', '쪽파', '마늘', '초장'],
      ja: ['サンマ(またはニシン)', '海苔', '万能ネギ', 'ニンニク', '酢醤油'],
      en: ['Saury or herring', 'Seaweed', 'Chive', 'Garlic', 'Vinegar sauce'],
    },
    whySeasonal: {
      ko: '겨울 동해 해풍과 냉기에 말린 것이 가장 맛있습니다. 11월~1월 포항이 과메기의 절정입니다.',
      ja: '冬の東海の海風と冷気で干したものが最もおいしいです。11月〜1月の浦項が過目伎の絶頂です。',
      en: 'Dried in cold East Sea winter winds (Nov–Jan), Pohang\'s gwamegi is at its peak richness.',
    },
    priceRange: '₩15,000~30,000',
    instaPoint: {
      ko: '쪽파와 김에 싸 먹는 과메기의 겨울 색감',
      ja: '万能ネギと海苔に包んで食べるグァメギの冬の彩り',
      en: 'Wind-dried fish wrapped in seaweed and chive — a rustic winter ritual',
    },
    whereToEat: {
      ko: '포항 구룡포, 영덕 강구항, 전국 전통주점',
      ja: '浦項・九龍浦、盈徳・江口港、全国の伝統酒場',
      en: 'Guryongpo in Pohang, Ganggu harbor in Yeongdeok, traditional bars nationwide',
    },
    healthTags: ['skin', 'heart', 'energy'],
    dupeCountry: 'JP',
    dupeName: { ko: '히다라 (일본)', ja: '干しタラ (日本)', en: 'Dried Codfish (Japan)' },
  },
  {
    id: 'winter-gimjang-bossam',
    foodId: 'seoul-bossam',
    name: { ko: '김장김치보쌈', ja: '김장キムチポッサム', en: 'Freshly-Made Kimchi Bossam' },
    season: 'winter',
    months: [11, 12],
    region: '전국 (김장 문화)',
    seasonalIngredients: {
      ko: ['삶은 돼지고기', '갓 담근 김치', '새우젓', '굴'],
      ja: ['茹でた豚肉', '作りたてキムチ', 'エビの塩辛', '牡蠣'],
      en: ['Boiled pork', 'Freshly made kimchi', 'Salted shrimp', 'Oyster'],
    },
    whySeasonal: {
      ko: '김장철(11~12월) 갓 담근 생김치와 함께 먹는 것이 전통, 발효 전 아삭한 김치의 맛이 일품입니다.',
      ja: '김장の時期(11〜12月)に作りたての生キムチと一緒に食べるのが伝統で、発酵前のシャキシャキキムチの味が絶品です。',
      en: 'Eaten during kimchi-making season (Nov–Dec) with fresh un-fermented kimchi — a winter tradition.',
    },
    priceRange: '₩15,000~25,000',
    instaPoint: {
      ko: '갓 담근 빨간 김치와 하얀 돼지고기의 색 대비',
      ja: '作りたての赤いキムチと白い豚肉の色のコントラスト',
      en: 'Vivid red freshly-made kimchi against pale boiled pork — a winter color contrast',
    },
    whereToEat: {
      ko: '전국 보쌈 전문점, 전통 시장, 가정 김장 후 식탁',
      ja: '全国のポッサム専門店、伝統市場、家庭의김장後の食卓',
      en: 'Bossam restaurants, traditional markets, home tables after kimchi-making',
    },
    healthTags: ['skin', 'immunity', 'digestion'],
    dupeCountry: 'CN',
    dupeName: { ko: '동파육 (중국)', ja: '東坡肉 (中国)', en: 'Dong Po Rou Braised Pork (China)' },
  },
  {
    id: 'winter-eomuk-tang',
    foodId: 'busan-eomuk',
    name: { ko: '어묵탕', ja: 'おでんスープ', en: 'Fish Cake Hot Pot' },
    season: 'winter',
    months: [11, 12, 1, 2],
    region: '부산·전국 겨울 길거리',
    seasonalIngredients: {
      ko: ['어묵', '무', '대파', '육수', '간장'],
      ja: ['おでん', '大根', 'ネギ', '出汁', '醤油'],
      en: ['Fish cake', 'Radish', 'Green onion', 'Broth', 'Soy sauce'],
    },
    whySeasonal: {
      ko: '차가운 겨울 길거리에서 뜨거운 어묵 국물 한 잔은 한국 겨울의 상징적인 장면입니다.',
      ja: '寒い冬の路上での熱いおでんスープ一杯は韓国の冬の象徴的な光景です。',
      en: 'A cup of hot fish cake broth on a cold street — one of the most iconic images of Korean winter.',
    },
    priceRange: '₩3,000~8,000',
    instaPoint: {
      ko: '꼬치에 꿴 어묵과 모락모락 올라오는 겨울 김',
      ja: '串に刺したおでんとモクモクと立ち上る冬の湯気',
      en: 'Skewered fish cakes with steam rising — the unmistakable image of Korean winter streets',
    },
    whereToEat: {
      ko: '부산 남포동, 전국 겨울 포장마차, 어시장',
      ja: '釜山・南浦洞、全国の冬のポジャンマチャ、漁市場',
      en: 'Nampo-dong in Busan, winter street stalls and pojangmacha nationwide',
    },
    healthTags: ['energy', 'digestion'],
    dupeCountry: 'JP',
    dupeName: { ko: '오덴 (일본)', ja: 'おでん (日本)', en: 'Oden (Japan)' },
  },
  {
    id: 'winter-gun-goguma',
    name: { ko: '군고구마', ja: '焼き芋', en: 'Baked Sweet Potato' },
    season: 'winter',
    months: [11, 12, 1, 2],
    region: '전국',
    seasonalIngredients: {
      ko: ['고구마', '숯불'],
      ja: ['さつまいも', '炭火'],
      en: ['Sweet potato', 'Charcoal'],
    },
    whySeasonal: {
      ko: '가을에 수확한 고구마가 서늘한 겨울 동안 숙성되어 가장 달콤, 숯불에 구우면 향이 극대화.',
      ja: '秋に収穫したさつまいもが寒い冬に熟成して最も甘くなり、炭火で焼くと香りが最大化します。',
      en: 'Autumn-harvested sweet potatoes sweeten through winter storage — charcoal-roasted to fragrant perfection.',
    },
    priceRange: '₩3,000~6,000',
    instaPoint: {
      ko: '숯불에 익은 황금빛 군고구마와 피어오르는 달콤한 연기',
      ja: '炭火で焼けた黄金色の焼き芋と立ち上る甘い煙',
      en: 'Golden baked sweet potato with sweet smoky steam — winter nostalgia',
    },
    whereToEat: {
      ko: '전국 겨울 길거리 노점, 마트 입구',
      ja: '全国の冬の路上屋台、スーパー入口',
      en: 'Winter street vendors and supermarket entrances nationwide',
    },
    healthTags: ['energy', 'digestion', 'eye'],
    dupeCountry: 'JP',
    dupeName: { ko: '야키이모 (일본)', ja: '焼き芋 (日本)', en: 'Yaki-imo Sweet Potato (Japan)' },
  },
  {
    id: 'winter-patjuk',
    name: { ko: '팥죽', ja: '小豆粥', en: 'Red Bean Porridge' },
    season: 'winter',
    months: [12],
    region: '전국 (동지 전통)',
    seasonalIngredients: {
      ko: ['팥', '새알심(찹쌀)', '설탕', '소금'],
      ja: ['小豆', '白玉(もち米)', '砂糖', '塩'],
      en: ['Red beans', 'Rice dumplings (glutinous rice)', 'Sugar', 'Salt'],
    },
    whySeasonal: {
      ko: '동지(12월 22일경)에 먹는 전통 음식, 붉은 팥이 나쁜 기운을 쫓는다고 믿었습니다.',
      ja: '冬至(12月22日頃)に食べる伝統食で、赤い小豆が悪い気を払うと信じられていました。',
      en: "Eaten on Winter Solstice (around Dec 22nd) — red beans were believed to ward off evil spirits.",
    },
    priceRange: '₩7,000~12,000',
    instaPoint: {
      ko: '빨간 팥죽에 동그란 새알심의 겨울 세시 풍경',
      ja: '赤い小豆粥に丸い白玉の冬の年中行事の風景',
      en: 'Red bean porridge with round rice dumplings — a timeless winter solstice ritual',
    },
    whereToEat: {
      ko: '전국 죽 전문점, 삼청동, 인사동, 광장시장',
      ja: '全国のお粥専門店、三清洞、仁寺洞、広蔵市場',
      en: 'Porridge restaurants, Samcheong-dong, Insadong, Gwangjang Market',
    },
    healthTags: ['digestion', 'energy', 'antiAging'],
    dupeCountry: 'CN',
    dupeName: { ko: '홍두사 (중국)', ja: '紅豆沙 (中国)', en: 'Red Bean Soup (China)' },
  },
]

// ── 12개월 제철 달력 ─────────────────────────────────────
export const seasonalCalendar: Record<number, CalendarIngredient[]> = {
  1:  [
    { name: '방어', emoji: '🐟', season: 'winter' },
    { name: '굴', emoji: '🦪', season: 'winter' },
    { name: '대구', emoji: '🐡', season: 'winter' },
    { name: '과메기', emoji: '🐠', season: 'winter' },
  ],
  2:  [
    { name: '굴', emoji: '🦪', season: 'winter' },
    { name: '과메기', emoji: '🐠', season: 'winter' },
    { name: '시래기', emoji: '🥬', season: 'winter' },
    { name: '콩나물', emoji: '🌱', season: 'winter' },
  ],
  3:  [
    { name: '주꾸미', emoji: '🐙', season: 'spring' },
    { name: '냉이', emoji: '🌿', season: 'spring' },
    { name: '달래', emoji: '🌿', season: 'spring' },
    { name: '도다리', emoji: '🐟', season: 'spring' },
  ],
  4:  [
    { name: '쑥', emoji: '🌿', season: 'spring' },
    { name: '멍게', emoji: '🦑', season: 'spring' },
    { name: '두릅', emoji: '🌱', season: 'spring' },
    { name: '봄동', emoji: '🥬', season: 'spring' },
  ],
  5:  [
    { name: '멍게', emoji: '🦑', season: 'spring' },
    { name: '봄나물', emoji: '🌿', season: 'spring' },
    { name: '주꾸미', emoji: '🐙', season: 'spring' },
    { name: '방풍나물', emoji: '🌱', season: 'spring' },
  ],
  6:  [
    { name: '장어', emoji: '🐍', season: 'summer' },
    { name: '전복', emoji: '🦪', season: 'summer' },
    { name: '콩', emoji: '🫘', season: 'summer' },
    { name: '오이', emoji: '🥒', season: 'summer' },
  ],
  7:  [
    { name: '수박', emoji: '🍉', season: 'summer' },
    { name: '삼계탕재료', emoji: '🐓', season: 'summer' },
    { name: '장어', emoji: '🐍', season: 'summer' },
    { name: '복숭아', emoji: '🍑', season: 'summer' },
  ],
  8:  [
    { name: '전복', emoji: '🦪', season: 'summer' },
    { name: '수박', emoji: '🍉', season: 'summer' },
    { name: '성게', emoji: '🔵', season: 'summer' },
    { name: '옥수수', emoji: '🌽', season: 'summer' },
  ],
  9:  [
    { name: '꽃게', emoji: '🦀', season: 'autumn' },
    { name: '전어', emoji: '🐟', season: 'autumn' },
    { name: '송이버섯', emoji: '🍄', season: 'autumn' },
    { name: '대하', emoji: '🦐', season: 'autumn' },
  ],
  10: [
    { name: '대하', emoji: '🦐', season: 'autumn' },
    { name: '감', emoji: '🟠', season: 'autumn' },
    { name: '밤', emoji: '🌰', season: 'autumn' },
    { name: '꽃게', emoji: '🦀', season: 'autumn' },
  ],
  11: [
    { name: '배추(김장)', emoji: '🥬', season: 'winter' },
    { name: '무', emoji: '⚪', season: 'winter' },
    { name: '고구마', emoji: '🍠', season: 'winter' },
    { name: '굴', emoji: '🦪', season: 'winter' },
  ],
  12: [
    { name: '방어', emoji: '🐟', season: 'winter' },
    { name: '굴', emoji: '🦪', season: 'winter' },
    { name: '팥(동지)', emoji: '🫘', season: 'winter' },
    { name: '과메기', emoji: '🐠', season: 'winter' },
  ],
}
