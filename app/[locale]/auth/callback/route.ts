import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"
  const locale = params.locale || "ko"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 로그인 성공 → 홈으로
      return NextResponse.redirect(`${origin}/${locale}${next === "/" ? "" : next}`)
    }
  }

  // 실패 시 로그인 페이지로
  return NextResponse.redirect(`${origin}/${locale}/auth/login?error=auth_failed`)
}
