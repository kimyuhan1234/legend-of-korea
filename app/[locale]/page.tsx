export const revalidate = 3600

import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Metadata } from 'next'
import { HeroSection } from '@/components/features/home/HeroSection'
import { CategorySection } from '@/components/features/home/CategorySection'
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

  const categories = [
    { id: 'fashion', label: t('categoryFashion'), href: '/ootd',   image: '/images/category-fashion.png', gradient: 'bg-gradient-to-br from-yellow-400 to-amber-500' },
    { id: 'food',   label: t('categoryFood'),   href: '/food',   image: '/images/category-food.png',    gradient: 'bg-gradient-to-br from-orange-400 to-red-500' },
    { id: 'stay',   label: t('categoryStay'),   href: '/stay',   image: '/images/category-stay.png',    gradient: 'bg-gradient-to-br from-blue-400 to-indigo-600' },
    { id: 'story',  label: t('categoryStory'),  href: '/story',  image: '/images/category-story.png',   gradient: 'bg-gradient-to-br from-purple-500 to-[#2D1B69]' },
    { id: 'sights', label: t('categorySights'), href: '/sights', image: '/images/category-sights.png',  gradient: 'bg-gradient-to-br from-green-400 to-teal-600' },
    { id: 'style',  label: t('categoryStyle'),  href: '/goods',  image: '/images/category-style.png',   gradient: 'bg-gradient-to-br from-pink-400 to-rose-600' },
    { id: 'create', label: t('categoryCreate'), href: '/diy',    image: '/images/category-create.png',  gradient: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
  ]

  return (
    <div className="bg-[#FFF8F0]">
      {/* 섹션 1: TOP BAR */}
      <div className="bg-[#2D1B69] text-white text-center py-2 px-4">
        <div className="flex items-center justify-center gap-4 text-xs md:text-sm">
          {(['ko', 'ja', 'en'] as const).map((lang, i) => (
            <span key={lang} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/30">|</span>}
              <Link
                href={`/${lang}`}
                className={`hover:text-[#FF6B35] transition-colors ${locale === lang ? 'font-bold text-[#FF6B35]' : 'text-white/70'}`}
              >
                {lang === 'ko' ? 'KR' : lang === 'ja' ? 'JP' : 'EN'}
              </Link>
            </span>
          ))}
        </div>
      </div>

      {/* 섹션 2: HERO */}
      <HeroSection cta={t('signup')} />

      {/* 섹션 3: 7-COLUMN 카테고리 */}
      <CategorySection
        locale={locale}
        heading={t('categoryHeading')}
        categories={categories}
      />

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

      {/* 섹션 5: FOOTER */}
      <footer className="bg-[#2D1B69] text-white/70 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-6">
            <Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t('footerCompany')}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">{t('footerTerms')}</Link>
            <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">{t('footerPrivacy')}</Link>
            <Link href={`/${locale}/partner`} className="hover:text-white transition-colors">{t('footerPartner')}</Link>
          </div>
          <p className="text-center text-xs text-white/40">{t('footerCopyright')}</p>
        </div>
      </footer>
    </div>
  )
}
