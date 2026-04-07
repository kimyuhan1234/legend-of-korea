export type SpotCategory = "restaurant" | "market" | "street" | "cafe"
export type PriceRange = "₩" | "₩₩" | "₩₩₩"

export interface KFoodSpot {
  id: string
  name: { ko: string; ja: string; en: string }
  city: string
  cityCode: string
  category: SpotCategory
  speciality: { ko: string; ja: string; en: string }
  description: { ko: string; ja: string; en: string }
  address: string
  priceRange: PriceRange
  mustTry: { ko: string[]; ja: string[]; en: string[] }
  tags: string[]
  openHours: string
}

export const kfoodSpots: KFoodSpot[] = [
  {
    id: "spot-001",
    name: { ko: "전주 비빔밥 골목", ja: "全州ビビンバ横丁", en: "Jeonju Bibimbap Alley" },
    city: "전주",
    cityCode: "jeonju",
    category: "street",
    speciality: { ko: "전주 비빔밥", ja: "全州ビビンバ", en: "Jeonju Bibimbap" },
    description: { ko: "전주 한옥마을 안에 위치한 비빔밥 전문 골목. 한국 3대 비빔밥 발원지.", ja: "全州韓屋村にあるビビンバ専門の横丁。韓国三大ビビンバ発祥の地。", en: "The birthplace of one of Korea's finest bibimbap styles, inside Hanok Village." },
    address: "전북 전주시 완산구 경기전로",
    priceRange: "₩₩",
    mustTry: { ko: ["전주 비빔밥", "콩나물국밥", "피순대"], ja: ["全州ビビンバ", "豆もやしクッパ", "血腸"], en: ["Jeonju Bibimbap", "Bean sprout soup rice", "Blood sausage"] },
    tags: ["비빔밥", "한옥", "전통"],
    openHours: "09:00–21:00"
  },
  {
    id: "spot-002",
    name: { ko: "전주 남부시장 청년몰", ja: "全州南部市場青年モール", en: "Jeonju Nambu Market Youth Hall" },
    city: "전주",
    cityCode: "jeonju",
    category: "market",
    speciality: { ko: "야시장 먹거리", ja: "夜市グルメ", en: "Night market street food" },
    description: { ko: "매주 금·토 야시장이 열리는 전주 청년 창업 시장. 다양한 퓨전 한식을 즐길 수 있다.", ja: "毎週金・土曜に夜市が開かれる全州の若者創業市場。様々なフュージョン韓食が楽しめる。", en: "Jeonju's youth entrepreneur market with Friday & Saturday night markets full of fusion Korean bites." },
    address: "전북 전주시 완산구 풍남문3길 1",
    priceRange: "₩",
    mustTry: { ko: ["초코파이 꼬치", "비빔밥 버거", "막걸리 아이스크림"], ja: ["チョコパイ串", "ビビンババーガー", "マッコリアイスクリーム"], en: ["Chocopie skewer", "Bibimbap burger", "Makgeolli ice cream"] },
    tags: ["야시장", "퓨전", "청년"],
    openHours: "금·토 18:00–23:00 (야시장)"
  },
  {
    id: "spot-003",
    name: { ko: "광장시장", ja: "広蔵市場", en: "Gwangjang Market" },
    city: "서울",
    cityCode: "seoul",
    category: "market",
    speciality: { ko: "빈대떡·마약김밥", ja: "ビンデトク・麻薬キンパ", en: "Bindaetteok & Mayak Gimbap" },
    description: { ko: "서울에서 가장 오래된 재래시장. 서울 여행자라면 반드시 들러야 할 길거리 음식의 성지.", ja: "ソウル最古の伝統市場。ソウル旅行者なら必ず立ち寄るべきストリートフードの聖地。", en: "Seoul's oldest traditional market — a pilgrimage site for street food lovers." },
    address: "서울 종로구 창경궁로 88",
    priceRange: "₩",
    mustTry: { ko: ["마약김밥", "빈대떡", "육회"], ja: ["麻薬キンパ", "ビンデトク", "ユッケ"], en: ["Mayak gimbap", "Mung bean pancake", "Yukhoe (beef tartare)"] },
    tags: ["길거리음식", "전통시장", "서울"],
    openHours: "09:00–23:00 (주점 포함)"
  },
  {
    id: "spot-004",
    name: { ko: "을지로 노가리 골목", ja: "乙支路のガリ横丁", en: "Euljiro Nogari Alley" },
    city: "서울",
    cityCode: "seoul",
    category: "street",
    speciality: { ko: "노가리·생맥주", ja: "ノガリ・生ビール", en: "Dried pollock & draft beer" },
    description: { ko: "레트로 감성의 을지로 골목. 구운 노가리 한 접시에 생맥주 한 잔이 공식.", ja: "レトロな雰囲気の乙支路の路地。焼きノガリ一皿と生ビール一杯がお約束。", en: "Seoul's retro back alley where grilled dried pollock + draft beer is the unwritten rule." },
    address: "서울 중구 을지로 2가",
    priceRange: "₩",
    mustTry: { ko: ["노가리", "오징어구이", "소세지"], ja: ["ノガリ", "イカ焼き", "ソーセージ"], en: ["Grilled dried pollock", "Grilled squid", "Sausage"] },
    tags: ["레트로", "포장마차", "맥주"],
    openHours: "17:00–익일 02:00"
  },
  {
    id: "spot-005",
    name: { ko: "부산 깡통시장 야시장", ja: "釜山カントン市場夜市", en: "Busan Gukje Night Market" },
    city: "부산",
    cityCode: "busan",
    category: "market",
    speciality: { ko: "부산 길거리 음식", ja: "釜山ストリートフード", en: "Busan street food" },
    description: { ko: "부산 국제시장 옆 야시장. 밀면, 씨앗호떡, 어묵 등 부산 특산 길거리 음식이 가득.", ja: "釜山国際市場横の夜市。ミルミョン、種ホットク、さつま揚げなど釜山名物が並ぶ。", en: "Night market next to Busan's Gukje Market — full of Busan-signature street bites." },
    address: "부산 중구 신창동 4가",
    priceRange: "₩",
    mustTry: { ko: ["씨앗호떡", "밀면", "어묵탕"], ja: ["種ホットク", "ミルミョン", "さつま揚げスープ"], en: ["Seed hotteok", "Wheat noodles", "Fish cake soup"] },
    tags: ["야시장", "부산", "씨앗호떡"],
    openHours: "19:00–23:00 (금·토·일)"
  },
  {
    id: "spot-006",
    name: { ko: "해운대 시장", ja: "海雲台市場", en: "Haeundae Market" },
    city: "부산",
    cityCode: "busan",
    category: "market",
    speciality: { ko: "해산물 회", ja: "海鮮刺身", en: "Fresh seafood sashimi" },
    description: { ko: "해운대 해수욕장 인근의 수산시장. 직접 잡아온 신선한 회와 조개구이를 저렴하게 즐길 수 있다.", ja: "海雲台海水浴場近くの水産市場。直送の新鮮な刺身と貝焼きがリーズナブルに楽しめる。", en: "Seafood market near Haeundae Beach — fresh sashimi and grilled shellfish at great value." },
    address: "부산 해운대구 해운대해변로 30",
    priceRange: "₩₩",
    mustTry: { ko: ["광어회", "조개구이", "해물파전"], ja: ["ヒラメの刺身", "貝焼き", "海鮮チヂミ"], en: ["Halibut sashimi", "Grilled shellfish", "Seafood pajeon"] },
    tags: ["해산물", "회", "부산"],
    openHours: "10:00–22:00"
  },
  {
    id: "spot-007",
    name: { ko: "경주 황리단길", ja: "慶州ファンリダンキル", en: "Gyeongju Hwangridangil" },
    city: "경주",
    cityCode: "gyeongju",
    category: "street",
    speciality: { ko: "경주빵·황남빵", ja: "慶州饅頭・黄南饅頭", en: "Gyeongju bread & Hwangnam bun" },
    description: { ko: "신라 고도 경주의 트렌디한 카페·식당 거리. 천년 고도의 분위기 속에서 현대적인 한식을 즐긴다.", ja: "新羅の古都慶州のトレンディなカフェ・レストラン通り。千年古都の雰囲気の中で現代的な韓食を楽しむ。", en: "Trendy dining street in ancient Gyeongju — modern Korean food in a thousand-year-old setting." },
    address: "경북 경주시 황남동 포석로 일대",
    priceRange: "₩₩",
    mustTry: { ko: ["황남빵", "경주빵", "쌈밥"], ja: ["黄南饅頭", "慶州饅頭", "サンパプ"], en: ["Hwangnam bun", "Gyeongju bread", "Ssambap set"] },
    tags: ["카페거리", "경주", "전통과자"],
    openHours: "11:00–21:00"
  },
  {
    id: "spot-008",
    name: { ko: "제주 동문시장", ja: "済州東門市場", en: "Jeju Dongmun Market" },
    city: "제주",
    cityCode: "jeju",
    category: "market",
    speciality: { ko: "제주 향토 음식", ja: "済州郷土料理", en: "Jeju local cuisine" },
    description: { ko: "제주 최대 재래시장. 제주산 흑돼지, 옥돔, 귤 등 제주 특산물을 한자리에서 맛볼 수 있다.", ja: "済州最大の伝統市場。済州産黒豚、アカアマダイ、みかんなど済州特産品を一度に味わえる。", en: "Jeju's largest traditional market — black pork, okdom fish, and citrus all in one spot." },
    address: "제주 제주시 동문로 14",
    priceRange: "₩₩",
    mustTry: { ko: ["흑돼지 구이", "옥돔 구이", "귤 한 봉지"], ja: ["黒豚の焼肉", "アカアマダイ焼き", "みかん一袋"], en: ["Jeju black pork", "Grilled okdom fish", "Fresh citrus"] },
    tags: ["흑돼지", "제주", "시장"],
    openHours: "07:00–21:00"
  },
  {
    id: "spot-009",
    name: { ko: "천안 호두과자 거리", ja: "天安クルミ饅頭通り", en: "Cheonan Walnut Cookie Street" },
    city: "천안",
    cityCode: "cheonan",
    category: "street",
    speciality: { ko: "천안 호두과자", ja: "天安クルミ饅頭", en: "Cheonan Walnut Cookies" },
    description: { ko: "천안역 인근에 밀집한 호두과자 전문 거리. 천안의 대표 명물 호두과자를 갓 구운 상태로 맛볼 수 있다.", ja: "天安駅近くに集まるクルミ饅頭専門店街。天安名物のクルミ饅頭を焼きたてで味わえる。", en: "Walnut cookie shops clustered near Cheonan Station — try them fresh out of the mold." },
    address: "충남 천안시 동남구 대흥로 일대",
    priceRange: "₩",
    mustTry: { ko: ["호두과자", "호두강정", "호두 카스텔라"], ja: ["クルミ饅頭", "クルミ飴", "クルミカステラ"], en: ["Walnut cookies", "Walnut candy", "Walnut castella"] },
    tags: ["호두과자", "천안", "기념품"],
    openHours: "09:00–21:00"
  },
  {
    id: "spot-010",
    name: { ko: "병천 순대 골목", ja: "並川スンデ横丁", en: "Byeongcheon Sundae Alley" },
    city: "천안",
    cityCode: "cheonan",
    category: "street",
    speciality: { ko: "병천 순대", ja: "並川スンデ", en: "Byeongcheon Blood Sausage" },
    description: { ko: "3.1운동 발원지 아우내 장터 인근의 순대 골목. 쫄깃한 병천순대와 순댓국이 유명하다.", ja: "三一運動発祥地アウネ市場近くのスンデ横丁。もちもちの並川スンデとスンデク(スープ)が有名。", en: "Sundae alley near the historic Aunae Market — famous for chewy Byeongcheon blood sausage and soup." },
    address: "충남 천안시 동남구 병천면 아우내장터길",
    priceRange: "₩",
    mustTry: { ko: ["병천순대", "순댓국", "모둠 순대"], ja: ["並川スンデ", "スンデクッ", "盛り合わせスンデ"], en: ["Byeongcheon sundae", "Sundae soup", "Assorted sundae platter"] },
    tags: ["순대", "천안", "전통"],
    openHours: "10:00–20:00"
  },
  {
    id: "spot-011",
    name: { ko: "천안 중앙시장", ja: "天安中央市場", en: "Cheonan Jungang Market" },
    city: "천안",
    cityCode: "cheonan",
    category: "market",
    speciality: { ko: "천안 향토 음식", ja: "天安郷土料理", en: "Cheonan local food" },
    description: { ko: "천안 최대 재래시장. 호두과자·순대·국밥 등 천안 향토 먹거리를 한자리에서 즐길 수 있다.", ja: "天安最大の伝統市場。クルミ饅頭・スンデ・クッパなど天安の郷土料理が一か所で楽しめる。", en: "Cheonan's largest traditional market — walnut cookies, sundae, and local stews all in one place." },
    address: "충남 천안시 동남구 중앙로 지하상가",
    priceRange: "₩",
    mustTry: { ko: ["국밥", "순대", "호두과자"], ja: ["クッパ", "スンデ", "クルミ饅頭"], en: ["Gukbap (soup rice)", "Sundae", "Walnut cookies"] },
    tags: ["재래시장", "천안", "향토음식"],
    openHours: "09:00–20:00"
  },
  {
    id: "spot-012",
    name: { ko: "한국민속촌 전통시장", ja: "韓国民俗村伝統市場", en: "Korean Folk Village Traditional Market" },
    city: "용인",
    cityCode: "yongin",
    category: "market",
    speciality: { ko: "조선시대 전통 음식", ja: "朝鮮時代の伝統料理", en: "Joseon-era traditional food" },
    description: { ko: "한국민속촌 내 전통 장터. 달고나·전통 떡·도토리묵 등 옛날 먹거리를 체험할 수 있다.", ja: "韓国民俗村内の伝統市場。ダルゴナ・伝統餅・どんぐりゼリーなど昔の食べ物が体験できる。", en: "Traditional market inside Korean Folk Village — try dalgona, rice cakes, and acorn jelly from the Joseon era." },
    address: "경기 용인시 기흥구 민속촌로 90",
    priceRange: "₩",
    mustTry: { ko: ["달고나", "전통 떡", "도토리묵"], ja: ["ダルゴナ", "伝統餅", "どんぐりゼリー"], en: ["Dalgona candy", "Traditional rice cake", "Acorn jelly"] },
    tags: ["민속촌", "용인", "전통음식"],
    openHours: "09:30–18:00 (민속촌 운영시간)"
  },
  {
    id: "spot-013",
    name: { ko: "용인 전통 떡집 골목", ja: "龍仁伝統餅屋横丁", en: "Yongin Traditional Tteok Alley" },
    city: "용인",
    cityCode: "yongin",
    category: "street",
    speciality: { ko: "전통 떡", ja: "伝統餅", en: "Traditional rice cakes" },
    description: { ko: "용인 시내 전통 떡집이 모인 골목. 인절미·송편·개떡 등 다양한 손 떡을 맛볼 수 있다.", ja: "龍仁市内の伝統餅屋が集まる横丁。インジョルミ・ソンピョン・ケトックなど様々な手作り餅が味わえる。", en: "Street of traditional rice cake shops in Yongin — injeolmi, songpyeon, and more handmade varieties." },
    address: "경기 용인시 처인구 중부대로 일대",
    priceRange: "₩",
    mustTry: { ko: ["인절미", "송편", "백설기"], ja: ["インジョルミ", "ソンピョン", "白雪糕"], en: ["Injeolmi", "Songpyeon", "Baeksulgi steamed cake"] },
    tags: ["떡", "용인", "전통"],
    openHours: "09:00–19:00"
  },
  {
    id: "spot-014",
    name: { ko: "이천 쌀밥거리", ja: "利川米飯通り", en: "Icheon Rice Meal Street" },
    city: "이천",
    cityCode: "icheon",
    category: "street",
    speciality: { ko: "이천 쌀밥 정식", ja: "利川米飯定食", en: "Icheon premium rice meal set" },
    description: { ko: "임금님 수라상에 올랐던 이천 쌀로 짓는 쌀밥 정식 거리. 윤기 나는 밥에 한상 가득 반찬이 곁들여진다.", ja: "王様の食卓に上がった利川米で炊いたご飯定食の通り。艶やかなご飯に惣菜たっぷりのお膳が並ぶ。", en: "A street of restaurants serving the legendary Icheon royal rice — glossy, fragrant, and served with full banchan spreads." },
    address: "경기 이천시 부발읍 경충대로 일대",
    priceRange: "₩₩",
    mustTry: { ko: ["이천 쌀밥 정식", "돌솥밥", "된장찌개"], ja: ["利川米飯定食", "石鍋ご飯", "テンジャンチゲ"], en: ["Icheon rice set meal", "Stone pot rice", "Doenjang jjigae"] },
    tags: ["쌀밥", "이천", "정식"],
    openHours: "11:00–21:00"
  },
  {
    id: "spot-015",
    name: { ko: "도예마을 카페거리", ja: "陶芸村カフェ通り", en: "Pottery Village Cafe Street" },
    city: "이천",
    cityCode: "icheon",
    category: "cafe",
    speciality: { ko: "도자기 카페", ja: "陶器カフェ", en: "Pottery-themed cafes" },
    description: { ko: "이천 도예마을 내 도자기 공방 겸 카페. 직접 만든 도자기 컵에 담아주는 커피와 전통차가 특별하다.", ja: "利川陶芸村内の陶器工房兼カフェ。自分で作った陶器のカップで楽しむコーヒーや伝統茶が特別。", en: "Cafe-workshops inside Icheon Pottery Village — coffee and traditional tea served in handmade ceramic cups." },
    address: "경기 이천시 신둔면 도예로 일대",
    priceRange: "₩₩",
    mustTry: { ko: ["도자기 컵 커피", "산수유차", "쑥 라떼"], ja: ["陶器カップコーヒー", "サンシュユ茶", "ヨモギラテ"], en: ["Ceramic cup coffee", "Cornus tea", "Mugwort latte"] },
    tags: ["카페", "이천", "도자기"],
    openHours: "10:00–18:00"
  },
]

export const CITIES = [
  { code: "all",      ko: "전체", ja: "すべて", en: "All" },
  { code: "jeonju",   ko: "전주", ja: "全州",   en: "Jeonju" },
  { code: "cheonan",  ko: "천안", ja: "天安",   en: "Cheonan" },
  { code: "yongin",   ko: "용인", ja: "龍仁",   en: "Yongin" },
  { code: "icheon",   ko: "이천", ja: "利川",   en: "Icheon" },
  { code: "seoul",    ko: "서울", ja: "ソウル",  en: "Seoul" },
  { code: "busan",    ko: "부산", ja: "釜山",   en: "Busan" },
  { code: "gyeongju",  ko: "경주", ja: "慶州",   en: "Gyeongju" },
  { code: "jeju",      ko: "제주", ja: "済州",   en: "Jeju" },
  { code: "tongyeong", ko: "통영", ja: "統営",   en: "Tongyeong" },
]

export const CATEGORY_LABEL = {
  ko: { restaurant: "식당", market: "시장", street: "거리", cafe: "카페" },
  ja: { restaurant: "食堂", market: "市場", street: "通り", cafe: "カフェ" },
  en: { restaurant: "Restaurant", market: "Market", street: "Street", cafe: "Cafe" },
}
