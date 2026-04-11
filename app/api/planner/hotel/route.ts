import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { planId, name, address, lat, lng, source } = body

    if (!planId || !name || !address) {
      return NextResponse.json({ error: 'planId, name, address 필수' }, { status: 400 })
    }

    const hotelSource = source === 'curated' ? 'curated' : 'manual'

    // RLS 정책이 본인 플랜만 수정 허용
    const { error } = await supabase
      .from('travel_plans')
      .update({
        hotel_name: String(name).slice(0, 200),
        hotel_address: String(address).slice(0, 500),
        hotel_lat: typeof lat === 'number' ? lat : null,
        hotel_lng: typeof lng === 'number' ? lng : null,
        hotel_source: hotelSource,
      })
      .eq('id', planId)

    if (error) {
      return NextResponse.json({ error: '호텔 정보 저장 실패' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
