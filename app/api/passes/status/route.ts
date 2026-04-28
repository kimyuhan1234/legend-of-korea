import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getActivePass } from '@/lib/auth/pass'

export const dynamic = 'force-dynamic'

/**
 * GET /api/passes/status
 *
 * PRD-PRICING-2026-001: 사용자의 활성 패스 1 건 조회.
 * TEST_MODE=true 면 가짜 long 패스 반환 (lib/auth/pass.ts 우회 처리).
 *
 * 응답 형식:
 *   { authenticated: boolean, activePass: ActivePass | null }
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const activePass = await getActivePass(user?.id ?? null)

    return NextResponse.json({
      authenticated: !!user,
      activePass,
    })
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
