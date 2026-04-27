export const revalidate = 3600

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { SpotsClient } from '@/components/features/spots/SpotsClient'
import { getAllSpots } from '@/lib/tour-api/spots'
import { buildOgUrl } from '@/lib/seo/og-url'
import { CategorySchema } from '@/components/seo'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'sights' })
  const tc = await getTranslations({ locale: params.locale, namespace: 'common' })
  const title = `${t('title')} | ${tc('siteName')}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'
  let subtitle = ''
  try { subtitle = t('subtitle') } catch { /* subtitle 미정의 시 무시 */ }
  const ogImage = buildOgUrl({
    baseUrl: siteUrl,
    title: t('title'),
    subtitle: subtitle || undefined,
    tier: 'soft',
    category: 'SPOT',
    imagePath: '/images/category-sights.png',
  })
  return {
    title,
    openGraph: {
      title,
      images: [{ url: ogImage, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: { card: 'summary_large_image', title, images: [ogImage] },
  }
}

export default async function SightsPage({ params }: Props) {
  const { locale } = params
  const spots = await getAllSpots(locale as 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW')
  const t = await getTranslations({ locale, namespace: 'sights' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'
  return (
    <>
      <CategorySchema
        type="attraction"
        name={t('title')}
        description={t('subtitle')}
        url={`${siteUrl}/${locale}/sights`}
        image={`${siteUrl}/images/category-sights.png`}
      />
      <SpotsClient initialSpots={spots} locale={locale} />
    </>
  )
}
