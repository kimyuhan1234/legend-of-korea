'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { COUNTRIES } from '@/lib/utils/country-dupe-aggregator'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

export interface SlimDupeEntry {
  foreignFoodName: { ko: string; ja: string; en: string }
  koreanFoodName: { ko: string; ja: string; en: string }
  koreanFoodId: string
  regionCode: string
  regionName: { ko: string; ja: string; en: string }
  similarityPercent: number
}

export interface CountrySummary {
  totalMatches: number
  dupes: SlimDupeEntry[]
}

interface WorldDupeMapProps {
  onCountrySelect: (code: string) => void
  selectedCountry: string | null
  countryCounts: Record<string, number>
  allCountryDupes: Record<string, CountrySummary>
  locale: string
}

function getL(field: { ko: string; en: string; ja: string } | null | undefined, locale: string): string {
  if (!field) return ''
  return (field as Record<string, string>)[locale] || field.en || field.ko || ''
}

/** Phase H — 한중일 한정. 9개국 좌표 폐기 후 JP/CN 만 유지. */
const MAP_POS: Record<string, { x: number; y: number }> = {
  JP: { x: 44.8, y: 31.4 },
  CN: { x: 37.1, y: 30.6 },
}
const KOREA_POS = { x: 41.6, y: 28.8 }

const codes = Object.keys(COUNTRIES)

