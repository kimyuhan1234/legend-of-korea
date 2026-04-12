'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { AiDupeSearch } from './AiDupeSearch'
import { TastePreferenceFilter } from './TastePreferenceFilter'
import { TasteMatchResults } from './TasteMatchResults'
import { WorldDupeMap } from './WorldDupeMap'
import { CountryDupeList } from './CountryDupeList'
import { KoreaMapCitySelector } from './KoreaMapCitySelector'
import { DupeSwipeContainer } from './DupeSwipeContainer'
import { regions } from '@/lib/data/food-dupes'
import { getAllCountryCounts, getCountryDupes } from '@/lib/utils/country-dupe-aggregator'

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
}

export function DupeModeTabs({ locale }: DupeModeTabsProps) {
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
  const countryCounts = useMemo(() => getAllCountryCounts(regions), [])

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
      if (res.status === 402) { setTasteError('credits'); return }
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
      content: <KoreaMapCitySelector regions={regions} />,
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
                {tasteError === 'credits' && t('ai.insufficient')}
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
        <>
          <WorldDupeMap
            onCountrySelect={setSelectedCountry}
            selectedCountry={selectedCountry}
            countryCounts={countryCounts}
            locale={locale}
          />
          {selectedCountry && (
            <CountryDupeList
              countryCode={selectedCountry}
              data={getCountryDupes(selectedCountry, regions)}
              locale={locale}
            />
          )}
        </>
      ),
    },
  ]

  return <DupeSwipeContainer tabs={tabs} />
}
