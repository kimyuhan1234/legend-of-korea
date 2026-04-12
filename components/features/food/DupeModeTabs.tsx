'use client'

import { useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { AiDupeSearch } from './AiDupeSearch'
import { TastePreferenceFilter } from './TastePreferenceFilter'
import { TasteMatchResults } from './TasteMatchResults'

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

type Mode = 'city' | 'ai' | 'taste'

interface DupeModeTabsProps {
  locale: string
  cityGrid: ReactNode
}

export function DupeModeTabs({ locale, cityGrid }: DupeModeTabsProps) {
  const t = useTranslations('dupe')
  const [mode, setMode] = useState<Mode>('city')
  const [tasteLoading, setTasteLoading] = useState(false)
  const [tasteResults, setTasteResults] = useState<{
    topFoods: TopFood[]
    surprises: Surprise[]
  } | null>(null)
  const [tasteError, setTasteError] = useState<string | null>(null)

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

  const tabs: Array<{ key: Mode; label: string }> = [
    { key: 'city', label: t('mode.city') },
    { key: 'ai', label: t('mode.ai') },
    { key: 'taste', label: t('mode.taste') },
  ]

  return (
    <>
      {/* 모드 탭 */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        <div className="flex gap-2 justify-center flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setMode(tab.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                mode === tab.key
                  ? 'bg-mint-deep text-white'
                  : 'bg-cloud text-slate hover:bg-mist'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 모드별 콘텐츠 */}
      {mode === 'city' && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          {cityGrid}
        </section>
      )}

      {mode === 'ai' && (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <AiDupeSearch locale={locale} />
        </section>
      )}

      {mode === 'taste' && (
        <section className="max-w-4xl mx-auto px-4 py-8">
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
        </section>
      )}
    </>
  )
}
