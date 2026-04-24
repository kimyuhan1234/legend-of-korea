export interface MissionData {
  id: string;
  seq: number;
  title: { ko: string; ja: string; en: string; 'zh-CN'?: string; 'zh-TW'?: string };
  location: { ko: string; ja: string; en: string; 'zh-CN'?: string; 'zh-TW'?: string };
  lp: number;
  isBoss?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface CourseData {
  id: string;
  name: { ko: string; ja: string; en: string; 'zh-CN'?: string; 'zh-TW'?: string };
  region: { ko: string; ja: string; en: string; 'zh-CN'?: string; 'zh-TW'?: string };
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

/** Difficulty → mission count mapping */
export const DIFFICULTY_MISSION_COUNT: Record<string, number> = {
  easy: 5,
  medium: 8,
  hard: 10,
};

// ═══════════════════════════════════════════════════════════════════════════
//  9개 코스 (courses.ts 의 UUID와 1:1 매칭)
// ═══════════════════════════════════════════════════════════════════════════

/** ── 전주 도깨비 코스 (기존) ───────────────────────────── */
export const JEONJU_COURSE: CourseData = {
  id: '11111111-1111-1111-1111-000000000001',
  name: { ko: '전주 도깨비 코스', ja: '全州トッケビコース', en: 'Jeonju Goblin Course', 'zh-CN': '全州鬼怪课程', 'zh-TW': '全州鬼怪課程' },
  region: { ko: '전주', ja: '全州', en: 'Jeonju', 'zh-CN': '全州', 'zh-TW': '全州' },
  emoji: '👹',
  difficulty: 'easy',
};

export const JEONJU_MISSIONS: MissionData[] = [
  { id: '00000000-0000-0000-0000-000000000001', seq: 1, lp: 100, latitude: 35.8150, longitude: 127.1530,
    title: { ko: '전주 한옥마을 도깨비 문 찾기', ja: '全州韓屋村トッケビの門を探す', en: 'Find the Goblin Gate at Jeonju Hanok Village', 'zh-CN': '寻找全州韩屋村的鬼怪之门', 'zh-TW': '尋找全州韓屋村的鬼怪之門' },
    location: { ko: '전주 한옥마을 입구', ja: '全州韓屋村入口', en: 'Jeonju Hanok Village Entrance', 'zh-CN': '全州韩屋村入口', 'zh-TW': '全州韓屋村入口' } },
  { id: '00000000-0000-0000-0000-000000000002', seq: 2, lp: 150, latitude: 35.8158, longitude: 127.1500,
    title: { ko: '경기전 비밀 도깨비방망이 발견', ja: '慶基殿の秘密トッケビ棒を発見', en: 'Discover the Secret Goblin Club at Gyeonggijeon', 'zh-CN': '在庆基殿发现神秘鬼怪棒', 'zh-TW': '在慶基殿發現神秘鬼怪棒' },
    location: { ko: '경기전', ja: '慶基殿', en: 'Gyeonggijeon', 'zh-CN': '庆基殿', 'zh-TW': '慶基殿' } },
  { id: '00000000-0000-0000-0000-000000000003', seq: 3, lp: 100, latitude: 35.8144, longitude: 127.1489,
    title: { ko: '전동성당 숨겨진 부적 촬영', ja: '殿洞聖堂の隠されたお守りを撮影', en: 'Photograph the Hidden Talisman at Jeondong Cathedral', 'zh-CN': '拍摄殿洞圣堂隐藏的护身符', 'zh-TW': '拍攝殿洞聖堂隱藏的護身符' },
    location: { ko: '전동성당', ja: '殿洞聖堂', en: 'Jeondong Cathedral', 'zh-CN': '殿洞圣堂', 'zh-TW': '殿洞聖堂' } },
  { id: '00000000-0000-0000-0000-000000000004', seq: 4, lp: 200, latitude: 35.8100, longitude: 127.1490,
    title: { ko: '남부시장 도깨비 먹거리 미션', ja: '南部市場トッケビグルメミッション', en: 'Goblin Food Mission at Nambu Market', 'zh-CN': '南部市场鬼怪美食任务', 'zh-TW': '南部市場鬼怪美食任務' },
    location: { ko: '남부시장', ja: '南部市場', en: 'Nambu Market', 'zh-CN': '南部市场', 'zh-TW': '南部市場' } },
  { id: '00000000-0000-0000-0000-000000000005', seq: 5, lp: 500, isBoss: true, latitude: 35.8127, longitude: 127.1536,
    title: { ko: '오목대 도깨비 보스 최종 미션', ja: '梧木台トッケビボス最終ミッション', en: 'Final Goblin Boss Mission at Omokdae', 'zh-CN': '梧木台鬼怪首领最终任务', 'zh-TW': '梧木台鬼怪首領最終任務' },
    location: { ko: '오목대', ja: '梧木台', en: 'Omokdae', 'zh-CN': '梧木台', 'zh-TW': '梧木台' } },
];

/** ── 통영 별주부 코스 ─────────────────────────────────── */
export const TONGYEONG_COURSE: CourseData = {
  id: '11111111-1111-1111-1111-000000000002',
  name: { ko: '통영 별주부 코스', ja: '統営ピョルジュブコース', en: 'Tongyeong Byeoljubu Course', 'zh-CN': '统营鳖使者课程', 'zh-TW': '統營鱉使者課程' },
  region: { ko: '통영', ja: '統営', en: 'Tongyeong', 'zh-CN': '统营', 'zh-TW': '統營' },
  emoji: '🐢',
  difficulty: 'easy',
};

export const TONGYEONG_MISSIONS: MissionData[] = [
  { id: '00000000-0000-0000-0000-000000000101', seq: 1, lp: 100, latitude: 34.8468, longitude: 128.4227,
    title: { ko: '동피랑 벽화마을 용궁 벽화', ja: '東皮廊壁画村の龍宮壁画', en: 'Sea Palace Mural at Dongpirang', 'zh-CN': '东皮廊壁画村龙宫壁画', 'zh-TW': '東皮廊壁畫村龍宮壁畫' },
    location: { ko: '동피랑 벽화마을', ja: '東皮廊壁画村', en: 'Dongpirang Mural Village', 'zh-CN': '东皮廊壁画村', 'zh-TW': '東皮廊壁畫村' } },
  { id: '00000000-0000-0000-0000-000000000102', seq: 2, lp: 150, latitude: 34.8433, longitude: 128.4263,
    title: { ko: '중앙시장 꿀빵 숨은 상인 찾기', ja: '中央市場クルパン隠れ商人探し', en: 'Find the Hidden Kkulbbang Vendor', 'zh-CN': '中央市场蜜饼商人之谜', 'zh-TW': '中央市場蜜餅商人之謎' },
    location: { ko: '통영 중앙시장', ja: '統営中央市場', en: 'Tongyeong Central Market', 'zh-CN': '统营中央市场', 'zh-TW': '統營中央市場' } },
  { id: '00000000-0000-0000-0000-000000000103', seq: 3, lp: 150, latitude: 34.8262, longitude: 128.4305,
    title: { ko: '한려수도 케이블카 바다 정찰', ja: '閑麗水道ケーブルカー海の偵察', en: 'Sea Scout via Hallyeosudo Cable Car', 'zh-CN': '闲丽水道缆车海上侦查', 'zh-TW': '閑麗水道纜車海上偵查' },
    location: { ko: '한려수도 케이블카', ja: '閑麗水道ケーブルカー', en: 'Hallyeosudo Cable Car', 'zh-CN': '闲丽水道缆车', 'zh-TW': '閑麗水道纜車' } },
  { id: '00000000-0000-0000-0000-000000000104', seq: 4, lp: 200, latitude: 34.8397, longitude: 128.4189,
    title: { ko: '해저터널 용궁 전설 단서', ja: '海底トンネルの龍宮伝説の手がかり', en: 'Sea Palace Legend Clue at Undersea Tunnel', 'zh-CN': '海底隧道龙宫传说线索', 'zh-TW': '海底隧道龍宮傳說線索' },
    location: { ko: '통영 해저터널', ja: '統営海底トンネル', en: 'Tongyeong Undersea Tunnel', 'zh-CN': '统营海底隧道', 'zh-TW': '統營海底隧道' } },
  { id: '00000000-0000-0000-0000-000000000105', seq: 5, lp: 500, isBoss: true, latitude: 34.7928, longitude: 128.3858,
    title: { ko: '달아공원 보스: 용왕의 부름', ja: '達牙公園ボス：龍王の呼び声', en: 'Boss: Sea King\'s Call at Dara Park', 'zh-CN': '达牙公园首领：龙王召唤', 'zh-TW': '達牙公園首領：龍王召喚' },
    location: { ko: '달아공원', ja: '達牙公園', en: 'Dara Park', 'zh-CN': '达牙公园', 'zh-TW': '達牙公園' } },
];

/** ── 천안 유관순 코스 ─────────────────────────────────── */
export const CHEONAN_COURSE: CourseData = {
  id: '11111111-1111-1111-1111-000000000003',
  name: { ko: '천안 유관순 코스', ja: '天安柳寛順コース', en: 'Cheonan Yu Gwan-sun Course', 'zh-CN': '天安柳宽顺课程', 'zh-TW': '天安柳寬順課程' },
  region: { ko: '천안', ja: '天安', en: 'Cheonan', 'zh-CN': '天安', 'zh-TW': '天安' },
  emoji: '🏛️',
  difficulty: 'easy',
};

export const CHEONAN_MISSIONS: MissionData[] = [
  { id: '00000000-0000-0000-0000-000000000201', seq: 1, lp: 100, latitude: 36.7831, longitude: 127.2208,
    title: { ko: '독립기념관 태극기 미션', ja: '独立記念館の太極旗ミッション', en: 'Korean Flag Mission at Independence Hall', 'zh-CN': '独立纪念馆太极旗任务', 'zh-TW': '獨立紀念館太極旗任務' },
    location: { ko: '독립기념관', ja: '独立記念館', en: 'Independence Hall', 'zh-CN': '独立纪念馆', 'zh-TW': '獨立紀念館' } },
  { id: '00000000-0000-0000-0000-000000000202', seq: 2, lp: 150, latitude: 36.7649, longitude: 127.2873,
    title: { ko: '유관순 열사 생가 방문', ja: '柳寛順烈士生家訪問', en: 'Visit Yu Gwan-sun\'s Birthplace', 'zh-CN': '参观柳宽顺烈士故居', 'zh-TW': '參觀柳寬順烈士故居' },
    location: { ko: '유관순 생가', ja: '柳寛順生家', en: 'Yu Gwan-sun Birthplace', 'zh-CN': '柳宽顺故居', 'zh-TW': '柳寬順故居' } },
  { id: '00000000-0000-0000-0000-000000000203', seq: 3, lp: 150, latitude: 36.8095, longitude: 127.1523,
    title: { ko: '천안중앙시장 호두과자 미션', ja: '天安中央市場クルミ饅頭ミッション', en: 'Walnut Cookie Mission at Cheonan Market', 'zh-CN': '天安中央市场核桃糕任务', 'zh-TW': '天安中央市場核桃糕任務' },
    location: { ko: '천안중앙시장', ja: '天安中央市場', en: 'Cheonan Jungang Market', 'zh-CN': '天安中央市场', 'zh-TW': '天安中央市場' } },
  { id: '00000000-0000-0000-0000-000000000204', seq: 4, lp: 200, latitude: 36.8135, longitude: 127.1515,
    title: { ko: '아라리오 갤러리 현대 예술 해독', ja: 'アラリオギャラリー現代アート解読', en: 'Decode Modern Art at Arario Gallery', 'zh-CN': '阿拉里奥画廊现代艺术解读', 'zh-TW': '阿拉里奧畫廊現代藝術解讀' },
    location: { ko: '아라리오 갤러리', ja: 'アラリオギャラリー', en: 'Arario Gallery', 'zh-CN': '阿拉里奥画廊', 'zh-TW': '阿拉里奧畫廊' } },
  { id: '00000000-0000-0000-0000-000000000205', seq: 5, lp: 500, isBoss: true, latitude: 36.7934, longitude: 127.1256,
    title: { ko: '천안삼거리 보스: 능수버들의 외침', ja: '天安三叉路ボス：柳の叫び', en: 'Boss: Willow\'s Cry at Cheonan Junction', 'zh-CN': '天安三岔路首领：柳树的呼唤', 'zh-TW': '天安三岔路首領：柳樹的呼喚' },
    location: { ko: '천안삼거리 공원', ja: '天安三叉路公園', en: 'Cheonan Samgeori Park', 'zh-CN': '天安三岔路公园', 'zh-TW': '天安三岔路公園' } },
];

/** ── 용인 민속 코스 ──────────────────────────────────── */
export const YONGIN_COURSE: CourseData = {
  id: '11111111-1111-1111-1111-000000000004',
  name: { ko: '용인 민속촌 코스', ja: '龍仁民俗村コース', en: 'Yongin Folk Village Course', 'zh-CN': '龙仁民俗村课程', 'zh-TW': '龍仁民俗村課程' },
  region: { ko: '용인', ja: '龍仁', en: 'Yongin', 'zh-CN': '龙仁', 'zh-TW': '龍仁' },
  emoji: '🏘️',
  difficulty: 'easy',
};

export const YONGIN_MISSIONS: MissionData[] = [
  { id: '00000000-0000-0000-0000-000000000301', seq: 1, lp: 100, latitude: 37.2591, longitude: 127.1177,
    title: { ko: '한국민속촌 조선시대 탐방', ja: '韓国民俗村・朝鮮時代探訪', en: 'Joseon Era Quest at Korean Folk Village', 'zh-CN': '韩国民俗村朝鲜时代探访', 'zh-TW': '韓國民俗村朝鮮時代探訪' },
    location: { ko: '한국민속촌', ja: '韓国民俗村', en: 'Korean Folk Village', 'zh-CN': '韩国民俗村', 'zh-TW': '韓國民俗村' } },
  { id: '00000000-0000-0000-0000-000000000302', seq: 2, lp: 150, latitude: 37.2933, longitude: 127.2020,
    title: { ko: '에버랜드 정문 스탬프 미션', ja: 'エバーランド正門スタンプミッション', en: 'Everland Main Gate Stamp Mission', 'zh-CN': '爱宝乐园正门印章任务', 'zh-TW': '愛寶樂園正門印章任務' },
    location: { ko: '에버랜드 정문', ja: 'エバーランド正門', en: 'Everland Main Gate', 'zh-CN': '爱宝乐园正门', 'zh-TW': '愛寶樂園正門' } },
  { id: '00000000-0000-0000-0000-000000000303', seq: 3, lp: 150, latitude: 37.2415, longitude: 127.1791,
    title: { ko: '용인 전통 떡집 체험', ja: '龍仁伝統餅屋体験', en: 'Traditional Tteok Shop Experience', 'zh-CN': '龙仁传统年糕店体验', 'zh-TW': '龍仁傳統年糕店體驗' },
    location: { ko: '용인 처인구 떡집 골목', ja: '龍仁処仁区餅屋通り', en: 'Cheoin Tteok Alley', 'zh-CN': '处仁区年糕巷', 'zh-TW': '處仁區年糕巷' } },
  { id: '00000000-0000-0000-0000-000000000304', seq: 4, lp: 200, latitude: 37.3012, longitude: 127.2225,
    title: { ko: '용인 자연휴양림 숲길 산책', ja: '龍仁自然休養林の森道散策', en: 'Forest Walk at Yongin Recreation Forest', 'zh-CN': '龙仁自然休养林森林漫步', 'zh-TW': '龍仁自然休養林森林漫步' },
    location: { ko: '용인 자연휴양림', ja: '龍仁自然休養林', en: 'Yongin Recreation Forest', 'zh-CN': '龙仁自然休养林', 'zh-TW': '龍仁自然休養林' } },
  { id: '00000000-0000-0000-0000-000000000305', seq: 5, lp: 500, isBoss: true, latitude: 37.3236, longitude: 127.0967,
    title: { ko: '처인성 보스: 전투의 기억', ja: '処仁城ボス：戦いの記憶', en: 'Boss: Memory of Battle at Cheoinseong', 'zh-CN': '处仁城首领：战斗记忆', 'zh-TW': '處仁城首領：戰鬥記憶' },
    location: { ko: '처인성', ja: '処仁城', en: 'Cheoinseong Fortress', 'zh-CN': '处仁城', 'zh-TW': '處仁城' } },
];

/** ── 이천 도예 코스 ──────────────────────────────────── */
export const ICHEON_COURSE: CourseData = {
  id: '11111111-1111-1111-1111-000000000005',
  name: { ko: '이천 도예 코스', ja: '利川陶芸コース', en: 'Icheon Pottery Course', 'zh-CN': '利川陶艺课程', 'zh-TW': '利川陶藝課程' },
  region: { ko: '이천', ja: '利川', en: 'Icheon', 'zh-CN': '利川', 'zh-TW': '利川' },
  emoji: '🏺',
  difficulty: 'easy',
};

export const ICHEON_MISSIONS: MissionData[] = [
  { id: '00000000-0000-0000-0000-000000000401', seq: 1, lp: 100, latitude: 37.2356, longitude: 127.4297,
    title: { ko: '이천 도자기마을 도예 체험', ja: '利川陶磁器村陶芸体験', en: 'Pottery Experience at Icheon Ceramic Village', 'zh-CN': '利川陶瓷村陶艺体验', 'zh-TW': '利川陶瓷村陶藝體驗' },
    location: { ko: '이천 도자기마을', ja: '利川陶磁器村', en: 'Icheon Ceramic Village', 'zh-CN': '利川陶瓷村', 'zh-TW': '利川陶瓷村' } },
  { id: '00000000-0000-0000-0000-000000000402', seq: 2, lp: 150, latitude: 37.2632, longitude: 127.4350,
    title: { ko: '설봉공원 조각 미션', ja: '雪峰公園彫刻ミッション', en: 'Sculpture Mission at Seolbong Park', 'zh-CN': '雪峰公园雕塑任务', 'zh-TW': '雪峰公園雕塑任務' },
    location: { ko: '설봉공원', ja: '雪峰公園', en: 'Seolbong Park', 'zh-CN': '雪峰公园', 'zh-TW': '雪峰公園' } },
  { id: '00000000-0000-0000-0000-000000000403', seq: 3, lp: 150, latitude: 37.2729, longitude: 127.4358,
    title: { ko: '이천쌀밥거리 임금님 수라상', ja: '利川米飯通り・王様の膳', en: 'Royal Rice Meal on Icheon Rice Street', 'zh-CN': '利川米饭街皇上御膳', 'zh-TW': '利川米飯街皇上御膳' },
    location: { ko: '이천 쌀밥거리', ja: '利川米飯通り', en: 'Icheon Rice Street', 'zh-CN': '利川米饭街', 'zh-TW': '利川米飯街' } },
  { id: '00000000-0000-0000-0000-000000000404', seq: 4, lp: 200, latitude: 37.2210, longitude: 127.4540,
    title: { ko: '사기막골 도예 공방 스탬프', ja: '沙器幕谷陶芸工房スタンプ', en: 'Pottery Studio Stamp at Sagimakgol', 'zh-CN': '沙器幕谷陶艺工坊印章', 'zh-TW': '沙器幕谷陶藝工坊印章' },
    location: { ko: '사기막골 도예촌', ja: '沙器幕谷陶芸村', en: 'Sagimakgol Pottery Village', 'zh-CN': '沙器幕谷陶艺村', 'zh-TW': '沙器幕谷陶藝村' } },
  { id: '00000000-0000-0000-0000-000000000405', seq: 5, lp: 500, isBoss: true, latitude: 37.2692, longitude: 127.4410,
    title: { ko: '이천 세라믹센터 보스: 도공의 혼', ja: '利川セラミックセンターボス：陶工の魂', en: 'Boss: Soul of the Potter at Ceramics Center', 'zh-CN': '利川陶瓷中心首领：陶工之魂', 'zh-TW': '利川陶瓷中心首領：陶工之魂' },
    location: { ko: '이천 세라믹센터', ja: '利川セラミックセンター', en: 'Icheon Ceramics Center', 'zh-CN': '利川陶瓷中心', 'zh-TW': '利川陶瓷中心' } },
];

/** ── 경주 신라 코스 ──────────────────────────────────── */
export const GYEONGJU_COURSE: CourseData = {
  id: '33333333-3333-3333-3333-000000000001',
  name: { ko: '경주 신라 코스', ja: '慶州新羅コース', en: 'Gyeongju Silla Course', 'zh-CN': '庆州新罗课程', 'zh-TW': '慶州新羅課程' },
  region: { ko: '경주', ja: '慶州', en: 'Gyeongju', 'zh-CN': '庆州', 'zh-TW': '慶州' },
  emoji: '👑',
  difficulty: 'medium',
};

export const GYEONGJU_MISSIONS: MissionData[] = [
  { id: '00000000-0000-0000-0000-000000000501', seq: 1, lp: 100, latitude: 35.7903, longitude: 129.3320,
    title: { ko: '불국사 석가탑 참배', ja: '仏国寺釈迦塔参拝', en: 'Worship at Bulguksa Seokgatap', 'zh-CN': '佛国寺释迦塔参拜', 'zh-TW': '佛國寺釋迦塔參拜' },
    location: { ko: '불국사', ja: '仏国寺', en: 'Bulguksa Temple', 'zh-CN': '佛国寺', 'zh-TW': '佛國寺' } },
  { id: '00000000-0000-0000-0000-000000000502', seq: 2, lp: 150, latitude: 35.7951, longitude: 129.3486,
    title: { ko: '석굴암 본존불 해독 미션', ja: '石窟庵本尊仏解読ミッション', en: 'Decode the Seokguram Buddha', 'zh-CN': '石窟庵本尊佛解读任务', 'zh-TW': '石窟庵本尊佛解讀任務' },
    location: { ko: '석굴암', ja: '石窟庵', en: 'Seokguram Grotto', 'zh-CN': '石窟庵', 'zh-TW': '石窟庵' } },
  { id: '00000000-0000-0000-0000-000000000503', seq: 3, lp: 150, latitude: 35.8349, longitude: 129.2190,
    title: { ko: '첨성대 별자리 관측', ja: '瞻星台星座観測', en: 'Observe Constellations at Cheomseongdae', 'zh-CN': '瞻星台星座观测', 'zh-TW': '瞻星台星座觀測' },
    location: { ko: '첨성대', ja: '瞻星台', en: 'Cheomseongdae', 'zh-CN': '瞻星台', 'zh-TW': '瞻星台' } },
  { id: '00000000-0000-0000-0000-000000000504', seq: 4, lp: 200, latitude: 35.8343, longitude: 129.2254,
    title: { ko: '동궁과 월지 야경 촬영', ja: '東宮と月池の夜景撮影', en: 'Night Photo at Donggung & Wolji', 'zh-CN': '东宫与月池夜景拍摄', 'zh-TW': '東宮與月池夜景拍攝' },
    location: { ko: '동궁과 월지 (안압지)', ja: '東宮と月池', en: 'Donggung Palace & Wolji Pond', 'zh-CN': '东宫与月池', 'zh-TW': '東宮與月池' } },
  { id: '00000000-0000-0000-0000-000000000505', seq: 5, lp: 500, isBoss: true, latitude: 35.8376, longitude: 129.2124,
    title: { ko: '대릉원 보스: 천년 왕국의 부름', ja: '大陵苑ボス：千年王国の呼び声', en: 'Boss: Call of the Millennium Kingdom', 'zh-CN': '大陵园首领：千年王国召唤', 'zh-TW': '大陵園首領：千年王國召喚' },
    location: { ko: '대릉원', ja: '大陵苑', en: 'Daereungwon Tomb Complex', 'zh-CN': '大陵园', 'zh-TW': '大陵園' } },
];

/** ── 부산 해운대 코스 ────────────────────────────────── */
export const BUSAN_COURSE: CourseData = {
  id: '33333333-3333-3333-3333-000000000002',
  name: { ko: '부산 바다 코스', ja: '釜山海コース', en: 'Busan Ocean Course', 'zh-CN': '釜山海洋课程', 'zh-TW': '釜山海洋課程' },
  region: { ko: '부산', ja: '釜山', en: 'Busan', 'zh-CN': '釜山', 'zh-TW': '釜山' },
  emoji: '🌊',
  difficulty: 'medium',
};

export const BUSAN_MISSIONS: MissionData[] = [
  { id: '00000000-0000-0000-0000-000000000601', seq: 1, lp: 100, latitude: 35.1586, longitude: 129.1603,
    title: { ko: '해운대 해변 일출 미션', ja: '海雲台ビーチ日の出ミッション', en: 'Haeundae Beach Sunrise Mission', 'zh-CN': '海云台海滩日出任务', 'zh-TW': '海雲台海灘日出任務' },
    location: { ko: '해운대 해수욕장', ja: '海雲台海水浴場', en: 'Haeundae Beach', 'zh-CN': '海云台海水浴场', 'zh-TW': '海雲台海水浴場' } },
  { id: '00000000-0000-0000-0000-000000000602', seq: 2, lp: 150, latitude: 35.1531, longitude: 129.1186,
    title: { ko: '광안대교 야경 촬영', ja: '広安大橋夜景撮影', en: 'Gwangan Bridge Night Photo', 'zh-CN': '广安大桥夜景拍摄', 'zh-TW': '廣安大橋夜景拍攝' },
    location: { ko: '광안리 해수욕장', ja: '広安里海水浴場', en: 'Gwangalli Beach', 'zh-CN': '广安里海水浴场', 'zh-TW': '廣安里海水浴場' } },
  { id: '00000000-0000-0000-0000-000000000603', seq: 3, lp: 150, latitude: 35.0971, longitude: 129.0107,
    title: { ko: '감천문화마을 컬러 투어', ja: '甘川文化村カラーツアー', en: 'Gamcheon Color Village Tour', 'zh-CN': '甘川文化村色彩之旅', 'zh-TW': '甘川文化村色彩之旅' },
    location: { ko: '감천문화마을', ja: '甘川文化村', en: 'Gamcheon Culture Village', 'zh-CN': '甘川文化村', 'zh-TW': '甘川文化村' } },
  { id: '00000000-0000-0000-0000-000000000604', seq: 4, lp: 200, latitude: 35.0968, longitude: 129.0304,
    title: { ko: '자갈치시장 씨푸드 미션', ja: 'チャガルチ市場シーフードミッション', en: 'Jagalchi Seafood Mission', 'zh-CN': '札嘎其市场海鲜任务', 'zh-TW': '札嘎其市場海鮮任務' },
    location: { ko: '자갈치시장', ja: 'チャガルチ市場', en: 'Jagalchi Market', 'zh-CN': '札嘎其市场', 'zh-TW': '札嘎其市場' } },
  { id: '00000000-0000-0000-0000-000000000605', seq: 5, lp: 500, isBoss: true, latitude: 35.0519, longitude: 129.0863,
    title: { ko: '태종대 보스: 바다의 심판', ja: '太宗台ボス：海の審判', en: 'Boss: Sea Judgment at Taejongdae', 'zh-CN': '太宗台首领：海洋审判', 'zh-TW': '太宗台首領：海洋審判' },
    location: { ko: '태종대', ja: '太宗台', en: 'Taejongdae', 'zh-CN': '太宗台', 'zh-TW': '太宗台' } },
];

/** ── 서울 궁궐 코스 ──────────────────────────────────── */
export const SEOUL_COURSE: CourseData = {
  id: '33333333-3333-3333-3333-000000000003',
  name: { ko: '서울 궁궐 코스', ja: 'ソウル宮廷コース', en: 'Seoul Palace Course', 'zh-CN': '首尔宫殿课程', 'zh-TW': '首爾宮殿課程' },
  region: { ko: '서울', ja: 'ソウル', en: 'Seoul', 'zh-CN': '首尔', 'zh-TW': '首爾' },
  emoji: '🏯',
  difficulty: 'medium',
};

export const SEOUL_MISSIONS: MissionData[] = [
  { id: '00000000-0000-0000-0000-000000000701', seq: 1, lp: 100, latitude: 37.5796, longitude: 126.9770,
    title: { ko: '경복궁 수문장 교대식 참관', ja: '景福宮守門将交代式参観', en: 'Gyeongbokgung Royal Guard Change', 'zh-CN': '景福宫守门将交接仪式', 'zh-TW': '景福宮守門將交接儀式' },
    location: { ko: '경복궁', ja: '景福宮', en: 'Gyeongbokgung Palace', 'zh-CN': '景福宫', 'zh-TW': '景福宮' } },
  { id: '00000000-0000-0000-0000-000000000702', seq: 2, lp: 150, latitude: 37.5826, longitude: 126.9830,
    title: { ko: '북촌한옥마을 8경 미션', ja: '北村韓屋村8景ミッション', en: 'Bukchon 8 Scenic Views Mission', 'zh-CN': '北村韩屋村八景任务', 'zh-TW': '北村韓屋村八景任務' },
    location: { ko: '북촌 한옥마을', ja: '北村韓屋村', en: 'Bukchon Hanok Village', 'zh-CN': '北村韩屋村', 'zh-TW': '北村韓屋村' } },
  { id: '00000000-0000-0000-0000-000000000703', seq: 3, lp: 150, latitude: 37.5512, longitude: 126.9882,
    title: { ko: '남산타워 자물쇠 미션', ja: 'Nソウルタワー愛の鍵ミッション', en: 'N Seoul Tower Love Lock Mission', 'zh-CN': '南山塔情人锁任务', 'zh-TW': '南山塔情人鎖任務' },
    location: { ko: '남산서울타워', ja: 'Nソウルタワー', en: 'N Seoul Tower', 'zh-CN': '南山首尔塔', 'zh-TW': '南山首爾塔' } },
  { id: '00000000-0000-0000-0000-000000000704', seq: 4, lp: 200, latitude: 37.5702, longitude: 126.9996,
    title: { ko: '광장시장 마약김밥 미션', ja: '広蔵市場麻薬キンパミッション', en: 'Gwangjang Mayak Kimbap Mission', 'zh-CN': '广藏市场麻药紫菜包饭任务', 'zh-TW': '廣藏市場麻藥紫菜包飯任務' },
    location: { ko: '광장시장', ja: '広蔵市場', en: 'Gwangjang Market', 'zh-CN': '广藏市场', 'zh-TW': '廣藏市場' } },
  { id: '00000000-0000-0000-0000-000000000705', seq: 5, lp: 500, isBoss: true, latitude: 37.5794, longitude: 126.9910,
    title: { ko: '창덕궁 후원 보스: 비원의 비밀', ja: '昌徳宮後苑ボス：秘苑の秘密', en: 'Boss: Secret of Biwon at Changdeokgung', 'zh-CN': '昌德宫后苑首领：秘苑之谜', 'zh-TW': '昌德宮後苑首領：秘苑之謎' },
    location: { ko: '창덕궁 후원', ja: '昌徳宮後苑', en: 'Changdeokgung Secret Garden', 'zh-CN': '昌德宫后苑', 'zh-TW': '昌德宮後苑' } },
];

/** ── 제주 신화 코스 ──────────────────────────────────── */
export const JEJU_COURSE: CourseData = {
  id: '33333333-3333-3333-3333-000000000004',
  name: { ko: '제주 신화 코스', ja: '済州神話コース', en: 'Jeju Mythology Course', 'zh-CN': '济州神话课程', 'zh-TW': '濟州神話課程' },
  region: { ko: '제주', ja: '済州', en: 'Jeju', 'zh-CN': '济州', 'zh-TW': '濟州' },
  emoji: '🏝️',
  difficulty: 'medium',
};

export const JEJU_MISSIONS: MissionData[] = [
  { id: '00000000-0000-0000-0000-000000000801', seq: 1, lp: 100, latitude: 33.4584, longitude: 126.9423,
    title: { ko: '성산일출봉 일출 미션', ja: '城山日出峰日の出ミッション', en: 'Seongsan Ilchulbong Sunrise Mission', 'zh-CN': '城山日出峰日出任务', 'zh-TW': '城山日出峰日出任務' },
    location: { ko: '성산일출봉', ja: '城山日出峰', en: 'Seongsan Ilchulbong', 'zh-CN': '城山日出峰', 'zh-TW': '城山日出峰' } },
  { id: '00000000-0000-0000-0000-000000000802', seq: 2, lp: 150, latitude: 33.5287, longitude: 126.7726,
    title: { ko: '만장굴 용암 동굴 탐험', ja: '万丈窟溶岩洞窟探検', en: 'Manjanggul Lava Cave Exploration', 'zh-CN': '万丈窟熔岩洞探险', 'zh-TW': '萬丈窟熔岩洞探險' },
    location: { ko: '만장굴', ja: '万丈窟', en: 'Manjanggul Cave', 'zh-CN': '万丈窟', 'zh-TW': '萬丈窟' } },
  { id: '00000000-0000-0000-0000-000000000803', seq: 3, lp: 150, latitude: 33.3946, longitude: 126.2418,
    title: { ko: '협재해수욕장 에메랄드 바다', ja: '挾才海水浴場エメラルド海', en: 'Hyeopjae Emerald Beach', 'zh-CN': '挟才海水浴场翡翠海', 'zh-TW': '挾才海水浴場翡翠海' },
    location: { ko: '협재해수욕장', ja: '挾才海水浴場', en: 'Hyeopjae Beach', 'zh-CN': '挟才海水浴场', 'zh-TW': '挾才海水浴場' } },
  { id: '00000000-0000-0000-0000-000000000804', seq: 4, lp: 200, latitude: 33.2453, longitude: 126.5126,
    title: { ko: '제주올레 7코스 도보 인증', ja: '済州オルレ7コース踏破認証', en: 'Jeju Olle Route 7 Completion', 'zh-CN': '济州偶来7号路线徒步认证', 'zh-TW': '濟州偶來7號路線徒步認證' },
    location: { ko: '제주올레 7코스', ja: '済州オルレ7コース', en: 'Jeju Olle Route 7', 'zh-CN': '济州偶来7号路线', 'zh-TW': '濟州偶來7號路線' } },
  { id: '00000000-0000-0000-0000-000000000805', seq: 5, lp: 500, isBoss: true, latitude: 33.3617, longitude: 126.5292,
    title: { ko: '한라산 보스: 설문대 할망의 시험', ja: '漢拏山ボス：雪文台ハルマンの試練', en: 'Boss: Seolmundae Grandma\'s Trial at Hallasan', 'zh-CN': '汉拿山首领：雪文台奶奶的考验', 'zh-TW': '漢拏山首領：雪文台奶奶的考驗' },
    location: { ko: '한라산 백록담', ja: '漢拏山白鹿潭', en: 'Hallasan Baengnokdam', 'zh-CN': '汉拿山白鹿潭', 'zh-TW': '漢拏山白鹿潭' } },
];

// ═══════════════════════════════════════════════════════════════════════════
//  Exports
// ═══════════════════════════════════════════════════════════════════════════

export const ALL_COURSES: CourseData[] = [
  JEONJU_COURSE,
  TONGYEONG_COURSE,
  CHEONAN_COURSE,
  YONGIN_COURSE,
  ICHEON_COURSE,
  GYEONGJU_COURSE,
  BUSAN_COURSE,
  SEOUL_COURSE,
  JEJU_COURSE,
];

const MISSIONS_BY_COURSE: Record<string, MissionData[]> = {
  [JEONJU_COURSE.id]:    JEONJU_MISSIONS,
  [TONGYEONG_COURSE.id]: TONGYEONG_MISSIONS,
  [CHEONAN_COURSE.id]:   CHEONAN_MISSIONS,
  [YONGIN_COURSE.id]:    YONGIN_MISSIONS,
  [ICHEON_COURSE.id]:    ICHEON_MISSIONS,
  [GYEONGJU_COURSE.id]:  GYEONGJU_MISSIONS,
  [BUSAN_COURSE.id]:     BUSAN_MISSIONS,
  [SEOUL_COURSE.id]:     SEOUL_MISSIONS,
  [JEJU_COURSE.id]:      JEJU_MISSIONS,
};

/** Helper: get missions by course id */
export function getMissionsByCourse(courseId: string): MissionData[] {
  return MISSIONS_BY_COURSE[courseId] ?? [];
}

/** Helper: get course by id */
export function getCourseById(courseId: string): CourseData | undefined {
  return ALL_COURSES.find((c) => c.id === courseId);
}
