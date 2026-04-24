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
  // ── 인천 (Incheon) ─────────────────────────────
  {
    id: "spot-016",
    name: { ko: "인천 차이나타운", ja: "仁川チャイナタウン", en: "Incheon Chinatown" },
    city: "인천",
    cityCode: "incheon",
    category: "street",
    speciality: { ko: "짜장면", ja: "ジャージャー麺", en: "Jjajangmyeon" },
    description: { ko: "한국 짜장면의 발상지. 100년 넘은 노포에서 원조 짜장면과 공갈빵을 맛볼 수 있다.", ja: "韓国ジャージャー麺の発祥地。100年超の老舗で元祖ジャージャー麺とコンガルパンが味わえる。", en: "Birthplace of Korean jjajangmyeon — try the original black-bean noodles and puffy gonggal-bbang at century-old eateries." },
    address: "인천 중구 차이나타운로",
    priceRange: "₩₩",
    mustTry: { ko: ["원조 짜장면", "공갈빵", "짬뽕"], ja: ["元祖ジャージャー麺", "コンガルパン", "チャンポン"], en: ["Original jjajangmyeon", "Gonggal-bbang", "Jjamppong"] },
    tags: ["차이나타운", "짜장면", "인천"],
    openHours: "10:00–21:00"
  },
  // ── 대전 (Daejeon) ─────────────────────────────
  {
    id: "spot-017",
    name: { ko: "성심당 본점", ja: "聖心堂本店", en: "Sungsimdang Main Store" },
    city: "대전",
    cityCode: "daejeon",
    category: "restaurant",
    speciality: { ko: "튀김소보로·부추빵", ja: "揚げそぼろ・ニラパン", en: "Twigim soboro & chive bread" },
    description: { ko: "대전을 대표하는 전설의 빵집. 튀김소보로 한 개 맛보려 줄 서는 국민 명소.", ja: "大田を代表する伝説のパン屋。揚げそぼろを一つ味わうために行列ができる国民的スポット。", en: "Daejeon's legendary bakery — people queue just for one twigim-soboro doughnut." },
    address: "대전 중구 대종로480번길 15",
    priceRange: "₩",
    mustTry: { ko: ["튀김소보로", "부추빵", "판타롱 부추빵"], ja: ["揚げそぼろ", "ニラパン", "パンタロンニラパン"], en: ["Twigim soboro", "Chive bread", "Pantalon chive loaf"] },
    tags: ["빵집", "대전", "성심당"],
    openHours: "08:00–22:00"
  },
  {
    id: "spot-018",
    name: { ko: "대전 중앙시장", ja: "大田中央市場", en: "Daejeon Jungang Market" },
    city: "대전",
    cityCode: "daejeon",
    category: "market",
    speciality: { ko: "칼국수·육회비빔밥", ja: "カルグクス・ユッケビビンバ", en: "Kalguksu & yukhoe bibimbap" },
    description: { ko: "대전 최대 전통시장. 대전 3대 칼국수와 육회비빔밥을 저렴하게 즐길 수 있다.", ja: "大田最大の伝統市場。大田三大カルグクスとユッケビビンバをリーズナブルに楽しめる。", en: "Daejeon's largest traditional market — try the famed kalguksu and yukhoe bibimbap at local prices." },
    address: "대전 동구 중앙로215번길",
    priceRange: "₩",
    mustTry: { ko: ["두부 두루치기", "칼국수", "육회비빔밥"], ja: ["豆腐ドゥルチギ", "カルグクス", "ユッケビビンバ"], en: ["Dubu duruchigi", "Kalguksu noodles", "Yukhoe bibimbap"] },
    tags: ["전통시장", "대전", "칼국수"],
    openHours: "08:00–21:00"
  },
  // ── 대구 (Daegu) ───────────────────────────────
  {
    id: "spot-019",
    name: { ko: "서문시장 야시장", ja: "西門市場夜市", en: "Seomun Night Market" },
    city: "대구",
    cityCode: "daegu",
    category: "market",
    speciality: { ko: "납작만두·무침회", ja: "ナプチャクマンドゥ・ムチムフェ", en: "Flat dumplings & spicy sashimi" },
    description: { ko: "대구 3대 시장 중 최대 규모. 매일 밤 야시장으로 변신하는 먹거리의 성지.", ja: "大邱三大市場の中で最大規模。毎晩夜市に変身するグルメの聖地。", en: "The largest of Daegu's three major markets — transforms into a nightly food paradise." },
    address: "대구 중구 큰장로26길",
    priceRange: "₩",
    mustTry: { ko: ["납작만두", "무침회", "오징어 버터구이"], ja: ["ナプチャクマンドゥ", "ムチムフェ", "イカバター焼き"], en: ["Flat dumplings", "Spicy raw fish salad", "Butter-grilled squid"] },
    tags: ["야시장", "대구", "납작만두"],
    openHours: "19:00–24:00"
  },
  // ── 광주 (Gwangju) ─────────────────────────────
  {
    id: "spot-020",
    name: { ko: "1913 송정역시장", ja: "1913松汀駅市場", en: "1913 Songjeong Station Market" },
    city: "광주",
    cityCode: "gwangju",
    category: "market",
    speciality: { ko: "계란밥·떡갈비", ja: "卵ご飯・トックカルビ", en: "Egg rice & tteokgalbi" },
    description: { ko: "1913년 개장한 전통시장이 현대적으로 리모델링된 뉴트로 감성 시장. 광주 대표 핫플.", ja: "1913年開場の伝統市場が現代的にリニューアル。光州のニュートロ感性スポット。", en: "A 1913 traditional market reimagined as a retro-chic destination — one of Gwangju's hottest food streets." },
    address: "광주 광산구 송정로8번길",
    priceRange: "₩₩",
    mustTry: { ko: ["계란밥", "떡갈비", "상추튀김"], ja: ["卵ご飯", "トックカルビ", "サンチュの天ぷら"], en: ["Egg rice", "Tteokgalbi ribs", "Lettuce tempura"] },
    tags: ["뉴트로", "광주", "전통시장"],
    openHours: "10:00–22:00"
  },
  // ── 울산 (Ulsan) ───────────────────────────────
  {
    id: "spot-021",
    name: { ko: "장생포 고래문화마을", ja: "長生浦クジラ文化村", en: "Jangsaengpo Whale Culture Village" },
    city: "울산",
    cityCode: "ulsan",
    category: "street",
    speciality: { ko: "고래고기 수육", ja: "クジラ肉スユク", en: "Whale meat suyuk" },
    description: { ko: "국내 유일 고래잡이 문화가 남은 장생포. 고래고기 수육과 해산물 전문 식당이 모여있다.", ja: "国内唯一の捕鯨文化が残る長生浦。クジラ肉スユクや海鮮専門店が集まる。", en: "Korea's last whaling heritage site — restaurants cluster around serving whale-meat suyuk and seafood." },
    address: "울산 남구 장생포고래로",
    priceRange: "₩₩₩",
    mustTry: { ko: ["고래 수육", "문어 숙회", "곰장어구이"], ja: ["クジラスユク", "タコ熟膾", "アナゴ焼き"], en: ["Whale suyuk", "Boiled octopus", "Grilled sea eel"] },
    tags: ["고래", "울산", "해산물"],
    openHours: "11:00–21:00"
  },
  // ── 세종 (Sejong) ──────────────────────────────
  {
    id: "spot-022",
    name: { ko: "조치원 전통시장", ja: "鳥致院伝統市場", en: "Jochiwon Traditional Market" },
    city: "세종",
    cityCode: "sejong",
    category: "market",
    speciality: { ko: "조치원 복숭아·장칼국수", ja: "鳥致院桃・ジャンカルグクス", en: "Jochiwon peaches & jang kalguksu" },
    description: { ko: "세종시의 유일한 대형 전통시장. 조치원 복숭아와 장칼국수가 대표 먹거리.", ja: "世宗市唯一の大型伝統市場。鳥致院桃とジャンカルグクスが看板メニュー。", en: "Sejong's only large traditional market — famed for Jochiwon peaches and hearty jang kalguksu noodles." },
    address: "세종 조치원읍 남리",
    priceRange: "₩",
    mustTry: { ko: ["장칼국수", "복숭아 주스", "녹두빈대떡"], ja: ["ジャンカルグクス", "桃ジュース", "緑豆チヂミ"], en: ["Jang kalguksu", "Peach juice", "Mung-bean pancake"] },
    tags: ["전통시장", "세종", "복숭아"],
    openHours: "08:00–20:00"
  },
  // ── 경기 (Gyeonggi) ────────────────────────────
  {
    id: "spot-023",
    name: { ko: "수원 통닭거리", ja: "水原トンダッ通り", en: "Suwon Fried Chicken Street" },
    city: "수원",
    cityCode: "gyeonggi",
    category: "street",
    speciality: { ko: "수원 통닭", ja: "水原トンダッ", en: "Suwon whole fried chicken" },
    description: { ko: "수원 팔달문 근처 통닭 원조 거리. 60년대부터 이어져 온 통마리 통닭의 성지.", ja: "水原八達門近くのトンダッ元祖通り。60年代から続くトンマリ通鶏の聖地。", en: "The original whole-chicken alley near Paldalmun — a tradition dating back to the 1960s." },
    address: "경기 수원시 팔달구 팔달문로",
    priceRange: "₩₩",
    mustTry: { ko: ["통마리 통닭", "간장 닭", "닭똥집 볶음"], ja: ["トンマリトンダッ", "醤油チキン", "砂ずり炒め"], en: ["Whole fried chicken", "Soy-glazed chicken", "Stir-fried gizzards"] },
    tags: ["통닭", "수원", "경기"],
    openHours: "15:00–24:00"
  },
  // ── 강원 (Gangwon) ─────────────────────────────
  {
    id: "spot-024",
    name: { ko: "강릉 초당순두부마을", ja: "江陵草堂スンドゥブ村", en: "Gangneung Chodang Tofu Village" },
    city: "강릉",
    cityCode: "gangwon",
    category: "street",
    speciality: { ko: "초당 순두부", ja: "草堂スンドゥブ", en: "Chodang soft tofu" },
    description: { ko: "동해 바닷물로 간을 맞춘 강릉 초당순두부의 원조 마을. 따끈한 순두부 한 그릇이 별미.", ja: "東海の海水で味を整える江陵草堂スンドゥブの元祖村。温かいスンドゥブが絶品。", en: "The original village of Chodang tofu — seasoned with East Sea seawater for its signature savory flavor." },
    address: "강원 강릉시 초당동",
    priceRange: "₩₩",
    mustTry: { ko: ["초당순두부", "두부전골", "콩물국수"], ja: ["草堂スンドゥブ", "豆腐チョンゴル", "豆乳ククス"], en: ["Chodang sundubu", "Tofu hotpot", "Soy milk noodle"] },
    tags: ["순두부", "강릉", "강원"],
    openHours: "08:00–20:00"
  },
  {
    id: "spot-025",
    name: { ko: "속초 중앙시장", ja: "束草中央市場", en: "Sokcho Jungang Market" },
    city: "속초",
    cityCode: "gangwon",
    category: "market",
    speciality: { ko: "닭강정·오징어순대", ja: "タッカンジョン・イカスンデ", en: "Dakgangjeong & squid sundae" },
    description: { ko: "속초 대표 전통시장. 닭강정 원조와 오징어순대, 아바이순대 등 강원도 먹거리가 한자리에.", ja: "束草を代表する伝統市場。元祖タッカンジョン、イカスンデ、アバイスンデなど江原道の味覚が集結。", en: "Sokcho's signature market — home of original dakgangjeong, squid sundae, and Abai-style blood sausage." },
    address: "강원 속초시 중앙시장로",
    priceRange: "₩",
    mustTry: { ko: ["닭강정", "오징어순대", "아바이순대"], ja: ["タッカンジョン", "イカスンデ", "アバイスンデ"], en: ["Dakgangjeong", "Squid sundae", "Abai sundae"] },
    tags: ["시장", "속초", "닭강정"],
    openHours: "08:00–21:00"
  },
  {
    id: "spot-026",
    name: { ko: "춘천 명동 닭갈비골목", ja: "春川明洞タッカルビ横丁", en: "Chuncheon Myeongdong Dakgalbi Street" },
    city: "춘천",
    cityCode: "gangwon",
    category: "street",
    speciality: { ko: "춘천 닭갈비", ja: "春川タッカルビ", en: "Chuncheon dakgalbi" },
    description: { ko: "춘천 닭갈비의 원조 골목. 넓은 철판에 양념 닭과 야채를 볶아 먹는 춘천 대표 음식.", ja: "春川タッカルビの元祖横丁。鉄板でヤンニョムチキンと野菜を炒めて食べる春川の代表料理。", en: "The original dakgalbi alley — watch stir-fried spicy chicken come together on a giant griddle, Chuncheon-style." },
    address: "강원 춘천시 중앙로 일대",
    priceRange: "₩₩",
    mustTry: { ko: ["닭갈비", "볶음밥", "막국수"], ja: ["タッカルビ", "ポックンパプ", "マッククス"], en: ["Dakgalbi", "Fried rice finisher", "Makguksu noodle"] },
    tags: ["닭갈비", "춘천", "강원"],
    openHours: "11:00–22:00"
  },
  // ── 충북 (Chungbuk) ────────────────────────────
  {
    id: "spot-027",
    name: { ko: "청주 육거리종합시장", ja: "清州六巨里総合市場", en: "Cheongju Yukgeori Market" },
    city: "청주",
    cityCode: "chungbuk",
    category: "market",
    speciality: { ko: "청주 족발·장칼국수", ja: "清州チョッパル・ジャンカルグクス", en: "Cheongju jokbal & jang kalguksu" },
    description: { ko: "청주 최대 전통시장. 청주 3대 족발과 장칼국수를 저렴하게 맛볼 수 있는 현지인 맛집 집결지.", ja: "清州最大の伝統市場。清州三大チョッパルとジャンカルグクスが地元価格で味わえる。", en: "Cheongju's largest market — home to the city's top three jokbal spots and comforting jang kalguksu." },
    address: "충북 청주시 상당구 석교동",
    priceRange: "₩",
    mustTry: { ko: ["족발", "장칼국수", "수수부꾸미"], ja: ["チョッパル", "ジャンカルグクス", "コーリャンブクミ"], en: ["Jokbal", "Jang kalguksu", "Susu-bukkumi pancake"] },
    tags: ["전통시장", "청주", "족발"],
    openHours: "08:00–21:00"
  },
  // ── 충남 (Chungnam, 공주) ──────────────────────
  {
    id: "spot-028",
    name: { ko: "공주 산성시장 국밥거리", ja: "公州山城市場クッパ通り", en: "Gongju Sanseong Gukbap Street" },
    city: "공주",
    cityCode: "chungnam",
    category: "street",
    speciality: { ko: "공주 국밥", ja: "公州クッパ", en: "Gongju gukbap" },
    description: { ko: "백제 고도 공주의 전통 국밥거리. 얼큰한 콩나물국밥과 양지머리 국밥이 대표 메뉴.", ja: "百済古都・公州の伝統クッパ通り。ピリッと辛い豆もやしクッパとヤンジクッパが看板。", en: "Traditional gukbap street in the old Baekje capital — spicy bean-sprout rice soup and brisket gukbap are the stars." },
    address: "충남 공주시 산성동",
    priceRange: "₩",
    mustTry: { ko: ["콩나물국밥", "양지국밥", "밤막걸리"], ja: ["豆もやしクッパ", "ヤンジクッパ", "栗マッコリ"], en: ["Bean sprout gukbap", "Brisket gukbap", "Chestnut makgeolli"] },
    tags: ["국밥", "공주", "충남"],
    openHours: "07:00–20:00"
  },
  // ── 경북 (Gyeongbuk, 포항·안동) ────────────────
  {
    id: "spot-029",
    name: { ko: "포항 죽도시장", ja: "浦項竹島市場", en: "Pohang Jukdo Market" },
    city: "포항",
    cityCode: "gyeongbuk",
    category: "market",
    speciality: { ko: "물회·과메기", ja: "ムルフェ・クァメギ", en: "Mulhoe & gwamegi" },
    description: { ko: "동해안 최대 수산시장. 물회와 겨울 별미 과메기가 포항의 대표 음식.", ja: "東海岸最大の水産市場。ムルフェと冬の珍味クァメギが浦項の看板料理。", en: "The East Coast's largest fish market — famed for chilled mulhoe and winter's signature gwamegi." },
    address: "경북 포항시 북구 죽도시장길",
    priceRange: "₩₩",
    mustTry: { ko: ["물회", "과메기", "피데기 오징어"], ja: ["ムルフェ", "クァメギ", "ピデギイカ"], en: ["Mulhoe", "Gwamegi", "Half-dried squid"] },
    tags: ["수산시장", "포항", "물회"],
    openHours: "06:00–20:00"
  },
  {
    id: "spot-030",
    name: { ko: "안동 찜닭 골목", ja: "安東チムタク横丁", en: "Andong Jjimdak Alley" },
    city: "안동",
    cityCode: "gyeongbuk",
    category: "street",
    speciality: { ko: "안동 찜닭", ja: "安東チムタク", en: "Andong jjimdak" },
    description: { ko: "안동 구시장 안 찜닭 원조 골목. 간장 베이스의 달콤짭조름한 찜닭이 탄생한 곳.", ja: "安東旧市場内のチムタク元祖横丁。醤油ベースの甘辛チムタクが誕生した地。", en: "The birthplace of Andong jjimdak — soy-glazed, sweet-savory braised chicken in the old market alley." },
    address: "경북 안동시 서부동 구시장",
    priceRange: "₩₩",
    mustTry: { ko: ["안동 찜닭", "간고등어구이", "헛제사밥"], ja: ["安東チムタク", "塩サバ焼き", "ホッチェサパプ"], en: ["Andong jjimdak", "Grilled salted mackerel", "Heotjesa-bap ritual rice"] },
    tags: ["찜닭", "안동", "경북"],
    openHours: "11:00–22:00"
  },
  // ── 경남 (Gyeongnam, 창원) ─────────────────────
  {
    id: "spot-031",
    name: { ko: "창원 창동 예술 골목", ja: "昌原昌洞アート横丁", en: "Changwon Changdong Art Alley" },
    city: "창원",
    cityCode: "gyeongnam",
    category: "street",
    speciality: { ko: "마산 아구찜·통술", ja: "馬山アグチム・トンスル", en: "Masan agujjim & tongsul" },
    description: { ko: "마산의 옛 번화가인 창동에 자리한 예술 골목. 아구찜과 통술(반찬 한상) 맛집이 모여있다.", ja: "馬山の旧繁華街・昌洞のアート横丁。アグチムとトンスル(おかずコース)の名店が集まる。", en: "Masan's old downtown turned art alley — clustered with agujjim (spicy monkfish) and tongsul banchan courses." },
    address: "경남 창원시 마산합포구 창동",
    priceRange: "₩₩",
    mustTry: { ko: ["마산 아구찜", "통술", "홍합탕"], ja: ["馬山アグチム", "トンスル", "ムール貝スープ"], en: ["Masan agujjim", "Tongsul course", "Mussel soup"] },
    tags: ["아구찜", "창원", "경남"],
    openHours: "11:00–23:00"
  },
  // ── 전북 (Jeonbuk, 군산) ───────────────────────
  {
    id: "spot-032",
    name: { ko: "군산 이성당 빵집거리", ja: "群山李盛堂パン屋通り", en: "Gunsan Leesungdang Bakery Street" },
    city: "군산",
    cityCode: "jeonbuk",
    category: "street",
    speciality: { ko: "단팥빵·야채빵", ja: "あんパン・野菜パン", en: "Red-bean bun & vegetable bun" },
    description: { ko: "1945년부터 운영 중인 한국 최장수 빵집 이성당 본점과 주변 빵집 거리. 줄 서서 맛보는 단팥빵이 명물.", ja: "1945年から続く韓国最古のパン屋・李盛堂本店を中心としたパン屋通り。行列必至のあんパンが名物。", en: "Home of Korea's oldest bakery (est. 1945) — locals queue for the famed red-bean and vegetable buns." },
    address: "전북 군산시 중앙로 일대",
    priceRange: "₩",
    mustTry: { ko: ["단팥빵", "야채빵", "짬뽕"], ja: ["あんパン", "野菜パン", "チャンポン"], en: ["Red-bean bun", "Vegetable bun", "Jjamppong"] },
    tags: ["빵집", "군산", "전북"],
    openHours: "08:00–21:00"
  },
  // ── 전남 (Jeonnam, 여수·순천) ──────────────────
  {
    id: "spot-033",
    name: { ko: "여수 중앙시장", ja: "麗水中央市場", en: "Yeosu Jungang Market" },
    city: "여수",
    cityCode: "jeonnam",
    category: "market",
    speciality: { ko: "돌산갓김치·서대회", ja: "突山カッキムチ・舌平目の刺身和え", en: "Dolsan mustard kimchi & seodaehoe" },
    description: { ko: "여수 최대 재래시장. 돌산 갓김치와 서대회, 장어탕 등 여수 향토 음식의 집결지.", ja: "麗水最大の伝統市場。突山カッキムチや舌平目の和え物、うなぎスープなど麗水の郷土料理が集まる。", en: "Yeosu's largest market — hub of local flavors like Dolsan mustard kimchi, seodaehoe, and eel soup." },
    address: "전남 여수시 중앙시장길",
    priceRange: "₩",
    mustTry: { ko: ["돌산갓김치", "서대회", "장어탕"], ja: ["突山カッキムチ", "舌平目の和え", "うなぎスープ"], en: ["Dolsan gat-kimchi", "Seodaehoe", "Eel soup"] },
    tags: ["전통시장", "여수", "전남"],
    openHours: "07:00–20:00"
  },
  {
    id: "spot-034",
    name: { ko: "순천 웃장 국밥거리", ja: "順天ウッチャン・クッパ通り", en: "Suncheon Utjang Gukbap Street" },
    city: "순천",
    cityCode: "jeonnam",
    category: "street",
    speciality: { ko: "순천 돼지국밥", ja: "順天テジクッパ", en: "Suncheon pork gukbap" },
    description: { ko: "순천 웃장(상위 시장) 안에 자리한 국밥 원조 거리. 구수한 돼지국밥 한 그릇이 순천 새벽 맛집.", ja: "順天ウッチャン(上市場)内にあるクッパ元祖通り。香ばしいテジクッパが順天の早朝グルメ。", en: "Original gukbap alley inside Suncheon's Utjang market — earthy pork gukbap is a local breakfast staple." },
    address: "전남 순천시 웃장길",
    priceRange: "₩",
    mustTry: { ko: ["돼지국밥", "수육", "콩나물해장국"], ja: ["テジクッパ", "スユク", "豆もやしヘジャンクッ"], en: ["Pork gukbap", "Suyuk sliced pork", "Haejang bean-sprout soup"] },
    tags: ["국밥", "순천", "전남"],
    openHours: "05:00–20:00"
  },
]

