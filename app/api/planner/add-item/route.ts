import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type ItemType = 'food' | 'stay' | 'diy' | 'quest' | 'ootd' | 'goods' | 'transport' | 'surprise'

const VALID_TYPES: ItemType[] = ['food', 'stay', 'diy', 'quest', 'ootd', 'goods', 'transport', 'surprise']

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { itemType, itemData, cityId } = body

    if (!itemType || !itemData || !cityId) {
      return NextResponse.json({ error: 'itemType, itemData, cityId 필수' }, { status: 400 })
    }

    if (!VALID_TYPES.includes(itemType)) {
      return NextResponse.json({ error: '유효하지 않은 itemType' }, { status: 400 })
    }

    // 1. 해당 유저의 draft 플랜 조회 — 도시와 무관하게 유저당 1개만 유지.
    //    (이전 구현은 city_id 를 키로 삼아 도시마다 draft 가 무한 증식하는 버그 있었음)
    const { data: existingPlans, error: findErr } = await supabase
      .from('travel_plans')
      .select('id, city_id')
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .order('created_at', { ascending: true })

    if (findErr) {
      return NextResponse.json(
        { error: '플랜 조회 실패', detail: findErr.message },
        { status: 500 }
      )
    }

    let plan: { id: string } | null = null

    if (existingPlans && existingPlans.length > 0) {
      // 가장 오래된 draft 하나만 유지하고 나머지는 자가 치유로 정리
      plan = { id: existingPlans[0].id }
      if (existingPlans.length > 1) {
        const extraIds = existingPlans.slice(1).map((p) => p.id)
        await supabase.from('travel_plans').delete().in('id', extraIds)
      }
      // 담는 도시가 기존 plan.city_id 와 다르면 최신 도시로 갱신
      if (existingPlans[0].city_id !== cityId) {
        await supabase
          .from('travel_plans')
          .update({ city_id: cityId })
          .eq('id', plan.id)
      }
    } else {
      // 2. 없으면 새 draft 생성
      const { data: newPlan, error: planErr } = await supabase
        .from('travel_plans')
        .insert({
          user_id: user.id,
          city_id: cityId,
          status: 'draft',
        })
        .select('id')
        .single()

      if (planErr || !newPlan) {
        return NextResponse.json(
          { error: '플랜 생성 실패', detail: planErr?.message },
          { status: 500 }
        )
      }
      plan = newPlan
    }

    // 3. 교통편 중복 방지: 같은 direction의 기존 교통편 삭제 후 교체
    if (itemType === 'transport' && itemData?.direction) {
      const { data: existing } = await supabase
        .from('plan_items')
        .select('id, item_data')
        .eq('plan_id', plan.id)
        .eq('item_type', 'transport')

      if (existing) {
        const dupes = existing.filter(
          (e) => (e.item_data as Record<string, unknown>)?.direction === itemData.direction
        )
        if (dupes.length > 0) {
          await supabase
            .from('plan_items')
            .delete()
            .in('id', dupes.map((d) => d.id))
        }
      }
    }

    // 4. 아이템 추가
    const { data: item, error: itemErr } = await supabase
      .from('plan_items')
      .insert({
        plan_id: plan.id,
        item_type: itemType,
        item_data: itemData,
      })
      .select('id')
      .single()

    if (itemErr || !item) {
      return NextResponse.json(
        { error: '아이템 추가 실패', detail: itemErr?.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, itemId: item.id, planId: plan.id })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
