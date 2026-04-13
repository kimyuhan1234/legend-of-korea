'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { COUNTRIES } from '@/lib/utils/country-dupe-aggregator'
import { getCountryDupes } from '@/lib/utils/country-dupe-aggregator'
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

// 국가별 지구본 회전각 (CSS rotateY)
const ROTATIONS: Record<string, number> = {
  JP: 0, CN: -10, TH: -20, VN: -15, MY: -25, ID: -30,
  IN: -50, IT: -100, FR: -110, ES: -115, US: -170, MX: -160,
}

// 지구본 위 국가 점 위치 (원 기준 %)
const DOTS: Record<string, { x: number; y: number }> = {
  JP: { x: 82, y: 30 }, CN: { x: 72, y: 28 }, TH: { x: 70, y: 48 },
  VN: { x: 74, y: 42 }, MY: { x: 72, y: 55 }, ID: { x: 75, y: 60 },
  IN: { x: 62, y: 42 }, IT: { x: 48, y: 30 }, FR: { x: 44, y: 25 },
  ES: { x: 42, y: 32 }, US: { x: 18, y: 28 }, MX: { x: 15, y: 40 },
}

const codes = Object.keys(COUNTRIES)

export function WorldDupeMap({ onCountrySelect, selectedCountry, countryCounts, locale }: WorldDupeMapProps) {
  const t = useTranslations('dupe')
  const [hovered, setHovered] = useState<string | null>(null)

  const active = hovered || selectedCountry
  const rotation = active ? (ROTATIONS[active] ?? 0) : 0
  const dot = active ? DOTS[active] : null

  // 선택된 국가의 듀프 데이터
  const dupeData = active ? getCountryDupes(active, regions) : null
  const dupes = dupeData?.dupes.slice(0, 5) ?? []

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black text-ink mb-2">
          {t('world.title')}
        </h2>
        <p className="text-sm text-stone">{t('world.subtitle')}</p>
      </div>

      {/* ── 데스크톱: 3단 그리드 ── */}
      <div className="hidden lg:grid grid-cols-[220px_200px_1fr] gap-6 items-start">
        {/* 왼쪽 — 국가 리스트 */}
        <div className="max-h-[520px] overflow-y-auto pr-1 flex flex-col gap-1">
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
                onClick={() => onCountrySelect(code)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-mint-deep text-white'
                    : 'hover:bg-mint-light'
                }`}
              >
                <span className="text-xl shrink-0">{meta.flag}</span>
                <span className="flex-1 text-sm font-medium truncate">
                  {getL(meta.name, locale)}
                </span>
                <span className={`text-xs rounded-full px-2 py-0.5 font-bold shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-blossom text-blossom-deep'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* 중간 — 지구본 */}
        <div className="flex justify-center pt-10">
          <div className="relative w-48 h-48">
            {/* 지구본 본체 */}
            <div
              className="w-full h-full rounded-full relative overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #6CB4EE, #2E86C1 40%, #1A5276 80%, #0B2545)',
                boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(44,130,201,0.2)',
              }}
            >
              {/* 대륙 */}
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out"
                style={{ transform: `rotateY(${rotation}deg)` }}
              >
                <div style={{ position: 'absolute', top: '15%', left: '8%', width: '25%', height: '30%', background: 'rgba(139,195,74,0.5)', borderRadius: '40% 60% 30% 70%' }} />
                <div style={{ position: 'absolute', top: '50%', left: '18%', width: '15%', height: '30%', background: 'rgba(139,195,74,0.5)', borderRadius: '50% 50% 40% 60%' }} />
                <div style={{ position: 'absolute', top: '12%', left: '42%', width: '18%', height: '20%', background: 'rgba(139,195,74,0.5)', borderRadius: '60% 40% 50% 50%' }} />
                <div style={{ position: 'absolute', top: '30%', left: '44%', width: '16%', height: '32%', background: 'rgba(139,195,74,0.5)', borderRadius: '45% 55% 40% 60%' }} />
                <div style={{ position: 'absolute', top: '10%', left: '55%', width: '35%', height: '40%', background: 'rgba(139,195,74,0.5)', borderRadius: '50% 60% 40% 50%' }} />
                <div style={{ position: 'absolute', top: '60%', left: '75%', width: '14%', height: '14%', background: 'rgba(139,195,74,0.5)', borderRadius: '50% 40% 60% 50%' }} />
              </div>

              {/* 국가 점 */}
              {dot && (
                <div
                  className="absolute w-3 h-3 rounded-full bg-blossom-deep"
                  style={{ top: `${dot.y}%`, left: `${dot.x}%`, transform: 'translate(-50%,-50%)' }}
                >
                  <div className="absolute inset-0 rounded-full bg-blossom-deep animate-ping" />
                </div>
              )}

              {/* 광택 */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25), transparent 60%)' }}
              />
            </div>

            {/* 한국 라벨 */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-mint-deep text-white px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap">
              📍 KOREA
            </div>
          </div>
        </div>

        {/* 오른쪽 — 듀프 카드 */}
        <div className="min-h-[200px]">
          {active && dupes.length > 0 ? (
            <div className="flex flex-col gap-3">
              {dupes.map((dupe, i) => (
                <div
                  key={`${active}-${dupe.koreanFood.id}`}
                  className="bg-white rounded-xl p-3 border border-mist hover:border-mint transition-all"
                  style={{ animation: `slideIn 0.4s ease-out ${i * 0.08}s both` }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-slate truncate">
                      {getL(dupe.foreignFood.name, locale)}
                    </span>
                    <span className="text-mint-deep font-bold shrink-0">→</span>
                    <span className="text-sm font-bold text-ink truncate">
                      {getL(dupe.koreanFood.name, locale)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-blossom-light text-blossom-deep rounded-full px-2 py-0.5 font-bold shrink-0">
                      {getL(dupe.regionName, locale)}
                    </span>
                    <div className="flex-1 h-1.5 bg-mist rounded-full">
                      <div className="h-full bg-mint-deep rounded-full transition-all" style={{ width: `${dupe.foreignFood.similarityPercent}%` }} />
                    </div>
                    <span className="text-xs font-bold text-mint-deep shrink-0">
                      {dupe.foreignFood.similarityPercent}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Link
                      href={`/${locale}/food/dupe/${dupe.regionCode}/${dupe.koreanFood.id}`}
                      className="text-[10px] font-bold text-mint-deep hover:underline"
                    >
                      {t('world.detail')}
                    </Link>
                    <AddToPlannerButton
                      itemType="food"
                      itemData={{ name: dupe.koreanFood.name, foodId: dupe.koreanFood.id, region: dupe.regionCode, source: 'world-globe' }}
                      cityId={dupe.regionCode}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
              {dupeData && dupeData.totalMatches > 5 && (
                <button
                  type="button"
                  onClick={() => onCountrySelect(active)}
                  className="text-sm text-mint-deep hover:underline text-center"
                >
                  {t('world.more', { count: dupeData.totalMatches - 5 })}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center text-stone py-16">
              <p className="text-3xl mb-2">🌍</p>
              <p className="text-sm">{t('world.selectCountry')}</p>
            </div>
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
                  onClick={() => onCountrySelect(code)}
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

        {/* 모바일 지구본 (작게) */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <div
              className="w-full h-full rounded-full overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #6CB4EE, #2E86C1 40%, #1A5276 80%, #0B2545)',
                boxShadow: 'inset -12px -12px 24px rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute inset-0 transition-transform duration-700" style={{ transform: `rotateY(${rotation}deg)` }}>
                <div style={{ position: 'absolute', top: '10%', left: '55%', width: '35%', height: '40%', background: 'rgba(139,195,74,0.4)', borderRadius: '50% 60% 40% 50%' }} />
                <div style={{ position: 'absolute', top: '12%', left: '42%', width: '18%', height: '20%', background: 'rgba(139,195,74,0.4)', borderRadius: '60% 40% 50% 50%' }} />
                <div style={{ position: 'absolute', top: '15%', left: '8%', width: '25%', height: '30%', background: 'rgba(139,195,74,0.4)', borderRadius: '40% 60% 30% 70%' }} />
              </div>
              {dot && (
                <div className="absolute w-2.5 h-2.5 rounded-full bg-blossom-deep" style={{ top: `${dot.y}%`, left: `${dot.x}%`, transform: 'translate(-50%,-50%)' }}>
                  <div className="absolute inset-0 rounded-full bg-blossom-deep animate-ping" />
                </div>
              )}
              <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.2), transparent 60%)' }} />
            </div>
          </div>
        </div>

        {/* 모바일 카드 */}
        {active && dupes.length > 0 && (
          <div className="space-y-3">
            {dupes.map((dupe, i) => (
              <div
                key={`m-${active}-${dupe.koreanFood.id}`}
                className="bg-white rounded-xl p-3 border border-mist"
                style={{ animation: `slideIn 0.3s ease-out ${i * 0.06}s both` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-slate truncate">{getL(dupe.foreignFood.name, locale)}</span>
                  <span className="text-mint-deep font-bold">→</span>
                  <span className="text-sm font-bold text-ink truncate">{getL(dupe.koreanFood.name, locale)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-blossom-light text-blossom-deep rounded-full px-2 py-0.5 font-bold">{getL(dupe.regionName, locale)}</span>
                  <div className="flex-1 h-1 bg-mist rounded-full">
                    <div className="h-full bg-mint-deep rounded-full" style={{ width: `${dupe.foreignFood.similarityPercent}%` }} />
                  </div>
                  <span className="text-xs font-bold text-mint-deep">{dupe.foreignFood.similarityPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
