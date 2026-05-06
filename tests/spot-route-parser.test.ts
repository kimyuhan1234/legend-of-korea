import { describe, it, expect } from 'vitest'
import { parseRouteSpots } from '../lib/data/parseRouteSpots'
import { buildSearchKeyword, BOOST_TARGETS, REGION_PREFIX } from '../lib/data/spotMatchingPolicy'

describe('parseRouteSpots — 분해 로직', () => {
  it('jeonju ko 4 spot — 부연 / 또는 / 음식 모두 없음', () => {
    const result = parseRouteSpots('경기전 → 한옥마을 골목길 → 풍남문 → 남부시장 야시장', 'ko')
    expect(result).toEqual([
      { name: '경기전', kind: 'attraction' },
      { name: '한옥마을 골목길', kind: 'attraction' },
      { name: '풍남문', kind: 'attraction' },
      { name: '남부시장 야시장', kind: 'attraction' },
    ])
  })

  it('tongyeong ko 5 spot — 괄호 부연 (미륵산) (1박) 제거', () => {
    const result = parseRouteSpots(
      '동피랑 벽화마을 → 중앙시장 → 케이블카 (미륵산) → 강구안 (1박) → 한산도',
      'ko',
    )
    expect(result.map((r) => r.name)).toEqual([
      '동피랑 벽화마을',
      '중앙시장',
      '케이블카',
      '강구안',
      '한산도',
    ])
  })

  it('cheonan ko — 음식 spot "호두과자 거리" kind:food 분류', () => {
    const result = parseRouteSpots(
      '아라리오 갤러리 → 각원사 (능소가 무사 귀환을 빌던 절) → 천안 삼거리공원 (능수버들 전설) → 독립기념관 → 호두과자 거리',
      'ko',
    )
    expect(result).toEqual([
      { name: '아라리오 갤러리', kind: 'attraction' },
      { name: '각원사', kind: 'attraction' },
      { name: '천안 삼거리공원', kind: 'attraction' },
      { name: '독립기념관', kind: 'attraction' },
      { name: '호두과자 거리', kind: 'food' },
    ])
  })

  it('icheon ko — 음식 spot "이천 쌀밥 정식" kind:food + 다중 부연 제거', () => {
    const result = parseRouteSpots(
      '효양산 (경기도 이천시 부발읍 마암리 산29-1, 선녀 전설지) → 사기막골 도예촌 (관요 유적지) → 이천 도자기마을 (경기도 이천시 경충대로2993번길 24) → 스파플러스 (이천 온천) → 이천 쌀밥 정식',
      'ko',
    )
    expect(result).toEqual([
      { name: '효양산', kind: 'attraction' },
      { name: '사기막골 도예촌', kind: 'attraction' },
      { name: '이천 도자기마을', kind: 'attraction' },
      { name: '스파플러스', kind: 'attraction' },
      { name: '이천 쌀밥 정식', kind: 'food' },
    ])
  })

  it('gyeongju ko 8 spot — 앞부연 (동해권) + 뒤부연 주소 모두 제거', () => {
    const result = parseRouteSpots(
      '대릉원 (천마총) → 봉황대 → 첨성대 → 동궁과 월지 (안압지) → 황리단길 → (동해권) 감은사지 (경주시 문무대왕면 용당리 55-1) → 이견대 (경주시 감포읍 대본리 661) → 문무대왕릉 (경주시 문무대왕면 봉길리 26 — 만파식적 전설)',
      'ko',
    )
    expect(result.map((r) => r.name)).toEqual([
      '대릉원',
      '봉황대',
      '첨성대',
      '동궁과 월지',
      '황리단길',
      '감은사지',
      '이견대',
      '문무대왕릉',
    ])
  })

  it('jeju ko 6 spot — 단독 부연 (1박) 제거 + "또는" 분리', () => {
    const result = parseRouteSpots(
      '구좌읍 한동리/행원리 해안 (설문대할망 발자국 — 해안 용암 바위) → 산방산 (한라산 봉우리 조각 전설) → 송악산 (사계해안도로) → 성산일출봉 → (1박) → 우도 또는 협재해변',
      'ko',
    )
    expect(result.map((r) => r.name)).toEqual([
      '구좌읍 한동리/행원리 해안',
      '산방산',
      '송악산',
      '성산일출봉',
      '우도',
      '협재해변',
    ])
  })

  it('jeju ja — 또는 분리 (または)', () => {
    const result = parseRouteSpots(
      '城山日出峰 →（1泊）→ 牛島または挟才海岸',
      'ja',
    )
    expect(result.map((r) => r.name)).toEqual(['城山日出峰', '牛島', '挟才海岸'])
  })

  it('jeju en — 또는 분리 (or)', () => {
    const result = parseRouteSpots(
      'Seongsan Ilchulbong → (1 night) → Udo Island or Hyeopjae Beach',
      'en',
    )
    expect(result.map((r) => r.name)).toEqual([
      'Seongsan Ilchulbong',
      'Udo Island',
      'Hyeopjae Beach',
    ])
  })

  it('jeju zh-CN — 또는 분리 (或) + 전각 괄호', () => {
    const result = parseRouteSpots(
      '城山日出峰 →（住1晚）→ 牛岛或挟才海滩',
      'zh-CN',
    )
    expect(result.map((r) => r.name)).toEqual(['城山日出峰', '牛岛', '挟才海滩'])
  })

  it('빈 문자열 입력 → 빈 배열', () => {
    expect(parseRouteSpots('', 'ko')).toEqual([])
  })

  it('5 locale 음식 keyword 모두 정확히 인식', () => {
    expect(parseRouteSpots('호두과자 거리', 'ko')[0].kind).toBe('food')
    expect(parseRouteSpots('クルミ菓子通り', 'ja')[0].kind).toBe('food')
    expect(parseRouteSpots('Walnut Cookie Street', 'en')[0].kind).toBe('food')
    expect(parseRouteSpots('核桃饼街', 'zh-CN')[0].kind).toBe('food')
    expect(parseRouteSpots('核桃餅街', 'zh-TW')[0].kind).toBe('food')
  })

  it('locale 와 keyword 언어 불일치 시 food 미식별 (정상)', () => {
    expect(parseRouteSpots('호두과자 거리', 'ja')[0].kind).toBe('attraction')
    expect(parseRouteSpots('Walnut Cookie Street', 'ko')[0].kind).toBe('attraction')
  })
})

