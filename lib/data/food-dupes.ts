export interface TasteProfile {
  sweet: number
  salty: number
  spicy: number
  umami: number
  sour: number
}

export type CountryCode = 'CN' | 'JP' | 'TH' | 'VN' | 'MY' | 'ID' | 'US' | 'IT' | 'FR' | 'IN' | 'ES' | 'MX'

export interface DupeForeignFood {
  name: { ko: string; ja: string; en: string }
  tasteProfile: TasteProfile
  description: { ko: string; ja: string; en: string }
  ingredients: { ko: string[]; ja: string[]; en: string[] }
  similarityPercent: number
  matchReason: { ko: string; ja: string; en: string }
}

export interface DupeChallengeEntry {
  challenge: true
}

export type DupeEntry = DupeForeignFood | DupeChallengeEntry

export interface RegionalFood {
  id: string
  name: { ko: string; ja: string; en: string }
  region: string
  image: string
  tasteProfile: TasteProfile
  storyDescription: { ko: string; ja: string; en: string }
  ingredients: { ko: string[]; ja: string[]; en: string[] }
  tags: string[]
  dupes: Record<string, DupeEntry>
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
        dupes: {
          JP: {
            name: { ko: "마제소바", ja: "まぜそば", en: "Mazesoba" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 30, umami: 80, sour: 10 },
            description: { ko: "국물 없이 면과 토핑을 비벼 먹는 일본식 라멘", ja: "スープなしで麺とトッピングを混ぜて食べる日本式ラーメン", en: "Japanese ramen without soup, mixed with toppings" },
            ingredients: { ko: ["면", "차슈", "계란", "파", "라유"], ja: ["麺", "チャーシュー", "卵", "ネギ", "ラー油"], en: ["Noodles", "Chashu", "Egg", "Green onion", "Chili oil"] },
            similarityPercent: 74,
            matchReason: { ko: "비비는 스타일 + 계란 토핑 + 매콤한 양념의 공통점", ja: "混ぜるスタイル + 卵トッピング + ピリ辛調味料の共通点", en: "Mix-it-up style + egg topping + spicy seasoning" }
          },
          US: {
            name: { ko: "포케 볼", ja: "ポケボウル", en: "Poke Bowl" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 20, umami: 70, sour: 25 },
            description: { ko: "밥 위에 회와 다양한 토핑을 올려 소스와 비벼 먹는 하와이 음식", ja: "ご飯の上に刺身と様々なトッピングをのせてソースと混ぜて食べるハワイ料理", en: "Hawaiian bowl with sashimi and toppings over rice, mixed with sauce" },
            ingredients: { ko: ["밥", "참치회", "아보카도", "망고", "간장소스"], ja: ["ご飯", "マグロ刺身", "アボカド", "マンゴー", "醤油ソース"], en: ["Rice", "Tuna sashimi", "Avocado", "Mango", "Soy sauce"] },
            similarityPercent: 70,
            matchReason: { ko: "밥 위에 다양한 토핑 + 비비는 스타일 + 원볼 구조", ja: "ご飯の上に様々なトッピング + 混ぜるスタイル + ワンボウル構造", en: "Various toppings on rice + mix style + one-bowl structure" }
          }
        }
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
        dupes: {
          JP: {
            name: { ko: "돈지루", ja: "豚汁", en: "Tonjiru" },
            tasteProfile: { sweet: 20, salty: 65, spicy: 5, umami: 90, sour: 5 },
            description: { ko: "돼지고기와 채소를 된장에 끓인 일본식 국", ja: "豚肉と野菜を味噌で煮込んだ日本の汁物", en: "Japanese miso soup with pork and vegetables" },
            ingredients: { ko: ["돼지고기", "된장", "두부", "당근", "곤약"], ja: ["豚肉", "味噌", "豆腐", "人参", "こんにゃく"], en: ["Pork", "Miso", "Tofu", "Carrot", "Konjac"] },
            similarityPercent: 75,
            matchReason: { ko: "뜨끈한 국물 + 채소 듬뿍 + 발효 양념의 깊은 맛", ja: "温かいスープ + 野菜たっぷり + 発酵調味料の深い味わい", en: "Warm broth + plenty of vegetables + deep fermented flavor" }
          }
        }
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
        dupes: {
          JP: {
            name: { ko: "가이세키 요리", ja: "懐石料理", en: "Kaiseki" },
            tasteProfile: { sweet: 25, salty: 40, spicy: 5, umami: 85, sour: 15 },
            description: { ko: "일본의 전통 코스 요리, 계절 식재료로 만든 예술적인 요리", ja: "日本の伝統コース料理、旬の食材で作る芸術的な料理", en: "Traditional Japanese multi-course cuisine with seasonal ingredients" },
            ingredients: { ko: ["제철 생선", "두부", "채소", "다시마", "미소"], ja: ["旬の魚", "豆腐", "野菜", "昆布", "味噌"], en: ["Seasonal fish", "Tofu", "Vegetables", "Kelp", "Miso"] },
            similarityPercent: 81,
            matchReason: { ko: "다양한 소반찬 구성 + 제철 재료 + 눈으로 먹는 아름다움", ja: "多様な小皿構成 + 旬の食材 + 目で食べる美しさ", en: "Multiple small dishes + seasonal ingredients + visual beauty" }
          }
        }
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
        dupes: {
          JP: {
            name: { ko: "츠쿠네", ja: "つくね", en: "Tsukune" },
            tasteProfile: { sweet: 45, salty: 50, spicy: 5, umami: 70, sour: 5 },
            description: { ko: "다진 닭고기를 뭉쳐서 달콤한 타레 소스를 발라 구운 꼬치", ja: "鶏ひき肉を丸めて甘いタレを塗って焼いた串", en: "Minced chicken shaped and grilled with sweet tare sauce" },
            ingredients: { ko: ["닭고기", "간장", "미림", "설탕", "계란"], ja: ["鶏肉", "醤油", "みりん", "砂糖", "卵"], en: ["Chicken", "Soy sauce", "Mirin", "Sugar", "Egg"] },
            similarityPercent: 77,
            matchReason: { ko: "다진 고기를 뭉쳐 구운 스타일 + 달콤짭짤한 간장 양념", ja: "ひき肉を丸めて焼くスタイル + 甘じょっぱい醤油ダレ", en: "Minced meat shaped & grilled + sweet-salty soy glaze" }
          }
        }
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
        dupes: {
          JP: {
            name: { ko: "크림 우동", ja: "クリームうどん", en: "Cream Udon" },
            tasteProfile: { sweet: 20, salty: 40, spicy: 0, umami: 80, sour: 5 },
            description: { ko: "크림 소스에 쫄깃한 우동면을 넣은 퓨전 요리", ja: "クリームソースにもちもちうどんを入れたフュージョン料理", en: "Fusion dish with chewy udon in cream sauce" },
            ingredients: { ko: ["우동면", "생크림", "버터", "파르메산", "버섯"], ja: ["うどん", "生クリーム", "バター", "パルメザン", "きのこ"], en: ["Udon", "Heavy cream", "Butter", "Parmesan", "Mushroom"] },
            similarityPercent: 72,
            matchReason: { ko: "진하고 크리미한 국물 + 쫄깃한 면 + 고소한 풍미", ja: "濃厚でクリーミーなスープ + もちもち麺 + 香ばしい風味", en: "Rich creamy broth + chewy noodles + nutty flavor" }
          }
        }
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
        dupes: {
          JP: {
            name: { ko: "탄탄멘", ja: "担々麺", en: "Tantanmen" },
            tasteProfile: { sweet: 20, salty: 55, spicy: 65, umami: 75, sour: 10 },
            description: { ko: "매콤하고 고소한 참깨 국물의 일본식 라멘", ja: "ピリ辛で香ばしいゴマスープの日本式ラーメン", en: "Japanese ramen with spicy and nutty sesame broth" },
            ingredients: { ko: ["면", "참깨", "고추기름", "다진고기", "청경채"], ja: ["麺", "ゴマ", "ラー油", "ひき肉", "チンゲン菜"], en: ["Noodles", "Sesame", "Chili oil", "Ground pork", "Bok choy"] },
            similarityPercent: 73,
            matchReason: { ko: "매콤한 국물 면 + 고추기름 + 고소한 소스가 면에 감기는 맛", ja: "辛いスープ麺 + ラー油 + 香ばしいソースが麺に絡む味", en: "Spicy broth noodles + chili oil + rich sauce clinging to noodles" }
          }
        }
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
        dupes: {
          GB: {
            name: { ko: "블랙 푸딩", ja: "ブラックプディング", en: "Black Pudding" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 80, sour: 5 },
            description: { ko: "돼지피와 귀리, 지방을 넣어 만든 영국 전통 소시지", ja: "豚の血とオーツ麦、脂肪を入れて作ったイギリスの伝統ソーセージ", en: "Traditional British sausage made with pig's blood, oats, and fat" },
            ingredients: { ko: ["돼지피", "귀리", "돼지기름", "양파", "향신료"], ja: ["豚の血", "オーツ麦", "豚の脂", "玉ねぎ", "スパイス"], en: ["Pig's blood", "Oats", "Pork fat", "Onion", "Spices"] },
            similarityPercent: 79,
            matchReason: { ko: "피와 곡물을 넣어 만든 소시지 + 진하고 든든한 맛", ja: "血と穀物を入れて作るソーセージ + 濃厚で満腹感のある味", en: "Blood & grain sausage + rich, filling flavor" }
          }
        }
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
        dupes: {
          FR: {
            name: { ko: "부이야베스", ja: "ブイヤベース", en: "Bouillabaisse" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 20, umami: 85, sour: 15 },
            description: { ko: "다양한 생선과 해산물을 토마토 국물에 끓인 프랑스 남부 전통 요리", ja: "様々な魚介類をトマトスープで煮込んだ南フランスの伝統料理", en: "Traditional Southern French stew with various fish in tomato broth" },
            ingredients: { ko: ["생선", "새우", "토마토", "사프란", "마늘"], ja: ["魚", "海老", "トマト", "サフラン", "ニンニク"], en: ["Fish", "Shrimp", "Tomato", "Saffron", "Garlic"] },
            similarityPercent: 72,
            matchReason: { ko: "생선 국물 요리 + 진한 육수 + 전통 토속 요리의 깊은 맛", ja: "魚のスープ料理 + 濃厚なスープ + 伝統郷土料理の深い味", en: "Fish stew + rich broth + deep flavor of traditional local cuisine" }
          }
        }
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
        dupes: {
          JP: {
            name: { ko: "도라야키", ja: "どら焼き", en: "Dorayaki" },
            tasteProfile: { sweet: 85, salty: 5, spicy: 0, umami: 10, sour: 0 },
            description: { ko: "부드러운 카스텔라 반죽 사이에 달콤한 팥소를 넣은 일본 과자", ja: "柔らかいカステラ生地の間に甘いあんこを入れた日本のお菓子", en: "Sweet red bean paste sandwiched between fluffy castella pancakes" },
            ingredients: { ko: ["밀가루", "팥앙금", "계란", "설탕", "꿀"], ja: ["小麦粉", "あんこ", "卵", "砂糖", "蜂蜜"], en: ["Flour", "Red bean paste", "Egg", "Sugar", "Honey"] },
            similarityPercent: 76,
            matchReason: { ko: "부드러운 빵 사이에 달콤한 필링 + 수제 간식의 정겨움", ja: "柔らかいパンの間に甘いフィリング + 手作りおやつの温もり", en: "Sweet filling between soft bread + warmth of handmade snacks" }
          }
        }
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
        dupes: {
          VN: {
            name: { ko: "반미", ja: "バインミー", en: "Banh Mi" },
            tasteProfile: { sweet: 20, salty: 50, spicy: 35, umami: 55, sour: 30 },
            description: { ko: "바게트에 고기, 채소, 소스를 넣은 베트남 대표 샌드위치", ja: "バゲットに肉、野菜、ソースを入れたベトナムの代表的なサンドイッチ", en: "Vietnamese signature sandwich with meat, vegetables, and sauce in a baguette" },
            ingredients: { ko: ["바게트", "돼지고기", "당근절임", "무절임", "고수", "칠리소스"], ja: ["バゲット", "豚肉", "人参の甘酢漬け", "大根の甘酢漬け", "パクチー", "チリソース"], en: ["Baguette", "Pork", "Pickled carrot", "Pickled radish", "Cilantro", "Chili sauce"] },
            similarityPercent: 82,
            matchReason: { ko: "바게트 빵 + 고기 속 재료 + 매콤한 소스의 완벽한 조합", ja: "バゲットパン + 肉の具材 + ピリ辛ソースの完璧な組み合わせ", en: "Baguette bread + meat filling + spicy sauce — perfect combo" }
          }
        }
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
        image: "/images/food/삼겹살.png",
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
          JP: {
            name: { ko: "야키니쿠", ja: "焼肉", en: "Yakiniku" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 80, sour: 5 },
            description: { ko: "철판이나 숯불에 소고기를 직접 구워 먹는 일본식 구이 요리로, 참기름과 간장 양념이 핵심이에요.", ja: "鉄板や炭火で牛肉を直火焼きにして食べる日本の焼肉料理で、ごま油と醤油のたれが決め手です。", en: "Japanese grilled beef cooked on iron plate or charcoal, seasoned with sesame oil and soy-based sauce." },
            ingredients: { ko: ["소고기", "간장", "미림", "참기름", "마늘", "파"], ja: ["牛肉", "醤油", "みりん", "ごま油", "にんにく", "ネギ"], en: ["Beef", "Soy sauce", "Mirin", "Sesame oil", "Garlic", "Green onion"] },
            similarityPercent: 85,
            matchReason: { ko: "직화 구이 방식과 감칠맛 넘치는 양념장, 테이블에서 직접 구워 먹는 방식이 삼겹살과 흡사해요.", ja: "直火焼きスタイルと旨味豊かなたれ、テーブルで直焼きするスタイルが三枚肉にそっくりです。", en: "Direct-fire grilling, umami-rich sauce, and tabletop cooking style closely mirror samgyeopsal." }
          },
          US: {
            name: { ko: "베이컨 바베큐", ja: "ベーコンBBQ", en: "Bacon BBQ" },
            tasteProfile: { sweet: 20, salty: 60, spicy: 10, umami: 70, sour: 5 },
            description: { ko: "두꺼운 훈제 베이컨을 BBQ 소스에 구운 미국식 바비큐로, 스모키한 향이 일품이에요.", ja: "厚切りスモークベーコンをBBQソースで焼いたアメリカンバーベキューで、スモーキーな香りが絶品です。", en: "Thick smoked bacon grilled with BBQ sauce — an American classic with deep smoky flavor." },
            ingredients: { ko: ["베이컨", "BBQ소스", "흑설탕", "마늘파우더", "훈연칩"], ja: ["ベーコン", "BBQソース", "黒砂糖", "ガーリックパウダー", "スモークチップ"], en: ["Bacon", "BBQ sauce", "Brown sugar", "Garlic powder", "Smoke chips"] },
            similarityPercent: 72,
            matchReason: { ko: "두꺼운 돼지 뱃살을 고온에 구워 지방이 녹아내리는 풍미가 삼겹살과 닮았어요.", ja: "厚切り豚バラ肉を高温で焼き、脂が溶け出す風味が三枚肉に似ています。", en: "Thick pork belly cooked at high heat where the fat renders out, similar to samgyeopsal." }
          },
          ES: {
            name: { ko: "이베리코 철판 구이", ja: "イベリコ鉄板焼き", en: "Ibérico Plancha" },
            tasteProfile: { sweet: 5, salty: 50, spicy: 8, umami: 88, sour: 5 },
            description: { ko: "이베리코 흑돼지 뱃살을 철판에 올리브오일로 구운 스페인 요리예요.", ja: "イベリコ黒豚のバラ肉をオリーブオイルで鉄板焼きにしたスペイン料理です。", en: "Ibérico black pork belly seared on a hot iron plate with olive oil." },
            ingredients: { ko: ["이베리코 삼겹살", "올리브오일", "굵은 소금", "로즈마리", "마늘"], ja: ["イベリコバラ肉", "オリーブオイル", "粗塩", "ローズマリー", "にんにく"], en: ["Ibérico pork belly", "Olive oil", "Sea salt", "Rosemary", "Garlic"] },
            similarityPercent: 78,
            matchReason: { ko: "최고급 돼지 뱃살을 구워 마블링에서 흘러내리는 기름진 감칠맛이 삼겹살과 똑같아요.", ja: "最高級の豚バラ肉を焼き、サシから滴る脂の旨みが三枚肉と同じです。", en: "Premium pork belly grilled until the fat marbling melts — the same rich, unctuous flavor as samgyeopsal." }
          }
        }
      },
      {
        id: "seoul-tteokbokki",
        name: { ko: "떡볶이", ja: "トッポッキ", en: "Tteokbokki" },
        region: "seoul",
        image: "/images/food/떡볶이.png",
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
          CN: {
            name: { ko: "마라 녠가오", ja: "麻辣年糕", en: "Mala Niangao" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 85, umami: 60, sour: 5 },
            description: { ko: "마라 소스에 조린 중국식 가래떡 볶음으로, 얼얼한 매운맛이 특징이에요.", ja: "麻辣ソースで炒めた中国式餅の炒め物で、しびれる辛さが特徴です。", en: "Chinese rice cakes stir-fried in numbing mala sauce — fiery, glossy, and addictive." },
            ingredients: { ko: ["가래떡", "마라소스", "두반장", "건고추", "화자오", "대파"], ja: ["餅", "麻辣ソース", "豆板醤", "唐辛子", "花椒", "長ネギ"], en: ["Rice cake", "Mala sauce", "Doubanjiang", "Dried chili", "Sichuan pepper", "Green onion"] },
            similarityPercent: 82,
            matchReason: { ko: "쫄깃한 떡에 매콤한 소스를 입혀 먹는 방식이 완전히 같고, 떡볶이보다 더 강렬한 매운맛이에요.", ja: "もちもちの餅に辛いソースをからめて食べるスタイルが全く同じで、トッポッキよりさらに強烈な辛さです。", en: "Same chewy rice cake in spicy sauce concept — mala version cranks the heat even higher than tteokbokki." }
          },
          IT: {
            name: { ko: "아라비아따 뇨끼", ja: "アラビアータニョッキ", en: "Gnocchi all'Arrabbiata" },
            tasteProfile: { sweet: 20, salty: 45, spicy: 60, umami: 55, sour: 20 },
            description: { ko: "매콤한 아라비아따 소스에 버무린 이탈리아 감자 뇨끼로, 쫄깃한 식감이 매력이에요.", ja: "ピリ辛アラビアータソースで和えたイタリアのポテトニョッキで、もちもちした食感が魅力です。", en: "Italian potato gnocchi tossed in spicy arrabbiata sauce — chewy pillows with a fiery tomato kick." },
            ingredients: { ko: ["뇨끼", "토마토소스", "페페론치노", "마늘", "올리브오일", "파마산"], ja: ["ニョッキ", "トマトソース", "ペペロンチーノ", "にんにく", "オリーブオイル", "パルメザン"], en: ["Gnocchi", "Tomato sauce", "Peperoncino", "Garlic", "Olive oil", "Parmesan"] },
            similarityPercent: 70,
            matchReason: { ko: "쫄깃한 반죽 덩어리에 매콤한 소스를 입혀 먹는 구조가 떡볶이와 쏙 닮았어요.", ja: "もちもちした生地の塊に辛いソースをからめて食べる構造がトッポッキにそっくりです。", en: "Chewy starchy pillows coated in spicy sauce — the same comforting structure as tteokbokki." }
          },
          MX: {
            name: { ko: "타말레", ja: "タマーレ", en: "Tamale" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 55, umami: 50, sour: 15 },
            description: { ko: "옥수수 반죽에 매운 고기 소를 넣고 찐 멕시코 전통 음식이에요.", ja: "トウモロコシ生地に辛い肉の具を包んで蒸したメキシコの伝統料理です。", en: "Traditional Mexican masa dough stuffed with spiced meat filling, steamed in corn husks." },
            ingredients: { ko: ["마사 반죽", "고추소스", "돼지고기", "옥수수껍질", "치즈"], ja: ["マサ生地", "チリソース", "豚肉", "トウモロコシの皮", "チーズ"], en: ["Masa dough", "Chile sauce", "Pork", "Corn husks", "Cheese"] },
            similarityPercent: 62,
            matchReason: { ko: "찐 곡물 반죽에 매운 소스를 입혀 먹는 방식이 떡볶이의 기본 구조와 닮았어요.", ja: "蒸した穀物生地に辛いソースをからめて食べる方式がトッポッキの基本構造に似ています。", en: "Steamed starchy base coated in spicy sauce shares the same foundational flavor profile as tteokbokki." }
          }
        }
      },
      {
        id: "seoul-dakhanmari",
        name: { ko: "닭한마리", ja: "タッハンマリ", en: "Dakhanmari" },
        region: "seoul",
        image: "/images/food/닭한마리.png",
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
          JP: {
            name: { ko: "미즈타키", ja: "水炊き", en: "Mizutaki" },
            tasteProfile: { sweet: 10, salty: 40, spicy: 5, umami: 75, sour: 10 },
            description: { ko: "닭고기를 맑은 육수에 푹 끓여 먹는 일본식 냄비 요리예요.", ja: "鶏肉を透明なだし汁でじっくり煮込む日本式鍋料理です。", en: "Japanese hot pot with chicken simmered in clear broth until tender." },
            ingredients: { ko: ["닭", "다시마", "버섯", "배추", "두부", "폰즈소스"], ja: ["鶏肉", "昆布", "きのこ", "白菜", "豆腐", "ポン酢"], en: ["Chicken", "Kelp", "Mushroom", "Cabbage", "Tofu", "Ponzu sauce"] },
            similarityPercent: 84,
            matchReason: { ko: "닭 한 마리를 통째로 맑은 국물에 끓여 먹는 방식이 닭한마리와 거의 똑같아요.", ja: "鶏を丸ごと透明なスープで煮込んで食べるスタイルが닭한마리とほぼ同じです。", en: "Whole chicken simmered in clear broth and eaten straight from the pot — virtually identical concept." }
          },
          VN: {
            name: { ko: "라우 가", ja: "ラウ・ガー", en: "Lau Ga" },
            tasteProfile: { sweet: 15, salty: 40, spicy: 20, umami: 70, sour: 15 },
            description: { ko: "닭고기를 레몬그라스 육수에 끓이는 베트남식 닭고기 샤브샤브예요.", ja: "鶏肉をレモングラスのスープで煮るベトナム式鶏肉しゃぶしゃぶです。", en: "Vietnamese chicken hot pot with fragrant lemongrass broth." },
            ingredients: { ko: ["닭", "레몬그라스", "생강", "쌀국수", "채소", "느억맘"], ja: ["鶏肉", "レモングラス", "生姜", "米麺", "野菜", "ヌクマム"], en: ["Chicken", "Lemongrass", "Ginger", "Rice noodles", "Vegetables", "Fish sauce"] },
            similarityPercent: 76,
            matchReason: { ko: "닭고기를 통째로 육수에 끓이고 면을 넣어 먹는 방식이 닭한마리와 유사해요.", ja: "鶏肉を丸ごとスープで煮て麺を入れて食べる方式が닭한마리に似ています。", en: "Whole chicken in broth with noodles follows the same one-pot chicken meal concept." }
          },
          FR: {
            name: { ko: "뿔레 오 포", ja: "プーレ・オ・ポ", en: "Poule au Pot" },
            tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 72, sour: 10 },
            description: { ko: "닭을 채소와 함께 육수에 통째로 끓이는 프랑스 클래식 요리예요.", ja: "鶏を野菜とともにスープで丸ごと煮込むフランスの定番料理です。", en: "Classic French pot-simmered whole chicken with root vegetables." },
            ingredients: { ko: ["닭", "당근", "감자", "셀러리", "부케가르니", "소금"], ja: ["鶏", "人参", "じゃがいも", "セロリ", "ブーケガルニ", "塩"], en: ["Chicken", "Carrot", "Potato", "Celery", "Bouquet garni", "Salt"] },
            similarityPercent: 74,
            matchReason: { ko: "닭 한 마리를 통째로 냄비에서 뭉근히 끓여 채소와 함께 먹는 방식이 닭한마리와 같아요.", ja: "鶏を丸ごと鍋でじっくり煮て野菜と一緒に食べるスタイルが닭한마리と同じです。", en: "Whole chicken simmered in pot with vegetables — the same generous, communal concept as dakhanmari." }
          }
        }
      },
      {
        id: "seoul-seolleongtang",
        name: { ko: "설렁탕", ja: "ソルロンタン", en: "Seolleongtang" },
        region: "seoul",
        image: "/images/food/설렁탕.png",
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
          JP: {
            name: { ko: "돈코츠 라멘", ja: "豚骨ラーメン", en: "Tonkotsu Ramen" },
            tasteProfile: { sweet: 10, salty: 65, spicy: 10, umami: 90, sour: 5 },
            description: { ko: "돼지 뼈를 12시간 이상 끓여 만든 진한 백색 육수에 라멘 면을 넣은 일본 국수예요.", ja: "豚骨を12時間以上煮込んで作る濃厚な白濁スープのラーメンです。", en: "Japanese ramen in thick white pork bone broth simmered for over 12 hours." },
            ingredients: { ko: ["라멘면", "돼지뼈육수", "차슈", "반숙계란", "파", "마늘"], ja: ["ラーメン麺", "豚骨スープ", "チャーシュー", "味玉", "ネギ", "にんにく"], en: ["Ramen noodles", "Pork bone broth", "Chashu", "Soft egg", "Green onion", "Garlic"] },
            similarityPercent: 80,
            matchReason: { ko: "뼈를 오래 고아 만든 뽀얀 국물의 깊은 감칠맛이 설렁탕과 매우 닮았어요.", ja: "骨を長時間煮込んで作る白濁スープの深い旨味が雪濃湯によく似ています。", en: "Milky bone broth simmered for hours shares the same deep, collagen-rich umami as seolleongtang." }
          },
          VN: {
            name: { ko: "퍼보", ja: "フォー・ボー", en: "Pho Bo" },
            tasteProfile: { sweet: 15, salty: 45, spicy: 15, umami: 78, sour: 20 },
            description: { ko: "소뼈를 장시간 끓인 맑고 향긋한 육수에 쌀국수와 소고기 슬라이스를 넣은 베트남 국수예요.", ja: "牛骨を長時間煮込んだ澄んだ香り豊かなスープに米麺と薄切り牛肉を入れたベトナムの麺料理です。", en: "Vietnamese rice noodle soup in aromatic clear beef bone broth with sliced beef." },
            ingredients: { ko: ["쌀국수", "소뼈육수", "소고기 슬라이스", "숙주", "라임", "고수"], ja: ["ライスヌードル", "牛骨スープ", "薄切り牛肉", "もやし", "ライム", "パクチー"], en: ["Rice noodles", "Beef bone broth", "Sliced beef", "Bean sprouts", "Lime", "Cilantro"] },
            similarityPercent: 77,
            matchReason: { ko: "소뼈를 우린 맑은 백탕 국물에 면과 소고기를 넣는 구조가 설렁탕과 거의 같아요.", ja: "牛骨を煮出した澄んだ白湯スープに麺と牛肉を入れる構造が雪濃湯とほぼ同じです。", en: "Beef bone broth with noodles and beef slices — the same restorative bowl concept as seolleongtang." }
          },
          MX: {
            name: { ko: "포솔레 블랑코", ja: "ポソレ・ブランコ", en: "Pozole Blanco" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 30, umami: 68, sour: 15 },
            description: { ko: "옥수수알과 돼지고기를 맑은 육수에 넣고 장시간 끓인 멕시코 전통 수프예요.", ja: "ホモニーコーンと豚肉を透明なスープで長時間煮込んだメキシコの伝統スープです。", en: "Traditional Mexican soup with hominy and pork in clear broth, simmered for hours." },
            ingredients: { ko: ["호미니 옥수수", "돼지고기", "마늘", "양파", "오레가노", "소금"], ja: ["ホモニー", "豚肉", "にんにく", "玉ねぎ", "オレガノ", "塩"], en: ["Hominy corn", "Pork", "Garlic", "Onion", "Oregano", "Salt"] },
            similarityPercent: 68,
            matchReason: { ko: "고기와 전분 재료를 맑은 육수에 푹 끓여 속을 따뜻하게 하는 국물 요리라는 점이 설렁탕과 닮았어요.", ja: "肉と澱粉食材を澄んだスープでじっくり煮込み、体を温めるスープ料理という点が雪濃湯に似ています。", en: "Hearty clear broth with meat and starchy grain — both are soothing, slow-cooked soups meant to warm the soul." }
          }
        }
      },
      {
        id: "seoul-street-toast",
        name: { ko: "길거리 토스트", ja: "屋台トースト", en: "Street Toast" },
        region: "seoul",
        image: "/images/food/길거리토스트.png",
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
          US: {
            name: { ko: "그릴드 치즈 샌드위치", ja: "グリルドチーズサンド", en: "Grilled Cheese Sandwich" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 5, umami: 60, sour: 5 },
            description: { ko: "버터를 바른 식빵 사이에 치즈를 넣고 노릇하게 구운 미국의 국민 샌드위치예요.", ja: "バターを塗ったパンの間にチーズを挟んでこんがり焼いたアメリカの国民的サンドイッチです。", en: "American classic — buttered bread with melted cheese grilled until golden and crispy." },
            ingredients: { ko: ["식빵", "체다치즈", "버터", "소금"], ja: ["食パン", "チェダーチーズ", "バター", "塩"], en: ["White bread", "Cheddar cheese", "Butter", "Salt"] },
            similarityPercent: 78,
            matchReason: { ko: "버터에 구운 토스트에 달걀과 채소를 넣어 먹는 방식이 길거리 토스트와 비슷해요.", ja: "バターで焼いたトーストに卵と野菜を入れて食べるスタイルが街頭トーストに似ています。", en: "Buttered toast pan-fried with egg and fillings — the same satisfying street-food assembly." }
          },
          VN: {
            name: { ko: "반미", ja: "バインミー", en: "Bánh Mì" },
            tasteProfile: { sweet: 20, salty: 50, spicy: 30, umami: 65, sour: 30 },
            description: { ko: "바삭한 바게트에 고기, 채소, 소스를 가득 채운 베트남식 샌드위치예요.", ja: "バリバリのバゲットに肉、野菜、ソースを詰め込んだベトナム式サンドイッチです。", en: "Vietnamese sandwich in crispy baguette loaded with meat, pickled vegetables, and sauces." },
            ingredients: { ko: ["바게트", "돼지고기", "무절임", "당근", "고수", "마요네즈"], ja: ["バゲット", "豚肉", "大根の漬物", "人参", "パクチー", "マヨネーズ"], en: ["Baguette", "Pork", "Pickled daikon", "Carrot", "Cilantro", "Mayonnaise"] },
            similarityPercent: 74,
            matchReason: { ko: "빵 사이에 고기와 채소, 소스를 넣어 먹는 거리 음식이라는 점이 길거리 토스트와 닮았어요.", ja: "パンに肉と野菜、ソースを挟んで食べるストリートフードという点が街頭トーストに似ています。", en: "Street sandwich with bread, meat, vegetables, and sauce — the same handheld, flavor-packed concept." }
          },
          MY: {
            name: { ko: "카야 토스트", ja: "カヤトースト", en: "Kaya Toast" },
            tasteProfile: { sweet: 55, salty: 35, spicy: 0, umami: 30, sour: 5 },
            description: { ko: "카야잼과 버터를 바른 바삭한 토스트로, 부드러운 달걀과 함께 먹는 말레이시아 국민 아침 메뉴예요.", ja: "カヤジャムとバターを塗ったカリカリトーストで、半熟卵と一緒に食べるマレーシアの定番朝食です。", en: "Crispy toast with kaya coconut jam and butter, served with soft-boiled eggs." },
            ingredients: { ko: ["식빵", "카야잼", "버터", "반숙계란", "소이소스"], ja: ["食パン", "カヤジャム", "バター", "半熟卵", "醤油"], en: ["Bread", "Kaya jam", "Butter", "Soft-boiled egg", "Soy sauce"] },
            similarityPercent: 72,
            matchReason: { ko: "버터를 바른 토스트에 달걀을 곁들여 아침으로 먹는 방식이 길거리 토스트의 기본 구조와 같아요.", ja: "バタートーストに卵を添えて朝食に食べるスタイルが街頭トーストの基本構造と同じです。", en: "Buttered toast with egg for breakfast — the same satisfying, simple morning combo." }
          }
        }
      },
      {
        id: "seoul-bindaetteok",
        name: { ko: "광장시장 빈대떡", ja: "広蔵市場のビンデトク", en: "Gwangjang Market Bindaetteok" },
        region: "seoul",
        image: "/images/food/광장시장빈대떡.png",
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
          JP: {
            name: { ko: "오코노미야키", ja: "お好み焼き", en: "Okonomiyaki" },
            tasteProfile: { sweet: 20, salty: 50, spicy: 15, umami: 75, sour: 10 },
            description: { ko: "채소와 해산물, 고기를 넣은 반죽을 철판에 구운 일본식 부침개예요.", ja: "野菜と海鮮、肉を入れた生地を鉄板で焼いた日本式お好み焼きです。", en: "Japanese savory pancake with vegetables, seafood, or meat cooked on a hot iron plate." },
            ingredients: { ko: ["밀가루반죽", "양배추", "새우", "돼지고기", "오코노미야키소스", "마요네즈"], ja: ["小麦粉生地", "キャベツ", "海老", "豚肉", "お好みソース", "マヨネーズ"], en: ["Batter", "Cabbage", "Shrimp", "Pork", "Okonomiyaki sauce", "Mayonnaise"] },
            similarityPercent: 88,
            matchReason: { ko: "채소를 가득 넣은 반죽을 기름에 지져 먹는 방식이 빈대떡과 거의 동일해요.", ja: "野菜たっぷりの生地を油で焼いて食べるスタイルがビンデトクとほぼ同じです。", en: "Vegetable-packed batter fried on a flat surface — virtually the same dish in different cultural clothes." }
          },
          IN: {
            name: { ko: "무르타박", ja: "ムルタバク", en: "Murtabak" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 40, umami: 65, sour: 10 },
            description: { ko: "달걀과 고기, 채소를 넣은 두꺼운 반죽을 기름에 지진 인도식 팬케이크예요.", ja: "卵と肉、野菜を入れた厚い生地を油で焼いたインド式パンケーキです。", en: "Indian stuffed pancake filled with egg, minced meat, and spiced vegetables." },
            ingredients: { ko: ["밀가루반죽", "달걀", "양고기", "양파", "카레향신료", "기름"], ja: ["小麦粉生地", "卵", "ラム肉", "玉ねぎ", "カレースパイス", "油"], en: ["Flour batter", "Egg", "Minced lamb", "Onion", "Curry spices", "Oil"] },
            similarityPercent: 75,
            matchReason: { ko: "곡물 반죽에 고기와 채소를 넣고 기름에 지져 먹는 방식이 빈대떡과 같아요.", ja: "穀物生地に肉と野菜を入れて油で焼く方式がビンデトクと同じです。", en: "Batter stuffed with meat and vegetables, fried until crispy — the same savory pancake concept." }
          },
          ES: {
            name: { ko: "토르티야 데 파타타스", ja: "トルティーヤ・デ・パタタス", en: "Tortilla de Patatas" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 60, sour: 5 },
            description: { ko: "감자와 달걀을 올리브오일에 구운 스페인식 두꺼운 오믈렛이에요.", ja: "じゃがいもと卵をオリーブオイルで焼いたスペイン式の厚いオムレツです。", en: "Spanish thick potato omelette pan-fried in olive oil — a beloved tapa." },
            ingredients: { ko: ["달걀", "감자", "양파", "올리브오일", "소금"], ja: ["卵", "じゃがいも", "玉ねぎ", "オリーブオイル", "塩"], en: ["Eggs", "Potato", "Onion", "Olive oil", "Salt"] },
            similarityPercent: 70,
            matchReason: { ko: "달걀과 채소를 넣고 납작하게 기름에 지져 먹는 방식이 빈대떡과 닮았어요.", ja: "卵と野菜を入れて平らに油で焼く方式がビンデトクに似ています。", en: "Egg and vegetable batter pan-fried flat — the same satisfying, crispy-outside tender-inside result." }
          }
        }
      },
      {
        id: "seoul-yukhoe",
        name: { ko: "육회", ja: "ユッケ", en: "Yukhoe" },
        region: "seoul",
        image: "/images/food/욱회.png",
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
                dupes: {
          FR: {
            name: { ko: "비프 타르타르", ja: "ビーフタルタル", en: "Beef Tartare" },
            tasteProfile: { sweet: 5, salty: 45, spicy: 15, umami: 80, sour: 15 },
            description: { ko: "생 소고기를 잘게 다져 머스타드, 케이퍼, 달걀노른자와 버무린 프랑스 요리예요.", ja: "生牛肉を細かく刻んでマスタード、ケーパー、卵黄と和えたフランス料理です。", en: "French dish of finely chopped raw beef seasoned with mustard, capers, and egg yolk." },
            ingredients: { ko: ["소고기 안심", "달걀노른자", "케이퍼", "머스타드", "샬롯", "소금"], ja: ["牛ヒレ肉", "卵黄", "ケーパー", "マスタード", "シャロット", "塩"], en: ["Beef tenderloin", "Egg yolk", "Capers", "Mustard", "Shallot", "Salt"] },
            similarityPercent: 90,
            matchReason: { ko: "생 소고기에 날달걀 노른자를 올려 먹는 구조가 육회와 거의 동일해요.", ja: "生牛肉に生卵黄をのせて食べる構造が육회とほぼ同じです。", en: "Raw beef with egg yolk — structurally almost identical to yukhoe, just with French seasoning." }
          },
          IT: {
            name: { ko: "비프 카르파초", ja: "ビーフカルパッチョ", en: "Beef Carpaccio" },
            tasteProfile: { sweet: 5, salty: 40, spicy: 10, umami: 75, sour: 20 },
            description: { ko: "생 소고기를 얇게 슬라이스해 올리브오일과 레몬, 루꼴라를 얹은 이탈리아 전채 요리예요.", ja: "生牛肉を薄くスライスしてオリーブオイルとレモン、ルッコラを添えたイタリアの前菜です。", en: "Italian appetizer of thinly sliced raw beef dressed with olive oil, lemon, and arugula." },
            ingredients: { ko: ["소고기 안심", "올리브오일", "레몬", "루꼴라", "파마산", "소금"], ja: ["牛ヒレ肉", "オリーブオイル", "レモン", "ルッコラ", "パルメザン", "塩"], en: ["Beef tenderloin", "Olive oil", "Lemon", "Arugula", "Parmesan", "Salt"] },
            similarityPercent: 82,
            matchReason: { ko: "생 소고기를 얇게 썰어 소스와 곁들여 먹는 방식이 육회와 같아요.", ja: "生牛肉を薄くスライスしてソースと合わせて食べる方式が육회と同じです。", en: "Thinly sliced raw beef with dressing — the same elegant raw beef concept as yukhoe." }
          },
          JP: {
            name: { ko: "소고기 타타키", ja: "牛タタキ", en: "Beef Tataki" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 10, umami: 82, sour: 25 },
            description: { ko: "소고기 표면만 살짝 구운 후 얼음물에 식혀 얇게 썬 일본 요리예요.", ja: "牛肉の表面だけさっと焼いて氷水で冷やし薄切りにした日本料理です。", en: "Japanese seared beef cooled quickly and sliced thin, served with ponzu and ginger." },
            ingredients: { ko: ["소고기", "폰즈소스", "생강", "파", "마늘", "참기름"], ja: ["牛肉", "ポン酢", "生姜", "ネギ", "にんにく", "ごま油"], en: ["Beef", "Ponzu sauce", "Ginger", "Green onion", "Garlic", "Sesame oil"] },
            similarityPercent: 85,
            matchReason: { ko: "생에 가까운 소고기를 얇게 썰어 소스와 함께 먹는 방식이 육회와 흡사해요.", ja: "生に近い牛肉を薄くスライスしてソースと一緒に食べる方式が육회に似ています。", en: "Barely-cooked thin-sliced beef with sauce — the closest Japanese cousin to yukhoe." }
          }
        }
      },
      {
        id: "seoul-hangang-ramen",
        name: { ko: "한강 라면", ja: "漢江ラーメン", en: "Hangang Ramen" },
        region: "seoul",
        image: "/images/food/한강라면.png",
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
          JP: {
            name: { ko: "프리미엄 컵라멘", ja: "プレミアムカップ麺", en: "Premium Cup Ramen" },
            tasteProfile: { sweet: 10, salty: 70, spicy: 25, umami: 75, sour: 5 },
            description: { ko: "뜨거운 물만 부으면 되는 일본의 고급 컵라면으로 진한 돼지뼈 육수맛이 특징이에요.", ja: "お湯を注ぐだけの日本のプレミアムカップ麺で、濃厚な豚骨スープが特徴です。", en: "Japanese premium cup ramen — just add hot water for a rich, restaurant-quality broth." },
            ingredients: { ko: ["라멘면", "분말육수", "건조채소", "건조고기", "파", "기름"], ja: ["ラーメン麺", "粉末スープ", "乾燥野菜", "乾燥肉", "ネギ", "油"], en: ["Ramen noodles", "Powder broth", "Dried vegetables", "Dried meat", "Green onion", "Oil"] },
            similarityPercent: 80,
            matchReason: { ko: "편의점에서 뜨거운 물 받아 먹는 즉석 라멘이라는 컨셉이 한강 라면과 정확히 같아요.", ja: "コンビニでお湯を注いで食べるインスタントラーメンというコンセプトが漢江ラーメンとまったく同じです。", en: "Instant noodles with convenience store hot water — the exact same outdoor eating experience." }
          },
          ID: {
            name: { ko: "미 고랭", ja: "ミーゴレン", en: "Mie Goreng" },
            tasteProfile: { sweet: 20, salty: 60, spicy: 40, umami: 70, sour: 10 },
            description: { ko: "달콤 짭짤한 케찹 마니스 소스에 볶은 인도네시아 볶음 국수예요.", ja: "甘辛いケチャップマニスで炒めたインドネシアの焼き麺です。", en: "Indonesian fried noodles with sweet soy sauce, chili, and egg." },
            ingredients: { ko: ["라멘면", "케찹마니스", "삼발소스", "달걀", "닭고기", "파"], ja: ["ラーメン麺", "ケチャップマニス", "サンバル", "卵", "鶏肉", "ネギ"], en: ["Noodles", "Kecap manis", "Sambal", "Egg", "Chicken", "Green onion"] },
            similarityPercent: 72,
            matchReason: { ko: "라면 면을 간편하게 조리해 즐기는 방식이 한강 라면과 닮은 즉석 국수 문화예요.", ja: "ラーメン麺を手軽に調理して楽しむスタイルが漢江ラーメンに似たインスタント麺文化です。", en: "Quick-cook noodles eaten casually outdoors — same convenient noodle culture as hangang ramen." }
          },
          TH: {
            name: { ko: "똠얌 인스턴트", ja: "トムヤムインスタント", en: "Tom Yum Instant Noodles" },
            tasteProfile: { sweet: 10, salty: 65, spicy: 70, umami: 65, sour: 40 },
            description: { ko: "새우와 레몬그라스 향이 나는 매콤시큼한 똠얌 국물의 태국 인스턴트 라면이에요.", ja: "エビとレモングラスの香りがするピリ辛酸っぱいトムヤムスープのタイのインスタントラーメンです。", en: "Thai instant noodles with spicy-sour tom yum broth flavored with shrimp and lemongrass." },
            ingredients: { ko: ["라면", "똠얌페이스트", "코코넛밀크", "새우", "레몬그라스", "고수"], ja: ["ラーメン", "トムヤムペースト", "ココナッツミルク", "エビ", "レモングラス", "パクチー"], en: ["Noodles", "Tom yum paste", "Coconut milk", "Shrimp", "Lemongrass", "Cilantro"] },
            similarityPercent: 70,
            matchReason: { ko: "뜨거운 물에 스프를 녹여 즉석에서 끓여 먹는 인스턴트 라면이라는 공통점이 있어요.", ja: "お湯にスープを溶かして即席で作るインスタントラーメンという共通点があります。", en: "Boil-and-eat instant noodles — the same roadside convenience eating ritual as hangang ramen." }
          }
        }
      },
      {
        id: "seoul-jokbal",
        name: { ko: "족발", ja: "チョクパル", en: "Jokbal" },
        region: "seoul",
        image: "/images/food/족발.png",
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
          CN: {
            name: { ko: "동파육", ja: "東坡肉", en: "Dongpo Pork" },
            tasteProfile: { sweet: 40, salty: 50, spicy: 5, umami: 80, sour: 10 },
            description: { ko: "간장과 설탕, 황주로 장시간 조린 중국 항저우식 돼지 삼겹살 요리예요.", ja: "醤油と砂糖、紹興酒で長時間煮込んだ中国杭州式の豚バラ肉料理です。", en: "Chinese braised pork belly from Hangzhou, slow-cooked in soy sauce, sugar, and rice wine." },
            ingredients: { ko: ["돼지삼겹살", "간장", "설탕", "황주", "생강", "파"], ja: ["豚バラ肉", "醤油", "砂糖", "紹興酒", "生姜", "ネギ"], en: ["Pork belly", "Soy sauce", "Sugar", "Rice wine", "Ginger", "Green onion"] },
            similarityPercent: 82,
            matchReason: { ko: "돼지고기를 간장과 설탕으로 장시간 조려 부드럽게 만드는 방식이 족발과 매우 닮았어요.", ja: "豚肉を醤油と砂糖で長時間煮込んで柔らかくする方式がジョクバルによく似ています。", en: "Pork braised in soy-sugar until meltingly tender — the same technique and result as jokbal." }
          },
          FR: {
            name: { ko: "슬로우 로스트 포크", ja: "スロウローストポーク", en: "Slow-Roast Pork Hock" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 5, umami: 75, sour: 10 },
            description: { ko: "허브와 마늘을 발라 오븐에서 천천히 구운 프랑스식 돼지 족발 로스트예요.", ja: "ハーブとにんにくを塗ってオーブンでゆっくり焼いたフランス式豚スネのローストです。", en: "French slow-roasted pork hock with herbs and garlic, pulled apart at the table." },
            ingredients: { ko: ["돼지 족", "타임", "로즈마리", "마늘", "와인", "소금"], ja: ["豚スネ肉", "タイム", "ローズマリー", "にんにく", "ワイン", "塩"], en: ["Pork hock", "Thyme", "Rosemary", "Garlic", "Wine", "Salt"] },
            similarityPercent: 72,
            matchReason: { ko: "돼지 족을 푹 조리해 살이 뼈에서 쉽게 떨어지는 식감이 족발과 같아요.", ja: "豚のスネ肉をじっくり調理して肉が骨から簡単に外れる食感がジョクバルと同じです。", en: "Slow-cooked pork hock where the meat falls off the bone — the same tender, gelatinous texture as jokbal." }
          },
          MX: {
            name: { ko: "카르니타스", ja: "カルニタス", en: "Carnitas" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 20, umami: 72, sour: 20 },
            description: { ko: "돼지고기를 라드에 천천히 조려 바삭하게 만든 멕시코 돼지고기 요리예요.", ja: "豚肉をラードでゆっくり煮てカリカリに仕上げたメキシコの豚肉料理です。", en: "Mexican slow-cooked pulled pork rendered in lard until crispy on the outside." },
            ingredients: { ko: ["돼지고기", "오렌지", "마늘", "쿠민", "칠리", "소금"], ja: ["豚肉", "オレンジ", "にんにく", "クミン", "チリ", "塩"], en: ["Pork", "Orange", "Garlic", "Cumin", "Chili", "Salt"] },
            similarityPercent: 70,
            matchReason: { ko: "돼지고기를 장시간 조려 살이 부드럽게 찢어지는 식감이 족발과 닮았어요.", ja: "豚肉を長時間煮込んで肉が柔らかくほぐれる食感がジョクバルに似ています。", en: "Slow-cooked pork that pulls apart into tender shreds — the same low-and-slow philosophy as jokbal." }
          }
        }
      },
      {
        id: "seoul-kimchi-jjigae",
        name: { ko: "김치찌개", ja: "キムチチゲ", en: "Kimchi Jjigae" },
        region: "seoul",
        image: "/images/food/김치찌개.png",
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
          JP: {
            name: { ko: "김치 나베", ja: "キムチ鍋", en: "Kimchi Nabe" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 65, umami: 75, sour: 25 },
            description: { ko: "김치를 베이스로 돼지고기와 두부, 채소를 넣고 끓인 일본식 김치 찌개 냄비예요.", ja: "キムチをベースに豚肉、豆腐、野菜を入れて煮込んだ日本式キムチ鍋です。", en: "Japanese hot pot based on kimchi broth with pork, tofu, and vegetables." },
            ingredients: { ko: ["김치", "돼지고기", "두부", "버섯", "파", "참기름"], ja: ["キムチ", "豚肉", "豆腐", "きのこ", "ネギ", "ごま油"], en: ["Kimchi", "Pork", "Tofu", "Mushrooms", "Green onion", "Sesame oil"] },
            similarityPercent: 88,
            matchReason: { ko: "김치를 베이스로 한 매콤한 찌개라는 구조가 김치찌개와 거의 동일해요.", ja: "キムチをベースにした辛い鍋料理という構造がキムチチゲとほぼ同じです。", en: "Kimchi-based spicy stew with pork and tofu — essentially the same dish in a larger vessel." }
          },
          MX: {
            name: { ko: "칠리 콘 까르네", ja: "チリ・コン・カルネ", en: "Chili con Carne" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 70, umami: 70, sour: 15 },
            description: { ko: "다진 소고기와 강낭콩, 고추를 넣고 끓인 텍사스 스타일 매운 스튜예요.", ja: "挽き牛肉と赤インゲン豆、唐辛子を煮込んだテキサス風の辛いシチューです。", en: "Texas-style spicy stew with ground beef, kidney beans, and chili peppers." },
            ingredients: { ko: ["다진소고기", "강낭콩", "토마토", "고추가루", "쿠민", "마늘"], ja: ["挽き牛肉", "赤インゲン豆", "トマト", "チリパウダー", "クミン", "にんにく"], en: ["Ground beef", "Kidney beans", "Tomato", "Chili powder", "Cumin", "Garlic"] },
            similarityPercent: 70,
            matchReason: { ko: "발효된 재료를 베이스로 매운 국물에 고기를 넣고 끓인 스튜 요리라는 공통점이 있어요.", ja: "発酵食材をベースにした辛いスープに肉を入れて煮込んだシチュー料理という共通点があります。", en: "Spicy meat-based stew with fermented flavor profile — both are bold, warming one-pot comforts." }
          },
          TH: {
            name: { ko: "똠얌 수프", ja: "トムヤムスープ", en: "Tom Yum Soup" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 75, umami: 70, sour: 50 },
            description: { ko: "새우와 레몬그라스, 카피르 라임으로 끓인 태국의 시큼매콤한 국물 요리예요.", ja: "エビとレモングラス、カフィアライムで煮たタイの酸っぱ辛いスープ料理です。", en: "Thai spicy-sour soup with shrimp, lemongrass, and kaffir lime — intensely aromatic." },
            ingredients: { ko: ["새우", "레몬그라스", "카피르라임잎", "갈랑갈", "고추", "느억맘"], ja: ["エビ", "レモングラス", "カフィアライムリーフ", "ガランガル", "唐辛子", "ナンプラー"], en: ["Shrimp", "Lemongrass", "Kaffir lime leaves", "Galangal", "Chili", "Fish sauce"] },
            similarityPercent: 72,
            matchReason: { ko: "발효 소스를 베이스로 매콤시큼한 국물에 해산물을 넣고 끓이는 방식이 김치찌개와 닮았어요.", ja: "発酵ソースをベースに辛酸っぱいスープに海鮮を入れて煮込む方式がキムチチゲに似ています。", en: "Fermented-base spicy-sour broth with protein — the same bold, complex stew DNA as kimchi jjigae." }
          }
        }
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
        image: "/images/food/충무김밥.png",
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
          JP: {
            name: { ko: "마키 스시", ja: "巻き寿司", en: "Maki Sushi" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 10, umami: 65, sour: 30 },
            description: { ko: "밥과 재료를 김으로 감아 먹는 일본 전통 김초밥이에요.", ja: "ご飯と具材を海苔で巻いて食べる日本伝統の巻き寿司です。", en: "Japanese traditional seaweed roll with rice and fillings — the origin story of gimbap." },
            ingredients: { ko: ["밥", "김", "참치", "오이", "단무지", "참기름"], ja: ["ご飯", "海苔", "マグロ", "きゅうり", "たくあん", "ごま油"], en: ["Rice", "Nori", "Tuna", "Cucumber", "Pickled radish", "Sesame oil"] },
            similarityPercent: 85,
            matchReason: { ko: "밥을 김으로 감아 만든 작고 한 입 크기의 충무김밥과 마키스시는 원리가 같아요.", ja: "ご飯を海苔で巻いた小さな一口サイズの충무김밥と巻き寿司は原理が同じです。", en: "Rice wrapped in seaweed in small bite-sized pieces — the ancestor of chungmu gimbap." }
          },
          MX: {
            name: { ko: "타키토스", ja: "タキトス", en: "Taquitos" },
            tasteProfile: { sweet: 5, salty: 55, spicy: 35, umami: 60, sour: 20 },
            description: { ko: "토르티야에 고기와 치즈를 넣고 돌돌 말아 기름에 바삭하게 튀긴 멕시코 간식이에요.", ja: "トルティーヤに肉とチーズを入れてくるくる巻いて揚げたメキシコのスナックです。", en: "Mexican mini rolled tortillas filled with meat and cheese, deep-fried until crispy." },
            ingredients: { ko: ["옥수수토르티야", "닭고기", "치즈", "살사", "고수", "라임"], ja: ["コーントルティーヤ", "鶏肉", "チーズ", "サルサ", "パクチー", "ライム"], en: ["Corn tortilla", "Chicken", "Cheese", "Salsa", "Cilantro", "Lime"] },
            similarityPercent: 68,
            matchReason: { ko: "납작한 반죽에 재료를 넣고 돌돌 말아 먹는 한 입 크기 간식이라는 점이 충무김밥과 닮았어요.", ja: "平たい生地に具材を入れてくるくる巻いた一口サイズのスナックという点が충무김밥に似ています。", en: "Small rolled snack filled with ingredients — the Mexican take on the rolled rice concept." }
          },
          US: { challenge: true }
        }
      },
      {
        id: "tongyeong-kkul-ppang",
        name: { ko: "꿀빵", ja: "蜂蜜パン", en: "Kkul-ppang" },
        region: "tongyeong",
        image: "/images/food/꿀빵.jpg",
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
          JP: {
            name: { ko: "카린토 만주", ja: "かりんとう饅頭", en: "Karinto Manju" },
            tasteProfile: { sweet: 65, salty: 10, spicy: 0, umami: 20, sour: 5 },
            description: { ko: "반죽을 기름에 튀겨 바삭하게 만든 후 팥소를 넣은 일본식 튀김 만두예요.", ja: "生地を油で揚げてカリカリにした後に小豆餡を入れた日本式揚げ饅頭です。", en: "Japanese fried manju with sweet bean filling — crispy outside, sweet inside." },
            ingredients: { ko: ["밀가루반죽", "팥앙금", "설탕", "기름", "흑설탕"], ja: ["小麦粉生地", "小豆餡", "砂糖", "油", "黒砂糖"], en: ["Flour dough", "Red bean paste", "Sugar", "Oil", "Brown sugar"] },
            similarityPercent: 82,
            matchReason: { ko: "반죽에 달콤한 소를 넣고 노릇하게 구운 간식이라는 점이 꿀빵과 닮았어요.", ja: "生地に甘い餡を入れてこんがり焼いたスナックという点がクルパンに似ています。", en: "Pastry filled with sweet filling and baked golden — same structure as tongyeong kkul ppang." }
          },
          CN: {
            name: { ko: "탕후루 빵", ja: "タンフールーパン", en: "Tanghulu Bread" },
            tasteProfile: { sweet: 70, salty: 5, spicy: 0, umami: 10, sour: 15 },
            description: { ko: "꿀이나 시럽을 바른 중국식 달콤한 빵이에요.", ja: "蜂蜜やシロップを塗った中国式の甘いパンです。", en: "Chinese sweet bread glazed with honey or sugar syrup." },
            ingredients: { ko: ["밀가루반죽", "꿀", "설탕시럽", "참기름", "달걀"], ja: ["小麦粉生地", "蜂蜜", "砂糖シロップ", "ごま油", "卵"], en: ["Flour dough", "Honey", "Sugar syrup", "Sesame oil", "Egg"] },
            similarityPercent: 72,
            matchReason: { ko: "꿀과 시럽을 바른 달콤한 빵 간식이라는 점이 꿀빵과 같아요.", ja: "蜂蜜とシロップを塗った甘いパンのおやつという点がクルパンと同じです。", en: "Honey-glazed sweet bread snack — the same sticky, sweet concept as kkul ppang." }
          },
          US: {
            name: { ko: "글레이즈드 도넛", ja: "グレーズドドーナツ", en: "Glazed Donut" },
            tasteProfile: { sweet: 72, salty: 8, spicy: 0, umami: 10, sour: 5 },
            description: { ko: "달콤한 설탕 글레이즈로 코팅된 미국의 국민 도넛이에요.", ja: "甘い砂糖グレーズでコーティングされたアメリカの国民的ドーナツです。", en: "American classic donut glazed with sweet sugar coating — simple, irresistible." },
            ingredients: { ko: ["밀가루반죽", "설탕글레이즈", "버터", "달걀", "이스트"], ja: ["小麦粉生地", "砂糖グレーズ", "バター", "卵", "イースト"], en: ["Flour dough", "Sugar glaze", "Butter", "Egg", "Yeast"] },
            similarityPercent: 78,
            matchReason: { ko: "달콤한 시럽이나 꿀로 코팅된 부드러운 빵 반죽 간식이라는 점이 꿀빵과 닮았어요.", ja: "甘いシロップや蜂蜜でコーティングされた柔らかいパン生地のスナックという点がクルパンに似ています。", en: "Sweet-glazed soft dough — the same indulgent sugar-coated bread snack as kkul ppang." }
          }
        }
      },
      {
        id: "tongyeong-meongge-bibimbap",
        name: { ko: "멍게비빔밥", ja: "ホヤビビンバ", en: "Meongge Bibimbap" },
        region: "tongyeong",
        image: "/images/food/멍게비빔밥.png",
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
          JP: {
            name: { ko: "호야 덮밥", ja: "ホヤ丼", en: "Hoya Donburi" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 15, umami: 88, sour: 20 },
            description: { ko: "멍게와 같은 우렁이 해산물인 호야를 밥 위에 올린 일본 덮밥이에요.", ja: "ホヤを米飯の上にのせた日本の丼料理です。", en: "Japanese rice bowl with sea squirt (hoya) — same briny, oceanic umami as meongge bibimbap." },
            ingredients: { ko: ["호야", "밥", "간장", "참기름", "파", "김"], ja: ["ホヤ", "ご飯", "醤油", "ごま油", "ネギ", "海苔"], en: ["Sea squirt", "Rice", "Soy sauce", "Sesame oil", "Green onion", "Nori"] },
            similarityPercent: 88,
            matchReason: { ko: "멍게를 밥과 함께 비벼 먹는 방식이 멍게비빔밥과 거의 같아요.", ja: "ホヤをご飯と一緒に混ぜて食べる方式がホヤビビンバとほぼ同じです。", en: "Sea squirt over rice — the same unique, briny umami experience as meongge bibimbap." }
          },
          FR: {
            name: { ko: "성게알 타르타르", ja: "ウニのタルタル", en: "Sea Urchin Tartare" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 10, umami: 90, sour: 15 },
            description: { ko: "신선한 성게알에 크림과 레몬을 곁들인 프랑스 고급 전채 요리예요.", ja: "新鮮なウニにクリームとレモンを添えたフランスの高級前菜料理です。", en: "French luxury appetizer of fresh sea urchin with cream and lemon." },
            ingredients: { ko: ["성게알", "크림프레쉬", "레몬", "차이브", "소금", "후추"], ja: ["ウニ", "クレームフレーシュ", "レモン", "チャイブ", "塩", "こしょう"], en: ["Sea urchin", "Crème fraîche", "Lemon", "Chives", "Salt", "Pepper"] },
            similarityPercent: 75,
            matchReason: { ko: "독특한 바다향 감칠맛의 해산물을 밥이나 빵에 얹어 먹는 방식이 멍게비빔밥과 닮았어요.", ja: "独特な海の旨味を持つ海鮮をご飯やパンにのせて食べる方式がホヤビビンバに似ています。", en: "Unique oceanic umami seafood on a starchy base — the same philosophy as meongge bibimbap." }
          },
          US: { challenge: true }
        }
      },
      {
        id: "tongyeong-oyster-soup",
        name: { ko: "통영 굴국밥", ja: "統営牡蛎クッパ", en: "Tongyeong Oyster Soup" },
        region: "tongyeong",
        image: "/images/food/굴국밥.png",
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
          JP: {
            name: { ko: "카키 조스이", ja: "牡蠣雑炊", en: "Kaki Zosui" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 85, sour: 5 },
            description: { ko: "신선한 굴을 다시 육수에 넣고 밥과 함께 끓인 일본식 굴 죽이에요.", ja: "新鮮な牡蠣をだし汁に入れてご飯と一緒に煮た日本式牡蠣粥です。", en: "Japanese rice porridge with oysters in dashi broth — comfort food with oceanic depth." },
            ingredients: { ko: ["굴", "밥", "다시마육수", "간장", "미림", "파"], ja: ["牡蠣", "ご飯", "昆布だし", "醤油", "みりん", "ネギ"], en: ["Oysters", "Rice", "Kelp dashi", "Soy sauce", "Mirin", "Green onion"] },
            similarityPercent: 88,
            matchReason: { ko: "신선한 굴을 육수에 넣고 끓인 국물 요리라는 점이 통영 굴국밥과 거의 같아요.", ja: "新鮮な牡蠣をスープに入れて煮た料理という点が통영굴국밥とほぼ同じです。", en: "Oyster rice porridge in broth — essentially the same oyster soup rice concept as tongyeong." }
          },
          US: {
            name: { ko: "클램 차우더", ja: "クラムチャウダー", en: "Clam Chowder" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 5, umami: 78, sour: 5 },
            description: { ko: "조개와 감자, 크림을 넣고 끓인 뉴잉글랜드 스타일 조개 수프예요.", ja: "貝とじゃがいも、クリームを入れて煮たニューイングランドスタイルの貝スープです。", en: "New England cream-based shellfish soup with potatoes — America's comfort shellfish stew." },
            ingredients: { ko: ["조개", "감자", "크림", "베이컨", "양파", "타임"], ja: ["貝", "じゃがいも", "クリーム", "ベーコン", "玉ねぎ", "タイム"], en: ["Clams", "Potato", "Cream", "Bacon", "Onion", "Thyme"] },
            similarityPercent: 74,
            matchReason: { ko: "조개 육수에 국물 요리를 끓이는 방식이 통영 굴국밥과 닮았어요.", ja: "貝のだしでスープ料理を作る方式が통영굴국밥に似ています。", en: "Shellfish broth soup with starchy base — the same oceanic comfort bowl concept as tongyeong oyster soup." }
          },
          FR: {
            name: { ko: "굴 포타주", ja: "牡蠣のポタージュ", en: "Oyster Potage" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 82, sour: 15 },
            description: { ko: "신선한 굴을 크림 수프로 만든 프랑스 고급 해산물 수프예요.", ja: "新鮮な牡蠣をクリームスープにしたフランスの高級海鮮スープです。", en: "French elegant cream soup made from fresh oysters." },
            ingredients: { ko: ["굴", "크림", "샬롯", "화이트와인", "버터", "파슬리"], ja: ["牡蠣", "クリーム", "シャロット", "白ワイン", "バター", "パセリ"], en: ["Oysters", "Cream", "Shallot", "White wine", "Butter", "Parsley"] },
            similarityPercent: 78,
            matchReason: { ko: "신선한 굴을 국물 요리로 만들어 먹는 방식이 통영 굴국밥과 같아요.", ja: "新鮮な牡蠣をスープ料理にして食べる方式が통영굴국밥と同じです。", en: "Oysters in liquid — both celebrate the pure, clean flavor of fresh oysters in a warm broth." }
          }
        }
      },
      {
        id: "tongyeong-ujja",
        name: { ko: "우짜", ja: "ウッチャ", en: "Ujja" },
        region: "tongyeong",
        image: "/images/food/우짜.png",
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
          JP: {
            name: { ko: "하이브리드 우동", ja: "ハイブリッドうどん", en: "Fusion Udon" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 75, sour: 5 },
            description: { ko: "짬뽕 국물에 우동 면을 넣어 먹는 일본식 퓨전 우동이에요.", ja: "チャンポンスープにうどん麺を入れて食べる日本式フュージョンうどんです。", en: "Japanese fusion udon combining spicy champon broth with udon noodles." },
            ingredients: { ko: ["우동면", "짬뽕육수", "해산물", "채소", "고추", "간장"], ja: ["うどん麺", "チャンポンスープ", "海鮮", "野菜", "唐辛子", "醤油"], en: ["Udon noodles", "Champon broth", "Seafood", "Vegetables", "Chili", "Soy sauce"] },
            similarityPercent: 88,
            matchReason: { ko: "우동과 짬뽕을 합친 융합 국수가 우짜의 개념과 정확히 같아요.", ja: "うどんとチャンポンを合わせたフュージョン麺が우짜のコンセプトと全く同じです。", en: "Udon + champon hybrid — the exact same fusion noodle concept as tongyeong ujja." }
          },
          IT: {
            name: { ko: "볼로네제 스파게티 수프", ja: "スープスパゲティボロネーゼ", en: "Bolognese Soup Pasta" },
            tasteProfile: { sweet: 20, salty: 50, spicy: 15, umami: 75, sour: 20 },
            description: { ko: "볼로네제 소스에 파스타를 넣고 국물처럼 끓여 먹는 이탈리아 수프 파스타예요.", ja: "ボロネーゼソースにパスタを入れてスープのように煮込んで食べるイタリアのスープパスタです。", en: "Italian pasta cooked in bolognese sauce until broth-like — a warming soup pasta." },
            ingredients: { ko: ["스파게티", "볼로네제소스", "토마토", "다진고기", "파마산", "바질"], ja: ["スパゲティ", "ボロネーゼソース", "トマト", "挽き肉", "パルメザン", "バジル"], en: ["Spaghetti", "Bolognese sauce", "Tomato", "Ground meat", "Parmesan", "Basil"] },
            similarityPercent: 65,
            matchReason: { ko: "진한 소스와 면을 함께 끓인 국물 있는 면 요리라는 점이 우짜와 닮았어요.", ja: "濃厚なソースと麺を一緒に煮込んだスープのある麺料理という点が우짜に似ています。", en: "Noodles in thick sauce broth — the same hearty, brothy noodle concept as ujja." }
          },
          MX: { challenge: true }
        }
      },
      {
        id: "tongyeong-sirakguk",
        name: { ko: "시락국", ja: "シラクグク", en: "Sirakguk" },
        region: "tongyeong",
        image: "/images/food/시락국.png",
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
          JP: {
            name: { ko: "장어 미소시루", ja: "うなぎの味噌汁", en: "Eel Miso Soup" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 5, umami: 85, sour: 5 },
            description: { ko: "뱀장어를 미소 된장 국물에 끓인 일본 전통 생선 국이에요.", ja: "ウナギを味噌汁で煮た日本伝統の魚スープです。", en: "Japanese traditional miso soup with eel — deeply savory and warming." },
            ingredients: { ko: ["뱀장어", "미소", "두부", "다시마육수", "파", "생강"], ja: ["ウナギ", "味噌", "豆腐", "昆布だし", "ネギ", "生姜"], en: ["Eel", "Miso", "Tofu", "Kelp dashi", "Green onion", "Ginger"] },
            similarityPercent: 78,
            matchReason: { ko: "말린 생선을 국물에 끓여 먹는 구조가 시락국과 닮았어요.", ja: "干し魚をスープで煮て食べる構造がシラクグクに似ています。", en: "Fish in broth soup — the same dried fish umami extraction technique as sirakguk." }
          },
          CN: {
            name: { ko: "장어 뼈 육수탕", ja: "ウナギ骨スープ", en: "Eel Bone Broth" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 82, sour: 5 },
            description: { ko: "장어 뼈를 오래 끓여 만든 진한 중국식 생선 국물 요리예요.", ja: "ウナギの骨を長時間煮込んで作る濃厚な中国式魚スープ料理です。", en: "Chinese rich soup made by simmering eel bones for hours." },
            ingredients: { ko: ["장어뼈", "생강", "파", "중국간장", "요리주", "소금"], ja: ["ウナギの骨", "生姜", "ネギ", "中国醤油", "料理酒", "塩"], en: ["Eel bones", "Ginger", "Green onion", "Chinese soy sauce", "Cooking wine", "Salt"] },
            similarityPercent: 74,
            matchReason: { ko: "생선 뼈를 끓여 진한 국물을 만드는 방식이 시락국과 같아요.", ja: "魚の骨を煮込んで濃厚なスープを作る方式がシラクグクと同じです。", en: "Fish bone broth extraction — the same deeply savory soup technique as sirakguk." }
          },
          ES: {
            name: { ko: "생선 뼈 스튜", ja: "魚骨シチュー", en: "Fish Bone Stew" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 75, sour: 15 },
            description: { ko: "다양한 생선 뼈와 채소를 끓여 만든 스페인 어촌 스타일 국물 요리예요.", ja: "様々な魚の骨と野菜を煮込んで作ったスペインの漁村スタイルのスープ料理です。", en: "Spanish fishermen's soup made from fish bones and vegetables." },
            ingredients: { ko: ["생선뼈", "양파", "토마토", "파프리카", "마늘", "올리브오일"], ja: ["魚の骨", "玉ねぎ", "トマト", "パプリカ", "にんにく", "オリーブオイル"], en: ["Fish bones", "Onion", "Tomato", "Paprika", "Garlic", "Olive oil"] },
            similarityPercent: 70,
            matchReason: { ko: "생선 부산물로 진한 국물을 내는 방식이 시락국과 같아요.", ja: "魚の副産物で濃厚なスープを作る方式がシラクグクと同じです。", en: "Fish by-product broth — both honor the nose-to-tail philosophy of using every part of the fish." }
          }
        }
      },
      {
        id: "tongyeong-haemul-ttukbaegi",
        name: { ko: "해물뚝배기", ja: "海鮮トゥッペギ", en: "Haemul Ttukbaegi" },
        region: "tongyeong",
        image: "/images/food/해물뚝배기.png",
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
          ES: {
            name: { ko: "카수엘라 데 마리스코", ja: "カスエラ・デ・マリスコ", en: "Cazuela de Mariscos" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 25, umami: 82, sour: 20 },
            description: { ko: "다양한 해산물을 토마토와 향신료로 끓인 스페인 뚝배기 해산물 스튜예요.", ja: "様々な海鮮をトマトとスパイスで煮込んだスペインの土鍋海鮮シチューです。", en: "Spanish clay pot seafood stew with tomato and spices." },
            ingredients: { ko: ["낙지", "새우", "홍합", "토마토", "마늘", "올리브오일"], ja: ["タコ", "エビ", "ムール貝", "トマト", "にんにく", "オリーブオイル"], en: ["Octopus", "Shrimp", "Mussels", "Tomato", "Garlic", "Olive oil"] },
            similarityPercent: 85,
            matchReason: { ko: "다양한 해산물을 뚝배기에 넣고 끓이는 방식이 해물뚝배기와 거의 같아요.", ja: "様々な海鮮を土鍋に入れて煮込む方式が해물뚝배기とほぼ同じです。", en: "Mixed seafood in a clay pot with broth — the same concept and vessel as haemul ttukbaegi." }
          },
          FR: {
            name: { ko: "부이야베스", ja: "ブイヤベース", en: "Bouillabaisse" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 85, sour: 15 },
            description: { ko: "다양한 생선과 해산물을 사프란 육수에 끓인 마르세유 전통 해산물 수프예요.", ja: "様々な魚と海鮮をサフランのスープで煮込んだマルセイユ伝統の海鮮スープです。", en: "Marseille's fishermen's stew with mixed seafood in saffron-aromatic broth." },
            ingredients: { ko: ["흰살생선", "조개", "새우", "사프란", "토마토", "올리브오일"], ja: ["白身魚", "貝", "エビ", "サフラン", "トマト", "オリーブオイル"], en: ["White fish", "Clams", "Shrimp", "Saffron", "Tomato", "Olive oil"] },
            similarityPercent: 78,
            matchReason: { ko: "다양한 해산물을 끓인 진한 수프가 해물뚝배기와 닮았어요.", ja: "様々な海鮮を煮込んだ濃厚なスープが해물뚝배기に似ています。", en: "Rich mixed seafood broth stew — the French bouillabaisse and haemul ttukbaegi share the same soul." }
          },
          JP: {
            name: { ko: "카이센 나베", ja: "海鮮鍋", en: "Kaisen Nabe" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 85, sour: 5 },
            description: { ko: "다양한 해산물을 다시마 육수에 넣고 끓이는 일본식 해산물 냄비예요.", ja: "様々な海鮮を昆布だしに入れて煮込む日本式海鮮鍋です。", en: "Japanese seafood hot pot with various shellfish and fish in kombu broth." },
            ingredients: { ko: ["굴", "새우", "꽃게", "홍합", "다시마육수", "폰즈"], ja: ["牡蠣", "エビ", "花ガニ", "ムール貝", "昆布だし", "ポン酢"], en: ["Oysters", "Shrimp", "Blue crab", "Mussels", "Kelp dashi", "Ponzu"] },
            similarityPercent: 88,
            matchReason: { ko: "다양한 해산물을 냄비에 넣고 육수에 끓이는 방식이 해물뚝배기와 거의 같아요.", ja: "様々な海鮮を鍋に入れてスープで煮込む方式が해물뚝배기とほぼ同じです。", en: "Various seafood in a pot of broth — the Japanese equivalent of haemul ttukbaegi." }
          }
        }
      },
      {
        id: "tongyeong-ppaettaegi-juk",
        name: { ko: "빼때기죽", ja: "ッペッテギジュク", en: "Ppaettaegi-juk" },
        region: "tongyeong",
        image: "/images/food/빼때기죽.png",
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
          US: {
            name: { ko: "스위트 포테이토 수프", ja: "スウィートポテトスープ", en: "Sweet Potato Soup" },
            tasteProfile: { sweet: 55, salty: 35, spicy: 5, umami: 40, sour: 5 },
            description: { ko: "고구마를 삶아 크림과 함께 부드럽게 갈아 만든 미국식 크림 수프예요.", ja: "サツマイモを煮てクリームと一緒に滑らかに混ぜたアメリカ式クリームスープです。", en: "Creamy American soup made from roasted sweet potatoes blended smooth." },
            ingredients: { ko: ["고구마", "크림", "버터", "양파", "계피", "소금"], ja: ["サツマイモ", "クリーム", "バター", "玉ねぎ", "シナモン", "塩"], en: ["Sweet potato", "Cream", "Butter", "Onion", "Cinnamon", "Salt"] },
            similarityPercent: 72,
            matchReason: { ko: "고구마를 끓여 만든 달콤하고 부드러운 수프가 빼때기죽과 닮았어요.", ja: "サツマイモを煮た甘くて滑らかなスープがッテギジュクに似ています。", en: "Sweet potato-based warm soup — both feature the same sweet, starchy comfort as ppaettaegi juk." }
          },
          IN: {
            name: { ko: "고구마 할바", ja: "サツマイモハルワ", en: "Sweet Potato Halwa" },
            tasteProfile: { sweet: 70, salty: 5, spicy: 5, umami: 15, sour: 5 },
            description: { ko: "고구마를 기에 볶아 설탕과 카르다몸으로 단맛을 더한 인도 전통 디저트예요.", ja: "サツマイモをギーで炒めて砂糖とカルダモンで甘みを加えたインド伝統のデザートです。", en: "Indian traditional dessert of sweet potato cooked in ghee with cardamom and sugar." },
            ingredients: { ko: ["고구마", "기", "설탕", "카르다몸", "캐슈", "우유"], ja: ["サツマイモ", "ギー", "砂糖", "カルダモン", "カシューナッツ", "牛乳"], en: ["Sweet potato", "Ghee", "Sugar", "Cardamom", "Cashews", "Milk"] },
            similarityPercent: 68,
            matchReason: { ko: "고구마를 부드럽게 조리해 달콤하게 먹는 방식이 빼때기죽과 같아요.", ja: "サツマイモを柔らかく調理して甘く食べる方式がッテギジュクと同じです。", en: "Sweet potato cooked to a soft, sweet consistency — the same starchy sweetness as ppaettaegi juk." }
          },
          MX: { challenge: true }
        }
      },
      {
        id: "tongyeong-dacci",
        name: { ko: "다찌 해산물", ja: "ダッチ海鮮", en: "Dacci Seafood" },
        region: "tongyeong",
        image: "/images/food/다찌해산물.png",
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
          JP: {
            name: { ko: "오마카세", ja: "おまかせ", en: "Omakase" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 5, umami: 85, sour: 25 },
            description: { ko: "셰프가 그날의 최상의 재료로 코스 요리를 선보이는 일본 최고급 식사 방식이에요.", ja: "シェフがその日の最上の食材でコース料理を披露する日本の最高級食事スタイルです。", en: "Japanese chef-curated multi-course meal with seasonal premium ingredients." },
            ingredients: { ko: ["계절회", "스시", "다시", "사시미", "미소수프", "디저트"], ja: ["季節の刺身", "寿司", "だし", "刺身", "味噌汁", "デザート"], en: ["Seasonal sashimi", "Sushi", "Dashi", "Sashimi", "Miso soup", "Dessert"] },
            similarityPercent: 88,
            matchReason: { ko: "주인이 엄선한 해산물을 코스로 내어주는 방식이 다찌와 개념적으로 같아요.", ja: "主人が厳選した海鮮をコースで提供する方式がタッチと概念的に同じです。", en: "Chef-curated seafood courses served progressively — the Japanese omakase and dacci share the same hospitality spirit." }
          },
          ES: {
            name: { ko: "타파스 코스", ja: "タパスコース", en: "Tapas Course" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 20, umami: 72, sour: 20 },
            description: { ko: "다양한 소량의 스페인 요리를 여러 접시로 나눠 먹는 스페인 식사 문화예요.", ja: "様々な少量のスペイン料理を複数の皿に分けて食べるスペインの食事文化です。", en: "Spanish dining culture of many small dishes served progressively — perfect for sharing." },
            ingredients: { ko: ["하몬", "빠따따스", "가스파초", "바칼라오", "초리소", "올리브"], ja: ["ハモン", "パタタス", "ガスパチョ", "バカラオ", "チョリソ", "オリーブ"], en: ["Jamón", "Patatas bravas", "Gazpacho", "Bacalao", "Chorizo", "Olives"] },
            similarityPercent: 82,
            matchReason: { ko: "여러 가지 소량 요리를 코스처럼 내어주는 방식이 다찌와 같아요.", ja: "様々な少量料理をコースのように提供する方式がタッチと同じです。", en: "Progressive small plates served in sequence — the same shared feast structure as tongyeong dacci." }
          },
          IT: {
            name: { ko: "안티파스토 미스토", ja: "アンティパストミスト", en: "Antipasto Misto" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 70, sour: 25 },
            description: { ko: "다양한 이탈리아 전채 요리를 한 플레이트에 담아 내는 이탈리안 코스 첫 번째 요리예요.", ja: "様々なイタリアの前菜料理を一枚のプレートに盛り合わせるイタリアンコースの最初の料理です。", en: "Italian mixed appetizer platter with cured meats, cheeses, marinated vegetables." },
            ingredients: { ko: ["프로슈토", "살라미", "치즈", "올리브", "구운채소", "브루스케타"], ja: ["プロシュート", "サラミ", "チーズ", "オリーブ", "焼き野菜", "ブルスケッタ"], en: ["Prosciutto", "Salami", "Cheese", "Olives", "Grilled vegetables", "Bruschetta"] },
            similarityPercent: 78,
            matchReason: { ko: "다양한 음식을 한 번에 조금씩 내어주는 방식이 다찌의 해산물 모듬과 닮았어요.", ja: "様々な料理を少しずつ一緒に提供する方式がタッチの海鮮盛り合わせに似ています。", en: "Variety platter of small bites served together — the Italian version of dacci's mixed seafood course." }
          }
        }
      },
      {
        id: "tongyeong-dodari-ssuk",
        name: { ko: "도다리쑥국", ja: "ヒラメヨモギスープ", en: "Dodari-ssuk Soup" },
        region: "tongyeong",
        image: "/images/food/도다리쑥국.png",
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
          JP: {
            name: { ko: "카레이 쑥 나베", ja: "カレイよもぎ鍋", en: "Karei Yomogi Nabe" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 75, sour: 5 },
            description: { ko: "가자미에 쑥을 넣어 끓인 일본식 가자미 쑥 냄비 요리예요.", ja: "カレイにヨモギを入れて煮た日本式カレイのよもぎ鍋料理です。", en: "Japanese hot pot with flatfish and mugwort herbs in dashi broth." },
            ingredients: { ko: ["가자미", "쑥", "다시마육수", "두부", "무", "간장"], ja: ["カレイ", "よもぎ", "昆布だし", "豆腐", "大根", "醤油"], en: ["Flatfish", "Mugwort", "Kelp dashi", "Tofu", "Radish", "Soy sauce"] },
            similarityPercent: 90,
            matchReason: { ko: "가자미 생선에 쑥을 넣고 끓인 구조가 도다리쑥국과 거의 동일해요.", ja: "カレイにヨモギを入れて煮た構造が도다리쑥국とほぼ同じです。", en: "Flatfish with mugwort herb in broth — essentially the same dish as dodari ssuk guk." }
          },
          FR: {
            name: { ko: "가자미 허브 수프", ja: "ヒラメのハーブスープ", en: "Sole Herb Soup" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 72, sour: 15 },
            description: { ko: "가자미를 허브 육수에 끓인 프랑스 어부 스타일 생선 수프예요.", ja: "ヒラメをハーブのスープで煮たフランスの漁師スタイルの魚スープです。", en: "French fishermen's flatfish soup with herbs and broth." },
            ingredients: { ko: ["가자미", "타라곤", "셀러리", "화이트와인", "버터", "월계수잎"], ja: ["ヒラメ", "タラゴン", "セロリ", "白ワイン", "バター", "ローリエ"], en: ["Sole", "Tarragon", "Celery", "White wine", "Butter", "Bay leaf"] },
            similarityPercent: 76,
            matchReason: { ko: "흰살 납작 생선에 허브를 넣고 끓인 수프라는 점이 도다리쑥국과 같아요.", ja: "白身の平たい魚にハーブを入れて煮たスープという点が도다리쑥국と同じです。", en: "Flatfish with herbal notes in broth — the same gentle, aromatic fish soup as dodari ssuk guk." }
          },
          IT: {
            name: { ko: "흰살 생선 허브 브로도", ja: "白身魚のハーブブロード", en: "White Fish Herb Brodo" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 70, sour: 15 },
            description: { ko: "흰살 생선과 허브를 이탈리아 전통 방식으로 맑게 끓인 국물 요리예요.", ja: "白身魚とハーブをイタリア伝統の方法で澄んだスープで煮た料理です。", en: "Italian clear broth with white fish and fresh herbs — delicate and aromatic." },
            ingredients: { ko: ["흰살생선", "파슬리", "타임", "레몬", "올리브오일", "소금"], ja: ["白身魚", "パセリ", "タイム", "レモン", "オリーブオイル", "塩"], en: ["White fish", "Parsley", "Thyme", "Lemon", "Olive oil", "Salt"] },
            similarityPercent: 72,
            matchReason: { ko: "신선한 흰살 생선을 허브와 함께 맑은 국물에 끓이는 방식이 도다리쑥국과 닮았어요.", ja: "新鮮な白身魚をハーブと一緒に澄んだスープで煮る方式が도다리쑥국に似ています。", en: "Clean white fish with aromatic herbs in clear broth — the same delicate, seasonal fish soup as dodari ssuk guk." }
          }
        }
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
        image: "/images/food/흑돼지구이.png",
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
          JP: {
            name: { ko: "가고시마 쿠로부타", ja: "鹿児島黒豚", en: "Kagoshima Kurobuta" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 10, umami: 88, sour: 5 },
            description: { ko: "가고시마산 흑돼지를 숯불에 구워 먹는 일본 최고급 돼지고기 구이예요.", ja: "鹿児島産の黒豚を炭火で焼いて食べる日本最高級の豚肉焼き料理です。", en: "Premium Kagoshima black pork grilled over charcoal — Japan's answer to Jeju black pork." },
            ingredients: { ko: ["흑돼지", "굵은 소금", "폰즈소스", "생강", "파"], ja: ["黒豚", "粗塩", "ポン酢", "生姜", "ネギ"], en: ["Black pork", "Sea salt", "Ponzu sauce", "Ginger", "Green onion"] },
            similarityPercent: 92,
            matchReason: { ko: "흑돼지 품종을 숯불에 직화 구이해 먹는다는 점이 제주 흑돼지 구이와 거의 동일해요.", ja: "黒豚品種を炭火で直火焼きして食べるという点が済州黒豚焼きとほぼ同じです。", en: "Black pork breed grilled over charcoal — essentially the same premium pork experience as Jeju." }
          },
          ES: {
            name: { ko: "이베리코 숯불 구이", ja: "イベリコ炭火焼き", en: "Ibérico Charcoal Grill" },
            tasteProfile: { sweet: 5, salty: 48, spicy: 8, umami: 90, sour: 5 },
            description: { ko: "도토리를 먹고 자란 이베리코 흑돼지를 숯불에 구운 스페인 최고급 돼지 요리예요.", ja: "どんぐりを食べて育ったイベリコ黒豚を炭火で焼いたスペイン最高級の豚料理です。", en: "Spain's acorn-fed Ibérico black pork grilled over charcoal — the Jeju pork of Europe." },
            ingredients: { ko: ["이베리코 흑돼지", "올리브오일", "굵은 소금", "로즈마리"], ja: ["イベリコ黒豚", "オリーブオイル", "粗塩", "ローズマリー"], en: ["Ibérico black pork", "Olive oil", "Sea salt", "Rosemary"] },
            similarityPercent: 87,
            matchReason: { ko: "흑돼지 품종 특유의 깊은 감칠맛과 숯불 직화 구이 방식이 제주 흑돼지와 동일해요.", ja: "黒豚特有の深い旨味と炭火直火焼きのスタイルが済州黒豚と同じです。", en: "Black pig breed with deep umami and charcoal grilling — the European twin of Jeju heukdwaeji." }
          },
          US: {
            name: { ko: "풀드 포크", ja: "プルドポーク", en: "Pulled Pork" },
            tasteProfile: { sweet: 25, salty: 55, spicy: 20, umami: 75, sour: 15 },
            description: { ko: "훈연 처리한 돼지고기를 저온에서 장시간 조리해 손으로 찢어 먹는 미국 바비큐예요.", ja: "スモーク処理した豚肉を低温で長時間調理して手でほぐすアメリカンBBQです。", en: "American BBQ smoked pork shoulder cooked low and slow until it pulls apart." },
            ingredients: { ko: ["돼지 어깨살", "BBQ소스", "훈연칩", "흑설탕", "스파이스럽"], ja: ["豚肩肉", "BBQソース", "スモークチップ", "黒砂糖", "スパイスラブ"], en: ["Pork shoulder", "BBQ sauce", "Smoke chips", "Brown sugar", "Spice rub"] },
            similarityPercent: 70,
            matchReason: { ko: "특수 돼지 품종을 장시간 조리해 깊은 맛을 내는 프리미엄 돼지 요리예요.", ja: "特別な豚品種を長時間調理して深い味を出すプレミアム豚料理です。", en: "Premium pork cooked low and slow for maximum flavor — same philosophy as Jeju black pork." }
          }
        }
      },
      {
        id: "jeju-gogi-guksu",
        name: { ko: "고기국수", ja: "コギククス", en: "Gogi Guksu" },
        region: "jeju",
        image: "/images/food/고기국수.png",
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
          JP: {
            name: { ko: "오키나와 소바", ja: "沖縄そば", en: "Okinawa Soba" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 5, umami: 78, sour: 5 },
            description: { ko: "돼지고기 육수에 굵은 우동 면을 넣고 삼겹살 토핑을 올린 오키나와 지역 면 요리예요.", ja: "豚肉スープに太めのうどん麺を入れてバラ肉トッピングをのせた沖縄地域の麺料理です。", en: "Okinawan noodle soup with pork broth and braised pork belly — island comfort food." },
            ingredients: { ko: ["밀가루면", "돼지육수", "삼겹살", "어묵", "파"], ja: ["小麦麺", "豚骨スープ", "バラ肉", "かまぼこ", "ネギ"], en: ["Wheat noodles", "Pork broth", "Pork belly", "Fish cake", "Green onion"] },
            similarityPercent: 90,
            matchReason: { ko: "돼지고기 육수에 면을 넣고 삼겹살을 올려 먹는 방식이 고기국수와 거의 똑같아요.", ja: "豚肉スープに麺を入れて豚バラをのせる方式がゴギクッスとほぼ同じです。", en: "Pork broth noodles with braised pork topping — virtually identical to Jeju gogi guksu." }
          },
          VN: {
            name: { ko: "퍼 헤오", ja: "フォー・ヘオ", en: "Pho Heo" },
            tasteProfile: { sweet: 15, salty: 45, spicy: 15, umami: 72, sour: 20 },
            description: { ko: "돼지뼈 육수에 쌀국수를 넣고 돼지고기 슬라이스를 올려 먹는 베트남 국수예요.", ja: "豚骨スープに米麺を入れて豚肉スライスをのせるベトナムの麺料理です。", en: "Vietnamese pork bone broth noodle soup with sliced pork." },
            ingredients: { ko: ["쌀국수", "돼지뼈육수", "돼지고기 슬라이스", "숙주", "라임", "고수"], ja: ["ライスヌードル", "豚骨スープ", "薄切り豚肉", "もやし", "ライム", "パクチー"], en: ["Rice noodles", "Pork bone broth", "Sliced pork", "Bean sprouts", "Lime", "Cilantro"] },
            similarityPercent: 78,
            matchReason: { ko: "돼지뼈 육수에 면과 돼지고기 슬라이스를 넣어 먹는 방식이 고기국수와 같아요.", ja: "豚骨スープに麺と豚肉スライスを入れる方式がゴギクッスと同じです。", en: "Pork bone noodle soup with pork slices — the same island pork noodle DNA as gogi guksu." }
          },
          CN: {
            name: { ko: "돈코츠 탕면", ja: "豚骨湯麺", en: "Pork Bone Tang Mian" },
            tasteProfile: { sweet: 10, salty: 60, spicy: 20, umami: 82, sour: 5 },
            description: { ko: "돼지 뼈를 끓인 진한 육수에 중국식 면을 넣은 중국 탕면이에요.", ja: "豚骨を煮込んだ濃厚なスープに中国式麺を入れた中国の湯麺です。", en: "Chinese noodle soup in rich pork bone broth — a mainland cousin to okinawa soba." },
            ingredients: { ko: ["중국면", "돼지뼈육수", "차슈", "청경채", "마늘", "간장"], ja: ["中国麺", "豚骨スープ", "チャーシュー", "チンゲン菜", "にんにく", "醤油"], en: ["Chinese noodles", "Pork bone broth", "Chashu", "Bok choy", "Garlic", "Soy sauce"] },
            similarityPercent: 74,
            matchReason: { ko: "진한 돼지뼈 육수에 면을 끓여 먹는 방식이 고기국수와 닮았어요.", ja: "濃厚な豚骨スープに麺を煮て食べる方式がゴギクッスに似ています。", en: "Rich pork bone broth noodles — the same comforting pork noodle soul as gogi guksu." }
          }
        }
      },
      {
        id: "jeju-galchi-jorim",
        name: { ko: "갈치조림", ja: "太刀魚の煮付け", en: "Galchi Jorim" },
        region: "jeju",
        image: "/images/food/갈치조림.png",
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
          JP: {
            name: { ko: "타치우오 조림", ja: "太刀魚の煮付け", en: "Braised Tachiuo" },
            tasteProfile: { sweet: 25, salty: 55, spicy: 20, umami: 75, sour: 10 },
            description: { ko: "갈치와 같은 칼치 생선을 간장, 미림, 설탕으로 조린 일본식 생선 조림이에요.", ja: "太刀魚を醤油、みりん、砂糖で煮付けた日本式魚の煮物です。", en: "Japanese braised cutlassfish in soy sauce, mirin, and sugar." },
            ingredients: { ko: ["갈치", "간장", "미림", "설탕", "생강", "파"], ja: ["太刀魚", "醤油", "みりん", "砂糖", "生姜", "ネギ"], en: ["Cutlassfish", "Soy sauce", "Mirin", "Sugar", "Ginger", "Green onion"] },
            similarityPercent: 88,
            matchReason: { ko: "같은 칼치 생선을 간장 양념에 조린 방식이 갈치조림과 거의 동일해요.", ja: "同じ太刀魚を醤油で煮付ける方式が갈치조림とほぼ同じです。", en: "Same fish species braised in soy-based sauce — virtually the same dish with slightly different seasoning." }
          },
          IT: {
            name: { ko: "페스카토레", ja: "ペスカトーレ", en: "Pescatore" },
            tasteProfile: { sweet: 20, salty: 50, spicy: 30, umami: 72, sour: 25 },
            description: { ko: "다양한 해산물을 토마토 소스에 조린 이탈리아 어부 스타일 요리예요.", ja: "様々な海鮮をトマトソースで煮込んだイタリアの漁師スタイル料理です。", en: "Italian fisherman's pasta sauce with mixed seafood in tomato sauce." },
            ingredients: { ko: ["생선", "오징어", "새우", "토마토소스", "마늘", "올리브오일"], ja: ["魚", "イカ", "エビ", "トマトソース", "にんにく", "オリーブオイル"], en: ["Fish", "Squid", "Shrimp", "Tomato sauce", "Garlic", "Olive oil"] },
            similarityPercent: 70,
            matchReason: { ko: "생선을 소스에 조려 먹는 방식이 갈치조림과 닮았어요.", ja: "魚をソースで煮込んで食べる方式が갈치조림に似ています。", en: "Fish braised in sauce — the same fisherman's cooking concept as galchi jorim." }
          },
          MX: { challenge: true }
        }
      },
      {
        id: "jeju-jeonbok-juk",
        name: { ko: "전복죽", ja: "アワビ粥", en: "Jeonbok Juk" },
        region: "jeju",
        image: "/images/food/전복죽.png",
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
                dupes: {
          CN: {
            name: { ko: "전복 콘지", ja: "アワビコンジー", en: "Abalone Congee" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 85, sour: 5 },
            description: { ko: "신선한 전복을 넣고 끓인 중국식 쌀죽으로, 광동 요리의 고급 메뉴예요.", ja: "新鮮なアワビを入れて煮た中国式お粥で、広東料理の高級メニューです。", en: "Cantonese premium rice porridge with fresh abalone — the Chinese cousin of jeonbok juk." },
            ingredients: { ko: ["전복", "쌀", "닭육수", "생강", "참기름", "파"], ja: ["アワビ", "米", "鶏スープ", "生姜", "ごま油", "ネギ"], en: ["Abalone", "Rice", "Chicken broth", "Ginger", "Sesame oil", "Green onion"] },
            similarityPercent: 88,
            matchReason: { ko: "전복을 넣고 끓인 쌀죽이라는 기본 구성이 전복죽과 완전히 같아요.", ja: "アワビを入れて煮たお粥という基本構成が전복죽と全く同じです。", en: "Abalone rice porridge — the same dish with slightly different aromatics." }
          },
          IT: {
            name: { ko: "전복 리조또", ja: "アワビリゾット", en: "Abalone Risotto" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 82, sour: 10 },
            description: { ko: "신선한 전복과 파마산 치즈, 버터로 만든 이탈리아 프리미엄 리조또예요.", ja: "新鮮なアワビとパルメザンチーズ、バターで作ったイタリアのプレミアムリゾットです。", en: "Italian creamy risotto with fresh abalone, parmesan, and butter." },
            ingredients: { ko: ["전복", "아르보리오 쌀", "버터", "파마산", "화이트와인", "육수"], ja: ["アワビ", "アルボリオ米", "バター", "パルメザン", "白ワイン", "ブロード"], en: ["Abalone", "Arborio rice", "Butter", "Parmesan", "White wine", "Broth"] },
            similarityPercent: 80,
            matchReason: { ko: "전복을 쌀 요리에 넣어 감칠맛을 내는 방식이 전복죽과 같아요.", ja: "アワビを米料理に入れて旨味を出す方式が전복죽と同じです。", en: "Abalone in a slow-cooked rice dish — the same luxury seafood grain bowl concept as jeonbok juk." }
          },
          JP: {
            name: { ko: "아와비 조스이", ja: "鮑雑炊", en: "Awabi Zosui" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 85, sour: 5 },
            description: { ko: "전복을 다시마 육수에 넣고 밥과 함께 끓인 일본식 전복 죽이에요.", ja: "アワビを昆布だしに入れてご飯と一緒に煮た日本式アワビ粥です。", en: "Japanese rice porridge with abalone in kombu dashi broth." },
            ingredients: { ko: ["전복", "밥", "다시마육수", "간장", "미림", "파"], ja: ["アワビ", "ご飯", "昆布だし", "醤油", "みりん", "ネギ"], en: ["Abalone", "Rice", "Kombu dashi", "Soy sauce", "Mirin", "Green onion"] },
            similarityPercent: 87,
            matchReason: { ko: "전복을 다시 육수와 밥으로 끓인 죽 요리라는 점이 전복죽과 거의 동일해요.", ja: "アワビをだしとご飯で煮たお粥料理という点が전복죽とほぼ同じです。", en: "Abalone rice porridge in dashi — the Japanese equivalent of Jeju's signature abalone dish." }
          }
        }
      },
      {
        id: "jeju-momguk",
        name: { ko: "몸국", ja: "モムグク", en: "Momguk" },
        region: "jeju",
        image: "/images/food/몸국.png",
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
          FR: {
            name: { ko: "포타주 오 잘그", ja: "ポタージュ・オ・ジャルグ", en: "Potage Oseille" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 5, umami: 55, sour: 35 },
            description: { ko: "소렐 잎과 돼지 육수로 끓인 프랑스 전통 허브 수프예요.", ja: "ソレルの葉と豚のスープで作ったフランス伝統のハーブスープです。", en: "French traditional soup made with sorrel leaves and pork broth." },
            ingredients: { ko: ["소렐잎", "돼지육수", "버터", "크림", "소금", "후추"], ja: ["ソレル", "豚スープ", "バター", "クリーム", "塩", "こしょう"], en: ["Sorrel leaves", "Pork broth", "Butter", "Cream", "Salt", "Pepper"] },
            similarityPercent: 68,
            matchReason: { ko: "해초나 허브를 돼지 육수에 끓인 수프라는 공통점이 몸국과 닮았어요.", ja: "海藻やハーブを豚スープで煮たスープという共通点が몸국に似ています。", en: "Leafy greens simmered in pork broth — same concept as momguk, just European greens instead of seaweed." }
          },
          MY: {
            name: { ko: "바쿠테", ja: "バクテー", en: "Bak Kut Teh" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 80, sour: 5 },
            description: { ko: "돼지뼈와 한약재를 오랫동안 끓인 말레이시아 돼지 갈비 국물 요리예요.", ja: "豚骨と漢方薬材を長時間煮込んだマレーシアの豚バラ骨スープ料理です。", en: "Malaysian pork rib soup simmered with Chinese herbal medicines." },
            ingredients: { ko: ["돼지갈비", "마늘", "계피", "팔각", "간장", "후추"], ja: ["豚バラ骨", "にんにく", "シナモン", "八角", "醤油", "こしょう"], en: ["Pork ribs", "Garlic", "Cinnamon", "Star anise", "Soy sauce", "Pepper"] },
            similarityPercent: 72,
            matchReason: { ko: "돼지고기와 특수 식물 재료를 오래 끓인 진한 국물이라는 점이 몸국과 닮았어요.", ja: "豚肉と特別な植物食材を長く煮込んだ濃厚なスープという点が몸국に似ています。", en: "Pork broth with unique plant ingredients simmered for hours — the same slow-cooked pork herb soup as momguk." }
          },
          MX: { challenge: true }
        }
      },
      {
        id: "jeju-dombe",
        name: { ko: "돔베고기", ja: "ドンベコギ", en: "Dombe Gogi" },
        region: "jeju",
        image: "/images/food/돔베고기.png",
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
          JP: {
            name: { ko: "부타 가쿠니", ja: "豚の角煮", en: "Buta Kakuni" },
            tasteProfile: { sweet: 35, salty: 50, spicy: 5, umami: 80, sour: 5 },
            description: { ko: "간장, 미림, 설탕, 청주로 돼지삼겹살을 장시간 조린 일본식 찜 요리예요.", ja: "醤油、みりん、砂糖、日本酒で豚バラ肉を長時間煮込んだ日本式の煮物料理です。", en: "Japanese braised pork belly in soy, mirin, sugar, and sake — melt-in-your-mouth tender." },
            ingredients: { ko: ["돼지삼겹살", "간장", "미림", "설탕", "청주", "생강"], ja: ["豚バラ肉", "醤油", "みりん", "砂糖", "日本酒", "生姜"], en: ["Pork belly", "Soy sauce", "Mirin", "Sugar", "Sake", "Ginger"] },
            similarityPercent: 88,
            matchReason: { ko: "돼지고기를 간장 소스에 장시간 조려 부드럽게 만드는 방식이 돔베고기와 매우 닮았어요.", ja: "豚肉を醤油ソースで長時間煮込んで柔らかくする方式がドンベゴギによく似ています。", en: "Pork belly braised until silky soft in soy-based sauce — essentially the same dish as dombe." }
          },
          CN: {
            name: { ko: "홍샤오 러우", ja: "紅焼肉", en: "Hong Shao Rou" },
            tasteProfile: { sweet: 40, salty: 50, spicy: 5, umami: 82, sour: 5 },
            description: { ko: "간장, 설탕, 황주, 팔각으로 삼겹살을 붉게 조린 중국 마오쩌둥이 사랑한 요리예요.", ja: "醤油、砂糖、紹興酒、八角で豚バラ肉を赤く煮込んだ毛沢東が愛した中国料理です。", en: "Chinese red-braised pork belly in soy, sugar, and spices — Mao's favorite dish." },
            ingredients: { ko: ["삼겹살", "간장", "설탕", "황주", "팔각", "계피"], ja: ["豚バラ肉", "醤油", "砂糖", "紹興酒", "八角", "シナモン"], en: ["Pork belly", "Soy sauce", "Sugar", "Rice wine", "Star anise", "Cinnamon"] },
            similarityPercent: 85,
            matchReason: { ko: "두껍게 썬 돼지고기를 간장 소스에 장시간 조리는 방식이 돔베고기와 같아요.", ja: "厚切り豚肉を醤油ソースで長時間煮込む方式がドンベゴギと同じです。", en: "Thick pork belly braised in soy sauce for hours — the same satisfying, glossy result as dombe." }
          },
          FR: {
            name: { ko: "뤼스틱 수육", ja: "ポテ・ノルマン", en: "Potée Normande" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 5, umami: 72, sour: 10 },
            description: { ko: "돼지고기와 채소를 사과주에 끓인 노르망디 지방의 돼지고기 스튜예요.", ja: "豚肉と野菜をシードルで煮込んだノルマンディ地方の豚肉シチューです。", en: "Normandy pork stew with vegetables braised in hard cider." },
            ingredients: { ko: ["돼지고기", "사과주", "감자", "양배추", "당근", "순무"], ja: ["豚肉", "シードル", "じゃがいも", "キャベツ", "人参", "カブ"], en: ["Pork", "Hard cider", "Potato", "Cabbage", "Carrot", "Turnip"] },
            similarityPercent: 70,
            matchReason: { ko: "돼지고기를 채소와 함께 장시간 조려 부드럽게 만드는 방식이 돔베고기와 닮았어요.", ja: "豚肉を野菜と一緒に長時間煮込んで柔らかくする方式がドンベゴギに似ています。", en: "Long-braised pork with vegetables — the same patient, low-and-slow pork philosophy as dombe." }
          }
        }
      },
      {
        id: "jeju-mulhoe",
        name: { ko: "물회", ja: "ムルフェ", en: "Mulhoe" },
        region: "jeju",
        image: "/images/food/물회.png",
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
          MX: {
            name: { ko: "세비체", ja: "セビーチェ", en: "Ceviche" },
            tasteProfile: { sweet: 10, salty: 45, spicy: 30, umami: 65, sour: 70 },
            description: { ko: "신선한 생선을 라임즙에 '익혀' 고수, 양파, 고추와 버무린 페루 전통 요리예요.", ja: "新鮮な魚をライム汁で「調理」してパクチー、玉ねぎ、唐辛子で和えたペルーの伝統料理です。", en: "Peruvian fresh fish cured in lime juice with cilantro, onion, and chili — cold and bright." },
            ingredients: { ko: ["흰살생선", "라임즙", "고수", "적양파", "고추", "소금"], ja: ["白身魚", "ライム汁", "パクチー", "赤玉ねぎ", "唐辛子", "塩"], en: ["White fish", "Lime juice", "Cilantro", "Red onion", "Chili", "Salt"] },
            similarityPercent: 82,
            matchReason: { ko: "차가운 회를 매콤새콤한 소스에 버무린 물회와 세비체는 구조가 거의 동일해요.", ja: "冷たい刺身を辛酸っぱいソースで和えた물회とセビーチェは構造がほぼ同じです。", en: "Cold raw fish in spicy-sour sauce — mul-hoe and ceviche are the same dish on opposite sides of the world." }
          },
          ES: {
            name: { ko: "가스파초", ja: "ガスパチョ", en: "Gazpacho" },
            tasteProfile: { sweet: 15, salty: 45, spicy: 20, umami: 50, sour: 40 },
            description: { ko: "토마토, 오이, 피망, 마늘을 갈아 차갑게 먹는 스페인 전통 냉수프예요.", ja: "トマト、きゅうり、パプリカ、にんにくをすりつぶして冷たく食べるスペイン伝統の冷製スープです。", en: "Spanish chilled tomato soup blended with cucumber, peppers, and garlic." },
            ingredients: { ko: ["토마토", "오이", "피망", "마늘", "올리브오일", "식초"], ja: ["トマト", "きゅうり", "パプリカ", "にんにく", "オリーブオイル", "酢"], en: ["Tomato", "Cucumber", "Pepper", "Garlic", "Olive oil", "Vinegar"] },
            similarityPercent: 65,
            matchReason: { ko: "차갑게 먹는 새콤한 음식이라는 점이 물회의 시원한 성격과 닮았어요.", ja: "冷たく食べる酸っぱい料理という点が물회の涼しいキャラクターに似ています。", en: "Cold, acidic, refreshing dish — the same cooling summer food spirit as mul-hoe." }
          },
          IT: {
            name: { ko: "콜드 카르파초", ja: "コールドカルパッチョ", en: "Fish Carpaccio" },
            tasteProfile: { sweet: 5, salty: 40, spicy: 10, umami: 72, sour: 30 },
            description: { ko: "신선한 흰살 생선을 얇게 슬라이스해 레몬과 올리브오일로 드레싱한 이탈리아 생선 요리예요.", ja: "新鮮な白身魚を薄くスライスしてレモンとオリーブオイルでドレッシングしたイタリアの魚料理です。", en: "Italian raw fish sliced thin and dressed with lemon, olive oil, and capers." },
            ingredients: { ko: ["흰살생선", "레몬", "올리브오일", "케이퍼", "루꼴라", "소금"], ja: ["白身魚", "レモン", "オリーブオイル", "ケーパー", "ルッコラ", "塩"], en: ["White fish", "Lemon", "Olive oil", "Capers", "Arugula", "Salt"] },
            similarityPercent: 72,
            matchReason: { ko: "얇게 썬 생회를 새콤한 소스와 함께 차갑게 먹는 방식이 물회와 닮았어요.", ja: "薄くスライスした生魚を酸っぱいソースと一緒に冷たく食べる方式が물회に似ています。", en: "Cold raw fish with acidic dressing — the same elegant, refreshing raw fish concept as mul-hoe." }
          }
        }
      },
      {
        id: "jeju-bomal-kalguksu",
        name: { ko: "보말칼국수", ja: "カサガイカルグクス", en: "Bomal Kalguksu" },
        region: "jeju",
        image: "/images/food/보말칼국수.png",
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
          IT: {
            name: { ko: "봉골레 파스타", ja: "ボンゴレパスタ", en: "Spaghetti alle Vongole" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 82, sour: 20 },
            description: { ko: "바지락과 마늘, 화이트 와인으로 만든 이탈리아 전통 조개 파스타예요.", ja: "アサリとにんにく、白ワインで作ったイタリア伝統の貝パスタです。", en: "Italian classic pasta with clams, garlic, white wine, and olive oil." },
            ingredients: { ko: ["스파게티", "바지락", "마늘", "화이트와인", "올리브오일", "파슬리"], ja: ["スパゲティ", "アサリ", "にんにく", "白ワイン", "オリーブオイル", "パセリ"], en: ["Spaghetti", "Clams", "Garlic", "White wine", "Olive oil", "Parsley"] },
            similarityPercent: 85,
            matchReason: { ko: "조개 육수에 면을 넣어 먹는 방식이 보말칼국수와 매우 닮았어요.", ja: "貝のだしに麺を入れて食べる方式がボマルカルグクスによく似ています。", en: "Noodles in briny shellfish broth — the same oceanic umami pairing as bomal kalguksu." }
          },
          FR: {
            name: { ko: "부이야베스", ja: "ブイヤベース", en: "Bouillabaisse" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 85, sour: 15 },
            description: { ko: "다양한 생선과 해산물을 향신료 육수에 끓인 마르세유 전통 해산물 수프예요.", ja: "様々な魚と海鮮をスパイスのスープで煮込んだマルセイユ伝統の海鮮スープです。", en: "Marseille's iconic fishermen's stew with mixed seafood in aromatic saffron broth." },
            ingredients: { ko: ["흰살생선", "조개", "새우", "사프란", "토마토", "올리브오일"], ja: ["白身魚", "貝", "エビ", "サフラン", "トマト", "オリーブオイル"], en: ["White fish", "Clams", "Shrimp", "Saffron", "Tomato", "Olive oil"] },
            similarityPercent: 78,
            matchReason: { ko: "다양한 해산물을 끓인 진한 육수에 면을 넣어 먹는 방식이 보말칼국수와 닮았어요.", ja: "様々な海鮮を煮込んだ濃厚なスープに麺を入れて食べる方式がボマルカルグクスに似ています。", en: "Rich seafood broth with various shellfish — the same depth of ocean flavor as bomal kalguksu." }
          },
          JP: {
            name: { ko: "고둥 우동", ja: "ツブ貝うどん", en: "Sea Snail Udon" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 5, umami: 78, sour: 5 },
            description: { ko: "고둥 조개 육수로 끓인 일본식 우동으로, 해산물 감칠맛이 풍부해요.", ja: "ツブ貝のだしで作った日本式うどんで、海鮮の旨味が豊富です。", en: "Japanese udon in rich sea snail broth — deeply oceanic and warming." },
            ingredients: { ko: ["우동면", "고둥", "다시마육수", "간장", "미림", "파"], ja: ["うどん麺", "ツブ貝", "昆布だし", "醤油", "みりん", "ネギ"], en: ["Udon noodles", "Sea snails", "Kelp dashi", "Soy sauce", "Mirin", "Green onion"] },
            similarityPercent: 84,
            matchReason: { ko: "고둥 조개 육수에 굵은 면을 넣어 먹는 방식이 보말칼국수와 거의 같아요.", ja: "ツブ貝のだしに太い麺を入れて食べる方式がボマルカルグクスとほぼ同じです。", en: "Thick noodles in sea snail broth — essentially the same dish as bomal kalguksu." }
          }
        }
      },
      {
        id: "jeju-omegi-tteok",
        name: { ko: "오메기떡", ja: "オメギ餅", en: "Omegi Tteok" },
        region: "jeju",
        image: "/images/food/오메기떡.jpg",
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
          JP: {
            name: { ko: "요모기 팥 모찌", ja: "よもぎ餡餅", en: "Yomogi Mochi" },
            tasteProfile: { sweet: 55, salty: 10, spicy: 0, umami: 20, sour: 5 },
            description: { ko: "쑥을 넣어 초록빛을 띠는 일본 쑥 찹쌀떡으로, 팥소가 들어 있어요.", ja: "よもぎを入れて緑色になる日本のよもぎ草餅で、小豆餡が入っています。", en: "Japanese mugwort mochi with sweet red bean filling — same herb-rice cake concept as omegi tteok." },
            ingredients: { ko: ["찹쌀가루", "쑥", "팥앙금", "설탕", "소금"], ja: ["もち米粉", "よもぎ", "小豆餡", "砂糖", "塩"], en: ["Glutinous rice flour", "Mugwort", "Red bean paste", "Sugar", "Salt"] },
            similarityPercent: 88,
            matchReason: { ko: "허브를 넣어 만든 쫄깃한 찹쌀떡이라는 점이 오메기떡과 거의 동일해요.", ja: "ハーブを入れて作ったもちもちの草餅という点がオメギトックとほぼ同じです。", en: "Herb-infused glutinous rice cake — the same technique and texture as omegi tteok." }
          },
          CN: {
            name: { ko: "팥 탕위안", ja: "小豆湯圓", en: "Red Bean Tangyuan" },
            tasteProfile: { sweet: 60, salty: 5, spicy: 0, umami: 15, sour: 5 },
            description: { ko: "찹쌀 반죽에 팥소를 넣고 둥글게 빚어 뜨겁게 먹는 중국 전통 찹쌀 떡국이에요.", ja: "もち米生地に小豆餡を包んで丸めて温かく食べる中国伝統のもち米団子スープです。", en: "Chinese glutinous rice balls filled with red bean paste, served in sweet soup." },
            ingredients: { ko: ["찹쌀가루", "팥앙금", "설탕", "생강", "꿀"], ja: ["もち米粉", "小豆餡", "砂糖", "生姜", "蜂蜜"], en: ["Glutinous rice flour", "Red bean paste", "Sugar", "Ginger", "Honey"] },
            similarityPercent: 78,
            matchReason: { ko: "찹쌀 반죽에 팥소를 넣어 먹는 쫄깃한 디저트가 오메기떡과 닮았어요.", ja: "もち米生地に小豆餡を入れたもちもちのデザートがオメギトックに似ています。", en: "Glutinous rice cake with red bean filling — the same sweet, chewy concept as omegi tteok." }
          },
          MY: {
            name: { ko: "온데 온데", ja: "オンデ・オンデ", en: "Onde Onde" },
            tasteProfile: { sweet: 55, salty: 10, spicy: 0, umami: 15, sour: 5 },
            description: { ko: "판단 잎으로 초록빛을 낸 찹쌀 반죽에 야자 설탕을 넣어 만든 말레이시아 전통 떡이에요.", ja: "パンダンリーフで緑色にしたもち米生地にパームシュガーを入れたマレーシア伝統の餅です。", en: "Malaysian green pandan glutinous rice balls filled with melted palm sugar." },
            ingredients: { ko: ["찹쌀가루", "판단잎", "야자설탕", "코코넛", "소금"], ja: ["もち米粉", "パンダンリーフ", "パームシュガー", "ココナッツ", "塩"], en: ["Glutinous rice flour", "Pandan leaves", "Palm sugar", "Coconut", "Salt"] },
            similarityPercent: 80,
            matchReason: { ko: "녹색 허브로 착색한 찹쌀 반죽에 달콤한 소를 넣은 방식이 오메기떡과 같아요.", ja: "緑のハーブで着色したもち米生地に甘い餡を入れた方式がオメギトックと同じです。", en: "Green herb-colored glutinous rice cake with sweet filling — the Malaysian omegi tteok." }
          }
        }
      },
      {
        id: "jeju-hallabong",
        name: { ko: "한라봉 디저트", ja: "漢拏峰デザート", en: "Hallabong Dessert" },
        region: "jeju",
        image: "/images/food/한라봉디저트.jpg",
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
          IT: {
            name: { ko: "레몬 그라니따", ja: "レモングラニータ", en: "Lemon Granita" },
            tasteProfile: { sweet: 45, salty: 5, spicy: 0, umami: 10, sour: 60 },
            description: { ko: "신선한 시칠리아 레몬즙으로 만든 이탈리아 전통 얼음 빙수 디저트예요.", ja: "新鮮なシチリアレモン汁で作ったイタリア伝統の氷菓子デザートです。", en: "Traditional Sicilian iced dessert made with fresh lemon juice — intensely citrusy and refreshing." },
            ingredients: { ko: ["레몬즙", "설탕", "물", "레몬제스트"], ja: ["レモン汁", "砂糖", "水", "レモンゼスト"], en: ["Lemon juice", "Sugar", "Water", "Lemon zest"] },
            similarityPercent: 78,
            matchReason: { ko: "감귤류 과일의 상큼한 향을 살린 차가운 디저트라는 점이 한라봉 디저트와 닮았어요.", ja: "柑橘系フルーツの爽やかな香りを活かした冷たいデザートという点が한라봉デザートに似ています。", en: "Cold citrus dessert showcasing fresh fruit flavor — the same bright, tangy philosophy as hallabong dessert." }
          },
          FR: {
            name: { ko: "오렌지 크렘 브륄레", ja: "オレンジクレームブリュレ", en: "Orange Crème Brûlée" },
            tasteProfile: { sweet: 60, salty: 5, spicy: 0, umami: 15, sour: 20 },
            description: { ko: "오렌지 향을 가미한 바닐라 크림을 캐러멜로 구운 프랑스 전통 디저트예요.", ja: "オレンジの香りを加えたバニラクリームをキャラメリゼしたフランス伝統のデザートです。", en: "French vanilla custard with orange zest, topped with caramelized sugar crust." },
            ingredients: { ko: ["달걀노른자", "생크림", "설탕", "오렌지제스트", "바닐라"], ja: ["卵黄", "生クリーム", "砂糖", "オレンジゼスト", "バニラ"], en: ["Egg yolks", "Heavy cream", "Sugar", "Orange zest", "Vanilla"] },
            similarityPercent: 72,
            matchReason: { ko: "감귤류 향을 담은 달콤한 디저트라는 공통점이 한라봉 디저트와 닮았어요.", ja: "柑橘系の香りを持つ甘いデザートという共通点が한라봉デザートに似ています。", en: "Citrus-flavored sweet dessert — both celebrate the bright, aromatic quality of citrus fruits." }
          },
          US: {
            name: { ko: "감귤 파운드 케이크", ja: "シトラスパウンドケーキ", en: "Citrus Pound Cake" },
            tasteProfile: { sweet: 65, salty: 10, spicy: 0, umami: 15, sour: 25 },
            description: { ko: "오렌지와 레몬 제스트를 가득 넣어 촉촉하게 구운 미국식 파운드 케이크예요.", ja: "オレンジとレモンのゼストをたっぷり入れてしっとり焼いたアメリカ式パウンドケーキです。", en: "Moist American pound cake loaded with fresh citrus zest and juice." },
            ingredients: { ko: ["버터", "설탕", "달걀", "밀가루", "오렌지즙", "레몬제스트"], ja: ["バター", "砂糖", "卵", "小麦粉", "オレンジジュース", "レモンゼスト"], en: ["Butter", "Sugar", "Eggs", "Flour", "Orange juice", "Lemon zest"] },
            similarityPercent: 70,
            matchReason: { ko: "제주 감귤의 향긋한 맛을 담은 파운드 케이크가 한라봉 디저트와 공통점이 있어요.", ja: "済州柑橘の香り豊かな味を生かしたパウンドケーキが한라봉デザートと共通点があります。", en: "Citrus-forward dessert celebrating the fresh, aromatic quality of local oranges — same spirit as hallabong." }
          }
        }
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
        image: "/images/food/돼지국밥.png",
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
          JP: {
            name: { ko: "돈코츠 국물", ja: "豚骨スープ", en: "Tonkotsu Broth Bowl" },
            tasteProfile: { sweet: 10, salty: 65, spicy: 5, umami: 92, sour: 5 },
            description: { ko: "돼지 뼈를 장시간 끓여 만든 진하고 뽀얀 일본식 육수에 밥을 곁들인 한 그릇이에요.", ja: "豚骨を長時間煮込んで作る濃厚で白濁した日本式スープにご飯を添えた一品です。", en: "Thick, milky Japanese pork bone broth served with rice — a rich, restorative bowl." },
            ingredients: { ko: ["돼지뼈", "등뼈", "마늘", "생강", "파", "소금"], ja: ["豚骨", "背骨", "にんにく", "生姜", "ネギ", "塩"], en: ["Pork bones", "Back bones", "Garlic", "Ginger", "Green onion", "Salt"] },
            similarityPercent: 85,
            matchReason: { ko: "돼지 뼈를 푹 끓인 뽀얀 국물에 밥을 말아 먹는 방식이 돼지국밥과 거의 같아요.", ja: "豚骨をじっくり煮込んだ白濁スープにご飯を入れて食べるスタイルが豚スープご飯とほぼ同じです。", en: "Milky pork bone broth with rice — the exact same soul-warming bowl structure as busan doejigukbap." }
          },
          ES: {
            name: { ko: "코시도 마드릴레뇨", ja: "コシード・マドリレーニョ", en: "Cocido Madrileño" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 10, umami: 75, sour: 10 },
            description: { ko: "돼지고기와 병아리콩, 채소를 함께 끓인 마드리드식 돼지고기 스튜예요.", ja: "豚肉とひよこ豆、野菜を一緒に煮込んだマドリード式豚肉シチューです。", en: "Madrid's iconic pork and chickpea stew — a hearty all-day braise." },
            ingredients: { ko: ["돼지고기", "병아리콩", "소시지", "당근", "양배추", "감자"], ja: ["豚肉", "ひよこ豆", "ソーセージ", "人参", "キャベツ", "じゃがいも"], en: ["Pork", "Chickpeas", "Chorizo", "Carrot", "Cabbage", "Potato"] },
            similarityPercent: 72,
            matchReason: { ko: "돼지고기를 뭉근히 끓여 깊은 국물을 만드는 방식이 돼지국밥과 닮았어요.", ja: "豚肉をじっくり煮込んで深いスープを作るスタイルが豚スープご飯に似ています。", en: "Slow-simmered pork in rich broth eaten as a main meal — the same pork broth bowl concept." }
          },
          TH: {
            name: { ko: "무 뚠", ja: "ムートゥン", en: "Moo Toon" },
            tasteProfile: { sweet: 20, salty: 55, spicy: 15, umami: 72, sour: 10 },
            description: { ko: "돼지고기를 간장과 향신료로 장시간 조린 태국식 돼지고기 국물 요리예요.", ja: "豚肉を醤油とスパイスで長時間煮込んだタイ式の豚肉スープ料理です。", en: "Thai slow-braised pork in soy and spices, served in rich broth over rice." },
            ingredients: { ko: ["돼지고기", "간장", "팔각", "계피", "갈랑갈", "고수"], ja: ["豚肉", "醤油", "八角", "シナモン", "ガランガル", "パクチー"], en: ["Pork", "Soy sauce", "Star anise", "Cinnamon", "Galangal", "Cilantro"] },
            similarityPercent: 74,
            matchReason: { ko: "돼지고기를 향신료 육수에 끓여 밥과 함께 먹는 방식이 돼지국밥과 같아요.", ja: "豚肉をスパイスのスープで煮てご飯と一緒に食べるスタイルが豚スープご飯と同じです。", en: "Spiced pork broth served with rice — the same comforting pork soup rice bowl." }
          }
        }
      },
      {
        id: "busan-milmyeon",
        name: { ko: "밀면", ja: "ミルミョン", en: "Milmyeon" },
        region: "busan",
        image: "/images/food/밀면.png",
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
          JP: {
            name: { ko: "모리오카 냉면", ja: "盛岡冷麺", en: "Morioka Cold Noodles" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 30, umami: 65, sour: 30 },
            description: { ko: "쫄깃한 밀가루 면에 차가운 소고기 육수를 부어 먹는 일본 모리오카 스타일 냉면이에요.", ja: "もちもちした小麦麺に冷たい牛骨スープをかけて食べる岩手・盛岡スタイルの冷麺です。", en: "Morioka-style chilled wheat noodles in cold beef bone broth with sliced beef." },
            ingredients: { ko: ["밀가루면", "소고기육수", "배슬라이스", "김치", "반숙계란", "참기름"], ja: ["小麦麺", "牛骨スープ", "梨スライス", "キムチ", "味玉", "ごま油"], en: ["Wheat noodles", "Beef broth", "Pear slices", "Kimchi", "Soft egg", "Sesame oil"] },
            similarityPercent: 85,
            matchReason: { ko: "밀가루 면에 차가운 소고기 육수를 부어 먹는 방식이 밀면과 거의 동일해요.", ja: "小麦麺に冷たい牛骨スープをかけて食べる方式が밀면とほぼ同じです。", en: "Chilled wheat noodles in cold beef broth — the same bowl, different city origin story." }
          },
          VN: {
            name: { ko: "분짜", ja: "ブンチャー", en: "Bun Cha" },
            tasteProfile: { sweet: 25, salty: 45, spicy: 20, umami: 65, sour: 35 },
            description: { ko: "숯불 돼지고기 완자와 쌀국수를 느억맘 소스에 찍어 먹는 하노이 요리예요.", ja: "炭火焼き豚肉のつみれと米麺をヌクマムソースに浸して食べるハノイ料理です。", en: "Hanoi dish of charcoal-grilled pork patties with rice vermicelli dipped in fish sauce broth." },
            ingredients: { ko: ["쌀국수", "돼지고기완자", "느억맘", "설탕", "라임", "고수"], ja: ["ライスヌードル", "豚肉つみれ", "ヌクマム", "砂糖", "ライム", "パクチー"], en: ["Rice vermicelli", "Pork patties", "Fish sauce", "Sugar", "Lime", "Herbs"] },
            similarityPercent: 72,
            matchReason: { ko: "차게 먹는 국수에 고기를 곁들여 소스와 함께 먹는 방식이 밀면과 닮았어요.", ja: "冷たい麺に肉を添えてソースと一緒に食べる方式が밀면に似ています。", en: "Cold noodles with meat in broth-dipping sauce — same refreshing noodle bowl philosophy as milmyeon." }
          },
          CN: {
            name: { ko: "량멘", ja: "涼麺", en: "Liangmian" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 40, umami: 60, sour: 35 },
            description: { ko: "차갑게 식힌 면에 참깨 소스와 마늘, 고추로 만든 드레싱을 얹어 먹는 중국식 냉면이에요.", ja: "冷やした麺にごまソースとにんにく、唐辛子のドレッシングをかけて食べる中国式冷麺です。", en: "Chinese chilled noodles tossed in sesame sauce with garlic, chili, and vinegar." },
            ingredients: { ko: ["면", "참깨소스", "마늘", "고추기름", "식초", "오이채"], ja: ["麺", "ごまソース", "にんにく", "ラー油", "酢", "きゅうり千切り"], en: ["Noodles", "Sesame sauce", "Garlic", "Chili oil", "Vinegar", "Cucumber"] },
            similarityPercent: 74,
            matchReason: { ko: "차갑게 식힌 면에 소스를 얹어 먹는 여름 국수라는 공통점이 밀면과 같아요.", ja: "冷やした麺にソースをかけて食べる夏の麺料理という共通点が밀면と同じです。", en: "Chilled noodles with sauce-based dressing — the same summer cold noodle spirit as milmyeon." }
          }
        }
      },
      {
        id: "busan-hotteok",
        name: { ko: "씨앗호떡", ja: "シアッホットク", en: "Ssiat Hotteok" },
        region: "busan",
        image: "/images/food/씨앗호떡.png",
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
          CN: {
            name: { ko: "젠빙", ja: "煎餅", en: "Jianbing" },
            tasteProfile: { sweet: 15, salty: 50, spicy: 30, umami: 55, sour: 10 },
            description: { ko: "녹두 반죽에 달걀을 얹고 바삭하게 구운 후 소스와 채소를 넣은 중국 길거리 크레페예요.", ja: "緑豆生地に卵をのせてカリカリに焼き、ソースと野菜を入れた中国のストリートクレープです。", en: "Chinese street food crepe made with mung bean batter, egg, and savory fillings." },
            ingredients: { ko: ["녹두가루반죽", "달걀", "춘장", "두반장", "파", "고수"], ja: ["緑豆粉生地", "卵", "甜麺醤", "豆板醤", "ネギ", "パクチー"], en: ["Mung bean batter", "Egg", "Sweet bean paste", "Doubanjiang", "Green onion", "Cilantro"] },
            similarityPercent: 72,
            matchReason: { ko: "기름에 구운 납작한 밀가루 반죽 간식이라는 공통점이 호떡과 닮았어요.", ja: "油で焼いた平たい小麦粉生地のおやつという共通点がホットックに似ています。", en: "Pan-fried flat dough snack — the same street-food dough concept as hotteok." }
          },
          FR: {
            name: { ko: "크레페 쉬제트", ja: "クレープ・シュゼット", en: "Crêpe Suzette" },
            tasteProfile: { sweet: 60, salty: 20, spicy: 0, umami: 20, sour: 25 },
            description: { ko: "오렌지 버터 소스와 그랑 마르니에로 플람베한 프랑스 디저트 크레페예요.", ja: "オレンジバターソースとグランマルニエでフランベしたフランスのデザートクレープです。", en: "French dessert crepe with orange butter sauce, flambéed with Grand Marnier." },
            ingredients: { ko: ["크레페반죽", "버터", "오렌지즙", "설탕", "그랑마르니에"], ja: ["クレープ生地", "バター", "オレンジジュース", "砂糖", "グランマルニエ"], en: ["Crepe batter", "Butter", "Orange juice", "Sugar", "Grand Marnier"] },
            similarityPercent: 68,
            matchReason: { ko: "얇고 달콤한 반죽을 구워 먹는 디저트라는 점이 호떡의 달콤한 식감과 닮았어요.", ja: "薄くて甘い生地を焼いて食べるデザートという点がホットックの甘い食感に似ています。", en: "Sweet pan-fried dough snack — both are warm, indulgent treats with caramelized edges." }
          },
          IN: {
            name: { ko: "굴랍 자문", ja: "グラブ・ジャムン", en: "Gulab Jamun" },
            tasteProfile: { sweet: 90, salty: 5, spicy: 0, umami: 15, sour: 5 },
            description: { ko: "우유 고형분으로 만든 반죽을 기름에 튀겨 장미수 시럽에 절인 인도 디저트예요.", ja: "牛乳固形分で作った生地を油で揚げてローズウォーターシロップに漬けたインドのデザートです。", en: "Indian fried milk-solid dumplings soaked in fragrant rose water syrup." },
            ingredients: { ko: ["마와", "밀가루", "카르다몸", "설탕시럽", "장미수", "기"], ja: ["マワ", "小麦粉", "カルダモン", "砂糖シロップ", "ローズウォーター", "ギー"], en: ["Khoya", "Flour", "Cardamom", "Sugar syrup", "Rose water", "Ghee"] },
            similarityPercent: 62,
            matchReason: { ko: "기름에 튀긴 달콤한 반죽 간식이라는 점에서 호떡과 닮은 달달한 길거리 디저트예요.", ja: "油で揚げた甘い生地のおやつという点でホットックに似た甘いストリートデザートです。", en: "Deep-fried sweet dough soaked in syrup — both are rich, sweet, street-food desserts." }
          }
        }
      },
      {
        id: "busan-mul-tteok",
        name: { ko: "물떡", ja: "ムルトク", en: "Mul-tteok" },
        region: "busan",
        image: "/images/food/물떡.png",
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
          JP: {
            name: { ko: "오뎅 모찌", ja: "おでん餅", en: "Oden Mochi" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 70, sour: 5 },
            description: { ko: "다시마 육수에 떡과 어묵을 함께 끓이는 일본식 오뎅 변형 요리예요.", ja: "だし汁で餅と練り物を一緒に煮込む日本式おでんのアレンジ料理です。", en: "Japanese oden variation with rice cakes and fish cakes in dashi broth." },
            ingredients: { ko: ["가래떡", "어묵", "다시마육수", "간장", "미림", "파"], ja: ["餅", "練り物", "だし汁", "醤油", "みりん", "ネギ"], en: ["Rice cake", "Fish cake", "Dashi broth", "Soy sauce", "Mirin", "Green onion"] },
            similarityPercent: 80,
            matchReason: { ko: "육수에 떡을 넣고 부드럽게 끓여 먹는 방식이 물떡과 매우 닮았어요.", ja: "スープに餅を入れて柔らかく煮て食べる方式が물떡によく似ています。", en: "Rice cake simmered in savory broth until soft — the same gentle, warming concept as mul-tteok." }
          },
          CN: {
            name: { ko: "훠궈 녠가오", ja: "火鍋年糕", en: "Hotpot Niangao" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 60, umami: 65, sour: 5 },
            description: { ko: "매운 훠궈 육수에 가래떡을 넣고 끓여 먹는 중국식 떡 요리예요.", ja: "辛い火鍋スープで餅を煮込んで食べる中国式の餅料理です。", en: "Chinese rice cakes cooked in spicy hot pot broth." },
            ingredients: { ko: ["가래떡", "훠궈육수", "두반장", "고추", "마늘", "참기름"], ja: ["餅", "火鍋スープ", "豆板醤", "唐辛子", "にんにく", "ごま油"], en: ["Rice cake", "Hot pot broth", "Doubanjiang", "Chili", "Garlic", "Sesame oil"] },
            similarityPercent: 76,
            matchReason: { ko: "국물에 떡을 넣고 익혀 먹는 방식이 물떡과 구조적으로 같아요.", ja: "スープに餅を入れて煮て食べる方式が물떡と構造的に同じです。", en: "Rice cake cooked in broth — the same structural concept as mul-tteok, just spicier." }
          },
          MX: { challenge: true }
        }
      },
      {
        id: "busan-naengchae-jokbal",
        name: { ko: "냉채족발", ja: "冷菜チョクパル", en: "Naengchae Jokbal" },
        region: "busan",
        image: "/images/food/냉채족발.png",
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
          CN: {
            name: { ko: "량반러우", ja: "涼拌肉", en: "Liangban Rou" },
            tasteProfile: { sweet: 10, salty: 50, spicy: 40, umami: 65, sour: 30 },
            description: { ko: "삶은 돼지고기를 얇게 썰어 마라 소스와 버무린 중국식 냉채 요리예요.", ja: "茹でた豚肉を薄くスライスして麻辣ソースで和えた中国式の冷菜料理です。", en: "Chinese cold dish of sliced boiled pork tossed in spicy numbing sauce." },
            ingredients: { ko: ["삶은 돼지고기", "마라소스", "오이채", "고수", "마늘", "식초"], ja: ["茹で豚肉", "麻辣ソース", "きゅうり千切り", "パクチー", "にんにく", "酢"], en: ["Boiled pork", "Mala sauce", "Cucumber", "Cilantro", "Garlic", "Vinegar"] },
            similarityPercent: 82,
            matchReason: { ko: "삶은 돼지고기를 차갑게 식혀 소스와 버무린 방식이 냉채족발과 거의 같아요.", ja: "茹でた豚肉を冷やしてソースで和える方式が냉채족발とほぼ同じです。", en: "Chilled boiled pork tossed with sauce — structurally the same cold pork dish as naengchae jokbal." }
          },
          TH: {
            name: { ko: "얌운센", ja: "ヤムウンセン", en: "Yam Woon Sen" },
            tasteProfile: { sweet: 20, salty: 45, spicy: 55, umami: 60, sour: 45 },
            description: { ko: "당면에 새우, 돼지고기, 채소를 넣고 새콤달콤 매운 드레싱으로 버무린 태국 냉채예요.", ja: "春雨にエビ、豚肉、野菜を入れて甘酸っぱ辛いドレッシングで和えたタイの冷菜です。", en: "Thai glass noodle salad with shrimp, pork, and vegetables in spicy-sour dressing." },
            ingredients: { ko: ["당면", "새우", "돼지고기", "느억맘", "라임즙", "고추"], ja: ["春雨", "エビ", "豚肉", "ナンプラー", "ライム汁", "唐辛子"], en: ["Glass noodles", "Shrimp", "Pork", "Fish sauce", "Lime juice", "Chili"] },
            similarityPercent: 74,
            matchReason: { ko: "고기와 면을 차갑게 식혀 소스로 버무린 냉채라는 점이 냉채족발과 닮았어요.", ja: "肉と麺を冷やしてソースで和えた冷菜という点が냉채족발に似ています。", en: "Chilled meat and noodles with tangy dressing — the same refreshing cold dish concept as naengchae jokbal." }
          },
          VN: {
            name: { ko: "돼지고기 냉채", ja: "豚肉冷菜", en: "Vietnamese Cold Pork" },
            tasteProfile: { sweet: 25, salty: 45, spicy: 30, umami: 60, sour: 40 },
            description: { ko: "삶은 돼지고기와 채소를 느억맘 드레싱으로 버무린 베트남식 냉채예요.", ja: "茹でた豚肉と野菜をヌクマムドレッシングで和えたベトナム式冷菜です。", en: "Vietnamese cold pork with herbs and vegetables in fish sauce dressing." },
            ingredients: { ko: ["삶은 돼지고기", "허브", "숙주", "느억맘", "라임", "고추"], ja: ["茹で豚肉", "ハーブ", "もやし", "ヌクマム", "ライム", "唐辛子"], en: ["Boiled pork", "Herbs", "Bean sprouts", "Fish sauce", "Lime", "Chili"] },
            similarityPercent: 70,
            matchReason: { ko: "돼지고기를 차갑게 식혀 상큼한 드레싱과 함께 먹는 방식이 냉채족발과 같아요.", ja: "豚肉を冷やして爽やかなドレッシングと一緒に食べる方式が냉채족발と同じです。", en: "Chilled pork with refreshing dressing — the same cold pork salad spirit as naengchae jokbal." }
          }
        }
      },
      {
        id: "busan-grilled-clams",
        name: { ko: "조개구이", ja: "貝の焼き物", en: "Grilled Clams" },
        region: "busan",
        image: "/images/food/조개구이.png",
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
          JP: {
            name: { ko: "하마야키", ja: "浜焼き", en: "Hamayaki" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 85, sour: 10 },
            description: { ko: "신선한 조개를 숯불이나 철판에 직접 구워 먹는 일본 해안 요리예요.", ja: "新鮮な貝を炭火や鉄板で直火焼きにして食べる日本の浜辺料理です。", en: "Japanese seaside grilled clams cooked directly over charcoal or iron plate." },
            ingredients: { ko: ["조개류", "버터", "간장", "레몬", "파슬리"], ja: ["貝類", "バター", "醤油", "レモン", "パセリ"], en: ["Shellfish", "Butter", "Soy sauce", "Lemon", "Parsley"] },
            similarityPercent: 90,
            matchReason: { ko: "신선한 조개를 불 위에 직접 올려 구워 먹는 방식이 조개구이와 완전히 동일해요.", ja: "新鮮な貝を火の上に直接のせて焼いて食べる方式が조개구이と完全に同じです。", en: "Fresh clams cooked directly over fire — essentially identical to busan jokbal grilled clams." }
          },
          US: {
            name: { ko: "클램 베이크", ja: "クラムベイク", en: "Clam Bake" },
            tasteProfile: { sweet: 15, salty: 60, spicy: 10, umami: 78, sour: 10 },
            description: { ko: "뉴잉글랜드 스타일로 조개와 랍스터, 옥수수를 함께 쪄내는 미국 해산물 파티 요리예요.", ja: "ニューイングランドスタイルで貝とロブスター、コーンを一緒に蒸すアメリカの海鮮パーティー料理です。", en: "New England-style outdoor feast of clams, lobster, and corn steamed together." },
            ingredients: { ko: ["조개", "랍스터", "옥수수", "감자", "버터", "소금"], ja: ["貝", "ロブスター", "コーン", "じゃがいも", "バター", "塩"], en: ["Clams", "Lobster", "Corn", "Potato", "Butter", "Salt"] },
            similarityPercent: 78,
            matchReason: { ko: "조개를 야외에서 열을 가해 신선하게 먹는 방식이 조개구이와 닮았어요.", ja: "貝を屋外で熱して新鮮に食べるスタイルが조개구이に似ています。", en: "Outdoor fresh-cooked clams — the same seaside feast mentality as busan grilled clams." }
          },
          FR: {
            name: { ko: "오븐 조개 구이", ja: "オーブン焼き貝", en: "Moules Marinières" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 5, umami: 80, sour: 20 },
            description: { ko: "화이트 와인과 마늘, 버터로 조개를 찐 프랑스 클래식 조개 요리예요.", ja: "白ワインとにんにく、バターで貝を蒸したフランスの定番貝料理です。", en: "Classic French mussels steamed in white wine, garlic, and butter." },
            ingredients: { ko: ["홍합", "화이트와인", "마늘", "버터", "파슬리", "샬롯"], ja: ["ムール貝", "白ワイン", "にんにく", "バター", "パセリ", "シャロット"], en: ["Mussels", "White wine", "Garlic", "Butter", "Parsley", "Shallot"] },
            similarityPercent: 74,
            matchReason: { ko: "신선한 조개를 가열해 즉석에서 먹는 방식이 조개구이와 같아요.", ja: "新鮮な貝を加熱してすぐに食べるスタイルが조개구이と同じです。", en: "Fresh shellfish cooked in aromatic liquid — the same clean, oceanic flavor as busan grilled clams." }
          }
        }
      },
      {
        id: "busan-eomuk",
        name: { ko: "어묵", ja: "おでん（釜山式）", en: "Busan Eomuk" },
        region: "busan",
        image: "/images/food/어묵.png",
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
          JP: {
            name: { ko: "사츠마아게", ja: "さつま揚げ", en: "Satsuma-age" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 5, umami: 75, sour: 5 },
            description: { ko: "생선살을 갈아 기름에 튀긴 일본 가고시마 지방의 어묵이에요.", ja: "魚のすり身を揚げた鹿児島地方の揚げかまぼこです。", en: "Deep-fried fish paste cake from Kagoshima — Japan's closest cousin to Korean eomuk." },
            ingredients: { ko: ["흰살생선", "전분", "달걀흰자", "설탕", "간장", "기름"], ja: ["白身魚", "でんぷん", "卵白", "砂糖", "醤油", "油"], en: ["White fish", "Starch", "Egg white", "Sugar", "Soy sauce", "Oil"] },
            similarityPercent: 93,
            matchReason: { ko: "생선살을 갈아 튀긴 어묵이라는 기본 구성이 부산 어묵과 완전히 같아요.", ja: "魚のすり身を揚げたかまぼこという基本構成が釜山어묵と全く同じです。", en: "Ground fish paste deep-fried — the recipe is essentially the same as busan eomuk." }
          },
          CN: {
            name: { ko: "위완", ja: "魚丸", en: "Fish Ball" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 10, umami: 72, sour: 5 },
            description: { ko: "생선살을 갈아 동그랗게 빚어 끓인 중국식 생선 완자예요.", ja: "魚のすり身を丸めて煮た中国式魚のつみれです。", en: "Chinese fish balls made from ground fish paste, simmered in broth." },
            ingredients: { ko: ["흰살생선", "전분", "소금", "생강", "파", "참기름"], ja: ["白身魚", "でんぷん", "塩", "生姜", "ネギ", "ごま油"], en: ["White fish", "Starch", "Salt", "Ginger", "Green onion", "Sesame oil"] },
            similarityPercent: 85,
            matchReason: { ko: "생선살을 갈아 가공한 어묵 형태가 부산 어묵과 같아요.", ja: "魚のすり身を加工した練り物の形が釜山어묵と同じです。", en: "Processed ground fish paste product — the same eomuk DNA in ball form." }
          },
          TH: {
            name: { ko: "톳만 쁠라", ja: "トートマンプラー", en: "Tod Mun Pla" },
            tasteProfile: { sweet: 20, salty: 50, spicy: 30, umami: 65, sour: 15 },
            description: { ko: "생선살에 레드 커리 페이스트를 섞어 기름에 튀긴 태국식 생선 전이에요.", ja: "魚のすり身にレッドカレーペーストを混ぜて揚げたタイ式魚の揚げ物です。", en: "Thai fried fish cakes made from fish paste mixed with red curry paste." },
            ingredients: { ko: ["생선살", "레드커리페이스트", "카피르라임잎", "전분", "달걀", "기름"], ja: ["魚のすり身", "レッドカレーペースト", "カフィアライムリーフ", "でんぷん", "卵", "油"], en: ["Fish paste", "Red curry paste", "Kaffir lime leaves", "Starch", "Egg", "Oil"] },
            similarityPercent: 78,
            matchReason: { ko: "생선살을 갈아 기름에 튀긴 방식이 어묵과 같고, 향신료만 달라요.", ja: "魚のすり身を揚げる方式が어묵と同じで、スパイスだけ違います。", en: "Fried fish paste cake — same base technique as eomuk, just with Thai aromatics added." }
          }
        }
      },
      {
        id: "busan-bibim-dangmyeon",
        name: { ko: "비빔당면", ja: "ビビムタンミョン", en: "Bibim Dangmyeon" },
        region: "busan",
        image: "/images/food/비빔당면.png",
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
          CN: {
            name: { ko: "쏸라펀", ja: "酸辣粉", en: "Suan La Fen" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 65, umami: 65, sour: 55 },
            description: { ko: "고구마 당면에 마라 소스를 얹어 새콤달콤 매콤하게 비벼 먹는 충칭식 당면 요리예요.", ja: "サツマイモ春雨に麻辣ソースをかけて甘酸っぱ辛く和えて食べる重慶式春雨料理です。", en: "Chongqing-style glass noodles in spicy-sour mala sauce — addictively tangy and numbing." },
            ingredients: { ko: ["고구마당면", "마라소스", "식초", "간장", "고추기름", "파"], ja: ["さつまいも春雨", "麻辣ソース", "酢", "醤油", "ラー油", "ネギ"], en: ["Sweet potato noodles", "Mala sauce", "Vinegar", "Soy sauce", "Chili oil", "Green onion"] },
            similarityPercent: 88,
            matchReason: { ko: "당면을 새콤달콤 매콤하게 비벼 먹는 방식이 비빔당면과 거의 동일해요.", ja: "春雨を甘酸っぱ辛く和えて食べる方式が비빔당면とほぼ同じです。", en: "Glass noodles tossed in spicy-sour sauce — essentially the same dish as bibim dangmyeon." }
          },
          TH: {
            name: { ko: "팟운센", ja: "パッドウンセン", en: "Pad Woon Sen" },
            tasteProfile: { sweet: 20, salty: 50, spicy: 30, umami: 68, sour: 20 },
            description: { ko: "당면에 새우, 달걀, 채소를 넣고 볶은 태국식 당면 볶음이에요.", ja: "春雨にエビ、卵、野菜を入れて炒めたタイ式春雨炒めです。", en: "Thai stir-fried glass noodles with shrimp, egg, and vegetables." },
            ingredients: { ko: ["당면", "새우", "달걀", "파", "느억맘", "굴소스"], ja: ["春雨", "エビ", "卵", "ネギ", "ナンプラー", "オイスターソース"], en: ["Glass noodles", "Shrimp", "Egg", "Green onion", "Fish sauce", "Oyster sauce"] },
            similarityPercent: 75,
            matchReason: { ko: "당면을 소스에 버무려 먹는 방식이 비빔당면과 닮았어요.", ja: "春雨をソースで和えて食べる方式が비빔당면に似ています。", en: "Glass noodles tossed with savory sauce — the same noodle-in-sauce structure as bibim dangmyeon." }
          },
          ID: {
            name: { ko: "비훈 고랭", ja: "ビーフンゴレン", en: "Bihun Goreng" },
            tasteProfile: { sweet: 20, salty: 55, spicy: 35, umami: 65, sour: 10 },
            description: { ko: "쌀국수를 케찹 마니스와 삼발 소스에 볶은 인도네시아식 볶음 쌀국수예요.", ja: "ビーフンをケチャップマニスとサンバルソースで炒めたインドネシア式焼きビーフンです。", en: "Indonesian fried rice vermicelli in sweet soy and sambal sauce." },
            ingredients: { ko: ["쌀국수", "케찹마니스", "삼발", "달걀", "채소", "새우"], ja: ["ビーフン", "ケチャップマニス", "サンバル", "卵", "野菜", "エビ"], en: ["Rice vermicelli", "Kecap manis", "Sambal", "Egg", "Vegetables", "Shrimp"] },
            similarityPercent: 70,
            matchReason: { ko: "면을 소스에 볶거나 버무려 먹는 방식이 비빔당면과 닮았어요.", ja: "麺をソースで炒めたり和えたりして食べる方式が비빔당면に似ています。", en: "Noodles tossed in sauce-based seasoning — the same saucy noodle concept as bibim dangmyeon." }
          }
        }
      },
      {
        id: "busan-gopchang",
        name: { ko: "양곱창", ja: "ヤンコプチャン", en: "Yang Gopchang" },
        region: "busan",
        image: "/images/food/양곱창.png",
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
          JP: {
            name: { ko: "호르몬 야키", ja: "ホルモン焼き", en: "Horumon Yaki" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 15, umami: 85, sour: 5 },
            description: { ko: "소나 돼지 내장을 철판이나 숯불에 구워 먹는 일본 내장 구이 요리예요.", ja: "牛や豚のホルモンを鉄板や炭火で焼いて食べる日本の内臓焼き料理です。", en: "Japanese grilled beef or pork offal on iron plate or charcoal grill." },
            ingredients: { ko: ["소 내장", "간장", "미림", "마늘", "파", "참기름"], ja: ["牛ホルモン", "醤油", "みりん", "にんにく", "ネギ", "ごま油"], en: ["Beef offal", "Soy sauce", "Mirin", "Garlic", "Green onion", "Sesame oil"] },
            similarityPercent: 90,
            matchReason: { ko: "소 내장을 직화 구이로 먹는 방식이 곱창과 완전히 동일해요.", ja: "牛の内臓を直火焼きで食べる方式がゴプチャンと完全に同じです。", en: "Grilled beef intestines on fire — essentially the same dish as gopchang, just with Japanese seasoning." }
          },
          IT: {
            name: { ko: "란프레도토", ja: "ランプレドット", en: "Lampredotto" },
            tasteProfile: { sweet: 5, salty: 55, spicy: 15, umami: 80, sour: 20 },
            description: { ko: "소 4번째 위를 삶아 토마토와 허브 소스에 곁들인 피렌체 전통 내장 요리예요.", ja: "牛の第四胃を煮てトマトとハーブソースに添えたフィレンツェの伝統的な内臓料理です。", en: "Florentine street food of braised beef tripe in tomato and herb broth." },
            ingredients: { ko: ["소 위", "토마토", "양파", "샐러리", "월계수잎", "파슬리"], ja: ["牛の胃", "トマト", "玉ねぎ", "セロリ", "ローリエ", "パセリ"], en: ["Beef tripe", "Tomato", "Onion", "Celery", "Bay leaf", "Parsley"] },
            similarityPercent: 74,
            matchReason: { ko: "소 내장을 요리해 풍부한 감칠맛을 즐기는 방식이 곱창과 닮았어요.", ja: "牛の内臓を調理して豊かな旨味を楽しむ方式がゴプチャンに似ています。", en: "Braised beef offal with intense umami — the same love of inner cuts as gopchang." }
          },
          MX: {
            name: { ko: "타코 데 트리파", ja: "タコス・デ・トリパ", en: "Taco de Tripa" },
            tasteProfile: { sweet: 5, salty: 55, spicy: 40, umami: 78, sour: 25 },
            description: { ko: "소 대장을 기름에 바삭하게 구워 토르티야에 싸 먹는 멕시코 내장 타코예요.", ja: "牛の大腸をカリカリに揚げてトルティーヤで包んで食べるメキシコの内臓タコスです。", en: "Mexican taco with crispy fried beef intestines in a corn tortilla." },
            ingredients: { ko: ["소 대장", "옥수수토르티야", "살사", "양파", "고수", "라임"], ja: ["牛の大腸", "コーントルティーヤ", "サルサ", "玉ねぎ", "パクチー", "ライム"], en: ["Beef intestines", "Corn tortilla", "Salsa", "Onion", "Cilantro", "Lime"] },
            similarityPercent: 72,
            matchReason: { ko: "소 대장을 바삭하게 구워 먹는 방식이 곱창 구이와 닮았어요.", ja: "牛の大腸をカリカリに焼いて食べる方式がゴプチャン焼きに似ています。", en: "Crispy grilled beef intestines — the same offal appreciation as gopchang, wrapped in a tortilla." }
          }
        }
      },
      {
        id: "busan-nakgopsae",
        name: { ko: "낙곱새", ja: "ナクコプセ", en: "Nakgopsae" },
        region: "busan",
        image: "/images/food/낙곱새.png",
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
          JP: {
            name: { ko: "해산물 모츠 나베", ja: "海鮮もつ鍋", en: "Seafood Motsu Nabe" },
            tasteProfile: { sweet: 10, salty: 55, spicy: 20, umami: 88, sour: 5 },
            description: { ko: "낙지와 내장, 해산물을 된장 또는 간장 육수에 넣고 끓이는 일본 내장 냄비예요.", ja: "タコと内臓、海鮮を味噌または醤油のスープで煮込む日本の内臓鍋です。", en: "Japanese hot pot with octopus, offal, and seafood in miso or soy broth." },
            ingredients: { ko: ["낙지", "소 내장", "배추", "부추", "두부", "된장육수"], ja: ["タコ", "牛ホルモン", "白菜", "ニラ", "豆腐", "味噌スープ"], en: ["Octopus", "Beef offal", "Cabbage", "Garlic chives", "Tofu", "Miso broth"] },
            similarityPercent: 88,
            matchReason: { ko: "낙지와 곱창, 새우를 함께 매운 국물에 끓이는 방식이 낙곱새와 거의 동일해요.", ja: "タコとホルモン、エビを一緒に辛いスープで煮込む方式が낙곱새とほぼ同じです。", en: "Octopus, offal, and seafood together in hot broth — the same mixed hot pot concept as nakgopsae." }
          },
          ES: {
            name: { ko: "카수엘라 데 마리스코", ja: "カスエラ・デ・マリスコ", en: "Cazuela de Mariscos" },
            tasteProfile: { sweet: 15, salty: 55, spicy: 25, umami: 80, sour: 20 },
            description: { ko: "다양한 해산물과 내장을 토마토 소스에 끓인 스페인 해산물 뚝배기예요.", ja: "様々な海鮮と内臓をトマトソースで煮込んだスペインの海鮮鍋です。", en: "Spanish clay pot with mixed seafood and offal in tomato-based sauce." },
            ingredients: { ko: ["낙지", "새우", "조개", "토마토", "마늘", "올리브오일"], ja: ["タコ", "エビ", "貝", "トマト", "にんにく", "オリーブオイル"], en: ["Octopus", "Shrimp", "Clams", "Tomato", "Garlic", "Olive oil"] },
            similarityPercent: 76,
            matchReason: { ko: "다양한 해산물을 한 냄비에 넣고 끓이는 방식이 낙곱새와 닮았어요.", ja: "様々な海鮮を一つの鍋で煮込む方式が낙곱새に似ています。", en: "Mixed seafood in one spicy pot — the same mixed-ingredient hot pot energy as nakgopsae." }
          },
          US: {
            name: { ko: "케이준 보일", ja: "ケイジャンボイル", en: "Cajun Boil" },
            tasteProfile: { sweet: 10, salty: 60, spicy: 65, umami: 75, sour: 15 },
            description: { ko: "새우, 게, 옥수수, 소시지를 케이준 향신료에 넣고 한꺼번에 끓인 루이지애나 요리예요.", ja: "エビ、カニ、コーン、ソーセージをケイジャンスパイスで一緒に煮込んだルイジアナ料理です。", en: "Louisiana seafood boil with shrimp, crab, corn, and sausage in spicy Cajun seasoning." },
            ingredients: { ko: ["새우", "게", "옥수수", "소시지", "케이준향신료", "버터"], ja: ["エビ", "カニ", "コーン", "ソーセージ", "ケイジャンスパイス", "バター"], en: ["Shrimp", "Crab", "Corn", "Sausage", "Cajun spice", "Butter"] },
            similarityPercent: 74,
            matchReason: { ko: "해산물과 다양한 재료를 한꺼번에 매운 양념에 넣고 끓이는 방식이 낙곱새와 닮았어요.", ja: "海鮮と様々な食材を一緒に辛い調味料で煮込む方式が낙곱새に似ています。", en: "Everything dumped in one spicy pot — the same chaotic, generous, all-in approach as nakgopsae." }
          }
        }
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
        image: "/images/food/황남빵.png",
        tasteProfile: { sweet: 70, salty: 15, spicy: 0, umami: 20, sour: 5 },
        storyDescription: {
          ko: "경주를 대표하는 100년 전통의 팥소 빵이에요. 얇고 바삭한 밀가루 껍질 안에 달콤한 팥소가 가득 차 있어, 한 입 베어 물면 경주의 천년 역사가 입 안에서 녹아드는 것 같아요.",
          ja: "慶州を代表する100年の伝統を持つ餡入りパンです。薄くてサクサクした小麦粉の皮の中に甘い小豆餡がたっぷり詰まっていて、一口かじると慶州の千年の歴史が口の中で溶けていくようです。",
          en: "Gyeongju's iconic 100-year-old red bean bread. The thin, crispy wheat shell hides a generous filling of sweet red bean paste — one bite and Gyeongju's millennium of history melts in your mouth."
        },
        ingredients: { ko: ["밀가루", "팥", "설탕", "버터", "달걀", "소금"], ja: ["小麦粉", "小豆", "砂糖", "バター", "卵", "塩"], en: ["Wheat flour", "Red beans", "Sugar", "Butter", "Egg", "Salt"] },
        tags: ["전통", "팥", "간식"],
                dupes: {
          JP: {
            name: { ko: "쿠로만주", ja: "黒まんじゅう", en: "Kuro Manju" },
            tasteProfile: { sweet: 75, salty: 5, spicy: 0, umami: 10, sour: 0 },
            description: { ko: "검은깨 앙금을 넣은 일본식 만두과자", ja: "黒ごまあんを詰めた和菓子", en: "Japanese sweet bun with black sesame paste" },
            ingredients: { ko: ["밀가루", "흑설탕", "흑깨 앙금", "계란"], ja: ["小麦粉", "黒砂糖", "黒ごまあん", "卵"], en: ["wheat flour", "brown sugar", "black sesame paste", "egg"] },
            similarityPercent: 88,
            matchReason: { ko: "팥 또는 흑깨 앙금을 밀가루 반죽으로 싼 구운 과자로 황남빵과 구조가 동일합니다.", ja: "あんこまたは黒ごまあんを生地で包んで焼いた和菓子で、構造が同じです。", en: "Baked wheat pastry filled with red bean or black sesame paste, structurally identical to Hwangnam-ppang." }
          },
          CN: {
            name: { ko: "더우사바오", ja: "豆沙包", en: "Dousha Bao" },
            tasteProfile: { sweet: 70, salty: 5, spicy: 0, umami: 8, sour: 0 },
            description: { ko: "팥소를 넣은 중국식 찐빵", ja: "小豆あんを詰めた中華蒸しパン", en: "Chinese steamed bun filled with red bean paste" },
            ingredients: { ko: ["밀가루", "팥앙금", "설탕", "이스트"], ja: ["小麦粉", "小豆あん", "砂糖", "酵母"], en: ["wheat flour", "red bean paste", "sugar", "yeast"] },
            similarityPercent: 82,
            matchReason: { ko: "팥앙금을 밀가루 반죽으로 감싸 익힌 점에서 황남빵과 닮았으나 찌는 방식이 다릅니다.", ja: "小豆あんを包んだ点では同じですが、蒸す製法が異なります。", en: "Both wrap red bean paste in dough, though dousha bao is steamed while Hwangnam-ppang is baked." }
          },
          US: {
            name: { ko: "레드빈 페이스트리", ja: "レッドビーンペストリー", en: "Red Bean Pastry" },
            tasteProfile: { sweet: 72, salty: 8, spicy: 0, umami: 5, sour: 2 },
            description: { ko: "팥앙금을 넣은 미국식 퍼프 페이스트리", ja: "小豆あんを入れたアメリカ風パイ生地菓子", en: "American-style puff pastry filled with red bean paste" },
            ingredients: { ko: ["파이 반죽", "팥앙금", "버터", "설탕"], ja: ["パイ生地", "小豆あん", "バター", "砂糖"], en: ["puff pastry", "red bean paste", "butter", "sugar"] },
            similarityPercent: 75,
            matchReason: { ko: "팥앙금을 페이스트리 반죽으로 싸 구운 점에서 황남빵과 유사하지만 버터 풍미가 강합니다.", ja: "あんをパイ生地で包んで焼く点で似ていますが、バター風味が強いです。", en: "Both bake red bean paste in a dough shell, but the American version uses butter-rich puff pastry." }
          }
        }
      },
      {
        id: "gyeongju-gyori-gimbap",
        name: { ko: "교리김밥", ja: "キョリキンパ", en: "Gyori Gimbap" },
        region: "gyeongju",
        image: "/images/food/교리김밥.png",
        tasteProfile: { sweet: 20, salty: 55, spicy: 10, umami: 65, sour: 10 },
        storyDescription: {
          ko: "경주 교리에서 시작된 수제 김밥이에요. 통통하게 들어찬 속재료와 도톰하게 자른 단면이 마치 보석 단면처럼 예뻐서, 먹기 아까울 만큼 눈도 즐겁게 해준답니다.",
          ja: "慶州の教里から始まった手作りキンパです。ぎっしり詰まった具材と厚めに切った断面が、まるで宝石の断面のように美しくて、食べるのがもったいないほど目も楽しませてくれます。",
          en: "Handcrafted gimbap originating from Gyori village in Gyeongju. The plump fillings and thick-cut cross-section are as beautiful as a jewel's facet — almost too pretty to eat."
        },
        ingredients: { ko: ["밥", "김", "시금치", "계란", "당근", "우엉", "어묵", "참기름"], ja: ["ご飯", "のり", "ほうれん草", "卵", "人参", "ごぼう", "練り物", "ごま油"], en: ["Rice", "Seaweed", "Spinach", "Egg", "Carrot", "Burdock", "Fish cake", "Sesame oil"] },
        tags: ["김밥", "도시락", "수제"],
                dupes: {
          JP: {
            name: { ko: "타마고야키마키", ja: "卵焼き巻き", en: "Tamagoyaki Maki" },
            tasteProfile: { sweet: 20, salty: 40, spicy: 0, umami: 55, sour: 5 },
            description: { ko: "달걀구이를 밥에 얹어 김으로 싼 일본식 롤", ja: "だし巻き卵を乗せた海苔巻き", en: "Japanese seaweed roll topped with rolled omelette" },
            ingredients: { ko: ["밥", "김", "달걀", "간장", "설탕"], ja: ["ご飯", "海苔", "卵", "醤油", "砂糖"], en: ["rice", "seaweed", "egg", "soy sauce", "sugar"] },
            similarityPercent: 85,
            matchReason: { ko: "달걀이 들어간 김밥으로 교리김밥과 맛 구조가 매우 유사합니다.", ja: "卵入りの海苔巻きで、風味の構造が非常に似ています。", en: "Both are egg-filled seaweed rice rolls with a very similar flavor structure." }
          },
          US: {
            name: { ko: "에그 샐러드 롤", ja: "エッグサラダロール", en: "Egg Salad Roll" },
            tasteProfile: { sweet: 10, salty: 35, spicy: 5, umami: 40, sour: 15 },
            description: { ko: "삶은 달걀 샐러드를 넣은 랩 롤", ja: "ゆで卵サラダを包んだラップロール", en: "Wrap roll filled with boiled egg salad" },
            ingredients: { ko: ["토르티야", "삶은 달걀", "마요네즈", "양상추", "겨자"], ja: ["トルティーヤ", "ゆで卵", "マヨネーズ", "レタス", "マスタード"], en: ["tortilla", "boiled egg", "mayonnaise", "lettuce", "mustard"] },
            similarityPercent: 72,
            matchReason: { ko: "달걀을 중심 재료로 한 롤 음식으로 교리김밥과 유사하나 마요네즈 드레싱이 특징입니다.", ja: "卵をメインにしたロール料理ですが、マヨネーズドレッシングが特徴です。", en: "Both are egg-centric rolls, but the egg salad roll uses mayo dressing instead of plain rice." }
          },
          ES: {
            name: { ko: "토르티야 롤", ja: "トルティーヤロール", en: "Tortilla Roll" },
            tasteProfile: { sweet: 5, salty: 38, spicy: 10, umami: 35, sour: 8 },
            description: { ko: "달걀과 채소를 채운 스페인식 토르티야 롤", ja: "卵と野菜を詰めたスペイン風トルティーヤロール", en: "Spanish-style tortilla roll filled with egg and vegetables" },
            ingredients: { ko: ["토르티야", "달걀", "감자", "양파", "올리브오일"], ja: ["トルティーヤ", "卵", "じゃがいも", "玉ねぎ", "オリーブオイル"], en: ["tortilla", "egg", "potato", "onion", "olive oil"] },
            similarityPercent: 68,
            matchReason: { ko: "달걀과 채소를 얇은 시트로 말아 만든 점에서 교리김밥과 유사합니다.", ja: "卵と野菜を薄いシートで巻いた点が似ています。", en: "Both roll egg and vegetables in a thin sheet, though the Spanish version uses flour tortilla instead of seaweed." }
          }
        }
      },
      {
        id: "gyeongju-tteokgalbi",
        name: { ko: "경주 떡갈비", ja: "慶州トッカルビ", en: "Gyeongju Tteokgalbi" },
        region: "gyeongju",
        image: "/images/food/떡갈비.png",
        tasteProfile: { sweet: 50, salty: 55, spicy: 10, umami: 75, sour: 5 },
        storyDescription: {
          ko: "갈비살을 곱게 다져 달콤짭짤한 양념을 입혀 구워낸 요리예요. 겉은 살짝 카라멜화되어 반짝이고, 안은 촉촉하게 촉촉해서 입에서 사르르 녹는 황금빛 패티랍니다.",
          ja: "カルビ肉を細かく刻んで甘辛いタレを纏わせて焼き上げた料理です。外はわずかにカラメリゼされてツヤツヤ光り、中はしっとり柔らかく口の中でとろける黄金色のパティです。",
          en: "Finely minced rib meat coated in sweet-savory marinade and grilled. The exterior caramelizes to a glossy sheen while the inside stays juicy and tender — a golden patty that melts on your tongue."
        },
        ingredients: { ko: ["소갈비살", "간장", "배", "마늘", "참기름", "설탕", "파"], ja: ["牛カルビ肉", "醤油", "梨", "ニンニク", "ごま油", "砂糖", "ネギ"], en: ["Beef rib meat", "Soy sauce", "Korean pear", "Garlic", "Sesame oil", "Sugar", "Green onion"] },
        tags: ["고기", "달콤", "구이"],
                dupes: {
          JP: {
            name: { ko: "와후 햄버그스테이크", ja: "和風ハンバーグステーキ", en: "Wafu Hamburg Steak" },
            tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 75, sour: 5 },
            description: { ko: "간장·미림 글레이즈로 마무리한 일본식 다진고기 스테이크", ja: "醤油・みりんでグレーズした和風ハンバーグ", en: "Japanese ground meat patty finished with soy-mirin glaze" },
            ingredients: { ko: ["다진 소고기", "양파", "달걀", "간장", "미림", "빵가루"], ja: ["合いびき肉", "玉ねぎ", "卵", "醤油", "みりん", "パン粉"], en: ["ground beef", "onion", "egg", "soy sauce", "mirin", "breadcrumbs"] },
            similarityPercent: 90,
            matchReason: { ko: "다진 고기를 반죽해 구운 후 달콤짭짤한 글레이즈를 입힌 구조가 떡갈비와 거의 동일합니다.", ja: "ひき肉を捏ねて焼き、甘辛グレーズを絡めた構造が떡갈비とほぼ同じです。", en: "Ground meat patty grilled and glazed with sweet-savory sauce — nearly identical structure to tteokgalbi." }
          },
          US: {
            name: { ko: "미트로프", ja: "ミートローフ", en: "Meatloaf" },
            tasteProfile: { sweet: 20, salty: 42, spicy: 8, umami: 68, sour: 5 },
            description: { ko: "다진 고기를 빵틀에 구운 미국식 덩어리 고기 요리", ja: "型で焼いたアメリカ風ひき肉料理", en: "American loaf-shaped dish made of ground meat baked in a pan" },
            ingredients: { ko: ["다진 소고기", "달걀", "빵가루", "케첩", "양파", "마늘"], ja: ["ひき肉", "卵", "パン粉", "ケチャップ", "玉ねぎ", "にんにく"], en: ["ground beef", "egg", "breadcrumbs", "ketchup", "onion", "garlic"] },
            similarityPercent: 80,
            matchReason: { ko: "다진 고기에 결합제를 넣고 구운 점에서 떡갈비와 유사하나 형태와 소스가 다릅니다.", ja: "ひき肉をつなぎで固めて焼く点が似ていますが、形とソースが異なります。", en: "Both bind and bake ground meat, but meatloaf is a loaf shape with ketchup glaze rather than grilled patties." }
          },
          IT: {
            name: { ko: "폴페테", ja: "ポルペッテ", en: "Polpette" },
            tasteProfile: { sweet: 10, salty: 40, spicy: 5, umami: 70, sour: 15 },
            description: { ko: "토마토소스에 익힌 이탈리아식 고기완자", ja: "トマトソースで煮込んだイタリア風肉団子", en: "Italian meatballs simmered in tomato sauce" },
            ingredients: { ko: ["다진 소고기", "파르메산", "달걀", "빵가루", "토마토소스", "마늘"], ja: ["ひき肉", "パルメザン", "卵", "パン粉", "トマトソース", "にんにく"], en: ["ground beef", "parmesan", "egg", "breadcrumbs", "tomato sauce", "garlic"] },
            similarityPercent: 75,
            matchReason: { ko: "다진 고기를 둥글게 빚어 소스에 익힌 점에서 떡갈비와 형태가 유사하나 소스가 토마토 기반입니다.", ja: "ひき肉を丸めてソースで煮た点は似ていますが、ソースがトマトベースです。", en: "Both shape ground meat and cook in sauce, but polpette uses tomato sauce while tteokgalbi uses soy-based glaze." }
          }
        }
      },
      {
        id: "gyeongju-hanwoo-mulhoe",
        name: { ko: "한우 물회", ja: "韓牛ムルフェ", en: "Hanwoo Mulhoe" },
        region: "gyeongju",
        image: "/images/food/한우물회.png",
        tasteProfile: { sweet: 25, salty: 45, spicy: 55, umami: 70, sour: 40 },
        storyDescription: {
          ko: "신선한 한우 육회를 얼음처럼 차가운 육수에 담가 먹는 경주만의 별미예요. 상큼하게 새콤달콤한 국물과 쫄깃한 육회의 만남이 더운 여름날 혀를 상쾌하게 깨워준답니다.",
          ja: "新鮮な韓牛のユッケを氷のように冷たいスープに浸して食べる慶州ならではの珍味です。爽やかな甘酸っぱいスープとコシのあるユッケの出会いが、暑い夏の日に舌を爽やかに目覚めさせてくれます。",
          en: "Fresh raw Korean beef immersed in ice-cold broth — a Gyeongju specialty. The tangy, sweet-and-sour soup paired with chewy raw beef wakes up your palate on a sweltering summer day."
        },
        ingredients: { ko: ["한우 육회", "오이", "배", "고추장", "식초", "설탕", "얼음"], ja: ["韓牛ユッケ", "きゅうり", "梨", "コチュジャン", "酢", "砂糖", "氷"], en: ["Raw Korean beef", "Cucumber", "Korean pear", "Gochujang", "Vinegar", "Sugar", "Ice"] },
        tags: ["육회", "차가움", "여름"],
                dupes: {
          JP: {
            name: { ko: "규타타키 냉채", ja: "牛たたき冷菜", en: "Beef Tataki Cold Dish" },
            tasteProfile: { sweet: 10, salty: 38, spicy: 5, umami: 65, sour: 25 },
            description: { ko: "살짝 구운 소고기를 얼음물에 식혀 폰즈 소스로 낸 냉채", ja: "表面を炙った牛肉を氷水で締めてポン酢で和えた冷菜", en: "Lightly seared beef chilled in ice water and dressed with ponzu sauce" },
            ingredients: { ko: ["소고기", "폰즈", "무순", "양파", "생강"], ja: ["牛肉", "ポン酢", "かいわれ", "玉ねぎ", "生姜"], en: ["beef", "ponzu sauce", "radish sprouts", "onion", "ginger"] },
            similarityPercent: 85,
            matchReason: { ko: "차갑게 제공되는 소고기 요리로 신선한 채소와 산미 소스를 곁들이는 점이 한우물회와 유사합니다.", ja: "冷たく提供される牛肉料理で、野菜と酸味ソースを添える点が韓牛물회に似ています。", en: "Both are cold beef dishes served with fresh vegetables and an acidic sauce." }
          },
          ES: {
            name: { ko: "비프 가스파초", ja: "ビーフガスパチョ", en: "Beef Gazpacho" },
            tasteProfile: { sweet: 15, salty: 35, spicy: 8, umami: 50, sour: 35 },
            description: { ko: "차가운 토마토 육수에 얇게 썬 소고기를 넣은 스페인식 냉채", ja: "冷たいトマトスープに薄切り牛肉を加えたスペイン風冷菜", en: "Spanish cold dish with thinly sliced beef in chilled tomato broth" },
            ingredients: { ko: ["소고기", "토마토", "오이", "피망", "올리브오일", "식초"], ja: ["牛肉", "トマト", "きゅうり", "ピーマン", "オリーブオイル", "酢"], en: ["beef", "tomato", "cucumber", "bell pepper", "olive oil", "vinegar"] },
            similarityPercent: 72,
            matchReason: { ko: "차가운 국물에 소고기와 채소를 함께 담아내는 방식이 한우물회와 유사합니다.", ja: "冷たいスープに牛肉と野菜を合わせる点が韓牛물회に似ています。", en: "Both present cold beef with vegetables in a chilled savory broth with an acidic component." }
          },
          MX: {
            name: { ko: "비프 세비체", ja: "ビーフセビーチェ", en: "Beef Ceviche" },
            tasteProfile: { sweet: 10, salty: 30, spicy: 20, umami: 45, sour: 45 },
            description: { ko: "라임즙에 재운 소고기와 채소를 차갑게 낸 멕시코식 냉채", ja: "ライムジュースでマリネした牛肉と野菜の冷菜", en: "Mexican cold dish of lime-marinated beef with vegetables" },
            ingredients: { ko: ["소고기", "라임즙", "고수", "양파", "할라페뇨", "토마토"], ja: ["牛肉", "ライムジュース", "コリアンダー", "玉ねぎ", "ハラペーニョ", "トマト"], en: ["beef", "lime juice", "cilantro", "onion", "jalapeño", "tomato"] },
            similarityPercent: 68,
            matchReason: { ko: "산미 강한 마리네이드에 소고기와 채소를 버무린 냉채라는 점에서 한우물회와 유사합니다.", ja: "酸味の強いマリネで牛肉と野菜を合わせた冷菜という点が似ています。", en: "Both are cold beef-and-vegetable dishes with a strong acidic marinade, though ceviche uses citrus rather than vinegar." }
          }
        }
      },
      {
        id: "gyeongju-ssambap",
        name: { ko: "쌈밥 정식", ja: "サムバプ定食", en: "Ssambap Set" },
        region: "gyeongju",
        image: "/images/food/쌈밥정식.png",
        tasteProfile: { sweet: 20, salty: 45, spicy: 40, umami: 65, sour: 15 },
        storyDescription: {
          ko: "신선한 채소잎에 밥 한 숟갈과 고기, 쌈장을 올려 손 안에 꼭 쥐고 한 입에 먹는 즐거움이 있어요. 입 안에서 채소의 신선함과 고기의 풍미, 쌈장의 깊은 맛이 한꺼번에 어우러지는 게 이 맛의 묘미랍니다.",
          ja: "新鮮な葉野菜にご飯一さじとお肉、サムジャンを乗せて手の中にぎゅっと包んで一口で食べる楽しさがあります。口の中で野菜の新鮮さと肉の旨味、サムジャンの深い味わいが一度に溶け合うのがこの料理の醍醐味です。",
          en: "Fresh leafy vegetables wrapped around a spoonful of rice, meat, and savory ssamjang — all squeezed into one perfect bite. The burst of freshness, rich meat flavor, and deep-fermented paste is the magic of ssam."
        },
        ingredients: { ko: ["상추", "깻잎", "쌈장", "밥", "삼겹살", "마늘", "고추"], ja: ["サンチュ", "エゴマの葉", "サムジャン", "ご飯", "豚バラ", "ニンニク", "唐辛子"], en: ["Lettuce", "Perilla leaves", "Ssamjang", "Rice", "Pork belly", "Garlic", "Green pepper"] },
        tags: ["채소", "쌈", "정식"],
                dupes: {
          VN: {
            name: { ko: "반 꾸온", ja: "バインクオン", en: "Bánh Cuốn" },
            tasteProfile: { sweet: 10, salty: 38, spicy: 8, umami: 50, sour: 12 },
            description: { ko: "라이스페이퍼에 돼지고기와 채소를 싸 먹는 베트남 쌈", ja: "ライスペーパーに豚肉と野菜を包むベトナム風包み料理", en: "Vietnamese wrap of steamed rice paper with pork and vegetables" },
            ingredients: { ko: ["라이스페이퍼", "돼지고기", "버섯", "채소", "피시소스"], ja: ["ライスペーパー", "豚肉", "きのこ", "野菜", "ナンプラー"], en: ["rice paper", "pork", "mushroom", "vegetables", "fish sauce"] },
            similarityPercent: 88,
            matchReason: { ko: "얇은 시트에 고기와 채소를 싸서 소스에 찍어 먹는 방식이 쌈밥과 매우 유사합니다.", ja: "薄いシートに肉と野菜を包んでソースで食べる方式が쌈밥に非常に似ています。", en: "Both wrap meat and vegetables in a thin sheet and dip in sauce — the core eating method is identical." }
          },
          MX: {
            name: { ko: "파히타", ja: "ファヒータ", en: "Fajita" },
            tasteProfile: { sweet: 10, salty: 35, spicy: 25, umami: 55, sour: 10 },
            description: { ko: "구운 고기와 채소를 토르티야에 싸 먹는 멕시코 요리", ja: "焼いた肉と野菜をトルティーヤで包むメキシコ料理", en: "Mexican dish of grilled meat and vegetables wrapped in tortilla" },
            ingredients: { ko: ["소고기", "피망", "양파", "토르티야", "살사소스", "라임"], ja: ["牛肉", "ピーマン", "玉ねぎ", "トルティーヤ", "サルサ", "ライム"], en: ["beef", "bell pepper", "onion", "tortilla", "salsa", "lime"] },
            similarityPercent: 82,
            matchReason: { ko: "구운 고기와 채소를 얇은 시트에 싸 먹는 방식이 쌈밥과 동일한 개념입니다.", ja: "焼いた肉と野菜を薄いシートで包む方式が쌈밥と同じコンセプトです。", en: "Wrapping grilled meat and vegetables in a thin edible sheet — same concept as ssambap, different ingredients." }
          },
          JP: {
            name: { ko: "야채 쌈", ja: "野菜包み", en: "Yasai Tsutumi" },
            tasteProfile: { sweet: 8, salty: 40, spicy: 10, umami: 45, sour: 5 },
            description: { ko: "상추나 깻잎에 밥과 재료를 싸 먹는 일본식 쌈 요리", ja: "レタスや大葉にご飯と具材を包む日本風包み料理", en: "Japanese wrap using lettuce or perilla to envelop rice and fillings" },
            ingredients: { ko: ["상추", "밥", "된장", "파", "깨", "참기름"], ja: ["レタス", "ご飯", "味噌", "ねぎ", "ごま", "ごま油"], en: ["lettuce", "rice", "miso", "green onion", "sesame", "sesame oil"] },
            similarityPercent: 78,
            matchReason: { ko: "잎채소에 밥과 된장·채소를 싸 먹는 방식이 쌈밥과 동일합니다.", ja: "葉野菜にご飯と味噌・野菜を包む方式が쌈밥と同じです。", en: "Both wrap rice and seasonings in leaf vegetables — the same core eating tradition." }
          }
        }
      },
      {
        id: "gyeongju-sundubu",
        name: { ko: "순두부찌개", ja: "スンドゥブチゲ", en: "Sundubu Jjigae" },
        region: "gyeongju",
        image: "/images/food/순두부찌개.png",
        tasteProfile: { sweet: 10, salty: 50, spicy: 65, umami: 75, sour: 10 },
        storyDescription: {
          ko: "보글보글 끓는 뚝배기 속에서 하얀 순두부가 매콤한 국물을 흠뻑 머금고 있어요. 부드럽고 연한 두부 한 숟갈이 입 안에 들어오는 순간, 따뜻한 포근함이 온몸으로 퍼져나간답니다.",
          ja: "ぐつぐつ煮えているトゥクベギの中で、白い純豆腐が辛いスープをたっぷり含んでいます。柔らかくなめらかな豆腐を一さじ口に運んだ瞬間、温かいぬくもりが体中に広がります。",
          en: "Silky soft tofu bubbles in a fiery red broth inside a sizzling stone pot. The moment that one tender spoonful of tofu hits your mouth, warmth radiates through your entire body."
        },
        ingredients: { ko: ["순두부", "고춧가루", "바지락", "돼지고기", "계란", "파", "참기름"], ja: ["純豆腐", "唐辛子粉", "アサリ", "豚肉", "卵", "ネギ", "ごま油"], en: ["Soft tofu", "Red pepper powder", "Clams", "Pork", "Egg", "Green onion", "Sesame oil"] },
        tags: ["두부", "매콤", "뚝배기"],
                dupes: {
          CN: {
            name: { ko: "마파두부탕", ja: "麻婆豆腐スープ", en: "Mapo Tofu Soup" },
            tasteProfile: { sweet: 5, salty: 45, spicy: 65, umami: 70, sour: 5 },
            description: { ko: "두반장과 화자오로 만든 매콤한 중국식 두부 수프", ja: "豆板醤と花椒で作る辛い中国風豆腐スープ", en: "Spicy Chinese tofu soup made with doubanjiang and Sichuan pepper" },
            ingredients: { ko: ["두부", "두반장", "화자오", "돼지고기", "마늘", "파"], ja: ["豆腐", "豆板醤", "花椒", "豚ひき肉", "にんにく", "ねぎ"], en: ["tofu", "doubanjiang", "Sichuan pepper", "ground pork", "garlic", "scallion"] },
            similarityPercent: 85,
            matchReason: { ko: "부드러운 두부를 매운 육수에 끓인 국물 요리로 순두부찌개와 매우 유사합니다.", ja: "柔らかい豆腐を辛いスープで煮た鍋料理で、순두부찌개に非常に似ています。", en: "Both are spicy tofu stew dishes — soft tofu simmered in a fiery broth with aromatics." }
          },
          TH: {
            name: { ko: "똠얌 무사부", ja: "トムヤムムーサブ", en: "Tom Yum Moo Saap" },
            tasteProfile: { sweet: 8, salty: 42, spicy: 60, umami: 62, sour: 35 },
            description: { ko: "타마린드와 고추로 만든 매새콤한 태국 두부 수프", ja: "タマリンドと唐辛子で作る酸辛タイ豆腐スープ", en: "Thai spicy-sour tofu soup with tamarind and chili" },
            ingredients: { ko: ["두부", "레몬그라스", "카피르라임잎", "고추", "타마린드", "코코넛밀크"], ja: ["豆腐", "レモングラス", "コブミカンの葉", "唐辛子", "タマリンド", "ココナッツミルク"], en: ["tofu", "lemongrass", "kaffir lime leaf", "chili", "tamarind", "coconut milk"] },
            similarityPercent: 78,
            matchReason: { ko: "두부와 향신료를 넣어 끓인 매운 국물 요리로 순두부찌개와 맛 계열이 유사합니다.", ja: "豆腐と香辛料を煮込んだ辛いスープ料理で、風味の系統が似ています。", en: "Both are spicy tofu-based soups with bold aromatics, though tom yum adds a sour dimension." }
          },
          JP: {
            name: { ko: "두부나베", ja: "豆腐鍋", en: "Tofu Nabe" },
            tasteProfile: { sweet: 10, salty: 40, spicy: 15, umami: 60, sour: 5 },
            description: { ko: "부드러운 두부를 다시마 육수에 끓인 일본식 전골", ja: "柔らかい豆腐を昆布だしで煮た日本風鍋", en: "Japanese hot pot with silken tofu simmered in kombu dashi" },
            ingredients: { ko: ["두부", "다시마", "가다랑어포", "미소", "파", "버섯"], ja: ["豆腐", "昆布", "かつお節", "味噌", "ねぎ", "きのこ"], en: ["tofu", "kombu", "bonito flakes", "miso", "scallion", "mushroom"] },
            similarityPercent: 80,
            matchReason: { ko: "부드러운 두부를 뜨거운 육수에 담가 먹는 방식이 순두부찌개와 유사합니다.", ja: "柔らかい豆腐を熱いだし汁で食べる方式が순두부찌개と似ています。", en: "Both simmer silken tofu in a savory broth — the key difference is miso/kombu vs spicy gochujang base." }
          }
        }
      },
      {
        id: "gyeongju-haejangguk",
        name: { ko: "경주 해장국", ja: "慶州ヘジャングク", en: "Gyeongju Haejangguk" },
        region: "gyeongju",
        image: "/images/food/해장국.png",
        tasteProfile: { sweet: 10, salty: 55, spicy: 50, umami: 80, sour: 10 },
        storyDescription: {
          ko: "진한 사골 국물에 우거지와 선지, 콩나물이 어우러진 경주식 해장국이에요. 묵직하고 깊은 국물 한 모금이면 전날의 피로가 씻겨나가는 것 같아서, 경주 사람들의 아침을 든든히 책임진답니다.",
          ja: "濃い牛骨スープにウゴジ（白菜の外葉）と血豆腐、もやしが調和した慶州式解腸スープです。重厚で深みのあるスープを一口飲めば、前日の疲れが洗い流されるようで、慶州の人たちの朝をしっかり支えています。",
          en: "A Gyeongju-style hangover soup with rich bone broth, dried cabbage leaves, congealed blood, and bean sprouts. One sip of this deeply savory, hearty broth washes away yesterday's weariness."
        },
        ingredients: { ko: ["사골육수", "우거지", "선지", "콩나물", "고춧가루", "된장", "마늘"], ja: ["牛骨スープ", "干し白菜葉", "血豆腐", "もやし", "唐辛子粉", "味噌", "ニンニク"], en: ["Bone broth", "Dried cabbage", "Blood pudding", "Bean sprouts", "Red pepper powder", "Doenjang", "Garlic"] },
        tags: ["해장", "진국", "아침"],
                dupes: {
          MX: {
            name: { ko: "멘우도", ja: "メヌード", en: "Menudo" },
            tasteProfile: { sweet: 5, salty: 45, spicy: 40, umami: 68, sour: 8 },
            description: { ko: "소 내장을 고추와 함께 오래 끓인 멕시코 해장국", ja: "牛モツを唐辛子と長時間煮込んだメキシコの二日酔いスープ", en: "Mexican hangover soup of slow-cooked beef tripe with chili" },
            ingredients: { ko: ["소 내장", "아나헤임 고추", "양파", "오레가노", "라임", "고수"], ja: ["牛モツ", "アナハイムチリ", "玉ねぎ", "オレガノ", "ライム", "コリアンダー"], en: ["beef tripe", "ancho chili", "onion", "oregano", "lime", "cilantro"] },
            similarityPercent: 87,
            matchReason: { ko: "소 내장을 매운 국물에 오래 끓여 해장용으로 먹는 문화가 경주 해장국과 동일합니다.", ja: "牛モツを辛いスープで長時間煮込んで二日酔い解消に飲む文化が同じです。", en: "Both are spicy tripe-based soups consumed as hangover remedies — the cultural and culinary function is identical." }
          },
          TH: {
            name: { ko: "똠쌥", ja: "トムサップ", en: "Tom Saap" },
            tasteProfile: { sweet: 5, salty: 40, spicy: 55, umami: 65, sour: 30 },
            description: { ko: "레몬그라스와 고추로 만든 매새콤한 태국식 내장 수프", ja: "レモングラスと唐辛子で作る酸辛タイ風モツスープ", en: "Thai spicy-sour soup with offal, lemongrass and chili" },
            ingredients: { ko: ["돼지 내장", "레몬그라스", "갈랑갈", "고추", "타마린드", "피시소스"], ja: ["豚モツ", "レモングラス", "ガランガル", "唐辛子", "タマリンド", "ナンプラー"], en: ["pork offal", "lemongrass", "galangal", "chili", "tamarind", "fish sauce"] },
            similarityPercent: 80,
            matchReason: { ko: "내장을 매운 국물에 끓여 먹는 방식이 해장국과 유사하며 산미가 더 강합니다.", ja: "モツを辛いスープで煮込む方式が해장국に似ていますが、酸味が強めです。", en: "Both stew offal in a spicy broth as a restorative dish, though tom saap is more sour." }
          },
          JP: {
            name: { ko: "모츠나베", ja: "もつ鍋", en: "Motsu Nabe" },
            tasteProfile: { sweet: 10, salty: 42, spicy: 20, umami: 72, sour: 5 },
            description: { ko: "돼지 내장을 간장과 미소로 끓인 일본식 내장 전골", ja: "豚モツを醤油・味噌で煮込む博多風もつ鍋", en: "Japanese hot pot of pork offal simmered in soy-miso broth" },
            ingredients: { ko: ["돼지 내장", "배추", "부추", "된장", "간장", "마늘"], ja: ["豚モツ", "白菜", "ニラ", "味噌", "醤油", "にんにく"], en: ["pork offal", "napa cabbage", "chives", "miso", "soy sauce", "garlic"] },
            similarityPercent: 75,
            matchReason: { ko: "내장을 육수에 끓여 야채와 함께 먹는 전골 방식이 해장국과 유사합니다.", ja: "モツをだし汁で煮て野菜と食べる鍋の形式が해장국と似ています。", en: "Both simmer offal in savory broth with vegetables, though motsu nabe is a hot pot rather than a soup." }
          }
        }
      },
      {
        id: "gyeongju-hanjeongsik",
        name: { ko: "경주 한정식", ja: "慶州韓定食", en: "Gyeongju Hanjeongsik" },
        region: "gyeongju",
        image: "/images/food/경주한정식.png",
        tasteProfile: { sweet: 30, salty: 50, spicy: 30, umami: 80, sour: 20 },
        storyDescription: {
          ko: "신라의 궁중 음식 문화를 계승한 경주의 전통 한정식이에요. 작은 그릇 하나하나에 장인의 손길이 담긴 정성스러운 반찬들이 차려지면, 마치 천년 전 경주 고분에서 발굴된 유물처럼 그 자리 자체가 하나의 역사가 된답니다.",
          ja: "新羅の宮廷料理文化を継承した慶州の伝統韓定食です。小さなお皿一つ一つに職人の手仕事が込められた丁寧なおかずが並ぶと、まるで千年前の慶州の古墳から発掘された遺物のように、その場そのものが一つの歴史になります。",
          en: "A traditional Gyeongju hanjeongsik tracing its roots to Silla royal court cuisine. Each small dish is crafted with artisan care — laid out together, it feels less like a meal and more like a living archaeological discovery."
        },
        ingredients: { ko: ["밥", "나물 반찬", "전", "구이", "찌개", "김치", "해산물", "떡"], ja: ["ご飯", "ナムルおかず", "チヂミ", "焼き物", "チゲ", "キムチ", "海産物", "餅"], en: ["Rice", "Namul side dishes", "Jeon", "Grilled dishes", "Jjigae", "Kimchi", "Seafood", "Rice cake"] },
        tags: ["정찬", "궁중", "전통"],
                dupes: {
          JP: {
            name: { ko: "가이세키", ja: "懐石料理", en: "Kaiseki" },
            tasteProfile: { sweet: 12, salty: 35, spicy: 5, umami: 65, sour: 10 },
            description: { ko: "제철 재료로 소량씩 코스로 내는 일본 최고급 정찬", ja: "旬の食材を少量ずつコースで提供する最高級の日本料理", en: "Japan's highest form of multi-course dining using seasonal ingredients" },
            ingredients: { ko: ["제철 생선", "두부", "채소", "쌀", "다시", "된장"], ja: ["旬の魚", "豆腐", "野菜", "米", "だし", "味噌"], en: ["seasonal fish", "tofu", "vegetables", "rice", "dashi", "miso"] },
            similarityPercent: 90,
            matchReason: { ko: "여러 코스 요리를 작은 그릇에 정성스럽게 담아내는 정찬 문화가 한정식과 동일합니다.", ja: "多くのコース料理を小さな器に丁寧に盛り付ける正餐文化が韓定食と同じです。", en: "Both are elaborate multi-course meals with small, carefully plated dishes — the same fine dining philosophy." }
          },
          FR: {
            name: { ko: "타블도트", ja: "テーブルドット", en: "Table d'hôte" },
            tasteProfile: { sweet: 15, salty: 38, spicy: 5, umami: 60, sour: 15 },
            description: { ko: "정해진 메뉴 순서로 제공되는 프랑스식 정찬", ja: "決まったコース順で提供されるフランス風正餐", en: "French set menu course dinner served in a fixed sequence" },
            ingredients: { ko: ["수프", "애피타이저", "주요리", "치즈", "디저트"], ja: ["スープ", "前菜", "メイン", "チーズ", "デザート"], en: ["soup", "appetizer", "main course", "cheese", "dessert"] },
            similarityPercent: 85,
            matchReason: { ko: "정해진 순서에 따라 여러 가지 요리가 코스로 제공되는 정찬 구조가 한정식과 동일합니다.", ja: "決まった順序で複数の料理がコースで提供される正餐構造が韓定食と同じです。", en: "Both are structured multi-course meals presented in a prescribed sequence — the formal dining framework is identical." }
          },
          CN: {
            name: { ko: "차오저우 정식", ja: "潮州料理フルコース", en: "Chaozhou Full Course" },
            tasteProfile: { sweet: 15, salty: 40, spicy: 10, umami: 65, sour: 10 },
            description: { ko: "다양한 소채 요리와 주요리를 한 번에 상에 올리는 광둥 정찬", ja: "多彩な小皿料理とメインを一度に卓に並べる潮州風正餐", en: "Cantonese banquet with many small dishes served simultaneously" },
            ingredients: { ko: ["해산물", "두부", "채소볶음", "죽", "탕수육", "딤섬"], ja: ["海産物", "豆腐", "野菜炒め", "お粥", "酢豚", "点心"], en: ["seafood", "tofu", "stir-fried vegetables", "congee", "sweet-sour pork", "dim sum"] },
            similarityPercent: 82,
            matchReason: { ko: "다양한 음식을 한 상에 올려 한 번에 즐기는 정찬 문화가 한정식과 유사합니다.", ja: "多様な料理を一卓に並べて一度に楽しむ正餐文化が韓定食に似ています。", en: "Both lay out an array of dishes simultaneously on the table — the communal banquet dining style is shared." }
          }
        }
      },
      {
        id: "gyeongju-chalborippang",
        name: { ko: "찰보리빵", ja: "チャルボリパン", en: "Chalborippang" },
        region: "gyeongju",
        image: "/images/food/찰보리빵.png",
        tasteProfile: { sweet: 60, salty: 15, spicy: 0, umami: 25, sour: 5 },
        storyDescription: {
          ko: "경주의 찰보리를 넣어 만든 촉촉하고 쫄깃한 빵이에요. 일반 빵과 달리 보리 특유의 구수한 향이 은은하게 올라오고, 팥 크림이나 단팥소와 어우러지면 소박하지만 깊은 맛이 나요.",
          ja: "慶州のもち麦を使って作ったしっとりもちもちのパンです。普通のパンと違い、麦独特の香ばしい香りがほんのりと漂い、小豆クリームや餡と相まって素朴ながら深い味わいがあります。",
          en: "A moist, chewy bread made with Gyeongju's sticky barley. Unlike ordinary bread, it carries the subtle nutty fragrance of barley — paired with red bean cream or paste, it's simple yet deeply satisfying."
        },
        ingredients: { ko: ["찰보리", "밀가루", "팥소", "버터", "설탕", "달걀", "우유"], ja: ["もち麦", "小麦粉", "小豆餡", "バター", "砂糖", "卵", "牛乳"], en: ["Sticky barley", "Wheat flour", "Red bean paste", "Butter", "Sugar", "Egg", "Milk"] },
        tags: ["빵", "보리", "달콤"],
                dupes: {
          JP: {
            name: { ko: "도라야키", ja: "どら焼き", en: "Dorayaki" },
            tasteProfile: { sweet: 72, salty: 5, spicy: 0, umami: 8, sour: 0 },
            description: { ko: "팥앙금을 두 장의 카스텔라 사이에 넣은 일본 과자", ja: "小豆あんを二枚のカステラ生地で挟んだ和菓子", en: "Japanese sweet with red bean paste sandwiched between two castella pancakes" },
            ingredients: { ko: ["밀가루", "달걀", "설탕", "팥앙금", "꿀"], ja: ["小麦粉", "卵", "砂糖", "小豆あん", "蜂蜜"], en: ["wheat flour", "egg", "sugar", "red bean paste", "honey"] },
            similarityPercent: 85,
            matchReason: { ko: "곡물가루 반죽을 구워 앙금을 채운 구조가 찰보리빵과 매우 유사합니다.", ja: "穀物粉を焼いてあんを詰めた構造が찰보리빵に非常に似ています。", en: "Both are baked grain-flour pastries filled with sweet paste — very similar structure and flavor profile." }
          },
          US: {
            name: { ko: "보리 팬케이크", ja: "バーリーパンケーキ", en: "Barley Pancake" },
            tasteProfile: { sweet: 55, salty: 8, spicy: 0, umami: 10, sour: 5 },
            description: { ko: "보리가루를 넣어 구운 쫄깃한 미국식 팬케이크", ja: "大麦粉を加えて焼いたもちもちアメリカ風パンケーキ", en: "American pancake made with barley flour for a chewy texture" },
            ingredients: { ko: ["보리가루", "밀가루", "달걀", "우유", "버터", "메이플시럽"], ja: ["大麦粉", "小麦粉", "卵", "牛乳", "バター", "メープルシロップ"], en: ["barley flour", "wheat flour", "egg", "milk", "butter", "maple syrup"] },
            similarityPercent: 75,
            matchReason: { ko: "보리가루를 주재료로 구운 납작한 빵 과자라는 점에서 찰보리빵과 유사합니다.", ja: "大麦粉を主材料に焼いた平たいパン菓子という点で찰보리빵に似ています。", en: "Both are flat baked goods made primarily from barley flour, with a similar chewy texture." }
          },
          FR: {
            name: { ko: "보리 갈레트", ja: "大麦ガレット", en: "Barley Galette" },
            tasteProfile: { sweet: 35, salty: 15, spicy: 0, umami: 12, sour: 5 },
            description: { ko: "보리가루로 만든 프랑스 브르타뉴 지방의 얇은 크레이프", ja: "大麦粉で作るフランス・ブルターニュ地方の薄いクレープ", en: "Thin French crêpe from Brittany made with barley flour" },
            ingredients: { ko: ["보리가루", "메밀", "달걀", "버터", "소금"], ja: ["大麦粉", "そば粉", "卵", "バター", "塩"], en: ["barley flour", "buckwheat", "egg", "butter", "salt"] },
            similarityPercent: 70,
            matchReason: { ko: "보리가루를 사용해 구운 납작한 빵이라는 점에서 찰보리빵과 유사합니다.", ja: "大麦粉を使って焼いた平たいパンという点が찰보리빵に似ています。", en: "Both use barley flour as the main ingredient and are baked into flat bread forms." }
          }
        }
      },
      {
        id: "gyeongju-milmyeon",
        name: { ko: "경주 밀면", ja: "慶州ミルミョン", en: "Gyeongju Milmyeon" },
        region: "gyeongju",
        image: "/images/food/경주밀면.png",
        tasteProfile: { sweet: 20, salty: 45, spicy: 50, umami: 60, sour: 35 },
        storyDescription: {
          ko: "밀가루 면을 차갑게 먹는 경주식 냉면이에요. 한방 재료가 들어간 시원한 국물에 쫄깃한 면을 담고, 고소하게 볶은 고기와 채소를 올려서 먹으면 여름 더위를 단번에 날려버려요.",
          ja: "小麦粉麺を冷やして食べる慶州式冷麺です。漢方食材が入った冷たいスープにコシのある麺を浸し、香ばしく炒めた肉と野菜を乗せて食べると、夏の暑さを一気に吹き飛ばしてくれます。",
          en: "Gyeongju-style cold noodles made from wheat flour. Chewy noodles bathed in an herbal cold broth, topped with savory stir-fried meat and fresh vegetables — one bowl and the summer heat simply vanishes."
        },
        ingredients: { ko: ["밀가루 면", "한방 육수", "오이", "계란", "돼지고기", "겨자", "식초"], ja: ["小麦粉麺", "漢方だし", "きゅうり", "卵", "豚肉", "からし", "酢"], en: ["Wheat noodles", "Herbal broth", "Cucumber", "Egg", "Pork", "Mustard", "Vinegar"] },
        tags: ["냉면", "여름", "쫄깃"],
                dupes: {
          JP: {
            name: { ko: "한방 라멘", ja: "薬膳ラーメン", en: "Herbal Ramen" },
            tasteProfile: { sweet: 8, salty: 45, spicy: 15, umami: 68, sour: 5 },
            description: { ko: "당귀·황기 등 약재를 넣어 끓인 일본식 한방 라멘", ja: "当帰・黄耆などの生薬を入れて煮込んだ薬膳ラーメン", en: "Japanese ramen with medicinal herbs like angelica and astragalus" },
            ingredients: { ko: ["밀면", "당귀", "황기", "닭육수", "간장", "파"], ja: ["中華麺", "当帰", "黄耆", "鶏スープ", "醤油", "ねぎ"], en: ["wheat noodles", "angelica root", "astragalus", "chicken broth", "soy sauce", "scallion"] },
            similarityPercent: 82,
            matchReason: { ko: "약재를 넣어 풍미를 낸 밀면 국수라는 점에서 경주 밀면과 유사합니다.", ja: "薬材で風味をつけた小麦麺スープという点で경주 밀면に似ています。", en: "Both are wheat noodle soups enhanced with herbal/medicinal ingredients for a distinctive deep flavor." }
          },
          CN: {
            name: { ko: "한약재 육수 면", ja: "薬膳スープ麺", en: "Herbal Medicine Noodle Soup" },
            tasteProfile: { sweet: 10, salty: 42, spicy: 8, umami: 65, sour: 3 },
            description: { ko: "인삼·대추 등 한약재를 우린 육수로 만든 중국식 국수", ja: "人参・なつめなどの薬材を煮出したスープで作る中国式麺料理", en: "Chinese noodle soup made with broth steeped in ginseng and jujube" },
            ingredients: { ko: ["국수", "인삼", "대추", "구기자", "닭고기", "소금"], ja: ["麺", "人参", "なつめ", "クコの実", "鶏肉", "塩"], en: ["noodles", "ginseng", "jujube", "wolfberry", "chicken", "salt"] },
            similarityPercent: 85,
            matchReason: { ko: "한약재를 우린 육수에 밀면을 끓여 먹는 방식이 경주 밀면과 동일한 개념입니다.", ja: "薬材を煮出したスープで麺を食べる方式が경주 밀면と同じコンセプトです。", en: "Both steep medicinal/herbal ingredients in broth and serve over wheat noodles — the same culinary concept." }
          },
          VN: {
            name: { ko: "퍼 까 임", ja: "フォーカイム", en: "Phở Gà Im" },
            tasteProfile: { sweet: 12, salty: 38, spicy: 5, umami: 62, sour: 8 },
            description: { ko: "향신료로 오래 끓인 닭 육수에 쌀국수를 넣은 베트남 국수", ja: "香辛料で長時間煮込んだ鶏スープの米麺ベトナム料理", en: "Vietnamese rice noodle soup with long-simmered aromatic chicken broth" },
            ingredients: { ko: ["쌀국수", "닭고기", "팔각", "생강", "계피", "피시소스"], ja: ["米麺", "鶏肉", "八角", "生姜", "シナモン", "ナンプラー"], en: ["rice noodles", "chicken", "star anise", "ginger", "cinnamon", "fish sauce"] },
            similarityPercent: 75,
            matchReason: { ko: "향신료와 약재로 깊이를 낸 육수에 면을 담아 먹는 방식이 경주 밀면과 유사합니다.", ja: "香辛料と薬材で深みを出したスープに麺を入れて食べる方式が경주 밀면に似ています。", en: "Both serve noodles in a deep, aromatic broth built from herbs and spices — phở uses rice noodles while milmyeon uses wheat." }
          }
        }
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
        image: "/images/food/호두과자.png",
        tasteProfile: { sweet: 72, salty: 12, spicy: 0, umami: 18, sour: 5 },
        storyDescription: {
          ko: "천안을 대표하는 국민 간식이에요. 호두 모양의 작은 틀에 달콤한 팥소와 호두 한 조각을 넣고 구워낸 빵으로, 고속도로 휴게소에서 갓 구운 것을 사 먹는 것이 천안 여행의 진짜 묘미랍니다.",
          ja: "天安を代表する国民的おやつです。クルミの形をした小さな型に甘い小豆餡とクルミを一切れ入れて焼いたパンで、高速道路のサービスエリアで焼きたてを買って食べるのが天安旅行の本当の楽しみです。",
          en: "Cheonan's iconic national snack. Small walnut-shaped pastries filled with sweet red bean paste and a walnut piece — buying them fresh off the griddle at a highway rest stop is the quintessential Cheonan travel moment."
        },
        ingredients: { ko: ["밀가루", "팥소", "호두", "달걀", "버터", "설탕"], ja: ["小麦粉", "小豆餡", "クルミ", "卵", "バター", "砂糖"], en: ["Wheat flour", "Red bean paste", "Walnut", "Egg", "Butter", "Sugar"] },
        tags: ["간식", "호두", "팥"],
                dupes: {
          JP: {
            name: { ko: "쿠루미 닌교야키", ja: "くるみ人形焼き", en: "Kurumi Ningyoyaki" },
            tasteProfile: { sweet: 70, salty: 5, spicy: 0, umami: 10, sour: 0 },
            description: { ko: "호두 앙금을 넣은 인형 모양 일본 과자", ja: "くるみあんを詰めた人形型和菓子", en: "Japanese doll-shaped cake filled with walnut paste" },
            ingredients: { ko: ["밀가루", "달걀", "설탕", "호두 앙금"], ja: ["小麦粉", "卵", "砂糖", "くるみあん"], en: ["wheat flour", "egg", "sugar", "walnut paste"] },
            similarityPercent: 92,
            matchReason: { ko: "호두 앙금을 밀가루 반죽으로 싸 구운 과자로 천안 호두과자와 거의 동일한 구조입니다.", ja: "くるみあんを生地で包んで焼いた菓子で、天安ホドゥグァジャとほぼ同じ構造です。", en: "A baked pastry filled with walnut paste — structurally near-identical to cheonan-walnut-cookie." }
          },
          FR: {
            name: { ko: "호두 마들렌", ja: "くるみマドレーヌ", en: "Walnut Madeleine" },
            tasteProfile: { sweet: 65, salty: 8, spicy: 0, umami: 8, sour: 3 },
            description: { ko: "호두를 넣어 구운 프랑스식 조개 모양 버터 케이크", ja: "くるみ入りのフランス風貝殻型バターケーキ", en: "French shell-shaped butter cake baked with walnut pieces" },
            ingredients: { ko: ["밀가루", "버터", "달걀", "설탕", "호두", "베이킹파우더"], ja: ["小麦粉", "バター", "卵", "砂糖", "くるみ", "ベーキングパウダー"], en: ["wheat flour", "butter", "egg", "sugar", "walnut", "baking powder"] },
            similarityPercent: 82,
            matchReason: { ko: "호두를 넣어 구운 소형 밀가루 과자라는 점에서 호두과자와 유사하나 버터 풍미가 강합니다.", ja: "くるみ入りの小さな焼き菓子という点で似ていますが、バター風味が強いです。", en: "Both are small baked walnut pastries, though madeleine is richer in butter flavor." }
          },
          US: {
            name: { ko: "피칸 파이", ja: "ピーカンパイ", en: "Pecan Pie" },
            tagestProfile: { sweet: 80, salty: 8, spicy: 0, umami: 12, sour: 2 },
            tasteProfile: { sweet: 80, salty: 8, spicy: 0, umami: 12, sour: 2 },
            description: { ko: "피칸과 옥수수 시럽으로 만든 미국 남부식 견과류 파이", ja: "ピーカンとコーンシロップで作るアメリカ南部風ナッツパイ", en: "Southern American pie filled with pecans and corn syrup" },
            ingredients: { ko: ["파이 반죽", "피칸", "옥수수시럽", "설탕", "달걀", "버터"], ja: ["パイ生地", "ピーカン", "コーンシロップ", "砂糖", "卵", "バター"], en: ["pie crust", "pecan", "corn syrup", "sugar", "egg", "butter"] },
            similarityPercent: 75,
            matchReason: { ko: "견과류를 단 반죽 안에 담아 구운 과자라는 점에서 호두과자와 유사합니다.", ja: "ナッツを甘い生地に包んで焼いた菓子という点が似ています。", en: "Both are baked nut-filled pastries with a sweet, caramelized filling." }
          }
        }
      },
      {
        id: "cheonan-byeongcheon-sundae",
        name: { ko: "병천순대", ja: "ビョンチョンスンデ", en: "Byeongcheon Sundae" },
        region: "cheonan",
        image: "/images/food/병천순대.png",
        tasteProfile: { sweet: 15, salty: 55, spicy: 20, umami: 75, sour: 5 },
        storyDescription: {
          ko: "당면과 채소, 선지를 듬뿍 넣어 꽉 채운 병천 특유의 순대예요. 다른 지역 순대보다 채소가 훨씬 많이 들어가 가볍고 깔끔한 맛이 나고, 천안 여행자들이 꼭 들러야 하는 명물 음식이랍니다.",
          ja: "春雨と野菜、血を惜しみなく詰め込んだ病川ならではのスンデです。他の地域のスンデより野菜がはるかに多く入っていて、軽くてさっぱりとした味がし、天安を訪れる旅行者が必ず立ち寄る名物料理です。",
          en: "Byeongcheon's signature sundae stuffed generously with glass noodles, vegetables, and blood. Far more veggie-forward than other regional varieties, it's light and clean-tasting — a must-try landmark food for anyone visiting Cheonan."
        },
        ingredients: { ko: ["돼지 소장", "당면", "채소", "선지", "찹쌀", "파", "마늘"], ja: ["豚の小腸", "春雨", "野菜", "血", "もち米", "ネギ", "ニンニク"], en: ["Pork intestine casing", "Glass noodles", "Vegetables", "Blood", "Sticky rice", "Green onion", "Garlic"] },
        tags: ["순대", "전통", "명물"],
                dupes: {
          ES: {
            name: { ko: "모르시야", ja: "モルシージャ", en: "Morcilla" },
            tasteProfile: { sweet: 5, salty: 48, spicy: 15, umami: 70, sour: 3 },
            description: { ko: "돼지 피와 쌀을 채운 스페인식 블러드 소시지", ja: "豚の血とご飯を詰めたスペイン風ブラッドソーセージ", en: "Spanish blood sausage stuffed with pig blood and rice" },
            ingredients: { ko: ["돼지 피", "쌀", "양파", "마늘", "파프리카", "장 껍데기"], ja: ["豚の血", "米", "玉ねぎ", "にんにく", "パプリカ", "腸皮"], en: ["pig blood", "rice", "onion", "garlic", "paprika", "intestine casing"] },
            similarityPercent: 90,
            matchReason: { ko: "돼지 피와 곡물을 장에 채워 만든 순대와 구조가 동일하며, 맛도 유사합니다.", ja: "豚の血と穀物を腸詰めにした構造が순대と同じで、味も似ています。", en: "Same structure as sundae — pig blood and grain stuffed in intestine casing — nearly identical culinary concept." }
          },
          FR: {
            name: { ko: "부댕 누아르", ja: "ブーダンノワール", en: "Boudin Noir" },
            tasteProfile: { sweet: 8, salty: 45, spicy: 8, umami: 68, sour: 5 },
            description: { ko: "돼지 피와 지방을 채운 프랑스식 블러드 소시지", ja: "豚の血と脂身を詰めたフランス風ブラッドソーセージ", en: "French blood sausage filled with pig blood and fat" },
            ingredients: { ko: ["돼지 피", "지방", "크림", "양파", "마늘", "타임"], ja: ["豚の血", "脂身", "クリーム", "玉ねぎ", "にんにく", "タイム"], en: ["pig blood", "fat", "cream", "onion", "garlic", "thyme"] },
            similarityPercent: 85,
            matchReason: { ko: "돼지 피를 장에 채워 만든 소시지라는 점에서 순대와 동일한 개념입니다.", ja: "豚の血を腸に詰めたソーセージという点で순대と同じコンセプトです。", en: "Both are blood sausages made by stuffing pig blood into intestine casing — the same fundamental preparation." }
          },
          JP: {
            name: { ko: "당고지루", ja: "団子汁", en: "Dango Jiru" },
            tasteProfile: { sweet: 5, salty: 42, spicy: 5, umami: 60, sour: 3 },
            description: { ko: "쫄깃한 반죽 덩어리를 된장국에 넣어 끓인 일본 규슈 향토 요리", ja: "もちもちした団子を味噌汁で煮込む九州の郷土料理", en: "Kyushu regional dish of chewy dough dumplings simmered in miso soup" },
            ingredients: { ko: ["밀가루", "된장", "당근", "우엉", "파", "두부"], ja: ["小麦粉", "味噌", "にんじん", "ごぼう", "ねぎ", "豆腐"], en: ["wheat flour", "miso", "carrot", "burdock root", "scallion", "tofu"] },
            similarityPercent: 70,
            matchReason: { ko: "쫄깃한 반죽을 장에 넣어 익혀 먹는 방식이 순대와 연결점이 있습니다.", ja: "もちもちした生地を腸詰めにして食べる点で순대との関連性があります。", en: "Both feature a chewy grain-dough filling cooked in a savory broth/casing context." }
          }
        }
      },
      {
        id: "cheonan-sundae-soup",
        name: { ko: "순대국밥", ja: "スンデクッパ", en: "Sundae Soup" },
        region: "cheonan",
        image: "/images/food/순대국밥.png",
        tasteProfile: { sweet: 10, salty: 55, spicy: 35, umami: 80, sour: 5 },
        storyDescription: {
          ko: "뽀얗게 우러난 돼지 사골 국물에 순대 한 줌이 풍덩 빠져 있어요. 국물 한 모금에 구수함이 입을 가득 채우고, 순대 한 점에 쫄깃한 식감이 더해지면서 천안 장날의 따뜻한 정이 느껴진답니다.",
          ja: "白く濁った豚骨スープにスンデがどっぷり浸かっています。スープを一口飲むと香ばしさが口いっぱいに広がり、スンデを一切れ食べると弾力のある食感が加わって、天安の市場の日の温かい情が感じられます。",
          en: "Milky pork bone broth with chunks of sundae submerged inside. One sip fills your mouth with savory depth, and a bite of chewy sundae adds texture — you can taste the warm community spirit of Cheonan's market days."
        },
        ingredients: { ko: ["사골육수", "순대", "머리고기", "내장", "파", "고춧가루", "새우젓"], ja: ["豚骨スープ", "スンデ", "豚頭肉", "内臓", "ネギ", "唐辛子粉", "アミの塩辛"], en: ["Pork bone broth", "Sundae", "Head meat", "Offal", "Green onion", "Red pepper", "Salted shrimp"] },
        tags: ["국밥", "순대", "구수함"],
                dupes: {
          ES: {
            name: { ko: "마드리드 코시도", ja: "マドリードコシード", en: "Cocido Madrileño" },
            tasteProfile: { sweet: 8, salty: 42, spicy: 8, umami: 72, sour: 5 },
            description: { ko: "고기와 채소를 함께 푹 끓인 스페인 마드리드 전통 스튜", ja: "肉と野菜をじっくり煮込んだスペイン・マドリード伝統シチュー", en: "Traditional Madrid stew of meat and vegetables slow-cooked together" },
            ingredients: { ko: ["돼지고기", "소시지", "병아리콩", "감자", "당근", "양배추"], ja: ["豚肉", "ソーセージ", "ひよこ豆", "じゃがいも", "にんじん", "キャベツ"], en: ["pork", "sausage", "chickpeas", "potato", "carrot", "cabbage"] },
            similarityPercent: 82,
            matchReason: { ko: "고기와 내장 부위를 함께 끓인 진한 국물 요리라는 점에서 순대국밥과 유사합니다.", ja: "肉とモツ部位を一緒に煮込んだ濃いスープ料理という点で순대국밥に似ています。", en: "Both are hearty meat-and-offal soups slow-cooked for deep flavor — similar comfort food function." }
          },
          MX: {
            name: { ko: "포솔레", ja: "ポソレ", en: "Pozole" },
            tasteProfile: { sweet: 5, salty: 40, spicy: 35, umami: 68, sour: 10 },
            description: { ko: "돼지고기와 옥수수를 넣어 끓인 멕시코 전통 수프", ja: "豚肉ととうもろこしで煮込んだメキシコ伝統スープ", en: "Traditional Mexican soup of pork and hominy corn" },
            ingredients: { ko: ["돼지고기", "호미니 옥수수", "칠레", "오레가노", "양파", "라임"], ja: ["豚肉", "ホミニー", "チリ", "オレガノ", "玉ねぎ", "ライム"], en: ["pork", "hominy corn", "chili", "oregano", "onion", "lime"] },
            similarityPercent: 78,
            matchReason: { ko: "돼지고기를 오래 끓여 진한 국물을 낸 국밥 형태가 순대국밥과 유사합니다.", ja: "豚肉を長時間煮込んで濃いスープを出す国飯の形態が순대국밥に似ています。", en: "Both are pork-based soups cooked long for rich broth, served as substantial meal-in-a-bowl." }
          },
          JP: {
            name: { ko: "돈코츠 나베", ja: "豚骨鍋", en: "Tonkotsu Nabe" },
            tasteProfile: { sweet: 8, salty: 43, spicy: 10, umami: 75, sour: 3 },
            description: { ko: "돼지 뼈를 오래 끓여 우유처럼 뽀얀 국물을 낸 일본 전골", ja: "豚骨を長時間煮込んで白濁スープにした日本風鍋", en: "Japanese hot pot with milky-white pork bone broth from long simmering" },
            ingredients: { ko: ["돼지 뼈", "마늘", "생강", "대파", "두부", "배추"], ja: ["豚骨", "にんにく", "生姜", "長ねぎ", "豆腐", "白菜"], en: ["pork bone", "garlic", "ginger", "leek", "tofu", "napa cabbage"] },
            similarityPercent: 75,
            matchReason: { ko: "돼지를 푹 끓여 뽀얀 국물을 낸 진한 탕요리라는 점에서 순대국밥과 유사합니다.", ja: "豚骨を長時間煮込んだ白濁スープという点で순대국밥に似ています。", en: "Both extract deep flavor from long-simmered pork — the milky white broth is the common thread." }
          }
        }
      },
      {
        id: "cheonan-charcoal-dakgalbi",
        name: { ko: "천안 숯불 닭갈비", ja: "天安炭火ダッカルビ", en: "Cheonan Charcoal Dakgalbi" },
        region: "cheonan",
        image: "/images/food/숯불닭갈비.png",
        tasteProfile: { sweet: 35, salty: 50, spicy: 65, umami: 70, sour: 10 },
        storyDescription: {
          ko: "천안에서는 일반 닭갈비와 달리 숯불 위에서 직접 구워낸 닭갈비가 유명해요. 연기 스며든 숯불 향기와 매콤달콤한 양념이 닭고기 속까지 배어들어, 한 입 베어 물면 입 안 가득 숯불 향연이 펼쳐져요.",
          ja: "天安では普通のダッカルビと違い、炭火で直接焼くダッカルビが有名です。煙が染み込んだ炭火の香りと甘辛い薬味が鶏肉の芯まで染みて、一口かじると口いっぱいに炭火の宴が広がります。",
          en: "Cheonan is famous for dakgalbi grilled directly over charcoal, unlike the usual stir-fried version. The smoky charcoal aroma and sweet-spicy marinade penetrate deep into the chicken — one bite and your mouth is filled with the festival of charcoal smoke."
        },
        ingredients: { ko: ["닭고기", "고추장", "간장", "설탕", "마늘", "참기름", "파"], ja: ["鶏肉", "コチュジャン", "醤油", "砂糖", "ニンニク", "ごま油", "ネギ"], en: ["Chicken", "Gochujang", "Soy sauce", "Sugar", "Garlic", "Sesame oil", "Green onion"] },
        tags: ["숯불", "닭갈비", "매콤"],
                dupes: {
          IN: {
            name: { ko: "탄두리 치킨", ja: "タンドリーチキン", en: "Tandoori Chicken" },
            tasteProfile: { sweet: 5, salty: 40, spicy: 55, umami: 65, sour: 12 },
            description: { ko: "향신료 마리네이드를 입혀 탄두르 화덕에 구운 인도 치킨", ja: "スパイスマリネを塗ってタンドゥール窯で焼いたインドのチキン", en: "Indian chicken marinated in spices and roasted in a tandoor oven" },
            ingredients: { ko: ["닭", "요거트", "가람마살라", "생강", "마늘", "레드칠레"], ja: ["鶏肉", "ヨーグルト", "ガラムマサラ", "生姜", "にんにく", "赤唐辛子"], en: ["chicken", "yogurt", "garam masala", "ginger", "garlic", "red chili"] },
            similarityPercent: 88,
            matchReason: { ko: "강한 불에 구운 매운 양념 닭갈비와 탄두리 치킨은 불 조리 방식과 향신료 맛 구조가 매우 유사합니다.", ja: "強火で焼く辛い鶏肉料理という点でタンドリーチキンと풍미構造が非常に似ています。", en: "Both are intensely spiced chicken dishes cooked over high heat — the flavor profile and cooking method are nearly identical." }
          },
          MX: {
            name: { ko: "뽀요 아사도", ja: "ポジョアサド", en: "Pollo Asado" },
            tasteProfile: { sweet: 8, salty: 38, spicy: 38, umami: 60, sour: 15 },
            description: { ko: "라임과 고추로 마리네이드한 멕시코식 숯불 구이 닭", ja: "ライムと唐辛子でマリネしたメキシコ風炭火焼き鶏", en: "Mexican charcoal-grilled chicken marinated in lime and chili" },
            ingredients: { ko: ["닭", "라임", "오렌지", "고추", "마늘", "쿠민"], ja: ["鶏肉", "ライム", "オレンジ", "唐辛子", "にんにく", "クミン"], en: ["chicken", "lime", "orange", "chili", "garlic", "cumin"] },
            similarityPercent: 85,
            matchReason: { ko: "숯불에 구운 매운 양념 닭이라는 점에서 천안 숯불 닭갈비와 매우 유사합니다.", ja: "炭火で焼いた辛い鶏肉という点で천안 숯불 닭갈비に非常に似ています。", en: "Both are charcoal-grilled spicy chicken dishes — same cooking technique and spice-forward profile." }
          },
          JP: {
            name: { ko: "스미비야키 치킨", ja: "炭火焼きチキン", en: "Sumibiyaki Chicken" },
            tasteProfile: { sweet: 15, salty: 42, spicy: 20, umami: 65, sour: 8 },
            description: { ko: "다레 소스에 재운 닭을 숯불에 구운 일본식 야키토리", ja: "たれに漬け込んだ鶏を炭火で焼く日本風焼き鳥", en: "Japanese yakitori-style chicken grilled on charcoal with tare sauce" },
            ingredients: { ko: ["닭", "간장", "미림", "설탕", "참기름", "파"], ja: ["鶏肉", "醤油", "みりん", "砂糖", "ごま油", "ねぎ"], en: ["chicken", "soy sauce", "mirin", "sugar", "sesame oil", "scallion"] },
            similarityPercent: 80,
            matchReason: { ko: "숯불로 구워 소스를 입힌 닭 요리라는 점에서 천안 숯불 닭갈비와 유사합니다.", ja: "炭火で焼いてソースを絡めた鶏料理という点で천안 숯불 닭갈비に似ています。", en: "Both are charcoal-grilled chicken glazed with a savory sauce — same technique, different sauce profiles." }
          }
        }
      },
      {
        id: "cheonan-spicy-catfish",
        name: { ko: "빠가사리 매운탕", ja: "ナマズ辛鍋", en: "Spicy Catfish Stew" },
        region: "cheonan",
        image: "/images/food/빠가사리매운탕.png",
        tasteProfile: { sweet: 10, salty: 50, spicy: 75, umami: 75, sour: 15 },
        storyDescription: {
          ko: "충청도 강에서 잡히는 빠가사리(메기류) 민물고기로 끓인 진한 매운탕이에요. 담백한 흰살 생선의 부드러운 살점이 칼칼한 양념과 어우러져 시원하고 얼큰한 국물이 완성되는데, 이맛이 그리워 천안을 찾는 사람들도 있답니다.",
          ja: "忠清道の川で獲れるナマズ類の淡水魚で煮込んだ濃厚な辛鍋です。淡白な白身魚の柔らかい身が辛い薬味と調和して、スッキリとしてピリッと辛いスープが完成し、この味が恋しくて天安を訪れる人もいるそうです。",
          en: "A fiery catfish stew made with freshwater fish caught in the rivers of Chungcheong province. The tender white fish flesh melds with the spicy seasoning into a clean, blazing broth — some people visit Cheonan just for this taste."
        },
        ingredients: { ko: ["빠가사리", "고춧가루", "된장", "두부", "호박", "파", "마늘", "들깨"], ja: ["ナマズ", "唐辛子粉", "味噌", "豆腐", "カボチャ", "ネギ", "ニンニク", "エゴマ"], en: ["Catfish", "Red pepper powder", "Doenjang", "Tofu", "Zucchini", "Green onion", "Garlic", "Perilla"] },
        tags: ["매운탕", "민물고기", "얼큰"],
                dupes: {
          CN: {
            name: { ko: "카오위", ja: "烤魚", en: "Kaoyu Spicy Fish" },
            tasteProfile: { sweet: 5, salty: 42, spicy: 65, umami: 68, sour: 8 },
            description: { ko: "구운 민물고기를 고추기름과 향신료에 볶아낸 쓰촨 요리", ja: "焼いた川魚を唐辛子油と香辛料で炒めた四川料理", en: "Sichuan dish of grilled freshwater fish stir-fried in chili oil" },
            ingredients: { ko: ["민물고기", "두반장", "화자오", "마늘", "생강", "파"], ja: ["川魚", "豆板醤", "花椒", "にんにく", "生姜", "ネギ"], en: ["freshwater fish", "doubanjiang", "Sichuan pepper", "garlic", "ginger", "scallion"] },
            similarityPercent: 88,
            matchReason: { ko: "민물고기를 매운 고추 소스에 볶아내는 방식이 매운 메기탕과 매우 유사합니다.", ja: "川魚を辛い唐辛子ソースで炒める方式が매운 메기탕に非常に似ています。", en: "Both are fiery freshwater fish dishes with chili-based sauce — nearly identical flavor approach." }
          },
          TH: {
            name: { ko: "똠 끌롱", ja: "トムクロン", en: "Tom Klong" },
            tasteProfile: { sweet: 8, salty: 38, spicy: 55, umami: 62, sour: 30 },
            description: { ko: "훈제 생선과 향신료를 넣은 매새콤한 태국 생선 스프", ja: "燻製魚と香辛料を入れた酸辛タイ風魚スープ", en: "Thai spicy-sour soup with smoked fish and herbs" },
            ingredients: { ko: ["민물고기", "레몬그라스", "타마린드", "고추", "갈랑갈", "피시소스"], ja: ["川魚", "レモングラス", "タマリンド", "唐辛子", "ガランガル", "ナンプラー"], en: ["freshwater fish", "lemongrass", "tamarind", "chili", "galangal", "fish sauce"] },
            similarityPercent: 80,
            matchReason: { ko: "민물고기를 매운 향신료 육수에 끓인 수프로 매운 메기탕과 유사합니다.", ja: "川魚を辛い香辛料スープで煮た点が매운 메기탕に似ています。", en: "Both are spicy freshwater fish soups with bold aromatics, though tom klong adds a sour element." }
          },
          JP: {
            name: { ko: "스파이시 민물 나베", ja: "スパイシー川魚鍋", en: "Spicy Freshwater Fish Nabe" },
            tasteProfile: { sweet: 8, salty: 42, spicy: 45, umami: 65, sour: 5 },
            description: { ko: "고추 된장으로 끓인 일본식 매운 민물고기 전골", ja: "唐辛子味噌で煮込む日本風辛い川魚鍋", en: "Japanese hot pot with freshwater fish in spicy miso broth" },
            ingredients: { ko: ["민물고기", "된장", "고추", "두부", "파", "배추"], ja: ["川魚", "味噌", "唐辛子", "豆腐", "ねぎ", "白菜"], en: ["freshwater fish", "miso", "chili", "tofu", "scallion", "napa cabbage"] },
            similarityPercent: 75,
            matchReason: { ko: "민물고기를 매운 된장 기반 국물에 끓인 전골로 매운 메기탕과 유사합니다.", ja: "川魚を辛い味噌ベーススープで煮込んだ鍋料理という点が似ています。", en: "Both simmer freshwater fish in a spicy broth — the catfish soup uses gochujang while the nabe uses spicy miso." }
          }
        }
      },
      {
        id: "cheonan-hanwoo-yukhoe",
        name: { ko: "한우 육회비빔밥", ja: "韓牛ユッケビビンバ", en: "Hanwoo Raw Beef Bibimbap" },
        region: "cheonan",
        image: "/images/food/한우육회비빔밥.png",
        tasteProfile: { sweet: 30, salty: 50, spicy: 55, umami: 80, sour: 20 },
        storyDescription: {
          ko: "신선한 한우 육회가 소복이 올려진 비빔밥이에요. 고슬고슬한 밥과 각양각색의 나물, 달걀 노른자 위에 윤기 좔좔 흐르는 육회가 올려지면, 그 아름다운 모습에 비비기 전에 한참 바라보게 된답니다.",
          ja: "新鮮な韓牛のユッケがたっぷり乗ったビビンバです。ふっくらしたご飯とさまざまなナムル、卵の黄身の上にツヤツヤ輝くユッケが乗ると、その美しい姿に混ぜる前にしばらく見とれてしまいます。",
          en: "Bibimbap crowned with a generous mound of fresh raw Korean beef. When the glistening yukhoe sits atop fluffy rice, colorful namul, and a golden egg yolk, you can't help but pause and admire it before mixing."
        },
        ingredients: { ko: ["한우 육회", "밥", "나물", "달걀 노른자", "고추장", "참기름", "배"], ja: ["韓牛ユッケ", "ご飯", "ナムル", "卵の黄身", "コチュジャン", "ごま油", "梨"], en: ["Raw Korean beef", "Rice", "Namul", "Egg yolk", "Gochujang", "Sesame oil", "Korean pear"] },
        tags: ["육회", "비빔밥", "한우"],
                dupes: {
          FR: {
            name: { ko: "비프 타르타르", ja: "ビーフタルタル", en: "Beef Tartare" },
            tasteProfile: { sweet: 5, salty: 38, spicy: 8, umami: 70, sour: 15 },
            description: { ko: "생 소고기를 케이퍼·머스타드로 양념한 프랑스 요리", ja: "生牛肉をケッパーとマスタードで和えたフランス料理", en: "French dish of raw beef seasoned with capers and mustard" },
            ingredients: { ko: ["생 소고기", "케이퍼", "머스타드", "달걀 노른자", "샬롯", "파슬리"], ja: ["生牛肉", "ケッパー", "マスタード", "卵黄", "シャロット", "パセリ"], en: ["raw beef", "capers", "mustard", "egg yolk", "shallot", "parsley"] },
            similarityPercent: 90,
            matchReason: { ko: "생 소고기를 양념해 날로 먹는 방식이 육회와 동일하며, 달걀 노른자를 올리는 점도 같습니다.", ja: "生牛肉を味付けして生で食べる方式が육회と同じで、卵黄を乗せる点も同じです。", en: "Both are seasoned raw beef dishes topped with egg yolk — the preparation and presentation are almost identical." }
          },
          US: {
            name: { ko: "하와이안 포케", ja: "ハワイアンポケ", en: "Hawaiian Poke" },
            tasteProfile: { sweet: 12, salty: 42, spicy: 10, umami: 65, sour: 12 },
            description: { ko: "생 참치에 간장과 참기름으로 양념한 하와이 생선 샐러드", ja: "生マグロを醤油とごま油で和えたハワイ風魚サラダ", en: "Hawaiian raw tuna salad seasoned with soy sauce and sesame oil" },
            ingredients: { ko: ["참치", "간장", "참기름", "파", "아보카도", "깨"], ja: ["マグロ", "醤油", "ごま油", "ねぎ", "アボカド", "ごま"], en: ["tuna", "soy sauce", "sesame oil", "scallion", "avocado", "sesame"] },
            similarityPercent: 82,
            matchReason: { ko: "생 단백질을 간장·참기름으로 양념해 날로 먹는 방식이 육회와 유사합니다.", ja: "生のたんぱく質を醤油とごま油で和えて食べる方式が육회と似ています。", en: "Both marinate raw protein in soy sauce and sesame oil — the same seasoning approach applied to different proteins." }
          },
          JP: {
            name: { ko: "규도 타타키 동부리", ja: "牛たたき丼", en: "Beef Tataki Donburi" },
            tasteProfile: { sweet: 10, salty: 40, spicy: 5, umami: 68, sour: 18 },
            description: { ko: "살짝 구운 소고기를 폰즈와 함께 밥 위에 올린 일본 덮밥", ja: "炙り牛肉をポン酢と共にご飯に乗せた日本風丼", en: "Japanese rice bowl topped with seared beef and ponzu sauce" },
            ingredients: { ko: ["소고기", "밥", "폰즈", "무순", "깨", "파"], ja: ["牛肉", "ご飯", "ポン酢", "かいわれ", "ごま", "ねぎ"], en: ["beef", "rice", "ponzu", "radish sprouts", "sesame", "scallion"] },
            similarityPercent: 78,
            matchReason: { ko: "신선한 소고기를 간장 기반 소스와 함께 내는 점이 육회와 유사합니다.", ja: "新鮮な牛肉を醤油ベースソースと共に出す点が육회と似ています。", en: "Both feature barely-cooked or raw beef with soy-based sauce — tataki is just barely seared." }
          }
        }
      },
      {
        id: "cheonan-fruit-mochi",
        name: { ko: "생과일 모찌", ja: "生フルーツ大福", en: "Fresh Fruit Mochi" },
        region: "cheonan",
        image: "/images/food/생과일모찌.png",
        tasteProfile: { sweet: 75, salty: 5, spicy: 0, umami: 10, sour: 20 },
        storyDescription: {
          ko: "촉촉한 찹쌀 떡 피 속에 생딸기나 망고 같은 신선한 과일이 통째로 들어있어요. 한 입 베어 물면 달콤한 찹쌀 향과 함께 과즙이 터지면서 어느 디저트 카페도 부럽지 않은 행복감이 밀려온답니다.",
          ja: "しっとりしたもち米の皮の中に、生いちごやマンゴーなどの新鮮な果物が丸ごと入っています。一口かじると甘いもち米の香りとともに果汁が弾けて、どんなデザートカフェも羨ましくない幸福感が押し寄せます。",
          en: "Moist sticky rice skin wrapping a whole fresh strawberry or mango inside. One bite releases sweet mochi fragrance and a burst of fruit juice — pure happiness that rivals any fancy dessert cafe."
        },
        ingredients: { ko: ["찹쌀가루", "생딸기", "생크림", "설탕", "전분", "팥소"], ja: ["もち米粉", "生いちご", "生クリーム", "砂糖", "でんぷん", "小豆餡"], en: ["Glutinous rice flour", "Fresh strawberry", "Heavy cream", "Sugar", "Starch", "Red bean paste"] },
        tags: ["디저트", "과일", "모찌"],
                dupes: {
          JP: {
            name: { ko: "이치고 다이후쿠", ja: "いちご大福", en: "Ichigo Daifuku" },
            tasteProfile: { sweet: 68, salty: 3, spicy: 0, umami: 8, sour: 10 },
            description: { ko: "딸기를 통째로 앙금과 함께 떡으로 싼 일본 화과자", ja: "いちごを丸ごとあんこと一緒にお餅で包んだ和菓子", en: "Japanese sweet with a whole strawberry wrapped in red bean paste and mochi" },
            ingredients: { ko: ["찹쌀", "딸기", "팥앙금", "설탕"], ja: ["もち米", "いちご", "あんこ", "砂糖"], en: ["glutinous rice", "strawberry", "red bean paste", "sugar"] },
            similarityPercent: 95,
            matchReason: { ko: "과일을 통째로 떡으로 감싼 구조가 과일모찌와 완전히 동일합니다.", ja: "果物を丸ごとお餅で包んだ構造が과일모찌と全く同じです。", en: "Whole fruit wrapped in mochi — exactly the same structure as cheonan fruit mochi." }
          },
          TH: {
            name: { ko: "룩 춥", ja: "ルークチュップ", en: "Luk Chup" },
            tasteProfile: { sweet: 72, salty: 2, spicy: 0, umami: 5, sour: 5 },
            description: { ko: "과일·채소 모양으로 만든 태국식 녹두 젤리 과자", ja: "果物・野菜の形に作るタイ風緑豆ゼリー菓子", en: "Thai candy made from mung bean paste shaped like fruits and vegetables" },
            ingredients: { ko: ["녹두", "코코넛밀크", "설탕", "식용 색소", "젤라틴"], ja: ["緑豆", "ココナッツミルク", "砂糖", "食用色素", "ゼラチン"], en: ["mung bean paste", "coconut milk", "sugar", "food coloring", "gelatin"] },
            similarityPercent: 78,
            matchReason: { ko: "과일 형태를 표현한 달콤한 앙금 과자라는 점에서 과일모찌와 컨셉이 유사합니다.", ja: "果物の形を表現した甘いあん菓子という点で과일모찌とコンセプトが似ています。", en: "Both are sweet paste confections shaped or filled to represent fruit — similar visual and flavor concept." }
          },
          US: {
            name: { ko: "젤로 바이트", ja: "ゼリーバイト", en: "Jello Bites" },
            tasteProfile: { sweet: 75, salty: 2, spicy: 0, umami: 3, sour: 12 },
            description: { ko: "과일 모양 틀에 굳힌 미국식 과일 젤리 간식", ja: "果物型に固めたアメリカ風フルーツゼリースナック", en: "American fruit-shaped gelatin snacks with real fruit inside" },
            ingredients: { ko: ["젤라틴", "과일주스", "설탕", "딸기", "포도"], ja: ["ゼラチン", "フルーツジュース", "砂糖", "いちご", "ブドウ"], en: ["gelatin", "fruit juice", "sugar", "strawberry", "grape"] },
            similarityPercent: 68,
            matchReason: { ko: "과일을 감싸거나 과일 형태로 만든 달콤한 간식이라는 점에서 과일모찌와 유사합니다.", ja: "果物を包んだり果物の形にした甘いおやつという点で과일모찌と似ています。", en: "Both are sweet, fruit-centric confections — mochi wraps real fruit while jello bites use fruit-flavored gelatin." }
          }
        }
      },
      {
        id: "cheonan-lotus-rice",
        name: { ko: "연잎밥 정식", ja: "蓮の葉ご飯定食", en: "Lotus Leaf Rice Set" },
        region: "cheonan",
        image: "/images/food/연잎밥.png",
        tasteProfile: { sweet: 25, salty: 45, spicy: 20, umami: 65, sour: 10 },
        storyDescription: {
          ko: "향긋한 연잎으로 찹쌀밥과 견과류를 싸서 쪄낸 건강 요리예요. 연잎 특유의 은은한 향이 밥 속으로 스며들면서 일반 밥과는 전혀 다른 청아한 풍미를 만들어내고, 눈에도 먹기 전부터 힐링이 됩니다.",
          ja: "香り高い蓮の葉でもち米ごはんとナッツを包んで蒸した健康料理です。蓮の葉独特のほのかな香りがご飯に染み込んで、普通のご飯とは全く違う清雅な風味を生み出し、食べる前から目にも癒やしを与えてくれます。",
          en: "A wholesome dish of glutinous rice and nuts steamed inside fragrant lotus leaves. The lotus' delicate aroma permeates the rice, creating a clean, ethereal flavor unlike any ordinary rice — healing for the eyes even before the first bite."
        },
        ingredients: { ko: ["연잎", "찹쌀", "은행", "잣", "대추", "밤", "간장"], ja: ["蓮の葉", "もち米", "銀杏", "松の実", "なつめ", "栗", "醤油"], en: ["Lotus leaf", "Glutinous rice", "Ginkgo", "Pine nuts", "Jujube", "Chestnut", "Soy sauce"] },
        tags: ["연잎", "건강", "찹쌀"],
                dupes: {
          CN: {
            name: { ko: "눠미지", ja: "糯米鶏", en: "Lo Mai Gai" },
            tasteProfile: { sweet: 12, salty: 42, spicy: 5, umami: 65, sour: 3 },
            description: { ko: "찹쌀을 연잎에 싸 쪄낸 중국 광둥 딤섬", ja: "もち米を蓮の葉で包んで蒸した広東式点心", en: "Cantonese dim sum of glutinous rice steamed in lotus leaf" },
            ingredients: { ko: ["찹쌀", "닭고기", "표고버섯", "연잎", "굴소스", "간장"], ja: ["もち米", "鶏肉", "椎茸", "蓮の葉", "オイスターソース", "醤油"], en: ["glutinous rice", "chicken", "shiitake", "lotus leaf", "oyster sauce", "soy sauce"] },
            similarityPercent: 95,
            matchReason: { ko: "찹쌀을 연잎으로 싸서 찐 요리로 천안 연잎밥과 구조가 거의 동일합니다.", ja: "もち米を蓮の葉で包んで蒸した料理で、천안 연잎밥と構造がほぼ同じです。", en: "Glutinous rice steamed inside a lotus leaf — structurally almost identical to cheonan lotus rice." }
          },
          TH: {
            name: { ko: "카오 호 바이 부아", ja: "カーオホーバイブア", en: "Khao Ho Bai Bua" },
            tasteProfile: { sweet: 15, salty: 38, spicy: 3, umami: 58, sour: 3 },
            description: { ko: "연잎에 찹쌀과 코코넛을 싸 쪄낸 태국 간식", ja: "蓮の葉にもち米とココナッツを包んで蒸したタイのおやつ", en: "Thai snack of glutinous rice and coconut steamed in lotus leaf" },
            ingredients: { ko: ["찹쌀", "코코넛밀크", "연잎", "설탕", "소금"], ja: ["もち米", "ココナッツミルク", "蓮の葉", "砂糖", "塩"], en: ["glutinous rice", "coconut milk", "lotus leaf", "sugar", "salt"] },
            similarityPercent: 88,
            matchReason: { ko: "찹쌀을 연잎에 싸 쪄내는 방식이 천안 연잎밥과 동일합니다.", ja: "もち米を蓮の葉で包んで蒸す方式が천안 연잎밥と同じです。", en: "Same cooking method — glutinous rice steamed in lotus leaf, which imparts the same distinctive fragrance." }
          },
          JP: {
            name: { ko: "연잎 마키오코와", ja: "蓮の葉まきおこわ", en: "Lotus Leaf Okowa" },
            tasteProfile: { sweet: 10, salty: 40, spicy: 3, umami: 60, sour: 3 },
            description: { ko: "찹쌀과 재료를 연잎에 싸 쪄낸 일본식 찹쌀밥", ja: "もち米と具材を蓮の葉で包んで蒸した日本風おこわ", en: "Japanese-style glutinous rice wrapped and steamed in lotus leaf" },
            ingredients: { ko: ["찹쌀", "표고버섯", "당근", "연잎", "간장", "미림"], ja: ["もち米", "椎茸", "にんじん", "蓮の葉", "醤油", "みりん"], en: ["glutinous rice", "shiitake", "carrot", "lotus leaf", "soy sauce", "mirin"] },
            similarityPercent: 85,
            matchReason: { ko: "연잎으로 싼 찹쌀밥을 쪄내는 방식이 천안 연잎밥과 동일합니다.", ja: "蓮の葉で包んだもち米飯を蒸す方式が천안 연잎밥と同じです。", en: "Both steam glutinous rice wrapped in lotus leaf — same fragrant cooking method." }
          }
        }
      },
      {
        id: "cheonan-mushroom-stew",
        name: { ko: "버섯전골", ja: "きのこ鍋", en: "Mushroom Hotpot" },
        region: "cheonan",
        image: "/images/food/버섯전골.png",
        tasteProfile: { sweet: 15, salty: 45, spicy: 25, umami: 90, sour: 5 },
        storyDescription: {
          ko: "충청 지역에서 재배되는 다양한 버섯들이 그 향과 맛을 국물 속에 풀어내는 웰빙 전골이에요. 먹을수록 감칠맛이 깊어지고, 건더기를 건져 먹을 때 버섯 특유의 향긋한 식감이 입 안에 가득 차는 게 묘미랍니다.",
          ja: "忠清地域で栽培されたさまざまなキノコがその香りと旨味をスープに溶かし込んだウェルビーイング鍋です。食べるほどに旨味が深まり、具を掬って食べるときにキノコ独特の香り豊かな食感が口いっぱいに広がるのが醍醐味です。",
          en: "A wellness hotpot showcasing diverse mushrooms grown in the Chungcheong region, releasing their aroma and flavor into the broth. The umami deepens with every bite, and the fragrant, earthy texture of the mushrooms fills your mouth completely."
        },
        ingredients: { ko: ["표고버섯", "느타리버섯", "팽이버섯", "두부", "당면", "파", "간장", "참기름"], ja: ["椎茸", "ヒラタケ", "えのき茸", "豆腐", "春雨", "ネギ", "醤油", "ごま油"], en: ["Shiitake", "Oyster mushroom", "Enoki", "Tofu", "Glass noodles", "Green onion", "Soy sauce", "Sesame oil"] },
        tags: ["버섯", "전골", "감칠맛"],
                dupes: {
          IT: {
            name: { ko: "포르치니 리조또 수프", ja: "ポルチーニリゾットスープ", en: "Porcini Risotto Soup" },
            tasteProfile: { sweet: 8, salty: 40, spicy: 5, umami: 80, sour: 5 },
            description: { ko: "포르치니 버섯으로 만든 진한 이탈리아식 리조또 수프", ja: "ポルチーニ茸で作る濃厚なイタリア風リゾットスープ", en: "Rich Italian soup made with porcini mushrooms and arborio rice" },
            ingredients: { ko: ["포르치니", "아르보리오 쌀", "파르메산", "화이트와인", "버터", "양파"], ja: ["ポルチーニ", "アルボリオ米", "パルメザン", "白ワイン", "バター", "玉ねぎ"], en: ["porcini", "arborio rice", "parmesan", "white wine", "butter", "onion"] },
            similarityPercent: 85,
            matchReason: { ko: "버섯을 주재료로 진한 국물을 낸 요리라는 점에서 버섯 전골과 유사합니다.", ja: "きのこをメインに濃いスープを作る料理という点で버섯 전골に似ています。", en: "Both are rich, mushroom-forward dishes where the fungi provide the dominant umami depth." }
          },
          FR: {
            name: { ko: "버섯 콩소메", ja: "マッシュルームコンソメ", en: "Mushroom Consommé" },
            tasteProfile: { sweet: 5, salty: 38, spicy: 3, umami: 78, sour: 5 },
            description: { ko: "각종 버섯으로 맑게 우려낸 프랑스식 콩소메 수프", ja: "各種きのこで澄んだフランス風コンソメスープ", en: "French clear soup (consommé) steeped with mixed mushrooms" },
            ingredients: { ko: ["양송이", "표고버섯", "포르치니", "타임", "백포도주", "소금"], ja: ["マッシュルーム", "椎茸", "ポルチーニ", "タイム", "白ワイン", "塩"], en: ["button mushroom", "shiitake", "porcini", "thyme", "white wine", "salt"] },
            similarityPercent: 78,
            matchReason: { ko: "다양한 버섯의 풍미를 국물에 우려낸 요리라는 점에서 버섯 전골과 유사합니다.", ja: "様々なきのこの風味をスープに抽出した料理という点で버섯 전골に似ています。", en: "Both extract the deep flavor of multiple mushroom varieties into a savory broth." }
          },
          JP: {
            name: { ko: "키노코 나베", ja: "きのこ鍋", en: "Kinoko Nabe" },
            tasteProfile: { sweet: 8, salty: 40, spicy: 5, umami: 75, sour: 3 },
            description: { ko: "다양한 버섯을 다시마 육수에 끓인 일본식 버섯 전골", ja: "各種きのこを昆布だしで煮る日本風きのこ鍋", en: "Japanese hot pot with mixed mushrooms in kombu dashi" },
            ingredients: { ko: ["에노키", "표고버섯", "새송이", "다시마", "간장", "미림"], ja: ["えのき", "椎茸", "エリンギ", "昆布", "醤油", "みりん"], en: ["enoki", "shiitake", "king oyster mushroom", "kombu", "soy sauce", "mirin"] },
            similarityPercent: 90,
            matchReason: { ko: "다양한 버섯을 육수에 끓여 먹는 전골 방식이 천안 버섯 전골과 동일합니다.", ja: "様々なきのこをだし汁で煮る鍋の方式が천안 버섯 전골と同じです。", en: "Both are mushroom hot pots — multiple varieties simmered in savory dashi. Nearly identical concept." }
          }
        }
      },
      {
        id: "cheonan-local-bakery",
        name: { ko: "뚜쥬루 앙버터빵", ja: "トゥジュル餡バターパン", en: "Ttujuru Anpan Butter Bread" },
        region: "cheonan",
        image: "/images/food/뚜쥬르빵.png",
        tasteProfile: { sweet: 65, salty: 20, spicy: 0, umami: 15, sour: 5 },
        storyDescription: {
          ko: "천안의 인기 로컬 베이커리 '뚜쥬루'의 시그니처 앙버터 빵이에요. 고소한 발효 버터와 달콤한 팥소가 부드러운 브리오슈 빵 사이에 끼워져 있어, 한 입 먹으면 고소함과 달콤함이 파도처럼 밀려오는 행복한 빵이에요.",
          ja: "天安の人気ローカルベーカリー「뚜쥬루」のシグネチャー餡バターパンです。香ばしい発酵バターと甘い小豆餡が柔らかいブリオッシュパンに挟まれていて、一口食べると香ばしさと甘さが波のように押し寄せる幸せなパンです。",
          en: "The signature anpan butter bread from Cheonan's beloved local bakery 'Ttujuru'. Creamy cultured butter and sweet red bean paste sandwiched in soft brioche — one bite and waves of nuttiness and sweetness wash over you."
        },
        ingredients: { ko: ["브리오슈", "팥소", "발효 버터", "소금", "설탕"], ja: ["ブリオッシュ", "小豆餡", "発酵バター", "塩", "砂糖"], en: ["Brioche", "Red bean paste", "Cultured butter", "Salt", "Sugar"] },
        tags: ["베이커리", "앙버터", "로컬"],
                dupes: {
          FR: {
            name: { ko: "아티잔 불랑제리", ja: "アルティザンブーランジェリー", en: "Artisan Boulangerie" },
            tasteProfile: { sweet: 30, salty: 15, spicy: 0, umami: 15, sour: 10 },
            description: { ko: "장인이 매일 굽는 프랑스식 수제 빵집 제품들", ja: "職人が毎日焼くフランス式手作りパン屋の商品", en: "Handcrafted breads baked daily by an artisan French bakery" },
            ingredients: { ko: ["밀가루", "이스트", "소금", "버터", "물"], ja: ["小麦粉", "イースト", "塩", "バター", "水"], en: ["wheat flour", "yeast", "salt", "butter", "water"] },
            similarityPercent: 85,
            matchReason: { ko: "지역 재료로 매일 직접 굽는 장인 베이커리 문화가 천안 로컬 베이커리와 동일합니다.", ja: "地元食材で毎日直接焼く職人ベーカリー文化が천안 로컬 베이커리와同じです。", en: "Both are artisan bakeries emphasizing daily fresh baking with local ingredients — the same craft philosophy." }
          },
          IT: {
            name: { ko: "정통 포카치아", ja: "本格フォカッチャ", en: "Authentic Focaccia" },
            tasteProfile: { sweet: 10, salty: 22, spicy: 5, umami: 20, sour: 8 },
            description: { ko: "올리브오일과 허브를 넣어 구운 이탈리아 납작빵", ja: "オリーブオイルとハーブで焼くイタリアのフラットブレッド", en: "Italian flatbread baked with olive oil and fresh herbs" },
            ingredients: { ko: ["밀가루", "올리브오일", "로즈마리", "소금", "이스트"], ja: ["小麦粉", "オリーブオイル", "ローズマリー", "塩", "イースト"], en: ["wheat flour", "olive oil", "rosemary", "salt", "yeast"] },
            similarityPercent: 75,
            matchReason: { ko: "지역 특산 재료를 활용해 정성스럽게 구운 빵이라는 점에서 로컬 베이커리와 유사합니다.", ja: "地域特産食材を活かして丁寧に焼いたパンという点でローカルベーカリーと似ています。", en: "Both represent quality artisan bread made with locally sourced or premium ingredients." }
          },
          US: {
            name: { ko: "로컬 베이커리", ja: "ローカルベーカリー", en: "Local Bakery" },
            tasteProfile: { sweet: 40, salty: 12, spicy: 0, umami: 10, sour: 8 },
            description: { ko: "지역 특산물로 만든 쿠키, 케이크, 브레드를 파는 미국 로컬 베이커리", ja: "地元特産品で作るクッキー・ケーキ・パンを売るアメリカのローカルベーカリー", en: "American neighborhood bakery selling cookies, cakes, and breads made with local specialties" },
            ingredients: { ko: ["버터", "설탕", "밀가루", "달걀", "지역 특산물", "시즌 과일"], ja: ["バター", "砂糖", "小麦粉", "卵", "地元特産品", "旬の果物"], en: ["butter", "sugar", "flour", "egg", "local specialties", "seasonal fruit"] },
            similarityPercent: 80,
            matchReason: { ko: "지역 특산물을 활용한 다양한 베이커리 제품을 판매하는 문화가 천안 로컬 베이커리와 동일합니다.", ja: "地元特産品を活かした多彩なベーカリー商品を販売する文化が천안 로컬 베이커리와同じです。", en: "Both are neighborhood bakeries that incorporate local/regional ingredients into their daily baked goods." }
          }
        }
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
        image: "/images/food/백암순대.png",
        tasteProfile: { sweet: 15, salty: 55, spicy: 20, umami: 80, sour: 5 },
        storyDescription: {
          ko: "용인 백암면에서 유래한 순대로, 속이 꽉 찬 풍성함이 자랑이에요. 찹쌀과 두부, 당면이 가득 들어간 도톰한 순대를 뚝 잘라 소금에 찍어 먹으면, 할머니 손맛이 생각나는 정겨운 맛이 납니다.",
          ja: "龍仁の白岩面に由来するスンデで、ぎっしり詰まった豊かさが自慢です。もち米と豆腐、春雨がたっぷり入った厚みのあるスンデをぶつ切りにして塩に付けて食べると、おばあちゃんの手料理を思い出す懐かしい味がします。",
          en: "Originating from Baegam-myeon in Yongin, this sundae is celebrated for its generous fillings. Thick slices of sticky rice, tofu, and glass noodle-packed sundae dipped in salt — one taste and grandma's kitchen comes flooding back."
        },
        ingredients: { ko: ["돼지 소장", "찹쌀", "두부", "당면", "선지", "부추", "마늘"], ja: ["豚の小腸", "もち米", "豆腐", "春雨", "血", "ニラ", "ニンニク"], en: ["Pork intestine casing", "Glutinous rice", "Tofu", "Glass noodles", "Blood", "Garlic chives", "Garlic"] },
        tags: ["순대", "백암", "전통"],
                dupes: {
          IT: {
            name: { ko: "코테키노", ja: "コテキーノ", en: "Cotechino" },
            tasteProfile: { sweet: 8, salty: 48, spicy: 10, umami: 70, sour: 5 },
            description: { ko: "돼지 껍데기와 고기를 향신료로 채운 이탈리아 연말 소시지", ja: "豚皮と肉を香辛料で詰めたイタリアの年末ソーセージ", en: "Italian sausage of pork skin and meat seasoned with spices, traditional at year-end" },
            ingredients: { ko: ["돼지 껍데기", "돼지고기", "마늘", "육두구", "계피", "장 껍데기"], ja: ["豚皮", "豚肉", "にんにく", "ナツメグ", "シナモン", "腸皮"], en: ["pork skin", "pork meat", "garlic", "nutmeg", "cinnamon", "intestine casing"] },
            similarityPercent: 85,
            matchReason: { ko: "돼지 부속물을 향신료와 함께 장에 채워 만든 소시지라는 점에서 용인 백암순대와 매우 유사합니다.", ja: "豚の端肉を香辛料と共に腸詰めにしたソーセージという点で용인 백암순대に非常に似ています。", en: "Both stuff seasoned pork (including offal cuts) into intestine casing — the same fundamental sausage technique." }
          },
          US: {
            name: { ko: "화이트 허브 소시지", ja: "ホワイトハーブソーセージ", en: "White Herb Sausage" },
            tasteProfile: { sweet: 5, salty: 45, spicy: 8, umami: 65, sour: 3 },
            description: { ko: "허브와 마늘로 양념한 밝은 색의 미국식 돼지고기 소시지", ja: "ハーブとにんにくで味付けした白色のアメリカ風豚肉ソーセージ", en: "American-style pale pork sausage seasoned with herbs and garlic" },
            ingredients: { ko: ["돼지고기", "마늘", "파슬리", "타임", "세이지", "장 껍데기"], ja: ["豚肉", "にんにく", "パセリ", "タイム", "セージ", "腸皮"], en: ["pork", "garlic", "parsley", "thyme", "sage", "casing"] },
            similarityPercent: 78,
            matchReason: { ko: "돼지고기를 향신료와 함께 장에 채워 만든 소시지라는 점에서 백암순대와 유사합니다.", ja: "豚肉を香辛料と共に腸詰めにしたソーセージという点で백암순대と似ています。", en: "Both are sausages made by stuffing seasoned pork into casing — different fillings but same technique." }
          },
          JP: {
            name: { ko: "아라비키 소시지", ja: "粗挽きソーセージ", en: "Arakibiki Sausage" },
            tasteProfile: { sweet: 8, salty: 45, spicy: 5, umami: 68, sour: 3 },
            description: { ko: "굵게 간 돼지고기를 채운 일본식 직화 소시지", ja: "粗挽き豚肉を詰めた日本風直火ソーセージ", en: "Japanese-style sausage filled with coarsely ground pork and grilled directly" },
            ingredients: { ko: ["돼지고기", "간장", "마늘", "생강", "파", "장 껍데기"], ja: ["豚肉", "醤油", "にんにく", "生姜", "ねぎ", "腸皮"], en: ["pork", "soy sauce", "garlic", "ginger", "scallion", "casing"] },
            similarityPercent: 75,
            matchReason: { ko: "굵게 간 돼지고기를 장에 채운 소시지라는 점에서 백암순대와 유사합니다.", ja: "粗挽き豚肉を腸詰めにしたソーセージという点で백암순대と似ています。", en: "Both are pork-stuffed sausages with a hearty, meaty texture." }
          }
        }
      },
      {
        id: "yongin-jangter-gukbap",
        name: { ko: "민속촌 장터국밥", ja: "民俗村チャンターグッパ", en: "Folk Village Market Soup Rice" },
        region: "yongin",
        image: "/images/food/장터국밥.png",
        tasteProfile: { sweet: 10, salty: 55, spicy: 30, umami: 80, sour: 5 },
        storyDescription: {
          ko: "한국 민속촌 장터에서 팔던 소박한 시골 국밥이에요. 뚝배기에 담긴 진한 사골 국물과 밥, 우거지, 수육이 어우러진 푸짐한 한 그릇이 옛날 장날의 분위기를 그대로 살려낸답니다.",
          ja: "韓国民俗村の市場で売っていた素朴な田舎の国飯です。土鍋に入った濃い骨付き肉スープとご飯、干し白菜、ゆで肉が調和した豊かな一杯が、昔の市場の日の雰囲気をそのまま蘇らせます。",
          en: "A humble country soup rice sold at the marketplace of the Korean Folk Village. A generous earthenware bowl of rich bone broth, rice, dried cabbage, and boiled meat — it perfectly captures the warm atmosphere of old market days."
        },
        ingredients: { ko: ["사골육수", "밥", "우거지", "수육", "파", "된장", "고춧가루"], ja: ["骨付き肉スープ", "ご飯", "干し白菜葉", "ゆで肉", "ネギ", "味噌", "唐辛子粉"], en: ["Bone broth", "Rice", "Dried cabbage", "Boiled pork", "Green onion", "Doenjang", "Red pepper"] },
        tags: ["국밥", "전통", "민속촌"],
                dupes: {
          US: {
            name: { ko: "텍사스 칠리", ja: "テキサスチリ", en: "Texas Chili" },
            tasteProfile: { sweet: 8, salty: 42, spicy: 55, umami: 72, sour: 8 },
            description: { ko: "소고기와 고추를 오래 끓인 미국 텍사스식 진한 스튜", ja: "牛肉とチリを長時間煮込んだテキサス風濃厚シチュー", en: "Thick Texas-style stew of slow-cooked beef and dried chili" },
            ingredients: { ko: ["소고기", "안초 칠레", "큐민", "마늘", "양파", "소고기 육수"], ja: ["牛肉", "アンチョチリ", "クミン", "にんにく", "玉ねぎ", "牛スープ"], en: ["beef", "ancho chile", "cumin", "garlic", "onion", "beef broth"] },
            similarityPercent: 82,
            matchReason: { ko: "소고기를 진한 국물에 오래 끓여 밥이나 빵과 먹는 방식이 용인 장터국밥과 유사합니다.", ja: "牛肉を濃いスープで長時間煮込んでご飯やパンと食べる方式が용인 장터국밥に似ています。", en: "Both are slow-cooked beef stews served as a complete meal — Texas chili over rice/cornbread, gukbap in broth." }
          },
          MX: {
            name: { ko: "비리아 꼰소메", ja: "ビリアコンソメ", en: "Birria Consomé" },
            tasteProfile: { sweet: 5, salty: 40, spicy: 45, umami: 75, sour: 12 },
            description: { ko: "고추와 향신료로 끓인 진한 소고기 국물에 고기를 담은 멕시코 요리", ja: "唐辛子と香辛料で煮込んだ濃厚牛肉スープに肉を入れたメキシコ料理", en: "Mexican dish of slow-cooked beef in rich chili-spice consomé" },
            ingredients: { ko: ["소고기", "과히요 칠레", "시나몬", "오레가노", "양파", "토마토"], ja: ["牛肉", "グアヒーヨチリ", "シナモン", "オレガノ", "玉ねぎ", "トマト"], en: ["beef", "guajillo chile", "cinnamon", "oregano", "onion", "tomato"] },
            similarityPercent: 85,
            matchReason: { ko: "소고기를 향신료 국물에 끓여 고기와 국물을 함께 먹는 방식이 장터국밥과 거의 동일합니다.", ja: "牛肉を香辛料スープで煮て肉とスープを一緒に食べる方式が장터국밥にほぼ同じです。", en: "Both are beef-in-broth dishes where you eat the meat submerged in its rich cooking liquid — nearly the same concept." }
          },
          JP: {
            name: { ko: "규동", ja: "牛丼", en: "Gyudon" },
            tasteProfile: { sweet: 20, salty: 45, spicy: 5, umami: 70, sour: 5 },
            description: { ko: "달콤짭짤한 소고기를 밥 위에 올린 일본식 소고기 덮밥", ja: "甘辛い牛肉をご飯の上に乗せた日本風牛丼", en: "Japanese beef bowl with sweetly simmered beef on rice" },
            ingredients: { ko: ["소고기", "양파", "간장", "미림", "설탕", "쌀"], ja: ["牛肉", "玉ねぎ", "醤油", "みりん", "砂糖", "米"], en: ["beef", "onion", "soy sauce", "mirin", "sugar", "rice"] },
            similarityPercent: 78,
            matchReason: { ko: "소고기를 간장 국물에 조려 밥과 함께 먹는 방식이 장터국밥과 유사합니다.", ja: "牛肉を醤油だしで煮てご飯と食べる方式が장터국밥に似ています。", en: "Both are beef-and-rice dishes where the beef is simmered in a savory sauce — gukbap has broth while gyudon is a bowl." }
          }
        }
      },
      {
        id: "yongin-nurungji-baeksuk",
        name: { ko: "누룽지 백숙", ja: "おこげ白熟鶏", en: "Nurungji Baeksuk" },
        region: "yongin",
        image: "/images/food/누룽지백숙.png",
        tasteProfile: { sweet: 15, salty: 40, spicy: 5, umami: 85, sour: 5 },
        storyDescription: {
          ko: "닭을 통째로 푹 끓인 백숙에 누룽지를 더해 구수함을 배로 끌어올린 용인의 별미예요. 닭 국물이 누룽지 속으로 스며들면서 걸쭉하고 고소해지는 국물의 변신이 마법 같고, 마지막 한 방울까지 아까운 맛이에요.",
          ja: "丸鶏をじっくり煮込んだ白熟鶏におこげを加えて香ばしさを倍増させた龍仁の珍味です。鶏のスープがおこげに染み込んでとろみが出て香ばしくなるスープの変身が魔法のようで、最後の一滴まで惜しい味です。",
          en: "Yongin's specialty: a classic whole-chicken baeksuk elevated with crispy scorched rice nurungji. As the rich chicken broth seeps into the nurungji, it transforms into a thick, nutty elixir — every last drop is too precious to waste."
        },
        ingredients: { ko: ["닭", "누룽지", "찹쌀", "인삼", "마늘", "대추", "밤", "소금"], ja: ["鶏", "おこげ", "もち米", "高麗人参", "ニンニク", "なつめ", "栗", "塩"], en: ["Whole chicken", "Scorched rice", "Glutinous rice", "Ginseng", "Garlic", "Jujube", "Chestnut", "Salt"] },
        tags: ["백숙", "누룽지", "보양"],
                dupes: {
          CN: {
            name: { ko: "궈바탕", ja: "鍋巴湯", en: "Guoba Tang" },
            tasteProfile: { sweet: 8, salty: 40, spicy: 5, umami: 65, sour: 3 },
            description: { ko: "누룽지를 뜨거운 육수에 넣어 끓인 중국식 눌은밥 수프", ja: "おこげを熱いスープに入れて煮た中国風焦げご飯スープ", en: "Chinese soup made by dropping crispy rice crust into hot broth" },
            ingredients: { ko: ["눌은밥", "닭고기", "생강", "대파", "소금", "참기름"], ja: ["おこげ", "鶏肉", "生姜", "長ねぎ", "塩", "ごま油"], en: ["crispy rice crust", "chicken", "ginger", "leek", "salt", "sesame oil"] },
            similarityPercent: 92,
            matchReason: { ko: "누룽지를 닭 육수에 넣어 먹는 방식이 용인 누룽지백숙과 거의 동일합니다.", ja: "おこげを鶏スープに入れて食べる方式が용인 누룽지백숙にほぼ同じです。", en: "Crispy rice crust dropped into chicken broth — structurally identical to nurungji baeksuk." }
          },
          FR: {
            name: { ko: "치킨 프리카세", ja: "チキンフリカッセ", en: "Chicken Fricassée" },
            tasteProfile: { sweet: 10, salty: 38, spicy: 3, umami: 65, sour: 8 },
            description: { ko: "닭고기를 크림 소스에 오래 끓인 프랑스 전통 닭 찜 요리", ja: "鶏肉をクリームソースで長時間煮込んだフランス伝統の鶏蒸し料理", en: "Traditional French braised chicken cooked in creamy white sauce" },
            ingredients: { ko: ["닭고기", "양파", "버섯", "크림", "화이트와인", "타임"], ja: ["鶏肉", "玉ねぎ", "きのこ", "クリーム", "白ワイン", "タイム"], en: ["chicken", "onion", "mushroom", "cream", "white wine", "thyme"] },
            similarityPercent: 80,
            matchReason: { ko: "닭고기를 오래 끓여 부드럽게 만든 찜 요리라는 점에서 백숙과 유사합니다.", ja: "鶏肉を長時間煮て柔らかくした蒸し料理という点で백숙と似ています。", en: "Both slow-cook chicken until tender in a flavorful liquid — fricassée uses cream while baeksuk uses clear broth." }
          },
          JP: {
            name: { ko: "미조레 나베", ja: "みぞれ鍋", en: "Mizore Nabe" },
            tasteProfile: { sweet: 8, salty: 38, spicy: 5, umami: 60, sour: 5 },
            description: { ko: "간 무를 눈처럼 올린 일본식 닭고기 전골", ja: "大根おろしを雪のように乗せた日本風鶏肉鍋", en: "Japanese hot pot with grated daikon floating on chicken broth like snowflakes" },
            ingredients: { ko: ["닭고기", "무", "두부", "배추", "다시마", "폰즈"], ja: ["鶏肉", "大根おろし", "豆腐", "白菜", "昆布", "ポン酢"], en: ["chicken", "grated daikon", "tofu", "napa cabbage", "kombu", "ponzu"] },
            similarityPercent: 75,
            matchReason: { ko: "닭고기를 맑은 육수에 넣어 채소와 함께 먹는 전골 방식이 백숙과 유사합니다.", ja: "鶏肉を澄んだスープで野菜と一緒に食べる鍋の方式が백숙と似ています。", en: "Both are clear-broth chicken and vegetable hot pots emphasizing the natural flavor of the chicken." }
          }
        }
      },
      {
        id: "yongin-pajeon",
        name: { ko: "민속촌 파전", ja: "民俗村パジョン", en: "Folk Village Pajeon" },
        region: "yongin",
        image: "/images/food/민속촌파전.png",
        tasteProfile: { sweet: 15, salty: 50, spicy: 20, umami: 65, sour: 15 },
        storyDescription: {
          ko: "한국 민속촌에서 굽는 커다란 파전이에요. 바깥은 바삭하고 안은 촉촉하게 구워진 두툼한 파전에, 새콤달콤한 간장 양념을 찍어 먹으면 막걸리 한 잔이 절로 생각난답니다.",
          ja: "韓国民俗村で焼く大きなパジョンです。外はカリカリ、中はしっとり焼き上がった厚みのあるパジョンに、甘酸っぱい醤油ダレを付けて食べると、マッコリが自然と恋しくなります。",
          en: "The oversized pajeon grilled at the Korean Folk Village. Crispy on the outside, moist and soft inside — dip this thick scallion pancake in sweet-sour soy sauce and you'll instinctively reach for a cup of makgeolli."
        },
        ingredients: { ko: ["쪽파", "밀가루", "달걀", "해산물", "간장", "식초", "고추"], ja: ["小ネギ", "小麦粉", "卵", "海産物", "醤油", "酢", "唐辛子"], en: ["Green onion", "Wheat flour", "Egg", "Seafood", "Soy sauce", "Vinegar", "Pepper"] },
        tags: ["파전", "전통", "안주"],
                dupes: {
          IT: {
            name: { ko: "프루티 디 마레 프리타타", ja: "フルッティディマーレフリッタータ", en: "Frutti di Mare Frittata" },
            tasteProfile: { sweet: 8, salty: 42, spicy: 5, umami: 72, sour: 8 },
            description: { ko: "각종 해산물을 달걀에 섞어 구운 이탈리아식 해산물 달걀 부침", ja: "各種海産物を卵に混ぜて焼いたイタリア風海鮮卵焼き", en: "Italian egg cake with mixed seafood baked in a pan" },
            ingredients: { ko: ["달걀", "오징어", "새우", "홍합", "파슬리", "올리브오일"], ja: ["卵", "イカ", "エビ", "ムール貝", "パセリ", "オリーブオイル"], en: ["egg", "squid", "shrimp", "mussel", "parsley", "olive oil"] },
            similarityPercent: 85,
            matchReason: { ko: "해산물과 달걀을 팬에 납작하게 구운 요리라는 점에서 용인 파전과 구조가 유사합니다.", ja: "海産物と卵をフライパンで平たく焼いた料理という点で용인 파전と構造が似ています。", en: "Both are flat pan-fried dishes combining seafood and egg batter — the same savory pancake concept." }
          },
          MY: {
            name: { ko: "오타 오타", ja: "オタオタ", en: "Otak Otak" },
            tasteProfile: { sweet: 10, salty: 38, spicy: 30, umami: 65, sour: 8 },
            description: { ko: "향신료를 넣은 생선 반죽을 바나나 잎에 싸 구운 말레이시아 간식", ja: "香辛料入りの魚のすり身をバナナの葉で包んで焼くマレーシアのおやつ", en: "Malaysian grilled fish paste wrapped in banana leaf with spices" },
            ingredients: { ko: ["생선살", "코코넛밀크", "레몬그라스", "강황", "갈랑갈", "고추"], ja: ["魚のすり身", "ココナッツミルク", "レモングラス", "ウコン", "ガランガル", "唐辛子"], en: ["fish paste", "coconut milk", "lemongrass", "turmeric", "galangal", "chili"] },
            similarityPercent: 72,
            matchReason: { ko: "해산물 반죽을 구워낸 납작한 요리라는 점에서 파전과 유사합니다.", ja: "海産物のすり身を焼いた平たい料理という点でパジョンと似ています。", en: "Both are flat savory seafood cakes cooked over heat — different binders but the same concept." }
          },
          JP: {
            name: { ko: "카이센 지짐이", ja: "海鮮チヂミ", en: "Kaisen Chijimi" },
            tasteProfile: { sweet: 8, salty: 42, spicy: 8, umami: 70, sour: 8 },
            description: { ko: "각종 해산물을 넣어 구운 일본식 해물 부침개", ja: "各種海産物を入れて焼いた日本風海鮮チヂミ", en: "Japanese-style seafood pancake filled with mixed seafood" },
            ingredients: { ko: ["밀가루", "달걀", "새우", "오징어", "파", "참기름"], ja: ["小麦粉", "卵", "エビ", "イカ", "ねぎ", "ごま油"], en: ["wheat flour", "egg", "shrimp", "squid", "scallion", "sesame oil"] },
            similarityPercent: 90,
            matchReason: { ko: "해산물과 파를 넣은 납작한 부침개로 용인 파전과 거의 동일합니다.", ja: "海産物とねぎを入れた平たいチヂミで、용인 파전にほぼ同じです。", en: "Seafood and scallion pancake — virtually identical to pajeon in structure and flavor." }
          }
        }
      },
      {
        id: "yongin-makguksu",
        name: { ko: "수지 막국수", ja: "水枝マックッス", en: "Suji Makguksu" },
        region: "yongin",
        image: "/images/food/수지막국수.png",
        tasteProfile: { sweet: 20, salty: 45, spicy: 55, umami: 60, sour: 35 },
        storyDescription: {
          ko: "메밀로 만든 차갑고 탄력 있는 면에 양념장을 비벼 먹는 막국수예요. 수지 지역의 막국수는 특히 메밀 향이 진하고, 새콤매콤한 양념이 면 한 올 한 올에 스며들어 있어 여름 별미로 손꼽힌답니다.",
          ja: "そば粉で作った冷たくて弾力のある麺にヤンニョムジャンを和えて食べるマックッスです。水枝地域のマックッスは特にそばの香りが濃く、甘酸っぱくて辛い薬味が麺の一本一本に染み込んでいて、夏の珍味として名高いです。",
          en: "Cold, springy buckwheat noodles tossed in spicy-tangy seasoning sauce. Suji's makguksu is especially prized for its pronounced buckwheat fragrance, with the sweet-spicy-sour sauce penetrating every single strand — a top summer delicacy."
        },
        ingredients: { ko: ["메밀 면", "양념장", "오이", "계란", "깍두기", "겨자", "식초"], ja: ["そば麺", "ヤンニョムジャン", "きゅうり", "卵", "カクテキ", "からし", "酢"], en: ["Buckwheat noodles", "Spicy sauce", "Cucumber", "Egg", "Radish kimchi", "Mustard", "Vinegar"] },
        tags: ["메밀", "냉면", "여름"],
                dupes: {
          IT: {
            name: { ko: "콜드 파스타", ja: "冷製パスタ", en: "Pasta Fredda" },
            tasteProfile: { sweet: 5, salty: 38, spicy: 5, umami: 55, sour: 20 },
            description: { ko: "여름에 차갑게 먹는 이탈리아식 냉 파스타 샐러드", ja: "夏に冷たくして食べるイタリア風冷製パスタサラダ", en: "Italian cold pasta salad served chilled in summer" },
            ingredients: { ko: ["파스타", "올리브오일", "케이퍼", "토마토", "바질", "레몬"], ja: ["パスタ", "オリーブオイル", "ケッパー", "トマト", "バジル", "レモン"], en: ["pasta", "olive oil", "capers", "tomato", "basil", "lemon"] },
            similarityPercent: 80,
            matchReason: { ko: "면을 차갑게 먹는 여름 요리라는 점에서 막국수와 유사합니다.", ja: "麺を冷たくして食べる夏料理という点で막국수と似ています。", en: "Both are cold noodle dishes designed for summer — pasta fredda uses wheat noodles with olive oil while makguksu uses buckwheat with vinegar." }
          },
          CN: {
            name: { ko: "량빤 차오멘", ja: "涼拌炒麺", en: "Liangban Chaomian" },
            tasteProfile: { sweet: 8, salty: 42, spicy: 20, umami: 58, sour: 22 },
            description: { ko: "볶은 면을 식혀 식초와 고추기름으로 버무린 중국 냉면 요리", ja: "炒めた麺を冷やして酢と唐辛子油で和えた中国の冷麺料理", en: "Chinese cold noodles made from chilled stir-fried noodles tossed with vinegar and chili oil" },
            ingredients: { ko: ["밀면", "식초", "고추기름", "마늘", "간장", "참기름"], ja: ["中華麺", "酢", "唐辛子油", "にんにく", "醤油", "ごま油"], en: ["wheat noodles", "vinegar", "chili oil", "garlic", "soy sauce", "sesame oil"] },
            similarityPercent: 85,
            matchReason: { ko: "식초로 새콤하게 무친 냉면이라는 점에서 막국수와 맛 구조가 매우 유사합니다.", ja: "酢で酸っぱく和えた冷麺という点で막국수と風味構造が非常に似ています。", en: "Both are cold noodles tossed with vinegar and spicy oil — same sweet-sour-spicy flavor profile." }
          },
          JP: {
            name: { ko: "메밀 소바", ja: "ざるそば", en: "Zaru Soba" },
            tasteProfile: { sweet: 8, salty: 38, spicy: 5, umami: 60, sour: 8 },
            description: { ko: "차갑게 씻어 소바 다레에 찍어 먹는 일본식 냉 메밀국수", ja: "冷水で締めてそばつゆで食べる日本の冷たいそば", en: "Japanese cold buckwheat noodles served with dipping sauce" },
            ingredients: { ko: ["메밀가루", "밀가루", "다시", "간장", "미림", "와사비"], ja: ["そば粉", "小麦粉", "だし", "醤油", "みりん", "わさび"], en: ["buckwheat flour", "wheat flour", "dashi", "soy sauce", "mirin", "wasabi"] },
            similarityPercent: 88,
            matchReason: { ko: "차갑게 먹는 메밀국수로 용인 막국수와 가장 유사한 외국 음식입니다.", ja: "冷たく食べるそばで、용인 막국수に最も似ている外国料理です。", en: "Both are cold buckwheat noodle dishes — the closest foreign equivalent to makguksu." }
          }
        }
      },
      {
        id: "yongin-sanchae-bibimbap",
        name: { ko: "산채비빔밥", ja: "山菜ビビンバ", en: "Sanchae Bibimbap" },
        region: "yongin",
        image: "/images/food/산채비빔밥.png",
        tasteProfile: { sweet: 20, salty: 45, spicy: 50, umami: 65, sour: 20 },
        storyDescription: {
          ko: "경기도 산에서 채취한 고사리, 취나물, 참나물 등의 신선한 산나물을 밥 위에 소복이 올려 비벼 먹는 건강 비빔밥이에요. 나물마다 각기 다른 향과 식감이 어우러져 자연의 풍성함을 한 그릇에서 느낄 수 있어요.",
          ja: "京畿道の山で採れたわらび、シドケ、野芹などの新鮮な山菜をご飯の上にたっぷり乗せて混ぜて食べる健康ビビンバです。山菜それぞれの異なる香りと食感が調和して、自然の豊かさを一椀で感じることができます。",
          en: "A wholesome bibimbap loaded with freshly foraged mountain greens — bracken, wild sesame leaves, shepherd's purse — from the Gyeonggi mountains. Each vegetable offers its own distinct aroma and texture, delivering the full richness of nature in a single bowl."
        },
        ingredients: { ko: ["밥", "고사리", "취나물", "참나물", "도라지", "고추장", "참기름", "계란"], ja: ["ご飯", "わらび", "シドケ", "野芹", "桔梗", "コチュジャン", "ごま油", "卵"], en: ["Rice", "Bracken", "Aster scaber", "Wild parsley", "Bellflower root", "Gochujang", "Sesame oil", "Egg"] },
        tags: ["산나물", "비빔밥", "건강"],
                dupes: {
          US: {
            name: { ko: "퀴노아 샐러드 볼", ja: "キヌアサラダボウル", en: "Quinoa Salad Bowl" },
            tasteProfile: { sweet: 12, salty: 30, spicy: 5, umami: 40, sour: 20 },
            description: { ko: "퀴노아와 야채를 드레싱에 버무린 미국식 건강 샐러드 볼", ja: "キヌアと野菜をドレッシングで和えたアメリカ風ヘルシーサラダボウル", en: "American healthy grain bowl with quinoa, vegetables, and dressing" },
            ingredients: { ko: ["퀴노아", "케일", "아보카도", "토마토", "레몬 드레싱", "씨앗류"], ja: ["キヌア", "ケール", "アボカド", "トマト", "レモンドレッシング", "シード類"], en: ["quinoa", "kale", "avocado", "tomato", "lemon dressing", "seeds"] },
            similarityPercent: 82,
            matchReason: { ko: "곡물과 다양한 야채를 소스로 비벼 먹는 건강 한 그릇 요리라는 점에서 산채비빔밥과 개념이 동일합니다.", ja: "穀物と多様な野菜をソースで混ぜる健康的な一皿料理という点でサンチェビビンバとコンセプトが同じです。", en: "Both are grain bowls where grains and vegetables are mixed together with a sauce — same healthy bowl concept." }
          },
          ID: {
            name: { ko: "나시 짬뿌르", ja: "ナシチャンプル", en: "Nasi Campur" },
            tasteProfile: { sweet: 10, salty: 40, spicy: 25, umami: 60, sour: 8 },
            description: { ko: "밥에 다양한 반찬을 올려 비벼 먹는 인도네시아 혼합밥", ja: "ご飯に多彩なおかずを乗せて混ぜて食べるインドネシアの混ぜご飯", en: "Indonesian mixed rice dish topped with an assortment of side dishes" },
            ingredients: { ko: ["쌀", "삼발", "두부", "야채 볶음", "달걀", "새우 페이스트"], ja: ["米", "サンバル", "豆腐", "野菜炒め", "卵", "エビペースト"], en: ["rice", "sambal", "tofu", "stir-fried vegetables", "egg", "shrimp paste"] },
            similarityPercent: 88,
            matchReason: { ko: "밥 위에 다양한 재료를 올려 비벼 먹는 방식이 비빔밥과 동일합니다.", ja: "ご飯の上に多彩な具材を乗せて混ぜて食べる方式がビビンバと同じです。", en: "Both are mixed rice dishes where multiple toppings are combined with rice and sauce — identical concept." }
          },
          JP: {
            name: { ko: "산사이 덮밥", ja: "山菜丼", en: "Sansai Donburi" },
            tasteProfile: { sweet: 10, salty: 38, spicy: 5, umami: 62, sour: 5 },
            description: { ko: "산나물을 간장 소스에 볶아 밥 위에 올린 일본식 산채 덮밥", ja: "山菜を醤油ソースで炒めてご飯の上に乗せた日本風山菜丼", en: "Japanese rice bowl topped with mountain vegetables sautéed in soy sauce" },
            ingredients: { ko: ["쌀", "고사리", "두릅", "냉이", "간장", "미림"], ja: ["米", "わらび", "たらの芽", "なずな", "醤油", "みりん"], en: ["rice", "fern", "fatsia sprouts", "shepherd's purse", "soy sauce", "mirin"] },
            similarityPercent: 90,
            matchReason: { ko: "산나물을 올린 밥 요리로 용인 산채비빔밥과 거의 동일한 개념입니다.", ja: "山菜を乗せたご飯料理で용인 산채비빔밥にほぼ同じコンセプトです。", en: "Mountain vegetables over rice — nearly identical to sanchae bibimbap, the only difference being mixing vs. topping style." }
          }
        }
      },
      {
        id: "yongin-acorn-jelly",
        name: { ko: "도토리묵 무침", ja: "どんぐりゼリーサラダ", en: "Acorn Jelly Salad" },
        region: "yongin",
        image: "/images/food/도도리묵무침.png",
        tasteProfile: { sweet: 10, salty: 50, spicy: 40, umami: 55, sour: 25 },
        storyDescription: {
          ko: "도토리 전분으로 만든 촉촉하고 보들보들한 묵에 새콤매콤한 양념을 무친 요리예요. 쫀득한 식감과 구수한 도토리 향, 그리고 맵고 새콤한 양념이 한꺼번에 입 안을 자극하는 이 조화가 바로 한식의 매력이에요.",
          ja: "どんぐりのデンプンで作ったしっとりふわふわのゼリーに甘酸っぱくて辛い薬味を和えた料理です。もちもちした食感と香ばしいどんぐりの香り、そして辛くて酸っぱい薬味が一度に口を刺激するこの調和こそが韓国料理の魅力です。",
          en: "Silky acorn starch jelly dressed in a tangy, spicy seasoning. The chewy texture, nutty acorn aroma, and punchy sweet-spicy-sour dressing all hit at once — that harmonious complexity is exactly what makes Korean cuisine captivating."
        },
        ingredients: { ko: ["도토리묵", "간장", "참기름", "고춧가루", "파", "마늘", "깨", "식초"], ja: ["どんぐりゼリー", "醤油", "ごま油", "唐辛子粉", "ネギ", "ニンニク", "ごま", "酢"], en: ["Acorn jelly", "Soy sauce", "Sesame oil", "Red pepper flakes", "Green onion", "Garlic", "Sesame", "Vinegar"] },
        tags: ["묵", "도토리", "무침"],
                dupes: {
          CN: {
            name: { ko: "량빤 량펀", ja: "涼拌涼粉", en: "Liangban Liangfen" },
            tasteProfile: { sweet: 5, salty: 38, spicy: 25, umami: 50, sour: 20 },
            description: { ko: "녹두 전분 묵을 식초와 고추기름으로 무친 중국 냉채", ja: "緑豆でんぷんの寒天を酢と唐辛子油で和えた中国の冷菜", en: "Chinese cold dish of mung bean jelly tossed with vinegar and chili oil" },
            ingredients: { ko: ["녹두 전분", "식초", "고추기름", "마늘", "간장", "참기름"], ja: ["緑豆でんぷん", "酢", "唐辛子油", "にんにく", "醤油", "ごま油"], en: ["mung bean starch", "vinegar", "chili oil", "garlic", "soy sauce", "sesame oil"] },
            similarityPercent: 90,
            matchReason: { ko: "식물성 전분으로 만든 묵을 소스에 버무려 차갑게 먹는 방식이 도토리묵과 거의 동일합니다.", ja: "植物性でんぷんで作ったゼリーをソースで和えて冷たく食べる方式がどんぐり묵にほぼ同じです。", en: "Plant starch jelly tossed in vinegar-chili sauce — structurally identical to dotori muk." }
          },
          TH: {
            name: { ko: "얌 운센", ja: "ヤムウンセン", en: "Yam Woon Sen" },
            tasteProfile: { sweet: 10, salty: 38, spicy: 35, umami: 55, sour: 30 },
            description: { ko: "당면을 라임·고추 드레싱에 무친 태국식 냉채 샐러드", ja: "春雨をライム・唐辛子ドレッシングで和えたタイ風冷菜サラダ", en: "Thai glass noodle salad dressed with lime and chili" },
            ingredients: { ko: ["당면", "새우", "돼지고기", "라임즙", "고추", "피시소스"], ja: ["春雨", "エビ", "豚肉", "ライムジュース", "唐辛子", "ナンプラー"], en: ["glass noodles", "shrimp", "pork", "lime juice", "chili", "fish sauce"] },
            similarityPercent: 82,
            matchReason: { ko: "반투명 전분 묵이나 면을 새콤한 소스에 버무린 냉채라는 점에서 도토리묵무침과 유사합니다.", ja: "半透明でんぷんゼリーや麺を酸っぱいソースで和えた冷菜という点で似ています。", en: "Both are cold translucent starch-based dishes tossed in a tangy, savory dressing." }
          },
          MX: { challenge: true }
        }
      },
      {
        id: "yongin-hanwoo",
        name: { ko: "용인 한우 구이", ja: "龍仁韓牛焼肉", en: "Yongin Hanwoo Grilled Beef" },
        region: "yongin",
        image: "/images/food/한우구이.png",
        tasteProfile: { sweet: 20, salty: 45, spicy: 10, umami: 90, sour: 5 },
        storyDescription: {
          ko: "경기도 한우 고장 용인에서 만나는 프리미엄 한우 구이예요. 결이 고운 마블링이 불에 닿는 순간 지글지글 녹아내리면서 올라오는 고기 향이 식욕을 자극하고, 한 점만 먹어도 입 안 가득 풍미가 가득 차오른답니다.",
          ja: "京畿道の韓牛の里・龍仁で出会えるプレミアム韓牛焼肉です。細かいサシが火に触れた瞬間にジュージュー溶け出して立ち上る肉の香りが食欲をそそり、一切れ食べるだけで口いっぱいに旨味が広がります。",
          en: "Premium Hanwoo beef grilled in Yongin, Gyeonggi's prime beef country. The fine marbling sizzles and melts the instant it touches heat, sending up an aroma that ignites the appetite — just one piece and your mouth is flooded with flavor."
        },
        ingredients: { ko: ["한우 등심", "소금", "참기름", "마늘", "상추", "깻잎", "쌈장"], ja: ["韓牛サーロイン", "塩", "ごま油", "ニンニク", "サンチュ", "エゴマの葉", "サムジャン"], en: ["Hanwoo sirloin", "Salt", "Sesame oil", "Garlic", "Lettuce", "Perilla", "Ssamjang"] },
        tags: ["한우", "구이", "프리미엄"],
                dupes: {
          US: {
            name: { ko: "프라임 립아이", ja: "プライムリブアイ", en: "Prime Ribeye" },
            tasteProfile: { sweet: 5, salty: 38, spicy: 3, umami: 80, sour: 3 },
            description: { ko: "최고급 등급 소고기 립아이를 그릴이나 팬에 구운 미국식 스테이크", ja: "最高級グレードのリブアイを焼いたアメリカ風ステーキ", en: "American steak cut from prime grade ribeye, grilled or pan-seared" },
            ingredients: { ko: ["프라임 립아이", "버터", "마늘", "타임", "소금", "후추"], ja: ["プライムリブアイ", "バター", "にんにく", "タイム", "塩", "胡椒"], en: ["prime ribeye", "butter", "garlic", "thyme", "salt", "pepper"] },
            similarityPercent: 88,
            matchReason: { ko: "최고 등급 한우를 구운 요리로 용인 한우와 프라임 등급 구이 스테이크는 최상급 소고기 구이라는 공통점이 있습니다.", ja: "最高グレードの牛肉を焼く料理として、共通点があります。", en: "Both are top-grade beef grilled to highlight the natural marbling and flavor of premium cattle." }
          },
          FR: {
            name: { ko: "앙트르코트", ja: "アントルコート", en: "Entrecôte" },
            tasteProfile: { sweet: 5, salty: 35, spicy: 5, umami: 78, sour: 8 },
            description: { ko: "프랑스식 버터·허브 소스와 함께 낸 고급 소고기 등심 스테이크", ja: "バターハーブソースと共に供するフランス風高級牛肉ステーキ", en: "French premium beef steak served with herb butter sauce" },
            ingredients: { ko: ["소 등심", "버터", "에샬롯", "파슬리", "레드와인", "머스타드"], ja: ["牛サーロイン", "バター", "エシャロット", "パセリ", "赤ワイン", "マスタード"], en: ["beef sirloin", "butter", "shallot", "parsley", "red wine", "mustard"] },
            similarityPercent: 85,
            matchReason: { ko: "고품질 소고기를 구워 허브 소스와 함께 내는 방식이 용인 한우 구이와 유사합니다.", ja: "高品質牛肉を焼いてハーブソースと共に提供する方式が용인 한우 구이と似ています。", en: "Both are premium beef steaks where quality of the meat is the centerpiece, accompanied by complementary sauces." }
          },
          JP: {
            name: { ko: "와규 야키니쿠", ja: "和牛焼肉", en: "Wagyu Yakiniku" },
            tasteProfile: { sweet: 12, salty: 40, spicy: 5, umami: 85, sour: 5 },
            description: { ko: "최고급 와규를 숯불에 구워 특제 타레 소스에 찍어 먹는 일본 야키니쿠", ja: "最高級和牛を炭火で焼いて特製たれで食べる日本の焼肉", en: "Japanese premium wagyu grilled on charcoal and dipped in special tare sauce" },
            ingredients: { ko: ["와규", "숯", "간장 타레", "참기름", "마늘", "파"], ja: ["和牛", "炭", "醤油たれ", "ごま油", "にんにく", "ねぎ"], en: ["wagyu beef", "charcoal", "soy tare", "sesame oil", "garlic", "scallion"] },
            similarityPercent: 92,
            matchReason: { ko: "최고급 소고기를 직화로 구워 양념 소스에 찍어 먹는 방식이 용인 한우 구이와 동일합니다.", ja: "最高級牛肉を直火で焼いてたれソースで食べる方式が용인 한우 구이と同じです。", en: "Both are premium beef grilled over direct heat and dipped in soy-based sauce — same dining style." }
          }
        }
      },
      {
        id: "yongin-cafe-dessert",
        name: { ko: "보정동 카페거리 디저트", ja: "保亭洞カフェ通りデザート", en: "Bojeongdong Cafe Street Dessert" },
        region: "yongin",
        image: "/images/food/보정동카페거리디저트.png",
        tasteProfile: { sweet: 75, salty: 10, spicy: 0, umami: 15, sour: 20 },
        storyDescription: {
          ko: "용인 보정동 카페거리는 경기도 최대의 카페 밀집 지역이에요. 이 거리에서 즐기는 개성 넘치는 케이크, 크리스피 크로넛, 달콤한 음료들은 SNS 감성을 자극하면서도, 한 입 먹으면 그 맛이 진짜임을 증명해낸답니다.",
          ja: "龍仁の保亭洞カフェ通りは京畿道最大のカフェ集積地です。この通りで楽しめる個性あふれるケーキ、クリスピークロナッツ、甘い飲み物は、SNS映えしながらも一口食べるとその本物の味を証明してくれます。",
          en: "Bojeongdong Cafe Street in Yongin is Gyeonggi's largest cafe hub. The eclectic cakes, crispy cronuts, and artisanal drinks here look amazing on social media — and the moment you taste them, you know the beauty isn't just visual."
        },
        ingredients: { ko: ["밀가루", "버터", "생크림", "계절 과일", "초콜릿", "설탕"], ja: ["小麦粉", "バター", "生クリーム", "旬のフルーツ", "チョコレート", "砂糖"], en: ["Flour", "Butter", "Heavy cream", "Seasonal fruit", "Chocolate", "Sugar"] },
        tags: ["카페", "디저트", "트렌디"],
                dupes: {
          FR: {
            name: { ko: "파티스리 마카롱", ja: "パティスリーマカロン", en: "Patisserie Macaron" },
            tasteProfile: { sweet: 80, salty: 3, spicy: 0, umami: 5, sour: 8 },
            description: { ko: "색색의 아몬드 머랭 쿠키 사이에 크림을 채운 프랑스 고급 과자", ja: "色とりどりのアーモンドメレンゲクッキーにクリームを挟んだフランスの高級菓子", en: "French premium confection of colorful almond meringue cookies sandwiched with cream" },
            ingredients: { ko: ["아몬드가루", "슈가파우더", "달걀흰자", "버터크림", "설탕"], ja: ["アーモンドパウダー", "粉砂糖", "卵白", "バタークリーム", "砂糖"], en: ["almond flour", "powdered sugar", "egg white", "buttercream", "sugar"] },
            similarityPercent: 85,
            matchReason: { ko: "인스타그래머블한 비주얼과 트렌디한 맛을 추구하는 고급 디저트 카페 문화가 용인 카페 디저트와 동일합니다.", ja: "インスタ映えするビジュアルとトレンディな味を追求する高級デザートカフェ文化が同じです。", en: "Both represent artisan, visually stunning café desserts where presentation and flavor innovation are paramount." }
          },
          IT: {
            name: { ko: "아포가토", ja: "アフォガート", en: "Affogato" },
            tasteProfile: { sweet: 60, salty: 3, spicy: 0, umami: 8, sour: 10 },
            description: { ko: "에스프레소를 바닐라 아이스크림 위에 부어 만든 이탈리아 디저트", ja: "エスプレッソをバニラアイスクリームに注いだイタリアのデザート", en: "Italian dessert of a shot of espresso poured over vanilla ice cream" },
            ingredients: { ko: ["에스프레소", "바닐라 아이스크림", "아몬드 비스코티"], ja: ["エスプレッソ", "バニラアイスクリーム", "アーモンドビスコッティ"], en: ["espresso", "vanilla ice cream", "almond biscotti"] },
            similarityPercent: 78,
            matchReason: { ko: "카페 음료와 디저트를 결합한 트렌디한 카페 메뉴라는 점에서 용인 카페 디저트와 유사합니다.", ja: "カフェドリンクとデザートを組み合わせたトレンディーなカフェメニューという点で似ています。", en: "Both are café desserts that combine a hot beverage element with a sweet, creamy component." }
          },
          JP: {
            name: { ko: "트렌디 와가시", ja: "トレンドの和菓子", en: "Trendy Wagashi" },
            tasteProfile: { sweet: 68, salty: 3, spicy: 0, umami: 8, sour: 5 },
            description: { ko: "현대적 비주얼과 재료를 결합한 신감각 일본 화과자", ja: "現代的なビジュアルと食材を組み合わせた新感覚の和菓子", en: "Modern Japanese wagashi combining traditional techniques with contemporary flavors" },
            ingredients: { ko: ["팥앙금", "말차", "딸기", "유자", "쌀가루", "설탕"], ja: ["あんこ", "抹茶", "いちご", "ゆず", "米粉", "砂糖"], en: ["red bean paste", "matcha", "strawberry", "yuzu", "rice flour", "sugar"] },
            similarityPercent: 82,
            matchReason: { ko: "전통 재료를 현대적 비주얼로 재해석한 트렌디한 카페 디저트라는 점에서 용인 카페 디저트와 유사합니다.", ja: "伝統的な食材を現代的なビジュアルに再解釈したトレンディーなカフェデザートという点で似ています。", en: "Both reinvent traditional ingredients with modern aesthetics — the artisan café dessert philosophy is shared." }
          }
        }
      },
      {
        id: "yongin-makgeolli",
        name: { ko: "용인 막걸리", ja: "龍仁マッコリ", en: "Yongin Makgeolli" },
        region: "yongin",
        image: "/images/food/막걸리.png",
        tasteProfile: { sweet: 40, salty: 10, spicy: 5, umami: 30, sour: 45 },
        storyDescription: {
          ko: "용인 지역의 전통 양조장에서 빚어낸 생막걸리예요. 탁하고 뽀얀 빛깔 속에 은은한 단맛과 알싸한 신맛이 균형을 이루고 있어, 파전이나 두부김치 한 접시와 함께하면 민속촌 마당에서 마시는 것 같은 낭만이 있답니다.",
          ja: "龍仁地域の伝統的な醸造所で醸した生マッコリです。白濁した見た目の中に、ほのかな甘みとピリッとした酸味が均衡を保っており、パジョンや豆腐キムチと一緒に楽しむと、民俗村の庭で飲んでいるような浪漫があります。",
          en: "Freshly brewed makgeolli from Yongin's traditional brewery. The milky white liquid balances gentle sweetness with bright tanginess — paired with pajeon or dubu kimchi, you feel like you're drinking in the courtyard of the Korean Folk Village."
        },
        ingredients: { ko: ["쌀", "누룩", "물", "효모"], ja: ["米", "麹", "水", "酵母"], en: ["Rice", "Nuruk (koji)", "Water", "Yeast"] },
        tags: ["막걸리", "전통주", "발효"],
                dupes: {
          MX: {
            name: { ko: "풀케", ja: "プルケ", en: "Pulque" },
            tasteProfile: { sweet: 15, salty: 3, spicy: 0, umami: 15, sour: 35 },
            description: { ko: "아가베 수액을 발효한 멕시코 전통 발효 음료", ja: "アガベの樹液を発酵させたメキシコ伝統発酵飲料", en: "Traditional Mexican fermented beverage made from agave sap" },
            ingredients: { ko: ["아가베 수액", "천연 발효균"], ja: ["アガベの樹液", "天然発酵菌"], en: ["agave sap", "natural fermentation cultures"] },
            similarityPercent: 88,
            matchReason: { ko: "식물성 수액을 자연 발효해 만든 전통 발효 음료라는 점에서 막걸리와 개념이 동일합니다.", ja: "植物性液体を自然発酵させた伝統発酵飲料という点で막걸리とコンセプトが同じです。", en: "Both are naturally fermented plant-based traditional beverages with a milky appearance and slight effervescence." }
          },
          FR: {
            name: { ko: "내추럴 펫낫", ja: "ナチュラルペットナット", en: "Natural Pét-Nat" },
            tasteProfile: { sweet: 10, salty: 2, spicy: 0, umami: 8, sour: 30 },
            description: { ko: "자연 발효로 거품을 만드는 프랑스식 내추럴 발포 와인", ja: "自然発酵で泡立てるフランス風ナチュラルスパークリングワイン", en: "French natural sparkling wine with effervescence from native yeast fermentation" },
            ingredients: { ko: ["포도즙", "천연 효모"], ja: ["ぶどう汁", "天然酵母"], en: ["grape juice", "native yeast"] },
            similarityPercent: 80,
            matchReason: { ko: "천연 발효로 만든 가벼운 발포 알코올 음료라는 점에서 막걸리와 유사합니다.", ja: "天然発酵で作る軽い発泡アルコール飲料という点で막걸리と似ています。", en: "Both are naturally fermented, lightly sparkling alcoholic beverages made without added chemicals." }
          },
          JP: {
            name: { ko: "니고리자케", ja: "にごり酒", en: "Nigori Sake" },
            tasteProfile: { sweet: 20, salty: 3, spicy: 0, umami: 18, sour: 12 },
            description: { ko: "쌀을 발효해 걸러낸 뿌연 일본식 탁주", ja: "米を発酵させてこしたにごった日本の濁り酒", en: "Japanese cloudy sake made from fermented rice, coarsely filtered" },
            ingredients: { ko: ["쌀", "누룩", "물"], ja: ["米", "麹", "水"], en: ["rice", "koji", "water"] },
            similarityPercent: 92,
            matchReason: { ko: "쌀을 발효해 만든 뿌연 탁주로 막걸리와 거의 동일한 음료입니다.", ja: "米を発酵させた濁り酒で막걸리とほぼ同じ飲み物です。", en: "Both are cloudy, unfiltered rice wines made by fermenting rice with yeast cultures — nearly identical beverages." }
          }
        }
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
        image: "/images/food/이천쌀밥정식.png",
        tasteProfile: { sweet: 25, salty: 45, spicy: 25, umami: 75, sour: 10 },
        storyDescription: {
          ko: "임금님 수라상에 올랐다는 이천 쌀로 지은 밥은 한 톨 한 톨이 탱글탱글하고 윤기가 자르르 흘러요. 이 밥을 중심으로 구성된 정식 한 상을 받으면, 밥 그 자체가 주인공인 식사가 이런 것이구나 하는 감동을 받게 된답니다.",
          ja: "王様の食卓に上がったという利川のお米で炊いたご飯は、粒一粒がぷりぷりでツヤツヤ光り輝いています。このご飯を中心に構成された定食一膳を受け取ると、ご飯そのものが主役の食事とはこういうことかという感動を覚えます。",
          en: "Icheon rice — once presented at the royal table — shines with plump, glistening grains. When a full rice table set arrives centered on this legendary rice, you finally understand what it means for rice itself to be the star of a meal."
        },
        ingredients: { ko: ["이천 쌀", "된장찌개", "나물 반찬", "구이", "김치", "계란", "멸치볶음"], ja: ["利川米", "味噌チゲ", "ナムルおかず", "焼き物", "キムチ", "卵", "炒めじゃこ"], en: ["Icheon rice", "Doenjang jjigae", "Namul side dishes", "Grilled dish", "Kimchi", "Egg", "Stir-fried anchovy"] },
        tags: ["쌀밥", "정식", "임금님"],
                dupes: {
          TH: {
            name: { ko: "자스민 라이스 한상", ja: "ジャスミンライスの膳", en: "Jasmine Rice Set" },
            tasteProfile: { sweet: 12, salty: 38, spicy: 15, umami: 58, sour: 8 },
            description: { ko: "향기로운 태국 자스민 쌀밥을 중심으로 여러 반찬을 곁들인 한상", ja: "香り豊かなタイのジャスミン米を中心にした多品目の膳", en: "Thai jasmine rice served at the center of an array of side dishes" },
            ingredients: { ko: ["자스민 쌀", "그린커리", "팟타이", "솜탐", "코코넛밀크"], ja: ["ジャスミン米", "グリーンカレー", "パッタイ", "ソムタム", "ココナッツミルク"], en: ["jasmine rice", "green curry", "pad thai", "som tam", "coconut milk"] },
            similarityPercent: 85,
            matchReason: { ko: "향기로운 쌀밥을 중심으로 다양한 반찬을 곁들여 한 상에 차리는 방식이 이천 쌀 정식과 동일합니다.", ja: "香り豊かなご飯を中心に多彩なおかずを一膳に並べる方式が이천 쌀 정식と同じです。", en: "Both center premium aromatic rice as the star of a full-course spread with multiple accompaniments." }
          },
          IN: {
            name: { ko: "바스마티 탈리", ja: "バスマティタリ", en: "Basmati Thali" },
            tasteProfile: { sweet: 10, salty: 40, spicy: 35, umami: 60, sour: 12 },
            description: { ko: "향기로운 바스마티 쌀과 다양한 카레, 채소 요리를 한 쟁반에 담은 인도 정식", ja: "バスマティ米と多種のカレーや野菜料理を一枚の大皿に盛ったインドの定食", en: "Indian set meal with aromatic basmati rice and assorted curries on a large platter" },
            ingredients: { ko: ["바스마티 쌀", "달 커리", "사브지", "라이타", "파파담", "처트니"], ja: ["バスマティ米", "ダルカレー", "サブジ", "ライタ", "パパダム", "チャツネ"], en: ["basmati rice", "dal curry", "sabzi", "raita", "papadam", "chutney"] },
            similarityPercent: 82,
            matchReason: { ko: "최고급 쌀을 중심으로 다양한 반찬이 한 쟁반에 차려지는 방식이 이천 쌀 정식과 동일합니다.", ja: "高品質のご飯を中心に多彩なおかずが一つのプレートに並ぶ方式が이천 쌀 정식と同じです。", en: "Both are full-meal rice spreads where premium aromatic rice is the centerpiece surrounded by varied accompaniments." }
          },
          JP: {
            name: { ko: "고시히카리 가마솥밥", ja: "コシヒカリ釜飯", en: "Koshihikari Kamameshi" },
            tasteProfile: { sweet: 10, salty: 35, spicy: 3, umami: 55, sour: 3 },
            description: { ko: "고시히카리 쌀을 가마솥에 지어 다양한 재료와 함께 낸 일본 전통 솥밥", ja: "コシヒカリを釜で炊いて多彩な具材と共に提供する日本の伝統釜飯", en: "Japanese traditional pot rice made with premium Koshihikari and served with seasonal toppings" },
            ingredients: { ko: ["고시히카리", "표고버섯", "당근", "유부", "간장", "미림"], ja: ["コシヒカリ", "椎茸", "にんじん", "油揚げ", "醤油", "みりん"], en: ["koshihikari rice", "shiitake", "carrot", "tofu pouch", "soy sauce", "mirin"] },
            similarityPercent: 90,
            matchReason: { ko: "프리미엄 쌀을 솥에 지어 반찬과 함께 먹는 방식이 이천 쌀 정식과 거의 동일합니다.", ja: "プレミアム米を釜で炊いておかずと食べる方式が이천 쌀 정식にほぼ同じです。", en: "Both feature premium rice cooked in a pot as the hero of the meal, served with side dishes." }
          }
        }
      },
      {
        id: "icheon-bori-gulbi",
        name: { ko: "보리굴비", ja: "麦塩干しグルビ", en: "Bori Gulbi" },
        region: "icheon",
        image: "/images/food/보리굴비.png",
        tasteProfile: { sweet: 10, salty: 70, spicy: 10, umami: 85, sour: 5 },
        storyDescription: {
          ko: "참조기를 소금에 절여 보리 속에서 서서히 숙성시킨 전통 건생선이에요. 수분이 빠지면서 응축된 감칠맛이 놀랍도록 진해지고, 따뜻한 밥 위에 한 점 올려 먹으면 다른 반찬이 필요 없는 밥도둑이 된답니다.",
          ja: "真グチを塩漬けにして麦の中でゆっくり熟成させた伝統的な干し魚です。水分が抜けることで凝縮された旨味が驚くほど濃厚になり、温かいご飯の上に一切れ乗せて食べると、他のおかずが要らないご飯泥棒になります。",
          en: "Yellow corvina salted and slowly aged inside barley — a traditional dried fish. As moisture evaporates, the concentrated umami becomes breathtakingly intense. One piece over warm rice and you need no other side dish."
        },
        ingredients: { ko: ["참조기", "천일염", "보리", "시간"], ja: ["真グチ", "天日塩", "麦", "時間"], en: ["Yellow corvina", "Sea salt", "Barley", "Time (aging)"] },
        tags: ["건생선", "숙성", "전통"],
                dupes: {
          ES: {
            name: { ko: "바칼라오", ja: "バカラオ", en: "Bacalao" },
            tasteProfile: { sweet: 5, salty: 55, spicy: 8, umami: 72, sour: 5 },
            description: { ko: "소금에 절여 건조한 스페인·포르투갈 전통 건조 생선 요리", ja: "塩漬けにして乾燥させたスペイン・ポルトガル伝統の乾燥魚料理", en: "Traditional Spanish/Portuguese salted and dried codfish dish" },
            ingredients: { ko: ["대구", "굵은소금", "올리브오일", "마늘", "감자", "피망"], ja: ["タラ", "粗塩", "オリーブオイル", "にんにく", "じゃがいも", "ピーマン"], en: ["cod", "coarse salt", "olive oil", "garlic", "potato", "bell pepper"] },
            similarityPercent: 88,
            matchReason: { ko: "소금에 절여 건조한 생선을 조리하는 방식이 굴비와 동일한 개념입니다.", ja: "塩漬けにして乾燥させた魚を調理する方式がグルビと同じコンセプトです。", en: "Both are salted and dried fish preserved and then cooked — the same ancient preservation technique." }
          },
          CN: {
            name: { ko: "셴위", ja: "鹹魚", en: "Xianyu" },
            tasteProfile: { sweet: 3, salty: 65, spicy: 5, umami: 75, sour: 3 },
            description: { ko: "소금에 강하게 절여 건조한 중국 전통 소금 생선", ja: "強塩で漬けて乾燥させた中国伝統の塩魚", en: "Chinese traditional heavily salted and dried fish" },
            ingredients: { ko: ["생선", "굵은소금", "참기름"], ja: ["魚", "粗塩", "ごま油"], en: ["fish", "coarse salt", "sesame oil"] },
            similarityPercent: 90,
            matchReason: { ko: "강하게 소금에 절여 건조한 생선이라는 점에서 이천 굴비와 거의 동일합니다.", ja: "強塩で漬けて乾燥させた魚という点で이천 굴비にほぼ同じです。", en: "Both are heavily salted and dried fish — the same preservation and cooking tradition." }
          },
          JP: {
            name: { ko: "히모노", ja: "干物", en: "Himono" },
            tasteProfile: { sweet: 5, salty: 50, spicy: 3, umami: 72, sour: 5 },
            description: { ko: "생선을 소금물에 담갔다가 건조한 일본 전통 건어물", ja: "魚を塩水に浸してから乾燥させた日本の伝統干物", en: "Japanese traditional dried fish made by brining and sun-drying" },
            ingredients: { ko: ["생선", "소금물", "햇볕"], ja: ["魚", "塩水", "日光"], en: ["fish", "brine", "sunlight"] },
            similarityPercent: 88,
            matchReason: { ko: "소금에 절여 건조한 생선을 구워 먹는 방식이 이천 굴비와 동일합니다.", ja: "塩漬け乾燥魚を焼いて食べる方式が이천 굴비と同じです。", en: "Both are brined, sun-dried fish grilled and served with rice — same preservation and preparation tradition." }
          }
        }
      },
      {
        id: "icheon-ganjang-gejang",
        name: { ko: "간장게장", ja: "醤油ワタリガニ漬け", en: "Soy Sauce Marinated Crab" },
        region: "icheon",
        image: "/images/food/간장게장.png",
        tasteProfile: { sweet: 20, salty: 65, spicy: 10, umami: 95, sour: 10 },
        storyDescription: {
          ko: "신선한 꽃게를 간장에 담가 숙성시킨 요리로, '밥도둑'이라 불리는 데는 다 이유가 있어요. 짭조름하고 감칠맛 폭발하는 게장을 이천 밥에 올려 비벼 먹으면, 순식간에 밥 한 공기가 사라지는 마법을 경험하게 된답니다.",
          ja: "新鮮なワタリガニを醤油に漬けて熟成させた料理で、「ご飯泥棒」と呼ばれるのには理由があります。塩辛くて旨味が爆発するケジャンを利川のご飯に乗せて混ぜて食べると、あっという間にご飯一膳が消える魔法を体験できます。",
          en: "Fresh blue crab marinated in soy sauce and aged — there's a reason it's called 'the rice thief'. Spoon this salty, umami-explosive gejang over Icheon rice, mix it in, and experience the magic of a full bowl vanishing in an instant."
        },
        ingredients: { ko: ["꽃게", "간장", "마늘", "생강", "청양고추", "다시마", "설탕"], ja: ["ワタリガニ", "醤油", "ニンニク", "生姜", "青唐辛子", "昆布", "砂糖"], en: ["Blue crab", "Soy sauce", "Garlic", "Ginger", "Green chili", "Kelp", "Sugar"] },
        tags: ["게장", "밥도둑", "발효"],
                dupes: {
          CN: {
            name: { ko: "쭈이시에", ja: "酔蟹", en: "Zui Xie" },
            tasteProfile: { sweet: 8, salty: 45, spicy: 5, umami: 80, sour: 10 },
            description: { ko: "황주와 향신료에 담근 중국 상해식 간장 게장", ja: "黄酒と香辛料に漬けた中国上海風醤油カニ", en: "Shanghai-style raw crab marinated in yellow rice wine and spices" },
            ingredients: { ko: ["민물게", "황주", "간장", "생강", "마늘", "팔각"], ja: ["川蟹", "黄酒", "醤油", "生姜", "にんにく", "八角"], en: ["freshwater crab", "yellow rice wine", "soy sauce", "ginger", "garlic", "star anise"] },
            similarityPercent: 95,
            matchReason: { ko: "날 게를 간장과 향신료에 담가 먹는 방식이 이천 간장게장과 거의 동일합니다.", ja: "生の蟹を醤油と香辛料に漬ける方式が이천 간장게장にほぼ同じです。", en: "Raw crab marinated in soy sauce and aromatics — structurally identical to ganjang gejang." }
          },
          TH: {
            name: { ko: "뿌동", ja: "プードン", en: "Pu Dong" },
            tasteProfile: { sweet: 10, salty: 40, spicy: 25, umami: 75, sour: 18 },
            description: { ko: "피시소스와 허브에 재운 태국식 날 게 요리", ja: "ナンプラーとハーブに漬けたタイ風生蟹料理", en: "Thai raw crab dish marinated in fish sauce and herbs" },
            ingredients: { ko: ["게", "피시소스", "라임즙", "마늘", "고추", "고수"], ja: ["カニ", "ナンプラー", "ライムジュース", "にんにく", "唐辛子", "コリアンダー"], en: ["crab", "fish sauce", "lime juice", "garlic", "chili", "cilantro"] },
            similarityPercent: 88,
            matchReason: { ko: "날 게를 소스에 담가 먹는 방식이 이천 간장게장과 동일합니다.", ja: "生の蟹をソースに漬ける方式が이천 간장게장と同じです。", en: "Both marinate raw crab in a savory, umami-rich sauce — the same raw marinated crab concept." }
          },
          MX: { challenge: true }
        }
      },
      {
        id: "icheon-jeyuk-bokkeum",
        name: { ko: "제육볶음", ja: "豚肉炒め", en: "Spicy Stir-Fried Pork" },
        region: "icheon",
        image: "/images/food/제육볶음.png",
        tasteProfile: { sweet: 30, salty: 55, spicy: 70, umami: 70, sour: 10 },
        storyDescription: {
          ko: "이천 쌀밥과 제육볶음의 조합은 경기도 밥상의 클래식이에요. 고추장 양념에 매콤하게 볶아진 돼지고기 한 점을 탱글탱글한 이천 쌀밥 위에 올려 먹는 그 순간은, 아무리 많이 먹어도 질리지 않는 한국 소울 푸드랍니다.",
          ja: "利川のご飯と豚肉炒めの組み合わせは京畿道の食卓のクラシックです。コチュジャンの薬味で辛く炒めた豚肉一切れを、ぷりぷりの利川ご飯の上に乗せて食べるその瞬間は、何度食べても飽きない韓国のソウルフードです。",
          en: "Icheon rice paired with jeyuk bokkeum is a Gyeonggi table classic. That moment of placing a spicy gochujang-glazed pork piece atop plump Icheon rice is the Korean soul food you never tire of, no matter how many times you eat it."
        },
        ingredients: { ko: ["돼지고기", "고추장", "간장", "마늘", "생강", "파", "참기름", "설탕"], ja: ["豚肉", "コチュジャン", "醤油", "ニンニク", "生姜", "ネギ", "ごま油", "砂糖"], en: ["Pork", "Gochujang", "Soy sauce", "Garlic", "Ginger", "Green onion", "Sesame oil", "Sugar"] },
        tags: ["볶음", "매콤", "돼지고기"],
                dupes: {
          MX: {
            name: { ko: "알 파스토르", ja: "アルパストール", en: "Al Pastor" },
            tasteProfile: { sweet: 12, salty: 38, spicy: 50, umami: 65, sour: 18 },
            description: { ko: "칠레와 아나토로 마리네이드한 멕시코식 고추 돼지고기 구이", ja: "チリとアナトーでマリネしたメキシコ風唐辛子豚肉焼き", en: "Mexican chili-and-annatto marinated pork, roasted on a vertical spit" },
            ingredients: { ko: ["돼지고기", "과히요 칠레", "아나토", "오렌지", "마늘", "파인애플"], ja: ["豚肉", "グアヒーヨチリ", "アナトー", "オレンジ", "にんにく", "パイナップル"], en: ["pork", "guajillo chile", "annatto", "orange", "garlic", "pineapple"] },
            similarityPercent: 88,
            matchReason: { ko: "고추 베이스 양념에 재운 돼지고기를 강한 불에 구워낸 방식이 제육볶음과 유사합니다.", ja: "唐辛子ベースのマリネに漬けた豚肉を強火で焼く方式が제육볶음と似ています。", en: "Both are fiery chili-marinated pork dishes cooked over high heat — similar spice-forward pork philosophy." }
          },
          CN: {
            name: { ko: "후이궈로우", ja: "回鍋肉", en: "Hui Guo Rou" },
            tasteProfile: { sweet: 10, salty: 42, spicy: 45, umami: 68, sour: 5 },
            description: { ko: "삶은 돼지고기를 두반장과 채소와 함께 볶은 쓰촨 요리", ja: "茹でた豚肉を豆板醤と野菜と共に炒めた四川料理", en: "Sichuan dish of twice-cooked pork stir-fried with doubanjiang and vegetables" },
            ingredients: { ko: ["돼지 삼겹살", "두반장", "피망", "마늘 종", "간장", "설탕"], ja: ["豚バラ", "豆板醤", "ピーマン", "にんにくの芽", "醤油", "砂糖"], en: ["pork belly", "doubanjiang", "bell pepper", "garlic stems", "soy sauce", "sugar"] },
            similarityPercent: 90,
            matchReason: { ko: "돼지고기를 매운 고추 소스와 채소에 강불로 볶아내는 방식이 제육볶음과 거의 동일합니다.", ja: "豚肉を辛い唐辛子ソースと野菜で強火で炒める方式が제육볶음にほぼ同じです。", en: "Both stir-fry pork in spicy chili sauce with vegetables over high heat — the technique and flavor profile are nearly identical." }
          },
          JP: {
            name: { ko: "부타 카쿠니", ja: "豚の角煮", en: "Buta Kakuni" },
            tasteProfile: { sweet: 20, salty: 42, spicy: 8, umami: 72, sour: 5 },
            description: { ko: "간장과 설탕으로 달콤짭짤하게 조린 일본식 돼지고기 조림", ja: "醤油と砂糖で甘辛く煮込んだ日本風豚の角煮", en: "Japanese braised pork belly in sweet-savory soy sauce" },
            ingredients: { ko: ["삼겹살", "간장", "미림", "설탕", "생강", "파"], ja: ["豚バラ", "醤油", "みりん", "砂糖", "生姜", "ねぎ"], en: ["pork belly", "soy sauce", "mirin", "sugar", "ginger", "scallion"] },
            similarityPercent: 78,
            matchReason: { ko: "돼지 삼겹살을 간장 소스에 조리한 달콤짭짤한 요리라는 점에서 제육볶음과 맛 계열이 유사합니다.", ja: "豚バラを醤油ソースで調理した甘辛い料理という点で제육볶음と風味系統が似ています。", en: "Both are pork belly dishes in soy-based sweet-savory sauce — kakuni is braised while jeyuk is stir-fried." }
          }
        }
      },
      {
        id: "icheon-hanwoo-gui",
        name: { ko: "이천 한우 구이", ja: "利川韓牛焼肉", en: "Icheon Hanwoo Grilled Beef" },
        region: "icheon",
        image: "/images/food/이천한우구이.png",
        tasteProfile: { sweet: 15, salty: 45, spicy: 5, umami: 92, sour: 5 },
        storyDescription: {
          ko: "이천 쌀밥을 곁들여 먹는 한우 구이는 이 지역의 격조 있는 식사 문화예요. 살살 녹는 마블링의 한우를 구워서 이천 쌀밥 한 숟갈과 함께 먹으면, 그야말로 밥 한 공기가 사치가 된답니다.",
          ja: "利川のご飯を添えて食べる韓牛焼肉は、この地域の格調ある食文化です。とろけるようなサシの韓牛を焼いて利川のご飯一さじと一緒に食べると、まさにご飯一膳が贅沢になります。",
          en: "Grilled Hanwoo beef served alongside Icheon rice is this region's elevated dining culture. Cook the melt-in-your-mouth marbled beef and take a spoonful of Icheon rice with it — suddenly, even a simple bowl of rice becomes pure luxury."
        },
        ingredients: { ko: ["한우 채끝", "소금", "참기름", "마늘", "이천 쌀밥", "상추", "쌈장"], ja: ["韓牛サーロイン", "塩", "ごま油", "ニンニク", "利川ご飯", "サンチュ", "サムジャン"], en: ["Hanwoo striploin", "Salt", "Sesame oil", "Garlic", "Icheon rice", "Lettuce", "Ssamjang"] },
        tags: ["한우", "구이", "이천쌀"],
                dupes: {
          ES: {
            name: { ko: "츄레톤", ja: "チュレトン", en: "Chuletón" },
            tasteProfile: { sweet: 3, salty: 35, spicy: 5, umami: 82, sour: 5 },
            description: { ko: "소금과 올리브오일만으로 구운 스페인 바스크식 대형 소고기 티본 스테이크", ja: "塩とオリーブオイルだけで焼くスペイン・バスク風大型Tボーンステーキ", en: "Large T-bone steak from the Basque Country, seasoned only with salt and olive oil" },
            ingredients: { ko: ["소 티본", "굵은소금", "올리브오일"], ja: ["牛Tボーン", "粗塩", "オリーブオイル"], en: ["beef T-bone", "coarse salt", "olive oil"] },
            similarityPercent: 88,
            matchReason: { ko: "최고급 소고기를 최소한의 양념으로 구워 고기 본연의 맛을 즐기는 방식이 이천 한우 구이와 동일합니다.", ja: "最高級牛肉を最小限の調味料で焼いて肉本来の味を楽しむ方式が이천 한우 구이と同じです。", en: "Both grill premium beef with minimal seasoning to highlight the meat's natural flavor and marbling." }
          },
          IT: {
            name: { ko: "비스테카 알라 피오렌티나", ja: "ビステッカアッラフィオレンティーナ", en: "Bistecca alla Fiorentina" },
            tasteProfile: { sweet: 3, salty: 32, spicy: 3, umami: 85, sour: 5 },
            description: { ko: "피렌체식으로 소금과 레몬만으로 구운 대형 T본 소고기 스테이크", ja: "塩とレモンだけで焼くフィレンツェ風大型Tボーンステーキ", en: "Florentine-style T-bone steak seasoned only with salt and lemon" },
            ingredients: { ko: ["키아니나 소", "굵은소금", "레몬", "올리브오일", "로즈마리"], ja: ["キアニーナ牛", "粗塩", "レモン", "オリーブオイル", "ローズマリー"], en: ["chianina beef", "coarse salt", "lemon", "olive oil", "rosemary"] },
            similarityPercent: 90,
            matchReason: { ko: "최고급 소고기를 단순하게 구워 고기 맛 그 자체를 즐기는 철학이 이천 한우 구이와 동일합니다.", ja: "最高級牛肉を単純に焼いて肉本来の味を楽しむ哲学が이천 한우 구이と同じです。", en: "Both are premium beef dishes where simplicity of preparation honors the quality of the meat." }
          },
          JP: {
            name: { ko: "와규 야키니쿠 정식", ja: "和牛焼肉定食", en: "Wagyu Yakiniku Set" },
            tasteProfile: { sweet: 12, salty: 40, spicy: 5, umami: 88, sour: 5 },
            description: { ko: "최고급 와규를 숯불에 구워 밥과 국, 반찬과 함께 내는 일본식 야키니쿠 정식", ja: "最高級和牛を炭火で焼いてご飯・汁物・副菜と共に出す日本風焼肉定食", en: "Japanese premium wagyu grilled on charcoal served as a complete meal set" },
            ingredients: { ko: ["와규", "숯", "타레 소스", "쌀", "미소국", "반찬"], ja: ["和牛", "炭", "たれソース", "米", "味噌汁", "副菜"], en: ["wagyu", "charcoal", "tare sauce", "rice", "miso soup", "side dishes"] },
            similarityPercent: 92,
            matchReason: { ko: "최고급 소고기를 숯불에 구워 밥, 국, 반찬과 함께 먹는 방식이 이천 한우 구이와 거의 동일합니다.", ja: "最高級牛肉を炭火で焼いてご飯・汁物・副菜と食べる方式が이천 한우 구이にほぼ同じです。", en: "Both serve premium charcoal-grilled beef with rice, soup, and side dishes as a complete meal." }
          }
        }
      },
      {
        id: "icheon-straw-pork",
        name: { ko: "볏짚 삼겹살", ja: "藁火豚バラ焼き", en: "Straw-Fire Pork Belly" },
        region: "icheon",
        image: "/images/food/볏집삼겹살구이.png",
        tasteProfile: { sweet: 15, salty: 50, spicy: 10, umami: 80, sour: 5 },
        storyDescription: {
          ko: "이천에서 생산되는 볏짚으로 삼겹살 표면을 훑어 구워낸 특별한 조리법이에요. 볏짚 불꽃이 고기 겉면을 스쳐지나가면서 은은한 짚 향이 배어들고, 겉은 바삭하면서 속은 촉촉한 환상적인 삼겹살이 완성된답니다.",
          ja: "利川で生産される藁で豚バラ肉の表面をあぶって焼く特別な調理法です。藁の炎が肉の表面をかすめながらほのかな藁の香りが染み込み、外はカリカリで中はしっとりした幻想的な豚バラ肉が完成します。",
          en: "A special technique using Icheon-grown rice straw to sear the surface of pork belly. As the straw flame skims the meat, a subtle smoky aroma seeps in — creating pork belly with a crispy exterior, juicy interior, and that ineffable straw-kissed fragrance."
        },
        ingredients: { ko: ["삼겹살", "볏짚", "소금", "참기름", "마늘", "상추"], ja: ["豚バラ肉", "稲藁", "塩", "ごま油", "ニンニク", "サンチュ"], en: ["Pork belly", "Rice straw", "Salt", "Sesame oil", "Garlic", "Lettuce"] },
        tags: ["삼겹살", "볏짚", "훈연"],
                dupes: {
          FR: {
            name: { ko: "플랑베 삼겹살", ja: "フランベ豚バラ", en: "Flambéed Pork Belly" },
            tasteProfile: { sweet: 8, salty: 38, spicy: 5, umami: 70, sour: 8 },
            description: { ko: "코냑으로 불을 붙여 마무리한 프랑스식 삼겹살 요리", ja: "コニャックで仕上げたフランス風豚バラ料理", en: "French pork belly dish finished with a cognac flambé" },
            ingredients: { ko: ["삼겹살", "코냑", "타임", "마늘", "버터", "소금"], ja: ["豚バラ", "コニャック", "タイム", "にんにく", "バター", "塩"], en: ["pork belly", "cognac", "thyme", "garlic", "butter", "salt"] },
            similarityPercent: 80,
            matchReason: { ko: "불 기술로 마무리한 삼겹살이라는 점에서 짚불 삼겹살과 불을 활용하는 조리 개념이 유사합니다.", ja: "炎の技術で仕上げた豚バラという点で짚불 삼겹살と火を活用する調理コンセプトが似ています。", en: "Both use fire as the finishing element for pork belly — flambé with alcohol vs straw fire, same dramatic technique." }
          },
          US: {
            name: { ko: "스모크하우스 포크 벨리", ja: "スモークハウス豚バラ", en: "Smokehouse Pork Belly" },
            tasteProfile: { sweet: 15, salty: 42, spicy: 15, umami: 72, sour: 8 },
            description: { ko: "히코리 나무 연기로 느리게 훈제한 미국식 포크 벨리", ja: "ヒッコリーの木の煙でゆっくり燻製したアメリカ風豚バラ", en: "American pork belly slowly smoked over hickory wood" },
            ingredients: { ko: ["삼겹살", "히코리 칩", "흑설탕", "파프리카", "마늘파우더", "소금"], ja: ["豚バラ", "ヒッコリーチップ", "黒砂糖", "パプリカ", "ガーリックパウダー", "塩"], en: ["pork belly", "hickory chips", "brown sugar", "paprika", "garlic powder", "salt"] },
            similarityPercent: 85,
            matchReason: { ko: "천연 연기로 삼겹살에 독특한 향을 입히는 방식이 짚불 삼겹살과 동일한 철학입니다.", ja: "天然の煙で豚バラに独自の香りをつける方式が짚불 삼겹살と同じ哲学です。", en: "Both use natural combustion to infuse smoke flavor into pork belly — straw smoke vs wood smoke." }
          },
          JP: {
            name: { ko: "와라야키 가쓰오", ja: "藁焼きかつお", en: "Warayaki Katsuo" },
            tasteProfile: { sweet: 5, salty: 38, spicy: 3, umami: 75, sour: 15 },
            description: { ko: "볏짚 불로 표면만 빠르게 구운 일본 고치식 가다랑어 요리", ja: "藁の火で表面だけを素早く焼く高知風かつおのたたき", en: "Kochi-style bonito quickly seared on the surface using burning rice straw" },
            ingredients: { ko: ["가다랑어", "볏짚", "소금", "폰즈", "파", "생강"], ja: ["かつお", "藁", "塩", "ポン酢", "ねぎ", "生姜"], en: ["bonito", "rice straw", "salt", "ponzu", "scallion", "ginger"] },
            similarityPercent: 92,
            matchReason: { ko: "볏짚 불로 식재료를 구워 짚 향을 입히는 방식이 이천 짚불구이와 완전히 동일합니다.", ja: "藁の火で食材を焼いて藁の香りをつける方式が이천 짚불구이と全く同じです。", en: "Both use burning rice straw to sear the exterior of the protein — exactly the same straw-fire cooking technique." }
          }
        }
      },
      {
        id: "icheon-royal-table",
        name: { ko: "임금님 수라상", ja: "王の御膳", en: "Royal Table" },
        region: "icheon",
        image: "/images/food/임금님수라상.png",
        tasteProfile: { sweet: 30, salty: 45, spicy: 25, umami: 85, sour: 20 },
        storyDescription: {
          ko: "이천 쌀밥을 중심으로 수십 가지 반찬이 격식 있게 펼쳐지는 왕의 밥상이에요. 조선 궁중 요리의 방식을 계승하여 재료 하나하나에 정성을 다했고, 이천이라는 지역의 자부심과 전통이 이 한 상 안에 모두 담겨 있답니다.",
          ja: "利川のご飯を中心に何十種類ものおかずが格式高く並べられた王の食卓です。朝鮮宮廷料理の方式を継承して食材一つ一つに誠意を尽くし、利川という地域の誇りと伝統がこの一膳に全て込められています。",
          en: "A royal dining spread with dozens of side dishes laid out in formal style, centered on Icheon rice. Inheriting the Joseon royal court culinary tradition, every ingredient is treated with utmost care — all of Icheon's pride and heritage in a single glorious table."
        },
        ingredients: { ko: ["이천 쌀밥", "구절판", "신선로", "전유어", "나물", "김치", "찜", "정과"], ja: ["利川ご飯", "九折板", "神仙炉", "チヂミ", "ナムル", "キムチ", "蒸し物", "正果"], en: ["Icheon rice", "Gujeolpan (nine-section dish)", "Royal hotpot", "Pan-fried dishes", "Namul", "Kimchi", "Steamed dishes", "Candied sweets"] },
        tags: ["궁중", "정찬", "전통"],
                dupes: {
          FR: {
            name: { ko: "오뜨 퀴진 테이스팅 메뉴", ja: "オートキュイジーヌのテイスティングメニュー", en: "Haute Cuisine Tasting Menu" },
            tasteProfile: { sweet: 15, salty: 35, spicy: 5, umami: 68, sour: 18 },
            description: { ko: "미슐랭급 셰프가 제철 재료로 구성한 프랑스 최고급 다코스 요리", ja: "ミシュランシェフが旬の食材で構成するフランス最高級多コース料理", en: "Michelin-level French multi-course tasting menu with seasonal ingredients" },
            ingredients: { ko: ["제철 재료", "트러플", "푸아그라", "랍스터", "캐비아", "화이트와인"], ja: ["旬の食材", "トリュフ", "フォアグラ", "ロブスター", "キャビア", "白ワイン"], en: ["seasonal ingredients", "truffle", "foie gras", "lobster", "caviar", "white wine"] },
            similarityPercent: 88,
            matchReason: { ko: "최고급 재료로 격식 있게 차려낸 다코스 궁중 정찬 형식이 이천 궁중 상차림과 동일합니다.", ja: "最高級食材で格式ある多コース宮廷正餐の形式が이천 궁중 상차림と同じです。", en: "Both are elaborate formal multi-course meals featuring premium ingredients in a ceremonial dining context." }
          },
          CN: {
            name: { ko: "만한전석", ja: "満漢全席", en: "Manhan Quanxi" },
            tasteProfile: { sweet: 15, salty: 38, spicy: 10, umami: 72, sour: 8 },
            description: { ko: "청나라 황실 연회 요리로 108가지 이상의 코스로 이루어진 최고급 중국 정찬", ja: "清朝の宮廷宴会料理で108品以上のコースから成る最高級中国正餐", en: "Imperial Qing Dynasty banquet of over 108 courses representing the pinnacle of Chinese court cuisine" },
            ingredients: { ko: ["상어 지느러미", "제비집", "베이징 오리", "해산물", "희귀 약재", "제철 야채"], ja: ["ふかひれ", "燕の巣", "北京ダック", "海産物", "希少生薬", "旬の野菜"], en: ["shark fin", "bird's nest", "Peking duck", "seafood", "rare herbs", "seasonal vegetables"] },
            similarityPercent: 90,
            matchReason: { ko: "황실 궁중 의례용 정찬으로 최고급 재료를 수십 가지 코스로 차려내는 방식이 이천 궁중 상차림과 동일합니다.", ja: "皇室宮廷礼式の正餐として最高級食材を数十品のコースで提供する方式が이천 궁중 상차림と同じです。", en: "Both are imperial court banquet traditions with dozens of courses of premium ingredients in ceremonial presentation." }
          },
          JP: {
            name: { ko: "궁중 미야비 정식", ja: "宮廷雅定食", en: "Miyabi Court Cuisine" },
            tasteProfile: { sweet: 12, salty: 35, spicy: 5, umami: 65, sour: 10 },
            description: { ko: "헤이안 시대 귀족 요리 전통을 계승한 일본 궁중 정찬", ja: "平安時代の貴族料理の伝統を受け継ぐ日本の宮廷正餐", en: "Japanese court cuisine inheriting the Heian-era aristocratic cooking tradition" },
            ingredients: { ko: ["제철 생선", "산나물", "두부", "죽순", "된장", "다시"], ja: ["旬の魚", "山菜", "豆腐", "竹の子", "味噌", "だし"], en: ["seasonal fish", "mountain vegetables", "tofu", "bamboo shoots", "miso", "dashi"] },
            similarityPercent: 88,
            matchReason: { ko: "귀족·황실 궁중 요리 전통을 이은 격식 있는 정찬 문화가 이천 궁중 상차림과 동일합니다.", ja: "貴族・皇室宮廷料理の伝統を継ぐ格式ある正餐文化が이천 궁중 상차림と同じです。", en: "Both are court cuisine traditions that formalize seasonal ingredients into ceremonial dining presentations." }
          }
        }
      },
      {
        id: "icheon-makguksu",
        name: { ko: "이천 막국수", ja: "利川マックッス", en: "Icheon Makguksu" },
        region: "icheon",
        image: "/images/food/이천막국수.png",
        tasteProfile: { sweet: 20, salty: 45, spicy: 50, umami: 60, sour: 40 },
        storyDescription: {
          ko: "메밀 향 물씬 풍기는 차가운 막국수에 이천 쌀로 만든 밥을 곁들이는 것이 이 지역만의 독특한 조합이에요. 탄력 있는 메밀 면의 쫄깃함과 새콤달콤한 양념이 어우러지면서, 여름날 오후의 느긋한 식사 풍경이 그려진답니다.",
          ja: "そばの香りが漂う冷たいマックッスに利川のお米で作ったご飯を添えるのが、この地域だけのユニークな組み合わせです。弾力のあるそば麺のもちもち感と甘酸っぱい薬味が調和して、夏の午後ののんびりとした食事の風景が浮かびます。",
          en: "Cold makguksu fragrant with buckwheat aroma paired with Icheon rice — this region's unique combination. The springy buckwheat noodles and sweet-sour-spicy seasoning together paint a picture of a leisurely summer afternoon meal."
        },
        ingredients: { ko: ["메밀 면", "양념장", "오이", "계란", "무", "식초", "겨자"], ja: ["そば麺", "ヤンニョムジャン", "きゅうり", "卵", "大根", "酢", "からし"], en: ["Buckwheat noodles", "Spicy sauce", "Cucumber", "Egg", "Radish", "Vinegar", "Mustard"] },
        tags: ["막국수", "메밀", "냉면"],
                dupes: {
          IT: {
            name: { ko: "콜드 카펠리니", ja: "冷製カッペリーニ", en: "Cold Capellini" },
            tasteProfile: { sweet: 5, salty: 35, spicy: 5, umami: 50, sour: 22 },
            description: { ko: "가는 카펠리니 파스타를 차갑게 식혀 올리브오일로 무친 이탈리아 여름 파스타", ja: "細いカッペリーニパスタを冷やしてオリーブオイルで和えたイタリアの夏パスタ", en: "Italian summer dish of chilled thin capellini pasta tossed with olive oil" },
            ingredients: { ko: ["카펠리니", "올리브오일", "레몬", "바질", "방울토마토", "케이퍼"], ja: ["カッペリーニ", "オリーブオイル", "レモン", "バジル", "ミニトマト", "ケッパー"], en: ["capellini", "olive oil", "lemon", "basil", "cherry tomato", "capers"] },
            similarityPercent: 80,
            matchReason: { ko: "가는 면을 차갑게 식혀 소스에 버무려 먹는 방식이 이천 막국수와 유사합니다.", ja: "細い麺を冷やしてソースで和えて食べる方式が이천 막국수と似ています。", en: "Both are cold thin noodles tossed in a tangy sauce — same cold noodle concept with different ingredients." }
          },
          VN: {
            name: { ko: "분 팃 느엉", ja: "ブンティットヌン", en: "Bún Thịt Nướng" },
            tasteProfile: { sweet: 15, salty: 38, spicy: 15, umami: 58, sour: 25 },
            description: { ko: "구운 돼지고기와 채소를 넣은 베트남식 차가운 쌀국수 볼", ja: "焼き豚と野菜を入れたベトナム風冷たい米麺ボウル", en: "Vietnamese cold rice noodle bowl with grilled pork and fresh vegetables" },
            ingredients: { ko: ["쌀국수", "구운 돼지고기", "채소", "땅콩", "느억맘", "라임"], ja: ["米麺", "焼き豚", "野菜", "ピーナッツ", "ヌックマム", "ライム"], en: ["rice noodles", "grilled pork", "vegetables", "peanuts", "fish sauce", "lime"] },
            similarityPercent: 85,
            matchReason: { ko: "차가운 면에 구운 고기와 채소를 올려 소스에 비벼 먹는 방식이 이천 막국수와 유사합니다.", ja: "冷たい麺に焼き肉と野菜を乗せてソースで混ぜる方式が이천 막국수と似ています。", en: "Both are cold noodle bowls topped with grilled meat and fresh vegetables, tossed in a tangy sauce." }
          },
          JP: {
            name: { ko: "히야시 소바", ja: "冷やしそば", en: "Hiyashi Soba" },
            tasteProfile: { sweet: 8, salty: 38, spicy: 5, umami: 60, sour: 10 },
            description: { ko: "차갑게 씻어 쓰유에 찍거나 무쳐 먹는 일본 여름 냉 소바", ja: "冷水で締めてつゆにつけるか和えて食べる夏の冷そば", en: "Japanese cold summer soba noodles served with dipping broth or tossed sauce" },
            ingredients: { ko: ["메밀면", "다시", "간장", "미림", "와사비", "파"], ja: ["そば", "だし", "醤油", "みりん", "わさび", "ねぎ"], en: ["soba noodles", "dashi", "soy sauce", "mirin", "wasabi", "scallion"] },
            similarityPercent: 88,
            matchReason: { ko: "차갑게 먹는 메밀면이라는 점에서 이천 막국수와 가장 가까운 외국 음식입니다.", ja: "冷たく食べるそばという点で이천 막국수に最も近い外国料理です。", en: "Both are cold buckwheat noodle dishes — the closest foreign equivalent to makguksu." }
          }
        }
      },
      {
        id: "icheon-hangwa",
        name: { ko: "이천 한과", ja: "利川韓菓", en: "Icheon Hangwa" },
        region: "icheon",
        image: "/images/food/한과.png",
        tasteProfile: { sweet: 70, salty: 10, spicy: 0, umami: 20, sour: 5 },
        storyDescription: {
          ko: "이천의 도자기 마을에서 전해 내려오는 전통 한과예요. 깨, 잣, 꿀을 넣어 정성스럽게 만들어진 강정, 약과, 다식들은 단순한 간식이 아니라 조선 시대 선비들이 즐기던 품격 있는 문화의 일부랍니다.",
          ja: "利川の陶芸村から受け継がれてきた伝統的な韓菓です。ごまと松の実、蜂蜜を入れて丁寧に作られた強飯菓子、薬菓、茶食は単なるおやつではなく、朝鮮時代の両班たちが楽しんでいた品格ある文化の一部です。",
          en: "Traditional Korean confections handed down from Icheon's pottery village. Gangjung, yakgwa, and dasik made with sesame, pine nuts, and honey are not mere snacks — they are part of the refined culture enjoyed by Joseon dynasty scholars."
        },
        ingredients: { ko: ["찹쌀가루", "꿀", "참기름", "잣", "깨", "조청", "계피"], ja: ["もち米粉", "蜂蜜", "ごま油", "松の実", "ごま", "水あめ", "シナモン"], en: ["Glutinous rice flour", "Honey", "Sesame oil", "Pine nuts", "Sesame", "Jocheong syrup", "Cinnamon"] },
        tags: ["한과", "전통", "도자기마을"],
                dupes: {
          FR: {
            name: { ko: "누가", ja: "ヌガー", en: "Nougat" },
            tasteProfile: { sweet: 80, salty: 3, spicy: 0, umami: 8, sour: 3 },
            description: { ko: "꿀·달걀흰자·견과류로 만든 프랑스 몽텔리마르 전통 사탕", ja: "蜂蜜・卵白・ナッツで作るフランス・モンテリマール伝統のキャンディー", en: "French traditional candy from Montélimar made with honey, egg whites, and nuts" },
            ingredients: { ko: ["꿀", "달걀흰자", "아몬드", "피스타치오", "설탕"], ja: ["蜂蜜", "卵白", "アーモンド", "ピスタチオ", "砂糖"], en: ["honey", "egg white", "almond", "pistachio", "sugar"] },
            similarityPercent: 85,
            matchReason: { ko: "꿀과 견과류를 이용해 전통 방식으로 만든 고급 과자라는 점에서 이천 한과와 유사합니다.", ja: "蜂蜜とナッツを使って伝統的な方法で作る高級菓子という点で이천 한과と似ています。", en: "Both are traditional confections made with honey and nuts, representing artisan candy-making heritage." }
          },
          ES: {
            name: { ko: "투론", ja: "トゥロン", en: "Turrón" },
            tasteProfile: { sweet: 78, salty: 3, spicy: 0, umami: 10, sour: 2 },
            description: { ko: "꿀·달걀흰자·아몬드로 만든 스페인 크리스마스 전통 과자", ja: "蜂蜜・卵白・アーモンドで作るスペインのクリスマス伝統菓子", en: "Traditional Spanish Christmas confection made with honey, egg whites, and almonds" },
            ingredients: { ko: ["아몬드", "꿀", "달걀흰자", "설탕", "레몬 껍질"], ja: ["アーモンド", "蜂蜜", "卵白", "砂糖", "レモン皮"], en: ["almond", "honey", "egg white", "sugar", "lemon zest"] },
            similarityPercent: 82,
            matchReason: { ko: "견과류와 꿀을 전통 방식으로 굳혀 만든 과자라는 점에서 이천 한과와 유사합니다.", ja: "ナッツと蜂蜜を伝統的な方法で固めた菓子という点で이천 한과と似ています。", en: "Both are nut-and-honey confections made by traditional methods — similar texture and sweetness profile." }
          },
          JP: {
            name: { ko: "전통 와가시", ja: "伝統的な和菓子", en: "Traditional Wagashi" },
            tasteProfile: { sweet: 70, salty: 3, spicy: 0, umami: 8, sour: 3 },
            description: { ko: "쌀가루·팥앙금·설탕으로 만든 일본 전통 과자", ja: "米粉・小豆あん・砂糖で作る日本の伝統和菓子", en: "Japanese traditional confection made with rice flour, red bean paste, and sugar" },
            ingredients: { ko: ["쌀가루", "팥앙금", "설탕", "한천", "말차"], ja: ["米粉", "小豆あん", "砂糖", "寒天", "抹茶"], en: ["rice flour", "red bean paste", "sugar", "agar", "matcha"] },
            similarityPercent: 88,
            matchReason: { ko: "쌀과 전통 재료로 만든 장인급 전통 과자라는 점에서 이천 한과와 동일한 철학을 가집니다.", ja: "米と伝統食材で作る職人レベルの伝統菓子という点で이천 한과と同じ哲学を持ちます。", en: "Both are artisan traditional confections made from rice and natural sweeteners — the same craft confectionery tradition." }
          }
        }
      },
      {
        id: "icheon-sotbap",
        name: { ko: "솥밥", ja: "釜飯", en: "Sotbap (Pot Rice)" },
        region: "icheon",
        image: "/images/food/돌솥밥.png",
        tasteProfile: { sweet: 20, salty: 35, spicy: 10, umami: 70, sour: 5 },
        storyDescription: {
          ko: "작은 무쇠 솥에 이천 쌀과 제철 재료를 넣고 지어낸 솥밥이에요. 솥 뚜껑을 열 때 나는 구수한 김의 향기와 솥 바닥의 노릇한 누룽지는, 어떤 화려한 요리도 대신할 수 없는 단순하고 완벽한 행복이에요.",
          ja: "小さな鋳鉄の釜に利川のお米と旬の食材を入れて炊いた釜飯です。釜の蓋を開けたときに漂う香ばしい蒸気の香りと、釜底の黄金色のおこげは、どんな豪華な料理も代わりにはなれないシンプルで完璧な幸せです。",
          en: "Icheon rice and seasonal ingredients cooked in a small cast-iron pot. The fragrant steam that escapes when you lift the lid, and the golden scorched crust at the bottom — no elaborate dish can replace this simple, perfect happiness."
        },
        ingredients: { ko: ["이천 쌀", "제철 채소", "버섯", "간장", "참기름", "소금"], ja: ["利川米", "旬の野菜", "きのこ", "醤油", "ごま油", "塩"], en: ["Icheon rice", "Seasonal vegetables", "Mushrooms", "Soy sauce", "Sesame oil", "Salt"] },
        tags: ["솥밥", "누룽지", "이천쌀"],
                dupes: {
          ES: {
            name: { ko: "빠에야 믹스타", ja: "パエリャミクスタ", en: "Paella Mixta" },
            tasteProfile: { sweet: 8, salty: 40, spicy: 8, umami: 70, sour: 8 },
            description: { ko: "쌀을 육수에 끓여 해산물과 고기를 올린 스페인 전통 솥밥", ja: "米をスープで炊いて海産物と肉を乗せたスペイン伝統の鍋飯", en: "Spanish traditional rice dish cooked in broth with seafood and meat" },
            ingredients: { ko: ["칼라스파라 쌀", "닭고기", "새우", "홍합", "사프란", "파프리카"], ja: ["カラスパラ米", "鶏肉", "エビ", "ムール貝", "サフラン", "パプリカ"], en: ["calasparra rice", "chicken", "shrimp", "mussel", "saffron", "paprika"] },
            similarityPercent: 90,
            matchReason: { ko: "쌀을 솥에 넣어 재료와 함께 육수로 지어내는 방식이 이천 솥밥과 거의 동일합니다.", ja: "米を鍋に入れて具材と共にスープで炊く方式が이천 솥밥にほぼ同じです。", en: "Both cook rice in broth with toppings in a wide shallow pot — the same one-pot rice cooking concept." }
          },
          IT: {
            name: { ko: "버섯 리조또", ja: "きのこリゾット", en: "Mushroom Risotto" },
            tasteProfile: { sweet: 5, salty: 38, spicy: 3, umami: 75, sour: 5 },
            description: { ko: "버섯과 파르메산으로 크리미하게 만든 이탈리아식 쌀 요리", ja: "きのことパルメザンでクリーミーに仕上げたイタリア風米料理", en: "Italian creamy rice dish made with mushrooms and parmesan" },
            ingredients: { ko: ["아르보리오 쌀", "포르치니", "파르메산", "화이트와인", "버터", "양파"], ja: ["アルボリオ米", "ポルチーニ", "パルメザン", "白ワイン", "バター", "玉ねぎ"], en: ["arborio rice", "porcini", "parmesan", "white wine", "butter", "onion"] },
            similarityPercent: 82,
            matchReason: { ko: "육수를 흡수시켜 쌀을 짓는 방식이 솥밥과 유사하나 크리미한 질감이 특징입니다.", ja: "スープを吸わせてご飯を炊く方式が솥밥と似ていますが、クリーミーなテクスチャーが特徴です。", en: "Both slowly cook rice in broth to absorb flavor — risotto is creamier while sotbap forms a crust." }
          },
          JP: {
            name: { ko: "카마메시", ja: "釜飯", en: "Kamameshi" },
            tasteProfile: { sweet: 12, salty: 38, spicy: 3, umami: 65, sour: 3 },
            description: { ko: "작은 가마솥에 재료와 함께 지어낸 일본식 솥밥", ja: "小さな釜に具材と共に炊いた日本風釜飯", en: "Japanese individual pot rice cooked with various toppings in a small iron pot" },
            ingredients: { ko: ["쌀", "닭고기", "표고버섯", "죽순", "간장", "미림"], ja: ["米", "鶏肉", "椎茸", "たけのこ", "醤油", "みりん"], en: ["rice", "chicken", "shiitake", "bamboo shoot", "soy sauce", "mirin"] },
            similarityPercent: 95,
            matchReason: { ko: "솥에 재료와 함께 밥을 지어 솥째 내는 방식이 이천 솥밥과 거의 동일합니다.", ja: "鍋に具材と共にご飯を炊いて鍋ごと提供する方式が이천 솥밥にほぼ同じです。", en: "Rice cooked with toppings in an individual iron pot, served in the pot — structurally identical to sotbap." }
          }
        }
      }
    ]
  }
]
