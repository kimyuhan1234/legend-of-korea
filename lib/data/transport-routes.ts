// ─────────────────────────────────────────────
//  lib/data/transport-routes.ts
//  서울 → 9개 도시 교통 (KTX / 고속버스 / 항공)
//
//  ⚠️ 택시는 금액이 정찰제가 아니므로 절대 금액 표시 안 함.
//  minutes(분) 만 저장. 렌더 시 "대략" 접두어는 컴포넌트에서 처리.
// ─────────────────────────────────────────────

export type TransportType = 'ktx' | 'bus' | 'flight'

export interface TransportOption {
  type: TransportType
  available: boolean
  station: { ko: string; ja: string; en: string }
  duration: string              // e.g. "1.5~2h" — 렌더 시 "대략" 접두어
  fixedPrice?: string           // 정찰제 요금만 (KTX/버스/항공). 택시는 절대 없음.
  bookingUrl: string
}

export interface LastMile {
  // 택시: 금액 없이 minutes만
  taxi: {
    minutes: number
    koreanAddress: { ko: string; ja: string; en: string }
  }
  bus?: {
    route: { ko: string; ja: string; en: string }
    stop: { ko: string; ja: string; en: string }
    minutes: number
  }
  walk?: {
    minutes: number
    mapUrl?: string
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
        duration: '1.5~2h', fixedPrice: '₩25,000~', bookingUrl: KORAIL,
      },
      {
        type: 'bus', available: true,
        station: { ko: '전주고속터미널', ja: '全州高速ターミナル', en: 'Jeonju Express Bus Terminal' },
        duration: '2.5h', fixedPrice: '₩13,000~', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        minutes: 8,
        koreanAddress: {
          ko: '전주한옥마을로 이동해주세요',
          ja: '全州韓屋村までお願いします',
          en: 'To Jeonju Hanok Village, please',
        },
      },
      bus: {
        route: { ko: '시내버스 119, 536', ja: '市内バス 119, 536', en: 'City bus 119, 536' },
        stop: { ko: '한옥마을 정류장', ja: '韓屋村バス停', en: 'Hanok Village stop' },
        minutes: 18,
      },
    },
  },
  {
    cityId: 'busan',
    options: [
      {
        type: 'ktx', available: true,
        station: { ko: '부산역', ja: '釜山駅', en: 'Busan Station' },
        duration: '2.5~3h', fixedPrice: '₩59,000~', bookingUrl: KORAIL,
      },
      {
        type: 'bus', available: true,
        station: { ko: '부산종합터미널', ja: '釜山総合ターミナル', en: 'Busan Central Bus Terminal' },
        duration: '4~5h', fixedPrice: '₩23,000~', bookingUrl: KOBUS,
      },
      {
        type: 'flight', available: true,
        station: { ko: '김해국제공항', ja: '金海国際空港', en: "Gimhae Int'l Airport" },
        duration: '1h', fixedPrice: '₩40,000~', bookingUrl: SKYSCANNER,
      },
    ],
    lastMile: {
      taxi: {
        minutes: 15,
        koreanAddress: {
          ko: '해운대로 이동해주세요',
          ja: '海雲台までお願いします',
          en: 'To Haeundae, please',
        },
      },
      bus: {
        route: { ko: '지하철 1호선 → 2호선', ja: '地下鉄1号線→2号線', en: 'Subway Line 1 → Line 2' },
        stop: { ko: '해운대역', ja: '海雲台駅', en: 'Haeundae Station' },
        minutes: 40,
      },
    },
  },
  {
    cityId: 'jeju',
    options: [
      {
        type: 'flight', available: true,
        station: { ko: '제주국제공항', ja: '済州国際空港', en: "Jeju Int'l Airport" },
        duration: '1h', fixedPrice: '₩50,000~', bookingUrl: SKYSCANNER,
      },
    ],
    lastMile: {
      taxi: {
        minutes: 20,
        koreanAddress: {
          ko: '제주시 연동으로 이동해주세요',
          ja: '済州市蓮洞までお願いします',
          en: 'To Yeon-dong, Jeju City, please',
        },
      },
      bus: {
        route: { ko: '공항리무진 600번', ja: '空港リムジン600番', en: 'Airport Limousine 600' },
        stop: { ko: '주요 호텔', ja: '主要ホテル', en: 'Major hotels' },
        minutes: 40,
      },
    },
  },
  {
    cityId: 'gyeongju',
    options: [
      {
        type: 'ktx', available: true,
        station: { ko: '신경주역', ja: '新慶州駅', en: 'Singyeongju Station' },
        duration: '2~2.5h', fixedPrice: '₩45,000~', bookingUrl: KORAIL,
      },
      {
        type: 'bus', available: true,
        station: { ko: '경주고속터미널', ja: '慶州高速ターミナル', en: 'Gyeongju Express Bus Terminal' },
        duration: '3.5~4h', fixedPrice: '₩22,000~', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        minutes: 12,
        koreanAddress: {
          ko: '경주 한옥마을로 이동해주세요',
          ja: '慶州韓屋村までお願いします',
          en: 'To Gyeongju Hanok Village, please',
        },
      },
      bus: {
        route: { ko: '시내버스 700', ja: '市内バス700', en: 'City bus 700' },
        stop: { ko: '첨성대', ja: '瞻星台', en: 'Cheomseongdae' },
        minutes: 20,
      },
    },
  },
  {
    cityId: 'tongyeong',
    options: [
      {
        type: 'bus', available: true,
        station: { ko: '통영고속터미널', ja: '統営高速ターミナル', en: 'Tongyeong Express Bus Terminal' },
        duration: '4~4.5h', fixedPrice: '₩25,000~', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        minutes: 10,
        koreanAddress: {
          ko: '통영 케이블카 승차장으로 이동해주세요',
          ja: '統営ケーブルカー乗り場までお願いします',
          en: 'To Tongyeong Cable Car station, please',
        },
      },
      bus: {
        route: { ko: '시내버스 101', ja: '市内バス101', en: 'City bus 101' },
        stop: { ko: '강구안', ja: 'カンクアン', en: 'Ganggu-an' },
        minutes: 15,
      },
    },
  },
  {
    cityId: 'cheonan',
    options: [
      {
        type: 'ktx', available: true,
        station: { ko: '천안아산역', ja: '天安牙山駅', en: 'Cheonan-Asan Station' },
        duration: '0.5~1h', fixedPrice: '₩11,000~', bookingUrl: KORAIL,
      },
      {
        type: 'bus', available: true,
        station: { ko: '천안고속터미널', ja: '天安高速ターミナル', en: 'Cheonan Express Bus Terminal' },
        duration: '1.5h', fixedPrice: '₩6,000~', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        minutes: 10,
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
        duration: '1~1.5h', fixedPrice: '₩5,000~', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        minutes: 15,
        koreanAddress: {
          ko: '한국민속촌으로 이동해주세요',
          ja: '韓国民俗村までお願いします',
          en: 'To Korean Folk Village, please',
        },
      },
      bus: {
        route: { ko: '시내버스 37', ja: '市内バス37', en: 'City bus 37' },
        stop: { ko: '민속촌 정류장', ja: '民俗村バス停', en: 'Folk Village stop' },
        minutes: 25,
      },
    },
  },
  {
    cityId: 'icheon',
    options: [
      {
        type: 'bus', available: true,
        station: { ko: '이천종합버스터미널', ja: '利川総合バスターミナル', en: 'Icheon Bus Terminal' },
        duration: '1~1.5h', fixedPrice: '₩6,000~', bookingUrl: KOBUS,
      },
    ],
    lastMile: {
      taxi: {
        minutes: 12,
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
        minutes: 0,
        koreanAddress: {
          ko: '이미 서울에 계시다면 지하철을 이용하세요',
          ja: '既にソウルにいる場合は地下鉄をご利用ください',
          en: 'If already in Seoul, use the subway',
        },
      },
    },
  },
  // ── 신규 광역시 (7개) ─────────────────────────
  {
    cityId: 'incheon',
    options: [
      { type: 'bus', available: true,
        station: { ko: '인천역 / 부평역', ja: '仁川駅／富平駅', en: 'Incheon / Bupyeong Station' },
        duration: '1~1.5h', fixedPrice: '₩1,450~', bookingUrl: '' },
    ],
    lastMile: {
      taxi: { minutes: 10, koreanAddress: { ko: '인천 시내로 가주세요', ja: '仁川市内までお願いします', en: 'To Incheon downtown, please' } },
    },
  },
  {
    cityId: 'daejeon',
    options: [
      { type: 'ktx', available: true,
        station: { ko: '대전역', ja: '大田駅', en: 'Daejeon Station' },
        duration: '50m~1h', fixedPrice: '₩23,700~', bookingUrl: KORAIL },
      { type: 'bus', available: true,
        station: { ko: '대전복합터미널', ja: '大田総合ターミナル', en: 'Daejeon Terminal' },
        duration: '2h', fixedPrice: '₩11,400~', bookingUrl: KOBUS },
    ],
    lastMile: {
      taxi: { minutes: 10, koreanAddress: { ko: '대전역/둔산동으로 가주세요', ja: '大田駅または屯山洞までお願いします', en: 'To Daejeon Station / Dunsan-dong, please' } },
    },
  },
  {
    cityId: 'daegu',
    options: [
      { type: 'ktx', available: true,
        station: { ko: '동대구역', ja: '東大邱駅', en: 'Dongdaegu Station' },
        duration: '1h 40m', fixedPrice: '₩43,500~', bookingUrl: KORAIL },
      { type: 'bus', available: true,
        station: { ko: '동대구복합환승센터', ja: '東大邱総合乗換センター', en: 'Dongdaegu Terminal' },
        duration: '3h 30m', fixedPrice: '₩22,500~', bookingUrl: KOBUS },
    ],
    lastMile: {
      taxi: { minutes: 12, koreanAddress: { ko: '동성로/수성못으로 가주세요', ja: '東城路または寿城池までお願いします', en: 'To Dongseong-ro / Suseong Lake, please' } },
    },
  },
  {
    cityId: 'gwangju',
    options: [
      { type: 'ktx', available: true,
        station: { ko: '광주송정역', ja: '光州松汀駅', en: 'Gwangju Songjeong Station' },
        duration: '1h 40m', fixedPrice: '₩46,800~', bookingUrl: KORAIL },
      { type: 'bus', available: true,
        station: { ko: '광주종합버스터미널 (유스퀘어)', ja: '光州総合ターミナル', en: 'Gwangju U-Square Terminal' },
        duration: '3h 30m', fixedPrice: '₩21,700~', bookingUrl: KOBUS },
      { type: 'flight', available: true,
        station: { ko: '광주공항', ja: '光州空港', en: 'Gwangju Airport' },
        duration: '1h', fixedPrice: '₩50,000~', bookingUrl: SKYSCANNER },
    ],
    lastMile: {
      taxi: { minutes: 15, koreanAddress: { ko: '광주 상무지구/충장로로 가주세요', ja: '尚武地区または忠壯路までお願いします', en: 'To Sangmu / Chungjang-ro, please' } },
    },
  },
  {
    cityId: 'ulsan',
    options: [
      { type: 'ktx', available: true,
        station: { ko: '울산역(통도사)', ja: '蔚山駅（通度寺）', en: 'Ulsan (Tongdosa) Station' },
        duration: '2h 15m', fixedPrice: '₩53,500~', bookingUrl: KORAIL },
      { type: 'bus', available: true,
        station: { ko: '울산고속버스터미널', ja: '蔚山高速バスターミナル', en: 'Ulsan Bus Terminal' },
        duration: '4h 30m', fixedPrice: '₩27,900~', bookingUrl: KOBUS },
      { type: 'flight', available: true,
        station: { ko: '울산공항', ja: '蔚山空港', en: 'Ulsan Airport' },
        duration: '1h', fixedPrice: '₩60,000~', bookingUrl: SKYSCANNER },
    ],
    lastMile: {
      taxi: { minutes: 20, koreanAddress: { ko: '태화강/해운대 방면으로 가주세요', ja: '太和江または海雲台までお願いします', en: 'To Taehwa River / Haeundae, please' } },
    },
  },
  {
    cityId: 'sejong',
    options: [
      { type: 'ktx', available: true,
        station: { ko: '오송역 → 세종 셔틀', ja: '五松駅→世宗シャトル', en: 'Osong Station + shuttle' },
        duration: '1h 30m', fixedPrice: '₩18,000~', bookingUrl: KORAIL },
      { type: 'bus', available: true,
        station: { ko: '세종고속시외버스터미널', ja: '世宗ターミナル', en: 'Sejong Terminal' },
        duration: '1h 40m', fixedPrice: '₩13,000~', bookingUrl: KOBUS },
    ],
    lastMile: {
      taxi: { minutes: 10, koreanAddress: { ko: '정부세종청사/호수공원으로 가주세요', ja: '政府世宗庁舎または湖水公園までお願いします', en: 'To Government Complex / Lake Park, please' } },
    },
  },
  // ── 신규 주요 도시 (6개) ───────────────────────
  {
    cityId: 'suwon',
    options: [
      { type: 'ktx', available: true,
        station: { ko: '수원역', ja: '水原駅', en: 'Suwon Station' },
        duration: '26m', fixedPrice: '₩8,400~', bookingUrl: KORAIL },
      { type: 'bus', available: true,
        station: { ko: '수원역 (지하철 1호선)', ja: '水原駅（地下鉄1号線）', en: 'Suwon Station (Line 1)' },
        duration: '50m~1h', fixedPrice: '₩1,450~', bookingUrl: '' },
    ],
    lastMile: {
      taxi: { minutes: 8, koreanAddress: { ko: '수원 화성/행궁동으로 가주세요', ja: '水原華城または行宮洞までお願いします', en: 'To Hwaseong / Haenggung-dong, please' } },
    },
  },
  {
    cityId: 'gangneung',
    options: [
      { type: 'ktx', available: true,
        station: { ko: '강릉역 (KTX 강릉선)', ja: '江陵駅（KTX江陵線）', en: 'Gangneung Station (KTX)' },
        duration: '2h', fixedPrice: '₩27,600~', bookingUrl: KORAIL },
      { type: 'bus', available: true,
        station: { ko: '강릉고속버스터미널', ja: '江陵高速バスターミナル', en: 'Gangneung Bus Terminal' },
        duration: '3h 30m', fixedPrice: '₩16,800~', bookingUrl: KOBUS },
    ],
    lastMile: {
      taxi: { minutes: 10, koreanAddress: { ko: '경포해변/안목카페거리로 가주세요', ja: '鏡浦海辺または安木カフェ通りまでお願いします', en: 'To Gyeongpo Beach / Anmok Cafe Street, please' } },
    },
  },
  {
    cityId: 'chuncheon',
    options: [
      { type: 'ktx', available: true,
        station: { ko: '춘천역 (ITX-청춘)', ja: '春川駅（ITX青春）', en: 'Chuncheon Station (ITX-Cheongchun)' },
        duration: '1h 20m', fixedPrice: '₩9,800~', bookingUrl: KORAIL },
      { type: 'bus', available: true,
        station: { ko: '춘천고속버스터미널', ja: '春川高速バスターミナル', en: 'Chuncheon Bus Terminal' },
        duration: '1h 30m', fixedPrice: '₩8,100~', bookingUrl: KOBUS },
    ],
    lastMile: {
      taxi: { minutes: 8, koreanAddress: { ko: '명동 닭갈비골목/남이섬 선착장으로 가주세요', ja: '明洞タッカルビ横丁または南怡島船着場までお願いします', en: 'To Myeongdong dakgalbi / Nami Island dock, please' } },
    },
  },
  {
    cityId: 'yeosu',
    options: [
      { type: 'ktx', available: true,
        station: { ko: '여수엑스포역', ja: '麗水エキスポ駅', en: 'Yeosu Expo Station' },
        duration: '3h 10m', fixedPrice: '₩47,200~', bookingUrl: KORAIL },
      { type: 'bus', available: true,
        station: { ko: '여수종합버스터미널', ja: '麗水総合バスターミナル', en: 'Yeosu Bus Terminal' },
        duration: '4h 30m', fixedPrice: '₩30,600~', bookingUrl: KOBUS },
      { type: 'flight', available: true,
        station: { ko: '여수공항', ja: '麗水空港', en: 'Yeosu Airport' },
        duration: '1h', fixedPrice: '₩70,000~', bookingUrl: SKYSCANNER },
    ],
    lastMile: {
      taxi: { minutes: 15, koreanAddress: { ko: '돌산공원/오동도로 가주세요', ja: '突山公園または梧桐島までお願いします', en: 'To Dolsan Park / Odongdo, please' } },
    },
  },
  {
    cityId: 'andong',
    options: [
      { type: 'ktx', available: true,
        station: { ko: '안동역 (KTX-이음)', ja: '安東駅（KTX-イウム）', en: 'Andong Station (KTX-Eum)' },
        duration: '2h', fixedPrice: '₩27,500~', bookingUrl: KORAIL },
      { type: 'bus', available: true,
        station: { ko: '안동터미널', ja: '安東ターミナル', en: 'Andong Terminal' },
        duration: '3h', fixedPrice: '₩20,000~', bookingUrl: KOBUS },
    ],
    lastMile: {
      taxi: { minutes: 15, koreanAddress: { ko: '하회마을/찜닭골목으로 가주세요', ja: '河回村または安東チムタク横丁までお願いします', en: 'To Hahoe Village / Jjimdak alley, please' } },
    },
  },
  {
    cityId: 'sokcho',
    options: [
      { type: 'ktx', available: false,
        station: { ko: 'KTX 미연결', ja: 'KTX未接続', en: 'No KTX service' },
        duration: '-', bookingUrl: '' },
      { type: 'bus', available: true,
        station: { ko: '속초시외버스터미널', ja: '束草市外バスターミナル', en: 'Sokcho Intercity Terminal' },
        duration: '2h 30m', fixedPrice: '₩18,500~', bookingUrl: KOBUS },
    ],
    lastMile: {
      taxi: { minutes: 10, koreanAddress: { ko: '속초중앙시장/설악산 입구로 가주세요', ja: '束草中央市場または雪岳山入口までお願いします', en: 'To Sokcho Jungang Market / Seoraksan, please' } },
    },
  },
]

export function getRouteByCity(cityId: string): TransportRoute | null {
  return TRANSPORT_ROUTES.find((r) => r.cityId === cityId) || null
}
