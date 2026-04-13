// 출발지별 교통 옵션 (transport-routes.ts 를 보완)
// transport-routes.ts = 서울 출발 기준 (수정 금지)
// 이 파일 = 공항/부산 등 다른 출발지 기준

export interface DepartureOption {
  type: 'ktx' | 'bus' | 'flight' | 'arex' | 'limousine'
  available: boolean
  name: { ko: string; en: string; ja: string }
  from: { ko: string; en: string; ja: string }
  to: { ko: string; en: string; ja: string }
  duration: string
  durationMinutes: number
  fixedPrice?: string
  bookingUrl: string
  note?: { ko: string; en: string; ja: string }
}

export interface DepartureRoute {
  departureId: string
  cityId: string
  options: DepartureOption[]
}

const KORAIL = 'https://www.letskorail.com'
const KOBUS = 'https://www.kobus.co.kr'
const SKY = 'https://www.skyscanner.co.kr'
const AREX = 'https://www.arex.or.kr'
const LIMO = 'https://www.kallimousine.com'

export const DEPARTURE_ROUTES: DepartureRoute[] = [
  // ═══ 인천국제공항 ═══
  { departureId: 'incheon-airport', cityId: 'seoul', options: [
    { type: 'arex', available: true, name: { ko: '공항철도 직통 (AREX)', en: 'AREX Express', ja: '空港鉄道直通' }, from: { ko: '인천국제공항 T1/T2', en: 'Incheon Airport T1/T2', ja: '仁川空港 T1/T2' }, to: { ko: '서울역', en: 'Seoul Station', ja: 'ソウル駅' }, duration: '43m', durationMinutes: 43, fixedPrice: '₩9,500', bookingUrl: AREX, note: { ko: '가장 빠르고 편리, 43분 논스톱', en: 'Fastest, 43min non-stop', ja: '最速43分ノンストップ' } },
    { type: 'arex', available: true, name: { ko: '공항철도 일반', en: 'AREX All-stop', ja: '空港鉄道一般' }, from: { ko: '인천국제공항', en: 'Incheon Airport', ja: '仁川空港' }, to: { ko: '서울역', en: 'Seoul Station', ja: 'ソウル駅' }, duration: '1h 6m', durationMinutes: 66, fixedPrice: '₩4,850', bookingUrl: AREX },
    { type: 'limousine', available: true, name: { ko: '공항리무진', en: 'Airport Limousine', ja: '空港リムジン' }, from: { ko: '인천국제공항', en: 'Incheon Airport', ja: '仁川空港' }, to: { ko: '서울 주요 지역', en: 'Seoul major areas', ja: 'ソウル主要エリア' }, duration: '1h~1h 30m', durationMinutes: 75, fixedPrice: '₩15,000~₩18,000', bookingUrl: LIMO, note: { ko: '호텔 앞까지 직행, 짐 많을 때 추천', en: 'Direct to hotel, good with luggage', ja: 'ホテル前まで直行' } },
  ]},
  { departureId: 'incheon-airport', cityId: 'busan', options: [
    { type: 'ktx', available: true, name: { ko: 'AREX + KTX', en: 'AREX + KTX', ja: 'AREX + KTX' }, from: { ko: '인천국제공항', en: 'Incheon Airport', ja: '仁川空港' }, to: { ko: '부산역', en: 'Busan Station', ja: '釜山駅' }, duration: '3h 15m', durationMinutes: 195, fixedPrice: '₩68,500~', bookingUrl: KORAIL, note: { ko: 'AREX 서울역(43분) → KTX 부산(2.5h)', en: 'AREX Seoul(43m) → KTX Busan(2.5h)', ja: 'AREXソウル駅→KTX釜山' } },
  ]},
  { departureId: 'incheon-airport', cityId: 'jeju', options: [
    { type: 'flight', available: true, name: { ko: '국내선 (김포 환승)', en: 'Domestic via Gimpo', ja: '国内線（金浦経由）' }, from: { ko: '인천→김포공항', en: 'Incheon→Gimpo', ja: '仁川→金浦' }, to: { ko: '제주국제공항', en: 'Jeju Airport', ja: '済州空港' }, duration: '2h 30m', durationMinutes: 150, fixedPrice: '₩60,000~₩150,000', bookingUrl: SKY, note: { ko: '인천→김포 이동(1h) + 김포→제주(1h)', en: 'Incheon→Gimpo(1h)+Gimpo→Jeju(1h)', ja: '仁川→金浦(1h)+金浦→済州(1h)' } },
  ]},
  { departureId: 'incheon-airport', cityId: 'jeonju', options: [
    { type: 'ktx', available: true, name: { ko: 'AREX + KTX + 환승', en: 'AREX + KTX + Transfer', ja: 'AREX+KTX+乗換' }, from: { ko: '인천국제공항', en: 'Incheon Airport', ja: '仁川空港' }, to: { ko: '전주역', en: 'Jeonju Station', ja: '全州駅' }, duration: '3h', durationMinutes: 180, fixedPrice: '₩35,000~', bookingUrl: KORAIL, note: { ko: 'AREX→서울→KTX 익산→전주', en: 'AREX→Seoul→KTX Iksan→Jeonju', ja: 'AREX→ソウル→KTX益山→全州' } },
    { type: 'bus', available: true, name: { ko: '리무진 + 고속버스', en: 'Limousine + Express Bus', ja: 'リムジン+高速バス' }, from: { ko: '인천국제공항', en: 'Incheon Airport', ja: '仁川空港' }, to: { ko: '전주고속버스터미널', en: 'Jeonju Bus Terminal', ja: '全州バスターミナル' }, duration: '4h 30m', durationMinutes: 270, fixedPrice: '₩30,000~', bookingUrl: KOBUS },
  ]},
  { departureId: 'incheon-airport', cityId: 'cheonan', options: [
    { type: 'limousine', available: true, name: { ko: '공항리무진 직행', en: 'Airport Limousine Direct', ja: '空港リムジン直行' }, from: { ko: '인천국제공항', en: 'Incheon Airport', ja: '仁川空港' }, to: { ko: '천안터미널', en: 'Cheonan Terminal', ja: '天安ターミナル' }, duration: '2h', durationMinutes: 120, fixedPrice: '₩20,000~', bookingUrl: LIMO },
  ]},
  { departureId: 'incheon-airport', cityId: 'yongin', options: [
    { type: 'limousine', available: true, name: { ko: '공항리무진', en: 'Airport Limousine', ja: '空港リムジン' }, from: { ko: '인천국제공항', en: 'Incheon Airport', ja: '仁川空港' }, to: { ko: '용인', en: 'Yongin', ja: '龍仁' }, duration: '1h 30m', durationMinutes: 90, fixedPrice: '₩15,000~', bookingUrl: LIMO },
  ]},
  { departureId: 'incheon-airport', cityId: 'icheon', options: [
    { type: 'bus', available: true, name: { ko: '리무진 + 시외버스', en: 'Limousine + Intercity', ja: 'リムジン+市外バス' }, from: { ko: '인천국제공항', en: 'Incheon Airport', ja: '仁川空港' }, to: { ko: '이천터미널', en: 'Icheon Terminal', ja: '利川ターミナル' }, duration: '2h 30m', durationMinutes: 150, fixedPrice: '₩18,000~', bookingUrl: KOBUS },
  ]},

  // ═══ 김포국제공항 ═══
  { departureId: 'gimpo-airport', cityId: 'seoul', options: [
    { type: 'arex', available: true, name: { ko: '지하철/공항철도', en: 'Subway/AREX', ja: '地下鉄/空港鉄道' }, from: { ko: '김포국제공항', en: 'Gimpo Airport', ja: '金浦空港' }, to: { ko: '서울 시내', en: 'Seoul City', ja: 'ソウル市内' }, duration: '20~40m', durationMinutes: 30, fixedPrice: '₩1,450~₩4,850', bookingUrl: AREX, note: { ko: '지하철 5/9호선 또는 공항철도', en: 'Subway Line 5/9 or AREX', ja: '地下鉄5/9号線または空港鉄道' } },
  ]},
  { departureId: 'gimpo-airport', cityId: 'jeju', options: [
    { type: 'flight', available: true, name: { ko: '국내선 항공', en: 'Domestic Flight', ja: '国内線' }, from: { ko: '김포국제공항', en: 'Gimpo Airport', ja: '金浦空港' }, to: { ko: '제주국제공항', en: 'Jeju Airport', ja: '済州空港' }, duration: '1h 5m', durationMinutes: 65, fixedPrice: '₩50,000~₩150,000', bookingUrl: SKY, note: { ko: '김포→제주 직항 (가장 빈번)', en: 'Gimpo→Jeju direct (most frequent)', ja: '金浦→済州直行（最多路線）' } },
  ]},
  { departureId: 'gimpo-airport', cityId: 'jeonju', options: [
    { type: 'bus', available: true, name: { ko: '지하철 + 고속버스', en: 'Subway + Express Bus', ja: '地下鉄+高速バス' }, from: { ko: '김포국제공항', en: 'Gimpo Airport', ja: '金浦空港' }, to: { ko: '전주고속버스터미널', en: 'Jeonju Bus Terminal', ja: '全州バスターミナル' }, duration: '3h 30m', durationMinutes: 210, fixedPrice: '₩16,000~', bookingUrl: KOBUS },
  ]},
  { departureId: 'gimpo-airport', cityId: 'cheonan', options: [
    { type: 'bus', available: true, name: { ko: '지하철 + KTX/버스', en: 'Subway + KTX/Bus', ja: '地下鉄+KTX/バス' }, from: { ko: '김포국제공항', en: 'Gimpo Airport', ja: '金浦空港' }, to: { ko: '천안', en: 'Cheonan', ja: '天安' }, duration: '2h', durationMinutes: 120, fixedPrice: '₩10,000~', bookingUrl: KORAIL },
  ]},
  { departureId: 'gimpo-airport', cityId: 'yongin', options: [
    { type: 'bus', available: true, name: { ko: '지하철 + 버스', en: 'Subway + Bus', ja: '地下鉄+バス' }, from: { ko: '김포국제공항', en: 'Gimpo Airport', ja: '金浦空港' }, to: { ko: '용인', en: 'Yongin', ja: '龍仁' }, duration: '1h 30m', durationMinutes: 90, fixedPrice: '₩5,000~', bookingUrl: '' },
  ]},
  { departureId: 'gimpo-airport', cityId: 'icheon', options: [
    { type: 'bus', available: true, name: { ko: '지하철 + 시외버스', en: 'Subway + Intercity', ja: '地下鉄+市外バス' }, from: { ko: '김포국제공항', en: 'Gimpo Airport', ja: '金浦空港' }, to: { ko: '이천', en: 'Icheon', ja: '利川' }, duration: '2h', durationMinutes: 120, fixedPrice: '₩8,000~', bookingUrl: KOBUS },
  ]},

  // ═══ 김해국제공항 ═══
  { departureId: 'gimhae-airport', cityId: 'busan', options: [
    { type: 'arex', available: true, name: { ko: '경전철 + 지하철', en: 'Light Rail + Subway', ja: '軽電鉄+地下鉄' }, from: { ko: '김해국제공항', en: 'Gimhae Airport', ja: '金海空港' }, to: { ko: '부산 시내', en: 'Busan City', ja: '釜山市内' }, duration: '40m~1h', durationMinutes: 50, fixedPrice: '₩1,650~₩2,050', bookingUrl: '' },
    { type: 'limousine', available: true, name: { ko: '공항리무진', en: 'Airport Limousine', ja: '空港リムジン' }, from: { ko: '김해국제공항', en: 'Gimhae Airport', ja: '金海空港' }, to: { ko: '부산 해운대/서면', en: 'Haeundae/Seomyeon', ja: '海雲台/西面' }, duration: '50m~1h 10m', durationMinutes: 60, fixedPrice: '₩7,000~₩8,000', bookingUrl: '' },
  ]},
  { departureId: 'gimhae-airport', cityId: 'gyeongju', options: [
    { type: 'bus', available: true, name: { ko: '리무진 + 고속버스', en: 'Limousine + Express Bus', ja: 'リムジン+高速バス' }, from: { ko: '김해국제공항', en: 'Gimhae Airport', ja: '金海空港' }, to: { ko: '경주고속버스터미널', en: 'Gyeongju Terminal', ja: '慶州ターミナル' }, duration: '1h 40m', durationMinutes: 100, fixedPrice: '₩12,000~', bookingUrl: KOBUS },
  ]},
  { departureId: 'gimhae-airport', cityId: 'tongyeong', options: [
    { type: 'bus', available: true, name: { ko: '리무진 + 시외버스', en: 'Limousine + Intercity', ja: 'リムジン+市外バス' }, from: { ko: '김해국제공항', en: 'Gimhae Airport', ja: '金海空港' }, to: { ko: '통영종합버스터미널', en: 'Tongyeong Terminal', ja: '統営ターミナル' }, duration: '2h 30m', durationMinutes: 150, fixedPrice: '₩15,000~', bookingUrl: KOBUS },
  ]},

  // ═══ 부산 ═══
  { departureId: 'busan', cityId: 'gyeongju', options: [
    { type: 'bus', available: true, name: { ko: '고속/시외버스', en: 'Express Bus', ja: '高速バス' }, from: { ko: '부산종합버스터미널', en: 'Busan Terminal', ja: '釜山ターミナル' }, to: { ko: '경주고속버스터미널', en: 'Gyeongju Terminal', ja: '慶州ターミナル' }, duration: '50m', durationMinutes: 50, fixedPrice: '₩5,800~', bookingUrl: KOBUS, note: { ko: '직행, 15~20분 간격', en: 'Direct, every 15-20min', ja: '直行、15～20分間隔' } },
    { type: 'ktx', available: true, name: { ko: 'KTX/무궁화호', en: 'KTX/Mugunghwa', ja: 'KTX/ムグンファ号' }, from: { ko: '부산역', en: 'Busan Station', ja: '釜山駅' }, to: { ko: '신경주역', en: 'Singyeongju Station', ja: '新慶州駅' }, duration: '30m', durationMinutes: 30, fixedPrice: '₩11,000~', bookingUrl: KORAIL, note: { ko: '신경주역→시내 버스 20분 추가', en: '+20min bus from Singyeongju', ja: '新慶州→市内バス20分追加' } },
  ]},
  { departureId: 'busan', cityId: 'tongyeong', options: [
    { type: 'bus', available: true, name: { ko: '시외버스', en: 'Intercity Bus', ja: '市外バス' }, from: { ko: '부산서부터미널', en: 'Busan West Terminal', ja: '釜山西部ターミナル' }, to: { ko: '통영종합버스터미널', en: 'Tongyeong Terminal', ja: '統営ターミナル' }, duration: '2h', durationMinutes: 120, fixedPrice: '₩13,000~', bookingUrl: KOBUS, note: { ko: '직행 시외버스, 1시간 간격', en: 'Direct intercity, hourly', ja: '直行市外バス、1時間間隔' } },
  ]},
  { departureId: 'busan', cityId: 'seoul', options: [
    { type: 'ktx', available: true, name: { ko: 'KTX', en: 'KTX', ja: 'KTX' }, from: { ko: '부산역', en: 'Busan Station', ja: '釜山駅' }, to: { ko: '서울역', en: 'Seoul Station', ja: 'ソウル駅' }, duration: '2h 30m', durationMinutes: 150, fixedPrice: '₩59,000~', bookingUrl: KORAIL },
  ]},
  { departureId: 'busan', cityId: 'jeonju', options: [
    { type: 'ktx', available: true, name: { ko: 'KTX (익산 환승)', en: 'KTX via Iksan', ja: 'KTX（益山乗換）' }, from: { ko: '부산역', en: 'Busan Station', ja: '釜山駅' }, to: { ko: '전주역', en: 'Jeonju Station', ja: '全州駅' }, duration: '2h 30m', durationMinutes: 150, fixedPrice: '₩45,000~', bookingUrl: KORAIL, note: { ko: 'KTX 익산역(2h) → 전라선 전주(30m)', en: 'KTX→Iksan(2h)→Jeonju(30m)', ja: 'KTX→益山(2h)→全州(30m)' } },
  ]},
]

export function getDepartureRoutes(departureId: string, cityId: string): DepartureRoute | null {
  return DEPARTURE_ROUTES.find((r) => r.departureId === departureId && r.cityId === cityId) || null
}
