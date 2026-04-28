'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'
import {
  SLIDER_AXES,
  COMPANION_OPTIONS,
  sliderToPreference,
  calculateCityScores,
} from '@/lib/curation/scoring'
import { getTopMatchedTags, getTagLabel } from '@/lib/curation/city-stories'
import { preferenceToRadar, cityToRadar, type RadarLabels } from '@/lib/curation/radar'
import { getCityName } from '@/lib/curation/cities'
import { RadarChart } from './RadarChart'
import type { UserPreference } from '@/lib/curation/types'

interface Props {
  locale: string
  onComplete: (preference: UserPreference) => void
  onSkip: () => void
}

function getI18n(field: { [k: string]: string } | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

function cityName(code: string, locale: string): string {
  return getCityName(code, locale)
}

const SCALE_LABELS: Record<string, string[]> = {
  ko: ['매우', '조금', '중간', '조금', '매우'],
  en: ['Very', 'A bit', 'Neutral', 'A bit', 'Very'],
  ja: ['とても', '少し', '中間', '少し', 'とても'],
  'zh-CN': ['非常', '偏向', '中间', '偏向', '非常'],
  'zh-TW': ['非常', '偏向', '中間', '偏向', '非常'],
}

export function StyleSlider({ locale, onComplete, onSkip }: Props) {
  const t = useTranslations('spots')

  const [sliders, setSliders] = useState<Record<string, number>>(
    () => Object.fromEntries(SLIDER_AXES.map(a => [a.id, 0])),
  )
  const [companion, setCompanion] = useState<string | null>(null)

  const preference = useMemo(() => sliderToPreference(sliders, companion), [sliders, companion])
  const cityScores = useMemo(() => calculateCityScores(preference), [preference])
  const top3 = cityScores.slice(0, 3)

  const radarLabels: RadarLabels = useMemo(() => ({
    tradition: t('radar.tradition'),
    nature: t('radar.nature'),
    experience: t('radar.experience'),
    active: t('radar.active'),
    nightlife: t('radar.nightlife'),
  }), [t])
  const userRadar = useMemo(() => preferenceToRadar(preference, radarLabels), [preference, radarLabels])
  const topCityRadar = useMemo(
    () => top3[0] ? cityToRadar(top3[0].city, radarLabels) : [],
    [top3, radarLabels],
  )

  const medal = ['🥇', '🥈', '🥉']
  const barColors = ['bg-mint-deep', 'bg-sky', 'bg-violet-400']

  const handleSubmit = () => {
    onComplete(preference)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-14">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🎯</div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-2">
          {t('slider.title')}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-bold">{t('slider.subtitle')}</p>
      </div>

      {/* 여행 성향 슬라이더 9개 — 컴팩트 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 mb-4">
        <h2 className="text-xs font-black text-slate-700 mb-3">
          🧭 {t('slider.travelStyle')}
        </h2>
        <div className="space-y-5">
          {SLIDER_AXES.map(axis => {
            const value = sliders[axis.id] ?? 0
            const scaleLabels = SCALE_LABELS[locale] ?? SCALE_LABELS.ko
            const STEPS = [-100, -50, 0, 50, 100]

            // 0에서 선택값까지 하이라이트 범위 (% 기준)
            // step 위치: -100=0%, -50=25%, 0=50%, +50=75%, +100=100%
            const centerPos = 50
            const selectedPos = centerPos + (value / 100) * 50

            return (
              <div key={axis.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="text-sm">{axis.left.icon}</span>
                    {getI18n(axis.left.label, locale)}
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    {getI18n(axis.right.label, locale)}
                    <span className="text-sm">{axis.right.icon}</span>
                  </span>
                </div>

                {/* 스텝 선택 트랙 */}
                <div className="relative h-11 select-none">
                  {/* 트랙 배경 */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-2.5 right-2.5 h-1.5 rounded-full bg-gradient-to-r from-blossom/50 via-slate-200 to-mint/50" />

                  {/* 선택 영역 하이라이트 (0 기준 → 선택값) */}
                  {value !== 0 && (
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full ${
                        value < 0 ? 'bg-blossom' : 'bg-mint-deep'
                      } transition-all duration-200`}
                      style={{
                        left: value < 0 ? `${selectedPos}%` : `${centerPos}%`,
                        right: value > 0 ? `${100 - selectedPos}%` : `${100 - centerPos}%`,
                      }}
                    />
                  )}

                  {/* 5개 스텝 버튼 */}
                  <div className="absolute inset-0 flex justify-between items-center px-0">
                    {STEPS.map((step, i) => {
                      const isSelected = value === step
                      return (
                        <button
                          key={step}
                          type="button"
                          onClick={() => setSliders(prev => ({ ...prev, [axis.id]: step }))}
                          className="flex flex-col items-center gap-1 z-10 w-10"
                          aria-label={scaleLabels[i]}
                          aria-pressed={isSelected}
                        >
                          <span
                            className={`rounded-full transition-all duration-200 ${
                              isSelected
                                ? 'w-5 h-5 bg-mint-deep border-2 border-white shadow-md ring-2 ring-mint-deep/30'
                                : 'w-3 h-3 bg-white border-2 border-slate-300 hover:border-mint-deep hover:scale-110'
                            }`}
                          />
                          <span
                            className={`text-[9px] font-bold leading-none ${
                              isSelected ? 'text-mint-deep' : 'text-slate-500'
                            }`}
                          >
                            {scaleLabels[i]}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 동행 유형 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 mb-4">
        <h2 className="text-xs font-black text-slate-700 mb-3">
          👣 {t('slider.companion')}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {COMPANION_OPTIONS.map(opt => {
            const isActive = companion === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setCompanion(isActive ? null : opt.id)}
                className={`flex flex-col items-center gap-0.5 py-3 rounded-xl border-2 font-black text-[11px] transition-all ${
                  isActive
                    ? 'bg-mint-deep text-white border-mint-deep scale-[1.03] shadow-md'
                    : 'bg-white text-slate-500 border-slate-100 hover:border-mint-deep/40'
                }`}
              >
                <span className="text-xl">{opt.icon}</span>
                <span>{getI18n(opt.label, locale)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 실시간 매칭 — 전체 너비 인라인 */}
      <div className="bg-gradient-to-br from-mint-deep/5 to-sky/5 rounded-2xl border-2 border-mint-deep/20 shadow-sm p-4 md:p-5 mb-6">
        <h2 className="text-xs font-black text-slate-700 mb-4">
          🏙️ {t('slider.liveMatch')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 items-center">
          {/* 왼쪽: 레이더 차트 */}
          {topCityRadar.length > 0 ? (
            <div className="flex flex-col items-center">
              <RadarChart
                axes={userRadar}
                overlayAxes={topCityRadar}
                size={220}
                showLabels
                legend={{
                  primary: t('radar.myStyle'),
                  overlay: cityName(top3[0].city, locale),
                }}
              />
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-xs text-slate-500 font-bold">
              ...
            </div>
          )}

          {/* 오른쪽: TOP 3 바 차트 */}
          <div className="space-y-3">
            {top3.map((c, i) => {
              const tags = getTopMatchedTags(c.city, preference).slice(0, 2)
              const width = Math.max(10, Math.min(100, c.matchPercent))
              return (
                <div key={c.city} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-black text-slate-700">
                      {medal[i]} {cityName(c.city, locale)}
                    </span>
                    <span className="font-black text-mint-deep text-base">{c.matchPercent}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColors[i]} transition-all duration-500 rounded-full`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  {tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold text-mint-deep bg-mint-deep/10 px-2 py-0.5 rounded-full"
                        >
                          #{getTagLabel(tag, locale)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-br from-mint-deep to-sky text-white font-black text-sm hover:opacity-90 transition-opacity shadow-lg"
        >
          <Sparkles className="w-4 h-4" /> {t('slider.submit')}
        </button>
        <button
          onClick={onSkip}
          className="text-xs text-slate-500 hover:text-slate-600 underline underline-offset-2 transition-colors"
        >
          {t('slider.skip')} →
        </button>
      </div>

    </div>
  )
}
