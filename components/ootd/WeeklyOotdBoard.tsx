'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
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
import { OOTD_CATEGORIES, getItemCategory, getItemIcon } from '@/lib/data/ootd-categories'
import { OOTD_REGIONS, pickL5, type OotdRegion } from '@/lib/data/ootd-regions'
import { RaindropIcon } from '@/components/shared/icons/RaindropIcon'

const MAJOR_CITIES_LABEL: Record<string, string> = {
  ko: '주요 도시',
  ja: '主要都市',
  en: 'Major cities',
  'zh-CN': '主要城市',
  'zh-TW': '主要城市',
}

// ─────────────────────────────────────────────
//  타입
// ─────────────────────────────────────────────
type Gender = 'male' | 'female'

// ─────────────────────────────────────────────
//  서브 컴포넌트: RegionSelector (17개 광역시도)
// ─────────────────────────────────────────────
interface RegionSelectorProps {
  regions: OotdRegion[]
  selected: string
  onSelect: (id: string) => void
  locale: string
}

function RegionSelector({ regions, selected, onSelect, locale }: RegionSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {regions.map((region) => {
        const isActive = region.id === selected
        return (
          <button
            key={region.id}
            onClick={() => onSelect(region.id)}
            className={[
              'shrink-0 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1.5',
              isActive
                ? 'bg-mint-deep text-white shadow-md scale-105'
                : 'bg-cloud border border-mist text-slate hover:border-mint hover:text-ink',
            ].join(' ')}
          >
            <span className="text-base leading-none">{region.emoji}</span>
            <span>{pickL5(region.name, locale)}</span>
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
//  서브 컴포넌트: ThemeHeader (region + major cities)
// ─────────────────────────────────────────────
interface ThemeHeaderProps {
  region: OotdRegion
  theme: CityTheme
  locale: string
}

function ThemeHeader({ region, theme, locale }: ThemeHeaderProps) {
  const t = useTranslations('ootd')
  const majorLabel = MAJOR_CITIES_LABEL[locale] ?? MAJOR_CITIES_LABEL.en
  const cityNames = region.majorCities.map((c) => pickL5(c, locale)).join(' · ')

  return (
    <div className="py-6 px-1">
      <p className="text-xs font-bold uppercase tracking-widest text-stone mb-1">
        {theme.theme}
      </p>
      <h2 className="text-3xl md:text-4xl font-black text-ink tracking-tight flex items-center gap-2">
        <span>{region.emoji}</span>
        <span>{pickL5(region.name, locale)}</span>
      </h2>
      {cityNames && (
        <p className="mt-2 text-sm text-mint-deep font-semibold">
          {majorLabel}: {cityNames}
        </p>
      )}
      <p className="mt-1.5 text-base text-stone">
        {t(`cities.${theme.cityId}.description`)}
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
        'group shrink-0 w-36 sm:w-44 md:w-48 rounded-2xl border transition-all duration-200',
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
//  날씨 기반 아이템 추천 판단
// ─────────────────────────────────────────────
const COLD_ITEMS = new Set([
  'paddedJacket', 'longPadding', 'woolCoat', 'longWoolCoat', 'fleece', 'overcoat',
  'herringboneCoat', 'navalCoat', 'longCoat', 'turtleneck', 'cableKnit', 'crewneckKnit',
  'knit', 'sweater', 'corduroyPants', 'ankleBoots', 'chelseaBoots', 'hikingBoots',
  'beanie', 'scarf',
])
const MILD_ITEMS = new Set([
  'trenchCoat', 'cardigan', 'windbreaker', 'blazer', 'tweedJacket', 'denimJacket',
  'hoodie', 'sweatshirt', 'oxfordShirt', 'checkShirt', 'blouse', 'pastelBlouse',
  'slimPants', 'widePants', 'slacks', 'jeans', 'denim', 'chinoPants', 'cargoPants',
  'midiSkirt', 'flaredSkirt', 'floralSkirt', 'knitDress', 'floralDress',
  'sneakers', 'loafer', 'canvasShoes', 'maryJane', 'derbyShoes',
  'crossbag', 'toteBag',
])
const HOT_ITEMS = new Set([
  'linenShirt', 'cottonTee', 'graphicTee', 'printTee', 'halterTop', 'offShoulderTop',
  'sleevelessTop', 'puffSleeve', 'linenJacket',
  'shorts', 'boardShorts', 'wideShorts', 'linenDress', 'marineDress', 'sleevelessDress', 'maxiDress',
  'sandals', 'espadrilles', 'flatSandal', 'platformSandals', 'slider', 'slipOn',
  'sunglasses', 'strawHat', 'cap',
])
const RAIN_SHOES = new Set(['hikingBoots', 'hikingShoes', 'chunkySneakers', 'runningShoes'])

function getItemRecommendation(
  key: string,
  highTemp: number,
  lowTemp: number,
  condition: string,
  locale: string
): { isRecommended: boolean; reason: string } {
  const avgTemp = (highTemp + lowTemp) / 2
  type I18nKey = 'ko' | 'en' | 'ja';
  const lk = (locale in { ko: 1, en: 1, ja: 1 } ? locale : 'en') as I18nKey

  if (condition === 'rainy' && RAIN_SHOES.has(key)) {
    const r = { ko: '비 오는 날 추천', en: 'Good for rain', ja: '雨の日おすすめ' }
    return { isRecommended: true, reason: r[lk] || r.en }
  }
  if (avgTemp <= 12 && COLD_ITEMS.has(key)) {
    const r = { ko: '따뜻하게 입기 좋아요', en: 'Stay warm', ja: '暖かく着られます' }
    return { isRecommended: true, reason: r[lk] || r.en }
  }
  if (avgTemp > 12 && avgTemp <= 22 && MILD_ITEMS.has(key)) {
    const r = { ko: `${highTemp}°C에 딱!`, en: `Great for ${highTemp}°C`, ja: `${highTemp}°Cにぴったり` }
    return { isRecommended: true, reason: r[lk] || r.en }
  }
  if (avgTemp > 22 && HOT_ITEMS.has(key)) {
    const r = { ko: '시원하게 입기 좋아요', en: 'Stay cool', ja: '涼しく着られます' }
    return { isRecommended: true, reason: r[lk] || r.en }
  }
  if (lowTemp <= 10 && avgTemp > 12 && COLD_ITEMS.has(key)) {
    const r = { ko: `아침 ${lowTemp}°C 대비`, en: `For morning ${lowTemp}°C`, ja: `朝${lowTemp}°C対策` }
    return { isRecommended: true, reason: r[lk] || r.en }
  }
  return { isRecommended: false, reason: '' }
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
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [customItems, setCustomItems] = useState<Record<number, OutfitItem>>({})
  const dropRef = useRef<HTMLUListElement>(null)

  const recLabel = locale === 'ko' ? '오늘의 추천' : locale === 'ja' ? '今日のおすすめ' : 'Recommended'
  const otherLabel = locale === 'ko' ? '다른 옵션' : locale === 'ja' ? '他のオプション' : 'Other options'

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

          // 드롭다운 아이템을 추천/비추천으로 분류
          const itemsWithRec = catDef.items.map((key) => {
            const rec = getItemRecommendation(key, weather.highTemp, weather.lowTemp, weather.condition, locale)
            return { key, ...rec }
          })
          const recommended = itemsWithRec.filter(a => a.isRecommended)
          const others = itemsWithRec.filter(a => !a.isRecommended)

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
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-mist z-30 max-h-60 overflow-y-auto text-ink">
                  {/* 추천 섹션 */}
                  {recommended.length > 0 && (
                    <>
                      <div className="px-3 py-1.5 text-[9px] font-black text-mint-deep bg-mint-light/50 sticky top-0 z-10">
                        ✨ {recLabel}
                      </div>
                      {recommended.map(({ key, reason }) => {
                        const nameKey = `ootd.items.${key}`
                        const isCurrent = item.nameKey === nameKey
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setCustomItems((prev) => ({ ...prev, [i]: { nameKey, icon: getItemIcon(key) } }))
                              setOpenIdx(null)
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-1.5 transition-colors ${
                              isCurrent ? 'bg-mint-light text-mint-deep font-bold' : 'hover:bg-mint-light/30'
                            }`}
                          >
                            <span>{getItemIcon(key)}</span>
                            <span className="flex-1 truncate">
                              {t(`items.${key}` as Parameters<typeof t>[0])}
                            </span>
                            <span className="text-[8px] text-white bg-mint-deep px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0 font-medium">
                              {reason}
                            </span>
                            {isCurrent && <span className="text-mint-deep text-[10px]">✓</span>}
                          </button>
                        )
                      })}
                    </>
                  )}

                  {/* 나머지 섹션 */}
                  <div className="px-3 py-1.5 text-[9px] font-bold text-stone bg-cloud/50 sticky top-0 z-10 border-t border-mist">
                    {recommended.length > 0 ? otherLabel : catDef.label.ko}
                  </div>
                  {others.map(({ key }) => {
                    const nameKey = `ootd.items.${key}`
                    const isCurrent = item.nameKey === nameKey
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setCustomItems((prev) => ({ ...prev, [i]: { nameKey, icon: getItemIcon(key) } }))
                          setOpenIdx(null)
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition-colors ${
                          isCurrent ? 'bg-mint-light text-mint-deep font-bold' : 'text-slate hover:bg-cloud/50'
                        }`}
                      >
                        <span>{getItemIcon(key)}</span>
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
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'
  const [selectedRegionId, setSelectedRegionId] = useState<string>('seoul')
  const [selectedGender, setSelectedGender] = useState<Gender>('female')
  const [liveWeather, setLiveWeather] = useState<Record<string, DailyWeather[]> | null>(null)

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data && !data.error) setLiveWeather(data) })
      .catch(() => {})
  }, [])

  const region = OOTD_REGIONS.find((r) => r.id === selectedRegionId) ?? OOTD_REGIONS[0]
  const cityTheme = CITY_THEMES.find((c) => c.cityId === region.themeId)!
  const weatherList = liveWeather?.[region.id]?.length
    ? liveWeather[region.id]
    : (CITY_WEATHER[region.themeId] ?? [])
  const today = weatherList[0]?.date
  const regionNameForChecklist = {
    ko: pickL5(region.name, 'ko'),
    ja: pickL5(region.name, 'ja'),
    en: pickL5(region.name, 'en'),
  }

  return (
    <div className="min-h-screen bg-snow">
      {/* ── 페이지 헤더 — P1-5: 단색 → Tier 2 (정보 페이지) ── */}
      <div className="bg-tier-soft border-b border-mist py-14 px-6 md:px-10 text-center">
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
          {/* 광역시도 선택 */}
          <div className="flex-1 min-w-0">
            <RegionSelector
              regions={OOTD_REGIONS}
              selected={selectedRegionId}
              onSelect={setSelectedRegionId}
              locale={locale}
            />
          </div>
          {/* 성별 토글 */}
          <div className="shrink-0">
            <GenderToggle selected={selectedGender} onChange={setSelectedGender} />
          </div>
        </div>

        {/* ── 광역시도 헤더 ──────────────────── */}
        <ThemeHeader region={region} theme={cityTheme} locale={locale} />

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
                cityId={region.id}
                cityName={regionNameForChecklist}
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
          {weatherList[0] && (
            <span className="flex items-center gap-1 ml-auto">
              <RaindropIcon size={12} className="text-blue-500" />
              {t('humidity')} {weatherList[0].humidity}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
