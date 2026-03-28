export interface FlagCountry {
  code: string
  flag: string
  name: { ko: string; ja: string; en: string }
  cuisineStyle: { ko: string; ja: string; en: string }
  flavorProfile: { sweet: number; salty: number; spicy: number; umami: number; sour: number }
  recommendations: {
    koreanFoodName: { ko: string; ja: string; en: string }
    reason: { ko: string; ja: string; en: string }
    dupeId?: string
  }[]
}

export const flagCountries: FlagCountry[] = [
  {
    code: "jp",
    flag: "🇯🇵",
    name: { ko: "일본", ja: "日本", en: "Japan" },
    cuisineStyle: { ko: "감칠맛과 은은한 맛", ja: "旨味とさりげない味わい", en: "Umami & subtle depth" },
    flavorProfile: { sweet: 25, salty: 55, spicy: 8, umami: 90, sour: 10 },
    recommendations: [
      { koreanFoodName: { ko: "불고기", ja: "プルコギ", en: "Bulgogi" }, reason: { ko: "달콤한 간장 양념이 스키야키와 닮았어요", ja: "甘い醤油ダレがすき焼きに似ています", en: "Sweet soy marinade similar to sukiyaki" }, dupeId: "dupe-002" },
      { koreanFoodName: { ko: "된장찌개", ja: "テンジャンチゲ", en: "Doenjang Jjigae" }, reason: { ko: "된장 특유의 감칠맛이 미소시루와 통해요", ja: "味噌特有の旨味が味噌汁に通じます", en: "Fermented paste umami matches miso soup" } },
      { koreanFoodName: { ko: "잡채", ja: "チャプチェ", en: "Japchae" }, reason: { ko: "달콤한 간장 볶음이 친숙하게 느껴질 거예요", ja: "甘い醤油炒めが馴染みやすいです", en: "Sweet soy stir-fry feels familiar" }, dupeId: "dupe-006" },
    ]
  },
  {
    code: "it",
    flag: "🇮🇹",
    name: { ko: "이탈리아", ja: "イタリア", en: "Italy" },
    cuisineStyle: { ko: "산미와 허브, 진한 소스", ja: "酸味とハーブ、濃厚ソース", en: "Acidity, herbs & rich sauce" },
    flavorProfile: { sweet: 25, salty: 50, spicy: 35, umami: 65, sour: 55 },
    recommendations: [
      { koreanFoodName: { ko: "떡볶이", ja: "トッポッキ", en: "Tteokbokki" }, reason: { ko: "매콤달콤 소스 + 탄수화물, 아라비아타처럼 중독적이에요", ja: "甘辛ソース + 炭水化物、アラビアータのようにクセになります", en: "Spicy-sweet sauce + carbs, as addictive as arrabbiata" }, dupeId: "dupe-003" },
      { koreanFoodName: { ko: "파전", ja: "パジョン", en: "Pajeon" }, reason: { ko: "고소한 반죽과 채소의 조화가 포카치아를 떠올려요", ja: "香ばしい生地と野菜の調和がフォカッチャを思わせます", en: "Savory batter with vegetables echoes focaccia" } },
      { koreanFoodName: { ko: "순대", ja: "スンデ", en: "Sundae" }, reason: { ko: "속을 채운 소시지 스타일, 살시차와 비슷한 매력", ja: "詰め物ソーセージスタイル、サルシッチャと似た魅力", en: "Stuffed sausage style, similar charm to salsiccia" } },
    ]
  },
  {
    code: "mx",
    flag: "🇲🇽",
    name: { ko: "멕시코", ja: "メキシコ", en: "Mexico" },
    cuisineStyle: { ko: "매콤하고 새콤한 조화", ja: "辛さと酸味のハーモニー", en: "Spicy & tangy harmony" },
    flavorProfile: { sweet: 15, salty: 50, spicy: 80, umami: 55, sour: 60 },
    recommendations: [
      { koreanFoodName: { ko: "삼겹살", ja: "サムギョプサル", en: "Samgyeopsal" }, reason: { ko: "구운 고기를 쌈에 싸 먹는 방식이 타코와 똑 닮았어요", ja: "焼き肉をサムで包む食べ方がタコスにそっくりです", en: "Wrapping grilled meat is just like a taco" }, dupeId: "dupe-005" },
      { koreanFoodName: { ko: "떡볶이", ja: "トッポッキ", en: "Tteokbokki" }, reason: { ko: "살사처럼 강렬한 고추장 소스의 매운 쾌감", ja: "サルサのような激しいコチュジャンソースの辛さの快感", en: "Gochujang sauce hits like salsa — intense and satisfying" }, dupeId: "dupe-003" },
      { koreanFoodName: { ko: "김치", ja: "キムチ", en: "Kimchi" }, reason: { ko: "발효된 채소 반찬, 피클 살사와 같은 역할을 해요", ja: "発酵野菜のおかず、ピクルスサルサと同じ役割", en: "Fermented veggie side, just like pickled salsa" } },
    ]
  },
  {
    code: "th",
    flag: "🇹🇭",
    name: { ko: "태국", ja: "タイ", en: "Thailand" },
    cuisineStyle: { ko: "새콤달콤 매운 향신료", ja: "甘酸っぱくスパイシー", en: "Sweet-sour-spicy herbs" },
    flavorProfile: { sweet: 55, salty: 50, spicy: 70, umami: 60, sour: 65 },
    recommendations: [
      { koreanFoodName: { ko: "잡채", ja: "チャプチェ", en: "Japchae" }, reason: { ko: "투명 면 + 채소 볶음, 팟타이와 같은 DNA", ja: "透明麺 + 野菜炒め、パッタイと同じDNA", en: "Translucent noodles + veggie stir-fry — same DNA as pad thai" }, dupeId: "dupe-006" },
      { koreanFoodName: { ko: "불닭", ja: "プルダク", en: "Buldak" }, reason: { ko: "새콤달콤 매운맛 시너지가 태국 요리와 딱 맞아요", ja: "甘酸っぱい辛味のシナジーがタイ料理にぴったり", en: "Sweet-sour-spicy synergy is your flavor zone" } },
      { koreanFoodName: { ko: "비빔밥", ja: "ビビンバ", en: "Bibimbap" }, reason: { ko: "다양한 재료를 비비는 스타일이 태국 샐러드 문화와 비슷", ja: "様々な食材を混ぜるスタイルがタイのサラダ文化に似ている", en: "Mix-it-yourself style mirrors Thai salad culture" }, dupeId: "dupe-004" },
    ]
  },
  {
    code: "us",
    flag: "🇺🇸",
    name: { ko: "미국", ja: "アメリカ", en: "USA" },
    cuisineStyle: { ko: "묵직하고 스모키한 BBQ", ja: "どっしりとしたスモーキーBBQ", en: "Hearty & smoky BBQ" },
    flavorProfile: { sweet: 40, salty: 60, spicy: 30, umami: 65, sour: 15 },
    recommendations: [
      { koreanFoodName: { ko: "삼겹살", ja: "サムギョプサル", en: "Samgyeopsal" }, reason: { ko: "직화 구운 고기의 스모키함이 BBQ와 통해요", ja: "直火焼き肉のスモーキーさがBBQに通じます", en: "Open-flame smokiness connects to BBQ culture" }, dupeId: "dupe-005" },
      { koreanFoodName: { ko: "치킨", ja: "韓国チキン", en: "Korean Fried Chicken" }, reason: { ko: "바삭한 프라이드 치킨의 업그레이드 버전", ja: "カリカリのフライドチキンのアップグレード版", en: "The ultimate upgrade to fried chicken you know" }, dupeId: "dupe-008" },
      { koreanFoodName: { ko: "불고기", ja: "プルコギ", en: "Bulgogi" }, reason: { ko: "달콤한 마리네이드 BBQ — 한국판 아메리칸 스타일", ja: "甘いマリネのBBQ — 韓国版アメリカンスタイル", en: "Sweet-marinated BBQ — Korean take on American grilling" }, dupeId: "dupe-002" },
    ]
  },
  {
    code: "fr",
    flag: "🇫🇷",
    name: { ko: "프랑스", ja: "フランス", en: "France" },
    cuisineStyle: { ko: "섬세하고 풍부한 소스", ja: "繊細で豊かなソース", en: "Delicate & rich sauces" },
    flavorProfile: { sweet: 20, salty: 55, spicy: 10, umami: 80, sour: 30 },
    recommendations: [
      { koreanFoodName: { ko: "갈비찜", ja: "カルビチム", en: "Galbi-jjim" }, reason: { ko: "느리게 조리한 갈비의 깊은 풍미가 브레이즈와 같은 격이에요", ja: "じっくり煮込んだカルビの深い風味がブレゼと同格です", en: "Slow-braised short ribs match the depth of French braise" } },
      { koreanFoodName: { ko: "된장찌개", ja: "テンジャンチゲ", en: "Doenjang Jjigae" }, reason: { ko: "발효의 복잡한 향, 블루치즈나 카망베르에 통하는 향미", ja: "発酵の複雑な香り、ブルーチーズやカマンベールに通じる風味", en: "Fermented complexity rivals aged cheese aromas" } },
      { koreanFoodName: { ko: "잡채", ja: "チャプチェ", en: "Japchae" }, reason: { ko: "섬세하게 균형 잡힌 맛의 조화가 프렌치 감각과 비슷해요", ja: "繊細にバランスの取れた味の調和がフレンチの感覚に似ています", en: "Delicately balanced harmony resonates with French sensibility" }, dupeId: "dupe-006" },
    ]
  },
  {
    code: "cn",
    flag: "🇨🇳",
    name: { ko: "중국", ja: "中国", en: "China" },
    cuisineStyle: { ko: "기름진 볶음과 진한 양념", ja: "脂っこい炒め物と濃い味付け", en: "Rich stir-fry & bold seasoning" },
    flavorProfile: { sweet: 30, salty: 65, spicy: 50, umami: 75, sour: 20 },
    recommendations: [
      { koreanFoodName: { ko: "제육볶음", ja: "チェユクポックム", en: "Jeyuk Bokkeum" }, reason: { ko: "매콤한 돼지고기 볶음, 회궈와 비슷한 진한 자극", ja: "ピリ辛の豚肉炒め、火鍋に似た濃い刺激", en: "Spicy pork stir-fry with the bold kick of mapo-style" } },
      { koreanFoodName: { ko: "잡채", ja: "チャプチェ", en: "Japchae" }, reason: { ko: "당면 볶음은 중국 당면 요리와 뿌리가 같아요", ja: "春雨炒めは中国の春雨料理と同じルーツです", en: "Glass noodle stir-fry shares roots with Chinese traditions" }, dupeId: "dupe-006" },
      { koreanFoodName: { ko: "순두부찌개", ja: "スンドゥブチゲ", en: "Sundubu Jjigae" }, reason: { ko: "부드러운 두부 + 매운 국물이 마파두부와 통해요", ja: "柔らかい豆腐 + 辛いスープが麻婆豆腐に通じます", en: "Silken tofu in spicy broth mirrors mapo tofu vibes" }, dupeId: "dupe-007" },
    ]
  },
  {
    code: "in",
    flag: "🇮🇳",
    name: { ko: "인도", ja: "インド", en: "India" },
    cuisineStyle: { ko: "향신료 가득한 깊은 맛", ja: "スパイスたっぷりの深い味わい", en: "Spice-layered deep flavors" },
    flavorProfile: { sweet: 15, salty: 45, spicy: 90, umami: 60, sour: 25 },
    recommendations: [
      { koreanFoodName: { ko: "떡볶이", ja: "トッポッキ", en: "Tteokbokki" }, reason: { ko: "강렬한 매운맛이 인도 마살라 소스처럼 중독적이에요", ja: "激しい辛さがインドのマサラソースのように癖になります", en: "Intense heat is as addictive as masala sauce" }, dupeId: "dupe-003" },
      { koreanFoodName: { ko: "불닭볶음면", ja: "プルダク炒め麺", en: "Buldak Noodles" }, reason: { ko: "매운맛 도전을 즐기는 분께 딱인 한국의 불맛 라면", ja: "辛さに挑戦する方にぴったりな韓国の火の味ラーメン", en: "For those who live for the heat challenge" } },
      { koreanFoodName: { ko: "순두부찌개", ja: "スンドゥブチゲ", en: "Sundubu Jjigae" }, reason: { ko: "크리미한 두부에 강한 양념, 사그 파니르와 비슷한 구조", ja: "クリーミーな豆腐に強い調味料、サグパニールに似た構造", en: "Creamy tofu with bold seasoning mirrors saag paneer" }, dupeId: "dupe-007" },
    ]
  },
  {
    code: "vn",
    flag: "🇻🇳",
    name: { ko: "베트남", ja: "ベトナム", en: "Vietnam" },
    cuisineStyle: { ko: "신선하고 가벼운 허브", ja: "フレッシュで軽やかなハーブ", en: "Fresh & light herb-forward" },
    flavorProfile: { sweet: 30, salty: 55, spicy: 40, umami: 65, sour: 50 },
    recommendations: [
      { koreanFoodName: { ko: "잡채", ja: "チャプチェ", en: "Japchae" }, reason: { ko: "투명 면 + 채소, 쌀국수 문화와 비슷한 가벼움", ja: "透明麺 + 野菜、フォー文化に似た軽やかさ", en: "Translucent noodles + veggies echo pho-culture lightness" }, dupeId: "dupe-006" },
      { koreanFoodName: { ko: "비빔밥", ja: "ビビンバ", en: "Bibimbap" }, reason: { ko: "신선한 재료를 담은 원볼, 분짜와 비슷한 개념", ja: "新鮮な食材を入れたワンボウル、ブンチャーに似た概念", en: "Fresh one-bowl concept mirrors bun cha spirit" }, dupeId: "dupe-004" },
      { koreanFoodName: { ko: "파전", ja: "パジョン", en: "Pajeon" }, reason: { ko: "고소한 해물 전, 반쎄오와 비슷한 바삭함", ja: "香ばしい海鮮チヂミ、バインセオに似たサクサク感", en: "Savory seafood pancake shares banh xeo crispiness" } },
    ]
  },
]
