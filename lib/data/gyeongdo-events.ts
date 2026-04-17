// ─────────────────────────────────────────────
//  lib/data/gyeongdo-events.ts
//  경찰과 도둑 스페셜 이벤트 — 서울 한정, 이벤트형 한정 판매
//  초기: 정적 데이터 관리. 추후 관리자 페이지 + DB 연동 가능한 구조.
// ─────────────────────────────────────────────

type I18n = { ko: string; en: string; ja: string; 'zh-CN'?: string; 'zh-TW'?: string; [key: string]: string | undefined }

export interface GyeongdoEvent {
  id: string
  date: string           // "2026-04-20"
  time: string           // "19:00"
  location: I18n
  meetingPoint: I18n
  maxParticipants: number
  currentParticipants: number
  salesDeadline: string  // "2026-04-19"
  status: 'upcoming' | 'sold-out' | 'closed' | 'completed'
  communitySource: string
  communityLink?: string
}

// 키트 상품 정보 (1종류, 서울 한정)
export const GYEONGDO_KIT = {
  id: 'gyeongdo-seoul',
  type: 'special-gyeongdo',
  city: 'seoul',
  price: 15000,
  subscriberPrice: 9900,
  name: {
    ko: '서울 경도 스페셜 키트',
    en: 'Seoul Cops & Robbers Kit',
    ja: 'ソウル ケイドロ スペシャルキット',
    'zh-CN': '首尔警匪大战特别套装',
    'zh-TW': '首爾警匪大戰特別套裝',
  },
  description: {
    ko: '서울에서 가장 핫한 야외 놀이! 키트 하나로 경도 준비 끝.',
    en: "Seoul's hottest outdoor game! One kit, ready to play.",
    ja: 'ソウルで一番ホットなアウトドアゲーム！キット一つで準備完了。',
    'zh-CN': '首尔最火的户外游戏！一套搞定警匪大战。',
    'zh-TW': '首爾最火的戶外遊戲！一套搞定警匪大戰。',
  },
  includes: [
    {
      ko: '경도 완장 2개 (경찰 파란색 + 도둑 빨간색)',
      en: '2 armbands (blue cops + red robbers)',
      ja: '腕章2個（警察青＋泥棒赤）',
    },
    {
      ko: '서울 경도 맵 (추천 구역 + 경계선 + 감옥 위치)',
      en: 'Seoul game map (zones + boundaries + jail)',
      ja: 'ソウルケイドロマップ（推奨エリア＋境界線＋牢屋）',
    },
    {
      ko: '룰북 (한/영/일 3개국어)',
      en: 'Rulebook (KR/EN/JP)',
      ja: 'ルールブック（韓/英/日）',
    },
    {
      ko: '미션 스탬프 카드 (경도 후 주변 맛집/카페 투어)',
      en: 'Stamp card (post-game food tour)',
      ja: 'ミッションスタンプカード（ゲーム後グルメツアー）',
    },
    {
      ko: '인증샷 소품 (포토카드, 스티커)',
      en: 'Photo props (cards & stickers)',
      ja: '撮影小道具（フォトカード・ステッカー）',
    },
    {
      ko: 'LP 포인트 적립 코드',
      en: 'LP point code',
      ja: 'LPポイントコード',
    },
  ],
} as const

// 이벤트 목록 (관리자가 직접 편집)
export const GYEONGDO_EVENTS: GyeongdoEvent[] = [
  {
    id: 'gyeongdo-20260420',
    date: '2026-04-20',
    time: '19:00',
    location: {
      ko: '여의도 한강공원',
      en: 'Yeouido Hangang Park',
      ja: '汝矣島漢江公園',
      'zh-CN': '汝矣岛汉江公园',
      'zh-TW': '汝矣島漢江公園',
    },
    meetingPoint: {
      ko: '여의도역 3번 출구 앞',
      en: 'Yeouido Station Exit 3',
      ja: '汝矣島駅3番出口前',
      'zh-CN': '汝矣岛站3号出口前',
      'zh-TW': '汝矣島站3號出口前',
    },
    maxParticipants: 30,
    currentParticipants: 12,
    salesDeadline: '2026-04-19',
    status: 'upcoming',
    communitySource: '당근 여의도 경도 모임',
  },
  {
    id: 'gyeongdo-20260427',
    date: '2026-04-27',
    time: '18:30',
    location: {
      ko: '성수동 서울숲',
      en: 'Seongsu Seoul Forest',
      ja: '聖水ソウルの森',
      'zh-CN': '圣水洞首尔林',
      'zh-TW': '聖水洞首爾林',
    },
    meetingPoint: {
      ko: '서울숲역 4번 출구 앞',
      en: 'Seoul Forest Station Exit 4',
      ja: 'ソウルの森駅4番出口前',
      'zh-CN': '首尔林站4号出口前',
      'zh-TW': '首爾林站4號出口前',
    },
    maxParticipants: 20,
    currentParticipants: 0,
    salesDeadline: '2026-04-26',
    status: 'upcoming',
    communitySource: '카톡 성수 경도 오픈채팅',
  },
]

// 런타임 상태 자동 판단
export function resolveEventStatus(event: GyeongdoEvent, today: string): GyeongdoEvent['status'] {
  if (today > event.date) return 'completed'
  if (today > event.salesDeadline) return 'closed'
  if (event.currentParticipants >= event.maxParticipants) return 'sold-out'
  return 'upcoming'
}

// 가장 가까운 활성 이벤트 1개 반환
export function getNextActiveEvent(today: string): GyeongdoEvent | null {
  const active = GYEONGDO_EVENTS.filter(
    (e) => resolveEventStatus(e, today) === 'upcoming'
  ).sort((a, b) => a.date.localeCompare(b.date))
  return active[0] ?? null
}
