// ─────────────────────────────────────────────
//  lib/data/ootd-regions.ts
//  17개 광역시도 + 주요 도시 + 좌표 (OOTD용)
//  themeId: 기존 CITY_THEMES의 cityId로 연결해 옷차림 추천 재사용
// ─────────────────────────────────────────────

export type I18n5 = { ko: string; en: string; ja: string; 'zh-CN': string; 'zh-TW': string }

export interface OotdRegion {
  id: string
  name: I18n5
  majorCities: I18n5[]
  latitude: number
  longitude: number
  emoji: string
  themeId: 'seoul' | 'busan' | 'jeju' | 'gyeongju' | 'tongyeong' | 'cheonan' | 'yongin' | 'icheon' | 'jeonju'
}

export const OOTD_REGIONS: OotdRegion[] = [
  {
    id: 'seoul',
    name: { ko: '서울특별시', en: 'Seoul', ja: 'ソウル', 'zh-CN': '首尔', 'zh-TW': '首爾' },
    majorCities: [
      { ko: '강남', en: 'Gangnam', ja: '江南', 'zh-CN': '江南', 'zh-TW': '江南' },
      { ko: '홍대', en: 'Hongdae', ja: '弘大', 'zh-CN': '弘大', 'zh-TW': '弘大' },
      { ko: '명동', en: 'Myeongdong', ja: '明洞', 'zh-CN': '明洞', 'zh-TW': '明洞' },
    ],
    latitude: 37.5665,
    longitude: 126.9780,
    emoji: '🏙️',
    themeId: 'seoul',
  },
  {
    id: 'gyeonggi',
    name: { ko: '경기도', en: 'Gyeonggi', ja: '京畿道', 'zh-CN': '京畿道', 'zh-TW': '京畿道' },
    majorCities: [
      { ko: '수원', en: 'Suwon', ja: '水原', 'zh-CN': '水原', 'zh-TW': '水原' },
      { ko: '용인', en: 'Yongin', ja: '龍仁', 'zh-CN': '龙仁', 'zh-TW': '龍仁' },
      { ko: '성남', en: 'Seongnam', ja: '城南', 'zh-CN': '城南', 'zh-TW': '城南' },
    ],
    latitude: 37.2636,
    longitude: 127.0286,
    emoji: '🌳',
    themeId: 'yongin',
  },
  {
    id: 'incheon',
    name: { ko: '인천광역시', en: 'Incheon', ja: '仁川', 'zh-CN': '仁川', 'zh-TW': '仁川' },
    majorCities: [
      { ko: '송도', en: 'Songdo', ja: '松島', 'zh-CN': '松岛', 'zh-TW': '松島' },
      { ko: '월미도', en: 'Wolmido', ja: '月尾島', 'zh-CN': '月尾岛', 'zh-TW': '月尾島' },
      { ko: '차이나타운', en: 'Chinatown', ja: 'チャイナタウン', 'zh-CN': '唐人街', 'zh-TW': '唐人街' },
    ],
    latitude: 37.4563,
    longitude: 126.7052,
    emoji: '⚓',
    themeId: 'seoul',
  },
  {
    id: 'gangwon',
    name: { ko: '강원도', en: 'Gangwon', ja: '江原道', 'zh-CN': '江原道', 'zh-TW': '江原道' },
    majorCities: [
      { ko: '강릉', en: 'Gangneung', ja: '江陵', 'zh-CN': '江陵', 'zh-TW': '江陵' },
      { ko: '속초', en: 'Sokcho', ja: '束草', 'zh-CN': '束草', 'zh-TW': '束草' },
      { ko: '춘천', en: 'Chuncheon', ja: '春川', 'zh-CN': '春川', 'zh-TW': '春川' },
    ],
    latitude: 37.8813,
    longitude: 127.7298,
    emoji: '⛰️',
    themeId: 'jeju',
  },
  {
    id: 'chungbuk',
    name: { ko: '충청북도', en: 'Chungbuk', ja: '忠清北道', 'zh-CN': '忠清北道', 'zh-TW': '忠清北道' },
    majorCities: [
      { ko: '청주', en: 'Cheongju', ja: '清州', 'zh-CN': '清州', 'zh-TW': '清州' },
      { ko: '단양', en: 'Danyang', ja: '丹陽', 'zh-CN': '丹阳', 'zh-TW': '丹陽' },
      { ko: '제천', en: 'Jecheon', ja: '堤川', 'zh-CN': '堤川', 'zh-TW': '堤川' },
    ],
    latitude: 36.6424,
    longitude: 127.4890,
    emoji: '🏞️',
    themeId: 'icheon',
  },
  {
    id: 'chungnam',
    name: { ko: '충청남도', en: 'Chungnam', ja: '忠清南道', 'zh-CN': '忠清南道', 'zh-TW': '忠清南道' },
    majorCities: [
      { ko: '천안', en: 'Cheonan', ja: '天安', 'zh-CN': '天安', 'zh-TW': '天安' },
      { ko: '공주', en: 'Gongju', ja: '公州', 'zh-CN': '公州', 'zh-TW': '公州' },
      { ko: '부여', en: 'Buyeo', ja: '扶余', 'zh-CN': '扶余', 'zh-TW': '扶餘' },
    ],
    latitude: 36.6014,
    longitude: 126.6610,
    emoji: '🌾',
    themeId: 'cheonan',
  },
  {
    id: 'daejeon',
    name: { ko: '대전광역시', en: 'Daejeon', ja: '大田', 'zh-CN': '大田', 'zh-TW': '大田' },
    majorCities: [
      { ko: '둔산', en: 'Dunsan', ja: '屯山', 'zh-CN': '屯山', 'zh-TW': '屯山' },
      { ko: '유성', en: 'Yuseong', ja: '儒城', 'zh-CN': '儒城', 'zh-TW': '儒城' },
    ],
    latitude: 36.3504,
    longitude: 127.3845,
    emoji: '🔬',
    themeId: 'cheonan',
  },
  {
    id: 'sejong',
    name: { ko: '세종특별자치시', en: 'Sejong', ja: '世宗', 'zh-CN': '世宗', 'zh-TW': '世宗' },
    majorCities: [
      { ko: '정부청사', en: 'Government Complex', ja: '政府庁舎', 'zh-CN': '政府厅舍', 'zh-TW': '政府廳舍' },
      { ko: '조치원', en: 'Jochiwon', ja: '鳥致院', 'zh-CN': '鸟致院', 'zh-TW': '鳥致院' },
    ],
    latitude: 36.4875,
    longitude: 127.2817,
    emoji: '🏛️',
    themeId: 'cheonan',
  },
  {
    id: 'jeonbuk',
    name: { ko: '전라북도', en: 'Jeonbuk', ja: '全羅北道', 'zh-CN': '全罗北道', 'zh-TW': '全羅北道' },
    majorCities: [
      { ko: '전주', en: 'Jeonju', ja: '全州', 'zh-CN': '全州', 'zh-TW': '全州' },
      { ko: '군산', en: 'Gunsan', ja: '群山', 'zh-CN': '群山', 'zh-TW': '群山' },
      { ko: '남원', en: 'Namwon', ja: '南原', 'zh-CN': '南原', 'zh-TW': '南原' },
    ],
    latitude: 35.8242,
    longitude: 127.1480,
    emoji: '🏮',
    themeId: 'jeonju',
  },
  {
    id: 'jeonnam',
    name: { ko: '전라남도', en: 'Jeonnam', ja: '全羅南道', 'zh-CN': '全罗南道', 'zh-TW': '全羅南道' },
    majorCities: [
      { ko: '여수', en: 'Yeosu', ja: '麗水', 'zh-CN': '丽水', 'zh-TW': '麗水' },
      { ko: '순천', en: 'Suncheon', ja: '順天', 'zh-CN': '顺天', 'zh-TW': '順天' },
      { ko: '목포', en: 'Mokpo', ja: '木浦', 'zh-CN': '木浦', 'zh-TW': '木浦' },
    ],
    latitude: 34.8118,
    longitude: 126.4628,
    emoji: '🌺',
    themeId: 'tongyeong',
  },
  {
    id: 'gwangju',
    name: { ko: '광주광역시', en: 'Gwangju', ja: '光州', 'zh-CN': '光州', 'zh-TW': '光州' },
    majorCities: [
      { ko: '상무지구', en: 'Sangmu', ja: '尚武地区', 'zh-CN': '尚武', 'zh-TW': '尚武' },
      { ko: '양림동', en: 'Yangnim', ja: '楊林洞', 'zh-CN': '杨林洞', 'zh-TW': '楊林洞' },
    ],
    latitude: 35.1595,
    longitude: 126.8526,
    emoji: '🎨',
    themeId: 'cheonan',
  },
  {
    id: 'gyeongbuk',
    name: { ko: '경상북도', en: 'Gyeongbuk', ja: '慶尚北道', 'zh-CN': '庆尚北道', 'zh-TW': '慶尚北道' },
    majorCities: [
      { ko: '경주', en: 'Gyeongju', ja: '慶州', 'zh-CN': '庆州', 'zh-TW': '慶州' },
      { ko: '포항', en: 'Pohang', ja: '浦項', 'zh-CN': '浦项', 'zh-TW': '浦項' },
      { ko: '안동', en: 'Andong', ja: '安東', 'zh-CN': '安东', 'zh-TW': '安東' },
    ],
    latitude: 36.5760,
    longitude: 128.7286,
    emoji: '🏯',
    themeId: 'gyeongju',
  },
  {
    id: 'gyeongnam',
    name: { ko: '경상남도', en: 'Gyeongnam', ja: '慶尚南道', 'zh-CN': '庆尚南道', 'zh-TW': '慶尚南道' },
    majorCities: [
      { ko: '통영', en: 'Tongyeong', ja: '統営', 'zh-CN': '统营', 'zh-TW': '統營' },
      { ko: '창원', en: 'Changwon', ja: '昌原', 'zh-CN': '昌原', 'zh-TW': '昌原' },
      { ko: '거제', en: 'Geoje', ja: '巨済', 'zh-CN': '巨济', 'zh-TW': '巨濟' },
    ],
    latitude: 35.2280,
    longitude: 128.6817,
    emoji: '⛴️',
    themeId: 'tongyeong',
  },
  {
    id: 'daegu',
    name: { ko: '대구광역시', en: 'Daegu', ja: '大邱', 'zh-CN': '大邱', 'zh-TW': '大邱' },
    majorCities: [
      { ko: '동성로', en: 'Dongseong-ro', ja: '東城路', 'zh-CN': '东城路', 'zh-TW': '東城路' },
      { ko: '수성구', en: 'Suseong', ja: '寿城区', 'zh-CN': '寿城区', 'zh-TW': '壽城區' },
      { ko: '팔공산', en: 'Palgongsan', ja: '八公山', 'zh-CN': '八公山', 'zh-TW': '八公山' },
    ],
    latitude: 35.8714,
    longitude: 128.6014,
    emoji: '🌆',
    themeId: 'cheonan',
  },
  {
    id: 'ulsan',
    name: { ko: '울산광역시', en: 'Ulsan', ja: '蔚山', 'zh-CN': '蔚山', 'zh-TW': '蔚山' },
    majorCities: [
      { ko: '태화강', en: 'Taehwa River', ja: '太和江', 'zh-CN': '太和江', 'zh-TW': '太和江' },
      { ko: '간절곶', en: 'Ganjeolgot', ja: '艮絶串', 'zh-CN': '艮绝串', 'zh-TW': '艮絕串' },
    ],
    latitude: 35.5384,
    longitude: 129.3114,
    emoji: '🏭',
    themeId: 'busan',
  },
  {
    id: 'busan',
    name: { ko: '부산광역시', en: 'Busan', ja: '釜山', 'zh-CN': '釜山', 'zh-TW': '釜山' },
    majorCities: [
      { ko: '해운대', en: 'Haeundae', ja: '海雲台', 'zh-CN': '海云台', 'zh-TW': '海雲台' },
      { ko: '서면', en: 'Seomyeon', ja: '西面', 'zh-CN': '西面', 'zh-TW': '西面' },
      { ko: '남포동', en: 'Nampo-dong', ja: '南浦洞', 'zh-CN': '南浦洞', 'zh-TW': '南浦洞' },
    ],
    latitude: 35.1796,
    longitude: 129.0756,
    emoji: '🌊',
    themeId: 'busan',
  },
  {
    id: 'jeju',
    name: { ko: '제주특별자치도', en: 'Jeju', ja: '済州', 'zh-CN': '济州', 'zh-TW': '濟州' },
    majorCities: [
      { ko: '제주시', en: 'Jeju City', ja: '済州市', 'zh-CN': '济州市', 'zh-TW': '濟州市' },
      { ko: '서귀포', en: 'Seogwipo', ja: '西帰浦', 'zh-CN': '西归浦', 'zh-TW': '西歸浦' },
      { ko: '우도', en: 'Udo', ja: '牛島', 'zh-CN': '牛岛', 'zh-TW': '牛島' },
    ],
    latitude: 33.4996,
    longitude: 126.5312,
    emoji: '🏝️',
    themeId: 'jeju',
  },
]

export function getRegion(id: string): OotdRegion | undefined {
  return OOTD_REGIONS.find((r) => r.id === id)
}

export function pickL5(field: I18n5, locale: string): string {
  return field[locale as keyof I18n5] || field.en || field.ko
}
