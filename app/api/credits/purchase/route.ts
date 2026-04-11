import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 서버에서만 신뢰되는 고정 패키지 — 클라이언트가 보낸 price 는 무시한다.
// 배포 시 Toss/Stripe 실제 결제 호출 붙일 때도 이 매핑이 결제 서버 금액과 일치해야 함.
const CREDIT_PACKAGES = {
  small: { credits: 10, price: 1900 },
  medium: { credits: 30, price: 4900 },
  large: { credits: 100, price: 12900 },
} as const

type PackageKey = keyof typeof CREDIT_PACKAGES

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => null) as { packageKey?: string } | null
    const packageKey = body?.packageKey as PackageKey | undefined

    if (!packageKey || !(packageKey in CREDIT_PACKAGES)) {
      return NextResponse.json(
        { error: 'invalid_package', valid: Object.keys(CREDIT_PACKAGES) },
        { status: 400 }
      )
    }

    const pkg = CREDIT_PACKAGES[packageKey]

    // 구독 중인 유저만 크레딧 추가 구매 허용
    const { data: sub, error: subErr } = await supabase
      .from('user_subscriptions')
      .select('id, credits_remaining, status, plan_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (subErr) {
      return NextResponse.json(
        { error: 'subscription_lookup_failed', detail: subErr.message },
        { status: 500 }
      )
    }

    if (!sub) {
      return NextResponse.json(
        { error: 'subscription_required', message: '구독자만 크레딧을 구매할 수 있습니다' },
        { status: 403 }
      )
    }

    // NOTE: 실제 Toss/Stripe 결제는 배포 직전 연동 — 현재는 manual 로 기록만 남김
    // CLAUDE.md "구독 결제 상태 유지 규칙" 준수
    const { error: purchaseErr } = await supabase
      .from('credit_purchases')
      .insert({
        user_id: user.id,
        credits: pkg.credits,
        price: pkg.price,
        payment_provider: 'manual',
      })

    if (purchaseErr) {
      return NextResponse.json(
        { error: 'purchase_record_failed', detail: purchaseErr.message },
        { status: 500 }
      )
    }

    // 크레딧 잔액 증가
    const newBalance = sub.credits_remaining + pkg.credits
    const { error: updateErr } = await supabase
      .from('user_subscriptions')
      .update({
        credits_remaining: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sub.id)

    if (updateErr) {
      return NextResponse.json(
        { error: 'balance_update_failed', detail: updateErr.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      package: packageKey,
      creditsAdded: pkg.credits,
      priceCharged: pkg.price,
      creditsRemaining: newBalance,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
