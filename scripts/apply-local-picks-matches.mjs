/**
 * Phase 8 Step 4 — match-local-picks.mjs 결과 → local-picks.ts 자동 갱신.
 *
 * 흐름
 *   1. data/local-picks-matches.json 로드
 *   2. lib/data/local-picks.ts 의 각 픽 항목에 contentid + contenttypeid 추가
 *   3. 백업 (.bak) + 결과 쓰기
 *
 * 매칭 키: pick.id (광역 단위 unique)
 * - contentid 있으면: 해당 픽에 contentid: '...', contenttypeid: '...' 삽입
 * - contentid null: 변경 없음 (페이지에서 자동 제외)
 *
 * 실행: node scripts/apply-local-picks-matches.mjs
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'

const MATCHES_PATH = 'data/local-picks-matches.json'
const PICKS_PATH = 'lib/data/local-picks.ts'

if (!existsSync(MATCHES_PATH)) {
  console.error(`[error] ${MATCHES_PATH} 부재. 먼저 match-local-picks.mjs 실행.`)
  process.exit(1)
}

const matches = JSON.parse(readFileSync(MATCHES_PATH, 'utf8'))
let src = readFileSync(PICKS_PATH, 'utf8')

copyFileSync(PICKS_PATH, PICKS_PATH + '.bak')
console.log(`[backup] ${PICKS_PATH}.bak`)

let patched = 0
let skipped = 0

for (const m of matches) {
  if (!m.contentid) {
    skipped++
    continue
  }

  // pick id 기준 객체 찾기 — id: '<m.id>' 매칭하는 라인 + 그 객체의 닫는 ',' 또는 'curation: ...' 직전
  // 단일 라인에 id + searchName + rank 있는 패턴 → 그 라인 끝의 ',' 직전에 contentid 삽입.
  // 또는 multi-line 객체 (curation 있는 경우) → rank: N, 다음에 삽입.

  const idEsc = m.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // 패턴 A: rank: N, (단일 라인 또는 객체 시작) — 그 직후에 contentid 삽입
  const re = new RegExp(
    `(\\{\\s*id:\\s*['"]${idEsc}['"][^}]*?rank:\\s*\\d+\\s*,)`,
  )
  const match = re.exec(src)
  if (!match) {
    console.warn(`  [warn] ${m.id}: 패턴 매칭 실패 — skip`)
    skipped++
    continue
  }

  // 이미 contentid 있는지 검사 (idempotent)
  const objText = match[0]
  if (objText.includes('contentid:')) {
    skipped++
    continue
  }

  const insertion = ` contentid: '${m.contentid}', contenttypeid: '${m.contenttypeid || ''}',`
  src = src.slice(0, match.index + match[0].length) + insertion + src.slice(match.index + match[0].length)
  patched++
}

writeFileSync(PICKS_PATH, src)

console.log(`\n=== Apply 결과 ===`)
console.log(`patched : ${patched}`)
console.log(`skipped : ${skipped} (매칭 X 또는 이미 contentid 있음)`)
console.log(`복원: cp ${PICKS_PATH}.bak ${PICKS_PATH}`)
