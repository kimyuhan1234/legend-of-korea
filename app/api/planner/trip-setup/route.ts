import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type TripStyle = 'relaxed' | 'active' | 'full'
const VALID_STYLES: TripStyle[] = ['relaxed', 'active', 'full']

// PUT /api/planner/trip-setup
// body: { cityId, startDate?, endDate?, travelStyle? }
// 유저의 draft travel_plan 에 여행 기간/스타일을 저장한다.
// draft 가 없으면 cityId 로 새로 생성해 일관성 유지 (add-item 과 동일 정책).
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json().catch(() => null)) as {
      cityId?: string
      startDate?: string | null
      endDate?: string | null
      travelStyle?: string
    } | null

    if (!body) {
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
    }

    const { cityId, startDate, endDate } = body
    const travelStyle = body.travelStyle as TripStyle | undefined

    if (travelStyle !== undefined && !VALID_STYLES.includes(travelStyle)) {
      return NextResponse.json({ error: 'invalid_travel_style' }, { status: 400 })
    }

    // 기존 draft plan 조회 (user 당 1개만 유지 원칙)
    const { data: existing, error: findErr } = await supabase
      .from('travel_plans')
      .select('id, city_id')
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (findErr) {
      return NextResponse.json(
        { error: 'lookup_failed', detail: findErr.message },
        { status: 500 }
      )
    }

    let planId: string

    if (existing) {
      planId = existing.id
      const updatePayload: {
        start_date?: string | null
        end_date?: string | null
        travel_style?: TripStyle
        city_id?: string
        updated_at: string
      } = { updated_at: new Date().toISOString() }

      if (startDate !== undefined) updatePayload.start_date = startDate || null
      if (endDate !== undefined) updatePayload.end_date = endDate || null
      if (travelStyle !== undefined) updatePayload.travel_style = travelStyle
      if (cityId && cityId !== existing.city_id) updatePayload.city_id = cityId

      const { error: updErr } = await supabase
        .from('travel_plans')
        .update(updatePayload)
        .eq('id', planId)

      if (updErr) {
        return NextResponse.json(
          { error: 'update_failed', detail: updErr.message },
          { status: 500 }
        )
      }
    } else {
      // 새 draft 생성 (cityId 필수)
      if (!cityId) {
        return NextResponse.json(
          { error: 'cityId_required_when_no_draft' },
          { status: 400 }
        )
      }

      const { data: created, error: insErr } = await supabase
        .from('travel_plans')
        .insert({
          user_id: user.id,
          city_id: cityId,
          status: 'draft',
          start_date: startDate ?? null,
          end_date: endDate ?? null,
          travel_style: travelStyle ?? 'active',
        })
        .select('id')
        .single()

      if (insErr || !created) {
        return NextResponse.json(
          { error: 'create_failed', detail: insErr?.message },
          { status: 500 }
        )
      }
      planId = created.id
    }

    return NextResponse.json({ success: true, planId })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
