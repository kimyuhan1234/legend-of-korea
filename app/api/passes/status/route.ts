import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PASSES, type PassId } from '@/lib/data/passes'

export const dynamic = 'force-dynamic'

// 유저 패스 상태 조회 — 활성 패스 목록 + 피처 잠금/해제 플래그
// 프런트엔드에서 "이 유저가 AI 큐레이션 쓸 수 있나?" 판단에 사용
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        passes: [],
        features: {},
        creditsRemaining: 0,
      })
    }

    // 활성 구독 전체 + plan_type 조인
    const { data: subs, error } = await supabase
      .from('user_subscriptions')
      .select('id, status, current_period_end, credits_remaining, subscription_plans(plan_type)')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (error) {
      return NextResponse.json(
        { error: 'lookup_failed', detail: error.message },
        { status: 500 }
      )
    }

    // 활성 plan_type 집합 (Supabase join 은 객체 혹은 배열로 반환 — 타입 안전하게 펼침)
    const activePassIds: PassId[] = []
    let totalCredits = 0

    for (const s of subs ?? []) {
      const planRel = s.subscription_plans as unknown as { plan_type: string } | { plan_type: string }[] | null
      const planType = Array.isArray(planRel) ? planRel[0]?.plan_type : planRel?.plan_type
      if (planType && PASSES.some((p) => p.id === planType)) {
        activePassIds.push(planType as PassId)
      }
      totalCredits += s.credits_remaining ?? 0
    }

    // All in One 보유 시 모든 피처 해제
    const hasAllInOne = activePassIds.includes('allinone')
    const activeSet = new Set(activePassIds)

    const has = (passId: PassId) => hasAllInOne || activeSet.has(passId)

    const features = {
      // Move 패스 피처
      traffic: has('move'),
      spot: has('move'),
      ai_curation: has('move'),
      // Live 패스 피처
      kfood: has('live'),
      stay: has('live'),
      ootd: has('live'),
      // Story 패스 피처
      quest: has('story'),
      diy: has('story'),
      memories: has('story'),
      // All in One 전용 혜택
      vip_badge: hasAllInOne,
      lp_multiplier_2x: hasAllInOne,
    }

    return NextResponse.json({
      authenticated: true,
      passes: activePassIds,
      hasAllInOne,
      features,
      creditsRemaining: totalCredits,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
