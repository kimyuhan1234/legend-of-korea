/**
 * Phase B patch — 운영자 검수 결과 적용 (selected: string → array).
 *
 * 입력:  data/dupe-photos-mapping.json (Phase B 산출)
 * 출력:  data/dupe-photos-mapping.json (in-place)
 *
 * 변경
 *   - selected 필드 타입: string → string[]
 *   - 다중 후보 4 건 → candidates 전체를 selected 로
 *   - 3 순위 16 건 → candidates 전체를 selected 로
 *   - no_match 6 건 → 개별 매핑 또는 discarded
 *   - matched 1순위 단일 33 건 → selected 를 array 로 wrap
 *
 * 실행: node scripts/patch-dupe-photos-mapping.mjs
 * idempotent — 재실행 시 selected 가 이미 array 면 변경 없음.
 */

import { readFileSync, writeFileSync } from 'node:fs'

const PATH = 'data/dupe-photos-mapping.json'
const data = JSON.parse(readFileSync(PATH, 'utf8'))

// 그룹 2 — 단일 매칭 (filename → selected array)
const TIER3_SINGLE = {
  '과일모찌.jpeg': ['cheonan-fruit-mochi'],
  '막걸리빵.jpeg': ['cheonan-makgeolli-ppang'],
  '볏집_삼겹살구이_202605011702.jpeg': ['seoul-samgyeopsal'],
  '보리밥정식.jpeg': ['cheonan-boribap-jeongsik'],
  '빈대떡_202605011707.jpeg': ['seoul-bindaetteok'],
  '빠가사리.jpeg': ['national-spicy-catfish'],
  '숯불닭갈비.jpeg': ['cheonan-charcoal-dakgalbi'],
  '제주흑돼지구이_202605011707.jpeg': ['jeju-black-pork'],
  '조선시대_임금님_수라상_202605011701.jpeg': ['icheon-royal-table'],
  '해장국_202605011705.jpeg': ['gyeongju-haejangguk'],
  // 누룽지_삼계탕 → 누룽지 백숙 (사용자 결정)
  '누룽지_삼계탕.jpeg': ['yongin-nurungji-baeksuk'],
}

// no_match 처리
const NO_MATCH_RESOLUTIONS = {
  '연잎정식.jpeg': { selected: ['cheonan-lotus-rice'], status: 'matched' },
  '치킨맥주_202605011807.jpeg': { selected: ['seoul-chimaek'], status: 'matched' },
  '전주식_들깨_칼국수_202605011701.jpeg': { selected: ['jeonju-kalguksu'], status: 'matched' },
  '사시미_202605011809.jpeg': { selected: ['busan-hwae'], status: 'matched' },
  '식빵토스트_202605011808.jpeg': { selected: null, status: 'discarded' },
  '카페_디저트_202605011702.jpeg': { selected: null, status: 'discarded' },
}

let stats = { matched: 0, needs_review: 0, no_match: 0, discarded: 0, noise: 0, patched: 0 }

const newData = data.map((entry) => {
  const fn = entry.filename

  // noise — 그대로
  if (entry.status === 'noise') {
    stats.noise++
    return entry
  }

  // no_match 해결
  if (NO_MATCH_RESOLUTIONS[fn]) {
    const r = NO_MATCH_RESOLUTIONS[fn]
    stats.patched++
    if (r.status === 'matched') stats.matched++
    else if (r.status === 'discarded') stats.discarded++
    return { ...entry, selected: r.selected, status: r.status }
  }

  // 그룹 2 단일 매칭 (3 순위 → 사용자 결정)
  if (TIER3_SINGLE[fn]) {
    stats.patched++
    stats.matched++
    return { ...entry, selected: TIER3_SINGLE[fn], status: 'matched' }
  }

  // 1 순위 단일 (이미 matched 상태) — selected 를 array 로 wrap
  if (entry.matchPriority === 1 && entry.status === 'matched') {
    const sel = Array.isArray(entry.selected) ? entry.selected : (entry.selected ? [entry.selected] : [])
    stats.matched++
    return { ...entry, selected: sel }
  }

  // 1 순위 다중 후보 (4 건) → candidates 전부 → matched
  if (entry.matchPriority === 1 && entry.status === 'needs_review') {
    const sel = entry.candidates.map((c) => c.foodId)
    stats.patched++
    stats.matched++
    return { ...entry, selected: sel, status: 'matched' }
  }

  // 3 순위 다중 후보 (그룹 3) → candidates 전부 → matched
  if (entry.matchPriority === 3) {
    // 단, TIER3_SINGLE 에 명시된 것은 위에서 처리됨 (남은 건 다중 후보)
    const sel = entry.candidates.map((c) => c.foodId)
    stats.patched++
    stats.matched++
    return { ...entry, selected: sel, status: 'matched' }
  }

  // 그 외 (no_match 처리 누락 등)
  if (entry.status === 'no_match') {
    stats.no_match++
  } else if (entry.status === 'needs_review') {
    stats.needs_review++
  }
  return entry
})

writeFileSync(PATH, JSON.stringify(newData, null, 2) + '\n')

console.log('=== Phase B patch 결과 ===')
console.log(`patched      : ${stats.patched}`)
console.log(`matched 합계 : ${stats.matched}`)
console.log(`needs_review : ${stats.needs_review}`)
console.log(`no_match     : ${stats.no_match}`)
console.log(`discarded    : ${stats.discarded}`)
console.log(`noise        : ${stats.noise}`)
console.log(`Output       : ${PATH}`)
