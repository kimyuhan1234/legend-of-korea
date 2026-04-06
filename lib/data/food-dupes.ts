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
    image: "/images/village/seoul.jpg",
    description: { ko: "천 가지 맛이 공존하는 대한민국의 수도", ja: "千の味が共存する大韓民国の首都", en: "Korea's capital where a thousand flavors coexist" },
    foods: [
      {
        id: "seoul-samgyeopsal",
        name: { ko: "삼겹살", ja: "サムギョプサル", en: "Samgyeopsal" },
        region: "seoul",
        image: "/images/food/seo-samgyeopsal.jpg",
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
        dupes: [
          {
            name: { ko: "야키니쿠 철판구이", ja: "焼肉鉄板焼き", en: "Yakiniku Teppanyaki" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 30, salty: 50, spicy: 5, umami: 85, sour: 5 },
            description: { ko: "얇게 저민 고기를 달콤한 타레 소스에 찍어 철판 위에서 구워 먹는 일본식 바비큐", ja: "薄切り肉を甘いタレにつけて鉄板で焼いて食べる日本式バーベキュー", en: "Japanese BBQ of thinly sliced meat grilled on a teppan and dipped in sweet tare sauce" },
            ingredients: { ko: ["소고기", "돼지고기", "간장", "미림", "설탕", "참기름"], ja: ["牛肉", "豚肉", "醤油", "みりん", "砂糖", "ごま油"], en: ["Beef", "Pork", "Soy sauce", "Mirin", "Sugar", "Sesame oil"] },
            similarityPercent: 82,
            matchReason: { ko: "철판 위 직화구이 + 쌈 채소 + 고소한 참기름의 공통된 매력", ja: "鉄板直火焼き + 包み野菜 + 香ばしいごま油の共通の魅力", en: "Direct iron-plate grilling + wrapping greens + shared sesame-oil richness" }
          }
        ]
      },
      {
        id: "seoul-tteokbokki",
        name: { ko: "떡볶이", ja: "トッポッキ", en: "Tteokbokki" },
        region: "seoul",
        image: "/images/food/seo-tteokbokki.jpg",
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
        dupes: [
          {
            name: { ko: "모찌 나베", ja: "もち鍋", en: "Mochi Nabe" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 25, salty: 55, spicy: 10, umami: 70, sour: 5 },
            description: { ko: "쫄깃한 모찌를 채소와 두부와 함께 끓여 먹는 일본 겨울 냄비 요리", ja: "もちもちのお餅を野菜や豆腐と一緒に煮て食べる日本の冬の鍋料理", en: "Japanese winter hot pot with chewy mochi simmered alongside vegetables and tofu" },
            ingredients: { ko: ["모찌", "두부", "배추", "버섯", "간장", "다시마"], ja: ["もち", "豆腐", "白菜", "きのこ", "醤油", "昆布"], en: ["Mochi", "Tofu", "Cabbage", "Mushroom", "Soy sauce", "Kelp"] },
            similarityPercent: 70,
            matchReason: { ko: "쫄깃한 떡 형태 + 달콤짭짤한 국물 소스 + 따뜻한 일품 요리", ja: "もちもちの餅形状 + 甘じょっぱいスープソース + 温かい一品料理", en: "Chewy rice-cake texture + sweet-salty sauce broth + warm one-dish comfort" }
          }
        ]
      },
      {
        id: "seoul-dakhanmari",
        name: { ko: "닭한마리", ja: "タッハンマリ", en: "Dakhanmari" },
        region: "seoul",
        image: "/images/food/seo-dakhanmari.jpg",
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
        dupes: [
          {
            name: { ko: "미즈타키", ja: "水炊き", en: "Mizutaki" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 35, spicy: 5, umami: 90, sour: 5 },
            description: { ko: "닭고기를 맑은 국물에 푹 끓인 후쿠오카 대표 냄비 요리", ja: "鶏肉を澄んだスープでじっくり煮込んだ福岡の代表的な鍋料理", en: "Fukuoka's signature hot pot of chicken slowly simmered in clear broth" },
            ingredients: { ko: ["닭고기", "두부", "배추", "대파", "폰즈소스", "모미지오로시"], ja: ["鶏肉", "豆腐", "白菜", "長ネギ", "ポン酢", "もみじおろし"], en: ["Chicken", "Tofu", "Cabbage", "Green onion", "Ponzu sauce", "Grated radish chili"] },
            similarityPercent: 83,
            matchReason: { ko: "통닭 맑은 국물 + 테이블 냄비 요리 + 진한 육수의 공통점", ja: "丸鶏の澄んだスープ + テーブル鍋料理 + 濃厚な出汁の共通点", en: "Whole chicken clear broth + tableside hot pot + deeply flavored stock" }
          }
        ]
      },
      {
        id: "seoul-seolleongtang",
        name: { ko: "설렁탕", ja: "ソルロンタン", en: "Seolleongtang" },
        region: "seoul",
        image: "/images/food/seo-seolleongtang.jpg",
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
        dupes: [
          {
            name: { ko: "돈코츠 라멘", ja: "豚骨ラーメン", en: "Tonkotsu Ramen" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 60, spicy: 10, umami: 95, sour: 0 },
            description: { ko: "돼지 뼈를 장시간 끓여 만든 진하고 크리미한 국물의 일본 라멘", ja: "豚骨を長時間煮込んで作った濃厚でクリーミーなスープの日本ラーメン", en: "Japanese ramen with rich, creamy broth made from long-simmered pork bones" },
            ingredients: { ko: ["돼지뼈", "라멘면", "차슈", "반숙달걀", "대파", "생강"], ja: ["豚骨", "ラーメン麺", "チャーシュー", "半熟卵", "長ネギ", "生姜"], en: ["Pork bone", "Ramen noodles", "Chashu", "Soft-boiled egg", "Green onion", "Ginger"] },
            similarityPercent: 80,
            matchReason: { ko: "뽀얀 뼈 국물 + 오랜 시간 우려낸 깊은 맛 + 면이나 밥을 말아 먹는 스타일", ja: "白濁した骨スープ + 長時間煮込んだ深い味わい + 麺やご飯を入れて食べるスタイル", en: "Milky bone broth + long-simmered deep flavor + served with noodles or rice" }
          }
        ]
      },
      {
        id: "seoul-street-toast",
        name: { ko: "길거리 토스트", ja: "屋台トースト", en: "Street Toast" },
        region: "seoul",
        image: "/images/food/seo-street-toast.jpg",
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
        dupes: [
          {
            name: { ko: "핫 샌드위치", ja: "ホットサンドイッチ", en: "Hot Sandwich" },
            country: "us",
            countryFlag: "🇺🇸",
            countryName: { ko: "미국", ja: "アメリカ", en: "USA" },
            tasteProfile: { sweet: 25, salty: 50, spicy: 10, umami: 55, sour: 15 },
            description: { ko: "철판이나 그릴에 눌러 구운 달걀과 채소가 든 미국식 샌드위치", ja: "鉄板やグリルで押しつけて焼いた卵と野菜入りのアメリカ式サンドイッチ", en: "American-style sandwich pressed and grilled on a griddle with egg and vegetables" },
            ingredients: { ko: ["식빵", "달걀", "치즈", "양상추", "토마토", "머스터드"], ja: ["食パン", "卵", "チーズ", "レタス", "トマト", "マスタード"], en: ["Bread", "Egg", "Cheese", "Lettuce", "Tomato", "Mustard"] },
            similarityPercent: 75,
            matchReason: { ko: "구운 식빵 + 달걀과 채소 속재료 + 빠른 아침 식사의 공통된 역할", ja: "焼いた食パン + 卵と野菜の具材 + 素早い朝食としての共通の役割", en: "Toasted bread + egg and veggie filling + shared role as a quick morning meal" }
          }
        ]
      },
      {
        id: "seoul-bindaetteok",
        name: { ko: "광장시장 빈대떡", ja: "広蔵市場のビンデトク", en: "Gwangjang Market Bindaetteok" },
        region: "seoul",
        image: "/images/food/seo-bindaetteok.jpg",
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
        dupes: [
          {
            name: { ko: "오코노미야키", ja: "お好み焼き", en: "Okonomiyaki" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 30, salty: 45, spicy: 10, umami: 75, sour: 10 },
            description: { ko: "밀가루 반죽에 양배추와 각종 재료를 넣고 철판에 부쳐 소스를 뿌린 일본 부침개", ja: "小麦粉の生地にキャベツや様々な具材を入れて鉄板で焼いてソースをかけた日本のお好み焼き", en: "Japanese savory pancake with cabbage and various ingredients grilled on a teppan and topped with sauce" },
            ingredients: { ko: ["밀가루", "양배추", "달걀", "돼지고기", "오코노미야키 소스", "가쓰오부시"], ja: ["小麦粉", "キャベツ", "卵", "豚肉", "お好みソース", "鰹節"], en: ["Flour", "Cabbage", "Egg", "Pork", "Okonomiyaki sauce", "Bonito flakes"] },
            similarityPercent: 78,
            matchReason: { ko: "철판 기름 전 + 고기와 채소 혼합 반죽 + 고소하고 바삭한 식감", ja: "鉄板油焼き + 肉と野菜混合生地 + 香ばしくカリカリな食感", en: "Iron-plate oil pancake + meat-vegetable batter + crispy savory texture" }
          }
        ]
      },
      {
        id: "seoul-yukhoe",
        name: { ko: "육회", ja: "ユッケ", en: "Yukhoe" },
        region: "seoul",
        image: "/images/food/seo-yukhoe.jpg",
        tasteProfile: { sweet: 30, salty: 50, spicy: 20, umami: 80, sour: 20 },
        storyDescription: {
          ko: "신선한 소고기를 가늘게 채 썰어 배와 함께 달콤 고소하게 무친 날것의 아름다움이에요. 노른자가 터지는 순간 모든 재료가 하나로 어우러지는 그 황홀한 맛을 잊을 수가 없어요.",
          ja: "新鮮な牛肉を細かく千切りにして梨と一緒に甘く香ばしく和えた生の美しさです。卵黄が割れる瞬間、すべての食材がひとつになるあの陶酔的な味が忘れられません。",
          en: "Fresh beef finely julienned and tossed with pear in a sweet, nutty dressing — raw beauty on a plate. The moment the egg yolk breaks and binds everything together is a taste you cannot forget."
        },
        ingredients: {
          ko: ["소고기 우둔", "배", "계란 노른자", "간장", "참기름", "설탕", "마늘", "잣"],
          ja: ["牛もも肉", "梨", "卵黄", "醤油", "ごま油", "砂糖", "ニンニク", "松の実"],
          en: ["Beef round", "Asian pear", "Egg yolk", "Soy sauce", "Sesame oil", "Sugar", "Garlic", "Pine nut"]
        },
        tags: ["날것", "소고기", "신선"],
        dupes: [
          {
            name: { ko: "소고기 타타키", ja: "牛肉のたたき", en: "Beef Tataki" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 45, spicy: 10, umami: 80, sour: 25 },
            description: { ko: "소고기 표면만 살짝 구워 얇게 썰어 폰즈 소스로 즐기는 일본 요리", ja: "牛肉の表面だけさっと炙って薄く切り、ポン酢で楽しむ日本料理", en: "Japanese dish of beef seared only on the outside, thinly sliced and served with ponzu sauce" },
            ingredients: { ko: ["소고기", "폰즈소스", "대파", "생강", "무", "참기름"], ja: ["牛肉", "ポン酢", "長ネギ", "生姜", "大根", "ごま油"], en: ["Beef", "Ponzu sauce", "Green onion", "Ginger", "Radish", "Sesame oil"] },
            similarityPercent: 76,
            matchReason: { ko: "생 또는 반생 소고기 + 달콤 짭짤 드레싱 + 신선한 날것의 향미", ja: "生または半生の牛肉 + 甘じょっぱいドレッシング + 新鮮な生の香り", en: "Raw or near-raw beef + sweet-salty dressing + fresh, clean rawness" }
          }
        ]
      },
      {
        id: "seoul-hangang-ramen",
        name: { ko: "한강 라면", ja: "漢江ラーメン", en: "Hangang Ramen" },
        region: "seoul",
        image: "/images/food/seo-hangang-ramen.jpg",
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
        dupes: [
          {
            name: { ko: "컵라면 (일본 원조)", ja: "カップラーメン（日本原点）", en: "Cup Noodles (Japanese Original)" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 70, spicy: 20, umami: 65, sour: 5 },
            description: { ko: "뜨거운 물만 부으면 완성되는 세계 최초의 컵 인스턴트 라면", ja: "熱湯を注ぐだけで完成する世界初のカップインスタントラーメン", en: "The world's first cup instant ramen — complete with just a pour of hot water" },
            ingredients: { ko: ["밀가루면", "건조 채소", "건조 새우", "조미 분말", "건조 파"], ja: ["小麦麺", "乾燥野菜", "乾燥えび", "調味粉末", "乾燥ネギ"], en: ["Wheat noodles", "Dried vegetables", "Dried shrimp", "Seasoning powder", "Dried green onion"] },
            similarityPercent: 72,
            matchReason: { ko: "컵에 뜨거운 물을 붓는 간편함 + 야외에서 즐기는 인스턴트 면 문화", ja: "カップに熱湯を注ぐ手軽さ + 屋外で楽しむインスタント麺文化", en: "Cup + hot water simplicity + outdoor instant noodle culture" }
          }
        ]
      },
      {
        id: "seoul-jokbal",
        name: { ko: "족발", ja: "チョクパル", en: "Jokbal" },
        region: "seoul",
        image: "/images/food/seo-jokbal.jpg",
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
        dupes: [
          {
            name: { ko: "차슈", ja: "チャーシュー", en: "Chashu" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 40, salty: 50, spicy: 5, umami: 80, sour: 5 },
            description: { ko: "간장과 미림, 설탕으로 조린 일본 라멘의 대표 토핑 돼지 수육", ja: "醤油とみりん、砂糖で煮込んだ日本ラーメンの代表的なトッピング豚肉", en: "Japanese braised pork in soy, mirin, and sugar — the definitive ramen topping" },
            ingredients: { ko: ["돼지 삼겹살", "간장", "미림", "설탕", "청주", "생강"], ja: ["豚バラ肉", "醤油", "みりん", "砂糖", "清酒", "生姜"], en: ["Pork belly", "Soy sauce", "Mirin", "Sugar", "Sake", "Ginger"] },
            similarityPercent: 78,
            matchReason: { ko: "간장 기반 장시간 조림 + 달콤짭짤한 돼지고기 + 쫄깃 부드러운 식감", ja: "醤油ベースの長時間煮込み + 甘じょっぱい豚肉 + もちもち柔らかい食感", en: "Long soy-based braise + sweet-salty pork + chewy yet tender texture" }
          }
        ]
      },
      {
        id: "seoul-kimchi-jjigae",
        name: { ko: "김치찌개", ja: "キムチチゲ", en: "Kimchi Jjigae" },
        region: "seoul",
        image: "/images/food/seo-kimchi-jjigae.jpg",
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
        dupes: [
          {
            name: { ko: "나베", ja: "鍋料理", en: "Nabe" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 15, umami: 85, sour: 10 },
            description: { ko: "다양한 재료를 하나의 냄비에 넣고 끓여 함께 나눠 먹는 일본 전통 냄비 요리", ja: "様々な食材をひとつの鍋に入れて煮込んで一緒に分けて食べる日本の伝統鍋料理", en: "Traditional Japanese hot pot with various ingredients simmered together and shared" },
            ingredients: { ko: ["두부", "배추", "버섯", "돼지고기", "다시마", "미소", "대파"], ja: ["豆腐", "白菜", "きのこ", "豚肉", "昆布", "味噌", "長ネギ"], en: ["Tofu", "Cabbage", "Mushroom", "Pork", "Kelp", "Miso", "Green onion"] },
            similarityPercent: 77,
            matchReason: { ko: "냄비 통째 끓임 + 두부 배추 돼지 조합 + 발효 양념의 진한 국물", ja: "鍋ごと煮込み + 豆腐・白菜・豚肉の組み合わせ + 発酵調味料の濃厚スープ", en: "Pot-simmered + tofu-cabbage-pork combo + fermented seasoning deep broth" }
          }
        ]
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
        image: "/images/food/ton-chungmu-gimbap.jpg",
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
        dupes: [
          {
            name: { ko: "마키스시", ja: "巻き寿司", en: "Maki Sushi" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 45, spicy: 15, umami: 65, sour: 35 },
            description: { ko: "밥과 해산물을 김으로 말아 만든 일본 대표 스시 스타일", ja: "ご飯と海鮮をのりで巻いた日本の代表的な寿司スタイル", en: "Japan's classic sushi style of rice and seafood rolled in seaweed" },
            ingredients: { ko: ["초밥", "김", "참치", "오이", "아보카도", "와사비"], ja: ["酢飯", "のり", "マグロ", "きゅうり", "アボカド", "わさび"], en: ["Sushi rice", "Seaweed", "Tuna", "Cucumber", "Avocado", "Wasabi"] },
            similarityPercent: 73,
            matchReason: { ko: "김으로 만 밥 + 해산물 조합 + 한 입 크기 구성의 공통점", ja: "のりで巻いたご飯 + 海鮮の組み合わせ + ひと口サイズ構成の共通点", en: "Rice wrapped in seaweed + seafood pairing + bite-size format" }
          }
        ]
      },
      {
        id: "tongyeong-kkul-ppang",
        name: { ko: "꿀빵", ja: "蜂蜜パン", en: "Kkul-ppang" },
        region: "tongyeong",
        image: "/images/food/ton-kkul-ppang.jpg",
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
        dupes: [
          {
            name: { ko: "카린토만주", ja: "かりんとう饅頭", en: "Karinto Manju" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 75, salty: 10, spicy: 0, umami: 10, sour: 0 },
            description: { ko: "튀긴 만주 피에 달콤한 팥소를 넣은 일본의 인기 과자", ja: "揚げた饅頭皮に甘いあんこを入れた日本の人気お菓子", en: "Popular Japanese sweet with fried pastry shell and sweet red bean filling" },
            ingredients: { ko: ["밀가루", "흑설탕", "팥앙금", "식용유", "소금"], ja: ["小麦粉", "黒砂糖", "あんこ", "食用油", "塩"], en: ["Flour", "Brown sugar", "Red bean paste", "Cooking oil", "Salt"] },
            similarityPercent: 80,
            matchReason: { ko: "튀긴 반죽 + 팥 필링 + 바삭한 겉과 촉촉한 속의 동일한 구조", ja: "揚げた生地 + あんこフィリング + カリカリの外としっとりした中の同じ構造", en: "Fried dough + red bean filling + same crispy-outside moist-inside structure" }
          }
        ]
      },
      {
        id: "tongyeong-meongge-bibimbap",
        name: { ko: "멍게비빔밥", ja: "ホヤビビンバ", en: "Meongge Bibimbap" },
        region: "tongyeong",
        image: "/images/food/ton-meongge-bibimbap.jpg",
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
        dupes: [
          {
            name: { ko: "호야 덮밥", ja: "ホヤ丼", en: "Hoya Don" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 90, sour: 20 },
            description: { ko: "일본 미야기현에서 즐기는 신선한 호야(멍게)를 얹은 덮밥", ja: "宮城県で楽しむ新鮮なホヤをのせた丼ぶり", en: "A donburi from Miyagi Prefecture topped with fresh sea squirt" },
            ingredients: { ko: ["호야", "초밥", "간장", "미림", "와사비", "오이"], ja: ["ホヤ", "酢飯", "醤油", "みりん", "わさび", "きゅうり"], en: ["Sea squirt", "Sushi rice", "Soy sauce", "Mirin", "Wasabi", "Cucumber"] },
            similarityPercent: 86,
            matchReason: { ko: "멍게(호야) 메인 재료 + 밥 위에 얹어 비비는 스타일 + 진한 바다 향미", ja: "ホヤのメイン食材 + ご飯の上にのせて混ぜるスタイル + 濃厚な海の風味", en: "Sea squirt as the hero ingredient + rice bowl mix style + deep oceanic flavor" }
          }
        ]
      },
      {
        id: "tongyeong-oyster-soup",
        name: { ko: "통영 굴국밥", ja: "統営牡蛎クッパ", en: "Tongyeong Oyster Soup" },
        region: "tongyeong",
        image: "/images/food/ton-oyster-soup.jpg",
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
        dupes: [
          {
            name: { ko: "카키 조스이", ja: "カキ雑炊", en: "Kaki Zosui" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 90, sour: 5 },
            description: { ko: "굴과 밥을 다시마 국물에 부드럽게 끓인 일본 전통 죽", ja: "牡蛎とご飯を昆布出汁でやわらかく煮た日本の伝統雑炊", en: "Traditional Japanese rice porridge softly simmered with oysters in kelp broth" },
            ingredients: { ko: ["굴", "밥", "다시마 육수", "간장", "달걀", "대파"], ja: ["牡蛎", "ご飯", "昆布出汁", "醤油", "卵", "長ネギ"], en: ["Oyster", "Rice", "Kelp broth", "Soy sauce", "Egg", "Green onion"] },
            similarityPercent: 84,
            matchReason: { ko: "굴 + 밥 + 따뜻한 국물의 삼위일체 + 바다 향이 가득한 국물 요리", ja: "牡蛎 + ご飯 + 温かいスープの三位一体 + 海の香りあふれるスープ料理", en: "Oyster + rice + warm broth trinity + ocean-scented soup dish" }
          }
        ]
      },
      {
        id: "tongyeong-ujja",
        name: { ko: "우짜", ja: "ウッチャ", en: "Ujja" },
        region: "tongyeong",
        image: "/images/food/ton-ujja.jpg",
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
        dupes: [
          {
            name: { ko: "자루 우동", ja: "ざるうどん", en: "Zaru Udon" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 5, umami: 70, sour: 10 },
            description: { ko: "차가운 우동면에 쯔유 소스를 곁들여 먹는 일본의 시원한 여름 면 요리", ja: "冷たいうどん麺にめんつゆを添えて食べる日本の涼しい夏の麺料理", en: "Cold udon noodles served with tsuyu dipping sauce — Japan's refreshing summer noodle dish" },
            ingredients: { ko: ["우동면", "쯔유", "무즙", "파", "와사비", "미림"], ja: ["うどん麺", "めんつゆ", "大根おろし", "ネギ", "わさび", "みりん"], en: ["Udon noodles", "Tsuyu", "Grated radish", "Green onion", "Wasabi", "Mirin"] },
            similarityPercent: 68,
            matchReason: { ko: "쫄깃한 우동 면을 활용한 독특한 소스 조합의 공통 발상", ja: "もちもちうどん麺を活用した独特なソースの組み合わせの共通発想", en: "Shared concept of pairing chewy udon noodles with an unconventional sauce" }
          }
        ]
      },
      {
        id: "tongyeong-sirakguk",
        name: { ko: "시락국", ja: "シラクグク", en: "Sirakguk" },
        region: "tongyeong",
        image: "/images/food/ton-sirakguk.jpg",
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
        dupes: [
          {
            name: { ko: "미소시루", ja: "味噌汁", en: "Miso Soup" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 0, umami: 85, sour: 5 },
            description: { ko: "다시마 국물에 된장을 풀고 두부나 채소를 넣은 일본의 국민 국", ja: "昆布だしに味噌を溶かして豆腐や野菜を入れた日本の国民的なお汁", en: "Japan's national soup — miso dissolved into dashi broth with tofu or vegetables" },
            ingredients: { ko: ["된장", "다시마육수", "두부", "미역", "대파"], ja: ["味噌", "昆布だし", "豆腐", "わかめ", "長ネギ"], en: ["Miso", "Dashi broth", "Tofu", "Seaweed", "Green onion"] },
            similarityPercent: 76,
            matchReason: { ko: "발효 된장 국물 + 심플한 채소 재료 + 아침 밥상의 든든한 동반자", ja: "発酵味噌スープ + シンプルな野菜食材 + 朝ごはんの心強い相棒", en: "Fermented soybean broth + simple vegetable ingredients + steadfast morning companion" }
          }
        ]
      },
      {
        id: "tongyeong-haemul-ttukbaegi",
        name: { ko: "해물뚝배기", ja: "海鮮トゥッペギ", en: "Haemul Ttukbaegi" },
        region: "tongyeong",
        image: "/images/food/ton-haemul-ttukbaegi.jpg",
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
        dupes: [
          {
            name: { ko: "해산물 나베", ja: "海鮮鍋", en: "Seafood Nabe" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 10, umami: 90, sour: 5 },
            description: { ko: "다양한 신선한 해산물을 다시마 국물에 끓여 폰즈로 즐기는 일본 냄비 요리", ja: "様々な新鮮な海鮮を昆布だしで煮てポン酢で楽しむ日本の鍋料理", en: "Japanese hot pot of fresh seafood varieties simmered in kelp broth and enjoyed with ponzu" },
            ingredients: { ko: ["새우", "조개", "게", "두부", "배추", "다시마", "폰즈"], ja: ["海老", "貝", "カニ", "豆腐", "白菜", "昆布", "ポン酢"], en: ["Shrimp", "Clams", "Crab", "Tofu", "Cabbage", "Kelp", "Ponzu"] },
            similarityPercent: 81,
            matchReason: { ko: "신선 해산물 모둠 + 뜨거운 냄비 국물 + 해산물 복합 향의 진한 육수", ja: "新鮮海鮮の盛り合わせ + 熱い鍋スープ + 海鮮複合香の濃厚出汁", en: "Assorted fresh seafood + hot pot broth + rich compound seafood stock" }
          }
        ]
      },
      {
        id: "tongyeong-ppaettaegi-juk",
        name: { ko: "빼때기죽", ja: "ッペッテギジュク", en: "Ppaettaegi-juk" },
        region: "tongyeong",
        image: "/images/food/ton-ppaettaegi-juk.jpg",
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
        dupes: [
          {
            name: { ko: "고구마 죽", ja: "さつまいも粥", en: "Sweet Potato Porridge" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 50, salty: 15, spicy: 0, umami: 30, sour: 0 },
            description: { ko: "고구마를 쌀과 함께 부드럽게 끓인 일본 가정식 죽", ja: "さつまいもをお米と一緒にやわらかく炊いた日本の家庭料理のお粥", en: "Soft Japanese home-style porridge simmered with sweet potato and rice" },
            ingredients: { ko: ["고구마", "쌀", "물", "소금", "미림"], ja: ["さつまいも", "米", "水", "塩", "みりん"], en: ["Sweet potato", "Rice", "Water", "Salt", "Mirin"] },
            similarityPercent: 79,
            matchReason: { ko: "고구마 주재료 + 곡물 죽 형태 + 달콤하고 소박한 맛의 공통점", ja: "さつまいも主食材 + 穀物粥の形態 + 甘くて素朴な味の共通点", en: "Sweet potato as hero + grain porridge format + shared sweet and humble flavor" }
          }
        ]
      },
      {
        id: "tongyeong-dacci",
        name: { ko: "다찌 해산물", ja: "ダッチ海鮮", en: "Dacci Seafood" },
        region: "tongyeong",
        image: "/images/food/ton-dacci.jpg",
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
        dupes: [
          {
            name: { ko: "오마카세", ja: "おまかせ", en: "Omakase" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 45, spicy: 5, umami: 95, sour: 20 },
            description: { ko: "주방장이 그날 최선의 식재료로 구성하는 일본 고급 코스 요리", ja: "板前がその日最良の食材で構成する日本の高級コース料理", en: "Japanese premium course cuisine where the chef selects the best ingredients of the day" },
            ingredients: { ko: ["제철 생선", "성게", "킹크랩", "와규", "트러플", "계절 채소"], ja: ["旬の魚", "ウニ", "キングクラブ", "和牛", "トリュフ", "季節野菜"], en: ["Seasonal fish", "Sea urchin", "King crab", "Wagyu", "Truffle", "Seasonal vegetables"] },
            similarityPercent: 77,
            matchReason: { ko: "당일 최선 재료 + 메뉴 없는 주방장 선택 + 해산물 중심의 코스 경험", ja: "当日最良の食材 + メニューなし板前選択 + 海鮮中心のコース体験", en: "Day's best ingredients + no-menu chef selection + seafood-centered course experience" }
          }
        ]
      },
      {
        id: "tongyeong-dodari-ssuk",
        name: { ko: "도다리쑥국", ja: "ヒラメヨモギスープ", en: "Dodari-ssuk Soup" },
        region: "tongyeong",
        image: "/images/food/ton-dodari-ssuk.jpg",
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
        dupes: [
          {
            name: { ko: "카레이 나베", ja: "カレイ鍋", en: "Karei Nabe" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 85, sour: 5 },
            description: { ko: "가자미(카레이)를 맑은 국물에 채소와 함께 끓인 일본 겨울 냄비 요리", ja: "カレイを澄んだスープで野菜と一緒に煮た日本の冬の鍋料理", en: "Japanese winter hot pot of flounder simmered in clear broth with vegetables" },
            ingredients: { ko: ["가자미", "배추", "두부", "대파", "된장", "다시마", "미림"], ja: ["カレイ", "白菜", "豆腐", "長ネギ", "味噌", "昆布", "みりん"], en: ["Flatfish", "Cabbage", "Tofu", "Green onion", "Miso", "Kelp", "Mirin"] },
            similarityPercent: 80,
            matchReason: { ko: "가자미/도다리 흰살 생선 + 맑고 담백한 국물 + 된장 풍미의 공통 구성", ja: "カレイ/ヒラメの白身魚 + 澄んで淡白なスープ + 味噌風味の共通構成", en: "White-fleshed flatfish + clear delicate broth + shared doenjang/miso flavor base" }
          }
        ]
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
        image: "/images/food/jej-black-pork.jpg",
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
        dupes: [
          {
            name: { ko: "쿠로부타 야키", ja: "黒豚焼き", en: "Kurobuta Yakiniku" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 5, umami: 88, sour: 5 },
            description: { ko: "사츠마 흑돼지를 일본식 야키니쿠 스타일로 구워 먹는 가고시마 명물", ja: "薩摩黒豚を日本式焼肉スタイルで焼いて食べる鹿児島の名物", en: "Kagoshima specialty of grilling prized Satsuma black pork in yakiniku style" },
            ingredients: { ko: ["흑돼지", "간장 타레", "마늘", "참기름", "미림", "생강"], ja: ["黒豚", "醤油タレ", "ニンニク", "ごま油", "みりん", "生姜"], en: ["Black pork", "Soy tare", "Garlic", "Sesame oil", "Mirin", "Ginger"] },
            similarityPercent: 88,
            matchReason: { ko: "같은 흑돼지 품종 + 직화구이 스타일 + 풍부한 육즙과 향미의 공통점", ja: "同じ黒豚品種 + 直火焼きスタイル + 豊かな肉汁と風味の共通点", en: "Same black pig breed + direct-fire grilling + shared richness in juiciness and aroma" }
          }
        ]
      },
      {
        id: "jeju-gogi-guksu",
        name: { ko: "고기국수", ja: "コギククス", en: "Gogi Guksu" },
        region: "jeju",
        image: "/images/food/jej-gogi-guksu.jpg",
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
        dupes: [
          {
            name: { ko: "오키나와 소바", ja: "沖縄そば", en: "Okinawa Soba" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 55, spicy: 5, umami: 85, sour: 5 },
            description: { ko: "돼지고기와 가쓰오 육수에 쫄깃한 면을 말고 삼겹살을 얹은 오키나와 섬의 소울 푸드", ja: "豚肉とカツオだしにもちもちの麺を入れ豚バラをのせた沖縄島のソウルフード", en: "Okinawa island's soul food — chewy noodles in pork-and-bonito broth topped with braised pork belly" },
            ingredients: { ko: ["오키나와 소바면", "돼지 뼈", "가쓰오", "삼겹살", "대파", "생강", "어묵"], ja: ["沖縄そば麺", "豚骨", "鰹節", "豚バラ", "長ネギ", "生姜", "かまぼこ"], en: ["Okinawa soba noodles", "Pork bone", "Bonito", "Pork belly", "Green onion", "Ginger", "Fish cake"] },
            similarityPercent: 85,
            matchReason: { ko: "섬 지역 돼지 뼈 국물 면 + 수육 토핑 + 섬 주민의 일상 소울푸드 공통점", ja: "島地域の豚骨スープ麺 + 煮豚トッピング + 島民の日常ソウルフードの共通点", en: "Island pork-bone soup noodles + braised pork topping + shared everyday island soul food identity" }
          }
        ]
      },
      {
        id: "jeju-galchi-jorim",
        name: { ko: "갈치조림", ja: "太刀魚の煮付け", en: "Galchi Jorim" },
        region: "jeju",
        image: "/images/food/jej-galchi-jorim.jpg",
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
        dupes: [
          {
            name: { ko: "타치우오 조림", ja: "太刀魚の煮付け（和風）", en: "Tachiuo Nimono" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 30, salty: 55, spicy: 5, umami: 80, sour: 10 },
            description: { ko: "간장과 미림으로 달콤 짭짤하게 조린 일본식 갈치 요리", ja: "醤油とみりんで甘じょっぱく煮付けた日本式太刀魚料理", en: "Japanese-style beltfish braised sweet and salty with soy sauce and mirin" },
            ingredients: { ko: ["갈치", "간장", "미림", "설탕", "생강", "청주"], ja: ["太刀魚", "醤油", "みりん", "砂糖", "生姜", "清酒"], en: ["Beltfish", "Soy sauce", "Mirin", "Sugar", "Ginger", "Sake"] },
            similarityPercent: 82,
            matchReason: { ko: "같은 갈치 어종 + 달콤 짭짤 조림 방식 + 생강으로 잡내 제거의 공통 기법", ja: "同じ太刀魚の魚種 + 甘じょっぱい煮付け方式 + 生姜で臭み消しの共通技法", en: "Same beltfish species + sweet-salty braise method + shared ginger technique to remove fishiness" }
          }
        ]
      },
      {
        id: "jeju-jeonbok-juk",
        name: { ko: "전복죽", ja: "アワビ粥", en: "Jeonbok Juk" },
        region: "jeju",
        image: "/images/food/jej-jeonbok-juk.jpg",
        tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 95, sour: 5 },
        storyDescription: {
          ko: "제주 해녀가 물 속 깊은 곳에서 건져 올린 전복으로 끓인 죽은 바다 향이 그대로 살아 있어요. 초록빛으로 물든 부드러운 죽 한 숟가락은 몸이 아프거나 지쳤을 때 최고의 보약이 되어줘요.",
          ja: "済州の海女が深海から引き上げたアワビで炊いたお粥は、海の香りがそのまま生きています。緑色に染まった柔らかいお粥の一杓子は、体が弱ったり疲れたりした時に最高の良薬になります。",
          en: "Porridge made from abalone harvested by Jeju's haenyeo divers from the depths carries the sea alive within it. One spoonful of the softly green-tinted porridge is the finest medicine when your body aches or your spirit droops."
        },
        ingredients: {
          ko: ["전복", "쌀", "전복 내장", "참기름", "소금", "대파", "물"],
          ja: ["アワビ", "米", "アワビの内臓", "ごま油", "塩", "長ネギ", "水"],
          en: ["Abalone", "Rice", "Abalone viscera", "Sesame oil", "Salt", "Green onion", "Water"]
        },
        tags: ["전복", "죽", "해녀"],
        dupes: [
          {
            name: { ko: "아와비 조스이", ja: "アワビ雑炊", en: "Awabi Zosui" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 0, umami: 95, sour: 5 },
            description: { ko: "신선한 전복과 밥을 다시 국물에 끓인 일본의 고급 죽 요리", ja: "新鮮なアワビとご飯を出汁で炊いた日本の高級雑炊", en: "Luxurious Japanese rice porridge simmered with fresh abalone in dashi broth" },
            ingredients: { ko: ["전복", "밥", "다시마", "가쓰오", "간장", "미림", "파"], ja: ["アワビ", "ご飯", "昆布", "鰹節", "醤油", "みりん", "ネギ"], en: ["Abalone", "Rice", "Kelp", "Bonito", "Soy sauce", "Mirin", "Green onion"] },
            similarityPercent: 89,
            matchReason: { ko: "전복 주재료 + 내장의 초록색 국물 + 부드러운 쌀 죽 형태의 거의 동일한 구성", ja: "アワビの主食材 + 内臓の緑色スープ + 柔らかい米粥の形状のほぼ同じ構成", en: "Abalone as centerpiece + green viscera-tinted broth + near-identical soft rice porridge form" }
          }
        ]
      },
      {
        id: "jeju-momguk",
        name: { ko: "몸국", ja: "モムグク", en: "Momguk" },
        region: "jeju",
        image: "/images/food/jej-momguk.jpg",
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
        dupes: [
          {
            name: { ko: "돼지고기 해조 국", ja: "豚肉と海藻のスープ", en: "Pork and Seaweed Soup" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 80, sour: 5 },
            description: { ko: "돼지고기와 미역 또는 해조류를 함께 끓인 일본 가정식 국 요리", ja: "豚肉とわかめや海藻類を一緒に煮た日本の家庭料理のスープ", en: "Japanese home-style soup of pork simmered together with wakame or assorted seaweed" },
            ingredients: { ko: ["돼지고기", "미역", "된장", "대파", "참기름", "마늘"], ja: ["豚肉", "わかめ", "味噌", "長ネギ", "ごま油", "ニンニク"], en: ["Pork", "Wakame", "Miso", "Green onion", "Sesame oil", "Garlic"] },
            similarityPercent: 74,
            matchReason: { ko: "돼지고기 + 해조류 + 된장/미소 발효 국물의 동일한 구성 원리", ja: "豚肉 + 海藻 + テンジャン/味噌発酵スープの同じ構成原理", en: "Pork + seaweed + doenjang/miso fermented broth — same fundamental composition" }
          }
        ]
      },
      {
        id: "jeju-dombe",
        name: { ko: "돔베고기", ja: "ドンベコギ", en: "Dombe Gogi" },
        region: "jeju",
        image: "/images/food/jej-dombe.jpg",
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
        dupes: [
          {
            name: { ko: "부타카쿠니", ja: "豚の角煮", en: "Buta Kakuni" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 40, salty: 55, spicy: 5, umami: 85, sour: 5 },
            description: { ko: "간장과 설탕, 미림으로 달콤하게 조린 오키나와식 돼지 수육", ja: "醤油と砂糖、みりんで甘く煮込んだ沖縄式豚の煮豚", en: "Okinawa-style braised pork belly sweetly simmered in soy sauce, sugar, and mirin" },
            ingredients: { ko: ["돼지 삼겹살", "간장", "설탕", "미림", "생강", "파"], ja: ["豚バラ肉", "醤油", "砂糖", "みりん", "生姜", "ネギ"], en: ["Pork belly", "Soy sauce", "Sugar", "Mirin", "Ginger", "Green onion"] },
            similarityPercent: 78,
            matchReason: { ko: "삶은 돼지고기 덩이 + 소금 또는 간장 기반 심플한 조리 + 도마 썰기 스타일", ja: "茹でた豚肉塊 + 塩または醤油ベースのシンプル調理 + まな板切りスタイル", en: "Whole boiled pork + simple salt or soy-based preparation + carved-on-board presentation" }
          }
        ]
      },
      {
        id: "jeju-mulhoe",
        name: { ko: "물회", ja: "ムルフェ", en: "Mulhoe" },
        region: "jeju",
        image: "/images/food/jej-mulhoe.jpg",
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
        dupes: [
          {
            name: { ko: "차가운 해산물 수프", ja: "冷製シーフードスープ", en: "Cold Seafood Soup" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 45, spicy: 10, umami: 70, sour: 40 },
            description: { ko: "차게 식힌 국물에 신선한 해산물을 넣어 여름에 즐기는 일본식 냉 수프", ja: "冷やしたスープに新鮮な海鮮を入れて夏に楽しむ日本式冷スープ", en: "Japanese summer cold soup with fresh seafood in chilled broth" },
            ingredients: { ko: ["광어", "새우", "다시마 국물", "폰즈", "유자", "오이"], ja: ["ヒラメ", "海老", "昆布だし", "ポン酢", "柚子", "きゅうり"], en: ["Flounder", "Shrimp", "Kelp broth", "Ponzu", "Yuzu", "Cucumber"] },
            similarityPercent: 72,
            matchReason: { ko: "차가운 국물 + 신선 해산물 + 새콤한 양념의 여름 청량 음식 공통 구조", ja: "冷たいスープ + 新鮮な海鮮 + 酸っぱい薬念の夏の爽やか食の共通構造", en: "Cold broth + fresh seafood + sour seasoning — shared summer refreshment structure" }
          }
        ]
      },
      {
        id: "jeju-bomal-kalguksu",
        name: { ko: "보말칼국수", ja: "カサガイカルグクス", en: "Bomal Kalguksu" },
        region: "jeju",
        image: "/images/food/jej-bomal-kalguksu.jpg",
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
        dupes: [
          {
            name: { ko: "고둥 우동", ja: "サザエうどん", en: "Turban Shell Udon" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 5, umami: 88, sour: 5 },
            description: { ko: "사자에(소라)의 진한 국물을 활용한 일본 해안 지역의 우동 요리", ja: "サザエの濃厚な出汁を活用した日本の海岸地域のうどん料理", en: "Coastal Japanese udon made with deeply flavored turban shell broth" },
            ingredients: { ko: ["우동면", "소라", "다시마", "간장", "미림", "파"], ja: ["うどん麺", "サザエ", "昆布", "醤油", "みりん", "ネギ"], en: ["Udon noodles", "Turban shell", "Kelp", "Soy sauce", "Mirin", "Green onion"] },
            similarityPercent: 82,
            matchReason: { ko: "바다 소라류 + 진한 해산물 국물 면 요리 + 깨끗하고 담백한 맛의 공통점", ja: "海のサザエ類 + 濃厚な海鮮スープ麺料理 + きれいで淡白な味の共通点", en: "Marine gastropod + rich shellfish broth noodle dish + shared clean delicate flavor" }
          }
        ]
      },
      {
        id: "jeju-omegi-tteok",
        name: { ko: "오메기떡", ja: "オメギ餅", en: "Omegi Tteok" },
        region: "jeju",
        image: "/images/food/jej-omegi-tteok.jpg",
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
        dupes: [
          {
            name: { ko: "요모기 모찌", ja: "よもぎ餅", en: "Yomogi Mochi" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 55, salty: 5, spicy: 0, umami: 15, sour: 0 },
            description: { ko: "쑥을 반죽에 섞어 만든 쫄깃한 모찌 안에 달콤한 팥소가 든 일본 봄 과자", ja: "ヨモギを生地に混ぜて作ったもちもちのお餅の中に甘いあんこが入った日本の春のお菓子", en: "Japanese spring sweet of chewy mochi kneaded with mugwort and filled with sweet red bean paste" },
            ingredients: { ko: ["찹쌀", "쑥", "팥앙금", "설탕", "소금"], ja: ["もち米", "ヨモギ", "あんこ", "砂糖", "塩"], en: ["Glutinous rice", "Mugwort", "Red bean paste", "Sugar", "Salt"] },
            similarityPercent: 78,
            matchReason: { ko: "자연 재료가 섞인 쫄깃한 떡 + 팥 필링 + 섬과 지역 전통 과자의 공통된 원형", ja: "自然素材が入ったもちもちの餅 + あんこフィリング + 島と地域の伝統菓子の共通の原型", en: "Natural-ingredient-infused chewy cake + red bean filling + shared archetype of island regional sweet" }
          }
        ]
      },
      {
        id: "jeju-hallabong",
        name: { ko: "한라봉 디저트", ja: "漢拏峰デザート", en: "Hallabong Dessert" },
        region: "jeju",
        image: "/images/food/jej-hallabong.jpg",
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
        dupes: [
          {
            name: { ko: "유자 디저트", ja: "柚子デザート", en: "Yuzu Dessert" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 65, salty: 5, spicy: 0, umami: 5, sour: 45 },
            description: { ko: "유자 향을 살린 케이크, 젤리, 아이스크림 등 일본의 인기 감귤 디저트 시리즈", ja: "柚子の香りを生かしたケーキ、ゼリー、アイスクリームなど日本の人気柑橘デザートシリーズ", en: "Japan's popular yuzu-scented dessert series — cakes, jellies, ice creams and more" },
            ingredients: { ko: ["유자", "설탕", "생크림", "젤라틴", "밀가루", "버터"], ja: ["柚子", "砂糖", "生クリーム", "ゼラチン", "小麦粉", "バター"], en: ["Yuzu", "Sugar", "Heavy cream", "Gelatin", "Flour", "Butter"] },
            similarityPercent: 81,
            matchReason: { ko: "향긋한 감귤류 + 달콤새콤한 맛 프로파일 + 지역 특산 과일 디저트 활용의 공통점", ja: "香り豊かな柑橘類 + 甘酸っぱいフレーバープロファイル + 地域特産果物デザート活用の共通点", en: "Fragrant citrus + sweet-sour flavor profile + shared use of local specialty fruit in desserts" }
          }
        ]
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
        image: "/images/food/bus-pork-soup.jpg",
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
        dupes: [
          {
            name: { ko: "돈코츠 라멘", ja: "豚骨ラーメン", en: "Tonkotsu Ramen" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 60, spicy: 10, umami: 95, sour: 0 },
            description: { ko: "돼지 뼈를 장시간 끓여 만든 진하고 크리미한 국물의 일본 라멘", ja: "豚骨を長時間煮込んだ濃厚でクリーミーなスープの日本ラーメン", en: "Japanese ramen with rich, creamy broth made from long-simmered pork bones" },
            ingredients: { ko: ["돼지뼈", "라멘면", "차슈", "반숙달걀", "대파", "마늘"], ja: ["豚骨", "ラーメン麺", "チャーシュー", "半熟卵", "長ネギ", "ニンニク"], en: ["Pork bone", "Ramen noodles", "Chashu", "Soft-boiled egg", "Green onion", "Garlic"] },
            similarityPercent: 83,
            matchReason: { ko: "돼지 뼈 장시간 끓임 + 뽀얀 진한 국물 + 수육/차슈 토핑의 공통 구성", ja: "豚骨の長時間煮込み + 白濁した濃厚スープ + 煮豚/チャーシュートッピングの共通構成", en: "Long-simmered pork bone + milky rich broth + braised pork topping in common" }
          }
        ]
      },
      {
        id: "busan-milmyeon",
        name: { ko: "밀면", ja: "ミルミョン", en: "Milmyeon" },
        region: "busan",
        image: "/images/food/bus-milmyeon.jpg",
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
        dupes: [
          {
            name: { ko: "냉멘", ja: "冷麺", en: "Hiyashi Chuka" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 25, salty: 45, spicy: 10, umami: 65, sour: 50 },
            description: { ko: "차게 삶은 중화 면에 다양한 토핑과 새콤달콤 소스를 끼얹어 먹는 일본 여름 면 요리", ja: "冷やした中華麺に様々なトッピングと甘酸っぱいソースをかけて食べる日本の夏の麺料理", en: "Japanese summer noodle dish of chilled ramen topped with various toppings and sweet-sour sauce" },
            ingredients: { ko: ["중화면", "햄", "계란", "오이", "토마토", "참깨 드레싱"], ja: ["中華麺", "ハム", "卵", "きゅうり", "トマト", "ゴマドレッシング"], en: ["Ramen noodles", "Ham", "Egg", "Cucumber", "Tomato", "Sesame dressing"] },
            similarityPercent: 75,
            matchReason: { ko: "차가운 면 + 새콤달콤 소스 + 오이 토핑의 공통 여름 면 요리 구성", ja: "冷たい麺 + 甘酸っぱいソース + きゅうりトッピングの共通夏麺料理構成", en: "Cold noodles + sweet-sour sauce + cucumber topping — shared summer noodle format" }
          }
        ]
      },
      {
        id: "busan-hotteok",
        name: { ko: "씨앗호떡", ja: "シアッホットク", en: "Ssiat Hotteok" },
        region: "busan",
        image: "/images/food/bus-hotteok.jpg",
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
        dupes: [
          {
            name: { ko: "오반야키", ja: "大判焼き", en: "Obanyaki" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 70, salty: 10, spicy: 0, umami: 15, sour: 0 },
            description: { ko: "둥근 철판에 구운 달콤한 팥소 가득한 일본 길거리 과자", ja: "丸い鉄板で焼いた甘いあんこたっぷりの日本の屋台お菓子", en: "Japanese street sweet of round pastry baked on a cast-iron mold and filled with sweet red bean paste" },
            ingredients: { ko: ["밀가루", "달걀", "설탕", "팥앙금", "베이킹파우더"], ja: ["小麦粉", "卵", "砂糖", "あんこ", "ベーキングパウダー"], en: ["Flour", "Egg", "Sugar", "Red bean paste", "Baking powder"] },
            similarityPercent: 76,
            matchReason: { ko: "달콤한 필링 가득 + 철판 반죽 구이 + 길거리에서 즐기는 따뜻한 간식의 공통점", ja: "甘いフィリングたっぷり + 鉄板生地焼き + 屋台で楽しむ温かいおやつの共通点", en: "Sweet filling packed inside + pan-fried dough + shared warm street-snack experience" }
          }
        ]
      },
      {
        id: "busan-mul-tteok",
        name: { ko: "물떡", ja: "ムルトク", en: "Mul-tteok" },
        region: "busan",
        image: "/images/food/bus-mul-tteok.jpg",
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
        dupes: [
          {
            name: { ko: "오뎅", ja: "おでん", en: "Oden" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 55, spicy: 5, umami: 80, sour: 5 },
            description: { ko: "다시마 국물에 각종 재료를 오래 끓인 일본의 국민 겨울 음식", ja: "昆布だしに様々な具材を長時間煮込んだ日本の国民的冬料理", en: "Japan's national winter dish of various ingredients long-simmered in kelp broth" },
            ingredients: { ko: ["어묵", "무", "삶은달걀", "두부", "곤약", "다시마"], ja: ["おでん", "大根", "ゆで卵", "豆腐", "こんにゃく", "昆布"], en: ["Fish cake", "Radish", "Boiled egg", "Tofu", "Konjac", "Kelp"] },
            similarityPercent: 79,
            matchReason: { ko: "따뜻한 국물 속 어묵+떡 조합 + 겨울 길거리 음식 + 국물 직접 마시는 문화", ja: "温かいスープの中のおでん+餅の組み合わせ + 冬の屋台料理 + スープを直接飲む文化", en: "Fish cake + rice cake in warm broth + winter street food + culture of drinking the broth directly" }
          }
        ]
      },
      {
        id: "busan-naengchae-jokbal",
        name: { ko: "냉채족발", ja: "冷菜チョクパル", en: "Naengchae Jokbal" },
        region: "busan",
        image: "/images/food/bus-naengchae-jokbal.jpg",
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
        dupes: [
          {
            name: { ko: "차슈 샐러드", ja: "チャーシューサラダ", en: "Chashu Salad" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 25, salty: 45, spicy: 5, umami: 70, sour: 40 },
            description: { ko: "얇게 썬 차슈를 신선한 채소와 함께 폰즈 드레싱으로 무친 일본 샐러드", ja: "薄切りチャーシューを新鮮な野菜と一緒にポン酢ドレッシングで和えた日本のサラダ", en: "Japanese salad of thinly sliced chashu tossed with fresh vegetables in ponzu dressing" },
            ingredients: { ko: ["차슈", "상추", "오이", "무순", "폰즈", "참기름"], ja: ["チャーシュー", "サンチュ", "きゅうり", "大根スプラウト", "ポン酢", "ごま油"], en: ["Chashu", "Lettuce", "Cucumber", "Radish sprout", "Ponzu", "Sesame oil"] },
            similarityPercent: 73,
            matchReason: { ko: "차게 낸 돼지고기 + 새콤 드레싱 + 신선 채소의 공통 냉 육류 샐러드 구성", ja: "冷やした豚肉 + 酸っぱいドレッシング + 新鮮野菜の共通冷肉サラダ構成", en: "Chilled pork + sour dressing + fresh vegetables — shared cold meat salad structure" }
          }
        ]
      },
      {
        id: "busan-grilled-clams",
        name: { ko: "조개구이", ja: "貝の焼き物", en: "Grilled Clams" },
        region: "busan",
        image: "/images/food/bus-grilled-clams.jpg",
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
        dupes: [
          {
            name: { ko: "하마야키", ja: "浜焼き", en: "Hamayaki" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 5, umami: 90, sour: 5 },
            description: { ko: "해변가에서 신선한 해산물을 직화로 구워 먹는 일본 해안 바비큐 문화", ja: "浜辺で新鮮な海鮮を直火で焼いて食べる日本の海岸バーベキュー文化", en: "Japanese coastal barbecue culture of grilling fresh seafood directly over open fire at the beach" },
            ingredients: { ko: ["조개", "새우", "가리비", "오징어", "소금", "레몬"], ja: ["貝", "海老", "ホタテ", "イカ", "塩", "レモン"], en: ["Clams", "Shrimp", "Scallop", "Squid", "Salt", "Lemon"] },
            similarityPercent: 87,
            matchReason: { ko: "해변가 직화 조개구이 + 바닷가 포장마차 문화 + 신선 해산물 그릴의 공통된 즐거움", ja: "浜辺の直火貝焼き + 海辺の屋台文化 + 新鮮海鮮グリルの共通の楽しさ", en: "Beachside direct-fire shellfish grilling + seaside food stall culture + shared joy of fresh seafood on the grill" }
          }
        ]
      },
      {
        id: "busan-eomuk",
        name: { ko: "어묵", ja: "おでん（釜山式）", en: "Busan Eomuk" },
        region: "busan",
        image: "/images/food/bus-eomuk.jpg",
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
        dupes: [
          {
            name: { ko: "사츠마아게", ja: "さつま揚げ", en: "Satsuma-age" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 50, spicy: 5, umami: 75, sour: 5 },
            description: { ko: "가고시마의 신선한 생선을 갈아 튀겨낸 일본의 전통 어묵", ja: "鹿児島の新鮮な魚を挽いて揚げた日本の伝統的な魚のすり身揚げ", en: "Traditional Japanese fish cake from Kagoshima — fresh fish ground and deep-fried" },
            ingredients: { ko: ["흰살 생선", "전분", "두부", "당근", "우엉", "설탕"], ja: ["白身魚", "でんぷん", "豆腐", "人参", "ごぼう", "砂糖"], en: ["White fish", "Starch", "Tofu", "Carrot", "Burdock", "Sugar"] },
            similarityPercent: 84,
            matchReason: { ko: "생선살 갈아 만든 어묵 + 쫄깃한 식감 + 국물 또는 튀김의 공통 어묵 원형", ja: "魚の身を挽いたかまぼこ + もちもちした食感 + スープまたは揚げの共通魚のすり身の原型", en: "Ground fish cake + chewy texture + shared fish paste archetype as broth ingredient or fried snack" }
          }
        ]
      },
      {
        id: "busan-bibim-dangmyeon",
        name: { ko: "비빔당면", ja: "ビビムタンミョン", en: "Bibim Dangmyeon" },
        region: "busan",
        image: "/images/food/bus-bibim-dangmyeon.jpg",
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
        dupes: [
          {
            name: { ko: "하루사메 샐러드", ja: "春雨サラダ", en: "Harusame Salad" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 25, salty: 45, spicy: 10, umami: 55, sour: 45 },
            description: { ko: "삶은 당면에 오이, 당근 등 채소와 참깨 드레싱을 버무린 일본 샐러드", ja: "茹でた春雨にきゅうり、人参などの野菜とゴマドレッシングを和えた日本のサラダ", en: "Japanese salad of cooked glass noodles tossed with cucumber, carrot and sesame dressing" },
            ingredients: { ko: ["당면", "오이", "당근", "햄", "식초", "참기름", "간장"], ja: ["春雨", "きゅうり", "人参", "ハム", "酢", "ごま油", "醤油"], en: ["Glass noodles", "Cucumber", "Carrot", "Ham", "Vinegar", "Sesame oil", "Soy sauce"] },
            similarityPercent: 77,
            matchReason: { ko: "투명 당면 + 새콤달콤 드레싱 + 채소와 함께 버무리는 스타일의 공통점", ja: "透き通った春雨 + 甘酸っぱいドレッシング + 野菜と一緒に和えるスタイルの共通点", en: "Translucent glass noodles + sweet-sour dressing + tossed with vegetables style in common" }
          }
        ]
      },
      {
        id: "busan-gopchang",
        name: { ko: "양곱창", ja: "ヤンコプチャン", en: "Yang Gopchang" },
        region: "busan",
        image: "/images/food/bus-gopchang.jpg",
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
        dupes: [
          {
            name: { ko: "호르몬야키", ja: "ホルモン焼き", en: "Hormone Yaki" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 55, spicy: 20, umami: 90, sour: 5 },
            description: { ko: "소나 돼지의 내장을 양념에 재워 구워 먹는 일본식 곱창 구이", ja: "牛や豚のホルモンを味付けして焼いて食べる日本式もつ焼き", en: "Japanese-style grilled offal of beef or pork marinated and grilled over charcoal" },
            ingredients: { ko: ["소 내장", "된장", "간장", "마늘", "참기름", "파"], ja: ["牛ホルモン", "味噌", "醤油", "ニンニク", "ごま油", "ネギ"], en: ["Beef offal", "Miso", "Soy sauce", "Garlic", "Sesame oil", "Green onion"] },
            similarityPercent: 85,
            matchReason: { ko: "내장 직화구이 + 고소하고 진한 내장 특유의 향미 + 야식 문화의 공통된 포지션", ja: "ホルモン直火焼き + 香ばしく濃厚なホルモン特有の風味 + 夜食文化の共通ポジション", en: "Offal direct-fire grilling + shared rich, nutty offal aroma + same position in night-eating culture" }
          }
        ]
      },
      {
        id: "busan-nakgopsae",
        name: { ko: "낙곱새", ja: "ナクコプセ", en: "Nakgopsae" },
        region: "busan",
        image: "/images/food/bus-nakgopsae.jpg",
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
        dupes: [
          {
            name: { ko: "해산물 전골", ja: "海鮮すき焼き", en: "Seafood Hot Pot" },
            country: "jp",
            countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 20, umami: 90, sour: 5 },
            description: { ko: "다양한 해산물을 한 냄비에 끓이는 일본 해산물 전골", ja: "様々な海鮮を一鍋で煮込む日本の海鮮すき焼き", en: "Japanese seafood hot pot of diverse marine ingredients simmered together in one pot" },
            ingredients: { ko: ["문어", "새우", "조개", "게", "두부", "배추", "다시마"], ja: ["タコ", "海老", "貝", "カニ", "豆腐", "白菜", "昆布"], en: ["Octopus", "Shrimp", "Clams", "Crab", "Tofu", "Cabbage", "Kelp"] },
            similarityPercent: 78,
            matchReason: { ko: "다양한 해산물 혼합 냄비 요리 + 진한 해산물 국물 + 매콤 양념 베이스 공통점", ja: "様々な海鮮混合鍋料理 + 濃厚な海鮮スープ + ピリ辛薬念ベースの共通点", en: "Multi-seafood mixed pot + rich seafood broth + shared spicy sauce base" }
          }
        ]
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
        image: "/images/food/gye-hwangnam-ppang.jpg",
        tasteProfile: { sweet: 70, salty: 15, spicy: 0, umami: 20, sour: 5 },
        storyDescription: {
          ko: "경주를 대표하는 100년 전통의 팥소 빵이에요. 얇고 바삭한 밀가루 껍질 안에 달콤한 팥소가 가득 차 있어, 한 입 베어 물면 경주의 천년 역사가 입 안에서 녹아드는 것 같아요.",
          ja: "慶州を代表する100年の伝統を持つ餡入りパンです。薄くてサクサクした小麦粉の皮の中に甘い小豆餡がたっぷり詰まっていて、一口かじると慶州の千年の歴史が口の中で溶けていくようです。",
          en: "Gyeongju's iconic 100-year-old red bean bread. The thin, crispy wheat shell hides a generous filling of sweet red bean paste — one bite and Gyeongju's millennium of history melts in your mouth."
        },
        ingredients: { ko: ["밀가루", "팥", "설탕", "버터", "달걀", "소금"], ja: ["小麦粉", "小豆", "砂糖", "バター", "卵", "塩"], en: ["Wheat flour", "Red beans", "Sugar", "Butter", "Egg", "Salt"] },
        tags: ["전통", "팥", "간식"],
        dupes: [
          {
            name: { ko: "타이야키", ja: "たい焼き", en: "Taiyaki" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 65, salty: 10, spicy: 0, umami: 15, sour: 5 },
            description: { ko: "생선 모양의 틀에 구운 팥소 가득한 일본 전통 과자", ja: "鯛の形の型で焼いた小豆餡たっぷりの日本の伝統菓子", en: "Traditional Japanese pastry baked in a fish-shaped mold, filled with sweet red bean paste" },
            ingredients: { ko: ["밀가루", "팥소", "설탕", "달걀", "베이킹파우더"], ja: ["小麦粉", "小豆餡", "砂糖", "卵", "ベーキングパウダー"], en: ["Wheat flour", "Red bean paste", "Sugar", "Egg", "Baking powder"] },
            similarityPercent: 83,
            matchReason: { ko: "얇은 반죽 + 달콤한 팥소 + 손에 들고 먹는 간식의 형태", ja: "薄い生地 + 甘い小豆餡 + 手に持って食べるおやつの形", en: "Thin pastry shell + sweet red bean filling + handheld snack form" }
          }
        ]
      },
      {
        id: "gyeongju-gyori-gimbap",
        name: { ko: "교리김밥", ja: "キョリキンパ", en: "Gyori Gimbap" },
        region: "gyeongju",
        image: "/images/food/gye-gyori-gimbap.jpg",
        tasteProfile: { sweet: 20, salty: 55, spicy: 10, umami: 65, sour: 10 },
        storyDescription: {
          ko: "경주 교리에서 시작된 수제 김밥이에요. 통통하게 들어찬 속재료와 도톰하게 자른 단면이 마치 보석 단면처럼 예뻐서, 먹기 아까울 만큼 눈도 즐겁게 해준답니다.",
          ja: "慶州の教里から始まった手作りキンパです。ぎっしり詰まった具材と厚めに切った断面が、まるで宝石の断面のように美しくて、食べるのがもったいないほど目も楽しませてくれます。",
          en: "Handcrafted gimbap originating from Gyori village in Gyeongju. The plump fillings and thick-cut cross-section are as beautiful as a jewel's facet — almost too pretty to eat."
        },
        ingredients: { ko: ["밥", "김", "시금치", "계란", "당근", "우엉", "어묵", "참기름"], ja: ["ご飯", "のり", "ほうれん草", "卵", "人参", "ごぼう", "練り物", "ごま油"], en: ["Rice", "Seaweed", "Spinach", "Egg", "Carrot", "Burdock", "Fish cake", "Sesame oil"] },
        tags: ["김밥", "도시락", "수제"],
        dupes: [
          {
            name: { ko: "후토마키", ja: "太巻き", en: "Futomaki" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 25, salty: 50, spicy: 0, umami: 60, sour: 15 },
            description: { ko: "다채로운 재료를 듬뿍 넣어 두툼하게 만 일본식 굵은 김밥", ja: "色とりどりの具材をたっぷり入れて太く巻いた日本式の太巻き寿司", en: "Thick Japanese rolled sushi packed with colorful, generous fillings" },
            ingredients: { ko: ["밥", "김", "계란말이", "오이", "박고지", "어묵", "식초"], ja: ["ご飯", "のり", "玉子焼き", "きゅうり", "かんぴょう", "練り物", "酢"], en: ["Rice", "Seaweed", "Tamagoyaki", "Cucumber", "Dried gourd", "Fish cake", "Vinegar"] },
            similarityPercent: 80,
            matchReason: { ko: "두툼한 원통형 + 다채로운 속재료 + 한입에 먹기 좋은 잘라낸 단면", ja: "太い円筒形 + 色とりどりの具材 + 一口で食べやすい切り口", en: "Thick cylindrical roll + colorful fillings + satisfying cross-section slices" }
          }
        ]
      },
      {
        id: "gyeongju-tteokgalbi",
        name: { ko: "경주 떡갈비", ja: "慶州トッカルビ", en: "Gyeongju Tteokgalbi" },
        region: "gyeongju",
        image: "/images/food/gye-tteokgalbi.jpg",
        tasteProfile: { sweet: 50, salty: 55, spicy: 10, umami: 75, sour: 5 },
        storyDescription: {
          ko: "갈비살을 곱게 다져 달콤짭짤한 양념을 입혀 구워낸 요리예요. 겉은 살짝 카라멜화되어 반짝이고, 안은 촉촉하게 촉촉해서 입에서 사르르 녹는 황금빛 패티랍니다.",
          ja: "カルビ肉を細かく刻んで甘辛いタレを纏わせて焼き上げた料理です。外はわずかにカラメリゼされてツヤツヤ光り、中はしっとり柔らかく口の中でとろける黄金色のパティです。",
          en: "Finely minced rib meat coated in sweet-savory marinade and grilled. The exterior caramelizes to a glossy sheen while the inside stays juicy and tender — a golden patty that melts on your tongue."
        },
        ingredients: { ko: ["소갈비살", "간장", "배", "마늘", "참기름", "설탕", "파"], ja: ["牛カルビ肉", "醤油", "梨", "ニンニク", "ごま油", "砂糖", "ネギ"], en: ["Beef rib meat", "Soy sauce", "Korean pear", "Garlic", "Sesame oil", "Sugar", "Green onion"] },
        tags: ["고기", "달콤", "구이"],
        dupes: [
          {
            name: { ko: "와후 햄버그스테이크", ja: "和風ハンバーグ", en: "Wafu Hamburg Steak" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 40, salty: 50, spicy: 5, umami: 80, sour: 10 },
            description: { ko: "다진 소고기에 간장 기반 소스를 곁들인 일본식 함박스테이크", ja: "ひき牛肉に醤油ベースのソースを添えた日本式ハンバーグステーキ", en: "Japanese-style hamburger steak with minced beef and savory soy-based sauce" },
            ingredients: { ko: ["다진 소고기", "양파", "간장", "미림", "달걀", "빵가루"], ja: ["牛ひき肉", "玉ねぎ", "醤油", "みりん", "卵", "パン粉"], en: ["Ground beef", "Onion", "Soy sauce", "Mirin", "Egg", "Breadcrumbs"] },
            similarityPercent: 82,
            matchReason: { ko: "다진 고기를 뭉쳐 구운 형태 + 달콤짭짤한 간장 소스 + 촉촉한 육즙", ja: "ひき肉を丸めて焼く形状 + 甘辛い醤油ソース + ジューシーな肉汁", en: "Minced meat shaped & grilled + sweet-salty soy glaze + juicy interior" }
          }
        ]
      },
      {
        id: "gyeongju-hanwoo-mulhoe",
        name: { ko: "한우 물회", ja: "韓牛ムルフェ", en: "Hanwoo Mulhoe" },
        region: "gyeongju",
        image: "/images/food/gye-hanwoo-mulhoe.jpg",
        tasteProfile: { sweet: 25, salty: 45, spicy: 55, umami: 70, sour: 40 },
        storyDescription: {
          ko: "신선한 한우 육회를 얼음처럼 차가운 육수에 담가 먹는 경주만의 별미예요. 상큼하게 새콤달콤한 국물과 쫄깃한 육회의 만남이 더운 여름날 혀를 상쾌하게 깨워준답니다.",
          ja: "新鮮な韓牛のユッケを氷のように冷たいスープに浸して食べる慶州ならではの珍味です。爽やかな甘酸っぱいスープとコシのあるユッケの出会いが、暑い夏の日に舌を爽やかに目覚めさせてくれます。",
          en: "Fresh raw Korean beef immersed in ice-cold broth — a Gyeongju specialty. The tangy, sweet-and-sour soup paired with chewy raw beef wakes up your palate on a sweltering summer day."
        },
        ingredients: { ko: ["한우 육회", "오이", "배", "고추장", "식초", "설탕", "얼음"], ja: ["韓牛ユッケ", "きゅうり", "梨", "コチュジャン", "酢", "砂糖", "氷"], en: ["Raw Korean beef", "Cucumber", "Korean pear", "Gochujang", "Vinegar", "Sugar", "Ice"] },
        tags: ["육회", "차가움", "여름"],
        dupes: [
          {
            name: { ko: "히야시 샤부샤부", ja: "冷しゃぶしゃぶ", en: "Hiyashi Shabu-Shabu" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 40, spicy: 10, umami: 65, sour: 35 },
            description: { ko: "얇게 썬 고기를 차게 식혀 폰즈 소스와 함께 먹는 여름 요리", ja: "薄切り肉を冷やしてポン酢ソースと一緒に食べる夏の料理", en: "Thinly sliced chilled meat served cold with ponzu dipping sauce" },
            ingredients: { ko: ["소고기 샤부샤부용", "폰즈 소스", "깻잎", "레몬", "얼음"], ja: ["牛シャブシャブ用肉", "ポン酢", "大葉", "レモン", "氷"], en: ["Beef shabu-shabu slices", "Ponzu sauce", "Perilla", "Lemon", "Ice"] },
            similarityPercent: 75,
            matchReason: { ko: "차갑게 먹는 소고기 + 새콤한 소스 + 여름 별미의 청량감", ja: "冷やして食べる牛肉 + 酸味のあるソース + 夏の珍味の爽やかさ", en: "Cold beef + tangy sauce + refreshing summer dish" }
          }
        ]
      },
      {
        id: "gyeongju-ssambap",
        name: { ko: "쌈밥 정식", ja: "サムバプ定食", en: "Ssambap Set" },
        region: "gyeongju",
        image: "/images/food/gye-ssambap.jpg",
        tasteProfile: { sweet: 20, salty: 45, spicy: 40, umami: 65, sour: 15 },
        storyDescription: {
          ko: "신선한 채소잎에 밥 한 숟갈과 고기, 쌈장을 올려 손 안에 꼭 쥐고 한 입에 먹는 즐거움이 있어요. 입 안에서 채소의 신선함과 고기의 풍미, 쌈장의 깊은 맛이 한꺼번에 어우러지는 게 이 맛의 묘미랍니다.",
          ja: "新鮮な葉野菜にご飯一さじとお肉、サムジャンを乗せて手の中にぎゅっと包んで一口で食べる楽しさがあります。口の中で野菜の新鮮さと肉の旨味、サムジャンの深い味わいが一度に溶け合うのがこの料理の醍醐味です。",
          en: "Fresh leafy vegetables wrapped around a spoonful of rice, meat, and savory ssamjang — all squeezed into one perfect bite. The burst of freshness, rich meat flavor, and deep-fermented paste is the magic of ssam."
        },
        ingredients: { ko: ["상추", "깻잎", "쌈장", "밥", "삼겹살", "마늘", "고추"], ja: ["サンチュ", "エゴマの葉", "サムジャン", "ご飯", "豚バラ", "ニンニク", "唐辛子"], en: ["Lettuce", "Perilla leaves", "Ssamjang", "Rice", "Pork belly", "Garlic", "Green pepper"] },
        tags: ["채소", "쌈", "정식"],
        dupes: [
          {
            name: { ko: "베트남 라이스페이퍼 쌈", ja: "ベトナムライスペーパー巻き", en: "Vietnamese Rice Paper Wraps" },
            country: "vn", countryFlag: "🇻🇳",
            countryName: { ko: "베트남", ja: "ベトナム", en: "Vietnam" },
            tasteProfile: { sweet: 15, salty: 40, spicy: 25, umami: 55, sour: 30 },
            description: { ko: "라이스페이퍼에 채소와 고기를 싸서 소스에 찍어 먹는 베트남 요리", ja: "ライスペーパーに野菜と肉を巻いてソースに付けて食べるベトナム料理", en: "Vietnamese dish of fresh ingredients wrapped in rice paper, dipped in sauce" },
            ingredients: { ko: ["라이스페이퍼", "새우", "상추", "허브", "쌀국수", "땅콩소스"], ja: ["ライスペーパー", "エビ", "レタス", "ハーブ", "フォー", "ピーナッツソース"], en: ["Rice paper", "Shrimp", "Lettuce", "Fresh herbs", "Rice vermicelli", "Peanut sauce"] },
            similarityPercent: 73,
            matchReason: { ko: "신선한 채소 래핑 + 소스에 찍어 먹기 + 손으로 싸서 한입에 먹는 형태", ja: "新鮮な野菜ラッピング + ソースに付けて食べる + 手で包んで一口で食べる形", en: "Fresh veggie wrapping + dipping sauce + hand-rolled one-bite eating style" }
          }
        ]
      },
      {
        id: "gyeongju-sundubu",
        name: { ko: "순두부찌개", ja: "スンドゥブチゲ", en: "Sundubu Jjigae" },
        region: "gyeongju",
        image: "/images/food/gye-sundubu.jpg",
        tasteProfile: { sweet: 10, salty: 50, spicy: 65, umami: 75, sour: 10 },
        storyDescription: {
          ko: "보글보글 끓는 뚝배기 속에서 하얀 순두부가 매콤한 국물을 흠뻑 머금고 있어요. 부드럽고 연한 두부 한 숟갈이 입 안에 들어오는 순간, 따뜻한 포근함이 온몸으로 퍼져나간답니다.",
          ja: "ぐつぐつ煮えているトゥクベギの中で、白い純豆腐が辛いスープをたっぷり含んでいます。柔らかくなめらかな豆腐を一さじ口に運んだ瞬間、温かいぬくもりが体中に広がります。",
          en: "Silky soft tofu bubbles in a fiery red broth inside a sizzling stone pot. The moment that one tender spoonful of tofu hits your mouth, warmth radiates through your entire body."
        },
        ingredients: { ko: ["순두부", "고춧가루", "바지락", "돼지고기", "계란", "파", "참기름"], ja: ["純豆腐", "唐辛子粉", "アサリ", "豚肉", "卵", "ネギ", "ごま油"], en: ["Soft tofu", "Red pepper powder", "Clams", "Pork", "Egg", "Green onion", "Sesame oil"] },
        tags: ["두부", "매콤", "뚝배기"],
        dupes: [
          {
            name: { ko: "아게다시 두부", ja: "揚げ出し豆腐", en: "Agedashi Tofu" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 45, spicy: 5, umami: 70, sour: 5 },
            description: { ko: "튀긴 두부에 다시 국물을 부어 먹는 일본식 두부 요리", ja: "揚げた豆腐にだし汁をかけて食べる日本式豆腐料理", en: "Deep-fried tofu served in a delicate dashi broth" },
            ingredients: { ko: ["두부", "다시마육수", "간장", "미림", "무", "생강"], ja: ["豆腐", "だし汁", "醤油", "みりん", "大根おろし", "生姜"], en: ["Tofu", "Dashi broth", "Soy sauce", "Mirin", "Grated daikon", "Ginger"] },
            similarityPercent: 69,
            matchReason: { ko: "부드러운 두부가 주인공 + 감칠맛 나는 국물 + 뜨겁게 즐기는 두부 요리", ja: "柔らかい豆腐が主役 + 旨味のある出汁 + 熱々で楽しむ豆腐料理", en: "Silky tofu as star + umami-rich broth + served piping hot" }
          }
        ]
      },
      {
        id: "gyeongju-haejangguk",
        name: { ko: "경주 해장국", ja: "慶州ヘジャングク", en: "Gyeongju Haejangguk" },
        region: "gyeongju",
        image: "/images/food/gye-haejangguk.jpg",
        tasteProfile: { sweet: 10, salty: 55, spicy: 50, umami: 80, sour: 10 },
        storyDescription: {
          ko: "진한 사골 국물에 우거지와 선지, 콩나물이 어우러진 경주식 해장국이에요. 묵직하고 깊은 국물 한 모금이면 전날의 피로가 씻겨나가는 것 같아서, 경주 사람들의 아침을 든든히 책임진답니다.",
          ja: "濃い牛骨スープにウゴジ（白菜の外葉）と血豆腐、もやしが調和した慶州式解腸スープです。重厚で深みのあるスープを一口飲めば、前日の疲れが洗い流されるようで、慶州の人たちの朝をしっかり支えています。",
          en: "A Gyeongju-style hangover soup with rich bone broth, dried cabbage leaves, congealed blood, and bean sprouts. One sip of this deeply savory, hearty broth washes away yesterday's weariness."
        },
        ingredients: { ko: ["사골육수", "우거지", "선지", "콩나물", "고춧가루", "된장", "마늘"], ja: ["牛骨スープ", "干し白菜葉", "血豆腐", "もやし", "唐辛子粉", "味噌", "ニンニク"], en: ["Bone broth", "Dried cabbage", "Blood pudding", "Bean sprouts", "Red pepper powder", "Doenjang", "Garlic"] },
        tags: ["해장", "진국", "아침"],
        dupes: [
          {
            name: { ko: "모츠나베", ja: "もつ鍋", en: "Motsu Nabe" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 20, umami: 85, sour: 5 },
            description: { ko: "돼지 내장과 채소를 간장 또는 된장 국물에 끓인 후쿠오카식 나베 요리", ja: "豚の内臓と野菜を醤油または味噌のスープで煮込んだ福岡式鍋料理", en: "Fukuoka-style hotpot of pork offal and vegetables in soy or miso broth" },
            ingredients: { ko: ["돼지 내장", "배추", "부추", "된장", "마늘", "두부"], ja: ["豚もつ", "白菜", "ニラ", "味噌", "ニンニク", "豆腐"], en: ["Pork offal", "Cabbage", "Garlic chives", "Miso", "Garlic", "Tofu"] },
            similarityPercent: 72,
            matchReason: { ko: "진한 발효 국물 + 내장류 재료 + 속을 든든하게 채워주는 푸짐함", ja: "濃い発酵スープ + 内臓系食材 + お腹をしっかり満たす豪快さ", en: "Rich fermented broth + offal ingredients + heartily filling bowl" }
          }
        ]
      },
      {
        id: "gyeongju-hanjeongsik",
        name: { ko: "경주 한정식", ja: "慶州韓定食", en: "Gyeongju Hanjeongsik" },
        region: "gyeongju",
        image: "/images/food/gye-hanjeongsik.jpg",
        tasteProfile: { sweet: 30, salty: 50, spicy: 30, umami: 80, sour: 20 },
        storyDescription: {
          ko: "신라의 궁중 음식 문화를 계승한 경주의 전통 한정식이에요. 작은 그릇 하나하나에 장인의 손길이 담긴 정성스러운 반찬들이 차려지면, 마치 천년 전 경주 고분에서 발굴된 유물처럼 그 자리 자체가 하나의 역사가 된답니다.",
          ja: "新羅の宮廷料理文化を継承した慶州の伝統韓定食です。小さなお皿一つ一つに職人の手仕事が込められた丁寧なおかずが並ぶと、まるで千年前の慶州の古墳から発掘された遺物のように、その場そのものが一つの歴史になります。",
          en: "A traditional Gyeongju hanjeongsik tracing its roots to Silla royal court cuisine. Each small dish is crafted with artisan care — laid out together, it feels less like a meal and more like a living archaeological discovery."
        },
        ingredients: { ko: ["밥", "나물 반찬", "전", "구이", "찌개", "김치", "해산물", "떡"], ja: ["ご飯", "ナムルおかず", "チヂミ", "焼き物", "チゲ", "キムチ", "海産物", "餅"], en: ["Rice", "Namul side dishes", "Jeon", "Grilled dishes", "Jjigae", "Kimchi", "Seafood", "Rice cake"] },
        tags: ["정찬", "궁중", "전통"],
        dupes: [
          {
            name: { ko: "가이세키 요리", ja: "懐石料理", en: "Kaiseki" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 25, salty: 40, spicy: 5, umami: 85, sour: 15 },
            description: { ko: "일본의 전통 코스 요리로 계절 식재료를 활용한 예술적인 다채 요리", ja: "日本の伝統コース料理で旬の食材を活かした芸術的な多皿料理", en: "Traditional Japanese multi-course cuisine showcasing seasonal ingredients with artistic presentation" },
            ingredients: { ko: ["제철 생선", "두부", "채소", "다시마", "미소"], ja: ["旬の魚", "豆腐", "野菜", "昆布", "味噌"], en: ["Seasonal fish", "Tofu", "Vegetables", "Kelp", "Miso"] },
            similarityPercent: 84,
            matchReason: { ko: "다양한 소반찬 구성 + 제철 재료 + 눈으로 먹는 아름다운 코스 구성", ja: "多様な小皿構成 + 旬の食材 + 目で食べる美しいコース構成", en: "Multiple small dishes + seasonal ingredients + visually stunning course presentation" }
          }
        ]
      },
      {
        id: "gyeongju-chalborippang",
        name: { ko: "찰보리빵", ja: "チャルボリパン", en: "Chalborippang" },
        region: "gyeongju",
        image: "/images/food/gye-chalborippang.jpg",
        tasteProfile: { sweet: 60, salty: 15, spicy: 0, umami: 25, sour: 5 },
        storyDescription: {
          ko: "경주의 찰보리를 넣어 만든 촉촉하고 쫄깃한 빵이에요. 일반 빵과 달리 보리 특유의 구수한 향이 은은하게 올라오고, 팥 크림이나 단팥소와 어우러지면 소박하지만 깊은 맛이 나요.",
          ja: "慶州のもち麦を使って作ったしっとりもちもちのパンです。普通のパンと違い、麦独特の香ばしい香りがほんのりと漂い、小豆クリームや餡と相まって素朴ながら深い味わいがあります。",
          en: "A moist, chewy bread made with Gyeongju's sticky barley. Unlike ordinary bread, it carries the subtle nutty fragrance of barley — paired with red bean cream or paste, it's simple yet deeply satisfying."
        },
        ingredients: { ko: ["찰보리", "밀가루", "팥소", "버터", "설탕", "달걀", "우유"], ja: ["もち麦", "小麦粉", "小豆餡", "バター", "砂糖", "卵", "牛乳"], en: ["Sticky barley", "Wheat flour", "Red bean paste", "Butter", "Sugar", "Egg", "Milk"] },
        tags: ["빵", "보리", "달콤"],
        dupes: [
          {
            name: { ko: "도라야키", ja: "どら焼き", en: "Dorayaki" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 65, salty: 10, spicy: 0, umami: 20, sour: 5 },
            description: { ko: "두 장의 카스텔라 사이에 달콤한 팥소를 넣은 일본 전통 과자", ja: "2枚のカステラ生地の間に甘い小豆餡を挟んだ日本の伝統菓子", en: "Traditional Japanese confection with sweet red bean paste sandwiched between two fluffy pancake-like cakes" },
            ingredients: { ko: ["밀가루", "달걀", "설탕", "꿀", "팥소"], ja: ["小麦粉", "卵", "砂糖", "蜂蜜", "小豆餡"], en: ["Wheat flour", "Egg", "Sugar", "Honey", "Red bean paste"] },
            similarityPercent: 78,
            matchReason: { ko: "쫄깃하고 촉촉한 빵 반죽 + 달콤한 팥 속 재료 + 손에 들고 먹는 간편함", ja: "もちもちしっとりした生地 + 甘い小豆の中身 + 手に持って食べる手軽さ", en: "Chewy moist dough + sweet red bean filling + easy handheld snack" }
          }
        ]
      },
      {
        id: "gyeongju-milmyeon",
        name: { ko: "경주 밀면", ja: "慶州ミルミョン", en: "Gyeongju Milmyeon" },
        region: "gyeongju",
        image: "/images/food/gye-milmyeon.jpg",
        tasteProfile: { sweet: 20, salty: 45, spicy: 50, umami: 60, sour: 35 },
        storyDescription: {
          ko: "밀가루 면을 차갑게 먹는 경주식 냉면이에요. 한방 재료가 들어간 시원한 국물에 쫄깃한 면을 담고, 고소하게 볶은 고기와 채소를 올려서 먹으면 여름 더위를 단번에 날려버려요.",
          ja: "小麦粉麺を冷やして食べる慶州式冷麺です。漢方食材が入った冷たいスープにコシのある麺を浸し、香ばしく炒めた肉と野菜を乗せて食べると、夏の暑さを一気に吹き飛ばしてくれます。",
          en: "Gyeongju-style cold noodles made from wheat flour. Chewy noodles bathed in an herbal cold broth, topped with savory stir-fried meat and fresh vegetables — one bowl and the summer heat simply vanishes."
        },
        ingredients: { ko: ["밀가루 면", "한방 육수", "오이", "계란", "돼지고기", "겨자", "식초"], ja: ["小麦粉麺", "漢方だし", "きゅうり", "卵", "豚肉", "からし", "酢"], en: ["Wheat noodles", "Herbal broth", "Cucumber", "Egg", "Pork", "Mustard", "Vinegar"] },
        tags: ["냉면", "여름", "쫄깃"],
        dupes: [
          {
            name: { ko: "히야시 라멘", ja: "冷やしラーメン", en: "Hiyashi Ramen" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 20, umami: 65, sour: 30 },
            description: { ko: "차갑게 식혀 먹는 일본식 라멘, 여름철 별미", ja: "冷やして食べる日本式ラーメン、夏の季節の珍味", en: "Ice-cold Japanese ramen served as a summer delicacy" },
            ingredients: { ko: ["라멘 면", "차슈", "차가운 육수", "계란", "오이", "간장"], ja: ["ラーメン麺", "チャーシュー", "冷たいスープ", "卵", "きゅうり", "醤油"], en: ["Ramen noodles", "Chashu pork", "Chilled broth", "Egg", "Cucumber", "Soy sauce"] },
            similarityPercent: 77,
            matchReason: { ko: "차갑게 먹는 밀가루 면 + 시원한 육수 + 토핑을 얹은 여름 국수", ja: "冷やして食べる小麦粉麺 + 冷たいスープ + トッピングを乗せた夏の麺", en: "Cold wheat noodles + chilled broth + topped summer noodle dish" }
          }
        ]
      }
    ]
  },
  {
    code: "cheonan",
    name: { ko: "천안", ja: "天安", en: "Cheonan" },
    icon: "🌰",
    image: "/images/village/천안.png",
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
        image: "/images/food/che-walnut-cookie.jpg",
        tasteProfile: { sweet: 72, salty: 12, spicy: 0, umami: 18, sour: 5 },
        storyDescription: {
          ko: "천안을 대표하는 국민 간식이에요. 호두 모양의 작은 틀에 달콤한 팥소와 호두 한 조각을 넣고 구워낸 빵으로, 고속도로 휴게소에서 갓 구운 것을 사 먹는 것이 천안 여행의 진짜 묘미랍니다.",
          ja: "天安を代表する国民的おやつです。クルミの形をした小さな型に甘い小豆餡とクルミを一切れ入れて焼いたパンで、高速道路のサービスエリアで焼きたてを買って食べるのが天安旅行の本当の楽しみです。",
          en: "Cheonan's iconic national snack. Small walnut-shaped pastries filled with sweet red bean paste and a walnut piece — buying them fresh off the griddle at a highway rest stop is the quintessential Cheonan travel moment."
        },
        ingredients: { ko: ["밀가루", "팥소", "호두", "달걀", "버터", "설탕"], ja: ["小麦粉", "小豆餡", "クルミ", "卵", "バター", "砂糖"], en: ["Wheat flour", "Red bean paste", "Walnut", "Egg", "Butter", "Sugar"] },
        tags: ["간식", "호두", "팥"],
        dupes: [
          {
            name: { ko: "닌교야키", ja: "人形焼き", en: "Ningyoyaki" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 68, salty: 10, spicy: 0, umami: 15, sour: 5 },
            description: { ko: "인형 모양 틀에 구운 팥소 달콤한 일본 전통 과자", ja: "人形の形の型で焼いた小豆餡の甘い日本の伝統菓子", en: "Traditional Japanese pastry baked in character-shaped molds, filled with sweet red bean paste" },
            ingredients: { ko: ["밀가루", "팥소", "설탕", "달걀", "베이킹파우더"], ja: ["小麦粉", "小豆餡", "砂糖", "卵", "ベーキングパウダー"], en: ["Wheat flour", "Red bean paste", "Sugar", "Egg", "Baking powder"] },
            similarityPercent: 86,
            matchReason: { ko: "모양 틀에 구운 팥소 빵 + 작고 귀여운 형태 + 달콤한 간식", ja: "型で焼いた小豆餡パン + 小さくてかわいい形 + 甘いおやつ", en: "Mold-baked red bean pastry + small cute shape + sweet snack" }
          }
        ]
      },
      {
        id: "cheonan-byeongcheon-sundae",
        name: { ko: "병천순대", ja: "ビョンチョンスンデ", en: "Byeongcheon Sundae" },
        region: "cheonan",
        image: "/images/food/che-byeongcheon-sundae.jpg",
        tasteProfile: { sweet: 15, salty: 55, spicy: 20, umami: 75, sour: 5 },
        storyDescription: {
          ko: "당면과 채소, 선지를 듬뿍 넣어 꽉 채운 병천 특유의 순대예요. 다른 지역 순대보다 채소가 훨씬 많이 들어가 가볍고 깔끔한 맛이 나고, 천안 여행자들이 꼭 들러야 하는 명물 음식이랍니다.",
          ja: "春雨と野菜、血を惜しみなく詰め込んだ病川ならではのスンデです。他の地域のスンデより野菜がはるかに多く入っていて、軽くてさっぱりとした味がし、天安を訪れる旅行者が必ず立ち寄る名物料理です。",
          en: "Byeongcheon's signature sundae stuffed generously with glass noodles, vegetables, and blood. Far more veggie-forward than other regional varieties, it's light and clean-tasting — a must-try landmark food for anyone visiting Cheonan."
        },
        ingredients: { ko: ["돼지 소장", "당면", "채소", "선지", "찹쌀", "파", "마늘"], ja: ["豚の小腸", "春雨", "野菜", "血", "もち米", "ネギ", "ニンニク"], en: ["Pork intestine casing", "Glass noodles", "Vegetables", "Blood", "Sticky rice", "Green onion", "Garlic"] },
        tags: ["순대", "전통", "명물"],
        dupes: [
          {
            name: { ko: "부댕 누아르", ja: "ブーダンノワール", en: "Boudin Noir" },
            country: "fr", countryFlag: "🇫🇷",
            countryName: { ko: "프랑스", ja: "フランス", en: "France" },
            tasteProfile: { sweet: 10, salty: 60, spicy: 10, umami: 80, sour: 5 },
            description: { ko: "돼지 선지와 지방을 창자에 넣어 만든 프랑스 혈소시지", ja: "豚の血と脂肪を腸に詰めて作ったフランスの血のソーセージ", en: "French blood sausage made from pork blood and fat stuffed into intestine casing" },
            ingredients: { ko: ["돼지 선지", "지방", "양파", "소금", "후추", "향신료"], ja: ["豚の血", "脂肪", "玉ねぎ", "塩", "胡椒", "スパイス"], en: ["Pork blood", "Fat", "Onion", "Salt", "Pepper", "Spices"] },
            similarityPercent: 74,
            matchReason: { ko: "창자에 넣어 만든 소시지 형태 + 선지가 들어간 진한 풍미 + 삶아서 먹는 조리법", ja: "腸に詰めて作ったソーセージ形 + 血が入った濃厚な風味 + 茹でて食べる調理法", en: "Intestine-cased sausage + blood-enriched deep flavor + boiled preparation method" }
          }
        ]
      },
      {
        id: "cheonan-sundae-soup",
        name: { ko: "순대국밥", ja: "スンデクッパ", en: "Sundae Soup" },
        region: "cheonan",
        image: "/images/food/che-sundae-soup.jpg",
        tasteProfile: { sweet: 10, salty: 55, spicy: 35, umami: 80, sour: 5 },
        storyDescription: {
          ko: "뽀얗게 우러난 돼지 사골 국물에 순대 한 줌이 풍덩 빠져 있어요. 국물 한 모금에 구수함이 입을 가득 채우고, 순대 한 점에 쫄깃한 식감이 더해지면서 천안 장날의 따뜻한 정이 느껴진답니다.",
          ja: "白く濁った豚骨スープにスンデがどっぷり浸かっています。スープを一口飲むと香ばしさが口いっぱいに広がり、スンデを一切れ食べると弾力のある食感が加わって、天安の市場の日の温かい情が感じられます。",
          en: "Milky pork bone broth with chunks of sundae submerged inside. One sip fills your mouth with savory depth, and a bite of chewy sundae adds texture — you can taste the warm community spirit of Cheonan's market days."
        },
        ingredients: { ko: ["사골육수", "순대", "머리고기", "내장", "파", "고춧가루", "새우젓"], ja: ["豚骨スープ", "スンデ", "豚頭肉", "内臓", "ネギ", "唐辛子粉", "アミの塩辛"], en: ["Pork bone broth", "Sundae", "Head meat", "Offal", "Green onion", "Red pepper", "Salted shrimp"] },
        tags: ["국밥", "순대", "구수함"],
        dupes: [
          {
            name: { ko: "돈코츠 라멘", ja: "豚骨ラーメン", en: "Tonkotsu Ramen" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 60, spicy: 10, umami: 90, sour: 5 },
            description: { ko: "돼지 뼈를 오래 끓여 뽀얗고 진하게 우린 일본 라멘 국물", ja: "豚骨を長時間煮込んで白濁した濃厚な日本ラーメンのスープ", en: "Rich white pork bone broth simmered for hours, the soul of Japanese Tonkotsu ramen" },
            ingredients: { ko: ["돼지 뼈", "라멘 면", "차슈", "달걀", "파", "마늘"], ja: ["豚骨", "ラーメン麺", "チャーシュー", "卵", "ネギ", "ニンニク"], en: ["Pork bones", "Ramen noodles", "Chashu", "Egg", "Green onion", "Garlic"] },
            similarityPercent: 78,
            matchReason: { ko: "뽀얀 돼지 뼈 육수 + 구수하고 진한 국물 + 돼지 부산물 활용", ja: "白濁した豚骨スープ + 香ばしく濃厚なスープ + 豚の副産物活用", en: "Milky pork bone broth + savory rich depth + use of pork by-products" }
          }
        ]
      },
      {
        id: "cheonan-charcoal-dakgalbi",
        name: { ko: "천안 숯불 닭갈비", ja: "天安炭火ダッカルビ", en: "Cheonan Charcoal Dakgalbi" },
        region: "cheonan",
        image: "/images/food/che-charcoal-dakgalbi.jpg",
        tasteProfile: { sweet: 35, salty: 50, spicy: 65, umami: 70, sour: 10 },
        storyDescription: {
          ko: "천안에서는 일반 닭갈비와 달리 숯불 위에서 직접 구워낸 닭갈비가 유명해요. 연기 스며든 숯불 향기와 매콤달콤한 양념이 닭고기 속까지 배어들어, 한 입 베어 물면 입 안 가득 숯불 향연이 펼쳐져요.",
          ja: "天安では普通のダッカルビと違い、炭火で直接焼くダッカルビが有名です。煙が染み込んだ炭火の香りと甘辛い薬味が鶏肉の芯まで染みて、一口かじると口いっぱいに炭火の宴が広がります。",
          en: "Cheonan is famous for dakgalbi grilled directly over charcoal, unlike the usual stir-fried version. The smoky charcoal aroma and sweet-spicy marinade penetrate deep into the chicken — one bite and your mouth is filled with the festival of charcoal smoke."
        },
        ingredients: { ko: ["닭고기", "고추장", "간장", "설탕", "마늘", "참기름", "파"], ja: ["鶏肉", "コチュジャン", "醤油", "砂糖", "ニンニク", "ごま油", "ネギ"], en: ["Chicken", "Gochujang", "Soy sauce", "Sugar", "Garlic", "Sesame oil", "Green onion"] },
        tags: ["숯불", "닭갈비", "매콤"],
        dupes: [
          {
            name: { ko: "야키토리", ja: "焼き鳥", en: "Yakitori" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 40, salty: 45, spicy: 5, umami: 70, sour: 5 },
            description: { ko: "숯불에 구운 닭 꼬치에 달콤짭짤한 타레 소스를 발라 먹는 일본 요리", ja: "炭火で焼いた鶏の串焼きに甘辛いタレを塗って食べる日本料理", en: "Japanese grilled chicken skewers coated with sweet-savory tare sauce over charcoal" },
            ingredients: { ko: ["닭고기", "간장", "미림", "설탕", "생강"], ja: ["鶏肉", "醤油", "みりん", "砂糖", "生姜"], en: ["Chicken", "Soy sauce", "Mirin", "Sugar", "Ginger"] },
            similarityPercent: 76,
            matchReason: { ko: "숯불 그릴 조리 + 달콤짭짤한 닭 양념 + 불 향기가 배어든 풍미", ja: "炭火グリル調理 + 甘辛い鶏の味付け + 火の香りが染み込んだ風味", en: "Charcoal grill cooking + sweet-salty chicken marinade + smoky flame-kissed flavor" }
          }
        ]
      },
      {
        id: "cheonan-spicy-catfish",
        name: { ko: "빠가사리 매운탕", ja: "ナマズ辛鍋", en: "Spicy Catfish Stew" },
        region: "cheonan",
        image: "/images/food/che-spicy-catfish.jpg",
        tasteProfile: { sweet: 10, salty: 50, spicy: 75, umami: 75, sour: 15 },
        storyDescription: {
          ko: "충청도 강에서 잡히는 빠가사리(메기류) 민물고기로 끓인 진한 매운탕이에요. 담백한 흰살 생선의 부드러운 살점이 칼칼한 양념과 어우러져 시원하고 얼큰한 국물이 완성되는데, 이맛이 그리워 천안을 찾는 사람들도 있답니다.",
          ja: "忠清道の川で獲れるナマズ類の淡水魚で煮込んだ濃厚な辛鍋です。淡白な白身魚の柔らかい身が辛い薬味と調和して、スッキリとしてピリッと辛いスープが完成し、この味が恋しくて天安を訪れる人もいるそうです。",
          en: "A fiery catfish stew made with freshwater fish caught in the rivers of Chungcheong province. The tender white fish flesh melds with the spicy seasoning into a clean, blazing broth — some people visit Cheonan just for this taste."
        },
        ingredients: { ko: ["빠가사리", "고춧가루", "된장", "두부", "호박", "파", "마늘", "들깨"], ja: ["ナマズ", "唐辛子粉", "味噌", "豆腐", "カボチャ", "ネギ", "ニンニク", "エゴマ"], en: ["Catfish", "Red pepper powder", "Doenjang", "Tofu", "Zucchini", "Green onion", "Garlic", "Perilla"] },
        tags: ["매운탕", "민물고기", "얼큰"],
        dupes: [
          {
            name: { ko: "아라나베", ja: "あら鍋", en: "Ara Nabe" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 15, umami: 80, sour: 10 },
            description: { ko: "생선 머리와 뼈를 된장 또는 간장 베이스로 끓인 일본 냄비 요리", ja: "魚の頭や骨を味噌または醤油ベースで煮込んだ日本の鍋料理", en: "Japanese hotpot made by simmering fish heads and bones in miso or soy broth" },
            ingredients: { ko: ["생선 머리", "두부", "파", "된장", "생강"], ja: ["魚の頭", "豆腐", "ネギ", "味噌", "生姜"], en: ["Fish head", "Tofu", "Green onion", "Miso", "Ginger"] },
            similarityPercent: 71,
            matchReason: { ko: "생선 전체를 활용한 진한 육수 + 두부와 채소가 함께하는 냄비 요리 + 얼큰한 양념", ja: "魚全体を活用した濃厚なだし + 豆腐と野菜が一緒の鍋料理 + ピリ辛の味付け", en: "Whole-fish rich broth + tofu and veggie hotpot + boldly seasoned" }
          }
        ]
      },
      {
        id: "cheonan-hanwoo-yukhoe",
        name: { ko: "한우 육회비빔밥", ja: "韓牛ユッケビビンバ", en: "Hanwoo Raw Beef Bibimbap" },
        region: "cheonan",
        image: "/images/food/che-hanwoo-yukhoe.jpg",
        tasteProfile: { sweet: 30, salty: 50, spicy: 55, umami: 80, sour: 20 },
        storyDescription: {
          ko: "신선한 한우 육회가 소복이 올려진 비빔밥이에요. 고슬고슬한 밥과 각양각색의 나물, 달걀 노른자 위에 윤기 좔좔 흐르는 육회가 올려지면, 그 아름다운 모습에 비비기 전에 한참 바라보게 된답니다.",
          ja: "新鮮な韓牛のユッケがたっぷり乗ったビビンバです。ふっくらしたご飯とさまざまなナムル、卵の黄身の上にツヤツヤ輝くユッケが乗ると、その美しい姿に混ぜる前にしばらく見とれてしまいます。",
          en: "Bibimbap crowned with a generous mound of fresh raw Korean beef. When the glistening yukhoe sits atop fluffy rice, colorful namul, and a golden egg yolk, you can't help but pause and admire it before mixing."
        },
        ingredients: { ko: ["한우 육회", "밥", "나물", "달걀 노른자", "고추장", "참기름", "배"], ja: ["韓牛ユッケ", "ご飯", "ナムル", "卵の黄身", "コチュジャン", "ごま油", "梨"], en: ["Raw Korean beef", "Rice", "Namul", "Egg yolk", "Gochujang", "Sesame oil", "Korean pear"] },
        tags: ["육회", "비빔밥", "한우"],
        dupes: [
          {
            name: { ko: "규동 + 타르타르", ja: "牛丼＋タルタル", en: "Gyudon with Tartar" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 30, salty: 50, spicy: 10, umami: 80, sour: 15 },
            description: { ko: "소고기 덮밥에 날달걀 토핑이 올려진 일본식 원볼 요리", ja: "牛丼に生卵のトッピングを乗せた日本式ワンボウル料理", en: "Japanese beef bowl topped with raw egg — a classic one-bowl comfort dish" },
            ingredients: { ko: ["소고기", "밥", "간장", "미림", "달걀", "파"], ja: ["牛肉", "ご飯", "醤油", "みりん", "卵", "ネギ"], en: ["Beef", "Rice", "Soy sauce", "Mirin", "Egg", "Green onion"] },
            similarityPercent: 73,
            matchReason: { ko: "밥 위에 올려진 소고기 + 날달걀 토핑 + 간장 베이스 원볼 구조", ja: "ご飯の上に乗せた牛肉 + 生卵トッピング + 醤油ベースのワンボウル構造", en: "Beef on rice + raw egg topping + soy-based one-bowl structure" }
          }
        ]
      },
      {
        id: "cheonan-fruit-mochi",
        name: { ko: "생과일 모찌", ja: "生フルーツ大福", en: "Fresh Fruit Mochi" },
        region: "cheonan",
        image: "/images/food/che-fruit-mochi.jpg",
        tasteProfile: { sweet: 75, salty: 5, spicy: 0, umami: 10, sour: 20 },
        storyDescription: {
          ko: "촉촉한 찹쌀 떡 피 속에 생딸기나 망고 같은 신선한 과일이 통째로 들어있어요. 한 입 베어 물면 달콤한 찹쌀 향과 함께 과즙이 터지면서 어느 디저트 카페도 부럽지 않은 행복감이 밀려온답니다.",
          ja: "しっとりしたもち米の皮の中に、生いちごやマンゴーなどの新鮮な果物が丸ごと入っています。一口かじると甘いもち米の香りとともに果汁が弾けて、どんなデザートカフェも羨ましくない幸福感が押し寄せます。",
          en: "Moist sticky rice skin wrapping a whole fresh strawberry or mango inside. One bite releases sweet mochi fragrance and a burst of fruit juice — pure happiness that rivals any fancy dessert cafe."
        },
        ingredients: { ko: ["찹쌀가루", "생딸기", "생크림", "설탕", "전분", "팥소"], ja: ["もち米粉", "生いちご", "生クリーム", "砂糖", "でんぷん", "小豆餡"], en: ["Glutinous rice flour", "Fresh strawberry", "Heavy cream", "Sugar", "Starch", "Red bean paste"] },
        tags: ["디저트", "과일", "모찌"],
        dupes: [
          {
            name: { ko: "이치고 다이후쿠", ja: "いちご大福", en: "Ichigo Daifuku" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 72, salty: 5, spicy: 0, umami: 8, sour: 18 },
            description: { ko: "찹쌀 떡 안에 통 딸기와 팥소를 넣은 일본 전통 화과자", ja: "もち米の皮の中に丸ごといちごと小豆餡を入れた日本の伝統和菓子", en: "Traditional Japanese wagashi with a whole strawberry and red bean paste inside soft mochi" },
            ingredients: { ko: ["찹쌀", "팥소", "생딸기", "설탕"], ja: ["もち米", "小豆餡", "生いちご", "砂糖"], en: ["Glutinous rice", "Red bean paste", "Fresh strawberry", "Sugar"] },
            similarityPercent: 93,
            matchReason: { ko: "찹쌀 떡 피 + 생과일 통째 + 달콤한 크림소 = 거의 동일한 구조", ja: "もち米の皮 + 生果物丸ごと + 甘いクリーム餡 = ほぼ同じ構造", en: "Mochi rice skin + whole fresh fruit + sweet cream filling = nearly identical structure" }
          }
        ]
      },
      {
        id: "cheonan-lotus-rice",
        name: { ko: "연잎밥 정식", ja: "蓮の葉ご飯定食", en: "Lotus Leaf Rice Set" },
        region: "cheonan",
        image: "/images/food/che-lotus-rice.jpg",
        tasteProfile: { sweet: 25, salty: 45, spicy: 20, umami: 65, sour: 10 },
        storyDescription: {
          ko: "향긋한 연잎으로 찹쌀밥과 견과류를 싸서 쪄낸 건강 요리예요. 연잎 특유의 은은한 향이 밥 속으로 스며들면서 일반 밥과는 전혀 다른 청아한 풍미를 만들어내고, 눈에도 먹기 전부터 힐링이 됩니다.",
          ja: "香り高い蓮の葉でもち米ごはんとナッツを包んで蒸した健康料理です。蓮の葉独特のほのかな香りがご飯に染み込んで、普通のご飯とは全く違う清雅な風味を生み出し、食べる前から目にも癒やしを与えてくれます。",
          en: "A wholesome dish of glutinous rice and nuts steamed inside fragrant lotus leaves. The lotus' delicate aroma permeates the rice, creating a clean, ethereal flavor unlike any ordinary rice — healing for the eyes even before the first bite."
        },
        ingredients: { ko: ["연잎", "찹쌀", "은행", "잣", "대추", "밤", "간장"], ja: ["蓮の葉", "もち米", "銀杏", "松の実", "なつめ", "栗", "醤油"], en: ["Lotus leaf", "Glutinous rice", "Ginkgo", "Pine nuts", "Jujube", "Chestnut", "Soy sauce"] },
        tags: ["연잎", "건강", "찹쌀"],
        dupes: [
          {
            name: { ko: "타케노코 오코와", ja: "たけのこおこわ", en: "Takenoko Okowa" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 40, spicy: 0, umami: 70, sour: 5 },
            description: { ko: "죽순이나 제철 채소를 섞어 찐 일본식 찹쌀밥", ja: "たけのこや旬の野菜を混ぜて蒸した日本式もち米ご飯", en: "Japanese steamed glutinous rice mixed with bamboo shoots and seasonal vegetables" },
            ingredients: { ko: ["찹쌀", "죽순", "간장", "미림", "다시마", "당근"], ja: ["もち米", "たけのこ", "醤油", "みりん", "昆布", "人参"], en: ["Glutinous rice", "Bamboo shoots", "Soy sauce", "Mirin", "Kelp", "Carrot"] },
            similarityPercent: 76,
            matchReason: { ko: "자연 향재료로 향을 입힌 찹쌀밥 + 견과류 곡물 + 찜 조리 방식", ja: "天然香り食材で香り付けしたもち米ご飯 + ナッツ穀物 + 蒸し調理法", en: "Aromatic ingredient-infused sticky rice + nut grains + steam cooking method" }
          }
        ]
      },
      {
        id: "cheonan-mushroom-stew",
        name: { ko: "버섯전골", ja: "きのこ鍋", en: "Mushroom Hotpot" },
        region: "cheonan",
        image: "/images/food/che-mushroom-stew.jpg",
        tasteProfile: { sweet: 15, salty: 45, spicy: 25, umami: 90, sour: 5 },
        storyDescription: {
          ko: "충청 지역에서 재배되는 다양한 버섯들이 그 향과 맛을 국물 속에 풀어내는 웰빙 전골이에요. 먹을수록 감칠맛이 깊어지고, 건더기를 건져 먹을 때 버섯 특유의 향긋한 식감이 입 안에 가득 차는 게 묘미랍니다.",
          ja: "忠清地域で栽培されたさまざまなキノコがその香りと旨味をスープに溶かし込んだウェルビーイング鍋です。食べるほどに旨味が深まり、具を掬って食べるときにキノコ独特の香り豊かな食感が口いっぱいに広がるのが醍醐味です。",
          en: "A wellness hotpot showcasing diverse mushrooms grown in the Chungcheong region, releasing their aroma and flavor into the broth. The umami deepens with every bite, and the fragrant, earthy texture of the mushrooms fills your mouth completely."
        },
        ingredients: { ko: ["표고버섯", "느타리버섯", "팽이버섯", "두부", "당면", "파", "간장", "참기름"], ja: ["椎茸", "ヒラタケ", "えのき茸", "豆腐", "春雨", "ネギ", "醤油", "ごま油"], en: ["Shiitake", "Oyster mushroom", "Enoki", "Tofu", "Glass noodles", "Green onion", "Soy sauce", "Sesame oil"] },
        tags: ["버섯", "전골", "감칠맛"],
        dupes: [
          {
            name: { ko: "키노코 나베", ja: "きのこ鍋", en: "Kinoko Nabe" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 40, spicy: 5, umami: 88, sour: 5 },
            description: { ko: "다양한 버섯을 다시마 국물에 끓여 먹는 일본 나베 요리", ja: "様々なキノコを昆布だしで煮て食べる日本の鍋料理", en: "Japanese hotpot of various mushrooms simmered in kelp dashi broth" },
            ingredients: { ko: ["표고버섯", "팽이버섯", "다시마", "두부", "파"], ja: ["椎茸", "えのき", "昆布", "豆腐", "ネギ"], en: ["Shiitake", "Enoki", "Kelp", "Tofu", "Green onion"] },
            similarityPercent: 89,
            matchReason: { ko: "다양한 버섯이 주재료 + 감칠맛 가득한 육수 + 두부와 채소 곁들임", ja: "様々なキノコが主役 + 旨味たっぷりのだし + 豆腐と野菜添え", en: "Various mushrooms as star + umami-packed broth + tofu and veggie sides" }
          }
        ]
      },
      {
        id: "cheonan-local-bakery",
        name: { ko: "뚜쥬루 앙버터빵", ja: "トゥジュル餡バターパン", en: "Ttujuru Anpan Butter Bread" },
        region: "cheonan",
        image: "/images/food/che-lokal-bakery.jpg",
        tasteProfile: { sweet: 65, salty: 20, spicy: 0, umami: 15, sour: 5 },
        storyDescription: {
          ko: "천안의 인기 로컬 베이커리 '뚜쥬루'의 시그니처 앙버터 빵이에요. 고소한 발효 버터와 달콤한 팥소가 부드러운 브리오슈 빵 사이에 끼워져 있어, 한 입 먹으면 고소함과 달콤함이 파도처럼 밀려오는 행복한 빵이에요.",
          ja: "天安の人気ローカルベーカリー「뚜쥬루」のシグネチャー餡バターパンです。香ばしい発酵バターと甘い小豆餡が柔らかいブリオッシュパンに挟まれていて、一口食べると香ばしさと甘さが波のように押し寄せる幸せなパンです。",
          en: "The signature anpan butter bread from Cheonan's beloved local bakery 'Ttujuru'. Creamy cultured butter and sweet red bean paste sandwiched in soft brioche — one bite and waves of nuttiness and sweetness wash over you."
        },
        ingredients: { ko: ["브리오슈", "팥소", "발효 버터", "소금", "설탕"], ja: ["ブリオッシュ", "小豆餡", "発酵バター", "塩", "砂糖"], en: ["Brioche", "Red bean paste", "Cultured butter", "Salt", "Sugar"] },
        tags: ["베이커리", "앙버터", "로컬"],
        dupes: [
          {
            name: { ko: "앙버터 크루아상", ja: "餡バタークロワッサン", en: "Anpan Butter Croissant" },
            country: "fr", countryFlag: "🇫🇷",
            countryName: { ko: "프랑스", ja: "フランス", en: "France" },
            tasteProfile: { sweet: 60, salty: 22, spicy: 0, umami: 12, sour: 8 },
            description: { ko: "버터 풍미 가득한 크루아상에 팥소를 넣어 만든 한불 퓨전 디저트", ja: "バター風味たっぷりのクロワッサンに小豆餡を入れた日仏フュージョンデザート", en: "Korean-French fusion dessert: a buttery croissant filled with sweet red bean paste" },
            ingredients: { ko: ["크루아상", "팥소", "버터", "밀가루"], ja: ["クロワッサン", "小豆餡", "バター", "小麦粉"], en: ["Croissant", "Red bean paste", "Butter", "Wheat flour"] },
            similarityPercent: 82,
            matchReason: { ko: "버터 풍미 + 달콤한 팥소 + 부드럽고 결 있는 반죽", ja: "バター風味 + 甘い小豆餡 + 柔らかく層のある生地", en: "Butter richness + sweet red bean + soft layered dough" }
          }
        ]
      }
    ]
  },
  {
    code: "yongin",
    name: { ko: "용인", ja: "龍仁", en: "Yongin" },
    icon: "🏘️",
    image: "/images/village/용인.png",
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
        image: "/images/food/yon-baegam-sundae.jpg",
        tasteProfile: { sweet: 15, salty: 55, spicy: 20, umami: 80, sour: 5 },
        storyDescription: {
          ko: "용인 백암면에서 유래한 순대로, 속이 꽉 찬 풍성함이 자랑이에요. 찹쌀과 두부, 당면이 가득 들어간 도톰한 순대를 뚝 잘라 소금에 찍어 먹으면, 할머니 손맛이 생각나는 정겨운 맛이 납니다.",
          ja: "龍仁の白岩面に由来するスンデで、ぎっしり詰まった豊かさが自慢です。もち米と豆腐、春雨がたっぷり入った厚みのあるスンデをぶつ切りにして塩に付けて食べると、おばあちゃんの手料理を思い出す懐かしい味がします。",
          en: "Originating from Baegam-myeon in Yongin, this sundae is celebrated for its generous fillings. Thick slices of sticky rice, tofu, and glass noodle-packed sundae dipped in salt — one taste and grandma's kitchen comes flooding back."
        },
        ingredients: { ko: ["돼지 소장", "찹쌀", "두부", "당면", "선지", "부추", "마늘"], ja: ["豚の小腸", "もち米", "豆腐", "春雨", "血", "ニラ", "ニンニク"], en: ["Pork intestine casing", "Glutinous rice", "Tofu", "Glass noodles", "Blood", "Garlic chives", "Garlic"] },
        tags: ["순대", "백암", "전통"],
        dupes: [
          {
            name: { ko: "바이스부르스트", ja: "ヴァイスヴルスト", en: "Weisswurst" },
            country: "de", countryFlag: "🇩🇪",
            countryName: { ko: "독일", ja: "ドイツ", en: "Germany" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 75, sour: 5 },
            description: { ko: "송아지 고기와 베이컨으로 만든 독일 바이에른 전통 흰 소시지", ja: "子牛肉とベーコンで作ったドイツ・バイエルン伝統の白ソーセージ", en: "Traditional Bavarian white sausage made from veal and bacon" },
            ingredients: { ko: ["송아지 고기", "베이컨", "파슬리", "양파", "레몬", "소금"], ja: ["子牛肉", "ベーコン", "パセリ", "玉ねぎ", "レモン", "塩"], en: ["Veal", "Bacon", "Parsley", "Onion", "Lemon zest", "Salt"] },
            similarityPercent: 70,
            matchReason: { ko: "속을 채워 만든 장 요리 + 삶아서 먹는 형태 + 찍어 먹는 소스와 함께", ja: "詰め物をした腸料理 + 茹でて食べる形 + つけダレと一緒に", en: "Stuffed casing preparation + boiled serving style + dipping condiment pairing" }
          }
        ]
      },
      {
        id: "yongin-jangter-gukbap",
        name: { ko: "민속촌 장터국밥", ja: "民俗村チャンターグッパ", en: "Folk Village Market Soup Rice" },
        region: "yongin",
        image: "/images/food/yon-jangter-gukbap.jpg",
        tasteProfile: { sweet: 10, salty: 55, spicy: 30, umami: 80, sour: 5 },
        storyDescription: {
          ko: "한국 민속촌 장터에서 팔던 소박한 시골 국밥이에요. 뚝배기에 담긴 진한 사골 국물과 밥, 우거지, 수육이 어우러진 푸짐한 한 그릇이 옛날 장날의 분위기를 그대로 살려낸답니다.",
          ja: "韓国民俗村の市場で売っていた素朴な田舎の国飯です。土鍋に入った濃い骨付き肉スープとご飯、干し白菜、ゆで肉が調和した豊かな一杯が、昔の市場の日の雰囲気をそのまま蘇らせます。",
          en: "A humble country soup rice sold at the marketplace of the Korean Folk Village. A generous earthenware bowl of rich bone broth, rice, dried cabbage, and boiled meat — it perfectly captures the warm atmosphere of old market days."
        },
        ingredients: { ko: ["사골육수", "밥", "우거지", "수육", "파", "된장", "고춧가루"], ja: ["骨付き肉スープ", "ご飯", "干し白菜葉", "ゆで肉", "ネギ", "味噌", "唐辛子粉"], en: ["Bone broth", "Rice", "Dried cabbage", "Boiled pork", "Green onion", "Doenjang", "Red pepper"] },
        tags: ["국밥", "전통", "민속촌"],
        dupes: [
          {
            name: { ko: "카스지루", ja: "粕汁", en: "Kasujiru" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 50, spicy: 5, umami: 80, sour: 10 },
            description: { ko: "술지게미와 돼지고기, 채소를 함께 끓인 일본 전통 국", ja: "酒粕と豚肉、野菜を一緒に煮込んだ日本の伝統スープ", en: "Traditional Japanese soup with sake lees, pork, and vegetables" },
            ingredients: { ko: ["술지게미", "돼지고기", "당근", "무", "된장", "파"], ja: ["酒粕", "豚肉", "人参", "大根", "味噌", "ネギ"], en: ["Sake lees", "Pork", "Carrot", "Daikon", "Miso", "Green onion"] },
            similarityPercent: 72,
            matchReason: { ko: "진한 발효 양념 베이스 + 돼지고기와 채소 + 따뜻한 뚝배기 국 형태", ja: "濃い発酵調味料ベース + 豚肉と野菜 + 温かい土鍋スープ形態", en: "Rich fermented base + pork and vegetables + warm earthenware pot soup" }
          }
        ]
      },
      {
        id: "yongin-nurungji-baeksuk",
        name: { ko: "누룽지 백숙", ja: "おこげ白熟鶏", en: "Nurungji Baeksuk" },
        region: "yongin",
        image: "/images/food/yon-nurungji-baeksuk.jpg",
        tasteProfile: { sweet: 15, salty: 40, spicy: 5, umami: 85, sour: 5 },
        storyDescription: {
          ko: "닭을 통째로 푹 끓인 백숙에 누룽지를 더해 구수함을 배로 끌어올린 용인의 별미예요. 닭 국물이 누룽지 속으로 스며들면서 걸쭉하고 고소해지는 국물의 변신이 마법 같고, 마지막 한 방울까지 아까운 맛이에요.",
          ja: "丸鶏をじっくり煮込んだ白熟鶏におこげを加えて香ばしさを倍増させた龍仁の珍味です。鶏のスープがおこげに染み込んでとろみが出て香ばしくなるスープの変身が魔法のようで、最後の一滴まで惜しい味です。",
          en: "Yongin's specialty: a classic whole-chicken baeksuk elevated with crispy scorched rice nurungji. As the rich chicken broth seeps into the nurungji, it transforms into a thick, nutty elixir — every last drop is too precious to waste."
        },
        ingredients: { ko: ["닭", "누룽지", "찹쌀", "인삼", "마늘", "대추", "밤", "소금"], ja: ["鶏", "おこげ", "もち米", "高麗人参", "ニンニク", "なつめ", "栗", "塩"], en: ["Whole chicken", "Scorched rice", "Glutinous rice", "Ginseng", "Garlic", "Jujube", "Chestnut", "Salt"] },
        tags: ["백숙", "누룽지", "보양"],
        dupes: [
          {
            name: { ko: "오코게 가유", ja: "おこげ粥", en: "Okoge Kayu" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 35, spicy: 0, umami: 75, sour: 5 },
            description: { ko: "솥바닥의 구수한 누룽지를 물에 불려 만든 일본식 죽", ja: "釜底の香ばしいおこげを水に浸して作った日本式のお粥", en: "Japanese porridge made by soaking crispy scorched rice from the pot bottom in water" },
            ingredients: { ko: ["누룽지", "육수", "소금", "파"], ja: ["おこげ", "だし", "塩", "ネギ"], en: ["Scorched rice", "Dashi broth", "Salt", "Green onion"] },
            similarityPercent: 74,
            matchReason: { ko: "구수한 눌음밥 풍미 + 국물에 불린 쌀 + 간단하지만 깊은 고소함", ja: "香ばしい焦げご飯の風味 + スープに浸したご飯 + シンプルだが深い香ばしさ", en: "Nutty scorched rice flavor + broth-soaked rice + simple yet deeply savory" }
          }
        ]
      },
      {
        id: "yongin-pajeon",
        name: { ko: "민속촌 파전", ja: "民俗村パジョン", en: "Folk Village Pajeon" },
        region: "yongin",
        image: "/images/food/yon-pajeon.jpg",
        tasteProfile: { sweet: 15, salty: 50, spicy: 20, umami: 65, sour: 15 },
        storyDescription: {
          ko: "한국 민속촌에서 굽는 커다란 파전이에요. 바깥은 바삭하고 안은 촉촉하게 구워진 두툼한 파전에, 새콤달콤한 간장 양념을 찍어 먹으면 막걸리 한 잔이 절로 생각난답니다.",
          ja: "韓国民俗村で焼く大きなパジョンです。外はカリカリ、中はしっとり焼き上がった厚みのあるパジョンに、甘酸っぱい醤油ダレを付けて食べると、マッコリが自然と恋しくなります。",
          en: "The oversized pajeon grilled at the Korean Folk Village. Crispy on the outside, moist and soft inside — dip this thick scallion pancake in sweet-sour soy sauce and you'll instinctively reach for a cup of makgeolli."
        },
        ingredients: { ko: ["쪽파", "밀가루", "달걀", "해산물", "간장", "식초", "고추"], ja: ["小ネギ", "小麦粉", "卵", "海産物", "醤油", "酢", "唐辛子"], en: ["Green onion", "Wheat flour", "Egg", "Seafood", "Soy sauce", "Vinegar", "Pepper"] },
        tags: ["파전", "전통", "안주"],
        dupes: [
          {
            name: { ko: "오코노미야키", ja: "お好み焼き", en: "Okonomiyaki" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 30, salty: 45, spicy: 10, umami: 70, sour: 20 },
            description: { ko: "밀가루 반죽에 양배추와 각종 재료를 넣어 철판에 구운 일본 전통 요리", ja: "小麦粉の生地にキャベツと様々な食材を入れて鉄板で焼く日本の伝統料理", en: "Japanese savory pancake with cabbage and various ingredients grilled on a flat iron griddle" },
            ingredients: { ko: ["밀가루", "양배추", "달걀", "해산물", "소스", "파"], ja: ["小麦粉", "キャベツ", "卵", "海産物", "ソース", "ネギ"], en: ["Flour", "Cabbage", "Egg", "Seafood", "Okonomiyaki sauce", "Green onion"] },
            similarityPercent: 80,
            matchReason: { ko: "밀가루 반죽 채소 전 + 철판 구이 + 소스 찍어 먹기", ja: "小麦粉生地野菜チヂミ + 鉄板焼き + ソース付け", en: "Flour-batter vegetable pancake + griddle frying + dipping sauce" }
          }
        ]
      },
      {
        id: "yongin-makguksu",
        name: { ko: "수지 막국수", ja: "水枝マックッス", en: "Suji Makguksu" },
        region: "yongin",
        image: "/images/food/yon-makguksu.jpg",
        tasteProfile: { sweet: 20, salty: 45, spicy: 55, umami: 60, sour: 35 },
        storyDescription: {
          ko: "메밀로 만든 차갑고 탄력 있는 면에 양념장을 비벼 먹는 막국수예요. 수지 지역의 막국수는 특히 메밀 향이 진하고, 새콤매콤한 양념이 면 한 올 한 올에 스며들어 있어 여름 별미로 손꼽힌답니다.",
          ja: "そば粉で作った冷たくて弾力のある麺にヤンニョムジャンを和えて食べるマックッスです。水枝地域のマックッスは特にそばの香りが濃く、甘酸っぱくて辛い薬味が麺の一本一本に染み込んでいて、夏の珍味として名高いです。",
          en: "Cold, springy buckwheat noodles tossed in spicy-tangy seasoning sauce. Suji's makguksu is especially prized for its pronounced buckwheat fragrance, with the sweet-spicy-sour sauce penetrating every single strand — a top summer delicacy."
        },
        ingredients: { ko: ["메밀 면", "양념장", "오이", "계란", "깍두기", "겨자", "식초"], ja: ["そば麺", "ヤンニョムジャン", "きゅうり", "卵", "カクテキ", "からし", "酢"], en: ["Buckwheat noodles", "Spicy sauce", "Cucumber", "Egg", "Radish kimchi", "Mustard", "Vinegar"] },
        tags: ["메밀", "냉면", "여름"],
        dupes: [
          {
            name: { ko: "자루 소바", ja: "ざるそば", en: "Zaru Soba" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 40, spicy: 5, umami: 65, sour: 15 },
            description: { ko: "대나무 채반에 올려 차갑게 제공되는 일본 메밀국수", ja: "竹のざるに乗せて冷たく提供される日本のそば", en: "Cold Japanese buckwheat noodles served on a bamboo draining tray" },
            ingredients: { ko: ["메밀 면", "쯔유", "파", "와사비", "김"], ja: ["そば", "つゆ", "ネギ", "わさび", "海苔"], en: ["Soba noodles", "Tsuyu dipping sauce", "Green onion", "Wasabi", "Nori"] },
            similarityPercent: 79,
            matchReason: { ko: "메밀 향 짙은 차가운 면 + 소스에 찍어 먹기 + 시원하게 즐기는 여름 국수", ja: "そばの香りが豊かな冷たい麺 + ソースに付けて食べる + 涼しく楽しむ夏の麺", en: "Strong buckwheat aroma cold noodles + dipping sauce style + cool summer noodle dish" }
          }
        ]
      },
      {
        id: "yongin-sanchae-bibimbap",
        name: { ko: "산채비빔밥", ja: "山菜ビビンバ", en: "Sanchae Bibimbap" },
        region: "yongin",
        image: "/images/food/yon-sanchae-bibimbap.jpg",
        tasteProfile: { sweet: 20, salty: 45, spicy: 50, umami: 65, sour: 20 },
        storyDescription: {
          ko: "경기도 산에서 채취한 고사리, 취나물, 참나물 등의 신선한 산나물을 밥 위에 소복이 올려 비벼 먹는 건강 비빔밥이에요. 나물마다 각기 다른 향과 식감이 어우러져 자연의 풍성함을 한 그릇에서 느낄 수 있어요.",
          ja: "京畿道の山で採れたわらび、シドケ、野芹などの新鮮な山菜をご飯の上にたっぷり乗せて混ぜて食べる健康ビビンバです。山菜それぞれの異なる香りと食感が調和して、自然の豊かさを一椀で感じることができます。",
          en: "A wholesome bibimbap loaded with freshly foraged mountain greens — bracken, wild sesame leaves, shepherd's purse — from the Gyeonggi mountains. Each vegetable offers its own distinct aroma and texture, delivering the full richness of nature in a single bowl."
        },
        ingredients: { ko: ["밥", "고사리", "취나물", "참나물", "도라지", "고추장", "참기름", "계란"], ja: ["ご飯", "わらび", "シドケ", "野芹", "桔梗", "コチュジャン", "ごま油", "卵"], en: ["Rice", "Bracken", "Aster scaber", "Wild parsley", "Bellflower root", "Gochujang", "Sesame oil", "Egg"] },
        tags: ["산나물", "비빔밥", "건강"],
        dupes: [
          {
            name: { ko: "산사이 덮밥", ja: "山菜丼", en: "Sansai Donburi" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 25, salty: 45, spicy: 5, umami: 70, sour: 10 },
            description: { ko: "봄철 산나물을 간장과 미림으로 조려 밥 위에 올린 일본 덮밥", ja: "春の山菜を醤油とみりんで煮詰めてご飯の上に乗せた日本の丼", en: "Japanese donburi with spring mountain vegetables braised in soy and mirin over rice" },
            ingredients: { ko: ["밥", "산나물", "간장", "미림", "달걀", "참깨"], ja: ["ご飯", "山菜", "醤油", "みりん", "卵", "ごま"], en: ["Rice", "Mountain greens", "Soy sauce", "Mirin", "Egg", "Sesame"] },
            similarityPercent: 82,
            matchReason: { ko: "산나물이 주인공인 밥 요리 + 나물 위주 토핑 + 건강 지향적 원볼", ja: "山菜が主役のご飯料理 + 山菜中心のトッピング + 健康志向ワンボウル", en: "Mountain greens-forward rice dish + veggie-centric topping + health-oriented one-bowl" }
          }
        ]
      },
      {
        id: "yongin-acorn-jelly",
        name: { ko: "도토리묵 무침", ja: "どんぐりゼリーサラダ", en: "Acorn Jelly Salad" },
        region: "yongin",
        image: "/images/food/yon-acorn-jelly.jpg",
        tasteProfile: { sweet: 10, salty: 50, spicy: 40, umami: 55, sour: 25 },
        storyDescription: {
          ko: "도토리 전분으로 만든 촉촉하고 보들보들한 묵에 새콤매콤한 양념을 무친 요리예요. 쫀득한 식감과 구수한 도토리 향, 그리고 맵고 새콤한 양념이 한꺼번에 입 안을 자극하는 이 조화가 바로 한식의 매력이에요.",
          ja: "どんぐりのデンプンで作ったしっとりふわふわのゼリーに甘酸っぱくて辛い薬味を和えた料理です。もちもちした食感と香ばしいどんぐりの香り、そして辛くて酸っぱい薬味が一度に口を刺激するこの調和こそが韓国料理の魅力です。",
          en: "Silky acorn starch jelly dressed in a tangy, spicy seasoning. The chewy texture, nutty acorn aroma, and punchy sweet-spicy-sour dressing all hit at once — that harmonious complexity is exactly what makes Korean cuisine captivating."
        },
        ingredients: { ko: ["도토리묵", "간장", "참기름", "고춧가루", "파", "마늘", "깨", "식초"], ja: ["どんぐりゼリー", "醤油", "ごま油", "唐辛子粉", "ネギ", "ニンニク", "ごま", "酢"], en: ["Acorn jelly", "Soy sauce", "Sesame oil", "Red pepper flakes", "Green onion", "Garlic", "Sesame", "Vinegar"] },
        tags: ["묵", "도토리", "무침"],
        dupes: [
          {
            name: { ko: "콘냐쿠 조림", ja: "こんにゃくの煮物", en: "Braised Konjac" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 25, salty: 50, spicy: 15, umami: 60, sour: 10 },
            description: { ko: "곤약을 달콤짭짤한 간장 국물에 조린 일본 반찬", ja: "こんにゃくを甘辛い醤油のだしで煮た日本のおかず", en: "Japanese side dish of konjac braised in sweet-savory soy broth" },
            ingredients: { ko: ["곤약", "간장", "설탕", "미림", "깨", "유자"], ja: ["こんにゃく", "醤油", "砂糖", "みりん", "ごま", "ゆず"], en: ["Konjac", "Soy sauce", "Sugar", "Mirin", "Sesame", "Yuzu"] },
            similarityPercent: 72,
            matchReason: { ko: "탄력 있는 젤리형 식감 + 양념 잘 배는 무색무취 재료 + 반찬 역할", ja: "弾力のあるゼリー状の食感 + 味が染み込みやすい無色無臭の食材 + おかずの役割", en: "Springy jelly-like texture + flavor-absorbing neutral ingredient + side dish role" }
          }
        ]
      },
      {
        id: "yongin-hanwoo",
        name: { ko: "용인 한우 구이", ja: "龍仁韓牛焼肉", en: "Yongin Hanwoo Grilled Beef" },
        region: "yongin",
        image: "/images/food/yon-hanwoo.jpg",
        tasteProfile: { sweet: 20, salty: 45, spicy: 10, umami: 90, sour: 5 },
        storyDescription: {
          ko: "경기도 한우 고장 용인에서 만나는 프리미엄 한우 구이예요. 결이 고운 마블링이 불에 닿는 순간 지글지글 녹아내리면서 올라오는 고기 향이 식욕을 자극하고, 한 점만 먹어도 입 안 가득 풍미가 가득 차오른답니다.",
          ja: "京畿道の韓牛の里・龍仁で出会えるプレミアム韓牛焼肉です。細かいサシが火に触れた瞬間にジュージュー溶け出して立ち上る肉の香りが食欲をそそり、一切れ食べるだけで口いっぱいに旨味が広がります。",
          en: "Premium Hanwoo beef grilled in Yongin, Gyeonggi's prime beef country. The fine marbling sizzles and melts the instant it touches heat, sending up an aroma that ignites the appetite — just one piece and your mouth is flooded with flavor."
        },
        ingredients: { ko: ["한우 등심", "소금", "참기름", "마늘", "상추", "깻잎", "쌈장"], ja: ["韓牛サーロイン", "塩", "ごま油", "ニンニク", "サンチュ", "エゴマの葉", "サムジャン"], en: ["Hanwoo sirloin", "Salt", "Sesame oil", "Garlic", "Lettuce", "Perilla", "Ssamjang"] },
        tags: ["한우", "구이", "프리미엄"],
        dupes: [
          {
            name: { ko: "와규 야키니쿠", ja: "和牛焼肉", en: "Wagyu Yakiniku" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 40, spicy: 5, umami: 95, sour: 5 },
            description: { ko: "최상급 마블링의 일본 와규를 직화로 구운 고급 야키니쿠", ja: "最上級のサシが入った日本の和牛を直火で焼く高級焼き肉", en: "Premium Japanese wagyu with exceptional marbling, grilled over direct flame" },
            ingredients: { ko: ["와규", "소금", "유자 후추", "폰즈", "파"], ja: ["和牛", "塩", "柚子胡椒", "ポン酢", "ネギ"], en: ["Wagyu beef", "Salt", "Yuzu pepper", "Ponzu", "Green onion"] },
            similarityPercent: 88,
            matchReason: { ko: "최상급 마블링 소고기 + 직화 구이 + 상추 등 채소에 싸 먹는 방식", ja: "最上級サシ牛肉 + 直火焼き + サンチュなど野菜に包んで食べる方法", en: "Premium marbled beef + direct-flame grilling + wrap-and-eat with greens style" }
          }
        ]
      },
      {
        id: "yongin-cafe-dessert",
        name: { ko: "보정동 카페거리 디저트", ja: "保亭洞カフェ通りデザート", en: "Bojeongdong Cafe Street Dessert" },
        region: "yongin",
        image: "/images/food/yon-cafe-dessert.jpg",
        tasteProfile: { sweet: 75, salty: 10, spicy: 0, umami: 15, sour: 20 },
        storyDescription: {
          ko: "용인 보정동 카페거리는 경기도 최대의 카페 밀집 지역이에요. 이 거리에서 즐기는 개성 넘치는 케이크, 크리스피 크로넛, 달콤한 음료들은 SNS 감성을 자극하면서도, 한 입 먹으면 그 맛이 진짜임을 증명해낸답니다.",
          ja: "龍仁の保亭洞カフェ通りは京畿道最大のカフェ集積地です。この通りで楽しめる個性あふれるケーキ、クリスピークロナッツ、甘い飲み物は、SNS映えしながらも一口食べるとその本物の味を証明してくれます。",
          en: "Bojeongdong Cafe Street in Yongin is Gyeonggi's largest cafe hub. The eclectic cakes, crispy cronuts, and artisanal drinks here look amazing on social media — and the moment you taste them, you know the beauty isn't just visual."
        },
        ingredients: { ko: ["밀가루", "버터", "생크림", "계절 과일", "초콜릿", "설탕"], ja: ["小麦粉", "バター", "生クリーム", "旬のフルーツ", "チョコレート", "砂糖"], en: ["Flour", "Butter", "Heavy cream", "Seasonal fruit", "Chocolate", "Sugar"] },
        tags: ["카페", "디저트", "트렌디"],
        dupes: [
          {
            name: { ko: "파르페", ja: "パフェ", en: "Parfait" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 72, salty: 8, spicy: 0, umami: 10, sour: 25 },
            description: { ko: "아이스크림과 과일, 크림, 시리얼 등을 층층이 쌓아 올린 일본식 파르페 디저트", ja: "アイスクリームとフルーツ、クリーム、シリアルなどを層に重ねた日本式パフェデザート", en: "Japanese parfait layered with ice cream, fruit, cream, and cereal in a tall glass" },
            ingredients: { ko: ["아이스크림", "과일", "생크림", "시리얼", "초콜릿 소스"], ja: ["アイスクリーム", "フルーツ", "生クリーム", "シリアル", "チョコソース"], en: ["Ice cream", "Fruit", "Whipped cream", "Cereal", "Chocolate sauce"] },
            similarityPercent: 75,
            matchReason: { ko: "다층 구조의 달콤한 디저트 + 과일과 크림 조합 + 눈에도 즐거운 비주얼", ja: "多層構造の甘いデザート + フルーツとクリームの組み合わせ + 目にも楽しいビジュアル", en: "Layered sweet dessert + fruit and cream combination + visually stunning presentation" }
          }
        ]
      },
      {
        id: "yongin-makgeolli",
        name: { ko: "용인 막걸리", ja: "龍仁マッコリ", en: "Yongin Makgeolli" },
        region: "yongin",
        image: "/images/food/yon-makgeolli.jpg",
        tasteProfile: { sweet: 40, salty: 10, spicy: 5, umami: 30, sour: 45 },
        storyDescription: {
          ko: "용인 지역의 전통 양조장에서 빚어낸 생막걸리예요. 탁하고 뽀얀 빛깔 속에 은은한 단맛과 알싸한 신맛이 균형을 이루고 있어, 파전이나 두부김치 한 접시와 함께하면 민속촌 마당에서 마시는 것 같은 낭만이 있답니다.",
          ja: "龍仁地域の伝統的な醸造所で醸した生マッコリです。白濁した見た目の中に、ほのかな甘みとピリッとした酸味が均衡を保っており、パジョンや豆腐キムチと一緒に楽しむと、民俗村の庭で飲んでいるような浪漫があります。",
          en: "Freshly brewed makgeolli from Yongin's traditional brewery. The milky white liquid balances gentle sweetness with bright tanginess — paired with pajeon or dubu kimchi, you feel like you're drinking in the courtyard of the Korean Folk Village."
        },
        ingredients: { ko: ["쌀", "누룩", "물", "효모"], ja: ["米", "麹", "水", "酵母"], en: ["Rice", "Nuruk (koji)", "Water", "Yeast"] },
        tags: ["막걸리", "전통주", "발효"],
        dupes: [
          {
            name: { ko: "니고리자케", ja: "にごり酒", en: "Nigorizake" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 45, salty: 8, spicy: 5, umami: 25, sour: 35 },
            description: { ko: "탁하게 걸러지지 않은 일본의 전통 흰 탁주", ja: "粗く漉された日本の伝統的な白濁り酒", en: "Traditional Japanese unfiltered cloudy rice wine with rough straining" },
            ingredients: { ko: ["쌀", "쌀누룩", "물", "효모"], ja: ["米", "米麹", "水", "酵母"], en: ["Rice", "Rice koji", "Water", "Yeast"] },
            similarityPercent: 88,
            matchReason: { ko: "탁하고 뽀얀 발효 쌀술 + 단맛과 산미의 균형 + 가볍고 청량한 도수", ja: "白濁した発酵米酒 + 甘みと酸味のバランス + 軽くて爽やかなアルコール度数", en: "Cloudy fermented rice alcohol + sweet-sour balance + light refreshing ABV" }
          }
        ]
      }
    ]
  },
  {
    code: "icheon",
    name: { ko: "이천", ja: "利川", en: "Icheon" },
    icon: "🍚",
    image: "/images/village/이천.png",
    description: {
      ko: "임금님 수라상에 오르던 명품 쌀밥의 도시",
      ja: "王様の食卓に上がった名品ご飯の都市",
      en: "The city of premium rice once served on the King's table"
    },
    foods: [
      {
        id: "icheon-rice-table",
        name: { ko: "이천 쌀밥 정식", ja: "利川ご飯定食", en: "Icheon Rice Table" },
        region: "icheon",
        image: "/images/food/ich-rice-table.jpg",
        tasteProfile: { sweet: 25, salty: 45, spicy: 25, umami: 75, sour: 10 },
        storyDescription: {
          ko: "임금님 수라상에 올랐다는 이천 쌀로 지은 밥은 한 톨 한 톨이 탱글탱글하고 윤기가 자르르 흘러요. 이 밥을 중심으로 구성된 정식 한 상을 받으면, 밥 그 자체가 주인공인 식사가 이런 것이구나 하는 감동을 받게 된답니다.",
          ja: "王様の食卓に上がったという利川のお米で炊いたご飯は、粒一粒がぷりぷりでツヤツヤ光り輝いています。このご飯を中心に構成された定食一膳を受け取ると、ご飯そのものが主役の食事とはこういうことかという感動を覚えます。",
          en: "Icheon rice — once presented at the royal table — shines with plump, glistening grains. When a full rice table set arrives centered on this legendary rice, you finally understand what it means for rice itself to be the star of a meal."
        },
        ingredients: { ko: ["이천 쌀", "된장찌개", "나물 반찬", "구이", "김치", "계란", "멸치볶음"], ja: ["利川米", "味噌チゲ", "ナムルおかず", "焼き物", "キムチ", "卵", "炒めじゃこ"], en: ["Icheon rice", "Doenjang jjigae", "Namul side dishes", "Grilled dish", "Kimchi", "Egg", "Stir-fried anchovy"] },
        tags: ["쌀밥", "정식", "임금님"],
        dupes: [
          {
            name: { ko: "고시히카리 정식", ja: "コシヒカリ定食", en: "Koshihikari Set Meal" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 20, salty: 40, spicy: 10, umami: 75, sour: 10 },
            description: { ko: "일본 최고급 쌀 고시히카리 밥을 중심으로 한 정갈한 정식", ja: "日本最高級米コシヒカリご飯を中心とした上品な定食", en: "A refined set meal centered on premium Koshihikari rice, Japan's finest variety" },
            ingredients: { ko: ["고시히카리 쌀", "미소시루", "야채 반찬", "절임류", "생선 구이"], ja: ["コシヒカリ米", "味噌汁", "野菜おかず", "漬物", "焼き魚"], en: ["Koshihikari rice", "Miso soup", "Vegetable side dishes", "Pickles", "Grilled fish"] },
            similarityPercent: 87,
            matchReason: { ko: "프리미엄 품종 쌀밥이 주인공 + 다채로운 반찬 구성 + 쌀 본연의 단맛과 윤기", ja: "プレミアム品種のご飯が主役 + 多彩なおかず構成 + お米本来の甘みとツヤ", en: "Premium variety rice as the hero + diverse side dish spread + natural rice sweetness and shine" }
          }
        ]
      },
      {
        id: "icheon-bori-gulbi",
        name: { ko: "보리굴비", ja: "麦塩干しグルビ", en: "Bori Gulbi" },
        region: "icheon",
        image: "/images/food/ich-bori-gulbi.jpg",
        tasteProfile: { sweet: 10, salty: 70, spicy: 10, umami: 85, sour: 5 },
        storyDescription: {
          ko: "참조기를 소금에 절여 보리 속에서 서서히 숙성시킨 전통 건생선이에요. 수분이 빠지면서 응축된 감칠맛이 놀랍도록 진해지고, 따뜻한 밥 위에 한 점 올려 먹으면 다른 반찬이 필요 없는 밥도둑이 된답니다.",
          ja: "真グチを塩漬けにして麦の中でゆっくり熟成させた伝統的な干し魚です。水分が抜けることで凝縮された旨味が驚くほど濃厚になり、温かいご飯の上に一切れ乗せて食べると、他のおかずが要らないご飯泥棒になります。",
          en: "Yellow corvina salted and slowly aged inside barley — a traditional dried fish. As moisture evaporates, the concentrated umami becomes breathtakingly intense. One piece over warm rice and you need no other side dish."
        },
        ingredients: { ko: ["참조기", "천일염", "보리", "시간"], ja: ["真グチ", "天日塩", "麦", "時間"], en: ["Yellow corvina", "Sea salt", "Barley", "Time (aging)"] },
        tags: ["건생선", "숙성", "전통"],
        dupes: [
          {
            name: { ko: "히모노", ja: "干物", en: "Himono" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 65, spicy: 5, umami: 82, sour: 5 },
            description: { ko: "생선을 소금물에 절여 햇볕에 말린 일본 전통 건어물", ja: "魚を塩水に漬けて天日干しにした日本の伝統干物", en: "Traditional Japanese dried fish soaked in salt water and sun-dried" },
            ingredients: { ko: ["생선", "소금물", "햇빛"], ja: ["魚", "塩水", "日光"], en: ["Fish", "Salt water", "Sunlight"] },
            similarityPercent: 84,
            matchReason: { ko: "염장 건조로 응축된 감칠맛 + 밥반찬으로 최적 + 전통 보존 방식", ja: "塩漬け乾燥で凝縮された旨味 + ご飯のおかずとして最適 + 伝統的な保存方法", en: "Salt-dried concentrated umami + perfect rice accompaniment + traditional preservation technique" }
          }
        ]
      },
      {
        id: "icheon-ganjang-gejang",
        name: { ko: "간장게장", ja: "醤油ワタリガニ漬け", en: "Soy Sauce Marinated Crab" },
        region: "icheon",
        image: "/images/food/ich-ganjang-gejang.jpg",
        tasteProfile: { sweet: 20, salty: 65, spicy: 10, umami: 95, sour: 10 },
        storyDescription: {
          ko: "신선한 꽃게를 간장에 담가 숙성시킨 요리로, '밥도둑'이라 불리는 데는 다 이유가 있어요. 짭조름하고 감칠맛 폭발하는 게장을 이천 밥에 올려 비벼 먹으면, 순식간에 밥 한 공기가 사라지는 마법을 경험하게 된답니다.",
          ja: "新鮮なワタリガニを醤油に漬けて熟成させた料理で、「ご飯泥棒」と呼ばれるのには理由があります。塩辛くて旨味が爆発するケジャンを利川のご飯に乗せて混ぜて食べると、あっという間にご飯一膳が消える魔法を体験できます。",
          en: "Fresh blue crab marinated in soy sauce and aged — there's a reason it's called 'the rice thief'. Spoon this salty, umami-explosive gejang over Icheon rice, mix it in, and experience the magic of a full bowl vanishing in an instant."
        },
        ingredients: { ko: ["꽃게", "간장", "마늘", "생강", "청양고추", "다시마", "설탕"], ja: ["ワタリガニ", "醤油", "ニンニク", "生姜", "青唐辛子", "昆布", "砂糖"], en: ["Blue crab", "Soy sauce", "Garlic", "Ginger", "Green chili", "Kelp", "Sugar"] },
        tags: ["게장", "밥도둑", "발효"],
        dupes: [
          {
            name: { ko: "와타리가니 조림", ja: "ワタリガニの煮物", en: "Braised Blue Crab" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 30, salty: 55, spicy: 5, umami: 85, sour: 10 },
            description: { ko: "꽃게를 달콤짭짤한 간장 소스에 조린 일본 요리", ja: "ワタリガニを甘辛い醤油ソースで煮た日本料理", en: "Japanese dish of blue crab braised in sweet-salty soy sauce" },
            ingredients: { ko: ["꽃게", "간장", "미림", "설탕", "생강", "다시마"], ja: ["ワタリガニ", "醤油", "みりん", "砂糖", "生姜", "昆布"], en: ["Blue crab", "Soy sauce", "Mirin", "Sugar", "Ginger", "Kelp"] },
            similarityPercent: 79,
            matchReason: { ko: "꽃게 + 간장 베이스 양념 + 밥과 함께하는 감칠맛 극강 요리", ja: "ワタリガニ + 醤油ベースの味付け + ご飯と一緒に食べる旨味MAX料理", en: "Blue crab + soy-based marinade + peak-umami dish served with rice" }
          }
        ]
      },
      {
        id: "icheon-jeyuk-bokkeum",
        name: { ko: "제육볶음", ja: "豚肉炒め", en: "Spicy Stir-Fried Pork" },
        region: "icheon",
        image: "/images/food/ich-jeyuk-bokkeum.jpg",
        tasteProfile: { sweet: 30, salty: 55, spicy: 70, umami: 70, sour: 10 },
        storyDescription: {
          ko: "이천 쌀밥과 제육볶음의 조합은 경기도 밥상의 클래식이에요. 고추장 양념에 매콤하게 볶아진 돼지고기 한 점을 탱글탱글한 이천 쌀밥 위에 올려 먹는 그 순간은, 아무리 많이 먹어도 질리지 않는 한국 소울 푸드랍니다.",
          ja: "利川のご飯と豚肉炒めの組み合わせは京畿道の食卓のクラシックです。コチュジャンの薬味で辛く炒めた豚肉一切れを、ぷりぷりの利川ご飯の上に乗せて食べるその瞬間は、何度食べても飽きない韓国のソウルフードです。",
          en: "Icheon rice paired with jeyuk bokkeum is a Gyeonggi table classic. That moment of placing a spicy gochujang-glazed pork piece atop plump Icheon rice is the Korean soul food you never tire of, no matter how many times you eat it."
        },
        ingredients: { ko: ["돼지고기", "고추장", "간장", "마늘", "생강", "파", "참기름", "설탕"], ja: ["豚肉", "コチュジャン", "醤油", "ニンニク", "生姜", "ネギ", "ごま油", "砂糖"], en: ["Pork", "Gochujang", "Soy sauce", "Garlic", "Ginger", "Green onion", "Sesame oil", "Sugar"] },
        tags: ["볶음", "매콤", "돼지고기"],
        dupes: [
          {
            name: { ko: "부타 쇼가야키", ja: "豚の生姜焼き", en: "Buta Shogayaki" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 35, salty: 50, spicy: 15, umami: 70, sour: 10 },
            description: { ko: "생강 간장 소스에 볶은 일본식 돼지고기 볶음", ja: "生姜醤油ソースで炒めた日本式豚肉炒め", en: "Japanese stir-fried pork in ginger-soy sauce" },
            ingredients: { ko: ["돼지 불고기용", "생강", "간장", "미림", "양파"], ja: ["豚薄切り", "生姜", "醤油", "みりん", "玉ねぎ"], en: ["Pork slices", "Ginger", "Soy sauce", "Mirin", "Onion"] },
            similarityPercent: 82,
            matchReason: { ko: "달콤짭짤한 소스의 돼지고기 볶음 + 밥반찬으로 최적 + 고기 향 가득한 볶음 요리", ja: "甘辛いソースの豚肉炒め + ご飯のおかずとして最適 + 肉の香り豊かな炒め料理", en: "Sweet-savory sauce stir-fried pork + ideal rice side dish + meat-fragrant pan-fried dish" }
          }
        ]
      },
      {
        id: "icheon-hanwoo-gui",
        name: { ko: "이천 한우 구이", ja: "利川韓牛焼肉", en: "Icheon Hanwoo Grilled Beef" },
        region: "icheon",
        image: "/images/food/ich-hanwoo-gui.jpg",
        tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 92, sour: 5 },
        storyDescription: {
          ko: "이천 쌀밥을 곁들여 먹는 한우 구이는 이 지역의 격조 있는 식사 문화예요. 살살 녹는 마블링의 한우를 구워서 이천 쌀밥 한 숟갈과 함께 먹으면, 그야말로 밥 한 공기가 사치가 된답니다.",
          ja: "利川のご飯を添えて食べる韓牛焼肉は、この地域の格調ある食文化です。とろけるようなサシの韓牛を焼いて利川のご飯一さじと一緒に食べると、まさにご飯一膳が贅沢になります。",
          en: "Grilled Hanwoo beef served alongside Icheon rice is this region's elevated dining culture. Cook the melt-in-your-mouth marbled beef and take a spoonful of Icheon rice with it — suddenly, even a simple bowl of rice becomes pure luxury."
        },
        ingredients: { ko: ["한우 채끝", "소금", "참기름", "마늘", "이천 쌀밥", "상추", "쌈장"], ja: ["韓牛サーロイン", "塩", "ごま油", "ニンニク", "利川ご飯", "サンチュ", "サムジャン"], en: ["Hanwoo striploin", "Salt", "Sesame oil", "Garlic", "Icheon rice", "Lettuce", "Ssamjang"] },
        tags: ["한우", "구이", "이천쌀"],
        dupes: [
          {
            name: { ko: "와규 시오야키", ja: "和牛塩焼き", en: "Wagyu Shioyaki" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 42, spicy: 0, umami: 95, sour: 3 },
            description: { ko: "최상급 와규에 소금만 뿌려 굽는 가장 순수한 형태의 야키니쿠", ja: "最上級の和牛に塩だけをふって焼く最も純粋な形の焼き肉", en: "The purest form of wagyu yakiniku: top-grade beef seasoned only with salt and grilled" },
            ingredients: { ko: ["와규", "소금", "레몬", "와사비"], ja: ["和牛", "塩", "レモン", "わさび"], en: ["Wagyu beef", "Salt", "Lemon", "Wasabi"] },
            similarityPercent: 90,
            matchReason: { ko: "프리미엄 소고기 + 소금 간으로 재료 본연의 맛 살리기 + 구워서 밥과 함께", ja: "プレミアム牛肉 + 塩で食材本来の味を引き出す + 焼いてご飯と一緒に", en: "Premium beef + salt seasoning to highlight natural flavor + grilled and paired with rice" }
          }
        ]
      },
      {
        id: "icheon-straw-pork",
        name: { ko: "볏짚 삼겹살", ja: "藁火豚バラ焼き", en: "Straw-Fire Pork Belly" },
        region: "icheon",
        image: "/images/food/ich-straw-pork.jpg",
        tasteProfile: { sweet: 15, salty: 50, spicy: 10, umami: 80, sour: 5 },
        storyDescription: {
          ko: "이천에서 생산되는 볏짚으로 삼겹살 표면을 훑어 구워낸 특별한 조리법이에요. 볏짚 불꽃이 고기 겉면을 스쳐지나가면서 은은한 짚 향이 배어들고, 겉은 바삭하면서 속은 촉촉한 환상적인 삼겹살이 완성된답니다.",
          ja: "利川で生産される藁で豚バラ肉の表面をあぶって焼く特別な調理法です。藁の炎が肉の表面をかすめながらほのかな藁の香りが染み込み、外はカリカリで中はしっとりした幻想的な豚バラ肉が完成します。",
          en: "A special technique using Icheon-grown rice straw to sear the surface of pork belly. As the straw flame skims the meat, a subtle smoky aroma seeps in — creating pork belly with a crispy exterior, juicy interior, and that ineffable straw-kissed fragrance."
        },
        ingredients: { ko: ["삼겹살", "볏짚", "소금", "참기름", "마늘", "상추"], ja: ["豚バラ肉", "稲藁", "塩", "ごま油", "ニンニク", "サンチュ"], en: ["Pork belly", "Rice straw", "Salt", "Sesame oil", "Garlic", "Lettuce"] },
        tags: ["삼겹살", "볏짚", "훈연"],
        dupes: [
          {
            name: { ko: "와라야키 가쓰오", ja: "藁焼きかつお", en: "Warayaki Katsuo" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 85, sour: 15 },
            description: { ko: "고치 현의 전통 볏짚 직화로 표면을 그을린 가다랑어 요리", ja: "高知県の伝統的な藁の直火で表面を焦がしたカツオ料理", en: "Kochi prefecture's traditional katsuo with surface seared by direct rice-straw flame" },
            ingredients: { ko: ["가다랑어", "볏짚", "파", "마늘", "생강", "폰즈"], ja: ["カツオ", "藁", "ネギ", "ニンニク", "生姜", "ポン酢"], en: ["Skipjack tuna", "Rice straw", "Green onion", "Garlic", "Ginger", "Ponzu"] },
            similarityPercent: 85,
            matchReason: { ko: "볏짚 불꽃 직화 기법 + 식재료 겉면에 스며드는 짚 향 + 겉 그을림 속 촉촉함", ja: "藁の直火技法 + 食材表面に染み込む藁の香り + 外焦げ内しっとり", en: "Rice-straw direct-flame technique + straw aroma penetrating the surface + crispy outside, moist inside" }
          }
        ]
      },
      {
        id: "icheon-royal-table",
        name: { ko: "임금님 수라상", ja: "王の御膳", en: "Royal Table" },
        region: "icheon",
        image: "/images/food/ich-royal-table.jpg",
        tasteProfile: { sweet: 30, salty: 45, spicy: 25, umami: 85, sour: 20 },
        storyDescription: {
          ko: "이천 쌀밥을 중심으로 수십 가지 반찬이 격식 있게 펼쳐지는 왕의 밥상이에요. 조선 궁중 요리의 방식을 계승하여 재료 하나하나에 정성을 다했고, 이천이라는 지역의 자부심과 전통이 이 한 상 안에 모두 담겨 있답니다.",
          ja: "利川のご飯を中心に何十種類ものおかずが格式高く並べられた王の食卓です。朝鮮宮廷料理の方式を継承して食材一つ一つに誠意を尽くし、利川という地域の誇りと伝統がこの一膳に全て込められています。",
          en: "A royal dining spread with dozens of side dishes laid out in formal style, centered on Icheon rice. Inheriting the Joseon royal court culinary tradition, every ingredient is treated with utmost care — all of Icheon's pride and heritage in a single glorious table."
        },
        ingredients: { ko: ["이천 쌀밥", "구절판", "신선로", "전유어", "나물", "김치", "찜", "정과"], ja: ["利川ご飯", "九折板", "神仙炉", "チヂミ", "ナムル", "キムチ", "蒸し物", "正果"], en: ["Icheon rice", "Gujeolpan (nine-section dish)", "Royal hotpot", "Pan-fried dishes", "Namul", "Kimchi", "Steamed dishes", "Candied sweets"] },
        tags: ["궁중", "정찬", "전통"],
        dupes: [
          {
            name: { ko: "오세치 요리", ja: "お節料理", en: "Osechi Ryori" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 35, salty: 45, spicy: 5, umami: 80, sour: 25 },
            description: { ko: "새해에 정성껏 준비하는 일본 전통 다단 도시락 형태의 격식 요리", ja: "お正月に丁寧に準備する日本の伝統的な重箱形式の格式料理", en: "Japan's elaborate New Year celebratory cuisine prepared in traditional stacked lacquer boxes" },
            ingredients: { ko: ["검은콩", "다시마롤", "새우", "계란 조림", "고구마 정과"], ja: ["黒豆", "昆布巻き", "海老", "卵の煮物", "芋きんとん"], en: ["Black beans", "Kelp roll", "Shrimp", "Simmered egg", "Sweet potato kinton"] },
            similarityPercent: 80,
            matchReason: { ko: "다수의 격식 있는 소반찬 + 계승된 왕조 요리 전통 + 의례적 성격의 정찬", ja: "多数の格式ある小皿料理 + 継承された王朝料理の伝統 + 儀礼的性格の正餐", en: "Multiple formal small dishes + inherited dynastic culinary tradition + ceremonial set meal" }
          }
        ]
      },
      {
        id: "icheon-makguksu",
        name: { ko: "이천 막국수", ja: "利川マックッス", en: "Icheon Makguksu" },
        region: "icheon",
        image: "/images/food/ich-makguksu.jpg",
        tasteProfile: { sweet: 20, salty: 45, spicy: 50, umami: 60, sour: 40 },
        storyDescription: {
          ko: "메밀 향 물씬 풍기는 차가운 막국수에 이천 쌀로 만든 밥을 곁들이는 것이 이 지역만의 독특한 조합이에요. 탄력 있는 메밀 면의 쫄깃함과 새콤달콤한 양념이 어우러지면서, 여름날 오후의 느긋한 식사 풍경이 그려진답니다.",
          ja: "そばの香りが漂う冷たいマックッスに利川のお米で作ったご飯を添えるのが、この地域だけのユニークな組み合わせです。弾力のあるそば麺のもちもち感と甘酸っぱい薬味が調和して、夏の午後ののんびりとした食事の風景が浮かびます。",
          en: "Cold makguksu fragrant with buckwheat aroma paired with Icheon rice — this region's unique combination. The springy buckwheat noodles and sweet-sour-spicy seasoning together paint a picture of a leisurely summer afternoon meal."
        },
        ingredients: { ko: ["메밀 면", "양념장", "오이", "계란", "무", "식초", "겨자"], ja: ["そば麺", "ヤンニョムジャン", "きゅうり", "卵", "大根", "酢", "からし"], en: ["Buckwheat noodles", "Spicy sauce", "Cucumber", "Egg", "Radish", "Vinegar", "Mustard"] },
        tags: ["막국수", "메밀", "냉면"],
        dupes: [
          {
            name: { ko: "모리소바", ja: "もりそば", en: "Mori Soba" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 15, salty: 40, spicy: 5, umami: 65, sour: 20 },
            description: { ko: "쟁반에 소복이 올린 차가운 메밀국수를 쯔유에 찍어 먹는 일본 요리", ja: "ざるに盛った冷たいそばをつゆに付けて食べる日本料理", en: "Cold buckwheat soba noodles mounded on a bamboo tray, dipped in tsuyu broth" },
            ingredients: { ko: ["메밀 면", "쯔유", "와사비", "파", "김"], ja: ["そば", "つゆ", "わさび", "ネギ", "のり"], en: ["Soba noodles", "Tsuyu", "Wasabi", "Green onion", "Nori"] },
            similarityPercent: 81,
            matchReason: { ko: "차갑게 먹는 메밀 면 + 진한 소스에 찍기 + 메밀 향 즐기는 여름 국수", ja: "冷やして食べるそば麺 + 濃いつゆに付けて食べる + そばの香りを楽しむ夏の麺", en: "Cold buckwheat noodles + bold dipping sauce + buckwheat-forward summer noodle dish" }
          }
        ]
      },
      {
        id: "icheon-hangwa",
        name: { ko: "이천 한과", ja: "利川韓菓", en: "Icheon Hangwa" },
        region: "icheon",
        image: "/images/food/ich-hangwa.jpg",
        tasteProfile: { sweet: 70, salty: 10, spicy: 0, umami: 20, sour: 5 },
        storyDescription: {
          ko: "이천의 도자기 마을에서 전해 내려오는 전통 한과예요. 깨, 잣, 꿀을 넣어 정성스럽게 만들어진 강정, 약과, 다식들은 단순한 간식이 아니라 조선 시대 선비들이 즐기던 품격 있는 문화의 일부랍니다.",
          ja: "利川の陶芸村から受け継がれてきた伝統的な韓菓です。ごまと松の実、蜂蜜を入れて丁寧に作られた強飯菓子、薬菓、茶食は単なるおやつではなく、朝鮮時代の両班たちが楽しんでいた品格ある文化の一部です。",
          en: "Traditional Korean confections handed down from Icheon's pottery village. Gangjung, yakgwa, and dasik made with sesame, pine nuts, and honey are not mere snacks — they are part of the refined culture enjoyed by Joseon dynasty scholars."
        },
        ingredients: { ko: ["찹쌀가루", "꿀", "참기름", "잣", "깨", "조청", "계피"], ja: ["もち米粉", "蜂蜜", "ごま油", "松の実", "ごま", "水あめ", "シナモン"], en: ["Glutinous rice flour", "Honey", "Sesame oil", "Pine nuts", "Sesame", "Jocheong syrup", "Cinnamon"] },
        tags: ["한과", "전통", "도자기마을"],
        dupes: [
          {
            name: { ko: "와가시", ja: "和菓子", en: "Wagashi" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 65, salty: 8, spicy: 0, umami: 18, sour: 8 },
            description: { ko: "계절의 아름다움을 담아 손으로 빚은 일본 전통 화과자", ja: "季節の美しさを表現して手で形作った日本の伝統和菓子", en: "Traditional Japanese confections handcrafted to express the beauty of the seasons" },
            ingredients: { ko: ["팥소", "찹쌀", "설탕", "한천", "색소 재료"], ja: ["小豆餡", "もち米", "砂糖", "寒天", "天然色素"], en: ["Red bean paste", "Glutinous rice", "Sugar", "Agar", "Natural coloring"] },
            similarityPercent: 84,
            matchReason: { ko: "전통 문화를 담은 정교한 과자 + 곡물과 꿀로 만든 자연 재료 + 눈과 입이 동시에 즐거운 예술품", ja: "伝統文化を宿した精巧な菓子 + 穀物と蜂蜜で作った自然素材 + 目と口が同時に楽しむ芸術品", en: "Artisan confection embodying traditional culture + natural grain and honey ingredients + art piece for eyes and palate" }
          }
        ]
      },
      {
        id: "icheon-sotbap",
        name: { ko: "솥밥", ja: "釜飯", en: "Sotbap (Pot Rice)" },
        region: "icheon",
        image: "/images/food/ich-sotbap.jpg",
        tasteProfile: { sweet: 20, salty: 35, spicy: 10, umami: 70, sour: 5 },
        storyDescription: {
          ko: "작은 무쇠 솥에 이천 쌀과 제철 재료를 넣고 지어낸 솥밥이에요. 솥 뚜껑을 열 때 나는 구수한 김의 향기와 솥 바닥의 노릇한 누룽지는, 어떤 화려한 요리도 대신할 수 없는 단순하고 완벽한 행복이에요.",
          ja: "小さな鋳鉄の釜に利川のお米と旬の食材を入れて炊いた釜飯です。釜の蓋を開けたときに漂う香ばしい蒸気の香りと、釜底の黄金色のおこげは、どんな豪華な料理も代わりにはなれないシンプルで完璧な幸せです。",
          en: "Icheon rice and seasonal ingredients cooked in a small cast-iron pot. The fragrant steam that escapes when you lift the lid, and the golden scorched crust at the bottom — no elaborate dish can replace this simple, perfect happiness."
        },
        ingredients: { ko: ["이천 쌀", "제철 채소", "버섯", "간장", "참기름", "소금"], ja: ["利川米", "旬の野菜", "きのこ", "醤油", "ごま油", "塩"], en: ["Icheon rice", "Seasonal vegetables", "Mushrooms", "Soy sauce", "Sesame oil", "Salt"] },
        tags: ["솥밥", "누룽지", "이천쌀"],
        dupes: [
          {
            name: { ko: "카마메시", ja: "釜飯", en: "Kamameshi" },
            country: "jp", countryFlag: "🇯🇵",
            countryName: { ko: "일본", ja: "日本", en: "Japan" },
            tasteProfile: { sweet: 25, salty: 40, spicy: 5, umami: 75, sour: 5 },
            description: { ko: "작은 무쇠 솥에 쌀과 각종 재료를 넣어 함께 지어내는 일본 향토 요리", ja: "小さな鋳鉄の釜にお米と様々な食材を入れて一緒に炊く日本の郷土料理", en: "Japanese regional dish of rice and various ingredients cooked together in a small iron pot" },
            ingredients: { ko: ["쌀", "닭고기", "버섯", "죽순", "간장", "미림"], ja: ["米", "鶏肉", "きのこ", "たけのこ", "醤油", "みりん"], en: ["Rice", "Chicken", "Mushrooms", "Bamboo shoots", "Soy sauce", "Mirin"] },
            similarityPercent: 95,
            matchReason: { ko: "무쇠 솥에 함께 지어낸 밥 + 솥 바닥 누룽지 + 재료의 맛이 밥에 스며드는 일체감", ja: "鉄釜で一緒に炊いたご飯 + 釜底おこげ + 食材の味がご飯に染み込む一体感", en: "Iron pot cooked rice + scorched bottom crust + all-in-one flavor absorption into rice" }
          }
        ]
      }
    ]
  }
]
