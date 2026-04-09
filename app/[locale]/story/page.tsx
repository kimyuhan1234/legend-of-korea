export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { StoryTabNav } from './StoryTabNav'
import { CoursesTab } from './tabs/CoursesTab'
import { MemoriesTab } from './tabs/MemoriesTab'
import { PointsTab } from './tabs/PointsTab'

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

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('nickname, total_lp, current_tier')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const tabs = [
    { id: 'mission-kit', label: t('tabMissionKit') },
    { id: 'memories',    label: t('tabMemories') },
    { id: 'points',      label: t('tabPoints') },
  ]

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* 헤더 */}
      <div className="bg-[#FF6B35] text-white py-20 md:py-28 px-8 md:px-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-2">{t('title')}</h1>
        <p className="text-white/70">{t('subtitle')}</p>
      </div>

      {/* 탭 네비게이션 (클라이언트) */}
      <StoryTabNav locale={locale} activeTab={activeTab} tabs={tabs} />

      {/* 탭 콘텐츠 (서버) */}
      <div className="max-w-5xl mx-auto px-8 md:px-10 py-20 md:py-28">
        {activeTab === 'mission-kit' && <CoursesTab locale={locale} />}
        {activeTab === 'memories'    && <MemoriesTab locale={locale} />}
        {activeTab === 'points'      && (
          <PointsTab
            locale={locale}
            user={user ? { id: user.id, ...profile } : null}
          />
        )}
      </div>
    </div>
  )
}