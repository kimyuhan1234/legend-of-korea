import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { parsePreferencesFromQuery, rankStaysByPreferences } from '@/lib/tour-api/stay-recommend'
import type { NormalizedStay } from '@/lib/tour-api/stays'

export const dynamic = 'force-dynamic'

/**
 * GET /api/tour-stays/recommend
 *
 * 쿼리 파라미터:
 *   urban=5            → 도심 성향 최대 (-5점)
 *   nature=5           → 자연 성향 최대 (+5점)
 *   modern=3           → 모던 (-3점)
 *   traditional=3      → 전통 (+3점)
 *   budget=5 / premium / luxury / quiet / family / outdoor / ...
 *   limit=10           → 상위 N개 (기본 10, 최대 50)
 *   area=1             → 특정 지역으로 필터 (optional)
 *   stayType=한옥      → 타입 필터 (optional)
 *
 * 응답: 매칭 점수 순 정렬된 숙소 상위 N개
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const prefs = parsePreferencesFromQuery(url.searchParams)
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10) || 10))
  const areaFilter = url.searchParams.get('area')
  const typeFilter = url.searchParams.get('stayType')

  const supabase = await createServiceClient()

  let query = supabase
    .from('tour_stays_cache')
    .select('data')

  if (areaFilter) query = query.eq('area_code', areaFilter)
  if (typeFilter) query = query.eq('stay_type', typeFilter)

  const { data: rows, error } = await query.returns<{ data: NormalizedStay }[]>()

  if (error) {
    console.error('[StayRecommend] Select failed:', error.message)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  const stays: NormalizedStay[] = (rows ?? []).map((r) => r.data)
  const ranked = rankStaysByPreferences(stays, prefs)
  const top = ranked.slice(0, limit)

  return NextResponse.json({
    ok: true,
    preferences: prefs,
    totalCandidates: stays.length,
    returned: top.length,
    filters: {
      area: areaFilter,
      stayType: typeFilter,
    },
    results: top.map((s) => ({
      id: s.id,
      name: s.name,
      address: s.address,
      stayType: s.stayType,
      areaCode: s.areaCode,
      image: s.image,
      matchScore: s.matchScore,
      tags: s.tags,
    })),
  })
}
