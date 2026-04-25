import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PASSES, type PassId } from '@/lib/data/passes'
import { isAdminEmail } from '@/lib/auth/admin'

export const dynamic = 'force-dynamic'

// 모든 피처를 해제한 풀 액세스 응답 — TEST_MODE / ADMIN 바이패스에서 공용
function fullAccessResponse(authenticated: boolean, flags?: { isAdmin?: boolean; testMode?: boolean }) {
  return NextResponse.json({
    authenticated,
    ...(flags?.isAdmin ? { isAdmin: true } : {}),
    ...(flags?.testMode ? { testMode: true } : {}),
    passes: ['move', 'live', 'story', 'allinone'] as PassId[],
    hasAllInOne: true,
    features: {
      traffic: true, spot: true, ai_curation: true,
      kfood: true, stay: true, ootd: true,
      quest: true, diy: true, memories: true,
      vip_badge: true, lp_multiplier_2x: true,
    },
    creditsRemaining: 0,
  })
}

// 유저 패스 상태 조회 — 활성 패스 목록 + 피처 잠금/해제 플래그
// 프런트엔드에서 "이 유저가 AI 큐레이션 쓸 수 있나?" 판단에 사용
export async function GET() {
  try {
    // [TEST_MODE 우회] 테스트 기간 동안 모든 사용자(비로그인 포함)에게 풀 액세스.
    // 환경변수만 false 로 바꾸면 실제 패스 체크 로직이 그대로 복원됨.
    if (process.env.TEST_MODE === 'true') {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      return fullAccessResponse(!!user, { testMode: true })
    }

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

    // [ADMIN 우회] ADMIN_EMAILS 에 포함된 계정은 AllInOne 보유자처럼 처리
    if (isAdminEmail(user.email)) {
      return fullAccessResponse(true, { isAdmin: true })
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
