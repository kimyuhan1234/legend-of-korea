'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ArrowLeft, LayoutGrid, Map as MapIcon } from 'lucide-react'
import { SpotCard } from './SpotCard'
import { KakaoMap, type KakaoMapMarker } from '@/components/shared/KakaoMap'
import { getCityName } from '@/lib/curation/cities'
import { CITY_STORIES } from '@/lib/curation/city-stories'
import { courses } from '@/lib/data/courses'
import { PROVINCES } from '@/lib/data/regions-hierarchy'
import { REGION_COORDINATES, KOREA_CENTER, KOREA_ZOOM_LEVEL } from '@/lib/data/region-coordinates'
import type { NormalizedSpot } from '@/lib/tour-api/types'

interface Props {
  spots: NormalizedSpot[]
  locale: string
}

/** 17 광역시도 — TourAPI PROVINCE_AREA_CODES 와 1:1 매칭. */
const PROVINCE_CODES = [
  'seoul', 'incheon', 'daejeon', 'daegu', 'gwangju', 'busan', 'ulsan', 'sejong',
  'gyeonggi', 'gangwon', 'chungbuk', 'chungnam', 'gyeongbuk', 'gyeongnam',
  'jeonbuk', 'jeonnam', 'jeju',
] as const

/**
 * 시 → 광역 reverse 매핑 (PROVINCES 기반).
 * SIGHTS 시 단위 region(jeonju/gyeongju/...) 부모 광역에 합산.
 */
const CITY_TO_PROVINCE: Record<string, string> = (() => {
  const map: Record<string, string> = {}
  for (const p of PROVINCES) {
    for (const c of p.cities) map[c.id] = p.id
  }
  return map
})()

function getProvinceFor(region: string): string {
  if ((PROVINCE_CODES as readonly string[]).includes(region)) return region
  return CITY_TO_PROVINCE[region] ?? region
}

