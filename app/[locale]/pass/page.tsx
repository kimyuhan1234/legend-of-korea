import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PASS_TYPES, PASSES } from '@/lib/data/passes'
import { PassCard } from '@/components/features/pricing/PassCard'
import { getOgLocale, ALL_OG_LOCALES } from '@/lib/seo/og-locale'
import { buildOgUrl } from '@/lib/seo/og-url'
import { CategorySchema } from '@/components/seo'

interface Props {
  params: Promise<{ locale: string }>
}

/**
 * /pass 페이지 — PRD-PRICING-2026-001 적용.
 * 4 패스 구독 → 3 패스 1 회 구매 (Short / Standard / Long).
 * robots noindex 의도적 유지 (Vercel Hobby 상업용 회피 + 베타 가격 SEO 차단).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = await getTranslations({ locale, namespace: 'metadata.pass' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'
  const ogLocale = getOgLocale(locale)
  const title = `${m('title')} | ${tc('siteName')}`
  const ogImage = buildOgUrl({
    baseUrl: siteUrl,
    title: m('title'),
    subtitle: m('description'),
    tier: 'strong',
    category: 'PASS',
  })

  return {
    title,
    description: m('description'),
    keywords: m('keywords'),
    robots: { index: false, follow: false },
    openGraph: {
      type: 'website',
      siteName: tc('siteName'),
      title,
      description: m('description'),
      url: `${siteUrl}/${locale}/pass`,
      locale: ogLocale,
      alternateLocale: ALL_OG_LOCALES.filter((l) => l !== ogLocale),
      images: [{ url: ogImage, width: 1200, height: 630, alt: m('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: m('description'),
      images: [ogImage],
    },
  }
}

export default async function PassPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pricing' })
  const m = await getTranslations({ locale, namespace: 'metadata.pass' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'

  return (
    <>
      <CategorySchema
        type="product"
        name={m('title')}
        description={m('description')}
        url={`${siteUrl}/${locale}/pass`}
        image={`${siteUrl}/images/dokkaebi-hero.png`}
        price={{ amount: PASSES.standard.priceKrw, currency: 'KRW' }}
      />

      <main className="min-h-screen bg-cloud py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-ink mb-3">
              {t('headline')}
            </h1>
            <p className="text-stone text-sm md:text-base">
              {t('subheadline')}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {PASS_TYPES.map((type) => (
              <PassCard key={type} pass={PASSES[type]} />
            ))}
          </div>

          <p className="text-center text-xs text-stone mt-10 leading-relaxed">
            {t('footer_note')}
          </p>
        </div>
      </main>
    </>
  )
}
