'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getCityWeather, type CityWeatherDay } from '@/lib/data/city-weather-mock'
import { PassRequiredModal } from '@/components/shared/PassRequiredModal'

interface OotdCheckedItem {
  name: string
  icon: string
}

interface OotdPlanItem {
  id: string
  item_data: {
    date?: string
    checkedItems?: OotdCheckedItem[]
  }
}

interface PlannerOotdProps {
  cityId: string
  locale: string
  startDate: string
  endDate: string
  existingOotd: OotdPlanItem[]
}

interface RecommendationItem {
  icon: string
  name: string
}

function recommendFor(day: CityWeatherDay): RecommendationItem[] {
  const items: RecommendationItem[] = []
  const high = day.highTemp
  const isRainy = day.condition === 'rainy' || day.condition === 'thunderstorm'
  const isCold = high <= 15
  const isWarm = high >= 22
  const isWindy = day.condition === 'windy'

  // 상의
  if (isCold) items.push({ icon: '🧥', name: '가벼운 자켓' })
  else if (isWarm) items.push({ icon: '👕', name: '반팔 티셔츠' })
  else items.push({ icon: '👔', name: '얇은 긴팔' })

  // 하의
  if (isCold) items.push({ icon: '👖', name: '긴바지' })
  else if (isWarm) items.push({ icon: '🩳', name: '면바지' })
  else items.push({ icon: '👖', name: '슬랙스' })

  // 신발 — 걸음 많은 여행 기본
  items.push({ icon: '👟', name: '운동화' })

  // 우산/바람막이
  if (isRainy) items.push({ icon: '☂️', name: '우산' })
  else if (isWindy) items.push({ icon: '🧢', name: '바람막이' })

  return items
}

function formatDateLabel(dateStr: string, locale: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const month = d.getMonth() + 1
  const day = d.getDate()
  if (locale === 'en') return `${month}/${day}`
  if (locale === 'ja') return `${month}月${day}日`
  return `${month}월 ${day}일`
}

function diffDays(a: string, b: string): number {
  if (!a || !b) return 0
  const s = new Date(a)
  const e = new Date(b)
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / 86400000))
}

