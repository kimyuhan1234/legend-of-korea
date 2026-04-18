'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { SpotCard } from './SpotCard'
import { CITIES, getCityName } from '@/lib/curation/cities'
import type { NormalizedSpot } from '@/lib/tour-api/types'

interface Props {
  spots: NormalizedSpot[]
  locale: string
}

export function SpotMapView({ spots, locale }: Props) {
  const t = useTranslations('spots')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const citySpots = useMemo(() => {
    if (!selectedCity) return { hotspots: [], landmarks: [], festivals: [] }
    const filtered = spots.filter(s => s.region === selectedCity)
    return {
      hotspots: filtered.filter(s => s.category === 'hotspot'),
      landmarks: filtered.filter(s => s.category === 'landmark'),
      festivals: filtered.filter(s => s.category === 'festival'),
    }
  }, [spots, selectedCity])

  const selectedName = selectedCity ? getCityName(selectedCity, locale) : ''

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-2">
          🗺️ {t('map.title')}
        </h2>
        <p className="text-sm text-slate-500 font-bold">{t('map.subtitle')}</p>
      </div>

      {/* 9도시 그리드 */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {CITIES.map(city => {
          const isActive = selectedCity === city.code
          const count = spots.filter(s => s.region === city.code).length
          return (
            <button
              key={city.code}
              onClick={() => setSelectedCity(isActive ? null : city.code)}
              className={`relative py-6 rounded-2xl border-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-mint-deep to-sky text-white border-mint-deep scale-105 shadow-lg'
                  : 'bg-white text-slate-700 border-slate-100 hover:border-mint-deep/40 hover:shadow-sm'
              }`}
            >
              <div className="text-3xl mb-1">{city.emoji}</div>
              <div className={`text-sm font-black ${isActive ? 'text-white' : 'text-slate-700'}`}>
                {getCityName(city.code, locale)}
              </div>
              <div className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                {count}
              </div>
            </button>
          )
        })}
      </div>

      {/* 선택된 도시 스팟 */}
      {selectedCity && (
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-800 border-l-4 border-mint-deep pl-3">
            {t('map.spotsOf', { city: selectedName })}
          </h3>

          {citySpots.hotspots.length > 0 && (
            <div>
              <h4 className="text-sm font-black text-slate-700 mb-3">🔥 {t('category.hotspot')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {citySpots.hotspots.map(s => <SpotCard key={s.id} spot={s} locale={locale} />)}
              </div>
            </div>
          )}

          {citySpots.landmarks.length > 0 && (
            <div>
              <h4 className="text-sm font-black text-slate-700 mb-3">🏛️ {t('category.landmark')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {citySpots.landmarks.map(s => <SpotCard key={s.id} spot={s} locale={locale} />)}
              </div>
            </div>
          )}

          {citySpots.festivals.length > 0 && (
            <div>
              <h4 className="text-sm font-black text-slate-700 mb-3">🎊 {t('category.festival')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      )}

      {!selectedCity && (
        <div className="text-center py-8 text-sm text-slate-400 font-bold">
          👆 {t('map.subtitle')}
        </div>
      )}
    </div>
  )
}
