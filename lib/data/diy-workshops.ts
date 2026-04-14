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
      ko: '한옥에서 즐기는 트렌디한 공방 체험',
      en: 'Trendy craft workshops in traditional Hanok',
      ja: '韓屋で楽しむトレンディなクラフト体験',
    },
    experiences: [
      {
        icon: '🌸',
        name: { ko: '한옥 향수 만들기', en: 'Perfume Making in Hanok', ja: '韓屋で香水作り' },
        desc: {
          ko: '500가지 향료 중 골라 나만의 시그니처 향수 제작',
          en: 'Create your signature scent from 500+ fragrance materials',
          ja: '500種以上の香料から自分だけの香水を作る',
        },
        price: '₩35,000~',
        duration: '1.5~2h',
      },
      {
        icon: '🌸',
        name: { ko: '홍대 니치 퍼퓸 클래스', en: 'Niche Perfume Class in Hongdae', ja: '弘大ニッチパフュームクラス' },
        desc: {
          ko: '100% 천연 오일로 50ml EDP + 10ml 테스터 세트 제작',
          en: 'Craft 50ml EDP + 10ml tester set with 100% natural oils',
          ja: '100%天然オイルで50ml EDP + 10mlテスターセット作り',
        },
        price: '₩45,000~',
        duration: '1.5h',
      },
      {
        icon: '💍',
        name: {
          ko: '실버링 만들기 (성수/잠실/혜화/홍대)',
          en: 'Silver Ring Making (Seongsu/Jamsil/Hyehwa/Hongdae)',
          ja: 'シルバーリング作り（聖水/蚕室/恵化/弘大）',
        },
        desc: {
          ko: '전문 장인이 안내하는 실버 주얼리 제작 체험',
          en: 'Craft personal silver jewelry guided by professional artisans',
          ja: 'プロの職人がガイドするシルバージュエリー制作体験',
        },
        price: '₩30,000~',
        duration: '1.5~2h',
      },
      {
        icon: '📜',
        name: { ko: '북촌 한지 공예', en: 'Hanji Paper Craft in Bukchon', ja: '北村韓紙工芸' },
        desc: {
          ko: '전통 한옥에서 한지로 소품 만들기 체험',
          en: 'Create accessories with traditional Korean paper in a real Hanok',
          ja: '伝統韓屋で韓紙の小物作り体験',
        },
        price: '₩15,000~',
        duration: '1~1.5h',
      },
      {
        icon: '✨',
        name: { ko: '나전칠기 공예 (북촌)', en: 'Mother-of-Pearl Craft in Bukchon', ja: '螺鈿漆器工芸（北村）' },
        desc: {
          ko: '자개를 이용한 보석함/브로치 만들기',
          en: 'Make a jewelry box or brooch with mother-of-pearl inlay',
          ja: '螺鈿で宝石箱やブローチ作り',
        },
        price: '₩20,000~',
        duration: '1.5h',
      },
      {
        icon: '🪢',
        name: { ko: '보자기 매듭 공예', en: 'Bojagi Wrapping Art Class', ja: 'ポジャギ包み工芸' },
        desc: {
          ko: '연세대 인증 전문가에게 배우는 전통 보자기 아트',
          en: 'Learn traditional Bojagi from a Yonsei University certified expert',
          ja: '延世大学認定専門家から伝統ポジャギを学ぶ',
        },
        price: '₩25,000~',
        duration: '1.5h',
      },
    ],
    bookingLinks: [
      { platform: 'GetYourGuide', url: 'https://www.getyourguide.com/seoul-l197/arts-crafts-workshops-tc80/', icon: '🔵' },
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
      {
        icon: '🌸',
        name: { ko: '부산 향수 만들기', en: 'Perfume Making in Busan', ja: '釜山で香水作り' },
        desc: {
          ko: '해운대/광안리 인근 공방에서 나만의 향수 제작',
          en: 'Create your own perfume near Haeundae/Gwangalli',
          ja: '海雲台/広安里近くの工房で自分だけの香水作り',
        },
        price: '₩30,000~',
        duration: '1.5h',
      },
      {
        icon: '💍',
        name: { ko: '실버링 만들기', en: 'Silver Ring Workshop', ja: 'シルバーリング作り' },
        desc: {
          ko: '커플링/우정반지 직접 제작 체험',
          en: 'Craft your own couple or friendship rings',
          ja: 'カップルリング/友情リングを手作り',
        },
        price: '₩30,000~',
        duration: '1.5~2h',
      },
      {
        icon: '🕯️',
        name: { ko: '바다향 캔들 만들기', en: 'Ocean Candle Making', ja: '海キャンドル作り' },
        desc: {
          ko: '부산 바다를 담은 소이 캔들 제작',
          en: 'Make a soy candle inspired by Busan ocean',
          ja: '釜山の海をイメージしたソイキャンドル作り',
        },
        price: '₩25,000~',
        duration: '1h',
      },
      {
        icon: '🏺',
        name: { ko: '도자기 페인팅', en: 'Ceramic Painting', ja: '陶磁器ペインティング' },
        desc: {
          ko: '미리 구워진 도자기에 나만의 디자인 페인팅',
          en: 'Paint your own design on pre-fired ceramics',
          ja: '焼成済み陶磁器に自分だけのデザインをペイント',
        },
        price: '₩20,000~',
        duration: '1~1.5h',
      },
    ],
    bookingLinks: [
      { platform: 'GetYourGuide', url: 'https://www.getyourguide.com/s/?q=busan+craft+class', icon: '🔵' },
    ],
  },
]
