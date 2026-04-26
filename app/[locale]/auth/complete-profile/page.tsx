import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CompleteProfileForm } from '@/components/features/auth/CompleteProfileForm'
import type { Metadata } from 'next'

interface Props {
  params: { locale: string }
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

/**
 * 소셜 로그인 직후 birth_date 미입력 사용자에게 노출되는 추가 정보 화면.
 *
 *  - 비로그인 (세션 없음) → /auth/login 으로
 *  - 이미 birth_date 있음 → 홈으로 (콜백 race 방지)
 *  - prefill: provider 의 raw_user_meta_data 에서 birthday/birth_date 추출
 *    (카카오 비즈 인증, Google 등 일부만 제공)
 */
export default async function CompleteProfilePage({ params }: Props) {
  const { locale } = params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/auth/login`)
  }

  // 이미 birth_date 있으면 홈으로
  const { data: profile } = await supabase
    .from('users')
    .select('birth_date')
    .eq('id', user.id)
    .single()

  if (profile?.birth_date) {
    redirect(`/${locale}`)
  }

  // OAuth provider 가 raw_user_meta_data 에 넣어준 생년월일 prefill 시도.
  // 카카오: 'birthyear' (YYYY) + 'birthday' (MMDD) — 비즈 채널 + 동의 필요
  // Google: 'birthdate' (YYYY-MM-DD) — 사용자 선택적 동의
  // LINE: 미제공
  const meta = user.user_metadata ?? {}
  let prefillBirthDate: string | null = null
  if (typeof meta.birth_date === 'string') {
    prefillBirthDate = meta.birth_date
  } else if (typeof meta.birthdate === 'string') {
    prefillBirthDate = meta.birthdate
  } else if (typeof meta.birthyear === 'string' && typeof meta.birthday === 'string' && meta.birthyear.length === 4 && meta.birthday.length === 4) {
    // 카카오 형식: birthyear="1995", birthday="0815" → "1995-08-15"
    prefillBirthDate = `${meta.birthyear}-${meta.birthday.slice(0, 2)}-${meta.birthday.slice(2)}`
  }

  const provider = user.app_metadata?.provider ?? null

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-mist shadow-lg shadow-slate-200/50 p-8">
        <CompleteProfileForm
          locale={locale}
          prefillBirthDate={prefillBirthDate}
          prefillProvider={provider}
        />
      </div>
    </div>
  )
}
