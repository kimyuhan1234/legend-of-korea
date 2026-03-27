import { type NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { updateSession } from "@/lib/supabase/middleware"
import { locales, defaultLocale } from "@/i18n"

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
})

// 로그인 필요 경로 (locale 제외한 부분)
const PROTECTED_PATHS = ["/mypage", "/community/write", "/shop"]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 정적 파일 및 API 패스스루
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(ico|svg|png|jpg|jpeg|gif|webp|woff|woff2)$/)
  ) {
    return NextResponse.next()
  }

  // 1. Supabase 세션 갱신
  const sessionResponse = await updateSession(request)

  // 2. next-intl 로케일 처리
  const intlResponse = intlMiddleware(request)

  // intl이 리다이렉트를 반환하면 그것을 우선 적용
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse
  }

  // 3. 보호된 라우트 체크
  const localeMatch = pathname.match(/^\/([a-z]{2})(.*)$/)
  if (localeMatch) {
    const locale = localeMatch[1]
    const restPath = localeMatch[2] || "/"

    if (PROTECTED_PATHS.some((p) => restPath.startsWith(p))) {
      // 세션 쿠키 확인
      const authCookie = request.cookies.get(
        `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}-auth-token`
      ) || request.cookies.get("sb-isixbzxophgxrfgjesaa-auth-token")

      if (!authCookie) {
        const loginUrl = new URL(`/${locale}/auth/login`, request.url)
        loginUrl.searchParams.set("next", restPath)
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  // 세션 쿠키를 intl 응답에 병합
  const response = intlResponse || sessionResponse
  sessionResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie)
  })

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
}
