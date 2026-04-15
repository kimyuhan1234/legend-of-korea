export const revalidate = 3600

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { HeroSection } from '@/components/features/home/HeroSection'
import { HomeTabExplorer } from '@/components/features/home/HomeTabExplorer'
import { HomeFeatureCarousel } from '@/components/features/home/HomeFeatureCarousel'
import { SlideFeatureDupe } from '@/components/features/home/SlideFeatureDupe'
import { SlideFeaturePlanner } from '@/components/features/home/SlideFeaturePlanner'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'common' })
  return {
    title: `${t('siteName')} | ${t('siteDescription')}`,
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <div className="bg-snow">
      {/* 섹션 1: HERO */}
      <HeroSection cta={t('signup')} />

      {/* 섹션 3: 탭 탐색 (3단 그리드 + 모바일 슬라이드) */}
      <HomeTabExplorer />

      {/* 섹션 4: 자동 슬라이드 캐러셀 (DUPE + 플래너) */}
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
      </HomeFeatureCarousel>
    </div>
  )
}
