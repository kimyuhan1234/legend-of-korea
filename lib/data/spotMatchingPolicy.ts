/**
 * Phase 2 SPOT 이미지 자동 매칭 — region prefix 보정 정책.
 *
 * 일부 spot 명은 generic (예: "케이블카", "중앙시장") 또는 동명 다수 (예: "송악산"
 * = 제주/대전 동명) — TourAPI searchKeyword2 매칭률을 높이기 위해 region prefix
 * 자동 부착. 운영자 검수 11건 (Tier 1 + Tier 2).
 *
 * Tier 1 (4건, 운영자 1차안): 케이블카 / 스파플러스 / 황리단길 / 한옥마을 골목길
 * Tier 2 (7건, Claude 추가 발견): 남부시장 야시장 / 중앙시장 / 아라리오 갤러리 /
 *   효양산 / 봉황대 / 송악산 / 우도
 *
 * 표기 정책 (운영자 결정):
 *  - ko / en : `{region} {spot}` — 띄어쓰기
 *  - ja / zh-CN / zh-TW : `{region}{spot}` — 붙여쓰기 (각 언어 관습)
 */

import type { Locale } from './parseRouteSpots'

export type RegionId =
  | 'jeonju'
  | 'tongyeong'
  | 'cheonan'
  | 'yongin'
  | 'icheon'
  | 'gyeongju'
  | 'busan'
  | 'seoul'
  | 'jeju'

type I18n5 = Record<Locale, string>

/**
 * 9 region × 5 locale = 45 매핑.
 * courses.ts 의 region 필드 ('jeonju' 등) 와 동일 키 — 별도 courseSpotMap 불필요.
 */
export const REGION_PREFIX: Record<RegionId, I18n5> = {
  jeonju:    { ko: '전주', ja: '全州',    en: 'Jeonju',    'zh-CN': '全州', 'zh-TW': '全州' },
  tongyeong: { ko: '통영', ja: '統営',    en: 'Tongyeong', 'zh-CN': '统营', 'zh-TW': '統營' },
  cheonan:   { ko: '천안', ja: '天安',    en: 'Cheonan',   'zh-CN': '天安', 'zh-TW': '天安' },
  yongin:    { ko: '용인', ja: '龍仁',    en: 'Yongin',    'zh-CN': '龙仁', 'zh-TW': '龍仁' },
  icheon:    { ko: '이천', ja: '利川',    en: 'Icheon',    'zh-CN': '利川', 'zh-TW': '利川' },
  gyeongju:  { ko: '경주', ja: '慶州',    en: 'Gyeongju',  'zh-CN': '庆州', 'zh-TW': '慶州' },
  busan:     { ko: '부산', ja: '釜山',    en: 'Busan',     'zh-CN': '釜山', 'zh-TW': '釜山' },
  seoul:     { ko: '서울', ja: 'ソウル', en: 'Seoul',     'zh-CN': '首尔', 'zh-TW': '首爾' },
  jeju:      { ko: '제주', ja: '済州',    en: 'Jeju',      'zh-CN': '济州', 'zh-TW': '濟州' },
}

/**
 * 보정 대상 spot 명단 (Tier 1+2 = 11건 × 5 locale).
 * Set 형태로 정확 일치 검색.
 *
 * 일부 entry 는 5 locale 중복 (예: "全州" ko/zh-CN/zh-TW 공유) — Set 자체가 중복 제거.
 */
