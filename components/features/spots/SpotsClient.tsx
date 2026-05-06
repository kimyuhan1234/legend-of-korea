'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Sparkles, Calendar, Folder, Building2 } from 'lucide-react'
import { StyleSlider } from './StyleSlider'
import { CurationResult } from './CurationResult'
import { SpotCategoryView } from './SpotCategoryView'
import { SpotCityView } from './SpotCityView'
import { FestivalCalendar } from './FestivalCalendar'
import { SpotDetailModal } from './SpotDetailModal'
import { calculateCityScores } from '@/lib/curation/scoring'
import type { NormalizedSpot } from '@/lib/tour-api/types'
import type { UserPreference } from '@/lib/curation/types'

interface Props {
  initialSpots: NormalizedSpot[]
  locale: string
}

type TabId = 'curation' | 'festival' | 'category' | 'city'
type CurationPhase = 'swipe' | 'result'

// '지도' 탭은 KakaoMap 미사용 더미였음 — 도시별 탭의 카드/지도 토글로 흡수 (2026-05-04 sights-tabs-audit)
const TABS: { id: TabId; Icon: React.ComponentType<{ className?: string }>; labelKey: string }[] = [
  { id: 'curation', Icon: Sparkles, labelKey: 'tab.curation' },
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
  const [selectedSpot, setSelectedSpot] = useState<NormalizedSpot | null>(null)

  const cityScores = useMemo(
    () => (preference ? calculateCityScores(preference) : []),
    [preference],
  )

  // URL ?spot=... 쿼리 → 모달 오픈 (마운트 시 + popstate 시).
  // 카드 클릭 시 history.replaceState 로 URL 만 동기화 (Next.js router 회피 — 풀 리렌더 방지).
  useEffect(() => {
    const syncFromUrl = () => {
      if (typeof window === 'undefined') return
      const params = new URLSearchParams(window.location.search)
      const spotId = params.get('spot')
      if (!spotId) {
        setSelectedSpot(null)
        return
      }
      const found = initialSpots.find((s) => s.id === spotId)
      setSelectedSpot(found ?? null)
    }
    syncFromUrl()
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [initialSpots])

  const handleSpotClick = useCallback((spot: NormalizedSpot) => {
    setSelectedSpot(spot)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('spot', spot.id)
      window.history.pushState({}, '', url.toString())
    }
  }, [])

  const handleSpotClose = useCallback(() => {
    setSelectedSpot(null)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('spot')
      window.history.pushState({}, '', url.toString())
    }
  }, [])

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
                  {/* hotfix: 모바일에서 라벨 노출 — 'hidden md:inline' 제거.
                      컨테이너가 overflow-x-auto 라 5 탭 가로 스크롤 가능. */}
                  <span>{t(tab.labelKey)}</span>
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
              onSkip={() => setActiveTab('city')}
            />
          )}
          {phase === 'result' && preference && (
            <CurationResult
              cityScores={cityScores}
              spots={initialSpots}
              preference={preference}
              locale={locale}
              onRetry={handleRetry}
              onSpotClick={handleSpotClick}
            />
          )}
        </>
      )}

      {activeTab === 'festival' && <FestivalCalendar spots={initialSpots} locale={locale} onSpotClick={handleSpotClick} />}
      {activeTab === 'category' && <SpotCategoryView spots={initialSpots} locale={locale} onSpotClick={handleSpotClick} />}
      {activeTab === 'city' && <SpotCityView spots={initialSpots} locale={locale} onSpotClick={handleSpotClick} />}

      <SpotDetailModal spot={selectedSpot} locale={locale} onClose={handleSpotClose} />
    </div>
  )
}
