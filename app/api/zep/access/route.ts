import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hasActivePass } from '@/lib/auth/pass'

export const dynamic = 'force-dynamic'

/**
 * GET /api/zep/access
 *
 * ZEP 통합 스페이스 비밀번호 발급 — 보안 격상 (2026-05).
 *
 * 흐름:
 *   1. 비로그인 → 401 LOGIN_REQUIRED
 *   2. 로그인 + 활성 패스 미보유 → 403 PASS_REQUIRED
 *   3. 환경변수 미설정 → 503 NOT_CONFIGURED (운영자 발급 누락)
 *   4. 활성 패스 보유 → 200 + { password }
 *
 * 비밀번호는 절대 클라이언트 번들에 포함되지 않고, 본 라우트가
 * 활성 패스 검증을 통과한 요청에만 응답으로 반환한다.
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'LOGIN_REQUIRED' }, { status: 401 })
  }

  const ok = await hasActivePass(user.id)
  if (!ok) {
    return NextResponse.json({ error: 'PASS_REQUIRED' }, { status: 403 })
  }

  const password = process.env.ZEP_SPACE_PASSWORD
  if (!password) {
    return NextResponse.json({ error: 'NOT_CONFIGURED' }, { status: 503 })
  }

  return NextResponse.json(
    { password },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
