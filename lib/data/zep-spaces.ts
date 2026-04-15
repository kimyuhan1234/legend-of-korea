/** 도시별 구역 정보 */
export interface ZepZone {
  id: string
  courseId: string            // courses.region 또는 이벤트 식별자 ('jeonju', 'gyeongdo-seoul' 등)
  name: { ko: string; en: string; ja: string }
  description: { ko: string; en: string; ja: string }
  emoji: string
  areaGuide: { ko: string; en: string; ja: string } // 스페이스 내 위치 안내
}

/** 통합 ZEP 스페이스 (1개) */
export interface ZepSpace {
  spaceUrl: string            // ZEP 스페이스 URL (관리자가 실제 URL로 교체)
  password: string            // 통합 비밀번호 (구매자에게만 노출)
  isActive: boolean
  zones: ZepZone[]
}

export const zepSpace: ZepSpace = {
  spaceUrl: "https://zep.us/play/YOUR_SPACE_ID_HERE",
  password: "legendofkorea2026",
  isActive: true,
  zones: [
    {
      id: "lobby",
      courseId: "",
      name: { ko: "로비", en: "Lobby", ja: "ロビー" },
      description: {
        ko: "Legend of Korea에 오신 것을 환영합니다!",
        en: "Welcome to Legend of Korea!",
        ja: "Legend of Koreaへようこそ！",
      },
      emoji: "🏠",
      areaGuide: {
        ko: "입장 후 정면",
        en: "Straight ahead from entrance",
        ja: "入場後正面",
      },
    },
    {
      id: "jeonju",
      courseId: "jeonju",
      name: { ko: "전주 도깨비 구역", en: "Jeonju Dokkaebi Zone", ja: "全州トッケビゾーン" },
      description: {
        ko: "전주 도깨비 코스 모험가들의 모임 구역",
        en: "Meeting zone for Jeonju Dokkaebi adventurers",
        ja: "全州トッケビコースの冒険者集合ゾーン",
      },
      emoji: "👹",
      areaGuide: {
        ko: "로비에서 왼쪽 위",
        en: "Upper left from lobby",
        ja: "ロビーから左上",
      },
    },
    {
      id: "gyeongju",
      courseId: "gyeongju",
      name: { ko: "경주 신라 구역", en: "Gyeongju Silla Zone", ja: "慶州新羅ゾーン" },
      description: {
        ko: "경주 만파식적 코스 모험가들의 모임 구역",
        en: "Meeting zone for Gyeongju adventurers",
        ja: "慶州万波息笛コースの冒険者集合ゾーン",
      },
      emoji: "👑",
      areaGuide: {
        ko: "로비에서 오른쪽 위",
        en: "Upper right from lobby",
        ja: "ロビーから右上",
      },
    },
    {
      id: "busan",
      courseId: "busan",
      name: { ko: "부산 인어 구역", en: "Busan Mermaid Zone", ja: "釜山人魚ゾーン" },
      description: {
        ko: "부산 인어 전설 코스 모험가들의 모임 구역",
        en: "Meeting zone for Busan Mermaid adventurers",
        ja: "釜山人魚伝説コースの冒険者集合ゾーン",
      },
      emoji: "🧜‍♀️",
      areaGuide: {
        ko: "로비에서 왼쪽 아래",
        en: "Lower left from lobby",
        ja: "ロビーから左下",
      },
    },
    {
      id: "seoul-gyeongdo",
      courseId: "gyeongdo-seoul",
      name: { ko: "서울 경도 작전실", en: "Seoul Cops & Robbers HQ", ja: "ソウルケイドロ作戦室" },
      description: {
        ko: "서울 경도 이벤트 사전 작전 회의 구역",
        en: "Pre-game strategy zone for Seoul Cops & Robbers",
        ja: "ソウルケイドロ事前作戦会議ゾーン",
      },
      emoji: "🚔",
      areaGuide: {
        ko: "로비에서 오른쪽 아래",
        en: "Lower right from lobby",
        ja: "ロビーから右下",
      },
    },
    {
      id: "lounge",
      courseId: "",
      name: { ko: "자유 라운지", en: "Free Lounge", ja: "フリーラウンジ" },
      description: {
        ko: "도시 상관없이 자유롭게 교류하는 공간",
        en: "Open space to mingle with all adventurers",
        ja: "都市に関係なく自由に交流するスペース",
      },
      emoji: "☕",
      areaGuide: {
        ko: "로비 중앙",
        en: "Center of lobby",
        ja: "ロビー中央",
      },
    },
  ],
}

/** courses.region 또는 이벤트 식별자로 구역 조회 */
export function getZepZoneByCourseId(courseId: string): ZepZone | undefined {
  if (!courseId) return undefined
  return zepSpace.zones.find((z) => z.courseId === courseId)
}
