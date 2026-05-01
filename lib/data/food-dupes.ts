export interface TasteProfile {
  sweet: number
  salty: number
  spicy: number
  umami: number
  sour: number
}

export type CountryCode = 'CN' | 'JP' | 'TH' | 'VN' | 'MY' | 'ID' | 'US' | 'IT' | 'FR' | 'IN' | 'ES' | 'MX'

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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                  JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                  US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
          JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
          US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                        JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                        US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                        JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                        US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                        JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                        US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                        JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                        US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                        JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                        US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                        JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                        US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
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
                JP: [], CN: [], TH: [], VN: [], MY: [], ID: [],
                US: [], IT: [], FR: [], IN: [], ES: [], MX: [],
              },
              isLocalSpecialty: false,
            },
    ]
  },
]
