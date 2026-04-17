'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import {
  CITY_THEMES,
  CITY_WEATHER,
  WEATHER_EMOJI,
  getTempRange,
  type CityTheme,
  type DailyWeather,
  type OutfitRecommendation,
  type OutfitItem,
} from '@/lib/data/ootd'
import { OotdChecklist } from '@/components/features/planner/OotdChecklist'
import { OOTD_CATEGORIES, getItemCategory } from '@/lib/data/ootd-categories'

const CITY_NAME_MAP: Record<string, { ko: string; ja: string; en: string }> = {
  seoul:     { ko: '서울', ja: 'ソウル', en: 'Seoul' },
  busan:     { ko: '부산', ja: '釜山', en: 'Busan' },
  jeju:      { ko: '제주', ja: '済州', en: 'Jeju' },
  gyeongju:  { ko: '경주', ja: '慶州', en: 'Gyeongju' },
  tongyeong: { ko: '통영', ja: '統営', en: 'Tongyeong' },
  cheonan:   { ko: '천안', ja: '天安', en: 'Cheonan' },
  yongin:    { ko: '용인', ja: '龍仁', en: 'Yongin' },
  icheon:    { ko: '이천', ja: '利川', en: 'Icheon' },
  jeonju:    { ko: '전주', ja: '全州', en: 'Jeonju' },
}

// ─────────────────────────────────────────────
//  타입
// ─────────────────────────────────────────────
type Gender = 'male' | 'female'

// ─────────────────────────────────────────────
//  서브 컴포넌트: CitySelector
// ─────────────────────────────────────────────
interface CitySelectorProps {
  cities: CityTheme[]
  selected: string
  onSelect: (id: string) => void
}

