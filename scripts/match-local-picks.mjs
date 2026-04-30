/**
 * Phase 8 Step 4 — Local Picks → TourAPI contentid 자동 매칭.
 *
 * 흐름
 *   1. lib/data/local-picks.ts 에서 LOCAL_PICKS 추출 (정규식 파싱)
 *   2. 각 픽의 searchName + 광역 areaCode → searchKeyword2 호출
 *   3. 첫 번째 매칭 결과의 contentid + contenttypeid + title 추출
 *   4. data/local-picks-matches.json 저장
 *   5. 다음 단계: scripts/apply-local-picks-matches.mjs (local-picks.ts 자동 갱신)
 *
 * 실행
 *   1. .env.local 의 TOUR_API_KEY 가 process env 에 export 되어야 함
 *   2. node scripts/match-local-picks.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'

const LOCAL_PICKS_PATH = 'lib/data/local-picks.ts'
const OUTPUT_PATH = 'data/local-picks-matches.json'

const TOUR_API_KEY = process.env.TOUR_API_KEY
if (!TOUR_API_KEY) {
  console.error('[error] TOUR_API_KEY 환경변수 부재.')
  console.error('  PowerShell:  Get-Content .env.local | ForEach-Object { if ($_ -match "^([^#=]+)=(.*)$") { Set-Item "env:$($matches[1])" $matches[2] } }')
  process.exit(1)
}

// 광역 → areaCode 매핑 (lib/tour-api/area-codes.ts 와 동기화)
const PROVINCE_AREA_CODE = {
  seoul: 1, incheon: 2, daejeon: 3, daegu: 4, gwangju: 5, busan: 6, ulsan: 7, sejong: 8,
  gyeonggi: 31, gangwon: 32, chungbuk: 33, chungnam: 34, gyeongbuk: 35, gyeongnam: 36, jeonbuk: 37, jeonnam: 38, jeju: 39,
}

// 광역 한국어 — 4 차 시도 ("성심당 대전") 용. chungnam 은 대표 도시 천안 으로 매칭률 ↑.
const CITY_KOREAN_NAME = {
  seoul: '서울', incheon: '인천', daejeon: '대전', daegu: '대구',
  gwangju: '광주', busan: '부산', ulsan: '울산', sejong: '세종',
  gyeonggi: '경기', gangwon: '강원', chungbuk: '충북', chungnam: '천안',
  jeonbuk: '전북', jeonnam: '전남', gyeongbuk: '경북', gyeongnam: '경남',
  jeju: '제주',
}

if (!existsSync('data')) mkdirSync('data', { recursive: true })

// ─────────────────────────────────────────────────────────────
// local-picks.ts 정규식 파싱 — { id, searchName, rank } 추출
// ─────────────────────────────────────────────────────────────

const src = readFileSync(LOCAL_PICKS_PATH, 'utf8')

/**
 * LOCAL_PICKS 의 각 광역 블록 추출.
 * 패턴: `{province}: [\n  { id: '...', searchName: '...', rank: N, ... },\n  ...\n  ],`
 */
