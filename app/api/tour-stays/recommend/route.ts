import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  parsePreferencesFromQuery,
  rankStaysByPreferences,
  haversineKm,
  type RankedStay,
} from '@/lib/tour-api/stay-recommend'
import type { NormalizedStay } from '@/lib/tour-api/stays'

export const dynamic = 'force-dynamic'

/**
 * GET /api/tour-stays/recommend
 *
 * 쿼리 파라미터:
 *   urban=5 / nature=5 / modern / traditional / ... (9축 성향)
 *   limit=30           → 페이지당 최대 50
 *   offset=0           → 페이지네이션
 *   area=1             → 지역 코드 필터
 *   stayType=한옥      → 타입 필터
 *   userLat=37.5 & userLng=127.0 → 사용자 좌표
 *   sortBy=distance    → 거리 순 정렬 (기본 match)
 *
 * 응답: 정렬된 숙소 { results, totalMatches, offset, hasMore }
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const prefs = parsePreferencesFromQuery(url.searchParams)
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10) || 10))
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10) || 0)
  const areaFilter = url.searchParams.get('area')
  const typeFilter = url.searchParams.get('stayType')

  const userLatRaw = url.searchParams.get('userLat')
  const userLngRaw = url.searchParams.get('userLng')
  const userLat = userLatRaw ? parseFloat(userLatRaw) : NaN
  const userLng = userLngRaw ? parseFloat(userLngRaw) : NaN
  const hasUserCoord = !Number.isNaN(userLat) && !Number.isNaN(userLng)
  const sortBy = url.searchParams.get('sortBy') ?? 'match'

  // 순수 SELECT — anon client로 충분. RLS 정책 "Anyone can read tour_stays_cache"
  // (028_tour_stays_cache.sql) 가 공개 읽기를 허용하므로 service_role 불필요.
  const supabase = await createClient()

  let query = supabase.from('tour_stays_cache').select('data')
  if (areaFilter) query = query.eq('area_code', areaFilter)
  if (typeFilter) query = query.eq('stay_type', typeFilter)

  const { data: rows, error } = await query.returns<{ data: NormalizedStay }[]>()

  if (error) {
    console.error('[StayRecommend] Select failed:', error.message)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  const stays: NormalizedStay[] = (rows ?? []).map((r) => r.data)
  let ranked: RankedStay[] = rankStaysByPreferences(stays, prefs)

  // 사용자 좌표가 있으면 거리 계산 주입
  if (hasUserCoord) {
    ranked = ranked.map((s) => ({
      ...s,
      distanceKm: haversineKm(userLat, userLng, s.latitude, s.longitude),
    }))
    if (sortBy === 'distance') {
      ranked.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    }
  }

  const page = ranked.slice(offset, offset + limit)
  const hasMore = offset + page.length < ranked.length

  return NextResponse.json({
    ok: true,
    preferences: prefs,
    totalMatches: ranked.length,
    offset,
    limit,
    returned: page.length,
    hasMore,
    sortBy: hasUserCoord && sortBy === 'distance' ? 'distance' : 'match',
    filters: { area: areaFilter, stayType: typeFilter },
    results: page.map((s) => ({
      id: s.id,
      name: s.name,
      address: s.address,
      tel: s.tel,
      stayType: s.stayType,
      areaCode: s.areaCode,
      image: s.image,
      latitude: s.latitude,
      longitude: s.longitude,
      matchScore: s.matchScore,
      distanceKm: s.distanceKm,
      tags: s.tags,
    })),
  })
}
