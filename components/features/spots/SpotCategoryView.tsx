'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { SpotCard } from './SpotCard'
import { CITIES, getCityName } from '@/lib/curation/cities'
import type { NormalizedSpot, SpotCategory } from '@/lib/tour-api/types'

interface Props {
  spots: NormalizedSpot[]
  locale: string
}

const CATEGORY_EMOJI: Record<SpotCategory, string> = {
  hotspot: '🔥',
  landmark: '🏛️',
  festival: '🎊',
}

export function SpotCategoryView({ spots, locale }: Props) {
  const t = useTranslations('spots')
  const [category, setCategory] = useState<SpotCategory>('hotspot')
  const [region, setRegion] = useState<string>('')

  const filtered = useMemo(() => {
    return spots.filter(s => {
      if (s.category !== category) return false
      if (region && s.region !== region) return false
      return true
    })
  }, [spots, category, region])

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-2">
          📂 {t('category.title')}
        </h2>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 mb-5 border-b border-slate-100">
        {(['hotspot', 'landmark', 'festival'] as const).map(cat => {
          const isActive = category === cat
          const count = spots.filter(s => s.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setRegion('') }}
              className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-colors border-b-2 ${
                isActive ? 'border-mint-deep text-mint-deep' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-base">{CATEGORY_EMOJI[cat]}</span>
              {t(`category.${cat}`)}
              <span className="text-[10px] text-slate-400">({count})</span>
            </button>
          )
        })}
      </div>

      {/* 도시 필터 */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        <button
          onClick={() => setRegion('')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            !region ? 'bg-mint-deep text-white border-mint-deep' : 'bg-white text-slate-500 border-slate-200 hover:border-mint-deep/40'
          }`}
        >
          {t('category.all')}
        </button>
        {CITIES.map(c => {
          const isActive = region === c.code
          return (
            <button
              key={c.code}
              onClick={() => setRegion(c.code)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                isActive ? 'bg-mint-deep text-white border-mint-deep' : 'bg-white text-slate-500 border-slate-200 hover:border-mint-deep/40'
              }`}
            >
              {c.emoji} {getCityName(c.code, locale)}
            </button>
          )
        })}
      </div>

      {/* 스팟 카드 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-slate-400 font-bold">
          {t('result.noCitySpots')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => <SpotCard key={s.id} spot={s} locale={locale} />)}
        </div>
      )}
    </div>
  )
}
