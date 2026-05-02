'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
// import { AiDupeSearch } from './AiDupeSearch'  // AI 매칭 탭 비활성화 중 (코드 보존)
import { TastePreferenceFilter } from './TastePreferenceFilter'
import { TasteMatchResults } from './TasteMatchResults'
// import { WorldDupeMap } from './WorldDupeMap'  // 세계지도 탭 비활성화 중 (코드 보존)
import { RegionGroupGrid } from './RegionGroupGrid'
import { DupeSwipeContainer } from './DupeSwipeContainer'
import type { RegionSummary } from './KoreaMapCitySelector'
import type { CountrySummary } from './WorldDupeMap'

interface TopFood {
  foodId: string
  foodName: { ko: string; en: string; ja: string }
  foodImage: string
  regionCode: string
  regionName: { ko: string; en: string; ja: string }
  matchScore: number
  matchReason: { ko: string; en: string; ja: string }
}

interface Surprise {
  recipeId: string
  recipeName: { ko: string; en: string; ja: string }
  recipeImage: string
  countryCode: string
  emoji: string
  koreanBase: { ko: string; en: string; ja: string }
  connectionReason: { ko: string; en: string; ja: string }
}

interface DupeModeTabsProps {
  locale: string
  regionSummaries: RegionSummary[]
  countryCounts: Record<string, number>
  allCountryDupes: Record<string, CountrySummary>
}

export function DupeModeTabs({ locale, regionSummaries: _regionSummaries, countryCounts: _countryCounts, allCountryDupes: _allCountryDupes }: DupeModeTabsProps) {
  const t = useTranslations('dupe')

  // 취향 매칭 상태
  const [tasteLoading, setTasteLoading] = useState(false)
  const [tasteResults, setTasteResults] = useState<{
    topFoods: TopFood[]
    surprises: Surprise[]
  } | null>(null)
  const [tasteError, setTasteError] = useState<string | null>(null)

  // const [selectedCountry, setSelectedCountry] = useState<string | null>(null)  // 세계지도 탭 비활성화 중

  const handleTasteSearch = async (pref: { sweet: number; salty: number; spicy: number; umami: number; sour: number }) => {
    setTasteLoading(true)
    setTasteError(null)
    setTasteResults(null)
    try {
      const res = await fetch('/api/dupe/taste-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preference: pref }),
      })
      if (res.status === 401) { setTasteError('login'); return }
      if (res.status === 403) { setTasteError('subscription'); return }
      if (!res.ok) { setTasteError('error'); return }
      const data = await res.json()
      setTasteResults({ topFoods: data.topFoods, surprises: data.surprises })
    } catch {
      setTasteError('network')
    } finally {
      setTasteLoading(false)
    }
  }

  const tabs = [
    {
      key: 'city',
      label: t('mode.city'),
      // 6 권역 그리드 (서울경기/충청도/강원도/전라도/경상도/제주도).
      // 권역 진입 시 해당 권역 도시 음식 + national 음식 합쳐 노출.
      content: <RegionGroupGrid />,
    },
    // AI 매칭 탭 비활성화 중 (향후 복구 위해 코드 보존)
    // {
    //   key: 'ai',
    //   label: t('mode.ai'),
    //   content: <AiDupeSearch locale={locale} />,
    // },
    {
      key: 'taste',
      label: t('mode.taste'),
      content: (
        <>
          <TastePreferenceFilter onSearch={handleTasteSearch} isLoading={tasteLoading} />
          {tasteError && (
            <div className="text-center mt-4">
              <p className="text-sm text-blossom-deep font-bold">
                {tasteError === 'login' && t('ai.loginRequired')}
                {tasteError === 'subscription' && t('ai.subscription')}
                {tasteError === 'error' && t('ai.aiError')}
                {tasteError === 'network' && t('ai.networkError')}
              </p>
            </div>
          )}
          {tasteResults && (
            <TasteMatchResults
              topFoods={tasteResults.topFoods}
              surprises={tasteResults.surprises}
              locale={locale}
              isVisible={!!tasteResults}
            />
          )}
        </>
      ),
    },
    // 세계지도 탭 비활성화 중 (향후 복구 위해 코드 보존)
    // {
    //   key: 'world',
    //   label: t('mode.world'),
    //   content: (
    //     <WorldDupeMap
    //       onCountrySelect={setSelectedCountry}
    //       selectedCountry={selectedCountry}
    //       countryCounts={_countryCounts}
    //       allCountryDupes={_allCountryDupes}
    //       locale={locale}
    //     />
    //   ),
    // },
  ]

  return <DupeSwipeContainer tabs={tabs} />
}
