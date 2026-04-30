/**
 * Phase 9.2 — food-health.ts 의 음식 name 에서 지역명 prefix 제거.
 *
 * 뷰티 푸드는 영양/효능 페이지 — 지역명이 의미 없음.
 * "서울 삼겹살의 피부 효능" → "삼겹살의 피부 효능".
 *
 * 처리
 *   - ko: "서울 삼겹살" → "삼겹살" (공백 분리 prefix 만)
 *   - ja: "ソウル・サムギョプサル" / "ソウルサムギョプサル" → "サムギョプサル"
 *   - en: "Seoul Samgyeopsal" → "Samgyeopsal"
 *
 * 보존 케이스 (ko 가 공백 없는 합성 — 고유명사):
 *   - "전주비빔밥" → 그대로 (ja "全州ビビンバ", en "Jeonju Bibimbap" 도 보존)
 *
 * 백업: food-health.ts.bak3 (Phase 9 의 .bak / Phase 9.1 의 .bak2 보존)
 * 실행: node scripts/strip-region-prefix.mjs
 * idempotent — 재실행 시 변경 없음.
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'

const PATH = 'lib/data/food-health.ts'

// 다음 .bakN 이름 자동 결정
let bakIdx = 0
while (existsSync(`${PATH}.bak${bakIdx === 0 ? '' : bakIdx}`)) bakIdx++
const BAK = `${PATH}.bak${bakIdx === 0 ? '' : bakIdx}`
copyFileSync(PATH, BAK)
console.log(`[backup] ${BAK}`)

let src = readFileSync(PATH, 'utf8')
const before = src

// ko prefix → ja / en prefix 매핑 (실 데이터 기반)
const CITY_MAP = {
  서울: { ja: ['ソウル・', 'ソウル'], en: 'Seoul' },
  부산: { ja: ['釜山'], en: 'Busan' },
  전주: { ja: ['全州'], en: 'Jeonju' },
  여수: { ja: ['麗水'], en: 'Yeosu' },
  경주: { ja: ['慶州'], en: 'Gyeongju' },
  안동: { ja: ['安東'], en: 'Andong' },
  천안: { ja: ['天安'], en: 'Cheonan' },
  용인: { ja: ['龍仁'], en: 'Yongin' },
  이천: { ja: ['利川'], en: 'Icheon' },
  속초: { ja: ['束草'], en: 'Sokcho' },
  제주: { ja: ['済州'], en: 'Jeju' },
}

const KO_PREFIX_RE = new RegExp(`^(${Object.keys(CITY_MAP).join('|')})\\s+(.+)$`)

let processed = 0
let unchanged = 0
const log = []

src = src.replace(
  /name:\s*\{\s*ko:\s*'([^']+)',\s*ja:\s*'([^']+)',\s*en:\s*'([^']+)'\s*\}/g,
  (full, ko, ja, en) => {
    const koMatch = ko.match(KO_PREFIX_RE)
    if (!koMatch) {
      unchanged++
      return full
    }
    const cityKo = koMatch[1]
    const koRest = koMatch[2]

    const cfg = CITY_MAP[cityKo]
    let newJa = ja
    for (const jaPrefix of cfg.ja) {
      if (ja.startsWith(jaPrefix)) {
        newJa = ja.slice(jaPrefix.length)
        break
      }
    }
    const enPrefixRe = new RegExp(`^${cfg.en}\\s+`)
    const newEn = en.replace(enPrefixRe, '')

    processed++
    log.push(`  ko: "${ko}" → "${koRest}" | ja: "${ja}" → "${newJa}" | en: "${en}" → "${newEn}"`)

    // full 안의 정확한 3 개 string 위치만 치환 (다른 곳 영향 X)
    return full
      .replace(`ko: '${ko}'`, `ko: '${koRest}'`)
      .replace(`ja: '${ja}'`, `ja: '${newJa}'`)
      .replace(`en: '${en}'`, `en: '${newEn}'`)
  },
)

if (src === before) {
  console.log(`\n[no-op] 이미 변환됨 — 변경 없음`)
} else {
  writeFileSync(PATH, src)
  console.log(`\n=== Phase 9.2 결과 ===`)
  console.log(`처리됨   : ${processed}`)
  console.log(`보존     : ${unchanged} (전주비빔밥 등 고유명사)`)
  console.log(`Output: ${PATH}`)
  console.log(`복원: cp ${BAK} ${PATH}`)
  console.log(`\n=== 변환 sample (앞 5 + 뒤 3) ===`)
  for (const l of log.slice(0, 5)) console.log(l)
  if (log.length > 8) console.log(`  ... (${log.length - 8} 개 생략)`)
  for (const l of log.slice(-3)) console.log(l)
}
