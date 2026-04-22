import { NextRequest, NextResponse } from 'next/server'
import { refreshAreaCache } from '@/lib/tour-api/stays-cache'
import { PROVINCE_AREA_CODES } from '@/lib/tour-api/area-codes'

export const dynamic = 'force-dynamic'

const CONCURRENCY = 5

// TODO: 관리자 인증 추가 (프로덕션 전) — 현재는 dev 전용
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { areaCode?: string | number }

  const targetCodes: number[] =
    body.areaCode != null
      ? [Number(body.areaCode)]
      : Object.values(PROVINCE_AREA_CODES).map((p) => p.areaCode)

  console.log(`[Refresh] Starting refresh for ${targetCodes.length} areas (concurrency=${CONCURRENCY})`)

  const results: Record<string, { count: number; cached: boolean; error?: string }> = {}

  // 5개씩 청크 처리 — TourAPI 부하 방지
  for (let i = 0; i < targetCodes.length; i += CONCURRENCY) {
    const chunk = targetCodes.slice(i, i + CONCURRENCY)
    const chunkResults = await Promise.all(
      chunk.map(async (code) => {
        const res = await refreshAreaCache(code)
        return [String(code), res] as const
      })
    )
    for (const [k, v] of chunkResults) results[k] = v
  }

  const totalStays = Object.values(results).reduce((sum, r) => sum + r.count, 0)
  const successCount = Object.values(results).filter((r) => r.cached).length
  const failedAreas = Object.entries(results)
    .filter(([, r]) => !r.cached)
    .map(([code, r]) => ({ code, error: r.error }))

  console.log(`[Refresh] Done: ${successCount}/${targetCodes.length} areas, ${totalStays} stays total`)

  return NextResponse.json({
    ok: failedAreas.length === 0,
    totalStays,
    successCount,
    totalAreas: targetCodes.length,
    concurrency: CONCURRENCY,
    areas: results,
    failedAreas: failedAreas.length > 0 ? failedAreas : undefined,
  })
}
