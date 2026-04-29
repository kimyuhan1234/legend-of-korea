/**
 * Phase 7 Step 2 (보조) — region-corrections.json 1 차 초안 자동 생성.
 *
 * 입력
 *   - data/food-region-audit.json   (Step 1 산출)
 *   - lib/data/hansik-enriched.json (한식진흥원 매칭 — category / desc_ko)
 *   - lib/data/regions-hierarchy.ts (현재 광역 목록 — 신규 도시 후보 vs 기존 구분)
 *
 * 출력
 *   - data/region-corrections.draft.json
 *
 * 알고리즘 (Phase A → B → C → D)
 *   A. 후보 도시 신호 카운트 (이름 keyword + hansik desc 광역 멘션 + 일반 상식)
 *   B. 임계치 (THRESHOLD=3) 적용 → 신규 광역 채택 / 미달 → national 으로 묶음
 *   C. 항목별 분류 (삭제 → 향토 → national → 보존 우선순위)
 *   D. 메타 + corrections JSON 출력
 *
 * 사용자가 검토 후 data/region-corrections.json 으로 rename + 정정.
 *
 * 실행: node scripts/draft-region-corrections.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const AUDIT_PATH = 'data/food-region-audit.json'
const ENRICHED_PATH = 'lib/data/hansik-enriched.json'
const HIERARCHY_PATH = 'lib/data/regions-hierarchy.ts'
const OUTPUT_PATH = 'data/region-corrections.draft.json'

const THRESHOLD = 3 // 신규 광역 채택 최소 음식 수

// ─────────────────────────────────────────────────────────────
// 키워드 사전
// ─────────────────────────────────────────────────────────────

// 기존 + 신규 후보 도시 — 한국어 이름 → city id.
// 이름에 이 키워드가 prefix/포함되면 강한 향토 신호.
const CITY_KEYWORDS = {
  // 기존 (regions-hierarchy.ts)
  서울: 'seoul',
  부산: 'busan',
  용인: 'yongin',
  이천: 'icheon',
  속초: 'sokcho',
  천안: 'cheonan',
  전주: 'jeonju',
  여수: 'yeosu',
  경주: 'gyeongju',
  안동: 'andong',
  통영: 'tongyeong',
  제주: 'jeju',
  // 신규 후보 — 임계치 통과 시 광역 추가
  춘천: 'chuncheon',
  수원: 'suwon',
  강릉: 'gangneung',
  광주: 'gwangju',
  대구: 'daegu',
  대전: 'daejeon',
  목포: 'mokpo',
  포항: 'pohang',
  군산: 'gunsan',
  순천: 'suncheon',
  익산: 'iksan',
  울산: 'ulsan',
  인천: 'incheon',
  김해: 'gimhae',
  남원: 'namwon',
  공주: 'gongju',
  부여: 'buyeo',
  진주: 'jinju',
  마산: 'masan',
  의정부: 'uijeongbu',
  평양: 'pyongyang',
  개성: 'gaeseong',
  함흥: 'hamheung',
}

// 도시 keyword 오탐 방지 — 동음이의 (예: "대구" = 도시 vs 생선 大口).
// 정규식 매칭 시 해당 keyword 의 도시 신호 무효화.
const CITY_KEYWORD_EXCLUSIONS = {
  대구: [/대구탕/, /대구회/, /대구찜/, /물대구/, /대구뽈/, /대구알/, /대구포/],
  // 추가 충돌 발견 시 여기 확장
}

// 기존 광역 (regions-hierarchy.ts 에 이미 존재) — 신규 임계치 검사 제외.
const EXISTING_CITIES = new Set([
  'seoul',
  'busan',
  'yongin',
  'icheon',
  'sokcho',
  'cheonan',
  'jeonju',
  'yeosu',
  'gyeongju',
  'andong',
  'tongyeong',
  'jeju',
])

// 광역 (도) 멘션 — hansik desc_ko 본문에서 광역명 발견 시 해당 광역의 도시 신호 가산용.
// 단순 도 멘션은 약한 신호 — 도시 keyword 가 함께 잡혀야 강한 신호.
// (현재 로직에서는 부가 검증 용도로만 사용)
const PROVINCE_KEYWORDS = [
  '강원도',
  '경기도',
  '충청남도',
  '충청북도',
  '전라남도',
  '전라북도',
  '경상남도',
  '경상북도',
  '제주도',
  '제주특별자치도',
]

// 명백한 전국 한식 — 이름이 정확히 이 단어이거나 "{국가}식" 류면 national.
const NATIONAL_NAMES = new Set([
  '김밥',
  '떡국',
  '떡볶이',
  '갈비탕',
  '삼계탕',
  '불고기',
  '제육볶음',
  '김치찌개',
  '된장찌개',
  '한정식',
  '한과',
  '약과',
  '강정',
  '정과',
  '만두',
  '잡채',
  '비빔밥',
  '김치',
  '깍두기',
  '라면',
  '칼국수',
  '순두부찌개',
  '갈비',
  '갈비찜',
  '냉면',
  '국밥',
  '해장국',
  '죽',
  '전',
  '파전',
  '튀김',
  '족발',
  '보쌈',
  '곱창',
  '막창',
  '닭갈비', // 단 "춘천닭갈비" 는 이미 city keyword 우선 룰로 chuncheon
  '오징어볶음',
])

// 외국 음식 keyword — 이름에 이 단어가 포함되면 delete 후보.
const FOREIGN_KEYWORDS = ['버거', '피자', '파스타', '스파게티', '라멘', '타코', '부리또', '핫도그', '베이글', '바게트', '바게뜨', '도넛', '크루아상', '리조또', '라자냐']

// ─────────────────────────────────────────────────────────────
// 입력 로드
// ─────────────────────────────────────────────────────────────

if (!existsSync(AUDIT_PATH)) {
  console.error(`[error] ${AUDIT_PATH} 부재. 먼저 audit-food-regions.mjs 실행.`)
  process.exit(1)
}
const audit = JSON.parse(readFileSync(AUDIT_PATH, 'utf8'))

const enriched = existsSync(ENRICHED_PATH) ? JSON.parse(readFileSync(ENRICHED_PATH, 'utf8')) : []
const enrichedMap = new Map(enriched.map((e) => [e.id, e]))

// ─────────────────────────────────────────────────────────────
// 신호 추출 함수
// ─────────────────────────────────────────────────────────────

/**
 * 이름에 도시 keyword 가 있는지 확인 → city id 반환 (없으면 null).
 * 가장 긴 keyword 부터 검사 (예: "수원" vs "수" 충돌 방지 — 사실 한글이라 문제 없지만 안전).
 */
