import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * 헬스체크 엔드포인트.
 * middleware 의 일일 접속자 제한에서 명시적으로 바이패스되는 라우트.
 * 외부 모니터링 / uptime 체커가 상시 접근할 수 있어야 함.
 */
export async function GET() {
  return NextResponse.json({ ok: true, timestamp: Date.now() })
}
