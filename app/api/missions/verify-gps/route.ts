import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const EARTH_RADIUS_M = 6_371_000
const GPS_RADIUS_METERS = 200

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { missionId, userLat, userLng } = await req.json()

    if (
      typeof missionId !== 'string' ||
      typeof userLat !== 'number' ||
      typeof userLng !== 'number' ||
      Number.isNaN(userLat) || Number.isNaN(userLng)
    ) {
      return NextResponse.json({ error: '유효하지 않은 좌표' }, { status: 400 })
    }

    if (userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
      return NextResponse.json({ error: '좌표 범위 오류' }, { status: 400 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })

    const { data: mission, error: mErr } = await supabase
      .from('missions')
      .select('id, latitude, longitude, course_id')
      .eq('id', missionId)
      .single()

    if (mErr || !mission) {
      return NextResponse.json({ error: '미션을 찾을 수 없습니다' }, { status: 404 })
    }

    if (mission.latitude == null || mission.longitude == null) {
      return NextResponse.json(
        { error: '이 미션은 GPS 위치가 설정되지 않았습니다', requiresGps: false },
        { status: 400 },
      )
    }

    const distance = haversineDistance(
      userLat, userLng,
      Number(mission.latitude), Number(mission.longitude),
    )

    const within = distance <= GPS_RADIUS_METERS

    if (!within) {
      return NextResponse.json({
        verified: false,
        distance: Math.round(distance),
        radius: GPS_RADIUS_METERS,
        message: '미션 장소에서 너무 멀리 있습니다',
      }, { status: 200 })
    }

    // 200m 이내 → mission_progress에 gps_verified=true 기록
    // status는 건드리지 않음 (locked 해제는 /complete 또는 스캔에서 처리)
    const now = new Date().toISOString()
    const { error: upErr } = await supabase
      .from('mission_progress')
      .upsert({
        user_id: user.id,
        mission_id: missionId,
        gps_verified: true,
        gps_verified_at: now,
      }, { onConflict: 'user_id, mission_id' })

    if (upErr) {
      console.error('verify-gps upsert error:', upErr.message)
      return NextResponse.json({ error: '검증 기록 실패' }, { status: 500 })
    }

    return NextResponse.json({
      verified: true,
      distance: Math.round(distance),
      radius: GPS_RADIUS_METERS,
    })
  } catch (err) {
    console.error('verify-gps error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
