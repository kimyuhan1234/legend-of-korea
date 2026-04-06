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
  // 천안
  {
    id: 'cheonan-hotel-1',
    name: '천안역 비즈니스 호텔',
    region: 'cheonan',
    description: '천안역 도보 3분. KTX 이용객에게 최적의 위치. 삼거리공원·독립기념관 접근 용이.',
    image: '/images/stays/cheonan-hotel-1.jpg',
    bookingUrl: 'https://www.booking.com',
    tags: ['역세권', '비즈니스'],
  },
  {
    id: 'cheonan-onyang-1',
    name: '온양온천 한방 스파 호텔',
    region: 'cheonan',
    description: '천안 아산 온양온천 지구 내 한방 온천 숙소. 노천탕·한방 스파 포함.',
    image: '/images/stays/cheonan-onyang-1.jpg',
    bookingUrl: 'https://www.booking.com',
    tags: ['온천', '스파', '힐링'],
  },
  // 용인
  {
    id: 'yongin-hanok-1',
    name: '한국민속촌 인근 한옥스테이',
    region: 'yongin',
    description: '한국민속촌 차로 5분. 전통 한옥 객실에서 민속촌 분위기를 이어서 즐길 수 있다.',
    image: '/images/stays/yongin-hanok-1.jpg',
    bookingUrl: 'https://www.airbnb.com',
    tags: ['한옥', '민속촌 근처'],
  },
  // 이천
  {
    id: 'icheon-pension-1',
    name: '이천 도예마을 도자기 펜션',
    region: 'icheon',
    description: '이천 도예마을 내 도자기 체험과 숙박을 함께 즐길 수 있는 펜션.',
    image: '/images/stays/icheon-pension-1.jpg',
    bookingUrl: 'https://www.airbnb.com',
    tags: ['도자기 체험', '펜션'],
  },
  {
    id: 'icheon-spa-1',
    name: '이천 온천 스파 호텔',
    region: 'icheon',
    description: '이천 설봉공원 인근 온천 리조트. 쌀 온천수로 유명하며 피부 미용 효과 탁월.',
    image: '/images/stays/icheon-spa-1.jpg',
    bookingUrl: 'https://www.booking.com',
    tags: ['온천', '리조트', '쌀 온천'],
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
