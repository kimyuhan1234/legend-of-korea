import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { LP_TO_CREDIT_RATE, lpToCredits } from '@/lib/data/credit-packs'

export const dynamic = 'force-dynamic'

// LP → 크레딧 환전 (100 LP = 5 크레딧)
// 요청 body: { lpAmount: number }  — 반드시 100의 배수
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => null) as { lpAmount?: number } | null
    const lpAmount = body?.lpAmount

    if (!lpAmount || !Number.isFinite(lpAmount) || lpAmount <= 0) {
      return NextResponse.json({ error: 'invalid_lp_amount' }, { status: 400 })
    }

    if (lpAmount % LP_TO_CREDIT_RATE.lp !== 0) {
      return NextResponse.json(
        { error: 'must_be_multiple_of_100', message: `${LP_TO_CREDIT_RATE.lp} LP 단위로만 교환 가능합니다` },
        { status: 400 }
      )
    }

    const service = await createServiceClient()

    // 1. 현재 LP 조회 (클라이언트 금액 무시, 서버에서 직접)
    const { data: userRow, error: userErr } = await service
      .from('users')
      .select('total_lp')
      .eq('id', user.id)
      .single()

    if (userErr || !userRow) {
      return NextResponse.json(
        { error: 'user_not_found', detail: userErr?.message },
        { status: 404 }
      )
    }

    if (userRow.total_lp < lpAmount) {
      return NextResponse.json(
        { error: 'insufficient_lp', currentLp: userRow.total_lp, required: lpAmount },
        { status: 400 }
      )
    }

    const creditsGained = lpToCredits(lpAmount)

    // 2. 활성 구독 중 가장 최근 것 찾아 크레딧 추가
    const { data: sub, error: subErr } = await service
      .from('user_subscriptions')
      .select('id, credits_remaining')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (subErr) {
      return NextResponse.json(
        { error: 'subscription_lookup_failed', detail: subErr.message },
        { status: 500 }
      )
    }

    if (!sub) {
      return NextResponse.json(
        { error: 'subscription_required', message: '크레딧을 받으려면 패스가 필요합니다' },
        { status: 403 }
      )
    }

    // 3. LP 차감 + 크레딧 증가 + 교환 이력 기록
    const newLp = userRow.total_lp - lpAmount
    const newCredits = (sub.credits_remaining ?? 0) + creditsGained

    const { error: lpErr } = await service
      .from('users')
      .update({ total_lp: newLp })
      .eq('id', user.id)

    if (lpErr) {
      return NextResponse.json(
        { error: 'lp_update_failed', detail: lpErr.message },
        { status: 500 }
      )
    }

    const { error: credErr } = await service
      .from('user_subscriptions')
      .update({ credits_remaining: newCredits, updated_at: new Date().toISOString() })
      .eq('id', sub.id)

    if (credErr) {
      // 롤백: LP 복구
      await service.from('users').update({ total_lp: userRow.total_lp }).eq('id', user.id)
      return NextResponse.json(
        { error: 'credit_update_failed', detail: credErr.message },
        { status: 500 }
      )
    }

    await service.from('lp_exchanges').insert({
      user_id: user.id,
      lp_spent: lpAmount,
      credits_gained: creditsGained,
    })

    // LP 차감 트랜잭션 기록 (기존 패턴 재사용)
    await service.from('lp_transactions').insert({
      user_id: user.id,
      amount: -lpAmount,
      type: 'admin',
      description: `LP → 크레딧 교환 (${creditsGained} 크레딧)`,
    })

    return NextResponse.json({
      success: true,
      lpSpent: lpAmount,
      creditsGained,
      remainingLp: newLp,
      creditsRemaining: newCredits,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
