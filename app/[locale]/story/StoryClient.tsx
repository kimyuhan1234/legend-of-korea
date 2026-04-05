'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

// 기존 컴포넌트 재사용
import { CoursesTab } from './tabs/CoursesTab'
import { MemoriesTab } from './tabs/MemoriesTab'
import { PointsTab } from './tabs/PointsTab'

interface StoryClientProps {
  locale: string
  initialTab: string
  user: { id: string; nickname?: string | null; total_lp?: number | null; current_tier?: number | null } | null
}

export function StoryClient({ locale, initialTab, user }: StoryClientProps) {
  const t = useTranslations('story')
  const [activeTab, setActiveTab] = useState(initialTab)

  const tabs = [
    { id: 'mission-kit', label: t('tabMissionKit') },
    { id: 'memories',    label: t('tabMemories') },
    { id: 'points',      label: t('tabPoints') },
  ]

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* 헤더 */}
      <div className="bg-[#2D1B69] text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-2">{t('title')}</h1>
        <p className="text-white/70">{t('subtitle')}</p>
      </div>

      {/* 탭 */}
      <div className="sticky top-16 z-30 bg-white border-b border-[#e8ddd0] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#2D1B69] text-[#2D1B69]'
                  : 'border-transparent text-[#7a6a58] hover:text-[#2D1B69]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'mission-kit' && <CoursesTab locale={locale} />}
        {activeTab === 'memories' && <MemoriesTab locale={locale} />}
        {activeTab === 'points' && <PointsTab locale={locale} user={user} />}
      </div>
    </div>
  )
}
