'use client'

import { useState, useRef } from 'react'
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

const INITIAL_POS: Record<string, { x: number; y: number }> = {
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
  KOREA: { x: 67, y: 30 },
}

const codes = Object.keys(COUNTRIES)

export function WorldDupeMap({ onCountrySelect, selectedCountry, countryCounts, locale }: WorldDupeMapProps) {
  const t = useTranslations('dupe')
  const [hovered, setHovered] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const active = hovered || selectedCountry
  const dupeData = active ? getCountryDupes(active, regions) : null
  const dupes = dupeData?.dupes ?? []
  const activeMeta = active ? COUNTRIES[active] : null

  const handleSelect = (code: string) => {
    setShowAll(false)
    onCountrySelect(code)
  }

  // ── 개발 도구: 드래그 좌표 조정 (확정 후 제거) ──
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({ ...INITIAL_POS })
  const [dragging, setDragging] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const updatePos = (clientX: number, clientY: number) => {
    if (!dragging || !mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    const x = Math.round(((clientX - rect.left) / rect.width) * 1000) / 10
    const y = Math.round(((clientY - rect.top) / rect.height) * 1000) / 10
    setPositions((prev) => ({ ...prev, [dragging]: { x, y } }))
  }

  const handleMouseDown = (code: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(code)
  }
  const handleMouseMove = (e: React.MouseEvent) => updatePos(e.clientX, e.clientY)
  const handleMouseUp = () => {
    if (dragging) {
      console.log('=== 세계지도 국기 좌표 ===')
      Object.entries(positions).forEach(([code, pos]) => {
        console.log(`  ${code}: { x: ${pos.x}, y: ${pos.y} },`)
      })
      setDragging(null)
    }
  }
  const handleTouchStart = (code: string) => (e: React.TouchEvent) => {
    e.stopPropagation()
    setDragging(code)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return
    updatePos(e.touches[0].clientX, e.touches[0].clientY)
  }

  const copyPositions = () => {
    const text = Object.entries(positions)
      .map(([code, pos]) => `  ${code}: { x: ${pos.x}, y: ${pos.y} },`)
      .join('\n')
    navigator.clipboard.writeText(text).catch(() => {})
    alert('좌표가 클립보드에 복사되었습니다!')
  }

  const koreaPos = positions.KOREA

  return (
    <div>
      {/* ── 데스크톱: 지도 풀 폭 ── */}
      <div className="hidden lg:block">
        <div
          ref={mapRef}
          className="relative w-full select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <Image
            src="/images/world-map-legend.png"
            alt="Legend World Map"
            width={1200}
            height={675}
            className="w-full h-auto rounded-xl"
            priority
            draggable={false}
          />

          {/* 한국 마커 (드래그 가능) */}
          <div
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 ${dragging === 'KOREA' ? 'cursor-grabbing scale-150' : 'cursor-grab'}`}
            style={{ top: `${koreaPos.y}%`, left: `${koreaPos.x}%` }}
            onMouseDown={handleMouseDown('KOREA')}
            onTouchStart={handleTouchStart('KOREA')}
          >
            <span className="text-lg">📍</span>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-mint-deep text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              KOREA
            </span>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[7px] bg-black/80 text-white px-1 rounded whitespace-nowrap">
              {koreaPos.x},{koreaPos.y}
            </span>
          </div>

          {/* 12개국 국기 마커 (드래그 가능) */}
          {codes.map((code) => {
            const pos = positions[code]
            if (!pos) return null
            const meta = COUNTRIES[code]
            const count = countryCounts[code] ?? 0
            const isActive = active === code
            const isDraggingThis = dragging === code

            return (
              <button
                key={code}
                type="button"
                onClick={(e) => {
                  if (!dragging) {
                    e.stopPropagation()
                    handleSelect(code)
                  }
                }}
                onMouseDown={handleMouseDown(code)}
                onTouchStart={handleTouchStart(code)}
                onMouseEnter={() => { if (!dragging) setHovered(code) }}
                onMouseLeave={() => { if (!dragging) setHovered(null) }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20 ${
                  isDraggingThis
                    ? 'cursor-grabbing scale-[1.8]'
                    : isActive
                      ? 'scale-150 cursor-grab'
                      : 'hover:scale-125 cursor-grab'
                }`}
                style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
                title={getL(meta.name, locale)}
              >
                <span className="text-2xl drop-shadow-lg">{meta.flag}</span>
                <span className="absolute -bottom-1 -right-1 bg-blossom text-blossom-deep text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
                {isActive && !isDraggingThis && (
                  <span className="absolute inset-0 -m-2 rounded-full bg-mint/30 animate-ping" />
                )}
                {/* 개발도구: 좌표 표시 */}
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[7px] bg-black/80 text-white px-1 rounded whitespace-nowrap">
                  {code} {pos.x},{pos.y}
                </span>
              </button>
            )
          })}

          {/* 선택된 국가 → 한국 점선 */}
          {active && positions[active] && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <line
                x1={`${positions[active].x}%`}
                y1={`${positions[active].y}%`}
                x2={`${koreaPos.x}%`}
                y2={`${koreaPos.y}%`}
                stroke="#9DD8CE"
                strokeWidth="2"
                strokeDasharray="8,4"
                className="animate-draw"
              />
              <circle cx={`${koreaPos.x}%`} cy={`${koreaPos.y}%`} r="4" fill="#9DD8CE" />
            </svg>
          )}
        </div>

        {/* 개발 도구 — 좌표 확정 후 이 블록 전체 삭제 */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-xs font-mono">
          <p className="font-bold mb-2">🛠️ 개발 도구: 국기를 드래그해서 위치 조정 (한국 📍도 드래그 가능)</p>
          {Object.entries(positions).map(([code, pos]) => (
            <div key={code}>
              {code === 'KOREA' ? '📍' : COUNTRIES[code]?.flag ?? ''} {code}: x: {pos.x}%, y: {pos.y}%
            </div>
          ))}
          <button
            type="button"
            onClick={copyPositions}
            className="mt-2 px-3 py-1 bg-mint-deep text-white rounded text-xs font-bold"
          >
            📋 좌표 복사
          </button>
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
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: `${koreaPos.y}%`, left: `${koreaPos.x}%` }}>
            <span className="text-sm">📍</span>
          </div>
          {active && positions[active] && (
            <>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 scale-125"
                style={{ top: `${positions[active].y}%`, left: `${positions[active].x}%` }}
              >
                <span className="text-xl">{COUNTRIES[active].flag}</span>
                <span className="absolute inset-0 -m-1 rounded-full bg-mint/30 animate-ping" />
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <line
                  x1={`${positions[active].x}%`} y1={`${positions[active].y}%`}
                  x2={`${koreaPos.x}%`} y2={`${koreaPos.y}%`}
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
