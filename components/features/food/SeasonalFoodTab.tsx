'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import type { Season, SeasonalFood } from '@/lib/data/food-seasonal'
import { SEASON_META } from '@/lib/data/food-seasonal'
import { SeasonalFoodCard } from './SeasonalFoodCard'
import { SeasonalCalendar } from './SeasonalCalendar'

interface SeasonalFoodTabProps {
  locale: string
  foods: SeasonalFood[]
  season: Season
}

const UI: Record<string, {
  count: (n: number) => string
  calendarOpen: string
  calendarClose: string
  empty: string
  back: string
}> = {
  ko: {
    count: (n) => `총 ${n}개 제철 음식`,
    calendarOpen: '📅 12개월 달력 보기',
    calendarClose: '📅 달력 접기',
    empty: '이 계절에 준비된 음식이 아직 없습니다.',
    back: '← 다른 계절',
  },
  ja: {
    count: (n) => `全${n}品の旬料理`,
    calendarOpen: '📅 12ヶ月カレンダーを見る',
    calendarClose: '📅 カレンダーを閉じる',
    empty: 'この季節の料理はまだ準備中です。',
    back: '← 他の季節',
  },
  en: {
    count: (n) => `${n} seasonal dishes`,
    calendarOpen: '📅 Open 12-month calendar',
    calendarClose: '📅 Close calendar',
    empty: 'No dishes available for this season yet.',
    back: '← Other seasons',
  },
  'zh-CN': {
    count: (n) => `共${n}道时令料理`,
    calendarOpen: '📅 查看12个月日历',
    calendarClose: '📅 收起日历',
    empty: '此季节暂无料理。',
    back: '← 其他季节',
  },
  'zh-TW': {
    count: (n) => `共${n}道時令料理`,
    calendarOpen: '📅 查看12個月日曆',
    calendarClose: '📅 收起日曆',
    empty: '此季節暫無料理。',
    back: '← 其他季節',
  },
}

export function SeasonalFoodTab({ locale, foods, season }: SeasonalFoodTabProps) {
  const [activeSeason, setActiveSeason] = useState<Season>(season)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const ui = UI[locale] ?? UI.en
  const currentMonth = new Date().getMonth() + 1

  const filtered = useMemo(
    () => foods.filter((f) => f.season === activeSeason),
    [foods, activeSeason],
  )

  const activeMeta = SEASON_META[activeSeason]

  function handleMonthSelect(s: Season) {
    setActiveSeason(s)
    setCalendarOpen(false)
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-6">
      {/* 다른 계절로 돌아가기 */}
      <div className="flex justify-between items-center">
        <Link
          href={`/${locale}/food/seasonal`}
          className="inline-flex items-center text-sm font-bold text-stone hover:text-ink transition-colors"
        >
          {ui.back}
        </Link>
      </div>

      {/* 계절 헤드라인 */}
      <div className={`bg-gradient-to-br ${activeMeta.gradientFrom} ${activeMeta.gradientTo} rounded-3xl p-6 md:p-8 border border-white/60`}>
        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${activeMeta.color}`}>
          {activeMeta.label[locale as keyof typeof activeMeta.label] ?? activeMeta.label.en} · {activeMeta.months}
        </p>
        <h2 className="text-xl md:text-2xl font-black text-[#111] mb-1 leading-snug">
          {activeMeta.headline[locale as keyof typeof activeMeta.headline] ?? activeMeta.headline.en}
        </h2>
        <p className="text-xs text-slate-700 mt-2">{ui.count(filtered.length)}</p>
      </div>

      {/* 달력 토글 */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setCalendarOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-mist text-sm font-bold text-[#111] hover:border-mint-deep hover:text-mint-deep transition-colors"
        >
          {calendarOpen ? ui.calendarClose : ui.calendarOpen}
        </button>
      </div>

      {/* 달력 */}
      {calendarOpen && (
        <SeasonalCalendar
          locale={locale}
          currentMonth={currentMonth}
          onMonthSelect={handleMonthSelect}
        />
      )}

      {/* 카드 그리드 */}
      <div ref={gridRef} className="scroll-mt-32">
        {filtered.length === 0 ? (
          <p className="text-center text-stone py-12">{ui.empty}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((food) => (
              <SeasonalFoodCard key={food.id} food={food} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
