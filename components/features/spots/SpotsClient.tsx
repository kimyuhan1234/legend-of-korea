'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Sparkles, Map, Calendar, Folder, Building2 } from 'lucide-react'
import { StyleSlider } from './StyleSlider'
import { CurationResult } from './CurationResult'
import { SpotMapView } from './SpotMapView'
import { SpotCategoryView } from './SpotCategoryView'
import { SpotCityView } from './SpotCityView'
import { FestivalCalendar } from './FestivalCalendar'
import { calculateCityScores } from '@/lib/curation/scoring'
import type { NormalizedSpot } from '@/lib/tour-api/types'
import type { UserPreference } from '@/lib/curation/types'

interface Props {
  initialSpots: NormalizedSpot[]
  locale: string
}

type TabId = 'curation' | 'map' | 'festival' | 'category' | 'city'
type CurationPhase = 'swipe' | 'result'

const TABS: { id: TabId; Icon: React.ComponentType<{ className?: string }>; labelKey: string }[] = [
  { id: 'curation', Icon: Sparkles, labelKey: 'tab.curation' },
  { id: 'map', Icon: Map, labelKey: 'tab.map' },
  { id: 'festival', Icon: Calendar, labelKey: 'tab.festival' },
  { id: 'category', Icon: Folder, labelKey: 'tab.category' },
  { id: 'city', Icon: Building2, labelKey: 'tab.city' },
]

export function SpotsClient({ initialSpots, locale }: Props) {
  const t = useTranslations('spots')
  const tSights = useTranslations('sights')

  const [activeTab, setActiveTab] = useState<TabId>('curation')
  const [phase, setPhase] = useState<CurationPhase>('swipe')
  const [preference, setPreference] = useState<UserPreference | null>(null)

  const cityScores = useMemo(
    () => (preference ? calculateCityScores(preference) : []),
    [preference],
  )

  const handleComplete = (pref: UserPreference) => {
    setPreference(pref)
    setPhase('result')
  }

  const handleRetry = () => {
    setPreference(null)
    setPhase('swipe')
  }

  return (
    <div className="min-h-screen bg-snow">
      {/* 헤더 — P1-5: 강함 → Tier 2 (정보 페이지) */}
      <div className="bg-tier-soft text-ink py-12 md:py-16 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-2">{tSights('title')}</h1>
        <p className="text-slate">{tSights('subtitle')}</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-5 py-3.5 font-bold text-sm transition-colors border-b-2 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'border-mint-deep text-mint-deep'
                      : 'border-transparent text-slate-500 hover:text-slate-600'
                  }`}
                >
                  <tab.Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{t(tab.labelKey)}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'curation' && (
        <>
          {phase === 'swipe' && (
            <StyleSlider
              locale={locale}
              onComplete={handleComplete}
              onSkip={() => setActiveTab('map')}
            />
          )}
          {phase === 'result' && preference && (
            <CurationResult
              cityScores={cityScores}
              spots={initialSpots}
              preference={preference}
              locale={locale}
              onRetry={handleRetry}
            />
          )}
        </>
      )}

      {activeTab === 'map' && <SpotMapView spots={initialSpots} locale={locale} />}
      {activeTab === 'festival' && <FestivalCalendar spots={initialSpots} locale={locale} />}
      {activeTab === 'category' && <SpotCategoryView spots={initialSpots} locale={locale} />}
      {activeTab === 'city' && <SpotCityView spots={initialSpots} locale={locale} />}
    </div>
  )
}
