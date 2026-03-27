import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// 지원 로케일
const LOCALES = ["ko", "ja", "en"]
const DEFAULT_LOCALE = "ko"

// 로그인 필요 경로
const PROTECTED_PATHS = ["/mypage", "/community/write", "/shop"]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ── 1. 로케일 리다이렉트 ──────────────────────
  // 루트(/) 접근 시 기본 로케일로 리다이렉트
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url))
  }

  // 로케일 없는 경로 → 기본 로케일 추가
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale && !pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url))
  }

  // ── 2. Supabase 세션 갱신 ──────────────────────
  const response = await updateSession(request)

  // ── 3. 보호된 라우트 처리 ──────────────────────
  const localeMatch = pathname.match(/^\/([a-z]{2})(.*)$/)
  if (localeMatch) {
    const locale = localeMatch[1]
    const restPath = localeMatch[2]

    const isProtected = PROTECTED_PATHS.some((p) => restPath.startsWith(p))

    if (isProtected) {
      // 세션 쿠키 존재 여부로 인증 확인 (updateSession이 이미 처리)
      const supabaseCookie = request.cookies.get("sb-isixbzxophgxrfgjesaa-auth-token")
      const hasSession = !!supabaseCookie

      if (!hasSession) {
        const loginUrl = new URL(`/${locale}/auth/login`, request.url)
        loginUrl.searchParams.set("next", restPath)
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
