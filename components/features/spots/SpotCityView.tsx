'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { SpotCard } from './SpotCard'
import { CITIES, getCityName } from '@/lib/curation/cities'
import { CITY_STORIES } from '@/lib/curation/city-stories'
import { courses } from '@/lib/data/courses'
import type { NormalizedSpot } from '@/lib/tour-api/types'

interface Props {
  spots: NormalizedSpot[]
  locale: string
}

function getI18n(field: { [k: string]: string } | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

function cityCourseId(code: string): string | null {
  const c = courses.find(x => x.region === code)
  return c?.id ?? null
}

export function SpotCityView({ spots, locale }: Props) {
  const t = useTranslations('spots')
  const [selectedCity, setSelectedCity] = useState<string>(CITIES[0].code)

  const citySpots = useMemo(() => {
    const filtered = spots.filter(s => s.region === selectedCity)
    return {
      hotspots: filtered.filter(s => s.category === 'hotspot'),
      landmarks: filtered.filter(s => s.category === 'landmark'),
      festivals: filtered.filter(s => s.category === 'festival'),
    }
  }, [spots, selectedCity])

  const name = getCityName(selectedCity, locale)
  const story = CITY_STORIES.find(s => s.region === selectedCity)
  const vibe = story ? getI18n(story.vibe, locale) : ''
  const emoji = CITIES.find(c => c.code === selectedCity)?.emoji || '📍'
  const courseId = cityCourseId(selectedCity)

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-2">
          🏙️ {t('city.title')}
        </h2>
      </div>

      {/* 도시 칩 */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
        {CITIES.map(c => {
          const isActive = selectedCity === c.code
          return (
            <button
              key={c.code}
              onClick={() => setSelectedCity(c.code)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border-2 font-bold text-sm transition-all ${
                isActive
                  ? 'bg-mint-deep text-white border-mint-deep scale-105 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-mint-deep/40'
              }`}
            >
              <span className="text-base">{c.emoji}</span>
              {getCityName(c.code, locale)}
            </button>
          )
        })}
      </div>

      {/* 도시 헤더 */}
      <div className="bg-gradient-to-br from-mint-deep/5 to-sky/5 rounded-2xl border border-mint-deep/15 p-5 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{emoji}</span>
          <h3 className="text-2xl font-black text-slate-800">{name}</h3>
        </div>
        {vibe && <p className="text-sm font-bold italic text-slate-600">&ldquo;{vibe}&rdquo;</p>}
      </div>

      {/* 카테고리별 */}
      <div className="space-y-7">
        {citySpots.hotspots.length > 0 && (
          <div>
            <h4 className="text-sm font-black text-slate-700 mb-3">
              🔥 {t('category.hotspot')} <span className="text-xs text-slate-400 font-bold">({citySpots.hotspots.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {citySpots.hotspots.map(s => <SpotCard key={s.id} spot={s} locale={locale} />)}
            </div>
          </div>
        )}

        {citySpots.landmarks.length > 0 && (
          <div>
            <h4 className="text-sm font-black text-slate-700 mb-3">
              🏛️ {t('category.landmark')} <span className="text-xs text-slate-400 font-bold">({citySpots.landmarks.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {citySpots.landmarks.map(s => <SpotCard key={s.id} spot={s} locale={locale} />)}
            </div>
          </div>
        )}

        {citySpots.festivals.length > 0 && (
          <div>
            <h4 className="text-sm font-black text-slate-700 mb-3">
              🎊 {t('category.festival')} <span className="text-xs text-slate-400 font-bold">({citySpots.festivals.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {citySpots.festivals.map(s => <SpotCard key={s.id} spot={s} locale={locale} />)}
            </div>
          </div>
        )}

        {citySpots.hotspots.length === 0 && citySpots.landmarks.length === 0 && citySpots.festivals.length === 0 && (
          <div className="text-center py-12 text-sm text-slate-400 font-bold">
            {t('result.noCitySpots')}
          </div>
        )}
      </div>

      {/* 미션 CTA */}
      <div className="text-center mt-10">
        <Link
          href={courseId ? `/${locale}/courses/${courseId}` : `/${locale}/story`}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-br from-mint-deep to-sky text-white font-black text-sm hover:opacity-90 transition-opacity shadow-lg"
        >
          <Sparkles className="w-4 h-4" /> {t('city.missionCta', { city: name })}
        </Link>
      </div>
    </div>
  )
}