function detectCityFromName(name_ko) {
  const sortedKeys = Object.keys(CITY_KEYWORDS).sort((a, b) => b.length - a.length)
  for (const k of sortedKeys) {
    if (!name_ko.includes(k)) continue
    const exclusions = CITY_KEYWORD_EXCLUSIONS[k] || []
    if (exclusions.some((re) => re.test(name_ko))) continue
    return { city: CITY_KEYWORDS[k], keyword: k }
  }
  return null
}

/**
 * hansik desc_ko 에서 도시 keyword 검출 — 보조 신호.
 */
function detectCityFromDesc(desc_ko) {
  if (!desc_ko) return null
  const sortedKeys = Object.keys(CITY_KEYWORDS).sort((a, b) => b.length - a.length)
  for (const k of sortedKeys) {
    if (!desc_ko.includes(k)) continue
    const exclusions = CITY_KEYWORD_EXCLUSIONS[k] || []
    if (exclusions.some((re) => re.test(desc_ko))) continue
    return { city: CITY_KEYWORDS[k], keyword: k }
  }
  return null
}

/**
 * 이름이 명백한 전국 한식인지.
 * 도시 prefix 가 없고 (이미 detectCityFromName 으로 걸러짐) 정확한 일반명이면 true.
 */
function isNationalByName(name_ko) {
  // 정규화 — 공백/괄호 제거
  const norm = name_ko.replace(/\s+/g, '').replace(/\([^)]*\)/g, '')
  // 정확 일치
  if (NATIONAL_NAMES.has(norm)) return true
  // "전주식 칼국수" 같은 "{지역}식 X" 는 도시 keyword 가 이미 잡았을 것
  // 일반 한식이 다른 단어 합성된 경우 (예: "산채비빔밥" — 비빔밥의 변형) → false (보존)
  return false
}

function isForeign(name_ko) {
  return FOREIGN_KEYWORDS.some((k) => name_ko.includes(k))
}

/**
 * 식품 1 개의 최종 city 신호 결정.
 * 우선순위: 외국 → 이름 도시 → desc 도시 + 같은 광역 — → 일반 한식 → 보존.
 */
