import { type NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { updateSession } from "@/lib/supabase/middleware"
import { getSessionEmail } from "@/lib/supabase/middleware-user"
import { rateLimitGuard, type RateLimitPreset } from "@/lib/security/rate-limit-guard"
import { isAdminEmail } from "@/lib/auth/admin"

const locales = ["ko", "ja", "en", "zh-CN", "zh-TW"] as const
const defaultLocale = "ko"
const LOCALE_REGEX = /^\/([a-z]{2}(?:-[A-Z]{2})?)(\/|$)/

// 비로그인 접근 허용 경로 (locale prefix 제외, 화이트리스트)
// P1-11: /discover 추가 — Discover 허브는 외국인 비로그인 첫 진입점.
// P1-12: /community 추가 — Community 허브 (MEMORIES + DIY 카드) 도 첫 인상 노출.
// P1-13: /story, /pass 추가 — 헤더 4-메뉴 (DISCOVER/QUEST/PASS/COMMUNITY) 첫 인상 일관성.
//        4개 메뉴 모두 비로그인 둘러보기 가능해야 함 (로그인 강제 시 첫 인상 깨짐).
const PUBLIC_PATHS = ["/", "/auth", "/login", "/signup", "/stay", "/discover", "/community", "/story", "/pass", "/privacy", "/terms", "/maintenance"]

// ── 일일 접속자 제한 (테스트 기간) ───────────────────────────
// Edge/Serverless 인스턴스별 독립 메모리이므로 엄밀한 글로벌 제한은 아님 —
// 테스트 기간 '대략적' 접속 게이트로 동작한다.
let dailyVisitorIps = new Set<string>()
let lastResetDate = ""

function getMaxDailyVisitors(): number {
  const raw = process.env.MAX_DAILY_VISITORS
  const n = raw ? parseInt(raw, 10) : NaN
  return Number.isFinite(n) && n > 0 ? n : 50
}

function isMaintenanceMode(): boolean {
  return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"
}

function getClientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? request.ip ?? "unknown"
}

/** 접속자 제한에서 항상 통과시킬 경로. locale prefix 유무 모두 매칭. */
function isGateBypassPath(pathname: string): boolean {
  // 헬스체크
  if (pathname === "/api/health") return true
  // /maintenance 페이지 자체 (locale prefix 있든 없든)
  if (pathname === "/maintenance") return true
  const localeMatch = pathname.match(LOCALE_REGEX)
  if (localeMatch) {
    const rest = pathname.slice(localeMatch[0].length - 1) || "/"
    if (rest === "/maintenance" || rest.startsWith("/maintenance/")) return true
    // 인증 경로는 관리자 로그인을 위해 열어둠
    if (rest.startsWith("/auth/")) return true
  }
  return false
}

/** 오늘 방문자 집합 갱신 후 허용 여부 반환. 이미 방문했거나 정원 내면 true. */
function recordVisitor(ip: string): boolean {
  const today = new Date().toISOString().slice(0, 10) // UTC 날짜
  if (today !== lastResetDate) {
    dailyVisitorIps = new Set()
    lastResetDate = today
  }
  if (dailyVisitorIps.has(ip)) return true
  if (dailyVisitorIps.size >= getMaxDailyVisitors()) return false
  dailyVisitorIps.add(ip)
  return true
}

function extractLocaleFromPath(pathname: string): string {
  return pathname.match(LOCALE_REGEX)?.[1] ?? defaultLocale
}

function buildBlockedResponse(request: NextRequest, pathname: string, reason: "maintenance" | "capacity"): NextResponse {
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        error: reason === "maintenance" ? "Service under maintenance" : "Daily visitor limit reached",
        code: reason === "maintenance" ? "MAINTENANCE" : "CAPACITY",
      },
      { status: 503 }
    )
  }
  const locale = extractLocaleFromPath(pathname)
  const url = new URL(`/${locale}/maintenance`, request.url)
  return NextResponse.redirect(url)
}

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

  // ── 정적 자산 / SEO 라우트: 패스스루 ──────────────────────────
  // /og — PRD-3B 동적 OG 이미지 (next-intl 의 /ko/og 리다이렉트 방지)
  // /sitemap.xml, /robots.txt — Next.js 자동 라우트, locale 무관
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/og") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    /\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|eot|webmanifest|json)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // ── 테스트 기간 접속자 게이트 ─────────────────────────
  // 바이패스 경로(/maintenance, /api/health, /auth/*) 는 즉시 통과.
  // 그 외: maintenance 모드이거나 일일 정원 초과면 관리자 여부 확인 후 차단.
  if (!isGateBypassPath(pathname)) {
    const maintenance = isMaintenanceMode()
    const withinCapacity = maintenance ? false : recordVisitor(getClientIp(request))

    if (maintenance || !withinCapacity) {
      const email = await getSessionEmail(request)
      if (!isAdminEmail(email)) {
        return buildBlockedResponse(request, pathname, maintenance ? "maintenance" : "capacity")
      }
      // 관리자 — 그대로 통과 (아래 정상 플로우 진입)
    }
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
     * _next/static, _next/image, favicon.ico, 정적 파일 확장자 제외.
     * API 라우트도 제외 (updateSession 은 위 if 분기에서 이미 패스스루).
     *
     * hotfix: /og, /sitemap.xml, /robots.txt 제외 — next-intl 가 가로채
     * /ko/og 등 잘못된 locale prefix 리다이렉트 방지.
     */
    "/((?!og|sitemap\\.xml|robots\\.txt|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|eot|mp4|mp3|wav|ogg|webm|mov|avi)$).*)",
  ],
}