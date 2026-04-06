export type SightCategory = 'hotspot' | 'landmark' | 'festival'

export interface Sight {
  id: string
  name: string
  region: string
  category: SightCategory
  description: string
  image: string
}

export const SIGHTS: Sight[] = [
  {
    id: 'jeonju-gyeonggi-jeon',
    name: '경기전',
    region: 'jeonju',
    category: 'landmark',
    description: '조선 태조 이성계의 어진을 모신 곳. 전주 한옥마을의 중심 명소.',
    image: '/images/sights/jeonju-gyeonggi-jeon.jpg',
  },
  {
    id: 'jeonju-jeondongsungdang',
    name: '전동성당',
    region: 'jeonju',
    category: 'landmark',
    description: '호남 최초의 로마네스크 양식 천주교 성당. 야경이 특히 아름답다.',
    image: '/images/sights/jeonju-cathedral.jpg',
  },
  {
    id: 'jeonju-omokdae',
    name: '오목대',
    region: 'jeonju',
    category: 'hotspot',
    description: '전주 한옥마을 전경을 한눈에 내려다볼 수 있는 전망 명소.',
    image: '/images/sights/jeonju-omokdae.jpg',
  },
  {
    id: 'jeonju-nambu-market',
    name: '남부시장 야시장',
    region: 'jeonju',
    category: 'hotspot',
    description: '매주 금·토 열리는 전주 대표 야시장. 비빔밥·막걸리·거리음식.',
    image: '/images/sights/jeonju-nambu-night.jpg',
  },
  {
    id: 'jeonju-hanok-village',
    name: '전주 한옥마을',
    region: 'jeonju',
    category: 'landmark',
    description: '700여 채의 한옥이 밀집한 국내 최대 한옥 생활문화 공간.',
    image: '/images/sights/jeonju-hanok-village.jpg',
  },
  {
    id: 'jeonju-choco-pie',
    name: '초코파이 거리',
    region: 'jeonju',
    category: 'hotspot',
    description: '인생 초코파이를 맛볼 수 있는 전주 한옥마을 명물 거리.',
    image: '/images/sights/jeonju-choco.jpg',
  },
  {
    id: 'jeonju-bibimap-festival',
    name: '전주 비빔밥 축제',
    region: 'jeonju',
    category: 'festival',
    description: '매년 가을 개최되는 전주 비빔밥 대표 축제. 다양한 비빔밥 체험.',
    image: '/images/sights/jeonju-bibimbap-festival.jpg',
  },
  // 천안
  {
    id: 'cheonan-samgeori-park',
    name: '천안삼거리공원',
    region: 'cheonan',
    category: 'landmark',
    description: '능소전 설화의 배경지. 능수버들 가로수길과 능소 조형물이 유명한 천안의 대표 공원.',
    image: '/images/sights/cheonan-samgeori.jpg',
  },
  {
    id: 'cheonan-independence-hall',
    name: '독립기념관',
    region: 'cheonan',
    category: 'landmark',
    description: '한국 독립운동의 역사를 한자리에서 배울 수 있는 국내 최대 규모 독립운동 전문 기념관.',
    image: '/images/sights/cheonan-independence.jpg',
  },
  {
    id: 'cheonan-bongseosan',
    name: '봉서산',
    region: 'cheonan',
    category: 'hotspot',
    description: '천안 시내를 한눈에 내려다볼 수 있는 전망대가 있는 도심 속 산. 산책로가 잘 정비되어 있다.',
    image: '/images/sights/cheonan-bongseosan.jpg',
  },
  // 용인
  {
    id: 'yongin-folk-village',
    name: '한국민속촌',
    region: 'yongin',
    category: 'landmark',
    description: '조선시대 생활양식을 재현한 국내 최대 민속 테마파크. 전래동화 체험과 전통 공연이 볼거리.',
    image: '/images/sights/yongin-folk-village.jpg',
  },
  {
    id: 'yongin-everland',
    name: '에버랜드',
    region: 'yongin',
    category: 'hotspot',
    description: '한국 최대 테마파크. 사계절 꽃 축제와 다양한 어트랙션으로 연간 수백만 명이 방문.',
    image: '/images/sights/yongin-everland.jpg',
  },
  {
    id: 'yongin-natural-recreation',
    name: '용인자연휴양림',
    region: 'yongin',
    category: 'hotspot',
    description: '도심 가까이에서 즐기는 산림 힐링 공간. 숲속 캠핑과 산책로가 가족 여행객에게 인기.',
    image: '/images/sights/yongin-forest.jpg',
  },
  // 이천
  {
    id: 'icheon-seolbong-park',
    name: '설봉공원',
    region: 'icheon',
    category: 'hotspot',
    description: '설봉호를 중심으로 조성된 이천의 대표 공원. 산책로와 분수, 조각공원이 함께 있다.',
    image: '/images/sights/icheon-seolbong.jpg',
  },
  {
    id: 'icheon-pottery-village',
    name: '이천 도예마을',
    region: 'icheon',
    category: 'landmark',
    description: '고려청자의 전통을 잇는 이천 도예의 중심지. 도자기 체험 공방과 갤러리가 밀집해 있다.',
    image: '/images/sights/icheon-pottery.jpg',
  },
  {
    id: 'icheon-sansuyou',
    name: '산수유마을',
    region: 'icheon',
    category: 'festival',
    description: '매년 봄 산수유꽃이 만발하는 이천의 숨은 명소. 노란 꽃밭이 장관을 이루는 봄 축제 개최.',
    image: '/images/sights/icheon-sansuyou.jpg',
  },
]

export const REGIONS = [
  { code: 'jeonju',    ko: '전주',  ja: '全州',  en: 'Jeonju' },
  { code: 'tongyeong', ko: '통영',  ja: '統営',  en: 'Tongyeong' },
  { code: 'cheonan',   ko: '천안',  ja: '天安',  en: 'Cheonan' },
  { code: 'yongin',    ko: '용인',  ja: '龍仁',  en: 'Yongin' },
  { code: 'icheon',    ko: '이천',  ja: '利川',  en: 'Icheon' },
  { code: 'gyeongju',  ko: '경주',  ja: '慶州',  en: 'Gyeongju' },
  { code: 'seoul',     ko: '서울',  ja: 'ソウル', en: 'Seoul' },
  { code: 'busan',     ko: '부산',  ja: '釜山',  en: 'Busan' },
  { code: 'jeju',      ko: '제주',  ja: '済州',  en: 'Jeju' },
]
