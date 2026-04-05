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
]

export const REGIONS = [
  { code: 'jeonju',    ko: '전주',  ja: '全州',  en: 'Jeonju' },
  { code: 'tongyeong', ko: '통영',  ja: '統営',  en: 'Tongyeong' },
  { code: 'gyeongju',  ko: '경주',  ja: '慶州',  en: 'Gyeongju' },
  { code: 'seoul',     ko: '서울',  ja: 'ソウル', en: 'Seoul' },
  { code: 'busan',     ko: '부산',  ja: '釜山',  en: 'Busan' },
  { code: 'jeju',      ko: '제주',  ja: '済州',  en: 'Jeju' },
]
