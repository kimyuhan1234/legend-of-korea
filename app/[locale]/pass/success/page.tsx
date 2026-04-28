import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { isPassType } from '@/lib/data/passes'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    type?: string
    paymentKey?: string
    orderId?: string
    amount?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Pass Activated | Cloud with you',
    robots: { index: false, follow: false },
  }
}

/**
 * /[locale]/pass/success
 *
 * PRD-PRICING-2026-001 Phase G — 결제 성공 페이지.
 * - TEST_MODE: CheckoutClient 가 직접 /api/passes/purchase 호출 후 redirect → 활성 패스 표시
 * - 실 결제: Toss successUrl 진입 시 paymentKey 쿼리 보유 →
 *   후속 PR 에서 /api/payments/toss/confirm + /api/passes/purchase wiring
 */
export default async function PassSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'pricing.success' })
  const tp = await getTranslations({ locale, namespace: 'pricing.passes' })

  if (!sp.type || !isPassType(sp.type)) {
    redirect(`/${locale}/pass`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/auth/login`)
  }

  // 활성 패스 조회 (CheckoutClient 가 이미 INSERT 한 결과)
  const { data: pass } = await supabase
    .from('passes')
    .select('expires_at')
    .eq('user_id', user.id)
    .eq('type', sp.type)
    .eq('status', 'active')
    .order('purchased_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const expiresLocale = locale === 'ko' ? 'ko-KR' :
                        locale === 'ja' ? 'ja-JP' :
                        locale === 'zh-CN' ? 'zh-CN' :
                        locale === 'zh-TW' ? 'zh-TW' : 'en-US'

  return (
    <main className="min-h-screen bg-cloud py-16 md:py-20">
      <div className="max-w-md mx-auto px-4 text-center">
        <CheckCircle2 className="w-20 h-20 text-mint-deep mx-auto mb-6" aria-hidden />
        <h1 className="text-3xl font-black mb-4">{t('title')}</h1>
        <p className="text-stone mb-8">{t('description', { type: tp(`${sp.type}.name`) })}</p>

        {pass && (
          <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm">
            <p className="text-xs text-stone mb-1">{t('expires_at')}</p>
            <p className="text-lg font-bold text-ink">
              {new Date(pass.expires_at).toLocaleDateString(expiresLocale)}
            </p>
          </div>
        )}

        <Link
          href={`/${locale}/quest`}
          className="inline-block px-8 py-3 bg-blossom-deep text-white rounded-xl font-bold hover:bg-blossom transition-colors"
        >
          {t('cta_start')}
        </Link>
      </div>
    </main>
  )
}
