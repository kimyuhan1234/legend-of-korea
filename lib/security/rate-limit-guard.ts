import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from './rate-limit'
import { getRequestIP } from './get-ip'

export type RateLimitPreset = 'PUBLIC' | 'USER' | 'ADMIN'

const PRESETS: Record<RateLimitPreset, { windowMs: number; max: number }> = {
  PUBLIC: { windowMs: 60_000, max: 60 }, // 공개 API — 1분당 60회
  USER:   { windowMs: 60_000, max: 30 }, // 로그인 사용자 API — 1분당 30회
  ADMIN:  { windowMs: 60_000, max: 10 }, // 관리자 API — 1분당 10회 (무차별 대입 방지)
}

/**
 * 미들웨어에서 사용. 429이면 NextResponse 반환, 통과면 null.
 * key = preset:ip 로 그룹화 — 공격자가 endpoint rotation해도 같은 버킷 사용.
 */
export function rateLimitGuard(request: NextRequest, preset: RateLimitPreset): NextResponse | null {
  const ip = getRequestIP(request)
  const opts = PRESETS[preset]
  const key = `${preset}:${ip}`

  const result = checkRateLimit(key, opts)
  if (result.ok) return null

  return new NextResponse(
    JSON.stringify({ error: 'Too Many Requests', retryAfter: result.retryAfter }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(result.retryAfter),
        'X-RateLimit-Limit': String(opts.max),
        'X-RateLimit-Remaining': '0',
      },
    }
  )
}
