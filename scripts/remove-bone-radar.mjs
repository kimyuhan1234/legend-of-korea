/**
 * Phase 9.1 — food-health.ts 의 healthRadar 에서 bone 축 제거.
 *
 * Phase 9 cleanup 의 부작용 정정:
 *   - 76 음식 모두 bone:50 default 였음 (radar 시각 무의미)
 *   - bone 은 healthTags 카테고리 필터에만 유지 (11 음식 선별 가능)
 *   - HealthTag union 의 'bone' 은 보존 (필터에서 사용)
 *
 * 변경
 *   1. healthRadar 인터페이스에서 bone 필드 제거 → 5 축
 *   2. 모든 음식 객체 healthRadar 에서 bone:NN 제거
 *
 * 백업: food-health.ts.bak 가 이미 있으면 .bak2 로 신규 생성 (Phase 9 백업 보존).
 * 실행: node scripts/remove-bone-radar.mjs
 * idempotent — 재실행 시 변경 없음.
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'

const PATH = 'lib/data/food-health.ts'
const BAK_PRIMARY = PATH + '.bak'
const BAK_SECONDARY = PATH + '.bak2'

const bakTarget = existsSync(BAK_PRIMARY) ? BAK_SECONDARY : BAK_PRIMARY
copyFileSync(PATH, bakTarget)
console.log(`[backup] ${bakTarget}`)

let src = readFileSync(PATH, 'utf8')
const before = src

// ─────────────────────────────────────────────────────────────
// 1. healthRadar 인터페이스 — bone 필드 제거
// ─────────────────────────────────────────────────────────────

src = src.replace(
  /healthRadar:\s*\{([^}]*)\}/,
  (full, body) => {
    if (!body.includes('bone')) return full
    // 인터페이스만 처리 (number 타입 정의)
    if (!/:\s*number/.test(body)) return full
    const cleaned = body
      .replace(/\bbone:\s*number\s*\n?\s*/g, '')
      .replace(/\n\s*\n/g, '\n')
    return `healthRadar: {${cleaned}}`
  },
)

// ─────────────────────────────────────────────────────────────
// 2. 모든 데이터 객체 healthRadar 에서 bone:NN 제거
//    패턴: ", bone: 50" 또는 "bone: 50, " 등 모든 구분자 케이스 처리
// ─────────────────────────────────────────────────────────────

let radarPatched = 0
src = src.replace(
  /healthRadar:\s*\{([^}]*)\}/g,
  (full, body) => {
    if (!body.includes('bone')) return full
    // 데이터 객체만 (숫자 값)
    if (!/\d/.test(body)) return full

    const map = {}
    const partRe = /(\w+):\s*(\d+)/g
    let mm
    while ((mm = partRe.exec(body)) !== null) map[mm[1]] = Number(mm[2])
    delete map.bone

    const keys = ['skin', 'antiAging', 'immunity', 'digestion', 'diet']
    const parts = keys.filter((k) => map[k] !== undefined).map((k) => `${k}: ${map[k]}`).join(', ')
    radarPatched++
    return `healthRadar: { ${parts} }`
  },
)
console.log(`  [radar] ${radarPatched} 음식 healthRadar 의 bone 제거`)

if (src === before) {
  console.log(`\n[no-op] 이미 변환됨 — 변경 없음`)
} else {
  writeFileSync(PATH, src)
  console.log(`\n=== Phase 9.1 결과 ===`)
  console.log(`healthRadar 정리 : ${radarPatched}`)
  console.log(`Output: ${PATH}`)
  console.log(`복원: cp ${bakTarget} ${PATH}`)
}
