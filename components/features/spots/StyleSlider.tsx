'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'
import {
  SLIDER_AXES,
  COMPANION_OPTIONS,
  sliderToPreference,
  calculateCityScores,
  CITY_TAG_SCORES,
} from '@/lib/curation/scoring'
import { preferenceToRadar, cityToRadar, type RadarLabels } from '@/lib/curation/radar'
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

const CITY_NAMES: Record<string, Record<string, string>> = {
  jeonju:    { ko: '전주', en: 'Jeonju', ja: '全州', 'zh-CN': '全州', 'zh-TW': '全州' },
  gyeongju:  { ko: '경주', en: 'Gyeongju', ja: '慶州', 'zh-CN': '庆州', 'zh-TW': '慶州' },
  busan:     { ko: '부산', en: 'Busan', ja: '釜山', 'zh-CN': '釜山', 'zh-TW': '釜山' },
  seoul:     { ko: '서울', en: 'Seoul', ja: 'ソウル', 'zh-CN': '首尔', 'zh-TW': '首爾' },
  jeju:      { ko: '제주', en: 'Jeju', ja: '済州', 'zh-CN': '济州', 'zh-TW': '濟州' },
  tongyeong: { ko: '통영', en: 'Tongyeong', ja: '統営', 'zh-CN': '统营', 'zh-TW': '統營' },
  cheonan:   { ko: '천안', en: 'Cheonan', ja: '天安', 'zh-CN': '天安', 'zh-TW': '天安' },
  yongin:    { ko: '용인', en: 'Yongin', ja: '龍仁', 'zh-CN': '龙仁', 'zh-TW': '龍仁' },
  icheon:    { ko: '이천', en: 'Icheon', ja: '利川', 'zh-CN': '利川', 'zh-TW': '利川' },
}

function cityName(code: string, locale: string): string {
  return CITY_NAMES[code]?.[locale] || CITY_NAMES[code]?.ko || code
}

function topTagsForCity(city: string, preference: UserPreference, n = 2): string[] {
  const cityTags = CITY_TAG_SCORES[city] || {}
  const matched: Array<{ tag: string; score: number }> = []
  for (const [tag, userWeight] of Object.entries(preference.tags)) {
    const cityWeight = cityTags[tag] || 0
    const score = userWeight * cityWeight
    if (score > 0) matched.push({ tag, score })
  }
  return matched
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map(m => m.tag)
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

  const radarLabels: RadarLabels = {
    tradition: t('radar.tradition'),
    nature: t('radar.nature'),
    experience: t('radar.experience'),
    active: t('radar.active'),
    nightlife: t('radar.nightlife'),
  }
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
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 pb-40">
      {/* 헤더 */}
      <div className="text-center mb-10">
        <div className="text-4xl mb-3">🎯</div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-3">
          {t('slider.title')}
        </h1>
        <p className="text-sm text-slate-500 font-bold">{t('slider.subtitle')}</p>
      </div>

      {/* 여행 성향 슬라이더 9개 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 md:p-7 mb-6">
        <h2 className="text-sm font-black text-slate-700 mb-5">
          🧭 {t('slider.travelStyle')}
        </h2>
        <div className="space-y-5">
          {SLIDER_AXES.map(axis => {
            const value = sliders[axis.id] ?? 0
            return (
              <div key={axis.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="text-base">{axis.left.icon}</span>
                    {getI18n(axis.left.label, locale)}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    {getI18n(axis.right.label, locale)}
                    <span className="text-base">{axis.right.icon}</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  step={5}
                  value={value}
                  onChange={e => setSliders(prev => ({ ...prev, [axis.id]: Number(e.target.value) }))}
                  className="lok-slider w-full h-10 appearance-none bg-transparent cursor-pointer"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* 동행 유형 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 md:p-7 mb-6">
        <h2 className="text-sm font-black text-slate-700 mb-4">
          👣 {t('slider.companion')}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {COMPANION_OPTIONS.map(opt => {
            const isActive = companion === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setCompanion(isActive ? null : opt.id)}
                className={`flex flex-col items-center gap-1 py-4 rounded-2xl border-2 font-black text-xs transition-all ${
                  isActive
                    ? 'bg-mint-deep text-white border-mint-deep scale-105 shadow-md'
                    : 'bg-white text-slate-500 border-slate-100 hover:border-mint-deep/40'
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span>{getI18n(opt.label, locale)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col items-center gap-3 mt-8">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-br from-mint-deep to-sky text-white font-black text-sm hover:opacity-90 transition-opacity shadow-lg"
        >
          <Sparkles className="w-4 h-4" /> {t('slider.submit')}
        </button>
        <button
          onClick={onSkip}
          className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
        >
          {t('slider.skip')} →
        </button>
      </div>

      {/* 실시간 매칭 프리뷰 (sticky bottom) */}
      <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-80 bg-white rounded-2xl border border-mint-deep/30 shadow-xl p-4 z-40">
        <h3 className="text-xs font-black text-slate-700 mb-3 flex items-center gap-1.5">
          🏙️ {t('slider.liveMatch')}
        </h3>
        <div className="space-y-2.5">
          {top3.map((c, i) => {
            const tags = topTagsForCity(c.city, preference)
            const width = Math.max(10, Math.min(100, c.matchPercent))
            return (
              <div key={c.city} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-700">
                    {medal[i]} {cityName(c.city, locale)}
                  </span>
                  <span className="font-black text-mint-deep">{c.matchPercent}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColors[i]} transition-all duration-500`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                {tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 미니 레이더 (1위 도시 겹치기) */}
        {topCityRadar.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-center">
            <RadarChart
              axes={userRadar}
              overlayAxes={topCityRadar}
              size={140}
              showLabels={false}
            />
          </div>
        )}
      </div>

      {/* 슬라이더 커스텀 스타일 */}
      <style jsx>{`
        .lok-slider::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 9999px;
          background: linear-gradient(to right, #F0B8B8 0%, #E5E7EB 50%, #8EDACB 100%);
        }
        .lok-slider::-moz-range-track {
          height: 8px;
          border-radius: 9999px;
          background: linear-gradient(to right, #F0B8B8 0%, #E5E7EB 50%, #8EDACB 100%);
        }
        .lok-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: white;
          border: 2px solid #5BBDAD;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          cursor: pointer;
          margin-top: -8px;
          transition: transform 0.15s ease;
        }
        .lok-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .lok-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: white;
          border: 2px solid #5BBDAD;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .lok-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}