function CitySelector({ cities, selected, onSelect }: CitySelectorProps) {
  const t = useTranslations('ootd')
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {cities.map((city) => {
        const isActive = city.cityId === selected
        return (
          <button
            key={city.cityId}
            onClick={() => onSelect(city.cityId)}
            className={[
              'shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
              isActive
                ? 'bg-mint-deep text-white shadow-md scale-105'
                : 'bg-cloud border border-mist text-slate hover:border-mint hover:text-ink',
            ].join(' ')}
          >
            {t(`cities.${city.cityId}.name`)}
          </button>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────
//  서브 컴포넌트: GenderToggle
// ─────────────────────────────────────────────
interface GenderToggleProps {
  selected: Gender
  onChange: (g: Gender) => void
}

function GenderToggle({ selected, onChange }: GenderToggleProps) {
  const t = useTranslations('ootd')
  return (
    <div className="inline-flex rounded-full border border-mist bg-cloud p-0.5 shadow-sm">
      {(['male', 'female'] as Gender[]).map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={[
            'px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200',
            selected === g
              ? 'bg-mint-deep text-white'
              : 'text-stone hover:text-slate',
          ].join(' ')}
        >
          {g === 'male' ? '👔' : '👗'} {t(`gender.${g}`)}
        </button>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
//  서브 컴포넌트: ThemeHeader
// ─────────────────────────────────────────────
interface ThemeHeaderProps {
  city: CityTheme
}

function ThemeHeader({ city }: ThemeHeaderProps) {
  const t = useTranslations('ootd')
  return (
    <div className="py-6 px-1">
      <p className="text-xs font-bold uppercase tracking-widest text-stone mb-1">
        {city.theme}
      </p>
      <h2 className="text-3xl md:text-4xl font-black text-ink tracking-tight">
        {t(`cities.${city.cityId}.name`)}
      </h2>
      <p className="mt-2 text-base text-stone">
        {t(`cities.${city.cityId}.description`)}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────
//  서브 컴포넌트: DayCard
// ─────────────────────────────────────────────
interface DayCardProps {
  weather: DailyWeather
  outfit: OutfitRecommendation | undefined
  isToday: boolean
  cityId: string
  cityName: { ko: string; ja: string; en: string }
}

function DayCard({ weather, outfit, isToday, cityId, cityName }: DayCardProps) {
  const t = useTranslations('ootd')
  const tempRange = getTempRange(weather.highTemp)

  const tempRangeColor: Record<string, string> = {
    cold: 'text-blue-500',
    mild: 'text-emerald-500',
    hot: 'text-blossom-deep',
  }

  return (
    <div
      className={[
        'group shrink-0 w-44 md:w-48 rounded-2xl border transition-all duration-200',
        'hover:scale-105 hover:shadow-xl cursor-default',
        isToday
          ? 'border-mint-deep bg-mint-deep text-white shadow-lg'
          : 'border-mist bg-white text-ink hover:border-mint',
      ].join(' ')}
    >
      {/* 요일·날짜 */}
      <div className={[
        'px-4 pt-4 pb-3 border-b',
        isToday ? 'border-mint/50' : 'border-mist',
      ].join(' ')}>
        {isToday && (
          <span className="inline-block mb-1 px-2 py-0.5 rounded-full bg-white text-ink text-[10px] font-black uppercase tracking-wider">
            TODAY
          </span>
        )}
        <p className={[
          'text-xs font-bold uppercase tracking-widest',
          isToday ? 'text-stone' : 'text-stone',
        ].join(' ')}>
          {t(`days.${weather.dayOfWeek}`)}
        </p>
        <p className={[
          'text-sm font-semibold mt-0.5',
          isToday ? 'text-mint-light' : 'text-stone',
        ].join(' ')}>
          {weather.date.slice(5).replace('-', '/')}
        </p>
      </div>

      {/* 날씨 */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl">{WEATHER_EMOJI[weather.condition]}</span>
          <div className="text-right">
            <p className={['text-xs font-bold', isToday ? 'text-mint-light' : 'text-stone'].join(' ')}>
              {t(`weather.${weather.condition}`)}
            </p>
            <p className={['text-sm font-black mt-0.5', isToday ? 'text-white' : 'text-ink'].join(' ')}>
              {weather.highTemp}° <span className={isToday ? 'text-stone font-normal' : 'text-stone font-normal'}>/ {weather.lowTemp}°</span>
            </p>
          </div>
        </div>

        {/* 기온 구간 */}
        <p className={['text-[10px] font-bold mt-1', tempRangeColor[tempRange]].join(' ')}>
          {t(`tempRange.${tempRange}`)}
        </p>
      </div>

      {/* 옷차림 */}
      <div className={[
        'px-4 pb-4 border-t',
        isToday ? 'border-mint/50' : 'border-mist',
      ].join(' ')}>
        <p className={['text-[10px] font-bold uppercase tracking-widest mt-3 mb-2',
          isToday ? 'text-stone' : 'text-stone'].join(' ')}>
          OUTFIT
        </p>
        {outfit ? (
          <OutfitWithDropdown
            outfit={outfit}
            isToday={isToday}
            weather={weather}
            cityId={cityId}
            cityName={cityName}
          />
        ) : (
          <p className="text-xs text-stone">—</p>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  서브 컴포넌트: OutfitWithDropdown — 아이템별 교체 드롭다운
// ─────────────────────────────────────────────
interface OutfitDropdownProps {
  outfit: OutfitRecommendation
  isToday: boolean
  weather: DailyWeather
  cityId: string
  cityName: { ko: string; ja: string; en: string }
}

function OutfitWithDropdown({ outfit, isToday, weather, cityId, cityName }: OutfitDropdownProps) {
  const t = useTranslations('ootd')
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [customItems, setCustomItems] = useState<Record<number, OutfitItem>>({})
  const dropRef = useRef<HTMLUListElement>(null)

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (openIdx === null) return
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpenIdx(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openIdx])

  const currentItems = outfit.items.map((item, i) => customItems[i] ?? item)

  return (
    <>
      <ul className="space-y-1.5" ref={dropRef}>
        {currentItems.map((item, i) => {
          const cat = getItemCategory(item.nameKey)
          const catDef = OOTD_CATEGORIES[cat]
          const isOpen = openIdx === i

          return (
            <li key={i} className="relative">
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">{item.icon}</span>
                <span className={['text-xs font-medium flex-1', isToday ? 'text-mint-light' : 'text-slate'].join(' ')}>
                  {t(item.nameKey.replace('ootd.', '') as Parameters<typeof t>[0])}
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setOpenIdx(isOpen ? null : i) }}
                  className="text-[9px] text-mint-deep bg-mint-light/50 rounded-lg px-1.5 py-0.5 hover:bg-mint-light transition-colors shrink-0"
                >
                  {t('change')}
                </button>
              </div>

              {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-mist z-30 max-h-40 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[9px] font-bold text-stone uppercase tracking-wider border-b border-mist">
                    {catDef.label.ko}
                  </div>
                  {catDef.items.map((key) => {
                    const nameKey = `ootd.items.${key}`
                    const isCurrent = item.nameKey === nameKey
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setCustomItems((prev) => ({
                            ...prev,
                            [i]: { nameKey, icon: catDef.icon },
                          }))
                          setOpenIdx(null)
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition-colors ${
                          isCurrent ? 'bg-mint-light text-mint-deep font-bold' : 'hover:bg-mint-light/30'
                        }`}
                      >
                        <span>{catDef.icon}</span>
                        <span className="flex-1 truncate">
                          {t(`items.${key}` as Parameters<typeof t>[0])}
                        </span>
                        {isCurrent && <span className="text-mint-deep text-[10px]">✓</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <p className={['text-[10px] mt-3 leading-snug', isToday ? 'text-stone' : 'text-stone'].join(' ')}>
        💡 {t(outfit.tipKey.replace('ootd.', '') as Parameters<typeof t>[0])}
      </p>
      {!isToday && (
        <OotdChecklist
          date={weather.date}
          cityId={cityId}
          cityName={cityName}
          items={currentItems}
        />
      )}
    </>
  )
}

// ─────────────────────────────────────────────
//  메인 컴포넌트
// ─────────────────────────────────────────────
export function WeeklyOotdBoard() {
  const t = useTranslations('ootd')
  const [selectedCity, setSelectedCity] = useState<string>('seoul')
  const [selectedGender, setSelectedGender] = useState<Gender>('female')
  const [liveWeather, setLiveWeather] = useState<Record<string, DailyWeather[]> | null>(null)

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data && !data.error) setLiveWeather(data) })
      .catch(() => {})
  }, [])

  const cityTheme = CITY_THEMES.find((c) => c.cityId === selectedCity)!
  const weatherList = liveWeather?.[selectedCity]?.length
    ? liveWeather[selectedCity]
    : (CITY_WEATHER[selectedCity] ?? [])
  const today = weatherList[0]?.date

  return (
    <div className="min-h-screen bg-snow">
      {/* ── 페이지 헤더 ───────────────────────── */}
      <div className="bg-mint-light border-b border-mist py-14 px-6 md:px-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-mint-deep text-white
                         text-xs font-black uppercase tracking-widest mb-4">
          OOTD
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-3 text-stone text-base">{t('subtitle')}</p>
      </div>

      {/* ── 컨트롤 영역 ──────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-2">
          {/* 도시 선택 */}
          <div className="flex-1 min-w-0">
            <CitySelector
              cities={CITY_THEMES}
              selected={selectedCity}
              onSelect={setSelectedCity}
            />
          </div>
          {/* 성별 토글 */}
          <div className="shrink-0">
            <GenderToggle selected={selectedGender} onChange={setSelectedGender} />
          </div>
        </div>

        {/* ── 도시 테마 헤더 ──────────────────── */}
        <ThemeHeader city={cityTheme} />

        {/* ── 7일 카드 ───────────────────────── */}
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
          {weatherList.map((weather) => {
            const tempRange = getTempRange(weather.highTemp)
            const outfit = cityTheme.outfits.find(
              (o) => o.gender === selectedGender && o.tempRange === tempRange
            )
            return (
              <DayCard
                key={weather.date}
                weather={weather}
                outfit={outfit}
                isToday={weather.date === today}
                cityId={selectedCity}
                cityName={CITY_NAME_MAP[selectedCity] ?? CITY_NAME_MAP.seoul}
              />
            )
          })}
        </div>

        {/* ── 범례 ────────────────────────────── */}
        <div className="flex flex-wrap gap-4 pb-12 text-xs text-stone">
          {(['cold', 'mild', 'hot'] as const).map((range) => (
            <span key={range} className="flex items-center gap-1">
              <span className={range === 'cold' ? 'text-blue-400' : range === 'mild' ? 'text-emerald-400' : 'text-blossom-deep'}>●</span>
              {t(`tempRange.${range}`)}
            </span>
          ))}
          <span className="flex items-center gap-1 ml-auto">
            💧 {t('humidity')} {weatherList[0]?.humidity}%
          </span>
        </div>
      </div>
    </div>
  )
}
