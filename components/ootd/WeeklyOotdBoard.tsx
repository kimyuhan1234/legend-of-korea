'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  CITY_THEMES,
  CITY_WEATHER,
  WEATHER_EMOJI,
  getTempRange,
  type CityTheme,
  type DailyWeather,
  type OutfitRecommendation,
} from '@/lib/data/ootd'
import { OotdChecklist } from '@/components/features/planner/OotdChecklist'

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
                ? 'bg-neutral-900 text-white shadow-md scale-105'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900',
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
    <div className="inline-flex rounded-full border border-neutral-200 bg-white p-0.5 shadow-sm">
      {(['male', 'female'] as Gender[]).map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={[
            'px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200',
            selected === g
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-500 hover:text-neutral-800',
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
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">
        {city.theme}
      </p>
      <h2 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
        {t(`cities.${city.cityId}.name`)}
      </h2>
      <p className="mt-2 text-base text-neutral-500">
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
    hot: 'text-orange-500',
  }

  return (
    <div
      className={[
        'group shrink-0 w-44 md:w-48 rounded-2xl border transition-all duration-200',
        'hover:scale-105 hover:shadow-xl cursor-default',
        isToday
          ? 'border-neutral-900 bg-neutral-900 text-white shadow-lg'
          : 'border-neutral-100 bg-white text-neutral-900 hover:border-neutral-300',
      ].join(' ')}
    >
      {/* 요일·날짜 */}
      <div className={[
        'px-4 pt-4 pb-3 border-b',
        isToday ? 'border-neutral-700' : 'border-neutral-100',
      ].join(' ')}>
        {isToday && (
          <span className="inline-block mb-1 px-2 py-0.5 rounded-full bg-white text-neutral-900 text-[10px] font-black uppercase tracking-wider">
            TODAY
          </span>
        )}
        <p className={[
          'text-xs font-bold uppercase tracking-widest',
          isToday ? 'text-neutral-400' : 'text-neutral-400',
        ].join(' ')}>
          {t(`days.${weather.dayOfWeek}`)}
        </p>
        <p className={[
          'text-sm font-semibold mt-0.5',
          isToday ? 'text-neutral-300' : 'text-neutral-500',
        ].join(' ')}>
          {weather.date.slice(5).replace('-', '/')}
        </p>
      </div>

      {/* 날씨 */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl">{WEATHER_EMOJI[weather.condition]}</span>
          <div className="text-right">
            <p className={['text-xs font-bold', isToday ? 'text-neutral-300' : 'text-neutral-400'].join(' ')}>
              {t(`weather.${weather.condition}`)}
            </p>
            <p className={['text-sm font-black mt-0.5', isToday ? 'text-white' : 'text-neutral-900'].join(' ')}>
              {weather.highTemp}° <span className={isToday ? 'text-neutral-400 font-normal' : 'text-neutral-400 font-normal'}>/ {weather.lowTemp}°</span>
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
        isToday ? 'border-neutral-700' : 'border-neutral-100',
      ].join(' ')}>
        <p className={['text-[10px] font-bold uppercase tracking-widest mt-3 mb-2',
          isToday ? 'text-neutral-400' : 'text-neutral-400'].join(' ')}>
          OUTFIT
        </p>
        {outfit ? (
          <>
            <ul className="space-y-1">
              {outfit.items.map((item) => (
                <li key={item.nameKey} className="flex items-center gap-1.5">
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className={['text-xs font-medium', isToday ? 'text-neutral-200' : 'text-neutral-700'].join(' ')}>
                    {t(item.nameKey.replace('ootd.', '') as Parameters<typeof t>[0])}
                  </span>
                </li>
              ))}
            </ul>
            <p className={['text-[10px] mt-3 leading-snug', isToday ? 'text-neutral-400' : 'text-neutral-400'].join(' ')}>
              💡 {t(outfit.tipKey.replace('ootd.', '') as Parameters<typeof t>[0])}
            </p>
            {!isToday && (
              <OotdChecklist
                date={weather.date}
                cityId={cityId}
                cityName={cityName}
                items={outfit.items}
              />
            )}
          </>
        ) : (
          <p className="text-xs text-neutral-400">—</p>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  메인 컴포넌트
// ─────────────────────────────────────────────
export function WeeklyOotdBoard() {
  const t = useTranslations('ootd')
  const [selectedCity, setSelectedCity] = useState<string>('seoul')
  const [selectedGender, setSelectedGender] = useState<Gender>('female')

  const cityTheme = CITY_THEMES.find((c) => c.cityId === selectedCity)!
  const weatherList = CITY_WEATHER[selectedCity] ?? []
  const today = weatherList[0]?.date

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* ── 페이지 헤더 ───────────────────────── */}
      <div className="bg-white border-b border-neutral-100 py-14 px-6 md:px-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-neutral-900 text-white
                         text-xs font-black uppercase tracking-widest mb-4">
          OOTD
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-3 text-neutral-500 text-base">{t('subtitle')}</p>
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
        <div className="flex flex-wrap gap-4 pb-12 text-xs text-neutral-400">
          {(['cold', 'mild', 'hot'] as const).map((range) => (
            <span key={range} className="flex items-center gap-1">
              <span className={range === 'cold' ? 'text-blue-400' : range === 'mild' ? 'text-emerald-400' : 'text-orange-400'}>●</span>
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
