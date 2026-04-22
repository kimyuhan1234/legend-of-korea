import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { inferTagsFromStay } from '@/lib/tour-api/stay-tags'
import type { NormalizedStay } from '@/lib/tour-api/stays'
import { requireAdmin } from '@/lib/auth/admin'

export const dynamic = 'force-dynamic'

// POST /api/tour-stays/tag
// Body(optional): { force?: boolean } — true면 이미 태그 있는 숙소도 재태깅
//
// tour_stays_cache에서 전체 레코드를 읽어 각 숙소에 9축 태그를 부여하고 저장.
export async function POST(req: Request) {
  const guard = await requireAdmin()
  if (guard) return guard

  const body = (await req.json().catch(() => ({}))) as { force?: boolean }
  const force = body.force === true

  const supabase = await createServiceClient()

  // 전체 레코드 로드
  const { data: rows, error } = await supabase
    .from('tour_stays_cache')
    .select('id, data')
    .returns<{ id: string; data: NormalizedStay }[]>()

  if (error) {
    console.error('[StayTag] Select failed:', error.message)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json({
      ok: true,
      tagged: 0,
      failed: 0,
      skipped: 0,
      note: '캐시된 숙소가 없습니다. 먼저 POST /api/tour-stays/refresh 로 수집하세요.',
    })
  }

  let tagged = 0
  let skipped = 0
  let failed = 0
  let firstError: string | null = null
  const samples: Array<{ id: string; name: string; tags: ReturnType<typeof inferTagsFromStay> }> = []

  // 업데이트 payload 배치 (200개씩 commit)
  const BATCH = 200
  const updates: { id: string; data: NormalizedStay }[] = []

  for (const row of rows) {
    if (!force && row.data.tags) {
      skipped += 1
      continue
    }
    const tags = inferTagsFromStay(row.data)
    const updated: NormalizedStay = { ...row.data, tags }
    updates.push({ id: row.id, data: updated })
    if (samples.length < 3) samples.push({ id: row.id, name: updated.name, tags })
  }

  console.log(`[StayTag] Updating ${updates.length} stays (skipped ${skipped} already-tagged)...`)

  // JSONB만 UPDATE (id로 매칭). upsert는 NOT NULL area_code/stay_type 까지 요구해서 실패하므로 UPDATE 사용.
  for (let i = 0; i < updates.length; i += BATCH) {
    const chunk = updates.slice(i, i + BATCH)
    const batchErrors: string[] = []
    const chunkResults = await Promise.all(
      chunk.map(async (u) => {
        const { error: upErr } = await supabase
          .from('tour_stays_cache')
          .update({ data: u.data })
          .eq('id', u.id)
        if (upErr) {
          batchErrors.push(upErr.message)
          return false
        }
        return true
      })
    )
    const successInChunk = chunkResults.filter(Boolean).length
    tagged += successInChunk
    failed += chunk.length - successInChunk
    if (!firstError && batchErrors.length > 0) firstError = batchErrors[0]
  }

  console.log(`[StayTag] Done: tagged=${tagged} skipped=${skipped} failed=${failed}`)

  return NextResponse.json({
    ok: failed === 0,
    tagged,
    skipped,
    failed,
    total: rows.length,
    firstError,
    samples,
  })
}
