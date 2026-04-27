import { createClient } from "@/lib/supabase/server"
import { ReauthBirthDateModal } from "./ReauthBirthDateModal"

interface Props {
  locale: string
}

/**
 * P0F-2: 재인증 게이트 — server component, layout 에 마운트.
 *
 * 인증된 사용자의 birth_date 가 NULL 이면 ReauthBirthDateModal 강제 노출.
 * AuthProvider 패턴 부재 (사전 조사 발견) — server component 에서 직접
 * supabase.auth.getUser() + users.select.birth_date 처리. Navbar 와 동일
 * 패턴이라 SSR 시 한 번만 fetch (no extra round-trip).
 *
 * 노출 조건:
 *   - 로그인 상태 (user 존재)
 *   - birth_date IS NULL
 *
 * 비노출 조건:
 *   - 비로그인 — 별도 처리 X
 *   - birth_date 입력 완료
 *   - 인증 페이지 자체 (/auth/*) — middleware 또는 본 컴포넌트 위치 조정 시
 *     레이아웃 외부에서 렌더 (현재 구조는 모든 [locale] 페이지에 mount)
 */
export async function BirthDateGate({ locale }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("users")
    .select("birth_date, birth_date_deadline")
    .eq("id", user.id)
    .single()

  if (!profile) return null
  if (profile.birth_date) return null // 입력 완료

  return (
    <ReauthBirthDateModal
      locale={locale}
      deadlineIso={profile.birth_date_deadline}
    />
  )
}
