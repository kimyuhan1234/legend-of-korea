/**
 * 공공데이터 한식 raw 자료 구조 분석 (옵션 E-3 Phase 1).
 *
 * 사용자가 data.go.kr 에서 다운로드 후 data/hansik-raw/ 에 압축 풀고 실행.
 * 출력: 디렉토리 트리 + 파일 형식별 카운트 + CSV 헤더 미리보기 (처음 3 행).
 *
 * 실행: node scripts/analyze-hansik-data.mjs
 *
 * 다음 단계 (이 결과 기반):
 *   - CSV 컬럼명 확정 → match-hansik-to-dupes.mjs 작성
 *   - 사진 파일명 패턴 확정 → 매칭 알고리즘 결정 (정확/fuzzy/한자→한글)
 *   - 라이선스 파일 (LICENSE.txt / 공공누리 안내) 위치 확인
 */

import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, extname, basename } from 'node:path'

const ROOT = 'data/hansik-raw'

let stats
try {
  stats = statSync(ROOT)
} catch {
  console.error(`[error] ${ROOT} 디렉토리 부재.`)
  console.error('  사용자 작업 필요:')
  console.error('  1. data.go.kr 에서 한식진흥원 메뉴 길라잡이 800선 다운로드')
  console.error(`  2. ${ROOT}/ 에 압축 풀기`)
  console.error('  3. node scripts/analyze-hansik-data.mjs 재실행')
  process.exit(1)
}
if (!stats.isDirectory()) {
  console.error(`[error] ${ROOT} 가 디렉토리 아님.`)
  process.exit(1)
}

const ext_count = new Map()
const tree_lines = []

function walk(dir, depth = 0) {
  const items = readdirSync(dir).sort()
  tree_lines.push(`${'  '.repeat(depth)}${basename(dir)}/`)
  for (const item of items) {
    const path = join(dir, item)
    const s = statSync(path)
    if (s.isDirectory()) {
      walk(path, depth + 1)
    } else {
      const ext = extname(item).toLowerCase() || '(no-ext)'
      ext_count.set(ext, (ext_count.get(ext) || 0) + 1)
      const sizeKb = (s.size / 1024).toFixed(0)
      tree_lines.push(`${'  '.repeat(depth + 1)}${item} (${sizeKb}KB)`)
    }
  }
}

walk(ROOT)

console.log('=== Directory Tree ===')
console.log(tree_lines.slice(0, 80).join('\n'))
if (tree_lines.length > 80) {
  console.log(`... (${tree_lines.length - 80} more lines truncated)`)
}

console.log('\n=== Extension Summary ===')
const sortedExts = [...ext_count.entries()].sort((a, b) => b[1] - a[1])
for (const [ext, count] of sortedExts) {
  console.log(`  ${ext.padEnd(8)} : ${count}`)
}

// CSV 파일이 있으면 헤더 + 처음 3 행 미리보기
console.log('\n=== CSV Preview ===')
const csvFiles = []
function findCsv(dir) {
  for (const item of readdirSync(dir)) {
    const path = join(dir, item)
    const s = statSync(path)
    if (s.isDirectory()) findCsv(path)
    else if (extname(item).toLowerCase() === '.csv') csvFiles.push(path)
  }
}
findCsv(ROOT)

if (csvFiles.length === 0) {
  console.log('  CSV 파일 없음. Excel (.xls/.xlsx) 또는 다른 형식일 수 있음.')
} else {
  for (const f of csvFiles) {
    console.log(`\n  [${f}]`)
    try {
      const text = readFileSync(f, 'utf8')
      const lines = text.split(/\r?\n/).filter((l) => l.trim())
      console.log(`  Total rows: ${lines.length}`)
      console.log(`  Header   : ${lines[0]?.slice(0, 200)}`)
      for (let i = 1; i <= 3 && i < lines.length; i++) {
        console.log(`  Row ${i}    : ${lines[i].slice(0, 200)}`)
      }
    } catch (e) {
      console.log(`  [read error] ${e instanceof Error ? e.message : String(e)}`)
    }
  }
}

console.log('\n=== Next Steps ===')
console.log('  1. 라이선스 파일 (LICENSE / 공공누리 표시) 확인')
console.log('  2. CSV 컬럼명 확정 → 매칭 키 결정 (음식명 / ID)')
console.log('  3. 사진 폴더 패턴 확정 → 매칭 알고리즘 작성')
console.log('  4. 결과 보고 후 scripts/match-hansik-to-dupes.mjs 작성')
