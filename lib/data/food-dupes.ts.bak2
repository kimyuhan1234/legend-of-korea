export interface TasteProfile {
  sweet: number
  salty: number
  spicy: number
  umami: number
  sour: number
}

/** Phase H — 한중일 한정 (KR 자기 자신 제외). 9개국(TH/VN/MY/ID/US/IT/FR/IN/ES/MX)은 폐기. */
export type CountryCode = 'JP' | 'CN'

/**
 * 한국 음식과 비슷한 외국 음식 후보 — Phase H (단수 → 복수).
 *
 * - 한 국가당 0~3개 후보 (가변).
 * - strengths / limitations / tip — 어떤 점이 비슷하고, 어디서 갈리고, 어떻게 더 가깝게 즐길 수 있는지.
 * - similarityPercent — 정직하게 50~90% (95%+ 사용 X).
 * - matchReason 은 deprecated (한 줄 요약). UI 는 strengths / limitations 우선 사용.
 */
export interface DupeCandidate {
  name: { ko: string; ja: string; en: string }
  tasteProfile: TasteProfile
  description: { ko: string; ja: string; en: string }
  ingredients: { ko: string[]; ja: string[]; en: string[] }
  similarityPercent: number
  /** 강점 — 왜 이 음식이 비슷한가. 3~5 항목. */
  strengths: { ko: string[]; ja: string[]; en: string[] }
  /** 한계 — 어디서 다른가. 1~3 항목. */
  limitations: { ko: string[]; ja: string[]; en: string[] }
  /** 더 가깝게 즐기는 팁 (선택). 한 줄. */
  tip?: { ko: string; ja: string; en: string }
  /** 한 줄 요약 — UI 에선 strengths/limitations 가 우선. */
  matchReason: { ko: string; ja: string; en: string }
}

export interface RegionalFood {
  id: string
  name: { ko: string; ja: string; en: string }
  region: string
  image?: string
  /** 이미지 출처 표기 (예: 'ⓒ한국관광공사 포토코리아-홍길동'). UI 에 그대로 노출. */
  imageCredit?: string
  /** 해당 지역 특산품 여부 — true 시 UI 에 (지역특산) 뱃지 표시. 사용자 수동 마킹. */
  isLocalSpecialty: boolean
  tasteProfile: TasteProfile
  storyDescription: { ko: string; ja: string; en: string }
  ingredients: { ko: string[]; ja: string[]; en: string[] }
  tags: string[]
  /** 12 개국 × 0~3 후보. 빈 배열 = 해당 국가에 적합한 매칭 없음. */
  dupes: Record<CountryCode, DupeCandidate[]>
}

export interface Region {
  code: string
  name: { ko: string; ja: string; en: string }
  icon: string
  image: string
  description: { ko: string; ja: string; en: string }
  foods: RegionalFood[]
}

export const regions: Region[] = [
  {
    code: "jeonju",
    name: { ko: "전주", ja: "全州", en: "Jeonju" },
    icon: "🏛️",
    image: "/images/village/jeonju.jpg",
    description: {
      ko: "한국 음식의 수도, 맛의 고장 전주",
      ja: "韓国料理の首都、味の故郷・全州",
      en: "The capital of Korean cuisine, Jeonju"
    },
    foods: [
      {
        id: "jeonju-bibimbap",
        name: { ko: "비빔밥", ja: "ビビンバ", en: "Bibimbap" },
        region: "jeonju",
        image: "",
        tasteProfile: { sweet: 20, salty: 45, spicy: 60, umami: 65, sour: 15 },
        storyDescription: {
          ko: "하얀 밥 위에 알록달록한 나물과 고기가 미술 시간의 물감처럼 예쁘게 올려져 있어요. 쓱쓱 비벼 먹으면 입안에서 여러 가지 재료가 멋진 합창을 하는 것 같아요.",
          ja: "白いご飯の上にカラフルなナムルとお肉が、美術の時間の絵の具のようにきれいに盛り付けられています。サッサッと混ぜて食べると、口の中でいろんな食材が素敵なハーモニーを奏でているみたい。",
          en: "Colorful vegetables and meat sit atop white rice like paints on an art palette. Mix it all together and every ingredient sings in perfect harmony in your mouth."
        },
        ingredients: {
          ko: ["밥", "콩나물", "시금치", "당근", "고사리", "소고기", "고추장", "계란", "참기름"],
          ja: ["ご飯", "もやし", "ほうれん草", "人参", "わらび", "牛肉", "コチュジャン", "卵", "ごま油"],
          en: ["Rice", "Bean sprouts", "Spinach", "Carrot", "Bracken", "Beef", "Gochujang", "Egg", "Sesame oil"]
        },
        tags: ["비비기", "나물", "고추장"],
        dupes: {
          JP: [
        {
            name: { ko: "마제소바", ja: "まぜそば", en: "Mazesoba" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 30, umami: 80, sour: 10 },
            description: { ko: "국물 없이 면과 토핑을 비벼 먹는 일본식 라멘", ja: "スープなしで麺とトッピングを混ぜて食べる日本式ラーメン", en: "Japanese ramen without soup, mixed with toppings" },
            ingredients: { ko: ["면", "차슈", "계란", "파", "라유"], ja: ["麺", "チャーシュー", "卵", "ネギ", "ラー油"], en: ["Noodles", "Chashu", "Egg", "Green onion", "Chili oil"] },
            similarityPercent: 74,
            matchReason: { ko: "비비는 스타일 + 계란 토핑 + 매콤한 양념의 공통점", ja: "混ぜるスタイル + 卵トッピング + ピリ辛調味料の共通点", en: "Mix-it-up style + egg topping + spicy seasoning" }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-kongnamul",
        name: { ko: "콩나물국밥", ja: "コンナムルクッパ", en: "Bean Sprout Rice Soup" },
        region: "jeonju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/jeonju-kongnamul.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-디엔에이스튜디오",
        tasteProfile: { sweet: 10, salty: 55, spicy: 40, umami: 75, sour: 10 },
        storyDescription: {
          ko: "아삭아삭한 콩나물이 듬뿍 들어간 뜨끈한 국물 요리예요. 추운 겨울날, 포근한 솜이불을 덮은 것처럼 배 속을 따뜻하고 편안하게 달래준답니다.",
          ja: "シャキシャキのもやしがたっぷり入った温かいスープ料理です。寒い冬の日、ふかふかの布団をかけたように、お腹を温かく優しく癒してくれます。",
          en: "A warm soup filled with crunchy bean sprouts. On a cold winter day, it soothes your belly like wrapping up in a cozy cotton blanket."
        },
        ingredients: { ko: ["콩나물", "밥", "대파", "계란", "새우젓"], ja: ["もやし", "ご飯", "長ネギ", "卵", "アミの塩辛"], en: ["Bean sprouts", "Rice", "Green onion", "Egg", "Salted shrimp"] },
        tags: ["국밥", "해장", "따뜻함"],
        dupes: {
          JP: [
        {
            name: { ko: "돈지루", ja: "豚汁", en: "Tonjiru" },
            tasteProfile: { sweet: 20, salty: 65, spicy: 5, umami: 90, sour: 5 },
            description: { ko: "돼지고기와 채소를 된장에 끓인 일본식 국", ja: "豚肉と野菜を味噌で煮込んだ日本の汁物", en: "Japanese miso soup with pork and vegetables" },
            ingredients: { ko: ["돼지고기", "된장", "두부", "당근", "곤약"], ja: ["豚肉", "味噌", "豆腐", "人参", "こんにゃく"], en: ["Pork", "Miso", "Tofu", "Carrot", "Konjac"] },
            similarityPercent: 75,
            matchReason: { ko: "뜨끈한 국물 + 채소 듬뿍 + 발효 양념의 깊은 맛", ja: "温かいスープ + 野菜たっぷり + 発酵調味料の深い味わい", en: "Warm broth + plenty of vegetables + deep fermented flavor" }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-kalguksu",
        name: { ko: "전주식 칼국수", ja: "全州式カルグクス", en: "Kalguksu" },
        region: "jeonju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/jeonju-kalguksu.jpeg",
        tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 85, sour: 5 },
        storyDescription: {
          ko: "들깨가루라는 고소한 가루가 눈보라처럼 듬뿍 뿌려져 있어요. 일반 국수와 달리, 국물이 수프처럼 아주 진하고 고소한 것이 특징이에요.",
          ja: "エゴマの粉という香ばしい粉が吹雪のようにたっぷりかかっています。普通の麺と違って、スープがポタージュのようにとても濃厚で香ばしいのが特徴です。",
          en: "Covered in a blizzard of nutty perilla seed powder. Unlike regular noodles, the broth is incredibly rich and creamy, more like a thick soup than clear broth."
        },
        ingredients: { ko: ["칼국수면", "들깨가루", "멸치육수", "감자", "호박"], ja: ["カルグクス麺", "エゴマ粉", "煮干しだし", "ジャガイモ", "カボチャ"], en: ["Knife-cut noodles", "Perilla powder", "Anchovy broth", "Potato", "Zucchini"] },
        tags: ["면", "고소함", "들깨"],
        dupes: {
          JP: [
        {
            name: { ko: "크림 우동", ja: "クリームうどん", en: "Cream Udon" },
            tasteProfile: { sweet: 20, salty: 40, spicy: 0, umami: 80, sour: 5 },
            description: { ko: "크림 소스에 쫄깃한 우동면을 넣은 퓨전 요리", ja: "クリームソースにもちもちうどんを入れたフュージョン料理", en: "Fusion dish with chewy udon in cream sauce" },
            ingredients: { ko: ["우동면", "생크림", "버터", "파르메산", "버섯"], ja: ["うどん", "生クリーム", "バター", "パルメザン", "きのこ"], en: ["Udon", "Heavy cream", "Butter", "Parmesan", "Mushroom"] },
            similarityPercent: 72,
            matchReason: { ko: "진하고 크리미한 국물 + 쫄깃한 면 + 고소한 풍미", ja: "濃厚でクリーミーなスープ + もちもち麺 + 香ばしい風味", en: "Rich creamy broth + chewy noodles + nutty flavor" }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-muljjajang",
        name: { ko: "물짜장", ja: "ムルチャジャン", en: "Mul-jjajang" },
        region: "jeonju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeonju-muljjajang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 박은경",
        tasteProfile: { sweet: 25, salty: 55, spicy: 50, umami: 65, sour: 15 },
        storyDescription: {
          ko: "이름은 짜장면인데 색깔이 까맣지 않고 빨간색이나 하얀색이에요! 짬뽕처럼 매콤하면서도, 짜장면처럼 소스가 면에 착 달라붙는 마법 같은 요리랍니다.",
          ja: "名前はジャジャン麺なのに、色が黒くなくて赤や白なんです！チャンポンのように辛くて、ジャジャン麺のようにソースが麺にピタッとくっつく魔法のような料理です。",
          en: "It's called jjajang but it's not black — it's red or white! Spicy like jjamppong, yet the sauce clings to the noodles like magic, just like jjajangmyeon."
        },
        ingredients: { ko: ["중면", "춘장", "해물", "양파", "고추기름", "육수"], ja: ["中華麺", "チュンジャン", "海鮮", "玉ねぎ", "唐辛子油", "スープ"], en: ["Chinese noodles", "Black bean paste", "Seafood", "Onion", "Chili oil", "Broth"] },
        tags: ["면", "매콤", "퓨전"],
        dupes: {
          JP: [
        {
            name: { ko: "탄탄멘", ja: "担々麺", en: "Tantanmen" },
            tasteProfile: { sweet: 20, salty: 55, spicy: 65, umami: 75, sour: 10 },
            description: { ko: "매콤하고 고소한 참깨 국물의 일본식 라멘", ja: "ピリ辛で香ばしいゴマスープの日本式ラーメン", en: "Japanese ramen with spicy and nutty sesame broth" },
            ingredients: { ko: ["면", "참깨", "고추기름", "다진고기", "청경채"], ja: ["麺", "ゴマ", "ラー油", "ひき肉", "チンゲン菜"], en: ["Noodles", "Sesame", "Chili oil", "Ground pork", "Bok choy"] },
            similarityPercent: 73,
            matchReason: { ko: "매콤한 국물 면 + 고추기름 + 고소한 소스가 면에 감기는 맛", ja: "辛いスープ麺 + ラー油 + 香ばしいソースが麺に絡む味", en: "Spicy broth noodles + chili oil + rich sauce clinging to noodles" }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-pisundae",
        name: { ko: "피순대와 순대국밥", ja: "ピスンデとスンデクッパ", en: "Blood Sausage Soup" },
        region: "jeonju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/jeonju-pisundae.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-김지영",
        tasteProfile: { sweet: 10, salty: 60, spicy: 35, umami: 85, sour: 5 },
        storyDescription: {
          ko: "우리가 흔히 아는 얇은 당면 순대와 달라요. 고기와 채소 등 영양 만점 재료로 속을 꽉 채워서, 아주 든든하고 진한 맛이 나는 한국식 소시지라고 할 수 있어요.",
          ja: "よく知られている春雨のスンデとは違います。肉や野菜など栄養満点の材料でぎっしり中身を詰めていて、とてもボリュームがあり濃厚な味の韓国式ソーセージと言えます。",
          en: "Unlike the common glass-noodle sundae, this is packed full of meat and vegetables — a hearty, rich Korean sausage that fills you up with deep, satisfying flavor."
        },
        ingredients: { ko: ["돼지 창", "선지", "찹쌀", "배추", "부추", "들깨가루"], ja: ["豚の腸", "牛の血", "もち米", "白菜", "ニラ", "エゴマ粉"], en: ["Pork intestine", "Blood", "Glutinous rice", "Cabbage", "Chive", "Perilla powder"] },
        tags: ["순대", "국밥", "든든함"],
        dupes: {
          JP: [],
          CN: [],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-omogaritang",
        name: { ko: "오모가리탕", ja: "オモガリタン", en: "Omogaritang" },
        region: "jeonju",
        image: "",
        tasteProfile: { sweet: 15, salty: 55, spicy: 65, umami: 80, sour: 10 },
        storyDescription: {
          ko: "'오모가리'는 뚝배기라는 숨 쉬는 흙그릇을 부르는 전주의 옛날 말이에요. 이 그릇에 쫄깃한 물고기와 시래기를 넣고 얼큰하게 끓여내서 아주 깊은 맛이 나요.",
          ja: "「オモガリ」はトゥッペギという呼吸する土鍋を呼ぶ全州の昔の言葉です。この器にプリプリの魚とシレギ（干した大根の葉）を入れてピリ辛に煮込んで、とても深い味わいがします。",
          en: "'Omogari' is an old Jeonju word for a 'breathing' earthen pot. Chewy fish and dried radish greens are simmered in this pot to create an incredibly deep, spicy broth."
        },
        ingredients: { ko: ["민물고기", "시래기", "된장", "고추장", "대파", "마늘"], ja: ["川魚", "シレギ", "テンジャン", "コチュジャン", "長ネギ", "ニンニク"], en: ["Freshwater fish", "Dried radish greens", "Doenjang", "Gochujang", "Green onion", "Garlic"] },
        tags: ["생선", "얼큰함", "전통"],
        dupes: {
          JP: [],
          CN: [],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-chocopie",
        name: { ko: "수제 초코파이", ja: "手作りチョコパイ", en: "Handmade Choco Pie" },
        region: "jeonju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/jeonju-chocopie.jpeg",
        tasteProfile: { sweet: 90, salty: 10, spicy: 0, umami: 15, sour: 5 },
        storyDescription: {
          ko: "전주의 유명한 빵집에서 직접 구워내는 거대한 초콜릿 과자예요. 부드러운 빵 사이에 달콤한 크림과 딸기잼이 가득 들어 있어서 최고로 인기 있는 디저트랍니다.",
          ja: "全州の有名なパン屋さんが直接焼き上げる巨大なチョコレートお菓子です。柔らかいパンの間に甘いクリームとイチゴジャムがたっぷり入っていて、最高に人気のデザートです。",
          en: "A giant chocolate treat baked fresh at Jeonju's famous bakery. Soft bread sandwiching sweet cream and strawberry jam — the most popular dessert in town."
        },
        ingredients: { ko: ["초콜릿", "밀가루", "생크림", "딸기잼", "버터"], ja: ["チョコレート", "小麦粉", "生クリーム", "イチゴジャム", "バター"], en: ["Chocolate", "Flour", "Fresh cream", "Strawberry jam", "Butter"] },
        tags: ["디저트", "달콤", "빵"],
        dupes: {
          JP: [
        {
            name: { ko: "도라야키", ja: "どら焼き", en: "Dorayaki" },
            tasteProfile: { sweet: 85, salty: 5, spicy: 0, umami: 10, sour: 0 },
            description: { ko: "부드러운 카스텔라 반죽 사이에 달콤한 팥소를 넣은 일본 과자", ja: "柔らかいカステラ生地の間に甘いあんこを入れた日本のお菓子", en: "Sweet red bean paste sandwiched between fluffy castella pancakes" },
            ingredients: { ko: ["밀가루", "팥앙금", "계란", "설탕", "꿀"], ja: ["小麦粉", "あんこ", "卵", "砂糖", "蜂蜜"], en: ["Flour", "Red bean paste", "Egg", "Sugar", "Honey"] },
            similarityPercent: 76,
            matchReason: { ko: "부드러운 빵 사이에 달콤한 필링 + 수제 간식의 정겨움", ja: "柔らかいパンの間に甘いフィリング + 手作りおやつの温もり", en: "Sweet filling between soft bread + warmth of handmade snacks" }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-yukgaejang",
        image: "",
        name: { ko: "육개장", ja: "ユッケジャン", en: "Yukgaejang" },
        region: "jeonju",
        tasteProfile: { sweet: 15, salty: 55, spicy: 75, umami: 80, sour: 10 },
        storyDescription: {
          ko: "소고기를 잘게 찢어 고사리, 대파와 함께 고춧가루로 얼큰하게 끓여낸 전주의 해장국이에요. 빨간 국물이 무섭게 보여도 한 모금 마시면 온몸이 따뜻해지고 지친 몸이 깨어나는 기분이에요.",
          ja: "牛肉を細かくほぐして、わらびと長ネギと一緒に唐辛子粉でピリ辛に煮込んだ全州の解酔スープです。赤いスープが怖そうに見えても、一口飲めば全身が温まり、疲れた体が目覚める感じです。",
          en: "Shredded beef slow-simmered with bracken and green onion in a fiery chili broth — Jeonju's signature hangover soup. The red broth looks fierce, but one sip warms your whole body and revives tired bones."
        },
        ingredients: { ko: ["소고기", "고사리", "대파", "숙주", "고춧가루", "참기름", "마늘", "달걀"], ja: ["牛肉", "ワラビ", "長ネギ", "もやし", "唐辛子粉", "ごま油", "ニンニク", "卵"], en: ["Beef", "Bracken", "Green onion", "Bean sprouts", "Chili powder", "Sesame oil", "Garlic", "Egg"] },
        tags: ["해장국", "얼큰함", "소고기"],
        dupes: {
          JP: [
        { name: { ko: "아카미소 라멘", ja: "赤味噌ラーメン", en: "Aka Miso Ramen" }, tasteProfile: { sweet: 15, salty: 60, spicy: 30, umami: 85, sour: 5 }, description: { ko: "진한 적된장 육수에 면을 넣은 나고야식 라멘", ja: "濃い赤味噌スープに麺を入れた名古屋風ラーメン", en: "Nagoya-style ramen in rich red miso broth" }, ingredients: { ko: ["면", "적된장", "돼지육수", "차슈", "파", "달걀"], ja: ["麺", "赤味噌", "豚骨スープ", "チャーシュー", "ネギ", "卵"], en: ["Noodles", "Red miso", "Pork broth", "Chashu", "Green onion", "Egg"] }, similarityPercent: 72, matchReason: { ko: "진한 발효 된장 육수 + 고기 + 뜨거운 국물의 해장 효과", ja: "濃い発酵味噌スープ + 肉 + 温かいスープの二日酔い解消効果", en: "Deep fermented paste broth + meat + hot broth's hangover-busting warmth" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "홍소우육면", ja: "紅焼牛肉麺", en: "Hong Shao Beef Noodle Soup" }, tasteProfile: { sweet: 20, salty: 55, spicy: 40, umami: 80, sour: 10 }, description: { ko: "간장과 두반장으로 매콤하게 끓인 중국식 소고기 국수", ja: "醤油と豆板醤でピリ辛に煮込んだ中国式牛肉麺", en: "Chinese beef noodle soup braised with soy sauce and doubanjiang" }, ingredients: { ko: ["소고기", "두반장", "간장", "팔각", "면", "파"], ja: ["牛肉", "豆板醤", "醤油", "八角", "麺", "ネギ"], en: ["Beef", "Doubanjiang", "Soy sauce", "Star anise", "Noodles", "Green onion"] }, similarityPercent: 70, matchReason: { ko: "소고기를 매콤한 국물에 장시간 끓인 구조 + 진한 붉은 국물", ja: "牛肉を辛いスープで長時間煮込む構造 + 深い赤いスープ", en: "Beef slow-simmered in spicy red broth — same fiery bowl structure" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-bindaetteok",
        image: "",
        name: { ko: "녹두전", ja: "ノクトゥジョン", en: "Bindaetteok (Mung Bean Pancake)" },
        region: "jeonju",
        tasteProfile: { sweet: 10, salty: 50, spicy: 25, umami: 65, sour: 5 },
        storyDescription: {
          ko: "맷돌에 간 녹두 반죽에 김치와 돼지고기를 올려 기름에 노릇하게 부쳐낸 전통 전이에요. 바삭한 겉과 부드러운 속, 고소한 기름 향이 어우러져 막걸리 한 잔이 절로 생각나는 맛이랍니다.",
          ja: "石臼で挽いた緑豆の生地にキムチと豚肉をのせて油できつね色に焼き上げた伝統的なチヂミです。サクサクの外側と柔らかな内側、香ばしい油の香りが調和して、マッコリが自然に欲しくなる味です。",
          en: "Ground mung bean batter topped with kimchi and pork, pan-fried golden in oil. Crispy outside, tender inside, with a fragrant nutty aroma that begs for a glass of makgeolli."
        },
        ingredients: { ko: ["녹두", "돼지고기", "묵은김치", "대파", "숙주", "들기름"], ja: ["緑豆", "豚肉", "熟成キムチ", "長ネギ", "もやし", "エゴマ油"], en: ["Mung beans", "Pork", "Aged kimchi", "Green onion", "Bean sprouts", "Perilla oil"] },
        tags: ["전", "녹두", "막걸리"],
        dupes: {
          JP: [
        { name: { ko: "오코노미야키", ja: "お好み焼き", en: "Okonomiyaki" }, tasteProfile: { sweet: 20, salty: 55, spicy: 10, umami: 75, sour: 10 }, description: { ko: "밀가루 반죽에 양배추와 고기를 넣어 구운 일본식 팬케이크", ja: "小麦粉生地にキャベツと肉を入れて焼いた日本風お好み焼き", en: "Japanese savory pancake with cabbage and meat in wheat batter" }, ingredients: { ko: ["밀가루", "양배추", "돼지고기", "달걀", "가쓰오부시", "오타후쿠 소스"], ja: ["小麦粉", "キャベツ", "豚肉", "卵", "かつお節", "オタフクソース"], en: ["Flour", "Cabbage", "Pork", "Egg", "Bonito flakes", "Okonomi sauce"] }, similarityPercent: 77, matchReason: { ko: "걸쭉한 반죽에 고기·채소를 넣고 팬에 부치는 방식이 동일", ja: "濃厚な生地に肉・野菜を入れてフライパンで焼く方式が同じ", en: "Thick batter with meat and vegetables pan-fried — same structural concept" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "총유빙", ja: "葱油餅", en: "Cong You Bing (Scallion Pancake)" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 60, sour: 5 }, description: { ko: "기름을 겹겹이 발라 파와 함께 구운 중국식 팬케이크", ja: "油を何層にも塗りネギと共に焼いた中国式パンケーキ", en: "Chinese flaky pancake with layers of scallions and oil" }, ingredients: { ko: ["밀가루", "대파", "식용유", "참기름", "소금"], ja: ["小麦粉", "長ネギ", "食用油", "ごま油", "塩"], en: ["Flour", "Green onion", "Oil", "Sesame oil", "Salt"] }, similarityPercent: 70, matchReason: { ko: "반죽을 얇게 부쳐 바삭하게 구운 고소한 맛", ja: "生地を薄く焼いてサクサクに仕上げる香ばしい味", en: "Thin-fried crispy pancake — same aromatic fried flatbread concept" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-cheonggukjang",
        image: "",
        name: { ko: "청국장", ja: "チョングクジャン", en: "Cheonggukjang" },
        region: "jeonju",
        tasteProfile: { sweet: 10, salty: 60, spicy: 35, umami: 90, sour: 10 },
        storyDescription: {
          ko: "이틀간 따뜻하게 발효시킨 콩으로 끓여낸 청국장은 강렬한 냄새만큼이나 진한 맛을 자랑해요. 보글보글 끓는 뚝배기 속에 두부와 김치가 어우러진 이 한 그릇은 전주 할머니들의 사랑 같아요.",
          ja: "二日間温かく発酵させた豆で煮込んだチョングクジャンは、強烈な香りに負けない濃厚な味わいが自慢です。ぐつぐつ煮える土鍋の中で豆腐とキムチが調和する一杯は、全州のおばあちゃんの愛のようです。",
          en: "Brewed from beans fermented warm for two days, cheonggukjang's bold aroma matches its deep umami. Bubbling in an earthenware pot with tofu and kimchi, this bowl tastes like a Jeonju grandmother's love."
        },
        ingredients: { ko: ["청국장", "두부", "묵은김치", "돼지고기", "애호박", "대파", "마늘"], ja: ["チョングクジャン", "豆腐", "熟成キムチ", "豚肉", "ズッキーニ", "長ネギ", "ニンニク"], en: ["Cheonggukjang paste", "Tofu", "Aged kimchi", "Pork", "Zucchini", "Green onion", "Garlic"] },
        tags: ["발효", "찌개", "콩"],
        dupes: {
          JP: [
        { name: { ko: "낫토 미소시루", ja: "納豆味噌汁", en: "Natto Miso Soup" }, tasteProfile: { sweet: 10, salty: 60, spicy: 5, umami: 90, sour: 5 }, description: { ko: "발효 콩 낫토를 미소 국에 풀어 끓인 일본식 발효 국물", ja: "発酵豆納豆を味噌汁に入れて煮込んだ日本式発酵スープ", en: "Japanese miso soup enriched with fermented natto beans" }, ingredients: { ko: ["낫토", "미소", "두부", "미역", "파", "가쓰오부시"], ja: ["納豆", "味噌", "豆腐", "ワカメ", "ネギ", "かつお節"], en: ["Natto", "Miso", "Tofu", "Wakame", "Green onion", "Bonito"] }, similarityPercent: 80, matchReason: { ko: "발효 콩 + 된장 + 두부가 어우러진 진한 감칠맛 구조", ja: "発酵豆 + 味噌 + 豆腐が調和する濃厚な旨味構造", en: "Fermented beans + soy paste + tofu — same deep umami architecture" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "더우반 두부탕", ja: "豆板豆腐湯", en: "Doubanjiang Tofu Stew" }, tasteProfile: { sweet: 10, salty: 60, spicy: 50, umami: 80, sour: 5 }, description: { ko: "발효 고추장 더우반으로 두부와 돼지고기를 매콤하게 끓인 사천식 찌개", ja: "発酵唐辛子味噌の豆板醤で豆腐と豚肉をピリ辛に煮込んだ四川式鍋", en: "Sichuan stew of tofu and pork in fermented chili-bean paste" }, ingredients: { ko: ["두부", "돼지고기", "두반장", "대파", "마늘", "청경채"], ja: ["豆腐", "豚肉", "豆板醤", "長ネギ", "ニンニク", "チンゲン菜"], en: ["Tofu", "Pork", "Doubanjiang", "Green onion", "Garlic", "Bok choy"] }, similarityPercent: 72, matchReason: { ko: "발효 콩 양념 + 두부 + 돼지고기의 매콤한 찌개 구조", ja: "発酵豆調味料 + 豆腐 + 豚肉のピリ辛鍋構造", en: "Fermented bean paste + tofu + pork — same spicy fermented stew" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-yukoe",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeonju-yukoe.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "육회", ja: "ユッケ", en: "Yukhoe (Korean Beef Tartare)" },
        region: "jeonju",
        tasteProfile: { sweet: 20, salty: 45, spicy: 15, umami: 70, sour: 25 },
        storyDescription: {
          ko: "갓 다진 신선한 소고기에 배·마늘·참기름을 넣고 달걀노른자를 올린 전주의 고급 요리예요. 입 안에서 살살 녹는 부드러움과 배의 시원한 단맛이 어우러져 전주 한옥마을의 풍류 한 폭을 그려내요.",
          ja: "挽きたての新鮮な牛肉に梨・ニンニク・ごま油を合わせ、卵黄をのせた全州の高級料理です。口の中でとろける柔らかさと梨の爽やかな甘みが調和し、全州韓屋村の風流を一筆で描きます。",
          en: "Freshly minced raw beef tossed with pear, garlic and sesame oil, topped with a quivering egg yolk — a Jeonju delicacy. The melt-in-mouth tenderness meets the cool sweetness of pear like a brushstroke of Hanok village elegance."
        },
        ingredients: { ko: ["소고기 우둔", "배", "마늘", "참기름", "달걀노른자", "잣", "간장"], ja: ["牛もも肉", "梨", "ニンニク", "ごま油", "卵黄", "松の実", "醤油"], en: ["Beef round", "Asian pear", "Garlic", "Sesame oil", "Egg yolk", "Pine nuts", "Soy sauce"] },
        tags: ["생고기", "별미", "고급"],
        dupes: {
          JP: [
        { name: { ko: "규 타타키", ja: "牛タタキ", en: "Gyū Tataki" }, tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 75, sour: 15 }, description: { ko: "소고기 표면만 살짝 구워 얇게 썰어 폰즈에 찍어 먹는 일본 요리", ja: "牛肉の表面だけを軽く焼き薄く切ってポン酢で食べる日本料理", en: "Japanese lightly-seared beef sliced thin and served with ponzu" }, ingredients: { ko: ["소고기", "폰즈", "생강", "마늘", "쪽파", "간장"], ja: ["牛肉", "ポン酢", "生姜", "ニンニク", "小ネギ", "醤油"], en: ["Beef", "Ponzu", "Ginger", "Garlic", "Chive", "Soy sauce"] }, similarityPercent: 80, matchReason: { ko: "신선한 소고기의 본연의 맛을 간장 양념으로 즐기는 요리", ja: "新鮮な牛肉本来の味を醤油だれで楽しむ料理", en: "Raw/rare beef seasoned with soy-based sauce — closest sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "셩 니우러우", ja: "生牛肉", en: "Sheng Niurou" }, tasteProfile: { sweet: 10, salty: 50, spicy: 20, umami: 70, sour: 20 }, description: { ko: "얇게 썬 생소고기에 마라·간장 소스를 부어 먹는 사천식 냉채", ja: "薄切りの生牛肉に麻辣・醤油ソースをかけた四川式前菜", en: "Sichuan cold dish of thinly sliced raw beef with mala-soy dressing" }, ingredients: { ko: ["소고기", "두반장", "화자오", "마늘", "간장", "고추기름"], ja: ["牛肉", "豆板醤", "花椒", "ニンニク", "醤油", "ラー油"], en: ["Beef", "Doubanjiang", "Sichuan pepper", "Garlic", "Soy sauce", "Chili oil"] }, similarityPercent: 72, matchReason: { ko: "생소고기에 향신 소스를 더해 차갑게 먹는 구조", ja: "生牛肉に香辛ソースを加えて冷たく食べる構造", en: "Raw beef dressed with aromatic sauce — same raw-meat small plate" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-bori-guksu",
        image: "",
        name: { ko: "보리국수", ja: "ボリグクス", en: "Bori Guksu" },
        region: "jeonju",
        tasteProfile: { sweet: 10, salty: 45, spicy: 30, umami: 65, sour: 10 },
        storyDescription: {
          ko: "통보리를 섞어 뽑은 거뭇한 국수를 찬 멸치 육수에 풀어 얼음과 함께 내는 여름 별미예요. 고소한 보리 향과 새콤한 양념, 시원함이 어우러져 전주 한옥마을 한낮의 더위를 시원하게 식혀준답니다.",
          ja: "全粒大麦を混ぜて打った黒みがかった麺を冷たい煮干しだしにほぐし、氷と一緒に出す夏の逸品です。香ばしい麦の香りと酸味の効いた薬味、冷たさが調和し、全州韓屋村の昼の暑さを涼やかに鎮めてくれます。",
          en: "Barley-streaked dark noodles loosened into cold anchovy broth with ice — a summer delicacy. The nutty barley, tangy dressing and chill together cool the midday heat of Jeonju's Hanok village."
        },
        ingredients: { ko: ["보리국수", "멸치육수", "오이", "김치", "고추장", "식초", "참기름", "달걀"], ja: ["大麦麺", "煮干しだし", "きゅうり", "キムチ", "コチュジャン", "酢", "ごま油", "卵"], en: ["Barley noodles", "Anchovy broth", "Cucumber", "Kimchi", "Gochujang", "Vinegar", "Sesame oil", "Egg"] },
        tags: ["냉국수", "보리", "여름"],
        dupes: {
          JP: [
        { name: { ko: "자루 소바", ja: "ざるそば", en: "Zaru Soba" }, tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 65, sour: 10 }, description: { ko: "삶아 차갑게 식힌 메밀국수를 쯔유에 찍어 먹는 일본 여름 국수", ja: "茹でて冷やしたそばをつゆにつけて食べる日本の夏の麺", en: "Japanese cold buckwheat noodles dipped in tsuyu sauce" }, ingredients: { ko: ["메밀국수", "쯔유", "김", "와사비", "쪽파", "얼음"], ja: ["そば", "つゆ", "海苔", "わさび", "青ネギ", "氷"], en: ["Soba", "Tsuyu", "Nori", "Wasabi", "Scallion", "Ice"] }, similarityPercent: 70, matchReason: { ko: "곡물 향이 살아있는 차가운 국수 + 진한 육수", ja: "穀物の香りが生きた冷たい麺 + 濃厚なつゆ", en: "Grain-fragrant cold noodles + savory broth — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "량미엔", ja: "涼麺", en: "Liang Mian" }, tasteProfile: { sweet: 15, salty: 50, spicy: 35, umami: 65, sour: 15 }, description: { ko: "삶은 국수를 차갑게 식혀 참깨 소스와 식초로 버무린 중국식 여름 국수", ja: "茹でた麺を冷やしてごまダレと酢で和えた中国式夏の麺", en: "Chinese cold noodles dressed with sesame-and-vinegar sauce" }, ingredients: { ko: ["밀국수", "참깨 소스", "간장", "식초", "오이", "닭가슴살"], ja: ["小麦麺", "ごまダレ", "醤油", "酢", "きゅうり", "鶏胸肉"], en: ["Wheat noodles", "Sesame sauce", "Soy sauce", "Vinegar", "Cucumber", "Chicken"] }, similarityPercent: 70, matchReason: { ko: "차가운 국수에 새콤한 양념과 오이를 더해 먹는 여름 스타일", ja: "冷たい麺に酸味の効いた調味料ときゅうりを加える夏スタイル", en: "Cold noodles with tangy dressing and cucumber — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-gondrebap",
        image: "",
        name: { ko: "곤드레밥", ja: "コンドゥレご飯", en: "Gondre Rice" },
        region: "jeonju",
        tasteProfile: { sweet: 10, salty: 40, spicy: 5, umami: 60, sour: 5 },
        storyDescription: {
          ko: "산에서 갓 뜯어온 곤드레나물을 쌀과 함께 무쇠솥에 안쳐 지어낸 소박한 밥상이에요. 간장 양념장을 비벼 한 숟갈 뜨면, 산과 들의 봄 내음이 입 안 가득 번져요.",
          ja: "山から摘んだばかりのコンドゥレ（山菜）をお米と一緒に鉄鍋で炊き上げた素朴な食卓です。醤油だれを混ぜて一さじ食べれば、山と野の春の香りが口いっぱいに広がります。",
          en: "Just-picked gondre mountain herb folded into rice and cooked in a cast-iron pot — a humble Jeonju meal. Mixed with soy dressing, each spoon carries the scent of spring hills and fields."
        },
        ingredients: { ko: ["곤드레나물", "쌀", "간장", "참기름", "들기름", "마늘", "대파"], ja: ["コンドゥレ", "米", "醤油", "ごま油", "エゴマ油", "ニンニク", "長ネギ"], en: ["Gondre herb", "Rice", "Soy sauce", "Sesame oil", "Perilla oil", "Garlic", "Green onion"] },
        tags: ["산채", "솥밥", "전통"],
        dupes: {
          JP: [
        { name: { ko: "와카메 고항", ja: "わかめご飯", en: "Wakame Gohan" }, tasteProfile: { sweet: 10, salty: 45, spicy: 0, umami: 60, sour: 5 }, description: { ko: "미역을 쌀과 함께 지은 일본식 향긋한 밥", ja: "ワカメをお米と一緒に炊いた香ばしい日本のご飯", en: "Japanese rice cooked with wakame seaweed for a savory aroma" }, ingredients: { ko: ["쌀", "미역", "참깨", "소금", "간장"], ja: ["米", "ワカメ", "ごま", "塩", "醤油"], en: ["Rice", "Wakame", "Sesame", "Salt", "Soy sauce"] }, similarityPercent: 67, matchReason: { ko: "잎채소의 향을 쌀에 입혀 지어낸 소박한 밥", ja: "葉野菜の香りをお米に移した素朴なご飯", en: "Leafy-green-scented rice — same humble comfort bowl" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "차이판", ja: "菜飯", en: "Cai Fan" }, tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 60, sour: 5 }, description: { ko: "청경채와 같은 푸른 잎채소를 쌀과 함께 지은 상하이식 채소밥", ja: "青梗菜のような葉野菜をお米と一緒に炊いた上海式野菜ご飯", en: "Shanghai rice cooked with leafy greens like bok choy" }, ingredients: { ko: ["쌀", "청경채", "라드", "소금", "대파"], ja: ["米", "青梗菜", "ラード", "塩", "長ネギ"], en: ["Rice", "Bok choy", "Lard", "Salt", "Green onion"] }, similarityPercent: 63, matchReason: { ko: "산나물·잎채소를 쌀에 섞어 한 솥에 지어내는 전통", ja: "山菜・葉野菜をお米に混ぜて一鍋で炊く伝統", en: "Leafy-green mixed rice — same one-pot tradition" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-sikhye",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeonju-sikhye.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "식혜", ja: "シッケ", en: "Sikhye (Sweet Rice Punch)" },
        region: "jeonju",
        tasteProfile: { sweet: 80, salty: 5, spicy: 0, umami: 10, sour: 5 },
        storyDescription: {
          ko: "엿기름물에 밥알을 삭혀 달콤하게 끓인 전통 음료로, 얼음과 잣을 띄워 차갑게 마셔요. 한 모금 삼키면 구수한 쌀 향과 은은한 단맛이 입 안을 부드럽게 감싸요.",
          ja: "麦芽の煮汁にご飯粒を発酵させて甘く煮た伝統飲料で、氷と松の実を浮かべて冷たく飲みます。一口含めば、香ばしい米の香りと上品な甘さが口の中をやさしく包みます。",
          en: "A traditional drink made by fermenting rice grains in malt water, sweet and served cold with ice and pine nuts. One sip wraps your mouth in the gentle nuttiness of rice and a mellow sweetness."
        },
        ingredients: { ko: ["엿기름", "쌀", "설탕", "생강", "잣"], ja: ["麦芽", "米", "砂糖", "生姜", "松の実"], en: ["Malt", "Rice", "Sugar", "Ginger", "Pine nuts"] },
        tags: ["음료", "전통", "단맛"],
        dupes: {
          JP: [
        { name: { ko: "아마자케", ja: "甘酒", en: "Amazake" }, tasteProfile: { sweet: 80, salty: 5, spicy: 5, umami: 10, sour: 5 }, description: { ko: "쌀과 누룩으로 발효시켜 만든 일본 전통 달콤한 쌀 음료", ja: "米と麹で発酵させて作る日本の伝統甘い米飲料", en: "Japanese traditional sweet drink made from rice and koji" }, ingredients: { ko: ["쌀", "누룩", "생강", "물"], ja: ["米", "麹", "生姜", "水"], en: ["Rice", "Koji", "Ginger", "Water"] }, similarityPercent: 85, matchReason: { ko: "쌀을 발효시켜 달콤하게 만든 전통 음료의 동일한 구조", ja: "米を発酵させて甘く作る伝統飲料の同じ構造", en: "Rice fermented into sweet beverage — nearly identical concept" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "미주", ja: "米酒", en: "Mi Jiu (Sweet Rice Wine)" }, tasteProfile: { sweet: 75, salty: 5, spicy: 0, umami: 10, sour: 10 }, description: { ko: "찹쌀을 누룩으로 발효시켜 만든 중국 전통 달콤한 쌀 술", ja: "もち米を麹で発酵させて作る中国伝統の甘い米酒", en: "Chinese traditional sweet rice wine fermented with yeast" }, ingredients: { ko: ["찹쌀", "누룩", "물", "설탕"], ja: ["もち米", "麹", "水", "砂糖"], en: ["Glutinous rice", "Yeast", "Water", "Sugar"] }, similarityPercent: 77, matchReason: { ko: "쌀 발효의 달콤한 음료라는 공통점", ja: "米発酵の甘い飲料という共通点", en: "Sweet fermented-rice drink — Chinese cousin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeonju-ogokbap",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeonju-ogokbap.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        name: { ko: "오곡밥", ja: "五穀ご飯", en: "Ogokbap (Five-grain Rice)" },
        region: "jeonju",
        tasteProfile: { sweet: 15, salty: 35, spicy: 5, umami: 50, sour: 5 },
        storyDescription: {
          ko: "쌀·찹쌀·수수·차조·검은콩 다섯 가지 곡물을 한 솥에 지어내는 정월 대보름 밥이에요. 알록달록한 곡물 알갱이가 한 숟갈 안에서 오색의 건강을 이야기해요.",
          ja: "米・もち米・もろこし・粟・黒豆の五つの穀物を一つの釜で炊き上げる小正月のご飯です。色とりどりの穀粒が一さじの中で五色の健康を語ります。",
          en: "Rice, glutinous rice, sorghum, millet and black beans cooked together in a single pot — the traditional meal of Jeongwol Daeboreum. Each spoonful tells a story of five-colored wellness."
        },
        ingredients: { ko: ["쌀", "찹쌀", "차조", "수수", "검은콩", "팥", "소금"], ja: ["米", "もち米", "粟", "もろこし", "黒豆", "小豆", "塩"], en: ["Rice", "Glutinous rice", "Millet", "Sorghum", "Black beans", "Red beans", "Salt"] },
        tags: ["곡물", "정월대보름", "건강"],
        dupes: {
          JP: [
        { name: { ko: "오코와", ja: "おこわ", en: "Okowa" }, tasteProfile: { sweet: 15, salty: 35, spicy: 0, umami: 55, sour: 5 }, description: { ko: "찹쌀에 콩·밤·팥을 섞어 지어낸 일본 전통 찰밥", ja: "もち米に豆・栗・小豆を混ぜて炊いた日本伝統のおこわ", en: "Japanese traditional glutinous rice with beans, chestnuts and red beans" }, ingredients: { ko: ["찹쌀", "팥", "밤", "검은콩", "소금"], ja: ["もち米", "小豆", "栗", "黒豆", "塩"], en: ["Glutinous rice", "Red beans", "Chestnuts", "Black beans", "Salt"] }, similarityPercent: 80, matchReason: { ko: "여러 곡물·콩을 찹쌀에 섞어 함께 지어내는 동일한 조리법", ja: "様々な穀物・豆をもち米に混ぜて一緒に炊く同じ調理法", en: "Glutinous rice mixed with grains and beans — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "빠바오판", ja: "八宝飯", en: "Ba Bao Fan (Eight Treasures Rice)" }, tasteProfile: { sweet: 50, salty: 15, spicy: 0, umami: 30, sour: 5 }, description: { ko: "찹쌀에 팥소와 과일, 견과를 올려 찐 중국 전통 쌀 디저트", ja: "もち米に小豆あんと果物、ナッツをのせて蒸した中国伝統の米デザート", en: "Chinese traditional steamed glutinous rice with red bean paste, fruits and nuts" }, ingredients: { ko: ["찹쌀", "팥앙금", "건포도", "연자", "대추", "설탕"], ja: ["もち米", "小豆あん", "レーズン", "蓮の実", "なつめ", "砂糖"], en: ["Glutinous rice", "Red bean paste", "Raisin", "Lotus seed", "Jujube", "Sugar"] }, similarityPercent: 77, matchReason: { ko: "여러 곡물·열매를 찹쌀에 모아 지어내는 기념일 밥의 동일한 전통", ja: "様々な穀物・果実をもち米に集めて炊く記念日のご飯の同じ伝統", en: "Multi-grain festive rice tradition — Chinese cousin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      }
    ]
  },
  {
    code: "seoul",
    name: { ko: "서울", ja: "ソウル", en: "Seoul" },
    icon: "🏙️",
    image: "/images/village/seoul.jpg",
    description: { ko: "천 가지 맛이 공존하는 대한민국의 수도", ja: "千の味が共存する大韓民国の首都", en: "Korea's capital where a thousand flavors coexist" },
    foods: [
      {
        id: "seoul-samgyeopsal",
        name: { ko: "삼겹살", ja: "サムギョプサル", en: "Samgyeopsal" },
        region: "seoul",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/seoul-samgyeopsal.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        tasteProfile: { sweet: 10, salty: 55, spicy: 20, umami: 80, sour: 10 },
        storyDescription: {
          ko: "지글지글 불판 위에서 구워지는 소리만으로도 벌써 침이 고여요. 상추에 싸서 마늘, 쌈장과 함께 크게 한 입 베어 무는 순간, 서울 밤의 활기가 입안에서 터져 나와요.",
          ja: "ジュージューと鉄板で焼ける音だけで、もう口の中に唾液が溜まります。サンチュに包んでニンニク、サムジャンと一緒に大きくひと口かじる瞬間、ソウルの夜の活気が口の中で弾けます。",
          en: "The sizzle on the hot iron plate is enough to make your mouth water. Wrapped in lettuce with garlic and ssamjang, one big bite and the electric energy of a Seoul night explodes in your mouth."
        },
        ingredients: {
          ko: ["삼겹살", "상추", "깻잎", "마늘", "쌈장", "참기름", "소금", "된장찌개"],
          ja: ["豚バラ肉", "サンチュ", "エゴマの葉", "ニンニク", "サムジャン", "ごま油", "塩", "テンジャンチゲ"],
          en: ["Pork belly", "Lettuce", "Perilla leaf", "Garlic", "Ssamjang", "Sesame oil", "Salt", "Doenjang stew"]
        },
        tags: ["구이", "삼겹살", "쌈"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-dakhanmari",
        name: { ko: "닭한마리", ja: "タッハンマリ", en: "Dakhanmari" },
        region: "seoul",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/seoul-dakhanmari.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 프레임스튜디오",
        tasteProfile: { sweet: 15, salty: 40, spicy: 30, umami: 85, sour: 5 },
        storyDescription: {
          ko: "통닭 한 마리를 커다란 냄비에 넣고 맑게 끓여내는 동대문의 명물이에요. 직접 테이블 위 냄비에서 끓이며 먹는 즐거움과 진한 닭 육수가 소울 푸드의 모든 것을 담고 있어요.",
          ja: "丸鶏一羽を大きな鍋に入れて澄んだスープで煮る東大門の名物です。テーブルの上の鍋で自ら煮ながら食べる楽しさと濃厚な鶏出汁が、ソウルフードのすべてを詰め込んでいます。",
          en: "A whole chicken simmered clear in a big pot — Dongdaemun's most beloved dish. The joy of cooking it yourself tableside and the deep chicken broth capture everything a soul food should be."
        },
        ingredients: {
          ko: ["통닭", "감자", "대파", "마늘", "칼국수면", "떡", "간장", "고추"],
          ja: ["丸鶏", "ジャガイモ", "長ネギ", "ニンニク", "カルグクス麺", "餅", "醤油", "唐辛子"],
          en: ["Whole chicken", "Potato", "Green onion", "Garlic", "Knife-cut noodles", "Rice cake", "Soy sauce", "Chili"]
        },
        tags: ["닭", "전골", "동대문"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-seolleongtang",
        name: { ko: "설렁탕", ja: "ソルロンタン", en: "Seolleongtang" },
        region: "seoul",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/seoul-seolleongtang.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        tasteProfile: { sweet: 10, salty: 40, spicy: 10, umami: 90, sour: 0 },
        storyDescription: {
          ko: "뽀얀 우윳빛 국물이 뼈와 고기를 몇 시간이나 끓여 만든 서울의 오랜 영혼 같은 음식이에요. 기호에 맞게 소금과 깍두기를 곁들이면 새벽에도 따뜻하게 위를 달래주는 완벽한 한 끼가 됩니다.",
          ja: "乳白色のスープは骨と肉を何時間も煮込んで作ったソウルの古い魂のような料理です。好みに合わせて塩とカクテキを添えると、夜明けでも温かくお腹を癒す完璧な一食になります。",
          en: "Milky white broth born from hours of simmering bones and meat — it is Seoul's oldest soul food. Season it with salt and add some kkakdugi, and even at dawn it warms and heals the stomach perfectly."
        },
        ingredients: {
          ko: ["소뼈", "소고기", "밥", "국수", "소금", "깍두기", "대파", "후추"],
          ja: ["牛骨", "牛肉", "ご飯", "麺", "塩", "カクテキ", "長ネギ", "胡椒"],
          en: ["Beef bone", "Beef", "Rice", "Noodles", "Salt", "Kkakdugi", "Green onion", "Pepper"]
        },
        tags: ["국밥", "뽀얀국물", "해장"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-street-toast",
        name: { ko: "길거리 토스트", ja: "屋台トースト", en: "Street Toast" },
        region: "seoul",
        image: "",
        tasteProfile: { sweet: 35, salty: 45, spicy: 15, umami: 50, sour: 10 },
        storyDescription: {
          ko: "이른 아침 버터 향이 솔솔 나는 길거리 토스트 한 봉지는 서울 직장인들의 든든한 아침이에요. 달걀, 양배추, 설탕 한 꼬집의 조합이 왜 이렇게 맛있는지 먹어봐야만 알 수 있답니다.",
          ja: "早朝にバターの香りが漂う屋台トースト一袋は、ソウルのサラリーマンたちのしっかりした朝ごはんです。卵、キャベツ、ひとつまみの砂糖の組み合わせがなぜこんなに美味しいのか、食べてみないとわかりません。",
          en: "A bag of buttery street toast is the sturdy morning meal of Seoul's working crowd. Why the combo of egg, cabbage, and a pinch of sugar tastes so impossibly good is something you have to experience for yourself."
        },
        ingredients: {
          ko: ["식빵", "달걀", "양배추", "당근", "버터", "설탕", "케첩", "마요네즈"],
          ja: ["食パン", "卵", "キャベツ", "人参", "バター", "砂糖", "ケチャップ", "マヨネーズ"],
          en: ["White bread", "Egg", "Cabbage", "Carrot", "Butter", "Sugar", "Ketchup", "Mayonnaise"]
        },
        tags: ["길거리", "토스트", "아침"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-bindaetteok",
        name: { ko: "광장시장 빈대떡", ja: "広蔵市場のビンデトク", en: "Gwangjang Market Bindaetteok" },
        region: "seoul",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/seoul-bindaetteok.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        tasteProfile: { sweet: 10, salty: 50, spicy: 25, umami: 75, sour: 15 },
        storyDescription: {
          ko: "녹두를 갈아 기름에 지글지글 부쳐낸 광장시장의 빈대떡은 바삭함과 고소함의 교과서예요. 막걸리 한 잔과 함께라면 서울 오래된 시장의 정취가 온몸으로 느껴진답니다.",
          ja: "緑豆をすり潰して油でジュージュー焼いた広蔵市場のビンデトクは、カリカリと香ばしさの教科書です。マッコリ一杯と一緒なら、ソウルの古い市場の風情が全身で感じられます。",
          en: "Ground mung bean pancakes sizzled in oil at Gwangjang Market are the textbook definition of crispy and savory. Pair with a glass of makgeolli and you feel the soul of Seoul's oldest market in every bite."
        },
        ingredients: {
          ko: ["녹두", "돼지고기", "김치", "숙주", "부추", "식용유", "소금", "후추"],
          ja: ["緑豆", "豚肉", "キムチ", "もやし", "ニラ", "食用油", "塩", "胡椒"],
          en: ["Mung bean", "Pork", "Kimchi", "Bean sprouts", "Chive", "Cooking oil", "Salt", "Pepper"]
        },
        tags: ["전", "시장", "막걸리"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-hangang-ramen",
        name: { ko: "한강 라면", ja: "漢江ラーメン", en: "Hangang Ramen" },
        region: "seoul",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/seoul-hangang-ramen.jpeg",
        tasteProfile: { sweet: 15, salty: 65, spicy: 50, umami: 60, sour: 5 },
        storyDescription: {
          ko: "컵라면에 뜨거운 물을 붓고 한강 변에 앉아 먹는 그 행복감은 미슐랭 식당도 따라올 수 없어요. 바람에 흔들리는 강물을 바라보며 호호 불어 먹는 라면 한 젓가락은 서울 낭만 그 자체예요.",
          ja: "カップラーメンに熱湯を注いで漢江沿いに座って食べるあの幸福感は、ミシュランのレストランも追いつけません。風で揺れる川面を眺めながらフーフー冷ましながら食べるラーメン一口は、ソウルのロマンそのものです。",
          en: "The happiness of sitting riverside and eating instant ramen from a cup is something no Michelin restaurant can match. Watching the Han River ripple as you blow-cool each chopstick-full of noodles — that is Seoul romance."
        },
        ingredients: {
          ko: ["컵라면", "뜨거운 물", "삶은 달걀", "김치", "참치캔", "대파", "치즈", "고춧가루"],
          ja: ["カップラーメン", "熱湯", "ゆで卵", "キムチ", "ツナ缶", "長ネギ", "チーズ", "唐辛子粉"],
          en: ["Cup ramen", "Hot water", "Boiled egg", "Kimchi", "Canned tuna", "Green onion", "Cheese", "Chili powder"]
        },
        tags: ["라면", "한강", "낭만"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-gamjatang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/seoul-gamjatang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 프레임스튜디오",
        name: { ko: "감자탕", ja: "カムジャタン", en: "Gamjatang (Pork Bone Potato Soup)" },
        region: "seoul",
        tasteProfile: { sweet: 10, salty: 55, spicy: 65, umami: 85, sour: 5 },
        storyDescription: {
          ko: "등뼈를 오래 고아 뽀얀 육수에 감자·깻잎·들깨가루를 듬뿍 넣어 얼큰하게 끓여낸 서울의 밤 요리예요. 뼈 사이 부드러운 고기를 발라 먹는 재미와 구수한 국물이 새벽 2시의 친구예요.",
          ja: "豚の背骨を長時間煮込んで白濁スープにジャガイモ・エゴマの葉・エゴマ粉をたっぷり入れてピリ辛に仕上げたソウルの夜の料理です。骨の間の柔らかい肉をほぐして食べる楽しさと香ばしいスープが午前2時の友です。",
          en: "Pork spine simmered into a milky broth with potatoes, perilla leaves and perilla powder, finished fiery red — Seoul's late-night warrior. The joy of picking tender meat from bones and the earthy broth are your companions at 2 AM."
        },
        ingredients: { ko: ["돼지 등뼈", "감자", "깻잎", "들깨가루", "고춧가루", "된장", "대파", "마늘"], ja: ["豚の背骨", "ジャガイモ", "エゴマの葉", "エゴマ粉", "唐辛子粉", "味噌", "長ネギ", "ニンニク"], en: ["Pork spine", "Potato", "Perilla leaf", "Perilla powder", "Chili powder", "Doenjang", "Green onion", "Garlic"] },
        tags: ["뼈해장", "해장국", "술안주"],
        dupes: {
          JP: [
        { name: { ko: "돈코츠 나베", ja: "豚骨鍋", en: "Tonkotsu Nabe" }, tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 90, sour: 5 }, description: { ko: "돼지 등뼈를 오래 고아 채소와 함께 끓인 일본식 돈코츠 전골", ja: "豚の背骨を長時間煮込んで野菜と共に煮込んだ日本式豚骨鍋", en: "Japanese pork-bone hot pot slow-simmered with vegetables" }, ingredients: { ko: ["돼지 등뼈", "배추", "두부", "버섯", "간장", "미소"], ja: ["豚の背骨", "白菜", "豆腐", "きのこ", "醤油", "味噌"], en: ["Pork spine", "Napa cabbage", "Tofu", "Mushroom", "Soy sauce", "Miso"] }, similarityPercent: 78, matchReason: { ko: "돼지 뼈를 오래 끓여 진한 국물을 내는 동일 기법", ja: "豚骨を長時間煮込んで深いスープを作る同じ技法", en: "Pork bone slow-simmered into deep broth — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "파이구 쭈앙위", ja: "排骨土豆", en: "Paigu Tudou" }, tasteProfile: { sweet: 10, salty: 55, spicy: 40, umami: 85, sour: 5 }, description: { ko: "돼지 갈비와 감자를 간장·향신료에 오래 끓여낸 중국 북부식 요리", ja: "豚スペアリブとジャガイモを醤油・スパイスで長時間煮込んだ中国北部料理", en: "Northern Chinese braised pork ribs with potato in soy-spice sauce" }, ingredients: { ko: ["돼지 갈비", "감자", "간장", "팔각", "두반장", "생강"], ja: ["豚スペアリブ", "ジャガイモ", "醤油", "八角", "豆板醤", "生姜"], en: ["Pork ribs", "Potato", "Soy sauce", "Star anise", "Doubanjiang", "Ginger"] }, similarityPercent: 75, matchReason: { ko: "돼지 뼈와 감자를 같이 끓이는 거의 동일한 구조", ja: "豚骨とジャガイモを一緒に煮込むほぼ同じ構造", en: "Pork ribs and potato slow-braised — close Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-sundaekook",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/seoul-sundaekook.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        name: { ko: "순대국", ja: "スンデクッ", en: "Sundaekook (Blood Sausage Soup)" },
        region: "seoul",
        tasteProfile: { sweet: 10, salty: 60, spicy: 20, umami: 90, sour: 5 },
        storyDescription: {
          ko: "돼지 뼈와 머리고기를 푹 고아 뽀얀 국물에 쫄깃한 순대와 내장을 넣고 들깻가루를 듬뿍 뿌려낸 서울의 해장국이에요. 밤새 지친 속을 달래는 묵직한 한 그릇이에요.",
          ja: "豚骨と頭肉を煮込んで白濁のスープにもちもちのスンデと内臓を入れ、エゴマ粉をたっぷりかけたソウルの解酔スープです。夜通し疲れたお腹を癒す重厚な一杯です。",
          en: "Pork bones and head meat simmered into milky broth, filled with chewy blood sausage and offal, and crowned with perilla powder — Seoul's hangover soup. A weighty bowl that soothes a body worn through the night."
        },
        ingredients: { ko: ["순대", "돼지 뼈", "머리고기", "대파", "들깨가루", "새우젓", "부추", "마늘"], ja: ["スンデ", "豚骨", "頭肉", "長ネギ", "エゴマ粉", "アミの塩辛", "ニラ", "ニンニク"], en: ["Sundae", "Pork bone", "Head meat", "Green onion", "Perilla powder", "Salted shrimp", "Chive", "Garlic"] },
        tags: ["해장국", "순대", "돼지뼈"],
        dupes: {
          JP: [
        { name: { ko: "모츠니", ja: "もつ煮", en: "Motsuni" }, tasteProfile: { sweet: 10, salty: 60, spicy: 10, umami: 85, sour: 5 }, description: { ko: "돼지 내장과 채소를 간장·미소에 오래 끓인 일본 서민식 국물", ja: "豚モツと野菜を醤油・味噌で長時間煮込んだ日本の庶民スープ", en: "Japanese working-class simmer of pork offal and vegetables in soy-miso" }, ingredients: { ko: ["돼지 내장", "무", "곤약", "간장", "미소", "생강"], ja: ["豚モツ", "大根", "こんにゃく", "醤油", "味噌", "生姜"], en: ["Pork offal", "Daikon", "Konjac", "Soy sauce", "Miso", "Ginger"] }, similarityPercent: 77, matchReason: { ko: "돼지 내장을 오래 끓인 서민 해장용 국물", ja: "豚モツを長時間煮込んだ庶民の解酔スープ", en: "Pork offal slow-simmered restorative — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "주 자포", ja: "猪雜煲", en: "Zhu Za Bao" }, tasteProfile: { sweet: 10, salty: 55, spicy: 20, umami: 85, sour: 5 }, description: { ko: "돼지 내장·순대를 뼈 육수에 끓여낸 광둥식 내장 수프", ja: "豚モツ・ソーセージを骨スープで煮込んだ広東式モツスープ", en: "Cantonese pork offal soup with blood sausage in bone broth" }, ingredients: { ko: ["돼지 내장", "돼지 피순대", "돼지뼈", "생강", "대파", "백후추"], ja: ["豚モツ", "豚の血ソーセージ", "豚骨", "生姜", "長ネギ", "白胡椒"], en: ["Pork offal", "Blood sausage", "Pork bone", "Ginger", "Green onion", "White pepper"] }, similarityPercent: 82, matchReason: { ko: "돼지 뼈 육수에 순대와 내장이 어우러진 거의 동일한 요리", ja: "豚骨スープにソーセージと内臓が調和するほぼ同じ料理", en: "Pork bone broth with offal and blood sausage — close Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-mayak-gimbap",
        image: "",
        name: { ko: "광장시장 마약김밥", ja: "広蔵市場マヤッキンパ", en: "Mayak Gimbap (Gwangjang Market Mini Rolls)" },
        region: "seoul",
        tasteProfile: { sweet: 15, salty: 55, spicy: 15, umami: 65, sour: 10 },
        storyDescription: {
          ko: "손가락 크기의 미니 김밥을 겨자 간장에 찍어 먹는 서울 광장시장의 명물이에요. 중독성이 강해 '마약'이라는 별명이 붙었고, 한 접시는 순식간에 사라져요.",
          ja: "指サイズのミニキンパをマスタード醤油につけて食べるソウル広蔵市場の名物です。中毒性が強く「マヤッ（麻薬）」というあだ名がつき、一皿はあっという間に消えます。",
          en: "Finger-sized mini rice rolls dipped in mustard-soy sauce — the star of Seoul's Gwangjang Market. So addictive it earned the nickname 'mayak' (drug); a plate disappears in an instant."
        },
        ingredients: { ko: ["밥", "김", "당근", "시금치", "단무지", "참기름", "겨자", "간장"], ja: ["ご飯", "海苔", "人参", "ほうれん草", "たくあん", "ごま油", "マスタード", "醤油"], en: ["Rice", "Seaweed", "Carrot", "Spinach", "Pickled radish", "Sesame oil", "Mustard", "Soy sauce"] },
        tags: ["김밥", "광장시장", "미니"],
        dupes: {
          JP: [
        { name: { ko: "데마키즈시", ja: "手巻き寿司", en: "Temaki Sushi" }, tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 65, sour: 15 }, description: { ko: "김에 밥과 재료를 간단히 말아 먹는 일본식 손말이 초밥", ja: "海苔にご飯と具を簡単に巻いて食べる日本式手巻き寿司", en: "Japanese hand-rolled sushi with rice and fillings in seaweed" }, ingredients: { ko: ["밥", "김", "참치", "오이", "와사비", "간장"], ja: ["ご飯", "海苔", "マグロ", "きゅうり", "わさび", "醤油"], en: ["Rice", "Nori", "Tuna", "Cucumber", "Wasabi", "Soy sauce"] }, similarityPercent: 75, matchReason: { ko: "김에 밥과 속을 말아 소스에 찍어 먹는 거의 동일한 요리", ja: "海苔にご飯と具を巻いてソースに付ける近似料理", en: "Hand-rolled seaweed rice — close Japanese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "서우권", ja: "手巻き", en: "Shou Juan Rice Roll" }, tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 60, sour: 5 }, description: { ko: "김에 밥과 채소를 말아 먹는 중국식 간이 김밥", ja: "海苔にご飯と野菜を巻いて食べる中国式の簡易キンパ", en: "Chinese simple rice roll with rice and vegetables in seaweed" }, ingredients: { ko: ["밥", "김", "당근", "오이", "간장", "참기름"], ja: ["ご飯", "海苔", "人参", "きゅうり", "醤油", "ごま油"], en: ["Rice", "Seaweed", "Carrot", "Cucumber", "Soy sauce", "Sesame oil"] }, similarityPercent: 70, matchReason: { ko: "간단하게 말아낸 김밥류의 공통점", ja: "シンプルに巻いたキンパ類の共通点", en: "Simple seaweed roll — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-gopchang",
        image: "",
        name: { ko: "곱창구이", ja: "コプチャン焼き", en: "Gopchang Gui (Grilled Tripe)" },
        region: "seoul",
        tasteProfile: { sweet: 10, salty: 55, spicy: 50, umami: 85, sour: 5 },
        storyDescription: {
          ko: "소나 돼지 곱창을 불판에 구워 소금 양념이나 매콤한 양념에 찍어 먹는 서울의 술안주예요. 쫄깃한 식감과 고소한 기름 향이 소주를 부르는 마법을 부려요.",
          ja: "牛や豚のコプチャンを鉄板で焼いて塩ダレかピリ辛ダレで食べるソウルの酒のつまみです。コリコリの食感と香ばしい脂の香りが焼酎を呼ぶ魔法を演じます。",
          en: "Beef or pork intestines grilled on an iron plate and dipped in salt or spicy sauce — Seoul's quintessential drinking snack. The chewy bite and savory fat perform magic that calls out for soju."
        },
        ingredients: { ko: ["소 곱창", "양배추", "대파", "마늘", "참기름", "소금", "고추장", "깻잎"], ja: ["牛コプチャン", "キャベツ", "長ネギ", "ニンニク", "ごま油", "塩", "コチュジャン", "エゴマの葉"], en: ["Beef tripe", "Cabbage", "Green onion", "Garlic", "Sesame oil", "Salt", "Gochujang", "Perilla leaf"] },
        tags: ["곱창", "술안주", "구이"],
        dupes: {
          JP: [
        { name: { ko: "호루몬야키", ja: "ホルモン焼き", en: "Horumonyaki" }, tasteProfile: { sweet: 15, salty: 55, spicy: 15, umami: 85, sour: 5 }, description: { ko: "소 내장을 간장 양념에 구워 먹는 일본식 내장구이", ja: "牛の内臓を醤油ダレで焼く日本式ホルモン焼き", en: "Japanese grilled beef offal with soy-based sauce" }, ingredients: { ko: ["소 곱창", "간장", "미림", "마늘", "양파", "미소"], ja: ["牛ホルモン", "醤油", "みりん", "ニンニク", "玉ねぎ", "味噌"], en: ["Beef tripe", "Soy sauce", "Mirin", "Garlic", "Onion", "Miso"] }, similarityPercent: 85, matchReason: { ko: "소 내장을 직화에 구워 양념에 찍어 먹는 거의 동일한 요리", ja: "牛の内臓を直火で焼いてタレに付けるほぼ同じ料理", en: "Grilled beef offal — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "마오두 샤오카오", ja: "毛肚烧烤", en: "Maodu Shaokao" }, tasteProfile: { sweet: 10, salty: 55, spicy: 60, umami: 85, sour: 5 }, description: { ko: "소 양을 마라·쯔란으로 매콤하게 구워낸 중국식 내장구이", ja: "牛モツを麻辣・クミンで辛く焼いた中国式モツ焼き", en: "Chinese spicy grilled beef tripe with mala and cumin" }, ingredients: { ko: ["소 양", "쯔란", "화자오", "두반장", "대파", "참기름"], ja: ["牛モツ", "クミン", "花椒", "豆板醤", "長ネギ", "ごま油"], en: ["Beef tripe", "Cumin", "Sichuan pepper", "Doubanjiang", "Green onion", "Sesame oil"] }, similarityPercent: 80, matchReason: { ko: "내장을 숯불에 매운 양념과 함께 구워 먹는 공통점", ja: "内臓を炭火で辛いタレと焼く共通点", en: "Spicy grilled offal — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-yang-kkochi",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/seoul-yang-kkochi.jpeg",
        name: { ko: "양꼬치", ja: "ヤンコチ（羊串焼き）", en: "Yang Kkochi (Lamb Skewers)" },
        region: "seoul",
        tasteProfile: { sweet: 10, salty: 55, spicy: 40, umami: 80, sour: 5 },
        storyDescription: {
          ko: "양고기를 쯔란 가루·고춧가루에 재워 숯불에 구워낸 서울의 중국 동북식 길거리 꼬치예요. 양꼬치엔 칭다오 맥주가 국룰, 구수한 향이 밤거리를 가득 채워요.",
          ja: "羊肉をクミン粉・唐辛子粉に漬けて炭火で焼いたソウルの中国東北式の屋台串です。ヤンコチには青島ビールが定番、香ばしい香りが夜の街を満たします。",
          en: "Lamb marinated in cumin and chili powder, grilled over charcoal — Seoul's northeast-Chinese street skewer. Always paired with Tsingtao beer, its smoky fragrance fills the night streets."
        },
        ingredients: { ko: ["양고기", "쯔란 가루", "고춧가루", "참깨", "마늘", "식용유", "대파", "청양고추"], ja: ["羊肉", "クミン粉", "唐辛子粉", "ゴマ", "ニンニク", "食用油", "長ネギ", "青唐辛子"], en: ["Lamb", "Cumin powder", "Chili powder", "Sesame", "Garlic", "Oil", "Green onion", "Green chili"] },
        tags: ["꼬치", "양고기", "길거리"],
        dupes: {
          JP: [
        { name: { ko: "야키라무", ja: "焼きラム", en: "Yaki Lamb" }, tasteProfile: { sweet: 10, salty: 55, spicy: 20, umami: 80, sour: 5 }, description: { ko: "양고기를 간장 양념에 구워낸 홋카이도식 양고기 구이", ja: "羊肉を醤油ダレで焼いた北海道式ジンギスカン", en: "Hokkaido-style grilled lamb with soy-based sauce" }, ingredients: { ko: ["양고기", "간장", "미림", "생강", "마늘", "후추"], ja: ["羊肉", "醤油", "みりん", "生姜", "ニンニク", "胡椒"], en: ["Lamb", "Soy sauce", "Mirin", "Ginger", "Garlic", "Pepper"] }, similarityPercent: 78, matchReason: { ko: "양고기를 간장 양념에 직화로 구워 먹는 동아시아식", ja: "羊肉を醤油タレで直火で焼く東アジア式", en: "Grilled lamb with soy glaze — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "양러우 추얼", ja: "羊肉串", en: "Yang Rou Chuanr" }, tasteProfile: { sweet: 10, salty: 55, spicy: 50, umami: 80, sour: 5 }, description: { ko: "양고기를 쯔란과 고추에 재워 숯불에 구운 중국 신장·동북식 꼬치", ja: "羊肉をクミンと唐辛子に漬けて炭火で焼いた中国・新疆・東北式串焼き", en: "Chinese Xinjiang/Northeastern cumin-and-chili lamb skewers" }, ingredients: { ko: ["양고기", "쯔란", "고춧가루", "참깨", "마늘", "간장"], ja: ["羊肉", "クミン", "唐辛子粉", "ゴマ", "ニンニク", "醤油"], en: ["Lamb", "Cumin", "Chili powder", "Sesame", "Garlic", "Soy sauce"] }, similarityPercent: 90, matchReason: { ko: "양고기를 쯔란·고추에 재워 숯불에 굽는 거의 동일한 요리", ja: "羊肉をクミン・唐辛子に漬けて炭火で焼くほぼ同じ料理", en: "Cumin-chili lamb skewer — Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-chimaek",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/seoul-chimaek.jpeg",
        name: { ko: "치맥", ja: "チメク（チキン＋ビール）", en: "Chimaek (Fried Chicken & Beer)" },
        region: "seoul",
        tasteProfile: { sweet: 20, salty: 55, spicy: 45, umami: 70, sour: 5 },
        storyDescription: {
          ko: "바삭한 후라이드 치킨에 시원한 맥주를 함께 먹는 서울의 국민 조합이에요. 원형으로 썰린 무와 매콤한 양념치킨이 더해지면 완벽한 여름밤 한강 피크닉이 완성돼요.",
          ja: "サクサクのフライドチキンに冷たいビールを合わせるソウルの国民的組み合わせです。輪切りの大根とピリ辛のヤンニョムチキンが加わると完璧な夏の夜の漢江ピクニックが完成します。",
          en: "Crispy fried chicken paired with ice-cold beer — Seoul's national combo. Add pickled radish and spicy yangnyeom chicken, and the perfect summer-night Hangang picnic is complete."
        },
        ingredients: { ko: ["닭고기", "밀가루 튀김옷", "고추장 양념", "마늘", "간장", "꿀", "맥주", "절임 무"], ja: ["鶏肉", "小麦粉衣", "コチュジャンダレ", "ニンニク", "醤油", "ハチミツ", "ビール", "大根漬け"], en: ["Chicken", "Flour batter", "Gochujang sauce", "Garlic", "Soy sauce", "Honey", "Beer", "Pickled radish"] },
        tags: ["치킨", "맥주", "야식"],
        dupes: {
          JP: [
        { name: { ko: "카라아게 앤 비루", ja: "唐揚げとビール", en: "Karaage & Beer" }, tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 75, sour: 10 }, description: { ko: "바삭한 일본식 닭튀김에 시원한 맥주를 곁들인 이자카야의 왕도 조합", ja: "サクサクの日本式鶏の唐揚げに冷たいビールを合わせる居酒屋の王道", en: "Japanese izakaya classic of crispy karaage fried chicken with beer" }, ingredients: { ko: ["닭다리", "간장", "미림", "생강", "마늘", "감자 전분"], ja: ["鶏もも肉", "醤油", "みりん", "生姜", "ニンニク", "片栗粉"], en: ["Chicken thigh", "Soy sauce", "Mirin", "Ginger", "Garlic", "Potato starch"] }, similarityPercent: 82, matchReason: { ko: "바삭한 닭튀김과 시원한 맥주를 함께 먹는 거의 동일한 문화", ja: "サクサクの鶏の唐揚げと冷たいビールを合わせるほぼ同じ文化", en: "Crispy fried chicken with cold beer — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "샹 쑤 지", ja: "香酥鶏", en: "Xiang Su Ji" }, tasteProfile: { sweet: 15, salty: 55, spicy: 30, umami: 75, sour: 5 }, description: { ko: "닭을 바삭하게 튀겨내 향신 양념을 뿌린 중국식 바삭한 닭튀김", ja: "鶏肉をサクサクに揚げてスパイス塩をかけた中国式の揚げ鶏", en: "Chinese crispy fried chicken dusted with spiced salt" }, ingredients: { ko: ["닭다리", "오향 가루", "간장", "쯔란", "고추", "참깨"], ja: ["鶏もも肉", "五香粉", "醤油", "クミン", "唐辛子", "ゴマ"], en: ["Chicken thigh", "Five-spice", "Soy sauce", "Cumin", "Chili", "Sesame"] }, similarityPercent: 75, matchReason: { ko: "바삭한 닭튀김을 맥주와 곁들이는 공통점", ja: "サクサクの揚げ鶏をビールと合わせる共通点", en: "Crispy fried chicken with beer — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-hotteok",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/seoul-hotteok.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        name: { ko: "호떡", ja: "ホットック", en: "Hotteok" },
        region: "seoul",
        tasteProfile: { sweet: 60, salty: 10, spicy: 5, umami: 20, sour: 5 },
        storyDescription: {
          ko: "이스트로 발효시킨 밀가루 반죽을 기름에 노릇하게 부쳐 흑설탕·계피·견과 속이 녹아 나오는 서울 겨울밤의 길거리 간식이에요. 한 입 베어 물면 달콤한 시럽이 혀를 데울 듯 흘러 나와요.",
          ja: "イーストで発酵させた小麦粉生地を油できつね色に焼き、黒糖・シナモン・ナッツの餡が流れ出るソウルの冬の夜の屋台おやつです。一口かじれば甘いシロップが舌を焦がすように溢れ出します。",
          en: "Yeast-fermented wheat dough fried golden with a molten filling of brown sugar, cinnamon and nuts — Seoul's winter-night street treat. One bite, and sweet syrup flows hot enough to burn your tongue."
        },
        ingredients: { ko: ["밀가루", "이스트", "흑설탕", "계피", "호두", "땅콩", "식용유", "참깨"], ja: ["小麦粉", "イースト", "黒糖", "シナモン", "クルミ", "ピーナッツ", "食用油", "ゴマ"], en: ["Flour", "Yeast", "Brown sugar", "Cinnamon", "Walnut", "Peanut", "Oil", "Sesame"] },
        tags: ["길거리", "겨울", "달콤"],
        dupes: {
          JP: [
        { name: { ko: "이마가와야키", ja: "今川焼き", en: "Imagawayaki" }, tasteProfile: { sweet: 65, salty: 10, spicy: 0, umami: 15, sour: 0 }, description: { ko: "팥소나 커스터드를 넣어 원반 모양으로 구운 일본식 간식", ja: "あんやカスタードを入れて丸く焼いた和菓子", en: "Japanese round pastry with sweet filling" }, ingredients: { ko: ["밀가루", "달걀", "팥소", "설탕", "우유"], ja: ["小麦粉", "卵", "あん", "砂糖", "牛乳"], en: ["Flour", "Egg", "Red bean paste", "Sugar", "Milk"] }, similarityPercent: 75, matchReason: { ko: "반죽에 달콤한 속을 채워 팬에 구워내는 공통점", ja: "生地に甘い餡を入れて焼く共通点", en: "Sweet-filled griddle snack — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "탕 빙", ja: "糖餅", en: "Tang Bing" }, tasteProfile: { sweet: 65, salty: 10, spicy: 0, umami: 15, sour: 0 }, description: { ko: "반죽에 흑설탕·깨·견과를 넣고 구운 중국 북부식 길거리 간식", ja: "生地に黒糖・ゴマ・ナッツを入れて焼く中国北部式屋台おやつ", en: "Northern Chinese street snack of dough stuffed with brown sugar, sesame and nuts" }, ingredients: { ko: ["밀가루", "이스트", "흑설탕", "참깨", "땅콩", "식용유"], ja: ["小麦粉", "イースト", "黒糖", "ゴマ", "ピーナッツ", "食用油"], en: ["Flour", "Yeast", "Brown sugar", "Sesame", "Peanut", "Oil"] }, similarityPercent: 87, matchReason: { ko: "이스트 반죽에 흑설탕·깨·견과를 넣어 기름에 부쳐낸 거의 동일한 요리", ja: "イースト生地に黒糖・ゴマ・ナッツを入れて油で焼くほぼ同じ料理", en: "Sweet-sugar-and-nut street snack — Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-rabokki",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/seoul-rabokki.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-부산관광공사",
        name: { ko: "라볶이", ja: "ラポッキ", en: "Rabokki (Ramen Tteokbokki)" },
        region: "seoul",
        tasteProfile: { sweet: 30, salty: 55, spicy: 75, umami: 65, sour: 5 },
        storyDescription: {
          ko: "쫄깃한 떡과 꼬들꼬들한 라면 사리를 매콤한 고추장 양념에 함께 볶아내는 분식집 스테디셀러예요. 떡과 면을 동시에 즐길 수 있어 어느 쪽도 포기할 필요가 없어요.",
          ja: "もちもちの餅とコシのあるラーメンを辛いコチュジャンダレで一緒に炒める粉食店の定番です。餅と麺を同時に楽しめるのでどちらも諦めなくて済みます。",
          en: "Chewy rice cakes and springy ramen noodles stir-fried together in spicy gochujang sauce — a bunsikjip classic. Noodles and cake side by side, no compromise."
        },
        ingredients: { ko: ["떡", "라면 사리", "고추장", "고춧가루", "설탕", "어묵", "대파", "삶은 달걀"], ja: ["餅", "ラーメン", "コチュジャン", "唐辛子粉", "砂糖", "おでん", "長ネギ", "ゆで卵"], en: ["Rice cake", "Ramen", "Gochujang", "Chili powder", "Sugar", "Fishcake", "Green onion", "Boiled egg"] },
        tags: ["분식", "매운맛", "퓨전"],
        dupes: {
          JP: [
        { name: { ko: "카레 우동 모찌", ja: "カレーうどん・餅", en: "Curry Udon with Mochi" }, tasteProfile: { sweet: 20, salty: 55, spicy: 35, umami: 75, sour: 5 }, description: { ko: "쫄깃한 우동 면과 모찌를 매콤한 카레 국물에 넣어 먹는 일본식 퓨전", ja: "もちもちうどんと餅を辛いカレースープで食べる日本式フュージョン", en: "Japanese fusion of chewy udon and mochi in spicy curry broth" }, ingredients: { ko: ["우동", "모찌", "카레 가루", "간장", "파", "다시"], ja: ["うどん", "餅", "カレー粉", "醤油", "ネギ", "だし"], en: ["Udon", "Mochi", "Curry powder", "Soy sauce", "Green onion", "Dashi"] }, similarityPercent: 68, matchReason: { ko: "쫄깃한 떡과 면을 함께 즐기는 퓨전 요리", ja: "もちもちの餅と麺を一緒に楽しむフュージョン料理", en: "Mochi-udon combo — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "마라 녠가오 면", ja: "麻辣年糕麺", en: "Mala Niangao Noodle" }, tasteProfile: { sweet: 10, salty: 55, spicy: 85, umami: 65, sour: 5 }, description: { ko: "중국식 떡과 면을 마라 양념에 함께 볶은 사천식 퓨전 요리", ja: "中国式の餅と麺を麻辣タレで一緒に炒めた四川式フュージョン料理", en: "Sichuan fusion of Chinese rice cakes and noodles in mala sauce" }, ingredients: { ko: ["가래떡", "밀국수", "두반장", "화자오", "건고추", "대파"], ja: ["餅", "小麦麺", "豆板醤", "花椒", "唐辛子", "長ネギ"], en: ["Rice cake", "Wheat noodles", "Doubanjiang", "Sichuan pepper", "Dried chili", "Green onion"] }, similarityPercent: 85, matchReason: { ko: "떡과 면을 매운 양념에 함께 볶는 거의 동일한 요리", ja: "餅と麺を辛いタレで一緒に炒めるほぼ同じ料理", en: "Rice cake and noodle stir-fry — close Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "seoul-galbi",
        image: "",
        name: { ko: "소갈비", ja: "牛カルビ", en: "Beef Galbi" },
        region: "seoul",
        tasteProfile: { sweet: 45, salty: 55, spicy: 10, umami: 80, sour: 5 },
        storyDescription: {
          ko: "두툼한 소갈비를 배·간장·마늘·참기름 양념에 하루 재워 숯불에 구워낸 서울의 대표 고급 고기 요리예요. 뼈째 드는 한 점이 달콤 짭짤한 추억을 만들어줘요.",
          ja: "厚切りの牛カルビを梨・醤油・ニンニク・ごま油のタレに一日漬けて炭火で焼いたソウルの代表的な高級肉料理です。骨ごと持ち上げる一切れが甘じょっぱい思い出を作ります。",
          en: "Thick-cut short ribs marinated overnight in pear, soy, garlic and sesame oil, then charcoal-grilled — Seoul's signature premium meat. One bone-in bite builds a sweet-salty memory."
        },
        ingredients: { ko: ["소갈비", "간장", "배", "마늘", "참기름", "설탕", "배즙", "생강"], ja: ["牛カルビ", "醤油", "梨", "ニンニク", "ごま油", "砂糖", "梨汁", "生姜"], en: ["Short ribs", "Soy sauce", "Asian pear", "Garlic", "Sesame oil", "Sugar", "Pear juice", "Ginger"] }, tags: ["갈비", "구이", "고급"],
        dupes: {
          JP: [
        { name: { ko: "카루비 야키니쿠", ja: "カルビ焼肉", en: "Karubi Yakiniku" }, tasteProfile: { sweet: 40, salty: 55, spicy: 10, umami: 80, sour: 5 }, description: { ko: "두툼한 소갈비를 간장 양념에 재워 숯불에 구운 일본식 야키니쿠", ja: "厚切り牛カルビを醤油ダレに漬けて炭火で焼いた日本式焼肉", en: "Japanese yakiniku of marinated short ribs charcoal-grilled" }, ingredients: { ko: ["소갈비", "간장", "미림", "설탕", "마늘", "생강"], ja: ["牛カルビ", "醤油", "みりん", "砂糖", "ニンニク", "生姜"], en: ["Short ribs", "Soy sauce", "Mirin", "Sugar", "Garlic", "Ginger"] }, similarityPercent: 88, matchReason: { ko: "달콤 짭짤한 양념 소갈비를 숯불에 굽는 거의 동일한 요리", ja: "甘辛タレの牛カルビを炭火で焼くほぼ同じ料理", en: "Soy-glazed grilled short ribs — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "홍 샤오 파이구", ja: "紅焼排骨", en: "Hong Shao Pai Gu" }, tasteProfile: { sweet: 35, salty: 55, spicy: 15, umami: 80, sour: 5 }, description: { ko: "돼지/소 갈비를 간장·설탕·팔각에 조려낸 중국식 갈비 조림", ja: "豚・牛カルビを醤油・砂糖・八角で煮込む中国式カルビ煮付け", en: "Chinese braised short ribs in soy, sugar and star anise" }, ingredients: { ko: ["소갈비", "간장", "설탕", "팔각", "생강", "대파"], ja: ["牛カルビ", "醤油", "砂糖", "八角", "生姜", "長ネギ"], en: ["Short ribs", "Soy sauce", "Sugar", "Star anise", "Ginger", "Green onion"] }, similarityPercent: 75, matchReason: { ko: "간장 양념 갈비를 조리거나 굽는 방식의 공통점", ja: "醤油ダレのカルビを煮込むか焼く方式の共通点", en: "Soy-braised short ribs — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      }
    ]
  },
  {
    code: "tongyeong",
    name: { ko: "통영", ja: "統営", en: "Tongyeong" },
    icon: "🌊",
    image: "/images/village/tongyeong.jpg",
    description: { ko: "바다의 맛을 품은 남해안의 보석", ja: "海の味を抱く南海岸の宝石", en: "A gem of the southern coast embracing ocean flavors" },
    foods: [
      {
        id: "tongyeong-chungmu-gimbap",
        name: { ko: "충무김밥", ja: "忠武キンパプ", en: "Chungmu Gimbap" },
        region: "tongyeong",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/tongyeong-chungmu-gimbap.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-김효서",
        tasteProfile: { sweet: 10, salty: 55, spicy: 50, umami: 70, sour: 30 },
        storyDescription: {
          ko: "손가락 한 마디만한 작은 김밥이지만 그 짝꿍인 꼴뚜기무침과 깍두기가 함께 오면 이야기가 달라져요. 작은 한 입에 바다 냄새와 매콤함이 함께 터져 나오는 통영만의 자랑이랍니다.",
          ja: "指一節ほどの小さなキンパプですが、相棒のスルメイカの和え物とカクテキが揃うと話が変わります。小さなひと口に海の香りと辛さが一緒に弾ける統営ならではの自慢の一品です。",
          en: "Tiny finger-sized rolls of gimbap, but pair them with their companions — spicy squid salad and kkakdugi — and they become something else entirely. One small bite bursts with sea air and spice; this is Tongyeong's proudest dish."
        },
        ingredients: {
          ko: ["쌀", "김", "꼴뚜기", "깍두기", "고춧가루", "참기름", "소금", "무"],
          ja: ["米", "のり", "スルメイカ", "カクテキ", "唐辛子粉", "ごま油", "塩", "大根"],
          en: ["Rice", "Seaweed", "Squid", "Kkakdugi", "Chili powder", "Sesame oil", "Salt", "Radish"]
        },
        tags: ["김밥", "바다", "매콤"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-kkul-ppang",
        name: { ko: "꿀빵", ja: "蜂蜜パン", en: "Kkul-ppang" },
        region: "tongyeong",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/tongyeong-kkul-ppang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 송재근",
        tasteProfile: { sweet: 80, salty: 15, spicy: 0, umami: 20, sour: 5 },
        storyDescription: {
          ko: "통영 항구 골목에서 오랫동안 사랑받아온 꿀빵은 튀긴 도넛 반죽 안에 달콤한 팥소가 숨어 있어요. 겉은 바삭하고 안은 촉촉한 대비가 한 입마다 새로운 행복을 선물해요.",
          ja: "統営の港の路地で長く愛されてきた蜂蜜パンは、揚げたドーナツ生地の中に甘いあんこが隠れています。外はカリカリで中はしっとりのコントラストが、ひと口ごとに新しい幸せをプレゼントします。",
          en: "Long beloved in the alleys of Tongyeong's harbor, kkul-ppang hides sweet red bean paste inside fried dough. The contrast of crispy outside and moist inside gifts a new little happiness with every bite."
        },
        ingredients: {
          ko: ["밀가루", "팥앙금", "꿀", "설탕", "달걀", "식용유", "이스트"],
          ja: ["小麦粉", "あんこ", "蜂蜜", "砂糖", "卵", "食用油", "イースト"],
          en: ["Flour", "Red bean paste", "Honey", "Sugar", "Egg", "Cooking oil", "Yeast"]
        },
        tags: ["디저트", "달콤", "항구"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-meongge-bibimbap",
        name: { ko: "멍게비빔밥", ja: "ホヤビビンバ", en: "Meongge Bibimbap" },
        region: "tongyeong",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/tongyeong-meongge-bibimbap.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 송재근",
        tasteProfile: { sweet: 10, salty: 55, spicy: 40, umami: 90, sour: 25 },
        storyDescription: {
          ko: "바다의 향기를 가득 품은 멍게를 밥 위에 올리고 쓱쓱 비비면 바다가 통째로 입안으로 들어오는 느낌이에요. 독특한 향과 짙은 바다 맛이 처음에는 낯설지만, 한번 빠지면 헤어 나오기 힘들어요.",
          ja: "海の香りをたっぷり含んだホヤをご飯の上にのせてサッと混ぜると、海がまるごと口に入ってくる感じです。独特の香りと濃い海の味が最初は馴染めないけれど、一度はまったら抜け出せません。",
          en: "Heaping sea squirt onto rice and mixing it feels like the entire ocean pouring into your mouth. The unusual aroma and deep marine flavor can seem strange at first, but once you're hooked, there's no going back."
        },
        ingredients: {
          ko: ["멍게", "밥", "고추장", "참기름", "오이", "당근", "깻잎", "깨소금"],
          ja: ["ホヤ", "ご飯", "コチュジャン", "ごま油", "きゅうり", "人参", "エゴマの葉", "ごま塩"],
          en: ["Sea squirt", "Rice", "Gochujang", "Sesame oil", "Cucumber", "Carrot", "Perilla leaf", "Sesame salt"]
        },
        tags: ["해산물", "비빔밥", "바다"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-oyster-soup",
        name: { ko: "굴국밥", ja: "牡蛎クッパ", en: "Oyster Soup" },
        region: "tongyeong",
        image: "",
        tasteProfile: { sweet: 15, salty: 50, spicy: 20, umami: 95, sour: 10 },
        storyDescription: {
          ko: "통영 바다에서 건져 올린 탱글탱글한 굴이 뜨끈한 국물 속에서 더욱 빛을 발해요. 굴의 진한 바다 향이 국물 전체에 녹아들어 한 국자씩 떠 먹을 때마다 바닷가에 있는 것처럼 편안해져요.",
          ja: "統営の海から引き上げたぷりぷりの牡蛎が温かいスープの中でさらに輝きます。牡蛎の濃い海の香りがスープ全体に溶け込んで、一杓子すくうたびに海辺にいるように心が和みます。",
          en: "Plump oysters plucked from Tongyeong's sea glow even brighter inside a warm broth. The deep marine fragrance of the oysters seeps through the entire soup, and every ladle feels like sitting by the sea."
        },
        ingredients: {
          ko: ["굴", "밥", "콩나물", "대파", "마늘", "소금", "참기름", "후추"],
          ja: ["牡蛎", "ご飯", "もやし", "長ネギ", "ニンニク", "塩", "ごま油", "胡椒"],
          en: ["Oyster", "Rice", "Bean sprouts", "Green onion", "Garlic", "Salt", "Sesame oil", "Pepper"]
        },
        tags: ["굴", "국밥", "바다"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-ujja",
        name: { ko: "우짜", ja: "ウッチャ", en: "Ujja" },
        region: "tongyeong",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/tongyeong-ujja.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 프레임스튜디오",
        tasteProfile: { sweet: 20, salty: 55, spicy: 40, umami: 75, sour: 10 },
        storyDescription: {
          ko: "우동과 짜장의 합성어인 우짜는 통영 사람들이 오래전부터 즐겨 온 퓨전의 원조예요. 부드러운 우동 면에 짜장 소스를 얹은 이 독특한 조합이 한번 먹으면 왜 유명한지 고개가 절로 끄덕여져요.",
          ja: "うどんとジャジャンの合成語であるウッチャは、統営の人々が昔から親しんできたフュージョンの元祖です。やわらかいうどん麺にジャジャンソースをのせたこの独特な組み合わせを一度食べたら、なぜ有名なのかうなずけます。",
          en: "A portmanteau of udon and jjajang, ujja is the original fusion food that Tongyeong locals have loved for generations. Soft udon noodles topped with black bean sauce — taste it once and you will instantly understand its fame."
        },
        ingredients: {
          ko: ["우동면", "춘장", "돼지고기", "양파", "호박", "당근", "전분물", "식용유"],
          ja: ["うどん麺", "チュンジャン", "豚肉", "玉ねぎ", "かぼちゃ", "人参", "片栗粉水", "食用油"],
          en: ["Udon noodles", "Black bean paste", "Pork", "Onion", "Zucchini", "Carrot", "Starch water", "Cooking oil"]
        },
        tags: ["면", "퓨전", "통영"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-sirakguk",
        name: { ko: "시락국", ja: "シラクグク", en: "Sirakguk" },
        region: "tongyeong",
        image: "",
        tasteProfile: { sweet: 10, salty: 50, spicy: 15, umami: 80, sour: 5 },
        storyDescription: {
          ko: "무말랭이를 삶은 뽀얀 국물에 된장을 풀어 만든 통영 어민들의 새벽 밥상이에요. 생선 배 곯으러 바다에 나가기 전, 뜨끈한 시락국 한 사발이 몸과 마음을 함께 데워주었답니다.",
          ja: "乾燥大根を茹でた乳白色のスープに味噌を溶かして作った統営の漁師たちの夜明けの食卓です。魚を求めて海に出る前に、温かいシラクグク一杯が体と心を一緒に温めてくれました。",
          en: "Fishermen's dawn table — white broth from boiled dried radish with doenjang dissolved in. Before heading to sea for the catch, a hot bowl of sirakguk warmed both body and spirit together."
        },
        ingredients: {
          ko: ["무말랭이", "된장", "대파", "마늘", "멸치육수", "고춧가루", "참기름"],
          ja: ["切干大根", "テンジャン", "長ネギ", "ニンニク", "煮干しだし", "唐辛子粉", "ごま油"],
          en: ["Dried radish strips", "Doenjang", "Green onion", "Garlic", "Anchovy broth", "Chili powder", "Sesame oil"]
        },
        tags: ["국", "어민", "된장"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-haemul-ttukbaegi",
        name: { ko: "해물뚝배기", ja: "海鮮トゥッペギ", en: "Haemul Ttukbaegi" },
        region: "tongyeong",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/tongyeong-haemul-ttukbaegi.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
        tasteProfile: { sweet: 10, salty: 55, spicy: 55, umami: 90, sour: 10 },
        storyDescription: {
          ko: "싱싱한 해산물이 가득 든 뚝배기가 테이블에 오를 때의 기대감이란! 해물들이 뿜어내는 진한 바다 향과 매콤한 국물이 어우러져 한 숟가락씩 뜰 때마다 탄성이 절로 나와요.",
          ja: "新鮮な海鮮がたっぷり入った土鍋がテーブルに来る時のわくわく感といったら！海鮮が放つ濃い海の香りとピリ辛なスープが絡み合って、一杓子すくうたびに感嘆の声が自然に出ます。",
          en: "The anticipation when a claypot brimming with fresh seafood arrives at the table is indescribable. The deep ocean fragrance of the shellfish mingles with spicy broth, drawing an involuntary gasp of delight with every spoonful."
        },
        ingredients: {
          ko: ["낙지", "새우", "조개", "꽃게", "두부", "대파", "고춧가루", "마늘"],
          ja: ["タコ", "海老", "貝", "ワタリガニ", "豆腐", "長ネギ", "唐辛子粉", "ニンニク"],
          en: ["Octopus", "Shrimp", "Clams", "Blue crab", "Tofu", "Green onion", "Chili powder", "Garlic"]
        },
        tags: ["해산물", "뚝배기", "얼큰"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-ppaettaegi-juk",
        name: { ko: "빼때기죽", ja: "ッペッテギジュク", en: "Ppaettaegi-juk" },
        region: "tongyeong",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/tongyeong-ppaettaegi-juk.jpeg",
        tasteProfile: { sweet: 45, salty: 20, spicy: 0, umami: 40, sour: 5 },
        storyDescription: {
          ko: "고구마를 썰어 말린 빼때기로 끓인 죽은 통영 할머니들의 가난하던 시절 이야기를 담고 있어요. 달콤하고 구수한 맛이 그 시절의 따뜻한 기억처럼 마음을 포근하게 감싸줍니다.",
          ja: "さつまいもを切って干したッペッテギで炊いたお粥は、統営のおばあちゃんたちの貧しかった頃の物語を宿しています。甘くて香ばしい味が、あの頃の温かい記憶のように心をふんわり包んでくれます。",
          en: "Porridge made from sliced dried sweet potato carries within it the stories of Tongyeong grandmothers from harder times. Its sweet, nutty warmth wraps around your heart just like the warm memories of those days."
        },
        ingredients: {
          ko: ["빼때기(건고구마)", "찹쌀", "물", "소금", "들깨", "콩"],
          ja: ["ッペッテギ（乾燥さつまいも）", "もち米", "水", "塩", "エゴマ", "大豆"],
          en: ["Dried sweet potato", "Glutinous rice", "Water", "Salt", "Perilla", "Soybean"]
        },
        tags: ["죽", "전통", "고구마"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-dacci",
        name: { ko: "다찌 해산물", ja: "ダッチ海鮮", en: "Dacci Seafood" },
        region: "tongyeong",
        image: "",
        tasteProfile: { sweet: 15, salty: 50, spicy: 20, umami: 95, sour: 15 },
        storyDescription: {
          ko: "다찌는 통영의 어시장 선술집에서 술 한 잔과 함께 내오는 신선한 해산물 한상이에요. 오늘 바다에서 건져 올린 것들만 나오는, 메뉴가 없는 즉흥의 미식 경험이랍니다.",
          ja: "ダッチは統営の魚市場の立飲み屋でお酒一杯と共に出される新鮮な海鮮の膳です。今日海から引き上げたものだけが出る、メニューのない即興のグルメ体験です。",
          en: "Dacci is a spread of the day's freshest seafood served alongside a drink at a Tongyeong fish market tavern. Whatever came from the sea today — no menu, pure improvisation — a gourmet experience guided only by the tide."
        },
        ingredients: {
          ko: ["제철 생선회", "굴", "멍게", "새우", "문어", "고등어구이", "된장국"],
          ja: ["旬の刺身", "牡蛎", "ホヤ", "海老", "タコ", "サバ焼き", "テンジャン汁"],
          en: ["Seasonal sashimi", "Oyster", "Sea squirt", "Shrimp", "Octopus", "Grilled mackerel", "Doenjang soup"]
        },
        tags: ["해산물", "오마카세", "술안주"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-dodari-ssuk",
        name: { ko: "도다리쑥국", ja: "ヒラメヨモギスープ", en: "Dodari-ssuk Soup" },
        region: "tongyeong",
        image: "",
        tasteProfile: { sweet: 10, salty: 45, spicy: 10, umami: 85, sour: 5 },
        storyDescription: {
          ko: "봄이 오면 통영 사람들이 가장 먼저 찾는 것이 도다리쑥국이에요. 봄 쑥의 진한 향과 도다리의 담백하고 깨끗한 국물이 만나 봄의 설렘을 그대로 담아낸 계절의 선물이랍니다.",
          ja: "春が来ると統営の人々が真っ先に求めるのがドダリョモギスープです。春ヨモギの濃い香りとヒラメの淡白でクリアなスープが出合って、春の胸のときめきをそのまま映した季節の贈り物です。",
          en: "When spring arrives, dodari-ssuk soup is the first thing Tongyeong locals seek out. The intense fragrance of spring mugwort meeting the clean, delicate broth of flounder is a seasonal gift — bottled springtime excitement in a bowl."
        },
        ingredients: {
          ko: ["도다리", "쑥", "된장", "대파", "마늘", "생강", "소금"],
          ja: ["ヒラメ", "ヨモギ", "テンジャン", "長ネギ", "ニンニク", "生姜", "塩"],
          en: ["Flounder", "Mugwort", "Doenjang", "Green onion", "Garlic", "Ginger", "Salt"]
        },
        tags: ["봄", "생선", "쑥"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-gulbap",
        image: "",
        name: { ko: "굴밥", ja: "牡蠣ご飯", en: "Gulbap (Oyster Rice)" },
        region: "tongyeong",
        tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 85, sour: 5 },
        storyDescription: {
          ko: "남해안에서 갓 딴 통통한 생굴을 쌀 위에 듬뿍 올려 참기름·간장과 함께 돌솥에 지어낸 통영의 바다 밥이에요. 한 숟갈에 굴의 뽀얀 바다 향이 밥알 하나하나에 스며 있어요.",
          ja: "南海岸で採れたばかりのふっくら生牡蠣を米の上にたっぷりのせ、ごま油・醤油と共に石釜で炊いた統営の海のご飯です。一さじに牡蠣の白く香る海の香りが米粒一つひとつに染みています。",
          en: "Plump oysters freshly harvested from the southern coast piled over rice and cooked in a stone pot with sesame oil and soy sauce — Tongyeong's oceanic rice. One spoonful, and the milky sea fragrance has soaked every grain."
        },
        ingredients: { ko: ["굴", "쌀", "무", "당근", "표고버섯", "참기름", "간장", "대파"], ja: ["牡蠣", "米", "大根", "人参", "椎茸", "ごま油", "醤油", "長ネギ"], en: ["Oyster", "Rice", "Radish", "Carrot", "Shiitake", "Sesame oil", "Soy sauce", "Green onion"] },
        tags: ["굴", "솥밥", "바다"],
        dupes: {
          JP: [
        { name: { ko: "카키 고한", ja: "牡蠣ご飯", en: "Kaki Gohan" }, tasteProfile: { sweet: 10, salty: 45, spicy: 0, umami: 85, sour: 5 }, description: { ko: "굴을 간장·미림으로 양념해 쌀과 함께 지어낸 일본식 굴 솥밥", ja: "牡蠣を醤油・みりんで味付けて米と共に炊いた日本式牡蠣ご飯", en: "Japanese stone-pot rice cooked with oysters, soy sauce and mirin" }, ingredients: { ko: ["굴", "쌀", "간장", "미림", "생강", "파"], ja: ["牡蠣", "米", "醤油", "みりん", "生姜", "ネギ"], en: ["Oyster", "Rice", "Soy sauce", "Mirin", "Ginger", "Green onion"] }, similarityPercent: 88, matchReason: { ko: "굴과 쌀을 함께 지어 감칠맛을 살린 거의 동일한 요리", ja: "牡蠣と米を一緒に炊いて旨味を生かすほぼ同じ料理", en: "Oyster rice pot — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "무 리 판", ja: "牡蠣飯", en: "Mu Li Fan" }, tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 85, sour: 5 }, description: { ko: "굴과 쌀을 함께 지어내는 중국 남부 연안식 굴 솥밥", ja: "牡蠣と米を一緒に炊く中国南部沿岸式の牡蠣ご飯", en: "Southern Chinese coastal oyster rice cooked in a pot" }, ingredients: { ko: ["굴", "쌀", "간장", "생강", "참기름", "대파"], ja: ["牡蠣", "米", "醤油", "生姜", "ごま油", "長ネギ"], en: ["Oyster", "Rice", "Soy sauce", "Ginger", "Sesame oil", "Green onion"] }, similarityPercent: 85, matchReason: { ko: "굴과 쌀을 한 솥에 지어내는 거의 동일한 전통", ja: "牡蠣と米を一鍋で炊くほぼ同じ伝統", en: "Oyster rice pot — Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-haemul-tang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/tongyeong-haemul-tang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "해물탕", ja: "海鮮スープ", en: "Haemul Tang (Seafood Hot Pot)" },
        region: "tongyeong",
        tasteProfile: { sweet: 10, salty: 55, spicy: 55, umami: 85, sour: 5 },
        storyDescription: {
          ko: "꽃게·문어·홍합·새우를 가득 넣고 매운 양념에 끓여낸 통영의 바다 끓이기예요. 국물 한 모금에 남해안의 바람과 소금 내음이 통째로 담겨 있어요.",
          ja: "ワタリガニ・タコ・ムール貝・エビをたっぷり入れて辛いタレで煮込んだ統営の海の鍋です。スープ一口に南海岸の風と塩の香りが丸ごと詰まっています。",
          en: "Blue crab, octopus, mussels and shrimp all piled into a fiery broth — Tongyeong's ocean in a pot. Each sip captures the southern coast's wind and saltwater whole."
        },
        ingredients: { ko: ["꽃게", "문어", "홍합", "새우", "콩나물", "미나리", "고춧가루", "마늘"], ja: ["ワタリガニ", "タコ", "ムール貝", "エビ", "もやし", "セリ", "唐辛子粉", "ニンニク"], en: ["Blue crab", "Octopus", "Mussel", "Shrimp", "Bean sprouts", "Dropwort", "Chili powder", "Garlic"] },
        tags: ["해물", "매운탕", "남해"],
        dupes: {
          JP: [
        { name: { ko: "카이센 나베 피리카라", ja: "海鮮鍋・ピリ辛", en: "Spicy Kaisen Nabe" }, tasteProfile: { sweet: 10, salty: 55, spicy: 40, umami: 85, sour: 5 }, description: { ko: "다양한 해산물을 매운 미소 국물에 끓인 일본식 매운 해물 전골", ja: "様々な海鮮を辛い味噌スープで煮込む日本式辛口海鮮鍋", en: "Japanese spicy miso seafood hot pot" }, ingredients: { ko: ["게", "새우", "조개", "배추", "매운 미소", "대파"], ja: ["カニ", "エビ", "貝", "白菜", "辛い味噌", "長ネギ"], en: ["Crab", "Shrimp", "Clam", "Napa cabbage", "Spicy miso", "Green onion"] }, similarityPercent: 78, matchReason: { ko: "다양한 해산물을 매운 국물에 한 냄비에 끓이는 거의 동일한 요리", ja: "様々な海鮮を辛いスープで一鍋に煮込むほぼ同じ料理", en: "Spicy seafood hot pot — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "마라 하이셴 훠궈", ja: "麻辣海鮮火鍋", en: "Mala Seafood Huo Guo" }, tasteProfile: { sweet: 5, salty: 55, spicy: 80, umami: 85, sour: 5 }, description: { ko: "다양한 해산물을 마라 국물에 끓여 먹는 중국 사천식 해물 훠궈", ja: "様々な海鮮を麻辣スープで煮込む中国四川式海鮮火鍋", en: "Sichuan mala seafood hot pot" }, ingredients: { ko: ["새우", "오징어", "게", "화자오", "두반장", "건고추"], ja: ["エビ", "イカ", "カニ", "花椒", "豆板醤", "唐辛子"], en: ["Shrimp", "Squid", "Crab", "Sichuan pepper", "Doubanjiang", "Dried chili"] }, similarityPercent: 82, matchReason: { ko: "해산물을 매운 국물에 끓여내는 거의 동일한 요리", ja: "海鮮を辛いスープで煮込むほぼ同じ料理", en: "Mala seafood hot pot — close Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-jangeo-gui",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/tongyeong-jangeo-gui.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        name: { ko: "장어구이", ja: "ウナギ焼き", en: "Jangeo Gui (Grilled Eel)" },
        region: "tongyeong",
        tasteProfile: { sweet: 30, salty: 55, spicy: 10, umami: 90, sour: 5 },
        storyDescription: {
          ko: "남해안에서 잡은 통통한 장어에 간장·고추장·생강 양념을 발라 숯불에 노릇하게 구워낸 통영의 보양식이에요. 쫄깃한 식감과 달짝지근한 양념이 여름철 힘을 보충해줘요.",
          ja: "南海岸で獲れたふっくらしたウナギに醤油・コチュジャン・生姜のタレを塗って炭火できつね色に焼いた統営の滋養料理です。プリプリの食感と甘じょっぱいタレが夏の力を補充してくれます。",
          en: "Plump eels from the southern coast brushed with soy, gochujang and ginger glaze and charcoal-grilled until golden — Tongyeong's stamina food. Chewy flesh and sweet-savory glaze recharge summer-weary bodies."
        },
        ingredients: { ko: ["민물장어", "간장", "고추장", "생강", "마늘", "참기름", "꿀", "산초"], ja: ["川ウナギ", "醤油", "コチュジャン", "生姜", "ニンニク", "ごま油", "ハチミツ", "山椒"], en: ["River eel", "Soy sauce", "Gochujang", "Ginger", "Garlic", "Sesame oil", "Honey", "Sichuan pepper"] },
        tags: ["장어", "보양식", "숯불"],
        dupes: {
          JP: [
        { name: { ko: "우나기 가바야키", ja: "鰻の蒲焼", en: "Unagi Kabayaki" }, tasteProfile: { sweet: 40, salty: 55, spicy: 5, umami: 90, sour: 5 }, description: { ko: "장어에 달콤 짭짤한 타레를 반복해 발라 숯불에 구운 일본 정통 장어구이", ja: "ウナギに甘辛いタレを何度も絡めて炭火で焼いた日本伝統のウナギ蒲焼", en: "Japanese classic grilled eel with repeated sweet-savory tare glaze" }, ingredients: { ko: ["장어", "간장", "미림", "설탕", "산초", "밥"], ja: ["ウナギ", "醤油", "みりん", "砂糖", "山椒", "ご飯"], en: ["Eel", "Soy sauce", "Mirin", "Sugar", "Sansho", "Rice"] }, similarityPercent: 88, matchReason: { ko: "장어를 달콤 짭짤한 타레에 반복 발라 숯불에 굽는 거의 동일한 요리", ja: "ウナギを甘辛いタレに繰り返し絡めて炭火で焼くほぼ同じ料理", en: "Charcoal-grilled glazed eel — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "만위 카오", ja: "鰻魚烤", en: "Manyu Kao" }, tasteProfile: { sweet: 25, salty: 55, spicy: 20, umami: 85, sour: 5 }, description: { ko: "장어를 간장·쯔란으로 양념해 숯불에 구운 중국 동북식 장어구이", ja: "ウナギを醤油・クミンで味付けて炭火で焼いた中国東北式ウナギ焼き", en: "Northeastern Chinese grilled eel with soy and cumin glaze" }, ingredients: { ko: ["장어", "간장", "쯔란", "고춧가루", "마늘", "참기름"], ja: ["ウナギ", "醤油", "クミン", "唐辛子粉", "ニンニク", "ごま油"], en: ["Eel", "Soy sauce", "Cumin", "Chili powder", "Garlic", "Sesame oil"] }, similarityPercent: 75, matchReason: { ko: "장어를 간장 양념에 숯불에 구워 먹는 공통점", ja: "ウナギを醤油タレで炭火焼きにする共通点", en: "Soy-glazed grilled eel — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-jeonbok-gui",
        image: "",
        name: { ko: "전복구이", ja: "アワビ焼き", en: "Jeonbok Gui (Grilled Abalone)" },
        region: "tongyeong",
        tasteProfile: { sweet: 15, salty: 50, spicy: 10, umami: 90, sour: 5 },
        storyDescription: {
          ko: "살아있는 통영 전복을 껍질째 숯불에 올려 간장·버터·마늘을 발라가며 구워낸 고급 요리예요. 한 점 입에 넣으면 쫄깃한 살과 고소한 내장이 바다를 그대로 담아내요.",
          ja: "生きた統営のアワビを殻ごと炭火にのせ、醤油・バター・ニンニクを塗りながら焼いた高級料理です。一切れを口に入れればプリプリの身と香ばしい内臓が海そのものを運んできます。",
          en: "Live Tongyeong abalones grilled in their shells over charcoal, basted with soy, butter and garlic — a luxury dish. One bite of chewy flesh and rich liver captures the whole sea at once."
        },
        ingredients: { ko: ["전복", "간장", "버터", "마늘", "참기름", "대파", "후추", "레몬"], ja: ["アワビ", "醤油", "バター", "ニンニク", "ごま油", "長ネギ", "胡椒", "レモン"], en: ["Abalone", "Soy sauce", "Butter", "Garlic", "Sesame oil", "Green onion", "Pepper", "Lemon"] },
        tags: ["전복", "구이", "고급"],
        dupes: {
          JP: [
        { name: { ko: "아와비 스테이크", ja: "鮑ステーキ", en: "Awabi Steak" }, tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 90, sour: 5 }, description: { ko: "전복을 버터·간장에 철판에서 구워낸 일본식 전복 스테이크", ja: "アワビをバター・醤油で鉄板焼きにした日本式アワビステーキ", en: "Japanese abalone steak cooked on hot plate with butter and soy" }, ingredients: { ko: ["전복", "버터", "간장", "사케", "마늘", "파"], ja: ["アワビ", "バター", "醤油", "日本酒", "ニンニク", "ネギ"], en: ["Abalone", "Butter", "Soy sauce", "Sake", "Garlic", "Green onion"] }, similarityPercent: 88, matchReason: { ko: "전복을 간장 버터에 구워내는 거의 동일한 요리", ja: "アワビを醤油バターで焼くほぼ同じ料理", en: "Butter-soy abalone — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "샤오 바오위", ja: "烤鮑魚", en: "Kao Bao Yu" }, tasteProfile: { sweet: 15, salty: 55, spicy: 10, umami: 90, sour: 5 }, description: { ko: "전복을 마늘·참기름에 재워 숯불에 구운 중국 연안식 전복구이", ja: "アワビをニンニク・ごま油で漬けて炭火で焼いた中国沿岸式アワビ焼き", en: "Chinese coastal grilled abalone with garlic-sesame oil" }, ingredients: { ko: ["전복", "마늘", "참기름", "간장", "대파", "생강"], ja: ["アワビ", "ニンニク", "ごま油", "醤油", "長ネギ", "生姜"], en: ["Abalone", "Garlic", "Sesame oil", "Soy sauce", "Green onion", "Ginger"] }, similarityPercent: 83, matchReason: { ko: "전복을 마늘·참기름에 숯불에 구워내는 거의 동일한 요리", ja: "アワビをニンニク・ごま油で炭火焼きにするほぼ同じ料理", en: "Garlic-grilled abalone — Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-mulmegi-tang",
        image: "",
        name: { ko: "물메기탕", ja: "ムルメギ鍋", en: "Mulmegi Tang (Snailfish Soup)" },
        region: "tongyeong",
        tasteProfile: { sweet: 10, salty: 55, spicy: 30, umami: 85, sour: 5 },
        storyDescription: {
          ko: "겨울 남해의 별미 물메기를 무·콩나물·미나리와 함께 맑게 끓여낸 통영식 해물 국물이에요. 살이 녹아들 듯 부드럽고 얼큰한 국물은 겨울 감기도 쫓아내요.",
          ja: "冬の南海の逸品ムルメギを大根・もやし・セリと共に澄んだスープで煮込む統営式の海鮮スープです。身がとろけるように柔らかく、ピリ辛のスープは冬の風邪も追い払います。",
          en: "A Tongyeong winter delicacy — snailfish simmered clear with radish, bean sprouts and dropwort. Its melt-in-mouth flesh and lightly spicy broth chase away even winter colds."
        },
        ingredients: { ko: ["물메기", "무", "콩나물", "미나리", "고춧가루", "마늘", "대파", "멸치 육수"], ja: ["ムルメギ", "大根", "もやし", "セリ", "唐辛子粉", "ニンニク", "長ネギ", "煮干しだし"], en: ["Snailfish", "Radish", "Bean sprouts", "Dropwort", "Chili powder", "Garlic", "Green onion", "Anchovy broth"] },
        tags: ["해물탕", "겨울", "남해"],
        dupes: {
          JP: [
        { name: { ko: "쿠엣 나베", ja: "クエット鍋", en: "Kue Nabe" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 85, sour: 5 }, description: { ko: "부드러운 흰살 생선과 채소를 맑은 다시에 끓여낸 일본 겨울 전골", ja: "柔らかい白身魚と野菜を澄んだだしで煮込んだ日本の冬の鍋", en: "Japanese winter hot pot of tender white fish and vegetables in clear dashi" }, ingredients: { ko: ["흰살 생선", "배추", "두부", "미소", "폰즈", "파"], ja: ["白身魚", "白菜", "豆腐", "味噌", "ポン酢", "ネギ"], en: ["White fish", "Napa cabbage", "Tofu", "Miso", "Ponzu", "Green onion"] }, similarityPercent: 80, matchReason: { ko: "부드러운 흰살 생선을 맑은 국물에 끓이는 거의 동일한 요리", ja: "柔らかい白身魚を澄んだスープで煮込むほぼ同じ料理", en: "Tender fish hot pot — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "시엔 유 탕", ja: "鮮魚湯", en: "Xian Yu Tang" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 85, sour: 5 }, description: { ko: "흰살 생선을 생강·대파와 맑게 끓여낸 광둥식 생선 맑은탕", ja: "白身魚を生姜・長ネギで澄んだスープに仕上げる広東式魚の澄まし汁", en: "Cantonese clear fish soup with ginger and scallion" }, ingredients: { ko: ["흰살 생선", "생강", "대파", "간장", "참기름", "백후추"], ja: ["白身魚", "生姜", "長ネギ", "醤油", "ごま油", "白胡椒"], en: ["White fish", "Ginger", "Green onion", "Soy sauce", "Sesame oil", "White pepper"] }, similarityPercent: 80, matchReason: { ko: "부드러운 생선을 맑은 국물에 끓이는 공통 요리법", ja: "柔らかい魚を澄んだスープで煮込む共通の調理法", en: "Clear fish soup — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-pi-kkomak",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/tongyeong-pi-kkomak.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        name: { ko: "피꼬막", ja: "ピッコマッ（血蛤）", en: "Pi Kkomak (Blood Cockles)" },
        region: "tongyeong",
        tasteProfile: { sweet: 10, salty: 55, spicy: 30, umami: 85, sour: 15 },
        storyDescription: {
          ko: "남해안 통영의 피꼬막을 살짝 데쳐 간장 양념에 무쳐내거나 그대로 초고추장에 찍어 먹는 제철 별미예요. 살짝 씹으면 붉은 피와 함께 달달한 바다 향이 입 안을 가득 채워요.",
          ja: "南海岸統営の血蛤を軽く茹でて醤油ダレで和えるかそのまま酢コチュジャンにつけて食べる旬の逸品です。軽く噛めば赤い血と共に甘い海の香りが口の中を満たします。",
          en: "Blood cockles from Tongyeong's southern coast, blanched and dressed in soy sauce or dipped raw in vinegared gochujang — a seasonal treat. One gentle bite releases red blood and sweet sea fragrance into your mouth."
        },
        ingredients: { ko: ["피꼬막", "간장", "고추장", "식초", "참기름", "다진 마늘", "쪽파", "고춧가루"], ja: ["血蛤", "醤油", "コチュジャン", "酢", "ごま油", "刻みニンニク", "青ネギ", "唐辛子粉"], en: ["Blood cockle", "Soy sauce", "Gochujang", "Vinegar", "Sesame oil", "Minced garlic", "Green onion", "Chili powder"] },
        tags: ["꼬막", "초고추장", "별미"],
        dupes: {
          JP: [
        { name: { ko: "아카가이 사시미", ja: "赤貝刺身", en: "Akagai Sashimi" }, tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 85, sour: 15 }, description: { ko: "아카가이를 얇게 떠 간장·와사비에 찍어 먹는 일본 초밥집의 고급 별미", ja: "赤貝を薄切りにして醤油・わさびで食べる日本の寿司屋の高級料理", en: "Japanese sushi-grade sliced ark shell with soy and wasabi" }, ingredients: { ko: ["아카가이", "간장", "와사비", "김", "생강초", "레몬"], ja: ["赤貝", "醤油", "わさび", "海苔", "ガリ", "レモン"], en: ["Ark clam", "Soy sauce", "Wasabi", "Nori", "Pickled ginger", "Lemon"] }, similarityPercent: 88, matchReason: { ko: "붉은 꼬막을 생으로 얇게 썰어 간장에 찍어 먹는 거의 동일한 요리", ja: "赤い赤貝を生で薄く切って醤油で食べるほぼ同じ料理", en: "Raw ark clam sliced with soy — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "시에 거 샹", ja: "血蛤涼拌", en: "Xie Ge Xiang" }, tasteProfile: { sweet: 10, salty: 55, spicy: 35, umami: 80, sour: 15 }, description: { ko: "피꼬막을 생으로 매운 간장·식초 양념에 무쳐낸 중국 남부식 꼬막 무침", ja: "血蛤を生で辛い醤油・酢のタレで和えた中国南部式血蛤和え", en: "Southern Chinese raw blood cockle dressed in spicy soy-vinegar" }, ingredients: { ko: ["피꼬막", "간장", "식초", "고추", "마늘", "생강"], ja: ["血蛤", "醤油", "酢", "唐辛子", "ニンニク", "生姜"], en: ["Blood cockle", "Soy sauce", "Vinegar", "Chili", "Garlic", "Ginger"] }, similarityPercent: 85, matchReason: { ko: "피꼬막을 생으로 매운 간장 양념에 무치는 거의 동일한 요리", ja: "血蛤を生で辛い醤油ダレで和えるほぼ同じ料理", en: "Raw blood cockle dressed in spicy soy — Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-bajirak-kalguksu",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/tongyeong-bajirak-kalguksu.jpeg",
        name: { ko: "바지락칼국수", ja: "アサリカルグクス", en: "Bajirak Kalguksu" },
        region: "tongyeong",
        tasteProfile: { sweet: 10, salty: 50, spicy: 10, umami: 85, sour: 5 },
        storyDescription: {
          ko: "남해 바지락을 가득 넣고 우린 시원한 국물에 직접 뽑은 칼국수 면을 끓여낸 통영식 국수예요. 국물 한 모금에 남해 갯벌의 시원함이 통째로 퍼져요.",
          ja: "南海のアサリをたっぷり入れて煮出したすっきりスープに手打ちカルグクス麺を煮た統営式の麺です。スープ一口に南海の干潟のすっきりさが丸ごと広がります。",
          en: "Southern-sea clams steeped into a clean broth and simmered with hand-cut knife noodles — Tongyeong's version. One sip spreads the fresh breeze of southern tidal flats."
        },
        ingredients: { ko: ["바지락", "칼국수 면", "애호박", "감자", "다진 마늘", "대파", "간장", "멸치 육수"], ja: ["アサリ", "カルグクス麺", "ズッキーニ", "ジャガイモ", "刻みニンニク", "長ネギ", "醤油", "煮干しだし"], en: ["Manila clam", "Knife noodles", "Zucchini", "Potato", "Minced garlic", "Green onion", "Soy sauce", "Anchovy broth"] },
        tags: ["칼국수", "조개", "남해"],
        dupes: {
          JP: [
        { name: { ko: "아사리 우동", ja: "あさりうどん", en: "Asari Udon" }, tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 85, sour: 5 }, description: { ko: "바지락을 다시에 우려낸 국물에 우동을 말아 먹는 일본식 바지락 우동", ja: "アサリをだしで煮出したスープにうどんを入れた日本式あさりうどん", en: "Japanese udon in clam-dashi broth" }, ingredients: { ko: ["우동", "바지락", "다시마", "간장", "미림", "파"], ja: ["うどん", "アサリ", "昆布", "醤油", "みりん", "ネギ"], en: ["Udon", "Manila clam", "Kelp", "Soy sauce", "Mirin", "Green onion"] }, similarityPercent: 85, matchReason: { ko: "바지락으로 우린 국물에 국수를 말아 먹는 거의 동일한 요리", ja: "アサリで煮出したスープに麺を入れるほぼ同じ料理", en: "Clam broth noodle — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "거리 탕미엔", ja: "蛤蜊湯麺", en: "Geli Tangmian" }, tasteProfile: { sweet: 5, salty: 55, spicy: 5, umami: 85, sour: 5 }, description: { ko: "바지락 국물에 밀국수를 끓여낸 상하이식 해물 국수", ja: "アサリのスープで小麦麺を煮込んだ上海式海鮮麺", en: "Shanghai wheat noodle soup in clam broth" }, ingredients: { ko: ["밀국수", "바지락", "생강", "대파", "간장", "참기름"], ja: ["小麦麺", "アサリ", "生姜", "長ネギ", "醤油", "ごま油"], en: ["Wheat noodles", "Manila clam", "Ginger", "Green onion", "Soy sauce", "Sesame oil"] }, similarityPercent: 83, matchReason: { ko: "바지락 국물에 면을 말아 먹는 거의 동일한 요리", ja: "アサリのスープに麺を入れるほぼ同じ料理", en: "Clam noodle soup — Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-saengseon-hoe-jeongsik",
        image: "",
        name: { ko: "생선회 정식", ja: "刺身定食", en: "Saengseon Hoe Jeongsik" },
        region: "tongyeong",
        tasteProfile: { sweet: 10, salty: 50, spicy: 20, umami: 80, sour: 15 },
        storyDescription: {
          ko: "남해에서 잡아 올린 자연산 광어·우럭·도다리를 얇게 썰어 각종 반찬과 함께 상차림으로 내는 통영의 정식이에요. 한 상 가득한 바다의 선물을 한 번에 맛볼 수 있어요.",
          ja: "南海で獲れた天然のヒラメ・ウロク・カレイを薄く切って各種おかずと共に膳立てする統営の定食です。一膳にいっぱいの海の贈り物を一度に味わえます。",
          en: "Wild flounder, rockfish and flatfish caught in the southern sea, sliced thin and served with assorted banchan — Tongyeong's full-course platter. A tableful of the sea's gifts, tasted all at once."
        },
        ingredients: { ko: ["광어", "우럭", "도다리", "상추", "깻잎", "쌈장", "초고추장", "된장찌개"], ja: ["ヒラメ", "ウロク", "カレイ", "サンチュ", "エゴマの葉", "サムジャン", "酢コチュジャン", "味噌チゲ"], en: ["Flounder", "Rockfish", "Flatfish", "Lettuce", "Perilla leaf", "Ssamjang", "Chojang", "Doenjang stew"] },
        tags: ["회", "정식", "남해"],
        dupes: {
          JP: [
        { name: { ko: "사시미 테이쇼쿠", ja: "刺身定食", en: "Sashimi Teishoku" }, tasteProfile: { sweet: 5, salty: 50, spicy: 5, umami: 80, sour: 15 }, description: { ko: "여러 생선회를 국·밥·반찬과 함께 내는 일본 정식", ja: "様々な刺身をご飯・汁・おかずと共に出す日本定食", en: "Japanese assorted sashimi set with rice, soup and sides" }, ingredients: { ko: ["참치", "연어", "방어", "간장", "와사비", "밥"], ja: ["マグロ", "サーモン", "ハマチ", "醤油", "わさび", "ご飯"], en: ["Tuna", "Salmon", "Yellowtail", "Soy sauce", "Wasabi", "Rice"] }, similarityPercent: 87, matchReason: { ko: "신선한 회를 밥·국·반찬과 함께 정식으로 내는 거의 동일한 구조", ja: "新鮮な刺身をご飯・汁・おかずと定食として出すほぼ同じ構造", en: "Sashimi teishoku — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "위 셩 세트", ja: "魚生セット", en: "Yu Sheng Set" }, tasteProfile: { sweet: 15, salty: 50, spicy: 15, umami: 75, sour: 25 }, description: { ko: "여러 종류의 회를 채소와 함께 섞어 먹는 중국 남부식 회 세트", ja: "様々な刺身を野菜と混ぜて食べる中国南部式刺身セット", en: "Southern Chinese raw fish platter mixed with vegetables" }, ingredients: { ko: ["회", "당근", "무", "땅콩", "매실장", "생강"], ja: ["刺身", "人参", "大根", "ピーナッツ", "梅醤", "生姜"], en: ["Sashimi", "Carrot", "Daikon", "Peanut", "Plum sauce", "Ginger"] }, similarityPercent: 75, matchReason: { ko: "회와 반찬을 함께 내는 상차림 구조", ja: "刺身とおかずを一緒に出す膳立て構造", en: "Raw fish platter — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-haemul-japtang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/tongyeong-haemul-japtang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "해물잡탕", ja: "海鮮チャプタン", en: "Haemul Japtang (Mixed Seafood Stew)" },
        region: "tongyeong",
        tasteProfile: { sweet: 15, salty: 55, spicy: 60, umami: 85, sour: 10 },
        storyDescription: {
          ko: "그 날 잡은 온갖 해물을 한 냄비에 모아 얼큰한 양념으로 끓여낸 통영 어부식 탕이에요. 국물에 녹아든 조개·게·오징어의 감칠맛이 한 숟갈에 폭발해요.",
          ja: "その日獲れたあらゆる海鮮を一鍋に集めてピリ辛タレで煮込む統営の漁師鍋です。スープに溶け込んだ貝・カニ・イカの旨味が一さじで弾けます。",
          en: "All the day's catch gathered into one fiery pot — Tongyeong's fisherman stew. The umami of clams, crab and squid dissolving into the broth explodes in every spoonful."
        },
        ingredients: { ko: ["꽃게", "조개", "오징어", "새우", "콩나물", "미나리", "고춧가루", "다진 마늘"], ja: ["ワタリガニ", "貝", "イカ", "エビ", "もやし", "セリ", "唐辛子粉", "刻みニンニク"], en: ["Blue crab", "Clam", "Squid", "Shrimp", "Bean sprouts", "Dropwort", "Chili powder", "Minced garlic"] },
        tags: ["해물", "매운탕", "어부식"],
        dupes: {
          JP: [
        { name: { ko: "요세나베", ja: "寄せ鍋", en: "Yosenabe" }, tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 85, sour: 5 }, description: { ko: "여러 해산물과 고기·채소를 한 냄비에 끓여 먹는 일본식 모듬 전골", ja: "様々な海鮮と肉・野菜を一鍋で煮込む日本式寄せ鍋", en: "Japanese hot pot combining various seafood, meat and vegetables" }, ingredients: { ko: ["게", "조개", "오징어", "배추", "두부", "간장"], ja: ["カニ", "貝", "イカ", "白菜", "豆腐", "醤油"], en: ["Crab", "Clam", "Squid", "Napa cabbage", "Tofu", "Soy sauce"] }, similarityPercent: 80, matchReason: { ko: "여러 해산물을 한 냄비에 모아 끓여내는 거의 동일한 요리", ja: "様々な海鮮を一鍋で煮込むほぼ同じ料理", en: "Mixed seafood hot pot — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "하이셴 훠궈", ja: "海鮮火鍋", en: "Haixian Huo Guo" }, tasteProfile: { sweet: 10, salty: 55, spicy: 65, umami: 85, sour: 5 }, description: { ko: "여러 해산물을 마라 또는 맑은 국물에 한 냄비에 끓여 먹는 중국식 훠궈", ja: "様々な海鮮を麻辣または澄んだスープで一鍋で煮込む中国式火鍋", en: "Chinese seafood hot pot in mala or clear broth" }, ingredients: { ko: ["새우", "오징어", "게", "두반장", "화자오", "배추"], ja: ["エビ", "イカ", "カニ", "豆板醤", "花椒", "白菜"], en: ["Shrimp", "Squid", "Crab", "Doubanjiang", "Sichuan pepper", "Napa cabbage"] }, similarityPercent: 82, matchReason: { ko: "여러 해산물을 매운 국물에 한 냄비에 끓이는 거의 동일한 요리", ja: "様々な海鮮を辛いスープで一鍋で煮込むほぼ同じ料理", en: "Seafood hot pot — close Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-honghap-tang",
        image: "",
        name: { ko: "홍합탕", ja: "ムール貝スープ", en: "Honghap Tang (Mussel Soup)" },
        region: "tongyeong",
        tasteProfile: { sweet: 10, salty: 50, spicy: 15, umami: 85, sour: 5 },
        storyDescription: {
          ko: "살아있는 홍합을 대파·마늘·청양고추와 함께 맑고 시원하게 끓여낸 통영의 주점 단골 안주예요. 국물 한 모금이면 바다 향이 혀끝을 간지럽혀요.",
          ja: "生きたムール貝を長ネギ・ニンニク・青唐辛子と共に澄んだスープで煮込む統営の居酒屋の定番おつまみです。スープ一口で海の香りが舌先をくすぐります。",
          en: "Live mussels simmered clean with scallion, garlic and green chili — Tongyeong's izakaya staple. One sip, and the ocean tickles your tongue."
        },
        ingredients: { ko: ["홍합", "대파", "마늘", "청양고추", "무", "멸치 육수", "간장", "후추"], ja: ["ムール貝", "長ネギ", "ニンニク", "青唐辛子", "大根", "煮干しだし", "醤油", "胡椒"], en: ["Mussel", "Green onion", "Garlic", "Green chili", "Radish", "Anchovy broth", "Soy sauce", "Pepper"] },
        tags: ["홍합", "맑은탕", "안주"],
        dupes: {
          JP: [
        { name: { ko: "무르 가이노 사카무시", ja: "ムール貝の酒蒸し", en: "Mussel Sakamushi" }, tasteProfile: { sweet: 5, salty: 50, spicy: 5, umami: 85, sour: 10 }, description: { ko: "홍합을 청주에 쪄낸 일본식 홍합 사케 찜", ja: "ムール貝を日本酒で蒸した日本式酒蒸し", en: "Japanese mussels steamed in sake" }, ingredients: { ko: ["홍합", "사케", "간장", "생강", "파", "버터"], ja: ["ムール貝", "日本酒", "醤油", "生姜", "ネギ", "バター"], en: ["Mussel", "Sake", "Soy sauce", "Ginger", "Green onion", "Butter"] }, similarityPercent: 80, matchReason: { ko: "홍합을 맑은 술과 간장에 쪄서 즐기는 거의 동일한 요리", ja: "ムール貝を澄んだ酒と醤油で蒸すほぼ同じ料理", en: "Sake-steamed mussel — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "칭단 무이기", ja: "清蒸貽貝", en: "Qing Zheng Yi Bei" }, tasteProfile: { sweet: 5, salty: 55, spicy: 10, umami: 85, sour: 5 }, description: { ko: "홍합을 생강·대파·간장에 맑게 찐 중국식 홍합 요리", ja: "ムール貝を生姜・長ネギ・醤油で澄んだ蒸し料理にする中国式ムール貝料理", en: "Chinese steamed mussels with ginger, scallion and soy" }, ingredients: { ko: ["홍합", "생강", "대파", "간장", "참기름", "고추"], ja: ["ムール貝", "生姜", "長ネギ", "醤油", "ごま油", "唐辛子"], en: ["Mussel", "Ginger", "Green onion", "Soy sauce", "Sesame oil", "Chili"] }, similarityPercent: 82, matchReason: { ko: "홍합을 맑게 찌거나 끓여 먹는 아시아 해안식 공통점", ja: "ムール貝を澄んだ蒸しや煮物で食べるアジア海岸式共通点", en: "Steamed mussel — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-mideodeok-jjim",
        image: "",
        name: { ko: "미더덕찜", ja: "ミドドッチム", en: "Mideodeok Jjim (Sea Squirt Stew)" },
        region: "tongyeong",
        tasteProfile: { sweet: 10, salty: 55, spicy: 60, umami: 85, sour: 5 },
        storyDescription: {
          ko: "통영 앞바다의 별미 미더덕을 콩나물·미나리와 함께 매콤한 양념에 볶듯 찜으로 만들어낸 바다 향 진한 별미예요. 한 입 베어 물면 터지는 바닷물의 감칠맛이 장관이에요.",
          ja: "統営沖の逸品ミドドク（ホヤの一種）をもやし・セリと共に辛いタレで蒸した海の香り深い逸品です。一口噛めば弾ける海水の旨味が圧巻です。",
          en: "Mideodeok (sea squirt) from Tongyeong's coast steamed with bean sprouts and dropwort in a spicy sauce — a deep-sea delicacy. Each bite bursts with the umami of the sea itself."
        },
        ingredients: { ko: ["미더덕", "콩나물", "미나리", "고춧가루", "마늘", "전분", "대파", "참기름"], ja: ["ミドドク", "もやし", "セリ", "唐辛子粉", "ニンニク", "でんぷん", "長ネギ", "ごま油"], en: ["Sea squirt", "Bean sprouts", "Dropwort", "Chili powder", "Garlic", "Starch", "Green onion", "Sesame oil"] },
        tags: ["미더덕", "찜", "남해별미"],
        dupes: {
          JP: [
        { name: { ko: "호야 무시", ja: "ホヤ蒸し", en: "Hoya Mushi" }, tasteProfile: { sweet: 5, salty: 55, spicy: 15, umami: 85, sour: 10 }, description: { ko: "호야(우렁쉥이)를 술에 쪄 소스에 찍어 먹는 일본 동북식 해산물 별미", ja: "ホヤを日本酒で蒸してタレにつけて食べる日本東北の海鮮料理", en: "Japanese Tohoku-style sea squirt steamed in sake with dipping sauce" }, ingredients: { ko: ["호야", "사케", "간장", "생강", "레몬", "미림"], ja: ["ホヤ", "日本酒", "醤油", "生姜", "レモン", "みりん"], en: ["Sea squirt", "Sake", "Soy sauce", "Ginger", "Lemon", "Mirin"] }, similarityPercent: 78, matchReason: { ko: "해안 별미 호야·미더덕을 쪄 먹는 거의 동일한 전통", ja: "海岸の逸品ホヤ・ミドドクを蒸して食べるほぼ同じ伝統", en: "Steamed sea squirt — close Japanese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "하이초 마라 차오", ja: "海鞘麻辣炒", en: "Hai Qiao Mala Chao" }, tasteProfile: { sweet: 10, salty: 55, spicy: 65, umami: 85, sour: 5 }, description: { ko: "해산물을 마라 양념에 볶아낸 중국식 매운 해산물 찜", ja: "海産物を麻辣タレで炒めた中国式辛口海鮮蒸し", en: "Chinese spicy mala stir-fry with sea produce" }, ingredients: { ko: ["해산물", "두반장", "화자오", "마늘", "숙주", "대파"], ja: ["海産物", "豆板醤", "花椒", "ニンニク", "もやし", "長ネギ"], en: ["Sea produce", "Doubanjiang", "Sichuan pepper", "Garlic", "Bean sprouts", "Mung sprouts"] }, similarityPercent: 70, matchReason: { ko: "해산물을 매운 양념에 찌듯 볶아내는 공통점", ja: "海産物を辛いタレで蒸し炒めする共通点", en: "Spicy sea produce — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-myeolchi-hoemuchim",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/tongyeong-myeolchi-hoemuchim.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "멸치회무침", ja: "イワシ刺身和え", en: "Myeolchi Hoemuchim (Anchovy Hoe Mix)" },
        region: "tongyeong",
        tasteProfile: { sweet: 20, salty: 50, spicy: 55, umami: 75, sour: 35 },
        storyDescription: {
          ko: "금방 잡은 생멸치에 초고추장·식초·채소를 함께 새콤매콤하게 무쳐낸 통영 해안의 계절 별미예요. 한 입에 바다의 짭짤함과 초의 산미가 폭발해요.",
          ja: "獲れたての生イワシに酢コチュジャン・酢・野菜を合わせて酸っぱ辛く和える統営海岸の季節の逸品です。一口に海の塩気と酢の酸味が弾けます。",
          en: "Live-caught anchovies tossed with vinegared gochujang, vinegar and vegetables — Tongyeong's seasonal seaside treat. One bite bursts with ocean salt and bright acidity."
        },
        ingredients: { ko: ["생멸치", "초고추장", "식초", "설탕", "오이", "당근", "쪽파", "참기름"], ja: ["生イワシ", "酢コチュジャン", "酢", "砂糖", "きゅうり", "人参", "青ネギ", "ごま油"], en: ["Raw anchovy", "Chojang", "Vinegar", "Sugar", "Cucumber", "Carrot", "Green onion", "Sesame oil"] },
        tags: ["회무침", "멸치", "해안별미"],
        dupes: {
          JP: [
        { name: { ko: "이와시 나마스", ja: "鰯なます", en: "Iwashi Namasu" }, tasteProfile: { sweet: 15, salty: 50, spicy: 5, umami: 75, sour: 40 }, description: { ko: "정어리를 식초와 무에 절여 먹는 일본 전통 생선 초절임 회", ja: "イワシを酢と大根に漬ける日本伝統の魚酢漬け", en: "Japanese traditional vinegar-cured sardines with radish" }, ingredients: { ko: ["정어리", "식초", "무", "생강", "설탕", "간장"], ja: ["イワシ", "酢", "大根", "生姜", "砂糖", "醤油"], en: ["Sardine", "Vinegar", "Daikon", "Ginger", "Sugar", "Soy sauce"] }, similarityPercent: 80, matchReason: { ko: "생멸치/정어리를 식초 양념에 무쳐 새콤하게 먹는 거의 동일한 요리", ja: "生イワシを酢のタレで和えて酸味をつけるほぼ同じ料理", en: "Vinegar-cured anchovy — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "량 반 인 위", ja: "涼拌銀魚", en: "Liang Ban Yin Yu" }, tasteProfile: { sweet: 15, salty: 55, spicy: 25, umami: 75, sour: 30 }, description: { ko: "작은 생선을 식초·간장·고추에 무친 중국식 생선 냉채", ja: "小さな魚を酢・醤油・唐辛子で和えた中国式魚の冷菜", en: "Chinese cold dish of small fish in vinegar-soy-chili dressing" }, ingredients: { ko: ["생선", "식초", "간장", "고추", "마늘", "생강"], ja: ["魚", "酢", "醤油", "唐辛子", "ニンニク", "生姜"], en: ["Small fish", "Vinegar", "Soy sauce", "Chili", "Garlic", "Ginger"] }, similarityPercent: 73, matchReason: { ko: "작은 생선을 새콤한 양념에 무쳐 먹는 공통점", ja: "小さな魚を酸味の効いたタレで和える共通点", en: "Vinegared small fish — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "tongyeong-hakggongchi-hoe",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/tongyeong-hakggongchi-hoe.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "학꽁치 회", ja: "サヨリ刺身", en: "Hakggongchi Hoe (Halfbeak Sashimi)" },
        region: "tongyeong",
        tasteProfile: { sweet: 10, salty: 45, spicy: 10, umami: 80, sour: 15 },
        storyDescription: {
          ko: "은빛 학꽁치를 얇게 포 떠 초고추장과 함께 먹는 통영 해안의 겨울 별미예요. 맑고 담백한 살 맛 뒤에 따라오는 바다 향이 미식가들을 사로잡아요.",
          ja: "銀色のサヨリを薄く切って酢コチュジャンと食べる統営海岸の冬の逸品です。澄んだ淡白な身の味の後に続く海の香りが美食家を魅了します。",
          en: "Silver halfbeak sliced thin and dipped in vinegared gochujang — Tongyeong's winter delicacy. The clean, delicate flesh gives way to an ocean fragrance that captivates gourmets."
        },
        ingredients: { ko: ["학꽁치", "초고추장", "와사비", "상추", "깻잎", "오이", "당근", "마늘"], ja: ["サヨリ", "酢コチュジャン", "わさび", "サンチュ", "エゴマの葉", "きゅうり", "人参", "ニンニク"], en: ["Halfbeak", "Chojang", "Wasabi", "Lettuce", "Perilla leaf", "Cucumber", "Carrot", "Garlic"] },
        tags: ["회", "학꽁치", "겨울별미"],
        dupes: {
          JP: [
        { name: { ko: "사요리 사시미", ja: "サヨリ刺身", en: "Sayori Sashimi" }, tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 80, sour: 15 }, description: { ko: "학꽁치를 얇게 썰어 간장·와사비에 찍어 먹는 일본식 고급 회", ja: "サヨリを薄切りにして醤油・わさびで食べる日本式の高級刺身", en: "Japanese sashimi-grade thinly sliced halfbeak with soy and wasabi" }, ingredients: { ko: ["학꽁치", "간장", "와사비", "무", "김", "레몬"], ja: ["サヨリ", "醤油", "わさび", "大根", "海苔", "レモン"], en: ["Halfbeak", "Soy sauce", "Wasabi", "Daikon", "Nori", "Lemon"] }, similarityPercent: 90, matchReason: { ko: "학꽁치를 얇게 썰어 간장·와사비와 함께 먹는 거의 동일한 요리", ja: "サヨリを薄切りにして醤油・わさびで食べるほぼ同じ料理", en: "Halfbeak sashimi — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "용위 셩", ja: "針魚生", en: "Zhen Yu Sheng" }, tasteProfile: { sweet: 10, salty: 50, spicy: 15, umami: 75, sour: 20 }, description: { ko: "바늘 생선을 얇게 떠 간장·참깨에 먹는 중국식 생선회", ja: "針魚を薄く切って醤油・ゴマで食べる中国式刺身", en: "Chinese sliced halfbeak with soy sauce and sesame" }, ingredients: { ko: ["학꽁치", "간장", "참기름", "생강", "마늘", "식초"], ja: ["サヨリ", "醤油", "ごま油", "生姜", "ニンニク", "酢"], en: ["Halfbeak", "Soy sauce", "Sesame oil", "Ginger", "Garlic", "Vinegar"] }, similarityPercent: 75, matchReason: { ko: "얇게 뜬 생선회에 양념을 곁들이는 동아시아 공통점", ja: "薄く切った刺身にタレを添える東アジア共通点", en: "Thin fish sashimi — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      }
    ]
  },
  {
    code: "jeju",
    name: { ko: "제주", ja: "済州", en: "Jeju" },
    icon: "🏝️",
    image: "/images/village/jeju.jpg",
    description: { ko: "섬이 키운 독특한 맛의 세계", ja: "島が育んだ独特な味の世界", en: "A world of unique flavors nurtured by the island" },
    foods: [
      {
        id: "jeju-black-pork",
        name: { ko: "흑돼지 구이", ja: "黒豚焼き", en: "Black Pork BBQ" },
        region: "jeju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/jeju-black-pork.jpeg",
        tasteProfile: { sweet: 10, salty: 50, spicy: 20, umami: 90, sour: 5 },
        storyDescription: {
          ko: "제주 흑돼지는 현무암 화산섬의 바람과 풀밭에서 자란 덕분에 육질이 특별해요. 두툼하게 썬 살코기를 불판에 올리면 고소하고 진한 향이 피어오르며 누구도 자리를 뜨지 못하게 만들어요.",
          ja: "済州の黒豚は玄武岩の火山島の風と草原で育ったおかげで、肉質がとても特別です。厚切りの肉を鉄板にのせると、香ばしく濃厚な香りが立ち上り、誰も席を立てなくなります。",
          en: "Jeju's black pigs grow on volcanic basalt island winds and open grassland, which gives their meat an extraordinary character. Lay a thick-cut slab on the grill and a rich, nutty aroma rises — no one can bring themselves to leave the table."
        },
        ingredients: {
          ko: ["흑돼지 삼겹살", "상추", "쌈장", "마늘", "청양고추", "참기름", "소금", "깻잎"],
          ja: ["黒豚バラ肉", "サンチュ", "サムジャン", "ニンニク", "青唐辛子", "ごま油", "塩", "エゴマの葉"],
          en: ["Black pork belly", "Lettuce", "Ssamjang", "Garlic", "Green chili", "Sesame oil", "Salt", "Perilla leaf"]
        },
        tags: ["흑돼지", "구이", "제주"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-gogi-guksu",
        name: { ko: "고기국수", ja: "コギククス", en: "Gogi Guksu" },
        region: "jeju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-gogi-guksu.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-황성훈",
        tasteProfile: { sweet: 10, salty: 50, spicy: 15, umami: 90, sour: 5 },
        storyDescription: {
          ko: "제주에서는 잔칫날이면 온 동네가 고기국수 냄새로 가득 찼어요. 돼지 뼈를 오래 끓인 뽀얀 국물에 소면을 말고 수육을 얹으면 제주 사람들의 기쁨과 정이 한 그릇에 담겨요.",
          ja: "済州ではお祝いの日になると、村中がコギククスの香りでいっぱいになりました。豚骨を長時間煮込んだ乳白色のスープに素麺を入れて煮豚をのせると、済州の人々の喜びと温もりが一杯に宿ります。",
          en: "On celebration days in Jeju, the entire village fills with the smell of gogi guksu. Thin noodles in milky pork-bone broth topped with braised pork — a single bowl holds all the joy and warmth of Jeju people."
        },
        ingredients: {
          ko: ["소면", "돼지 뼈 육수", "돼지고기 수육", "대파", "생강", "소금", "깨"],
          ja: ["そうめん", "豚骨だし", "豚の煮豚", "長ネギ", "生姜", "塩", "ごま"],
          en: ["Thin noodles", "Pork bone broth", "Braised pork", "Green onion", "Ginger", "Salt", "Sesame"]
        },
        tags: ["면", "잔치", "뽀얀국물"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-galchi-jorim",
        name: { ko: "갈치조림", ja: "太刀魚の煮付け", en: "Galchi Jorim" },
        region: "jeju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/jeju-galchi-jorim.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        tasteProfile: { sweet: 20, salty: 55, spicy: 65, umami: 80, sour: 15 },
        storyDescription: {
          ko: "은빛으로 반짝이는 갈치가 매콤하고 달콤한 양념에 쪄지듯 조려지면 그 맛은 이 세상 것이 아니에요. 무와 함께 푹 익힌 양념이 밥 위에 올라가면 밥 한 그릇이 두 그릇이 되어버려요.",
          ja: "銀色に輝く太刀魚が甘辛い薬念で蒸すように煮付けられると、その味はこの世のものとは思えません。大根と一緒にじっくり煮込んだ薬念がご飯の上にのると、ご飯一杯が二杯になってしまいます。",
          en: "When silver-gleaming beltfish is braised down in a sweet-spicy sauce until tender, the flavor seems too good for this world. The sauce seeps into the radish too, and once that goes over rice, one bowl inevitably becomes two."
        },
        ingredients: {
          ko: ["갈치", "무", "대파", "고춧가루", "간장", "마늘", "생강", "설탕"],
          ja: ["太刀魚", "大根", "長ネギ", "唐辛子粉", "醤油", "ニンニク", "生姜", "砂糖"],
          en: ["Beltfish", "Radish", "Green onion", "Chili powder", "Soy sauce", "Garlic", "Ginger", "Sugar"]
        },
        tags: ["갈치", "조림", "제주"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-momguk",
        name: { ko: "몸국", ja: "モムグク", en: "Momguk" },
        region: "jeju",
        image: "",
        tasteProfile: { sweet: 5, salty: 55, spicy: 10, umami: 85, sour: 5 },
        storyDescription: {
          ko: "모자반이라는 검은 해조류와 돼지고기를 함께 끓인 몸국은 제주의 잔칫상에 빠지지 않는 음식이에요. 검고 진한 국물이 처음엔 낯설지만, 한 모금 마시면 바다와 땅의 정수를 맛보는 듯한 깊은 감동이 와요.",
          ja: "ホンダワラという黒い海藻と豚肉を一緒に煮込んだモムグクは、済州のお祝いの膳に欠かせない料理です。黒くて濃いスープが最初は馴染めませんが、一口飲むと海と大地の精髄を味わうような深い感動が訪れます。",
          en: "Momguk — black seaweed sargassum simmered with pork — is indispensable at any Jeju feast. The dark, dense broth looks unusual at first, but one sip delivers a profound shock of tasting the very essence of sea and earth together."
        },
        ingredients: {
          ko: ["모자반", "돼지고기", "된장", "마늘", "소금", "참기름", "대파"],
          ja: ["ホンダワラ", "豚肉", "テンジャン", "ニンニク", "塩", "ごま油", "長ネギ"],
          en: ["Sargassum seaweed", "Pork", "Doenjang", "Garlic", "Salt", "Sesame oil", "Green onion"]
        },
        tags: ["해조류", "잔치", "제주전통"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-dombe",
        name: { ko: "돔베고기", ja: "ドンベコギ", en: "Dombe Gogi" },
        region: "jeju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-dombe.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        tasteProfile: { sweet: 10, salty: 50, spicy: 15, umami: 85, sour: 5 },
        storyDescription: {
          ko: "돔베는 제주 방언으로 도마를 뜻해요. 삶아낸 돼지고기를 도마 위에 그대로 썰어내는 투박하고 진솔한 이 음식은 그 어떤 화려한 요리보다도 오래 기억에 남아요.",
          ja: "「돔베」は済州方言でまな板を意味します。茹でた豚肉をまな板の上でそのまま切り出すこの素朴で正直な料理は、どんな華やかな料理よりも長く記憶に残ります。",
          en: "Dombe is Jeju dialect for cutting board. Simply boiled pork, sliced straight on the board — rough and honest — this unpretentious dish lingers in memory longer than any elaborate creation."
        },
        ingredients: {
          ko: ["돼지고기", "소금", "새우젓", "파", "마늘", "물", "된장"],
          ja: ["豚肉", "塩", "アミの塩辛", "ネギ", "ニンニク", "水", "テンジャン"],
          en: ["Pork", "Salt", "Salted shrimp", "Green onion", "Garlic", "Water", "Doenjang"]
        },
        tags: ["수육", "제주", "소박함"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-mulhoe",
        name: { ko: "물회", ja: "ムルフェ", en: "Mulhoe" },
        region: "jeju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-mulhoe.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        tasteProfile: { sweet: 25, salty: 50, spicy: 60, umami: 75, sour: 55 },
        storyDescription: {
          ko: "신선한 해산물을 얼음처럼 차가운 매콤새콤한 국물에 담가 먹는 여름 제주의 청량한 별미예요. 한 입 떠먹으면 뜨거운 여름 더위가 순식간에 사라지는 마법 같은 경험을 할 수 있어요.",
          ja: "新鮮な海鮮を氷のように冷たい甘酸っぱいスープに浸して食べる夏の済州の爽やかな珍味です。ひと口食べると、真夏の暑さが瞬時に消えてしまう魔法のような体験ができます。",
          en: "Fresh seafood submerged in an ice-cold sweet-spicy-sour broth — Jeju's refreshing summer delicacy. One mouthful and the blazing summer heat vanishes instantly, like a magic trick performed in a bowl."
        },
        ingredients: {
          ko: ["광어", "오징어", "오이", "깻잎", "고추장", "식초", "설탕", "얼음"],
          ja: ["ヒラメ", "イカ", "きゅうり", "エゴマの葉", "コチュジャン", "酢", "砂糖", "氷"],
          en: ["Flounder", "Squid", "Cucumber", "Perilla", "Gochujang", "Vinegar", "Sugar", "Ice"]
        },
        tags: ["여름", "회", "차가움"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-bomal-kalguksu",
        name: { ko: "보말칼국수", ja: "カサガイカルグクス", en: "Bomal Kalguksu" },
        region: "jeju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/jeju-bomal-kalguksu.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
        tasteProfile: { sweet: 10, salty: 50, spicy: 10, umami: 90, sour: 5 },
        storyDescription: {
          ko: "보말은 제주 방언으로 고둥이에요. 이 작은 소라 같은 조개를 듬뿍 넣고 끓인 칼국수 국물은 진하고 담백하여 마치 바다를 한 그릇에 담은 것처럼 감동적이에요.",
          ja: "「보말」は済州方言でカサガイのことです。この小さな巻き貝をたっぷり入れて炊いたカルグクスのスープは濃厚で淡白で、まるで海を一杯に詰め込んだように感動的です。",
          en: "Bomal is Jeju dialect for periwinkle. Thick-cut noodles in broth deeply flavored by these tiny sea snails — rich yet clean, like having the entire ocean poured into one bowl."
        },
        ingredients: {
          ko: ["칼국수면", "보말", "다시마", "대파", "마늘", "된장", "소금"],
          ja: ["カルグクス麺", "カサガイ", "昆布", "長ネギ", "ニンニク", "テンジャン", "塩"],
          en: ["Knife-cut noodles", "Periwinkle", "Kelp", "Green onion", "Garlic", "Doenjang", "Salt"]
        },
        tags: ["면", "보말", "해산물"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-omegi-tteok",
        name: { ko: "오메기떡", ja: "オメギ餅", en: "Omegi Tteok" },
        region: "jeju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-omegi-tteok.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
        tasteProfile: { sweet: 60, salty: 10, spicy: 0, umami: 20, sour: 5 },
        storyDescription: {
          ko: "차조로 만든 쫄깃한 반죽 안에 달콤한 팥고물이 가득 들어있는 제주 전통 떡이에요. 오메기술을 빚을 때 남은 차조 술지게미로 만들어온 역사 깊은 섬의 지혜가 담겨 있어요.",
          ja: "粟で作ったもちもちの生地の中に甘いあずきのしとぎがたっぷり入った済州の伝統餅です。オメギ酒を醸す際に残った粟の酒粕から作られてきた、歴史深い島の知恵が宿っています。",
          en: "Jeju's traditional rice cake of chewy foxtail millet dough packed with sweet red bean filling. Made from the millet lees left over from brewing omegi makgeolli, it carries centuries of island wisdom and nothing-wasted ingenuity."
        },
        ingredients: {
          ko: ["차조", "팥고물", "설탕", "소금", "찹쌀", "참기름"],
          ja: ["粟", "あずきのしとぎ", "砂糖", "塩", "もち米", "ごま油"],
          en: ["Foxtail millet", "Sweet red bean powder", "Sugar", "Salt", "Glutinous rice", "Sesame oil"]
        },
        tags: ["떡", "제주", "차조"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-hallabong",
        name: { ko: "한라봉 디저트", ja: "漢拏峰デザート", en: "Hallabong Dessert" },
        region: "jeju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-hallabong.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        tasteProfile: { sweet: 75, salty: 5, spicy: 0, umami: 10, sour: 40 },
        storyDescription: {
          ko: "한라산을 닮은 봉긋한 모양의 한라봉은 제주 태양을 듬뿍 받아 달콤하고 향긋해요. 아이스크림, 젤리, 케이크 등 다양한 디저트로 변신한 한라봉의 맛은 제주 여행의 달콤한 마침표예요.",
          ja: "漢拏山に似た丸みのある形の漢拏峰は、済州の太陽をたっぷり受けて甘く香り豊かです。アイスクリーム、ゼリー、ケーキなど様々なデザートに変身した漢拏峰の味は、済州旅行の甘い締めくくりです。",
          en: "Hallabong — its round bump shaped just like Mt. Halla — is sweetened and perfumed by Jeju's generous sun. Transformed into ice cream, jelly, cake, and more, hallabong desserts are the sweet punctuation at the end of every Jeju trip."
        },
        ingredients: {
          ko: ["한라봉", "설탕", "생크림", "젤라틴", "밀가루", "버터", "달걀"],
          ja: ["漢拏峰", "砂糖", "生クリーム", "ゼラチン", "小麦粉", "バター", "卵"],
          en: ["Hallabong citrus", "Sugar", "Heavy cream", "Gelatin", "Flour", "Butter", "Egg"]
        },
        tags: ["디저트", "감귤", "제주"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-bingtteok",
        image: "",
        name: { ko: "빙떡", ja: "ビンドッ", en: "Bingtteok (Rolled Buckwheat Crepe)" },
        region: "jeju",
        tasteProfile: { sweet: 10, salty: 45, spicy: 10, umami: 55, sour: 5 },
        storyDescription: {
          ko: "제주 메밀가루 반죽을 얇게 부쳐 무숙을 넣고 돌돌 말아낸 소박한 향토 떡이에요. 구수한 메밀 향과 아삭한 무 소가 만나 제주 어르신들의 기억 한 조각이 돼요.",
          ja: "済州のそば粉生地を薄く焼き、大根の煮物を入れて巻いた素朴な郷土餅です。香ばしいそばの香りとシャキシャキの大根の具が出会い、済州のお年寄りの記憶の一片になります。",
          en: "Jeju buckwheat batter fried thin, filled with seasoned radish and rolled up — a humble local snack. The nutty buckwheat meets the crunch of radish like a fragment from an elder's memory of Jeju."
        },
        ingredients: { ko: ["메밀가루", "무", "참기름", "간장", "쪽파", "참깨", "소금", "식용유"], ja: ["そば粉", "大根", "ごま油", "醤油", "青ネギ", "ゴマ", "塩", "食用油"], en: ["Buckwheat flour", "Radish", "Sesame oil", "Soy sauce", "Green onion", "Sesame", "Salt", "Oil"] },
        tags: ["메밀", "떡", "제주향토"],
        dupes: {
          JP: [
        { name: { ko: "소바 가레트", ja: "そばガレット", en: "Soba Galette Roll" }, tasteProfile: { sweet: 5, salty: 45, spicy: 5, umami: 55, sour: 5 }, description: { ko: "메밀가루 반죽을 얇게 부쳐 채소를 넣고 말아낸 일본 시골식 메밀 롤", ja: "そば粉生地を薄く焼いて野菜を入れて巻いた日本の田舎風そばロール", en: "Japanese rural-style buckwheat crepe rolled with vegetables" }, ingredients: { ko: ["메밀가루", "무", "간장", "파", "와사비", "김"], ja: ["そば粉", "大根", "醤油", "ネギ", "わさび", "海苔"], en: ["Buckwheat flour", "Radish", "Soy sauce", "Green onion", "Wasabi", "Nori"] }, similarityPercent: 80, matchReason: { ko: "메밀 반죽에 채소를 싸 먹는 거의 동일한 전통", ja: "そば生地に野菜を包んで食べるほぼ同じ伝統", en: "Buckwheat crepe roll — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "샤오빙 쥐엔", ja: "小餅巻", en: "Xiao Bing Juan" }, tasteProfile: { sweet: 5, salty: 50, spicy: 10, umami: 55, sour: 5 }, description: { ko: "메밀·밀 혼합 반죽을 부쳐 무·채소를 말아낸 중국 북부식 롤 떡", ja: "そば・小麦混合生地を焼いて大根・野菜を巻く中国北部式ロール餅", en: "Northern Chinese buckwheat-wheat crepe rolled with radish and vegetables" }, ingredients: { ko: ["메밀가루", "밀가루", "무", "대파", "참기름", "간장"], ja: ["そば粉", "小麦粉", "大根", "長ネギ", "ごま油", "醤油"], en: ["Buckwheat flour", "Wheat flour", "Radish", "Green onion", "Sesame oil", "Soy sauce"] }, similarityPercent: 75, matchReason: { ko: "얇은 반죽에 채소 소를 말아내는 공통점", ja: "薄い生地に野菜の具を巻く共通点", en: "Crepe roll with radish — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-kkwong-memil-guksu",
        image: "",
        name: { ko: "꿩메밀국수", ja: "キジそば", en: "Kkwong Memil Guksu (Pheasant Buckwheat Noodles)" },
        region: "jeju",
        tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 85, sour: 5 },
        storyDescription: {
          ko: "제주 한라산 자락에서 잡은 꿩으로 우린 깊은 육수에 메밀국수를 말아내는 귀한 겨울 별미예요. 기름기 없는 맑은 국물이 고소한 메밀 향과 조화로워요.",
          ja: "済州・漢拏山の麓で獲れたキジで取った深いスープにそばを入れる貴重な冬の逸品です。脂分の少ない澄んだスープが香ばしいそばの香りと調和します。",
          en: "Pheasant caught on the slopes of Hallasan steeped into a deep broth with buckwheat noodles — a rare winter treat. The fat-free clear broth harmonizes with the nutty buckwheat fragrance."
        },
        ingredients: { ko: ["꿩고기", "메밀국수", "무", "대파", "마늘", "소금", "간장", "후추"], ja: ["キジ肉", "そば", "大根", "長ネギ", "ニンニク", "塩", "醤油", "胡椒"], en: ["Pheasant", "Buckwheat noodles", "Radish", "Green onion", "Garlic", "Salt", "Soy sauce", "Pepper"] },
        tags: ["꿩", "메밀", "제주겨울"],
        dupes: {
          JP: [
        { name: { ko: "카모 난반 소바", ja: "鴨南蛮そば", en: "Kamo Nanban Soba" }, tasteProfile: { sweet: 15, salty: 50, spicy: 5, umami: 85, sour: 5 }, description: { ko: "오리와 파를 우린 국물에 메밀을 말아낸 일본 전통 소바", ja: "鴨とネギで取ったスープにそばを入れた日本伝統のそば", en: "Japanese traditional duck-and-scallion buckwheat soba" }, ingredients: { ko: ["오리고기", "메밀국수", "대파", "가쓰오 다시", "간장", "미림"], ja: ["鴨肉", "そば", "長ネギ", "かつおだし", "醤油", "みりん"], en: ["Duck", "Soba", "Green onion", "Dashi", "Soy sauce", "Mirin"] }, similarityPercent: 85, matchReason: { ko: "사냥한 조류(꿩·오리) 국물에 메밀국수를 말아내는 거의 동일한 요리", ja: "狩猟鳥(キジ・鴨)のスープにそばを入れるほぼ同じ料理", en: "Game-bird buckwheat soba — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "즈지 차오 멘", ja: "雉鶏麺", en: "Zhi Ji Mian" }, tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 85, sour: 5 }, description: { ko: "꿩을 생강·대파와 맑게 우려낸 국물에 밀국수를 넣은 중국 북부식 꿩 국수", ja: "キジを生姜・長ネギで澄んだスープに煮出した小麦麺を入れる中国北部式キジ麺", en: "Northern Chinese pheasant noodle soup with ginger and scallion" }, ingredients: { ko: ["꿩고기", "밀국수", "생강", "대파", "간장", "참기름"], ja: ["キジ肉", "小麦麺", "生姜", "長ネギ", "醤油", "ごま油"], en: ["Pheasant", "Wheat noodles", "Ginger", "Green onion", "Soy sauce", "Sesame oil"] }, similarityPercent: 82, matchReason: { ko: "꿩을 우린 국물에 면을 말아 먹는 거의 동일한 요리", ja: "キジのスープに麺を入れるほぼ同じ料理", en: "Pheasant noodle soup — close Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-hanchi-mulhoe",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-hanchi-mulhoe.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        name: { ko: "한치물회", ja: "ハンチ水刺身", en: "Hanchi Mulhoe (Cold Squid Soup)" },
        region: "jeju",
        tasteProfile: { sweet: 15, salty: 45, spicy: 50, umami: 75, sour: 30 },
        storyDescription: {
          ko: "제주 특산 한치(작은 오징어)를 얇게 썰어 고추장·식초·얼음과 함께 새콤 매콤하게 말아내는 여름 별미예요. 시원한 얼음 국물과 쫄깃한 한치가 뜨거운 제주 여름을 식혀줘요.",
          ja: "済州特産のハンチ（小さなイカ）を薄切りにしてコチュジャン・酢・氷と共に酸っぱ辛く和える夏の逸品です。冷たい氷のスープとプリプリのハンチが暑い済州の夏を冷やしてくれます。",
          en: "Jeju's specialty hanchi (small squid) sliced thin and mixed with gochujang, vinegar and ice — a summer dish. The icy broth and chewy squid cool Jeju's hot summer in a single bowl."
        },
        ingredients: { ko: ["한치", "오이", "배", "고추장", "식초", "설탕", "참기름", "얼음"], ja: ["ハンチ", "きゅうり", "梨", "コチュジャン", "酢", "砂糖", "ごま油", "氷"], en: ["Hanchi squid", "Cucumber", "Pear", "Gochujang", "Vinegar", "Sugar", "Sesame oil", "Ice"] },
        tags: ["물회", "한치", "여름"],
        dupes: {
          JP: [
        { name: { ko: "히야시 이카 소면", ja: "冷やしイカそうめん", en: "Hiyashi Ika Somen" }, tasteProfile: { sweet: 10, salty: 45, spicy: 10, umami: 75, sour: 20 }, description: { ko: "얇게 썬 오징어 회를 차가운 국물에 말아낸 일본식 냉 오징어 소면", ja: "薄切りのイカ刺身を冷たいスープに入れる日本式冷製イカそうめん", en: "Japanese cold squid sashimi noodle in iced broth" }, ingredients: { ko: ["오징어", "소면", "다시", "간장", "와사비", "파"], ja: ["イカ", "そうめん", "だし", "醤油", "わさび", "ネギ"], en: ["Squid", "Somen", "Dashi", "Soy sauce", "Wasabi", "Green onion"] }, similarityPercent: 77, matchReason: { ko: "얇은 오징어회를 차가운 국물에 담아 먹는 거의 동일한 요리", ja: "薄いイカ刺身を冷たいスープに入れるほぼ同じ料理", en: "Cold squid sashimi — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "량 반 유위", ja: "涼拌魷魚", en: "Liang Ban You Yu" }, tasteProfile: { sweet: 15, salty: 50, spicy: 35, umami: 75, sour: 25 }, description: { ko: "삶은 오징어를 식초·고추기름·간장에 무친 중국식 냉 오징어 무침", ja: "茹でたイカを酢・ラー油・醤油で和えた中国式冷製イカ和え", en: "Chinese cold squid salad with vinegar, chili oil and soy" }, ingredients: { ko: ["오징어", "식초", "간장", "고추기름", "생강", "참기름"], ja: ["イカ", "酢", "醤油", "ラー油", "生姜", "ごま油"], en: ["Squid", "Vinegar", "Soy sauce", "Chili oil", "Ginger", "Sesame oil"] }, similarityPercent: 72, matchReason: { ko: "오징어를 새콤 매콤한 양념에 차갑게 먹는 공통점", ja: "イカを酸っぱ辛いタレで冷たく食べる共通点", en: "Cold squid salad — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-bomal-juk",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-bomal-juk.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
        name: { ko: "보말죽", ja: "ポマル粥", en: "Bomal Juk (Sea Snail Porridge)" },
        region: "jeju",
        tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 85, sour: 5 },
        storyDescription: {
          ko: "제주 바닷가 바위에서 잡은 보말(바다 고둥)을 참기름에 볶다가 쌀과 함께 부드럽게 끓여낸 소박하고 진한 제주 죽이에요. 한 숟갈에 제주 바다의 짭짤한 속살이 밥알마다 배어 있어요.",
          ja: "済州の海岸の岩場で採ったポマル（海の巻貝）をごま油で炒めてご飯と柔らかく煮込む素朴で濃厚な済州粥です。一さじに済州の海の塩気が米粒一つひとつに染みています。",
          en: "Sea snails plucked from Jeju's coastal rocks, sautéed in sesame oil and simmered with rice into a soft, rich porridge. Each spoonful carries the saltiness of Jeju's sea in every grain."
        },
        ingredients: { ko: ["보말", "쌀", "참기름", "소금", "깻잎", "대파", "마늘", "후추"], ja: ["ポマル", "米", "ごま油", "塩", "エゴマの葉", "長ネギ", "ニンニク", "胡椒"], en: ["Sea snail", "Rice", "Sesame oil", "Salt", "Perilla leaf", "Green onion", "Garlic", "Pepper"] },
        tags: ["죽", "보말", "제주보양"],
        dupes: {
          JP: [
        { name: { ko: "사자에 카유", ja: "サザエ粥", en: "Sazae Kayu" }, tasteProfile: { sweet: 5, salty: 45, spicy: 0, umami: 85, sour: 5 }, description: { ko: "바다 고둥을 밥과 다시에 부드럽게 끓여낸 일본식 바다 고둥 죽", ja: "サザエ(巻貝)をご飯とだしで柔らかく煮込んだ日本式サザエ粥", en: "Japanese sea snail porridge simmered with rice and dashi" }, ingredients: { ko: ["사자에", "쌀", "다시", "간장", "미소", "파"], ja: ["サザエ", "米", "だし", "醤油", "味噌", "ネギ"], en: ["Sazae", "Rice", "Dashi", "Soy sauce", "Miso", "Green onion"] }, similarityPercent: 85, matchReason: { ko: "바다 고둥과 쌀을 함께 끓여 먹는 거의 동일한 요리", ja: "巻貝と米を一緒に煮込むほぼ同じ料理", en: "Sea snail porridge — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "호위 저우", ja: "海螺粥", en: "Hai Luo Zhou" }, tasteProfile: { sweet: 5, salty: 50, spicy: 5, umami: 85, sour: 5 }, description: { ko: "바다 고둥과 쌀을 오래 끓여낸 중국 남부 연안식 고둥 죽", ja: "巻貝と米を長時間煮込む中国南部沿岸式の巻貝粥", en: "Southern Chinese coastal sea snail congee" }, ingredients: { ko: ["바다 고둥", "쌀", "생강", "대파", "간장", "참기름"], ja: ["巻貝", "米", "生姜", "長ネギ", "醤油", "ごま油"], en: ["Sea snail", "Rice", "Ginger", "Green onion", "Soy sauce", "Sesame oil"] }, similarityPercent: 85, matchReason: { ko: "바다 고둥과 쌀을 함께 끓이는 거의 동일한 해안 요리", ja: "巻貝と米を一緒に煮込むほぼ同じ海岸料理", en: "Sea snail congee — close Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-gamgyul-juice",
        image: "",
        name: { ko: "감귤주스", ja: "みかんジュース", en: "Tangerine Juice" },
        region: "jeju",
        tasteProfile: { sweet: 75, salty: 2, spicy: 0, umami: 5, sour: 30 },
        storyDescription: {
          ko: "제주 햇살 가득 머금은 노지 감귤을 손으로 짜 얼음과 함께 마시는 제주의 노란 음료예요. 한 모금에 섬의 바람과 햇빛이 입 안에서 쨍하게 피어나요.",
          ja: "済州の太陽をたっぷり浴びた露地みかんを手絞りして氷と共に飲む済州の黄色い飲み物です。一口で島の風と陽光が口の中で爽やかに広がります。",
          en: "Hand-squeezed Jeju outdoor tangerines served over ice — the island's golden drink. One sip, and Jeju's wind and sunshine burst bright on your tongue."
        },
        ingredients: { ko: ["제주 감귤", "얼음", "꿀", "레몬즙", "탄산수"], ja: ["済州みかん", "氷", "ハチミツ", "レモン汁", "炭酸水"], en: ["Jeju tangerine", "Ice", "Honey", "Lemon juice", "Sparkling water"] },
        tags: ["음료", "감귤", "제주"],
        dupes: {
          JP: [
        { name: { ko: "미캉 주스", ja: "みかんジュース", en: "Mikan Juice" }, tasteProfile: { sweet: 75, salty: 2, spicy: 0, umami: 5, sour: 30 }, description: { ko: "일본 미카와산 귤을 손으로 짜서 얼음과 함께 마시는 일본식 귤 주스", ja: "日本産みかんを手絞りで氷と共に飲む日本式みかんジュース", en: "Japanese hand-squeezed mikan juice with ice" }, ingredients: { ko: ["미캉", "얼음", "설탕", "레몬"], ja: ["みかん", "氷", "砂糖", "レモン"], en: ["Mikan", "Ice", "Sugar", "Lemon"] }, similarityPercent: 88, matchReason: { ko: "같은 품종의 귤을 손으로 짜 차갑게 마시는 거의 동일한 음료", ja: "同じ品種のみかんを手絞りで冷たく飲むほぼ同じ飲み物", en: "Fresh-squeezed mikan — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "가증즈", ja: "柑橙汁", en: "Gan Cheng Zhi" }, tasteProfile: { sweet: 70, salty: 2, spicy: 0, umami: 5, sour: 35 }, description: { ko: "중국 남부의 달콤한 귤·오렌지를 짠 주스", ja: "中国南部の甘い柑橘・オレンジを絞ったジュース", en: "Southern Chinese sweet orange/tangerine juice" }, ingredients: { ko: ["귤", "오렌지", "얼음", "꿀"], ja: ["みかん", "オレンジ", "氷", "ハチミツ"], en: ["Tangerine", "Orange", "Ice", "Honey"] }, similarityPercent: 80, matchReason: { ko: "남부 지역의 달콤한 귤을 짜 마시는 아시아 공통 음료", ja: "南部地域の甘いみかんを絞って飲むアジア共通の飲み物", en: "Southern citrus juice — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-seonggae-miyeokguk",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-seonggae-miyeokguk.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        name: { ko: "성게미역국", ja: "ウニわかめスープ", en: "Seonggae Miyeokguk (Sea Urchin Seaweed Soup)" },
        region: "jeju",
        tasteProfile: { sweet: 15, salty: 50, spicy: 0, umami: 90, sour: 5 },
        storyDescription: {
          ko: "제주 해녀들이 직접 따온 성게알과 미역을 맑은 국물에 끓여낸 섬의 보양식이에요. 한 숟갈이면 바다의 진한 감칠맛과 미역의 시원함이 온몸을 감싸요.",
          ja: "済州の海女が採ったウニとわかめを澄んだスープで煮込む島の滋養料理です。一さじで海の深い旨味とわかめの爽やかさが全身を包みます。",
          en: "Sea urchin roe and seaweed harvested by Jeju haenyeo, simmered in a clear broth — the island's restorative soup. One spoonful, and the sea's deep umami and seaweed's coolness wrap the whole body."
        },
        ingredients: { ko: ["성게알", "미역", "다시마 육수", "참기름", "마늘", "간장", "청주", "대파"], ja: ["ウニ", "わかめ", "昆布だし", "ごま油", "ニンニク", "醤油", "清酒", "長ネギ"], en: ["Sea urchin roe", "Seaweed", "Kelp broth", "Sesame oil", "Garlic", "Soy sauce", "Rice wine", "Green onion"] },
        tags: ["미역국", "성게", "제주해녀"],
        dupes: {
          JP: [
        { name: { ko: "우니 나베", ja: "ウニ鍋", en: "Uni Nabe" }, tasteProfile: { sweet: 10, salty: 50, spicy: 0, umami: 90, sour: 5 }, description: { ko: "성게와 미역·두부를 다시마 국물에 끓이는 일본 북해도식 성게 전골", ja: "ウニとわかめ・豆腐を昆布だしで煮込む日本北海道式ウニ鍋", en: "Japanese Hokkaido-style sea urchin hot pot with seaweed and tofu" }, ingredients: { ko: ["성게알", "미역", "두부", "다시마", "간장", "미소"], ja: ["ウニ", "わかめ", "豆腐", "昆布", "醤油", "味噌"], en: ["Sea urchin", "Wakame", "Tofu", "Kelp", "Soy sauce", "Miso"] }, similarityPercent: 87, matchReason: { ko: "성게와 미역을 맑은 국물에 끓이는 거의 동일한 요리", ja: "ウニとわかめを澄んだスープで煮込むほぼ同じ料理", en: "Sea urchin seaweed soup — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "하이단 하이짜 탕", ja: "海胆海帯湯", en: "Hai Dan Hai Dai Tang" }, tasteProfile: { sweet: 5, salty: 55, spicy: 5, umami: 90, sour: 5 }, description: { ko: "성게와 다시마를 맑게 끓여낸 중국 연안식 해조 성게 수프", ja: "ウニと昆布を澄んだスープにする中国沿岸式海藻ウニスープ", en: "Chinese coastal clear sea urchin and kelp soup" }, ingredients: { ko: ["성게알", "다시마", "생강", "대파", "간장", "참기름"], ja: ["ウニ", "昆布", "生姜", "長ネギ", "醤油", "ごま油"], en: ["Sea urchin", "Kelp", "Ginger", "Green onion", "Soy sauce", "Sesame oil"] }, similarityPercent: 83, matchReason: { ko: "성게와 해조를 함께 맑은 국물에 끓이는 공통점", ja: "ウニと海藻を澄んだスープで煮込む共通点", en: "Sea urchin kelp soup — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-okdom-gui",
        image: "",
        name: { ko: "옥돔구이", ja: "アマダイ焼き", en: "Okdom Gui (Grilled Tilefish)" },
        region: "jeju",
        tasteProfile: { sweet: 5, salty: 60, spicy: 10, umami: 85, sour: 5 },
        storyDescription: {
          ko: "제주 바다의 귀한 옥돔을 소금만 뿌려 숯불에 노릇하게 구워낸 섬의 최고급 생선구이예요. 담백하고 섬세한 살결이 특별한 날의 상을 빛나게 해요.",
          ja: "済州の海の貴重なアマダイに塩だけふって炭火できつね色に焼き上げた島の最高級焼き魚です。淡白で繊細な身が特別な日の食卓を輝かせます。",
          en: "Prized Jeju tilefish salted simply and charcoal-grilled golden — the island's premium grilled fish. Its clean, delicate flesh lights up a special-occasion table."
        },
        ingredients: { ko: ["옥돔", "굵은 소금", "들기름", "레몬", "무", "간장", "대파", "쑥"], ja: ["アマダイ", "粗塩", "エゴマ油", "レモン", "大根", "醤油", "長ネギ", "ヨモギ"], en: ["Tilefish", "Coarse salt", "Perilla oil", "Lemon", "Radish", "Soy sauce", "Green onion", "Mugwort"] },
        tags: ["옥돔", "구이", "제주고급"],
        dupes: {
          JP: [
        { name: { ko: "아마다이 시오야키", ja: "甘鯛の塩焼き", en: "Amadai Shioyaki" }, tasteProfile: { sweet: 5, salty: 60, spicy: 5, umami: 85, sour: 5 }, description: { ko: "옥돔에 소금을 뿌려 구운 일본 교토·해안식 최고급 생선구이", ja: "アマダイに塩をふって焼いた日本京都・海岸式の最高級焼き魚", en: "Japanese Kyoto/coastal salt-grilled premium amadai" }, ingredients: { ko: ["아마다이", "굵은 소금", "무간 것", "간장", "레몬", "산초"], ja: ["甘鯛", "粗塩", "大根おろし", "醤油", "レモン", "山椒"], en: ["Amadai", "Coarse salt", "Grated daikon", "Soy sauce", "Lemon", "Sansho"] }, similarityPercent: 90, matchReason: { ko: "옥돔에 소금을 뿌려 고급스럽게 굽는 거의 동일한 요리", ja: "アマダイに塩をふって高級に焼くほぼ同じ料理", en: "Amadai shioyaki — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "샤오 디아이", ja: "烤鲷魚", en: "Kao Diao Yu" }, tasteProfile: { sweet: 5, salty: 55, spicy: 15, umami: 85, sour: 5 }, description: { ko: "도미류를 숯불에 향신료와 함께 구워낸 중국식 고급 생선구이", ja: "鯛類を炭火でスパイスと共に焼いた中国式高級焼き魚", en: "Chinese charcoal-grilled premium sea bream with spices" }, ingredients: { ko: ["도미", "쯔란", "고춧가루", "간장", "마늘", "참기름"], ja: ["鯛", "クミン", "唐辛子粉", "醤油", "ニンニク", "ごま油"], en: ["Sea bream", "Cumin", "Chili powder", "Soy sauce", "Garlic", "Sesame oil"] }, similarityPercent: 72, matchReason: { ko: "고급 생선을 소금과 향신료로 구워내는 공통점", ja: "高級魚を塩とスパイスで焼く共通点", en: "Premium grilled fish — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-gosari-yukgaejang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-gosari-yukgaejang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        name: { ko: "고사리 육개장", ja: "ワラビユッケジャン", en: "Gosari Yukgaejang" },
        region: "jeju",
        tasteProfile: { sweet: 10, salty: 55, spicy: 70, umami: 85, sour: 5 },
        storyDescription: {
          ko: "제주 들판에서 채취한 고사리를 잘게 찢은 소고기·대파와 함께 고춧가루 얼큰한 국물에 끓여낸 제주식 육개장이에요. 봄의 땅 향과 매운 국물이 봄철 몸을 깨워요.",
          ja: "済州の野原で採ったワラビを細かく裂いた牛肉・長ネギと共に唐辛子粉のピリ辛スープで煮込む済州式ユッケジャンです。春の土の香りと辛いスープが春の体を目覚めさせます。",
          en: "Bracken from Jeju's spring fields simmered with shredded beef and scallion in a chili-powder broth — Jeju's yukgaejang. The scent of spring earth and fiery broth awakens the body."
        },
        ingredients: { ko: ["고사리", "소고기", "대파", "숙주", "고춧가루", "참기름", "마늘", "달걀"], ja: ["ワラビ", "牛肉", "長ネギ", "もやし", "唐辛子粉", "ごま油", "ニンニク", "卵"], en: ["Bracken", "Beef", "Green onion", "Bean sprouts", "Chili powder", "Sesame oil", "Garlic", "Egg"] },
        tags: ["고사리", "매운탕", "제주봄"],
        dupes: {
          JP: [
        { name: { ko: "와라비 규니쿠 나베", ja: "ワラビ牛肉鍋", en: "Warabi Gyuniku Nabe" }, tasteProfile: { sweet: 10, salty: 55, spicy: 20, umami: 85, sour: 5 }, description: { ko: "와라비(고사리)와 소고기를 미소·간장 국물에 끓인 일본식 전골", ja: "ワラビと牛肉を味噌・醤油スープで煮込む日本式鍋", en: "Japanese hot pot with bracken and beef in miso-soy broth" }, ingredients: { ko: ["와라비", "소고기", "파", "간장", "미소", "미림"], ja: ["ワラビ", "牛肉", "ネギ", "醤油", "味噌", "みりん"], en: ["Warabi", "Beef", "Green onion", "Soy sauce", "Miso", "Mirin"] }, similarityPercent: 78, matchReason: { ko: "고사리와 소고기를 함께 끓여 먹는 거의 동일한 요리", ja: "ワラビと牛肉を一緒に煮込むほぼ同じ料理", en: "Bracken-beef stew — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "촤이 니우러우 마라 탕", ja: "蕨菜牛肉麻辣湯", en: "Jue Cai Niurou Mala Tang" }, tasteProfile: { sweet: 10, salty: 55, spicy: 75, umami: 85, sour: 5 }, description: { ko: "고사리와 소고기를 마라 국물에 매콤하게 끓여낸 중국 사천식 얼큰 탕", ja: "ワラビと牛肉を麻辣スープで辛く煮込む中国四川式辛口スープ", en: "Sichuan spicy mala soup with bracken and beef" }, ingredients: { ko: ["고사리", "소고기", "두반장", "화자오", "마늘", "대파"], ja: ["ワラビ", "牛肉", "豆板醤", "花椒", "ニンニク", "長ネギ"], en: ["Bracken", "Beef", "Doubanjiang", "Sichuan pepper", "Garlic", "Green onion"] }, similarityPercent: 82, matchReason: { ko: "고사리와 소고기를 매운 국물에 끓이는 거의 동일한 요리", ja: "ワラビと牛肉を辛いスープで煮込むほぼ同じ料理", en: "Spicy bracken beef soup — close Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-jeonbok-ttukbaegi",
        image: "",
        name: { ko: "전복뚝배기", ja: "アワビトゥッペギ", en: "Jeonbok Ttukbaegi (Abalone Pot)" },
        region: "jeju",
        tasteProfile: { sweet: 10, salty: 55, spicy: 30, umami: 90, sour: 5 },
        storyDescription: {
          ko: "살아있는 제주 전복을 뚝배기에 된장·고추장·두부와 함께 보글보글 끓여낸 제주의 고급 뚝배기 요리예요. 뜨끈한 국물에 녹아든 전복의 고소한 감칠맛이 온몸을 보양해요.",
          ja: "生きた済州アワビを土鍋で味噌・コチュジャン・豆腐と共にぐつぐつ煮込む済州の高級土鍋料理です。熱々のスープに溶け込んだアワビの香ばしい旨味が全身を滋養します。",
          en: "Live Jeju abalone simmered in an earthenware pot with doenjang, gochujang and tofu — Jeju's premium clay-pot dish. The nutty abalone umami melting into hot broth nourishes the whole body."
        },
        ingredients: { ko: ["전복", "두부", "된장", "고추장", "애호박", "양파", "대파", "마늘"], ja: ["アワビ", "豆腐", "味噌", "コチュジャン", "ズッキーニ", "玉ねぎ", "長ネギ", "ニンニク"], en: ["Abalone", "Tofu", "Doenjang", "Gochujang", "Zucchini", "Onion", "Green onion", "Garlic"] },
        tags: ["전복", "뚝배기", "제주보양"],
        dupes: {
          JP: [
        { name: { ko: "아와비 미소 나베", ja: "鮑味噌鍋", en: "Awabi Miso Nabe" }, tasteProfile: { sweet: 10, salty: 60, spicy: 5, umami: 90, sour: 5 }, description: { ko: "전복을 미소 국물에 두부·채소와 끓인 일본식 고급 전복 전골", ja: "アワビを味噌スープで豆腐・野菜と煮込む日本式高級アワビ鍋", en: "Japanese premium abalone hot pot with miso broth, tofu and vegetables" }, ingredients: { ko: ["전복", "미소", "두부", "배추", "대파", "다시"], ja: ["アワビ", "味噌", "豆腐", "白菜", "長ネギ", "だし"], en: ["Abalone", "Miso", "Tofu", "Napa cabbage", "Green onion", "Dashi"] }, similarityPercent: 85, matchReason: { ko: "전복을 된장 국물 뚝배기에 끓이는 거의 동일한 요리", ja: "アワビを味噌スープ土鍋で煮込むほぼ同じ料理", en: "Abalone miso pot — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "바오위 샤보궈", ja: "鮑魚砂鍋", en: "Bao Yu Sha Bao Guo" }, tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 90, sour: 5 }, description: { ko: "전복과 두부·채소를 토기에 간장 국물로 끓이는 광둥식 고급 전복 샤보궈", ja: "アワビと豆腐・野菜を土鍋で醤油スープで煮込む広東式高級アワビ土鍋", en: "Cantonese premium abalone clay pot in soy broth" }, ingredients: { ko: ["전복", "두부", "버섯", "청경채", "간장", "생강"], ja: ["アワビ", "豆腐", "きのこ", "チンゲン菜", "醤油", "生姜"], en: ["Abalone", "Tofu", "Mushroom", "Bok choy", "Soy sauce", "Ginger"] }, similarityPercent: 85, matchReason: { ko: "전복을 토기에 진한 국물로 끓이는 거의 동일한 요리", ja: "アワビを土鍋で濃厚なスープで煮込むほぼ同じ料理", en: "Abalone clay pot — close Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-jari-mulhoe",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-jari-mulhoe.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        name: { ko: "자리물회", ja: "ザリ水刺身", en: "Jari Mulhoe (Damselfish Cold Soup)" },
        region: "jeju",
        tasteProfile: { sweet: 15, salty: 50, spicy: 40, umami: 70, sour: 40 },
        storyDescription: {
          ko: "제주 연안의 자리돔을 뼈째 얇게 썰어 된장과 고추장·식초·얼음물에 말아내는 제주 여름 별미예요. 쫄깃한 뼈와 새콤한 국물이 뜨거운 여름을 시원하게 식혀줘요.",
          ja: "済州沿岸のザリドミ（スズメダイ）を骨ごと薄切りにして味噌とコチュジャン・酢・氷水に入れる済州の夏の逸品です。コリコリの骨と酸味のスープが暑い夏を冷やしてくれます。",
          en: "Jeju's coastal damselfish sliced whole with bones into vinegared gochujang-doenjang iced broth — a summer specialty. The crunchy bones and tangy broth chill the hot summer in one bowl."
        },
        ingredients: { ko: ["자리돔", "된장", "고추장", "식초", "얼음", "오이", "양파", "깻잎"], ja: ["ザリドミ", "味噌", "コチュジャン", "酢", "氷", "きゅうり", "玉ねぎ", "エゴマの葉"], en: ["Damselfish", "Doenjang", "Gochujang", "Vinegar", "Ice", "Cucumber", "Onion", "Perilla leaf"] },
        tags: ["물회", "자리돔", "제주여름"],
        dupes: {
          JP: [
        { name: { ko: "히야시 나마스", ja: "冷やしなます", en: "Hiyashi Namasu" }, tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 70, sour: 40 }, description: { ko: "작은 생선을 식초에 절여 무와 함께 차갑게 먹는 일본식 여름 생선 초절임", ja: "小魚を酢に漬けて大根と共に冷たく食べる日本式夏の魚酢漬け", en: "Japanese cold vinegar-cured small fish with daikon" }, ingredients: { ko: ["작은 생선", "식초", "무", "설탕", "생강", "간장"], ja: ["小魚", "酢", "大根", "砂糖", "生姜", "醤油"], en: ["Small fish", "Vinegar", "Daikon", "Sugar", "Ginger", "Soy sauce"] }, similarityPercent: 78, matchReason: { ko: "생선을 식초·된장에 새콤하게 차갑게 먹는 공통점", ja: "魚を酢・味噌で酸っぱく冷たく食べる共通点", en: "Cold vinegar fish — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "량 반 위", ja: "涼拌魚", en: "Liang Ban Yu" }, tasteProfile: { sweet: 10, salty: 55, spicy: 30, umami: 75, sour: 25 }, description: { ko: "얇게 썬 생선에 식초·간장·고추기름을 부어 차갑게 먹는 중국식 생선 냉채", ja: "薄切りの魚に酢・醤油・ラー油をかけて冷たく食べる中国式魚冷菜", en: "Chinese cold sliced fish with vinegar, soy and chili oil" }, ingredients: { ko: ["생선", "식초", "간장", "고추기름", "생강", "마늘"], ja: ["魚", "酢", "醤油", "ラー油", "生姜", "ニンニク"], en: ["Fish", "Vinegar", "Soy sauce", "Chili oil", "Ginger", "Garlic"] }, similarityPercent: 75, matchReason: { ko: "얇은 생선을 새콤 매콤한 양념에 차갑게 먹는 공통점", ja: "薄い魚を酸っぱ辛いタレで冷たく食べる共通点", en: "Cold sliced fish — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-gosari-bokkeum",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-gosari-bokkeum.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        name: { ko: "고사리볶음", ja: "ワラビ炒め", en: "Gosari Bokkeum (Bracken Stir-fry)" },
        region: "jeju",
        tasteProfile: { sweet: 10, salty: 50, spicy: 15, umami: 65, sour: 5 },
        storyDescription: {
          ko: "제주 들판에서 채취한 고사리를 소금에 삶아 말린 뒤 참기름·간장에 볶아낸 소박한 나물 반찬이에요. 산과 밭의 향이 한 젓가락에 그대로 배어 있어요.",
          ja: "済州の野原で採ったワラビを塩茹でして乾燥させた後、ごま油・醤油で炒めた素朴なナムルのおかずです。山と畑の香りが一箸に染みています。",
          en: "Bracken gathered from Jeju's fields, salt-blanched and dried, then sautéed in sesame oil and soy sauce — a humble namul. The scent of hills and fields clings to every bite."
        },
        ingredients: { ko: ["마른 고사리", "참기름", "간장", "마늘", "대파", "참깨", "들기름", "고춧가루"], ja: ["干しワラビ", "ごま油", "醤油", "ニンニク", "長ネギ", "ゴマ", "エゴマ油", "唐辛子粉"], en: ["Dried bracken", "Sesame oil", "Soy sauce", "Garlic", "Green onion", "Sesame", "Perilla oil", "Chili powder"] },
        tags: ["나물", "고사리", "제주밭"],
        dupes: {
          JP: [
        { name: { ko: "와라비 이타메", ja: "ワラビ炒め", en: "Warabi Itame" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 65, sour: 5 }, description: { ko: "와라비(고사리)를 간장·참기름에 볶은 일본식 산채 볶음", ja: "ワラビを醤油・ごま油で炒めた日本式山菜炒め", en: "Japanese sautéed bracken with soy sauce and sesame oil" }, ingredients: { ko: ["와라비", "간장", "미림", "참기름", "가쓰오부시", "참깨"], ja: ["ワラビ", "醤油", "みりん", "ごま油", "かつお節", "ゴマ"], en: ["Warabi", "Soy sauce", "Mirin", "Sesame oil", "Bonito", "Sesame"] }, similarityPercent: 87, matchReason: { ko: "고사리를 간장 양념에 볶아내는 거의 동일한 요리", ja: "ワラビを醤油タレで炒めるほぼ同じ料理", en: "Sautéed bracken — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "촤이 차오", ja: "蕨菜炒め", en: "Jue Cai Chao" }, tasteProfile: { sweet: 5, salty: 50, spicy: 15, umami: 65, sour: 5 }, description: { ko: "고사리를 마늘과 참기름에 볶아낸 중국 남부식 산채 볶음", ja: "ワラビをニンニクとごま油で炒めた中国南部式山菜炒め", en: "Southern Chinese sautéed bracken with garlic and sesame oil" }, ingredients: { ko: ["고사리", "마늘", "참기름", "간장", "대파", "고추"], ja: ["ワラビ", "ニンニク", "ごま油", "醤油", "長ネギ", "唐辛子"], en: ["Bracken", "Garlic", "Sesame oil", "Soy sauce", "Green onion", "Chili"] }, similarityPercent: 82, matchReason: { ko: "고사리를 간장·마늘에 볶는 동아시아 공통 요리", ja: "ワラビを醤油・ニンニクで炒める東アジア共通料理", en: "Bracken stir-fry — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-jeopjjak-bbyeoguk",
        image: "",
        name: { ko: "접짝뼈국", ja: "ジョプチャク骨スープ", en: "Jeopjjak Bbyeoguk (Pork Cartilage Soup)" },
        region: "jeju",
        tasteProfile: { sweet: 10, salty: 55, spicy: 20, umami: 90, sour: 5 },
        storyDescription: {
          ko: "제주 흑돼지의 갈비와 접짝뼈(연골)를 메밀 국수와 함께 오래 고아낸 제주 잔칫날 귀한 국물이에요. 뽀얀 국물과 쫄깃한 연골의 감칠맛이 섬 잔치의 정성을 보여줘요.",
          ja: "済州の黒豚のカルビと軟骨をそば粉と共に長時間煮込む済州の宴会の貴重なスープです。白く濁ったスープとプリプリの軟骨の旨味が島の宴の真心を示します。",
          en: "Jeju black pork ribs and cartilage slow-simmered with buckwheat flour — a treasured banquet soup. Milky broth and chewy cartilage reveal the devotion of island celebrations."
        },
        ingredients: { ko: ["돼지 갈비", "돼지 연골", "메밀가루", "무", "대파", "마늘", "된장", "소금"], ja: ["豚カルビ", "豚軟骨", "そば粉", "大根", "長ネギ", "ニンニク", "味噌", "塩"], en: ["Pork ribs", "Pork cartilage", "Buckwheat flour", "Radish", "Green onion", "Garlic", "Doenjang", "Salt"] },
        tags: ["제주잔치", "흑돼지", "뼈국"],
        dupes: {
          JP: [
        { name: { ko: "돈코츠 스푸", ja: "豚骨スープ", en: "Tonkotsu Soup" }, tasteProfile: { sweet: 10, salty: 60, spicy: 5, umami: 90, sour: 5 }, description: { ko: "돼지 뼈를 오래 고아 뽀얗게 만든 일본식 돈코츠 국물", ja: "豚骨を長時間煮込んで白濁させた日本式豚骨スープ", en: "Japanese milky pork bone broth simmered long hours" }, ingredients: { ko: ["돼지 등뼈", "돼지 연골", "마늘", "생강", "파", "소금"], ja: ["豚背骨", "豚軟骨", "ニンニク", "生姜", "ネギ", "塩"], en: ["Pork back bone", "Pork cartilage", "Garlic", "Ginger", "Green onion", "Salt"] }, similarityPercent: 85, matchReason: { ko: "돼지 뼈와 연골을 오래 끓여 뽀얀 국물을 만드는 거의 동일한 요리", ja: "豚骨と軟骨を長時間煮込んで白濁スープを作るほぼ同じ料理", en: "Pork bone milky broth — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "파이구 롼구", ja: "排骨軟骨湯", en: "Paigu Ruan Gu Tang" }, tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 90, sour: 5 }, description: { ko: "돼지 갈비와 연골을 오래 고아낸 중국식 뽀얀 뼈 국물", ja: "豚カルビと軟骨を長時間煮込む中国式白濁骨スープ", en: "Chinese slow-simmered pork rib and cartilage milky broth" }, ingredients: { ko: ["돼지 갈비", "연골", "무", "생강", "대파", "소금"], ja: ["豚カルビ", "軟骨", "大根", "生姜", "長ネギ", "塩"], en: ["Pork ribs", "Cartilage", "Radish", "Ginger", "Green onion", "Salt"] }, similarityPercent: 83, matchReason: { ko: "돼지 뼈·연골을 함께 오래 끓여내는 공통 요리", ja: "豚骨・軟骨を共に長時間煮込む共通料理", en: "Pork bone cartilage broth — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-dwaeji-kimchi-bokkeum",
        image: "",
        name: { ko: "흑돼지 김치볶음", ja: "黒豚キムチ炒め", en: "Heuk Dwaeji Kimchi Bokkeum" },
        region: "jeju",
        tasteProfile: { sweet: 15, salty: 55, spicy: 60, umami: 85, sour: 25 },
        storyDescription: {
          ko: "제주 흑돼지와 묵은 김치를 센 불에 함께 볶아낸 불향 가득한 제주식 집밥 반찬이에요. 발효된 김치의 산미와 흑돼지의 고소함이 폭발적으로 어우러져요.",
          ja: "済州の黒豚と熟成キムチを強火で一緒に炒めた炎の香り満載の済州式家庭のおかずです。発酵したキムチの酸味と黒豚の香ばしさが爆発的に調和します。",
          en: "Jeju black pork and aged kimchi wok-fired together — a home-style dish heavy with charcoal aroma. Fermented kimchi's tang and black pork's richness explode in harmony."
        },
        ingredients: { ko: ["흑돼지 삼겹살", "묵은 김치", "대파", "마늘", "고춧가루", "설탕", "참기름", "간장"], ja: ["黒豚バラ肉", "熟成キムチ", "長ネギ", "ニンニク", "唐辛子粉", "砂糖", "ごま油", "醤油"], en: ["Black pork belly", "Aged kimchi", "Green onion", "Garlic", "Chili powder", "Sugar", "Sesame oil", "Soy sauce"] },
        tags: ["흑돼지", "김치볶음", "집밥"],
        dupes: {
          JP: [
        { name: { ko: "부타 킴치 이타메", ja: "豚キムチ炒め", en: "Buta Kimuchi Itame" }, tasteProfile: { sweet: 15, salty: 55, spicy: 50, umami: 85, sour: 25 }, description: { ko: "돼지고기와 김치를 간장·미림에 센 불로 볶아낸 일본식 퓨전 볶음", ja: "豚肉とキムチを醤油・みりんで強火で炒めた日本式フュージョン炒め", en: "Japanese fusion stir-fry of pork and kimchi in soy-mirin" }, ingredients: { ko: ["돼지고기", "김치", "간장", "미림", "대파", "참기름"], ja: ["豚肉", "キムチ", "醤油", "みりん", "長ネギ", "ごま油"], en: ["Pork", "Kimchi", "Soy sauce", "Mirin", "Green onion", "Sesame oil"] }, similarityPercent: 83, matchReason: { ko: "돼지와 김치를 센 불에 볶는 거의 동일한 요리", ja: "豚とキムチを強火で炒めるほぼ同じ料理", en: "Pork kimchi stir-fry — close Japanese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "파오차이 차오 러우", ja: "泡菜炒肉", en: "Paocai Chao Rou" }, tasteProfile: { sweet: 10, salty: 55, spicy: 45, umami: 85, sour: 30 }, description: { ko: "발효 채소(파오차이)와 돼지고기를 센 불에 볶아낸 중국 사천식 볶음", ja: "発酵野菜（泡菜）と豚肉を強火で炒めた中国四川式炒め", en: "Sichuan stir-fry of fermented paocai and pork" }, ingredients: { ko: ["돼지고기", "파오차이", "두반장", "대파", "마늘", "고추"], ja: ["豚肉", "泡菜", "豆板醤", "長ネギ", "ニンニク", "唐辛子"], en: ["Pork", "Paocai", "Doubanjiang", "Green onion", "Garlic", "Chili"] }, similarityPercent: 85, matchReason: { ko: "발효 채소와 돼지고기를 센 불에 볶는 거의 동일한 요리", ja: "発酵野菜と豚肉を強火で炒めるほぼ同じ料理", en: "Pickled veg and pork — close Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "jeju-galchi-gui",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/jeju-galchi-gui.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "갈치구이", ja: "タチウオ焼き", en: "Galchi Gui (Grilled Hairtail)" },
        region: "jeju",
        tasteProfile: { sweet: 5, salty: 65, spicy: 10, umami: 85, sour: 5 },
        storyDescription: {
          ko: "제주 먼 바다에서 잡은 은빛 갈치를 굵은 소금을 뿌려 숯불에 구워낸 제주 대표 생선구이예요. 촉촉한 살결과 바삭한 껍질이 흰 쌀밥 한 그릇을 순식간에 비우게 해요.",
          ja: "済州の沖で獲れた銀色のタチウオに粗塩をふって炭火で焼いた済州代表の焼き魚です。しっとりとした身とパリッとした皮が白米一杯をあっという間に空にします。",
          en: "Silver hairtail caught in Jeju's offshore waters, salted and charcoal-grilled — the island's flagship grilled fish. Moist flesh and crispy skin empty a bowl of white rice in no time."
        },
        ingredients: { ko: ["갈치", "굵은 소금", "들기름", "레몬", "무", "간장", "대파", "후추"], ja: ["タチウオ", "粗塩", "エゴマ油", "レモン", "大根", "醤油", "長ネギ", "胡椒"], en: ["Hairtail", "Coarse salt", "Perilla oil", "Lemon", "Radish", "Soy sauce", "Green onion", "Pepper"] },
        tags: ["갈치", "구이", "제주대표"],
        dupes: {
          JP: [
        { name: { ko: "타치우오 시오야키", ja: "太刀魚の塩焼き", en: "Tachiuo Shioyaki" }, tasteProfile: { sweet: 5, salty: 65, spicy: 5, umami: 85, sour: 5 }, description: { ko: "갈치에 소금을 뿌려 그릴에 구운 일본 가정식 생선구이", ja: "太刀魚に塩をふってグリルで焼いた日本の家庭料理", en: "Japanese home-style salt-grilled hairtail" }, ingredients: { ko: ["갈치", "소금", "무간 것", "간장", "레몬"], ja: ["太刀魚", "塩", "大根おろし", "醤油", "レモン"], en: ["Hairtail", "Salt", "Grated daikon", "Soy sauce", "Lemon"] }, similarityPercent: 88, matchReason: { ko: "갈치를 소금으로 굽는 거의 동일한 요리", ja: "太刀魚を塩で焼くほぼ同じ料理", en: "Salt-grilled hairtail — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "샤오 다이위", ja: "烤帯魚", en: "Kao Dai Yu" }, tasteProfile: { sweet: 5, salty: 55, spicy: 25, umami: 85, sour: 5 }, description: { ko: "갈치에 쯔란과 고춧가루를 뿌려 숯불에 구운 중국식 갈치구이", ja: "太刀魚にクミン・唐辛子粉をふって炭火で焼いた中国式タチウオ焼き", en: "Chinese grilled hairtail with cumin and chili powder" }, ingredients: { ko: ["갈치", "쯔란", "고춧가루", "간장", "마늘", "참기름"], ja: ["太刀魚", "クミン", "唐辛子粉", "醤油", "ニンニク", "ごま油"], en: ["Hairtail", "Cumin", "Chili powder", "Soy sauce", "Garlic", "Sesame oil"] }, similarityPercent: 75, matchReason: { ko: "갈치에 향신료를 뿌려 구워내는 공통점", ja: "太刀魚にスパイスをふって焼く共通点", en: "Spiced grilled hairtail — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      }
    ]
  },
  {
    code: "busan",
    name: { ko: "부산", ja: "釜山", en: "Busan" },
    icon: "🌉",
    image: "/images/village/busan.jpg",
    description: { ko: "항구 도시의 호쾌한 맛", ja: "港町の豪快な味", en: "Bold flavors of the port city" },
    foods: [
      {
        id: "busan-pork-soup",
        name: { ko: "돼지국밥", ja: "豚クッパ", en: "Pork Rice Soup" },
        region: "busan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-pork-soup.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-IR 스튜디오",
        tasteProfile: { sweet: 10, salty: 55, spicy: 30, umami: 90, sour: 5 },
        storyDescription: {
          ko: "부산 시민들의 새벽을 여는 돼지국밥은 진하고 뽀얀 국물 속에 부드러운 수육이 담겨 있어요. 부추와 새우젓을 곁들여 기호에 맞게 먹는 이 한 그릇이 항구 도시의 하루를 힘차게 시작시켜줘요.",
          ja: "釜山市民の夜明けを開く豚クッパは、濃厚な乳白色のスープの中に柔らかい煮豚が入っています。ニラとアミの塩辛を添えて好みに合わせて食べるこの一杯が、港町の一日を元気よく始めさせてくれます。",
          en: "Pork rice soup opens the dawn for Busan's citizens — tender braised pork afloat in deep, milky broth. Seasoned to your own taste with chives and salted shrimp, this single bowl launches a port-city day with power."
        },
        ingredients: {
          ko: ["돼지 뼈", "돼지고기", "밥", "부추", "새우젓", "대파", "마늘", "소금"],
          ja: ["豚骨", "豚肉", "ご飯", "ニラ", "アミの塩辛", "長ネギ", "ニンニク", "塩"],
          en: ["Pork bone", "Pork", "Rice", "Chive", "Salted shrimp", "Green onion", "Garlic", "Salt"]
        },
        tags: ["국밥", "아침", "부산"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "busan-milmyeon",
        name: { ko: "밀면", ja: "ミルミョン", en: "Milmyeon" },
        region: "busan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/busan-milmyeon.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-디엔에이스튜디오",
        tasteProfile: { sweet: 20, salty: 50, spicy: 40, umami: 70, sour: 45 },
        storyDescription: {
          ko: "한국전쟁 피난민들이 부산에서 탄생시킨 밀면은 물냉면과 비슷하지만 면발이 밀가루라 더 쫄깃해요. 차갑고 새콤달콤 매콤한 육수 속에 쫄깃한 면이 어우러진 맛은 피난민들의 강인한 삶을 닮았어요.",
          ja: "朝鮮戦争の避難民が釜山で生み出したミルミョンは、冷麺に似ていますが麺が小麦粉なのでよりもちもちです。冷たく甘酸っぱいピリ辛のスープの中でもちもちの麺が絡み合う味は、避難民たちの強い生き方に似ています。",
          en: "Born in Busan by Korean War refugees, milmyeon resembles mul-naengmyeon but the wheat noodles are even chewier. The cold, tangy-sweet-spicy broth with those springy noodles tastes as resilient as the refugees who created it."
        },
        ingredients: {
          ko: ["밀가루면", "육수", "고추장", "식초", "설탕", "오이", "달걀", "겨자"],
          ja: ["小麦粉麺", "スープ", "コチュジャン", "酢", "砂糖", "きゅうり", "卵", "マスタード"],
          en: ["Wheat noodles", "Broth", "Gochujang", "Vinegar", "Sugar", "Cucumber", "Egg", "Mustard"]
        },
        tags: ["냉면", "부산", "피난"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "busan-hotteok",
        name: { ko: "씨앗호떡", ja: "シアッホットク", en: "Ssiat Hotteok" },
        region: "busan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/busan-hotteok.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        tasteProfile: { sweet: 65, salty: 15, spicy: 0, umami: 25, sour: 5 },
        storyDescription: {
          ko: "바삭한 반죽 안에 달콤한 흑설탕과 씨앗이 가득 들어 있는 부산 국제시장의 명물이에요. 뜨거운 기름에서 갓 꺼낸 호떡 안에서 달달한 시럽이 흘러나올 때의 행복감은 부산 여행의 가장 달콤한 순간이에요.",
          ja: "カリカリの生地の中に甘い黒砂糖と種がたっぷり入った釜山の国際市場の名物です。熱い油から取り出したばかりのホットクの中から甘いシロップが流れ出る時の幸福感は、釜山旅行で最も甘い瞬間です。",
          en: "Busan's Gukje Market treasure — crispy dough packed with sweet brown sugar and mixed seeds. When hot sweet syrup flows from a freshly fried hotteok, it is the most blissfully sweet moment of any Busan trip."
        },
        ingredients: {
          ko: ["밀가루", "흑설탕", "해바라기씨", "땅콩", "잣", "계피", "이스트", "식용유"],
          ja: ["小麦粉", "黒砂糖", "ひまわりの種", "ピーナッツ", "松の実", "シナモン", "イースト", "食用油"],
          en: ["Flour", "Brown sugar", "Sunflower seeds", "Peanuts", "Pine nuts", "Cinnamon", "Yeast", "Cooking oil"]
        },
        tags: ["길거리", "디저트", "시장"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "busan-mul-tteok",
        name: { ko: "물떡", ja: "ムルトク", en: "Mul-tteok" },
        region: "busan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/busan-mul-tteok.jpeg",
        tasteProfile: { sweet: 15, salty: 55, spicy: 30, umami: 70, sour: 10 },
        storyDescription: {
          ko: "부산 포장마차에서 뜨거운 어묵 국물 속에 동동 떠다니는 물떡은 추운 날 최고의 위로예요. 국물 한 국자 마시고 말랑한 떡을 오물거리면 부산 사람들의 정이 온몸에 퍼지는 것 같아요.",
          ja: "釜山の屋台で熱いおでんスープの中にぷかぷか浮かぶムルトクは、寒い日の最高の慰めです。スープをひと杯飲んで柔らかいお餅をもぐもぐすると、釜山の人々の温もりが全身に広がるようです。",
          en: "Mul-tteok bobbing in hot fish-cake broth at a Busan pojang-macha is the finest comfort on a cold day. Sip the broth, then chew the pillowy cake and the warmth of Busan's people seems to spread through your whole body."
        },
        ingredients: {
          ko: ["가래떡", "어묵 국물", "간장", "대파", "마늘", "고추"],
          ja: ["ガレトク", "おでんスープ", "醤油", "長ネギ", "ニンニク", "唐辛子"],
          en: ["Garaetteok rice cake", "Fish cake broth", "Soy sauce", "Green onion", "Garlic", "Chili"]
        },
        tags: ["떡", "포장마차", "어묵"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "busan-naengchae-jokbal",
        name: { ko: "냉채족발", ja: "冷菜チョクパル", en: "Naengchae Jokbal" },
        region: "busan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/busan-naengchae-jokbal.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-김효서",
        tasteProfile: { sweet: 20, salty: 50, spicy: 30, umami: 75, sour: 45 },
        storyDescription: {
          ko: "쫄깃한 족발을 차갑게 식혀 겨자 소스와 새콤달콤한 드레싱으로 버무린 여름 별미예요. 아삭한 채소와 탱글한 고기의 대비가 짜릿하고, 새콤한 소스가 더위를 싹 날려줘요.",
          ja: "もちもちのチョクパルを冷やしてマスタードソースと甘酸っぱいドレッシングで和えた夏の珍味です。シャキシャキの野菜とぷりぷりのお肉のコントラストがスリリングで、酸っぱいソースが暑さをさっと吹き飛ばします。",
          en: "Chilled pork trotter dressed in mustard sauce and sweet-sour dressing — a prized summer dish. The crunch of fresh vegetables against the springy meat is thrilling, and the sour sauce banishes the heat instantly."
        },
        ingredients: {
          ko: ["돼지 족발", "겨자", "식초", "설탕", "오이", "당근", "상추", "참기름"],
          ja: ["豚足", "マスタード", "酢", "砂糖", "きゅうり", "人参", "サンチュ", "ごま油"],
          en: ["Pork trotters", "Mustard", "Vinegar", "Sugar", "Cucumber", "Carrot", "Lettuce", "Sesame oil"]
        },
        tags: ["족발", "냉채", "여름"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "busan-grilled-clams",
        name: { ko: "조개구이", ja: "貝の焼き物", en: "Grilled Clams" },
        region: "busan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/busan-grilled-clams.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-천준교",
        tasteProfile: { sweet: 15, salty: 55, spicy: 20, umami: 90, sour: 10 },
        storyDescription: {
          ko: "부산 해변가 포장마차에서 불판 위에 조개를 올리면 지글지글 끓는 조개 국물 향이 바닷바람과 섞여 황홀해요. 입 벌린 조개 안에 고인 진한 바다 국물 한 모금이 부산 바다를 통째로 삼키는 기분이에요.",
          ja: "釜山の海辺の屋台で焼き網に貝をのせると、ジュージュー煮える貝汁の香りが潮風と混じって陶酔的です。口を開けた貝の中に溜まった濃い海のスープのひと口が、釜山の海をまるごと飲み込む気分です。",
          en: "At a Busan beachside pojang-macha, clams grilling on the iron grate release steam that mingles with the sea breeze in a heavenly way. A sip of the concentrated ocean juice pooled inside an opened shell feels like swallowing the entire Busan sea."
        },
        ingredients: {
          ko: ["조개", "소라", "키조개", "굴", "버터", "마늘", "소금", "청주"],
          ja: ["アサリ", "サザエ", "タイラギ", "牡蛎", "バター", "ニンニク", "塩", "清酒"],
          en: ["Clams", "Turban shell", "Pen shell", "Oyster", "Butter", "Garlic", "Salt", "Sake"]
        },
        tags: ["조개", "구이", "해변"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "busan-eomuk",
        name: { ko: "어묵", ja: "おでん（釜山式）", en: "Eomuk" },
        region: "busan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-eomuk.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        tasteProfile: { sweet: 15, salty: 55, spicy: 20, umami: 80, sour: 5 },
        storyDescription: {
          ko: "부산 어묵은 전국에서 가장 유명해요. 신선한 생선살을 갈아 다양한 모양으로 만든 뒤 진한 국물에 끓여내면 쫄깃하고 감칠맛 나는 부산 대표 길거리 음식이 완성돼요.",
          ja: "釜山のおでんは全国で最も有名です。新鮮な魚の身を挽いて様々な形に成形してから濃厚なスープで煮ると、もちもちで旨味あふれる釜山の代表的な屋台料理が完成します。",
          en: "Busan's eomuk is the most famous in all of Korea. Fresh fish ground and shaped into various forms, then simmered in rich broth — the result is a chewy, umami-packed signature Busan street food."
        },
        ingredients: {
          ko: ["흰살 생선", "전분", "달걀", "소금", "설탕", "마늘", "파", "당근"],
          ja: ["白身魚", "でんぷん", "卵", "塩", "砂糖", "ニンニク", "ネギ", "人参"],
          en: ["White fish", "Starch", "Egg", "Salt", "Sugar", "Garlic", "Green onion", "Carrot"]
        },
        tags: ["어묵", "길거리", "부산명물"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "busan-bibim-dangmyeon",
        name: { ko: "비빔당면", ja: "ビビムタンミョン", en: "Bibim Dangmyeon" },
        region: "busan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/busan-bibim-dangmyeon.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-부산관광공사",
        tasteProfile: { sweet: 30, salty: 50, spicy: 55, umami: 65, sour: 30 },
        storyDescription: {
          ko: "투명한 당면을 매콤달콤한 양념에 버무린 비빔당면은 부산 분식집의 숨겨진 보물이에요. 쫄깃한 면발에 양념이 쏙쏙 배어들어 한 젓가락이 두 젓가락, 두 젓가락이 한 그릇이 되는 마법이 일어나요.",
          ja: "透き通った春雨を甘辛い薬念で和えたビビムタンミョンは、釜山の粉食店の隠れた宝です。もちもちの麺に薬念がしみ込んで、一箸が二箸、二箸が一杯になる魔法が起こります。",
          en: "Translucent glass noodles tossed in sweet-spicy sauce — the hidden treasure of Busan's snack shops. The sauce seeps deep into every chewy strand and a magic occurs: one chopstick-full becomes two, two becomes a whole bowl."
        },
        ingredients: {
          ko: ["당면", "고추장", "간장", "설탕", "식초", "참기름", "파", "깨"],
          ja: ["春雨", "コチュジャン", "醤油", "砂糖", "酢", "ごま油", "ネギ", "ごま"],
          en: ["Glass noodles", "Gochujang", "Soy sauce", "Sugar", "Vinegar", "Sesame oil", "Green onion", "Sesame"]
        },
        tags: ["당면", "비빔", "분식"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "busan-gopchang",
        name: { ko: "양곱창", ja: "ヤンコプチャン", en: "Yang Gopchang" },
        region: "busan",
        image: "",
        tasteProfile: { sweet: 15, salty: 55, spicy: 35, umami: 90, sour: 10 },
        storyDescription: {
          ko: "불판 위에서 기름이 튀며 구워지는 양곱창의 고소하고 진한 향은 저항할 수 없는 유혹이에요. 처음엔 낯설어도 한 점 먹기 시작하면 멈출 수가 없는, 부산 야식 문화의 진수랍니다.",
          ja: "焼き網の上で油が弾けながら焼けるヤンコプチャンの香ばしく濃厚な香りは、抗えない誘惑です。最初は馴染めなくても一口食べ始めたら止まらない、釜山の夜食文化の真髄です。",
          en: "The rich, nutty aroma of gopchang spattering and sizzling on the grill is an irresistible temptation. Strange at first, but once you take one piece you cannot stop — this is the very soul of Busan's night-food culture."
        },
        ingredients: {
          ko: ["소곱창", "양", "부추", "마늘", "소금", "참기름", "고추장", "깨"],
          ja: ["牛もつ", "牛の胃袋", "ニラ", "ニンニク", "塩", "ごま油", "コチュジャン", "ごま"],
          en: ["Beef intestines", "Beef tripe", "Chive", "Garlic", "Salt", "Sesame oil", "Gochujang", "Sesame"]
        },
        tags: ["곱창", "야식", "구이"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "busan-nakgopsae",
        name: { ko: "낙곱새", ja: "ナクコプセ", en: "Nakgopsae" },
        region: "busan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/busan-nakgopsae.jpeg",
        tasteProfile: { sweet: 15, salty: 55, spicy: 70, umami: 90, sour: 10 },
        storyDescription: {
          ko: "낙지, 곱창, 새우 세 가지를 한 냄비에 넣고 매콤하게 볶아낸 낙곱새는 부산 야식의 트리플 크라운이에요. 세 가지 바다 재료가 뿜어내는 시너지는 한 가지만 먹을 때보다 배로 맛있어요.",
          ja: "タコ、もつ、海老の三つを一鍋に入れて辛く炒めたナクコプセは、釜山の夜食のトリプルクラウンです。三つの海の食材が放つシナジーは、一つだけ食べる時より倍の美味しさです。",
          en: "Octopus, gopchang, and shrimp stir-fried together in spicy sauce — nakgopsae is the triple crown of Busan's night eating. The synergy of three ocean ingredients doubles the flavor of any one alone."
        },
        ingredients: {
          ko: ["낙지", "소곱창", "새우", "고추장", "고춧가루", "마늘", "대파", "참기름"],
          ja: ["タコ", "牛もつ", "海老", "コチュジャン", "唐辛子粉", "ニンニク", "長ネギ", "ごま油"],
          en: ["Octopus", "Beef intestines", "Shrimp", "Gochujang", "Chili powder", "Garlic", "Green onion", "Sesame oil"]
        },
        tags: ["해산물", "곱창", "야식"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "busan-hwae",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/busan-hwae.jpeg",
        name: { ko: "활어회", ja: "活魚刺身", en: "Live Fish Sashimi" },
        region: "busan",
        tasteProfile: { sweet: 10, salty: 40, spicy: 20, umami: 75, sour: 20 },
        storyDescription: {
          ko: "자갈치 시장에서 바로 뜬 광어·우럭을 얇게 썰어 상추와 깻잎에 쌈장과 함께 싸 먹어요. 탱글한 식감과 바다 향이 입 안에서 부딪히는 순간, 부산 포구의 바람이 찾아와요.",
          ja: "チャガルチ市場でさばいたばかりのヒラメ・ウロクの刺身を、サンチュとエゴマの葉にサムジャンと共に包んで食べます。プリプリの食感と海の香りが口の中でぶつかる瞬間、釜山の港の風が訪れます。",
          en: "Flounder and rockfish sliced straight from Jagalchi Market, wrapped in lettuce and perilla leaves with ssamjang. The snap of live-fresh flesh and the sea's aroma collide — and suddenly the wind of Busan harbor arrives."
        },
        ingredients: { ko: ["광어", "우럭", "상추", "깻잎", "쌈장", "와사비", "간장", "레몬"], ja: ["ヒラメ", "ウロク", "サンチュ", "エゴマの葉", "サムジャン", "わさび", "醤油", "レモン"], en: ["Flounder", "Rockfish", "Lettuce", "Perilla leaf", "Ssamjang", "Wasabi", "Soy sauce", "Lemon"] },
        tags: ["회", "자갈치", "항구"],
        dupes: {
          JP: [
        { name: { ko: "사시미", ja: "刺身", en: "Sashimi" }, tasteProfile: { sweet: 5, salty: 40, spicy: 5, umami: 80, sour: 10 }, description: { ko: "신선한 생선회를 얇게 썰어 간장·와사비와 함께 먹는 일본 전통 요리", ja: "新鮮な魚を薄く切って醤油・わさびと共に食べる日本の伝統料理", en: "Japanese traditional dish of thinly sliced raw fish with soy and wasabi" }, ingredients: { ko: ["참치", "방어", "광어", "간장", "와사비", "생강초"], ja: ["マグロ", "ハマチ", "ヒラメ", "醤油", "わさび", "ガリ"], en: ["Tuna", "Yellowtail", "Flounder", "Soy sauce", "Wasabi", "Pickled ginger"] }, similarityPercent: 88, matchReason: { ko: "신선한 생선을 얇게 썰어 간장·와사비에 찍어 먹는 거의 동일한 요리", ja: "新鮮な魚を薄く切って醤油・わさびに付けて食べるほぼ同じ料理", en: "Thin-sliced raw fish with soy and wasabi — nearly identical concept" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "위 셩", ja: "魚生", en: "Yu Sheng" }, tasteProfile: { sweet: 20, salty: 45, spicy: 10, umami: 70, sour: 25 }, description: { ko: "얇게 썬 생선에 채소와 향신료를 함께 섞어 먹는 중국 남부식 회", ja: "薄切りの魚に野菜と薬味を混ぜて食べる中国南部式の刺身", en: "Southern Chinese raw fish salad mixed with vegetables and spices" }, ingredients: { ko: ["삼치회", "당근", "무", "땅콩", "매실장", "생강"], ja: ["サワラ刺身", "人参", "大根", "ピーナッツ", "梅醤", "生姜"], en: ["Sliced mackerel", "Carrot", "Daikon", "Peanut", "Plum sauce", "Ginger"] }, similarityPercent: 75, matchReason: { ko: "얇게 썬 회에 채소·양념을 섞어 먹는 동아시아 공통 형태", ja: "薄切りの刺身に野菜・調味料を混ぜて食べる東アジア共通の形", en: "Sliced raw fish with veggies and sauce — East Asian counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "busan-agujjim",
        image: "",
        name: { ko: "아구찜", ja: "アグチム", en: "Agujjim (Spicy Braised Monkfish)" },
        region: "busan",
        tasteProfile: { sweet: 15, salty: 55, spicy: 85, umami: 75, sour: 5 },
        storyDescription: {
          ko: "아구와 콩나물, 미나리를 고춧가루 양념에 듬뿍 버무려 센 불에 찌듯 볶아낸 부산의 매운 별미예요. 쫀득한 아구살과 아삭한 콩나물이 입 안에서 얼얼한 축제를 벌여요.",
          ja: "アンコウともやし、セリを唐辛子粉の調味料でたっぷり和えて強火で蒸し炒めにした釜山の辛い逸品です。プリプリのアンコウの身とシャキシャキもやしが口の中でしびれる祭りを繰り広げます。",
          en: "Monkfish with bean sprouts and dropwort tossed in fiery chili and flash-braised until the sauce clings — Busan's spicy centerpiece. The chewy fish and crunchy sprouts stage a tingling festival in your mouth."
        },
        ingredients: { ko: ["아구", "콩나물", "미나리", "고춧가루", "고추장", "마늘", "대파", "전분"], ja: ["アンコウ", "もやし", "セリ", "唐辛子粉", "コチュジャン", "ニンニク", "長ネギ", "でんぷん"], en: ["Monkfish", "Bean sprouts", "Dropwort", "Chili powder", "Gochujang", "Garlic", "Green onion", "Starch"] },
        tags: ["매운맛", "찜", "아구"],
        dupes: {
          JP: [
        { name: { ko: "안코우 나베", ja: "鮟鱇鍋", en: "Ankō Nabe" }, tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 85, sour: 5 }, description: { ko: "아구와 채소를 간장 국물에 끓여 먹는 일본식 겨울 전골", ja: "アンコウと野菜を醤油スープで煮込んだ日本式冬の鍋", en: "Japanese winter hot pot of monkfish and vegetables in soy broth" }, ingredients: { ko: ["아구", "배추", "두부", "파", "간장", "가쓰오 다시"], ja: ["アンコウ", "白菜", "豆腐", "ネギ", "醤油", "かつおだし"], en: ["Monkfish", "Napa cabbage", "Tofu", "Green onion", "Soy sauce", "Dashi"] }, similarityPercent: 72, matchReason: { ko: "아구를 주인공으로 채소와 함께 뜨겁게 익혀내는 요리", ja: "アンコウを主役に野菜と共に熱々に仕上げる料理", en: "Monkfish-centered hot dish — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "마라 위 피엔", ja: "麻辣魚片", en: "Mala Yu Pian" }, tasteProfile: { sweet: 10, salty: 55, spicy: 80, umami: 75, sour: 5 }, description: { ko: "생선 살을 얇게 썰어 마라 국물에 데친 매운 사천 요리", ja: "魚の身を薄く切って麻辣スープで茹でた辛い四川料理", en: "Sichuan dish of sliced fish poached in fiery mala broth" }, ingredients: { ko: ["흰살 생선", "화자오", "두반장", "마늘", "숙주", "고추기름"], ja: ["白身魚", "花椒", "豆板醤", "ニンニク", "もやし", "ラー油"], en: ["White fish", "Sichuan pepper", "Doubanjiang", "Garlic", "Bean sprouts", "Chili oil"] }, similarityPercent: 73, matchReason: { ko: "생선과 숙주를 매운 양념과 함께 뜨겁게 익히는 방식", ja: "魚ともやしを辛い調味料と共に熱々に仕上げる方式", en: "Fish and bean sprouts in fiery sauce — Sichuan counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "busan-saengseon-gui",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-saengseon-gui.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        name: { ko: "생선구이", ja: "焼き魚", en: "Grilled Fish" },
        region: "busan",
        tasteProfile: { sweet: 5, salty: 65, spicy: 15, umami: 80, sour: 5 },
        storyDescription: {
          ko: "자갈치 시장에서 바로 잡은 고등어·갈치·조기를 굵은 소금만 뿌려 숯불에 구워내는 부산의 아침상이에요. 껍질은 바삭하고 속살은 촉촉한 한 젓가락에 바다 내음이 가득 피어올라요.",
          ja: "チャガルチ市場で獲れたばかりのサバ・タチウオ・イシモチに粗塩だけを振って炭火で焼き上げる釜山の朝食です。皮はパリッと、身はしっとり。一口ごとに海の香りが立ち上ります。",
          en: "Mackerel, hairtail and croaker fresh from Jagalchi Market, salted simply and grilled over charcoal — Busan's breakfast plate. Crispy skin, moist flesh, and every bite brings the sea."
        },
        ingredients: { ko: ["고등어", "갈치", "굵은 소금", "들기름", "무", "간장", "레몬"], ja: ["サバ", "タチウオ", "粗塩", "エゴマ油", "大根", "醤油", "レモン"], en: ["Mackerel", "Hairtail", "Sea salt", "Perilla oil", "Radish", "Soy sauce", "Lemon"] },
        tags: ["구이", "생선", "자갈치"],
        dupes: {
          JP: [
        { name: { ko: "사바 시오야키", ja: "鯖の塩焼き", en: "Saba Shioyaki" }, tasteProfile: { sweet: 5, salty: 65, spicy: 5, umami: 80, sour: 5 }, description: { ko: "고등어에 소금을 뿌려 구운 일본 가정식 생선구이", ja: "サバに塩を振って焼いた日本の家庭料理", en: "Japanese home-style salt-grilled mackerel" }, ingredients: { ko: ["고등어", "소금", "무간 것", "간장", "레몬"], ja: ["サバ", "塩", "大根おろし", "醤油", "レモン"], en: ["Mackerel", "Salt", "Grated daikon", "Soy sauce", "Lemon"] }, similarityPercent: 88, matchReason: { ko: "고등어에 소금만 뿌려 구운 거의 동일한 요리", ja: "サバに塩だけを振って焼くほぼ同じ料理", en: "Salt-grilled mackerel — nearly identical dish" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "카오 위", ja: "烤魚", en: "Kao Yu" }, tasteProfile: { sweet: 10, salty: 55, spicy: 35, umami: 75, sour: 5 }, description: { ko: "생선 한 마리를 향신료로 덮어 숯불에 구워낸 중국식 구이", ja: "魚一匹をスパイスで覆って炭火で焼いた中国式焼き魚", en: "Chinese whole-fish grill covered in aromatic spice rub" }, ingredients: { ko: ["붕어", "화자오", "고추", "마늘", "대파", "기름"], ja: ["フナ", "花椒", "唐辛子", "ニンニク", "長ネギ", "油"], en: ["Carp", "Sichuan pepper", "Chili", "Garlic", "Green onion", "Oil"] }, similarityPercent: 72, matchReason: { ko: "생선을 통째로 숯불에 굽는 전통", ja: "魚を丸ごと炭火で焼く伝統", en: "Whole-fish charcoal grilling — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "busan-haemul-jjamppong",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-haemul-jjamppong.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
        name: { ko: "해물짬뽕", ja: "海鮮チャンポン", en: "Haemul Jjamppong" },
        region: "busan",
        tasteProfile: { sweet: 15, salty: 55, spicy: 80, umami: 80, sour: 5 },
        storyDescription: {
          ko: "홍합·오징어·새우를 듬뿍 넣고 불맛 가득한 매운 육수에 끓여낸 부산의 해물짬뽕이에요. 빨갛게 끓어오르는 국물 한 숟갈에 바다의 감칠맛과 불향이 동시에 폭발해요.",
          ja: "ムール貝・イカ・エビをたっぷり入れ、炎の香り漂う辛いスープで煮込んだ釜山の海鮮チャンポンです。赤く煮立ったスープを一口すすれば、海の旨味と炎の香りが同時に弾けます。",
          en: "Mussels, squid and shrimp tumbled into a fiery wok-charred red broth — Busan's seafood jjamppong. One ladle of the blazing soup and the sea's umami meets smoky flame all at once."
        },
        ingredients: { ko: ["중화면", "홍합", "오징어", "새우", "배추", "고춧가루", "마늘", "돼지고기"], ja: ["中華麺", "ムール貝", "イカ", "エビ", "白菜", "唐辛子粉", "ニンニク", "豚肉"], en: ["Chinese noodles", "Mussels", "Squid", "Shrimp", "Cabbage", "Chili powder", "Garlic", "Pork"] },
        tags: ["해물", "매운맛", "중화"],
        dupes: {
          JP: [
        { name: { ko: "탄탄멘", ja: "担々麺", en: "Tantanmen" }, tasteProfile: { sweet: 15, salty: 55, spicy: 70, umami: 75, sour: 10 }, description: { ko: "매콤한 참깨 국물에 면을 넣은 일본식 매운 라멘", ja: "ピリ辛ゴマスープに麺を入れた日本式辛口ラーメン", en: "Japanese spicy sesame-based ramen" }, ingredients: { ko: ["라멘", "참깨장", "라유", "다진 돼지고기", "청경채", "파"], ja: ["ラーメン", "ゴマだれ", "ラー油", "豚ひき肉", "チンゲン菜", "ネギ"], en: ["Ramen", "Sesame paste", "Chili oil", "Minced pork", "Bok choy", "Scallion"] }, similarityPercent: 70, matchReason: { ko: "매콤한 국물 면의 불맛이 살아있는 포맷", ja: "辛いスープ麺の炎の香りが生きたフォーマット", en: "Spicy red broth noodles — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "마라 해물면", ja: "麻辣海鮮麺", en: "Mala Seafood Noodle" }, tasteProfile: { sweet: 10, salty: 55, spicy: 85, umami: 80, sour: 5 }, description: { ko: "마라 국물에 해물을 듬뿍 넣은 사천식 매운 해물 국수", ja: "麻辣スープに海鮮をたっぷり入れた四川式辛口海鮮麺", en: "Sichuan fiery mala noodle soup packed with seafood" }, ingredients: { ko: ["밀국수", "새우", "오징어", "두반장", "화자오", "마늘"], ja: ["小麦麺", "エビ", "イカ", "豆板醤", "花椒", "ニンニク"], en: ["Wheat noodles", "Shrimp", "Squid", "Doubanjiang", "Sichuan pepper", "Garlic"] }, similarityPercent: 78, matchReason: { ko: "불맛 가득한 매운 국물과 해물 조합의 중화식 해석", ja: "炎の香り満点の辛いスープと海鮮の中華式解釈", en: "Fiery mala seafood noodles — Sichuan counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "busan-eomuk-tang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-eomuk-tang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "어묵탕", ja: "おでんスープ", en: "Eomuk Tang (Fish Cake Soup)" },
        region: "busan",
        tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 85, sour: 5 },
        storyDescription: {
          ko: "부산 어묵을 꼬치에 꿰어 멸치·다시마로 뽀얗게 우린 국물에 담가 따끈하게 먹는 길거리 겨울 별미예요. 국물 한 모금에 포장마차의 김이 코끝을 간지럽혀요.",
          ja: "釜山おでんを串に刺して煮干し・昆布で取った白濁スープに浸し温かく食べる屋台の冬の逸品です。一口のスープで、屋台の湯気が鼻先をくすぐります。",
          en: "Busan fishcakes threaded on skewers and dipped into a silky anchovy-kelp broth — a steaming winter street treat. One sip, and the vapor of a pojangmacha tickles your nose."
        },
        ingredients: { ko: ["부산 어묵", "멸치 다시", "다시마", "무", "대파", "간장", "와사비"], ja: ["釜山おでん", "煮干しだし", "昆布", "大根", "長ネギ", "醤油", "わさび"], en: ["Busan fishcake", "Anchovy broth", "Kelp", "Radish", "Green onion", "Soy sauce", "Wasabi"] },
        tags: ["국물", "길거리", "겨울"],
        dupes: {
          JP: [
        { name: { ko: "오뎅", ja: "おでん", en: "Oden" }, tasteProfile: { sweet: 15, salty: 55, spicy: 5, umami: 85, sour: 5 }, description: { ko: "무·삶은 달걀·곤약·어묵을 가쓰오 다시에 오래 끓여 먹는 일본식 국물 전골", ja: "大根・ゆで卵・こんにゃく・おでんをかつおだしで長時間煮込んだ日本式の鍋", en: "Japanese simmered pot of daikon, egg, konjac and fishcakes in dashi" }, ingredients: { ko: ["무", "어묵", "삶은 달걀", "곤약", "가쓰오 다시", "간장"], ja: ["大根", "おでん", "ゆで卵", "こんにゃく", "かつおだし", "醤油"], en: ["Daikon", "Fishcake", "Boiled egg", "Konjac", "Dashi", "Soy sauce"] }, similarityPercent: 88, matchReason: { ko: "어묵·무를 감칠맛 국물에 오래 끓여 뜨겁게 먹는 거의 동일한 요리", ja: "おでん・大根を旨味スープで長時間煮込んで熱々に食べるほぼ同じ料理", en: "Fishcake-and-radish dashi hotpot — nearly identical dish" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "위완 탕", ja: "魚丸湯", en: "Yu Wan Tang" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 80, sour: 5 }, description: { ko: "생선살 완자를 맑은 육수에 띄워 먹는 중국 남부식 생선완자 수프", ja: "魚のつみれを澄んだスープに浮かべた中国南部式魚団子スープ", en: "Southern Chinese clear fish-ball soup" }, ingredients: { ko: ["생선 완자", "돼지뼈 육수", "부추", "생강", "소금", "백후추"], ja: ["魚団子", "豚骨スープ", "ニラ", "生姜", "塩", "白胡椒"], en: ["Fish balls", "Pork broth", "Chive", "Ginger", "Salt", "White pepper"] }, similarityPercent: 78, matchReason: { ko: "생선 완자를 감칠맛 국물에 띄워 먹는 동일 구조", ja: "魚のつみれを旨味スープに浮かべる同じ構造", en: "Fish-paste balls in savory broth — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "busan-gomjangeo-gui",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-gomjangeo-gui.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        name: { ko: "곰장어구이", ja: "アナゴ炭火焼き", en: "Grilled Hagfish (Gomjangeo)" },
        region: "busan",
        tasteProfile: { sweet: 20, salty: 55, spicy: 50, umami: 85, sour: 5 },
        storyDescription: {
          ko: "자갈치 시장의 상징, 살아있는 곰장어를 바로 손질해 매콤한 양념으로 숯불에 구워내요. 쫄깃한 식감과 고소한 기름, 매운 양념이 삼박자를 이뤄 부산 항구의 밤을 데워줘요.",
          ja: "チャガルチ市場の象徴、生きたアナゴをその場でさばいて辛いタレで炭火焼きに。コリコリの食感と香ばしい脂、辛い調味料が三拍子揃い、釜山の港の夜を温めます。",
          en: "The symbol of Jagalchi Market — live hagfish cleaned right there and grilled over charcoal with spicy sauce. Chewy texture, savory fat and fiery seasoning harmonize to warm Busan harbor nights."
        },
        ingredients: { ko: ["곰장어", "고추장", "고춧가루", "마늘", "생강", "참기름", "대파", "양파"], ja: ["アナゴ", "コチュジャン", "唐辛子粉", "ニンニク", "生姜", "ごま油", "長ネギ", "玉ねぎ"], en: ["Hagfish", "Gochujang", "Chili powder", "Garlic", "Ginger", "Sesame oil", "Green onion", "Onion"] },
        tags: ["숯불", "매운맛", "자갈치"],
        dupes: {
          JP: [
        { name: { ko: "우나기 가바야키", ja: "鰻の蒲焼", en: "Unagi Kabayaki" }, tasteProfile: { sweet: 35, salty: 55, spicy: 5, umami: 85, sour: 5 }, description: { ko: "장어를 달콤 짭짤한 타레에 반복해 발라 숯불에 구운 일본 정통 요리", ja: "うなぎを甘辛いタレに何度も絡めて炭火で焼き上げた日本の伝統料理", en: "Japanese classic of eel basted with sweet-savory glaze and charcoal-grilled" }, ingredients: { ko: ["장어", "간장", "미림", "설탕", "산초", "밥"], ja: ["うなぎ", "醤油", "みりん", "砂糖", "山椒", "ご飯"], en: ["Eel", "Soy sauce", "Mirin", "Sugar", "Sansho", "Rice"] }, similarityPercent: 75, matchReason: { ko: "장어과 생선을 양념에 발라 숯불에 굽는 전통", ja: "ウナギ科の魚をタレで炭火焼きにする伝統", en: "Charcoal-grilled glazed eel — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "만위 샤오카오", ja: "鰻魚焼烤", en: "Manyu Shaokao" }, tasteProfile: { sweet: 15, salty: 55, spicy: 40, umami: 80, sour: 5 }, description: { ko: "장어에 매운 꼬치 양념을 발라 숯불에 구워낸 중국 동북식 꼬치구이", ja: "ウナギに辛い串焼きタレを塗って炭火で焼いた中国東北式の串焼き", en: "Northeastern Chinese grilled eel skewers with spicy glaze" }, ingredients: { ko: ["장어", "쯔란", "고춧가루", "간장", "마늘", "참기름"], ja: ["ウナギ", "クミン", "唐辛子粉", "醤油", "ニンニク", "ごま油"], en: ["Eel", "Cumin", "Chili powder", "Soy sauce", "Garlic", "Sesame oil"] }, similarityPercent: 68, matchReason: { ko: "장어에 매운 양념을 발라 숯불에 굽는 방식", ja: "ウナギに辛いタレを塗って炭火で焼く方式", en: "Spicy charcoal-grilled eel — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "busan-gul-jeon",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-gul-jeon.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "굴전", ja: "牡蠣チヂミ", en: "Gul Jeon (Oyster Pancake)" },
        region: "busan",
        tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 80, sour: 10 },
        storyDescription: {
          ko: "통통한 남해산 굴을 밀가루와 계란옷에 살짝 입혀 팬에 노릇하게 부쳐내요. 한 입 베어 물면 굴에서 흘러나오는 바다 감칠맛이 계란의 고소함과 어우러져 겨울 부산의 별미가 돼요.",
          ja: "ふっくらとした南海産の牡蠣を小麦粉と卵衣で軽くまとい、フライパンできつね色に焼き上げます。一口かじれば牡蠣から溢れ出る海の旨味が卵の香ばしさと調和し、冬の釜山の逸品になります。",
          en: "Plump South Sea oysters lightly dredged in flour and egg, pan-fried golden. Each bite sends the briny umami of oyster swirling with the nutty crackle of egg — winter Busan in a single pancake."
        },
        ingredients: { ko: ["굴", "밀가루", "달걀", "쪽파", "간장", "식초", "식용유"], ja: ["牡蠣", "小麦粉", "卵", "小ネギ", "醤油", "酢", "食用油"], en: ["Oyster", "Flour", "Egg", "Green onion", "Soy sauce", "Vinegar", "Cooking oil"] },
        tags: ["굴", "전", "겨울"],
        dupes: {
          JP: [
        { name: { ko: "카키 후라이", ja: "牡蠣フライ", en: "Kaki Fry" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 85, sour: 10 }, description: { ko: "굴에 빵가루 옷을 입혀 바삭하게 튀긴 일본 겨울 튀김 요리", ja: "牡蠣にパン粉をまぶしてサクサクに揚げた日本の冬の揚げ物", en: "Japanese winter dish of oysters breaded and deep-fried" }, ingredients: { ko: ["굴", "빵가루", "달걀", "밀가루", "타르타르 소스"], ja: ["牡蠣", "パン粉", "卵", "小麦粉", "タルタルソース"], en: ["Oyster", "Panko", "Egg", "Flour", "Tartar sauce"] }, similarityPercent: 75, matchReason: { ko: "굴에 반죽옷을 입혀 뜨거운 기름에 익혀내는 동일 구조", ja: "牡蠣に衣をまぶして熱い油で仕上げる同じ構造", en: "Battered oyster cooked in hot oil — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "하오 치엔", ja: "蠔煎", en: "Hao Jian" }, tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 80, sour: 10 }, description: { ko: "굴에 달걀과 전분을 섞어 바삭하게 부친 중국 민남식 굴 오믈렛", ja: "牡蠣に卵とでんぷんを混ぜてカリッと焼いた中国・閩南式の牡蠣オムレツ", en: "Fujian/Minnan oyster omelette with egg and starch" }, ingredients: { ko: ["굴", "달걀", "고구마 전분", "쪽파", "고수", "어장"], ja: ["牡蠣", "卵", "サツマイモでんぷん", "小ネギ", "パクチー", "魚醤"], en: ["Oyster", "Egg", "Sweet potato starch", "Green onion", "Cilantro", "Fish sauce"] }, similarityPercent: 83, matchReason: { ko: "굴에 달걀 반죽을 입혀 팬에 부쳐내는 거의 동일한 요리", ja: "牡蠣に卵生地をまぶしてフライパンで焼くほぼ同じ料理", en: "Oyster pan-fried in egg batter — near-identical Fujian dish" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "busan-haemul-pajeon",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-haemul-pajeon.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "해물파전", ja: "海鮮パジョン", en: "Haemul Pajeon" },
        region: "busan",
        tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 75, sour: 10 },
        storyDescription: {
          ko: "쪽파 위에 새우·오징어·굴을 수북이 올려 반죽을 부어가며 부쳐낸 부산의 정통 해물 전이에요. 가장자리는 바삭, 중앙은 촉촉. 한 젓가락에 바다가 흘러 들어와요.",
          ja: "小ネギの上にエビ・イカ・牡蠣を山盛りにのせ、生地を注ぎながら焼き上げた釜山の本格海鮮チヂミです。端はカリッと、中央はしっとり。一口で海が流れ込みます。",
          en: "Shrimp, squid and oysters piled over scallions and sealed with batter ladled in layers — Busan's signature seafood pancake. Crispy edges, tender center, and a flood of sea with every chopstickful."
        },
        ingredients: { ko: ["쪽파", "새우", "오징어", "굴", "홍합", "밀가루", "달걀", "간장"], ja: ["小ネギ", "エビ", "イカ", "牡蠣", "ムール貝", "小麦粉", "卵", "醤油"], en: ["Green onion", "Shrimp", "Squid", "Oyster", "Mussel", "Flour", "Egg", "Soy sauce"] },
        tags: ["해물", "전", "막걸리"],
        dupes: {
          JP: [
        { name: { ko: "가이센 오코노미야키", ja: "海鮮お好み焼き", en: "Kaisen Okonomiyaki" }, tasteProfile: { sweet: 15, salty: 55, spicy: 5, umami: 75, sour: 5 }, description: { ko: "해산물을 넣어 두툼하게 부친 오사카식 해물 오코노미야키", ja: "海鮮を入れて厚く焼いた大阪風海鮮お好み焼き", en: "Osaka-style thick seafood okonomiyaki" }, ingredients: { ko: ["밀가루", "양배추", "새우", "오징어", "가쓰오부시", "오타후쿠"], ja: ["小麦粉", "キャベツ", "エビ", "イカ", "かつお節", "オタフク"], en: ["Flour", "Cabbage", "Shrimp", "Squid", "Bonito", "Okonomi sauce"] }, similarityPercent: 78, matchReason: { ko: "해산물과 반죽을 함께 두툼하게 부쳐내는 동일 구조", ja: "海鮮と生地を一緒に厚く焼く同じ構造", en: "Thick seafood-batter pancake — closest Japanese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "하이셴 총유빙", ja: "海鮮葱油餅", en: "Seafood Cong You Bing" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 75, sour: 5 }, description: { ko: "파와 새우·조개를 넣어 구운 중국 연안식 해물 파전", ja: "ネギとエビ・貝を入れて焼いた中国沿岸式の海鮮ネギパン", en: "Chinese coastal pancake with scallions, shrimp and clams" }, ingredients: { ko: ["밀가루", "대파", "새우", "조개", "참기름", "간장"], ja: ["小麦粉", "長ネギ", "エビ", "貝", "ごま油", "醤油"], en: ["Flour", "Green onion", "Shrimp", "Clam", "Sesame oil", "Soy sauce"] }, similarityPercent: 77, matchReason: { ko: "파와 해물을 반죽에 넣어 팬에 부쳐내는 거의 동일한 구조", ja: "ネギと海鮮を生地に入れてフライパンで焼くほぼ同じ構造", en: "Scallion-seafood pancake — close Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "busan-daegu-tang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-daegu-tang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
        name: { ko: "대구탕", ja: "タラ鍋", en: "Daegu Tang (Cod Stew)" },
        region: "busan",
        tasteProfile: { sweet: 10, salty: 55, spicy: 50, umami: 85, sour: 5 },
        storyDescription: {
          ko: "싱싱한 생대구를 맑은 육수에 무·콩나물·대파와 함께 넣고 살짝 얼큰하게 끓여내는 겨울 부산의 보양식이에요. 시원한 국물 한 모금이면 새벽 자갈치 시장의 공기가 입안에 퍼져요.",
          ja: "新鮮な生ダラを澄んだスープに大根・もやし・長ネギと共に入れて、ほんのり辛く煮込んだ冬の釜山の滋養料理です。すっきりしたスープ一口で、早朝のチャガルチ市場の空気が口の中に広がります。",
          en: "Fresh cod simmered with radish, bean sprouts and scallion in a lightly spicy clear broth — winter Busan's restorative meal. One sip of the clean broth, and the crisp dawn air of Jagalchi fills your mouth."
        },
        ingredients: { ko: ["생대구", "무", "콩나물", "대파", "고춧가루", "마늘", "멸치육수", "미나리"], ja: ["生ダラ", "大根", "もやし", "長ネギ", "唐辛子粉", "ニンニク", "煮干しだし", "セリ"], en: ["Fresh cod", "Radish", "Bean sprouts", "Green onion", "Chili powder", "Garlic", "Anchovy broth", "Dropwort"] },
        tags: ["생선탕", "겨울", "해장"],
        dupes: {
          JP: [
        { name: { ko: "타라 치리", ja: "たらちり", en: "Tara Chiri" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 85, sour: 5 }, description: { ko: "대구와 채소를 다시마 육수에 넣고 간단하게 끓여내는 일본식 대구 전골", ja: "タラと野菜を昆布だしで軽く煮込んだ日本式タラ鍋", en: "Japanese simple cod hot pot with vegetables in kombu broth" }, ingredients: { ko: ["대구", "두부", "배추", "다시마", "간장", "폰즈"], ja: ["タラ", "豆腐", "白菜", "昆布", "醤油", "ポン酢"], en: ["Cod", "Tofu", "Napa cabbage", "Kelp", "Soy sauce", "Ponzu"] }, similarityPercent: 80, matchReason: { ko: "대구와 채소를 맑은 국물에 끓여 뜨겁게 먹는 거의 동일한 요리", ja: "タラと野菜を澄んだスープで煮込んで熱々に食べるほぼ同じ料理", en: "Cod-and-veg hot pot in clear broth — very close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "쉐차이 다이위 수프", ja: "雪菜タラスープ", en: "Xue Cai Cod Soup" }, tasteProfile: { sweet: 5, salty: 60, spicy: 10, umami: 80, sour: 15 }, description: { ko: "대구살을 발효 겨자잎과 함께 맑은 국물에 끓여낸 상하이식 대구탕", ja: "タラの身を発酵カラシ菜と共に澄んだスープで煮込んだ上海式タラスープ", en: "Shanghai cod soup simmered with pickled mustard greens" }, ingredients: { ko: ["대구", "쉐차이", "두부", "대파", "생강", "백후추"], ja: ["タラ", "雪菜", "豆腐", "長ネギ", "生姜", "白胡椒"], en: ["Cod", "Pickled greens", "Tofu", "Green onion", "Ginger", "White pepper"] }, similarityPercent: 72, matchReason: { ko: "대구를 맑은 국물에 끓여 부드러운 살을 즐기는 공통점", ja: "タラを澄んだスープで煮込み柔らかい身を楽しむ共通点", en: "Cod in clear pickled-greens broth — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "busan-jeonbok-juk",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-jeonbok-juk.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "전복죽", ja: "アワビ粥", en: "Jeonbok Juk (Abalone Porridge)" },
        region: "busan",
        tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 85, sour: 5 },
        storyDescription: {
          ko: "쫄깃한 전복을 참기름에 볶다가 불린 쌀을 넣어 천천히 저으며 끓여낸 부산의 귀한 한 그릇이에요. 한 숟갈에 바다의 감칠맛이 쌀알 하나하나에 스며드는 호사스러움을 만나요.",
          ja: "プリプリのアワビをごま油で炒め、浸しておいた米を入れてゆっくりかき混ぜながら煮込んだ釜山の贅沢な一杯です。一さじごとに海の旨味が米粒一つひとつに染み込む贅沢に出会えます。",
          en: "Chewy abalone sautéed in sesame oil, then simmered slowly into a porridge of pre-soaked rice — Busan's coveted bowl. Each spoonful reveals the sea's umami soaking into every grain."
        },
        ingredients: { ko: ["전복", "쌀", "참기름", "소금", "마늘", "대파", "당근"], ja: ["アワビ", "米", "ごま油", "塩", "ニンニク", "長ネギ", "人参"], en: ["Abalone", "Rice", "Sesame oil", "Salt", "Garlic", "Green onion", "Carrot"] },
        tags: ["죽", "전복", "보양식"],
        dupes: {
          JP: [
        { name: { ko: "아와비 카유", ja: "鮑粥", en: "Awabi Kayu" }, tasteProfile: { sweet: 10, salty: 45, spicy: 0, umami: 85, sour: 5 }, description: { ko: "전복을 밥에 넣고 다시로 부드럽게 끓여낸 일본식 전복 죽", ja: "アワビをご飯に入れてだしで柔らかく煮込んだ日本式アワビ粥", en: "Japanese abalone porridge simmered gently with dashi" }, ingredients: { ko: ["전복", "쌀", "가쓰오 다시", "간장", "미소", "파"], ja: ["アワビ", "米", "かつおだし", "醤油", "味噌", "ネギ"], en: ["Abalone", "Rice", "Dashi", "Soy sauce", "Miso", "Green onion"] }, similarityPercent: 85, matchReason: { ko: "전복의 감칠맛이 살아있는 죽 — 거의 동일한 요리", ja: "アワビの旨味が生きた粥 — ほぼ同じ料理", en: "Abalone-flavored rice porridge — nearly identical" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "바오위 저우", ja: "鮑魚粥", en: "Bao Yu Zhou" }, tasteProfile: { sweet: 10, salty: 45, spicy: 0, umami: 85, sour: 0 }, description: { ko: "전복을 오래 끓여 깊은 감칠맛을 낸 광둥식 전복 죽", ja: "アワビを長時間煮込んで深い旨味を出した広東式アワビ粥", en: "Cantonese abalone congee slow-simmered for deep umami" }, ingredients: { ko: ["전복", "쌀", "닭뼈 육수", "생강", "참기름", "흰후추"], ja: ["アワビ", "米", "鶏骨スープ", "生姜", "ごま油", "白胡椒"], en: ["Abalone", "Rice", "Chicken broth", "Ginger", "Sesame oil", "White pepper"] }, similarityPercent: 82, matchReason: { ko: "전복과 쌀을 오래 끓여내는 동아시아 공통 전통", ja: "アワビと米を長時間煮込む東アジア共通の伝統", en: "Abalone-rice slow-simmered — Cantonese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "busan-bokeo-tang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-bokeo-tang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-디엔에이스튜디오",
        name: { ko: "복어탕", ja: "ふぐ鍋", en: "Bokeo Tang (Pufferfish Soup)" },
        region: "busan",
        tasteProfile: { sweet: 10, salty: 50, spicy: 30, umami: 90, sour: 5 },
        storyDescription: {
          ko: "자격을 갖춘 요리사만이 다루는 귀한 복어를 무와 콩나물과 함께 맑고 얼큰하게 끓여낸 부산의 최고급 보양식이에요. 한 그릇에 바다의 깊이와 인내가 녹아 있어요.",
          ja: "資格を持つ料理人だけが扱う貴重なふぐを、大根ともやしと共に清らかでピリ辛に煮込んだ釜山の最高級滋養料理です。一杯に海の深さと忍耐が溶け込んでいます。",
          en: "Prized pufferfish — handled only by licensed chefs — simmered with radish and bean sprouts in a clean, lightly spicy broth. Busan's premier restorative bowl, where the sea's depth and patience dissolve together."
        },
        ingredients: { ko: ["복어", "무", "콩나물", "미나리", "고춧가루", "마늘", "생강", "멸치육수"], ja: ["ふぐ", "大根", "もやし", "セリ", "唐辛子粉", "ニンニク", "生姜", "煮干しだし"], en: ["Pufferfish", "Radish", "Bean sprouts", "Dropwort", "Chili powder", "Garlic", "Ginger", "Anchovy broth"] },
        tags: ["고급", "해장", "복어"],
        dupes: {
          JP: [
        { name: { ko: "후구 치리", ja: "ふぐちり", en: "Fugu Chiri" }, tasteProfile: { sweet: 5, salty: 50, spicy: 5, umami: 90, sour: 10 }, description: { ko: "복어를 다시마 육수에 채소와 함께 끓인 일본 전통 복어 전골", ja: "ふぐを昆布だしで野菜と共に煮込んだ日本伝統のふぐ鍋", en: "Japanese traditional pufferfish hot pot with kombu broth and vegetables" }, ingredients: { ko: ["복어", "다시마", "배추", "두부", "시이타케", "폰즈"], ja: ["ふぐ", "昆布", "白菜", "豆腐", "椎茸", "ポン酢"], en: ["Pufferfish", "Kelp", "Napa cabbage", "Tofu", "Shiitake", "Ponzu"] }, similarityPercent: 85, matchReason: { ko: "복어를 맑은 육수에 채소와 함께 끓이는 거의 동일한 요리", ja: "ふぐを澄んだスープで野菜と共に煮込むほぼ同じ料理", en: "Pufferfish in clear broth with vegetables — closest Japanese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "허툰 탕", ja: "河豚湯", en: "Hé Tún Tang" }, tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 85, sour: 5 }, description: { ko: "복어를 맑은 국물에 뼈와 함께 끓여내는 중국 강남식 전통 요리", ja: "ふぐを澄んだスープで骨と共に煮込んだ中国・江南式の伝統料理", en: "Chinese Jiangnan traditional clear pufferfish soup simmered with bones" }, ingredients: { ko: ["복어", "죽순", "생강", "대파", "소금", "참기름"], ja: ["ふぐ", "タケノコ", "生姜", "長ネギ", "塩", "ごま油"], en: ["Pufferfish", "Bamboo shoot", "Ginger", "Green onion", "Salt", "Sesame oil"] }, similarityPercent: 75, matchReason: { ko: "복어를 맑은 국물에 끓여 귀한 음식으로 즐기는 전통", ja: "ふぐを澄んだスープで煮込み貴重な料理として楽しむ伝統", en: "Pufferfish clear soup tradition — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "busan-yubu-jeongol",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/busan-yubu-jeongol.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "유부전골", ja: "油揚げ鍋", en: "Yubu Jeongol (Fried Tofu Hot Pot)" },
        region: "busan",
        tasteProfile: { sweet: 15, salty: 60, spicy: 25, umami: 85, sour: 5 },
        storyDescription: {
          ko: "얇게 튀긴 유부 주머니에 밥과 채소를 채워 멸치 육수에 넣고 뜨끈하게 끓여낸 부산의 겨울 전골이에요. 유부를 한 입 베어 물면 국물이 폭포처럼 쏟아져 나와요.",
          ja: "薄く揚げた油揚げの袋にご飯と野菜を詰め、煮干しだしに入れて熱々に煮込んだ釜山の冬の鍋です。油揚げを一口かじれば、スープが滝のように溢れ出します。",
          en: "Fried tofu pouches stuffed with rice and vegetables, simmered to scorching in anchovy broth — a Busan winter hot pot. Bite into the pouch and broth cascades out like a waterfall."
        },
        ingredients: { ko: ["유부", "밥", "당근", "표고버섯", "대파", "멸치육수", "간장", "다시마"], ja: ["油揚げ", "ご飯", "人参", "椎茸", "長ネギ", "煮干しだし", "醤油", "昆布"], en: ["Fried tofu pouch", "Rice", "Carrot", "Shiitake", "Green onion", "Anchovy broth", "Soy sauce", "Kelp"] },
        tags: ["전골", "유부", "겨울"],
        dupes: {
          JP: [
        { name: { ko: "이나리 나베", ja: "いなり鍋", en: "Inari Nabe" }, tasteProfile: { sweet: 20, salty: 60, spicy: 5, umami: 85, sour: 5 }, description: { ko: "유부 주머니와 두부·채소를 다시에 넣어 끓여낸 일본식 유부 전골", ja: "いなりの袋と豆腐・野菜をだしで煮込んだ日本式のいなり鍋", en: "Japanese inari pouch hot pot with tofu and vegetables in dashi" }, ingredients: { ko: ["유부", "두부", "우엉", "당근", "다시", "간장"], ja: ["油揚げ", "豆腐", "ごぼう", "人参", "だし", "醤油"], en: ["Fried tofu", "Tofu", "Burdock", "Carrot", "Dashi", "Soy sauce"] }, similarityPercent: 85, matchReason: { ko: "유부 주머니를 채워 국물에 끓여 먹는 거의 동일한 요리", ja: "油揚げの袋を詰めてスープで煮込むほぼ同じ料理", en: "Stuffed fried tofu hot pot — nearly identical Japanese dish" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "유부 라이스 수프", ja: "油揚げライススープ", en: "Yubu Rice Soup CN" }, tasteProfile: { sweet: 10, salty: 60, spicy: 10, umami: 80, sour: 5 }, description: { ko: "튀긴 두부와 쌀·버섯을 맑은 국물에 끓여낸 중국 강남식 두부 수프", ja: "揚げ豆腐と米・きのこを澄んだスープで煮込んだ中国・江南式豆腐スープ", en: "Chinese Jiangnan clear soup with fried tofu, rice and mushrooms" }, ingredients: { ko: ["튀긴 두부", "쌀", "표고버섯", "청경채", "생강", "소금"], ja: ["揚げ豆腐", "米", "椎茸", "青梗菜", "生姜", "塩"], en: ["Fried tofu", "Rice", "Shiitake", "Bok choy", "Ginger", "Salt"] }, similarityPercent: 72, matchReason: { ko: "튀긴 두부의 감칠맛을 국물에 풀어낸 아시아식 해석", ja: "揚げ豆腐の旨味をスープに溶かし出したアジア式解釈", en: "Fried tofu in savory broth — Chinese cousin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      }
    ]
  },
  {
    code: "gyeongju",
    name: { ko: "경주", ja: "慶州", en: "Gyeongju" },
    icon: "👑",
    image: "/images/village/gyeongju.jpg",
    description: { ko: "천년 고도의 전통 맛", ja: "千年古都の伝統の味", en: "Traditional flavors of the ancient capital" },
    foods: [
      {
        id: "gyeongju-hwangnam-ppang",
        name: { ko: "황남빵", ja: "ファンナムパン", en: "Hwangnam Bread" },
        region: "gyeongju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/gyeongju-hwangnam-ppang.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        tasteProfile: { sweet: 70, salty: 15, spicy: 0, umami: 20, sour: 5 },
        storyDescription: {
          ko: "경주를 대표하는 100년 전통의 팥소 빵이에요. 얇고 바삭한 밀가루 껍질 안에 달콤한 팥소가 가득 차 있어, 한 입 베어 물면 경주의 천년 역사가 입 안에서 녹아드는 것 같아요.",
          ja: "慶州を代表する100年の伝統を持つ餡入りパンです。薄くてサクサクした小麦粉の皮の中に甘い小豆餡がたっぷり詰まっていて、一口かじると慶州の千年の歴史が口の中で溶けていくようです。",
          en: "Gyeongju's iconic 100-year-old red bean bread. The thin, crispy wheat shell hides a generous filling of sweet red bean paste — one bite and Gyeongju's millennium of history melts in your mouth."
        },
        ingredients: { ko: ["밀가루", "팥", "설탕", "버터", "달걀", "소금"], ja: ["小麦粉", "小豆", "砂糖", "バター", "卵", "塩"], en: ["Wheat flour", "Red beans", "Sugar", "Butter", "Egg", "Salt"] },
        tags: ["전통", "팥", "간식"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-gyori-gimbap",
        name: { ko: "교리김밥", ja: "キョリキンパ", en: "Gyori Gimbap" },
        region: "gyeongju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/gyeongju-gyori-gimbap.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        tasteProfile: { sweet: 20, salty: 55, spicy: 10, umami: 65, sour: 10 },
        storyDescription: {
          ko: "경주 교리에서 시작된 수제 김밥이에요. 통통하게 들어찬 속재료와 도톰하게 자른 단면이 마치 보석 단면처럼 예뻐서, 먹기 아까울 만큼 눈도 즐겁게 해준답니다.",
          ja: "慶州の教里から始まった手作りキンパです。ぎっしり詰まった具材と厚めに切った断面が、まるで宝石の断面のように美しくて、食べるのがもったいないほど目も楽しませてくれます。",
          en: "Handcrafted gimbap originating from Gyori village in Gyeongju. The plump fillings and thick-cut cross-section are as beautiful as a jewel's facet — almost too pretty to eat."
        },
        ingredients: { ko: ["밥", "김", "시금치", "계란", "당근", "우엉", "어묵", "참기름"], ja: ["ご飯", "のり", "ほうれん草", "卵", "人参", "ごぼう", "練り物", "ごま油"], en: ["Rice", "Seaweed", "Spinach", "Egg", "Carrot", "Burdock", "Fish cake", "Sesame oil"] },
        tags: ["김밥", "도시락", "수제"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-tteokgalbi",
        name: { ko: "떡갈비", ja: "トッカルビ", en: "Tteokgalbi" },
        region: "gyeongju",
        image: "",
        tasteProfile: { sweet: 50, salty: 55, spicy: 10, umami: 75, sour: 5 },
        storyDescription: {
          ko: "갈비살을 곱게 다져 달콤짭짤한 양념을 입혀 구워낸 요리예요. 겉은 살짝 카라멜화되어 반짝이고, 안은 촉촉하게 촉촉해서 입에서 사르르 녹는 황금빛 패티랍니다.",
          ja: "カルビ肉を細かく刻んで甘辛いタレを纏わせて焼き上げた料理です。外はわずかにカラメリゼされてツヤツヤ光り、中はしっとり柔らかく口の中でとろける黄金色のパティです。",
          en: "Finely minced rib meat coated in sweet-savory marinade and grilled. The exterior caramelizes to a glossy sheen while the inside stays juicy and tender — a golden patty that melts on your tongue."
        },
        ingredients: { ko: ["소갈비살", "간장", "배", "마늘", "참기름", "설탕", "파"], ja: ["牛カルビ肉", "醤油", "梨", "ニンニク", "ごま油", "砂糖", "ネギ"], en: ["Beef rib meat", "Soy sauce", "Korean pear", "Garlic", "Sesame oil", "Sugar", "Green onion"] },
        tags: ["고기", "달콤", "구이"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-hanwoo-mulhoe",
        name: { ko: "한우 물회", ja: "韓牛ムルフェ", en: "Hanwoo Mulhoe" },
        region: "gyeongju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/gyeongju-hanwoo-mulhoe.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        tasteProfile: { sweet: 25, salty: 45, spicy: 55, umami: 70, sour: 40 },
        storyDescription: {
          ko: "신선한 한우 육회를 얼음처럼 차가운 육수에 담가 먹는 경주만의 별미예요. 상큼하게 새콤달콤한 국물과 쫄깃한 육회의 만남이 더운 여름날 혀를 상쾌하게 깨워준답니다.",
          ja: "新鮮な韓牛のユッケを氷のように冷たいスープに浸して食べる慶州ならではの珍味です。爽やかな甘酸っぱいスープとコシのあるユッケの出会いが、暑い夏の日に舌を爽やかに目覚めさせてくれます。",
          en: "Fresh raw Korean beef immersed in ice-cold broth — a Gyeongju specialty. The tangy, sweet-and-sour soup paired with chewy raw beef wakes up your palate on a sweltering summer day."
        },
        ingredients: { ko: ["한우 육회", "오이", "배", "고추장", "식초", "설탕", "얼음"], ja: ["韓牛ユッケ", "きゅうり", "梨", "コチュジャン", "酢", "砂糖", "氷"], en: ["Raw Korean beef", "Cucumber", "Korean pear", "Gochujang", "Vinegar", "Sugar", "Ice"] },
        tags: ["육회", "차가움", "여름"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-ssambap",
        name: { ko: "쌈밥 정식", ja: "サムバプ定食", en: "Ssambap Set" },
        region: "gyeongju",
        image: "",
        tasteProfile: { sweet: 20, salty: 45, spicy: 40, umami: 65, sour: 15 },
        storyDescription: {
          ko: "신선한 채소잎에 밥 한 숟갈과 고기, 쌈장을 올려 손 안에 꼭 쥐고 한 입에 먹는 즐거움이 있어요. 입 안에서 채소의 신선함과 고기의 풍미, 쌈장의 깊은 맛이 한꺼번에 어우러지는 게 이 맛의 묘미랍니다.",
          ja: "新鮮な葉野菜にご飯一さじとお肉、サムジャンを乗せて手の中にぎゅっと包んで一口で食べる楽しさがあります。口の中で野菜の新鮮さと肉の旨味、サムジャンの深い味わいが一度に溶け合うのがこの料理の醍醐味です。",
          en: "Fresh leafy vegetables wrapped around a spoonful of rice, meat, and savory ssamjang — all squeezed into one perfect bite. The burst of freshness, rich meat flavor, and deep-fermented paste is the magic of ssam."
        },
        ingredients: { ko: ["상추", "깻잎", "쌈장", "밥", "삼겹살", "마늘", "고추"], ja: ["サンチュ", "エゴマの葉", "サムジャン", "ご飯", "豚バラ", "ニンニク", "唐辛子"], en: ["Lettuce", "Perilla leaves", "Ssamjang", "Rice", "Pork belly", "Garlic", "Green pepper"] },
        tags: ["채소", "쌈", "정식"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-haejangguk",
        name: { ko: "해장국", ja: "ヘジャングク", en: "Haejangguk" },
        region: "gyeongju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/gyeongju-haejangguk.jpeg",
        tasteProfile: { sweet: 10, salty: 55, spicy: 50, umami: 80, sour: 10 },
        storyDescription: {
          ko: "진한 사골 국물에 우거지와 선지, 콩나물이 어우러진 경주식 해장국이에요. 묵직하고 깊은 국물 한 모금이면 전날의 피로가 씻겨나가는 것 같아서, 경주 사람들의 아침을 든든히 책임진답니다.",
          ja: "濃い牛骨スープにウゴジ（白菜の外葉）と血豆腐、もやしが調和した慶州式解腸スープです。重厚で深みのあるスープを一口飲めば、前日の疲れが洗い流されるようで、慶州の人たちの朝をしっかり支えています。",
          en: "A Gyeongju-style hangover soup with rich bone broth, dried cabbage leaves, congealed blood, and bean sprouts. One sip of this deeply savory, hearty broth washes away yesterday's weariness."
        },
        ingredients: { ko: ["사골육수", "우거지", "선지", "콩나물", "고춧가루", "된장", "마늘"], ja: ["牛骨スープ", "干し白菜葉", "血豆腐", "もやし", "唐辛子粉", "味噌", "ニンニク"], en: ["Bone broth", "Dried cabbage", "Blood pudding", "Bean sprouts", "Red pepper powder", "Doenjang", "Garlic"] },
        tags: ["해장", "진국", "아침"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-hanjeongsik",
        name: { ko: "한정식", ja: "韓定食", en: "Hanjeongsik" },
        region: "gyeongju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/gyeongju-hanjeongsik.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        tasteProfile: { sweet: 30, salty: 50, spicy: 30, umami: 80, sour: 20 },
        storyDescription: {
          ko: "신라의 궁중 음식 문화를 계승한 경주의 전통 한정식이에요. 작은 그릇 하나하나에 장인의 손길이 담긴 정성스러운 반찬들이 차려지면, 마치 천년 전 경주 고분에서 발굴된 유물처럼 그 자리 자체가 하나의 역사가 된답니다.",
          ja: "新羅の宮廷料理文化を継承した慶州の伝統韓定食です。小さなお皿一つ一つに職人の手仕事が込められた丁寧なおかずが並ぶと、まるで千年前の慶州の古墳から発掘された遺物のように、その場そのものが一つの歴史になります。",
          en: "A traditional Gyeongju hanjeongsik tracing its roots to Silla royal court cuisine. Each small dish is crafted with artisan care — laid out together, it feels less like a meal and more like a living archaeological discovery."
        },
        ingredients: { ko: ["밥", "나물 반찬", "전", "구이", "찌개", "김치", "해산물", "떡"], ja: ["ご飯", "ナムルおかず", "チヂミ", "焼き物", "チゲ", "キムチ", "海産物", "餅"], en: ["Rice", "Namul side dishes", "Jeon", "Grilled dishes", "Jjigae", "Kimchi", "Seafood", "Rice cake"] },
        tags: ["정찬", "궁중", "전통"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-chalborippang",
        name: { ko: "찰보리빵", ja: "チャルボリパン", en: "Chalborippang" },
        region: "gyeongju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/gyeongju-chalborippang.jpeg",
        tasteProfile: { sweet: 60, salty: 15, spicy: 0, umami: 25, sour: 5 },
        storyDescription: {
          ko: "경주의 찰보리를 넣어 만든 촉촉하고 쫄깃한 빵이에요. 일반 빵과 달리 보리 특유의 구수한 향이 은은하게 올라오고, 팥 크림이나 단팥소와 어우러지면 소박하지만 깊은 맛이 나요.",
          ja: "慶州のもち麦を使って作ったしっとりもちもちのパンです。普通のパンと違い、麦独特の香ばしい香りがほんのりと漂い、小豆クリームや餡と相まって素朴ながら深い味わいがあります。",
          en: "A moist, chewy bread made with Gyeongju's sticky barley. Unlike ordinary bread, it carries the subtle nutty fragrance of barley — paired with red bean cream or paste, it's simple yet deeply satisfying."
        },
        ingredients: { ko: ["찰보리", "밀가루", "팥소", "버터", "설탕", "달걀", "우유"], ja: ["もち麦", "小麦粉", "小豆餡", "バター", "砂糖", "卵", "牛乳"], en: ["Sticky barley", "Wheat flour", "Red bean paste", "Butter", "Sugar", "Egg", "Milk"] },
        tags: ["빵", "보리", "달콤"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-hanwoo-bulgogi",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/gyeongju-hanwoo-bulgogi.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        name: { ko: "한우불고기", ja: "韓牛プルコギ", en: "Hanwoo Bulgogi" },
        region: "gyeongju",
        tasteProfile: { sweet: 45, salty: 50, spicy: 10, umami: 80, sour: 10 },
        storyDescription: {
          ko: "얇게 썬 최상급 한우를 배·간장·마늘·참기름에 재워 석쇠나 불판에 구워낸 경주의 대표 고기 요리예요. 한 점을 상추에 싸 한 입에 넣으면 달짝지근한 양념이 혀 위에서 춤을 춰요.",
          ja: "薄切りの最高級韓牛を梨・醤油・ニンニク・ごま油に漬け込み、網や鉄板で焼き上げた慶州の代表的な肉料理です。一切れをサンチュに包んで一口頬張れば、甘じょっぱいタレが舌の上で踊ります。",
          en: "Thin slices of premium hanwoo marinated in pear, soy sauce, garlic and sesame oil, then grilled over a grate — Gyeongju's signature meat dish. One bite wrapped in lettuce, and the sweet-savory glaze dances on your tongue."
        },
        ingredients: { ko: ["한우 등심", "간장", "배", "마늘", "참기름", "설탕", "양파", "깻잎"], ja: ["韓牛ロース", "醤油", "梨", "ニンニク", "ごま油", "砂糖", "玉ねぎ", "エゴマの葉"], en: ["Hanwoo sirloin", "Soy sauce", "Asian pear", "Garlic", "Sesame oil", "Sugar", "Onion", "Perilla leaf"] },
        tags: ["한우", "구이", "전통"],
        dupes: {
          JP: [
        { name: { ko: "스키야키", ja: "すき焼き", en: "Sukiyaki" }, tasteProfile: { sweet: 50, salty: 55, spicy: 5, umami: 80, sour: 5 }, description: { ko: "얇게 썬 소고기를 간장·설탕·미림 양념 국물에 채소와 함께 끓여 먹는 일본 전골", ja: "薄切り牛肉を醤油・砂糖・みりんのタレで野菜と共に煮込みながら食べる日本の鍋", en: "Japanese hot pot of thin-sliced beef simmered with vegetables in sweet soy sauce" }, ingredients: { ko: ["소고기", "간장", "설탕", "미림", "대파", "두부"], ja: ["牛肉", "醤油", "砂糖", "みりん", "長ネギ", "豆腐"], en: ["Beef", "Soy sauce", "Sugar", "Mirin", "Green onion", "Tofu"] }, similarityPercent: 82, matchReason: { ko: "얇게 썬 소고기를 달콤 짭짤한 간장 양념에 익히는 거의 동일한 요리", ja: "薄切り牛肉を甘辛い醤油ダレで調理するほぼ同じ料理", en: "Thin-sliced beef in sweet soy sauce — closest Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "추이 니우 러우", ja: "脆牛肉", en: "Cui Niurou" }, tasteProfile: { sweet: 30, salty: 55, spicy: 15, umami: 75, sour: 10 }, description: { ko: "얇게 썬 소고기를 달콤 짭짤한 중국식 양념에 볶아낸 요리", ja: "薄切り牛肉を甘辛い中華タレで炒めた料理", en: "Chinese stir-fry of thin-sliced beef in sweet-savory glaze" }, ingredients: { ko: ["소고기", "간장", "굴소스", "생강", "양파", "참깨"], ja: ["牛肉", "醤油", "オイスターソース", "生姜", "玉ねぎ", "ゴマ"], en: ["Beef", "Soy sauce", "Oyster sauce", "Ginger", "Onion", "Sesame"] }, similarityPercent: 73, matchReason: { ko: "얇은 소고기를 양념에 볶아내는 유사한 스타일", ja: "薄切り牛肉をタレで炒める類似スタイル", en: "Sliced beef in soy-based glaze — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-gujeolpan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/gyeongju-gujeolpan.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스분도",
        name: { ko: "구절판", ja: "九節板", en: "Gujeolpan (Nine-compartment Platter)" },
        region: "gyeongju",
        tasteProfile: { sweet: 20, salty: 45, spicy: 15, umami: 60, sour: 15 },
        storyDescription: {
          ko: "아홉 칸으로 나뉜 화려한 접시 가운데 얇은 밀전병을 두고 주위에 여덟 가지 색색의 고명을 둘러 담는 궁중 요리예요. 직접 싸 먹을 때마다 다른 그림이 완성되는 미식의 퍼즐이에요.",
          ja: "九つの区画に分かれた豪華な器の中央に薄い小麦粉のクレープを置き、周囲に八色の彩りの具材を並べる宮廷料理です。自分で包んで食べるたびに異なる絵が完成する、美食のパズルです。",
          en: "A ceremonial dish with eight colorful fillings arranged around a central thin wheat crepe in a nine-compartment platter. Each hand-wrapped bite completes a different picture — a gastronomic puzzle."
        },
        ingredients: { ko: ["밀전병", "소고기", "새우", "표고버섯", "오이", "당근", "달걀", "석이버섯"], ja: ["小麦クレープ", "牛肉", "エビ", "椎茸", "きゅうり", "人参", "卵", "石耳茸"], en: ["Wheat crepe", "Beef", "Shrimp", "Shiitake", "Cucumber", "Carrot", "Egg", "Stone mushroom"] },
        tags: ["궁중", "정찬", "화려함"],
        dupes: {
          JP: [
        { name: { ko: "카이세키 모리아와세", ja: "懐石盛り合わせ", en: "Kaiseki Moriawase" }, tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 75, sour: 10 }, description: { ko: "계절 식재료를 작은 그릇에 나눠 아름답게 내는 일본 전통 코스 요리의 모듬 접시", ja: "旬の食材を小さな器に分けて美しく盛り付ける日本の伝統懐石の盛り合わせ", en: "Japanese kaiseki assorted platter with seasonal ingredients in small portions" }, ingredients: { ko: ["제철 생선", "두부", "채소", "다시", "미소", "해조류"], ja: ["旬の魚", "豆腐", "野菜", "だし", "味噌", "海藻"], en: ["Seasonal fish", "Tofu", "Vegetables", "Dashi", "Miso", "Seaweed"] }, similarityPercent: 80, matchReason: { ko: "계절 재료를 작은 구획에 정성스럽게 담아 눈으로도 먹는 전통", ja: "旬の食材を小さな区画に丁寧に盛り目でも食べる伝統", en: "Seasonal small plates arranged artfully — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "빠바오 차이 파이", ja: "八宝菜皿", en: "Babaocai Platter" }, tasteProfile: { sweet: 20, salty: 50, spicy: 10, umami: 70, sour: 10 }, description: { ko: "여덟 가지 재료를 담은 중국식 모듬 접시 요리", ja: "八種類の食材を盛り合わせた中国式モリ料理", en: "Chinese platter with eight types of carefully arranged ingredients" }, ingredients: { ko: ["새우", "버섯", "죽순", "당근", "완두콩", "돼지고기"], ja: ["エビ", "きのこ", "タケノコ", "人参", "グリーンピース", "豚肉"], en: ["Shrimp", "Mushroom", "Bamboo", "Carrot", "Peas", "Pork"] }, similarityPercent: 72, matchReason: { ko: "여러 재료를 한 접시에 조화롭게 담는 전통", ja: "様々な食材を一皿に調和的に盛る伝統", en: "Multi-ingredient arranged platter — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-dubu-jeongol",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/gyeongju-dubu-jeongol.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-디엔에이스튜디오",
        name: { ko: "두부전골", ja: "豆腐鍋", en: "Dubu Jeongol (Tofu Hot Pot)" },
        region: "gyeongju",
        tasteProfile: { sweet: 10, salty: 55, spicy: 35, umami: 80, sour: 5 },
        storyDescription: {
          ko: "경주 두부장인의 부드러운 두부에 버섯·채소를 가득 넣고 얼큰한 육수에 끓여내는 경주의 정갈한 전골이에요. 한 그릇에 산사의 맑은 공기가 담긴 듯 정결한 맛이에요.",
          ja: "慶州の豆腐職人が作る柔らかい豆腐にきのこ・野菜をたっぷり入れ、ピリ辛のスープで煮込んだ慶州の清らかな鍋です。一杯に山寺の澄んだ空気が宿るような清らかな味わいです。",
          en: "Silken tofu crafted by Gyeongju artisans, abundant with mushrooms and vegetables, simmered in a lightly spicy broth — a refined hot pot. One bowl tastes as clean as the air of a mountain temple."
        },
        ingredients: { ko: ["두부", "표고버섯", "배추", "애호박", "대파", "고춧가루", "마늘", "멸치 육수"], ja: ["豆腐", "椎茸", "白菜", "ズッキーニ", "長ネギ", "唐辛子粉", "ニンニク", "煮干しだし"], en: ["Tofu", "Shiitake", "Napa cabbage", "Zucchini", "Green onion", "Chili powder", "Garlic", "Anchovy broth"] },
        tags: ["두부", "전골", "사찰식"],
        dupes: {
          JP: [
        { name: { ko: "유도후", ja: "湯豆腐", en: "Yudofu" }, tasteProfile: { sweet: 5, salty: 45, spicy: 5, umami: 75, sour: 5 }, description: { ko: "다시마 국물에 두부를 넣고 끓여 폰즈에 찍어 먹는 교토식 두부 전골", ja: "昆布だしに豆腐を入れてポン酢で食べる京都式豆腐鍋", en: "Kyoto-style tofu hot pot with kelp broth and ponzu dipping sauce" }, ingredients: { ko: ["두부", "다시마", "폰즈", "파", "생강", "가쓰오부시"], ja: ["豆腐", "昆布", "ポン酢", "ネギ", "生姜", "かつお節"], en: ["Tofu", "Kelp", "Ponzu", "Green onion", "Ginger", "Bonito"] }, similarityPercent: 78, matchReason: { ko: "두부를 맑은 국물에 데쳐 먹는 선한 사찰식 전통", ja: "豆腐を澄んだスープで食べる精進料理の伝統", en: "Tofu in clear broth — Kyoto temple counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "도우푸 누안궈", ja: "豆腐暖鍋", en: "Tofu Hot Pot" }, tasteProfile: { sweet: 10, salty: 55, spicy: 25, umami: 80, sour: 5 }, description: { ko: "두부와 채소·버섯을 한 냄비에 끓여 먹는 중국식 훠궈", ja: "豆腐と野菜・きのこを一鍋で煮込む中国式火鍋", en: "Chinese-style hot pot with tofu, vegetables and mushrooms" }, ingredients: { ko: ["두부", "버섯", "배추", "두반장", "생강", "대파"], ja: ["豆腐", "きのこ", "白菜", "豆板醤", "生姜", "長ネギ"], en: ["Tofu", "Mushroom", "Napa cabbage", "Doubanjiang", "Ginger", "Green onion"] }, similarityPercent: 75, matchReason: { ko: "두부와 채소를 한 냄비에 끓이는 동일 구조", ja: "豆腐と野菜を一鍋で煮込む同じ構造", en: "Tofu hot pot — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-meomil-jeonbyeong",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/gyeongju-meomil-jeonbyeong.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-IR 스튜디오",
        name: { ko: "메밀전병", ja: "蕎麦チヂミ", en: "Meomil Jeonbyeong (Buckwheat Crepe Roll)" },
        region: "gyeongju",
        tasteProfile: { sweet: 10, salty: 50, spicy: 30, umami: 60, sour: 10 },
        storyDescription: {
          ko: "메밀가루 반죽을 얇게 부쳐 매콤한 무소와 김치·두부를 올려 둥글게 말아낸 경주의 향토 간식이에요. 한 입 베어 물면 구수한 메밀 향과 매콤한 속재료가 어우러져요.",
          ja: "そば粉の生地を薄く焼いて辛い大根の具材とキムチ・豆腐をのせて丸めた慶州の郷土おやつです。一口かじれば香ばしいそばの香りと辛い具材が調和します。",
          en: "Thin buckwheat crepes rolled around spicy radish, kimchi and tofu — Gyeongju's rural snack. One bite brings the earthy fragrance of buckwheat melding with the spicy filling."
        },
        ingredients: { ko: ["메밀가루", "무", "김치", "두부", "고춧가루", "참기름", "대파", "간장"], ja: ["そば粉", "大根", "キムチ", "豆腐", "唐辛子粉", "ごま油", "長ネギ", "醤油"], en: ["Buckwheat flour", "Radish", "Kimchi", "Tofu", "Chili powder", "Sesame oil", "Green onion", "Soy sauce"] },
        tags: ["메밀", "전병", "향토"],
        dupes: {
          JP: [
        { name: { ko: "소바가키 마키", ja: "そばがき巻き", en: "Sobagaki Maki" }, tasteProfile: { sweet: 5, salty: 45, spicy: 5, umami: 60, sour: 5 }, description: { ko: "메밀가루로 만든 얇은 부침에 채소를 말아낸 일본 시골식 메밀 롤", ja: "そば粉で作った薄いクレープに野菜を巻いた日本の田舎式そばロール", en: "Japanese rural buckwheat crepe rolled with vegetables" }, ingredients: { ko: ["메밀가루", "무즙", "간장", "파", "와사비", "김"], ja: ["そば粉", "大根おろし", "醤油", "ネギ", "わさび", "海苔"], en: ["Buckwheat flour", "Grated daikon", "Soy sauce", "Green onion", "Wasabi", "Nori"] }, similarityPercent: 77, matchReason: { ko: "메밀 반죽에 채소를 싸 먹는 거의 동일한 전통", ja: "そば生地に野菜を包んで食べるほぼ同じ伝統", en: "Buckwheat crepe roll — close Japanese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "챠오 멘 빙", ja: "蕎麦餅", en: "Qiao Mian Bing" }, tasteProfile: { sweet: 5, salty: 50, spicy: 10, umami: 60, sour: 5 }, description: { ko: "메밀가루 반죽에 파·채소를 넣어 부친 중국 북부식 메밀 팬케이크", ja: "そば粉生地にネギ・野菜を入れて焼いた中国北部式そばパンケーキ", en: "Northern Chinese buckwheat pancake with scallions and vegetables" }, ingredients: { ko: ["메밀가루", "대파", "양배추", "간장", "참기름", "계란"], ja: ["そば粉", "長ネギ", "キャベツ", "醤油", "ごま油", "卵"], en: ["Buckwheat flour", "Green onion", "Cabbage", "Soy sauce", "Sesame oil", "Egg"] }, similarityPercent: 73, matchReason: { ko: "메밀 반죽을 팬에 부쳐 채소와 함께 먹는 전통", ja: "そば生地をフライパンで焼いて野菜と食べる伝統", en: "Buckwheat pancake with veg — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-gyodongbeopju",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/gyeongju-gyodongbeopju.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "교동법주", ja: "キョドンベプチュ", en: "Gyodong Beopju (Traditional Rice Wine)" },
        region: "gyeongju",
        tasteProfile: { sweet: 25, salty: 5, spicy: 10, umami: 45, sour: 15 },
        storyDescription: {
          ko: "경주 최씨 종가에서 300년 넘게 빚어 내려온 맑고 향긋한 전통 곡주예요. 찹쌀과 누룩, 그리고 경주의 맑은 샘물이 만나 한 번 마시면 잊을 수 없는 부드러운 단맛을 만들어요.",
          ja: "慶州の崔氏宗家で300年以上醸し続けられてきた澄んだ香り高い伝統酒です。もち米と麹、そして慶州の澄んだ湧き水が出会い、一度飲めば忘れられない柔らかな甘みを作り出します。",
          en: "A clear aromatic traditional rice wine brewed by the Choi clan of Gyeongju for over 300 years. Glutinous rice, nuruk starter, and Gyeongju's pristine spring water meet to create an unforgettable gentle sweetness."
        },
        ingredients: { ko: ["찹쌀", "누룩", "경주 샘물", "이스트", "꿀"], ja: ["もち米", "麹", "慶州の湧き水", "酵母", "ハチミツ"], en: ["Glutinous rice", "Nuruk", "Gyeongju spring water", "Yeast", "Honey"] },
        tags: ["전통주", "법주", "종가"],
        dupes: {
          JP: [
        { name: { ko: "준마이 사케", ja: "純米酒", en: "Junmai Sake" }, tasteProfile: { sweet: 25, salty: 5, spicy: 5, umami: 55, sour: 15 }, description: { ko: "순수 쌀과 누룩, 물로만 빚어낸 일본 전통 청주", ja: "純粋な米と麹、水だけで醸した日本伝統の清酒", en: "Japanese traditional sake brewed purely from rice, koji and water" }, ingredients: { ko: ["쌀", "누룩", "물", "이스트"], ja: ["米", "麹", "水", "酵母"], en: ["Rice", "Koji", "Water", "Yeast"] }, similarityPercent: 85, matchReason: { ko: "쌀과 누룩·물로 빚는 거의 동일한 전통 양조주", ja: "米と麹・水で醸すほぼ同じ伝統醸造酒", en: "Rice-koji-water brewing — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "사오싱 주", ja: "紹興酒", en: "Shaoxing Jiu" }, tasteProfile: { sweet: 30, salty: 10, spicy: 5, umami: 55, sour: 15 }, description: { ko: "찹쌀로 빚어 오래 숙성시킨 중국 전통 황주", ja: "もち米で醸して長時間熟成させた中国伝統の黄酒", en: "Chinese traditional long-aged yellow rice wine" }, ingredients: { ko: ["찹쌀", "밀누룩", "물", "카라멜"], ja: ["もち米", "小麦麹", "水", "キャラメル"], en: ["Glutinous rice", "Wheat koji", "Water", "Caramel"] }, similarityPercent: 82, matchReason: { ko: "찹쌀과 누룩으로 빚는 전통 양조주의 공통점", ja: "もち米と麹で醸す伝統醸造酒の共通点", en: "Glutinous rice fermented wine — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-bamyeot",
        image: "",
        name: { ko: "밤엿", ja: "栗飴", en: "Bamyeot (Chestnut Toffee)" },
        region: "gyeongju",
        tasteProfile: { sweet: 85, salty: 5, spicy: 0, umami: 20, sour: 0 },
        storyDescription: {
          ko: "경주 가을의 알밤을 조청에 졸이고 얇게 굳혀낸 향긋한 전통 엿이에요. 입 안에서 사르르 녹는 달콤함이 가을 들녘의 포근한 햇살을 닮았어요.",
          ja: "慶州の秋の栗を水飴で煮詰めて薄く固めた香ばしい伝統飴です。口の中でスッと溶ける甘さが秋の野原の暖かい日差しに似ています。",
          en: "Chestnuts harvested in Gyeongju's autumn, simmered in grain syrup and set into thin slabs — a fragrant traditional toffee. Its melt-on-tongue sweetness resembles sunlight on autumn fields."
        },
        ingredients: { ko: ["밤", "조청", "꿀", "생강", "참기름"], ja: ["栗", "水飴", "ハチミツ", "生姜", "ごま油"], en: ["Chestnut", "Grain syrup", "Honey", "Ginger", "Sesame oil"] },
        tags: ["엿", "밤", "전통"],
        dupes: {
          JP: [
        { name: { ko: "쿠리 아메", ja: "栗飴", en: "Kuri Ame" }, tasteProfile: { sweet: 80, salty: 5, spicy: 0, umami: 20, sour: 0 }, description: { ko: "밤을 조청으로 졸여낸 일본 전통 밤 엿", ja: "栗を水飴で煮詰めた日本の伝統栗飴", en: "Japanese traditional chestnut toffee in grain syrup" }, ingredients: { ko: ["밤", "조청", "설탕", "간장"], ja: ["栗", "水飴", "砂糖", "醤油"], en: ["Chestnut", "Grain syrup", "Sugar", "Soy sauce"] }, similarityPercent: 88, matchReason: { ko: "밤을 조청에 졸여 만드는 거의 동일한 요리", ja: "栗を水飴で煮詰めて作るほぼ同じ料理", en: "Chestnut-and-syrup toffee — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "탕 춘리", ja: "糖炒栗子", en: "Tang Chao Lizi" }, tasteProfile: { sweet: 75, salty: 5, spicy: 0, umami: 25, sour: 0 }, description: { ko: "밤을 흑설탕과 모래에 볶아낸 중국 전통 길거리 간식", ja: "栗を黒糖と砂で炒めた中国伝統の屋台おやつ", en: "Chinese traditional street-snack of chestnuts roasted with brown sugar and sand" }, ingredients: { ko: ["밤", "흑설탕", "꿀", "모래"], ja: ["栗", "黒糖", "ハチミツ", "砂"], en: ["Chestnut", "Brown sugar", "Honey", "Sand"] }, similarityPercent: 78, matchReason: { ko: "밤에 설탕을 입혀 달콤하게 즐기는 거리 전통의 공통점", ja: "栗に砂糖を絡めて甘く楽しむ屋台伝統の共通点", en: "Sugared chestnut tradition — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-sujae-maekju",
        image: "",
        name: { ko: "수제맥주", ja: "クラフトビール", en: "Sujae Maekju (Craft Beer)" },
        region: "gyeongju",
        tasteProfile: { sweet: 15, salty: 5, spicy: 10, umami: 25, sour: 20 },
        storyDescription: {
          ko: "경주의 맑은 샘물과 한국산 쌀·홉으로 소량씩 양조하는 현대적 감각의 수제 맥주예요. 한 잔에 고도의 전통과 젊은 양조가의 실험 정신이 함께 스며 있어요.",
          ja: "慶州の澄んだ湧き水と韓国産の米・ホップで少量ずつ醸造する現代的な感覚のクラフトビールです。一杯に古都の伝統と若い醸造家の実験精神が共に溶けています。",
          en: "A modern craft beer small-batch brewed with Gyeongju's pristine spring water, Korean rice and hops. One glass blends ancient city heritage with a young brewer's experimental spirit."
        },
        ingredients: { ko: ["보리 맥아", "홉", "경주 샘물", "이스트", "쌀"], ja: ["大麦麦芽", "ホップ", "慶州の湧き水", "酵母", "米"], en: ["Barley malt", "Hops", "Gyeongju spring water", "Yeast", "Rice"] },
        tags: ["맥주", "수제", "현대"],
        dupes: {
          JP: [
        { name: { ko: "지비루", ja: "地ビール", en: "Ji-biru (Local Craft Beer)" }, tasteProfile: { sweet: 15, salty: 5, spicy: 5, umami: 25, sour: 15 }, description: { ko: "지역 재료로 소량 양조하는 일본 전통 크래프트 비어", ja: "地域の材料で少量醸造する日本の伝統クラフトビール", en: "Japanese local craft beer brewed in small batches with regional ingredients" }, ingredients: { ko: ["보리 맥아", "홉", "쌀", "이스트", "유자"], ja: ["大麦麦芽", "ホップ", "米", "酵母", "柚子"], en: ["Barley malt", "Hops", "Rice", "Yeast", "Yuzu"] }, similarityPercent: 85, matchReason: { ko: "지역 재료를 사용한 소규모 양조 크래프트 비어", ja: "地域の材料を使った小規模醸造クラフトビール", en: "Regional craft brewing — close Japanese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "징지우", ja: "精醸啤酒", en: "Jing Jiu (Chinese Craft Beer)" }, tasteProfile: { sweet: 15, salty: 5, spicy: 5, umami: 25, sour: 15 }, description: { ko: "중국 전통 재료를 응용한 크래프트 비어", ja: "中国伝統の材料を応用したクラフトビール", en: "Chinese craft beer with traditional ingredients" }, ingredients: { ko: ["보리 맥아", "홉", "화자오", "이스트", "꿀"], ja: ["大麦麦芽", "ホップ", "花椒", "酵母", "ハチミツ"], en: ["Barley malt", "Hops", "Sichuan pepper", "Yeast", "Honey"] }, similarityPercent: 75, matchReason: { ko: "지역 특색을 살린 소량 양조의 공통점", ja: "地域の特色を生かした小量醸造の共通点", en: "Regional craft beer — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "gyeongju-solsongju",
        image: "",
        name: { ko: "솔송주", ja: "松酒", en: "Solsongju (Pine Bud Liquor)" },
        region: "gyeongju",
        tasteProfile: { sweet: 20, salty: 5, spicy: 10, umami: 40, sour: 10 },
        storyDescription: {
          ko: "경주의 솔숲에서 갓 따온 솔잎과 솔 꽃봉오리를 찹쌀과 함께 담가 100일간 익혀낸 향긋한 전통 약주예요. 한 모금에 산사의 솔향과 천년 도시의 고요가 퍼져요.",
          ja: "慶州の松林で採ったばかりの松葉と松のつぼみをもち米と共に100日間熟成させた香り高い伝統薬酒です。一口で山寺の松の香りと千年都市の静けさが広がります。",
          en: "Freshly picked pine needles and buds from Gyeongju's pine forests aged 100 days with glutinous rice — a fragrant traditional medicinal wine. One sip releases the scent of mountain-temple pines and the quiet of a millennial city."
        },
        ingredients: { ko: ["솔잎", "솔 꽃봉오리", "찹쌀", "누룩", "경주 샘물"], ja: ["松葉", "松のつぼみ", "もち米", "麹", "慶州の湧き水"], en: ["Pine needles", "Pine buds", "Glutinous rice", "Nuruk", "Gyeongju spring water"] },
        tags: ["전통주", "약주", "솔향"],
        dupes: {
          JP: [
        { name: { ko: "마츠시타 슈", ja: "松下酒", en: "Matsushita Shu" }, tasteProfile: { sweet: 20, salty: 5, spicy: 5, umami: 45, sour: 10 }, description: { ko: "솔잎을 우려낸 향긋한 일본 전통 약주", ja: "松葉を漬けた香り高い日本伝統の薬酒", en: "Japanese traditional herbal sake infused with pine needles" }, ingredients: { ko: ["사케", "솔잎", "꿀", "유자"], ja: ["日本酒", "松葉", "ハチミツ", "柚子"], en: ["Sake", "Pine needles", "Honey", "Yuzu"] }, similarityPercent: 78, matchReason: { ko: "솔잎을 사용한 전통 약주의 공통점", ja: "松葉を使った伝統薬酒の共通点", en: "Pine-needle traditional liquor — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "송예 주", ja: "松葉酒", en: "Song Ye Jiu" }, tasteProfile: { sweet: 20, salty: 5, spicy: 5, umami: 45, sour: 10 }, description: { ko: "솔잎을 곡주에 담가 오래 숙성시킨 중국 전통 약주", ja: "松葉を穀酒に漬けて長時間熟成させた中国伝統の薬酒", en: "Chinese traditional liquor with pine needles aged in grain wine" }, ingredients: { ko: ["찹쌀", "누룩", "솔잎", "구기자", "꿀"], ja: ["もち米", "麹", "松葉", "クコの実", "ハチミツ"], en: ["Glutinous rice", "Koji", "Pine needles", "Wolfberry", "Honey"] }, similarityPercent: 82, matchReason: { ko: "솔잎을 곡주에 담가 오래 숙성시키는 거의 동일한 전통", ja: "松葉を穀酒に漬けて熟成させるほぼ同じ伝統", en: "Pine-needle grain wine — close Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      }
    ]
  },
  {
    code: "cheonan",
    name: { ko: "천안", ja: "天安", en: "Cheonan" },
    icon: "🌰",
    image: "/images/village/cheonan.png",
    description: {
      ko: "호두과자와 순대의 고장, 교통의 중심지",
      ja: "クルミ菓子とスンデの里、交通の中心地",
      en: "The center of transport, home of walnut cookies and sundae"
    },
    foods: [
      {
        id: "cheonan-walnut-cookie",
        name: { ko: "호두과자", ja: "クルミ菓子", en: "Walnut Cookie" },
        region: "cheonan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/cheonan-walnut-cookie.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        tasteProfile: { sweet: 72, salty: 12, spicy: 0, umami: 18, sour: 5 },
        storyDescription: {
          ko: "천안을 대표하는 국민 간식이에요. 호두 모양의 작은 틀에 달콤한 팥소와 호두 한 조각을 넣고 구워낸 빵으로, 고속도로 휴게소에서 갓 구운 것을 사 먹는 것이 천안 여행의 진짜 묘미랍니다.",
          ja: "天安を代表する国民的おやつです。クルミの形をした小さな型に甘い小豆餡とクルミを一切れ入れて焼いたパンで、高速道路のサービスエリアで焼きたてを買って食べるのが天安旅行の本当の楽しみです。",
          en: "Cheonan's iconic national snack. Small walnut-shaped pastries filled with sweet red bean paste and a walnut piece — buying them fresh off the griddle at a highway rest stop is the quintessential Cheonan travel moment."
        },
        ingredients: { ko: ["밀가루", "팥소", "호두", "달걀", "버터", "설탕"], ja: ["小麦粉", "小豆餡", "クルミ", "卵", "バター", "砂糖"], en: ["Wheat flour", "Red bean paste", "Walnut", "Egg", "Butter", "Sugar"] },
        tags: ["간식", "호두", "팥"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-byeongcheon-sundae",
        name: { ko: "병천순대", ja: "ビョンチョンスンデ", en: "Byeongcheon Sundae" },
        region: "cheonan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/cheonan-byeongcheon-sundae.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        tasteProfile: { sweet: 15, salty: 55, spicy: 20, umami: 75, sour: 5 },
        storyDescription: {
          ko: "당면과 채소, 선지를 듬뿍 넣어 꽉 채운 병천 특유의 순대예요. 다른 지역 순대보다 채소가 훨씬 많이 들어가 가볍고 깔끔한 맛이 나고, 천안 여행자들이 꼭 들러야 하는 명물 음식이랍니다.",
          ja: "春雨と野菜、血を惜しみなく詰め込んだ病川ならではのスンデです。他の地域のスンデより野菜がはるかに多く入っていて、軽くてさっぱりとした味がし、天安を訪れる旅行者が必ず立ち寄る名物料理です。",
          en: "Byeongcheon's signature sundae stuffed generously with glass noodles, vegetables, and blood. Far more veggie-forward than other regional varieties, it's light and clean-tasting — a must-try landmark food for anyone visiting Cheonan."
        },
        ingredients: { ko: ["돼지 소장", "당면", "채소", "선지", "찹쌀", "파", "마늘"], ja: ["豚の小腸", "春雨", "野菜", "血", "もち米", "ネギ", "ニンニク"], en: ["Pork intestine casing", "Glass noodles", "Vegetables", "Blood", "Sticky rice", "Green onion", "Garlic"] },
        tags: ["순대", "전통", "명물"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-sundae-soup",
        name: { ko: "순대국밥", ja: "スンデクッパ", en: "Sundae Soup" },
        region: "cheonan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/cheonan-sundae-soup.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-김지영",
        tasteProfile: { sweet: 10, salty: 55, spicy: 35, umami: 80, sour: 5 },
        storyDescription: {
          ko: "뽀얗게 우러난 돼지 사골 국물에 순대 한 줌이 풍덩 빠져 있어요. 국물 한 모금에 구수함이 입을 가득 채우고, 순대 한 점에 쫄깃한 식감이 더해지면서 천안 장날의 따뜻한 정이 느껴진답니다.",
          ja: "白く濁った豚骨スープにスンデがどっぷり浸かっています。スープを一口飲むと香ばしさが口いっぱいに広がり、スンデを一切れ食べると弾力のある食感が加わって、天安の市場の日の温かい情が感じられます。",
          en: "Milky pork bone broth with chunks of sundae submerged inside. One sip fills your mouth with savory depth, and a bite of chewy sundae adds texture — you can taste the warm community spirit of Cheonan's market days."
        },
        ingredients: { ko: ["사골육수", "순대", "머리고기", "내장", "파", "고춧가루", "새우젓"], ja: ["豚骨スープ", "スンデ", "豚頭肉", "内臓", "ネギ", "唐辛子粉", "アミの塩辛"], en: ["Pork bone broth", "Sundae", "Head meat", "Offal", "Green onion", "Red pepper", "Salted shrimp"] },
        tags: ["국밥", "순대", "구수함"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-charcoal-dakgalbi",
        name: { ko: "숯불 닭갈비", ja: "炭火ダッカルビ", en: "Charcoal Dakgalbi" },
        region: "cheonan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/cheonan-charcoal-dakgalbi.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        tasteProfile: { sweet: 35, salty: 50, spicy: 65, umami: 70, sour: 10 },
        storyDescription: {
          ko: "천안에서는 일반 닭갈비와 달리 숯불 위에서 직접 구워낸 닭갈비가 유명해요. 연기 스며든 숯불 향기와 매콤달콤한 양념이 닭고기 속까지 배어들어, 한 입 베어 물면 입 안 가득 숯불 향연이 펼쳐져요.",
          ja: "天安では普通のダッカルビと違い、炭火で直接焼くダッカルビが有名です。煙が染み込んだ炭火の香りと甘辛い薬味が鶏肉の芯まで染みて、一口かじると口いっぱいに炭火の宴が広がります。",
          en: "Cheonan is famous for dakgalbi grilled directly over charcoal, unlike the usual stir-fried version. The smoky charcoal aroma and sweet-spicy marinade penetrate deep into the chicken — one bite and your mouth is filled with the festival of charcoal smoke."
        },
        ingredients: { ko: ["닭고기", "고추장", "간장", "설탕", "마늘", "참기름", "파"], ja: ["鶏肉", "コチュジャン", "醤油", "砂糖", "ニンニク", "ごま油", "ネギ"], en: ["Chicken", "Gochujang", "Soy sauce", "Sugar", "Garlic", "Sesame oil", "Green onion"] },
        tags: ["숯불", "닭갈비", "매콤"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-fruit-mochi",
        name: { ko: "생과일 모찌", ja: "生フルーツ大福", en: "Fresh Fruit Mochi" },
        region: "cheonan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/cheonan-fruit-mochi.jpeg",
        tasteProfile: { sweet: 75, salty: 5, spicy: 0, umami: 10, sour: 20 },
        storyDescription: {
          ko: "촉촉한 찹쌀 떡 피 속에 생딸기나 망고 같은 신선한 과일이 통째로 들어있어요. 한 입 베어 물면 달콤한 찹쌀 향과 함께 과즙이 터지면서 어느 디저트 카페도 부럽지 않은 행복감이 밀려온답니다.",
          ja: "しっとりしたもち米の皮の中に、生いちごやマンゴーなどの新鮮な果物が丸ごと入っています。一口かじると甘いもち米の香りとともに果汁が弾けて、どんなデザートカフェも羨ましくない幸福感が押し寄せます。",
          en: "Moist sticky rice skin wrapping a whole fresh strawberry or mango inside. One bite releases sweet mochi fragrance and a burst of fruit juice — pure happiness that rivals any fancy dessert cafe."
        },
        ingredients: { ko: ["찹쌀가루", "생딸기", "생크림", "설탕", "전분", "팥소"], ja: ["もち米粉", "生いちご", "生クリーム", "砂糖", "でんぷん", "小豆餡"], en: ["Glutinous rice flour", "Fresh strawberry", "Heavy cream", "Sugar", "Starch", "Red bean paste"] },
        tags: ["디저트", "과일", "모찌"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-lotus-rice",
        name: { ko: "연잎밥 정식", ja: "蓮の葉ご飯定食", en: "Lotus Leaf Rice Set" },
        region: "cheonan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/cheonan-lotus-rice.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한가람_한국관광공사 프레임스튜디오",
        tasteProfile: { sweet: 25, salty: 45, spicy: 20, umami: 65, sour: 10 },
        storyDescription: {
          ko: "향긋한 연잎으로 찹쌀밥과 견과류를 싸서 쪄낸 건강 요리예요. 연잎 특유의 은은한 향이 밥 속으로 스며들면서 일반 밥과는 전혀 다른 청아한 풍미를 만들어내고, 눈에도 먹기 전부터 힐링이 됩니다.",
          ja: "香り高い蓮の葉でもち米ごはんとナッツを包んで蒸した健康料理です。蓮の葉独特のほのかな香りがご飯に染み込んで、普通のご飯とは全く違う清雅な風味を生み出し、食べる前から目にも癒やしを与えてくれます。",
          en: "A wholesome dish of glutinous rice and nuts steamed inside fragrant lotus leaves. The lotus' delicate aroma permeates the rice, creating a clean, ethereal flavor unlike any ordinary rice — healing for the eyes even before the first bite."
        },
        ingredients: { ko: ["연잎", "찹쌀", "은행", "잣", "대추", "밤", "간장"], ja: ["蓮の葉", "もち米", "銀杏", "松の実", "なつめ", "栗", "醤油"], en: ["Lotus leaf", "Glutinous rice", "Ginkgo", "Pine nuts", "Jujube", "Chestnut", "Soy sauce"] },
        tags: ["연잎", "건강", "찹쌀"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-mushroom-stew",
        name: { ko: "버섯전골", ja: "きのこ鍋", en: "Mushroom Hotpot" },
        region: "cheonan",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/cheonan-mushroom-stew.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        tasteProfile: { sweet: 15, salty: 45, spicy: 25, umami: 90, sour: 5 },
        storyDescription: {
          ko: "충청 지역에서 재배되는 다양한 버섯들이 그 향과 맛을 국물 속에 풀어내는 웰빙 전골이에요. 먹을수록 감칠맛이 깊어지고, 건더기를 건져 먹을 때 버섯 특유의 향긋한 식감이 입 안에 가득 차는 게 묘미랍니다.",
          ja: "忠清地域で栽培されたさまざまなキノコがその香りと旨味をスープに溶かし込んだウェルビーイング鍋です。食べるほどに旨味が深まり、具を掬って食べるときにキノコ独特の香り豊かな食感が口いっぱいに広がるのが醍醐味です。",
          en: "A wellness hotpot showcasing diverse mushrooms grown in the Chungcheong region, releasing their aroma and flavor into the broth. The umami deepens with every bite, and the fragrant, earthy texture of the mushrooms fills your mouth completely."
        },
        ingredients: { ko: ["표고버섯", "느타리버섯", "팽이버섯", "두부", "당면", "파", "간장", "참기름"], ja: ["椎茸", "ヒラタケ", "えのき茸", "豆腐", "春雨", "ネギ", "醤油", "ごま油"], en: ["Shiitake", "Oyster mushroom", "Enoki", "Tofu", "Glass noodles", "Green onion", "Soy sauce", "Sesame oil"] },
        tags: ["버섯", "전골", "감칠맛"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-local-bakery",
        name: { ko: "뚜쥬루 앙버터빵", ja: "トゥジュル餡バターパン", en: "Ttujuru Anpan Butter Bread" },
        region: "cheonan",
        image: "",
        tasteProfile: { sweet: 65, salty: 20, spicy: 0, umami: 15, sour: 5 },
        storyDescription: {
          ko: "천안의 인기 로컬 베이커리 '뚜쥬루'의 시그니처 앙버터 빵이에요. 고소한 발효 버터와 달콤한 팥소가 부드러운 브리오슈 빵 사이에 끼워져 있어, 한 입 먹으면 고소함과 달콤함이 파도처럼 밀려오는 행복한 빵이에요.",
          ja: "天安の人気ローカルベーカリー「뚜쥬루」のシグネチャー餡バターパンです。香ばしい発酵バターと甘い小豆餡が柔らかいブリオッシュパンに挟まれていて、一口食べると香ばしさと甘さが波のように押し寄せる幸せなパンです。",
          en: "The signature anpan butter bread from Cheonan's beloved local bakery 'Ttujuru'. Creamy cultured butter and sweet red bean paste sandwiched in soft brioche — one bite and waves of nuttiness and sweetness wash over you."
        },
        ingredients: { ko: ["브리오슈", "팥소", "발효 버터", "소금", "설탕"], ja: ["ブリオッシュ", "小豆餡", "発酵バター", "塩", "砂糖"], en: ["Brioche", "Red bean paste", "Cultured butter", "Salt", "Sugar"] },
        tags: ["베이커리", "앙버터", "로컬"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-heuk-dwaeji-gui",
        image: "",
        name: { ko: "흑돼지구이", ja: "黒豚焼き", en: "Black Pork Grill" },
        region: "cheonan",
        tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 85, sour: 5 },
        storyDescription: {
          ko: "천안 근교 농장에서 자란 흑돼지 삼겹살을 숯불에 구워 쌈장과 함께 쌈에 싸 먹는 고소한 구이예요. 풍부한 기름기와 쫄깃한 살결이 한 점에 천안의 자연을 담고 있어요.",
          ja: "天安近郊の農場で育った黒豚のバラ肉を炭火で焼きサムジャンと共に包んで食べる香ばしい焼き物です。豊かな脂と歯ごたえのある身が一口に天安の自然を込めています。",
          en: "Black pork belly from farms around Cheonan grilled over charcoal and wrapped with ssamjang — a rich, satisfying grill. Generous fat and springy flesh carry Cheonan's countryside in each bite."
        },
        ingredients: { ko: ["흑돼지 삼겹살", "상추", "깻잎", "마늘", "쌈장", "파절이", "소금", "참기름"], ja: ["黒豚バラ肉", "サンチュ", "エゴマの葉", "ニンニク", "サムジャン", "ネギ和え", "塩", "ごま油"], en: ["Black pork belly", "Lettuce", "Perilla leaf", "Garlic", "Ssamjang", "Scallion salad", "Salt", "Sesame oil"] },
        tags: ["흑돼지", "구이", "쌈"],
        dupes: {
          JP: [
        { name: { ko: "부타 야키", ja: "豚焼き", en: "Buta Yaki" }, tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 85, sour: 5 }, description: { ko: "두꺼운 돼지 삼겹살을 간장·미림 양념에 구운 일본식 돼지고기 구이", ja: "厚切り豚バラ肉を醤油・みりんで焼いた日本式豚肉焼き", en: "Japanese pork belly grilled with soy-mirin glaze" }, ingredients: { ko: ["돼지 삼겹살", "간장", "미림", "생강", "마늘", "파"], ja: ["豚バラ肉", "醤油", "みりん", "生姜", "ニンニク", "ネギ"], en: ["Pork belly", "Soy sauce", "Mirin", "Ginger", "Garlic", "Green onion"] }, similarityPercent: 85, matchReason: { ko: "두꺼운 삼겹살을 직화에 구워 간장 양념과 먹는 거의 동일한 요리", ja: "厚切りバラ肉を直火で焼いて醤油ダレで食べるほぼ同じ料理", en: "Charcoal-grilled pork belly — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "회궈러우", ja: "回鍋肉", en: "Hui Guo Rou" }, tasteProfile: { sweet: 15, salty: 55, spicy: 40, umami: 80, sour: 5 }, description: { ko: "삶은 삼겹살을 양배추와 두반장에 볶은 사천식 돼지고기 볶음", ja: "茹でたバラ肉をキャベツと豆板醤で炒めた四川式豚肉炒め", en: "Sichuan twice-cooked pork belly with cabbage and doubanjiang" }, ingredients: { ko: ["삼겹살", "양배추", "두반장", "대파", "마늘", "고추"], ja: ["バラ肉", "キャベツ", "豆板醤", "長ネギ", "ニンニク", "唐辛子"], en: ["Pork belly", "Cabbage", "Doubanjiang", "Green onion", "Garlic", "Chili"] }, similarityPercent: 73, matchReason: { ko: "삼겹살을 양념과 함께 조리하는 동아시아 공통 요리", ja: "バラ肉をタレと共に調理する東アジア共通料理", en: "Pork belly with savory sauce — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-cheonggukjang",
        image: "",
        name: { ko: "청국장찌개", ja: "チョングクジャンチゲ", en: "Cheonggukjang Jjigae" },
        region: "cheonan",
        tasteProfile: { sweet: 10, salty: 60, spicy: 35, umami: 90, sour: 10 },
        storyDescription: {
          ko: "이틀간 띄운 콩으로 만든 청국장에 두부·김치·돼지고기를 넣고 구수하게 끓여낸 천안의 시골 밥상이에요. 강한 발효 향 속에 담긴 깊은 감칠맛은 한 숟갈로 충분해요.",
          ja: "二日間発酵させた豆で作ったチョングクジャンに豆腐・キムチ・豚肉を入れて香ばしく煮込んだ天安の田舎の食卓です。強い発酵の香りに秘められた深い旨味は一さじで十分です。",
          en: "Cheonggukjang — soybeans fermented for two days — simmered with tofu, kimchi and pork into a rustic Cheonan stew. Its pungent aroma conceals a depth of umami that one spoonful fully delivers."
        },
        ingredients: { ko: ["청국장", "두부", "묵은 김치", "돼지고기", "애호박", "대파", "마늘", "멸치 육수"], ja: ["チョングクジャン", "豆腐", "熟成キムチ", "豚肉", "ズッキーニ", "長ネギ", "ニンニク", "煮干しだし"], en: ["Cheonggukjang", "Tofu", "Aged kimchi", "Pork", "Zucchini", "Green onion", "Garlic", "Anchovy broth"] },
        tags: ["청국장", "찌개", "발효"],
        dupes: {
          JP: [
        { name: { ko: "낫토 미소 나베", ja: "納豆味噌鍋", en: "Natto Miso Nabe" }, tasteProfile: { sweet: 10, salty: 60, spicy: 10, umami: 90, sour: 5 }, description: { ko: "발효 콩(낫토)을 미소 국물에 두부와 함께 끓여낸 일본식 발효 콩 전골", ja: "発酵豆（納豆）を味噌スープに豆腐と共に煮込む日本式発酵豆鍋", en: "Japanese fermented soybean hot pot with natto, miso and tofu" }, ingredients: { ko: ["낫토", "미소", "두부", "배추", "다시", "파"], ja: ["納豆", "味噌", "豆腐", "白菜", "だし", "ネギ"], en: ["Natto", "Miso", "Tofu", "Napa cabbage", "Dashi", "Green onion"] }, similarityPercent: 82, matchReason: { ko: "강하게 발효된 콩으로 두부와 끓이는 거의 동일한 요리", ja: "強く発酵した豆で豆腐と煮込むほぼ同じ料理", en: "Fermented bean stew — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "또우즈 더우푸", ja: "豆鼓豆腐", en: "Douchi Tofu" }, tasteProfile: { sweet: 10, salty: 65, spicy: 30, umami: 90, sour: 5 }, description: { ko: "발효 검은콩(또우즈)으로 두부와 채소를 볶아낸 중국식 발효 콩 요리", ja: "発酵黒豆（豆鼓）で豆腐と野菜を炒める中国式発酵豆料理", en: "Chinese douchi fermented black bean tofu stew" }, ingredients: { ko: ["두부", "또우즈", "두반장", "마늘", "대파", "고추"], ja: ["豆腐", "豆鼓", "豆板醤", "ニンニク", "長ネギ", "唐辛子"], en: ["Tofu", "Douchi", "Doubanjiang", "Garlic", "Green onion", "Chili"] }, similarityPercent: 78, matchReason: { ko: "발효 콩과 두부를 함께 조리하는 공통 요리", ja: "発酵豆と豆腐を共に調理する共通料理", en: "Fermented bean tofu — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-hongeo-samhap",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/cheonan-hongeo-samhap.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-디엔에이스튜디오",
        name: { ko: "홍어삼합", ja: "ホンオサマプ", en: "Hongeo Samhap (Fermented Skate Trio)" },
        region: "cheonan",
        tasteProfile: { sweet: 5, salty: 65, spicy: 20, umami: 90, sour: 10 },
        storyDescription: {
          ko: "삭힌 홍어에 삶은 돼지고기와 묵은 김치를 한 입에 싸 먹는 천안식 삼합이에요. 암모니아 향과 고기의 고소함, 김치의 산미가 삼박자로 폭발하는 어른의 맛이에요.",
          ja: "発酵したエイに茹でた豚肉と熟成キムチを一口で包んで食べる天安式サマプです。アンモニアの香りと肉の香ばしさ、キムチの酸味が三拍子で弾ける大人の味です。",
          en: "Fermented skate, boiled pork and aged kimchi wrapped together in one bite — Cheonan's trio. Ammonia aroma, savory pork and kimchi's tang detonate a grown-up flavor symphony."
        },
        ingredients: { ko: ["삭힌 홍어", "삶은 돼지고기", "묵은 김치", "막걸리", "상추", "마늘", "새우젓", "참기름"], ja: ["発酵エイ", "茹で豚肉", "熟成キムチ", "マッコリ", "サンチュ", "ニンニク", "アミの塩辛", "ごま油"], en: ["Fermented skate", "Boiled pork", "Aged kimchi", "Makgeolli", "Lettuce", "Garlic", "Salted shrimp", "Sesame oil"] },
        tags: ["홍어", "삼합", "발효"],
        dupes: {
          JP: [
        { name: { ko: "쿠사야 산마", ja: "くさや三品", en: "Kusaya Set" }, tasteProfile: { sweet: 5, salty: 70, spicy: 5, umami: 90, sour: 5 }, description: { ko: "발효 생선(쿠사야)을 돼지고기·절임 채소와 함께 먹는 일본 이즈식 발효 요리", ja: "発酵魚（くさや）を豚肉・漬物と共に食べる日本・伊豆式の発酵料理", en: "Japanese Izu-style fermented kusaya fish with pork and pickles" }, ingredients: { ko: ["쿠사야", "돼지고기", "절임 채소", "간장", "와사비", "사케"], ja: ["くさや", "豚肉", "漬物", "醤油", "わさび", "日本酒"], en: ["Kusaya", "Pork", "Pickles", "Soy sauce", "Wasabi", "Sake"] }, similarityPercent: 80, matchReason: { ko: "강하게 발효된 생선을 고기·절임과 함께 먹는 거의 동일한 요리", ja: "強く発酵した魚を肉・漬物と共に食べるほぼ同じ料理", en: "Fermented fish trio — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "처우 위 샌", ja: "臭魚三品", en: "Chou Yu Three Combo" }, tasteProfile: { sweet: 5, salty: 65, spicy: 25, umami: 90, sour: 10 }, description: { ko: "발효된 생선과 돼지고기·절임 채소를 함께 먹는 중국식 발효 생선 요리", ja: "発酵した魚と豚肉・漬物を共に食べる中国式発酵魚料理", en: "Chinese fermented fish with pork and pickle combination" }, ingredients: { ko: ["발효 생선", "돼지고기", "쓰촨 김치", "대파", "생강", "참기름"], ja: ["発酵魚", "豚肉", "四川キムチ", "長ネギ", "生姜", "ごま油"], en: ["Fermented fish", "Pork", "Sichuan pickle", "Green onion", "Ginger", "Sesame oil"] }, similarityPercent: 75, matchReason: { ko: "발효 생선·고기·절임 채소 조합을 먹는 해석", ja: "発酵魚・肉・漬物の組み合わせを食べる解釈", en: "Fermented fish combo — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-boribap-jeongsik",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/cheonan-boribap-jeongsik.jpeg",
        name: { ko: "보리밥정식", ja: "麦ご飯定食", en: "Boribap Jeongsik" },
        region: "cheonan",
        tasteProfile: { sweet: 10, salty: 50, spicy: 25, umami: 60, sour: 10 },
        storyDescription: {
          ko: "구수한 보리밥에 열 가지 제철 나물과 된장찌개·쌈 채소를 곁들인 천안의 시골 정식이에요. 한 상에 농촌의 사계절이 담긴 소박하고 건강한 밥상이에요.",
          ja: "香ばしい麦ご飯に十種の旬のナムルと味噌チゲ・サムの野菜を添えた天安の田舎の定食です。一膳に農村の四季が詰まった素朴で健康的な食卓です。",
          en: "Nutty barley rice with ten seasonal namul, doenjang stew and wrapping greens — Cheonan's farmhouse set meal. A humble, wholesome table capturing all four countryside seasons."
        },
        ingredients: { ko: ["보리", "쌀", "고사리", "시금치", "콩나물", "된장", "상추", "고추장"], ja: ["麦", "米", "ワラビ", "ほうれん草", "豆もやし", "味噌", "サンチュ", "コチュジャン"], en: ["Barley", "Rice", "Bracken", "Spinach", "Bean sprouts", "Doenjang", "Lettuce", "Gochujang"] },
        tags: ["보리밥", "정식", "시골"],
        dupes: {
          JP: [
        { name: { ko: "무기메시 테이쇼쿠", ja: "麦飯定食", en: "Mugimeshi Teishoku" }, tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 60, sour: 5 }, description: { ko: "보리밥과 여러 반찬·국을 한 상에 내는 일본식 건강 정식", ja: "麦飯と様々なおかず・汁物を一膳に出す日本式健康定食", en: "Japanese healthy barley rice set with sides and soup" }, ingredients: { ko: ["보리밥", "츠케모노", "미소시루", "생선구이", "나물", "계란"], ja: ["麦飯", "漬物", "味噌汁", "焼き魚", "ナムル", "卵"], en: ["Barley rice", "Pickles", "Miso soup", "Grilled fish", "Namul", "Egg"] }, similarityPercent: 85, matchReason: { ko: "보리밥과 여러 반찬을 한 상에 내는 거의 동일한 건강 정식", ja: "麦飯と様々なおかずを一膳に出すほぼ同じ健康定食", en: "Barley rice set — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "다미 차이 판", ja: "大麦菜飯", en: "Damai Cai Fan" }, tasteProfile: { sweet: 5, salty: 50, spicy: 10, umami: 60, sour: 5 }, description: { ko: "보리밥에 여러 채소 반찬을 곁들인 중국 북부식 건강 밥상", ja: "麦飯に様々な野菜のおかずを添えた中国北部式の健康ご飯", en: "Northern Chinese barley rice with various vegetable sides" }, ingredients: { ko: ["보리밥", "청경채", "두부", "간장", "부추", "참기름"], ja: ["麦飯", "チンゲン菜", "豆腐", "醤油", "ニラ", "ごま油"], en: ["Barley rice", "Bok choy", "Tofu", "Soy sauce", "Chive", "Sesame oil"] }, similarityPercent: 72, matchReason: { ko: "보리밥을 중심으로 여러 채소 반찬을 먹는 공통점", ja: "麦飯を中心に様々な野菜のおかずを食べる共通点", en: "Barley rice meal — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-ureong-doenjang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/cheonan-ureong-doenjang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 박은경",
        name: { ko: "우렁된장", ja: "タニシ味噌", en: "Ureong Doenjang" },
        region: "cheonan",
        tasteProfile: { sweet: 10, salty: 60, spicy: 25, umami: 90, sour: 5 },
        storyDescription: {
          ko: "천안 논에서 잡은 우렁이를 된장 국물에 넣고 호박·버섯과 함께 끓여낸 구수한 향토 찌개예요. 쫄깃한 우렁이 씹는 재미와 된장 국물이 시골 밥상을 든든하게 만들어줘요.",
          ja: "天安の田んぼで採ったタニシを味噌スープに入れてズッキーニ・きのこと共に煮込んだ香ばしい郷土チゲです。コリコリのタニシの食感と味噌スープが田舎の食卓を豊かにします。",
          en: "River snails from Cheonan's rice paddies simmered in doenjang broth with zucchini and mushrooms — a nutty local stew. The chewy snail bites and savory miso broth enrich the farmhouse table."
        },
        ingredients: { ko: ["우렁이", "된장", "애호박", "표고버섯", "두부", "대파", "마늘", "멸치 육수"], ja: ["タニシ", "味噌", "ズッキーニ", "椎茸", "豆腐", "長ネギ", "ニンニク", "煮干しだし"], en: ["River snail", "Doenjang", "Zucchini", "Shiitake", "Tofu", "Green onion", "Garlic", "Anchovy broth"] },
        tags: ["우렁", "된장", "향토"],
        dupes: {
          JP: [
        { name: { ko: "타니시 미소시루", ja: "タニシ味噌汁", en: "Tanishi Miso Shiru" }, tasteProfile: { sweet: 5, salty: 60, spicy: 5, umami: 90, sour: 5 }, description: { ko: "타니시(민물 우렁)를 미소 국물에 끓여낸 일본 농촌식 우렁 미소시루", ja: "タニシを味噌スープで煮込む日本の農村式タニシ味噌汁", en: "Japanese rural miso soup with river snails" }, ingredients: { ko: ["타니시", "미소", "두부", "파", "다시마", "생강"], ja: ["タニシ", "味噌", "豆腐", "ネギ", "昆布", "生姜"], en: ["River snail", "Miso", "Tofu", "Green onion", "Kelp", "Ginger"] }, similarityPercent: 87, matchReason: { ko: "우렁이를 발효 콩장 국물에 끓이는 거의 동일한 요리", ja: "タニシを発酵豆醤スープで煮込むほぼ同じ料理", en: "River snail miso — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "톈루 더우장", ja: "田螺豆醤湯", en: "Tian Luo Douzhi" }, tasteProfile: { sweet: 5, salty: 60, spicy: 40, umami: 90, sour: 5 }, description: { ko: "민물 우렁을 두반장·마라 국물에 끓여낸 중국식 우렁 탕", ja: "川タニシを豆板醤・麻辣スープで煮込む中国式タニシ鍋", en: "Chinese river snail hot pot in doubanjiang mala broth" }, ingredients: { ko: ["민물 우렁", "두반장", "화자오", "대파", "마늘", "생강"], ja: ["川タニシ", "豆板醤", "花椒", "長ネギ", "ニンニク", "生姜"], en: ["River snail", "Doubanjiang", "Sichuan pepper", "Green onion", "Garlic", "Ginger"] }, similarityPercent: 80, matchReason: { ko: "우렁이를 발효 콩장 국물에 매콤하게 끓이는 공통점", ja: "タニシを発酵豆醤スープで辛く煮込む共通点", en: "Snail mala broth — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-dubu-kimchi",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/cheonan-dubu-kimchi.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "두부김치", ja: "豆腐キムチ", en: "Dubu Kimchi" },
        region: "cheonan",
        tasteProfile: { sweet: 10, salty: 55, spicy: 55, umami: 75, sour: 25 },
        storyDescription: {
          ko: "부드럽게 데친 두부 위에 잘 익은 김치와 돼지고기를 매콤하게 볶아 올린 천안의 막걸리 안주예요. 두부의 담백함과 김치의 매운맛이 한 접시에 어우러져요.",
          ja: "柔らかく茹でた豆腐の上に熟成キムチと豚肉をピリ辛に炒めてのせた天安のマッコリおつまみです。豆腐の淡白さとキムチの辛さが一皿に調和します。",
          en: "Silken-poached tofu topped with spicy stir-fried kimchi and pork — Cheonan's makgeolli companion. The tofu's mildness and kimchi's fire harmonize on a single plate."
        },
        ingredients: { ko: ["두부", "묵은 김치", "돼지고기", "대파", "마늘", "고춧가루", "설탕", "참기름"], ja: ["豆腐", "熟成キムチ", "豚肉", "長ネギ", "ニンニク", "唐辛子粉", "砂糖", "ごま油"], en: ["Tofu", "Aged kimchi", "Pork", "Green onion", "Garlic", "Chili powder", "Sugar", "Sesame oil"] }, tags: ["두부", "김치", "안주"],
        dupes: {
          JP: [
        { name: { ko: "유도후 킴치", ja: "湯豆腐キムチ", en: "Yudofu Kimuchi" }, tasteProfile: { sweet: 10, salty: 55, spicy: 40, umami: 75, sour: 25 }, description: { ko: "데친 두부에 김치와 돼지고기를 볶아 올린 일본식 퓨전 요리", ja: "湯豆腐にキムチと豚肉を炒めてのせる日本式フュージョン", en: "Japanese fusion of boiled tofu topped with kimchi-pork stir-fry" }, ingredients: { ko: ["두부", "김치", "돼지고기", "파", "간장", "미림"], ja: ["豆腐", "キムチ", "豚肉", "ネギ", "醤油", "みりん"], en: ["Tofu", "Kimchi", "Pork", "Green onion", "Soy sauce", "Mirin"] }, similarityPercent: 82, matchReason: { ko: "두부 위에 김치·고기 볶음을 올리는 거의 동일한 요리", ja: "豆腐の上にキムチ・肉炒めをのせるほぼ同じ料理", en: "Tofu with kimchi-pork — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "두부 파오차이 러우", ja: "豆腐泡菜肉", en: "Tofu Paocai Rou" }, tasteProfile: { sweet: 10, salty: 55, spicy: 45, umami: 80, sour: 30 }, description: { ko: "두부 위에 발효 채소·돼지고기 볶음을 올린 중국 사천식 퓨전", ja: "豆腐の上に発酵野菜・豚肉炒めをのせた中国四川式フュージョン", en: "Sichuan fusion tofu topped with fermented veg and pork stir-fry" }, ingredients: { ko: ["두부", "파오차이", "돼지고기", "두반장", "화자오", "대파"], ja: ["豆腐", "泡菜", "豚肉", "豆板醤", "花椒", "長ネギ"], en: ["Tofu", "Paocai", "Pork", "Doubanjiang", "Sichuan pepper", "Green onion"] }, similarityPercent: 78, matchReason: { ko: "두부에 발효 채소와 고기를 올려 먹는 공통점", ja: "豆腐に発酵野菜と肉をのせる共通点", en: "Tofu paocai pork — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-makgeolli-ppang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/cheonan-makgeolli-ppang.jpeg",
        name: { ko: "막걸리빵", ja: "マッコリパン", en: "Makgeolli Bread" },
        region: "cheonan",
        tasteProfile: { sweet: 50, salty: 10, spicy: 0, umami: 20, sour: 20 },
        storyDescription: {
          ko: "천안 막걸리로 반죽을 발효시켜 쫄깃하고 부드럽게 찐 전통 빵이에요. 은은한 술 향과 달콤한 설탕 맛이 어우러져 시골 할머니의 기억을 불러일으켜요.",
          ja: "天安のマッコリで生地を発酵させてもちもちで柔らかく蒸した伝統パンです。ほのかな酒の香りと甘い砂糖味が田舎のおばあちゃんの記憶を呼び起こします。",
          en: "Traditional steamed bread with dough fermented using Cheonan makgeolli — chewy, soft and gently boozy. A subtle rice-wine aroma and sweet sugar notes awaken memories of a countryside grandmother."
        },
        ingredients: { ko: ["밀가루", "천안 막걸리", "설탕", "소금", "베이킹소다", "팥앙금", "참깨", "식용유"], ja: ["小麦粉", "天安マッコリ", "砂糖", "塩", "重曹", "小豆あん", "ゴマ", "食用油"], en: ["Flour", "Cheonan makgeolli", "Sugar", "Salt", "Baking soda", "Red bean paste", "Sesame", "Oil"] },
        tags: ["막걸리빵", "쫄깃함", "전통"],
        dupes: {
          JP: [
        { name: { ko: "사카 만주", ja: "酒饅頭", en: "Saka Manju" }, tasteProfile: { sweet: 55, salty: 5, spicy: 0, umami: 20, sour: 15 }, description: { ko: "사케 효모로 발효시킨 반죽에 팥소를 넣어 찐 일본 전통 술 만두", ja: "日本酒の酵母で発酵させた生地に小豆あんを詰めて蒸した日本伝統の酒饅頭", en: "Japanese traditional sake-fermented steamed bun with red bean paste" }, ingredients: { ko: ["밀가루", "사케", "설탕", "팥앙금", "소금", "이스트"], ja: ["小麦粉", "日本酒", "砂糖", "小豆あん", "塩", "酵母"], en: ["Flour", "Sake", "Sugar", "Red bean paste", "Salt", "Yeast"] }, similarityPercent: 90, matchReason: { ko: "술로 반죽을 발효시켜 찐 전통 빵의 거의 동일한 요리", ja: "酒で生地を発酵させて蒸す伝統パンのほぼ同じ料理", en: "Sake-fermented steamed bun — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "주냥 만터우", ja: "酒醸饅頭", en: "Jiu Niang Mantou" }, tasteProfile: { sweet: 55, salty: 10, spicy: 0, umami: 20, sour: 15 }, description: { ko: "발효 쌀술 주냥으로 반죽해 찐 중국 전통 술 찐빵", ja: "発酵米酒・酒醸で生地を練って蒸した中国伝統の酒蒸しパン", en: "Chinese steamed bun fermented with jiu niang rice wine" }, ingredients: { ko: ["밀가루", "주냥", "설탕", "이스트", "팥앙금", "참깨"], ja: ["小麦粉", "酒醸", "砂糖", "酵母", "小豆あん", "ゴマ"], en: ["Flour", "Jiu niang", "Sugar", "Yeast", "Red bean paste", "Sesame"] }, similarityPercent: 85, matchReason: { ko: "쌀 발효주로 반죽을 발효시켜 찌는 거의 동일한 빵", ja: "米発酵酒で生地を発酵させて蒸すほぼ同じパン", en: "Rice-wine mantou — close Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-kalguksu",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/cheonan-kalguksu.jpeg",
        name: { ko: "칼국수", ja: "カルグクス", en: "Kalguksu" },
        region: "cheonan",
        tasteProfile: { sweet: 10, salty: 50, spicy: 10, umami: 80, sour: 5 },
        storyDescription: {
          ko: "직접 손으로 밀어 썬 굵은 칼국수 면을 닭이나 멸치 육수에 끓여내는 천안의 든든한 면 요리예요. 쫄깃한 면발이 뜨거운 국물에 풀어져 몸을 따뜻하게 데워줘요.",
          ja: "手で打って切った太いカルグクス麺を鶏や煮干しだしで煮込む天安の心強い麺料理です。もちもちの麺が熱いスープに溶け込んで体を温めます。",
          en: "Hand-cut thick knife-noodles simmered in chicken or anchovy broth — Cheonan's hearty noodle meal. Chewy strands soften in scalding broth and warm the whole body."
        },
        ingredients: { ko: ["칼국수 면", "닭고기", "애호박", "감자", "대파", "마늘", "간장", "고춧가루"], ja: ["カルグクス麺", "鶏肉", "ズッキーニ", "ジャガイモ", "長ネギ", "ニンニク", "醤油", "唐辛子粉"], en: ["Knife noodles", "Chicken", "Zucchini", "Potato", "Green onion", "Garlic", "Soy sauce", "Chili powder"] },
        tags: ["면", "칼국수", "따뜻함"],
        dupes: {
          JP: [
        { name: { ko: "히모카와 우동", ja: "ひもかわうどん", en: "Himokawa Udon" }, tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 80, sour: 5 }, description: { ko: "넓적하고 쫄깃한 일본식 수타면 우동", ja: "幅広でもちもちの日本式手打ちうどん", en: "Wide flat Japanese hand-cut udon" }, ingredients: { ko: ["히모카와 우동", "가쓰오 다시", "간장", "파", "튀김"], ja: ["ひもかわうどん", "かつおだし", "醤油", "ネギ", "天ぷら"], en: ["Wide udon", "Dashi", "Soy sauce", "Green onion", "Tempura"] }, similarityPercent: 80, matchReason: { ko: "손으로 만든 굵은 면을 따뜻한 국물에 말아 먹는 공통점", ja: "手打ちの太麺を温かいスープで食べる共通点", en: "Hand-cut wide noodle — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "다오샤오미엔", ja: "刀削麺", en: "Dao Xiao Mian" }, tasteProfile: { sweet: 10, salty: 55, spicy: 25, umami: 80, sour: 5 }, description: { ko: "반죽을 칼로 깎아 넣어 만든 산서식 수타 칼면", ja: "生地を刀で削って作る山西式手打ち麺", en: "Shanxi hand-sliced knife-cut noodles" }, ingredients: { ko: ["밀가루 반죽", "소고기 육수", "두반장", "식초", "대파", "고추"], ja: ["小麦生地", "牛肉スープ", "豆板醤", "酢", "長ネギ", "唐辛子"], en: ["Wheat dough", "Beef broth", "Doubanjiang", "Vinegar", "Green onion", "Chili"] }, similarityPercent: 83, matchReason: { ko: "칼로 썰어 만든 면을 뜨거운 국물에 먹는 거의 동일한 요리", ja: "刀で削って作る麺を熱いスープで食べるほぼ同じ料理", en: "Knife-cut noodles — Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "cheonan-sujebi",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/cheonan-sujebi.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "수제비", ja: "スジェビ", en: "Sujebi (Hand-torn Dough Soup)" },
        region: "cheonan",
        tasteProfile: { sweet: 10, salty: 50, spicy: 10, umami: 75, sour: 5 },
        storyDescription: {
          ko: "밀가루 반죽을 손으로 뗀 얇은 조각을 멸치 육수에 애호박·감자·김치와 함께 끓여낸 천안 시골 집밥이에요. 쫄깃한 반죽 조각이 따뜻한 국물에 녹아들어 속을 달래줘요.",
          ja: "小麦粉生地を手でちぎった薄い欠片を煮干しだしにズッキーニ・ジャガイモ・キムチと共に煮込む天安の田舎の家庭料理です。もちもちの生地欠片が温かいスープに溶け込んで体を癒します。",
          en: "Hand-torn dough pieces simmered in anchovy broth with zucchini, potato and kimchi — Cheonan's rustic home cooking. Chewy dough softens into warm broth to soothe the stomach."
        },
        ingredients: { ko: ["밀가루 반죽", "애호박", "감자", "김치", "멸치 육수", "다시마", "대파", "간장"], ja: ["小麦粉生地", "ズッキーニ", "ジャガイモ", "キムチ", "煮干しだし", "昆布", "長ネギ", "醤油"], en: ["Wheat dough", "Zucchini", "Potato", "Kimchi", "Anchovy broth", "Kelp", "Green onion", "Soy sauce"] }, tags: ["수제비", "집밥", "따뜻함"],
        dupes: {
          JP: [
        { name: { ko: "스이톤", ja: "すいとん", en: "Suiton" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 75, sour: 5 }, description: { ko: "밀가루 반죽을 손으로 떼어 된장 국물에 끓여낸 일본 시골식 수제비", ja: "小麦粉生地を手でちぎって味噌スープで煮込む日本の田舎式すいとん", en: "Japanese rustic hand-torn dough soup in miso broth" }, ingredients: { ko: ["밀가루 반죽", "배추", "당근", "미소", "다시", "파"], ja: ["小麦粉生地", "白菜", "人参", "味噌", "だし", "ネギ"], en: ["Wheat dough", "Napa cabbage", "Carrot", "Miso", "Dashi", "Green onion"] }, similarityPercent: 88, matchReason: { ko: "손으로 뗀 반죽 조각을 국물에 끓이는 거의 동일한 요리", ja: "手でちぎった生地片をスープで煮込むほぼ同じ料理", en: "Hand-torn dough soup — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "미엔 페인 탕", ja: "麺片湯", en: "Mian Pian Tang" }, tasteProfile: { sweet: 5, salty: 55, spicy: 15, umami: 75, sour: 5 }, description: { ko: "밀가루 반죽을 손으로 뜯어 채소·고기와 끓인 중국 서북부식 면편 수프", ja: "小麦粉生地を手でちぎって野菜・肉と煮込む中国西北部式麺片スープ", en: "Northwestern Chinese hand-torn dough soup with vegetables and meat" }, ingredients: { ko: ["밀가루 반죽", "양고기", "양파", "피망", "토마토", "고추"], ja: ["小麦粉生地", "羊肉", "玉ねぎ", "ピーマン", "トマト", "唐辛子"], en: ["Wheat dough", "Lamb", "Onion", "Bell pepper", "Tomato", "Chili"] }, similarityPercent: 85, matchReason: { ko: "손으로 뗀 반죽 조각을 국물에 끓이는 거의 동일한 요리", ja: "手でちぎった生地片をスープで煮込むほぼ同じ料理", en: "Torn dough soup — close Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      }
    ]
  },
  {
    code: "yongin",
    name: { ko: "용인", ja: "龍仁", en: "Yongin" },
    icon: "🏘️",
    image: "/images/village/yongin.png",
    description: {
      ko: "전통과 현대가 어우러진 민속의 맛",
      ja: "伝統と現代が調和した民俗の味",
      en: "A taste of folklore where tradition and modernity meet"
    },
    foods: [
      {
        id: "yongin-baegam-sundae",
        name: { ko: "백암순대", ja: "ペガムスンデ", en: "Baegam Sundae" },
        region: "yongin",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/yongin-baegam-sundae.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        tasteProfile: { sweet: 15, salty: 55, spicy: 20, umami: 80, sour: 5 },
        storyDescription: {
          ko: "용인 백암면에서 유래한 순대로, 속이 꽉 찬 풍성함이 자랑이에요. 찹쌀과 두부, 당면이 가득 들어간 도톰한 순대를 뚝 잘라 소금에 찍어 먹으면, 할머니 손맛이 생각나는 정겨운 맛이 납니다.",
          ja: "龍仁の白岩面に由来するスンデで、ぎっしり詰まった豊かさが自慢です。もち米と豆腐、春雨がたっぷり入った厚みのあるスンデをぶつ切りにして塩に付けて食べると、おばあちゃんの手料理を思い出す懐かしい味がします。",
          en: "Originating from Baegam-myeon in Yongin, this sundae is celebrated for its generous fillings. Thick slices of sticky rice, tofu, and glass noodle-packed sundae dipped in salt — one taste and grandma's kitchen comes flooding back."
        },
        ingredients: { ko: ["돼지 소장", "찹쌀", "두부", "당면", "선지", "부추", "마늘"], ja: ["豚の小腸", "もち米", "豆腐", "春雨", "血", "ニラ", "ニンニク"], en: ["Pork intestine casing", "Glutinous rice", "Tofu", "Glass noodles", "Blood", "Garlic chives", "Garlic"] },
        tags: ["순대", "백암", "전통"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-jangter-gukbap",
        name: { ko: "민속촌 장터국밥", ja: "民俗村チャンターグッパ", en: "Folk Village Market Soup Rice" },
        region: "yongin",
        image: "",
        tasteProfile: { sweet: 10, salty: 55, spicy: 30, umami: 80, sour: 5 },
        storyDescription: {
          ko: "한국 민속촌 장터에서 팔던 소박한 시골 국밥이에요. 뚝배기에 담긴 진한 사골 국물과 밥, 우거지, 수육이 어우러진 푸짐한 한 그릇이 옛날 장날의 분위기를 그대로 살려낸답니다.",
          ja: "韓国民俗村の市場で売っていた素朴な田舎の国飯です。土鍋に入った濃い骨付き肉スープとご飯、干し白菜、ゆで肉が調和した豊かな一杯が、昔の市場の日の雰囲気をそのまま蘇らせます。",
          en: "A humble country soup rice sold at the marketplace of the Korean Folk Village. A generous earthenware bowl of rich bone broth, rice, dried cabbage, and boiled meat — it perfectly captures the warm atmosphere of old market days."
        },
        ingredients: { ko: ["사골육수", "밥", "우거지", "수육", "파", "된장", "고춧가루"], ja: ["骨付き肉スープ", "ご飯", "干し白菜葉", "ゆで肉", "ネギ", "味噌", "唐辛子粉"], en: ["Bone broth", "Rice", "Dried cabbage", "Boiled pork", "Green onion", "Doenjang", "Red pepper"] },
        tags: ["국밥", "전통", "민속촌"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-nurungji-baeksuk",
        name: { ko: "누룽지 백숙", ja: "おこげ白熟鶏", en: "Nurungji Baeksuk" },
        region: "yongin",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/yongin-nurungji-baeksuk.jpeg",
        tasteProfile: { sweet: 15, salty: 40, spicy: 5, umami: 85, sour: 5 },
        storyDescription: {
          ko: "닭을 통째로 푹 끓인 백숙에 누룽지를 더해 구수함을 배로 끌어올린 용인의 별미예요. 닭 국물이 누룽지 속으로 스며들면서 걸쭉하고 고소해지는 국물의 변신이 마법 같고, 마지막 한 방울까지 아까운 맛이에요.",
          ja: "丸鶏をじっくり煮込んだ白熟鶏におこげを加えて香ばしさを倍増させた龍仁の珍味です。鶏のスープがおこげに染み込んでとろみが出て香ばしくなるスープの変身が魔法のようで、最後の一滴まで惜しい味です。",
          en: "Yongin's specialty: a classic whole-chicken baeksuk elevated with crispy scorched rice nurungji. As the rich chicken broth seeps into the nurungji, it transforms into a thick, nutty elixir — every last drop is too precious to waste."
        },
        ingredients: { ko: ["닭", "누룽지", "찹쌀", "인삼", "마늘", "대추", "밤", "소금"], ja: ["鶏", "おこげ", "もち米", "高麗人参", "ニンニク", "なつめ", "栗", "塩"], en: ["Whole chicken", "Scorched rice", "Glutinous rice", "Ginseng", "Garlic", "Jujube", "Chestnut", "Salt"] },
        tags: ["백숙", "누룽지", "보양"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-pajeon",
        name: { ko: "민속촌 파전", ja: "民俗村パジョン", en: "Folk Village Pajeon" },
        region: "yongin",
        image: "",
        tasteProfile: { sweet: 15, salty: 50, spicy: 20, umami: 65, sour: 15 },
        storyDescription: {
          ko: "한국 민속촌에서 굽는 커다란 파전이에요. 바깥은 바삭하고 안은 촉촉하게 구워진 두툼한 파전에, 새콤달콤한 간장 양념을 찍어 먹으면 막걸리 한 잔이 절로 생각난답니다.",
          ja: "韓国民俗村で焼く大きなパジョンです。外はカリカリ、中はしっとり焼き上がった厚みのあるパジョンに、甘酸っぱい醤油ダレを付けて食べると、マッコリが自然と恋しくなります。",
          en: "The oversized pajeon grilled at the Korean Folk Village. Crispy on the outside, moist and soft inside — dip this thick scallion pancake in sweet-sour soy sauce and you'll instinctively reach for a cup of makgeolli."
        },
        ingredients: { ko: ["쪽파", "밀가루", "달걀", "해산물", "간장", "식초", "고추"], ja: ["小ネギ", "小麦粉", "卵", "海産物", "醤油", "酢", "唐辛子"], en: ["Green onion", "Wheat flour", "Egg", "Seafood", "Soy sauce", "Vinegar", "Pepper"] },
        tags: ["파전", "전통", "안주"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-makguksu",
        name: { ko: "수지 막국수", ja: "水枝マックッス", en: "Suji Makguksu" },
        region: "yongin",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/yongin-makguksu.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-천준교",
        tasteProfile: { sweet: 20, salty: 45, spicy: 55, umami: 60, sour: 35 },
        storyDescription: {
          ko: "메밀로 만든 차갑고 탄력 있는 면에 양념장을 비벼 먹는 막국수예요. 수지 지역의 막국수는 특히 메밀 향이 진하고, 새콤매콤한 양념이 면 한 올 한 올에 스며들어 있어 여름 별미로 손꼽힌답니다.",
          ja: "そば粉で作った冷たくて弾力のある麺にヤンニョムジャンを和えて食べるマックッスです。水枝地域のマックッスは特にそばの香りが濃く、甘酸っぱくて辛い薬味が麺の一本一本に染み込んでいて、夏の珍味として名高いです。",
          en: "Cold, springy buckwheat noodles tossed in spicy-tangy seasoning sauce. Suji's makguksu is especially prized for its pronounced buckwheat fragrance, with the sweet-spicy-sour sauce penetrating every single strand — a top summer delicacy."
        },
        ingredients: { ko: ["메밀 면", "양념장", "오이", "계란", "깍두기", "겨자", "식초"], ja: ["そば麺", "ヤンニョムジャン", "きゅうり", "卵", "カクテキ", "からし", "酢"], en: ["Buckwheat noodles", "Spicy sauce", "Cucumber", "Egg", "Radish kimchi", "Mustard", "Vinegar"] },
        tags: ["메밀", "냉면", "여름"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-acorn-jelly",
        name: { ko: "도토리묵 무침", ja: "どんぐりゼリーサラダ", en: "Acorn Jelly Salad" },
        region: "yongin",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/yongin-acorn-jelly.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        tasteProfile: { sweet: 10, salty: 50, spicy: 40, umami: 55, sour: 25 },
        storyDescription: {
          ko: "도토리 전분으로 만든 촉촉하고 보들보들한 묵에 새콤매콤한 양념을 무친 요리예요. 쫀득한 식감과 구수한 도토리 향, 그리고 맵고 새콤한 양념이 한꺼번에 입 안을 자극하는 이 조화가 바로 한식의 매력이에요.",
          ja: "どんぐりのデンプンで作ったしっとりふわふわのゼリーに甘酸っぱくて辛い薬味を和えた料理です。もちもちした食感と香ばしいどんぐりの香り、そして辛くて酸っぱい薬味が一度に口を刺激するこの調和こそが韓国料理の魅力です。",
          en: "Silky acorn starch jelly dressed in a tangy, spicy seasoning. The chewy texture, nutty acorn aroma, and punchy sweet-spicy-sour dressing all hit at once — that harmonious complexity is exactly what makes Korean cuisine captivating."
        },
        ingredients: { ko: ["도토리묵", "간장", "참기름", "고춧가루", "파", "마늘", "깨", "식초"], ja: ["どんぐりゼリー", "醤油", "ごま油", "唐辛子粉", "ネギ", "ニンニク", "ごま", "酢"], en: ["Acorn jelly", "Soy sauce", "Sesame oil", "Red pepper flakes", "Green onion", "Garlic", "Sesame", "Vinegar"] },
        tags: ["묵", "도토리", "무침"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-cafe-dessert",
        name: { ko: "보정동 카페거리 디저트", ja: "保亭洞カフェ通りデザート", en: "Bojeongdong Cafe Street Dessert" },
        region: "yongin",
        image: "",
        tasteProfile: { sweet: 75, salty: 10, spicy: 0, umami: 15, sour: 20 },
        storyDescription: {
          ko: "용인 보정동 카페거리는 경기도 최대의 카페 밀집 지역이에요. 이 거리에서 즐기는 개성 넘치는 케이크, 크리스피 크로넛, 달콤한 음료들은 SNS 감성을 자극하면서도, 한 입 먹으면 그 맛이 진짜임을 증명해낸답니다.",
          ja: "龍仁の保亭洞カフェ通りは京畿道最大のカフェ集積地です。この通りで楽しめる個性あふれるケーキ、クリスピークロナッツ、甘い飲み物は、SNS映えしながらも一口食べるとその本物の味を証明してくれます。",
          en: "Bojeongdong Cafe Street in Yongin is Gyeonggi's largest cafe hub. The eclectic cakes, crispy cronuts, and artisanal drinks here look amazing on social media — and the moment you taste them, you know the beauty isn't just visual."
        },
        ingredients: { ko: ["밀가루", "버터", "생크림", "계절 과일", "초콜릿", "설탕"], ja: ["小麦粉", "バター", "生クリーム", "旬のフルーツ", "チョコレート", "砂糖"], en: ["Flour", "Butter", "Heavy cream", "Seasonal fruit", "Chocolate", "Sugar"] },
        tags: ["카페", "디저트", "트렌디"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-makgeolli",
        name: { ko: "막걸리", ja: "マッコリ", en: "Makgeolli" },
        region: "yongin",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/yongin-makgeolli.jpeg",
        tasteProfile: { sweet: 40, salty: 10, spicy: 5, umami: 30, sour: 45 },
        storyDescription: {
          ko: "용인 지역의 전통 양조장에서 빚어낸 생막걸리예요. 탁하고 뽀얀 빛깔 속에 은은한 단맛과 알싸한 신맛이 균형을 이루고 있어, 파전이나 두부김치 한 접시와 함께하면 민속촌 마당에서 마시는 것 같은 낭만이 있답니다.",
          ja: "龍仁地域の伝統的な醸造所で醸した生マッコリです。白濁した見た目の中に、ほのかな甘みとピリッとした酸味が均衡を保っており、パジョンや豆腐キムチと一緒に楽しむと、民俗村の庭で飲んでいるような浪漫があります。",
          en: "Freshly brewed makgeolli from Yongin's traditional brewery. The milky white liquid balances gentle sweetness with bright tanginess — paired with pajeon or dubu kimchi, you feel like you're drinking in the courtyard of the Korean Folk Village."
        },
        ingredients: { ko: ["쌀", "누룩", "물", "효모"], ja: ["米", "麹", "水", "酵母"], en: ["Rice", "Nuruk (koji)", "Water", "Yeast"] },
        tags: ["막걸리", "전통주", "발효"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-cheoin-dakgalbi",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/yongin-cheoin-dakgalbi.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        name: { ko: "처인닭갈비", ja: "チョイン鶏カルビ", en: "Cheoin Dakgalbi" },
        region: "yongin",
        tasteProfile: { sweet: 35, salty: 55, spicy: 70, umami: 70, sour: 5 },
        storyDescription: {
          ko: "용인 처인구의 재래시장에서 시작된 닭갈비는 고추장 양념에 재운 닭과 양배추·고구마를 넓은 철판에 볶아 먹어요. 마지막에 남은 양념에 볶음밥까지 해 먹으면 완벽한 한 상이에요.",
          ja: "龍仁・処仁区の在来市場で始まった鶏カルビはコチュジャンタレに漬けた鶏とキャベツ・サツマイモを広い鉄板で炒めて食べます。最後に残ったタレで炒飯まで作れば完璧な食卓です。",
          en: "Yongin's Cheoin-gu market-born dakgalbi — gochujang-marinated chicken stir-fried with cabbage and sweet potato on a wide iron plate. Finish with fried rice in the remaining sauce for the perfect meal."
        },
        ingredients: { ko: ["닭다리살", "양배추", "고구마", "떡", "고추장", "간장", "설탕", "깻잎"], ja: ["鶏もも肉", "キャベツ", "サツマイモ", "餅", "コチュジャン", "醤油", "砂糖", "エゴマの葉"], en: ["Chicken thigh", "Cabbage", "Sweet potato", "Rice cake", "Gochujang", "Soy sauce", "Sugar", "Perilla leaf"] },
        tags: ["닭갈비", "철판", "처인"],
        dupes: {
          JP: [
        { name: { ko: "치킨 테판야키", ja: "鶏鉄板焼き", en: "Chicken Teppanyaki" }, tasteProfile: { sweet: 30, salty: 55, spicy: 15, umami: 70, sour: 5 }, description: { ko: "닭고기와 채소를 철판에 간장 양념으로 볶은 일본식 테판야키", ja: "鶏肉と野菜を鉄板で醤油ダレで炒める日本式鉄板焼き", en: "Japanese teppanyaki chicken and vegetables with soy glaze" }, ingredients: { ko: ["닭고기", "간장", "미림", "양배추", "마늘", "참기름"], ja: ["鶏肉", "醤油", "みりん", "キャベツ", "ニンニク", "ごま油"], en: ["Chicken", "Soy sauce", "Mirin", "Cabbage", "Garlic", "Sesame oil"] }, similarityPercent: 77, matchReason: { ko: "닭고기와 채소를 철판에 볶는 거의 동일한 요리", ja: "鶏肉と野菜を鉄板で炒めるほぼ同じ料理", en: "Teppanyaki chicken — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "티에반 지", ja: "鉄板鶏", en: "Tie Ban Ji" }, tasteProfile: { sweet: 20, salty: 55, spicy: 55, umami: 70, sour: 5 }, description: { ko: "닭고기를 매운 양념에 철판에 볶아낸 중국 사천식 철판 닭", ja: "鶏肉を辛いタレで鉄板に炒める中国四川式鉄板鶏", en: "Sichuan iron-plate chicken in spicy sauce" }, ingredients: { ko: ["닭고기", "두반장", "양배추", "대파", "마늘", "고추"], ja: ["鶏肉", "豆板醤", "キャベツ", "長ネギ", "ニンニク", "唐辛子"], en: ["Chicken", "Doubanjiang", "Cabbage", "Green onion", "Garlic", "Chili"] }, similarityPercent: 78, matchReason: { ko: "닭고기를 매운 양념에 철판에 볶는 공통점", ja: "鶏肉を辛いタレで鉄板で炒める共通点", en: "Iron-plate chicken — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-yangji-gomtang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/yongin-yangji-gomtang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        name: { ko: "양지곰탕", ja: "ヤンジ骨スープ", en: "Yangji Gomtang (Brisket Bone Soup)" },
        region: "yongin",
        tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 90, sour: 5 },
        storyDescription: {
          ko: "용인 양지바른 목장에서 자란 한우의 양지와 사골을 12시간 이상 푹 고아 우려낸 뽀얀 국물의 곰탕이에요. 기름기 없이 담백한 국물이 추운 겨울을 가슴부터 녹여요.",
          ja: "龍仁の日当たりの良い牧場で育った韓牛の胸肉と骨を12時間以上じっくり煮込んだ白濁スープの骨スープです。脂分のないあっさりスープが寒い冬を心から溶かします。",
          en: "Hanwoo brisket and marrow bones from sunny Yongin pastures, simmered over 12 hours into a milky broth. Clean and fat-free, this soup melts winter cold from the heart outward."
        },
        ingredients: { ko: ["한우 양지", "사골", "무", "대파", "마늘", "소금", "후추", "당면"], ja: ["韓牛胸肉", "骨", "大根", "長ネギ", "ニンニク", "塩", "胡椒", "春雨"], en: ["Brisket", "Marrow bones", "Radish", "Green onion", "Garlic", "Salt", "Pepper", "Glass noodles"] },
        tags: ["곰탕", "사골", "한우"],
        dupes: {
          JP: [
        { name: { ko: "토리 파이탄", ja: "鶏白湯", en: "Tori Paitan" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 85, sour: 5 }, description: { ko: "닭 뼈를 오래 끓여 만든 뽀얗고 진한 일본식 라멘 국물", ja: "鶏骨を長時間煮込んで作る白く濃厚な日本式ラーメンスープ", en: "Japanese milky chicken-bone ramen broth" }, ingredients: { ko: ["닭뼈", "닭발", "생강", "파", "소금", "라멘 면"], ja: ["鶏骨", "鶏足", "生姜", "ネギ", "塩", "ラーメン"], en: ["Chicken bones", "Chicken feet", "Ginger", "Green onion", "Salt", "Ramen"] }, similarityPercent: 77, matchReason: { ko: "뼈를 장시간 끓여 뽀얀 국물을 얻는 동일 기법", ja: "骨を長時間煮込んで白濁スープを得る同じ技法", en: "Long-simmered bone broth — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "칭탕 뼈 육수", ja: "清湯骨スープ", en: "Qing Tang Bone Broth" }, tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 90, sour: 5 }, description: { ko: "소뼈·돼지뼈를 맑게 우려낸 중국식 고급 육수", ja: "牛骨・豚骨を澄んだスープに仕上げる中国式高級だし", en: "Chinese clear premium bone broth" }, ingredients: { ko: ["소뼈", "돼지뼈", "생강", "대파", "소금", "파슬리"], ja: ["牛骨", "豚骨", "生姜", "長ネギ", "塩", "パセリ"], en: ["Beef bones", "Pork bones", "Ginger", "Green onion", "Salt", "Parsley"] }, similarityPercent: 82, matchReason: { ko: "장시간 뼈를 고아 진한 감칠맛 국물을 만드는 동일 철학", ja: "長時間骨を煮込んで深い旨味スープを作る同じ哲学", en: "Bone-simmered broth — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-bori-gulbi",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/yongin-bori-gulbi.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        name: { ko: "보리굴비정식", ja: "麦屈非定食", en: "Bori Gulbi Jeongsik" },
        region: "yongin",
        tasteProfile: { sweet: 5, salty: 65, spicy: 10, umami: 85, sour: 5 },
        storyDescription: {
          ko: "보리 겨에 말린 굴비를 고소하게 구워 보리밥·나물 반찬과 함께 내는 용인의 정찬 밥상이에요. 짭짤한 굴비 한 점에 보리밥을 말아 먹으면 조선 시대 양반의 식탁이 떠올라요.",
          ja: "麦ふすまで干した屈非（クルビ）を香ばしく焼いて麦ご飯・ナムル副菜と共に出す龍仁の正餐です。塩辛いクルビ一切れに麦ご飯を包めば朝鮮時代の両班の食卓が思い浮かびます。",
          en: "Yellow croaker dried in barley husks, grilled aromatic and served with barley rice and namul — Yongin's noble set meal. A salty bite of gulbi wrapped in barley rice evokes the Joseon nobility's table."
        },
        ingredients: { ko: ["보리굴비", "보리쌀", "고사리", "시금치", "된장", "고추장", "상추", "녹차"], ja: ["麦屈非", "麦米", "ワラビ", "ほうれん草", "味噌", "コチュジャン", "サンチュ", "緑茶"], en: ["Barley-dried yellow croaker", "Barley rice", "Bracken", "Spinach", "Doenjang", "Gochujang", "Lettuce", "Green tea"] },
        tags: ["보리굴비", "정식", "양반상"],
        dupes: {
          JP: [
        { name: { ko: "히모노 테이쇼쿠", ja: "干物定食", en: "Himono Teishoku" }, tasteProfile: { sweet: 5, salty: 65, spicy: 5, umami: 85, sour: 5 }, description: { ko: "말린 생선을 구워 밥·국·반찬과 함께 먹는 일본식 건어물 정식", ja: "干物を焼いてご飯・汁・おかずと共に食べる日本式干物定食", en: "Japanese dried fish set meal with rice, soup and sides" }, ingredients: { ko: ["말린 고등어", "쌀밥", "미소시루", "츠케모노", "달걀말이", "녹차"], ja: ["干しサバ", "ご飯", "味噌汁", "漬物", "卵焼き", "緑茶"], en: ["Dried mackerel", "Rice", "Miso soup", "Pickles", "Tamagoyaki", "Green tea"] }, similarityPercent: 88, matchReason: { ko: "말린 생선을 구워 밥·반찬과 정식으로 내는 거의 동일한 요리", ja: "干物を焼いてご飯・おかずと定食で出すほぼ同じ料理", en: "Himono teishoku — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "셴 위 판", ja: "塩魚飯", en: "Xian Yu Fan" }, tasteProfile: { sweet: 5, salty: 65, spicy: 10, umami: 85, sour: 5 }, description: { ko: "염장 말린 생선을 밥·채소 반찬과 함께 먹는 중국 남부식 염장 생선 정식", ja: "塩漬け干し魚をご飯・野菜おかずと食べる中国南部式の塩魚定食", en: "Southern Chinese set meal with salted dried fish, rice and vegetable sides" }, ingredients: { ko: ["염장 생선", "쌀밥", "청경채", "간장", "참기름", "생강"], ja: ["塩干し魚", "ご飯", "チンゲン菜", "醤油", "ごま油", "生姜"], en: ["Salted fish", "Rice", "Bok choy", "Soy sauce", "Sesame oil", "Ginger"] }, similarityPercent: 77, matchReason: { ko: "말린 염장 생선과 밥·반찬의 정식 전통", ja: "塩漬け干し魚とご飯・おかずの定食伝統", en: "Salted fish set — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-sanchae-jeongsik",
        image: "",
        name: { ko: "산채정식", ja: "山菜定食", en: "Sanchae Jeongsik" },
        region: "yongin",
        tasteProfile: { sweet: 10, salty: 45, spicy: 25, umami: 65, sour: 10 },
        storyDescription: {
          ko: "광교산 자락에서 캔 열 가지 산나물을 각각 양념해 밥·된장국·생선구이와 함께 한 상에 차려내는 용인의 사찰식 정식이에요. 산의 사계절이 한 상에 담긴 건강한 밥상이에요.",
          ja: "光教山の麓で採った十種の山菜をそれぞれ味付けしてご飯・味噌汁・焼き魚と共に一膳に出す龍仁の寺刹式定食です。山の四季が一膳に込められた健康的な食卓です。",
          en: "Ten mountain herbs foraged from Gwanggyosan, each seasoned and served with rice, doenjang soup and grilled fish — Yongin's temple-style set meal. A table capturing the mountain's four seasons."
        },
        ingredients: { ko: ["취나물", "고사리", "곤드레", "도라지", "더덕", "된장국", "쌀밥", "고추장"], ja: ["チュイナムル", "ワラビ", "コンドゥレ", "桔梗", "トドック", "味噌汁", "ご飯", "コチュジャン"], en: ["Chwinamul", "Bracken", "Gondre", "Bellflower", "Deodeok", "Doenjang soup", "Rice", "Gochujang"] },
        tags: ["산채", "정식", "사찰식"],
        dupes: {
          JP: [
        { name: { ko: "쇼진 료리", ja: "精進料理", en: "Shojin Ryori" }, tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 65, sour: 5 }, description: { ko: "사찰 전통 채식으로 여러 산나물·두부를 밥과 함께 내는 일본 정진 요리", ja: "寺の伝統菜食で様々な山菜・豆腐をご飯と出す日本の精進料理", en: "Japanese Buddhist vegetarian set meal with mountain vegetables and tofu" }, ingredients: { ko: ["두부", "산나물", "쌀밥", "미소시루", "간장", "참깨"], ja: ["豆腐", "山菜", "ご飯", "味噌汁", "醤油", "ゴマ"], en: ["Tofu", "Mountain vegetables", "Rice", "Miso soup", "Soy sauce", "Sesame"] }, similarityPercent: 85, matchReason: { ko: "산나물·두부·밥·국을 정갈한 상으로 내는 사찰 전통의 거의 동일한 요리", ja: "山菜・豆腐・ご飯・汁物を清らかに盛る精進料理のほぼ同じ料理", en: "Shojin ryori — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "쩌이 빙 사이", ja: "斋菜", en: "Zhai Cai" }, tasteProfile: { sweet: 10, salty: 45, spicy: 10, umami: 65, sour: 5 }, description: { ko: "여러 산채·두부·버섯을 밥·국과 함께 내는 중국식 사찰 정식", ja: "様々な山菜・豆腐・きのこをご飯・汁物と出す中国式精進定食", en: "Chinese temple-style vegetarian set with mountain herbs, tofu and mushrooms" }, ingredients: { ko: ["두부", "산채", "버섯", "쌀밥", "간장", "참기름"], ja: ["豆腐", "山菜", "きのこ", "ご飯", "醤油", "ごま油"], en: ["Tofu", "Mountain herbs", "Mushroom", "Rice", "Soy sauce", "Sesame oil"] }, similarityPercent: 80, matchReason: { ko: "산나물과 두부 중심의 사찰 정식 공통점", ja: "山菜と豆腐中心の精進定食の共通点", en: "Zhai cai set — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-hanbang-samgyetang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/yongin-hanbang-samgyetang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        name: { ko: "한방삼계탕", ja: "漢方参鶏湯", en: "Hanbang Samgyetang" },
        region: "yongin",
        tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 80, sour: 5 },
        storyDescription: {
          ko: "어린 닭 한 마리에 인삼·황기·대추·구기자 등 한약재를 가득 채워 오랜 시간 고아낸 용인의 보양식이에요. 뜨거운 국물에 인삼 향이 스며 있어 여름 더위에 기운을 돋워줘요.",
          ja: "若鶏一羽に高麗人参・黄耆・なつめ・クコの実などの漢方薬材をたっぷり詰めて長時間煮込む龍仁の滋養料理です。熱々のスープに人参の香りが染みて、夏の暑さに元気を与えます。",
          en: "A young chicken stuffed with ginseng, astragalus, jujube and wolfberry, slow-simmered long hours — Yongin's restorative dish. The hot broth carries ginseng's aroma to renew energy through summer heat."
        },
        ingredients: { ko: ["영계", "인삼", "황기", "대추", "구기자", "찹쌀", "마늘", "밤"], ja: ["若鶏", "高麗人参", "黄耆", "なつめ", "クコの実", "もち米", "ニンニク", "栗"], en: ["Young chicken", "Ginseng", "Astragalus", "Jujube", "Wolfberry", "Glutinous rice", "Garlic", "Chestnut"] },
        tags: ["보양식", "한방", "여름"],
        dupes: {
          JP: [
        { name: { ko: "토리 미즈타키", ja: "鶏水炊き", en: "Tori Mizutaki" }, tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 80, sour: 5 }, description: { ko: "통닭을 물에 오래 끓여 뽀얀 국물을 낸 규슈식 닭 전골", ja: "鶏肉を水で長時間煮込んで白濁のスープを作る九州式鶏鍋", en: "Kyushu-style chicken hot pot simmered in water until milky" }, ingredients: { ko: ["통닭", "배추", "버섯", "두부", "파", "폰즈"], ja: ["鶏肉", "白菜", "きのこ", "豆腐", "ネギ", "ポン酢"], en: ["Chicken", "Napa cabbage", "Mushroom", "Tofu", "Green onion", "Ponzu"] }, similarityPercent: 75, matchReason: { ko: "통닭을 오랜 시간 고아 뽀얀 국물을 만드는 동일 기법", ja: "鶏肉を長時間煮込んで白濁スープを作る同じ技法", en: "Chicken in milky broth — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "칭 둔 지", ja: "清炖鶏", en: "Qing Dun Ji" }, tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 80, sour: 5 }, description: { ko: "통닭에 대추·구기자를 넣어 맑게 오래 끓여낸 중국식 보양 닭 수프", ja: "鶏肉になつめ・クコの実を入れて澄んだスープで長時間煮込んだ中国式の滋養鶏スープ", en: "Chinese slow-simmered clear chicken soup with jujube and wolfberry" }, ingredients: { ko: ["통닭", "대추", "구기자", "생강", "황기", "소금"], ja: ["鶏肉", "なつめ", "クコの実", "生姜", "黄耆", "塩"], en: ["Chicken", "Jujube", "Wolfberry", "Ginger", "Astragalus", "Salt"] }, similarityPercent: 82, matchReason: { ko: "닭과 약재를 오래 고아 보양식으로 먹는 동일 철학", ja: "鶏と薬材を長時間煮込んで滋養食として食べる同じ哲学", en: "Herbal chicken tonic — close Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-mukbap",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/yongin-mukbap.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "묵밥", ja: "ムクご飯", en: "Mukbap (Acorn Jelly Rice)" },
        region: "yongin",
        tasteProfile: { sweet: 10, salty: 50, spicy: 20, umami: 55, sour: 15 },
        storyDescription: {
          ko: "쫄깃한 도토리묵을 깍둑썰어 찬 멸치 육수에 담고 김·김치·오이를 올려 시원하게 먹는 여름 별미예요. 건강하면서도 가볍고 구수한 맛이 더위를 달래줘요.",
          ja: "プリプリのどんぐりムクを角切りにして冷たい煮干しだしに入れ、海苔・キムチ・きゅうりをのせて涼しく食べる夏の逸品です。健康的で軽く香ばしい味が暑さを癒します。",
          en: "Chewy acorn jelly cubed and steeped in cold anchovy broth, topped with seaweed, kimchi and cucumber — a summer refresher. Healthful, light and nutty, it soothes summer heat."
        },
        ingredients: { ko: ["도토리묵", "멸치 육수", "김치", "오이", "김", "간장", "참기름", "깨"], ja: ["どんぐりムク", "煮干しだし", "キムチ", "きゅうり", "海苔", "醤油", "ごま油", "ゴマ"], en: ["Acorn jelly", "Anchovy broth", "Kimchi", "Cucumber", "Seaweed", "Soy sauce", "Sesame oil", "Sesame"] },
        tags: ["묵밥", "여름", "건강식"],
        dupes: {
          JP: [
        { name: { ko: "텐구사 도코로텐", ja: "心太", en: "Tokoroten" }, tasteProfile: { sweet: 5, salty: 45, spicy: 5, umami: 55, sour: 25 }, description: { ko: "한천 묵을 가는 국수 모양으로 썰어 찬 간장에 먹는 일본식 해초 묵", ja: "寒天ムクを細い麺状に切って冷たい醤油で食べる日本式海藻ムク", en: "Japanese kanten jelly noodles in cold soy vinaigrette" }, ingredients: { ko: ["한천", "간장", "식초", "생강", "가쓰오부시", "겨자"], ja: ["寒天", "醤油", "酢", "生姜", "かつお節", "カラシ"], en: ["Kanten", "Soy sauce", "Vinegar", "Ginger", "Bonito", "Mustard"] }, similarityPercent: 82, matchReason: { ko: "묵을 썰어 찬 간장 국물에 먹는 거의 동일한 여름 요리", ja: "ムクを切って冷たい醤油で食べるほぼ同じ夏料理", en: "Cold jelly soup — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "량 펀", ja: "涼粉", en: "Liang Fen" }, tasteProfile: { sweet: 10, salty: 50, spicy: 40, umami: 55, sour: 20 }, description: { ko: "녹두·완두 묵을 썰어 식초·고추기름에 무친 중국식 여름 묵 요리", ja: "緑豆・エンドウ豆のムクを切って酢・ラー油で和える中国式夏のムク料理", en: "Chinese cold mung/pea jelly tossed in vinegar and chili oil" }, ingredients: { ko: ["녹두 묵", "식초", "간장", "고추기름", "마늘", "참깨"], ja: ["緑豆ムク", "酢", "醤油", "ラー油", "ニンニク", "ゴマ"], en: ["Mung bean jelly", "Vinegar", "Soy sauce", "Chili oil", "Garlic", "Sesame"] }, similarityPercent: 83, matchReason: { ko: "묵을 찬 양념에 무쳐 먹는 거의 동일한 여름 요리", ja: "ムクを冷たい調味料で和えるほぼ同じ夏料理", en: "Liang fen — close Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-dolsot-bibimbap",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/yongin-dolsot-bibimbap.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "돌솥비빔밥", ja: "石焼ビビンバ", en: "Dolsot Bibimbap" },
        region: "yongin",
        tasteProfile: { sweet: 15, salty: 50, spicy: 50, umami: 70, sour: 10 },
        storyDescription: {
          ko: "뜨겁게 달군 돌솥에 밥과 여덟 가지 나물·소고기·달걀을 올려 고추장으로 비벼 먹는 용인식 비빔밥이에요. 솥 바닥에 눌어붙는 누룽지 한 조각이 식사의 하이라이트예요.",
          ja: "熱した石釜にご飯と八種のナムル・牛肉・卵をのせてコチュジャンで混ぜる龍仁式ビビンバです。釜底のおこげ一切れが食事のハイライトです。",
          en: "A sizzling stone pot filled with rice, eight namul, beef and egg, mixed with gochujang — Yongin's dolsot bibimbap. The crispy scorched rice at the bottom is the meal's highlight."
        },
        ingredients: { ko: ["밥", "시금치", "콩나물", "고사리", "당근", "소고기", "고추장", "참기름"], ja: ["ご飯", "ほうれん草", "豆もやし", "ワラビ", "人参", "牛肉", "コチュジャン", "ごま油"], en: ["Rice", "Spinach", "Bean sprouts", "Bracken", "Carrot", "Beef", "Gochujang", "Sesame oil"] },
        tags: ["비빔밥", "돌솥", "누룽지"],
        dupes: {
          JP: [
        { name: { ko: "이시야키 돈부리", ja: "石焼き丼", en: "Ishiyaki Donburi" }, tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 70, sour: 5 }, description: { ko: "뜨거운 돌그릇에 밥과 여러 토핑을 얹은 일본식 돌솥 덮밥", ja: "熱い石釜にご飯と様々なトッピングをのせた日本式石焼き丼", en: "Japanese hot stone bowl rice with various toppings" }, ingredients: { ko: ["밥", "소고기", "달걀", "김치", "간장", "참기름"], ja: ["ご飯", "牛肉", "卵", "キムチ", "醤油", "ごま油"], en: ["Rice", "Beef", "Egg", "Kimchi", "Soy sauce", "Sesame oil"] }, similarityPercent: 85, matchReason: { ko: "뜨거운 돌솥에 밥과 토핑을 섞어 먹는 거의 동일한 요리", ja: "熱い石釜にご飯とトッピングを混ぜるほぼ同じ料理", en: "Stone-bowl rice — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "샤보궈 미판", ja: "砂鍋米飯", en: "Sha Bao Mi Fan" }, tasteProfile: { sweet: 10, salty: 55, spicy: 25, umami: 70, sour: 5 }, description: { ko: "뜨거운 토기에 밥과 채소·고기를 올려 먹는 중국 광둥식 돌솥밥", ja: "熱い土鍋にご飯と野菜・肉をのせる中国・広東式石鍋飯", en: "Cantonese clay-pot rice with vegetables and meat" }, ingredients: { ko: ["쌀", "소고기", "버섯", "청경채", "간장", "참기름"], ja: ["米", "牛肉", "きのこ", "チンゲン菜", "醤油", "ごま油"], en: ["Rice", "Beef", "Mushroom", "Bok choy", "Soy sauce", "Sesame oil"] }, similarityPercent: 78, matchReason: { ko: "뜨거운 토기에 밥과 토핑을 얹는 유사 구조", ja: "熱い土鍋にご飯とトッピングをのせる類似構造", en: "Clay-pot rice — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "yongin-maeun-galbijjim",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/yongin-maeun-galbijjim.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        name: { ko: "매운갈비찜", ja: "辛口カルビ蒸し", en: "Maeun Galbijjim (Spicy Braised Short Ribs)" },
        region: "yongin",
        tasteProfile: { sweet: 30, salty: 55, spicy: 75, umami: 80, sour: 5 },
        storyDescription: {
          ko: "한우 갈비를 매운 고춧가루·청양고추 양념에 재워 감자·당근과 함께 뭉근히 조려낸 용인식 매운 갈비찜이에요. 입안을 활활 태우는 매운맛과 달짝지근한 갈빗살이 중독적이에요.",
          ja: "韓牛カルビを辛い唐辛子粉・青唐辛子のタレに漬けてジャガイモ・人参と共にじっくり煮込む龍仁式辛口カルビ蒸しです。口の中を焼き尽くす辛さと甘じょっぱいカルビの身が中毒的です。",
          en: "Hanwoo short ribs marinated in fiery chili and green pepper, slow-braised with potato and carrot — Yongin's spicy galbijjim. Mouth-searing heat and sweet-savory rib meat make it addictive."
        },
        ingredients: { ko: ["한우 갈비", "감자", "당근", "청양고추", "고추장", "고춧가루", "간장", "배"], ja: ["韓牛カルビ", "ジャガイモ", "人参", "青唐辛子", "コチュジャン", "唐辛子粉", "醤油", "梨"], en: ["Short ribs", "Potato", "Carrot", "Green chili", "Gochujang", "Chili powder", "Soy sauce", "Asian pear"] },
        tags: ["갈비찜", "매운맛", "조림"],
        dupes: {
          JP: [
        { name: { ko: "가루비 니코미", ja: "カルビ煮込み", en: "Karubi Nikomi" }, tasteProfile: { sweet: 30, salty: 55, spicy: 25, umami: 80, sour: 5 }, description: { ko: "소갈비를 간장·미림·고추에 매콤 달콤하게 조려낸 일본식 갈비찜", ja: "牛カルビを醤油・みりん・唐辛子で甘辛く煮込む日本式カルビ煮", en: "Japanese sweet-spicy braised short ribs in soy-mirin" }, ingredients: { ko: ["소갈비", "간장", "미림", "설탕", "고추", "생강"], ja: ["牛カルビ", "醤油", "みりん", "砂糖", "唐辛子", "生姜"], en: ["Short ribs", "Soy sauce", "Mirin", "Sugar", "Chili", "Ginger"] }, similarityPercent: 78, matchReason: { ko: "갈비를 달콤 짭짤 매운 양념에 조리는 거의 동일한 요리", ja: "カルビを甘辛くピリ辛く煮込むほぼ同じ料理", en: "Karubi nikomi — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        { name: { ko: "마라 파이구", ja: "麻辣排骨", en: "Mala Paigu" }, tasteProfile: { sweet: 20, salty: 55, spicy: 75, umami: 80, sour: 5 }, description: { ko: "소·돼지 갈비를 마라 양념에 매콤하게 볶아낸 사천식 매운 갈비 요리", ja: "牛・豚カルビを麻辣タレで辛く炒める四川式辛口カルビ料理", en: "Sichuan mala spicy braised ribs" }, ingredients: { ko: ["갈비", "두반장", "화자오", "건고추", "생강", "대파"], ja: ["カルビ", "豆板醤", "花椒", "唐辛子", "生姜", "長ネギ"], en: ["Ribs", "Doubanjiang", "Sichuan pepper", "Dried chili", "Ginger", "Green onion"] }, similarityPercent: 82, matchReason: { ko: "갈비를 매운 양념에 조리는 거의 동일한 요리", ja: "カルビを辛いタレで煮込むほぼ同じ料理", en: "Mala paigu — close Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      }
    ]
  },
  {
    code: "icheon",
    name: { ko: "이천", ja: "利川", en: "Icheon" },
    icon: "🍚",
    image: "/images/village/icheon.png",
    description: {
      ko: "임금님 수라상에 오르던 명품 쌀밥의 도시",
      ja: "王様の食卓に上がった名品ご飯の都市",
      en: "The city of premium rice once served on the King's table"
    },
    foods: [
      {
        id: "icheon-rice-table",
        name: { ko: "쌀밥 정식", ja: "ご飯定食", en: "Rice Table" },
        region: "icheon",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/icheon-rice-table.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        tasteProfile: { sweet: 25, salty: 45, spicy: 25, umami: 75, sour: 10 },
        storyDescription: {
          ko: "임금님 수라상에 올랐다는 이천 쌀로 지은 밥은 한 톨 한 톨이 탱글탱글하고 윤기가 자르르 흘러요. 이 밥을 중심으로 구성된 정식 한 상을 받으면, 밥 그 자체가 주인공인 식사가 이런 것이구나 하는 감동을 받게 된답니다.",
          ja: "王様の食卓に上がったという利川のお米で炊いたご飯は、粒一粒がぷりぷりでツヤツヤ光り輝いています。このご飯を中心に構成された定食一膳を受け取ると、ご飯そのものが主役の食事とはこういうことかという感動を覚えます。",
          en: "Icheon rice — once presented at the royal table — shines with plump, glistening grains. When a full rice table set arrives centered on this legendary rice, you finally understand what it means for rice itself to be the star of a meal."
        },
        ingredients: { ko: ["이천 쌀", "된장찌개", "나물 반찬", "구이", "김치", "계란", "멸치볶음"], ja: ["利川米", "味噌チゲ", "ナムルおかず", "焼き物", "キムチ", "卵", "炒めじゃこ"], en: ["Icheon rice", "Doenjang jjigae", "Namul side dishes", "Grilled dish", "Kimchi", "Egg", "Stir-fried anchovy"] },
        tags: ["쌀밥", "정식", "임금님"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-bori-gulbi",
        name: { ko: "보리굴비", ja: "麦塩干しグルビ", en: "Bori Gulbi" },
        region: "icheon",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/icheon-bori-gulbi.jpeg",
        tasteProfile: { sweet: 10, salty: 70, spicy: 10, umami: 85, sour: 5 },
        storyDescription: {
          ko: "참조기를 소금에 절여 보리 속에서 서서히 숙성시킨 전통 건생선이에요. 수분이 빠지면서 응축된 감칠맛이 놀랍도록 진해지고, 따뜻한 밥 위에 한 점 올려 먹으면 다른 반찬이 필요 없는 밥도둑이 된답니다.",
          ja: "真グチを塩漬けにして麦の中でゆっくり熟成させた伝統的な干し魚です。水分が抜けることで凝縮された旨味が驚くほど濃厚になり、温かいご飯の上に一切れ乗せて食べると、他のおかずが要らないご飯泥棒になります。",
          en: "Yellow corvina salted and slowly aged inside barley — a traditional dried fish. As moisture evaporates, the concentrated umami becomes breathtakingly intense. One piece over warm rice and you need no other side dish."
        },
        ingredients: { ko: ["참조기", "천일염", "보리", "시간"], ja: ["真グチ", "天日塩", "麦", "時間"], en: ["Yellow corvina", "Sea salt", "Barley", "Time (aging)"] },
        tags: ["건생선", "숙성", "전통"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-ganjang-gejang",
        name: { ko: "간장게장", ja: "醤油ワタリガニ漬け", en: "Soy Sauce Marinated Crab" },
        region: "icheon",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/icheon-ganjang-gejang.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-천준교",
        tasteProfile: { sweet: 20, salty: 65, spicy: 10, umami: 95, sour: 10 },
        storyDescription: {
          ko: "신선한 꽃게를 간장에 담가 숙성시킨 요리로, '밥도둑'이라 불리는 데는 다 이유가 있어요. 짭조름하고 감칠맛 폭발하는 게장을 이천 밥에 올려 비벼 먹으면, 순식간에 밥 한 공기가 사라지는 마법을 경험하게 된답니다.",
          ja: "新鮮なワタリガニを醤油に漬けて熟成させた料理で、「ご飯泥棒」と呼ばれるのには理由があります。塩辛くて旨味が爆発するケジャンを利川のご飯に乗せて混ぜて食べると、あっという間にご飯一膳が消える魔法を体験できます。",
          en: "Fresh blue crab marinated in soy sauce and aged — there's a reason it's called 'the rice thief'. Spoon this salty, umami-explosive gejang over Icheon rice, mix it in, and experience the magic of a full bowl vanishing in an instant."
        },
        ingredients: { ko: ["꽃게", "간장", "마늘", "생강", "청양고추", "다시마", "설탕"], ja: ["ワタリガニ", "醤油", "ニンニク", "生姜", "青唐辛子", "昆布", "砂糖"], en: ["Blue crab", "Soy sauce", "Garlic", "Ginger", "Green chili", "Kelp", "Sugar"] },
        tags: ["게장", "밥도둑", "발효"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-hanwoo-gui",
        name: { ko: "한우 구이", ja: "韓牛焼肉", en: "Hanwoo Grilled Beef" },
        region: "icheon",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/icheon-hanwoo-gui.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
        tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 92, sour: 5 },
        storyDescription: {
          ko: "이천 쌀밥을 곁들여 먹는 한우 구이는 이 지역의 격조 있는 식사 문화예요. 살살 녹는 마블링의 한우를 구워서 이천 쌀밥 한 숟갈과 함께 먹으면, 그야말로 밥 한 공기가 사치가 된답니다.",
          ja: "利川のご飯を添えて食べる韓牛焼肉は、この地域の格調ある食文化です。とろけるようなサシの韓牛を焼いて利川のご飯一さじと一緒に食べると、まさにご飯一膳が贅沢になります。",
          en: "Grilled Hanwoo beef served alongside Icheon rice is this region's elevated dining culture. Cook the melt-in-your-mouth marbled beef and take a spoonful of Icheon rice with it — suddenly, even a simple bowl of rice becomes pure luxury."
        },
        ingredients: { ko: ["한우 채끝", "소금", "참기름", "마늘", "이천 쌀밥", "상추", "쌈장"], ja: ["韓牛サーロイン", "塩", "ごま油", "ニンニク", "利川ご飯", "サンチュ", "サムジャン"], en: ["Hanwoo striploin", "Salt", "Sesame oil", "Garlic", "Icheon rice", "Lettuce", "Ssamjang"] },
        tags: ["한우", "구이", "이천쌀"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-straw-pork",
        name: { ko: "볏짚 삼겹살", ja: "藁火豚バラ焼き", en: "Straw-Fire Pork Belly" },
        region: "icheon",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/icheon-straw-pork.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        tasteProfile: { sweet: 15, salty: 50, spicy: 10, umami: 80, sour: 5 },
        storyDescription: {
          ko: "이천에서 생산되는 볏짚으로 삼겹살 표면을 훑어 구워낸 특별한 조리법이에요. 볏짚 불꽃이 고기 겉면을 스쳐지나가면서 은은한 짚 향이 배어들고, 겉은 바삭하면서 속은 촉촉한 환상적인 삼겹살이 완성된답니다.",
          ja: "利川で生産される藁で豚バラ肉の表面をあぶって焼く特別な調理法です。藁の炎が肉の表面をかすめながらほのかな藁の香りが染み込み、外はカリカリで中はしっとりした幻想的な豚バラ肉が完成します。",
          en: "A special technique using Icheon-grown rice straw to sear the surface of pork belly. As the straw flame skims the meat, a subtle smoky aroma seeps in — creating pork belly with a crispy exterior, juicy interior, and that ineffable straw-kissed fragrance."
        },
        ingredients: { ko: ["삼겹살", "볏짚", "소금", "참기름", "마늘", "상추"], ja: ["豚バラ肉", "稲藁", "塩", "ごま油", "ニンニク", "サンチュ"], en: ["Pork belly", "Rice straw", "Salt", "Sesame oil", "Garlic", "Lettuce"] },
        tags: ["삼겹살", "볏짚", "훈연"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-royal-table",
        name: { ko: "임금님 수라상", ja: "王の御膳", en: "Royal Table" },
        region: "icheon",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/icheon-royal-table.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        tasteProfile: { sweet: 30, salty: 45, spicy: 25, umami: 85, sour: 20 },
        storyDescription: {
          ko: "이천 쌀밥을 중심으로 수십 가지 반찬이 격식 있게 펼쳐지는 왕의 밥상이에요. 조선 궁중 요리의 방식을 계승하여 재료 하나하나에 정성을 다했고, 이천이라는 지역의 자부심과 전통이 이 한 상 안에 모두 담겨 있답니다.",
          ja: "利川のご飯を中心に何十種類ものおかずが格式高く並べられた王の食卓です。朝鮮宮廷料理の方式を継承して食材一つ一つに誠意を尽くし、利川という地域の誇りと伝統がこの一膳に全て込められています。",
          en: "A royal dining spread with dozens of side dishes laid out in formal style, centered on Icheon rice. Inheriting the Joseon royal court culinary tradition, every ingredient is treated with utmost care — all of Icheon's pride and heritage in a single glorious table."
        },
        ingredients: { ko: ["이천 쌀밥", "구절판", "신선로", "전유어", "나물", "김치", "찜", "정과"], ja: ["利川ご飯", "九折板", "神仙炉", "チヂミ", "ナムル", "キムチ", "蒸し物", "正果"], en: ["Icheon rice", "Gujeolpan (nine-section dish)", "Royal hotpot", "Pan-fried dishes", "Namul", "Kimchi", "Steamed dishes", "Candied sweets"] },
        tags: ["궁중", "정찬", "전통"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-makguksu",
        name: { ko: "막국수", ja: "マックッス", en: "Makguksu" },
        region: "icheon",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/icheon-makguksu.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-천준교",
        tasteProfile: { sweet: 20, salty: 45, spicy: 50, umami: 60, sour: 40 },
        storyDescription: {
          ko: "메밀 향 물씬 풍기는 차가운 막국수에 이천 쌀로 만든 밥을 곁들이는 것이 이 지역만의 독특한 조합이에요. 탄력 있는 메밀 면의 쫄깃함과 새콤달콤한 양념이 어우러지면서, 여름날 오후의 느긋한 식사 풍경이 그려진답니다.",
          ja: "そばの香りが漂う冷たいマックッスに利川のお米で作ったご飯を添えるのが、この地域だけのユニークな組み合わせです。弾力のあるそば麺のもちもち感と甘酸っぱい薬味が調和して、夏の午後ののんびりとした食事の風景が浮かびます。",
          en: "Cold makguksu fragrant with buckwheat aroma paired with Icheon rice — this region's unique combination. The springy buckwheat noodles and sweet-sour-spicy seasoning together paint a picture of a leisurely summer afternoon meal."
        },
        ingredients: { ko: ["메밀 면", "양념장", "오이", "계란", "무", "식초", "겨자"], ja: ["そば麺", "ヤンニョムジャン", "きゅうり", "卵", "大根", "酢", "からし"], en: ["Buckwheat noodles", "Spicy sauce", "Cucumber", "Egg", "Radish", "Vinegar", "Mustard"] },
        tags: ["막국수", "메밀", "냉면"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-sotbap",
        name: { ko: "솥밥", ja: "釜飯", en: "Sotbap (Pot Rice)" },
        region: "icheon",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/icheon-sotbap.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        tasteProfile: { sweet: 20, salty: 35, spicy: 10, umami: 70, sour: 5 },
        storyDescription: {
          ko: "작은 무쇠 솥에 이천 쌀과 제철 재료를 넣고 지어낸 솥밥이에요. 솥 뚜껑을 열 때 나는 구수한 김의 향기와 솥 바닥의 노릇한 누룽지는, 어떤 화려한 요리도 대신할 수 없는 단순하고 완벽한 행복이에요.",
          ja: "小さな鋳鉄の釜に利川のお米と旬の食材を入れて炊いた釜飯です。釜の蓋を開けたときに漂う香ばしい蒸気の香りと、釜底の黄金色のおこげは、どんな豪華な料理も代わりにはなれないシンプルで完璧な幸せです。",
          en: "Icheon rice and seasonal ingredients cooked in a small cast-iron pot. The fragrant steam that escapes when you lift the lid, and the golden scorched crust at the bottom — no elaborate dish can replace this simple, perfect happiness."
        },
        ingredients: { ko: ["이천 쌀", "제철 채소", "버섯", "간장", "참기름", "소금"], ja: ["利川米", "旬の野菜", "きのこ", "醤油", "ごま油", "塩"], en: ["Icheon rice", "Seasonal vegetables", "Mushrooms", "Soy sauce", "Sesame oil", "Salt"] },
        tags: ["솥밥", "누룽지", "이천쌀"],
                dupes: {
                  JP: [],
                  CN: [],
                },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-kongguksu",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/icheon-kongguksu.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
        name: { ko: "콩국수", ja: "コングクス", en: "Kongguksu" },
        region: "icheon",
        tasteProfile: { sweet: 10, salty: 20, spicy: 0, umami: 55, sour: 0 },
        storyDescription: { ko: "이천산 콩을 갈아 만든 차가운 콩물에 국수를 말아 여름철에 즐기는 보양식", ja: "利川産大豆をすりつぶした冷たい豆乳スープにそうめんを入れて夏に楽しむ滋養食", en: "Cold noodle soup made with ground Icheon soybeans, a summer restorative dish" },
        ingredients: { ko: ["이천 콩", "소면", "참깨", "오이", "소금", "얼음"], ja: ["利川大豆", "素麺", "ごま", "キュウリ", "塩", "氷"], en: ["Icheon soybean", "thin noodle", "sesame", "cucumber", "salt", "ice"] },
        tags: ["여름", "보양", "차가운", "이천콩"],
        dupes: {
          JP: [
        {
            name: { ko: "토뉴우멘", ja: "豆乳麺", en: "Tonyu Men" },
            tasteProfile: { sweet: 12, salty: 20, spicy: 0, umami: 58, sour: 0 },
            description: { ko: "두유 국물에 국수를 말아 내는 일본식 창작 면요리", ja: "豆乳スープに麺を入れる日本式創作麺料理", en: "Japanese creative noodle dish with soy milk broth" },
            ingredients: { ko: ["두유", "소면", "참깨", "실파", "간장", "얼음"], ja: ["豆乳", "素麺", "ごま", "細ネギ", "醤油", "氷"], en: ["soy milk", "thin noodle", "sesame", "scallion", "soy sauce", "ice"] },
            similarityPercent: 78,
            matchReason: { ko: "두유 국물에 국수를 말아먹는 방식이 콩국수와 거의 동일합니다.", ja: "豆乳スープに麺を入れて食べる方式がコングクスにほぼ同じです。", en: "Soy milk broth with noodles — very similar preparation." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "두장면", ja: "豆漿麺", en: "Dou Jiang Mian" },
            tasteProfile: { sweet: 10, salty: 25, spicy: 5, umami: 55, sour: 5 },
            description: { ko: "콩국물에 밀면을 말아 먹는 중국 북방 국수", ja: "豆乳スープに麺を入れる中国北方麺", en: "Northern Chinese noodles in soy milk broth" },
            ingredients: { ko: ["콩국", "밀면", "식초", "고수", "고추기름", "실파"], ja: ["豆乳", "小麦麺", "酢", "パクチー", "ラー油", "細ネギ"], en: ["soy milk", "wheat noodle", "vinegar", "cilantro", "chili oil", "scallion"] },
            similarityPercent: 75,
            matchReason: { ko: "콩을 간 국물에 국수를 말아먹는 방식이 공통됩니다.", ja: "大豆をすりつぶしたスープに麺を入れる方式が共通します。", en: "Ground soybean broth with noodles — shared concept." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-dojagi-bulgogi",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/icheon-dojagi-bulgogi.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        name: { ko: "도자기불고기", ja: "陶器プルコギ", en: "Dojagi Bulgogi" },
        region: "icheon",
        tasteProfile: { sweet: 45, salty: 50, spicy: 10, umami: 85, sour: 5 },
        storyDescription: { ko: "이천 도자기에 담아 테이블에서 구워먹는 프리미엄 한우 불고기 — 도자기 도시 이천의 정체성을 담은 요리", ja: "利川陶器に盛りテーブルで焼いて食べるプレミアム韓牛プルコギ - 陶磁器都市利川のアイデンティティを込めた料理", en: "Premium Korean beef bulgogi cooked tableside in Icheon ceramic ware — a dish embodying the pottery city's identity" },
        ingredients: { ko: ["한우 등심", "간장", "배즙", "참기름", "마늘", "이천 도자기"], ja: ["韓牛ロース", "醤油", "梨汁", "ごま油", "ニンニク", "利川陶器"], en: ["Korean beef sirloin", "soy sauce", "pear juice", "sesame oil", "garlic", "Icheon ceramic"] },
        tags: ["이천", "도자기", "한우", "프리미엄"],
        dupes: {
          JP: [
        {
            name: { ko: "스키야키", ja: "すき焼き", en: "Sukiyaki" },
            tasteProfile: { sweet: 50, salty: 50, spicy: 3, umami: 85, sour: 3 },
            description: { ko: "철제 냄비에 소고기와 야채를 간장·설탕으로 졸이는 일본 전골", ja: "鉄鍋に牛肉と野菜を醤油と砂糖で煮込む日本の鍋料理", en: "Japanese hot pot with beef and vegetables simmered in sweet soy" },
            ingredients: { ko: ["소고기", "두부", "대파", "쑥갓", "간장", "설탕"], ja: ["牛肉", "豆腐", "長ネギ", "春菊", "醤油", "砂糖"], en: ["beef", "tofu", "scallion", "garland chrysanthemum", "soy sauce", "sugar"] },
            similarityPercent: 80,
            matchReason: { ko: "소고기를 간장·설탕 베이스 양념에 조리하는 방식이 유사합니다.", ja: "牛肉を醤油と砂糖ベースで調理する方式が類似します。", en: "Beef in sweet soy — similar flavor profile, different cookware." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "톄반뉴러우", ja: "鉄板牛肉", en: "Tieban Niurou" },
            tasteProfile: { sweet: 30, salty: 55, spicy: 25, umami: 82, sour: 5 },
            description: { ko: "뜨거운 철판 위에 양념한 소고기를 구워내는 중국 요리", ja: "熱い鉄板の上で味付け牛肉を焼く中国料理", en: "Chinese beef grilled on a sizzling hot iron plate" },
            ingredients: { ko: ["소고기", "양파", "피망", "간장", "검은후추", "마늘"], ja: ["牛肉", "玉ねぎ", "ピーマン", "醤油", "黒胡椒", "ニンニク"], en: ["beef", "onion", "bell pepper", "soy sauce", "black pepper", "garlic"] },
            similarityPercent: 75,
            matchReason: { ko: "달군 그릇에 양념 소고기를 올려 조리하는 방식이 유사합니다.", ja: "熱した器に味付け牛肉を乗せて調理する方式が類似します。", en: "Seasoned beef cooked on hot vessel — similar." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-sansuyu-makgeolli",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/icheon-sansuyu-makgeolli.jpeg",
        name: { ko: "산수유 막걸리", ja: "サンシュユマッコリ", en: "Sansuyu Makgeolli" },
        region: "icheon",
        tasteProfile: { sweet: 35, salty: 5, spicy: 0, umami: 45, sour: 50 },
        storyDescription: { ko: "이천에서 재배한 산수유 열매를 넣어 빚은 붉은빛의 약선 막걸리 — 산미와 약재 향이 돋보이는 지역 전통주", ja: "利川で栽培されたサンシュユの実を入れて醸造した赤色の薬膳マッコリ - 酸味と薬草の香りが際立つ地域伝統酒", en: "Red medicinal makgeolli brewed with Icheon-grown cornelian cherries — a regional traditional rice wine with distinct acidity" },
        ingredients: { ko: ["이천쌀", "산수유 열매", "누룩", "효모", "물", "정제수"], ja: ["利川米", "サンシュユの実", "麹", "酵母", "水", "精製水"], en: ["Icheon rice", "cornelian cherry", "nuruk", "yeast", "water", "purified water"] },
        tags: ["이천", "전통주", "막걸리", "약선"],
        dupes: {
          JP: [
        {
            name: { ko: "우메슈 니고리자케", ja: "梅酒にごり酒", en: "Umeshu Nigorizake" },
            tasteProfile: { sweet: 45, salty: 0, spicy: 0, umami: 35, sour: 50 },
            description: { ko: "매실 과육을 넣어 빚은 탁한 일본 쌀술", ja: "梅の果肉を入れて造った濁り酒", en: "Cloudy Japanese rice wine infused with Japanese plums" },
            ingredients: { ko: ["쌀", "매실", "누룩", "설탕", "효모", "물"], ja: ["米", "梅", "麹", "砂糖", "酵母", "水"], en: ["rice", "plum", "koji", "sugar", "yeast", "water"] },
            similarityPercent: 78,
            matchReason: { ko: "열매를 넣어 빚은 탁한 쌀술이라는 점이 공통됩니다.", ja: "果実を入れて造った濁り酒という点が共通します。", en: "Fruit-infused cloudy rice wine — shared style." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "산자주", ja: "山楂酒", en: "Shanzhajiu" },
            tasteProfile: { sweet: 40, salty: 0, spicy: 0, umami: 30, sour: 55 },
            description: { ko: "산사나무 열매로 담근 붉은빛의 중국 전통 과실주", ja: "サンザシの実で造った赤色の中国伝統果実酒", en: "Red Chinese traditional fruit wine made from hawthorn berries" },
            ingredients: { ko: ["산사열매", "고량주", "얼음설탕", "효모", "물", "쌀"], ja: ["サンザシ", "高粱酒", "氷砂糖", "酵母", "水", "米"], en: ["hawthorn", "sorghum liquor", "rock sugar", "yeast", "water", "rice"] },
            similarityPercent: 75,
            matchReason: { ko: "약성 열매로 담근 붉은빛 전통주라는 점이 공통됩니다.", ja: "薬効果実で造った赤色の伝統酒という点が共通します。", en: "Red medicinal fruit wine — shared concept." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-cheonggukjang-jeongsik",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/icheon-cheonggukjang-jeongsik.jpeg",
        name: { ko: "청국장정식", ja: "チョングッチャン定食", en: "Cheonggukjang Jeongsik" },
        region: "icheon",
        tasteProfile: { sweet: 5, salty: 65, spicy: 15, umami: 90, sour: 5 },
        storyDescription: { ko: "이천에서 직접 띄운 청국장으로 끓인 진한 찌개와 이천쌀밥·나물 7첩을 함께 차리는 정갈한 정식", ja: "利川で自家発酵させたチョングッチャンで煮込んだ濃厚な鍋と利川米・ナムル7品を共に出す定食", en: "Traditional set meal with rich cheonggukjang stew from Icheon-fermented beans, Icheon rice, and seven vegetable sides" },
        ingredients: { ko: ["청국장", "이천쌀밥", "두부", "무", "나물", "김치"], ja: ["チョングッチャン", "利川米", "豆腐", "大根", "ナムル", "キムチ"], en: ["cheonggukjang", "Icheon rice", "tofu", "radish", "vegetables", "kimchi"] },
        tags: ["이천", "발효", "정식", "청국장"],
        dupes: {
          JP: [
        {
            name: { ko: "낫토 정식", ja: "納豆定食", en: "Natto Teishoku" },
            tasteProfile: { sweet: 5, salty: 55, spicy: 3, umami: 85, sour: 5 },
            description: { ko: "낫토를 밥·된장국과 함께 내는 일본 전통 정식", ja: "納豆をご飯と味噌汁と共に出す日本伝統定食", en: "Japanese traditional set meal with natto, rice, and miso soup" },
            ingredients: { ko: ["낫토", "쌀밥", "된장국", "계란말이", "김", "츠케모노"], ja: ["納豆", "ご飯", "味噌汁", "卵焼き", "海苔", "漬物"], en: ["natto", "rice", "miso soup", "rolled egg", "nori", "pickles"] },
            similarityPercent: 82,
            matchReason: { ko: "발효 콩을 중심에 둔 정식 상차림이라는 점이 거의 동일합니다.", ja: "発酵大豆を中心とした定食の構成がほぼ同じです。", en: "Fermented soybean centered set meal — nearly identical." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "더우츠 반", ja: "豆豉飯", en: "Douchi Ban" },
            tasteProfile: { sweet: 5, salty: 65, spicy: 25, umami: 85, sour: 5 },
            description: { ko: "중국식 발효 검은콩을 밥과 반찬과 함께 내는 한 상", ja: "中国式発酵黒豆をご飯と副菜と共に出す一膳", en: "Chinese fermented black bean set with rice and sides" },
            ingredients: { ko: ["더우츠", "쌀밥", "채소볶음", "두부", "실파", "간장"], ja: ["豆豉", "ご飯", "野菜炒め", "豆腐", "細ネギ", "醤油"], en: ["douchi", "rice", "stir-fried veg", "tofu", "scallion", "soy sauce"] },
            similarityPercent: 72,
            matchReason: { ko: "발효 콩을 활용한 반상 구성이 공통됩니다.", ja: "発酵大豆を活用した膳の構成が共通します。", en: "Fermented bean featured set meal — shared concept." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-neungi-shabu",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/icheon-neungi-shabu.jpeg",
        name: { ko: "능이버섯샤브샤브", ja: "ヌンイ茸しゃぶしゃぶ", en: "Neungi Mushroom Shabu-shabu" },
        region: "icheon",
        tasteProfile: { sweet: 10, salty: 40, spicy: 5, umami: 90, sour: 5 },
        storyDescription: { ko: "이천 산지에서 채취한 고급 능이버섯을 한우와 함께 맑은 국물에 살짝 익혀 먹는 귀한 샤브샤브", ja: "利川山地で採れた高級ヌンイ茸を韓牛と共に澄んだスープで軽く煮て食べる貴重なしゃぶしゃぶ", en: "Premium shabu-shabu with rare neungi mushrooms from Icheon mountains, cooked with Korean beef in clear broth" },
        ingredients: { ko: ["능이버섯", "한우 등심", "배추", "쑥갓", "다시마 육수", "부추"], ja: ["ヌンイ茸", "韓牛ロース", "白菜", "春菊", "昆布だし", "ニラ"], en: ["neungi mushroom", "beef sirloin", "napa cabbage", "garland chrysanthemum", "kombu broth", "chives"] },
        tags: ["이천", "산채", "샤브샤브", "프리미엄"],
        dupes: {
          JP: [
        {
            name: { ko: "마츠타케 샤브샤브", ja: "松茸しゃぶしゃぶ", en: "Matsutake Shabu-shabu" },
            tasteProfile: { sweet: 10, salty: 40, spicy: 3, umami: 92, sour: 3 },
            description: { ko: "귀한 송이버섯을 소고기와 함께 맑은 국물에 살짝 익혀 먹는 일본 전통 요리", ja: "貴重な松茸を牛肉と共に澄んだスープで軽く煮て食べる日本伝統料理", en: "Japanese traditional shabu-shabu with prized matsutake mushroom and beef in clear broth" },
            ingredients: { ko: ["송이버섯", "소고기", "배추", "쑥갓", "다시마", "간장 소스"], ja: ["松茸", "牛肉", "白菜", "春菊", "昆布", "醤油ダレ"], en: ["matsutake", "beef", "napa cabbage", "garland chrysanthemum", "kombu", "soy ponzu"] },
            similarityPercent: 90,
            matchReason: { ko: "귀한 버섯+소고기+맑은 국물 샤브샤브 구성이 거의 동일합니다.", ja: "貴重な茸+牛肉+澄んだスープのしゃぶしゃぶ構成がほぼ同じです。", en: "Prized mushroom + beef + clear broth hotpot — nearly identical format." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "샹구 훠궈", ja: "香菇火鍋", en: "Xianggu Huoguo" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 25, umami: 88, sour: 5 },
            description: { ko: "표고버섯을 포함한 여러 버섯과 고기를 육수에 끓여 먹는 중국 훠궈", ja: "椎茸を含む多様な茸と肉をスープで煮込む中国火鍋", en: "Chinese hot pot with shiitake and various mushrooms cooked with meat in broth" },
            ingredients: { ko: ["표고버섯", "팽이버섯", "소고기", "배추", "국물", "참깨 소스"], ja: ["椎茸", "えのき", "牛肉", "白菜", "スープ", "ごまダレ"], en: ["shiitake", "enoki", "beef", "napa cabbage", "broth", "sesame sauce"] },
            similarityPercent: 80,
            matchReason: { ko: "버섯과 고기를 육수에 데쳐 먹는 훠궈 스타일이 샤브샤브와 거의 동일합니다.", ja: "茸と肉をスープでさっと煮て食べる火鍋スタイルがしゃぶしゃぶにほぼ同じです。", en: "Mushroom and meat dipped in broth — same hotpot style." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-bokjung-ppang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/icheon-bokjung-ppang.jpeg",
        name: { ko: "복숭아빵", ja: "桃パン", en: "Bokjung-ppang (Peach Bread)" },
        region: "icheon",
        tasteProfile: { sweet: 65, salty: 10, spicy: 0, umami: 25, sour: 10 },
        storyDescription: { ko: "이천 특산 복숭아 과육을 넣어 구운 촉촉한 모양떡 — 제철 복숭아의 달콤한 향이 가득한 지역 명물", ja: "利川特産の桃の果肉を入れて焼いたしっとり形餅 - 旬の桃の甘い香りがたっぷり漂う地域の名物", en: "Moist shaped bread baked with Icheon's specialty peach flesh — a local treat full of the sweet aroma of seasonal peaches" },
        ingredients: { ko: ["밀가루", "이천 복숭아", "버터", "설탕", "계란", "우유"], ja: ["小麦粉", "利川桃", "バター", "砂糖", "卵", "牛乳"], en: ["flour", "Icheon peach", "butter", "sugar", "egg", "milk"] },
        tags: ["이천", "복숭아", "빵", "디저트"],
        dupes: {
          JP: [
        {
            name: { ko: "모모 단과자빵", ja: "桃菓子パン", en: "Momo Kashipan" },
            tasteProfile: { sweet: 65, salty: 8, spicy: 0, umami: 25, sour: 10 },
            description: { ko: "복숭아 모양으로 빚은 과일 소를 넣은 일본식 단과자빵", ja: "桃の形に成形した果物餡入り日本式菓子パン", en: "Japanese sweet bread shaped like a peach with fruit filling" },
            ingredients: { ko: ["밀가루", "복숭아 퓨레", "버터", "설탕", "우유", "이스트"], ja: ["小麦粉", "桃ピューレ", "バター", "砂糖", "牛乳", "イースト"], en: ["flour", "peach puree", "butter", "sugar", "milk", "yeast"] },
            similarityPercent: 85,
            matchReason: { ko: "복숭아 퓨레를 넣어 굽는 단과자빵이라는 점이 거의 동일합니다.", ja: "桃ピューレを入れて焼く菓子パンという点がほぼ同じです。", en: "Peach-puree filled sweet bread — nearly identical." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "서우타오", ja: "寿桃", en: "Shoutao Bao" },
            tasteProfile: { sweet: 60, salty: 5, spicy: 0, umami: 25, sour: 5 },
            description: { ko: "복숭아 모양으로 빚은 중국 축하용 찐빵", ja: "桃の形に成形した中国の祝い用蒸しパン", en: "Chinese steamed bun shaped like a peach for celebrations" },
            ingredients: { ko: ["밀가루", "복숭아 잼", "설탕", "베이킹파우더", "식용 색소", "물"], ja: ["小麦粉", "桃ジャム", "砂糖", "ベーキングパウダー", "食用色素", "水"], en: ["flour", "peach jam", "sugar", "baking powder", "food coloring", "water"] },
            similarityPercent: 78,
            matchReason: { ko: "복숭아 모양 빵이라는 점이 공통됩니다.", ja: "桃の形のパンという点が共通します。", en: "Peach-shaped bread — shared concept." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-maeun-dwaeji-galbi",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/icheon-maeun-dwaeji-galbi.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 프레임스튜디오",
        name: { ko: "매운돼지갈비", ja: "激辛豚カルビ", en: "Spicy Pork Rib" },
        region: "icheon",
        tasteProfile: { sweet: 25, salty: 50, spicy: 75, umami: 80, sour: 5 },
        storyDescription: { ko: "돼지갈비를 고추장 베이스의 매운 양념에 재워 숯불에 구워내는 이천 현지 스타일", ja: "豚カルビをコチュジャンベースの辛いタレに漬けて炭火で焼く利川ローカルスタイル", en: "Icheon local-style pork ribs marinated in spicy gochujang sauce and grilled over charcoal" },
        ingredients: { ko: ["돼지갈비", "고추장", "고춧가루", "마늘", "설탕", "이천쌀밥"], ja: ["豚カルビ", "コチュジャン", "粉唐辛子", "ニンニク", "砂糖", "利川米"], en: ["pork rib", "gochujang", "red pepper flake", "garlic", "sugar", "Icheon rice"] },
        tags: ["이천", "돼지갈비", "매운맛", "숯불"],
        dupes: {
          JP: [
        {
            name: { ko: "매운 포크 스페어리브", ja: "辛口ポークスペアリブ", en: "Spicy Pork Spare Rib" },
            tasteProfile: { sweet: 30, salty: 55, spicy: 55, umami: 80, sour: 5 },
            description: { ko: "고춧가루와 마늘 베이스의 매운 양념을 발라 구운 일본식 돼지갈비", ja: "唐辛子とニンニクベースの辛いタレを塗って焼く日本式豚スペアリブ", en: "Japanese-style pork spare ribs glazed with chili-garlic sauce" },
            ingredients: { ko: ["돼지갈비", "라유", "마늘", "간장", "설탕", "미림"], ja: ["豚スペアリブ", "ラー油", "ニンニク", "醤油", "砂糖", "みりん"], en: ["pork rib", "chili oil", "garlic", "soy sauce", "sugar", "mirin"] },
            similarityPercent: 72,
            matchReason: { ko: "매콤한 양념을 발라 구운 돼지갈비라는 점이 공통됩니다.", ja: "辛いタレを塗って焼く豚カルビという点が共通します。", en: "Spicy-glazed grilled pork ribs — shared concept." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "촨스 라바이구", ja: "川式辣排骨", en: "Chuan Shi La Paigu" },
            tasteProfile: { sweet: 20, salty: 55, spicy: 75, umami: 80, sour: 8 },
            description: { ko: "쓰촨 고추와 화자오를 넣어 매콤하게 조리한 돼지갈비", ja: "四川唐辛子と花椒を入れて辛く調理した豚カルビ", en: "Sichuan-style spicy pork ribs with chili and Sichuan peppercorn" },
            ingredients: { ko: ["돼지갈비", "건고추", "화자오", "두반장", "생강", "마늘"], ja: ["豚カルビ", "乾燥唐辛子", "花椒", "豆板醤", "生姜", "ニンニク"], en: ["pork rib", "dried chili", "sichuan pepper", "doubanjiang", "ginger", "garlic"] },
            similarityPercent: 85,
            matchReason: { ko: "매운 양념을 입힌 돼지갈비 요리라는 점이 거의 동일합니다.", ja: "辛いタレをまぶした豚カルビ料理という点がほぼ同じです。", en: "Spicy-seasoned pork ribs — nearly identical style." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-somori-gukbap",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/icheon-somori-gukbap.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
        name: { ko: "소머리국밥", ja: "牛頭クッパ", en: "Somori Gukbap" },
        region: "icheon",
        tasteProfile: { sweet: 5, salty: 55, spicy: 10, umami: 92, sour: 0 },
        storyDescription: { ko: "이천 재래시장 장날에 오래도록 사랑받아온 소머리 육수에 밥을 말아 먹는 진한 국밥", ja: "利川在来市場の市の日に長く愛されてきた牛頭スープにご飯を入れる濃厚クッパ", en: "Rich soup with rice in ox-head broth, long beloved at Icheon's traditional market days" },
        ingredients: { ko: ["소머리", "소머리 고기", "밥", "대파", "마늘", "소금"], ja: ["牛頭", "牛頭肉", "ご飯", "長ネギ", "ニンニク", "塩"], en: ["ox head", "ox head meat", "rice", "scallion", "garlic", "salt"] },
        tags: ["이천", "시장", "국밥", "전통"],
        dupes: {
          JP: [
        {
            name: { ko: "규지루 고항", ja: "牛汁ご飯", en: "Gyujiru Gohan" },
            tasteProfile: { sweet: 5, salty: 55, spicy: 3, umami: 90, sour: 3 },
            description: { ko: "소 머리와 뼈를 오래 우린 국물에 밥을 말아 내는 일본식 국밥", ja: "牛頭と骨を長時間煮込んだスープにご飯を入れる日本式クッパ", en: "Japanese rice-in-broth made with long-simmered ox head and bone" },
            ingredients: { ko: ["소머리", "쌀밥", "파", "간장", "미림", "생강"], ja: ["牛頭", "ご飯", "ネギ", "醤油", "みりん", "生姜"], en: ["ox head", "rice", "scallion", "soy sauce", "mirin", "ginger"] },
            similarityPercent: 80,
            matchReason: { ko: "소 머리를 우린 진한 국물에 밥을 말아 먹는 방식이 공통됩니다.", ja: "牛頭を煮込んだ濃厚スープにご飯を入れて食べる方式が共通します。", en: "Rich ox-head broth with rice — shared format." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "뉴터우 탕판", ja: "牛頭湯飯", en: "Niutou Tangfan" },
            tasteProfile: { sweet: 5, salty: 58, spicy: 15, umami: 90, sour: 5 },
            description: { ko: "소머리를 오래 고아 밥을 말아 먹는 중국식 탕반", ja: "牛頭を長時間煮込んでご飯を入れる中国式湯飯", en: "Chinese tangfan with rice in long-simmered ox-head broth" },
            ingredients: { ko: ["소머리", "밥", "파", "팔각", "간장", "생강"], ja: ["牛頭", "ご飯", "ネギ", "八角", "醤油", "生姜"], en: ["ox head", "rice", "scallion", "star anise", "soy sauce", "ginger"] },
            similarityPercent: 85,
            matchReason: { ko: "소머리 국물에 밥을 말아 먹는 방식이 거의 동일합니다.", ja: "牛頭スープにご飯を入れて食べる方式がほぼ同じです。", en: "Ox-head broth with rice bowl — nearly identical." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-onggi-mandu",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/icheon-onggi-mandu.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        name: { ko: "옹기만두", ja: "甕器餃子", en: "Onggi Mandu" },
        region: "icheon",
        tasteProfile: { sweet: 10, salty: 50, spicy: 20, umami: 75, sour: 5 },
        storyDescription: { ko: "이천 옹기 그릇에 담아 쪄낸 특대형 만두 — 이천 도자기 문화의 상징을 담은 체험형 명물 음식", ja: "利川の甕器に入れて蒸した特大サイズの餃子 - 利川陶器文化の象徴を込めた体験型名物料理", en: "Oversized dumplings steamed in Icheon onggi pottery — a signature experiential dish symbolizing the pottery culture" },
        ingredients: { ko: ["밀가루", "돼지고기", "두부", "당면", "김치", "파"], ja: ["小麦粉", "豚肉", "豆腐", "春雨", "キムチ", "ネギ"], en: ["flour", "pork", "tofu", "glass noodle", "kimchi", "scallion"] },
        tags: ["이천", "만두", "옹기", "체험"],
        dupes: {
          JP: [
        {
            name: { ko: "점보 교자", ja: "ジャンボ餃子", en: "Jumbo Gyoza" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 15, umami: 78, sour: 5 },
            description: { ko: "특대형 만두피에 돼지고기와 야채를 넣어 구운 일본 교자", ja: "特大サイズの皮に豚肉と野菜を包んで焼く日本ギョーザ", en: "Japanese jumbo pan-fried dumpling stuffed with pork and vegetables" },
            ingredients: { ko: ["밀가루 피", "돼지고기", "부추", "생강", "마늘", "간장"], ja: ["小麦皮", "豚肉", "ニラ", "生姜", "ニンニク", "醤油"], en: ["flour wrapper", "pork", "chives", "ginger", "garlic", "soy sauce"] },
            similarityPercent: 82,
            matchReason: { ko: "대형 만두피에 돼지고기 소를 넣어 조리하는 방식이 공통됩니다.", ja: "大型の皮に豚肉餡を包んで調理する方式が共通します。", en: "Large pork-filled dumplings — nearly identical." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "특대 자오즈", ja: "特大餃子", en: "Jumbo Jiaozi" },
            tasteProfile: { sweet: 8, salty: 52, spicy: 20, umami: 78, sour: 5 },
            description: { ko: "큼직한 밀가루 피에 돼지고기·배추 소를 넣은 중국 북방 교자", ja: "大きい小麦皮に豚肉・白菜餡を包んだ中国北方の餃子", en: "Northern Chinese large dumplings with pork and cabbage filling" },
            ingredients: { ko: ["밀가루 피", "돼지고기", "배추", "파", "간장", "참기름"], ja: ["小麦皮", "豚肉", "白菜", "ネギ", "醤油", "ごま油"], en: ["flour wrapper", "pork", "cabbage", "scallion", "soy sauce", "sesame oil"] },
            similarityPercent: 88,
            matchReason: { ko: "밀가루 피에 돼지고기 소를 넣은 대형 만두라는 점이 거의 동일합니다.", ja: "小麦皮に豚肉餡を包んだ大型餃子という点がほぼ同じです。", en: "Large flour-wrapped pork dumplings — nearly identical." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-jangeo-jeongsik",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/icheon-jangeo-jeongsik.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        name: { ko: "장어구이정식", ja: "ウナギ焼き定食", en: "Grilled Eel Set Meal" },
        region: "icheon",
        tasteProfile: { sweet: 35, salty: 55, spicy: 10, umami: 90, sour: 0 },
        storyDescription: { ko: "이천 복하천 일대에서 잡힌 민물 장어를 숯불에 구워 이천쌀밥과 반찬 여럿을 곁들여 내는 정식", ja: "利川・福河川一帯で獲れた淡水ウナギを炭火で焼いて利川米と副菜多数を添えて出す定食", en: "Set meal of freshwater eel from Icheon's Bokhacheon River, charcoal-grilled and served with Icheon rice and sides" },
        ingredients: { ko: ["민물 장어", "간장", "고추장 양념", "이천쌀밥", "나물", "된장국"], ja: ["淡水ウナギ", "醤油", "コチュジャンタレ", "利川米", "ナムル", "味噌汁"], en: ["freshwater eel", "soy sauce", "gochujang marinade", "Icheon rice", "vegetables", "doenjang soup"] },
        tags: ["이천", "장어", "복하천", "정식"],
        dupes: {
          JP: [
        {
            name: { ko: "우나주", ja: "うな重", en: "Unaju" },
            tasteProfile: { sweet: 45, salty: 50, spicy: 0, umami: 92, sour: 0 },
            description: { ko: "구운 장어를 달콤한 타레 소스에 조려 밥 위에 올린 일본 전통 요리", ja: "焼いたウナギを甘いタレで仕上げてご飯の上に乗せる日本伝統料理", en: "Japanese traditional dish of grilled eel in sweet tare sauce over rice" },
            ingredients: { ko: ["장어", "타레 소스", "쌀밥", "산초", "미림", "간장"], ja: ["ウナギ", "タレ", "ご飯", "山椒", "みりん", "醤油"], en: ["eel", "tare sauce", "rice", "sansho pepper", "mirin", "soy sauce"] },
            similarityPercent: 88,
            matchReason: { ko: "숯불에 구운 장어를 밥과 함께 내는 방식이 거의 동일합니다.", ja: "炭火で焼いたウナギをご飯と共に出す方式がほぼ同じです。", en: "Charcoal-grilled eel with rice — nearly identical concept." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "훙샤오 만위", ja: "紅焼鰻魚", en: "Hongshao Manyu" },
            tasteProfile: { sweet: 35, salty: 55, spicy: 15, umami: 88, sour: 5 },
            description: { ko: "간장과 설탕으로 윤기 있게 조린 중국식 장어 요리", ja: "醤油と砂糖で艶よく煮込んだ中国式ウナギ料理", en: "Chinese eel braised in soy sauce and sugar until glossy" },
            ingredients: { ko: ["장어", "간장", "설탕", "생강", "파", "샤오싱주"], ja: ["ウナギ", "醤油", "砂糖", "生姜", "ネギ", "紹興酒"], en: ["eel", "soy sauce", "sugar", "ginger", "scallion", "shaoxing wine"] },
            similarityPercent: 80,
            matchReason: { ko: "장어를 달짠 소스로 조리하는 방식이 공통됩니다.", ja: "ウナギを甘辛ソースで調理する方式が共通します。", en: "Eel in sweet-salty sauce — shared style." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-doenjang-jjigae-hansang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/icheon-doenjang-jjigae-hansang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
        name: { ko: "된장찌개 한상", ja: "テンジャンチゲ一膳", en: "Doenjang Jjigae Hansang" },
        region: "icheon",
        tasteProfile: { sweet: 8, salty: 65, spicy: 10, umami: 88, sour: 5 },
        storyDescription: { ko: "이천에서 직접 담근 장독대 된장으로 끓인 찌개와 이천쌀밥·나물 다섯 가지를 함께 내는 소박한 가정식 한 상", ja: "利川で自家製の大型甕で作った味噌で煮込んだ鍋と利川米・ナムル5品を共に出す素朴な家庭料理の一膳", en: "Humble home-style set with doenjang stew made from Icheon's own jar-fermented soybean paste, served with Icheon rice and five vegetable sides" },
        ingredients: { ko: ["이천 된장", "두부", "호박", "양파", "이천쌀밥", "나물 5종"], ja: ["利川味噌", "豆腐", "カボチャ", "玉ねぎ", "利川米", "ナムル5種"], en: ["Icheon doenjang", "tofu", "zucchini", "onion", "Icheon rice", "five vegetable sides"] },
        tags: ["이천", "된장", "가정식", "한상"],
        dupes: {
          JP: [
        {
            name: { ko: "미소시루 테이쇼쿠", ja: "味噌汁定食", en: "Misoshiru Teishoku" },
            tasteProfile: { sweet: 5, salty: 60, spicy: 3, umami: 85, sour: 3 },
            description: { ko: "된장국을 중심에 둔 일본 전통 정식 한 상", ja: "味噌汁を中心とした日本伝統定食の一膳", en: "Japanese traditional set meal centered on miso soup" },
            ingredients: { ko: ["미소", "두부", "미역", "쌀밥", "절임", "계란말이"], ja: ["味噌", "豆腐", "わかめ", "ご飯", "漬物", "卵焼き"], en: ["miso", "tofu", "wakame", "rice", "pickles", "rolled egg"] },
            similarityPercent: 85,
            matchReason: { ko: "발효 콩 된장국을 중심으로 밥과 반찬을 함께 내는 방식이 거의 동일합니다.", ja: "発酵大豆味噌汁を中心にご飯と副菜を共に出す方式がほぼ同じです。", en: "Fermented soybean soup-centered set meal — nearly identical." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "더우장 탕판", ja: "豆漿湯飯セット", en: "Doujiang Tangfan Set" },
            tasteProfile: { sweet: 5, salty: 60, spicy: 15, umami: 82, sour: 5 },
            description: { ko: "발효 콩 장으로 끓인 국물에 밥과 반찬을 함께 내는 중국 가정식", ja: "発酵大豆ソースで煮込んだスープにご飯と副菜を出す中国家庭料理", en: "Chinese home meal with fermented bean soup, rice, and sides" },
            ingredients: { ko: ["메이간차이", "두부", "간장", "밥", "청경채", "반찬"], ja: ["梅干し菜", "豆腐", "醤油", "ご飯", "チンゲン菜", "副菜"], en: ["mei gan cai", "tofu", "soy sauce", "rice", "bok choy", "sides"] },
            similarityPercent: 75,
            matchReason: { ko: "발효 콩 국물과 밥·반찬을 함께 내는 방식이 공통됩니다.", ja: "発酵大豆スープとご飯・副菜を共に出す方式が共通します。", en: "Fermented bean soup with rice and sides — shared format." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "icheon-gamja-ongsimi",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/icheon-gamja-ongsimi.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-디엔에이스튜디오",
        name: { ko: "감자옹심이", ja: "じゃがいも団子スープ", en: "Gamja Ongsimi" },
        region: "icheon",
        tasteProfile: { sweet: 5, salty: 45, spicy: 5, umami: 70, sour: 0 },
        storyDescription: { ko: "강원도 인근 내륙 채소인 감자를 갈아 새알처럼 빚어 된장 국물에 끓인 소박하고 따뜻한 이천 향토 음식", ja: "江原道近くの内陸野菜であるじゃがいもをすりおろして丸めて味噌スープで煮込んだ素朴で温かな利川郷土料理", en: "Humble Icheon folk dish of grated potato dumplings cooked in doenjang broth — a warm comfort food" },
        ingredients: { ko: ["감자", "된장", "애호박", "대파", "마늘", "소금"], ja: ["じゃがいも", "味噌", "ズッキーニ", "長ネギ", "ニンニク", "塩"], en: ["potato", "doenjang", "zucchini", "scallion", "garlic", "salt"] },
        tags: ["이천", "감자", "향토", "따뜻한국물"],
        dupes: {
          JP: [
        {
            name: { ko: "이모단고 지루", ja: "芋団子汁", en: "Imo Dango Jiru" },
            tasteProfile: { sweet: 5, salty: 48, spicy: 3, umami: 72, sour: 0 },
            description: { ko: "감자나 토란을 으깨 만든 단고를 된장 국물에 끓인 일본 요리", ja: "じゃがいもや里芋をすりつぶして作った団子を味噌汁で煮込む日本料理", en: "Japanese dish of potato or taro dumplings simmered in miso broth" },
            ingredients: { ko: ["감자", "된장", "파", "두부", "미림", "소금"], ja: ["じゃがいも", "味噌", "ネギ", "豆腐", "みりん", "塩"], en: ["potato", "miso", "scallion", "tofu", "mirin", "salt"] },
            similarityPercent: 88,
            matchReason: { ko: "감자로 빚은 단고를 된장 국물에 끓인 방식이 거의 동일합니다.", ja: "じゃがいもで作った団子を味噌スープで煮込む方式がほぼ同じです。", en: "Potato dumplings in miso broth — nearly identical." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "투더우 완즈탕", ja: "ジャガイモ団子スープ", en: "Tudou Wanzi Tang" },
            tasteProfile: { sweet: 5, salty: 50, spicy: 10, umami: 70, sour: 5 },
            description: { ko: "간 감자로 만든 완자를 국물에 끓인 중국 가정식 수프", ja: "すりおろしじゃがいもで作った団子をスープで煮込む中国家庭料理", en: "Chinese home-style soup with grated potato balls in broth" },
            ingredients: { ko: ["감자", "전분", "파", "간장", "참기름", "국물"], ja: ["じゃがいも", "澱粉", "ネギ", "醤油", "ごま油", "スープ"], en: ["potato", "starch", "scallion", "soy sauce", "sesame oil", "broth"] },
            similarityPercent: 82,
            matchReason: { ko: "감자를 갈아 빚은 단자를 국물에 끓이는 방식이 공통됩니다.", ja: "じゃがいもをすりおろして作った団子をスープで煮込む方式が共通します。", en: "Grated potato dumplings in broth — shared concept." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      }
    ]
  },
  {
    code: "sokcho",
    name: { ko: "속초", ja: "속초", en: "속초" },
    icon: "🏔️",
    image: "/images/village/sokcho.jpg",
    description: {
      ko: "설악산과 동해가 만나는 실향민의 도시",
      ja: "설악산과 동해가 만나는 실향민의 도시",
      en: "설악산과 동해가 만나는 실향민의 도시"
    },
    foods: [
      {
        id: "sokcho-dakgangjeong",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/sokcho-dakgangjeong.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "닭강정", ja: "ダッカンジョン", en: "Dakgangjeong" },
        region: "sokcho",
        tasteProfile: { sweet: 60, salty: 40, spicy: 50, umami: 50, sour: 10 },
        storyDescription: {
          ko: "속초중앙시장 만석닭강정으로 전국구가 된 달콤매콤한 튀김닭. 바삭한 껍질에 끈적한 양념이 배어 한 조각만 먹어도 시장의 활기가 입안에 퍼져요.",
          ja: "束草中央市場の「マンソクダッカンジョン」で全国区になった甘辛い揚げ鶏。サクサクの衣にとろりとしたタレが絡み、一口で市場の活気が口いっぱいに広がります。",
          en: "Sweet-and-spicy fried chicken made famous by Manseok Dakgangjeong in Sokcho Central Market. A crispy coating glazed with sticky sauce brings the bustle of the market alive in every bite."
        },
        ingredients: {
          ko: ["닭고기", "감자 전분", "물엿", "고추장", "간장", "마늘", "땅콩"],
          ja: ["鶏肉", "じゃがいもでんぷん", "水あめ", "コチュジャン", "醤油", "にんにく", "ピーナッツ"],
          en: ["Chicken", "Potato starch", "Corn syrup", "Gochujang", "Soy sauce", "Garlic", "Peanuts"]
        },
        tags: ["닭고기", "달콤매콤", "길거리"],
        dupes: {
          JP: [
        {
            name: { ko: "나고야 데바사키", ja: "名古屋手羽先", en: "Nagoya Tebasaki" },
            tasteProfile: { sweet: 50, salty: 55, spicy: 30, umami: 60, sour: 10 },
            description: { ko: "두 번 튀긴 닭 날개에 달콤 짭짤한 간장 양념을 바르고 검은 후추·깨를 뿌리는 나고야 명물.", ja: "二度揚げした手羽先に甘辛い醤油ダレを塗り、黒胡椒とごまを振った名古屋名物。", en: "Twice-fried chicken wings brushed with a sweet-savory soy glaze, topped with black pepper and sesame — Nagoya's signature." },
            ingredients: { ko: ["닭 날개", "간장", "미림", "설탕", "후추", "깨"], ja: ["手羽先", "醤油", "みりん", "砂糖", "胡椒", "ごま"], en: ["Chicken wings", "Soy sauce", "Mirin", "Sugar", "Pepper", "Sesame"] },
            similarityPercent: 82,
            matchReason: { ko: "두 번 튀김 + 끈적한 달콤짭짤 양념을 코팅하는 조리법이 거의 동일하고, 이자카야·시장 안주라는 문화적 위치도 닮았어요.", ja: "二度揚げ+甘辛いタレをまとわせる工程がほぼ同じで、居酒屋・市場のつまみという文化的な立ち位置もよく似ています。", en: "Nearly identical twice-fry-then-glaze technique, and both occupy the same cultural slot as market-stall / izakaya snacks." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "라즈지", ja: "辣子鶏", en: "Laziji" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 85, umami: 65, sour: 10 },
            description: { ko: "한 입 크기 닭튀김을 고추·화자오 산 더미와 함께 볶아 매운 향이 코를 찌르는 쓰촨 요리.", ja: "一口サイズに揚げた鶏肉を唐辛子と花椒の山と一緒に炒め、痺れる辛さが香る四川料理。", en: "Sichuan dish where bite-size fried chicken is stir-fried with mounds of dried chilies and Sichuan peppercorns for a numbing, aromatic heat." },
            ingredients: { ko: ["닭고기", "건고추", "화자오", "마늘", "생강", "간장"], ja: ["鶏肉", "乾燥唐辛子", "花椒", "にんにく", "生姜", "醤油"], en: ["Chicken", "Dried chilies", "Sichuan peppercorn", "Garlic", "Ginger", "Soy sauce"] },
            similarityPercent: 70,
            matchReason: { ko: "'한 입 튀김닭 + 후속 매운 조리' 2단 구조는 동일하지만, 속초는 달콤한 양념 코팅, 쓰촨은 마라 볶음으로 갈라져요.", ja: "『一口揚げ+後追いの辛い仕上げ』という二段構えは同じですが、束草は甘辛ダレ、四川は麻辣炒めと仕上げが分かれます。", en: "Both share the two-step structure of 'bite-size fry then a spicy second stage,' diverging in the finish — sweet glaze vs. numbing stir-fry." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "sokcho-abai-sundae",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/sokcho-abai-sundae.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-테마상품팀 IR 스튜디오",
        name: { ko: "아바이순대", ja: "アバイスンデ", en: "Abai Sundae" },
        region: "sokcho",
        tasteProfile: { sweet: 10, salty: 60, spicy: 30, umami: 75, sour: 5 },
        storyDescription: {
          ko: "함경도에서 피난 온 실향민들이 청호동 아바이마을에서 이어 온 북방식 순대. 돼지 대창을 통째로 써서 굵고 푸짐하며 찹쌀과 선지가 꽉 차 있어요.",
          ja: "咸鏡道から避難してきた離散民たちが青湖洞のアバイ村で受け継いできた北部式スンデ(ブラッドソーセージ)。豚の大腸を丸ごと使って太くボリュームがあり、もち米と血(ソンジ)がぎっしり詰まっています。",
          en: "A North Korean-style blood sausage kept alive by displaced families from Hamgyeong Province in Sokcho's Abai Village. Made with whole pork large intestine, it is thick and hearty, tightly packed with glutinous rice and blood curd."
        },
        ingredients: {
          ko: ["돼지 대창", "찹쌀", "선지", "숙주", "배추", "두부", "마늘"],
          ja: ["豚の大腸", "もち米", "ソンジ(豚の血)", "もやし", "白菜", "豆腐", "にんにく"],
          en: ["Pork large intestine", "Glutinous rice", "Pig's blood curd", "Bean sprouts", "Cabbage", "Tofu", "Garlic"]
        },
        tags: ["순대", "실향민", "북방음식"],
        dupes: {
          JP: [
        {
            name: { ko: "치탈린 모츠니", ja: "もつ煮込み", en: "Motsu Nikomi (Pork Offal Stew)" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 75, sour: 5 },
            description: { ko: "돼지 곱창·대창을 뿌리채소와 함께 미소 국물에 푹 끓인 일본의 서민 포장마차 음식.", ja: "豚のもつ(大腸・小腸)を根菜と一緒に味噌で長時間煮込む、日本の居酒屋・屋台の大衆料理。", en: "Japanese izakaya staple slow-stewing pork offal — large and small intestines — with root vegetables in a miso broth." },
            ingredients: { ko: ["돼지 대창", "무", "당근", "곤약", "미소", "생강"], ja: ["豚もつ", "大根", "人参", "こんにゃく", "味噌", "生姜"], en: ["Pork intestine", "Daikon", "Carrot", "Konjac", "Miso", "Ginger"] },
            similarityPercent: 62,
            matchReason: { ko: "'돼지 대창을 주재료로 오래 익혀 슴슴한 국물·안주로 즐긴다'는 면이 닮았어요. 아바이순대는 속을 채워 찌는 방식, 모츠니는 끓여 먹는 방식이라는 점에서 갈라져요.", ja: "『豚の大腸を主役に長時間火を通して、汁ものやつまみとして楽しむ』面が似ています。アバイスンデは詰めて蒸すタイプ、もつ煮は煮込むタイプで分岐します。", en: "Both treat pork intestine as the star, slow-cooked to be enjoyed as a soupy snack/meal. They diverge in technique — Abai Sundae is stuffed and steamed, motsu nikomi is simmered." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "쉐창", ja: "血腸 (シュエチャン)", en: "Xuechang (Blood Sausage)" },
            tasteProfile: { sweet: 5, salty: 60, spicy: 10, umami: 75, sour: 5 },
            description: { ko: "돼지 피와 찹쌀을 돼지 창자에 채워 삶아내는 동북 3성의 전통 블러드 소시지. 시큼한 배추 절임과 함께 끓이는 '쉐창 쑤안차이'로 유명해요.", ja: "豚の血ともち米を豚腸に詰めて茹でる中国東北地方の伝統的なブラッドソーセージ。酸っぱい白菜漬けと煮込む『血腸酸菜』が有名。", en: "Traditional blood sausage from China's northeastern provinces, stuffing pork intestine with pig's blood and glutinous rice. Famously stewed with fermented cabbage as 'xuechang suancai.'" },
            ingredients: { ko: ["돼지 창자", "돼지 피", "찹쌀", "생강", "대파"], ja: ["豚腸", "豚の血", "もち米", "生姜", "長ねぎ"], en: ["Pork casing", "Pig's blood", "Glutinous rice", "Ginger", "Green onion"] },
            similarityPercent: 86,
            matchReason: { ko: "함경도 아바이순대의 직접적 뿌리가 동북 3성의 쉐창이에요. 돼지 대창+선지+찹쌀이라는 재료 구성이 거의 동일하고, 추운 지방의 저장·보양 음식이라는 맥락도 같아요.", ja: "咸鏡道のアバイスンデの直接的なルーツが東北地方の血腸。豚の大腸+血+もち米という構成がほぼ同じで、寒冷地の保存・滋養食という文脈も共通します。", en: "Hamgyeong's Abai Sundae traces its direct ancestry to Northeast China's xuechang — near-identical build of pork casing, blood, and glutinous rice, sharing the cold-region preservation-and-nourishment role." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "sokcho-ojingeo-sundae",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/sokcho-ojingeo-sundae.jpeg",
        imageCredit: "ⓒ한국관광공사 포토코리아-테마상품팀 IR 스튜디오",
        name: { ko: "오징어순대", ja: "イカスンデ", en: "Ojingeo Sundae (Stuffed Squid)" },
        region: "sokcho",
        tasteProfile: { sweet: 10, salty: 55, spicy: 40, umami: 70, sour: 10 },
        storyDescription: {
          ko: "속초 앞바다에서 잡힌 오징어 몸통 속에 두부·야채·찹쌀 소를 채워 쪄낸 향토 요리. 썰어 놓으면 검은 테두리와 속 재료가 김밥처럼 예쁘게 드러나요.",
          ja: "束草沖で獲れたイカの胴に、豆腐・野菜・もち米の具を詰めて蒸し上げる郷土料理。輪切りにすると黒い縁と色とりどりの具が海苔巻きのように美しく現れます。",
          en: "A coastal specialty from Sokcho: whole squid bodies stuffed with tofu, vegetables, and glutinous rice, then steamed. Sliced into rounds, the dark squid ring frames the colorful filling like gimbap."
        },
        ingredients: {
          ko: ["오징어", "두부", "당근", "찹쌀", "달걀", "부추"],
          ja: ["イカ", "豆腐", "人参", "もち米", "卵", "ニラ"],
          en: ["Squid", "Tofu", "Carrot", "Glutinous rice", "Egg", "Chives"]
        },
        tags: ["오징어", "순대", "해산물"],
        dupes: {
          JP: [
        {
            name: { ko: "이카메시", ja: "いかめし", en: "Ikameshi" },
            tasteProfile: { sweet: 25, salty: 55, spicy: 5, umami: 75, sour: 5 },
            description: { ko: "오징어 몸통에 찹쌀을 채워 간장·설탕·미림 국물에 졸이는 홋카이도 모리마치 명물. 에키벤(역도시락)의 전설.", ja: "イカの胴にもち米を詰め、醤油・砂糖・みりんの汁で炊き上げる北海道森町の名物。駅弁の伝説的存在。", en: "Hokkaido Morimachi specialty: squid stuffed with glutinous rice and simmered in a soy-sugar-mirin broth. A legendary ekiben (station bento)." },
            ingredients: { ko: ["오징어", "찹쌀", "간장", "설탕", "미림"], ja: ["イカ", "もち米", "醤油", "砂糖", "みりん"], en: ["Squid", "Glutinous rice", "Soy sauce", "Sugar", "Mirin"] },
            similarityPercent: 88,
            matchReason: { ko: "'오징어 몸통에 찹쌀을 채워 익힌다'는 발상이 거의 완벽하게 일치해요. 동해·홋카이도 오징어가 풍부한 두 항구가 비슷한 길로 가닿은 대표적 평행진화.", ja: "『イカの胴にもち米を詰めて火を通す』という発想がほぼ完全一致。東海と北海道という、イカが豊富な二つの港が似た道に辿り着いた典型的な平行進化です。", en: "The 'glutinous rice stuffed inside a squid body, then cooked' concept matches almost perfectly — a textbook parallel-evolution between two squid-rich ports, East Sea and Hokkaido." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "니앙유', 오징어 속 채움", ja: "釀魷魚", en: "Niàng Yóuyú (Stuffed Squid)" },
            tasteProfile: { sweet: 15, salty: 60, spicy: 15, umami: 75, sour: 5 },
            description: { ko: "오징어 몸통에 다진 돼지고기·생강·쪽파를 채워 찜통에 쪄내는 중국 동남부 해안 요리. 간장 소스 끼얹어 먹어요.", ja: "イカの胴に豚ひき肉・生姜・細ねぎを詰めて蒸籠で蒸す中国東南沿岸の料理。醤油ダレをかけていただきます。", en: "Southeast coastal Chinese dish where squid bodies are stuffed with minced pork, ginger, and scallion, then steamed and finished with a soy sauce drizzle." },
            ingredients: { ko: ["오징어", "다진 돼지고기", "생강", "쪽파", "간장", "쌀주"], ja: ["イカ", "豚ひき肉", "生姜", "細ねぎ", "醤油", "紹興酒"], en: ["Squid", "Minced pork", "Ginger", "Scallion", "Soy sauce", "Shaoxing wine"] },
            similarityPercent: 80,
            matchReason: { ko: "속 재료가 고기 중심으로 바뀌긴 했지만, '오징어 자체를 케이스로 써서 속을 채우고 찐다'는 기술이 동일하고 간장 베이스 양념도 겹쳐요.", ja: "具が肉中心に変わるものの、『イカそのものを器にして具を詰め、蒸す』技法は同じで、醤油ベースの味付けも重なります。", en: "The filling leans to meat, but the technique — using the squid itself as a vessel, stuffing, and steaming — is identical, with overlapping soy-based seasoning." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
    ]
  },
  {
    code: "yeosu",
    name: { ko: "여수", ja: "여수", en: "여수" },
    icon: "🌊",
    image: "/images/village/yeosu.jpg",
    description: {
      ko: "남해 밤바다와 한정식의 도시 여수",
      ja: "남해 밤바다와 한정식의 도시 여수",
      en: "남해 밤바다와 한정식의 도시 여수"
    },
    foods: [
      {
        id: "yeosu-gat-kimchi",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/yeosu-gat-kimchi.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        name: { ko: "돌산 갓김치", ja: "突山カッキムチ", en: "Dolsan Gat-Kimchi (Mustard Greens Kimchi)" },
        region: "yeosu",
        tasteProfile: { sweet: 10, salty: 60, spicy: 65, umami: 55, sour: 70 },
        storyDescription: {
          ko: "여수 돌산도의 해풍 맞고 자란 갓으로 담근 톡 쏘는 김치. 알싸한 갓 특유의 향과 아삭한 줄기가 입안에서 강한 인상을 남겨요.",
          ja: "麗水・突山島の海風を浴びて育ったカラシ菜で漬け込む、ピリッとしたキムチ。鼻に抜ける辛味とシャキッとした茎が強い印象を残します。",
          en: "A pungent kimchi pickled from mustard greens grown by the sea breeze on Yeosu's Dolsan Island. The sharp, almost wasabi-like bite and crisp stalks leave a strong impression."
        },
        ingredients: {
          ko: ["갓", "고춧가루", "멸치액젓", "마늘", "생강", "찹쌀풀"],
          ja: ["カラシ菜", "粉唐辛子", "イワシ魚醤", "にんにく", "生姜", "もち米糊"],
          en: ["Mustard greens", "Korean chili powder", "Anchovy fish sauce", "Garlic", "Ginger", "Glutinous rice paste"]
        },
        tags: ["갓", "김치", "돌산"],
        dupes: {
          JP: [
        {
            name: { ko: "다카나즈케", ja: "高菜漬け", en: "Takana-zuke" },
            tasteProfile: { sweet: 5, salty: 65, spicy: 35, umami: 60, sour: 55 },
            description: { ko: "일본 규슈의 특산 채소인 다카나(고엽 갓)를 소금으로 한 달 이상 절여 시큼하고 알싸하게 발효시킨 일본식 갓절임. 주먹밥·라멘 토핑으로 인기예요.", ja: "九州特産の高菜を塩で一か月以上漬け、酸味と辛味を引き出した日本の定番漬け物。おにぎりやラーメンのトッピングとして親しまれています。", en: "A Kyushu regional pickle: mustard greens (takana) cured in salt for a month or more, fermenting into a tangy, mustard-sharp relish. Beloved as an onigiri filling and ramen topping." },
            ingredients: { ko: ["다카나(갓)", "소금", "고춧가루", "참깨", "간장", "미림"], ja: ["高菜", "塩", "唐辛子", "ごま", "醤油", "みりん"], en: ["Takana (mustard greens)", "Salt", "Chili", "Sesame", "Soy sauce", "Mirin"] },
            similarityPercent: 86,
            matchReason: { ko: "같은 갓(카라시나)을 주재료로 발효시키는 쌍둥이 절임이에요. 한국은 고춧가루·젓갈로 강렬하게, 일본은 소금 위주로 은근하게 익히는 방향성 차이일 뿐.", ja: "同じカラシ菜を主役に発酵させる双子のような漬物。韓国は粉唐辛子と魚醤で強烈に、日本は塩ベースで穏やかに仕上げるという方向性の違いだけ。", en: "Both build around the same vegetable — mustard greens — fermented into a pickle. Korea dials up heat with chili and fish sauce; Japan stays salt-forward for a quieter profile." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "쉐리홍 (雪里紅, 겨자 잎 절임)", ja: "雪里紅", en: "Xuě Lǐ Hóng" },
            tasteProfile: { sweet: 5, salty: 70, spicy: 20, umami: 65, sour: 45 },
            description: { ko: "강남·상하이 지역에서 겨자 잎(갓의 사촌 격)을 소금에 절여 발효시킨 뒤, 잘게 썰어 국·볶음·만두소로 쓰는 중국식 발효 채소.", ja: "江南・上海地方でからし菜の葉を塩漬け発酵させ、細かく刻んでスープや炒め物、餃子の具に使う中国式の発酵野菜。", en: "Shanghai and Jiangnan salt-fermented mustard greens — minced and stirred into soups, stir-fries, and dumpling fillings across eastern China." },
            ingredients: { ko: ["겨자 잎", "소금", "고추", "생강", "식용유"], ja: ["からし菜", "塩", "唐辛子", "生姜", "サラダ油"], en: ["Mustard greens", "Salt", "Chili", "Ginger", "Vegetable oil"] },
            similarityPercent: 82,
            matchReason: { ko: "갓과 같은 브라시카속 잎채소를 절여 발효시키는 동아시아 절임 벨트의 대표 주자예요. 찬 반찬에서 끝내느냐 요리 재료로 쓰느냐로 갈립니다.", ja: "カラシ菜と同じアブラナ属の葉物を塩漬け発酵させる東アジア『発酵ベルト』の代表格。冷菜で完結するか料理の具材に使うかで分岐します。", en: "Both are flagship players on the East Asian fermentation belt for brassica leaves. The split is in use — a standalone side dish vs. a building block that flavors other recipes." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "yeosu-seodae-hoemuchim",
        image: "",
        name: { ko: "서대회무침", ja: "ソデフェムチム（舌平目の酢和え）", en: "Seodae Hoemuchim (Sole Sashimi Salad)" },
        region: "yeosu",
        tasteProfile: { sweet: 35, salty: 45, spicy: 60, umami: 65, sour: 75 },
        storyDescription: {
          ko: "여수 앞바다 서대(가자미류)를 쫀쫀하게 썰어 막걸리 식초에 절인 뒤 고추장·채소와 버무린 새콤달콤한 회무침. 밥 위에 올려 쓱쓱 비벼 먹으면 한 대접 뚝딱이에요.",
          ja: "麗水近海で獲れた舌平目を厚めに切って、マッコリ酢で締めたあと、コチュジャンと野菜で和えた甘酸っぱい刺身和え。ご飯に乗せて豪快に混ぜると、丼一杯があっという間に消えます。",
          en: "Yeosu's signature sole sashimi salad: firm tongue-sole fillets cured in makgeolli vinegar, then tossed with gochujang, scallions, and crunchy vegetables. Heaped over hot rice, a bowl vanishes in minutes."
        },
        ingredients: {
          ko: ["서대", "막걸리 식초", "고추장", "미나리", "양파", "참기름", "깨"],
          ja: ["舌平目", "マッコリ酢", "コチュジャン", "セリ", "玉ねぎ", "ごま油", "胡麻"],
          en: ["Tongue sole", "Makgeolli vinegar", "Gochujang", "Minari", "Onion", "Sesame oil", "Sesame"]
        },
        tags: ["회무침", "새콤달콤", "해산물"],
        dupes: {
          JP: [
        {
            name: { ko: "아지노 타타키", ja: "鯵のたたき", en: "Aji no Tataki" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 80, sour: 35 },
            description: { ko: "신선한 전갱이를 잘게 두드려 다진 뒤 생강·파·차조기와 간장·식초로 무치는 일본식 회 무침. 규슈·시코쿠 해안 지방의 여름 별미.", ja: "新鮮な鯵を包丁で叩き、生姜・ねぎ・大葉と一緒に醤油と酢で和える九州・四国沿岸の夏の郷土料理。", en: "A Kyushu and Shikoku coastal summer favorite: fresh mackerel minced with a knife, then dressed with ginger, scallion, shiso, soy, and rice vinegar." },
            ingredients: { ko: ["전갱이", "생강", "파", "차조기", "간장", "식초"], ja: ["鯵", "生姜", "ねぎ", "大葉", "醤油", "酢"], en: ["Horse mackerel", "Ginger", "Scallion", "Shiso", "Soy sauce", "Vinegar"] },
            similarityPercent: 72,
            matchReason: { ko: "생선살을 잘게 손질해 산미 있는 양념에 버무려 즉석에서 내는 구조가 똑같아요. 한국은 고추장으로 단맛·매운맛을 동시에, 일본은 간장·식초로 맑은 결을 살려요.", ja: "魚の身を細かく仕立て、酸味のある調味料で即席に和える構造が同じ。韓国はコチュジャンで甘辛を同時に、日本は醤油と酢で澄んだ味わいを活かします。", en: "Shared format: finely worked raw fish dressed on the spot with acid. Korea lets gochujang deliver sweet and spice together; Japan keeps a clean line with soy and vinegar." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [],
        },
        isLocalSpecialty: false,
      },
      {
        id: "yeosu-jangeo-tang",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/yeosu-jangeo-tang.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
        name: { ko: "장어탕", ja: "のウナギ汁（チャンオタン）", en: "Jangeo-Tang (Eel Soup)" },
        region: "yeosu",
        tasteProfile: { sweet: 10, salty: 55, spicy: 45, umami: 80, sour: 5 },
        storyDescription: {
          ko: "여수 하동 장어를 뼈째 고아 우거지와 함께 끓인 보양탕. 진한 국물에 방아잎 향이 은근히 퍼지며 숟가락을 놓을 수 없는 감칠맛을 내요.",
          ja: "麗水・河東のウナギを骨ごと煮込み、白菜の外葉(ウゴジ)と一緒にじっくり煮る滋養スープ。濃厚な出汁にカワミドリの葉の香りがふわりと広がり、スプーンが止まりません。",
          en: "A Yeosu restorative soup: local Hadong eel simmered whole, bones and all, together with outer cabbage leaves. The rich broth carries a whisper of Korean mint (bangah), turning the umami unstoppable."
        },
        ingredients: {
          ko: ["장어", "우거지", "된장", "고추장", "방아잎", "대파", "마늘"],
          ja: ["ウナギ", "白菜の外葉", "味噌(テンジャン)", "コチュジャン", "カワミドリの葉", "長ねぎ", "にんにく"],
          en: ["Eel", "Outer cabbage leaves", "Doenjang miso", "Gochujang", "Korean mint (bangah)", "Scallion", "Garlic"]
        },
        tags: ["장어", "보양", "뚝배기"],
        dupes: {
          JP: [
        {
            name: { ko: "야나가와 나베 (붕장어·우엉 전골)", ja: "柳川鍋", en: "Yanagawa-Nabe" },
            tasteProfile: { sweet: 25, salty: 60, spicy: 5, umami: 80, sour: 5 },
            description: { ko: "미꾸라지나 작은 붕장어를 우엉과 함께 간장·미림 국물에 얹어 달걀을 풀어 끓이는 에도 시대 이래의 일본 전통 보양 전골.", ja: "どじょうや小さな穴子をごぼうと共に醤油・みりんの汁で煮て、卵でとじる江戸時代以来の日本伝統の滋養鍋。", en: "An Edo-era Japanese one-pot: loach or small conger eel simmered with burdock in a soy-mirin broth, finished with beaten egg." },
            ingredients: { ko: ["미꾸라지/붕장어", "우엉", "간장", "미림", "달걀", "쪽파"], ja: ["どじょう/穴子", "ごぼう", "醤油", "みりん", "卵", "小ねぎ"], en: ["Loach/conger eel", "Burdock", "Soy sauce", "Mirin", "Egg", "Scallion"] },
            similarityPercent: 72,
            matchReason: { ko: "민물·해안 장어류를 뿌리채소와 끓여 '여름·겨울 보양탕'으로 즐기는 동아시아 전통이 맞닿아 있어요. 우엉·달걀이 우거지·방아잎을 대신할 뿐.", ja: "淡水や沿岸のウナギ類を根菜と煮込み『夏・冬の滋養鍋』として楽しむ東アジア伝統が共通。ごぼうと卵が白菜の外葉とカワミドリの葉を置き換えた姿。", en: "Both reflect the East Asian tradition of cooking eels with roots for seasonal tonic. Burdock and egg stand in for outer cabbage leaves and bangah mint." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "황산 뱀장어탕 (黃鱔湯)", ja: "ホワンシャンタン", en: "Huáng Shàn Tāng (Rice-Field Eel Soup)" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 30, umami: 85, sour: 5 },
            description: { ko: "논뱀장어(황선)를 생강·후추·구기자와 함께 푹 끓인 중국 강남·쓰촨 지방의 보양탕. 몸을 덥히는 약재를 넣어 겨울 보양식으로 통해요.", ja: "田ウナギ(黄鱔)を生姜・胡椒・クコの実と一緒にじっくり煮込む、中国江南・四川地方の滋養スープ。体を温める生薬を合わせ冬の補養食として重宝されます。", en: "A Jiangnan and Sichuan warming broth: paddy eel simmered with ginger, pepper, and goji berries. Winter tonic territory, with medicinal herbs threaded through." },
            ingredients: { ko: ["논뱀장어", "생강", "흰 후추", "구기자", "당귀", "대파"], ja: ["田ウナギ", "生姜", "白胡椒", "クコの実", "当帰", "長ねぎ"], en: ["Paddy eel", "Ginger", "White pepper", "Goji berry", "Dang gui", "Scallion"] },
            similarityPercent: 80,
            matchReason: { ko: "'장어를 약재와 함께 오래 끓여 보양'이라는 동아시아 공통 문법을 따르고, 몸에 열을 넣어주는 목적과 양념 레이어까지 서로 겹쳐요.", ja: "『ウナギを生薬と共に長時間煮て滋養にする』という東アジア共通文法に従い、体を温める目的と調味レイヤーまで重なります。", en: "Both follow the East Asian tonic grammar of 'slow-simmer eel with medicinal herbs.' The warming intent and layered seasoning profile line up neatly." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "yeosu-gejang-baekban",
        image: "",
        name: { ko: "게장백반", ja: "カンジャンケジャン定食", en: "Gejang Baekban (Soy-Marinated Crab Set)" },
        region: "yeosu",
        tasteProfile: { sweet: 20, salty: 65, spicy: 50, umami: 80, sour: 20 },
        storyDescription: {
          ko: "남해 꽃게·돌게를 간장에 숙성시켜 냉장고 속에서 며칠 잠재운 뒤, 따끈한 밥에 등딱지째 올려 비벼 먹는 상차림. '밥도둑'이라는 별명이 괜히 붙은 게 아니에요.",
          ja: "南海の渡り蟹・石蟹を醤油だれで数日間熟成させ、熱々ご飯に甲羅ごと乗せて混ぜて食べる定食。『ご飯泥棒』というあだ名は伊達ではありません。",
          en: "Southern-sea blue crab and rock crab marinated in soy sauce, rested for days in the fridge, then heaped over steaming rice — shell and all — for mixing. No wonder Koreans nickname it 'the rice thief.'"
        },
        ingredients: {
          ko: ["꽃게", "돌게", "간장", "마늘", "생강", "양파", "청양고추"],
          ja: ["渡り蟹", "石蟹", "醤油", "にんにく", "生姜", "玉ねぎ", "青唐辛子"],
          en: ["Blue crab", "Rock crab", "Soy sauce", "Garlic", "Ginger", "Onion", "Cheongyang chili"]
        },
        tags: ["게장", "밥도둑", "백반"],
        dupes: {
          JP: [
        {
            name: { ko: "카니노 쇼유즈케", ja: "蟹の醤油漬け", en: "Kani no Shoyu-zuke" },
            tasteProfile: { sweet: 10, salty: 70, spicy: 5, umami: 85, sour: 10 },
            description: { ko: "홋카이도·토호쿠 지방의 어부들이 털게나 대게를 잘라 간장·다시마·미림에 절여 숙성시키는 일본식 게 간장 절임. 뜨거운 밥에 올려 먹어요.", ja: "北海道や東北地方の漁師たちが毛蟹やズワイガニを切って醤油・昆布・みりんに漬ける日本式カニの醤油漬け。熱いご飯に乗せていただきます。", en: "A Hokkaido/Tohoku fisherman's preparation: hair crab or snow crab chopped and marinated in soy, kombu, and mirin until it reaches a silky, ready-to-rice state." },
            ingredients: { ko: ["털게/대게", "간장", "다시마", "미림", "생강", "청주"], ja: ["毛蟹/ズワイガニ", "醤油", "昆布", "みりん", "生姜", "日本酒"], en: ["Hair/Snow crab", "Soy sauce", "Kombu", "Mirin", "Ginger", "Sake"] },
            similarityPercent: 82,
            matchReason: { ko: "'간장 베이스 양념으로 게를 숙성시켜 밥 반찬으로 먹는' 큰 그림이 동일해요. 다시마·미림으로 단맛을 잡느냐, 청양고추로 매운맛을 올리느냐의 갈림길.", ja: "『醤油ベースの漬け汁で蟹を熟成させ、ご飯のお供として食べる』大枠が同じ。昆布とみりんで甘味を整えるか、青唐辛子で辛味を立てるかの分岐。", en: "Same blueprint: cure crab in a soy-based marinade, serve over rice. The fork is kombu/mirin softness vs. Cheongyang chili heat." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "쭈이시에 (醉蟹, 중국식 술 게장)", ja: "酔蟹", en: "Zuì Xiè (Drunken Crab)" },
            tasteProfile: { sweet: 15, salty: 60, spicy: 10, umami: 80, sour: 15 },
            description: { ko: "살아 있는 민물게(털게 혹은 꽃게)를 소흥주·간장·생강·설탕에 며칠 담가 숙성시키는 강남 지방의 전통 요리. 게장의 직접적 뿌리로 여겨져요.", ja: "生きた淡水ガニ(毛蟹や渡り蟹)を紹興酒・醤油・生姜・砂糖に数日漬けて熟成させる江南地方の伝統料理。ケジャンの直接のルーツとされます。", en: "A Jiangnan tradition: live freshwater crab (hairy or blue) steeped for days in Shaoxing wine, soy sauce, ginger, and sugar — widely considered the direct ancestor of gejang." },
            ingredients: { ko: ["민물게", "소흥주", "간장", "생강", "설탕", "팔각"], ja: ["淡水ガニ", "紹興酒", "醤油", "生姜", "砂糖", "八角"], en: ["Freshwater crab", "Shaoxing wine", "Soy sauce", "Ginger", "Sugar", "Star anise"] },
            similarityPercent: 88,
            matchReason: { ko: "'생게를 간장 베이스에 장기 숙성시켜 날것으로 즐긴다'는 핵심이 거의 같아요. 소흥주를 추가해 향을 올리는 차이 정도이며, 역사적으로는 조선시대 게장의 원형으로 여겨져요.", ja: "『生蟹を醤油ベースで長期熟成させて生のまま味わう』核心がほぼ同じ。紹興酒を加えて香りを乗せる違い程度で、歴史的には朝鮮時代のケジャンの原型とされます。", en: "Near-identical core: live crab cured for days in a soy-based marinade and eaten raw. Shaoxing wine adds aromatic depth; historically it's regarded as the direct prototype for Joseon-era gejang." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "yeosu-gul-yori",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/yeosu-gul-yori.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
        name: { ko: "굴요리", ja: "の牡蠣料理", en: "Oyster Dishes" },
        region: "yeosu",
        tasteProfile: { sweet: 15, salty: 60, spicy: 20, umami: 85, sour: 10 },
        storyDescription: {
          ko: "가막만에서 자란 통통한 굴을 구이·전·국으로 즐기는 겨울철 별미. 한 입 물면 바닷물 머금은 크리미한 풍미가 혀에 확 번져요.",
          ja: "加莫湾で育った肉厚の牡蠣を焼き・チヂミ・スープで楽しむ冬の味覚。口に入れると、海水をたっぷり含んだクリーミーな風味が広がります。",
          en: "Plump oysters from Gamak Bay turned into grilled oysters, oyster pancakes, and briny oyster stew — a winter treat. One bite releases a creamy sea-salt wave on the tongue."
        },
        ingredients: {
          ko: ["굴", "밀가루", "달걀", "부추", "쪽파", "고춧가루", "참기름"],
          ja: ["牡蠣", "小麦粉", "卵", "ニラ", "小ねぎ", "粉唐辛子", "ごま油"],
          en: ["Oysters", "Flour", "Egg", "Garlic chives", "Scallion", "Korean chili powder", "Sesame oil"]
        },
        tags: ["굴", "해산물", "바다"],
        dupes: {
          JP: [
        {
            name: { ko: "카키나베", ja: "牡蠣鍋", en: "Kaki Nabe" },
            tasteProfile: { sweet: 10, salty: 60, spicy: 5, umami: 85, sour: 5 },
            description: { ko: "히로시마·미야기 지역에서 싱싱한 굴과 배추·버섯·두부를 미소·다시 국물에 끓이는 일본의 겨울철 대표 굴 전골.", ja: "広島や宮城の冬の味覚。新鮮な牡蠣と白菜・きのこ・豆腐を味噌と出汁で煮込む日本代表の牡蠣鍋。", en: "A Hiroshima and Miyagi winter classic: fresh oysters simmered with cabbage, mushrooms, and tofu in a miso-dashi broth." },
            ingredients: { ko: ["굴", "배추", "표고", "두부", "미소", "다시마"], ja: ["牡蠣", "白菜", "椎茸", "豆腐", "味噌", "昆布"], en: ["Oysters", "Napa cabbage", "Shiitake", "Tofu", "Miso", "Kombu"] },
            similarityPercent: 80,
            matchReason: { ko: "굴을 발효 장(된장·미소) 국물에 채소와 함께 끓여 겨울 보양식으로 내는 동아시아 방식이 쌍둥이예요. 굴국밥·어리굴젓 문화와 직결.", ja: "牡蠣を発酵調味料(味噌)の汁に野菜と一緒に煮込み、冬の滋養食として出す東アジアの方式が双子。カキ国밥やオリグルジョッの食文化と直結します。", en: "Same East Asian blueprint: oysters stewed with vegetables in a fermented-miso broth as winter comfort. Direct kin to Korean oyster-rice soup and aged oyster pickle culture." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [],
        },
        isLocalSpecialty: false,
      }
    ]
  },
  {
    code: "andong",
    name: { ko: "안동", ja: "안동", en: "안동" },
    icon: "🏯",
    image: "/images/village/andong.jpg",
    description: {
      ko: "양반 문화와 제사 음식의 고장 안동",
      ja: "양반 문화와 제사 음식의 고장 안동",
      en: "양반 문화와 제사 음식의 고장 안동"
    },
    foods: [
      {
        id: "andong-heot-jesabap",
        image: "",
        name: { ko: "헛제사밥", ja: "ホッチェサパプ（もどき祭祀膳）", en: "Heot Jesabap (Mock Ancestral Rite Meal)" },
        region: "andong",
        tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 65, sour: 10 },
        storyDescription: {
          ko: "제사 지내지 않은 평일에도 제사상 음식을 맛보고 싶었던 안동 양반가의 장난스러운 발상에서 비롯된 한 상. 고소한 나물·전·탕국이 정갈하게 차려져요.",
          ja: "祭祀(チェサ)のない日でも先祖供物の味を楽しみたいという安東の両班(ヤンバン)の茶目っ気から生まれた定食。香ばしいナムル・チヂミ・タングク(汁もの)が整然と並びます。",
          en: "Andong's Confucian gentry had a cheeky idea: even on non-rite days, let's eat the ancestral offering menu. The result is a neat tray of pristine vegetable banchan, savory pancakes, and a clear broth."
        },
        ingredients: {
          ko: ["밥", "도라지", "고사리", "시금치", "탕국", "산적", "부침개"],
          ja: ["ご飯", "桔梗の根", "ワラビ", "ほうれん草", "タングク(汁物)", "串焼き", "チヂミ"],
          en: ["Rice", "Bellflower root", "Bracken fern", "Spinach", "Clear soup", "Skewered meat", "Pancake"]
        },
        tags: ["제사", "양반", "나물"],
        dupes: {
          JP: [
        {
            name: { ko: "쇼진 료리 (精進料理)", ja: "精進料理", en: "Shōjin Ryōri (Buddhist Monastic Cuisine)" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 65, sour: 10 },
            description: { ko: "일본 선불교에서 내려온 채식 정찬. 두부·뿌리채소·제철 산채를 다섯 가지 조리법·색·맛으로 정갈하게 담아내며, 공양의 정신을 담아요.", ja: "日本の禅宗から伝わる精進料理。豆腐・根菜・季節の山菜を『五法・五色・五味』に従って整然と盛り付け、供養の精神を表現します。", en: "A Zen-Buddhist monastic meal: tofu, roots, and seasonal wild greens arranged by the 'five methods, five colors, five flavors' rubric — offering cuisine elevated to ritual." },
            ingredients: { ko: ["두부", "우엉", "표고", "뿌리채소", "유바", "제철 나물"], ja: ["豆腐", "ごぼう", "椎茸", "根菜", "湯葉", "季節の山菜"], en: ["Tofu", "Burdock", "Shiitake", "Root vegetables", "Yuba", "Seasonal greens"] },
            similarityPercent: 86,
            matchReason: { ko: "'제사·공양이라는 의례 맥락에서 태어난 정갈한 채식 한 상'이라는 정체성이 거의 같아요. 불교(일본)와 유교(한국)의 의례 배경만 다를 뿐, '생선·고기 없이 맑게'라는 원칙이 일치해요.", ja: "『祭祀や供養という儀礼から生まれた整然とした精進膳』というアイデンティティがほぼ同じ。仏教(日本)か儒教(韓国)かの宗教的背景が違うだけで、『魚肉なしで清らかに』という原則が一致します。", en: "Same identity — a reverent vegetarian tray born from ritual offerings. The religious frame (Zen Buddhism vs. Confucian ancestral rites) differs, but both hold to 'no fish or meat; keep it pure.'" }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "지 차이 (祭菜, 중국 제사 음식)", ja: "ジーツァイ", en: "Jì Cài (Chinese Ancestral Offering Meal)" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 10, umami: 70, sour: 10 },
            description: { ko: "청명·추절에 조상 제사상에 올리는 중국 전통 제례 음식. 쌀밥·나물볶음·삼겹살찜·생선찜·채소국을 격식 있는 그릇에 정갈히 올려요.", ja: "清明節や中元節に祖先祭壇に供える中国伝統の祭礼料理。白米・野菜炒め・豚の角煮・蒸し魚・野菜スープを格式ある器に整然と並べます。", en: "A traditional Chinese ritual menu for Qingming and Zhongyuan festivals: white rice, stir-fried vegetables, braised pork belly, steamed fish, and vegetable broth arranged on ceremonial ware." },
            ingredients: { ko: ["쌀밥", "나물", "삼겹살", "생선", "달걀", "채소국"], ja: ["白米", "野菜", "豚バラ", "魚", "卵", "野菜スープ"], en: ["White rice", "Vegetables", "Pork belly", "Fish", "Egg", "Vegetable soup"] },
            similarityPercent: 80,
            matchReason: { ko: "유교 문화권의 조상 제례상이라는 뿌리를 공유해요. 안동 헛제사밥은 '격식을 따르되 실제 제사를 치르지 않는' 변형이지만, 상차림 원칙과 재료 구성은 중국 제례와 직접 닿아요.", ja: "儒教文化圏の祖先祭祀膳という根を共有します。安東ホッチェサパプは『格式を守りつつ実際の祭祀は行わない』変奏ですが、膳の原則と素材構成は中国祭祀膳と直結します。", en: "Both descend from Confucian ancestor-offering trays. Andong's heot jesabap is a 'honor the form without performing the rite' twist, but the layout grammar and ingredient list run directly parallel to Chinese jì cài." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "andong-gan-godeungeo",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/andong-gan-godeungeo.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-디엔에이스튜디오",
        name: { ko: "간고등어", ja: "の塩サバ（カンコドゥンオ）", en: "Gan-Godeungeo (Salt-Cured Mackerel)" },
        region: "andong",
        tasteProfile: { sweet: 5, salty: 75, spicy: 10, umami: 80, sour: 10 },
        storyDescription: {
          ko: "동해에서 잡힌 고등어가 내륙 안동까지 실려 오는 동안 상하지 않도록 장인들이 왕소금을 쳐서 숙성시킨 보존식. 쫀쫀한 살과 짭쪼름한 기름이 흰밥과 환상 궁합이에요.",
          ja: "東海で獲れた鯖が内陸の安東まで運ばれる間に傷まないよう、職人が粗塩をまぶして熟成させた保存食。ぎゅっと締まった身と塩気のある脂が、白ご飯と黄金コンビです。",
          en: "A preservation craft: mackerel caught in the East Sea had to survive the journey to inland Andong, so master salters rubbed them with coarse sea salt to age. The firm flesh and briny oil make pure magic with hot rice."
        },
        ingredients: {
          ko: ["고등어", "천일염", "무", "대파", "고춧가루"],
          ja: ["鯖", "天日塩", "大根", "長ねぎ", "粉唐辛子"],
          en: ["Mackerel", "Sea salt", "Daikon", "Scallion", "Korean chili powder"]
        },
        tags: ["고등어", "염장", "구이"],
        dupes: {
          JP: [
        {
            name: { ko: "시메사바 (しめ鯖, 초절임 고등어)", ja: "しめ鯖", en: "Shime Saba" },
            tasteProfile: { sweet: 5, salty: 70, spicy: 5, umami: 80, sour: 45 },
            description: { ko: "신선한 고등어를 소금으로 절인 뒤 식초에 담가 살을 단단하게 숙성시키는 일본의 고등어 보존·식탁 요리. 에도 시대 내륙 운송을 위해 발달.", ja: "新鮮な鯖を塩で締めた後、酢に漬け込んで身を引き締める日本の鯖の保存兼食卓料理。江戸時代に内陸輸送のために発達しました。", en: "A Japanese mackerel cure: fresh saba pressed in salt, then marinated in rice vinegar to firm the flesh. Developed in the Edo era precisely to move fish inland." },
            ingredients: { ko: ["고등어", "소금", "쌀식초", "미림", "다시마"], ja: ["鯖", "塩", "米酢", "みりん", "昆布"], en: ["Mackerel", "Salt", "Rice vinegar", "Mirin", "Kombu"] },
            similarityPercent: 88,
            matchReason: { ko: "'내륙에서 신선한 고등어를 먹기 위한 염장 보존 기술'이라는 배경과 기법이 거의 일치해요. 소금 염장 뒤 식초를 추가하느냐(일본), 염장 자체로 완성하느냐(한국)의 차이.", ja: "『内陸で鮮度を保って鯖を食べるための塩蔵保存技術』という背景と技法がほぼ一致。塩蔵の後に酢を加えるか(日本)、塩蔵だけで完成させるか(韓国)の違い。", en: "Identical origin story — salting mackerel to get it inland alive with flavor. The fork is whether vinegar enters after the salt cure (Japan) or the salt alone finishes the job (Korea)." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "셴위 (鹹魚, 중국 염장 생선)", ja: "シェンユー", en: "Xián Yú (Chinese Salted Fish)" },
            tasteProfile: { sweet: 5, salty: 85, spicy: 5, umami: 85, sour: 5 },
            description: { ko: "광동·푸젠 해안에서 생선을 굵은 소금에 절여 햇볕에 말린 뒤 찜·볶음 요리의 조미 재료로 쓰는 중국 남부의 전통 염장 생선.", ja: "広東や福建の沿岸で、魚を粗塩で漬け天日で干して、蒸し物や炒め物の調味素材に使う中国南部の伝統塩蔵魚。", en: "A Southern Chinese preservation: fish (often mackerel or snapper) rubbed with coarse salt and sun-dried, then used to season stir-fries and steamed dishes." },
            ingredients: { ko: ["고등어/도미", "굵은 소금", "쌀식초", "생강", "대파"], ja: ["鯖/鯛", "粗塩", "米酢", "生姜", "長ねぎ"], en: ["Mackerel/Snapper", "Coarse salt", "Rice vinegar", "Ginger", "Scallion"] },
            similarityPercent: 80,
            matchReason: { ko: "'소금으로 생선을 장기 보존한 뒤 밥 반찬으로 쓰는' 동아시아 해안 문화권의 공통 문법. 광동 셴위의 방식이 중국에서 한반도 동해안으로 전파된 흐름과 맞닿아요.", ja: "『塩で魚を長期保存してご飯のおかずにする』東アジア沿岸文化圏の共通文法。広東シェンユーの方式が中国から朝鮮東海岸へ伝播した流れと重なります。", en: "Both belong to the East Asian coastal grammar of 'salt-cure a fish for long storage and serve it with rice.' The Cantonese xián yú tradition aligns with the wave that reached the Korean east coast." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "andong-guksi",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/andong-guksi.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
        name: { ko: "국시", ja: "クッシ（大豆粉入り手打ち麺）", en: "Guksi (Bean-Flour Hand-Cut Noodles)" },
        region: "andong",
        tasteProfile: { sweet: 15, salty: 50, spicy: 25, umami: 70, sour: 10 },
        storyDescription: {
          ko: "밀가루에 콩가루를 섞어 얇게 밀어낸 안동식 칼국수(건진국수). 멸치·다시마 육수에 애호박과 들기름을 올려 간이 슴슴하고 고소한 여름 별미예요.",
          ja: "小麦粉に大豆粉(コンカル)を混ぜ、薄く伸ばして切る安東式カルグクス(ゴンジンククス)。煮干しと昆布の出汁にズッキーニとえごま油を添え、あっさり香ばしい夏の味覚です。",
          en: "Andong's hand-cut 'pulled' noodle: wheat flour blended with soybean flour, rolled thin, and lifted from boiling water into a gentle anchovy-kelp broth with zucchini and a drizzle of perilla oil."
        },
        ingredients: {
          ko: ["밀가루", "콩가루", "멸치 육수", "애호박", "김", "들기름"],
          ja: ["小麦粉", "大豆粉", "煮干し出汁", "ズッキーニ", "海苔", "えごま油"],
          en: ["Flour", "Soybean flour", "Anchovy broth", "Zucchini", "Seaweed", "Perilla oil"]
        },
        tags: ["국수", "콩가루", "향토"],
        dupes: {
          JP: [
        {
            name: { ko: "자루 우동 (ざるうどん, 냉우동)", ja: "ざるうどん", en: "Zaru Udon" },
            tasteProfile: { sweet: 5, salty: 55, spicy: 5, umami: 70, sour: 10 },
            description: { ko: "삶아 찬물에 헹군 우동을 대나무 소쿠리에 얹어 가쓰오·다시마 츠유에 찍어 먹는 일본 여름 면요리. 간을 슴슴하게 유지하는 방식.", ja: "茹でて冷水でしめたうどんを竹ざるに盛り、かつおと昆布のつゆに浸けて食べる日本の夏の麺料理。あっさりと淡白な味付けが特徴。", en: "Japanese summer noodle dish: udon boiled, shocked cold, piled on a bamboo zaru, and dipped into a dashi-soy tsuyu — a deliberately gentle-flavored preparation." },
            ingredients: { ko: ["우동 면", "가쓰오", "다시마", "간장", "파", "와사비"], ja: ["うどん", "かつお", "昆布", "醤油", "ねぎ", "わさび"], en: ["Udon", "Bonito flakes", "Kombu", "Soy sauce", "Scallion", "Wasabi"] },
            similarityPercent: 78,
            matchReason: { ko: "'삶아 건진 면+맑은 육수+슴슴한 간'이라는 공식이 같아요. 안동국시의 '건진국수'라는 별명 자체가 면을 건져 육수에 말아 내는 방식이라 일본 냉면 계보와 직결.", ja: "『茹でて引き上げた麺+澄んだ出汁+淡白な味付け』という公式が同じ。安東クッシの別名『ゴンジンククス(引き上げ麺)』は、麺を湯から上げて出汁に入れる方式で日本の冷麺系譜と直結。", en: "Shared formula: noodles lifted from the water, a clear broth, restrained seasoning. Andong guksi's other name — 'geonjin guksu' meaning 'lifted-out noodle' — links directly to the Japanese cold-noodle lineage." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "쯔젠 미엔 (手擀面, 손으로 민 면)", ja: "ショウ・ガン・ミエン", en: "Shǒu Gǎn Miàn (Hand-Rolled Noodle)" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 70, sour: 10 },
            description: { ko: "중국 산동·산시 지방에서 밀가루 반죽을 손으로 얇게 밀어 가늘게 썬 뒤 닭·돼지 육수나 볶음 양념에 넣어 먹는 북방식 손국수.", ja: "中国の山東・山西地方で、小麦粉生地を手で薄く伸ばし細く切って、鶏や豚の出汁、または炒め調味料に入れて食べる北方の手打ち麺。", en: "A Northern Chinese hand-rolled noodle from Shandong and Shanxi: dough rolled thin by hand, cut into thin strands, then served in chicken or pork broth or tossed with sauce." },
            ingredients: { ko: ["밀가루", "소금", "물", "닭 육수", "파", "고추기름"], ja: ["小麦粉", "塩", "水", "鶏出汁", "ねぎ", "ラー油"], en: ["Wheat flour", "Salt", "Water", "Chicken broth", "Scallion", "Chili oil"] },
            similarityPercent: 80,
            matchReason: { ko: "'밀가루 반죽을 얇게 밀어 칼로 썰고 육수에 끓여 낸다'는 손칼국수의 원형이 산동 수건면에서 한반도로 전해졌다는 설과 직결돼요.", ja: "『小麦粉生地を薄く伸ばして刃で切り、出汁で煮る』手打ち麺の原型が、山東手擀面から朝鮮半島に伝わったという説と直結。", en: "The very archetype of 'roll wheat dough thin, cut by knife, cook in broth' — widely held to have reached Korea from Shandong, making this a direct ancestor tie." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
      {
        id: "andong-sikhye",
        image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/andong-sikhye.jpg",
        imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
        name: { ko: "안동식혜", ja: "シッケ（赤い発酵米飲料）", en: "Sikhye (Spicy Red Rice Punch)" },
        region: "andong",
        tasteProfile: { sweet: 65, salty: 15, spicy: 40, umami: 20, sour: 30 },
        storyDescription: {
          ko: "일반 식혜와 다르게 고춧가루·생강·무를 넣고 발효시키는 안동의 붉은 식혜. 매콤하면서도 달고 시원해 명절과 제사 뒤 입가심으로 오래 사랑받아 왔어요.",
          ja: "一般的なシッケとは違い、粉唐辛子・生姜・大根を加えて発酵させる安東の赤いシッケ。ピリッとしながらも甘くて爽やかで、祝祭や祭祀の後の口直しとして長く愛されてきました。",
          en: "Unlike standard sweet sikhye, Andong's red version ferments with chili powder, ginger, and radish. Warmly spicy yet sweet and refreshing, it has long served as the palate-reset drink after holiday feasts and ancestral rites."
        },
        ingredients: {
          ko: ["찹쌀", "엿기름", "무", "생강", "고춧가루", "설탕"],
          ja: ["もち米", "麦芽(ヨッキルム)", "大根", "生姜", "粉唐辛子", "砂糖"],
          en: ["Glutinous rice", "Malted barley", "Daikon", "Ginger", "Korean chili powder", "Sugar"]
        },
        tags: ["식혜", "발효", "디저트"],
        dupes: {
          JP: [
        {
            name: { ko: "아마자케 (甘酒, 일본식 발효 쌀 음료)", ja: "甘酒", en: "Amazake" },
            tasteProfile: { sweet: 70, salty: 10, spicy: 5, umami: 30, sour: 10 },
            description: { ko: "찐 쌀에 코지(쌀누룩)를 섞어 6~12시간 발효시켜 만드는 일본의 달콤한 발효 쌀 음료. 무알콜 버전이 주를 이루며 신사 축제에서 따뜻하게 나눠 마셔요.", ja: "蒸したご飯に麹を混ぜて6〜12時間発酵させる日本の甘い発酵米飲料。ノンアルコール版が主流で、神社の祭りで温かく振る舞われます。", en: "A Japanese sweet fermented rice drink: cooked rice inoculated with kōji and fermented 6–12 hours into a creamy, caramel-scented liquid. Mostly non-alcoholic, served warm at shrine festivals." },
            ingredients: { ko: ["찐 쌀", "쌀누룩", "물", "생강(선택)"], ja: ["蒸し米", "米麹", "水", "生姜(任意)"], en: ["Steamed rice", "Kōji starter", "Water", "Ginger (optional)"] },
            similarityPercent: 85,
            matchReason: { ko: "엿기름/누룩(쌀 코지)으로 쌀의 당화를 유도해 단맛을 내는 무알코올 발효 쌀 음료라는 구조가 거의 같아요. 안동식혜는 고춧가루·무로 매운 반전, 아마자케는 생강으로 잔잔한 매콤함을 넣어요.", ja: "麦芽や麹で米の糖化を誘導して甘味を引き出すノンアルコール発酵米飲料という構造がほぼ同じ。安東シッケは粉唐辛子と大根で辛さを、甘酒は生姜で穏やかなピリッと感を加えます。", en: "Near-identical structure: barley malt or kōji drives rice saccharification for a non-alcoholic sweet ferment. Andong sikhye adds chili and radish for a fiery twist; amazake reaches for ginger for a gentler warmth." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
          CN: [
        {
            name: { ko: "라오 짜오 (醪糟, 중국식 발효 쌀 음료)", ja: "ラオザオ", en: "Láo Zāo" },
            tasteProfile: { sweet: 65, salty: 5, spicy: 5, umami: 25, sour: 35 },
            description: { ko: "중국 북부·쓰촨 지방에서 찹쌀을 누룩(주취)으로 발효시켜 만든 달짝지근한 발효 쌀 음료. 따뜻하게 데워 디저트로 먹거나 계란을 넣어 달걀 술로 즐겨요.", ja: "中国北部や四川地方でもち米を麹(酒麹)で発酵させた甘い発酵米飲料。温めてデザートにしたり、卵を入れて甘酒として楽しみます。", en: "A northern Chinese and Sichuan fermented rice drink: glutinous rice cultured with jiuqu starter into a sweet, wine-scented liquid, served warm as dessert or with a poached egg." },
            ingredients: { ko: ["찹쌀", "누룩", "물", "설탕", "계란(선택)"], ja: ["もち米", "酒麹", "水", "砂糖", "卵(任意)"], en: ["Glutinous rice", "Jiuqu starter", "Water", "Sugar", "Egg (optional)"] },
            similarityPercent: 82,
            matchReason: { ko: "'찹쌀을 발효시켜 만든 달짝지근한 알코올성 쌀 음료'라는 원형이 같아요. 식혜는 엿기름 효소 발효(무알콜), 라오짜오는 누룩 알코올 발효라는 미생물학적 차이가 있을 뿐.", ja: "『もち米を発酵させて作る甘くアルコール性のある米飲料』という原型が同じ。シッケは麦芽酵素の発酵(ノンアルコール)、ラオザオは酒麹のアルコール発酵という微生物学の違いだけ。", en: "Both descend from the 'fermented glutinous rice sweet drink' archetype. Sikhye uses barley-malt enzyme fermentation (non-alcoholic); láo zāo uses jiuqu alcoholic fermentation — a microbiological split." }
          ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
        },
        isLocalSpecialty: false,
      },
          {
              id: "andong-andong-jjimdak",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/andong-andong-jjimdak.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-IR 스튜디오",
              name: { ko: "찜닭", ja: "アンドンチムタッ", en: "Jjimdak (Braised Chicken)" },
              region: "andong",
              tasteProfile: { sweet: 40, salty: 55, spicy: 40, umami: 75, sour: 5 },
              storyDescription: {
                ko: "닭고기를 감자·당근·당면과 함께 간장·설탕 양념에 뭉근히 조려낸 달콤 짭짤 매콤한 한 냄비 요리예요. 당면에 흠뻑 밴 달짝지근한 국물이 밥도둑이에요.",
                ja: "鶏肉をジャガイモ・人参・春雨と共に醤油・砂糖のタレでじっくり煮込んだ甘じょっぱくピリ辛の一鍋料理です。春雨に染み込んだ甘いタレがご飯泥棒です。",
                en: "Chicken braised with potatoes, carrots and glass noodles in a sweet-salty-spicy soy glaze — one pot of comfort. The sauce-soaked noodles are an unstoppable rice thief."
              },
              ingredients: { ko: ["닭고기", "감자", "당근", "당면", "간장", "설탕", "건고추", "마늘"], ja: ["鶏肉", "ジャガイモ", "人参", "春雨", "醤油", "砂糖", "唐辛子", "ニンニク"], en: ["Chicken", "Potato", "Carrot", "Glass noodles", "Soy sauce", "Sugar", "Dried chili", "Garlic"] },
              tags: ["찜닭", "당면", "한냄비"],
              dupes: {
                JP: [
        { name: { ko: "치킨 도데리야키 나베", ja: "鶏照り焼き鍋", en: "Chicken Teriyaki Nabe" }, tasteProfile: { sweet: 40, salty: 55, spicy: 10, umami: 75, sour: 5 }, description: { ko: "닭고기를 달콤 짭짤한 간장 양념에 채소와 함께 조린 일본식 조림", ja: "鶏肉を甘辛い醤油タレで野菜と共に煮込んだ日本式の煮物", en: "Japanese chicken simmered in sweet-savory teriyaki sauce with vegetables" }, ingredients: { ko: ["닭고기", "간장", "미림", "감자", "당근", "설탕"], ja: ["鶏肉", "醤油", "みりん", "ジャガイモ", "人参", "砂糖"], en: ["Chicken", "Soy sauce", "Mirin", "Potato", "Carrot", "Sugar"] }, similarityPercent: 78, matchReason: { ko: "닭고기를 달콤 짭짤한 간장 양념에 조리는 거의 동일한 방식", ja: "鶏肉を甘辛い醤油タレで煮込むほぼ同じ方式", en: "Sweet-savory braised chicken — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "산베이지", ja: "三杯鶏", en: "San Bei Ji" }, tasteProfile: { sweet: 35, salty: 55, spicy: 15, umami: 75, sour: 5 }, description: { ko: "닭고기를 간장·참기름·미주로 볶아낸 대만식 '삼배계'", ja: "鶏肉を醤油・ごま油・米酒で炒めた台湾式「三杯鶏」", en: "Taiwanese three-cup chicken with soy, sesame oil and rice wine" }, ingredients: { ko: ["닭고기", "간장", "참기름", "미주", "바질", "생강"], ja: ["鶏肉", "醤油", "ごま油", "米酒", "バジル", "生姜"], en: ["Chicken", "Soy sauce", "Sesame oil", "Rice wine", "Basil", "Ginger"] }, similarityPercent: 80, matchReason: { ko: "닭고기를 간장 기반 달콤 짭짤 양념에 조리는 유사 전통", ja: "鶏肉を醤油ベースの甘辛タレで煮込む類似伝統", en: "Soy-glazed braised chicken — close Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
    ]
  },
  {
    code: "national",
    name: { ko: "전국 (한국 전통)", ja: "全国（韓国伝統）", en: "Nationwide (Korean Traditional)" },
    icon: "🇰🇷",
    image: "/images/village/national.jpg",
    description: {
      ko: "특정 지역에 국한되지 않은, 한국 전역에서 사랑받는 한식.",
      ja: "特定の地域に限定されない、韓国全域で愛される韓食。",
      en: "Korean dishes loved nationwide, not tied to a specific region."
    },
    foods: [      {
              id: "national-japchae",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/national-japchae.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
              name: { ko: "잡채", ja: "チャプチェ", en: "Japchae" },
              region: "national",
              tasteProfile: { sweet: 35, salty: 50, spicy: 10, umami: 65, sour: 5 },
              storyDescription: {
                ko: "투명한 당면과 알록달록한 채소, 부드러운 소고기를 참기름과 간장으로 볶아낸 전주의 잔칫날 대표 요리예요. 쫄깃한 당면 한 젓가락에 여러 재료의 맛이 한꺼번에 밀려오는 화려한 합주예요.",
                ja: "透き通った春雨とカラフルな野菜、柔らかい牛肉をごま油と醤油で炒めた全州のお祝い料理です。もちもちの春雨を一口頬張ると、いろんな具材の味が一度に押し寄せる華やかな合奏です。",
                en: "Translucent glass noodles tossed with colorful vegetables and tender beef in sesame oil and soy sauce — Jeonju's centerpiece for celebrations. One chewy chopstickful brings a chorus of flavors all at once."
              },
              ingredients: { ko: ["당면", "소고기", "시금치", "당근", "표고버섯", "양파", "간장", "참기름"], ja: ["春雨", "牛肉", "ほうれん草", "人参", "椎茸", "玉ねぎ", "醤油", "ごま油"], en: ["Glass noodles", "Beef", "Spinach", "Carrot", "Shiitake", "Onion", "Soy sauce", "Sesame oil"] },
              tags: ["당면", "잔치", "볶음"],
              dupes: {
                JP: [
                  {
                    name: {
                      ko: "야키비훈",
                      ja: "焼きビーフン",
                      en: "Yaki Bifun"
                    },
                    tasteProfile: {
                      sweet: 25,
                      salty: 55,
                      spicy: 5,
                      umami: 75,
                      sour: 5
                    },
                    ingredients: {
                      ko: [
                        "쌀국수(비훈)",
                        "돼지고기",
                        "양배추",
                        "당근",
                        "양파",
                        "표고버섯",
                        "간장",
                        "참기름"
                      ],
                      ja: [
                        "ビーフン",
                        "豚肉",
                        "キャベツ",
                        "人参",
                        "玉ねぎ",
                        "椎茸",
                        "醤油",
                        "ごま油"
                      ],
                      en: [
                        "Rice vermicelli",
                        "Pork",
                        "Cabbage",
                        "Carrot",
                        "Onion",
                        "Shiitake",
                        "Soy sauce",
                        "Sesame oil"
                      ]
                    },
                    similarityPercent: 72,
                    strengths: {
                      ko: [
                        "면+채소+고기를 함께 볶아 간장 양념으로 마무리",
                        "참기름·간장 베이스 동일",
                        "한 접시 균형 잡힌 구성"
                      ],
                      ja: [
                        "麺+野菜+肉を一緒に炒めて醤油で仕上げる",
                        "ごま油・醤油ベースが同じ",
                        "一皿で栄養バランス良し"
                      ],
                      en: [
                        "Noodles + vegetables + meat stir-fried together with soy seasoning",
                        "Same sesame-oil and soy base",
                        "Balanced one-plate composition"
                      ]
                    },
                    limitations: {
                      ko: [
                        "쌀 면 vs 당면 — 식감 차이 (찰진 vs 매끈)",
                        "단맛이 약함"
                      ],
                      ja: [
                        "米麺 vs 春雨 — 食感の違い (もちもち vs つるつる)",
                        "甘みが弱い"
                      ],
                      en: [
                        "Rice vermicelli vs sweet potato glass noodle — chewy vs slippery",
                        "Less sweetness"
                      ]
                    },
                    tip: {
                      ko: "당면을 찾을 수 없을 때 야키비훈을 만들고 마지막에 설탕 한 꼬집 추가하면 잡채 느낌",
                      ja: "春雨が手に入らない時は焼きビーフンに最後に砂糖少々を加えるとチャプチェ風",
                      en: "If you can't find Korean glass noodles, finish yaki bifun with a pinch of sugar to mimic japchae"
                    },
                    description: {
                      ko: "쌀국수와 채소·고기를 간장으로 볶은 일본식 볶음국수",
                      ja: "ビーフンと野菜・肉を醤油で炒める日本式焼き麺",
                      en: "Japanese stir-fried rice vermicelli with vegetables and meat in soy seasoning"
                    },
                    matchReason: {
                      ko: "면+채소+고기 볶음에 간장·참기름 베이스가 거의 동일",
                      ja: "麺+野菜+肉炒めに醤油・ごま油ベースがほぼ同じ",
                      en: "Stir-fried noodles + veg + meat with soy and sesame oil — close cousin"
                    }
                  }
                ],
                CN: [
                  {
                    name: {
                      ko: "차오미펀",
                      ja: "炒米粉",
                      en: "Chao Mi Fen"
                    },
                    tasteProfile: {
                      sweet: 15,
                      salty: 60,
                      spicy: 10,
                      umami: 75,
                      sour: 5
                    },
                    ingredients: {
                      ko: [
                        "쌀국수",
                        "돼지고기 채",
                        "부추",
                        "숙주",
                        "당근",
                        "간장",
                        "굴소스"
                      ],
                      ja: [
                        "米粉",
                        "豚肉細切り",
                        "ニラ",
                        "もやし",
                        "人参",
                        "醤油",
                        "オイスターソース"
                      ],
                      en: [
                        "Rice noodles",
                        "Pork strips",
                        "Garlic chives",
                        "Bean sprouts",
                        "Carrot",
                        "Soy sauce",
                        "Oyster sauce"
                      ]
                    },
                    similarityPercent: 70,
                    strengths: {
                      ko: [
                        "면을 채소·고기와 함께 볶는 동일 기법",
                        "간장 베이스 양념"
                      ],
                      ja: [
                        "麺を野菜・肉と一緒に炒める同じ技法",
                        "醤油ベースの味付け"
                      ],
                      en: [
                        "Stir-frying noodles with vegetables and meat — same technique",
                        "Soy-based seasoning"
                      ]
                    },
                    limitations: {
                      ko: [
                        "굴소스 풍미가 더 진함",
                        "참기름 향이 적음"
                      ],
                      ja: [
                        "オイスターソースの風味がより濃い",
                        "ごま油の香りが少ない"
                      ],
                      en: [
                        "Oyster sauce gives a deeper flavor",
                        "Less sesame aroma"
                      ]
                    },
                    description: {
                      ko: "쌀국수를 채소·고기와 굴소스로 볶은 중국 볶음면",
                      ja: "米粉を野菜・肉とオイスターソースで炒める中国炒め麺",
                      en: "Chinese stir-fried rice noodles with vegetables, meat, and oyster sauce"
                    },
                    matchReason: {
                      ko: "면+채소+고기 볶음의 가장 직접적인 중국 친척",
                      ja: "麺+野菜+肉炒めの最も直接的な中国の親戚",
                      en: "Most direct Chinese cousin to noodle-veg-meat stir-fry"
                    }
                  }
                ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-sundubu",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/national-sundubu.jpeg",
              imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
              name: { ko: "순두부찌개", ja: "スンドゥブチゲ", en: "Sundubu Jjigae" },
              region: "national",
              tasteProfile: { sweet: 10, salty: 55, spicy: 65, umami: 75, sour: 5 },
              storyDescription: {
                ko: "보드라운 순두부에 조갯살과 달걀을 풀어 매콤한 육수에 보글보글 끓여낸 뚝배기 요리예요. 뜨거운 뚝배기에서 바로 퍼먹는 한 숟갈은 추운 전주의 겨울을 녹이는 따스한 포옹이에요.",
                ja: "絹ごし豆腐にアサリと卵を溶き入れ、ピリ辛のスープでぐつぐつと煮込んだ土鍋料理です。熱々の土鍋から直接すくう一さじは、寒い全州の冬を溶かす温かい抱擁です。",
                en: "Silken tofu simmered with clams and egg in a fiery broth, bubbling in an earthenware pot. A spoonful straight from the scalding ttukbaegi is a warm embrace that melts Jeonju's winter chill."
              },
              ingredients: { ko: ["순두부", "조개", "달걀", "돼지고기", "고춧가루", "대파", "마늘", "참기름"], ja: ["絹ごし豆腐", "アサリ", "卵", "豚肉", "唐辛子粉", "長ネギ", "ニンニク", "ごま油"], en: ["Silken tofu", "Clams", "Egg", "Pork", "Chili powder", "Green onion", "Garlic", "Sesame oil"] },
              tags: ["찌개", "두부", "뚝배기"],
              dupes: {
                JP: [
                  {
                    name: {
                      ko: "마보 도후",
                      ja: "麻婆豆腐",
                      en: "Mabo Dofu"
                    },
                    tasteProfile: {
                      sweet: 10,
                      salty: 60,
                      spicy: 55,
                      umami: 80,
                      sour: 5
                    },
                    ingredients: {
                      ko: [
                        "연두부",
                        "다진 돼지고기",
                        "두반장",
                        "고추",
                        "산초",
                        "쪽파",
                        "마늘",
                        "생강"
                      ],
                      ja: [
                        "絹豆腐",
                        "豚ひき肉",
                        "豆板醤",
                        "唐辛子",
                        "山椒",
                        "ねぎ",
                        "ニンニク",
                        "生姜"
                      ],
                      en: [
                        "Silken tofu",
                        "Ground pork",
                        "Doubanjiang",
                        "Chili",
                        "Sichuan pepper",
                        "Scallion",
                        "Garlic",
                        "Ginger"
                      ]
                    },
                    similarityPercent: 70,
                    strengths: {
                      ko: [
                        "연두부+다진 고기+매운 양념의 동일 구조",
                        "걸쭉하고 뜨거운 한 그릇"
                      ],
                      ja: [
                        "絹豆腐+ひき肉+辛い味付けの同じ構造",
                        "とろみのある熱々の一品"
                      ],
                      en: [
                        "Same structure: silken tofu + ground meat + spicy sauce",
                        "Thick, piping-hot bowl"
                      ]
                    },
                    limitations: {
                      ko: [
                        "산초의 마라 풍미 — 한국식 매운맛과 결이 다름",
                        "발효 두반장 vs 고춧가루+된장"
                      ],
                      ja: [
                        "山椒の麻辣風味 — 韓国の辛さとは質が違う",
                        "発酵豆板醤 vs 唐辛子粉+味噌"
                      ],
                      en: [
                        "Sichuan pepper's mala flavor differs from Korean spicy character",
                        "Fermented doubanjiang vs Korean chili powder + doenjang"
                      ]
                    },
                    tip: {
                      ko: "산초 대신 고춧가루를 더 넣으면 순두부찌개에 가까운 인상",
                      ja: "山椒の代わりに唐辛子粉を増やすとスンドゥブチゲに近い印象",
                      en: "Skip the Sichuan pepper and add more chili flakes to lean closer to sundubu"
                    },
                    description: {
                      ko: "연두부와 다진 고기를 매운 두반장 소스로 끓인 사천 요리",
                      ja: "絹豆腐とひき肉を辛い豆板醤ソースで煮込む四川料理",
                      en: "Sichuan dish of silken tofu and ground meat braised in spicy doubanjiang"
                    },
                    matchReason: {
                      ko: "연두부+다진 고기+매운 양념의 거의 동일한 한 그릇",
                      ja: "絹豆腐+ひき肉+辛い味付けのほぼ同じ一品",
                      en: "Silken tofu + ground meat + spicy seasoning — same fundamental bowl"
                    }
                  }
                ],
                CN: [
                  {
                    name: {
                      ko: "마라더우푸",
                      ja: "麻辣豆腐",
                      en: "Mala Doufu"
                    },
                    tasteProfile: {
                      sweet: 5,
                      salty: 60,
                      spicy: 70,
                      umami: 80,
                      sour: 5
                    },
                    ingredients: {
                      ko: [
                        "연두부",
                        "다진 돼지고기",
                        "두반장",
                        "건고추",
                        "산초",
                        "쪽파"
                      ],
                      ja: [
                        "絹豆腐",
                        "豚ひき肉",
                        "豆板醤",
                        "干し唐辛子",
                        "山椒",
                        "ねぎ"
                      ],
                      en: [
                        "Silken tofu",
                        "Ground pork",
                        "Doubanjiang",
                        "Dried chili",
                        "Sichuan pepper",
                        "Scallion"
                      ]
                    },
                    similarityPercent: 72,
                    strengths: {
                      ko: [
                        "연두부에 매운 양념이 스미는 구조",
                        "뜨겁게 끓이며 마무리"
                      ],
                      ja: [
                        "絹豆腐に辛い味付けが染み込む構造",
                        "熱々で仕上げる"
                      ],
                      en: [
                        "Spicy seasoning seeps into silken tofu",
                        "Finished bubbling hot"
                      ]
                    },
                    limitations: {
                      ko: [
                        "마라 (얼얼한 매운맛) vs 한국식 칼칼한 매운맛",
                        "국물보다 소스가 진함"
                      ],
                      ja: [
                        "麻辣 (痺れる辛さ) vs 韓国式の刺激的な辛さ",
                        "スープより濃いソース"
                      ],
                      en: [
                        "Mala numbing heat vs Korean sharp chili heat",
                        "Thicker sauce, less broth"
                      ]
                    },
                    description: {
                      ko: "연두부와 다진 고기를 마라 양념으로 진하게 끓인 사천 요리",
                      ja: "絹豆腐とひき肉を麻辣の味付けで濃く煮込む四川料理",
                      en: "Sichuan silken tofu and ground meat in rich mala sauce"
                    },
                    matchReason: {
                      ko: "연두부+매운 양념+다진 고기의 사천 해석",
                      ja: "絹豆腐+辛い味付け+ひき肉の四川解釈",
                      en: "Sichuan interpretation of silken tofu, spicy seasoning, and ground meat"
                    }
                  }
                ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-pajeon",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/national-pajeon.jpeg",
              imageCredit: "ⓒ한국관광공사 포토코리아-부산관광공사",
              name: { ko: "파전", ja: "パジョン", en: "Pajeon (Green Onion Pancake)" },
              region: "national",
              tasteProfile: { sweet: 10, salty: 50, spicy: 15, umami: 60, sour: 10 },
              storyDescription: {
                ko: "굵직한 쪽파를 밀가루 반죽에 수북이 눕히고 기름에 노릇하게 부쳐낸 비 오는 날의 단짝이에요. 간장 양념에 찍어 한 입 베어 물면 쪽파의 향긋함과 반죽의 고소함이 입안 가득 퍼진답니다.",
                ja: "太い小ネギを小麦粉生地にたっぷり寝かせ、油できつね色に焼き上げた雨の日の相棒です。醤油だれに付けて一口かじれば、小ネギの香りと生地の香ばしさが口いっぱいに広がります。",
                en: "Plump scallions laid thick on wheat batter, pan-fried golden — the perfect partner for a rainy day. Dipped in soy sauce, one bite fills your mouth with the fragrance of onion and the nuttiness of crisp batter."
              },
              ingredients: { ko: ["쪽파", "밀가루", "달걀", "홍고추", "간장", "식초", "식용유"], ja: ["小ネギ", "小麦粉", "卵", "赤唐辛子", "醤油", "酢", "食用油"], en: ["Green onion", "Flour", "Egg", "Red chili", "Soy sauce", "Vinegar", "Cooking oil"] },
              tags: ["전", "쪽파", "비오는날"],
              dupes: {
                JP: [
                  {
                    name: {
                      ko: "오코노미야키",
                      ja: "お好み焼き",
                      en: "Okonomiyaki"
                    },
                    tasteProfile: {
                      sweet: 25,
                      salty: 55,
                      spicy: 5,
                      umami: 80,
                      sour: 10
                    },
                    ingredients: {
                      ko: [
                        "밀가루 반죽",
                        "양배추",
                        "돼지고기",
                        "달걀",
                        "오코노미 소스",
                        "마요네즈",
                        "가다랑어포",
                        "파래"
                      ],
                      ja: [
                        "小麦粉生地",
                        "キャベツ",
                        "豚肉",
                        "卵",
                        "お好みソース",
                        "マヨネーズ",
                        "鰹節",
                        "青のり"
                      ],
                      en: [
                        "Wheat batter",
                        "Cabbage",
                        "Pork",
                        "Egg",
                        "Okonomi sauce",
                        "Mayonnaise",
                        "Bonito flakes",
                        "Aonori"
                      ]
                    },
                    similarityPercent: 75,
                    strengths: {
                      ko: [
                        "밀가루 반죽에 채소·해산물·고기를 부쳐내는 거의 동일한 기법",
                        "한 판에 푸짐한 한 끼",
                        "같은 부침개 카테고리"
                      ],
                      ja: [
                        "小麦粉生地に野菜・魚介・肉を焼き上げるほぼ同じ技法",
                        "一枚で満足する一食",
                        "同じお好み焼きカテゴリ"
                      ],
                      en: [
                        "Wheat batter pan-fried with vegetables, seafood, or meat — same technique",
                        "One pan, one full meal",
                        "Shared griddle-pancake category"
                      ]
                    },
                    limitations: {
                      ko: [
                        "오코노미 소스+마요네즈 토핑 — 단짠+감칠맛",
                        "양배추 위주 vs 쪽파 위주"
                      ],
                      ja: [
                        "お好みソース+マヨネーズトッピング — 甘辛+旨味",
                        "キャベツ中心 vs ネギ中心"
                      ],
                      en: [
                        "Okonomi sauce + mayo topping — sweet-savory umami",
                        "Cabbage-forward vs scallion-forward"
                      ]
                    },
                    tip: {
                      ko: "쪽파를 듬뿍 넣고 소스를 빼면 파전 인상에 가까워짐",
                      ja: "ネギをたっぷり入れてソースを抜くとパジョンの印象に近づく",
                      en: "Pile on scallions and skip the sauce to lean closer to pajeon"
                    },
                    description: {
                      ko: "밀가루 반죽에 양배추와 돼지고기를 섞어 부친 일본식 부침개",
                      ja: "小麦粉生地にキャベツと豚肉を混ぜて焼く日本式お好み焼き",
                      en: "Japanese savory pancake with wheat batter, cabbage, and pork"
                    },
                    matchReason: {
                      ko: "밀가루 반죽 부침개 카테고리의 일본 사촌",
                      ja: "小麦粉生地お好み焼きカテゴリの日本の親戚",
                      en: "Japanese cousin in the wheat-batter savory pancake family"
                    }
                  }
                ],
                CN: [
                  {
                    name: {
                      ko: "총요빙",
                      ja: "葱油餅",
                      en: "Cong You Bing"
                    },
                    tasteProfile: {
                      sweet: 5,
                      salty: 55,
                      spicy: 5,
                      umami: 65,
                      sour: 5
                    },
                    ingredients: {
                      ko: [
                        "밀가루 반죽",
                        "쪽파",
                        "참기름",
                        "소금",
                        "식용유"
                      ],
                      ja: [
                        "小麦粉生地",
                        "ねぎ",
                        "ごま油",
                        "塩",
                        "サラダ油"
                      ],
                      en: [
                        "Wheat dough",
                        "Scallion",
                        "Sesame oil",
                        "Salt",
                        "Cooking oil"
                      ]
                    },
                    similarityPercent: 78,
                    strengths: {
                      ko: [
                        "쪽파를 듬뿍 — 파전 핵심 재료 동일",
                        "기름에 부쳐내는 동일 기법",
                        "참기름 향"
                      ],
                      ja: [
                        "ねぎたっぷり — パジョンの核心素材が同じ",
                        "油で焼き上げる同じ技法",
                        "ごま油の香り"
                      ],
                      en: [
                        "Generous scallion — same hero ingredient as pajeon",
                        "Pan-fried in oil — same technique",
                        "Sesame oil aroma"
                      ]
                    },
                    limitations: {
                      ko: [
                        "반죽이 더 단단함 (페이스트리 결)",
                        "달걀·해산물 미포함"
                      ],
                      ja: [
                        "生地が硬め (パイ生地のような層)",
                        "卵・魚介を含まない"
                      ],
                      en: [
                        "Firmer flaky dough (pastry-like layers)",
                        "No egg or seafood"
                      ]
                    },
                    description: {
                      ko: "쪽파를 넣은 밀가루 반죽을 기름에 바삭하게 부쳐낸 중국 빵",
                      ja: "ねぎ入りの小麦粉生地を油でカリッと焼く中国のお焼き",
                      en: "Chinese flaky pan-fried bread with scallions in wheat dough"
                    },
                    matchReason: {
                      ko: "쪽파+밀가루+기름 부침의 중국식 친척",
                      ja: "ねぎ+小麦粉+油焼きの中国式親戚",
                      en: "Chinese counterpart of scallion-wheat-pan-fried"
                    }
                  }
                ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-doenjang-jjigae",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/national-doenjang-jjigae.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
              name: { ko: "된장찌개", ja: "テンジャンチゲ", en: "Doenjang Jjigae" },
              region: "national",
              tasteProfile: { sweet: 10, salty: 65, spicy: 20, umami: 90, sour: 5 },
              storyDescription: {
                ko: "한국인의 어머니 맛이라 불리는 된장찌개는 구수한 된장에 두부, 애호박, 버섯을 한껏 담아 뚝배기에서 보글보글 끓여내요. 전주 된장 특유의 깊은 향이 집 밥의 그리움을 그대로 불러와요.",
                ja: "韓国人のお母さんの味と呼ばれるテンジャンチゲは、香ばしい味噌に豆腐・ズッキーニ・きのこをたっぷり入れて土鍋でぐつぐつ煮込みます。全州味噌特有の深い香りが家庭の味の懐かしさを呼び起こします。",
                en: "Often called 'the taste of a Korean mother,' doenjang jjigae bubbles with tofu, zucchini and mushrooms folded into nutty soybean paste. The deep aroma of Jeonju's own doenjang conjures the ache of home cooking."
              },
              ingredients: { ko: ["된장", "두부", "애호박", "감자", "양파", "표고버섯", "멸치육수", "고추"], ja: ["テンジャン", "豆腐", "ズッキーニ", "ジャガイモ", "玉ねぎ", "椎茸", "煮干しだし", "唐辛子"], en: ["Doenjang", "Tofu", "Zucchini", "Potato", "Onion", "Shiitake", "Anchovy broth", "Chili"] },
              tags: ["된장", "찌개", "집밥"],
              dupes: {
                JP: [
                  {
                    name: {
                      ko: "미소시루",
                      ja: "味噌汁",
                      en: "Miso Soup"
                    },
                    tasteProfile: {
                      sweet: 5,
                      salty: 55,
                      spicy: 0,
                      umami: 80,
                      sour: 5
                    },
                    ingredients: {
                      ko: [
                        "미소",
                        "다시",
                        "두부",
                        "미역",
                        "쪽파"
                      ],
                      ja: [
                        "味噌",
                        "だし",
                        "豆腐",
                        "わかめ",
                        "ねぎ"
                      ],
                      en: [
                        "Miso",
                        "Dashi",
                        "Tofu",
                        "Wakame",
                        "Scallion"
                      ]
                    },
                    similarityPercent: 65,
                    strengths: {
                      ko: [
                        "발효 콩 페이스트가 베이스인 동일 카테고리",
                        "두부 사용 공통",
                        "맑은 국물 위주"
                      ],
                      ja: [
                        "発酵大豆ペーストがベースの同じカテゴリ",
                        "豆腐の使用が共通",
                        "澄んだスープ中心"
                      ],
                      en: [
                        "Fermented soybean paste base — same category",
                        "Both use tofu",
                        "Clear broth focus"
                      ]
                    },
                    limitations: {
                      ko: [
                        "미소가 더 부드럽고 단맛 — 된장의 깊은 구수함과 다름",
                        "고추가 들어가지 않아 매운맛 부재",
                        "건더기가 적음"
                      ],
                      ja: [
                        "味噌がより柔らかく甘め — 味噌(韓)の深い香ばしさと違う",
                        "唐辛子が入らず辛味なし",
                        "具が少ない"
                      ],
                      en: [
                        "Miso is softer and sweeter than Korean doenjang's deep funk",
                        "No chili — none of the heat",
                        "Thinner with fewer toppings"
                      ]
                    },
                    tip: {
                      ko: "미소시루에 두반장 한 술 넣으면 된장찌개 인상에 가까워짐",
                      ja: "味噌汁に豆板醤を一さじ加えるとテンジャンチゲに近い印象",
                      en: "Stir a spoon of doubanjiang into miso soup to nudge it toward doenjang jjigae"
                    },
                    description: {
                      ko: "미소를 다시에 풀어 두부·미역을 곁들이는 일본 일상식 국",
                      ja: "味噌をだしに溶いて豆腐・わかめを添える日本の日常スープ",
                      en: "Japanese daily soup of miso dissolved in dashi with tofu and wakame"
                    },
                    matchReason: {
                      ko: "발효 콩 페이스트 국의 일본 형제 — 풍미는 더 부드러움",
                      ja: "発酵大豆ペーストスープの日本の兄弟 — 風味はより穏やか",
                      en: "Japanese sibling in the fermented-soybean soup family — gentler in flavor"
                    }
                  }
                ],
                CN: [
                  {
                    name: {
                      ko: "황두장 탕",
                      ja: "黄豆醤湯",
                      en: "Huang Dou Jiang Tang"
                    },
                    tasteProfile: {
                      sweet: 5,
                      salty: 60,
                      spicy: 5,
                      umami: 75,
                      sour: 5
                    },
                    ingredients: {
                      ko: [
                        "황두장(노란콩 장)",
                        "두부",
                        "배추",
                        "쪽파",
                        "마늘",
                        "물"
                      ],
                      ja: [
                        "黄豆醤",
                        "豆腐",
                        "白菜",
                        "ねぎ",
                        "ニンニク",
                        "水"
                      ],
                      en: [
                        "Yellow soybean paste",
                        "Tofu",
                        "Napa cabbage",
                        "Scallion",
                        "Garlic",
                        "Water"
                      ]
                    },
                    similarityPercent: 60,
                    strengths: {
                      ko: [
                        "발효 콩장 베이스의 국",
                        "두부+채소+쪽파 구성"
                      ],
                      ja: [
                        "発酵大豆ペーストベースのスープ",
                        "豆腐+野菜+ねぎ構成"
                      ],
                      en: [
                        "Fermented soybean paste base soup",
                        "Tofu + vegetable + scallion composition"
                      ]
                    },
                    limitations: {
                      ko: [
                        "맵지 않음 — 한국식 칼칼한 매운맛 부재",
                        "묵직한 발효 깊이 부족"
                      ],
                      ja: [
                        "辛くない — 韓国式の刺激的な辛さなし",
                        "重厚な発酵の深みが不足"
                      ],
                      en: [
                        "Not spicy — lacks Korean sharp chili kick",
                        "Less of the deep fermented body"
                      ]
                    },
                    description: {
                      ko: "황두장으로 끓인 중국 가정식 두부 콩장 국",
                      ja: "黄豆醤で煮込む中国家庭の豆腐と豆ジャンスープ",
                      en: "Chinese home-style yellow-bean-paste tofu soup"
                    },
                    matchReason: {
                      ko: "발효 콩 페이스트 국의 중국식 친척",
                      ja: "発酵大豆ペーストスープの中国式親戚",
                      en: "Chinese kin in the fermented-soybean soup tradition"
                    }
                  }
                ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-tteokbokki",
              name: { ko: "떡볶이", ja: "トッポッキ", en: "Tteokbokki" },
              region: "national",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/national-tteokbokki.jpeg",
              imageCredit: "ⓒ한국관광공사 포토코리아-부산관광공사",
              tasteProfile: { sweet: 40, salty: 50, spicy: 75, umami: 55, sour: 10 },
              storyDescription: {
                ko: "빨갛고 매콤한 소스가 쫄깃한 떡 위에 달라붙어 유혹하는 서울 길거리의 대표 스타예요. 어묵과 달걀을 함께 넣으면 맵고 달콤하고 쫄깃한 삼박자가 완성된답니다.",
                ja: "赤くてピリ辛のソースがもちもちのお餅にからみついて誘惑するソウル路上の代表スターです。おでんと卵を一緒に入れると、辛くて甘くてもちもちの三拍子が揃います。",
                en: "Chewy rice cakes coated in fiery red sauce — the undisputed star of Seoul street food. Add fish cake and egg and you have the perfect trifecta of spicy, sweet, and chewy."
              },
              ingredients: {
                ko: ["떡", "고추장", "고춧가루", "설탕", "어묵", "대파", "달걀", "멸치육수"],
                ja: ["餅", "コチュジャン", "唐辛子粉", "砂糖", "おでん", "長ネギ", "卵", "煮干しだし"],
                en: ["Rice cake", "Gochujang", "Chili powder", "Sugar", "Fish cake", "Green onion", "Egg", "Anchovy broth"]
              },
              tags: ["분식", "매콤", "길거리"],
                      dupes: {
                        JP: [
                          {
                            name: {
                              ko: "모찌 매운 단짠 조림",
                              ja: "甘辛餅煮",
                              en: "Sweet-Spicy Mochi Stew"
                            },
                            tasteProfile: {
                              sweet: 35,
                              salty: 45,
                              spicy: 50,
                              umami: 65,
                              sour: 5
                            },
                            ingredients: {
                              ko: [
                                "모찌",
                                "어묵",
                                "쪽파",
                                "간장",
                                "미림",
                                "고춧가루"
                              ],
                              ja: [
                                "餅",
                                "おでん種",
                                "ねぎ",
                                "醤油",
                                "みりん",
                                "唐辛子粉"
                              ],
                              en: [
                                "Mochi",
                                "Fish cake",
                                "Scallion",
                                "Soy sauce",
                                "Mirin",
                                "Chili powder"
                              ]
                            },
                            similarityPercent: 55,
                            strengths: {
                              ko: [
                                "쫄깃한 떡(모찌) 식감 공통",
                                "단짠 베이스 — 떡볶이의 단맛 결과 일부 일치"
                              ],
                              ja: [
                                "もちもちの餅食感が共通",
                                "甘辛ベース — トッポッキの甘みと一部一致"
                              ],
                              en: [
                                "Same chewy mochi texture",
                                "Sweet-savory base partially echoes tteokbokki's sweetness"
                              ]
                            },
                            limitations: {
                              ko: [
                                "일본에 정확히 동일한 요리는 거의 없음 — 위 레시피는 떡볶이 영감 가정 요리",
                                "고추장 깊이 부재"
                              ],
                              ja: [
                                "日本には正確に同じ料理はほぼない — 上記はトッポッキ風の家庭アレンジ",
                                "コチュジャンの深みなし"
                              ],
                              en: [
                                "No truly equivalent Japanese dish exists — above is a tteokbokki-inspired home riff",
                                "Lacks gochujang depth"
                              ]
                            },
                            tip: {
                              ko: "고추장을 한 큰술 넣으면 떡볶이 맛에 훨씬 가까워짐",
                              ja: "コチュジャン大さじ1を加えるとトッポッキの味にずっと近づく",
                              en: "A heaping spoon of gochujang nudges it much closer to tteokbokki"
                            },
                            description: {
                              ko: "모찌를 단짠 양념과 어묵으로 조린 일본식 떡볶이 해석",
                              ja: "餅を甘辛のタレとおでん種で煮込む日本式トッポッキ解釈",
                              en: "Japanese-style tteokbokki riff: mochi simmered with sweet-savory sauce and fish cake"
                            },
                            matchReason: {
                              ko: "쫄깃한 떡 식감 + 단짠 양념의 일본식 응용",
                              ja: "もちもちの餅食感+甘辛タレの日本式応用",
                              en: "Chewy rice cake + sweet-savory sauce in Japanese style"
                            }
                          }
                        ],
                        CN: [
                          {
                            name: {
                              ko: "찰떡 매운 볶음",
                              ja: "辛炒年糕",
                              en: "Spicy Stir-fried Nian Gao"
                            },
                            tasteProfile: {
                              sweet: 25,
                              salty: 55,
                              spicy: 50,
                              umami: 70,
                              sour: 10
                            },
                            ingredients: {
                              ko: [
                                "연고(쌀떡)",
                                "배추",
                                "돼지고기 채",
                                "두반장",
                                "간장",
                                "쪽파",
                                "마늘"
                              ],
                              ja: [
                                "年糕(米餅)",
                                "白菜",
                                "豚肉細切り",
                                "豆板醤",
                                "醤油",
                                "ねぎ",
                                "ニンニク"
                              ],
                              en: [
                                "Nian gao (rice cake)",
                                "Cabbage",
                                "Pork strips",
                                "Doubanjiang",
                                "Soy sauce",
                                "Scallion",
                                "Garlic"
                              ]
                            },
                            similarityPercent: 70,
                            strengths: {
                              ko: [
                                "쌀떡(쪽 흡사) + 매운 양념 + 돼지고기 + 채소 볶음 구조",
                                "쫄깃한 식감 공통"
                              ],
                              ja: [
                                "米餅(似た食感) + 辛い味付け + 豚肉 + 野菜炒めの構造",
                                "もちもち食感が共通"
                              ],
                              en: [
                                "Rice cake (similar texture) + spicy sauce + pork + vegetables stir-fried",
                                "Shared chewy bite"
                              ]
                            },
                            limitations: {
                              ko: [
                                "두반장 vs 고추장 — 발효 결이 다름",
                                "달지 않음 — 떡볶이의 단맛 부재"
                              ],
                              ja: [
                                "豆板醤 vs コチュジャン — 発酵の質が違う",
                                "甘くない — トッポッキの甘みなし"
                              ],
                              en: [
                                "Doubanjiang vs gochujang — different ferment character",
                                "Less sweet than tteokbokki"
                              ]
                            },
                            description: {
                              ko: "원형/막대형 쌀떡을 매운 양념과 채소·고기와 볶은 중국식 떡볶이 친척",
                              ja: "円型/棒型の米餅を辛い味付けと野菜・肉で炒める中国式トッポッキの親戚",
                              en: "Chinese stir-fried rice cake with spicy sauce, vegetables, and pork"
                            },
                            matchReason: {
                              ko: "쫄깃한 쌀떡 + 매운 양념 + 채소·고기 — 떡볶이의 가장 직접적인 중국 친척",
                              ja: "もちもち米餅+辛い味付け+野菜・肉 — トッポッキの最も直接的な中国の親戚",
                              en: "Chewy rice cake + spicy sauce + veg/meat — most direct Chinese cousin"
                            }
                          }
                        ],
                      },
              isLocalSpecialty: false,
            },
          {
              id: "national-jokbal",
              name: { ko: "족발", ja: "チョクパル", en: "Jokbal" },
              region: "national",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/national-jokbal.jpeg",
              imageCredit: "ⓒ한국관광공사 포토코리아-김효서",
              tasteProfile: { sweet: 35, salty: 55, spicy: 15, umami: 85, sour: 5 },
              storyDescription: {
                ko: "간장과 각종 향신료로 오랫동안 조려낸 족발은 쫄깃하면서도 입에서 살살 녹아요. 새벽 2시 귀갓길에 족발 한 접시와 소주 한 잔이면 서울의 밤이 완성된답니다.",
                ja: "醤油と様々なスパイスで長時間煮込んだチョクパルはもちもちしながらも口の中でとろけます。夜中の2時の帰り道にチョクパル一皿とソジュ一杯があればソウルの夜が完成します。",
                en: "Pork trotters braised long in soy sauce and spices — chewy yet melt-in-your-mouth tender. A plate of jokbal with a glass of soju on the way home at 2 AM is how a Seoul night truly ends."
              },
              ingredients: {
                ko: ["돼지 족발", "간장", "마늘", "생강", "설탕", "된장", "계피", "대파"],
                ja: ["豚足", "醤油", "ニンニク", "生姜", "砂糖", "テンジャン", "シナモン", "長ネギ"],
                en: ["Pork trotters", "Soy sauce", "Garlic", "Ginger", "Sugar", "Doenjang", "Cinnamon", "Green onion"]
              },
              tags: ["야식", "족발", "쫄깃"],
                      dupes: {
                        JP: [],
                        CN: [],
                      },
              isLocalSpecialty: false,
            },
          {
              id: "national-kimchi-jjigae",
              name: { ko: "김치찌개", ja: "キムチチゲ", en: "Kimchi Jjigae" },
              region: "national",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/national-kimchi-jjigae.jpeg",
              tasteProfile: { sweet: 15, salty: 60, spicy: 70, umami: 85, sour: 40 },
              storyDescription: {
                ko: "묵은지와 돼지고기가 어우러져 얼큰하고 깊은 맛을 내는 한국 가정의 영원한 국민 찌개예요. 뚝배기째 보글보글 끓여 흰 밥에 얹어 먹으면 온 세상이 그 자리에서 멈추는 것 같아요.",
                ja: "古漬けキムチと豚肉が調和して辛くて深い味わいを出す韓国家庭の永遠の国民チゲです。土鍋ごとぐつぐつ煮て白いご飯にのせて食べると、世界中がその場で止まるようです。",
                en: "Aged kimchi and pork simmering together into a fiery, deeply layered stew — Korea's eternal household classic. When you ladle it over white rice straight from the bubbling earthen pot, the whole world seems to pause."
              },
              ingredients: {
                ko: ["묵은지", "돼지고기", "두부", "대파", "고춧가루", "마늘", "참기름", "육수"],
                ja: ["古漬けキムチ", "豚肉", "豆腐", "長ネギ", "唐辛子粉", "ニンニク", "ごま油", "出汁"],
                en: ["Aged kimchi", "Pork", "Tofu", "Green onion", "Chili powder", "Garlic", "Sesame oil", "Broth"]
              },
              tags: ["찌개", "김치", "국민"],
                      dupes: {
                        JP: [],
                        CN: [],
                      },
              isLocalSpecialty: false,
            },
          {
              id: "national-bossam",
              image: "",
              name: { ko: "보쌈", ja: "ポッサム", en: "Bossam (Pork Belly Wraps)" },
              region: "national",
              tasteProfile: { sweet: 10, salty: 55, spicy: 30, umami: 80, sour: 10 },
              storyDescription: {
                ko: "돼지고기를 된장과 향신료에 삶아 얇게 썰어 김치·절임 무·마늘·쌈장과 함께 배춧잎에 싸 먹는 서울의 잔치 요리예요. 한 쌈을 입에 넣으면 삶은 고기의 부드러움과 김치의 매콤함이 폭발해요.",
                ja: "豚肉を味噌とスパイスで茹でて薄切りにし、キムチ・大根漬け・ニンニク・サムジャンと共に白菜の葉で包んで食べるソウルのごちそう料理です。一包みを口に入れれば茹で肉の柔らかさとキムチの辛さが弾けます。",
                en: "Pork belly boiled in doenjang and spices, then sliced thin and wrapped in cabbage leaves with kimchi, pickled radish, garlic and ssamjang — Seoul's celebration dish. One bite, and boiled pork's tenderness explodes with the fire of kimchi."
              },
              ingredients: { ko: ["삼겹살", "배추", "보쌈김치", "절임 무", "쌈장", "마늘", "된장", "생강"], ja: ["豚バラ肉", "白菜", "ポッサムキムチ", "大根漬け", "サムジャン", "ニンニク", "味噌", "生姜"], en: ["Pork belly", "Napa cabbage", "Bossam kimchi", "Pickled radish", "Ssamjang", "Garlic", "Doenjang", "Ginger"] },
              tags: ["쌈", "보쌈", "잔치"],
              dupes: {
                JP: [
        { name: { ko: "샤부샤부", ja: "しゃぶしゃぶ", en: "Shabu Shabu" }, tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 80, sour: 10 }, description: { ko: "얇게 썬 고기를 다시 국물에 살짝 데쳐 폰즈·참깨 소스에 찍어 먹는 일본식 전골", ja: "薄切り肉をだしで軽くしゃぶしゃぶしポン酢・ゴマソースで食べる日本式鍋", en: "Japanese hot pot where thin meat is swished in dashi and dipped in ponzu or sesame sauce" }, ingredients: { ko: ["돼지고기", "다시마", "배추", "두부", "폰즈", "참깨 소스"], ja: ["豚肉", "昆布", "白菜", "豆腐", "ポン酢", "ゴマソース"], en: ["Pork", "Kelp", "Napa cabbage", "Tofu", "Ponzu", "Sesame sauce"] }, similarityPercent: 73, matchReason: { ko: "삶은 고기를 얇게 썰어 소스와 함께 배추에 싸 먹는 유사한 방식", ja: "茹で肉を薄切りにしてソースと共に白菜に包む類似方式", en: "Boiled thin meat with dipping sauce — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "후이궈러우", ja: "回鍋肉", en: "Hui Guo Rou" }, tasteProfile: { sweet: 15, salty: 55, spicy: 40, umami: 80, sour: 5 }, description: { ko: "삶은 돼지고기를 채소와 두반장에 다시 볶아낸 사천식 요리", ja: "茹でた豚肉を野菜と豆板醤で再度炒めた四川料理", en: "Sichuan twice-cooked pork with vegetables and doubanjiang" }, ingredients: { ko: ["삼겹살", "양배추", "두반장", "대파", "마늘", "고추"], ja: ["豚バラ肉", "キャベツ", "豆板醤", "長ネギ", "ニンニク", "唐辛子"], en: ["Pork belly", "Cabbage", "Doubanjiang", "Green onion", "Garlic", "Chili"] }, similarityPercent: 75, matchReason: { ko: "삶은 돼지고기와 배추류를 함께 먹는 요리의 공통점", ja: "茹でた豚肉とキャベツ類を一緒に食べる料理の共通点", en: "Boiled pork with cabbage — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-ojingeo-bokkeum",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/national-ojingeo-bokkeum.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사",
              name: { ko: "오징어볶음", ja: "イカ炒め", en: "Ojingeo Bokkeum (Spicy Squid Stir-fry)" },
              region: "national",
              tasteProfile: { sweet: 25, salty: 55, spicy: 75, umami: 70, sour: 5 },
              storyDescription: {
                ko: "싱싱한 오징어를 고추장·고춧가루 양념에 버무려 양파와 대파와 함께 센 불에 볶아낸 요리예요. 쫄깃한 오징어와 매콤 달콤한 양념이 밥도둑으로 제격이에요.",
                ja: "新鮮なイカをコチュジャン・唐辛子粉のタレに絡めて玉ねぎ・長ネギと共に強火で炒めた料理です。プリプリのイカと甘辛いタレが、ご飯泥棒としてピッタリです。",
                en: "Fresh squid tossed in gochujang-gochugaru sauce and wok-charred with onion and scallion. The chewy squid and sweet-spicy sauce make it an unstoppable rice thief."
              },
              ingredients: { ko: ["오징어", "양파", "대파", "당근", "고추장", "고춧가루", "마늘", "참기름"], ja: ["イカ", "玉ねぎ", "長ネギ", "人参", "コチュジャン", "唐辛子粉", "ニンニク", "ごま油"], en: ["Squid", "Onion", "Green onion", "Carrot", "Gochujang", "Chili powder", "Garlic", "Sesame oil"] },
              tags: ["볶음", "오징어", "매운맛"],
              dupes: {
                JP: [
        { name: { ko: "이카 카쿠니", ja: "イカ角煮", en: "Ika Kakuni" }, tasteProfile: { sweet: 30, salty: 55, spicy: 5, umami: 75, sour: 5 }, description: { ko: "오징어를 달콤 짭짤한 간장 양념에 조린 일본식 오징어 요리", ja: "イカを甘辛い醤油ダレで煮付けた日本式イカ料理", en: "Japanese squid simmered in sweet-savory soy sauce" }, ingredients: { ko: ["오징어", "간장", "설탕", "미림", "생강", "파"], ja: ["イカ", "醤油", "砂糖", "みりん", "生姜", "ネギ"], en: ["Squid", "Soy sauce", "Sugar", "Mirin", "Ginger", "Green onion"] }, similarityPercent: 70, matchReason: { ko: "오징어를 단짠 양념에 조려내는 동일 구조", ja: "イカを甘辛いタレで煮付ける同じ構造", en: "Squid in sweet-savory glaze — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "마라 위 피엔", ja: "麻辣魷魚", en: "Mala Youyu" }, tasteProfile: { sweet: 15, salty: 55, spicy: 80, umami: 70, sour: 5 }, description: { ko: "오징어를 마라 양념에 볶아낸 사천식 매운 오징어 볶음", ja: "イカを麻辣タレで炒めた四川式の辛口イカ炒め", en: "Sichuan mala stir-fry with numbing spicy squid" }, ingredients: { ko: ["오징어", "두반장", "화자오", "건고추", "마늘", "대파"], ja: ["イカ", "豆板醤", "花椒", "唐辛子", "ニンニク", "長ネギ"], en: ["Squid", "Doubanjiang", "Sichuan pepper", "Dried chili", "Garlic", "Green onion"] }, similarityPercent: 78, matchReason: { ko: "오징어를 매운 양념에 센 불로 볶는 동아시아 해석", ja: "イカを辛いタレで強火で炒める東アジア式解釈", en: "Squid wok-tossed in fiery chili — Sichuan counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-samgyetang",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/national-samgyetang.jpeg",
              imageCredit: "ⓒ한국관광공사 포토코리아-알렉스 분도",
              name: { ko: "삼계탕", ja: "サムゲタン", en: "Samgyetang" },
              region: "national",
              tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 80, sour: 5 },
              storyDescription: {
                ko: "영계 한 마리에 인삼·대추·찹쌀·밤을 속에 가득 채워 오랜 시간 고아낸 경주의 보양식이에요. 뽀얀 국물 한 숟갈에 할머니의 손맛과 천년 왕국의 정성이 녹아 있어요.",
                ja: "若鶏一羽に高麗人参・なつめ・もち米・栗を詰めて長時間煮込んだ慶州の滋養料理です。白濁のスープ一さじに祖母の手の味と千年王国の真心が溶けています。",
                en: "A young chicken stuffed with ginseng, jujube, sticky rice and chestnut, slow-simmered to milky perfection — Gyeongju's restorative dish. In one spoonful of broth melts a grandmother's care and the devotion of a thousand-year kingdom."
              },
              ingredients: { ko: ["영계", "인삼", "대추", "찹쌀", "마늘", "밤", "소금", "후추"], ja: ["若鶏", "高麗人参", "なつめ", "もち米", "ニンニク", "栗", "塩", "胡椒"], en: ["Young chicken", "Ginseng", "Jujube", "Glutinous rice", "Garlic", "Chestnut", "Salt", "Pepper"] },
              tags: ["보양식", "인삼", "전통"],
              dupes: {
                JP: [
        { name: { ko: "토리 미즈타키", ja: "鶏水炊き", en: "Tori Mizutaki" }, tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 80, sour: 5 }, description: { ko: "통닭을 물에 오래 끓여 뽀얀 국물을 낸 규슈식 닭 전골", ja: "鶏肉を水で長時間煮込んで白濁のスープを作る九州式鶏鍋", en: "Kyushu-style chicken hot pot simmered in water until milky" }, ingredients: { ko: ["통닭", "배추", "버섯", "두부", "파", "폰즈"], ja: ["鶏肉", "白菜", "きのこ", "豆腐", "ネギ", "ポン酢"], en: ["Chicken", "Napa cabbage", "Mushroom", "Tofu", "Green onion", "Ponzu"] }, similarityPercent: 75, matchReason: { ko: "통닭을 오랜 시간 고아 뽀얀 국물을 만드는 동일 기법", ja: "鶏肉を長時間煮込んで白濁スープを作る同じ技法", en: "Whole chicken simmered into milky broth — Kyushu twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "칭 둔 지", ja: "清炖鶏", en: "Qing Dun Ji" }, tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 80, sour: 5 }, description: { ko: "통닭에 대추·구기자를 넣어 맑게 오래 끓여낸 중국식 보양 닭 수프", ja: "鶏肉になつめ・クコの実を入れて澄んだスープで長時間煮込んだ中国式の滋養鶏スープ", en: "Chinese slow-simmered clear chicken soup with jujube and wolfberry" }, ingredients: { ko: ["통닭", "대추", "구기자", "생강", "황기", "소금"], ja: ["鶏肉", "なつめ", "クコの実", "生姜", "黄耆", "塩"], en: ["Chicken", "Jujube", "Wolfberry", "Ginger", "Astragalus", "Salt"] }, similarityPercent: 80, matchReason: { ko: "닭과 약재를 오래 고아 보양식으로 먹는 동일 철학", ja: "鶏と薬材を長時間煮込んで滋養食として食べる同じ哲学", en: "Chicken-and-herb tonic broth — closest Chinese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-galbi-tang",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/national-galbi-tang.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
              name: { ko: "갈비탕", ja: "カルビタン", en: "Galbi Tang (Short Rib Soup)" },
              region: "national",
              tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 90, sour: 5 },
              storyDescription: {
                ko: "한우 갈비를 무와 함께 오래 고아 뽀얗게 우려낸 경주의 정찬 국물 요리예요. 갈비살을 당면에 감아 한 입 하면 진한 감칠맛이 혀 끝에서부터 몸을 따뜻하게 데워요.",
                ja: "韓牛カルビと大根を共に長時間煮込んで白濁に仕上げた慶州の正餐スープです。カルビの身を春雨に絡めて一口食べれば、深い旨味が舌先から体を温めてくれます。",
                en: "Hanwoo short ribs and radish slow-simmered to milky richness — Gyeongju's ceremonial broth. Rib meat twirled with glass noodles and savored in a single bite, and the deep umami warms your body from the tongue inward."
              },
              ingredients: { ko: ["한우 갈비", "무", "당면", "마늘", "대파", "후추", "소금", "달걀 지단"], ja: ["韓牛カルビ", "大根", "春雨", "ニンニク", "長ネギ", "胡椒", "塩", "錦糸卵"], en: ["Short ribs", "Radish", "Glass noodles", "Garlic", "Green onion", "Pepper", "Salt", "Egg garnish"] },
              tags: ["갈비", "정찬", "국물"],
              dupes: {
                JP: [
        { name: { ko: "규탄 시추", ja: "牛タンシチュー", en: "Gyūtan Stew" }, tasteProfile: { sweet: 10, salty: 50, spicy: 0, umami: 85, sour: 5 }, description: { ko: "소 혀를 오래 끓여 낸 일본식 소고기 뼈 스튜", ja: "牛タンを長時間煮込んで作る日本式牛スープ", en: "Japanese slow-simmered ox tongue/beef bone soup" }, ingredients: { ko: ["소 혀", "대파", "마늘", "간장", "양파", "미림"], ja: ["牛タン", "長ネギ", "ニンニク", "醤油", "玉ねぎ", "みりん"], en: ["Ox tongue", "Green onion", "Garlic", "Soy sauce", "Onion", "Mirin"] }, similarityPercent: 78, matchReason: { ko: "소고기를 오래 고아 깊은 국물을 내는 공통 전통", ja: "牛肉を長時間煮込んで深いスープを作る共通伝統", en: "Slow-simmered beef soup — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "파이구 탕", ja: "排骨湯", en: "Paigu Tang" }, tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 90, sour: 5 }, description: { ko: "돼지/소 갈비와 무를 오래 우린 중국식 갈비탕", ja: "豚・牛カルビと大根を長時間煮込んだ中国式カルビスープ", en: "Chinese slow-simmered rib soup with radish" }, ingredients: { ko: ["갈비", "무", "생강", "대파", "구기자", "소금"], ja: ["カルビ", "大根", "生姜", "長ネギ", "クコの実", "塩"], en: ["Ribs", "Radish", "Ginger", "Green onion", "Wolfberry", "Salt"] }, similarityPercent: 82, matchReason: { ko: "갈비를 무와 함께 오래 끓여 뽀얗게 내는 거의 동일한 요리", ja: "カルビを大根と共に長時間煮込んで白濁に仕上げるほぼ同じ料理", en: "Ribs and radish slow-simmered — closest Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-yakgwa",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/national-yakgwa.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
              name: { ko: "약과", ja: "ヤッカ（薬菓）", en: "Yakgwa (Honey Cookie)" },
              region: "national",
              tasteProfile: { sweet: 80, salty: 10, spicy: 5, umami: 15, sour: 5 },
              storyDescription: {
                ko: "밀가루에 꿀·참기름·술을 반죽해 꽃 모양 틀로 찍어 기름에 튀긴 후 조청에 담가낸 경주의 전통 궁중 과자예요. 한 입에 촉촉한 꿀의 여운이 오래도록 남아요.",
                ja: "小麦粉にハチミツ・ごま油・酒を練って花の形の型で押し、油で揚げた後に水飴に浸した慶州の伝統宮廷菓子です。一口で蜜のしっとりした余韻が長く残ります。",
                en: "Flour kneaded with honey, sesame oil and wine, stamped in flower molds, deep-fried, then soaked in grain syrup — Gyeongju's royal-court confection. One bite, and the moist echo of honey lingers."
              },
              ingredients: { ko: ["밀가루", "꿀", "참기름", "생강", "조청", "청주", "잣"], ja: ["小麦粉", "ハチミツ", "ごま油", "生姜", "水飴", "清酒", "松の実"], en: ["Flour", "Honey", "Sesame oil", "Ginger", "Grain syrup", "Rice wine", "Pine nuts"] },
              tags: ["한과", "꿀과자", "전통"],
              dupes: {
                JP: [
        { name: { ko: "카리야키 와가시", ja: "かりやき和菓子", en: "Kariyaki Wagashi" }, tasteProfile: { sweet: 75, salty: 10, spicy: 5, umami: 15, sour: 0 }, description: { ko: "밀가루와 꿀을 반죽해 모양을 내어 구운 일본 전통 꿀과자", ja: "小麦粉とハチミツを練って形を作り焼いた日本伝統のハチミツ菓子", en: "Japanese traditional honey-sweet wagashi baked into shapes" }, ingredients: { ko: ["밀가루", "꿀", "설탕", "참깨", "달걀"], ja: ["小麦粉", "ハチミツ", "砂糖", "ゴマ", "卵"], en: ["Flour", "Honey", "Sugar", "Sesame", "Egg"] }, similarityPercent: 73, matchReason: { ko: "꿀과 밀가루로 만든 전통 궁중 과자의 공통점", ja: "ハチミツと小麦粉で作る伝統宮廷菓子の共通点", en: "Honey-and-wheat court confection — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "미탕 더우", ja: "蜜糖豆", en: "Mi Tang Dou" }, tasteProfile: { sweet: 80, salty: 5, spicy: 0, umami: 15, sour: 0 }, description: { ko: "밀가루 반죽을 튀긴 후 꿀에 담근 중국 북부식 전통 과자", ja: "小麦粉生地を揚げた後にハチミツに浸した中国北部式の伝統菓子", en: "Northern Chinese traditional fried dough soaked in honey" }, ingredients: { ko: ["밀가루", "꿀", "흑설탕", "참깨", "식용유"], ja: ["小麦粉", "ハチミツ", "黒糖", "ゴマ", "食用油"], en: ["Flour", "Honey", "Brown sugar", "Sesame", "Oil"] }, similarityPercent: 80, matchReason: { ko: "튀긴 반죽을 꿀에 담가내는 거의 동일한 조리법", ja: "揚げた生地をハチミツに浸すほぼ同じ調理法", en: "Fried-dough-soaked-in-honey — Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-hangwa",
              image: "",
              name: { ko: "한과", ja: "ハングァ（韓菓）", en: "Hangwa (Traditional Rice Confection)" },
              region: "national",
              tasteProfile: { sweet: 75, salty: 5, spicy: 0, umami: 15, sour: 3 },
              storyDescription: {
                ko: "찹쌀·꿀·조청·깨·견과로 만든 경주의 전통 한국 과자 모음집이에요. 설날·추석이면 어느 집 다과상에서도 볼 수 있는, 천년 도시의 달콤한 기억이 되어주는 과자예요.",
                ja: "もち米・ハチミツ・水飴・ゴマ・ナッツで作る慶州の伝統韓菓詰め合わせです。お正月・秋夕になればどの家の茶菓にも見られる、千年都市の甘い記憶となる菓子です。",
                en: "Glutinous rice, honey, syrup, sesame and nuts crafted into Gyeongju's traditional confection set. On Lunar New Year and Chuseok, you'll find these on every household's tea table — sweet memories of a thousand-year city."
              },
              ingredients: { ko: ["찹쌀", "꿀", "조청", "참깨", "잣", "호두", "대추"], ja: ["もち米", "ハチミツ", "水飴", "ゴマ", "松の実", "クルミ", "なつめ"], en: ["Glutinous rice", "Honey", "Grain syrup", "Sesame", "Pine nuts", "Walnut", "Jujube"] },
              tags: ["한과", "명절", "전통"],
              dupes: {
                JP: [
        { name: { ko: "와가시 모치", ja: "和菓子餅", en: "Wagashi Mochi" }, tasteProfile: { sweet: 75, salty: 5, spicy: 0, umami: 15, sour: 0 }, description: { ko: "찹쌀과 팥·녹차 등을 다양하게 응용한 일본 전통 화과자 모음", ja: "もち米とあんこ・抹茶などを多様に応用した日本伝統の和菓子詰め合わせ", en: "Japanese traditional wagashi assortment with glutinous rice, red bean paste and matcha" }, ingredients: { ko: ["찹쌀", "팥앙금", "말차", "설탕", "한천"], ja: ["もち米", "あんこ", "抹茶", "砂糖", "寒天"], en: ["Glutinous rice", "Red bean paste", "Matcha", "Sugar", "Agar"] }, similarityPercent: 85, matchReason: { ko: "찹쌀·자연 감미료로 만드는 장인급 전통 과자의 공통점", ja: "もち米・天然甘味料で作る職人伝統菓子の共通点", en: "Artisan rice-based confection — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "녠가오 과자", ja: "年糕菓子", en: "Nian Gao Confection" }, tasteProfile: { sweet: 75, salty: 5, spicy: 0, umami: 15, sour: 0 }, description: { ko: "찹쌀과 흑설탕으로 만든 중국식 전통 설 과자", ja: "もち米と黒糖で作る中国式の伝統お正月菓子", en: "Chinese traditional New Year confection of glutinous rice and brown sugar" }, ingredients: { ko: ["찹쌀", "흑설탕", "대추", "참깨", "호두"], ja: ["もち米", "黒糖", "なつめ", "ゴマ", "クルミ"], en: ["Glutinous rice", "Brown sugar", "Jujube", "Sesame", "Walnut"] }, similarityPercent: 78, matchReason: { ko: "찹쌀과 자연 감미료를 사용한 명절 과자 공통점", ja: "もち米と天然甘味料を使う正月菓子の共通点", en: "Glutinous-rice festive sweet — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-tteokguk",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/national-tteokguk.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
              name: { ko: "떡국", ja: "トックク", en: "Tteokguk (Rice Cake Soup)" },
              region: "national",
              tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 85, sour: 5 },
              storyDescription: {
                ko: "얇게 썬 가래떡을 맑은 소고기 육수에 넣어 끓이고 달걀지단과 김가루를 얹어낸 경주의 설날 국물이에요. 떡 한 조각에 나이 한 살, 한 해의 안녕이 담겨 있어요.",
                ja: "薄く切った餅を澄んだ牛肉スープで煮込み、錦糸卵と海苔粉をのせた慶州のお正月のスープです。餅一切れに歳一つ、一年の安らぎが込められています。",
                en: "Thin-sliced rice cake simmered in clear beef broth and topped with egg garnish and seaweed — Gyeongju's New Year soup. In each slice lies one year of age and a wish for the year ahead."
              },
              ingredients: { ko: ["가래떡", "소고기", "달걀", "김", "대파", "간장", "마늘", "참기름"], ja: ["餅", "牛肉", "卵", "海苔", "長ネギ", "醤油", "ニンニク", "ごま油"], en: ["Rice cake", "Beef", "Egg", "Seaweed", "Green onion", "Soy sauce", "Garlic", "Sesame oil"] },
              tags: ["설날", "떡", "국물"],
              dupes: {
                JP: [
        { name: { ko: "오조니", ja: "お雑煮", en: "Ozoni" }, tasteProfile: { sweet: 10, salty: 55, spicy: 0, umami: 85, sour: 5 }, description: { ko: "떡을 맑은 다시 국물에 넣고 채소를 곁들인 일본 정초 국", ja: "餅を澄んだだしに入れて野菜を添える日本のお正月汁", en: "Japanese New Year soup of mochi in clear dashi with vegetables" }, ingredients: { ko: ["찹쌀 떡", "다시", "닭고기", "미쓰바", "간장", "어묵"], ja: ["餅", "だし", "鶏肉", "三つ葉", "醤油", "蒲鉾"], en: ["Mochi", "Dashi", "Chicken", "Mitsuba", "Soy sauce", "Kamaboko"] }, similarityPercent: 82, matchReason: { ko: "떡을 맑은 국물에 끓여 정초에 먹는 거의 동일한 요리", ja: "餅を澄んだスープで煮込んでお正月に食べるほぼ同じ料理", en: "Rice cake in clear broth for New Year — Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "탕 위안 수프", ja: "湯圓スープ", en: "Tang Yuan Soup" }, tasteProfile: { sweet: 40, salty: 15, spicy: 0, umami: 30, sour: 5 }, description: { ko: "찹쌀 경단을 달콤한 시럽에 넣어 먹는 중국 원소절 떡 국", ja: "もち米団子を甘いシロップに入れて食べる中国の元宵節の餅汁", en: "Chinese Lantern Festival glutinous rice balls in sweet soup" }, ingredients: { ko: ["찹쌀가루", "팥앙금", "흑설탕", "생강", "참깨"], ja: ["もち米粉", "あんこ", "黒糖", "生姜", "ゴマ"], en: ["Glutinous rice", "Red bean paste", "Brown sugar", "Ginger", "Sesame"] }, similarityPercent: 73, matchReason: { ko: "떡을 국물에 넣어 명절에 먹는 전통의 공통점", ja: "餅をスープに入れて節句に食べる伝統の共通点", en: "Rice cake in festive broth — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-spicy-catfish",
              name: { ko: "빠가사리 매운탕", ja: "ナマズ辛鍋", en: "Spicy Catfish Stew" },
              region: "national",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/national-spicy-catfish.jpeg",
              imageCredit: "ⓒ한국관광공사 포토코리아-IR 스튜디오",
              tasteProfile: { sweet: 10, salty: 50, spicy: 75, umami: 75, sour: 15 },
              storyDescription: {
                ko: "충청도 강에서 잡히는 빠가사리(메기류) 민물고기로 끓인 진한 매운탕이에요. 담백한 흰살 생선의 부드러운 살점이 칼칼한 양념과 어우러져 시원하고 얼큰한 국물이 완성되는데, 이맛이 그리워 천안을 찾는 사람들도 있답니다.",
                ja: "忠清道の川で獲れるナマズ類の淡水魚で煮込んだ濃厚な辛鍋です。淡白な白身魚の柔らかい身が辛い薬味と調和して、スッキリとしてピリッと辛いスープが完成し、この味が恋しくて天安を訪れる人もいるそうです。",
                en: "A fiery catfish stew made with freshwater fish caught in the rivers of Chungcheong province. The tender white fish flesh melds with the spicy seasoning into a clean, blazing broth — some people visit Cheonan just for this taste."
              },
              ingredients: { ko: ["빠가사리", "고춧가루", "된장", "두부", "호박", "파", "마늘", "들깨"], ja: ["ナマズ", "唐辛子粉", "味噌", "豆腐", "カボチャ", "ネギ", "ニンニク", "エゴマ"], en: ["Catfish", "Red pepper powder", "Doenjang", "Tofu", "Zucchini", "Green onion", "Garlic", "Perilla"] },
              tags: ["매운탕", "민물고기", "얼큰"],
                      dupes: {
                        JP: [],
                        CN: [],
                      },
              isLocalSpecialty: false,
            },
          {
              id: "national-jeyuk-bokkeum",
              name: { ko: "제육볶음", ja: "豚肉炒め", en: "Spicy Stir-Fried Pork" },
              region: "national",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/national-jeyuk-bokkeum.jpeg",
              imageCredit: "ⓒ한국관광공사 포토코리아-스튜디오 4cats",
              tasteProfile: { sweet: 30, salty: 55, spicy: 70, umami: 70, sour: 10 },
              storyDescription: {
                ko: "이천 쌀밥과 제육볶음의 조합은 경기도 밥상의 클래식이에요. 고추장 양념에 매콤하게 볶아진 돼지고기 한 점을 탱글탱글한 이천 쌀밥 위에 올려 먹는 그 순간은, 아무리 많이 먹어도 질리지 않는 한국 소울 푸드랍니다.",
                ja: "利川のご飯と豚肉炒めの組み合わせは京畿道の食卓のクラシックです。コチュジャンの薬味で辛く炒めた豚肉一切れを、ぷりぷりの利川ご飯の上に乗せて食べるその瞬間は、何度食べても飽きない韓国のソウルフードです。",
                en: "Icheon rice paired with jeyuk bokkeum is a Gyeonggi table classic. That moment of placing a spicy gochujang-glazed pork piece atop plump Icheon rice is the Korean soul food you never tire of, no matter how many times you eat it."
              },
              ingredients: { ko: ["돼지고기", "고추장", "간장", "마늘", "생강", "파", "참기름", "설탕"], ja: ["豚肉", "コチュジャン", "醤油", "ニンニク", "生姜", "ネギ", "ごま油", "砂糖"], en: ["Pork", "Gochujang", "Soy sauce", "Garlic", "Ginger", "Green onion", "Sesame oil", "Sugar"] },
              tags: ["볶음", "매콤", "돼지고기"],
                      dupes: {
                        JP: [],
                        CN: [],
                      },
              isLocalSpecialty: false,
            },
          {
              id: "national-nakji-bokkeum",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/national-nakji-bokkeum.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사",
              name: { ko: "낙지볶음", ja: "ナクチポックム", en: "Nakji Bokkeum (Spicy Stir-fried Octopus)" },
              region: "national",
              tasteProfile: { sweet: 20, salty: 55, spicy: 80, umami: 70, sour: 5 },
              storyDescription: {
                ko: "쫄깃한 낙지에 고추장과 고춧가루를 듬뿍 넣고 불맛이 살아있게 볶아낸 요리예요. 한 입 베어 물면 매운 불이 혀를 뛰어다니다가, 뒤따라 오는 낙지의 달짝지근함에 다시 한번 반하게 돼요.",
                ja: "コリコリのタコにコチュジャンと唐辛子粉をたっぷり入れて、炎の香ばしさを残して炒めた料理です。一口食べれば辛い炎が舌の上を駆け回り、後からくるタコの甘みにもう一度惚れ込みます。",
                en: "Chewy octopus flash-fried with generous gochujang and chili powder, carrying the smoky flame of high heat. One bite and fire dances on your tongue before the octopus's hidden sweetness makes you fall for it all over again."
              },
              ingredients: { ko: ["낙지", "양파", "고추장", "고춧가루", "마늘", "대파", "참기름"], ja: ["テナガダコ", "玉ねぎ", "コチュジャン", "唐辛子粉", "ニンニク", "長ネギ", "ごま油"], en: ["Octopus", "Onion", "Gochujang", "Chili powder", "Garlic", "Green onion", "Sesame oil"] },
              tags: ["매운맛", "해산물", "불맛"],
              dupes: {
                JP: [
        { name: { ko: "다코야키", ja: "たこ焼き", en: "Takoyaki" }, tasteProfile: { sweet: 20, salty: 55, spicy: 5, umami: 70, sour: 5 }, description: { ko: "둥근 반죽에 문어를 넣어 구운 오사카식 길거리 간식", ja: "丸い生地にタコを入れて焼いた大阪の屋台おやつ", en: "Osaka street snack of battered octopus balls" }, ingredients: { ko: ["문어", "밀가루 반죽", "쯔유", "가쓰오부시", "파", "오타후쿠 소스"], ja: ["タコ", "小麦粉生地", "つゆ", "かつお節", "ネギ", "オタフクソース"], en: ["Octopus", "Batter", "Tsuyu", "Bonito flakes", "Green onion", "Okonomi sauce"] }, similarityPercent: 65, matchReason: { ko: "쫄깃한 문어를 주인공으로 삼은 감칠맛 강한 한 접시", ja: "コリコリしたタコを主役にした旨味の強い一皿", en: "Chewy octopus-centered umami dish — different format, same hero" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "마라 장위", ja: "麻辣章魚", en: "Mala Zhangyu (Mala Octopus)" }, tasteProfile: { sweet: 10, salty: 55, spicy: 85, umami: 70, sour: 5 }, description: { ko: "문어를 화자오와 건고추로 얼얼하게 볶아낸 사천식 요리", ja: "タコを花椒と唐辛子でしびれ辛く炒めた四川式料理", en: "Sichuan stir-fry of octopus with numbing sichuan pepper and dried chili" }, ingredients: { ko: ["문어", "화자오", "건고추", "두반장", "대파", "마늘"], ja: ["タコ", "花椒", "唐辛子", "豆板醤", "長ネギ", "ニンニク"], en: ["Octopus", "Sichuan pepper", "Dried chili", "Doubanjiang", "Green onion", "Garlic"] }, similarityPercent: 72, matchReason: { ko: "문어를 강한 불과 매운 고추로 볶아내는 동일 구조", ja: "タコを強火と辛い唐辛子で炒める同じ構造", en: "Octopus wok-fired with fiery chili — closest Sichuan sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-gomtang",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/national-gomtang.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-토라이 리퍼블릭",
              name: { ko: "곰탕", ja: "コムタン", en: "Gomtang (Beef Bone Broth)" },
              region: "national",
              tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 90, sour: 5 },
              storyDescription: {
                ko: "소 뼈와 고기를 하루 이틀 푹 고아 우려낸 뽀얗고 진한 국물은 전주 아침의 따뜻한 인사예요. 밥을 말고 소금으로만 살짝 간을 하면 깊은 감칠맛이 속을 다독여요.",
                ja: "牛骨と肉を一日二日じっくり煮込んで出した白く濃いスープは、全州の朝の温かい挨拶です。ご飯を入れて塩だけで味を調えれば、深い旨味がお腹を撫でてくれます。",
                en: "Ox bones and meat simmered a full day or two into a milky, rich broth — Jeonju's warm morning greeting. Rice dropped in, seasoned only with salt, and every spoonful soothes you from within."
              },
              ingredients: { ko: ["소뼈", "양지머리", "무", "대파", "마늘", "소금", "후추", "밥"], ja: ["牛骨", "牛胸肉", "大根", "長ネギ", "ニンニク", "塩", "胡椒", "ご飯"], en: ["Beef bones", "Brisket", "Radish", "Green onion", "Garlic", "Salt", "Pepper", "Rice"] },
              tags: ["탕", "뼈육수", "깊은맛"],
              dupes: {
                JP: [
        { name: { ko: "토리 파이탄", ja: "鶏白湯", en: "Tori Paitan" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 85, sour: 5 }, description: { ko: "닭 뼈를 오래 끓여 만든 뽀얗고 진한 일본식 라멘 국물", ja: "鶏骨を長時間煮込んで作る白く濃厚な日本式ラーメンスープ", en: "Milky-rich Japanese ramen broth from long-simmered chicken bones" }, ingredients: { ko: ["닭뼈", "닭발", "생강", "파", "소금", "라멘 면"], ja: ["鶏骨", "鶏足", "生姜", "ネギ", "塩", "ラーメン"], en: ["Chicken bones", "Chicken feet", "Ginger", "Green onion", "Salt", "Ramen"] }, similarityPercent: 77, matchReason: { ko: "뼈를 장시간 끓여 뽀얗고 진한 국물을 얻는 동일 기법", ja: "骨を長時間煮込んで白く濃厚なスープを得る同じ技法", en: "Bones long-simmered into milky deep broth — same technique" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "칭탕 뼈 육수", ja: "清湯骨スープ", en: "Qing Tang Bone Broth" }, tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 90, sour: 5 }, description: { ko: "소뼈·돼지뼈를 맑게 우려낸 중국식 고급 육수", ja: "牛骨・豚骨を澄んだスープに仕上げた中国式高級だし", en: "Chinese clear premium broth from long-simmered bones" }, ingredients: { ko: ["소뼈", "돼지뼈", "생강", "대파", "소금", "파슬리"], ja: ["牛骨", "豚骨", "生姜", "長ネギ", "塩", "パセリ"], en: ["Beef bones", "Pork bones", "Ginger", "Green onion", "Salt", "Parsley"] }, similarityPercent: 80, matchReason: { ko: "장시간 뼈를 고아 진한 감칠맛 국물을 만드는 동일 철학", ja: "長時間骨を煮込んで深い旨味スープを作る同じ哲学", en: "Long bone simmering for deep umami — shared philosophy" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-budae-jjigae",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/national-budae-jjigae.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-IR 스튜디오",
              name: { ko: "부대찌개", ja: "プデチゲ", en: "Budae Jjigae (Army Stew)" },
              region: "national",
              tasteProfile: { sweet: 15, salty: 60, spicy: 70, umami: 85, sour: 10 },
              storyDescription: {
                ko: "전쟁 이후 미군 부대에서 나온 햄·소시지·치즈를 김치·고추장과 함께 끓여낸 서울발 한미 퓨전 찌개예요. 라면 사리를 마지막에 넣어 후루룩 먹는 재미가 일품이에요.",
                ja: "戦後、米軍基地から出たハム・ソーセージ・チーズをキムチ・コチュジャンと共に煮込んだソウル発の韓米融合チゲです。ラーメンを最後に入れてすする楽しみが一級品です。",
                en: "Ham, sausage and cheese salvaged from post-war US Army bases, simmered with kimchi and gochujang — Seoul's Korean-American fusion stew. Instant ramen added at the end is the crowning slurp."
              },
              ingredients: { ko: ["스팸", "비엔나 소시지", "김치", "두부", "베이크드 빈", "라면 사리", "고추장", "대파"], ja: ["スパム", "ウインナー", "キムチ", "豆腐", "ベイクドビーンズ", "ラーメン", "コチュジャン", "長ネギ"], en: ["Spam", "Sausage", "Kimchi", "Tofu", "Baked beans", "Ramen noodles", "Gochujang", "Green onion"] },
              tags: ["찌개", "부대", "퓨전"],
              dupes: {
                JP: [
        { name: { ko: "모츠나베 매운 퓨전", ja: "辛いもつ鍋フュージョン", en: "Spicy Motsunabe Fusion" }, tasteProfile: { sweet: 15, salty: 60, spicy: 60, umami: 85, sour: 10 }, description: { ko: "돼지 내장과 배추·두부를 매운 된장 국물에 끓이는 일본 규슈식 퓨전 전골", ja: "豚モツと白菜・豆腐を辛い味噌スープで煮込む日本九州式フュージョン鍋", en: "Japanese Kyushu-style spicy miso hot pot with pork offal, cabbage and tofu" }, ingredients: { ko: ["돼지 내장", "배추", "두부", "미소", "고추", "마늘"], ja: ["豚モツ", "白菜", "豆腐", "味噌", "唐辛子", "ニンニク"], en: ["Pork offal", "Cabbage", "Tofu", "Miso", "Chili", "Garlic"] }, similarityPercent: 65, matchReason: { ko: "다양한 재료를 매운 국물에 끓여 먹는 한 냄비 퓨전", ja: "様々な材料を辛いスープで煮込む一鍋フュージョン", en: "Spicy multi-ingredient hot pot — Japanese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "마라 훠궈 햄", ja: "麻辣火鍋・ハム", en: "Mala Huo Guo with Ham" }, tasteProfile: { sweet: 10, salty: 60, spicy: 80, umami: 85, sour: 5 }, description: { ko: "햄·소시지·두부 등을 마라 국물에 끓여 먹는 중국식 훠궈 퓨전", ja: "ハム・ソーセージ・豆腐などを麻辣スープで煮込む中華式火鍋フュージョン", en: "Chinese mala hot pot fusion with ham, sausage and tofu" }, ingredients: { ko: ["햄", "소시지", "두부", "두반장", "화자오", "배추"], ja: ["ハム", "ソーセージ", "豆腐", "豆板醤", "花椒", "白菜"], en: ["Ham", "Sausage", "Tofu", "Doubanjiang", "Sichuan pepper", "Napa cabbage"] }, similarityPercent: 73, matchReason: { ko: "햄과 두부 등 여러 재료를 매운 국물에 끓이는 공통점", ja: "ハムと豆腐など様々な材料を辛いスープで煮込む共通点", en: "Multi-ingredient spicy hot pot — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-kimchi-jeon",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/national-kimchi-jeon.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 김지호",
              name: { ko: "김치전", ja: "キムチチヂミ", en: "Kimchi Jeon (Kimchi Pancake)" },
              region: "national",
              tasteProfile: { sweet: 10, salty: 55, spicy: 50, umami: 70, sour: 20 },
              storyDescription: {
                ko: "잘 익은 김치를 밀가루 반죽에 섞어 기름에 노릇하게 부쳐낸 비 오는 날의 단짝이에요. 바삭한 가장자리와 새콤 매콤한 김치 향이 막걸리를 부르는 마법이에요.",
                ja: "よく熟したキムチを小麦粉生地に混ぜて油できつね色に焼いた雨の日の相棒です。サクサクの端と酸っぱ辛いキムチの香りがマッコリを呼ぶ魔法です。",
                en: "Well-ripened kimchi folded into wheat batter and pan-fried golden — the rainy-day sidekick. Crispy edges and the tangy-spicy scent of kimchi work magic that calls for makgeolli."
              },
              ingredients: { ko: ["묵은 김치", "밀가루", "달걀", "대파", "식용유", "김치 국물", "참기름", "간장"], ja: ["熟成キムチ", "小麦粉", "卵", "長ネギ", "食用油", "キムチ汁", "ごま油", "醤油"], en: ["Aged kimchi", "Flour", "Egg", "Green onion", "Oil", "Kimchi juice", "Sesame oil", "Soy sauce"] },
              tags: ["전", "김치", "막걸리"],
              dupes: {
                JP: [
        { name: { ko: "킴치 오코노미야키", ja: "キムチお好み焼き", en: "Kimchi Okonomiyaki" }, tasteProfile: { sweet: 15, salty: 55, spicy: 45, umami: 75, sour: 20 }, description: { ko: "김치를 넣어 구운 퓨전 오사카식 오코노미야키", ja: "キムチを入れて焼いたフュージョン大阪風お好み焼き", en: "Fusion Osaka okonomiyaki with kimchi" }, ingredients: { ko: ["밀가루", "양배추", "김치", "돼지고기", "달걀", "오타후쿠"], ja: ["小麦粉", "キャベツ", "キムチ", "豚肉", "卵", "オタフク"], en: ["Flour", "Cabbage", "Kimchi", "Pork", "Egg", "Okonomi sauce"] }, similarityPercent: 82, matchReason: { ko: "김치를 반죽에 섞어 팬에 부쳐내는 거의 동일한 요리", ja: "キムチを生地に混ぜて焼くほぼ同じ料理", en: "Kimchi pancake fusion — close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "파오차이 지엔빙", ja: "泡菜煎餅", en: "Paocai Jianbing" }, tasteProfile: { sweet: 10, salty: 55, spicy: 40, umami: 70, sour: 25 }, description: { ko: "중국식 발효 채소 '파오차이'를 반죽에 넣어 부친 중국식 발효 채소 전", ja: "中国式発酵野菜「泡菜」を生地に入れて焼く中国式発酵野菜チヂミ", en: "Chinese pancake with fermented paocai vegetable" }, ingredients: { ko: ["밀가루", "파오차이", "달걀", "대파", "참기름", "간장"], ja: ["小麦粉", "泡菜", "卵", "長ネギ", "ごま油", "醤油"], en: ["Flour", "Paocai", "Egg", "Green onion", "Sesame oil", "Soy sauce"] }, similarityPercent: 80, matchReason: { ko: "발효 채소를 반죽에 넣어 부치는 거의 동일한 요리", ja: "発酵野菜を生地に入れて焼くほぼ同じ料理", en: "Fermented veg pancake — close Chinese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-kkomak-bibimbap",
              image: "",
              name: { ko: "꼬막비빔밥", ja: "赤貝ビビンバ", en: "Kkomak Bibimbap" },
              region: "national",
              tasteProfile: { sweet: 15, salty: 55, spicy: 40, umami: 80, sour: 10 },
              storyDescription: {
                ko: "쫄깃한 꼬막 살을 갖은 양념에 무쳐 따끈한 밥 위에 올린 부산의 별미예요. 참기름 향과 바다 감칠맛이 어우러진 한 숟갈이 밥상을 가득 채워요.",
                ja: "プリプリのアカガイの身を様々な薬味で和えて、温かいご飯の上にのせた釜山の逸品です。ごま油の香りと海の旨味が調和する一さじが、食卓を満たします。",
                en: "Chewy ark clams dressed in seasoning and piled over warm rice — Busan's coastal treat. One spoonful of sesame fragrance and briny umami fills the whole table."
              },
              ingredients: { ko: ["꼬막", "밥", "간장", "고춧가루", "참기름", "마늘", "쪽파", "참깨"], ja: ["アカガイ", "ご飯", "醤油", "唐辛子粉", "ごま油", "ニンニク", "小ネギ", "ゴマ"], en: ["Ark clams", "Rice", "Soy sauce", "Chili powder", "Sesame oil", "Garlic", "Green onion", "Sesame seed"] },
              tags: ["비빔밥", "꼬막", "별미"],
              dupes: {
                JP: [
        { name: { ko: "아카가이 돈부리", ja: "赤貝丼", en: "Akagai Donburi" }, tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 80, sour: 10 }, description: { ko: "아카가이와 밥, 참깨 간장을 섞어 먹는 일본식 조개 덮밥", ja: "アカガイとご飯、ゴマ醤油を混ぜて食べる日本式の貝丼", en: "Japanese ark clam rice bowl with sesame-soy sauce" }, ingredients: { ko: ["아카가이", "밥", "간장", "참기름", "김", "와사비"], ja: ["赤貝", "ご飯", "醤油", "ごま油", "海苔", "わさび"], en: ["Ark clam", "Rice", "Soy sauce", "Sesame oil", "Nori", "Wasabi"] }, similarityPercent: 80, matchReason: { ko: "조개를 간장 양념에 무쳐 밥 위에 올리는 거의 동일한 요리", ja: "貝を醤油ダレで和えてご飯にのせるほぼ同じ料理", en: "Ark clam over rice with soy — very close Japanese twin" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "마라 쉐거 미판", ja: "麻辣血蛤米飯", en: "Mala Ark Clam Rice" }, tasteProfile: { sweet: 10, salty: 55, spicy: 65, umami: 75, sour: 5 }, description: { ko: "꼬막을 마라 양념에 볶아 밥 위에 올린 중국식 매운 꼬막밥", ja: "アカガイを麻辣タレで和えてご飯にのせた中国式辛口アカガイご飯", en: "Chinese mala ark clam rice bowl" }, ingredients: { ko: ["꼬막", "밥", "두반장", "화자오", "마늘", "쪽파"], ja: ["アカガイ", "ご飯", "豆板醤", "花椒", "ニンニク", "小ネギ"], en: ["Ark clam", "Rice", "Doubanjiang", "Sichuan pepper", "Garlic", "Green onion"] }, similarityPercent: 70, matchReason: { ko: "조개를 매운 양념에 무쳐 밥 위에 올리는 구조", ja: "貝を辛いタレで和えてご飯にのせる構造", en: "Ark clam over rice with chili — Chinese counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-sanchae-bibimbap",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/national-sanchae-bibimbap.jpeg",
              imageCredit: "ⓒ한국관광공사 포토코리아-IR 스튜디오",
              name: { ko: "산채비빔밥", ja: "山菜ビビンバ", en: "Sanchae Bibimbap (Mountain Herb Bibimbap)" },
              region: "national",
              tasteProfile: { sweet: 15, salty: 45, spicy: 35, umami: 70, sour: 10 },
              storyDescription: {
                ko: "산속에서 갓 채집한 일곱 가지 산나물을 밥 위에 둘러놓고 고추장과 참기름에 비벼 먹는 경주 사찰식 비빔밥이에요. 한 숟갈에 산과 바람, 흙의 향기가 함께 올라와요.",
                ja: "山で採取したての七種の山菜をご飯の上に並べ、コチュジャンとごま油で混ぜて食べる慶州の寺刹式ビビンバです。一さじに山と風、土の香りが一緒に立ち上がります。",
                en: "Seven freshly gathered mountain herbs arranged over rice, mixed with gochujang and sesame oil — Gyeongju's temple-style bibimbap. One spoonful carries the scent of mountains, wind and earth."
              },
              ingredients: { ko: ["밥", "취나물", "곤드레", "고사리", "도라지", "산더덕", "고추장", "참기름"], ja: ["ご飯", "チュイナムル", "コンドゥレ", "ワラビ", "桔梗", "山のシャシャン", "コチュジャン", "ごま油"], en: ["Rice", "Chwinamul", "Gondre", "Bracken", "Bellflower", "Mountain root", "Gochujang", "Sesame oil"] },
              tags: ["산채", "사찰식", "비빔밥"],
              dupes: {
                JP: [
        { name: { ko: "산사이 고한", ja: "山菜ご飯", en: "Sansai Gohan" }, tasteProfile: { sweet: 10, salty: 45, spicy: 0, umami: 65, sour: 5 }, description: { ko: "산에서 뜯은 여러 산나물을 쌀과 함께 지은 일본 전통 산채밥", ja: "山で摘んだ様々な山菜を米と共に炊いた日本伝統の山菜ご飯", en: "Japanese traditional rice cooked with mountain vegetables" }, ingredients: { ko: ["쌀", "고비", "고사리", "팽이버섯", "간장", "참기름"], ja: ["米", "ゼンマイ", "ワラビ", "エノキ", "醤油", "ごま油"], en: ["Rice", "Royal fern", "Bracken", "Enoki", "Soy sauce", "Sesame oil"] }, similarityPercent: 80, matchReason: { ko: "산에서 캔 나물을 쌀과 함께 먹는 거의 동일한 전통", ja: "山で摘んだ山菜を米と共に食べるほぼ同じ伝統", en: "Mountain herb rice — very close Japanese sibling" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        { name: { ko: "예 차이 판", ja: "野菜飯", en: "Ye Cai Fan" }, tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 65, sour: 5 }, description: { ko: "여러 야생 잎채소와 쌀을 함께 지은 중국 사찰식 나물밥", ja: "様々な野生の葉野菜と米を炊いた中国の精進野菜ご飯", en: "Chinese temple-style rice with various wild leafy greens" }, ingredients: { ko: ["쌀", "고사리", "부추", "청경채", "간장", "참기름"], ja: ["米", "ワラビ", "ニラ", "チンゲン菜", "醤油", "ごま油"], en: ["Rice", "Bracken", "Chive", "Bok choy", "Soy sauce", "Sesame oil"] }, similarityPercent: 72, matchReason: { ko: "산나물을 쌀과 비벼 먹는 사찰 전통의 공통점", ja: "山菜を米と混ぜて食べる精進料理の共通点", en: "Mountain-herb rice tradition — Chinese temple counterpart" } ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-hanwoo-yukhoe",
              name: { ko: "한우 육회비빔밥", ja: "韓牛ユッケビビンバ", en: "Hanwoo Raw Beef Bibimbap" },
              region: "national",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/dupe/national-hanwoo-yukhoe.jpeg",
              imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
              tasteProfile: { sweet: 30, salty: 50, spicy: 55, umami: 80, sour: 20 },
              storyDescription: {
                ko: "신선한 한우 육회가 소복이 올려진 비빔밥이에요. 고슬고슬한 밥과 각양각색의 나물, 달걀 노른자 위에 윤기 좔좔 흐르는 육회가 올려지면, 그 아름다운 모습에 비비기 전에 한참 바라보게 된답니다.",
                ja: "新鮮な韓牛のユッケがたっぷり乗ったビビンバです。ふっくらしたご飯とさまざまなナムル、卵の黄身の上にツヤツヤ輝くユッケが乗ると、その美しい姿に混ぜる前にしばらく見とれてしまいます。",
                en: "Bibimbap crowned with a generous mound of fresh raw Korean beef. When the glistening yukhoe sits atop fluffy rice, colorful namul, and a golden egg yolk, you can't help but pause and admire it before mixing."
              },
              ingredients: { ko: ["한우 육회", "밥", "나물", "달걀 노른자", "고추장", "참기름", "배"], ja: ["韓牛ユッケ", "ご飯", "ナムル", "卵の黄身", "コチュジャン", "ごま油", "梨"], en: ["Raw Korean beef", "Rice", "Namul", "Egg yolk", "Gochujang", "Sesame oil", "Korean pear"] },
              tags: ["육회", "비빔밥", "한우"],
                      dupes: {
                        JP: [],
                        CN: [],
                      },
              isLocalSpecialty: false,
            },
          {
              id: "national-yukhoe-bibimbap",
              image: "https://isixbzxophgxrfgjesaa.supabase.co/storage/v1/object/public/food-images/phoko/national-yukhoe-bibimbap.jpg",
              imageCredit: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
              name: { ko: "육회비빔밥", ja: "ユッケビビンバ", en: "Yukhoe Bibimbap" },
              region: "national",
              tasteProfile: { sweet: 20, salty: 45, spicy: 40, umami: 80, sour: 10 },
              storyDescription: { ko: "이천 쌀밥 위에 신선한 한우 육회와 나물을 올려 고추장에 비벼 먹는 프리미엄 비빔밥", ja: "利川米の上に新鮮な韓牛ユッケとナムルを乗せてコチュジャンで混ぜて食べるプレミアムビビンバ", en: "Premium bibimbap with fresh Korean beef tartare and seasoned vegetables on top of Icheon rice, mixed with gochujang" },
              ingredients: { ko: ["이천쌀밥", "한우 육회", "배", "계란 노른자", "시금치", "고추장"], ja: ["利川米", "韓牛ユッケ", "梨", "卵黄", "ほうれん草", "コチュジャン"], en: ["Icheon rice", "beef tartare", "pear", "egg yolk", "spinach", "gochujang"] },
              tags: ["이천", "쌀", "육회", "프리미엄"],
              dupes: {
                JP: [
        {
                  name: { ko: "유케동", ja: "ユッケ丼", en: "Yukhoe Don" },
                  tasteProfile: { sweet: 15, salty: 50, spicy: 5, umami: 85, sour: 8 },
                  description: { ko: "밥 위에 생 소고기 타르타르를 올려 간장 양념으로 먹는 덮밥", ja: "ご飯の上に生牛肉タルタルを乗せて醤油タレで食べる丼", en: "Rice bowl topped with raw beef tartare and soy-based sauce" },
                  ingredients: { ko: ["쌀밥", "소고기 생육", "계란 노른자", "파", "간장", "참기름"], ja: ["ご飯", "牛生肉", "卵黄", "ネギ", "醤油", "ごま油"], en: ["rice", "raw beef", "egg yolk", "scallion", "soy sauce", "sesame oil"] },
                  similarityPercent: 85,
                  matchReason: { ko: "쌀밥 위 생소고기+노른자 구성이 거의 동일합니다.", ja: "ご飯の上の生牛肉と卵黄の構成がほぼ同じです。", en: "Raw beef and egg yolk over rice — nearly identical composition." }
                ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        {
                  name: { ko: "생우육반", ja: "生牛肉飯", en: "Raw Beef Rice Bowl" },
                  tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 80, sour: 10 },
                  description: { ko: "간장과 참기름에 무친 생 소고기를 밥 위에 올린 중국식 덮밥", ja: "醤油とごま油で和えた生牛肉をご飯の上に乗せた中国式丼", en: "Chinese-style rice bowl with raw beef dressed in soy sauce and sesame oil" },
                  ingredients: { ko: ["쌀밥", "생 소고기", "간장", "참기름", "실파", "고추"], ja: ["ご飯", "生牛肉", "醤油", "ごま油", "細ネギ", "唐辛子"], en: ["rice", "raw beef", "soy sauce", "sesame oil", "scallion", "chili"] },
                  similarityPercent: 72,
                  matchReason: { ko: "생소고기를 밥에 얹는 구성이 공통됩니다.", ja: "生牛肉をご飯に乗せる構成が共通しています。", en: "Both serve raw beef over rice." }
                ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
          {
              id: "national-chapssal-tteok",
              image: "",
              name: { ko: "찹쌀떡", ja: "チャプサルトック", en: "Chapssal-tteok" },
              region: "national",
              tasteProfile: { sweet: 60, salty: 5, spicy: 0, umami: 25, sour: 0 },
              storyDescription: { ko: "이천산 찹쌀을 빻아 빚은 말랑한 떡 속에 달콤한 팥소를 넣은 전통 간식", ja: "利川産もち米でついたやわらかい餅に甘い小豆餡を包んだ伝統おやつ", en: "Chewy rice cake from Icheon sticky rice filled with sweet red bean paste" },
              ingredients: { ko: ["이천 찹쌀", "팥", "설탕", "소금", "참깨", "콩가루"], ja: ["利川もち米", "小豆", "砂糖", "塩", "ごま", "きな粉"], en: ["Icheon sticky rice", "red bean", "sugar", "salt", "sesame", "soybean powder"] },
              tags: ["이천", "떡", "전통", "간식"],
              dupes: {
                JP: [
        {
                  name: { ko: "다이후쿠", ja: "大福", en: "Daifuku" },
                  tasteProfile: { sweet: 60, salty: 3, spicy: 0, umami: 25, sour: 0 },
                  description: { ko: "찹쌀떡 속에 팥소나 크림을 넣은 일본 전통 과자", ja: "もち餅に餡やクリームを包んだ日本伝統菓子", en: "Japanese traditional confection of mochi filled with red bean or cream" },
                  ingredients: { ko: ["찹쌀가루", "팥소", "설탕", "콩가루", "소금", "녹말"], ja: ["もち米粉", "小豆餡", "砂糖", "きな粉", "塩", "片栗粉"], en: ["sticky rice flour", "red bean paste", "sugar", "soybean powder", "salt", "starch"] },
                  similarityPercent: 90,
                  matchReason: { ko: "찹쌀떡 안에 팥소를 넣은 구성이 거의 완전히 동일합니다.", ja: "もち餅に小豆餡を包む構成がほぼ完全に同じです。", en: "Mochi filled with red bean paste — virtually identical." }
                ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
                CN: [
        {
                  name: { ko: "마퇀", ja: "麻糰", en: "Matuan" },
                  tasteProfile: { sweet: 55, salty: 3, spicy: 0, umami: 25, sour: 0 },
                  description: { ko: "찹쌀 반죽에 팥소를 넣고 참깨를 묻혀 튀긴 중국식 찹쌀떡", ja: "もち米生地に小豆餡を包んでごまをつけて揚げる中国式もち菓子", en: "Chinese fried sticky rice balls filled with red bean paste and coated in sesame" },
                  ingredients: { ko: ["찹쌀가루", "팥소", "참깨", "설탕", "기름", "물"], ja: ["もち米粉", "小豆餡", "ごま", "砂糖", "油", "水"], en: ["sticky rice flour", "red bean paste", "sesame", "sugar", "oil", "water"] },
                  similarityPercent: 85,
                  matchReason: { ko: "찹쌀 반죽에 팥소를 넣는 구성이 거의 동일합니다.", ja: "もち米生地に小豆餡を包む構成がほぼ同じです。", en: "Sticky rice wrap with red bean filling — nearly identical." }
                ,
          strengths: { ko: [], ja: [], en: [] },
          limitations: { ko: [], ja: [], en: [] }
        }
      ],
              },
              isLocalSpecialty: false,
            },
    ]
  },
]