export const BOOST_TARGETS: ReadonlySet<string> = new Set([
  // Tier 1 — 케이블카
  '케이블카', 'ケーブルカー', 'Cable car', '缆车', '纜車',
  // Tier 1 — 스파플러스 (5 locale 동일 표기 — Set 자동 중복 제거)
  '스파플러스', 'スパプラス', 'Spaplus',
  // Tier 1 — 황리단길
  '황리단길', '皇理団キル', 'Hwangnidan-gil', '皇理团街', '皇理團街',
  // Tier 1 — 한옥마을 골목길
  '한옥마을 골목길', '韓屋村の路地', 'Hanok Village alleys', '韩屋村小巷', '韓屋村小巷',
  // Tier 2 — 남부시장 야시장
  '남부시장 야시장', '南部市場の夜市', 'Nambu Market night market', '南部市场夜市', '南部市場夜市',
  // Tier 2 — 중앙시장
  '중앙시장', '中央市場', 'Jungang Market', '中央市场',
  // Tier 2 — 아라리오 갤러리
  '아라리오 갤러리', 'アラリオギャラリー', 'Arario Gallery', '阿拉里奥美术馆', '阿拉里奧美術館',
  // Tier 2 — 효양산
  '효양산', '孝養山', 'Hyoyangsan', '孝养山',
  // Tier 2 — 봉황대
  '봉황대', '鳳凰台', 'Bonghwangdae', '凤凰台',
  // Tier 2 — 송악산
  '송악산', '松岳山', 'Songaksan',
  // Tier 2 — 우도
  '우도', '牛島', 'Udo Island', '牛岛',
])

/**
 * region prefix 와 spot 사이 구분자 — locale 별 표기 정책 (운영자 결정).
 *  - ko / en : 띄어쓰기 1칸
 *  - ja / zh-CN / zh-TW : 무공백 (각 언어 관습)
 */
function joinerFor(locale: Locale): string {
  return locale === 'ko' || locale === 'en' ? ' ' : ''
}

/**
 * spotName 이 BOOST_TARGETS 에 일치하면 region prefix 부착, 아니면 그대로 반환.
 *
 * @param spotName parseRouteSpots 결과의 spot.name (괄호 제거 후)
 * @param regionId courses.ts 의 region ('jeonju' 등)
 * @param locale 5 locale 중 하나
 * @returns TourAPI searchKeyword2 호출에 사용할 검색어
 *
 * 예시:
 *  buildSearchKeyword('케이블카', 'tongyeong', 'ko')   → '통영 케이블카'
 *  buildSearchKeyword('케이블카', 'tongyeong', 'ja')   → '統営ケーブルカー' (X — locale='ja' 면 spotName 도 ja)
 *  buildSearchKeyword('ケーブルカー', 'tongyeong', 'ja') → '統営ケーブルカー'
 *  buildSearchKeyword('경기전', 'jeonju', 'ko')          → '경기전' (BOOST 대상 X)
 *
 * 주의: locale 와 spotName 의 언어가 일치한다는 전제 (parseRouteSpots 가 동일 locale
 * 텍스트에서 분해한 spot 만 입력으로 받음).
 */
export function buildSearchKeyword(
  spotName: string,
  regionId: RegionId | string,
  locale: Locale,
): string {
  const trimmed = spotName.trim()
  if (!BOOST_TARGETS.has(trimmed)) return trimmed
  if (!isRegionId(regionId)) return trimmed
  const prefix = REGION_PREFIX[regionId][locale]
  return `${prefix}${joinerFor(locale)}${trimmed}`
}

function isRegionId(value: string): value is RegionId {
  return value in REGION_PREFIX
}

/**
 * regionId 외부 입력 검증 — REGION_PREFIX 키 활용 (DRY).
 * API route 의 query param 검증에 사용.
 */
export function isValidRegionId(value: unknown): value is RegionId {
  return typeof value === 'string' && value in REGION_PREFIX
}

/**
 * 5 locale 외부 입력 검증 — parseRouteSpots 의 Locale 타입과 동일 union.
 * i18n.ts 의 locales 와 동일 값 — 코드 진입점에서 사용 시 i18n.ts 의 locales 직접
 * 재사용 가능. API route 같은 외부 입력 검증 진입점에서 단순 헬퍼로 활용.
 */
export const VALID_LOCALES: readonly Locale[] = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW']

export function isValidLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (VALID_LOCALES as readonly string[]).includes(value)
}