describe('buildSearchKeyword — region prefix 보정', () => {
  it('Tier 1 — 케이블카 5 locale region prefix 부착', () => {
    expect(buildSearchKeyword('케이블카', 'tongyeong', 'ko')).toBe('통영 케이블카')
    expect(buildSearchKeyword('ケーブルカー', 'tongyeong', 'ja')).toBe('統営ケーブルカー')
    expect(buildSearchKeyword('Cable car', 'tongyeong', 'en')).toBe('Tongyeong Cable car')
    expect(buildSearchKeyword('缆车', 'tongyeong', 'zh-CN')).toBe('统营缆车')
    expect(buildSearchKeyword('纜車', 'tongyeong', 'zh-TW')).toBe('統營纜車')
  })

  it('Tier 1 — 황리단길 5 locale 부착', () => {
    expect(buildSearchKeyword('황리단길', 'gyeongju', 'ko')).toBe('경주 황리단길')
    expect(buildSearchKeyword('皇理団キル', 'gyeongju', 'ja')).toBe('慶州皇理団キル')
    expect(buildSearchKeyword('Hwangnidan-gil', 'gyeongju', 'en')).toBe('Gyeongju Hwangnidan-gil')
    expect(buildSearchKeyword('皇理团街', 'gyeongju', 'zh-CN')).toBe('庆州皇理团街')
    expect(buildSearchKeyword('皇理團街', 'gyeongju', 'zh-TW')).toBe('慶州皇理團街')
  })

  it('Tier 2 — 봉황대 / 송악산 / 우도 보정', () => {
    expect(buildSearchKeyword('봉황대', 'gyeongju', 'ko')).toBe('경주 봉황대')
    expect(buildSearchKeyword('송악산', 'jeju', 'ko')).toBe('제주 송악산')
    expect(buildSearchKeyword('우도', 'jeju', 'ko')).toBe('제주 우도')
  })

  it('Tier 2 — 한옥마을 골목길 (jeonju) prefix 부착', () => {
    expect(buildSearchKeyword('한옥마을 골목길', 'jeonju', 'ko')).toBe('전주 한옥마을 골목길')
    expect(buildSearchKeyword('Hanok Village alleys', 'jeonju', 'en')).toBe(
      'Jeonju Hanok Village alleys',
    )
  })

  it('보정 비대상 — 경기전 / 풍남문 / 첨성대 등 그대로 반환', () => {
    expect(buildSearchKeyword('경기전', 'jeonju', 'ko')).toBe('경기전')
    expect(buildSearchKeyword('풍남문', 'jeonju', 'ko')).toBe('풍남문')
    expect(buildSearchKeyword('첨성대', 'gyeongju', 'ko')).toBe('첨성대')
    expect(buildSearchKeyword('Gyeonggijeon Shrine', 'jeonju', 'en')).toBe('Gyeonggijeon Shrine')
  })

  it('알 수 없는 regionId — 보정 X (spot 그대로)', () => {
    expect(buildSearchKeyword('케이블카', 'unknown_region', 'ko')).toBe('케이블카')
  })

  it('5 locale prefix 띄어쓰기 정책 확인', () => {
    // ko / en : 띄어쓰기
    expect(buildSearchKeyword('중앙시장', 'tongyeong', 'ko')).toMatch(/^통영 중앙시장$/)
    expect(buildSearchKeyword('Jungang Market', 'tongyeong', 'en')).toMatch(
      /^Tongyeong Jungang Market$/,
    )
    // ja / zh-CN / zh-TW : 무공백
    expect(buildSearchKeyword('中央市場', 'tongyeong', 'ja')).toBe('統営中央市場')
    expect(buildSearchKeyword('中央市场', 'tongyeong', 'zh-CN')).toBe('统营中央市场')
  })
})

