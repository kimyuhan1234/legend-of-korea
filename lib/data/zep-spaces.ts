type ZepI18n = { ko: string; en: string; ja: string; 'zh-CN'?: string; 'zh-TW'?: string }

/** 도시별 구역 정보 */
export interface ZepZone {
  id: string
  courseId: string            // courses.region ('jeonju', 'busan' 등) 또는 이벤트 식별자 ('gyeongdo-seoul')
  name: ZepI18n
  description: ZepI18n
  emoji: string
  areaGuide: ZepI18n // 스페이스 내 위치 안내
}

/**
 * 통합 ZEP 스페이스 (1개).
 *
 * 비밀번호는 서버 전용 환경변수 `ZEP_SPACE_PASSWORD` 로 분리 (보안 격상 2026-05).
 * 클라이언트 번들 노출 차단 — 활성 패스 보유자만 `/api/zep/access` 통해 발급.
 */
export interface ZepSpace {
  spaceUrl: string            // ZEP 스페이스 URL (관리자가 실제 URL로 교체)
  isActive: boolean
  zones: ZepZone[]
}

export const zepSpace: ZepSpace = {
  spaceUrl: "https://zep.us/play/Bjg9lo",
  isActive: true,
  zones: [
    {
      id: "lobby",
      courseId: "",
      name: { ko: "로비", en: "Lobby", ja: "ロビー", 'zh-CN': "大厅", 'zh-TW': "大廳" },
      description: {
        ko: "Clouds with you에 오신 것을 환영합니다!",
        en: "Welcome to Clouds with you!",
        ja: "Clouds with youへようこそ！",
        'zh-CN': "欢迎来到韩国传说！",
        'zh-TW': "歡迎來到韓國傳說！",
      },
      emoji: "🏠",
      areaGuide: {
        ko: "입장 후 정면",
        en: "Straight ahead from entrance",
        ja: "入場後正面",
        'zh-CN': "入场后正前方",
        'zh-TW': "入場後正前方",
      },
    },
    {
      id: "jeonju",
      courseId: "jeonju",
      name: { ko: "전주 도깨비 구역", en: "Jeonju Dokkaebi Zone", ja: "全州トッケビゾーン", 'zh-CN': "全州鬼怪区", 'zh-TW': "全州鬼怪區" },
      description: {
        ko: "전주 도깨비 코스 모험가들의 모임 구역",
        en: "Meeting zone for Jeonju Dokkaebi adventurers",
        ja: "全州トッケビコースの冒険者集合ゾーン",
        'zh-CN': "全州鬼怪课程冒险者集合区",
        'zh-TW': "全州鬼怪課程冒險者集合區",
      },
      emoji: "👹",
      areaGuide: {
        ko: "로비에서 왼쪽 위",
        en: "Upper left from lobby",
        ja: "ロビーから左上",
        'zh-CN': "大厅左上方",
        'zh-TW': "大廳左上方",
      },
    },
    {
      id: "tongyeong",
      courseId: "tongyeong",
      name: { ko: "통영 별주부 구역", en: "Tongyeong Byeoljubu Zone", ja: "統営ピョルジュブゾーン", 'zh-CN': "统营鳖使者区", 'zh-TW': "統營鱉使者區" },
      description: {
        ko: "통영 별주부 코스 모험가들의 모임 구역",
        en: "Meeting zone for Tongyeong Byeoljubu adventurers",
        ja: "統営ピョルジュブコースの冒険者集合ゾーン",
        'zh-CN': "统营鳖使者课程冒险者集合区",
        'zh-TW': "統營鱉使者課程冒險者集合區",
      },
      emoji: "🐢",
      areaGuide: {
        ko: "로비에서 왼쪽",
        en: "Left from lobby",
        ja: "ロビーから左",
        'zh-CN': "大厅左侧",
        'zh-TW': "大廳左側",
      },
    },
    {
      id: "cheonan",
      courseId: "cheonan",
      name: { ko: "천안 능소 구역", en: "Cheonan Nungso Zone", ja: "天安ヌンソゾーン", 'zh-CN': "天安凌霄区", 'zh-TW': "天安凌霄區" },
      description: {
        ko: "천안 능소의 기다림 코스 모험가들의 모임 구역",
        en: "Meeting zone for Cheonan Nungso adventurers",
        ja: "天安ヌンソコースの冒険者集合ゾーン",
        'zh-CN': "天安凌霄等待课程冒险者集合区",
        'zh-TW': "天安凌霄等待課程冒險者集合區",
      },
      emoji: "🌸",
      areaGuide: {
        ko: "로비에서 왼쪽 아래",
        en: "Lower left from lobby",
        ja: "ロビーから左下",
        'zh-CN': "大厅左下方",
        'zh-TW': "大廳左下方",
      },
    },
    {
      id: "yongin",
      courseId: "yongin",
      name: { ko: "용인 동화 구역", en: "Yongin Fairy Tale Zone", ja: "龍仁童話ゾーン", 'zh-CN': "龙仁童话区", 'zh-TW': "龍仁童話區" },
      description: {
        ko: "용인 동화 속으로 코스 모험가들의 모임 구역",
        en: "Meeting zone for Yongin Fairy Tale adventurers",
        ja: "龍仁童話コースの冒険者集合ゾーン",
        'zh-CN': "龙仁走进童话课程冒险者集合区",
        'zh-TW': "龍仁走進童話課程冒險者集合區",
      },
      emoji: "📖",
      areaGuide: {
        ko: "로비에서 오른쪽",
        en: "Right from lobby",
        ja: "ロビーから右",
        'zh-CN': "大厅右侧",
        'zh-TW': "大廳右側",
      },
    },
    {
      id: "icheon",
      courseId: "icheon",
      name: { ko: "이천 선녀 구역", en: "Icheon Fairy Zone", ja: "利川仙女ゾーン", 'zh-CN': "利川仙女区", 'zh-TW': "利川仙女區" },
      description: {
        ko: "이천 선녀의 날개옷 코스 모험가들의 모임 구역",
        en: "Meeting zone for Icheon Fairy adventurers",
        ja: "利川仙女コースの冒険者集合ゾーン",
        'zh-CN': "利川仙女羽衣课程冒险者集合区",
        'zh-TW': "利川仙女羽衣課程冒險者集合區",
      },
      emoji: "🧚",
      areaGuide: {
        ko: "로비에서 오른쪽 위",
        en: "Upper right from lobby",
        ja: "ロビーから右上",
        'zh-CN': "大厅右上方",
        'zh-TW': "大廳右上方",
      },
    },
    {
      id: "gyeongju",
      courseId: "gyeongju",
      name: { ko: "경주 신라 구역", en: "Gyeongju Silla Zone", ja: "慶州新羅ゾーン", 'zh-CN': "庆州新罗区", 'zh-TW': "慶州新羅區" },
      description: {
        ko: "경주 만파식적 코스 모험가들의 모임 구역",
        en: "Meeting zone for Gyeongju adventurers",
        ja: "慶州万波息笛コースの冒険者集合ゾーン",
        'zh-CN': "庆州万波息笛课程冒险者集合区",
        'zh-TW': "慶州萬波息笛課程冒險者集合區",
      },
      emoji: "👑",
      areaGuide: {
        ko: "로비 위쪽 중앙",
        en: "Upper center from lobby",
        ja: "ロビー上部中央",
        'zh-CN': "大厅上方中央",
        'zh-TW': "大廳上方中央",
      },
    },
    {
      id: "busan",
      courseId: "busan",
      name: { ko: "부산 인어 구역", en: "Busan Mermaid Zone", ja: "釜山人魚ゾーン", 'zh-CN': "釜山美人鱼区", 'zh-TW': "釜山美人魚區" },
      description: {
        ko: "부산 인어 전설 코스 모험가들의 모임 구역",
        en: "Meeting zone for Busan Mermaid adventurers",
        ja: "釜山人魚伝説コースの冒険者集合ゾーン",
        'zh-CN': "釜山美人鱼传说课程冒险者集合区",
        'zh-TW': "釜山美人魚傳說課程冒險者集合區",
      },
      emoji: "🧜‍♀️",
      areaGuide: {
        ko: "로비에서 아래쪽 왼쪽",
        en: "Lower left from lobby",
        ja: "ロビーから下部左",
        'zh-CN': "大厅下方左侧",
        'zh-TW': "大廳下方左側",
      },
    },
    {
      id: "seoul",
      courseId: "seoul",
      name: { ko: "서울 해치 구역", en: "Seoul Haechi Zone", ja: "ソウルヘチゾーン", 'zh-CN': "首尔獬豸区", 'zh-TW': "首爾獬豸區" },
      description: {
        ko: "서울 해치 수호신 코스 모험가들의 모임 구역",
        en: "Meeting zone for Seoul Haechi adventurers",
        ja: "ソウルヘチ守護神コースの冒険者集合ゾーン",
        'zh-CN': "首尔獬豸守护神课程冒险者集合区",
        'zh-TW': "首爾獬豸守護神課程冒險者集合區",
      },
      emoji: "🦁",
      areaGuide: {
        ko: "로비에서 아래쪽 오른쪽",
        en: "Lower right from lobby",
        ja: "ロビーから下部右",
        'zh-CN': "大厅下方右侧",
        'zh-TW': "大廳下方右側",
      },
    },
    {
      id: "jeju",
      courseId: "jeju",
      name: { ko: "제주 거인 구역", en: "Jeju Giant Zone", ja: "済州巨人ゾーン", 'zh-CN': "济州巨人区", 'zh-TW': "濟州巨人區" },
      description: {
        ko: "제주 설문대할망 코스 모험가들의 모임 구역",
        en: "Meeting zone for Jeju Giant adventurers",
        ja: "済州ソルムンデハルマンコースの冒険者集合ゾーン",
        'zh-CN': "济州雪门大婆课程冒险者集合区",
        'zh-TW': "濟州雪門大婆課程冒險者集合區",
      },
      emoji: "🌋",
      areaGuide: {
        ko: "로비 아래쪽 중앙",
        en: "Lower center from lobby",
        ja: "ロビー下部中央",
        'zh-CN': "大厅下方中央",
        'zh-TW': "大廳下方中央",
      },
    },
    {
      id: "gyeongdo-seoul",
      courseId: "gyeongdo-seoul",
      name: { ko: "서울 경도 작전실", en: "Seoul Cops & Robbers HQ", ja: "ソウルケイドロ作戦室", 'zh-CN': "首尔警察抓小偷作战室", 'zh-TW': "首爾警察抓小偷作戰室" },
      description: {
        ko: "서울 경도 이벤트 사전 작전 회의 구역",
        en: "Pre-game strategy zone for Seoul Cops & Robbers",
        ja: "ソウルケイドロ事前作戦会議ゾーン",
        'zh-CN': "首尔警察抓小偷活动赛前策略区",
        'zh-TW': "首爾警察抓小偷活動賽前策略區",
      },
      emoji: "🚔",
      areaGuide: {
        ko: "서울 해치 구역 옆",
        en: "Next to Seoul Haechi Zone",
        ja: "ソウルヘチゾーンの隣",
        'zh-CN': "首尔獬豸区旁边",
        'zh-TW': "首爾獬豸區旁邊",
      },
    },
    {
      id: "lounge",
      courseId: "",
      name: { ko: "자유 라운지", en: "Free Lounge", ja: "フリーラウンジ", 'zh-CN': "自由休息区", 'zh-TW': "自由休息區" },
      description: {
        ko: "도시 상관없이 자유롭게 교류하는 공간",
        en: "Open space to mingle with all adventurers",
        ja: "都市に関係なく自由に交流するスペース",
        'zh-CN': "不限城市，与所有冒险者自由交流的空间",
        'zh-TW': "不限城市，與所有冒險者自由交流的空間",
      },
      emoji: "☕",
      areaGuide: {
        ko: "로비 중앙",
        en: "Center of lobby",
        ja: "ロビー中央",
        'zh-CN': "大厅中央",
        'zh-TW': "大廳中央",
      },
    },
  ],
}

/** courses.region 또는 이벤트 식별자로 구역 조회 */
export function getZepZoneByCourseId(courseId: string): ZepZone | undefined {
  if (!courseId) return undefined
  return zepSpace.zones.find((z) => z.courseId === courseId)
}
