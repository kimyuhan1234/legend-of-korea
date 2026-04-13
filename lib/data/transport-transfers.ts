// 환승 정보 (출발지별)
// transport-routes.ts 는 수정하지 않고 별도 관리

export interface TransferStep {
  step: number
  from: { ko: string; en: string; ja: string }
  to: { ko: string; en: string; ja: string }
  method: { ko: string; en: string; ja: string }
  duration: string
  note?: { ko: string; en: string; ja: string }
}

export interface TransferInfo {
  departureId: string
  cityId: string
  transportType: 'ktx' | 'bus' | 'flight'
  transfers: TransferStep[]
}

export const TRANSFER_INFO: TransferInfo[] = [
  // ── 서울 출발 ──
  {
    departureId: 'seoul', cityId: 'jeonju', transportType: 'ktx',
    transfers: [
      { step: 1, from: { ko: '서울역', en: 'Seoul Station', ja: 'ソウル駅' }, to: { ko: '익산역', en: 'Iksan Station', ja: '益山駅' }, method: { ko: 'KTX', en: 'KTX', ja: 'KTX' }, duration: '1h 20m', note: { ko: '익산역에서 전라선 환승', en: 'Transfer to Jeolla Line at Iksan', ja: '益山駅で全羅線に乗り換え' } },
      { step: 2, from: { ko: '익산역', en: 'Iksan Station', ja: '益山駅' }, to: { ko: '전주역', en: 'Jeonju Station', ja: '全州駅' }, method: { ko: '무궁화호', en: 'Mugunghwa', ja: 'ムグンファ号' }, duration: '30m' },
    ],
  },
  {
    departureId: 'seoul', cityId: 'tongyeong', transportType: 'bus',
    transfers: [
      { step: 1, from: { ko: '서울고속버스터미널', en: 'Seoul Express Bus Terminal', ja: 'ソウル高速バスターミナル' }, to: { ko: '마산합포구터미널', en: 'Masan Terminal', ja: '馬山ターミナル' }, method: { ko: '고속버스', en: 'Express Bus', ja: '高速バス' }, duration: '3h 30m' },
      { step: 2, from: { ko: '마산합포구터미널', en: 'Masan Terminal', ja: '馬山ターミナル' }, to: { ko: '통영종합버스터미널', en: 'Tongyeong Terminal', ja: '統営ターミナル' }, method: { ko: '시외버스', en: 'Intercity Bus', ja: '市外バス' }, duration: '1h', note: { ko: '마산에서 통영행 시외버스 환승 (30분 간격)', en: 'Transfer to Tongyeong bus at Masan (every 30min)', ja: '馬山で統営行き市外バスに乗り換え（30分間隔）' } },
    ],
  },
  {
    departureId: 'seoul', cityId: 'gyeongju', transportType: 'ktx',
    transfers: [
      { step: 1, from: { ko: '서울역', en: 'Seoul Station', ja: 'ソウル駅' }, to: { ko: '신경주역', en: 'Singyeongju Station', ja: '新慶州駅' }, method: { ko: 'KTX', en: 'KTX', ja: 'KTX' }, duration: '2h' },
      { step: 2, from: { ko: '신경주역', en: 'Singyeongju Station', ja: '新慶州駅' }, to: { ko: '경주 시내', en: 'Gyeongju City Center', ja: '慶州市内' }, method: { ko: '버스 50/51번', en: 'Bus 50/51', ja: 'バス50/51番' }, duration: '20m', note: { ko: '신경주역은 시내에서 떨어져 있어 버스 필요', en: 'Singyeongju is outside city, bus needed', ja: '新慶州駅は市内から離れているためバスが必要' } },
    ],
  },

  // ── 인천공항 출발 ──
  {
    departureId: 'incheon-airport', cityId: 'seoul', transportType: 'ktx',
    transfers: [
      { step: 1, from: { ko: '인천공항', en: 'Incheon Airport', ja: '仁川空港' }, to: { ko: '서울역', en: 'Seoul Station', ja: 'ソウル駅' }, method: { ko: '공항철도 직행', en: 'AREX Express', ja: '空港鉄道直通' }, duration: '43m', note: { ko: '공항철도 직통열차 ₩9,500', en: 'AREX Express ₩9,500', ja: '空港鉄道直通 ₩9,500' } },
    ],
  },
  {
    departureId: 'incheon-airport', cityId: 'busan', transportType: 'ktx',
    transfers: [
      { step: 1, from: { ko: '인천공항', en: 'Incheon Airport', ja: '仁川空港' }, to: { ko: '서울역', en: 'Seoul Station', ja: 'ソウル駅' }, method: { ko: '공항철도 직행', en: 'AREX Express', ja: '空港鉄道直通' }, duration: '43m' },
      { step: 2, from: { ko: '서울역', en: 'Seoul Station', ja: 'ソウル駅' }, to: { ko: '부산역', en: 'Busan Station', ja: '釜山駅' }, method: { ko: 'KTX', en: 'KTX', ja: 'KTX' }, duration: '2h 30m' },
    ],
  },
  {
    departureId: 'incheon-airport', cityId: 'jeonju', transportType: 'bus',
    transfers: [
      { step: 1, from: { ko: '인천공항', en: 'Incheon Airport', ja: '仁川空港' }, to: { ko: '서울고속버스터미널', en: 'Seoul Express Bus Terminal', ja: 'ソウル高速バスターミナル' }, method: { ko: '공항리무진', en: 'Airport Limousine', ja: '空港リムジン' }, duration: '1h 10m' },
      { step: 2, from: { ko: '서울고속버스터미널', en: 'Seoul Express Bus Terminal', ja: 'ソウル高速バスターミナル' }, to: { ko: '전주고속버스터미널', en: 'Jeonju Bus Terminal', ja: '全州バスターミナル' }, method: { ko: '고속버스', en: 'Express Bus', ja: '高速バス' }, duration: '2h 30m' },
    ],
  },

  // ── 김포공항 출발 ──
  {
    departureId: 'gimpo-airport', cityId: 'seoul', transportType: 'bus',
    transfers: [
      { step: 1, from: { ko: '김포공항', en: 'Gimpo Airport', ja: '金浦空港' }, to: { ko: '서울역', en: 'Seoul Station', ja: 'ソウル駅' }, method: { ko: '공항철도', en: 'AREX', ja: '空港鉄道' }, duration: '20m' },
    ],
  },

  // ── 김해공항 출발 ──
  {
    departureId: 'gimhae-airport', cityId: 'gyeongju', transportType: 'bus',
    transfers: [
      { step: 1, from: { ko: '김해공항', en: 'Gimhae Airport', ja: '金海空港' }, to: { ko: '부산종합버스터미널', en: 'Busan Bus Terminal', ja: '釜山バスターミナル' }, method: { ko: '공항리무진', en: 'Airport Limousine', ja: '空港リムジン' }, duration: '50m' },
      { step: 2, from: { ko: '부산종합버스터미널', en: 'Busan Bus Terminal', ja: '釜山バスターミナル' }, to: { ko: '경주고속버스터미널', en: 'Gyeongju Bus Terminal', ja: '慶州バスターミナル' }, method: { ko: '고속버스', en: 'Express Bus', ja: '高速バス' }, duration: '50m' },
    ],
  },
  {
    departureId: 'gimhae-airport', cityId: 'tongyeong', transportType: 'bus',
    transfers: [
      { step: 1, from: { ko: '김해공항', en: 'Gimhae Airport', ja: '金海空港' }, to: { ko: '마산합포구터미널', en: 'Masan Terminal', ja: '馬山ターミナル' }, method: { ko: '공항리무진/시외버스', en: 'Limousine/Intercity Bus', ja: 'リムジン/市外バス' }, duration: '1h 30m' },
      { step: 2, from: { ko: '마산합포구터미널', en: 'Masan Terminal', ja: '馬山ターミナル' }, to: { ko: '통영종합버스터미널', en: 'Tongyeong Terminal', ja: '統営ターミナル' }, method: { ko: '시외버스', en: 'Intercity Bus', ja: '市外バス' }, duration: '1h' },
    ],
  },

  // ── 부산 출발 ──
  {
    departureId: 'busan', cityId: 'tongyeong', transportType: 'bus',
    transfers: [
      { step: 1, from: { ko: '부산서부터미널', en: 'Busan West Terminal', ja: '釜山西部ターミナル' }, to: { ko: '통영종합버스터미널', en: 'Tongyeong Terminal', ja: '統営ターミナル' }, method: { ko: '시외버스', en: 'Intercity Bus', ja: '市外バス' }, duration: '2h', note: { ko: '부산서부터미널에서 직행 시외버스', en: 'Direct intercity bus from Busan West', ja: '釜山西部から直行市外バス' } },
    ],
  },
]

export function getTransferInfo(departureId: string, cityId: string, transportType: string): TransferInfo | null {
  return TRANSFER_INFO.find((t) =>
    t.departureId === departureId && t.cityId === cityId && t.transportType === transportType
  ) || null
}
