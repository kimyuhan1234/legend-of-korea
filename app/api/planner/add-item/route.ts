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

    // 1. 해당 유저의 draft 플랜 조회 (city 기준)
    let { data: plan } = await supabase
      .from('travel_plans')
      .select('id')
      .eq('user_id', user.id)
      .eq('city_id', cityId)
      .eq('status', 'draft')
      .maybeSingle()

    // 2. 없으면 자동 생성
    if (!plan) {
      const periodEnd = new Date()
      periodEnd.setMonth(periodEnd.getMonth() + 1)

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
        return NextResponse.json({ error: '플랜 생성 실패' }, { status: 500 })
      }
      plan = newPlan
    }

    // 3. 아이템 추가
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
      return NextResponse.json({ error: '아이템 추가 실패' }, { status: 500 })
    }

    return NextResponse.json({ success: true, itemId: item.id, planId: plan.id })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