function parseLocalPicks(source) {
  const result = {}
  const provinces = Object.keys(PROVINCE_AREA_CODE)

  for (const prov of provinces) {
    // 광역 블록 시작 — 들여쓰기 + 'province: [' 매칭
    const blockStart = new RegExp(`^\\s+${prov}:\\s*\\[`, 'm')
    const startMatch = blockStart.exec(source)
    if (!startMatch) continue

    // 블록 끝 ']' 찾기 — balanced bracket
    let i = startMatch.index + startMatch[0].length
    let depth = 1
    while (i < source.length && depth > 0) {
      const c = source[i]
      if (c === '"' || c === "'") {
        const q = c
        i++
        while (i < source.length && source[i] !== q) {
          if (source[i] === '\\') i++
          i++
        }
        i++
        continue
      }
      if (c === '`') {
        i++
        while (i < source.length && source[i] !== '`') {
          if (source[i] === '\\') i++
          i++
        }
        i++
        continue
      }
      if (c === '[') depth++
      else if (c === ']') {
        depth--
        if (depth === 0) break
      }
      i++
    }
    const blockText = source.slice(startMatch.index, i)

    // 각 픽 추출 — 단일 라인에 id 와 searchName 둘 다
    const itemRe = /\{\s*id:\s*['"]([\w-]+)['"]\s*,\s*searchName:\s*['"]([^'"]+)['"]\s*,\s*rank:\s*(\d+)/g
    const picks = []
    let m
    while ((m = itemRe.exec(blockText)) !== null) {
      picks.push({ id: m[1], searchName: m[2], rank: Number(m[3]) })
    }
    if (picks.length > 0) result[prov] = picks
  }
  return result
}

const parsed = parseLocalPicks(src)
const totalPicks = Object.values(parsed).reduce((acc, list) => acc + list.length, 0)
console.log(`[parse] ${Object.keys(parsed).length} 광역 / ${totalPicks} 픽`)

// ─────────────────────────────────────────────────────────────
// TourAPI searchKeyword2 호출
// ─────────────────────────────────────────────────────────────

async function searchKeyword(keyword, areaCode) {
  const url = new URL('https://apis.data.go.kr/B551011/KorService2/searchKeyword2')
  url.searchParams.set('serviceKey', TOUR_API_KEY)
  url.searchParams.set('MobileOS', 'ETC')
  url.searchParams.set('MobileApp', 'LegendOfKorea')
  url.searchParams.set('_type', 'json')
  url.searchParams.set('keyword', keyword)
  url.searchParams.set('numOfRows', '5')
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('contentTypeId', '39')
  url.searchParams.set('areaCode', String(areaCode))

  try {
    const res = await fetch(url.toString())
    if (!res.ok) return []
    const json = await res.json()
    const items = json?.response?.body?.items?.item
    if (Array.isArray(items)) return items
    if (items) return [items]
    return []
  } catch (err) {
    console.error(`  [error] "${keyword}":`, err.message || err)
    return []
  }
}

// ─────────────────────────────────────────────────────────────
// 다단계 검색 헬퍼
// ─────────────────────────────────────────────────────────────

/**
 * 지점 표시 제거 — "성심당 본점" → "성심당", "이재모피자 서면점" → "이재모피자"
 * 마지막 토큰이 "...점" / "본점" / "본관" / "{N}관" 등이면 제거.
 */
function cleanBranchName(name) {
  let out = name
  // "본점.+점" — 예: "성심당 본점" 안에 X. 단순화: 공백 + 마지막 토큰이 점/관/N관
  out = out.replace(/\s*본점$/, '')
  out = out.replace(/\s*본관$/, '')
  out = out.replace(/\s*\d+관$/, '')
  out = out.replace(/\s*1관$/, '')
  // 마지막 공백 분리 토큰이 "...점" 으로 끝나면 제거 (e.g. "DCC점", "롯데백화점대전점", "양평동점", "서면점")
  out = out.replace(/\s+\S+점$/, '')
  return out.trim()
}

function firstWord(name) {
  return name.split(/\s+/)[0]
}

/**
 * 4 단계 검색 — 원본 → 지점제거 → 첫단어 → 첫단어+도시명.
 * 먼저 매칭되는 단계에서 결과 반환. 단계 사이 250ms rate limit.
 */
async function matchPick(searchName, areaCode, provinceKey) {
  const cityName = CITY_KOREAN_NAME[provinceKey]
  const cleaned = cleanBranchName(searchName)
  const fw = firstWord(searchName)
  const fwCity = cityName ? `${fw} ${cityName}` : null

  // 후보 — 중복/짧은 문자열 제거
  const seen = new Set()
  const candidates = []
  for (const [stage, kw] of [
    ['원본', searchName],
    ['정제', cleaned],
    ['첫단어', fw],
    ['도시', fwCity],
  ]) {
    if (!kw) continue
    if (kw.length <= 1) continue
    if (seen.has(kw)) continue
    seen.add(kw)
    candidates.push({ stage, keyword: kw })
  }

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i]
    const results = await searchKeyword(c.keyword, areaCode)
    if (results.length > 0) {
      return { ...results[0], stage: c.stage, matchedKeyword: c.keyword }
    }
    // 다음 단계 시도 전 rate limit
    if (i < candidates.length - 1) await new Promise((r) => setTimeout(r, 250))
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// 메인 — 전체 매칭
// ─────────────────────────────────────────────────────────────

const matches = []
let idx = 0
for (const [province, picks] of Object.entries(parsed)) {
  const areaCode = PROVINCE_AREA_CODE[province]
  console.log(`\n=== ${province} (areaCode ${areaCode}) ===`)

  for (const pick of picks) {
    idx++
    const tag = `[${idx}/${totalPicks}]`
    const result = await matchPick(pick.searchName, areaCode, province)
    if (result) {
      const note = result.stage === '원본' ? '' : ` (검색어: "${result.matchedKeyword}")`
      console.log(`  ${tag} ✓ [${result.stage}] ${pick.searchName} → ${result.contentid} (${result.title})${note}`)
      matches.push({
        province,
        id: pick.id,
        searchName: pick.searchName,
        rank: pick.rank,
        contentid: result.contentid,
        contenttypeid: result.contenttypeid,
        matchedTitle: result.title,
        matchStage: result.stage,
        matchedKeyword: result.matchedKeyword,
      })
    } else {
      console.log(`  ${tag} ✗          ${pick.searchName} — NO MATCH (4 단계 모두 실패)`)
      matches.push({
        province,
        id: pick.id,
        searchName: pick.searchName,
        rank: pick.rank,
        contentid: null,
        contenttypeid: null,
        matchedTitle: null,
      })
    }
    // 각 픽 사이 rate limit (matchPick 내부 단계 사이 250ms 와 별개)
    await new Promise((r) => setTimeout(r, 250))
  }
}

// ─────────────────────────────────────────────────────────────
// 중복 contentid 후처리 — 같은 도시 내 동일 contentid 면 rank 낮은 픽만 유지
// ─────────────────────────────────────────────────────────────

const seenByCity = new Map() // province → Map(contentid → keepingPickId)
const sortedByRank = [...matches].sort((a, b) => a.rank - b.rank)

let dedupedCount = 0
for (const m of sortedByRank) {
  if (!m.contentid) continue
  if (!seenByCity.has(m.province)) seenByCity.set(m.province, new Map())
  const cityMap = seenByCity.get(m.province)
  if (cityMap.has(m.contentid)) {
    // 이미 더 낮은 rank 픽이 차지함 — 무효
    m.contentid = null
    m.contenttypeid = null
    m.duplicateOf = cityMap.get(m.contentid)
    dedupedCount++
  } else {
    cityMap.set(m.contentid, m.id)
  }
}
if (dedupedCount > 0) console.log(`\n[dedupe] 중복 contentid 무효화: ${dedupedCount}건`)

writeFileSync(OUTPUT_PATH, JSON.stringify(matches, null, 2) + '\n')

const matched = matches.filter((m) => m.contentid).length
const total = matches.length
const stageStats = matches
  .filter((m) => m.contentid)
  .reduce((acc, m) => ((acc[m.matchStage] = (acc[m.matchStage] || 0) + 1), acc), {})

console.log(`\n=== 매칭 결과: ${matched}/${total} (${((matched / total) * 100).toFixed(1)}%) ===`)
console.log(`단계별: ${JSON.stringify(stageStats)}`)
console.log(`Output: ${OUTPUT_PATH}`)
console.log(`다음: node scripts/apply-local-picks-matches.mjs`)
