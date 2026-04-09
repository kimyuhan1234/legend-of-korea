import { type NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { updateSession } from "@/lib/supabase/middleware"

const locales = ["ko", "ja", "en"] as const
const defaultLocale = "ko"

// 로그인 필요 경로 (locale prefix 제외)
const PROTECTED_PATHS = ["/mypage", "/community/write", "/shop", "/missions"]

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 정적 자산 / API: 패스스루 ──────────────────────────
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    /\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|eot)$/.test(pathname)
  ) {
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

  // ── 3. 보호 경로 인증 체크 ──────────────────────────────
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/)
  if (localeMatch) {
    const locale = localeMatch[1]
    const restPath = localeMatch[2] ?? "/"

    const needsAuth = PROTECTED_PATHS.some((p) => restPath === p || restPath.startsWith(`${p}/`))

    if (needsAuth) {
      // Supabase auth 쿠키 이름 패턴: sb-<project_ref>-auth-token
      const projectRef =
        process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0] ?? ""
      const authCookieName = `sb-${projectRef}-auth-token`

      const hasSession =
        request.cookies.has(authCookieName) ||
        request.cookies.has("sb-isixbzxophgxrfgjesaa-auth-token")

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
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|eot)$).*)",
  ],
}