export function PlannerOotd({
  cityId,
  locale,
  startDate,
  endDate,
  existingOotd,
}: PlannerOotdProps) {
  const t = useTranslations('planner')
  const [addingDate, setAddingDate] = useState<string | null>(null)
  const [addedDates, setAddedDates] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [showPassModal, setShowPassModal] = useState(false)

  // 이미 담은 OOTD 날짜들
  const existingDates = useMemo(
    () =>
      new Set(
        existingOotd
          .map((o) => o.item_data?.date)
          .filter((d): d is string => typeof d === 'string')
      ),
    [existingOotd]
  )

  // 여행 기간이 있으면 해당 기간, 없으면 오늘 1일
  const weatherDays = useMemo(() => {
    if (startDate && endDate) {
      const nights = diffDays(startDate, endDate)
      return getCityWeather(cityId, startDate, Math.max(1, nights + 1))
    }
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    return getCityWeather(cityId, `${y}-${m}-${d}`, 1)
  }, [cityId, startDate, endDate])

  const handleAdd = async (day: CityWeatherDay) => {
    setError(null)
    setAddingDate(day.date)
    try {
      const items = recommendFor(day)
      const isRainy = day.condition === 'rainy' || day.condition === 'thunderstorm'
      const res = await fetch('/api/planner/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'ootd',
          cityId,
          itemData: {
            date: day.date,
            checkedItems: items,
            weather: day.condition,
            highTemp: day.highTemp,
            lowTemp: day.lowTemp,
            memo: isRainy ? t('ootd.rainNote') : undefined,
            source: 'weather-auto',
          },
        }),
      })
      if (res.status === 403) {
        setShowPassModal(true)
        return
      }
      if (!res.ok) {
        setError(t('ootd.addFailed'))
        return
      }
      setAddedDates((prev) => new Set(prev).add(day.date))
      window.dispatchEvent(new Event('planner:refresh'))
    } catch {
      setError(t('ootd.addFailed'))
    } finally {
      setAddingDate(null)
    }
  }

  // Case A: 이미 담은 OOTD가 있는 경우 — 해당 날짜들 표시
  const hasExisting = existingOotd.length > 0

  return (
    <>
      {showPassModal && (
        <PassRequiredModal
          locale={locale}
          passId="live"
          onClose={() => setShowPassModal(false)}
        />
      )}
      <div className="bg-pink-50 rounded-2xl p-5 border border-pink-200 h-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black text-pink-700 uppercase tracking-widest">
          👗 {t('ootd.title')}
        </p>
        <Link
          href={`/${locale}/ootd`}
          className="text-[10px] font-bold text-pink-700 hover:underline"
        >
          {hasExisting ? t('ootd.change') : t('ootd.goChoose')} →
        </Link>
      </div>

      {hasExisting ? (
        // Case A — 이미 담은 옷 표시
        <div className="space-y-3">
          {existingOotd.map((o) => {
            const date = typeof o.item_data?.date === 'string' ? o.item_data.date : ''
            const items = (o.item_data?.checkedItems as OotdCheckedItem[]) || []
            return (
              <div key={o.id}>
                {date && (
                  <p className="text-[11px] font-bold text-pink-700 mb-1.5">
                    📅 {formatDateLabel(date, locale)}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {items.length > 0 ? (
                    items.map((ci, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-pink-200 text-xs font-semibold text-[#374151]"
                      >
                        <span>{ci.icon}</span>
                        <span>{ci.name}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone">—</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // Case B — 날씨 기반 추천
        <div className="space-y-3">
          <p className="text-[11px] text-pink-900/80">{t('ootd.basedOn')}</p>
          {weatherDays.map((day) => {
            const recs = recommendFor(day)
            const isRainy = day.condition === 'rainy' || day.condition === 'thunderstorm'
            const alreadyAdded =
              existingDates.has(day.date) || addedDates.has(day.date)
            return (
              <div
                key={day.date}
                className="rounded-xl bg-white border border-pink-200 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold text-[#111]">
                    📅 {formatDateLabel(day.date, locale)}
                  </p>
                  <span className="text-[11px] text-[#6B7280]">
                    {day.icon} {day.highTemp}° / {day.lowTemp}°
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {recs.map((r, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-[11px] font-semibold text-[#374151]"
                    >
                      <span>{r.icon}</span>
                      <span>{r.name}</span>
                    </span>
                  ))}
                </div>
                {isRainy && (
                  <p className="text-[10px] text-pink-700 font-bold mb-2">
                    ☔ {t('ootd.rainNote')}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={alreadyAdded || addingDate === day.date}
                    onClick={() => handleAdd(day)}
                    className={`flex-1 px-3 py-2 rounded-full border-2 text-[11px] font-bold transition-colors ${
                      alreadyAdded
                        ? 'border-emerald-400 text-emerald-600 bg-emerald-50 cursor-default'
                        : addingDate === day.date
                          ? 'border-pink-300 text-pink-400 cursor-wait'
                          : 'border-pink-500 text-pink-700 bg-white hover:bg-pink-50'
                    }`}
                  >
                    {alreadyAdded
                      ? t('ootd.added')
                      : addingDate === day.date
                        ? t('ootd.adding')
                        : t('ootd.addThis')}
                  </button>
                  <Link
                    href={`/${locale}/ootd`}
                    className="px-3 py-2 rounded-full text-[11px] font-bold text-pink-700 hover:underline"
                  >
                    {t('ootd.goChoose')} →
                  </Link>
                </div>
              </div>
            )
          })}
          {error && (
            <p className="text-[10px] text-red-500 text-center">{error}</p>
          )}
        </div>
      )}
    </div>
    </>
  )
}
