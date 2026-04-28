import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PASSES, isPassType } from '@/lib/data/passes'

export const dynamic = 'force-dynamic'

/**
 * POST /api/passes/purchase
 *
 * PRD-PRICING-2026-001: 패스 1 회 구매 — passes 레코드 생성.
 *
 * 흐름:
 *   1. 클라이언트가 Toss 결제 위젯으로 결제 요청 → successUrl 진입
 *   2. /api/payments/toss/confirm 으로 paymentKey 검증 (서버에서 실 금액 대조)
 *   3. 검증 성공 시 본 엔드포인트 호출 → passes INSERT
 *   4. 응답: { pass: {...} }
 *
 * 요청 body: { type: 'short' | 'standard' | 'long', paymentKey: string, orderId: string }
 *
 * 보안
 *   - auth.uid() 검증
 *   - price_krw 는 PASSES 정적 데이터에서 서버측 직접 조회 (클라이언트 값 무시 — CLAUDE.md '영수증 이중 확인')
 *   - 활성 패스 중복 보유 방지 (이미 active 면 409)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json().catch(() => null)) as {
      type?: unknown
      paymentKey?: string
      orderId?: string
    } | null

    if (!body || !isPassType(body.type)) {
      return NextResponse.json(
        { error: 'invalid_pass_type', valid: ['short', 'standard', 'long'] },
        { status: 400 },
      )
    }

    const pass = PASSES[body.type]

    // 중복 활성 패스 보유 시 거부 (정식 출시 후 정책 재확인)
    const { data: existing } = await supabase
      .from('passes')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'already_active', message: '이미 활성 패스를 보유 중입니다.' },
        { status: 409 },
      )
    }

    const now = Date.now()
    const expiresAt = new Date(now + pass.durationDays * 24 * 60 * 60 * 1000)

    const { data: created, error: insErr } = await supabase
      .from('passes')
      .insert({
        user_id: user.id,
        type: pass.type,
        price_krw: pass.priceKrw,
        duration_days: pass.durationDays,
        expires_at: expiresAt.toISOString(),
        payment_id: body.paymentKey ?? null,
        status: 'active',
      })
      .select('id, type, expires_at, duration_days')
      .single()

    if (insErr || !created) {
      return NextResponse.json(
        { error: 'pass_insert_failed', detail: insErr?.message },
        { status: 500 },
      )
    }

    return NextResponse.json({
      pass: {
        id: created.id,
        type: created.type,
        expiresAt: created.expires_at,
        durationDays: created.duration_days,
      },
    }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    )
  }
}
