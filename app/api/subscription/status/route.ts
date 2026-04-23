import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 유저 구독 조회 — 크레딧 잔액 포함
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select(`
        id,
        status,
        current_period_start,
        current_period_end,
        credits_remaining,
        credits_reset_at,
        subscription_plans (
          id,
          plan_type,
          name,
          price,
          features,
          kit_discount_rate,
          monthly_credits
        )
      `)
      .eq('user_id', user.id)
      .maybeSingle()

    // 구독 유효성 확인
    const now = new Date()
    const isActive =
      subscription &&
      subscription.status === 'active' &&
      new Date(subscription.current_period_end) > now

    if (isActive) {
      return NextResponse.json({
        subscribed: true,
        subscription,
      })
    }

    // 비구독자 → free 플랜 정보 반환
    const { data: freePlan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('plan_type', 'free')
      .eq('is_active', true)
      .single()

    return NextResponse.json({
      subscribed: false,
      freePlan,
    })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
