import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Camera, Palette } from 'lucide-react'
import { getOgLocale, ALL_OG_LOCALES } from '@/lib/seo/og-locale'
import { BreadcrumbSchema } from '@/components/seo'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
  const m = await getTranslations({ locale, namespace: 'metadata.community' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'
  const ogLocale = getOgLocale(locale)
  const title = `${m('title')} | ${tc('siteName')}`

  return {
    title,
    description: m('description'),
    keywords: m('keywords'),
    openGraph: {
      type: 'website',
      siteName: tc('siteName'),
      title,
      description: m('description'),
      url: `${siteUrl}/${locale}/community`,
      locale: ogLocale,
      alternateLocale: ALL_OG_LOCALES.filter((l) => l !== ogLocale),
      images: [{ url: '/images/dokkaebi-hero.jpg', width: 1200, height: 630, alt: m('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: m('description'),
      images: ['/images/dokkaebi-hero.jpg'],
    },
  }
}

export default async function CommunityHubPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'communityHub' })
  const tc = await getTranslations({ locale: params.locale, namespace: 'common' })
  const { locale } = params

  return (
    <div className="min-h-screen bg-snow">
      <BreadcrumbSchema
        items={[
          { name: tc('home'), url: `/${locale}` },
          { name: t('title'), url: `/${locale}/community` },
        ]}
      />
      {/* ── 히어로 ── */}
      <div className="bg-tier-soft border-b border-mint py-20 md:py-28 px-6 md:px-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white text-mint-deep
                         text-xs font-bold uppercase tracking-widest mb-5 shadow-sm">
          COMMUNITY
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#111] mb-4 leading-tight">
          {t('title')}
        </h1>
        <p className="text-stone text-base md:text-lg font-medium max-w-xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* ── 카드 그리드 ── MEMORIES (큰) + DIY (보조) */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

        {/* MEMORIES — 메인 카드 (md:col-span-2) */}
        <Link
          href={`/${locale}/memories`}
          className="md:col-span-2 group block bg-white rounded-3xl p-8 md:p-12 border border-mist
                     shadow-sm hover:shadow-lg hover:border-blossom transition-all duration-300 hover:-translate-y-1"
        >
          <Camera className="w-10 h-10 mb-4 text-blossom-deep" strokeWidth={1.6} />
          <span className="block text-xs font-bold uppercase tracking-widest text-blossom-deep mb-2">
            {t('memories.label')}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111] mb-3 leading-tight">
            {t('memories.title')}
          </h2>
          <p className="text-stone text-base md:text-lg max-w-md mb-6">
            {t('memories.description')}
          </p>
          <span className="inline-flex items-center gap-2 text-sm md:text-base font-bold text-blossom-deep
                           group-hover:gap-3 transition-all">
            →
          </span>
        </Link>

        {/* DIY — 보조 카드 (md:col-span-1) */}
        <Link
          href={`/${locale}/diy`}
          className="group block bg-white rounded-3xl p-8 md:p-10 border border-mist
                     shadow-sm hover:shadow-lg hover:border-mint transition-all duration-300 hover:-translate-y-1"
        >
          <Palette className="w-10 h-10 mb-4 text-mint-deep" strokeWidth={1.6} />
          <span className="block text-xs font-bold uppercase tracking-widest text-mint-deep mb-2">
            {t('diy.label')}
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-[#111] mb-3 leading-tight">
            {t('diy.title')}
          </h3>
          <p className="text-stone text-sm md:text-base mb-5">
            {t('diy.description')}
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-mint-deep
                           group-hover:gap-3 transition-all">
            →
          </span>
        </Link>
      </div>
    </div>
  )
}