function classify(food) {
  const e = enrichedMap.get(food.id)
  const desc_ko = e?.hansik?.desc_ko || food.hansik_desc || ''
  const category = e?.hansik?.category || ''

  // 1) 외국 음식
  if (isForeign(food.name_ko)) {
    return { decision: 'delete', confidence: 'high', reason: `외국 음식 keyword 매칭 (${FOREIGN_KEYWORDS.find((k) => food.name_ko.includes(k))})` }
  }

  // 2) 이름에 도시 keyword — 가장 강한 향토 신호
  const fromName = detectCityFromName(food.name_ko)
  if (fromName) {
    const descMatch = detectCityFromDesc(desc_ko)
    const reasonBits = [`이름에 "${fromName.keyword}" 명시`]
    let confidence = 'medium'
    if (descMatch && descMatch.city === fromName.city) {
      reasonBits.push(`한식진흥원 desc 도 "${descMatch.keyword}" 멘션`)
      confidence = 'high'
    }
    return {
      decision: 'city',
      city: fromName.city,
      confidence,
      reason: reasonBits.join(' + '),
    }
  }

  // 3) desc 에 도시 keyword (이름에는 없음) — 약한 향토 신호
  const fromDesc = detectCityFromDesc(desc_ko)
  if (fromDesc) {
    return {
      decision: 'city',
      city: fromDesc.city,
      confidence: 'medium',
      reason: `한식진흥원 desc 에 "${fromDesc.keyword}" 멘션 (이름에는 없음)`,
    }
  }

  // 4) 명백한 전국 한식 (이름이 일반명)
  if (isNationalByName(food.name_ko)) {
    return {
      decision: 'national',
      confidence: 'high',
      reason: `명백한 전국 한식 (정확 일치: "${food.name_ko}")`,
    }
  }

  // 5) category 신호만 — corrections 아님, audit_hints 로 분리 (사용자 검증 후보)
  if (category && !PROVINCE_KEYWORDS.some((p) => desc_ko.includes(p))) {
    return {
      decision: 'hint',
      confidence: 'low',
      reason: `한식진흥원 category="${category}" + 광역 멘션 없음 — 향토 가능성 검증 필요`,
    }
  }

  // 6) 보존
  return { decision: 'keep', confidence: 'low', reason: '신호 없음' }
}

// ─────────────────────────────────────────────────────────────
// Phase A — 후보 도시 신호 카운트
// ─────────────────────────────────────────────────────────────

const classifications = audit.map((f) => ({ food: f, result: classify(f) }))

// 신규 후보 도시별 카운트 (기존 도시 제외)
const candidate_cities = {}
for (const { result } of classifications) {
  if (result.decision !== 'city') continue
  if (EXISTING_CITIES.has(result.city)) continue
  // 기존 도시면 임계치 검사 무관 — 카운트 안 함
  candidate_cities[result.city] = (candidate_cities[result.city] || 0) + 1
}

// ─────────────────────────────────────────────────────────────
// Phase B — 임계치 적용
// ─────────────────────────────────────────────────────────────

const new_regions_to_add = []
const below_threshold_to_national = {}
for (const [city, count] of Object.entries(candidate_cities)) {
  if (count >= THRESHOLD) new_regions_to_add.push(city)
  else below_threshold_to_national[city] = count
}
new_regions_to_add.sort()

// ─────────────────────────────────────────────────────────────
// Phase C — corrections 생성
// ─────────────────────────────────────────────────────────────

function rebuildId(oldId, newRegion) {
  // "{old-region}-{rest}" → "{newRegion}-{rest}"
  // old-region 이 없으면 prefix 추가
  const m = oldId.match(/^([^-]+)-(.+)$/)
  if (m) return `${newRegion}-${m[2]}`
  return `${newRegion}-${oldId}`
}

const corrections = {}
const audit_hints = { category_only_no_region_mention: [] }
const summary = { high: 0, medium: 0, low: 0, delete: 0, unchanged: 0, total_corrections: 0, hints: 0 }

for (const { food, result } of classifications) {
  if (result.decision === 'delete') {
    corrections[food.id] = { delete: true, reason: result.reason, confidence: result.confidence }
    summary.delete++
    summary[result.confidence]++
    summary.total_corrections++
    continue
  }

  if (result.decision === 'hint') {
    audit_hints.category_only_no_region_mention.push({
      id: food.id,
      current_region: food.region,
      name_ko: food.name_ko,
      hansik_category: enrichedMap.get(food.id)?.hansik?.category || '',
      hint: result.reason,
    })
    summary.hints++
    continue
  }

  if (result.decision === 'keep') {
    summary.unchanged++
    continue
  }

  // city 결정 — 신규 후보 임계치 검사
  let targetRegion
  let extraNote = null
  if (result.decision === 'city') {
    if (EXISTING_CITIES.has(result.city) || new_regions_to_add.includes(result.city)) {
      targetRegion = result.city
    } else {
      // 임계치 미달 → national 로 묶고 note
      targetRegion = 'national'
      extraNote = `후보 광역: ${result.city} (현재 ${candidate_cities[result.city]}개, 임계치 ${THRESHOLD} 미달, 추후 ${result.city} 신설 시 이동)`
    }
  } else if (result.decision === 'national') {
    targetRegion = 'national'
  }

  // 변경 없음 (현재 region 과 동일) — corrections 에 미포함
  if (targetRegion === food.region) {
    summary.unchanged++
    continue
  }

  const newId = rebuildId(food.id, targetRegion)
  const entry = {
    newRegion: targetRegion,
    newId: newId !== food.id ? newId : undefined,
    reason: result.reason,
    confidence: result.confidence,
  }
  if (extraNote) entry.note = extraNote
  // undefined 정리
  if (entry.newId === undefined) delete entry.newId
  corrections[food.id] = entry
  summary[result.confidence]++
  summary.total_corrections++
}

