// ─────────────────────────────────────────────
//  lib/data/transport-routes.ts
//  서울 → 9개 도시 교통 경로 (KTX / 고속버스 / 직항 / 라스트마일)
// ─────────────────────────────────────────────

export type TransportType = 'ktx' | 'bus' | 'flight'

export interface TransportOption {
  type: TransportType
  available: boolean
  station: { ko: string; ja: string; en: string }
  duration: string
  estimatedCost: string
  bookingUrl: string
}

export interface LastMile {
  taxi: {
    estimatedCost: string
    koreanAddress: { ko: string; ja: string; en: string }
  }
  bus?: {
    route: { ko: string; ja: string; en: string }
    stop: { ko: string; ja: string; en: string }
    duration: string
  }
  walk?: {
    duration: string
    mapUrl: string
  }
}

export interface TransportRoute {
  cityId: string
  options: TransportOption[]
  lastMile: LastMile
}

const KORAIL = 'https://www.letskorail.com'
const KOBUS = 'https://www.kobus.co.kr'
const SKYSCANNER = 'https://www.skyscanner.co.kr'

export const TRANSPORT_ROUTES: TransportRoute[] = [
  {
    cityId: 'jeonju',
    options: [
      {
        type: 'ktx', available: true,
        station: { ko: '전주역', ja: '全州駅', en: 'Jeonju Station' },
        duration: '1.5~2h', estimatedCost: '₩25,000~45,000', bookingUrl: KORAIL,
      },
      {
        type: 'bus', available: true,
        station: { ko: '전주고속터미널', ja: '全州高速ターミナル', en: 'Jeonju Express Bus Terminal' },
        duration: '2.5h', estimatedCost: '₩15,000~22,000', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        estimatedCost: '₩8,000~12,000',
        koreanAddress: {
          ko: '전주한옥마을로 이동해주세요',
          ja: '全州韓屋村までお願いします',
          en: 'To Jeonju Hanok Village, please',
        },
      },
      bus: {
        route: { ko: '시내버스 119, 536', ja: '市内バス 119, 536', en: 'City bus 119, 536' },
        stop: { ko: '한옥마을 정류장', ja: '韓屋村バス停', en: 'Hanok Village stop' },
        duration: '15~20분',
      },
    },
  },
  {
    cityId: 'busan',
    options: [
      {
        type: 'ktx', available: true,
        station: { ko: '부산역', ja: '釜山駅', en: 'Busan Station' },
        duration: '2.5~3h', estimatedCost: '₩45,000~60,000', bookingUrl: KORAIL,
      },
      {
        type: 'bus', available: true,
        station: { ko: '부산종합터미널', ja: '釜山総合ターミナル', en: 'Busan Central Bus Terminal' },
        duration: '4~5h', estimatedCost: '₩25,000~35,000', bookingUrl: KOBUS,
      },
      {
        type: 'flight', available: true,
        station: { ko: '김해국제공항', ja: '金海国際空港', en: 'Gimhae Int\'l Airport' },
        duration: '1h', estimatedCost: '₩40,000~120,000', bookingUrl: SKYSCANNER,
      },
    ],
    lastMile: {
      taxi: {
        estimatedCost: '₩10,000~15,000',
        koreanAddress: {
          ko: '해운대로 이동해주세요',
          ja: '海雲台までお願いします',
          en: 'To Haeundae, please',
        },
      },
      bus: {
        route: { ko: '지하철 1호선 → 2호선', ja: '地下鉄1号線→2号線', en: 'Subway Line 1 → Line 2' },
        stop: { ko: '해운대역', ja: '海雲台駅', en: 'Haeundae Station' },
        duration: '40분',
      },
    },
  },
  {
    cityId: 'jeju',
    options: [
      {
        type: 'flight', available: true,
        station: { ko: '제주국제공항', ja: '済州国際空港', en: 'Jeju Int\'l Airport' },
        duration: '1h', estimatedCost: '₩50,000~150,000', bookingUrl: SKYSCANNER,
      },
    ],
    lastMile: {
      taxi: {
        estimatedCost: '₩15,000~25,000',
        koreanAddress: {
          ko: '제주시 연동으로 이동해주세요',
          ja: '済州市蓮洞までお願いします',
          en: 'To Yeon-dong, Jeju City, please',
        },
      },
      bus: {
        route: { ko: '공항리무진 600번', ja: '空港リムジン600番', en: 'Airport Limousine 600' },
        stop: { ko: '주요 호텔', ja: '主要ホテル', en: 'Major hotels' },
        duration: '30~60분',
      },
    },
  },
  {
    cityId: 'gyeongju',
    options: [
      {
        type: 'ktx', available: true,
        station: { ko: '신경주역', ja: '新慶州駅', en: 'Singyeongju Station' },
        duration: '2~2.5h', estimatedCost: '₩40,000~55,000', bookingUrl: KORAIL,
      },
      {
        type: 'bus', available: true,
        station: { ko: '경주고속터미널', ja: '慶州高速ターミナル', en: 'Gyeongju Express Bus Terminal' },
        duration: '3.5~4h', estimatedCost: '₩20,000~30,000', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        estimatedCost: '₩10,000~18,000',
        koreanAddress: {
          ko: '경주 한옥마을로 이동해주세요',
          ja: '慶州韓屋村までお願いします',
          en: 'To Gyeongju Hanok Village, please',
        },
      },
      bus: {
        route: { ko: '시내버스 700', ja: '市内バス700', en: 'City bus 700' },
        stop: { ko: '첨성대', ja: '瞻星台', en: 'Cheomseongdae' },
        duration: '20분',
      },
    },
  },
  {
    cityId: 'tongyeong',
    options: [
      {
        type: 'bus', available: true,
        station: { ko: '통영고속터미널', ja: '統営高速ターミナル', en: 'Tongyeong Express Bus Terminal' },
        duration: '4~4.5h', estimatedCost: '₩28,000~38,000', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        estimatedCost: '₩8,000~14,000',
        koreanAddress: {
          ko: '통영 케이블카 승차장으로 이동해주세요',
          ja: '統営ケーブルカー乗り場までお願いします',
          en: 'To Tongyeong Cable Car station, please',
        },
      },
      bus: {
        route: { ko: '시내버스 101', ja: '市内バス101', en: 'City bus 101' },
        stop: { ko: '강구안', ja: 'カンクアン', en: 'Ganggu-an' },
        duration: '15분',
      },
    },
  },
  {
    cityId: 'cheonan',
    options: [
      {
        type: 'ktx', available: true,
        station: { ko: '천안아산역', ja: '天安牙山駅', en: 'Cheonan-Asan Station' },
        duration: '0.5~1h', estimatedCost: '₩15,000~25,000', bookingUrl: KORAIL,
      },
      {
        type: 'bus', available: true,
        station: { ko: '천안고속터미널', ja: '天安高速ターミナル', en: 'Cheonan Express Bus Terminal' },
        duration: '1.5h', estimatedCost: '₩7,000~12,000', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        estimatedCost: '₩7,000~12,000',
        koreanAddress: {
          ko: '천안 시내로 이동해주세요',
          ja: '天安市内までお願いします',
          en: 'To downtown Cheonan, please',
        },
      },
    },
  },
  {
    cityId: 'yongin',
    options: [
      {
        type: 'bus', available: true,
        station: { ko: '용인공용버스터미널', ja: '龍仁バスターミナル', en: 'Yongin Bus Terminal' },
        duration: '1~1.5h', estimatedCost: '₩5,000~9,000', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        estimatedCost: '₩10,000~18,000',
        koreanAddress: {
          ko: '한국민속촌으로 이동해주세요',
          ja: '韓国民俗村までお願いします',
          en: 'To Korean Folk Village, please',
        },
      },
      bus: {
        route: { ko: '시내버스 37', ja: '市内バス37', en: 'City bus 37' },
        stop: { ko: '민속촌 정류장', ja: '民俗村バス停', en: 'Folk Village stop' },
        duration: '20~30분',
      },
    },
  },
  {
    cityId: 'icheon',
    options: [
      {
        type: 'bus', available: true,
        station: { ko: '이천종합버스터미널', ja: '利川総合バスターミナル', en: 'Icheon Bus Terminal' },
        duration: '1~1.5h', estimatedCost: '₩6,000~10,000', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        estimatedCost: '₩8,000~15,000',
        koreanAddress: {
          ko: '이천 도예촌으로 이동해주세요',
          ja: '利川陶芸村までお願いします',
          en: 'To Icheon Ceramic Village, please',
        },
      },
    },
  },
  {
    cityId: 'seoul',
    options: [],
    lastMile: {
      taxi: {
        estimatedCost: '-',
        koreanAddress: {
          ko: '이미 서울에 계시다면 지하철을 이용하세요',
          ja: '既にソウルにいる場合は地下鉄をご利用ください',
          en: 'If already in Seoul, use the subway',
        },
      },
    },
  },
]

export function getRouteByCity(cityId: string): TransportRoute | null {
  return TRANSPORT_ROUTES.find((r) => r.cityId === cityId) || null
}
