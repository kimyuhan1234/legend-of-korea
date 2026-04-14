// ─────────────────────────────────────────────
//  lib/data/diy-workshops.ts
//  9개 도시별 체험 묶음 데이터 (검색 URL만 사용)
// ─────────────────────────────────────────────

type I18n = { ko: string; en: string; ja: string }

export interface CityWorkshop {
  cityId: string
  cityName: I18n
  description: I18n
  experiences: { icon: string; name: I18n }[]
  priceRange: string
  duration: string
  bookingLinks: { platform: string; url: string; icon: string }[]
}

export const CITY_WORKSHOPS: CityWorkshop[] = [
  {
    cityId: 'jeonju',
    cityName: { ko: '전주', en: 'Jeonju', ja: '全州' },
    description: {
      ko: '한옥마을에서 즐기는 전통 공예 체험',
      en: 'Traditional craft experiences in Hanok Village',
      ja: '韓屋村で楽しむ伝統工芸体験',
    },
    experiences: [
      { icon: '🎨', name: { ko: '한지 공예', en: 'Hanji paper craft', ja: '韓紙工芸' } },
      { icon: '👘', name: { ko: '한복 체험 & 사진촬영', en: 'Hanbok experience & photo', ja: '韓服体験＆写真' } },
      { icon: '🍪', name: { ko: '한과 만들기', en: 'Korean cookie making', ja: '韓菓作り' } },
      { icon: '🏺', name: { ko: '도자기 빚기', en: 'Pottery making', ja: '陶芸体験' } },
      { icon: '🎋', name: { ko: '합죽선 만들기', en: 'Traditional fan craft', ja: '伝統扇子作り' } },
      { icon: '🧵', name: { ko: '천연 염색', en: 'Natural dyeing', ja: '天然染色' } },
    ],
    priceRange: '₩12,000 ~ ₩30,000',
    duration: '1~2h',
    bookingLinks: [
      { platform: 'Klook', url: 'https://www.klook.com/en/search/result/?query=Jeonju+workshop+experience', icon: '🟠' },
      { platform: 'Viator', url: 'https://www.viator.com/searchResults/all?text=Jeonju+craft+experience', icon: '🟢' },
    ],
  },
  {
    cityId: 'seoul',
    cityName: { ko: '서울', en: 'Seoul', ja: 'ソウル' },
    description: {
      ko: '트렌디한 성수·홍대에서 즐기는 크래프트',
      en: 'Trendy craft workshops in Seongsu & Hongdae',
      ja: 'トレンディな聖水・弘大のクラフト体験',
    },
    experiences: [
      { icon: '🏺', name: { ko: '도자기 공방', en: 'Pottery studio', ja: '陶芸工房' } },
      { icon: '🌸', name: { ko: '향수 만들기', en: 'Perfume making', ja: '香水作り' } },
      { icon: '💎', name: { ko: '실버링 만들기', en: 'Silver ring making', ja: 'シルバーリング作り' } },
      { icon: '🕯️', name: { ko: '캔들 만들기', en: 'Candle making', ja: 'キャンドル作り' } },
      { icon: '🎨', name: { ko: '유리 공예', en: 'Glass art', ja: 'ガラス工芸' } },
      { icon: '👘', name: { ko: '한복 체험', en: 'Hanbok experience', ja: '韓服体験' } },
    ],
    priceRange: '₩20,000 ~ ₩50,000',
    duration: '1~3h',
    bookingLinks: [
      { platform: 'Klook', url: 'https://www.klook.com/en/search/result/?query=Seoul+craft+workshop', icon: '🟠' },
      { platform: 'Viator', url: 'https://www.viator.com/searchResults/all?text=Seoul+craft+workshop', icon: '🟢' },
      { platform: 'GetYourGuide', url: 'https://www.getyourguide.com/s/?q=Seoul+craft+class', icon: '🔵' },
    ],
  },
  {
    cityId: 'busan',
    cityName: { ko: '부산', en: 'Busan', ja: '釜山' },
    description: {
      ko: '바다가 보이는 공방에서 특별한 체험',
      en: 'Special craft experiences with ocean views',
      ja: '海が見える工房での特別な体験',
    },
    experiences: [
      { icon: '🏺', name: { ko: '해운대 도자기', en: 'Haeundae pottery', ja: '海雲台陶芸' } },
      { icon: '🕯️', name: { ko: '바다향 캔들', en: 'Ocean candle making', ja: '海キャンドル' } },
      { icon: '🎨', name: { ko: '아크릴 아트', en: 'Acrylic art class', ja: 'アクリルアート' } },
      { icon: '🧂', name: { ko: '천일염 비누 만들기', en: 'Sea salt soap making', ja: '天日塩石鹸作り' } },
      { icon: '👘', name: { ko: '한복 체험', en: 'Hanbok experience', ja: '韓服体験' } },
    ],
    priceRange: '₩15,000 ~ ₩40,000',
    duration: '1~2h',
    bookingLinks: [
      { platform: 'Klook', url: 'https://www.klook.com/en/search/result/?query=Busan+craft+workshop', icon: '🟠' },
      { platform: 'Viator', url: 'https://www.viator.com/searchResults/all?text=Busan+craft+experience', icon: '🟢' },
    ],
  },
  {
    cityId: 'jeju',
    cityName: { ko: '제주', en: 'Jeju', ja: '済州' },
    description: {
      ko: '자연과 함께하는 제주만의 체험',
      en: 'Unique Jeju experiences with nature',
      ja: '自然と共にする済州ならではの体験',
    },
    experiences: [
      { icon: '🏺', name: { ko: '도자기 빚기', en: 'Pottery making', ja: '陶芸体験' } },
      { icon: '🌸', name: { ko: '자연 향수 만들기', en: 'Natural perfume making', ja: '天然香水作り' } },
      { icon: '🍊', name: { ko: '감귤 청 만들기', en: 'Tangerine syrup making', ja: 'みかんシロップ作り' } },
      { icon: '🧴', name: { ko: '가죽 공예', en: 'Leather craft', ja: 'レザークラフト' } },
      { icon: '🍫', name: { ko: '초콜릿 만들기', en: 'Chocolate making', ja: 'チョコレート作り' } },
    ],
    priceRange: '₩15,000 ~ ₩45,000',
    duration: '1~2h',
    bookingLinks: [
      { platform: 'Klook', url: 'https://www.klook.com/en/search/result/?query=Jeju+craft+experience', icon: '🟠' },
      { platform: 'Viator', url: 'https://www.viator.com/searchResults/all?text=Jeju+craft+workshop', icon: '🟢' },
    ],
  },
  {
    cityId: 'gyeongju',
    cityName: { ko: '경주', en: 'Gyeongju', ja: '慶州' },
    description: {
      ko: '천년 고도에서 즐기는 역사 체험',
      en: 'Historical experiences in the ancient capital',
      ja: '千年の古都で楽しむ歴史体験',
    },
    experiences: [
      { icon: '🏺', name: { ko: '신라 도예 체험', en: 'Silla pottery', ja: '新羅陶芸' } },
      { icon: '📜', name: { ko: '탁본 체험', en: 'Stone rubbing', ja: '拓本体験' } },
      { icon: '👘', name: { ko: '신라 복식 체험', en: 'Silla costume', ja: '新羅衣装体験' } },
      { icon: '🍵', name: { ko: '전통 다도', en: 'Tea ceremony', ja: '伝統茶道' } },
    ],
    priceRange: '₩10,000 ~ ₩25,000',
    duration: '1~2h',
    bookingLinks: [
      { platform: 'Klook', url: 'https://www.klook.com/en/search/result/?query=Gyeongju+cultural+experience', icon: '🟠' },
      { platform: 'Viator', url: 'https://www.viator.com/searchResults/all?text=Gyeongju+experience', icon: '🟢' },
    ],
  },
  {
    cityId: 'tongyeong',
    cityName: { ko: '통영', en: 'Tongyeong', ja: '統営' },
    description: {
      ko: '예술의 도시에서 즐기는 장인 체험',
      en: 'Artisan experiences in the city of art',
      ja: '芸術の都市で楽しむ匠の体験',
    },
    experiences: [
      { icon: '✨', name: { ko: '나전칠기 체험', en: 'Mother-of-pearl craft', ja: '螺鈿漆器体験' } },
      { icon: '🕯️', name: { ko: '바다 캔들 만들기', en: 'Ocean candle making', ja: '海キャンドル作り' } },
      { icon: '🎨', name: { ko: '통영 12공방 투어', en: '12 Workshop tour', ja: '12工房ツアー' } },
      { icon: '🧶', name: { ko: '매듭 공예', en: 'Korean knot craft', ja: '韓国結び工芸' } },
    ],
    priceRange: '₩15,000 ~ ₩35,000',
    duration: '1~2h',
    bookingLinks: [
      { platform: 'Klook', url: 'https://www.klook.com/en/search/result/?query=Tongyeong+craft+experience', icon: '🟠' },
    ],
  },
  {
    cityId: 'cheonan',
    cityName: { ko: '천안', en: 'Cheonan', ja: '天安' },
    description: {
      ko: '호두과자의 도시에서 만드는 특별한 기념품',
      en: 'Special souvenirs from the walnut cookie city',
      ja: 'くるみ菓子の都市で作る特別なお土産',
    },
    experiences: [
      { icon: '💍', name: { ko: '실버링 만들기', en: 'Silver ring making', ja: 'シルバーリング作り' } },
      { icon: '🧴', name: { ko: '가죽 공예', en: 'Leather craft', ja: 'レザークラフト' } },
      { icon: '🕯️', name: { ko: '소이 캔들', en: 'Soy candle making', ja: 'ソイキャンドル' } },
      { icon: '🥜', name: { ko: '호두과자 만들기', en: 'Walnut cookie making', ja: 'くるみ菓子作り' } },
    ],
    priceRange: '₩15,000 ~ ₩30,000',
    duration: '1~2h',
    bookingLinks: [
      { platform: 'Klook', url: 'https://www.klook.com/en/search/result/?query=Cheonan+workshop+experience', icon: '🟠' },
    ],
  },
  {
    cityId: 'yongin',
    cityName: { ko: '용인', en: 'Yongin', ja: '龍仁' },
    description: {
      ko: '민속촌 옆에서 즐기는 전통 체험',
      en: 'Traditional experiences near Folk Village',
      ja: '民俗村そばで楽しむ伝統体験',
    },
    experiences: [
      { icon: '🏺', name: { ko: '도자기 체험', en: 'Pottery experience', ja: '陶芸体験' } },
      { icon: '🕯️', name: { ko: '캔들 만들기', en: 'Candle making', ja: 'キャンドル作り' } },
      { icon: '👘', name: { ko: '민속촌 한복 체험', en: 'Folk Village Hanbok', ja: '民俗村韓服体験' } },
      { icon: '🎭', name: { ko: '전통 탈 만들기', en: 'Traditional mask making', ja: '伝統仮面作り' } },
    ],
    priceRange: '₩12,000 ~ ₩25,000',
    duration: '1~2h',
    bookingLinks: [
      { platform: 'Klook', url: 'https://www.klook.com/en/search/result/?query=Yongin+folk+village+experience', icon: '🟠' },
    ],
  },
  {
    cityId: 'icheon',
    cityName: { ko: '이천', en: 'Icheon', ja: '利川' },
    description: {
      ko: '대한민국 도자기의 수도에서 도예 체험',
      en: "Ceramics experience in Korea's pottery capital",
      ja: '韓国陶磁器の首都で陶芸体験',
    },
    experiences: [
      { icon: '🏺', name: { ko: '물레 도자기 체험', en: 'Wheel pottery class', ja: '轆轤陶芸体験' } },
      { icon: '🎨', name: { ko: '도자기 페인팅', en: 'Ceramics painting', ja: '陶磁器ペインティング' } },
      { icon: '🍵', name: { ko: '도자기 다도 체험', en: 'Ceramics tea ceremony', ja: '陶磁器茶道体験' } },
      { icon: '🖼️', name: { ko: '도예 갤러리 투어', en: 'Pottery gallery tour', ja: '陶芸ギャラリーツアー' } },
    ],
    priceRange: '₩15,000 ~ ₩40,000',
    duration: '1~3h',
    bookingLinks: [
      { platform: 'Klook', url: 'https://www.klook.com/en/search/result/?query=Icheon+ceramics+pottery+experience', icon: '🟠' },
      { platform: 'Viator', url: 'https://www.viator.com/searchResults/all?text=Icheon+pottery+ceramics', icon: '🟢' },
    ],
  },
]
