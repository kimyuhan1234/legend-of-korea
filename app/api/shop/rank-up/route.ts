import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/shop/rank-up
 *
 * 빗방울을 차감하고 users.current_level 을 1단계 올린다.
 * scholar/warrior 분기 폐기 (2026-05) — 단일 경로 1~10.
 * 자동 승급 없음. 사용자가 상점에서 수동 구매로만 상승.
 */
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  // 1) 현재 사용자 상태
  const { data: userRow, error: readErr } = await supabase
    .from('users')
    .select('current_level, total_lp')
    .eq('id', user.id)
    .maybeSingle<{ current_level: number | null; total_lp: number | null }>()

  if (readErr || !userRow) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const currentLevel = userRow.current_level ?? 1
  const currentBalance = userRow.total_lp ?? 0

  if (currentLevel >= 10) {
    return NextResponse.json({ error: 'Already at max level' }, { status: 400 })
  }

  const targetLevel = currentLevel + 1

  // 2) 비용 조회
  const { data: costRow, error: costErr } = await supabase
    .from('rank_up_costs')
    .select('raindrops_required')
    .eq('level', targetLevel)
    .maybeSingle<{ raindrops_required: number }>()

  if (costErr || !costRow) {
    return NextResponse.json({ error: 'Cost lookup failed' }, { status: 500 })
  }

  const required = costRow.raindrops_required

  if (currentBalance < required) {
    return NextResponse.json(
      { error: 'Insufficient raindrops', required, currentBalance, deficit: required - currentBalance },
      { status: 400 }
    )
  }

  const newBalance = currentBalance - required

  // 3) 빗방울 차감 + 레벨 증가
  const { error: updateErr } = await supabase
    .from('users')
    .update({ current_level: targetLevel, total_lp: newBalance })
    .eq('id', user.id)

  if (updateErr) {
    console.error('[rank-up] update failed:', updateErr.message)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  // 4) lp_transactions 기록
  await supabase.from('lp_transactions').insert({
    user_id: user.id,
    amount: -required,
    type: 'RANK_UP',
    description: `Lv ${currentLevel} → Lv ${targetLevel} 랭크업`,
  })

  return NextResponse.json({
    success: true,
    newLevel: targetLevel,
    newBalance,
    deducted: required,
  })
}
