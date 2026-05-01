/**
 * SQL 실행 — DATABASE_URL 직접 connect.
 *
 * 사용법
 *   node --env-file=.env.local scripts/sql-runner.mjs <SQL 문자열>
 *   node --env-file=.env.local scripts/sql-runner.mjs --file path/to/query.sql
 *
 * 보안:
 *   - SSL 강제 (Supabase 요구)
 *   - DATABASE_URL 마스킹 후 로그
 *   - 결과 JSON / 텍스트 출력
 */

import { readFileSync } from 'node:fs'
import pg from 'pg'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('[error] DATABASE_URL 환경변수 부재')
  process.exit(1)
}

const argv = process.argv.slice(2)
let sql = ''
if (argv[0] === '--file' && argv[1]) {
  sql = readFileSync(argv[1], 'utf8')
} else if (argv[0]) {
  sql = argv.join(' ')
}
if (!sql) {
  console.error('[error] SQL 또는 --file <path> 필요')
  process.exit(1)
}

const masked = DATABASE_URL.replace(/:[^:@]+@/, ':***@')
console.log(`[connect] ${masked}`)

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  const result = await client.query(sql)
  if (Array.isArray(result)) {
    // multi-statement
    result.forEach((r, i) => {
      console.log(`\n=== Statement ${i + 1} ===`)
      console.log(`rows: ${r.rowCount}`)
      if (r.rows && r.rows.length > 0) {
        console.log(JSON.stringify(r.rows.slice(0, 50), null, 2))
        if (r.rows.length > 50) console.log(`... 외 ${r.rows.length - 50}`)
      }
    })
  } else {
    console.log(`rows: ${result.rowCount}`)
    if (result.rows && result.rows.length > 0) {
      console.log(JSON.stringify(result.rows.slice(0, 100), null, 2))
      if (result.rows.length > 100) console.log(`... 외 ${result.rows.length - 100}`)
    }
  }
} catch (err) {
  console.error(`[sql-error] ${err.message}`)
  process.exit(1)
} finally {
  await client.end()
}
