import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 세션 갱신 (중요: await 필수)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 보호된 경로 처리
  const isProtectedPath = ["/mypage", "/missions"].some((path) =>
    request.nextUrl.pathname.includes(path)
  )
  const isAdminPath = request.nextUrl.pathname.includes("/admin")

  if (!user && (isProtectedPath || isAdminPath)) {
    const locale = request.nextUrl.pathname.split("/")[1] || "ko"
    const url = new URL(`/${locale}/auth/login`, request.url)
    return NextResponse.redirect(url)
  }

  if (user && isAdminPath) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      const locale = request.nextUrl.pathname.split("/")[1] || "ko"
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }
  }

  return supabaseResponse
}
