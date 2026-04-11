import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 유저의 draft 플랜들 + 각 플랜의 아이템 조회
    const { data: plans, error } = await supabase
      .from('travel_plans')
      .select(`
        id,
        city_id,
        title,
        status,
        has_mission_kit,
        kit_course_id,
        hotel_name,
        hotel_address,
        hotel_lat,
        hotel_lng,
        hotel_source,
        created_at,
        plan_items (
          id,
          item_type,
          item_data,
          day_number,
          time_slot,
          sort_order,
          is_confirmed,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .in('status', ['draft', 'confirmed'])
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: '플랜 조회 실패' }, { status: 500 })
    }

    const totalItems = (plans ?? []).reduce(
      (sum, p) => sum + (p.plan_items?.length ?? 0),
      0
    )

    return NextResponse.json({ plans: plans ?? [], totalItems })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json({ error: 'itemId 필수' }, { status: 400 })
    }

    // RLS 정책이 본인 플랜의 아이템만 삭제하도록 보장
    const { error } = await supabase
      .from('plan_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      return NextResponse.json({ error: '삭제 실패' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
