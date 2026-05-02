import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { UtensilsCrossed, Shirt, Train, MapPin, Images } from 'lucide-react'
import { getOgLocale, ALL_OG_LOCALES } from '@/lib/seo/og-locale'
import { buildOgUrl } from '@/lib/seo/og-url'
import { BreadcrumbSchema } from '@/components/seo'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
  const m = await getTranslations({ locale, namespace: 'metadata.discover' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'
  const ogLocale = getOgLocale(locale)
  const title = `${m('title')} | ${tc('siteName')}`
  const ogImage = buildOgUrl({
    baseUrl: siteUrl,
    title: m('title'),
    subtitle: m('description'),
    tier: 'soft',
    category: 'DISCOVER',
  })

  return {
    title,
    description: m('description'),
    keywords: m('keywords'),
    openGraph: {
      type: 'website',
      siteName: tc('siteName'),
      title,
      description: m('description'),
      url: `${siteUrl}/${locale}/discover`,
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

export default async function DiscoverPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'discover' })
  const tc = await getTranslations({ locale: params.locale, namespace: 'common' })
  const { locale } = params

  return (
    <div className="min-h-screen bg-snow">
      <BreadcrumbSchema
        items={[
          { name: tc('home'), url: `/${locale}` },
          { name: t('title'), url: `/${locale}/discover` },
        ]}
      />
      {/* ── 히어로 ── P1-5 톤: Tier 2 (정보 페이지) */}
      <div className="bg-tier-soft border-b border-mint py-20 md:py-28 px-6 md:px-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white text-mint-deep
                         text-xs font-bold uppercase tracking-widest mb-5 shadow-sm">
          DISCOVER
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#111] mb-4 leading-tight">
          {t('title')}
        </h1>
        <p className="text-stone text-base md:text-lg font-medium max-w-xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* ── 카드 그리드 ── 3-tier 위계: STAY (1-col) / K-Food·OOTD (2-col) / TRAFFIC·SPOT (3-col) */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-6 md:space-y-8">

        {/* Row 1: STAY 큰 카드 (Tier 1 — STAY 전용 그라데이션) */}
        <Link
          href={`/${locale}/stay`}
          className="group block relative overflow-hidden rounded-3xl bg-tier-strong-stay
                     shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="px-8 md:px-12 py-12 md:py-16 text-white">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm
                             text-xs font-bold uppercase tracking-widest mb-4">
              {t('stay.label')}
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-3 leading-tight">
              {t('stay.title')}
            </h2>
            <p className="text-white/90 text-base md:text-lg max-w-md mb-6">
              {t('stay.description')}
            </p>
            <span className="inline-flex items-center gap-2 text-sm md:text-base font-bold
                             group-hover:gap-3 transition-all">
              {t('cta')} →
            </span>
          </div>
        </Link>

        {/* Row 2: K-Food / OOTD 중간 카드 (Tier 2 — 흰 카드) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Link
            href={`/${locale}/food`}
            className="group block bg-white rounded-3xl p-8 md:p-10 border border-mist
                       shadow-sm hover:shadow-lg hover:border-mint transition-all duration-300 hover:-translate-y-1"
          >
            <UtensilsCrossed className="w-10 h-10 mb-4 text-mint-deep" strokeWidth={1.6} />
            <span className="block text-xs font-bold uppercase tracking-widest text-mint-deep mb-2">
              {t('food.label')}
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-[#111] mb-3 leading-tight">
              {t('food.title')}
            </h3>
            <p className="text-stone text-sm md:text-base mb-5">
              {t('food.description')}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-mint-deep
                             group-hover:gap-3 transition-all">
              {t('cta')} →
            </span>
          </Link>

          <Link
            href={`/${locale}/ootd`}
            className="group block bg-white rounded-3xl p-8 md:p-10 border border-mist
                       shadow-sm hover:shadow-lg hover:border-blossom transition-all duration-300 hover:-translate-y-1"
          >
            <Shirt className="w-10 h-10 mb-4 text-blossom-deep" strokeWidth={1.6} />
            <span className="block text-xs font-bold uppercase tracking-widest text-blossom-deep mb-2">
              {t('ootd.label')}
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-[#111] mb-3 leading-tight">
              {t('ootd.title')}
            </h3>
            <p className="text-stone text-sm md:text-base mb-5">
              {t('ootd.description')}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-blossom-deep
                             group-hover:gap-3 transition-all">
              {t('cta')} →
            </span>
          </Link>
        </div>

        {/* Row 3: TRAFFIC / SPOT 작은 카드 (Tier 3 — 컴팩트 흰 카드) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <Link
            href={`/${locale}/traffic`}
            className="group block bg-white rounded-2xl p-6 border border-mist
                       shadow-sm hover:shadow-md hover:border-lavender transition-all duration-300 hover:-translate-y-1"
          >
            <Train className="w-8 h-8 mb-3 text-lavender" strokeWidth={1.6} />
            <span className="block text-[10px] font-bold uppercase tracking-widest text-stone mb-1.5">
              {t('traffic.label')}
            </span>
            <h4 className="font-bold text-lg text-[#111] mb-2 leading-tight">
              {t('traffic.title')}
            </h4>
            <p className="text-stone text-xs md:text-sm">
              {t('traffic.description')}
            </p>
          </Link>

          <Link
            href={`/${locale}/sights`}
            className="group block bg-white rounded-2xl p-6 border border-mist
                       shadow-sm hover:shadow-md hover:border-mint transition-all duration-300 hover:-translate-y-1"
          >
            <MapPin className="w-8 h-8 mb-3 text-mint-deep" strokeWidth={1.6} />
            <span className="block text-[10px] font-bold uppercase tracking-widest text-stone mb-1.5">
              {t('sights.label')}
            </span>
            <h4 className="font-bold text-lg text-[#111] mb-2 leading-tight">
              {t('sights.title')}
            </h4>
            <p className="text-stone text-xs md:text-sm">
              {t('sights.description')}
            </p>
          </Link>

          <Link
            href={`/${locale}/gallery`}
            className="group block bg-white rounded-2xl p-6 border border-mist
                       shadow-sm hover:shadow-md hover:border-blossom transition-all duration-300 hover:-translate-y-1"
          >
            <Images className="w-8 h-8 mb-3 text-blossom-deep" strokeWidth={1.6} />
            <span className="block text-[10px] font-bold uppercase tracking-widest text-stone mb-1.5">
              {t('gallery.label')}
            </span>
            <h4 className="font-bold text-lg text-[#111] mb-2 leading-tight">
              {t('gallery.title')}
            </h4>
            <p className="text-stone text-xs md:text-sm">
              {t('gallery.description')}
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
