export const revalidate = 3600

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { StayPageClient } from '@/components/features/stay/StayPageClient'
import { createServiceClient } from '@/lib/supabase/server'
import type { NormalizedStay } from '@/lib/tour-api/stays'
import { getOgLocale, ALL_OG_LOCALES } from '@/lib/seo/og-locale'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
  const m = await getTranslations({ locale, namespace: 'metadata.stay' })
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
      url: `${siteUrl}/${locale}/stay`,
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

async function loadInitialStays(): Promise<{ stays: NormalizedStay[]; total: number }> {
  const supabase = await createServiceClient()
  const { data, error, count } = await supabase
    .from('tour_stays_cache')
    .select('data', { count: 'exact' })
    .limit(20)
    .returns<{ data: NormalizedStay }[]>()
  if (error) {
    console.error('[StayPage] Initial load failed:', error.message)
    return { stays: [], total: 0 }
  }
  return {
    stays: (data ?? []).map((r) => r.data),
    total: count ?? (data?.length ?? 0),
  }
}

export default async function StayPage({ params }: Props) {
  const { stays, total } = await loadInitialStays()
  return <StayPageClient locale={params.locale} initialStays={stays} initialTotal={total} />
}
