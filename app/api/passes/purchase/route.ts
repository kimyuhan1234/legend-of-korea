import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { PASSES, type PassId } from '@/lib/data/passes'

export const dynamic = 'force-dynamic'

// 패스 구매 (stub — 실제 결제는 배포 직전 Toss 연동)
// CLAUDE.md "구독 결제 상태 유지 규칙" 준수: paymentProvider='manual'
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => null) as { passId?: string } | null
    const passId = body?.passId as PassId | undefined

    const pass = PASSES.find((p) => p.id === passId)
    if (!pass) {
      return NextResponse.json(
        { error: 'invalid_pass', valid: PASSES.map((p) => p.id) },
        { status: 400 }
      )
    }

    const service = await createServiceClient()

    // 1. plan_type → UUID 매핑 조회
    const { data: plan, error: planErr } = await service
      .from('subscription_plans')
      .select('id, plan_type, monthly_credits')
      .eq('plan_type', pass.id)
      .eq('is_active', true)
      .single()

    if (planErr || !plan) {
      return NextResponse.json(
        { error: 'plan_not_found', detail: planErr?.message },
        { status: 404 }
      )
    }

    // 2. 중복 구매 방지 (동일 패스 active 있으면 거부)
    const { data: dup } = await service
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('plan_id', plan.id)
      .eq('status', 'active')
      .maybeSingle()

    if (dup) {
      return NextResponse.json(
        { error: 'already_subscribed', message: '이미 보유한 패스입니다' },
        { status: 409 }
      )
    }

    // 3. All in One 구매 시 기존 개별 패스 모두 취소 (중복 혜택 방지)
    if (pass.id === 'allinone') {
      await service
        .from('user_subscriptions')
        .update({ status: 'canceled', updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('status', 'active')
    }

    // 4. 구독 생성 (1개월, manual — 실제 결제는 배포 직전)
    const periodStart = new Date()
    const periodEnd = new Date()
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    const { data: created, error: insErr } = await service
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        plan_id: plan.id,
        status: 'active',
        payment_provider: 'manual',
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        tier_levelup_used: false,
        credits_remaining: plan.monthly_credits ?? 0,
        credits_reset_at: periodEnd.toISOString(),
      })
      .select('id')
      .single()

    if (insErr || !created) {
      return NextResponse.json(
        { error: 'subscription_insert_failed', detail: insErr?.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriptionId: created.id,
      passId: pass.id,
      priceCharged: pass.price,
      creditsGranted: plan.monthly_credits ?? 0,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
