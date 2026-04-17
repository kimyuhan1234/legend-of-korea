export interface MissionData {
  id: string;
  seq: number;
  title: { ko: string; ja: string; en: string };
  location: { ko: string; ja: string; en: string };
  lp: number;
  isBoss?: boolean;
}

export interface CourseData {
  id: string;
  name: { ko: string; ja: string; en: string };
  region: { ko: string; ja: string; en: string };
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

/** Difficulty → mission count mapping */
export const DIFFICULTY_MISSION_COUNT: Record<string, number> = {
  easy: 5,
  medium: 8,
  hard: 10,
};

/** Jeonju Dokkaebi Course (Easy — 5 missions) */
export const JEONJU_COURSE: CourseData = {
  id: '11111111-1111-1111-1111-000000000001',
  name: {
    ko: '전주 도깨비 코스',
    ja: '全州トッケビコース',
    en: 'Jeonju Goblin Course',
  },
  region: { ko: '전주', ja: '全州', en: 'Jeonju' },
  emoji: '👹',
  difficulty: 'easy',
};

export const JEONJU_MISSIONS: MissionData[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    seq: 1,
    title: {
      ko: '전주 한옥마을 도깨비 문 찾기',
      ja: '全州韓屋村トッケビの門を探す',
      en: 'Find the Goblin Gate at Jeonju Hanok Village',
    },
    location: {
      ko: '전주 한옥마을 입구',
      ja: '全州韓屋村入口',
      en: 'Jeonju Hanok Village Entrance',
    },
    lp: 100,
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    seq: 2,
    title: {
      ko: '경기전 비밀 도깨비방망이 발견',
      ja: '慶基殿の秘密トッケビ棒を発見',
      en: 'Discover the Secret Goblin Club at Gyeonggijeon',
    },
    location: {
      ko: '경기전',
      ja: '慶基殿',
      en: 'Gyeonggijeon',
    },
    lp: 150,
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    seq: 3,
    title: {
      ko: '전동성당 숨겨진 부적 촬영',
      ja: '殿洞聖堂の隠されたお守りを撮影',
      en: 'Photograph the Hidden Talisman at Jeondong Cathedral',
    },
    location: {
      ko: '전동성당',
      ja: '殿洞聖堂',
      en: 'Jeondong Cathedral',
    },
    lp: 100,
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    seq: 4,
    title: {
      ko: '남부시장 도깨비 먹거리 미션',
      ja: '南部市場トッケビグルメミッション',
      en: 'Goblin Food Mission at Nambu Market',
    },
    location: {
      ko: '남부시장',
      ja: '南部市場',
      en: 'Nambu Market',
    },
    lp: 200,
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    seq: 5,
    title: {
      ko: '오목대 도깨비 보스 최종 미션',
      ja: '梧木台トッケビボス最終ミッション',
      en: 'Final Goblin Boss Mission at Omokdae',
    },
    location: {
      ko: '오목대',
      ja: '梧木台',
      en: 'Omokdae',
    },
    lp: 500,
    isBoss: true,
  },
];

/** Helper: get all courses */
export const ALL_COURSES: CourseData[] = [JEONJU_COURSE];

/** Helper: get missions by course id */
export function getMissionsByCourse(courseId: string): MissionData[] {
  if (courseId === JEONJU_COURSE.id) return JEONJU_MISSIONS;
  return [];
}

/** Helper: get course by id */
export function getCourseById(courseId: string): CourseData | undefined {
  return ALL_COURSES.find((c) => c.id === courseId);
}
