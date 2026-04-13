'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { COUNTRIES, getCountryDupes } from '@/lib/utils/country-dupe-aggregator'
import { regions } from '@/lib/data/food-dupes'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

interface WorldDupeMapProps {
  onCountrySelect: (code: string) => void
  selectedCountry: string | null
  countryCounts: Record<string, number>
  locale: string
}

function getL(field: { ko: string; en: string; ja: string }, locale: string): string {
  return field[locale as 'ko' | 'en' | 'ja'] || field.ko
}

// 국기 마커 위치 (세계지도 이미지 기준 %) — 아시아 중앙 동양식 지도
const MAP_POS: Record<string, { x: number; y: number }> = {
  JP: { x: 73, y: 30 },
  CN: { x: 58, y: 28 },
  TH: { x: 55, y: 48 },
  VN: { x: 60, y: 45 },
  MY: { x: 57, y: 55 },
  ID: { x: 62, y: 60 },
  IN: { x: 45, y: 40 },
  IT: { x: 30, y: 28 },
  FR: { x: 27, y: 24 },
  ES: { x: 24, y: 30 },
  US: { x: 88, y: 28 },
  MX: { x: 85, y: 40 },
}
const KOREA_POS = { x: 67, y: 30 }

const codes = Object.keys(COUNTRIES)

export function WorldDupeMap({ onCountrySelect, selectedCountry, countryCounts, locale }: WorldDupeMapProps) {
  const t = useTranslations('dupe')
  const [hovered, setHovered] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const active = hovered || selectedCountry
  const dupeData = active ? getCountryDupes(active, regions) : null
  const dupes = dupeData?.dupes ?? []
  const activeMeta = active ? COUNTRIES[active] : null

  // 국가 변경 시 더보기 리셋
  const handleSelect = (code: string) => {
    setShowAll(false)
    onCountrySelect(code)
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black text-ink mb-2">
          {t('world.title')}
        </h2>
        <p className="text-sm text-stone">{t('world.subtitle')}</p>
      </div>

      {/* ── 데스크톱: 리스트 + 지도 나란히 ── */}
      <div className="hidden lg:flex gap-5 items-start">
        {/* 왼쪽 — 국가 리스트 */}
        <div className="w-56 shrink-0 max-h-[460px] overflow-y-auto pr-1 flex flex-col gap-1">
          {codes.map((code) => {
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
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left ${
                  isActive ? 'bg-mint-deep text-white' : 'hover:bg-mint-light'
                }`}
              >
                <span className="text-xl shrink-0">{meta.flag}</span>
                <span className="flex-1 text-sm font-medium truncate">{getL(meta.name, locale)}</span>
                <span className={`text-[10px] rounded-full px-2 py-0.5 font-bold shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-blossom text-blossom-deep'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* 오른쪽 — 세계지도 */}
        <div className="flex-1 relative">
          <Image
            src="/images/world-map-legend.png"
            alt="Legend World Map"
            width={800}
            height={450}
            className="w-full h-auto rounded-xl"
            priority
          />

          {/* 한국 마커 (항상 표시) */}
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

      {/* ── 모바일: 세로 스택 ── */}
      <div className="lg:hidden">
        {/* 국기 칩 가로 스크롤 */}
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

        {/* 모바일 지도 (작게) */}
        <div className="relative mb-6">
          <Image
            src="/images/world-map-legend.png"
            alt="Legend World Map"
            width={800}
            height={450}
            className="w-full h-auto rounded-xl"
          />
          {/* 한국 마커 */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: `${KOREA_POS.y}%`, left: `${KOREA_POS.x}%` }}>
            <span className="text-sm">📍</span>
          </div>
          {/* 선택된 국가 마커만 표시 */}
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

      {/* ── 듀프 카드 그리드 (지도 아래) ── */}
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
                key={`${active}-${dupe.koreanFood.id}`}
                className="bg-white rounded-xl p-4 border border-mist hover:border-mint hover:shadow-md transition-all"
                style={{ animation: `fadeUp 0.4s ease-out ${i * 0.08}s both` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-slate truncate">{getL(dupe.foreignFood.name, locale)}</span>
                  <span className="text-mint-deep font-bold shrink-0">→</span>
                  <span className="text-sm font-bold text-ink truncate">{getL(dupe.koreanFood.name, locale)}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] bg-blossom-light text-blossom-deep rounded-full px-2 py-0.5 font-bold shrink-0">
                    {getL(dupe.regionName, locale)}
                  </span>
                  <div className="flex-1 h-1.5 bg-mist rounded-full">
                    <div className="h-full bg-mint-deep rounded-full transition-all duration-500" style={{ width: `${dupe.foreignFood.similarityPercent}%` }} />
                  </div>
                  <span className="text-xs font-bold text-mint-deep shrink-0">{dupe.foreignFood.similarityPercent}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/food/dupe/${dupe.regionCode}/${dupe.koreanFood.id}`}
                    className="text-[10px] font-bold text-mint-deep hover:underline"
                  >
                    {t('world.detail')}
                  </Link>
                  <AddToPlannerButton
                    itemType="food"
                    itemData={{ name: dupe.koreanFood.name, foodId: dupe.koreanFood.id, region: dupe.regionCode, source: 'world-map' }}
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

      {/* 미선택 상태 */}
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
