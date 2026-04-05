export interface Stay {
  id: string
  name: string
  region: string
  description: string
  image: string
  bookingUrl: string
  tags: string[]
}

export const STAYS: Stay[] = [
  {
    id: 'jeonju-hanok-1',
    name: '전주 한옥마을 고즈넉 게스트하우스',
    region: 'jeonju',
    description: '한옥마을 중심부에 위치한 전통 한옥 숙소. 도보 10분 거리에 경기전·전동성당.',
    image: '/images/stays/jeonju-hanok-1.jpg',
    bookingUrl: 'https://www.airbnb.com',
    tags: ['한옥', '도심'],
  },
  {
    id: 'jeonju-hanok-2',
    name: '오목대 뷰 한옥 스테이',
    region: 'jeonju',
    description: '오목대가 내려다보이는 전망 좋은 한옥. 전주천 산책로와 인접.',
    image: '/images/stays/jeonju-hanok-2.jpg',
    bookingUrl: 'https://www.airbnb.com',
    tags: ['한옥', '뷰'],
  },
  {
    id: 'jeonju-boutique-1',
    name: '전주 부티크 한옥 호텔',
    region: 'jeonju',
    description: '현대적 편의시설을 갖춘 프리미엄 한옥 호텔. 조식 포함.',
    image: '/images/stays/jeonju-boutique-1.jpg',
    bookingUrl: 'https://www.airbnb.com',
    tags: ['프리미엄', '조식'],
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
