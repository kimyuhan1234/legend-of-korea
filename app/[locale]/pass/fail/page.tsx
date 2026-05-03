import type { Metadata } from 'next'
import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ code?: string; message?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Payment Failed | Clouds with you',
    robots: { index: false, follow: false },
  }
}

export default async function PassFailPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'pricing.fail' })

  return (
    <main className="min-h-screen bg-cloud py-16 md:py-20">
      <div className="max-w-md mx-auto px-4 text-center">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" aria-hidden />
        <h1 className="text-3xl font-black mb-4">{t('title')}</h1>
        <p className="text-stone mb-2">{t('description')}</p>

        {sp.message && (
          <p className="text-xs text-stone mb-8">({sp.message})</p>
        )}

        <div className="flex gap-3 justify-center mt-8">
          <Link
            href={`/${locale}/pass`}
            className="px-6 py-3 bg-blossom-deep text-white rounded-xl font-bold hover:bg-blossom transition-colors"
          >
            {t('cta_retry')}
          </Link>
          <Link
            href={`/${locale}`}
            className="px-6 py-3 bg-mist text-ink rounded-xl font-bold hover:bg-stone/20 transition-colors"
          >
            {t('cta_home')}
          </Link>
        </div>
      </div>
    </main>
  )
}
