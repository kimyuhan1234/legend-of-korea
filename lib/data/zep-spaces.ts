export interface ZepSpace {
  id: string
  courseId: string        // courses.region 값과 매칭 ('jeonju', 'busan' 등) 또는 이벤트 식별자
  name: { ko: string; en: string; ja: string }
  description: { ko: string; en: string; ja: string }
  theme: string
  spaceUrl: string        // ZEP 스페이스 URL (관리자가 실제 URL로 교체)
  password: string        // 구매자에게만 노출되는 비밀번호
  backgroundEmoji: string
  isActive: boolean
}

export const zepSpaces: ZepSpace[] = [
  {
    id: "zep-jeonju",
    courseId: "jeonju",
    name: { ko: "전주 도깨비 라운지", en: "Jeonju Dokkaebi Lounge", ja: "全州トッケビラウンジ" },
    description: {
      ko: "전주 도깨비 코스 모험가들의 가상 모임 공간입니다. 여행 전에 파티원을 만나보세요!",
      en: "Virtual meeting space for Jeonju Dokkaebi adventurers. Meet your party before the trip!",
      ja: "全州トッケビコースの冒険者たちのバーチャル集合場所。旅行前にパーティーメンバーに会おう！",
    },
    theme: "hanok-village",
    spaceUrl: "https://zep.us/play/YOUR_SPACE_ID_HERE",
    password: "dokkaebi2026",
    backgroundEmoji: "👹",
    isActive: true,
  },
  {
    id: "zep-gyeongju",
    courseId: "gyeongju",
    name: { ko: "경주 신라 회의실", en: "Gyeongju Silla Chamber", ja: "慶州新羅会議室" },
    description: {
      ko: "경주 만파식적 코스 모험가들의 가상 모임 공간입니다.",
      en: "Virtual meeting space for Gyeongju Manpasikjeok adventurers.",
      ja: "慶州万波息笛コースの冒険者たちのバーチャル集合場所。",
    },
    theme: "silla-palace",
    spaceUrl: "https://zep.us/play/YOUR_SPACE_ID_HERE",
    password: "silla2026",
    backgroundEmoji: "👑",
    isActive: true,
  },
  {
    id: "zep-busan",
    courseId: "busan",
    name: { ko: "부산 인어 항구", en: "Busan Mermaid Harbor", ja: "釜山人魚の港" },
    description: {
      ko: "부산 인어 전설 코스 모험가들의 가상 모임 공간입니다.",
      en: "Virtual meeting space for Busan Mermaid Legend adventurers.",
      ja: "釜山人魚伝説コースの冒険者たちのバーチャル集合場所。",
    },
    theme: "harbor",
    spaceUrl: "https://zep.us/play/YOUR_SPACE_ID_HERE",
    password: "mermaid2026",
    backgroundEmoji: "🧜‍♀️",
    isActive: true,
  },
  {
    id: "zep-seoul-gyeongdo",
    courseId: "gyeongdo-seoul",
    name: { ko: "서울 경도 작전실", en: "Seoul Cops & Robbers HQ", ja: "ソウルケイドロ作戦室" },
    description: {
      ko: "서울 경도 이벤트 참여자들의 사전 작전 회의 공간입니다.",
      en: "Pre-game strategy room for Seoul Cops & Robbers participants.",
      ja: "ソウルケイドロイベント参加者の事前作戦会議スペース。",
    },
    theme: "urban-park",
    spaceUrl: "https://zep.us/play/YOUR_SPACE_ID_HERE",
    password: "gyeongdo2026",
    backgroundEmoji: "🚔",
    isActive: true,
  },
]

/** courses.region 또는 이벤트 식별자로 ZEP 스페이스 조회 */
export function getZepSpaceByCourseId(courseId: string): ZepSpace | undefined {
  return zepSpaces.find((s) => s.courseId === courseId && s.isActive)
}
