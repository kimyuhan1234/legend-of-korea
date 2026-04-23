import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Haversine 거리 (km)
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const toRad = (x: number) => (x * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const fromLat = parseFloat(searchParams.get('fromLat') ?? '')
    const fromLng = parseFloat(searchParams.get('fromLng') ?? '')
    const toLat = parseFloat(searchParams.get('toLat') ?? '')
    const toLng = parseFloat(searchParams.get('toLng') ?? '')

    if ([fromLat, fromLng, toLat, toLng].some((v) => Number.isNaN(v))) {
      return NextResponse.json({ error: '좌표 4개 필수' }, { status: 400 })
    }

    // [단일 화폐 통일] 크레딧 차감 제거 — 거리 계산은 로그인만 요구
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const distanceKm = haversineKm(fromLat, fromLng, toLat, toLng)

    // 도보 4km/h, 택시 평균 25km/h + 대기/출발 3분
    const walkMinutes = Math.max(1, Math.round((distanceKm / 4) * 60))
    const taxiMinutes = Math.max(3, Math.round((distanceKm / 25) * 60) + 3)

    // 주의: 택시 금액은 절대 반환하지 않는다 (정찰제 아님)
    return NextResponse.json({
      distanceKm: Math.round(distanceKm * 10) / 10,
      walkMinutes,
      taxiMinutes,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
