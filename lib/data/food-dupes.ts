export interface TasteProfile {
  sweet: number
  salty: number
  spicy: number
  umami: number
  sour: number
}

export interface FoodItem {
  id: string
  name: { ko: string; ja: string; en: string }
  country: string
  countryFlag: string
  countryName: { ko: string; ja: string; en: string }
  image: string
  tasteProfile: TasteProfile
  description: { ko: string; ja: string; en: string }
  ingredients: { ko: string[]; ja: string[]; en: string[] }
}

export interface DupePair {
  id: string
  koreanFood: FoodItem
  foreignFood: FoodItem
  similarityPercent: number
  matchReason: { ko: string; ja: string; en: string }
  tags: string[]
}

export const dupePairs: DupePair[] = [
  {
    id: "dupe-001",
    koreanFood: {
      id: "kr-001",
      name: { ko: "김치찌개", ja: "キムチチゲ", en: "Kimchi Jjigae" },
      country: "kr", countryFlag: "🇰🇷",
      countryName: { ko: "한국", ja: "韓国", en: "Korea" },
      image: "/images/food/kimchi-jjigae.jpg",
      tasteProfile: { sweet: 10, salty: 70, spicy: 80, umami: 85, sour: 30 },
      description: { ko: "돼지고기와 잘 익은 김치를 넣고 끓인 한국의 대표 찌개", ja: "豚肉とよく熟成したキムチを入れて煮込んだ韓国の代表的なチゲ", en: "Korea's signature stew with pork and well-fermented kimchi" },
      ingredients: { ko: ["김치", "돼지고기", "두부", "대파", "고춧가루"], ja: ["キムチ", "豚肉", "豆腐", "長ネギ", "唐辛子粉"], en: ["Kimchi", "Pork", "Tofu", "Green onion", "Chili powder"] }
    },
    foreignFood: {
      id: "jp-001",
      name: { ko: "돈지루", ja: "豚汁", en: "Tonjiru" },
      country: "jp", countryFlag: "🇯🇵",
      countryName: { ko: "일본", ja: "日本", en: "Japan" },
      image: "/images/food/tonjiru.jpg",
      tasteProfile: { sweet: 20, salty: 65, spicy: 5, umami: 90, sour: 5 },
      description: { ko: "돼지고기와 채소를 된장에 끓인 일본식 국", ja: "豚肉と野菜を味噌で煮込んだ日本の汁物", en: "Japanese miso soup with pork and vegetables" },
      ingredients: { ko: ["돼지고기", "된장", "두부", "당근", "곤약"], ja: ["豚肉", "味噌", "豆腐", "人参", "こんにゃく"], en: ["Pork", "Miso", "Tofu", "Carrot", "Konjac"] }
    },
    similarityPercent: 78,
    matchReason: { ko: "돼지고기 기반 국물 + 발효 양념(김치 vs 된장) + 두부의 조합이 닮아있어요", ja: "豚肉ベースのスープ + 発酵調味料（キムチ vs 味噌）+ 豆腐の組み合わせが似ています", en: "Pork-based broth + fermented seasoning (kimchi vs miso) + tofu combination" },
    tags: ["국물", "돼지고기", "발효"]
  },
  {
    id: "dupe-002",
    koreanFood: {
      id: "kr-002",
      name: { ko: "불고기", ja: "プルコギ", en: "Bulgogi" },
      country: "kr", countryFlag: "🇰🇷",
      countryName: { ko: "한국", ja: "韓国", en: "Korea" },
      image: "/images/food/bulgogi.jpg",
      tasteProfile: { sweet: 65, salty: 50, spicy: 15, umami: 75, sour: 10 },
      description: { ko: "간장 양념에 재운 얇은 소고기를 구운 요리", ja: "醤油ダレに漬けた薄切り牛肉の焼き料理", en: "Thin-sliced beef marinated in soy sauce and grilled" },
      ingredients: { ko: ["소고기", "간장", "배", "마늘", "참기름"], ja: ["牛肉", "醤油", "梨", "ニンニク", "ごま油"], en: ["Beef", "Soy sauce", "Pear", "Garlic", "Sesame oil"] }
    },
    foreignFood: {
      id: "jp-002",
      name: { ko: "스키야키", ja: "すき焼き", en: "Sukiyaki" },
      country: "jp", countryFlag: "🇯🇵",
      countryName: { ko: "일본", ja: "日本", en: "Japan" },
      image: "/images/food/sukiyaki.jpg",
      tasteProfile: { sweet: 70, salty: 55, spicy: 0, umami: 80, sour: 5 },
      description: { ko: "달콤한 간장 국물에 소고기와 채소를 끓인 일본 전골", ja: "甘い醤油だしで牛肉と野菜を煮込む日本の鍋料理", en: "Japanese hot pot with beef and vegetables in sweet soy broth" },
      ingredients: { ko: ["소고기", "간장", "설탕", "두부", "쑥갓"], ja: ["牛肉", "醤油", "砂糖", "豆腐", "春菊"], en: ["Beef", "Soy sauce", "Sugar", "Tofu", "Chrysanthemum greens"] }
    },
    similarityPercent: 82,
    matchReason: { ko: "달콤한 간장 베이스 + 얇은 소고기 + 감칠맛이 핵심", ja: "甘い醤油ベース + 薄切り牛肉 + 旨味がポイント", en: "Sweet soy base + thin beef + umami is key" },
    tags: ["소고기", "달콤", "간장"]
  },
  {
    id: "dupe-003",
    koreanFood: {
      id: "kr-003",
      name: { ko: "떡볶이", ja: "トッポッキ", en: "Tteokbokki" },
      country: "kr", countryFlag: "🇰🇷",
      countryName: { ko: "한국", ja: "韓国", en: "Korea" },
      image: "/images/food/tteokbokki.jpg",
      tasteProfile: { sweet: 45, salty: 40, spicy: 90, umami: 50, sour: 5 },
      description: { ko: "고추장 양념에 볶은 쫄깃한 떡", ja: "コチュジャンソースで炒めたもちもちのお餅", en: "Chewy rice cakes in spicy gochujang sauce" },
      ingredients: { ko: ["떡", "고추장", "설탕", "어묵", "대파"], ja: ["餅", "コチュジャン", "砂糖", "練り物", "長ネギ"], en: ["Rice cake", "Gochujang", "Sugar", "Fish cake", "Green onion"] }
    },
    foreignFood: {
      id: "it-001",
      name: { ko: "아라비아타", ja: "アラビアータ", en: "Arrabbiata" },
      country: "it", countryFlag: "🇮🇹",
      countryName: { ko: "이탈리아", ja: "イタリア", en: "Italy" },
      image: "/images/food/arrabbiata.jpg",
      tasteProfile: { sweet: 30, salty: 45, spicy: 75, umami: 55, sour: 25 },
      description: { ko: "매운 토마토 소스 파스타", ja: "辛いトマトソースのパスタ", en: "Spicy tomato sauce pasta" },
      ingredients: { ko: ["파스타", "토마토", "마늘", "페퍼론치노", "올리브오일"], ja: ["パスタ", "トマト", "ニンニク", "ペペロンチーノ", "オリーブオイル"], en: ["Pasta", "Tomato", "Garlic", "Peperoncino", "Olive oil"] }
    },
    similarityPercent: 71,
    matchReason: { ko: "매콤달콤한 소스 + 탄수화물(떡 vs 파스타)의 조합", ja: "甘辛いソース + 炭水化物（餅 vs パスタ）の組み合わせ", en: "Sweet-spicy sauce + carbs (rice cake vs pasta) combo" },
    tags: ["매운맛", "탄수화물", "소스"]
  },
  {
    id: "dupe-004",
    koreanFood: {
      id: "kr-004",
      name: { ko: "비빔밥", ja: "ビビンバ", en: "Bibimbap" },
      country: "kr", countryFlag: "🇰🇷",
      countryName: { ko: "한국", ja: "韓国", en: "Korea" },
      image: "/images/food/bibimbap.jpg",
      tasteProfile: { sweet: 20, salty: 45, spicy: 60, umami: 65, sour: 15 },
      description: { ko: "밥 위에 다양한 나물과 고추장을 올려 비벼 먹는 한국 대표 음식", ja: "ご飯の上に様々なナムルとコチュジャンをのせて混ぜて食べる韓国代表料理", en: "Korean signature dish with assorted vegetables and gochujang over rice" },
      ingredients: { ko: ["밥", "나물", "고추장", "계란", "참기름"], ja: ["ご飯", "ナムル", "コチュジャン", "卵", "ごま油"], en: ["Rice", "Vegetables", "Gochujang", "Egg", "Sesame oil"] }
    },
    foreignFood: {
      id: "jp-003",
      name: { ko: "마제소바", ja: "まぜそば", en: "Mazesoba" },
      country: "jp", countryFlag: "🇯🇵",
      countryName: { ko: "일본", ja: "日本", en: "Japan" },
      image: "/images/food/mazesoba.jpg",
      tasteProfile: { sweet: 15, salty: 55, spicy: 30, umami: 80, sour: 10 },
      description: { ko: "국물 없이 면과 토핑을 비벼 먹는 일본식 라멘", ja: "スープなしで麺とトッピングを混ぜて食べる日本式ラーメン", en: "Japanese ramen without soup, mixed with toppings" },
      ingredients: { ko: ["면", "차슈", "계란", "파", "라유"], ja: ["麺", "チャーシュー", "卵", "ネギ", "ラー油"], en: ["Noodles", "Chashu", "Egg", "Green onion", "Chili oil"] }
    },
    similarityPercent: 74,
    matchReason: { ko: "비비는 스타일 + 계란 토핑 + 매콤한 양념의 공통점", ja: "混ぜるスタイル + 卵トッピング + ピリ辛調味料の共通点", en: "Mix-it-up style + egg topping + spicy seasoning in common" },
    tags: ["비비기", "계란", "원볼"]
  },
  {
    id: "dupe-005",
    koreanFood: {
      id: "kr-005",
      name: { ko: "삼겹살", ja: "サムギョプサル", en: "Samgyeopsal" },
      country: "kr", countryFlag: "🇰🇷",
      countryName: { ko: "한국", ja: "韓国", en: "Korea" },
      image: "/images/food/samgyeopsal.jpg",
      tasteProfile: { sweet: 10, salty: 55, spicy: 40, umami: 70, sour: 15 },
      description: { ko: "두껍게 썬 돼지 삼겹살을 구워 쌈채소에 싸 먹는 요리", ja: "厚切りの豚バラ肉を焼いてサンチュに包んで食べる料理", en: "Thick-cut pork belly grilled and wrapped in lettuce" },
      ingredients: { ko: ["삼겹살", "상추", "마늘", "쌈장", "깻잎"], ja: ["豚バラ", "サンチュ", "ニンニク", "サムジャン", "エゴマの葉"], en: ["Pork belly", "Lettuce", "Garlic", "Ssamjang", "Perilla leaf"] }
    },
    foreignFood: {
      id: "mx-001",
      name: { ko: "카르니타스 타코", ja: "カルニタス・タコス", en: "Carnitas Tacos" },
      country: "mx", countryFlag: "🇲🇽",
      countryName: { ko: "멕시코", ja: "メキシコ", en: "Mexico" },
      image: "/images/food/carnitas-taco.jpg",
      tasteProfile: { sweet: 15, salty: 50, spicy: 45, umami: 65, sour: 30 },
      description: { ko: "느리게 조리한 돼지고기를 토르티야에 싸 먹는 멕시코 타코", ja: "じっくり調理した豚肉をトルティーヤに包んで食べるメキシコのタコス", en: "Slow-cooked pork wrapped in tortilla" },
      ingredients: { ko: ["돼지고기", "토르티야", "살사", "라임", "양파"], ja: ["豚肉", "トルティーヤ", "サルサ", "ライム", "玉ねぎ"], en: ["Pork", "Tortilla", "Salsa", "Lime", "Onion"] }
    },
    similarityPercent: 76,
    matchReason: { ko: "구운 돼지고기 + 채소에 싸 먹기(쌈 vs 타코) + 매콤한 소스", ja: "焼き豚肉 + 野菜で包む（サム vs タコス）+ ピリ辛ソース", en: "Grilled pork + wrap in greens (ssam vs taco) + spicy sauce" },
    tags: ["돼지고기", "쌈/랩", "구이"]
  },
  {
    id: "dupe-006",
    koreanFood: {
      id: "kr-006",
      name: { ko: "잡채", ja: "チャプチェ", en: "Japchae" },
      country: "kr", countryFlag: "🇰🇷",
      countryName: { ko: "한국", ja: "韓国", en: "Korea" },
      image: "/images/food/japchae.jpg",
      tasteProfile: { sweet: 55, salty: 45, spicy: 5, umami: 60, sour: 5 },
      description: { ko: "당면과 다양한 채소를 간장으로 볶은 잔치 음식", ja: "春雨と様々な野菜を醤油で炒めたお祝い料理", en: "Stir-fried glass noodles with vegetables in soy sauce" },
      ingredients: { ko: ["당면", "시금치", "당근", "간장", "참기름"], ja: ["春雨", "ほうれん草", "人参", "醤油", "ごま油"], en: ["Glass noodles", "Spinach", "Carrot", "Soy sauce", "Sesame oil"] }
    },
    foreignFood: {
      id: "th-001",
      name: { ko: "팟타이", ja: "パッタイ", en: "Pad Thai" },
      country: "th", countryFlag: "🇹🇭",
      countryName: { ko: "태국", ja: "タイ", en: "Thailand" },
      image: "/images/food/pad-thai.jpg",
      tasteProfile: { sweet: 50, salty: 50, spicy: 25, umami: 65, sour: 35 },
      description: { ko: "쌀국수를 새콤달콤하게 볶은 태국 대표 면 요리", ja: "ライスヌードルを甘酸っぱく炒めたタイの代表的な麺料理", en: "Thai signature stir-fried rice noodles in sweet-sour sauce" },
      ingredients: { ko: ["쌀국수", "새우", "땅콩", "라임", "피시소스"], ja: ["ライスヌードル", "海老", "ピーナッツ", "ライム", "ナンプラー"], en: ["Rice noodles", "Shrimp", "Peanuts", "Lime", "Fish sauce"] }
    },
    similarityPercent: 73,
    matchReason: { ko: "달콤한 간장/소스 + 투명 면(당면 vs 쌀국수) + 볶음 스타일", ja: "甘い醤油/ソース + 透明麺（春雨 vs ライスヌードル）+ 炒めスタイル", en: "Sweet sauce + translucent noodles + stir-fry style" },
    tags: ["면", "달콤", "볶음"]
  },
  {
    id: "dupe-007",
    koreanFood: {
      id: "kr-007",
      name: { ko: "순두부찌개", ja: "スンドゥブチゲ", en: "Sundubu Jjigae" },
      country: "kr", countryFlag: "🇰🇷",
      countryName: { ko: "한국", ja: "韓国", en: "Korea" },
      image: "/images/food/sundubu.jpg",
      tasteProfile: { sweet: 10, salty: 60, spicy: 70, umami: 80, sour: 5 },
      description: { ko: "부드러운 순두부를 매콤한 양념으로 끓인 찌개", ja: "柔らかい純豆腐をピリ辛の調味料で煮込んだチゲ", en: "Spicy stew with soft uncurdled tofu" },
      ingredients: { ko: ["순두부", "고춧가루", "해물", "계란", "대파"], ja: ["純豆腐", "唐辛子粉", "海鮮", "卵", "長ネギ"], en: ["Soft tofu", "Chili powder", "Seafood", "Egg", "Green onion"] }
    },
    foreignFood: {
      id: "jp-004",
      name: { ko: "유도후", ja: "湯豆腐", en: "Yudofu" },
      country: "jp", countryFlag: "🇯🇵",
      countryName: { ko: "일본", ja: "日本", en: "Japan" },
      image: "/images/food/yudofu.jpg",
      tasteProfile: { sweet: 10, salty: 40, spicy: 0, umami: 75, sour: 5 },
      description: { ko: "다시마 육수에 두부를 부드럽게 데친 교토식 요리", ja: "昆布だしで豆腐をやさしく温めた京都の料理", en: "Kyoto-style gently simmered tofu in kelp broth" },
      ingredients: { ko: ["두부", "다시마", "간장", "가다랑어포", "파"], ja: ["豆腐", "昆布", "醤油", "鰹節", "ネギ"], en: ["Tofu", "Kelp", "Soy sauce", "Bonito flakes", "Green onion"] }
    },
    similarityPercent: 68,
    matchReason: { ko: "두부 중심 + 따뜻한 국물 + 소박한 재료의 깊은 맛", ja: "豆腐中心 + 温かいスープ + 素朴な材料の深い味わい", en: "Tofu-centered + warm broth + deep flavor from simple ingredients" },
    tags: ["두부", "국물", "따뜻함"]
  },
  {
    id: "dupe-008",
    koreanFood: {
      id: "kr-008",
      name: { ko: "치킨", ja: "韓国チキン", en: "Korean Fried Chicken" },
      country: "kr", countryFlag: "🇰🇷",
      countryName: { ko: "한국", ja: "韓国", en: "Korea" },
      image: "/images/food/korean-chicken.jpg",
      tasteProfile: { sweet: 45, salty: 50, spicy: 55, umami: 60, sour: 10 },
      description: { ko: "바삭하게 두 번 튀긴 후 양념을 입힌 한국식 치킨", ja: "カリカリに二度揚げした後にタレを絡めた韓国式チキン", en: "Double-fried crispy chicken coated in sauce" },
      ingredients: { ko: ["닭", "고추장", "마늘", "간장", "물엿"], ja: ["鶏肉", "コチュジャン", "ニンニク", "醤油", "水飴"], en: ["Chicken", "Gochujang", "Garlic", "Soy sauce", "Corn syrup"] }
    },
    foreignFood: {
      id: "jp-005",
      name: { ko: "가라아게", ja: "唐揚げ", en: "Karaage" },
      country: "jp", countryFlag: "🇯🇵",
      countryName: { ko: "일본", ja: "日本", en: "Japan" },
      image: "/images/food/karaage.jpg",
      tasteProfile: { sweet: 15, salty: 55, spicy: 5, umami: 70, sour: 15 },
      description: { ko: "간장과 생강으로 양념한 일본식 닭 튀김", ja: "醤油と生姜で味付けした日本の鶏の唐揚げ", en: "Japanese fried chicken marinated in soy sauce and ginger" },
      ingredients: { ko: ["닭", "간장", "생강", "전분", "레몬"], ja: ["鶏肉", "醤油", "生姜", "片栗粉", "レモン"], en: ["Chicken", "Soy sauce", "Ginger", "Starch", "Lemon"] }
    },
    similarityPercent: 80,
    matchReason: { ko: "튀긴 닭고기 + 간장 베이스 양념 + 사이드 메뉴의 왕", ja: "揚げ鶏 + 醤油ベースの味付け + サイドメニューの王様", en: "Fried chicken + soy-based seasoning + king of side dishes" },
    tags: ["치킨", "튀김", "간장"]
  },
]
