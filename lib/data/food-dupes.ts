export interface TasteProfile {
  sweet: number
  salty: number
  spicy: number
  umami: number
  sour: number
}

export interface DupeForeignFood {
  name: { ko: string; ja: string; en: string }
  country: string
  countryFlag: string
  countryName: { ko: string; ja: string; en: string }
  tasteProfile: TasteProfile
  description: { ko: string; ja: string; en: string }
  ingredients: { ko: string[]; ja: string[]; en: string[] }
  similarityPercent: number
  matchReason: { ko: string; ja: string; en: string }
}

export interface RegionalFood {
  id: string
  name: { ko: string; ja: string; en: string }
  region: string
  image: string
  tasteProfile: TasteProfile
  storyDescription: { ko: string; ja: string; en: string }
  ingredients: { ko: string[]; ja: string[]; en: string[] }
  tags: string[]
  dupes: DupeForeignFood[]
}

export interface Region {
  code: string
  name: { ko: string; ja: string; en: string }
  icon: string
  description: { ko: string; ja: string; en: string }
  foods: RegionalFood[]
}

export const regions: Region[] = [
  {
    code: "jeonju",
    name: { ko: "전주", ja: "全州", en: "Jeonju" },
    icon: "🏛️",
    description: {
      ko: "한국 음식의 수도, 맛의 고장 전주",
      ja: "韓国料理の首都、味の故郷・全州",
      en: "The capital of Korean cuisine, Jeonju"
    },
    foods: [
      {
        id: "jeonju-bibimbap",
        name: { ko: "전주비빔밥", ja: "全州ビビンバ", en: "Jeonju Bibimbap" },
        region: "jeonju",
        image: "/images/food/jeonju-bibimbap.jpg",
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
        dupes: [
          {
            name: { ko: "마제소바", ja: "まぜそば", en: "Mazesoba" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 30, umami: 80, sour: 10 },
            description: { ko: "국물 없이 면과 토핑을 비벼 먹는 일본식 라멘", ja: "スープなしで麺とトッピングを混ぜて食べる日本式ラーメン", en: "Japanese ramen without soup, mixed with toppings" },
            ingredients: { ko: ["면", "차슈", "계란", "파", "라유"], ja: ["麺", "チャーシュー", "卵", "ネギ", "ラー油"], en: ["Noodles", "Chashu", "Egg", "Green onion", "Chili oil"] },
            similarityPercent: 74,
            matchReason: { ko: "비비는 스타일 + 계란 토핑 + 매콤한 양념의 공통점", ja: "混ぜるスタイル + 卵トッピング + ピリ辛調味料の共通点", en: "Mix-it-up style + egg topping + spicy seasoning" }
          },
          {
            name: { ko: "포케 볼", ja: "ポケボウル", en: "Poke Bowl" },
            country: "us", countryFlag: "🇺🇸",
            countryName: { ko: "미국(하와이)", ja: "アメリカ（ハワイ）", en: "USA (Hawaii)" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 20, umami: 70, sour: 25 },
            description: { ko: "밥 위에 회와 다양한 토핑을 올려 소스와 비벼 먹는 하와이 음식", ja: "ご飯の上に刺身と様々なトッピングをのせてソースと混ぜて食べるハワイ料理", en: "Hawaiian bowl with sashimi and toppings over rice, mixed with sauce" },
            ingredients: { ko: ["밥", "참치회", "아보카도", "망고", "간장소스"], ja: ["ご飯", "マグロ刺身", "アボカド", "マンゴー", "醤油ソース"], en: ["Rice", "Tuna sashimi", "Avocado", "Mango", "Soy sauce"] },
            similarityPercent: 70,
            matchReason: { ko: "밥 위에 다양한 토핑 + 비비는 스타일 + 원볼 구조", ja: "ご飯の上に様々なトッピング + 混ぜるスタイル + ワンボウル構造", en: "Various toppings on rice + mix style + one-bowl structure" }
          }
        ]
      },
      {
        id: "jeonju-kongnamul",
        name: { ko: "콩나물국밥", ja: "コンナムルクッパ", en: "Bean Sprout Rice Soup" },
        region: "jeonju",
        image: "/images/food/kongnamul-gukbap.jpg",
        tasteProfile: { sweet: 10, salty: 55, spicy: 40, umami: 75, sour: 10 },
        storyDescription: {
          ko: "아삭아삭한 콩나물이 듬뿍 들어간 뜨끈한 국물 요리예요. 추운 겨울날, 포근한 솜이불을 덮은 것처럼 배 속을 따뜻하고 편안하게 달래준답니다.",
          ja: "シャキシャキのもやしがたっぷり入った温かいスープ料理です。寒い冬の日、ふかふかの布団をかけたように、お腹を温かく優しく癒してくれます。",
          en: "A warm soup filled with crunchy bean sprouts. On a cold winter day, it soothes your belly like wrapping up in a cozy cotton blanket."
        },
        ingredients: { ko: ["콩나물", "밥", "대파", "계란", "새우젓"], ja: ["もやし", "ご飯", "長ネギ", "卵", "アミの塩辛"], en: ["Bean sprouts", "Rice", "Green onion", "Egg", "Salted shrimp"] },
        tags: ["국밥", "해장", "따뜻함"],
        dupes: [
          {
            name: { ko: "돈지루", ja: "豚汁", en: "Tonjiru" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 65, spicy: 5, umami: 90, sour: 5 },
            description: { ko: "돼지고기와 채소를 된장에 끓인 일본식 국", ja: "豚肉と野菜を味噌で煮込んだ日本の汁物", en: "Japanese miso soup with pork and vegetables" },
            ingredients: { ko: ["돼지고기", "된장", "두부", "당근", "곤약"], ja: ["豚肉", "味噌", "豆腐", "人参", "こんにゃく"], en: ["Pork", "Miso", "Tofu", "Carrot", "Konjac"] },
            similarityPercent: 75,
            matchReason: { ko: "뜨끈한 국물 + 채소 듬뿍 + 발효 양념의 깊은 맛", ja: "温かいスープ + 野菜たっぷり + 発酵調味料の深い味わい", en: "Warm broth + plenty of vegetables + deep fermented flavor" }
          }
        ]
      },
      {
        id: "jeonju-hanjeongsik",
        name: { ko: "전주 한정식", ja: "全州韓定食", en: "Jeonju Hanjeongsik" },
        region: "jeonju",
        image: "/images/food/hanjeongsik.jpg",
        tasteProfile: { sweet: 30, salty: 50, spicy: 35, umami: 80, sour: 20 },
        storyDescription: {
          ko: "마치 옛날 임금님이 드시던 수라상 같아요! 상다리가 부러질 정도로 수십 가지의 맛있는 반찬들이 커다란 상을 빈틈없이 가득 채우는 멋진 밥상이에요.",
          ja: "まるで昔の王様が召し上がった御膳のよう！テーブルの脚が折れそうなほど、何十種類もの美味しいおかずが大きなテーブルを隙間なく埋め尽くす素晴らしい食卓です。",
          en: "Like a royal feast from ancient Korea! Dozens of delicious side dishes fill a grand table so completely that the legs might just break under all that deliciousness."
        },
        ingredients: { ko: ["밥", "불고기", "전", "나물", "김치", "찌개", "구이", "회", "떡"], ja: ["ご飯", "プルコギ", "チヂミ", "ナムル", "キムチ", "チゲ", "焼き物", "刺身", "餅"], en: ["Rice", "Bulgogi", "Jeon", "Namul", "Kimchi", "Jjigae", "Grilled dishes", "Sashimi", "Rice cake"] },
        tags: ["정찬", "궁중", "반찬"],
        dupes: [
          {
            name: { ko: "가이세키 요리", ja: "懐石料理", en: "Kaiseki" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 25, salty: 40, spicy: 5, umami: 85, sour: 15 },
            description: { ko: "일본의 전통 코스 요리, 계절 식재료로 만든 예술적인 요리", ja: "日本の伝統コース料理、旬の食材で作る芸術的な料理", en: "Traditional Japanese multi-course cuisine with seasonal ingredients" },
            ingredients: { ko: ["제철 생선", "두부", "채소", "다시마", "미소"], ja: ["旬の魚", "豆腐", "野菜", "昆布", "味噌"], en: ["Seasonal fish", "Tofu", "Vegetables", "Kelp", "Miso"] },
            similarityPercent: 81,
            matchReason: { ko: "다양한 소반찬 구성 + 제철 재료 + 눈으로 먹는 아름다움", ja: "多様な小皿構成 + 旬の食材 + 目で食べる美しさ", en: "Multiple small dishes + seasonal ingredients + visual beauty" }
          }
        ]
      },
      {
        id: "jeonju-tteokgalbi",
        name: { ko: "전주 떡갈비", ja: "全州トッカルビ", en: "Jeonju Tteokgalbi" },
        region: "jeonju",
        image: "/images/food/tteokgalbi.jpg",
        tasteProfile: { sweet: 50, salty: 55, spicy: 10, umami: 75, sour: 5 },
        storyDescription: {
          ko: "고기를 아주 잘게 다져서 도톰하게 뭉친 다음 불에 구워낸 요리예요. 질기지 않아 씹을 필요도 없이 부드럽고, 달콤 짭짤해서 밥도둑이 따로 없어요.",
          ja: "お肉をとても細かく刻んで厚く丸めてから火で焼いた料理です。硬くないので噛む必要もないほど柔らかく、甘じょっぱくてご飯が止まらなくなります。",
          en: "Finely minced meat shaped into thick patties and grilled. So tender you barely need to chew, and the sweet-salty flavor makes it the ultimate rice companion."
        },
        ingredients: { ko: ["소갈비살", "간장", "배", "마늘", "참기름", "꿀"], ja: ["牛カルビ肉", "醤油", "梨", "ニンニク", "ごま油", "蜂蜜"], en: ["Beef rib meat", "Soy sauce", "Pear", "Garlic", "Sesame oil", "Honey"] },
        tags: ["고기", "달콤", "부드러움"],
        dupes: [
          {
            name: { ko: "츠쿠네", ja: "つくね", en: "Tsukune" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 45, salty: 50, spicy: 5, umami: 70, sour: 5 },
            description: { ko: "다진 닭고기를 뭉쳐서 달콤한 타레 소스를 발라 구운 꼬치", ja: "鶏ひき肉を丸めて甘いタレを塗って焼いた串", en: "Minced chicken shaped and grilled with sweet tare sauce" },
            ingredients: { ko: ["닭고기", "간장", "미림", "설탕", "계란"], ja: ["鶏肉", "醤油", "みりん", "砂糖", "卵"], en: ["Chicken", "Soy sauce", "Mirin", "Sugar", "Egg"] },
            similarityPercent: 77,
            matchReason: { ko: "다진 고기를 뭉쳐 구운 스타일 + 달콤짭짤한 간장 양념", ja: "ひき肉を丸めて焼くスタイル + 甘じょっぱい醤油ダレ", en: "Minced meat shaped & grilled + sweet-salty soy glaze" }
          }
        ]
      },
      {
        id: "jeonju-kalguksu",
        name: { ko: "전주식 칼국수", ja: "全州式カルグクス", en: "Jeonju Kalguksu" },
        region: "jeonju",
        image: "/images/food/kalguksu.jpg",
        tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 85, sour: 5 },
        storyDescription: {
          ko: "들깨가루라는 고소한 가루가 눈보라처럼 듬뿍 뿌려져 있어요. 일반 국수와 달리, 국물이 수프처럼 아주 진하고 고소한 것이 특징이에요.",
          ja: "エゴマの粉という香ばしい粉が吹雪のようにたっぷりかかっています。普通の麺と違って、スープがポタージュのようにとても濃厚で香ばしいのが特徴です。",
          en: "Covered in a blizzard of nutty perilla seed powder. Unlike regular noodles, the broth is incredibly rich and creamy, more like a thick soup than clear broth."
        },
        ingredients: { ko: ["칼국수면", "들깨가루", "멸치육수", "감자", "호박"], ja: ["カルグクス麺", "エゴマ粉", "煮干しだし", "ジャガイモ", "カボチャ"], en: ["Knife-cut noodles", "Perilla powder", "Anchovy broth", "Potato", "Zucchini"] },
        tags: ["면", "고소함", "들깨"],
        dupes: [
          {
            name: { ko: "크림 우동", ja: "クリームうどん", en: "Cream Udon" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 40, spicy: 0, umami: 80, sour: 5 },
            description: { ko: "크림 소스에 쫄깃한 우동면을 넣은 퓨전 요리", ja: "クリームソースにもちもちうどんを入れたフュージョン料理", en: "Fusion dish with chewy udon in cream sauce" },
            ingredients: { ko: ["우동면", "생크림", "버터", "파르메산", "버섯"], ja: ["うどん", "生クリーム", "バター", "パルメザン", "きのこ"], en: ["Udon", "Heavy cream", "Butter", "Parmesan", "Mushroom"] },
            similarityPercent: 72,
            matchReason: { ko: "진하고 크리미한 국물 + 쫄깃한 면 + 고소한 풍미", ja: "濃厚でクリーミーなスープ + もちもち麺 + 香ばしい風味", en: "Rich creamy broth + chewy noodles + nutty flavor" }
          }
        ]
      },
      {
        id: "jeonju-muljjajang",
        name: { ko: "물짜장", ja: "ムルチャジャン", en: "Mul-jjajang" },
        region: "jeonju",
        image: "/images/food/muljjajang.jpg",
        tasteProfile: { sweet: 25, salty: 55, spicy: 50, umami: 65, sour: 15 },
        storyDescription: {
          ko: "이름은 짜장면인데 색깔이 까맣지 않고 빨간색이나 하얀색이에요! 짬뽕처럼 매콤하면서도, 짜장면처럼 소스가 면에 착 달라붙는 마법 같은 요리랍니다.",
          ja: "名前はジャジャン麺なのに、色が黒くなくて赤や白なんです！チャンポンのように辛くて、ジャジャン麺のようにソースが麺にピタッとくっつく魔法のような料理です。",
          en: "It's called jjajang but it's not black — it's red or white! Spicy like jjamppong, yet the sauce clings to the noodles like magic, just like jjajangmyeon."
        },
        ingredients: { ko: ["중면", "춘장", "해물", "양파", "고추기름", "육수"], ja: ["中華麺", "チュンジャン", "海鮮", "玉ねぎ", "唐辛子油", "スープ"], en: ["Chinese noodles", "Black bean paste", "Seafood", "Onion", "Chili oil", "Broth"] },
        tags: ["면", "매콤", "퓨전"],
        dupes: [
          {
            name: { ko: "탄탄멘", ja: "担々麺", en: "Tantanmen" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 55, spicy: 65, umami: 75, sour: 10 },
            description: { ko: "매콤하고 고소한 참깨 국물의 일본식 라멘", ja: "ピリ辛で香ばしいゴマスープの日本式ラーメン", en: "Japanese ramen with spicy and nutty sesame broth" },
            ingredients: { ko: ["면", "참깨", "고추기름", "다진고기", "청경채"], ja: ["麺", "ゴマ", "ラー油", "ひき肉", "チンゲン菜"], en: ["Noodles", "Sesame", "Chili oil", "Ground pork", "Bok choy"] },
            similarityPercent: 73,
            matchReason: { ko: "매콤한 국물 면 + 고추기름 + 고소한 소스가 면에 감기는 맛", ja: "辛いスープ麺 + ラー油 + 香ばしいソースが麺に絡む味", en: "Spicy broth noodles + chili oil + rich sauce clinging to noodles" }
          }
        ]
      },
      {
        id: "jeonju-pisundae",
        name: { ko: "피순대와 순대국밥", ja: "ピスンデとスンデクッパ", en: "Blood Sausage Soup" },
        region: "jeonju",
        image: "/images/food/sundae-gukbap.jpg",
        tasteProfile: { sweet: 10, salty: 60, spicy: 35, umami: 85, sour: 5 },
        storyDescription: {
          ko: "우리가 흔히 아는 얇은 당면 순대와 달라요. 고기와 채소 등 영양 만점 재료로 속을 꽉 채워서, 아주 든든하고 진한 맛이 나는 한국식 소시지라고 할 수 있어요.",
          ja: "よく知られている春雨のスンデとは違います。肉や野菜など栄養満点の材料でぎっしり中身を詰めていて、とてもボリュームがあり濃厚な味の韓国式ソーセージと言えます。",
          en: "Unlike the common glass-noodle sundae, this is packed full of meat and vegetables — a hearty, rich Korean sausage that fills you up with deep, satisfying flavor."
        },
        ingredients: { ko: ["돼지 창", "선지", "찹쌀", "배추", "부추", "들깨가루"], ja: ["豚の腸", "牛の血", "もち米", "白菜", "ニラ", "エゴマ粉"], en: ["Pork intestine", "Blood", "Glutinous rice", "Cabbage", "Chive", "Perilla powder"] },
        tags: ["순대", "국밥", "든든함"],
        dupes: [
          {
            name: { ko: "블랙 푸딩", ja: "ブラックプディング", en: "Black Pudding" },
            country: "gb", countryFlag: "🇬🇧",
            countryName: { ko: "영국", ja: "イギリス", en: "UK" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 80, sour: 5 },
            description: { ko: "돼지피와 귀리, 지방을 넣어 만든 영국 전통 소시지", ja: "豚の血とオーツ麦、脂肪を入れて作ったイギリスの伝統ソーセージ", en: "Traditional British sausage made with pig's blood, oats, and fat" },
            ingredients: { ko: ["돼지피", "귀리", "돼지기름", "양파", "향신료"], ja: ["豚の血", "オーツ麦", "豚の脂", "玉ねぎ", "スパイス"], en: ["Pig's blood", "Oats", "Pork fat", "Onion", "Spices"] },
            similarityPercent: 79,
            matchReason: { ko: "피와 곡물을 넣어 만든 소시지 + 진하고 든든한 맛", ja: "血と穀物を入れて作るソーセージ + 濃厚で満腹感のある味", en: "Blood & grain sausage + rich, filling flavor" }
          }
        ]
      },
      {
        id: "jeonju-omogaritang",
        name: { ko: "오모가리탕", ja: "オモガリタン", en: "Omogaritang" },
        region: "jeonju",
        image: "/images/food/omogaritang.jpg",
        tasteProfile: { sweet: 15, salty: 55, spicy: 65, umami: 80, sour: 10 },
        storyDescription: {
          ko: "'오모가리'는 뚝배기라는 숨 쉬는 흙그릇을 부르는 전주의 옛날 말이에요. 이 그릇에 쫄깃한 물고기와 시래기를 넣고 얼큰하게 끓여내서 아주 깊은 맛이 나요.",
          ja: "「オモガリ」はトゥッペギという呼吸する土鍋を呼ぶ全州の昔の言葉です。この器にプリプリの魚とシレギ（干した大根の葉）を入れてピリ辛に煮込んで、とても深い味わいがします。",
          en: "'Omogari' is an old Jeonju word for a 'breathing' earthen pot. Chewy fish and dried radish greens are simmered in this pot to create an incredibly deep, spicy broth."
        },
        ingredients: { ko: ["민물고기", "시래기", "된장", "고추장", "대파", "마늘"], ja: ["川魚", "シレギ", "テンジャン", "コチュジャン", "長ネギ", "ニンニク"], en: ["Freshwater fish", "Dried radish greens", "Doenjang", "Gochujang", "Green onion", "Garlic"] },
        tags: ["생선", "얼큰함", "전통"],
        dupes: [
          {
            name: { ko: "부이야베스", ja: "ブイヤベース", en: "Bouillabaisse" },
            country: "fr", countryFlag: "🇫🇷",
            countryName: { ko: "프랑스", ja: "フランス", en: "France" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 20, umami: 85, sour: 15 },
            description: { ko: "다양한 생선과 해산물을 토마토 국물에 끓인 프랑스 남부 전통 요리", ja: "様々な魚介類をトマトスープで煮込んだ南フランスの伝統料理", en: "Traditional Southern French stew with various fish in tomato broth" },
            ingredients: { ko: ["생선", "새우", "토마토", "사프란", "마늘"], ja: ["魚", "海老", "トマト", "サフラン", "ニンニク"], en: ["Fish", "Shrimp", "Tomato", "Saffron", "Garlic"] },
            similarityPercent: 72,
            matchReason: { ko: "생선 국물 요리 + 진한 육수 + 전통 토속 요리의 깊은 맛", ja: "魚のスープ料理 + 濃厚なスープ + 伝統郷土料理の深い味", en: "Fish stew + rich broth + deep flavor of traditional local cuisine" }
          }
        ]
      },
      {
        id: "jeonju-chocopie",
        name: { ko: "수제 초코파이", ja: "手作りチョコパイ", en: "Handmade Choco Pie" },
        region: "jeonju",
        image: "/images/food/chocopie.jpg",
        tasteProfile: { sweet: 90, salty: 10, spicy: 0, umami: 15, sour: 5 },
        storyDescription: {
          ko: "전주의 유명한 빵집에서 직접 구워내는 거대한 초콜릿 과자예요. 부드러운 빵 사이에 달콤한 크림과 딸기잼이 가득 들어 있어서 최고로 인기 있는 디저트랍니다.",
          ja: "全州の有名なパン屋さんが直接焼き上げる巨大なチョコレートお菓子です。柔らかいパンの間に甘いクリームとイチゴジャムがたっぷり入っていて、最高に人気のデザートです。",
          en: "A giant chocolate treat baked fresh at Jeonju's famous bakery. Soft bread sandwiching sweet cream and strawberry jam — the most popular dessert in town."
        },
        ingredients: { ko: ["초콜릿", "밀가루", "생크림", "딸기잼", "버터"], ja: ["チョコレート", "小麦粉", "生クリーム", "イチゴジャム", "バター"], en: ["Chocolate", "Flour", "Fresh cream", "Strawberry jam", "Butter"] },
        tags: ["디저트", "달콤", "빵"],
        dupes: [
          {
            name: { ko: "도라야키", ja: "どら焼き", en: "Dorayaki" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 85, salty: 5, spicy: 0, umami: 10, sour: 0 },
            description: { ko: "부드러운 카스텔라 반죽 사이에 달콤한 팥소를 넣은 일본 과자", ja: "柔らかいカステラ生地の間に甘いあんこを入れた日本のお菓子", en: "Sweet red bean paste sandwiched between fluffy castella pancakes" },
            ingredients: { ko: ["밀가루", "팥앙금", "계란", "설탕", "꿀"], ja: ["小麦粉", "あんこ", "卵", "砂糖", "蜂蜜"], en: ["Flour", "Red bean paste", "Egg", "Sugar", "Honey"] },
            similarityPercent: 76,
            matchReason: { ko: "부드러운 빵 사이에 달콤한 필링 + 수제 간식의 정겨움", ja: "柔らかいパンの間に甘いフィリング + 手作りおやつの温もり", en: "Sweet filling between soft bread + warmth of handmade snacks" }
          }
        ]
      },
      {
        id: "jeonju-baguette-burger",
        name: { ko: "바게트 버거", ja: "バゲットバーガー", en: "Baguette Burger" },
        region: "jeonju",
        image: "/images/food/baguette-burger.jpg",
        tasteProfile: { sweet: 25, salty: 55, spicy: 45, umami: 60, sour: 10 },
        storyDescription: {
          ko: "바게트의 속을 파내고, 그 안에 매콤달콤하게 볶은 고기와 아삭한 양배추를 가득 채워 넣었어요. 겉은 바삭하고 속은 꽉 찬 재미있는 간식이랍니다.",
          ja: "バゲットの中身をくり抜いて、甘辛く炒めた肉とシャキシャキのキャベツをぎゅうぎゅうに詰め込みました。外はカリカリ、中はぎっしり詰まった楽しいおやつです。",
          en: "A hollowed-out baguette stuffed with sweet-spicy stir-fried meat and crunchy cabbage. Crispy outside, packed inside — a fun and delicious snack."
        },
        ingredients: { ko: ["바게트", "소고기", "양배추", "고추장", "마요네즈"], ja: ["バゲット", "牛肉", "キャベツ", "コチュジャン", "マヨネーズ"], en: ["Baguette", "Beef", "Cabbage", "Gochujang", "Mayonnaise"] },
        tags: ["간식", "바삭", "퓨전"],
        dupes: [
          {
            name: { ko: "반미", ja: "バインミー", en: "Banh Mi" },
            country: "vn", countryFlag: "🇻🇳",
            countryName: { ko: "베트남", ja: "ベトナム", en: "Vietnam" },
            tasteProfile: { sweet: 20, salty: 50, spicy: 35, umami: 55, sour: 30 },
            description: { ko: "바게트에 고기, 채소, 소스를 넣은 베트남 대표 샌드위치", ja: "バゲットに肉、野菜、ソースを入れたベトナムの代表的なサンドイッチ", en: "Vietnamese signature sandwich with meat, vegetables, and sauce in a baguette" },
            ingredients: { ko: ["바게트", "돼지고기", "당근절임", "무절임", "고수", "칠리소스"], ja: ["バゲット", "豚肉", "人参の甘酢漬け", "大根の甘酢漬け", "パクチー", "チリソース"], en: ["Baguette", "Pork", "Pickled carrot", "Pickled radish", "Cilantro", "Chili sauce"] },
            similarityPercent: 82,
            matchReason: { ko: "바게트 빵 + 고기 속 재료 + 매콤한 소스의 완벽한 조합", ja: "バゲットパン + 肉の具材 + ピリ辛ソースの完璧な組み合わせ", en: "Baguette bread + meat filling + spicy sauce — perfect combo" }
          }
        ]
      }
    ]
  },
  {
    code: "seoul",
    name: { ko: "서울", ja: "ソウル", en: "Seoul" },
    icon: "🏙️",
    description: { ko: "천 가지 맛이 공존하는 대한민국의 수도", ja: "千の味が共存する大韓民国の首都", en: "Korea's capital where a thousand flavors coexist" },
    foods: []
  },
  {
    code: "tongyeong",
    name: { ko: "통영", ja: "統営", en: "Tongyeong" },
    icon: "🌊",
    description: { ko: "바다의 맛을 품은 남해안의 보석", ja: "海の味を抱く南海岸の宝石", en: "A gem of the southern coast embracing ocean flavors" },
    foods: []
  },
  {
    code: "jeju",
    name: { ko: "제주", ja: "済州", en: "Jeju" },
    icon: "🏝️",
    description: { ko: "섬이 키운 독특한 맛의 세계", ja: "島が育んだ独特な味の世界", en: "A world of unique flavors nurtured by the island" },
    foods: []
  },
  {
    code: "busan",
    name: { ko: "부산", ja: "釜山", en: "Busan" },
    icon: "🌉",
    description: { ko: "항구 도시의 호쾌한 맛", ja: "港町の豪快な味", en: "Bold flavors of the port city" },
    foods: []
  },
  {
    code: "gyeongju",
    name: { ko: "경주", ja: "慶州", en: "Gyeongju" },
    icon: "👑",
    description: { ko: "천년 고도의 전통 맛", ja: "千年古都の伝統の味", en: "Traditional flavors of the ancient capital" },
    foods: []
  }
]
