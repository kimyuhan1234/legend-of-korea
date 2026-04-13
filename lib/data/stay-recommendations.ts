// ─────────────────────────────────────────────
//  lib/data/stay-recommendations.ts
//  9개 도시 × 2~3개 숙소 추천 (외부 예약 링크 기반)
// ─────────────────────────────────────────────

export type StayType = 'hanok' | 'hotel' | 'guesthouse' | 'pension' | 'resort'

export type VibeTag =
  | 'traditional' | 'modern' | 'romantic' | 'family'
  | 'budget' | 'luxury' | 'instagram' | 'nature'

export type StayPlatform = 'Booking.com' | 'Airbnb' | 'Trip.com' | 'Agoda' | 'Yanolja'

export interface StayRecommendation {
  id: string
  cityId: string
  name: { ko: string; ja: string; en: string }
  type: StayType
  vibe: VibeTag[]
  description: { ko: string; ja: string; en: string }
  priceRange: string
  walkToMission: { ko: string; ja: string; en: string }
  highlights: { ko: string; ja: string; en: string }[]
  bookingUrl: string
  platform: StayPlatform
  imageKey?: string
}

export const STAY_RECOMMENDATIONS: StayRecommendation[] = [
  // ─────── 전주 ───────
  {
    id: 'jeonju-1', cityId: 'jeonju',
    name: { ko: '한옥스테이 사로', ja: '韓屋ステイ サロ', en: 'Hanok Stay Saro' },
    type: 'hanok', vibe: ['traditional', 'instagram'],
    description: {
      ko: '한옥마을 중심부에 위치한 100년 된 전통 한옥 스테이. 아침 식사로 한정식 제공.',
      ja: '韓屋村の中心にある100年の歴史を持つ伝統韓屋ステイ。朝食に韓定食を提供。',
      en: '100-year-old traditional hanok in the heart of Jeonju Hanok Village. Korean set breakfast included.',
    },
    priceRange: '₩80,000~150,000',
    walkToMission: { ko: '도보 3분', ja: '徒歩3分', en: '3 min walk' },
    highlights: [
      { ko: '온돌 난방 + 한복 체험', ja: 'オンドル＋韓服体験', en: 'Ondol floor + hanbok experience' },
      { ko: '한정식 조식 무료', ja: '韓定食朝食無料', en: 'Free Korean breakfast' },
      { ko: '한옥마을 도보 3분', ja: '韓屋村徒歩3分', en: '3 min to hanok village' },
    ],
    bookingUrl: 'https://www.airbnb.co.kr/s/%EC%A0%84%EC%A3%BC+%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84/homes',
    platform: 'Airbnb',
  },
  {
    id: 'jeonju-2', cityId: 'jeonju',
    name: { ko: '라한호텔 전주', ja: 'ラハンホテル全州', en: 'Lahan Hotel Jeonju' },
    type: 'hotel', vibe: ['modern', 'family'],
    description: {
      ko: '한옥마을 근처 4성급 비즈니스 호텔. 패밀리룸 완비.',
      ja: '韓屋村近くの4つ星ビジネスホテル。ファミリールーム完備。',
      en: '4-star business hotel near hanok village. Family rooms available.',
    },
    priceRange: '₩90,000~180,000',
    walkToMission: { ko: '도보 8분', ja: '徒歩8分', en: '8 min walk' },
    highlights: [
      { ko: '수영장 + 피트니스', ja: 'プール＋フィットネス', en: 'Pool + fitness' },
      { ko: '24시간 룸서비스', ja: '24時間ルームサービス', en: '24h room service' },
      { ko: '무료 주차', ja: '無料駐車場', en: 'Free parking' },
    ],
    bookingUrl: 'https://www.booking.com/searchresults.ko.html?ss=%EC%A0%84%EC%A3%BC+%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84',
    platform: 'Booking.com',
  },
  {
    id: 'jeonju-3', cityId: 'jeonju',
    name: { ko: '왕의지밀 한옥호텔', ja: '王の至密 韓屋ホテル', en: 'Wangui Jimil Hanok Hotel' },
    type: 'hanok', vibe: ['luxury', 'traditional'],
    description: {
      ko: '전주 최고급 한옥호텔. 프라이빗 마당과 스파 시설 완비.',
      ja: '全州最高級韓屋ホテル。プライベート庭とスパ完備。',
      en: 'Jeonju\'s premium hanok hotel with private courtyard and spa.',
    },
    priceRange: '₩150,000~300,000',
    walkToMission: { ko: '도보 5분', ja: '徒歩5分', en: '5 min walk' },
    highlights: [
      { ko: '프라이빗 마당', ja: 'プライベート庭', en: 'Private courtyard' },
      { ko: '전통차 서비스', ja: '伝統茶サービス', en: 'Traditional tea service' },
      { ko: '스파 + 한식 코스', ja: 'スパ+韓食コース', en: 'Spa + Korean course' },
    ],
    bookingUrl: 'https://kr.trip.com/hotels/list?city=61380&keyword=%EC%A0%84%EC%A3%BC+%ED%95%9C%EC%98%A5',
    platform: 'Trip.com',
  },

  // ─────── 서울 ───────
  {
    id: 'seoul-1', cityId: 'seoul',
    name: { ko: '북촌 소월담 한옥', ja: '北村ソウォルダム韓屋', en: 'Bukchon Sowoldam Hanok' },
    type: 'hanok', vibe: ['traditional', 'luxury'],
    description: {
      ko: '북촌 한옥마을 프리미엄 한옥. 창덕궁 야경이 보이는 마당.',
      ja: '北村韓屋村のプレミアム韓屋。昌徳宮の夜景が見える庭。',
      en: 'Premium hanok in Bukchon with views of Changdeokgung Palace.',
    },
    priceRange: '₩200,000~400,000',
    walkToMission: { ko: '도보 10분', ja: '徒歩10分', en: '10 min walk' },
    highlights: [
      { ko: '창덕궁 뷰 마당', ja: '昌徳宮ビュー庭', en: 'Palace view courtyard' },
      { ko: '한복 대여 포함', ja: '韓服レンタル込み', en: 'Hanbok rental included' },
      { ko: '삼청동 도보 5분', ja: '三清洞徒歩5分', en: '5 min to Samcheongdong' },
    ],
    bookingUrl: 'https://www.airbnb.co.kr/s/%EB%B6%81%EC%B4%8C+%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84/homes',
    platform: 'Airbnb',
  },
  {
    id: 'seoul-2', cityId: 'seoul',
    name: { ko: '이비스 앰배서더 명동', ja: 'イビス アンバサダー明洞', en: 'Ibis Ambassador Myeongdong' },
    type: 'hotel', vibe: ['modern', 'budget'],
    description: {
      ko: '명동 중심가 비즈니스 호텔. 지하철역 도보 2분.',
      ja: '明洞中心部のビジネスホテル。地下鉄駅徒歩2分。',
      en: 'Business hotel in Myeongdong center. 2 min to subway.',
    },
    priceRange: '₩80,000~150,000',
    walkToMission: { ko: '지하철 15분', ja: '地下鉄15分', en: '15 min by subway' },
    highlights: [
      { ko: '명동 쇼핑 중심가', ja: '明洞ショッピング街', en: 'Myeongdong shopping' },
      { ko: '지하철역 2분', ja: '駅2分', en: '2 min to subway' },
      { ko: '공항버스 정류장', ja: '空港バス停', en: 'Airport bus stop' },
    ],
    bookingUrl: 'https://www.booking.com/searchresults.ko.html?ss=%EB%AA%85%EB%8F%99+%EC%84%9C%EC%9A%B8',
    platform: 'Booking.com',
  },
  {
    id: 'seoul-3', cityId: 'seoul',
    name: { ko: '익선동 게스트하우스', ja: '益善洞ゲストハウス', en: 'Ikseondong Guesthouse' },
    type: 'guesthouse', vibe: ['traditional', 'budget'],
    description: {
      ko: '익선동 한옥 카페거리 한가운데 게스트하우스.',
      ja: '益善洞の韓屋カフェ通り真ん中のゲストハウス。',
      en: 'Guesthouse in the heart of Ikseondong hanok cafe street.',
    },
    priceRange: '₩30,000~60,000',
    walkToMission: { ko: '도보 12분', ja: '徒歩12分', en: '12 min walk' },
    highlights: [
      { ko: '한옥 카페거리', ja: '韓屋カフェ通り', en: 'Hanok cafe street' },
      { ko: '공용 주방', ja: '共用キッチン', en: 'Shared kitchen' },
      { ko: '여성 전용 도미토리', ja: '女性専用ドミトリー', en: 'Female dorm' },
    ],
    bookingUrl: 'https://www.booking.com/searchresults.ko.html?ss=%EC%9D%B5%EC%84%A0%EB%8F%99+%EC%84%9C%EC%9A%B8',
    platform: 'Booking.com',
  },

  // ─────── 부산 ───────
  {
    id: 'busan-1', cityId: 'busan',
    name: { ko: '해운대 그랜드호텔', ja: '海雲台グランドホテル', en: 'Haeundae Grand Hotel' },
    type: 'hotel', vibe: ['modern', 'luxury'],
    description: {
      ko: '해운대 해변 앞 5성급 호텔. 오션뷰 객실.',
      ja: '海雲台ビーチ前の5つ星ホテル。オーシャンビュー客室。',
      en: '5-star hotel facing Haeundae Beach. Ocean view rooms.',
    },
    priceRange: '₩150,000~300,000',
    walkToMission: { ko: '도보 2분', ja: '徒歩2分', en: '2 min walk' },
    highlights: [
      { ko: '오션뷰 객실', ja: 'オーシャンビュー', en: 'Ocean view' },
      { ko: '해변 앞', ja: 'ビーチ前', en: 'Beachfront' },
      { ko: '스파 + 수영장', ja: 'スパ+プール', en: 'Spa + pool' },
    ],
    bookingUrl: 'https://www.booking.com/searchresults.ko.html?ss=%ED%95%B4%EC%9A%B4%EB%8C%80+%EB%B6%80%EC%82%B0',
    platform: 'Booking.com',
  },
  {
    id: 'busan-2', cityId: 'busan',
    name: { ko: '감천문화마을 게스트하우스', ja: '甘川文化村ゲストハウス', en: 'Gamcheon Culture Village Guesthouse' },
    type: 'guesthouse', vibe: ['instagram', 'budget'],
    description: {
      ko: '감천문화마을 중턱의 감성 게스트하우스. 루프탑 뷰 일품.',
      ja: '甘川文化村中腹の感性ゲストハウス。ルーフトップビュー。',
      en: 'Cozy guesthouse in Gamcheon Culture Village with rooftop view.',
    },
    priceRange: '₩30,000~50,000',
    walkToMission: { ko: '도보 5분', ja: '徒歩5分', en: '5 min walk' },
    highlights: [
      { ko: '루프탑 뷰', ja: 'ルーフトップビュー', en: 'Rooftop view' },
      { ko: '포토 스팟', ja: 'フォトスポット', en: 'Photo spots' },
      { ko: '무료 와이파이', ja: '無料Wi-Fi', en: 'Free WiFi' },
    ],
    bookingUrl: 'https://www.airbnb.co.kr/s/%EA%B0%90%EC%B2%9C%EB%AC%B8%ED%99%94%EB%A7%88%EC%9D%84+%EB%B6%80%EC%82%B0/homes',
    platform: 'Airbnb',
  },
  {
    id: 'busan-3', cityId: 'busan',
    name: { ko: '해리단길 한옥스테이', ja: 'ヘリダンギル韓屋ステイ', en: 'Haeridan-gil Hanok Stay' },
    type: 'hanok', vibe: ['romantic', 'traditional'],
    description: {
      ko: '해리단길 감성 한옥. 핫플 카페거리 한복판.',
      ja: 'ヘリダンギルの韓屋。ホットプレイスのカフェ通り真ん中。',
      en: 'Hanok stay in trendy Haeridan-gil cafe street.',
    },
    priceRange: '₩100,000~200,000',
    walkToMission: { ko: '도보 8분', ja: '徒歩8分', en: '8 min walk' },
    highlights: [
      { ko: '감성 한옥', ja: '感性韓屋', en: 'Aesthetic hanok' },
      { ko: '카페거리 중심', ja: 'カフェ通り中心', en: 'Cafe street center' },
      { ko: '해운대 5분', ja: '海雲台5分', en: '5 min to Haeundae' },
    ],
    bookingUrl: 'https://www.airbnb.co.kr/s/%ED%95%B4%EB%A6%AC%EB%8B%A8%EA%B8%B8+%EB%B6%80%EC%82%B0/homes',
    platform: 'Airbnb',
  },

  // ─────── 제주 ───────
  {
    id: 'jeju-1', cityId: 'jeju',
    name: { ko: '제주 돌하르방 펜션', ja: '済州トルハルバンペンション', en: 'Jeju Dolharubang Pension' },
    type: 'pension', vibe: ['family', 'nature'],
    description: {
      ko: '제주 중산간 자연 속 독채 펜션. BBQ 시설 완비.',
      ja: '済州中山間の自然の中の一棟貸しペンション。BBQ完備。',
      en: 'Private pension in Jeju highlands. BBQ facilities.',
    },
    priceRange: '₩80,000~150,000',
    walkToMission: { ko: '차량 10분', ja: '車10分', en: '10 min by car' },
    highlights: [
      { ko: '독채 프라이빗', ja: '一棟貸し', en: 'Private villa' },
      { ko: 'BBQ 시설', ja: 'BBQ設備', en: 'BBQ facilities' },
      { ko: '한라산 뷰', ja: '漢拏山ビュー', en: 'Hallasan view' },
    ],
    bookingUrl: 'https://www.booking.com/searchresults.ko.html?ss=%EC%A0%9C%EC%A3%BC+%EC%A4%91%EC%82%B0%EA%B0%84',
    platform: 'Booking.com',
  },
  {
    id: 'jeju-2', cityId: 'jeju',
    name: { ko: '서귀포 오션뷰 리조트', ja: '西帰浦オーシャンビューリゾート', en: 'Seogwipo Ocean View Resort' },
    type: 'resort', vibe: ['luxury', 'romantic'],
    description: {
      ko: '서귀포 해안절벽 위 럭셔리 리조트. 인피니티 풀.',
      ja: '西帰浦の海岸絶壁上のラグジュアリーリゾート。インフィニティプール。',
      en: 'Luxury resort on Seogwipo coastal cliff. Infinity pool.',
    },
    priceRange: '₩200,000~400,000',
    walkToMission: { ko: '차량 15분', ja: '車15分', en: '15 min by car' },
    highlights: [
      { ko: '인피니티 풀', ja: 'インフィニティプール', en: 'Infinity pool' },
      { ko: '오션뷰 전용 발코니', ja: '専用オーシャンバルコニー', en: 'Ocean view balcony' },
      { ko: '프라이빗 비치', ja: 'プライベートビーチ', en: 'Private beach' },
    ],
    bookingUrl: 'https://kr.trip.com/hotels/list?city=900040198&keyword=%EC%84%9C%EA%B7%80%ED%8F%AC+%EB%A6%AC%EC%A1%B0%ED%8A%B8',
    platform: 'Trip.com',
  },
  {
    id: 'jeju-3', cityId: 'jeju',
    name: { ko: '애월 감성 게스트하우스', ja: '涯月の感性ゲストハウス', en: 'Aewol Aesthetic Guesthouse' },
    type: 'guesthouse', vibe: ['instagram', 'budget'],
    description: {
      ko: '애월 해변가 감성 게스트하우스. 바다뷰 테라스.',
      ja: '涯月海岸の感性ゲストハウス。海ビューテラス。',
      en: 'Aesthetic guesthouse on Aewol coast with sea view terrace.',
    },
    priceRange: '₩40,000~70,000',
    walkToMission: { ko: '차량 20분', ja: '車20分', en: '20 min by car' },
    highlights: [
      { ko: '바다뷰 테라스', ja: '海ビューテラス', en: 'Sea view terrace' },
      { ko: '애월 핫플', ja: '涯月ホットプレイス', en: 'Aewol hotspot' },
      { ko: '자전거 무료 대여', ja: '自転車無料レンタル', en: 'Free bike rental' },
    ],
    bookingUrl: 'https://www.airbnb.co.kr/s/%EC%95%A0%EC%9B%94+%EC%A0%9C%EC%A3%BC/homes',
    platform: 'Airbnb',
  },

  // ─────── 경주 ───────
  {
    id: 'gyeongju-1', cityId: 'gyeongju',
    name: { ko: '경주 한옥마을 고택', ja: '慶州韓屋村古宅', en: 'Gyeongju Hanok Village Gotek' },
    type: 'hanok', vibe: ['traditional', 'romantic'],
    description: {
      ko: '교촌마을 200년 고택. 첨성대 도보 5분.',
      ja: '校村マウルの200年古宅。瞻星台徒歩5分。',
      en: '200-year-old traditional house in Gyochon Village. 5 min to Cheomseongdae.',
    },
    priceRange: '₩100,000~200,000',
    walkToMission: { ko: '도보 5분', ja: '徒歩5分', en: '5 min walk' },
    highlights: [
      { ko: '200년 고택', ja: '200年古宅', en: '200-year-old house' },
      { ko: '교촌마을', ja: '校村マウル', en: 'Gyochon Village' },
      { ko: '첨성대 도보 5분', ja: '瞻星台徒歩5分', en: '5 min to Cheomseongdae' },
    ],
    bookingUrl: 'https://www.booking.com/searchresults.ko.html?ss=%EA%B5%90%EC%B4%8C%EB%A7%88%EC%9D%84+%EA%B2%BD%EC%A3%BC',
    platform: 'Booking.com',
  },
  {
    id: 'gyeongju-2', cityId: 'gyeongju',
    name: { ko: '라한셀렉트 경주', ja: 'ラハンセレクト慶州', en: 'Lahan Select Gyeongju' },
    type: 'hotel', vibe: ['modern', 'family'],
    description: {
      ko: '보문단지 5성급 리조트 호텔. 가족 친화 시설.',
      ja: '普門団地の5つ星リゾートホテル。ファミリー向け設備。',
      en: '5-star resort hotel in Bomun complex. Family-friendly.',
    },
    priceRange: '₩100,000~200,000',
    walkToMission: { ko: '차량 15분', ja: '車15分', en: '15 min by car' },
    highlights: [
      { ko: '워터파크', ja: 'ウォーターパーク', en: 'Water park' },
      { ko: '키즈클럽', ja: 'キッズクラブ', en: 'Kids club' },
      { ko: '보문호수 뷰', ja: '普門湖ビュー', en: 'Bomun Lake view' },
    ],
    bookingUrl: 'https://www.booking.com/searchresults.ko.html?ss=%EB%B3%B4%EB%AC%B8%EB%8B%A8%EC%A7%80+%EA%B2%BD%EC%A3%BC',
    platform: 'Booking.com',
  },

  // ─────── 통영 ───────
  {
    id: 'tongyeong-1', cityId: 'tongyeong',
    name: { ko: '통영 바다뷰 펜션', ja: '統営海ビューペンション', en: 'Tongyeong Sea View Pension' },
    type: 'pension', vibe: ['romantic', 'nature'],
    description: {
      ko: '미륵산 기슭 오션뷰 독채 펜션. 선셋 명소.',
      ja: '弥勒山麓のオーシャンビュー一棟貸しペンション。夕日の名所。',
      en: 'Private sea view pension on Mireuksan foothills. Sunset spot.',
    },
    priceRange: '₩80,000~150,000',
    walkToMission: { ko: '차량 10분', ja: '車10分', en: '10 min by car' },
    highlights: [
      { ko: '오션뷰 독채', ja: 'オーシャンビュー一棟貸し', en: 'Private sea view' },
      { ko: '선셋 명소', ja: '夕日の名所', en: 'Sunset spot' },
      { ko: 'BBQ 시설', ja: 'BBQ設備', en: 'BBQ facilities' },
    ],
    bookingUrl: 'https://www.airbnb.co.kr/s/%ED%86%B5%EC%98%81%EC%8B%9C/homes',
    platform: 'Airbnb',
  },
  {
    id: 'tongyeong-2', cityId: 'tongyeong',
    name: { ko: '통영 스탠포드호텔', ja: '統営スタンフォードホテル', en: 'Tongyeong Stanford Hotel' },
    type: 'hotel', vibe: ['modern', 'family'],
    description: {
      ko: '통영 중심가 4성급 호텔. 케이블카 도보 거리.',
      ja: '統営中心街4つ星ホテル。ケーブルカー徒歩圏内。',
      en: '4-star hotel in Tongyeong center. Walking distance to cable car.',
    },
    priceRange: '₩80,000~160,000',
    walkToMission: { ko: '도보 10분', ja: '徒歩10分', en: '10 min walk' },
    highlights: [
      { ko: '케이블카 근처', ja: 'ケーブルカー近く', en: 'Near cable car' },
      { ko: '항구 뷰', ja: '港ビュー', en: 'Harbor view' },
      { ko: '조식 뷔페', ja: '朝食ビュッフェ', en: 'Breakfast buffet' },
    ],
    bookingUrl: 'https://www.booking.com/searchresults.ko.html?ss=%ED%86%B5%EC%98%81',
    platform: 'Booking.com',
  },

  // ─────── 천안 ───────
  {
    id: 'cheonan-1', cityId: 'cheonan',
    name: { ko: '천안 호텔ICC', ja: '天安ホテルICC', en: 'Cheonan Hotel ICC' },
    type: 'hotel', vibe: ['modern', 'budget'],
    description: {
      ko: '천안 시내 비즈니스 호텔. KTX역 도보 5분.',
      ja: '天安市内のビジネスホテル。KTX駅徒歩5分。',
      en: 'Business hotel in Cheonan center. 5 min to KTX station.',
    },
    priceRange: '₩60,000~100,000',
    walkToMission: { ko: '차량 10분', ja: '車10分', en: '10 min by car' },
    highlights: [
      { ko: 'KTX역 5분', ja: 'KTX駅5分', en: '5 min to KTX' },
      { ko: '무료 조식', ja: '無料朝食', en: 'Free breakfast' },
      { ko: '무료 주차', ja: '無料駐車場', en: 'Free parking' },
    ],
    bookingUrl: 'https://www.booking.com/searchresults.ko.html?ss=%EC%B2%9C%EC%95%88',
    platform: 'Booking.com',
  },
  {
    id: 'cheonan-2', cityId: 'cheonan',
    name: { ko: '천안 감성 게스트하우스', ja: '天安の感性ゲストハウス', en: 'Cheonan Aesthetic Guesthouse' },
    type: 'guesthouse', vibe: ['budget', 'instagram'],
    description: {
      ko: '천안 시내 감성 게스트하우스. 독립여성방 완비.',
      ja: '天安市内の感性ゲストハウス。女性専用室完備。',
      en: 'Aesthetic guesthouse in Cheonan. Female-only rooms available.',
    },
    priceRange: '₩30,000~50,000',
    walkToMission: { ko: '차량 15분', ja: '車15分', en: '15 min by car' },
    highlights: [
      { ko: '여성 전용방', ja: '女性専用室', en: 'Female only room' },
      { ko: '공용 주방', ja: '共用キッチン', en: 'Shared kitchen' },
      { ko: '루프탑', ja: 'ルーフトップ', en: 'Rooftop' },
    ],
    bookingUrl: 'https://www.airbnb.co.kr/s/%EC%B2%9C%EC%95%88%EC%8B%9C/homes',
    platform: 'Airbnb',
  },

  // ─────── 용인 ───────
  {
    id: 'yongin-1', cityId: 'yongin',
    name: { ko: '용인 리조트', ja: '龍仁リゾート', en: 'Yongin Resort' },
    type: 'resort', vibe: ['family', 'nature'],
    description: {
      ko: '에버랜드 근처 가족형 리조트. 수영장 + 키즈 시설.',
      ja: 'エバーランド近くのファミリーリゾート。プール+キッズ施設。',
      en: 'Family resort near Everland. Pool + kids facilities.',
    },
    priceRange: '₩120,000~250,000',
    walkToMission: { ko: '차량 15분', ja: '車15分', en: '15 min by car' },
    highlights: [
      { ko: '에버랜드 근처', ja: 'エバーランド近く', en: 'Near Everland' },
      { ko: '수영장 + 워터파크', ja: 'プール+ウォーターパーク', en: 'Pool + water park' },
      { ko: '키즈 시설', ja: 'キッズ施設', en: 'Kids facilities' },
    ],
    bookingUrl: 'https://www.booking.com/searchresults.ko.html?ss=%EC%9A%A9%EC%9D%B8+%EC%97%90%EB%B2%84%EB%9E%9C%EB%93%9C',
    platform: 'Booking.com',
  },
  {
    id: 'yongin-2', cityId: 'yongin',
    name: { ko: '한국민속촌 근처 펜션', ja: '韓国民俗村近くのペンション', en: 'Folk Village Nearby Pension' },
    type: 'pension', vibe: ['traditional', 'family'],
    description: {
      ko: '한국민속촌 도보 10분 거리 독채 펜션.',
      ja: '韓国民俗村徒歩10分の一棟貸しペンション。',
      en: 'Private pension 10 min walk from Korean Folk Village.',
    },
    priceRange: '₩80,000~150,000',
    walkToMission: { ko: '도보 10분', ja: '徒歩10分', en: '10 min walk' },
    highlights: [
      { ko: '민속촌 도보 10분', ja: '民俗村徒歩10分', en: '10 min to Folk Village' },
      { ko: '독채 프라이빗', ja: '一棟貸し', en: 'Private villa' },
      { ko: 'BBQ 시설', ja: 'BBQ設備', en: 'BBQ facilities' },
    ],
    bookingUrl: 'https://www.airbnb.co.kr/s/%EC%9A%A9%EC%9D%B8%EC%8B%9C+%ED%95%9C%EA%B5%AD%EB%AF%BC%EC%86%8D%EC%B4%8C/homes',
    platform: 'Airbnb',
  },

  // ─────── 이천 ───────
  {
    id: 'icheon-1', cityId: 'icheon',
    name: { ko: '이천 도자기마을 한옥', ja: '利川陶磁器村韓屋', en: 'Icheon Ceramic Village Hanok' },
    type: 'hanok', vibe: ['traditional', 'romantic'],
    description: {
      ko: '이천 도예촌 내 전통 한옥. 도예 체험 패키지.',
      ja: '利川陶芸村内の伝統韓屋。陶芸体験パッケージ。',
      en: 'Traditional hanok in Icheon ceramic village. Pottery experience package.',
    },
    priceRange: '₩100,000~180,000',
    walkToMission: { ko: '도보 5분', ja: '徒歩5分', en: '5 min walk' },
    highlights: [
      { ko: '도예 체험 포함', ja: '陶芸体験込み', en: 'Pottery experience included' },
      { ko: '도예촌 중심', ja: '陶芸村中心', en: 'Ceramic village center' },
      { ko: '전통 한옥', ja: '伝統韓屋', en: 'Traditional hanok' },
    ],
    bookingUrl: 'https://www.airbnb.co.kr/s/%EC%9D%B4%EC%B2%9C+%EB%8F%84%EC%98%88%EC%B4%8C/homes',
    platform: 'Airbnb',
  },
  {
    id: 'icheon-2', cityId: 'icheon',
    name: { ko: '이천 미란다호텔', ja: '利川ミランダホテル', en: 'Icheon Miranda Hotel' },
    type: 'hotel', vibe: ['luxury'],
    description: {
      ko: '이천 온천수 호텔. 야외 온천 + 스파.',
      ja: '利川温泉ホテル。露天温泉+スパ。',
      en: 'Icheon hot spring hotel. Outdoor onsen + spa.',
    },
    priceRange: '₩150,000~300,000',
    walkToMission: { ko: '차량 10분', ja: '車10分', en: '10 min by car' },
    highlights: [
      { ko: '천연 온천수', ja: '天然温泉', en: 'Natural hot spring' },
      { ko: '야외 노천탕', ja: '露天風呂', en: 'Outdoor bath' },
      { ko: '한정식 조식', ja: '韓定食朝食', en: 'Korean breakfast' },
    ],
    bookingUrl: 'https://www.booking.com/searchresults.ko.html?ss=%EC%9D%B4%EC%B2%9C+%EC%98%A8%EC%B2%9C',
    platform: 'Booking.com',
  },
]

export const STAY_CITIES = [
  'jeonju', 'seoul', 'busan', 'jeju', 'gyeongju',
  'tongyeong', 'cheonan', 'yongin', 'icheon',
] as const

export const STAY_TYPE_EMOJI: Record<StayType, string> = {
  hanok: '🏯',
  hotel: '🏨',
  guesthouse: '🏠',
  pension: '🏡',
  resort: '🏖️',
}

export const VIBE_TAGS: VibeTag[] = [
  'traditional', 'modern', 'romantic', 'family',
  'budget', 'luxury', 'instagram', 'nature',
]
