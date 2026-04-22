import type { NextRequest } from 'next/server'

/**
 * 요청에서 클라이언트 IP 추출 (Vercel 호환).
 *
 * Vercel은 x-forwarded-for 맨 앞 IP가 실제 클라이언트 IP.
 * x-real-ip는 일부 프록시에서만 제공되므로 fallback 용도.
 * 모두 없으면 'unknown' — 이 경우 key가 공유되어 IP별 분리가 안 됨.
 */
export function getRequestIP(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const real = request.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}
