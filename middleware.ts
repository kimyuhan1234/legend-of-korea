import { type NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { updateSession } from "@/lib/supabase/middleware"
import { rateLimitGuard, type RateLimitPreset } from "@/lib/security/rate-limit-guard"

const locales = ["ko", "ja", "en", "zh-CN", "zh-TW"] as const
const defaultLocale = "ko"

// 비로그인 접근 허용 경로 (locale prefix 제외, 화이트리스트)
const PUBLIC_PATHS = ["/", "/auth", "/login", "/signup", "/stay"]

/**
 * API 경로별 Rate Limit 프리셋 결정.
 * 'NONE' 은 Rate Limit 미적용 (결제 정상 재시도·웹훅 등과 충돌 방지).
 */
function determineRateLimitPreset(pathname: string): RateLimitPreset | 'NONE' {
  // 결제 / 주문 / 구독 — Toss·Stripe 재시도 정책과 충돌할 수 있어 제외
  if (
    pathname.startsWith('/api/payments/') ||
    pathname.startsWith('/api/orders') ||
    pathname === '/api/passes/purchase' ||
    pathname === '/api/subscription/create' ||
    pathname === '/api/subscription/cancel'
  ) {
    return 'NONE'
  }

  // 관리자 전용 배치 — 무차별 대입 방지로 가장 엄격
  if (
    pathname.startsWith('/api/admin/') ||
    pathname === '/api/tour-stays/refresh' ||
    pathname === '/api/tour-stays/tag'
  ) {
    return 'ADMIN'
  }

  // 비로그인 공개 API — 봇 보호 우선
  if (
    pathname === '/api/tour-stays/recommend' ||
    pathname === '/api/tour-stays/test' ||
    pathname === '/api/community/ads' ||
    pathname === '/api/lp/leaderboard'
  ) {
    return 'PUBLIC'
  }

  // 나머지는 사용자 API
  return 'USER'
}

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 정적 자산: 패스스루 ──────────────────────────
  if (
    pathname.startsWith("/_next/") ||
    /\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|eot|webmanifest|json)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // ── API: Rate Limit 체크 후 패스스루 ──────────────────
  if (pathname.startsWith("/api/")) {
    const preset = determineRateLimitPreset(pathname)
    if (preset !== 'NONE') {
      const limited = rateLimitGuard(request, preset)
      if (limited) return limited
    }
    return NextResponse.next()
  }

  // ── 1. Supabase 세션 갱신 (실패해도 무시 — intl 라우팅은 계속) ──
  let sessionResponse: NextResponse
  try {
    sessionResponse = await updateSession(request)
  } catch {
    sessionResponse = NextResponse.next()
  }

  // ── 2. next-intl 로케일 라우팅 ──────────────────────────
  const intlResponse = intlMiddleware(request)

  // intl 리다이렉트 우선 (307 / 308)
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse
  }

  // ── 3. 비공개 경로 인증 체크 (PUBLIC_PATHS 이외 전부 로그인 필요) ──
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/)
  if (localeMatch) {
    const locale = localeMatch[1]
    const restPath = localeMatch[2] ?? "/"

    const isPublic = PUBLIC_PATHS.some(
      (p) => restPath === p || (p !== "/" && restPath.startsWith(`${p}/`))
    )

    if (!isPublic) {
      // Supabase auth 쿠키 이름 패턴: sb-<project_ref>-auth-token
      const projectRef =
        process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0] ?? ""
      const authCookieName = `sb-${projectRef}-auth-token`

      const hasSession = request.cookies.has(authCookieName)

      if (!hasSession) {
        const loginUrl = new URL(`/${locale}/auth/login`, request.url)
        loginUrl.searchParams.set("next", pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  // ── 4. 세션 쿠키를 intl 응답에 병합하여 반환 ──────────
  sessionResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie)
  })

  return intlResponse
}

export const config = {
  matcher: [
    /*
     * _next/static, _next/image, favicon.ico, 정적 파일 확장자 제외
     * API 라우트도 제외 (updateSession은 위 if 분기에서 이미 패스스루)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|eot|mp4|mp3|wav|ogg|webm|mov|avi)$).*)",
  ],
}