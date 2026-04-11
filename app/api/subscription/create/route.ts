import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

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
      .select('id, plan_type, price, tier_levelup, kit_discount_rate, monthly_credits')
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
      tier_levelup_used: false,
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

    // 4. 전설 플랜 레벨업 혜택 처리
    let tierUpResult: {
      leveledUp: boolean
      newTierLevel?: number
      bonusLp?: number
      alreadyUsed?: boolean
    } = { leveledUp: false }

    if (plan.plan_type === 'legend' && plan.tier_levelup) {
      // 유저 현재 티어 조회
      const { data: userData } = await service
        .from('users')
        .select('current_tier, total_lp')
        .eq('id', user.id)
        .single()

      if (userData) {
        const currentTier = userData.current_tier || 1

        if (currentTier >= 6) {
          // Lv.6이면 LP 500 보너스
          await service.from('lp_transactions').insert({
            user_id: user.id,
            amount: 500,
            type: 'admin',
            description: '전설 플랜 구독 보너스 (최고 티어)',
          })
          await service
            .from('users')
            .update({ total_lp: userData.total_lp + 500 })
            .eq('id', user.id)

          tierUpResult = { leveledUp: false, bonusLp: 500 }
        } else {
          // 1랭크 레벨업
          const nextTierLevel = currentTier + 1
          const { data: nextTier } = await service
            .from('tiers')
            .select('level, min_lp')
            .eq('level', nextTierLevel)
            .single()

          if (nextTier) {
            await service
              .from('users')
              .update({ current_tier: nextTierLevel })
              .eq('id', user.id)

            await service
              .from('user_subscriptions')
              .update({ tier_levelup_used: true })
              .eq('id', subscriptionId)

            tierUpResult = { leveledUp: true, newTierLevel: nextTierLevel }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      subscriptionId,
      planType: plan.plan_type,
      tierUp: tierUpResult,
    })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
