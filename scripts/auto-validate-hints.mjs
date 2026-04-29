/**
 * Phase 7 Step 3 자동화 — audit_hints 78 개 자동 분류 + region-corrections.json 생성.
 *
 * 룰
 *   1. draft.corrections 19 개 그대로 복사
 *   2. audit_hints 78 개 분류
 *      A. 현재 region == 실제 향토 매핑 (PRESERVE_AS_REGIONAL) → 보존 (corrections 추가 X)
 *      B. 명백한 전국 한식 (FORCE_NATIONAL) → corrections 에 national 이동 추가
 *      C. 둘 다 매칭 시 PRESERVE 우선 (지역 정보 보존)
 *      D. 어느 룰에도 안 걸림 → 보존 (보수적 default — 잘못된 이동 < 누락된 정정)
 *
 * 입력:  data/region-corrections.draft.json
 * 출력:  data/region-corrections.json
 *
 * 실행: node scripts/auto-validate-hints.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const DRAFT_PATH = 'data/region-corrections.draft.json'
const OUTPUT_PATH = 'data/region-corrections.json'

// ─────────────────────────────────────────────────────────────
// 룰 사전
// ─────────────────────────────────────────────────────────────

/**
 * 현재 region 이 실제 향토인 경우 → 보존.
 * key: current_region, value: 그 도시 향토임을 시사하는 음식명 keyword 목록.
 * 음식 name_ko 에 keyword 가 부분 일치하면 PRESERVE 적용.
 */
const PRESERVE_AS_REGIONAL = {
  jeonju: ['콩나물국밥', '피순대', '순대국밥', '육회', '청국장', '오모가리', '백반', '한정식', '비빔밥', '모주', '오곡밥', '육회비빔밥', '녹두전'],
  seoul: ['설렁탕', '곰탕', '닭한마리', '감자탕', '깍두기', '족발', '보쌈', '삼겹살', '빈대떡', '광장시장'],
  busan: ['돼지국밥', '밀면', '회', '낙곱새', '동래파전', '해물파전', '호떡', '씨앗호떡', '물떡', '어묵'],
  tongyeong: ['충무김밥', '꿀빵', '굴', '멍게비빔밥', '시락국'],
  jeju: ['흑돼지', '갈치', '고기국수', '몸국', '빙떡', '오메기떡', '한라봉', '보말', '성게', '전복죽', '물회'],
  yeosu: ['갓김치', '서대회', '게장', '장어'],
  sokcho: ['닭강정', '오징어순대', '아바이순대', '함흥냉면'],
  cheonan: ['호두과자', '병천순대', '천안 삼거리'],
  gyeongju: ['황남빵', '교동법주', '쌈밥', '교리'],
  andong: ['간고등어', '헛제삿밥', '안동소주', '문어'],
  yongin: ['백암순대'],
  icheon: ['쌀밥', '도자기', '게걸무'],
}

/**
 * 명백한 전국 한식 — 음식 name_ko 에 부분 일치하면 national 이동.
 * 단 PRESERVE 우선 — 지역 prefix 가 있는 변형 (전주비빔밥/안동찜닭) 은 PRESERVE 룰에 잡혀 보존.
 */
const FORCE_NATIONAL = [
  // 일반 밥류 — 지역 변형 (전주비빔밥/교리김밥/충무김밥) 은 PRESERVE 우선으로 보존됨
  '비빔밥',
  '김밥',
  '주먹밥',
  // 일반 면류 — '국수' 단독은 보말칼국수/들깨국수 false positive 위험 → '칼국수' 로 명시
  '잔치국수',
  '비빔국수',
  '냉면',
  '칼국수',
  // 일반 국/탕/찌개
  '미역국',
  '북어국',
  '뭇국',
  '김치국',
  '갈비탕',
  '삼계탕',
  '곰탕',
  '도가니탕',
  '청국장찌개',
  '부대찌개',
  // 구이/볶음
  '돼지갈비',
  '소갈비',
  '낙지볶음',
  '오징어볶음',
  // 전류
  '김치전',
  '부추전',
  '감자전',
  // 떡/한과 — '떡' 단독은 빈대떡/호떡/물떡 false positive 다수 → 정확 단어로 명시
  '인절미',
  '백설기',
  '시루떡',
  '찹쌀떡',
  // 기타
  '잡채',
  '동치미',
  '나박김치',
]

// ─────────────────────────────────────────────────────────────
// 입력 로드
// ─────────────────────────────────────────────────────────────

if (!existsSync(DRAFT_PATH)) {
  console.error(`[error] ${DRAFT_PATH} 부재. 먼저 draft-region-corrections.mjs 실행.`)
  process.exit(1)
}

const draft = JSON.parse(readFileSync(DRAFT_PATH, 'utf8'))
const draftCorrections = draft.corrections || {}
const hints = draft.audit_hints?.category_only_no_region_mention || []

console.log(`[load] draft corrections: ${Object.keys(draftCorrections).length}`)
console.log(`[load] audit_hints: ${hints.length}`)

// ─────────────────────────────────────────────────────────────
// 헬퍼
// ─────────────────────────────────────────────────────────────

function rebuildId(oldId, newRegion) {
  const m = oldId.match(/^([^-]+)-(.+)$/)
  if (m) return `${newRegion}-${m[2]}`
  return `${newRegion}-${oldId}`
}

