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
        <div className="space-y-4">
          {SLIDER_AXES.map(axis => {
            const value = sliders[axis.id] ?? 0
            const scaleLabels = SCALE_LABELS[locale] ?? SCALE_LABELS.ko
            return (
              <div key={axis.id} className="space-y-0.5">
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
                <input
                  type="range"
                  min={-100}
                  max={100}
                  step={5}
                  value={value}
                  onChange={e => setSliders(prev => ({ ...prev, [axis.id]: Number(e.target.value) }))}
                  className="lok-slider w-full h-7 appearance-none bg-transparent cursor-pointer"
                />
                {/* 구간 마커 5단계 */}
                <div className="flex justify-between px-[10px]">
                  {scaleLabels.map((label, i) => {
                    const isCenter = i === 2
                    return (
                      <div key={i} className="flex flex-col items-center gap-0.5">
                        <div
                          className={`rounded-full ${
                            isCenter ? 'w-2 h-2 bg-slate-400' : 'w-1.5 h-1.5 bg-slate-300'
                          }`}
                        />
                        <span className="text-[8px] text-slate-400 font-medium leading-none">
                          {label}
                        </span>
                      </div>
                    )
                  })}
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
            <div className="h-[220px] flex items-center justify-center text-xs text-slate-400 font-bold">
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
          className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
        >
          {t('slider.skip')} →
        </button>
      </div>

      {/* 슬라이더 커스텀 스타일 */}
      <style jsx>{`
        .lok-slider::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 9999px;
          background: linear-gradient(to right, #F0B8B8 0%, #E5E7EB 50%, #8EDACB 100%);
        }
        .lok-slider::-moz-range-track {
          height: 6px;
          border-radius: 9999px;
          background: linear-gradient(to right, #F0B8B8 0%, #E5E7EB 50%, #8EDACB 100%);
        }
        .lok-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: white;
          border: 2px solid #5BBDAD;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          cursor: pointer;
          margin-top: -7px;
          transition: transform 0.15s ease;
        }
        .lok-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .lok-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: white;
          border: 2px solid #5BBDAD;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .lok-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  )
}