export interface KFoodCity {
  code: string
  ko: string
  ja: string
  en: string
  'zh-CN': string
  'zh-TW': string
  emoji: string
}

// 전국 17개 광역시도 + 레거시 6개 시군 (SIGHTS CITIES와 동기화)
export const CITIES: KFoodCity[] = [
  { code: "all",       ko: "전체",       ja: "すべて",    en: "All",       "zh-CN": "全部",       "zh-TW": "全部",       emoji: "📍" },
  // ── 17개 광역시도 ──
  { code: "seoul",     ko: "서울",       ja: "ソウル",    en: "Seoul",     "zh-CN": "首尔",       "zh-TW": "首爾",       emoji: "🏙️" },
  { code: "incheon",   ko: "인천",       ja: "仁川",      en: "Incheon",   "zh-CN": "仁川",       "zh-TW": "仁川",       emoji: "✈️" },
  { code: "daejeon",   ko: "대전",       ja: "大田",      en: "Daejeon",   "zh-CN": "大田",       "zh-TW": "大田",       emoji: "🔬" },
  { code: "daegu",     ko: "대구",       ja: "大邱",      en: "Daegu",     "zh-CN": "大邱",       "zh-TW": "大邱",       emoji: "🍎" },
  { code: "gwangju",   ko: "광주",       ja: "光州",      en: "Gwangju",   "zh-CN": "光州",       "zh-TW": "光州",       emoji: "🌻" },
  { code: "busan",     ko: "부산",       ja: "釜山",      en: "Busan",     "zh-CN": "釜山",       "zh-TW": "釜山",       emoji: "🌊" },
  { code: "ulsan",     ko: "울산",       ja: "蔚山",      en: "Ulsan",     "zh-CN": "蔚山",       "zh-TW": "蔚山",       emoji: "🐳" },
  { code: "sejong",    ko: "세종",       ja: "世宗",      en: "Sejong",    "zh-CN": "世宗",       "zh-TW": "世宗",       emoji: "🏛️" },
  { code: "gyeonggi",  ko: "경기도",     ja: "京畿道",    en: "Gyeonggi",  "zh-CN": "京畿道",     "zh-TW": "京畿道",     emoji: "🌆" },
  { code: "gangwon",   ko: "강원도",     ja: "江原道",    en: "Gangwon",   "zh-CN": "江原道",     "zh-TW": "江原道",     emoji: "⛰️" },
  { code: "chungbuk",  ko: "충청북도",   ja: "忠清北道",  en: "Chungbuk",  "zh-CN": "忠清北道",   "zh-TW": "忠清北道",   emoji: "🌾" },
  { code: "chungnam",  ko: "충청남도",   ja: "忠清南道",  en: "Chungnam",  "zh-CN": "忠清南道",   "zh-TW": "忠清南道",   emoji: "🌊" },
  { code: "gyeongbuk", ko: "경상북도",   ja: "慶尚北道",  en: "Gyeongbuk", "zh-CN": "庆尚北道",   "zh-TW": "慶尚北道",   emoji: "🏯" },
  { code: "gyeongnam", ko: "경상남도",   ja: "慶尚南道",  en: "Gyeongnam", "zh-CN": "庆尚南道",   "zh-TW": "慶尚南道",   emoji: "⛵" },
  { code: "jeonbuk",   ko: "전라북도",   ja: "全羅北道",  en: "Jeonbuk",   "zh-CN": "全罗北道",   "zh-TW": "全羅北道",   emoji: "🏮" },
  { code: "jeonnam",   ko: "전라남도",   ja: "全羅南道",  en: "Jeonnam",   "zh-CN": "全罗南道",   "zh-TW": "全羅南道",   emoji: "🎋" },
  { code: "jeju",      ko: "제주",       ja: "済州",      en: "Jeju",      "zh-CN": "济州",       "zh-TW": "濟州",       emoji: "🌴" },
  // ── 레거시 하위 시군 (기존 스팟 호환) ──
  { code: "gyeongju",  ko: "경주",       ja: "慶州",      en: "Gyeongju",  "zh-CN": "庆州",       "zh-TW": "慶州",       emoji: "👑" },
  { code: "jeonju",    ko: "전주",       ja: "全州",      en: "Jeonju",    "zh-CN": "全州",       "zh-TW": "全州",       emoji: "🏮" },
  { code: "tongyeong", ko: "통영",       ja: "統営",      en: "Tongyeong", "zh-CN": "统营",       "zh-TW": "統營",       emoji: "⛵" },
  { code: "cheonan",   ko: "천안",       ja: "天安",      en: "Cheonan",   "zh-CN": "天安",       "zh-TW": "天安",       emoji: "🎋" },
  { code: "yongin",    ko: "용인",       ja: "龍仁",      en: "Yongin",   "zh-CN": "龙仁",       "zh-TW": "龍仁",       emoji: "🎢" },
  { code: "icheon",    ko: "이천",       ja: "利川",      en: "Icheon",    "zh-CN": "利川",       "zh-TW": "利川",       emoji: "🏺" },
]

export const CATEGORY_LABEL = {
  ko: { restaurant: "식당", market: "시장", street: "거리", cafe: "카페" },
  ja: { restaurant: "食堂", market: "市場", street: "通り", cafe: "カフェ" },
  en: { restaurant: "Restaurant", market: "Market", street: "Street", cafe: "Cafe" },
}
