import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ReauthBirthDateModal } from "./ReauthBirthDateModal"

interface Props {
  locale: string
}

/**
 * P0F-2 + P0F-3: 재인증 게이트 — server component, layout 에 마운트.
 *
 * 단계 제재 (P0F-3):
 *   - deadline 미설정 또는 미래 (D+0~30/D+30~60): 모달 노출 (D-30 이내 경고 배너)
 *   - deadline 지남 (D+60+): 강제 sign out + /auth/login 리다이렉트
 *
 * AuthProvider 부재 (사전 조사) — server component 에서 직접 supabase auth +
 * users 테이블 fetch. Navbar 와 동일 패턴 (round-trip 없음).
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
  if (profile.birth_date) return null // 입력 완료 — gate 통과

  // P0F-3: D+60 초과 (deadline 지남) — 강제 sign out + redirect
  if (profile.birth_date_deadline) {
    const deadlineMs = new Date(profile.birth_date_deadline).getTime()
    if (Number.isFinite(deadlineMs) && deadlineMs < Date.now()) {
      await supabase.auth.signOut()
      redirect(`/${locale}/auth/login?reason=birthDateBlocked`)
    }
  }

  // D+0~60 — 모달 강제 노출 (모달 자체가 D-30 이내 경고 배너 처리)
  return (
    <ReauthBirthDateModal
      locale={locale}
      deadlineIso={profile.birth_date_deadline}
    />
  )
}