function matchesPreserve(hint) {
  const keywords = PRESERVE_AS_REGIONAL[hint.current_region]
  if (!keywords) return null
  for (const kw of keywords) {
    if (hint.name_ko.includes(kw)) return kw
  }
  return null
}

function matchesForceNational(hint) {
  for (const kw of FORCE_NATIONAL) {
    if (hint.name_ko.includes(kw)) return kw
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// 분류
// ─────────────────────────────────────────────────────────────

const corrections = { ...draftCorrections }
const breakdown = {
  draft_corrections: Object.keys(draftCorrections).length,
  hints_to_national: 0,
  hints_preserved_regional: 0,
  hints_ambiguous_preserved: 0,
}

const log = []

for (const hint of hints) {
  // PRESERVE 우선
  const preserveKw = matchesPreserve(hint)
  if (preserveKw) {
    breakdown.hints_preserved_regional++
    log.push(`  보존(향토)   : ${hint.id} — "${hint.name_ko}" matches PRESERVE.${hint.current_region}["${preserveKw}"]`)
    continue
  }

  const forceKw = matchesForceNational(hint)
  if (forceKw) {
    // PRESERVE 안 걸림 + FORCE 걸림 → national 이동
    const newId = rebuildId(hint.id, 'national')
    corrections[hint.id] = {
      newRegion: 'national',
      newId: newId !== hint.id ? newId : undefined,
      reason: `전국 한식 (FORCE_NATIONAL 매칭: "${forceKw}")`,
      confidence: 'auto-validated',
    }
    if (corrections[hint.id].newId === undefined) delete corrections[hint.id].newId
    breakdown.hints_to_national++
    log.push(`  → national : ${hint.id} — "${hint.name_ko}" matches FORCE_NATIONAL["${forceKw}"]`)
    continue
  }

  // 어느 룰에도 안 걸림 → 보존 (default safe)
  breakdown.hints_ambiguous_preserved++
  log.push(`  보존(애매)   : ${hint.id} — "${hint.name_ko}"`)
}

// ─────────────────────────────────────────────────────────────
// newId 중복 disambiguate — 같은 음식이 여러 origin region 에서 같은 newId 로 가는 경우
// (예: jeonju-sundubu + gyeongju-sundubu → 둘 다 national-sundubu 충돌)
// 첫 번째는 그대로, 나머지는 origin region suffix 추가
// ─────────────────────────────────────────────────────────────

const usedNewIds = new Set()
const disambiguated = []
for (const [oldId, c] of Object.entries(corrections)) {
  if (!c.newId) continue
  if (!usedNewIds.has(c.newId)) {
    usedNewIds.add(c.newId)
    continue
  }
  const originRegion = oldId.split('-')[0]
  const newCandidate = `${c.newId}-${originRegion}`
  disambiguated.push({ oldId, was: c.newId, now: newCandidate })
  c.newId = newCandidate
  if (c.reason) c.reason += ` [disambiguated from origin=${originRegion}]`
  usedNewIds.add(newCandidate)
}

// ─────────────────────────────────────────────────────────────
// 출력
// ─────────────────────────────────────────────────────────────

const out = {
  _meta: {
    generated_at: new Date().toISOString(),
    source: 'auto-validated from draft (auto-validate-hints.mjs)',
    summary: {
      total_corrections: Object.keys(corrections).length,
      from_draft: breakdown.draft_corrections,
      from_hints_national: breakdown.hints_to_national,
      hints_preserved_regional: breakdown.hints_preserved_regional,
      hints_ambiguous_preserved: breakdown.hints_ambiguous_preserved,
    },
    notes: [
      'corrections — apply-region-corrections.mjs 가 자동 적용할 변경.',
      'audit_hints 중 PRESERVE_AS_REGIONAL / FORCE_NATIONAL 룰에 안 걸린 항목은 보존 (default safe).',
      '베타 출시 후 잘못된 분류 발견 시 추가 정정 (지금 잘못 이동시키는 것보다 안전).',
    ],
  },
  corrections,
}

writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2) + '\n')

// ─────────────────────────────────────────────────────────────
// 콘솔 요약
// ─────────────────────────────────────────────────────────────

console.log(`\n=== Phase 7 Step 3 자동 검증 결과 ===`)
console.log(`audit_hints ${hints.length}개 분류:`)
console.log(`  → corrections 추가 (national 이동) : ${breakdown.hints_to_national}`)
console.log(`  → 보존 (현재 region == 향토)       : ${breakdown.hints_preserved_regional}`)
console.log(`  → 보존 (애매, 안전 default)        : ${breakdown.hints_ambiguous_preserved}`)
console.log(``)
console.log(`최종 corrections: ${breakdown.draft_corrections} (draft) + ${breakdown.hints_to_national} (hints) = ${Object.keys(corrections).length}`)
if (disambiguated.length > 0) {
  console.log(`\n[disambiguated newId 충돌 ${disambiguated.length}건]`)
  for (const d of disambiguated) console.log(`  ${d.oldId}: ${d.was} → ${d.now}`)
}
console.log(`\nOutput: ${OUTPUT_PATH}`)

console.log(`\n[detail log]`)
for (const line of log) console.log(line)

console.log(`\n다음 단계: node scripts/apply-region-corrections.mjs`)