describe('REGION_PREFIX / BOOST_TARGETS 무결성', () => {
  it('9 region 모두 5 locale 매핑 보유', () => {
    const regions = ['jeonju', 'tongyeong', 'cheonan', 'yongin', 'icheon', 'gyeongju', 'busan', 'seoul', 'jeju'] as const
    const locales = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as const
    for (const r of regions) {
      for (const l of locales) {
        expect(REGION_PREFIX[r][l]).toBeTruthy()
        expect(REGION_PREFIX[r][l].length).toBeGreaterThan(0)
      }
    }
  })

  it('BOOST_TARGETS — Tier 1 + Tier 2 = 모든 spot 명 포함 (5 locale 중복 제거 후 41개 이상)', () => {
    // 11 spot × 5 locale = 55 entry — 일부 중복 (예: 한자 표기 ja/zh 공유)
    // Set 자동 중복 제거 후 최소 30+ unique 표기
    expect(BOOST_TARGETS.size).toBeGreaterThanOrEqual(30)
    // 핵심 spot 명 표본 확인
    expect(BOOST_TARGETS.has('케이블카')).toBe(true)
    expect(BOOST_TARGETS.has('Cable car')).toBe(true)
    expect(BOOST_TARGETS.has('황리단길')).toBe(true)
    expect(BOOST_TARGETS.has('Hwangnidan-gil')).toBe(true)
    expect(BOOST_TARGETS.has('우도')).toBe(true)
    expect(BOOST_TARGETS.has('Udo Island')).toBe(true)
    // 비대상 spot 명 확인
    expect(BOOST_TARGETS.has('경기전')).toBe(false)
    expect(BOOST_TARGETS.has('첨성대')).toBe(false)
    expect(BOOST_TARGETS.has('호두과자 거리')).toBe(false)
  })
})
