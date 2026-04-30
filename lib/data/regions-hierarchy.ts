/**
 * 도/시 2 단계 hierarchy — 한국 행정구역 광역 (province) → 우리 코스/음식 등록 도시 (city).
 *
 * 사용처: components/features/food/ProvinceAccordion.tsx
 *   - /food/dupe 메인의 도시별 모드 그리드 → 도 Accordion 으로 전환 (단일 도시 즉시 link)
 * city.id 는 food-dupes.ts 의 region.code 와 1:1 매칭 (yongin / jeju 등).
 */

export interface CityItem {
  /** food-dupes.ts 의 region.code 와 일치 (라우트 /food/dupe/{id}) */
  id: string
  name: { ko: string; ja: string; en: string; 'zh-CN': string; 'zh-TW': string }
}

export interface ProvinceItem {
  id: string
  name: { ko: string; ja: string; en: string; 'zh-CN': string; 'zh-TW': string }
  emoji: string
  cities: CityItem[]
}

export const PROVINCES: ProvinceItem[] = [
  {
    id: 'seoul',
    name: { ko: '서울특별시', ja: 'ソウル特別市', en: 'Seoul', 'zh-CN': '首尔特别市', 'zh-TW': '首爾特別市' },
    emoji: '🏙️',
    cities: [
      { id: 'seoul', name: { ko: '서울', ja: 'ソウル', en: 'Seoul', 'zh-CN': '首尔', 'zh-TW': '首爾' } },
    ],
  },
  {
    id: 'busan',
    name: { ko: '부산광역시', ja: '釜山広域市', en: 'Busan', 'zh-CN': '釜山广域市', 'zh-TW': '釜山廣域市' },
    emoji: '🌊',
    cities: [
      { id: 'busan', name: { ko: '부산', ja: '釜山', en: 'Busan', 'zh-CN': '釜山', 'zh-TW': '釜山' } },
    ],
  },
  {
    id: 'incheon',
    name: { ko: '인천광역시', ja: '仁川広域市', en: 'Incheon', 'zh-CN': '仁川广域市', 'zh-TW': '仁川廣域市' },
    emoji: '⚓',
    cities: [
      { id: 'incheon', name: { ko: '인천', ja: '仁川', en: 'Incheon', 'zh-CN': '仁川', 'zh-TW': '仁川' } },
    ],
  },
  {
    id: 'daejeon',
    name: { ko: '대전광역시', ja: '大田広域市', en: 'Daejeon', 'zh-CN': '大田广域市', 'zh-TW': '大田廣域市' },
    emoji: '🛤️',
    cities: [
      { id: 'daejeon', name: { ko: '대전', ja: '大田', en: 'Daejeon', 'zh-CN': '大田', 'zh-TW': '大田' } },
    ],
  },
  {
    id: 'daegu',
    name: { ko: '대구광역시', ja: '大邱広域市', en: 'Daegu', 'zh-CN': '大邱广域市', 'zh-TW': '大邱廣域市' },
    emoji: '🌆',
    cities: [
      { id: 'daegu', name: { ko: '대구', ja: '大邱', en: 'Daegu', 'zh-CN': '大邱', 'zh-TW': '大邱' } },
    ],
  },
  {
    id: 'gwangju',
    name: { ko: '광주광역시', ja: '光州広域市', en: 'Gwangju', 'zh-CN': '光州广域市', 'zh-TW': '光州廣域市' },
    emoji: '🌃',
    cities: [
      { id: 'gwangju', name: { ko: '광주', ja: '光州', en: 'Gwangju', 'zh-CN': '光州', 'zh-TW': '光州' } },
    ],
  },
  {
    id: 'ulsan',
    name: { ko: '울산광역시', ja: '蔚山広域市', en: 'Ulsan', 'zh-CN': '蔚山广域市', 'zh-TW': '蔚山廣域市' },
    emoji: '🏭',
    cities: [
      { id: 'ulsan', name: { ko: '울산', ja: '蔚山', en: 'Ulsan', 'zh-CN': '蔚山', 'zh-TW': '蔚山' } },
    ],
  },
  {
    id: 'sejong',
    name: { ko: '세종특별자치시', ja: '世宗特別自治市', en: 'Sejong', 'zh-CN': '世宗特别自治市', 'zh-TW': '世宗特別自治市' },
    emoji: '🏛️',
    cities: [
      { id: 'sejong', name: { ko: '세종', ja: '世宗', en: 'Sejong', 'zh-CN': '世宗', 'zh-TW': '世宗' } },
    ],
  },
  {
    id: 'chungbuk',
    name: { ko: '충청북도', ja: '忠清北道', en: 'Chungcheongbuk-do', 'zh-CN': '忠清北道', 'zh-TW': '忠清北道' },
    emoji: '⛰️',
    cities: [
      { id: 'chungbuk', name: { ko: '충북', ja: '忠清北道', en: 'Chungcheongbuk-do', 'zh-CN': '忠清北道', 'zh-TW': '忠清北道' } },
    ],
  },
  {
    id: 'gyeonggi',
    name: { ko: '경기도', ja: '京畿道', en: 'Gyeonggi-do', 'zh-CN': '京畿道', 'zh-TW': '京畿道' },
    emoji: '🏞️',
    cities: [
      { id: 'yongin', name: { ko: '용인', ja: '龍仁', en: 'Yongin', 'zh-CN': '龙仁', 'zh-TW': '龍仁' } },
      { id: 'icheon', name: { ko: '이천', ja: '利川', en: 'Icheon', 'zh-CN': '利川', 'zh-TW': '利川' } },
    ],
  },
  {
    id: 'gangwon',
    name: { ko: '강원도', ja: '江原道', en: 'Gangwon-do', 'zh-CN': '江原道', 'zh-TW': '江原道' },
    emoji: '🏔️',
    cities: [
      { id: 'sokcho', name: { ko: '속초', ja: '束草', en: 'Sokcho', 'zh-CN': '束草', 'zh-TW': '束草' } },
    ],
  },
  {
    id: 'chungnam',
    name: { ko: '충청남도', ja: '忠清南道', en: 'Chungcheongnam-do', 'zh-CN': '忠清南道', 'zh-TW': '忠清南道' },
    emoji: '🌾',
    cities: [
      { id: 'cheonan', name: { ko: '천안', ja: '天安', en: 'Cheonan', 'zh-CN': '天安', 'zh-TW': '天安' } },
    ],
  },
  {
    id: 'jeonbuk',
    name: { ko: '전라북도', ja: '全羅北道', en: 'Jeollabuk-do', 'zh-CN': '全罗北道', 'zh-TW': '全羅北道' },
    emoji: '🍚',
    cities: [
      { id: 'jeonju', name: { ko: '전주', ja: '全州', en: 'Jeonju', 'zh-CN': '全州', 'zh-TW': '全州' } },
    ],
  },
  {
    id: 'jeonnam',
    name: { ko: '전라남도', ja: '全羅南道', en: 'Jeollanam-do', 'zh-CN': '全罗南道', 'zh-TW': '全羅南道' },
    emoji: '🌅',
    cities: [
      { id: 'yeosu', name: { ko: '여수', ja: '麗水', en: 'Yeosu', 'zh-CN': '丽水', 'zh-TW': '麗水' } },
    ],
  },
  {
    id: 'gyeongbuk',
    name: { ko: '경상북도', ja: '慶尚北道', en: 'Gyeongsangbuk-do', 'zh-CN': '庆尚北道', 'zh-TW': '慶尚北道' },
    emoji: '🏛️',
    cities: [
      { id: 'gyeongju', name: { ko: '경주', ja: '慶州', en: 'Gyeongju', 'zh-CN': '庆州', 'zh-TW': '慶州' } },
      { id: 'andong', name: { ko: '안동', ja: '安東', en: 'Andong', 'zh-CN': '安东', 'zh-TW': '安東' } },
    ],
  },
  {
    id: 'gyeongnam',
    name: { ko: '경상남도', ja: '慶尚南道', en: 'Gyeongsangnam-do', 'zh-CN': '庆尚南道', 'zh-TW': '慶尚南道' },
    emoji: '🌊',
    cities: [
      { id: 'tongyeong', name: { ko: '통영', ja: '統営', en: 'Tongyeong', 'zh-CN': '统营', 'zh-TW': '統營' } },
    ],
  },
  {
    id: 'jeju',
    name: { ko: '제주특별자치도', ja: '済州特別自治道', en: 'Jeju', 'zh-CN': '济州特别自治道', 'zh-TW': '濟州特別自治道' },
    emoji: '🏝️',
    cities: [
      { id: 'jeju', name: { ko: '제주', ja: '済州', en: 'Jeju', 'zh-CN': '济州', 'zh-TW': '濟州' } },
    ],
  },
  {
    id: 'national',
    name: { ko: '🇰🇷 전국 (한국 전통)', ja: '🇰🇷 全国 (韓国伝統)', en: '🇰🇷 Nationwide (Korean Traditional)', 'zh-CN': '🇰🇷 全国 (韩国传统)', 'zh-TW': '🇰🇷 全國 (韓國傳統)' },
    emoji: '🇰🇷',
    cities: [
      { id: 'national', name: { ko: '한국 전통', ja: '韓国伝統', en: 'Korean Traditional', 'zh-CN': '韩国传统', 'zh-TW': '韓國傳統' } },
    ],
  },
]
