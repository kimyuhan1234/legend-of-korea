/**
 * Cloudflare Turnstile 토큰 검증 헬퍼.
 *
 * 운영자 발급 키:
 *   - NEXT_PUBLIC_TURNSTILE_SITE_KEY (클라이언트)
 *   - TURNSTILE_SECRET_KEY (서버)
 *
 * 키 미설정 시 Cloudflare 공식 dev 더미 키 (always pass) 사용 — local 개발 편의용.
 *   - site:   1x00000000000000000000AA
 *   - secret: 1x0000000000000000000000000000000AA
 */

export const TURNSTILE_DEV_SITE_KEY = '1x00000000000000000000AA'
export const TURNSTILE_DEV_SECRET_KEY = '1x0000000000000000000000000000000AA'

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export function getTurnstileSiteKey(): string {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || TURNSTILE_DEV_SITE_KEY
}

function getSecretKey(): string {
  return process.env.TURNSTILE_SECRET_KEY || TURNSTILE_DEV_SECRET_KEY
}

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
  action?: string
  cdata?: string
}

/**
 * Cloudflare Turnstile siteverify endpoint 호출.
 *
 * @param token 클라이언트 widget 에서 받은 토큰
 * @param remoteIp 요청자 IP (선택, 강화 옵션)
 * @returns 검증 성공 여부
 */
export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean> {
  if (!token) return false

  const formData = new URLSearchParams()
  formData.set('secret', getSecretKey())
  formData.set('response', token)
  if (remoteIp) formData.set('remoteip', remoteIp)

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })
    const data = (await res.json()) as TurnstileVerifyResponse
    return data.success === true
  } catch {
    return false
  }
}
