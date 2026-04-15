/** 도시별 구역 정보 */
export interface ZepZone {
  id: string
  courseId: string            // courses.region ('jeonju', 'busan' 등) 또는 이벤트 식별자 ('gyeongdo-seoul')
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
      id: "tongyeong",
      courseId: "tongyeong",
      name: { ko: "통영 별주부 구역", en: "Tongyeong Byeoljubu Zone", ja: "統営ピョルジュブゾーン" },
      description: {
        ko: "통영 별주부 코스 모험가들의 모임 구역",
        en: "Meeting zone for Tongyeong Byeoljubu adventurers",
        ja: "統営ピョルジュブコースの冒険者集合ゾーン",
      },
      emoji: "🐢",
      areaGuide: {
        ko: "로비에서 왼쪽",
        en: "Left from lobby",
        ja: "ロビーから左",
      },
    },
    {
      id: "cheonan",
      courseId: "cheonan",
      name: { ko: "천안 능소 구역", en: "Cheonan Nungso Zone", ja: "天安ヌンソゾーン" },
      description: {
        ko: "천안 능소의 기다림 코스 모험가들의 모임 구역",
        en: "Meeting zone for Cheonan Nungso adventurers",
        ja: "天安ヌンソコースの冒険者集合ゾーン",
      },
      emoji: "🌸",
      areaGuide: {
        ko: "로비에서 왼쪽 아래",
        en: "Lower left from lobby",
        ja: "ロビーから左下",
      },
    },
    {
      id: "yongin",
      courseId: "yongin",
      name: { ko: "용인 동화 구역", en: "Yongin Fairy Tale Zone", ja: "龍仁童話ゾーン" },
      description: {
        ko: "용인 동화 속으로 코스 모험가들의 모임 구역",
        en: "Meeting zone for Yongin Fairy Tale adventurers",
        ja: "龍仁童話コースの冒険者集合ゾーン",
      },
      emoji: "📖",
      areaGuide: {
        ko: "로비에서 오른쪽",
        en: "Right from lobby",
        ja: "ロビーから右",
      },
    },
    {
      id: "icheon",
      courseId: "icheon",
      name: { ko: "이천 선녀 구역", en: "Icheon Fairy Zone", ja: "利川仙女ゾーン" },
      description: {
        ko: "이천 선녀의 날개옷 코스 모험가들의 모임 구역",
        en: "Meeting zone for Icheon Fairy adventurers",
        ja: "利川仙女コースの冒険者集合ゾーン",
      },
      emoji: "🧚",
      areaGuide: {
        ko: "로비에서 오른쪽 위",
        en: "Upper right from lobby",
        ja: "ロビーから右上",
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
        ko: "로비 위쪽 중앙",
        en: "Upper center from lobby",
        ja: "ロビー上部中央",
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
        ko: "로비에서 아래쪽 왼쪽",
        en: "Lower left from lobby",
        ja: "ロビーから下部左",
      },
    },
    {
      id: "seoul",
      courseId: "seoul",
      name: { ko: "서울 해치 구역", en: "Seoul Haechi Zone", ja: "ソウルヘチゾーン" },
      description: {
        ko: "서울 해치 수호신 코스 모험가들의 모임 구역",
        en: "Meeting zone for Seoul Haechi adventurers",
        ja: "ソウルヘチ守護神コースの冒険者集合ゾーン",
      },
      emoji: "🦁",
      areaGuide: {
        ko: "로비에서 아래쪽 오른쪽",
        en: "Lower right from lobby",
        ja: "ロビーから下部右",
      },
    },
    {
      id: "jeju",
      courseId: "jeju",
      name: { ko: "제주 거인 구역", en: "Jeju Giant Zone", ja: "済州巨人ゾーン" },
      description: {
        ko: "제주 설문대할망 코스 모험가들의 모임 구역",
        en: "Meeting zone for Jeju Giant adventurers",
        ja: "済州ソルムンデハルマンコースの冒険者集合ゾーン",
      },
      emoji: "🌋",
      areaGuide: {
        ko: "로비 아래쪽 중앙",
        en: "Lower center from lobby",
        ja: "ロビー下部中央",
      },
    },
    {
      id: "gyeongdo-seoul",
      courseId: "gyeongdo-seoul",
      name: { ko: "서울 경도 작전실", en: "Seoul Cops & Robbers HQ", ja: "ソウルケイドロ作戦室" },
      description: {
        ko: "서울 경도 이벤트 사전 작전 회의 구역",
        en: "Pre-game strategy zone for Seoul Cops & Robbers",
        ja: "ソウルケイドロ事前作戦会議ゾーン",
      },
      emoji: "🚔",
      areaGuide: {
        ko: "서울 해치 구역 옆",
        en: "Next to Seoul Haechi Zone",
        ja: "ソウルヘチゾーンの隣",
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