function getI18n(field: { [k: string]: string } | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

function cityCourseId(code: string): string | null {
  const c = courses.find((x) => x.region === code)
  return c?.id ?? null
}

type ViewMode = 'card' | 'map'

export function SpotCityView({ spots, locale }: Props) {
  const t = useTranslations('spots')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('card')

  // 17 광역별 spot 수 (시 단위 합산 포함)
  const provinceCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const code of PROVINCE_CODES) counts[code] = 0
    for (const s of spots) {
      const province = getProvinceFor(s.region)
      if (counts[province] !== undefined) counts[province]++
    }
    return counts
  }, [spots])

  // 선택된 광역의 카테고리별 spot
  const citySpots = useMemo(() => {
    if (!selectedCity) return { hotspots: [], landmarks: [], festivals: [] }
    const filtered = spots.filter((s) => getProvinceFor(s.region) === selectedCity)
    return {
      hotspots: filtered.filter((s) => s.category === 'hotspot'),
      landmarks: filtered.filter((s) => s.category === 'landmark'),
      festivals: filtered.filter((s) => s.category === 'festival'),
    }
  }, [spots, selectedCity])

  // KakaoMap 마커 — 17 광역
  const mapMarkers = useMemo<KakaoMapMarker[]>(() => {
    const markers: KakaoMapMarker[] = []
    for (const code of PROVINCE_CODES) {
      const coord = REGION_COORDINATES[code]
      if (!coord) continue
      const name = getCityName(code, locale)
      const count = provinceCounts[code] ?? 0
      markers.push({
        lat: coord.lat,
        lng: coord.lng,
        title: `${name} · ${t('city.spotCount', { n: count })}`,
        color: 'red',
        onClick: () => setSelectedCity(code),
      })
    }
    return markers
  }, [locale, provinceCounts, t])

  // ── 1 단계: 카드/지도 토글 ──
  if (!selectedCity) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-2">
            🏙️ {t('city.title')}
          </h2>
        </div>

        {/* 카드/지도 토글 */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-cloud rounded-full p-1 border border-mist">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                viewMode === 'card'
                  ? 'bg-white text-mint-deep shadow-sm'
                  : 'text-stone hover:text-slate-700'
              }`}
              aria-pressed={viewMode === 'card'}
            >
              <LayoutGrid className="w-4 h-4" />
              {t('city.viewCard')}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-mint-deep shadow-sm'
                  : 'text-stone hover:text-slate-700'
              }`}
              aria-pressed={viewMode === 'map'}
            >
              <MapIcon className="w-4 h-4" />
              {t('city.viewMap')}
            </button>
          </div>
        </div>

        {viewMode === 'card' ? (
          // ── 카드 보기: 17 광역 이미지 카드 ──
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {PROVINCE_CODES.map((code) => {
              const name = getCityName(code, locale)
              const count = provinceCounts[code] ?? 0
              return (
                <button
                  key={code}
                  onClick={() => setSelectedCity(code)}
                  className="group block relative overflow-hidden rounded-2xl bg-white border border-mist shadow-sm hover:shadow-lg hover:border-mint transition-all duration-300 hover:-translate-y-1 text-left"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={`/images/region-card-sights/${code}.jpg`}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent pt-12 pb-3 px-3">
                      <span className="block text-white text-sm md:text-base font-bold leading-tight">
                        {name}
                      </span>
                      <span className="block text-white/80 text-[11px] md:text-xs mt-0.5">
                        {t('city.spotCount', { n: count })}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          // ── 지도 보기: KakaoMap + 17 핀 ──
          <KakaoMap
            centerLat={KOREA_CENTER.lat}
            centerLng={KOREA_CENTER.lng}
            level={KOREA_ZOOM_LEVEL}
            markers={mapMarkers}
            className="w-full h-[500px] md:h-[600px] rounded-2xl border border-mist overflow-hidden"
          />
        )}
      </div>
    )
  }

  // ── 2 단계: 선택된 광역 spot list ──
  const name = getCityName(selectedCity, locale)
  const story = CITY_STORIES.find((s) => s.region === selectedCity)
  const vibe = story ? getI18n(story.vibe, locale) : ''
  const courseId = cityCourseId(selectedCity)

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <button
        type="button"
        onClick={() => setSelectedCity(null)}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-stone hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> {t('city.backToProvinces')}
      </button>

      <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-6 border border-mist">
        <Image
          src={`/images/region-card-sights/${selectedCity}.jpg`}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 1024px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
          <h3 className="text-2xl md:text-3xl font-black text-white drop-shadow mb-1">{name}</h3>
          {vibe && <p className="text-sm md:text-base font-medium italic text-white/90 drop-shadow">&ldquo;{vibe}&rdquo;</p>}
        </div>
      </div>

      <div className="space-y-7">
        {citySpots.hotspots.length > 0 && (
          <div>
            <h4 className="text-sm font-black text-slate-700 mb-3">
              🔥 {t('category.hotspot')} <span className="text-xs text-slate-500 font-bold">({citySpots.hotspots.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {citySpots.hotspots.map((s) => <SpotCard key={s.id} spot={s} locale={locale} />)}
            </div>
          </div>
        )}

        {citySpots.landmarks.length > 0 && (
          <div>
            <h4 className="text-sm font-black text-slate-700 mb-3">
              🏛️ {t('category.landmark')} <span className="text-xs text-slate-500 font-bold">({citySpots.landmarks.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {citySpots.landmarks.map((s) => <SpotCard key={s.id} spot={s} locale={locale} />)}
            </div>
          </div>
        )}

        {citySpots.festivals.length > 0 && (
          <div>
            <h4 className="text-sm font-black text-slate-700 mb-3">
              🎊 {t('category.festival')} <span className="text-xs text-slate-500 font-bold">({citySpots.festivals.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {citySpots.festivals.map((s) => <SpotCard key={s.id} spot={s} locale={locale} />)}
            </div>
          </div>
        )}

        {citySpots.hotspots.length === 0 && citySpots.landmarks.length === 0 && citySpots.festivals.length === 0 && (
          <div className="text-center py-12 text-sm text-slate-500 font-bold">
            {t('result.noCitySpots')}
          </div>
        )}
      </div>

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