export function WorldDupeMap({ onCountrySelect, selectedCountry, countryCounts, allCountryDupes, locale }: WorldDupeMapProps) {
  const t = useTranslations('dupe')
  const [hovered, setHovered] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const active = hovered || selectedCountry
  const dupeData = active ? (allCountryDupes[active] ?? null) : null
  const dupes = dupeData?.dupes ?? []
  const activeMeta = active ? COUNTRIES[active] : null

  const handleSelect = (code: string) => {
    setShowAll(false)
    onCountrySelect(code)
  }


  return (
    <div>
      {/* ── 데스크톱: 지도 풀 폭 ── */}
      <div className="hidden lg:block">
        <div className="relative w-full">
          <Image
            src="/images/world-map-legend.png"
            alt="Legend World Map"
            width={1200}
            height={675}
            className="w-full h-auto rounded-xl"
            priority
          />

          {/* 한국 마커 */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ top: `${KOREA_POS.y}%`, left: `${KOREA_POS.x}%` }}
          >
            <span className="text-lg">📍</span>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-mint-deep text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              KOREA
            </span>
          </div>

          {/* 12개국 국기 마커 */}
          {codes.map((code) => {
            const pos = MAP_POS[code]
            if (!pos) return null
            const meta = COUNTRIES[code]
            const count = countryCounts[code] ?? 0
            const isActive = active === code

            return (
              <button
                key={code}
                type="button"
                onMouseEnter={() => setHovered(code)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleSelect(code)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20 ${
                  isActive ? 'scale-150' : 'hover:scale-125'
                }`}
                style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
                title={getL(meta.name, locale)}
              >
                <span className="text-2xl drop-shadow-lg">{meta.flag}</span>
                <span className="absolute -bottom-1 -right-1 bg-blossom text-blossom-deep text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
                {isActive && (
                  <span className="absolute inset-0 -m-2 rounded-full bg-mint/30 animate-ping" />
                )}
              </button>
            )
          })}

          {/* 선택된 국가 → 한국 점선 */}
          {active && MAP_POS[active] && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <line
                x1={`${MAP_POS[active].x}%`}
                y1={`${MAP_POS[active].y}%`}
                x2={`${KOREA_POS.x}%`}
                y2={`${KOREA_POS.y}%`}
                stroke="#9DD8CE"
                strokeWidth="2"
                strokeDasharray="8,4"
                className="animate-draw"
              />
              <circle cx={`${KOREA_POS.x}%`} cy={`${KOREA_POS.y}%`} r="4" fill="#9DD8CE" />
            </svg>
          )}
        </div>
      </div>

      {/* ── 모바일: 칩 + 지도 ── */}
      <div className="lg:hidden">
        <div className="overflow-x-auto pb-3 mb-4">
          <div className="flex gap-2 w-max px-1">
            {codes.map((code) => {
              const meta = COUNTRIES[code]
              const isActive = active === code
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSelect(code)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold transition-colors ${
                    isActive ? 'bg-mint-deep text-white' : 'bg-cloud text-slate border border-mist'
                  }`}
                >
                  <span className="text-lg">{meta.flag}</span>
                  <span>{getL(meta.name, locale)}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20' : 'bg-blossom text-blossom-deep'
                  }`}>
                    {countryCounts[code] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative mb-6">
          <Image
            src="/images/world-map-legend.png"
            alt="Legend World Map"
            width={800}
            height={450}
            className="w-full h-auto rounded-xl"
          />
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: `${KOREA_POS.y}%`, left: `${KOREA_POS.x}%` }}>
            <span className="text-sm">📍</span>
          </div>
          {active && MAP_POS[active] && (
            <>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 scale-125"
                style={{ top: `${MAP_POS[active].y}%`, left: `${MAP_POS[active].x}%` }}
              >
                <span className="text-xl">{COUNTRIES[active].flag}</span>
                <span className="absolute inset-0 -m-1 rounded-full bg-mint/30 animate-ping" />
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <line
                  x1={`${MAP_POS[active].x}%`} y1={`${MAP_POS[active].y}%`}
                  x2={`${KOREA_POS.x}%`} y2={`${KOREA_POS.y}%`}
                  stroke="#9DD8CE" strokeWidth="1.5" strokeDasharray="6,3" className="animate-draw"
                />
              </svg>
            </>
          )}
        </div>
      </div>

      {/* ── 듀프 카드 그리드 ── */}
      {active && dupes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-ink mb-4">
            {activeMeta?.flag} {t('world.matches', {
              country: activeMeta ? getL(activeMeta.name, locale) : '',
              count: dupeData?.totalMatches ?? 0,
            })}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAll ? dupes : dupes.slice(0, 6)).map((dupe, i) => (
              <div
                key={`${active}-${dupe.koreanFoodId}`}
                className="bg-white rounded-xl p-4 border border-mist hover:border-mint hover:shadow-md transition-all"
                style={{ animation: `fadeUp 0.4s ease-out ${i * 0.08}s both` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-slate truncate">{getL(dupe.foreignFoodName, locale)}</span>
                  <span className="text-mint-deep font-bold shrink-0">→</span>
                  <span className="text-sm font-bold text-ink truncate">{getL(dupe.koreanFoodName, locale)}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] bg-blossom-light text-blossom-deep rounded-full px-2 py-0.5 font-bold shrink-0">
                    {getL(dupe.regionName, locale)}
                  </span>
                  <div className="flex-1 h-1.5 bg-mist rounded-full">
                    <div className="h-full bg-mint-deep rounded-full transition-all duration-500" style={{ width: `${dupe.similarityPercent}%` }} />
                  </div>
                  <span className="text-xs font-bold text-mint-deep shrink-0">{dupe.similarityPercent}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/food/dupe/${dupe.regionCode}/${dupe.koreanFoodId}`}
                    prefetch={false}
                    className="text-[10px] font-bold text-mint-deep hover:underline"
                  >
                    {t('world.detail')}
                  </Link>
                  <AddToPlannerButton
                    itemType="food"
                    itemData={{ name: dupe.koreanFoodName, foodId: dupe.koreanFoodId, region: dupe.regionCode, source: 'world-map' }}
                    cityId={dupe.regionCode}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>

          {dupes.length > 6 && !showAll && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="mt-4 text-sm text-mint-deep hover:underline mx-auto block"
            >
              {t('world.more', { count: dupes.length - 6 })}
            </button>
          )}
        </div>
      )}

      {!active && (
        <div className="text-center text-stone py-10 mt-4">
          <p className="text-3xl mb-2">🌍</p>
          <p className="text-sm">{t('world.selectCountry')}</p>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 200; }
          to   { stroke-dashoffset: 0; }
        }
        .animate-draw {
          animation: drawLine 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
