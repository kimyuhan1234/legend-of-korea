/**
 * Supabase Management API SQL runner.
 *
 * Personal Access Token (SUPABASE_ACCESS_TOKEN) 으로 인증.
 * DB direct connection / pooler 우회 — REST API 통해 SQL 실행.
 *
 * Endpoint: POST https://api.supabase.com/v1/projects/{ref}/database/query
 * Body: { query: "..." }
 *
 * 사용
 *   node --env-file=.env.local scripts/supabase-mgmt-runner.mjs --sql "SELECT 1"
 *   node --env-file=.env.local scripts/supabase-mgmt-runner.mjs --file supabase/migrations/051_function_search_path_fix.sql
 *   node --env-file=.env.local scripts/supabase-mgmt-runner.mjs --files 051,052,053,054
 *     (--files 는 supabase/migrations/{N}_*.sql 자동 매칭, 순서대로 단일 트랜잭션)
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const m = url.match(/https:\/\/([^.]+)\.supabase\.co/)
  return m ? m[1] : null
})()
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN

if (!PROJECT_REF) {
  console.error('[error] PROJECT_REF 추출 실패 — NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_PROJECT_REF 확인')
  process.exit(1)
}
if (!TOKEN) {
  console.error('[error] SUPABASE_ACCESS_TOKEN 환경변수 부재')
  process.exit(1)
}

const argv = process.argv.slice(2)
let sql = ''

const fileIdx = argv.indexOf('--file')
const filesIdx = argv.indexOf('--files')
const sqlIdx = argv.indexOf('--sql')

if (fileIdx >= 0 && argv[fileIdx + 1]) {
  sql = readFileSync(argv[fileIdx + 1], 'utf8')
} else if (filesIdx >= 0 && argv[filesIdx + 1]) {
  const ids = argv[filesIdx + 1].split(',')
  const allFiles = readdirSync('supabase/migrations')
  const parts = []
  for (const id of ids) {
    const match = allFiles.find((f) => f.startsWith(`${id}_`) && f.endsWith('.sql'))
    if (!match) {
      console.error(`[error] migration ${id} 파일 없음`)
      process.exit(1)
    }
    parts.push(`-- ===== ${match} =====\n${readFileSync(join('supabase/migrations', match), 'utf8')}`)
  }
  sql = parts.join('\n\n')
} else if (sqlIdx >= 0 && argv[sqlIdx + 1]) {
  sql = argv[sqlIdx + 1]
}

if (!sql) {
  console.error('Usage:')
  console.error('  --sql "SELECT 1"')
  console.error('  --file path/to/query.sql')
  console.error('  --files 051,052,053,054')
  process.exit(1)
}

console.log(`[mgmt-api] project: ${PROJECT_REF}, sql length: ${sql.length}`)

const endpoint = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`
const res = await fetch(endpoint, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: sql }),
})

const text = await res.text()
if (!res.ok) {
  console.error(`[error] HTTP ${res.status}: ${text.slice(0, 800)}`)
  process.exit(1)
}

let data
try {
  data = JSON.parse(text)
} catch {
  data = text
}

if (Array.isArray(data)) {
  console.log(`rows: ${data.length}`)
  console.log(JSON.stringify(data.slice(0, 100), null, 2))
  if (data.length > 100) console.log(`... 외 ${data.length - 100}`)
} else if (data && typeof data === 'object') {
  console.log(JSON.stringify(data, null, 2))
} else {
  console.log(data)
}
