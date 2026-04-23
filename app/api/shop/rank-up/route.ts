import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/shop/rank-up
 *
 * 디자인 B — 빗방울을 차감하고 users.current_level 을 1단계 올린다.
 * 자동 승급 없음. 레벨업은 사용자가 상점에서 수동으로만 구매.
 *
 * 전제:
 *  - Lv 10 까지
 *  - Lv 3 → 4 이동 시 users.tech_tree_route 설정 필수 (scholar/warrior)
 *  - rank_up_costs 테이블에서 비용 조회
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
    .select('current_level, total_lp, tech_tree_route')
    .eq('id', user.id)
    .maybeSingle<{ current_level: number | null; total_lp: number | null; tech_tree_route: string | null }>()

  if (readErr || !userRow) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const currentLevel = userRow.current_level ?? 1
  const currentBalance = userRow.total_lp ?? 0
  const route = userRow.tech_tree_route

  if (currentLevel >= 10) {
    return NextResponse.json({ error: 'Already at max level' }, { status: 400 })
  }

  const targetLevel = currentLevel + 1

  // 2) Lv 3 → 4 전환 시 route 필요
  if (targetLevel >= 4 && route === null) {
    return NextResponse.json(
      { error: 'Branch selection required', needsBranchSelection: true },
      { status: 400 }
    )
  }

  // 3) 비용 조회
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

  // 4) 빗방울 차감 + 레벨 증가
  const { error: updateErr } = await supabase
    .from('users')
    .update({ current_level: targetLevel, total_lp: newBalance })
    .eq('id', user.id)

  if (updateErr) {
    console.error('[rank-up] update failed:', updateErr.message)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  // 5) lp_transactions 기록
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
