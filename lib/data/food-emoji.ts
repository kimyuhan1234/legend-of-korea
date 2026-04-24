/**
 * food-dupes 음식 카드용 이모지 매핑.
 *
 * Pexels API 이미지가 실제 음식과 불일치하는 경우가 많아,
 * 한국어 이름 키워드 + tags 를 기반으로 대표 이모지를 반환한다.
 *
 * 우선순위: 해산물(종류 구분) > 육류(종류 구분) > 밥·면·탕 등 조리 형태 > 디저트/음료 > 기본
 */
export interface EmojiFoodLike {
  name: { ko: string }
  tags?: string[]
}

export function getFoodEmoji(food: EmojiFoodLike): string {
  const ko = food.name.ko ?? ''
  const tags = food.tags ?? []
  const hay = `${ko} ${tags.join(' ')}`

  // ── 해산물 (세부 종 우선) ────────────────────────────────
  if (/굴|석화/.test(hay)) return '🦪'
  if (/게|꽃게|대게|영덕대게/.test(hay)) return '🦀'
  if (/새우|대하/.test(hay)) return '🦐'
  if (/조개|바지락|홍합|소라|전복/.test(hay)) return '🐚'
  if (/주꾸미|낙지|문어|오징어/.test(hay)) return '🐙'
  if (/회|광어|방어|도다리|고등어|갈치|삼치|생선|참치|연어/.test(hay)) return '🐟'
  if (/장어|뱀장어/.test(hay)) return '🍣'

  // ── 육류 (세부 종) ──────────────────────────────────────
  if (/소고기|쇠고기|갈비|불고기|한우|육회|너비아니/.test(hay)) return '🐂'
  if (/돼지|삼겹|족발|보쌈|곱창|막창|순대국/.test(hay)) return '🐷'
  if (/닭|치킨|삼계탕|백숙|닭갈비/.test(hay)) return '🐔'
  if (/오리|훈제오리/.test(hay)) return '🦆'

  // ── 조리 형태: 순대(가공) 먼저 처리 ──────────────────────
  if (/순대(?!국)/.test(hay)) return '🌭'

  // ── 밥류 ────────────────────────────────────────────────
  if (/비빔밥|돌솥|덮밥|볶음밥|솥밥|주먹밥|쌈밥/.test(hay)) return '🍚'
  if (/김밥/.test(hay)) return '🍙'
  if (/죽|미음/.test(hay)) return '🥣'

  // ── 면류 ────────────────────────────────────────────────
  if (/라면|라멘/.test(hay)) return '🍜'
  if (/냉면|국수|칼국수|콩국수|수제비|잔치국수|막국수/.test(hay)) return '🍜'
  if (/파스타|스파게티/.test(hay)) return '🍝'
  if (/우동|소바/.test(hay)) return '🍲'

  // ── 국/탕/찌개/전골 ──────────────────────────────────────
  if (/찌개|전골|김치찌개|된장찌개|순두부/.test(hay)) return '🍲'
  if (/탕|국(?!수)|해장국|설렁탕|갈비탕|매운탕|어탕/.test(hay)) return '🍲'

  // ── 전/부침/튀김/구이 ────────────────────────────────────
  if (/전(?!주)|부침|파전|김치전|빈대떡|녹두전/.test(hay)) return '🥞'
  if (/튀김|탕수육|강정/.test(hay)) return '🍤'
  if (/구이|숯불|석쇠|양념구이/.test(hay)) return '🔥'

  // ── 김치/반찬 ────────────────────────────────────────────
  if (/김치|겉절이|깍두기/.test(hay)) return '🥬'
  if (/나물|무침/.test(hay)) return '🥗'
  if (/두부/.test(hay)) return '🍢'

  // ── 떡/한과/디저트 ──────────────────────────────────────
  if (/호떡/.test(hay)) return '🥞'
  if (/떡|경단|송편|찹쌀|가래떡|인절미/.test(hay)) return '🍡'
  if (/빵|베이커리|카스테라|도넛|크루아상/.test(hay)) return '🍞'
  if (/빙수|팥빙수/.test(hay)) return '🍧'
  if (/아이스크림|젤라또/.test(hay)) return '🍦'
  if (/케이크|케익|타르트/.test(hay)) return '🍰'
  if (/과자|쿠키/.test(hay)) return '🍪'
  if (/꿀/.test(hay)) return '🍯'

  // ── 과일/채소 ───────────────────────────────────────────
  if (/귤|오렌지/.test(hay)) return '🍊'
  if (/사과/.test(hay)) return '🍎'
  if (/딸기/.test(hay)) return '🍓'
  if (/감자/.test(hay)) return '🥔'

  // ── 주류/음료 ───────────────────────────────────────────
  if (/막걸리|동동주|소주|청주|탁주/.test(hay)) return '🍶'
  if (/맥주/.test(hay)) return '🍺'
  if (/커피|카페|에스프레소|라떼/.test(hay)) return '☕'
  if (/차(?![이])|녹차|홍차|보이차/.test(hay)) return '🍵'

  // ── 기본 ────────────────────────────────────────────────
  return '🍽️'
}
