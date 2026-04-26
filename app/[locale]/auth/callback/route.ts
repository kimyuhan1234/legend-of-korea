import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * OAuth 콜백.
 *
 * 흐름:
 *  1. exchangeCodeForSession 으로 세션 발급
 *  2. public.users 의 birth_date 확인
 *     - 있음 → 정상 진입 (next 또는 홈)
 *     - 없음 → /auth/complete-profile 로 이동 (추가 정보 입력)
 *
 * 14세 검증은 complete-profile 페이지에서 처리하며, 미달 시
 * admin API 로 auth.users 도 삭제 + /auth/age-restricted 로 redirect.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"
  const locale = params.locale || "ko"

  if (!code) {
    return NextResponse.redirect(`${origin}/${locale}/auth/login?error=auth_failed`)
  }

  const supabase = await createClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/${locale}/auth/login?error=auth_failed`)
  }

  // 세션 발급 성공 — birth_date 확인
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/${locale}/auth/login?error=auth_failed`)
  }

  const { data: profile } = await supabase
    .from("users")
    .select("birth_date")
    .eq("id", user.id)
    .single()

  // birth_date 가 비어있으면 추가 정보 입력 화면으로
  if (!profile?.birth_date) {
    const completeUrl = new URL(`${origin}/${locale}/auth/complete-profile`)
    completeUrl.searchParams.set("next", next)
    return NextResponse.redirect(completeUrl)
  }

  // 정상 진입
  return NextResponse.redirect(`${origin}/${locale}${next === "/" ? "" : next}`)
}
