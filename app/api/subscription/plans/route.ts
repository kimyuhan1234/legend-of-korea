import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('id, plan_type, name, price, features, kit_discount_rate, tier_levelup')
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (error) {
      return NextResponse.json({ error: '플랜 조회 실패' }, { status: 500 })
    }

    return NextResponse.json({ plans: data ?? [] })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
