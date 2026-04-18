'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { SwipeCard } from './SwipeCard'
import { CurationResult } from './CurationResult'
import { SpotCard } from './SpotCard'
import { SWIPE_QUESTIONS, swipeToPreference, calculateCityScores } from '@/lib/curation/scoring'
import type { NormalizedSpot } from '@/lib/tour-api/types'
import type { UserPreference } from '@/lib/curation/types'

interface Props {
  initialSpots: NormalizedSpot[]
  locale: string
}

type Phase = 'swipe' | 'result' | 'browse'

const REGIONS = [
  { code: 'jeonju',    ko: '전주',  ja: '全州',  en: 'Jeonju',    'zh-CN': '全州',  'zh-TW': '全州' },
  { code: 'tongyeong', ko: '통영',  ja: '統営',  en: 'Tongyeong', 'zh-CN': '统营',  'zh-TW': '統營' },
  { code: 'cheonan',   ko: '천안',  ja: '天安',  en: 'Cheonan',   'zh-CN': '天安',  'zh-TW': '天安' },
  { code: 'yongin',    ko: '용인',  ja: '龍仁',  en: 'Yongin',    'zh-CN': '龙仁',  'zh-TW': '龍仁' },
  { code: 'icheon',    ko: '이천',  ja: '利川',  en: 'Icheon',    'zh-CN': '利川',  'zh-TW': '利川' },
  { code: 'gyeongju',  ko: '경주',  ja: '慶州',  en: 'Gyeongju',  'zh-CN': '庆州',  'zh-TW': '慶州' },
  { code: 'seoul',     ko: '서울',  ja: 'ソウル', en: 'Seoul',     'zh-CN': '首尔',  'zh-TW': '首爾' },
  { code: 'busan',     ko: '부산',  ja: '釜山',  en: 'Busan',     'zh-CN': '釜山',  'zh-TW': '釜山' },
  { code: 'jeju',      ko: '제주',  ja: '済州',  en: 'Jeju',      'zh-CN': '济州',  'zh-TW': '濟州' },
]

export function SpotsClient({ initialSpots, locale }: Props) {
  const t = useTranslations('spots')
  const tSights = useTranslations('sights')
  const [phase, setPhase] = useState<Phase>('swipe')
  const [preference, setPreference] = useState<UserPreference | null>(null)
  const [region, setRegion] = useState<string>('')
  const [category, setCategory] = useState<string>('')

  const cityScores = useMemo(() => preference ? calculateCityScores(preference) : [], [preference])

  const handleComplete = (answers: Record<string, 'A' | 'B'>) => {
    const pref = swipeToPreference(answers)
    setPreference(pref)
    setPhase('result')
  }

  const handleRetry = () => {
    setPreference(null)
    setPhase('swipe')
  }

  const filteredSpots = initialSpots.filter(s => {
    if (region && s.region !== region) return false
    if (category && s.category !== category) return false
    return true
  })

  // Phase 1: 스와이프
  if (phase === 'swipe') {
    return (
      <div className="min-h-screen bg-snow">
        <SwipeCard
          questions={SWIPE_QUESTIONS}
          locale={locale}
          onComplete={handleComplete}
          onSkip={() => setPhase('browse')}
        />
      </div>
    )
  }

  // Phase 2: 결과
  if (phase === 'result' && preference) {
    return (
      <div className="min-h-screen bg-snow">
        <CurationResult
          cityScores={cityScores}
          spots={initialSpots}
          preference={preference}
          locale={locale}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  // Phase 3: 일반 브라우즈 (건너뛰기)
  return (
    <div className="min-h-screen bg-snow">
      <div className="bg-gradient-to-br from-mint to-blossom text-ink py-16 md:py-20 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-2">{tSights('title')}</h1>
        <p className="text-slate">{tSights('subtitle')}</p>
        <button
          onClick={() => setPhase('swipe')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white font-black text-sm hover:opacity-90 transition-opacity"
        >
          ✨ {t('swipe.start')}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 지역 필터 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setRegion('')}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${!region ? 'bg-gradient-to-br from-mint to-blossom text-ink border-ink' : 'bg-white text-slate border-mist hover:border-ink/40'}`}
          >
            {tSights('filterAll')}
          </button>
          {REGIONS.map(r => (
            <button
              key={r.code}
              onClick={() => setRegion(r.code)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${region === r.code ? 'bg-gradient-to-br from-mint to-blossom text-ink border-ink' : 'bg-white text-slate border-mist hover:border-ink/40'}`}
            >
              {(r as Record<string, string>)[locale] || r.en}
            </button>
          ))}
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['hotspot', 'landmark', 'festival'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? '' : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${category === cat ? 'bg-gradient-to-br from-mint to-blossom text-ink border-mint-deep' : 'bg-white text-slate border-mist hover:border-mint-deep/40'}`}
            >
              {cat === 'hotspot' ? '🔥' : cat === 'landmark' ? '🏛️' : '🎊'} {tSights(cat)}
            </button>
          ))}
        </div>

        {/* 스팟 카드 */}
        {filteredSpots.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="font-bold text-[#111] text-lg mb-2">{tSights('comingSoon')}</p>
            <p className="text-stone">{tSights('comingSoonDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map(s => (
              <SpotCard key={s.id} spot={s} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
