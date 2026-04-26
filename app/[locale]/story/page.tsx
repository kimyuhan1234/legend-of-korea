export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { StoryTabNav } from './StoryTabNav'
import { CoursesTab } from './tabs/CoursesTab'
import { SpecialEventTab } from '@/components/features/story/tabs/SpecialEventTab'

interface Props {
  params: { locale: string }
  searchParams: { tab?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'story' })
  const tc = await getTranslations({ locale: params.locale, namespace: 'common' })
  return { title: `${t('title')} | ${tc('siteName')}` }
}

export default async function StoryPage({ params, searchParams }: Props) {
  const { locale } = params
  const activeTab = searchParams.tab || 'mission-kit'

  const t = await getTranslations({ locale, namespace: 'story' })

  const tabs = [
    { id: 'mission-kit', label: t('tabMissionKit') },
    { id: 'special',     label: t('tabSpecial') },
  ]

  return (
    <div className="min-h-screen bg-snow">
      {/* 헤더 — P1-5: 강함 → Tier 2 (Quest 정보 페이지) */}
      <div className="bg-tier-soft text-ink py-20 md:py-28 px-8 md:px-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-2">{t('title')}</h1>
        <p className="text-slate">{t('subtitle')}</p>
      </div>

      {/* 탭 네비게이션 (클라이언트) */}
      <StoryTabNav locale={locale} activeTab={activeTab} tabs={tabs} />

      {/* 탭 콘텐츠 (서버) */}
      <div className="max-w-5xl mx-auto px-8 md:px-10 py-20 md:py-28">
        {activeTab === 'mission-kit' && <CoursesTab locale={locale} />}
        {activeTab === 'special'     && <SpecialEventTab locale={locale} />}
      </div>
    </div>
  )
}