import { createServerClient } from "@supabase/ssr"
import { type NextRequest } from "next/server"

/**
 * middleware 에서 Supabase 세션을 부수효과 없이 조회해 user.email 만 반환.
 * updateSession() 과 달리 쿠키 mutation / redirect 를 수행하지 않는다.
 * 일일 접속자 제한의 관리자 바이패스 판단에만 사용.
 */
export async function getSessionEmail(request: NextRequest): Promise<string | null> {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            /* no-op: mutation 없이 읽기만 */
          },
        },
      }
    )
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.email ?? null
  } catch {
    return null
  }
}
