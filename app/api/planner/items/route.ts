import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// 유저별 상태 변경이 잦은 라우트라 Next.js route-level 캐시 금지
export const dynamic = 'force-dynamic'
export const revalidate = 0

// 모듈 레벨 캐시: migration 016 적용 여부를 한 번만 확인
let hotelColumnsAvailable: boolean | null = null

async function checkHotelColumns(supabase: Awaited<ReturnType<typeof createClient>>): Promise<boolean> {
  if (hotelColumnsAvailable !== null) return hotelColumnsAvailable
  const probe = await supabase.from('travel_plans').select('hotel_name').limit(1)
  hotelColumnsAvailable = !probe.error
  return hotelColumnsAvailable
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasHotelColumns = await checkHotelColumns(supabase)

    const baseColumns = `
      id,
      city_id,
      title,
      status,
      has_mission_kit,
      kit_course_id,
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
    `

    const hotelColumns = hasHotelColumns
      ? `, hotel_name, hotel_address, hotel_lat, hotel_lng, hotel_source`
      : ''

    const { data, error } = await supabase
      .from('travel_plans')
      .select(baseColumns + hotelColumns)
      .eq('user_id', user.id)
      .in('status', ['draft', 'confirmed'])
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: '플랜 조회 실패', detail: error.message, code: error.code },
        { status: 500 }
      )
    }

    const rawPlans = (data ?? []) as unknown as Array<Record<string, unknown>>

    // hotel_* 필드 없는 환경에서도 프론트가 동일하게 읽을 수 있도록 null 채움
    const plans = rawPlans.map((p) => ({
      ...p,
      hotel_name: (p.hotel_name as string | null | undefined) ?? null,
      hotel_address: (p.hotel_address as string | null | undefined) ?? null,
      hotel_lat: (p.hotel_lat as number | null | undefined) ?? null,
      hotel_lng: (p.hotel_lng as number | null | undefined) ?? null,
      hotel_source: (p.hotel_source as string | null | undefined) ?? null,
    }))

    const totalItems = plans.reduce((sum, p) => {
      const items = p.plan_items as Array<unknown> | undefined
      return sum + (items?.length ?? 0)
    }, 0)

    return NextResponse.json({ plans, totalItems })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
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
    const resetAll = searchParams.get('all') === 'true'

    if (resetAll) {
      // 본인의 draft/confirmed travel_plans 행 자체를 삭제.
      // plan_items.plan_id REFERENCES travel_plans(id) ON DELETE CASCADE (migration 015)
      // 덕분에 plan_items 는 자동으로 함께 삭제된다.
      // 도시/호텔/상태까지 모두 리셋 → 다음 add-item 호출 시 새 플랜이 생성됨.
      const { data: deletedPlans, error: plansDelError } = await supabase
        .from('travel_plans')
        .delete()
        .eq('user_id', user.id)
        .in('status', ['draft', 'confirmed'])
        .select('id')

      if (plansDelError) {
        return NextResponse.json(
          { error: '초기화 실패', detail: plansDelError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        deleted: deletedPlans?.length ?? 0,
      })
    }

    if (!itemId) {
      return NextResponse.json({ error: 'itemId 필수' }, { status: 400 })
    }

    const { error } = await supabase
      .from('plan_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      return NextResponse.json({ error: '삭제 실패', detail: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
