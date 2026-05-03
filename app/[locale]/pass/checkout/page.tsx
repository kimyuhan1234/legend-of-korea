import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PASSES, isPassType } from '@/lib/data/passes'
import { CheckoutClient } from '@/components/features/pricing/CheckoutClient'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ type?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Checkout | Clouds with you',
    robots: { index: false, follow: false },
  }
}

/**
 * /[locale]/pass/checkout?type={short|standard|long}
 *
 * PRD-PRICING-2026-001 Phase G — 패스 결제 페이지.
 * 비로그인 시 로그인으로 redirect (next 파라미터로 복귀).
 * 패스 타입 검증 실패 시 /pass 로 redirect.
 */
export default async function PassCheckoutPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const type = sp.type

  if (!type || !isPassType(type)) {
    redirect(`/${locale}/pass`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const next = encodeURIComponent(`/${locale}/pass/checkout?type=${type}`)
    redirect(`/${locale}/auth/login?next=${next}`)
  }

  // public.users 의 nickname 조회 (없으면 fallback)
  const { data: profile } = await supabase
    .from('users')
    .select('nickname')
    .eq('id', user.id)
    .maybeSingle()

  const userName = profile?.nickname ?? user.email?.split('@')[0] ?? 'Traveler'
  const pass = PASSES[type]

  return (
    <main className="min-h-screen bg-cloud py-16 md:py-20">
      <div className="max-w-2xl mx-auto px-4">
        <CheckoutClient
          pass={pass}
          userId={user.id}
          userEmail={user.email ?? null}
          userName={userName}
          locale={locale}
        />
      </div>
    </main>
  )
}

export const dynamic = 'force-dynamic'
