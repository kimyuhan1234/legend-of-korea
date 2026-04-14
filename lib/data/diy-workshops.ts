// ─────────────────────────────────────────────
//  lib/data/diy-workshops.ts
//  서울 / 부산 도시별 체험 묶음 데이터 (GetYourGuide 검색 URL만 사용)
// ─────────────────────────────────────────────

type I18n = { ko: string; en: string; ja: string }

export interface CityWorkshopExperience {
  icon: string
  name: I18n
  desc: I18n
  price: string
  duration: string
}

export interface CityWorkshop {
  cityId: string
  cityName: I18n
  description: I18n
  experiences: CityWorkshopExperience[]
  bookingLinks: { platform: string; url: string; icon: string }[]
}

export const CITY_WORKSHOPS: CityWorkshop[] = [
  {
    cityId: 'seoul',
    cityName: { ko: '서울', en: 'Seoul', ja: 'ソウル' },
    description: {
      ko: '북촌·홍대·성수에서 즐기는 한국 전통 & 감성 공예',
      en: 'Korean traditional & artisan crafts in Bukchon, Hongdae & Seongsu',
      ja: '北村・弘大・聖水でめぐる韓国伝統＆感性クラフト',
    },
    experiences: [
      {
        icon: '🌸',
        name: { ko: '한옥 향수 만들기', en: 'Hanok Perfume Workshop', ja: '韓屋香水作り' },
        desc: {
          ko: '북촌 한옥에서 천연 원료로 나만의 향수를 조향하는 클래스',
          en: 'Blend your own natural perfume inside a traditional hanok in Bukchon',
          ja: '北村の韓屋で天然素材を使い、オリジナル香水を調香するクラス',
        },
        price: '₩55,000~',
        duration: '2h',
      },
      {
        icon: '🧴',
        name: { ko: '홍대 니치 퍼퓸 클래스', en: 'Hongdae Niche Perfume Class', ja: '弘大ニッチ香水クラス' },
        desc: {
          ko: '홍대 감성 공방에서 전문 조향사와 함께 나만의 시그니처 향 완성',
          en: 'Create your signature scent with a professional perfumer in Hongdae',
          ja: '弘大のおしゃれな工房で、プロの調香師とシグネチャー香を完成',
        },
        price: '₩65,000~',
        duration: '2h',
      },
      {
        icon: '💍',
        name: { ko: '실버링 만들기', en: 'Silver Ring Workshop', ja: 'シルバーリング作り' },
        desc: {
          ko: '순은 소재로 직접 망치질하여 세상에 하나뿐인 반지 제작',
          en: 'Hammer and shape pure silver into a one-of-a-kind ring you keep forever',
          ja: '純銀素材をハンマーで叩いて、世界に一つだけの指輪を作成',
        },
        price: '₩50,000~',
        duration: '2h',
      },
      {
        icon: '📜',
        name: { ko: '북촌 한지 공예', en: 'Bukchon Hanji Craft', ja: '北村韓紙工芸' },
        desc: {
          ko: '전통 한지로 소품·엽서·등갓 등을 만드는 정통 공예 체험',
          en: 'Craft cards, lanterns, or accessories using traditional Korean hanji paper',
          ja: '伝統的な韓紙でポストカード・行灯・小物を作る本格工芸体験',
        },
        price: '₩30,000~',
        duration: '1.5h',
      },
      {
        icon: '✨',
        name: { ko: '나전칠기 체험', en: 'Najeonchilgi Lacquerware', ja: '螺鈿漆器体験' },
        desc: {
          ko: '전복 껍데기를 잘라 붙이는 전통 나전칠기 기법을 직접 배우는 체험',
          en: 'Learn the ancient art of inlaying abalone shell on lacquerware',
          ja: 'アワビの貝殻を切り貼りする伝統螺鈿漆器技法を体験',
        },
        price: '₩45,000~',
        duration: '2h',
      },
      {
        icon: '🎀',
        name: { ko: '보자기 아트 클래스', en: 'Bojagi Art Class', ja: 'ポジャギアートクラス' },
        desc: {
          ko: '색색의 천 조각을 이어 붙이는 전통 보자기 제작 — 선물 포장지로 활용 가능',
          en: 'Sew colorful fabric pieces into a traditional bojagi wrapping cloth',
          ja: 'カラフルな布を縫い合わせる伝統ポジャギ作り—ラッピングとして活用可',
        },
        price: '₩35,000~',
        duration: '1.5h',
      },
    ],
    bookingLinks: [
      {
        platform: 'GetYourGuide',
        url: 'https://www.getyourguide.com/s/?q=Seoul+craft+class&ls=1',
        icon: '🔵',
      },
      {
        platform: 'Klook',
        url: 'https://www.klook.com/en/search/result/?query=Seoul+craft+workshop',
        icon: '🟠',
      },
    ],
  },
  {
    cityId: 'busan',
    cityName: { ko: '부산', en: 'Busan', ja: '釜山' },
    description: {
      ko: '바다 전망 공방에서 즐기는 향수·주얼리·도예 체험',
      en: 'Perfume, jewellery & pottery workshops with ocean views',
      ja: '海を望む工房で楽しむ香水・ジュエリー・陶芸体験',
    },
    experiences: [
      {
        icon: '🌸',
        name: { ko: '부산 향수 만들기', en: 'Busan Perfume Making', ja: '釜山香水作り' },
        desc: {
          ko: '해운대 인근 공방에서 바다 향을 모티브로 나만의 향수 조향',
          en: 'Craft a sea-inspired signature scent at a studio near Haeundae',
          ja: '海雲台近くの工房で、海をモチーフにしたオリジナル香水を調香',
        },
        price: '₩50,000~',
        duration: '2h',
      },
      {
        icon: '💍',
        name: { ko: '실버링 만들기', en: 'Silver Ring Workshop', ja: 'シルバーリング作り' },
        desc: {
          ko: '광안리 뷰의 공방에서 순은 반지를 직접 제작하는 주얼리 클래스',
          en: 'Make a pure silver ring by hand in a studio overlooking Gwangalli Beach',
          ja: '広安里ビューの工房で純銀リングを手作りするジュエリークラス',
        },
        price: '₩50,000~',
        duration: '2h',
      },
      {
        icon: '🕯️',
        name: { ko: '소이 캔들 만들기', en: 'Soy Candle Making', ja: 'ソイキャンドル作り' },
        desc: {
          ko: '천연 소이왁스와 에센셜 오일로 나만의 향초 제작 — 여행 기념품으로 최적',
          en: 'Pour and scent your own soy candle — a perfect travel keepsake',
          ja: '天然ソイワックスとエッセンシャルオイルでオリジナル香キャンドルを作成',
        },
        price: '₩35,000~',
        duration: '1.5h',
      },
      {
        icon: '🏺',
        name: { ko: '도자기 페인팅', en: 'Ceramics Painting', ja: '陶磁器ペインティング' },
        desc: {
          ko: '완성된 도자기 위에 그림을 그리고 유약을 발라 나만의 컵·접시 완성',
          en: 'Paint and glaze a ceramic cup or plate to take home as a souvenir',
          ja: '成形済みの陶磁器に絵付けして、世界に一つだけのマグ・皿を完成',
        },
        price: '₩35,000~',
        duration: '1.5h',
      },
    ],
    bookingLinks: [
      {
        platform: 'GetYourGuide',
        url: 'https://www.getyourguide.com/s/?q=Busan+craft+class&ls=1',
        icon: '🔵',
      },
      {
        platform: 'Klook',
        url: 'https://www.klook.com/en/search/result/?query=Busan+craft+workshop',
        icon: '🟠',
      },
    ],
  },
]
