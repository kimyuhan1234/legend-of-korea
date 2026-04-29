// hotfix v8: 메인 페이지 — getCurrentUser / Supabase 쿼리 등 server-side 호출 다수.
// 빌드 타임 timeout 우회로 force-dynamic.
export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { HeroSection } from '@/components/features/home/HeroSection'
import { HeroPassButtons } from '@/components/features/home/HeroPassButtons'
import { HomeFeatureCarousel } from '@/components/features/home/HomeFeatureCarousel'
import { SlideFeatureDupe } from '@/components/features/home/SlideFeatureDupe'
import { SlideFeaturePlanner } from '@/components/features/home/SlideFeaturePlanner'
import { SlideHomeImage } from '@/components/features/home/SlideHomeImage'
import { getOgLocale, ALL_OG_LOCALES } from '@/lib/seo/og-locale'
import { buildOgUrl } from '@/lib/seo/og-url'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'metadata.home' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'
  const ogLocale = getOgLocale(locale)
  const ogImage = buildOgUrl({
    baseUrl: siteUrl,
    title: t('title'),
    subtitle: t('description'),
    tier: 'strong',
    imagePath: '/images/dokkaebi-hero.png',
  })

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      type: 'website',
      siteName: tc('siteName'),
      title: t('title'),
      description: t('description'),
      url: `${siteUrl}/${locale}`,
      locale: ogLocale,
      alternateLocale: ALL_OG_LOCALES.filter((l) => l !== ogLocale),
      images: [{ url: ogImage, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [ogImage],
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'home' })
  const tm = await getTranslations({ locale, namespace: 'home.memories' })

  return (
    <div className="bg-snow has-sticky-cta">
      {/* 섹션 1: 가치 제안 히어로 (P1-1) — 외국인 첫 3초 룰 */}
      <HeroSection locale={locale} />

      {/* 섹션 2: 패스 버튼 + 비디오 (구 HeroSection — 결제 동선) */}
      <HeroPassButtons cta={t('signup')} locale={locale} />

      {/* 섹션 3: 자동 슬라이드 캐러셀 — 4 슬라이드 통합 (Dupe / Planner / Memorise / Discover).
          이전 별도 HomeCommunityPreview 캐러셀을 흡수. */}
      <HomeFeatureCarousel>
        <SlideFeatureDupe
          locale={locale}
          title={t('foodMatchingTitle')}
          subtitle={t('foodMatchingSubtitle')}
          cta={t('foodMatchingCta')}
        />
        <SlideFeaturePlanner
          locale={locale}
          title={t('plannerTitle')}
          subtitle={t('plannerSubtitle')}
          cta={t('plannerCta')}
        />
        <SlideHomeImage
          title={tm('slide1Title')}
          subtitle={tm('slide1Subtitle')}
          cta={tm('slide1Cta')}
          href={`/${locale}/memories`}
          image="/images/home/memories-slide.png"
        />
        <SlideHomeImage
          title={tm('slide2Title')}
          subtitle={tm('slide2Subtitle')}
          cta={tm('slide2Cta')}
          href={`/${locale}/sights`}
          image="/images/home/spot-slide.png"
        />
      </HomeFeatureCarousel>
    </div>
  )
}
