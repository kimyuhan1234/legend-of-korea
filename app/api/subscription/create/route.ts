import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// [Day 4 디자인 B] 자동 승급 제거 — 랭크업은 /memories 상점에서 수동만 가능
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { planId, paymentProvider, paymentSubscriptionId } = body

    if (!planId) {
      return NextResponse.json({ error: 'planId 필수' }, { status: 400 })
    }

    const service = await createServiceClient()

    // 1. 중복 구독 방지
    const { data: existing } = await service
      .from('user_subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing && existing.status === 'active') {
      return NextResponse.json({ error: '이미 활성 구독이 있습니다' }, { status: 409 })
    }

    // 2. 플랜 정보 서버에서 직접 조회 (클라이언트 금액 무시)
    const { data: plan, error: planErr } = await service
      .from('subscription_plans')
      .select('id, plan_type, price, kit_discount_rate, monthly_credits')
      .eq('id', planId)
      .eq('is_active', true)
      .single()

    if (planErr || !plan) {
      return NextResponse.json({ error: '유효하지 않은 플랜' }, { status: 400 })
    }

    // 3. 구독 생성 (1개월) + 크레딧 초기화
    const periodStart = new Date()
    const periodEnd = new Date()
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    const subscriptionData = {
      user_id: user.id,
      plan_id: plan.id,
      status: 'active' as const,
      payment_provider: paymentProvider || null,
      payment_subscription_id: paymentSubscriptionId || null,
      current_period_start: periodStart.toISOString(),
      current_period_end: periodEnd.toISOString(),
      credits_remaining: plan.monthly_credits ?? 0,
      credits_reset_at: periodEnd.toISOString(),
    }

    let subscriptionId: string
    if (existing) {
      // 기존 expired/canceled 구독 업데이트
      const { data: updated, error: updErr } = await service
        .from('user_subscriptions')
        .update(subscriptionData)
        .eq('id', existing.id)
        .select('id')
        .single()

      if (updErr || !updated) {
        return NextResponse.json({ error: '구독 업데이트 실패' }, { status: 500 })
      }
      subscriptionId = updated.id
    } else {
      const { data: created, error: insErr } = await service
        .from('user_subscriptions')
        .insert(subscriptionData)
        .select('id')
        .single()

      if (insErr || !created) {
        return NextResponse.json({ error: '구독 생성 실패' }, { status: 500 })
      }
      subscriptionId = created.id
    }

    return NextResponse.json({
      success: true,
      subscriptionId,
      planType: plan.plan_type,
    })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
