import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PassPricingSection } from '@/components/features/pass/PassPricingSection'
import { getOgLocale, ALL_OG_LOCALES } from '@/lib/seo/og-locale'

interface Props {
  params: Promise<{ locale: string }>
}

/**
 * /pass 페이지 — robots noindex 의도적 유지.
 * 사유: Vercel Hobby 상업용 판단 회피 + 베타 가격 SEO 인덱싱 방지.
 * 메타 (title/description/OG) 는 풍부화하여 직접 링크 공유 / SNS 미리보기 품질만 확보.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = await getTranslations({ locale, namespace: 'metadata.pass' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legendofkorea.com'
  const ogLocale = getOgLocale(locale)
  const title = `${m('title')} | ${tc('siteName')}`

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

export default async function PassPage({ params }: Props) {
  const { locale } = await params
  return <PassPricingSection locale={locale} />
}
