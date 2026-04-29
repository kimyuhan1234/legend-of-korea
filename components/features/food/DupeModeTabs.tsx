'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AiDupeSearch } from './AiDupeSearch'
import { TastePreferenceFilter } from './TastePreferenceFilter'
import { TasteMatchResults } from './TasteMatchResults'
import { WorldDupeMap } from './WorldDupeMap'
import { ProvinceAccordion } from './ProvinceAccordion'
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

export function DupeModeTabs({ locale, regionSummaries: _regionSummaries, countryCounts, allCountryDupes }: DupeModeTabsProps) {
  const t = useTranslations('dupe')

  // 취향 매칭 상태
  const [tasteLoading, setTasteLoading] = useState(false)
  const [tasteResults, setTasteResults] = useState<{
    topFoods: TopFood[]
    surprises: Surprise[]
  } | null>(null)
  const [tasteError, setTasteError] = useState<string | null>(null)

  // 세계지도 상태
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

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
      // PRD/UX: 12 평면 그리드 → 10 도/시 2 단계 Accordion (단일 도시 즉시 link).
      // regionSummaries prop 은 page.tsx 의 정적 데이터 — 현재는 ProvinceAccordion
      // 자체 PROVINCES 사용. 향후 음식 카운트 표시 등 동적 데이터 필요 시 prop 추가.
      content: <ProvinceAccordion />,
    },
    {
      key: 'ai',
      label: t('mode.ai'),
      content: <AiDupeSearch locale={locale} />,
    },
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
    {
      key: 'world',
      label: t('mode.world'),
      content: (
        <WorldDupeMap
          onCountrySelect={setSelectedCountry}
          selectedCountry={selectedCountry}
          countryCounts={countryCounts}
          allCountryDupes={allCountryDupes}
          locale={locale}
        />
      ),
    },
  ]

  return <DupeSwipeContainer tabs={tabs} />
}
