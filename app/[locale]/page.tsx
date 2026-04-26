export const revalidate = 3600

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { HeroSection } from '@/components/features/home/HeroSection'
import { HeroPassButtons } from '@/components/features/home/HeroPassButtons'
import { HomeFeatureCarousel } from '@/components/features/home/HomeFeatureCarousel'
import { SlideFeatureDupe } from '@/components/features/home/SlideFeatureDupe'
import { SlideFeaturePlanner } from '@/components/features/home/SlideFeaturePlanner'
import { HomeCommunityPreview } from '@/components/features/home/HomeCommunityPreview'

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
    <div className="bg-snow has-sticky-cta">
      {/* 섹션 1: 가치 제안 히어로 (P1-1) — 외국인 첫 3초 룰 */}
      <HeroSection locale={locale} />

      {/* 섹션 2: 패스 버튼 + 비디오 (구 HeroSection — 결제 동선) */}
      <HeroPassButtons cta={t('signup')} locale={locale} />

      {/* 섹션 3: 자동 슬라이드 캐러셀 (DUPE + 플래너) — P1-7 에서 HomeTabExplorer 제거됨 */}
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

      {/* 섹션 5: 커뮤니티 프리뷰 */}
      <HomeCommunityPreview locale={locale} />
    </div>
  )
}
