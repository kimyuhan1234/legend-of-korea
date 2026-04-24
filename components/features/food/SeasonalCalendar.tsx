'use client'

import type { Season } from '@/lib/data/food-seasonal'
import { seasonalCalendar, SEASON_META } from '@/lib/data/food-seasonal'

interface SeasonalCalendarProps {
  locale: string
  currentMonth: number
  onMonthSelect?: (season: Season) => void
}

const UI: Record<string, {
  title: string
  monthLabel: (m: number) => string
  now: string
  tip: string
}> = {
  ko: {
    title: '📅 12개월 제철 달력',
    monthLabel: (m) => `${m}월`,
    now: '오늘',
    tip: '월을 클릭하면 해당 계절의 음식으로 이동합니다.',
  },
  ja: {
    title: '📅 12ヶ月の旬カレンダー',
    monthLabel: (m) => `${m}月`,
    now: '今月',
    tip: '月をクリックするとその季節の料理に移動します。',
  },
  en: {
    title: '📅 12-Month Seasonal Calendar',
    monthLabel: (m) => `${m}月`,
    now: 'Now',
    tip: 'Click a month to jump to that season.',
  },
  'zh-CN': {
    title: '📅 12个月时令日历',
    monthLabel: (m) => `${m}月`,
    now: '本月',
    tip: '点击月份跳转到对应季节。',
  },
  'zh-TW': {
    title: '📅 12個月時令日曆',
    monthLabel: (m) => `${m}月`,
    now: '本月',
    tip: '點擊月份跳轉到對應季節。',
  },
}

const MONTH_LABELS: Record<string, string[]> = {
  ko: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  ja: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  'zh-CN': ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  'zh-TW': ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
}

function monthToSeason(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

export function SeasonalCalendar({ locale, currentMonth, onMonthSelect }: SeasonalCalendarProps) {
  const ui = UI[locale] ?? UI.en
  const monthLabels = MONTH_LABELS[locale] ?? MONTH_LABELS.en

  return (
    <div className="bg-white rounded-3xl border border-mist p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-base font-black text-[#111]">{ui.title}</h2>
        <p className="text-[11px] text-stone">{ui.tip}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
          const isNow = month === currentMonth
          const season = monthToSeason(month)
          const seasonMeta = SEASON_META[season]
          const ingredients = seasonalCalendar[month] ?? []

          return (
            <button
              key={month}
              type="button"
              onClick={() => onMonthSelect?.(season)}
              className={`text-left rounded-2xl p-3 transition-all border ${
                isNow
                  ? 'bg-gradient-to-br ' + seasonMeta.gradientFrom + ' ' + seasonMeta.gradientTo + ' border-mint-deep shadow-md ring-2 ring-mint-deep/40'
                  : 'bg-cloud border-transparent hover:border-mist hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-black ${isNow ? seasonMeta.color : 'text-[#111]'}`}>
                  {seasonMeta.emoji} {monthLabels[month - 1]}
                </span>
                {isNow && (
                  <span className="text-[10px] font-black bg-mint-deep text-white rounded-full px-2 py-0.5">
                    {ui.now}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {ingredients.map((ing) => (
                  <span
                    key={ing.name}
                    className={`text-[10px] rounded-full px-2 py-0.5 font-medium ${
                      isNow ? 'bg-white/80 text-slate-700' : 'bg-white text-stone'
                    }`}
                  >
                    {ing.emoji} {ing.name}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
