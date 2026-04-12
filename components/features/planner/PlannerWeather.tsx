'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { getCityWeather, type WeatherCondition } from '@/lib/data/city-weather-mock'

interface PlannerWeatherProps {
  cityId: string
  dates: string[]          // ['2026-04-23', '2026-04-24'...] — 플랜 날짜 배열
}

function tempTone(high: number): { bg: string; border: string; text: string } {
  if (high <= 14) {
    return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' }
  }
  if (high >= 23) {
    return { bg: 'bg-mint-light', border: 'border-mint', text: 'text-blossom-deep' }
  }
  return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' }
}

const WEEKDAY: Record<string, { ko: string; ja: string; en: string }> = {
  '0': { ko: '일', ja: '日', en: 'Sun' },
  '1': { ko: '월', ja: '月', en: 'Mon' },
  '2': { ko: '화', ja: '火', en: 'Tue' },
  '3': { ko: '수', ja: '水', en: 'Wed' },
  '4': { ko: '목', ja: '木', en: 'Thu' },
  '5': { ko: '금', ja: '金', en: 'Fri' },
  '6': { ko: '토', ja: '土', en: 'Sat' },
}

function formatDateLabel(dateStr: string, locale: string): string {
  const d = new Date(dateStr)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const dayKey = String(d.getDay())
  const weekday = WEEKDAY[dayKey]?.[locale as 'ko' | 'ja' | 'en'] ?? WEEKDAY[dayKey]?.ko ?? ''
  if (locale === 'en') return `${month}/${day} (${weekday})`
  if (locale === 'ja') return `${month}月${day}日 (${weekday})`
  return `${month}월 ${day}일 (${weekday})`
}

export function PlannerWeather({ cityId, dates }: PlannerWeatherProps) {
  const t = useTranslations('planner')

  const weather = useMemo(() => {
    if (dates.length === 0) return []
    const sorted = [...dates].sort()
    const startDate = sorted[0]
    return getCityWeather(cityId, startDate, Math.max(1, sorted.length))
  }, [cityId, dates])

  // 현재 locale 추출용 (useTranslations는 locale을 직접 주지 않으므로 브라우저 경로에서 읽음)
  const locale =
    typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'ko' : 'ko'

  if (weather.length === 0) return null

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E4E7EB]/40 h-full">
      <p className="text-[10px] font-black text-[#9DD8CE] uppercase tracking-widest mb-3">
        🌤️ {t('weather.title')}
      </p>

      <div className="space-y-2">
        {weather.map((w) => {
          const tone = tempTone(w.highTemp)
          const conditionLabel = t(
            `weather.${w.condition}` as Parameters<typeof t>[0]
          )
          return (
            <div
              key={w.date}
              className={`rounded-xl p-3 border ${tone.bg} ${tone.border}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs font-bold text-[#111]">
                  📅 {formatDateLabel(w.date, locale)}
                </p>
                <span className="text-2xl leading-none">{w.icon}</span>
              </div>
              <p className={`text-xs font-semibold mb-1 ${tone.text}`}>
                {conditionLabel as string}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-[#374151]">
                <span>
                  🌡️ <span className="font-bold">{w.lowTemp}°</span> ~{' '}
                  <span className="font-bold">{w.highTemp}°</span>
                </span>
                <span>💧 {w.humidity}%</span>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-[9px] text-[#9CA3AF] mt-3 text-center leading-relaxed">
        {t('weather.disclaimer')}
      </p>
    </div>
  )
}
