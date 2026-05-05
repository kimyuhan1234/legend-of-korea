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
    // 이메일 인증 링크는 한 번 사용 시 invalidated. 두 번째 클릭 / 다른 브라우저에서
    // 클릭 시 exchangeError 가 발생해도 이메일 자체는 이미 검증된 상태일 수 있다.
    //   - 이미 다른 탭에서 로그인된 사용자 → 그냥 홈으로
    //   - 비로그인 상태 → "이메일 인증 완료, 로그인해주세요" 안내 (auth_failed 카피 부적절)
    const {
      data: { user: existingUser },
    } = await supabase.auth.getUser()
    if (existingUser) {
      return NextResponse.redirect(`${origin}/${locale}${next === "/" ? "" : next}`)
    }
    return NextResponse.redirect(`${origin}/${locale}/auth/login?reason=emailVerified`)
  }

  // 세션 발급 성공 — birth_date 확인
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // exchange 는 성공했지만 cookie writeback race 등으로 즉시 user 미확보.
    // 이메일은 검증된 상태이므로 auth_failed 가 아닌 emailVerified 안내.
    return NextResponse.redirect(`${origin}/${locale}/auth/login?reason=emailVerified`)
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
