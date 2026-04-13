// 환승이 필요한 노선 정보 (서울 출발 기준)
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
  cityId: string
  transportType: 'ktx' | 'bus' | 'flight'
  transfers: TransferStep[]
}

export const TRANSFER_INFO: TransferInfo[] = [
  {
    cityId: 'jeonju',
    transportType: 'ktx',
    transfers: [
      {
        step: 1,
        from: { ko: '서울역', en: 'Seoul Station', ja: 'ソウル駅' },
        to: { ko: '익산역', en: 'Iksan Station', ja: '益山駅' },
        method: { ko: 'KTX', en: 'KTX', ja: 'KTX' },
        duration: '1h 20m',
        note: { ko: '익산역에서 전라선 환승', en: 'Transfer to Jeolla Line at Iksan', ja: '益山駅で全羅線に乗り換え' },
      },
      {
        step: 2,
        from: { ko: '익산역', en: 'Iksan Station', ja: '益山駅' },
        to: { ko: '전주역', en: 'Jeonju Station', ja: '全州駅' },
        method: { ko: '무궁화호', en: 'Mugunghwa', ja: 'ムグンファ号' },
        duration: '30m',
      },
    ],
  },
  {
    cityId: 'tongyeong',
    transportType: 'bus',
    transfers: [
      {
        step: 1,
        from: { ko: '서울고속버스터미널', en: 'Seoul Express Bus Terminal', ja: 'ソウル高速バスターミナル' },
        to: { ko: '마산합포구터미널', en: 'Masan Terminal', ja: '馬山ターミナル' },
        method: { ko: '고속버스', en: 'Express Bus', ja: '高速バス' },
        duration: '3h 30m',
      },
      {
        step: 2,
        from: { ko: '마산합포구터미널', en: 'Masan Terminal', ja: '馬山ターミナル' },
        to: { ko: '통영종합버스터미널', en: 'Tongyeong Terminal', ja: '統営ターミナル' },
        method: { ko: '시외버스', en: 'Intercity Bus', ja: '市外バス' },
        duration: '1h',
        note: { ko: '마산에서 통영행 시외버스 환승 (30분 간격)', en: 'Transfer to Tongyeong bus at Masan (every 30min)', ja: '馬山で統営行き市外バスに乗り換え（30分間隔）' },
      },
    ],
  },
  {
    cityId: 'gyeongju',
    transportType: 'ktx',
    transfers: [
      {
        step: 1,
        from: { ko: '서울역', en: 'Seoul Station', ja: 'ソウル駅' },
        to: { ko: '신경주역', en: 'Singyeongju Station', ja: '新慶州駅' },
        method: { ko: 'KTX', en: 'KTX', ja: 'KTX' },
        duration: '2h',
      },
      {
        step: 2,
        from: { ko: '신경주역', en: 'Singyeongju Station', ja: '新慶州駅' },
        to: { ko: '경주 시내', en: 'Gyeongju City Center', ja: '慶州市内' },
        method: { ko: '버스 50/51번', en: 'Bus 50/51', ja: 'バス50/51番' },
        duration: '20m',
        note: { ko: '신경주역은 시내에서 떨어져 있어 버스 필요', en: 'Singyeongju is outside city, bus needed', ja: '新慶州駅は市内から離れているためバスが必要' },
      },
    ],
  },
  {
    cityId: 'jeju',
    transportType: 'bus',
    transfers: [
      {
        step: 1,
        from: { ko: '서울', en: 'Seoul', ja: 'ソウル' },
        to: { ko: '인천공항/김포공항', en: 'Incheon/Gimpo Airport', ja: '仁川/金浦空港' },
        method: { ko: '공항리무진/지하철', en: 'Airport Limousine/Subway', ja: '空港リムジン/地下鉄' },
        duration: '1h',
        note: { ko: '제주는 항공편만 이용 가능', en: 'Only flights available to Jeju', ja: '済州は航空便のみ' },
      },
    ],
  },
]

export function getTransferInfo(cityId: string, transportType: string): TransferInfo | null {
  return TRANSFER_INFO.find((t) => t.cityId === cityId && t.transportType === transportType) || null
}
