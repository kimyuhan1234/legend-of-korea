import { NextResponse } from 'next/server'
import { verifyTurnstileToken } from '@/lib/auth/turnstile'

export const dynamic = 'force-dynamic'

/**
 * 클라이언트가 단독으로 토큰 유효성을 사전 점검할 때 사용.
 * 실제 회원가입/로그인 server action 안에서도 동일 검증을 한 번 더 수행한다 (이중 방어).
 */
export async function POST(req: Request) {
  let token: string | null = null
  try {
    const body = await req.json()
    token = typeof body?.token === 'string' ? body.token : null
  } catch {
    // ignore — token null
  }

  if (!token) {
    return NextResponse.json({ error: 'MISSING_TOKEN' }, { status: 422 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
  const ok = await verifyTurnstileToken(token, ip)

  if (!ok) {
    return NextResponse.json({ error: 'TURNSTILE_FAILED' }, { status: 422 })
  }

  return NextResponse.json({ success: true })
}