// ─────────────────────────────────────────────────────────────
// Phase D — 출력
// ─────────────────────────────────────────────────────────────

const out = {
  _meta: {
    generated_at: new Date().toISOString(),
    total_audited: audit.length,
    threshold: THRESHOLD,
    candidate_cities,
    new_regions_to_add,
    below_threshold_to_national,
    summary: {
      total_corrections: summary.total_corrections,
      high_confidence: summary.high,
      medium_confidence: summary.medium,
      low_confidence: summary.low,
      delete: summary.delete,
      unchanged: summary.unchanged,
      audit_hints: summary.hints,
    },
    notes: [
      '_meta.candidate_cities — 신규 후보 도시별 향토 신호 음식 수 (기존 12 개 도시 제외).',
      `_meta.new_regions_to_add — 임계치 ${THRESHOLD}+ 통과한 신규 광역. Step 3 에서 regions-hierarchy.ts 에 수동 추가 필요.`,
      '_meta.below_threshold_to_national — 임계치 미달 도시. 해당 음식은 national 로 분류 + note 에 후보 광역 명시.',
      'corrections — 확신 있는 변경 (high/medium/delete 만). 자동 적용 대상.',
      'audit_hints — 자동 변경 X. 사용자가 한국관광공사/나무위키로 검증 후 향토면 corrections 에 수동 추가.',
      'corrections + audit_hints 어디에도 없는 음식 = 신호 부족, 보존.',
    ],
  },
  corrections,
  audit_hints,
}

writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2) + '\n')

// ─────────────────────────────────────────────────────────────
// 콘솔 요약
// ─────────────────────────────────────────────────────────────

console.log(`\n=== Phase 7 Draft 결과 ===`)
console.log(`총 audit: ${audit.length}개`)
console.log(`임계치: ${THRESHOLD}`)

console.log(`\n[후보 신규 광역 카운트]`)
const sortedCands = Object.entries(candidate_cities).sort((a, b) => b[1] - a[1])
if (sortedCands.length === 0) console.log('  (없음)')
for (const [city, n] of sortedCands) {
  const mark = n >= THRESHOLD ? '✓ (신규 광역 채택)' : '✗ (임계치 미달 → national)'
  console.log(`  ${city.padEnd(15)} ${String(n).padStart(3)} ${mark}`)
}

console.log(`\n[변경 제안 — corrections (자동 적용)]`)
console.log(`  high confidence : ${summary.high}`)
console.log(`  medium          : ${summary.medium}`)
console.log(`  삭제            : ${summary.delete}`)
console.log(`  총 corrections  : ${summary.total_corrections}`)

console.log(`\n[검증 후보 — audit_hints (자동 X, 사용자 검증)]`)
console.log(`  category_only_no_region_mention: ${audit_hints.category_only_no_region_mention.length}개`)
console.log(`  ※ 한국관광공사/나무위키로 검증 후 향토면 corrections 에 수동 추가`)

console.log(`\n[변경 없음 (신호 부족 보존)]: ${summary.unchanged}`)

if (new_regions_to_add.length > 0) {
  console.log(`\n[신규 광역 추가 필요 — Step 3 에서 처리]`)
  for (const c of new_regions_to_add) console.log(`  - ${c} (${candidate_cities[c]}개)`)
  console.log(`  ※ regions-hierarchy.ts 수동 추가 필요`)
}

console.log(`\nOutput: ${OUTPUT_PATH}`)
console.log(`\n다음 단계`)
console.log(`  1. ${OUTPUT_PATH} 검토 (high 빠르게 스킵, medium/low 집중 검증)`)
console.log(`  2. 한국관광공사 + 나무위키 대조`)
console.log(`  3. data/region-corrections.json 으로 rename + 정정`)
console.log(`  4. "Step 4 진행" 알림`)
