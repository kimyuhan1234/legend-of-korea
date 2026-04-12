'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { PlannerWeather } from './PlannerWeather'
import { getCityWeather, type CityWeatherDay } from '@/lib/data/city-weather-mock'
import type { TripStyle } from './PlannerTripSetup'

interface CourseMission {
  id: string
  course_id: string
  sequence: number
  type: string
  title: { ko?: string; ja?: string; en?: string } | null
  description: { ko?: string; ja?: string; en?: string } | null
  location_name: { ko?: string; ja?: string; en?: string } | null
  latitude: number | null
  longitude: number | null
  lp_reward: number
}

function i18nText(
  field: { ko?: string; ja?: string; en?: string } | null,
  locale: string
): string {
  if (!field) return ''
  return field[locale as 'ko' | 'ja' | 'en'] || field.ko || ''
}

type ItemType = 'food' | 'stay' | 'diy' | 'quest' | 'ootd' | 'goods' | 'transport' | 'surprise'

interface PlanItem {
  id: string
  item_type: ItemType
  item_data: Record<string, unknown>
}

interface PlannerFinalPlanProps {
  items: PlanItem[]
  locale: string
  hasMissionKit: boolean
  cityId: string
  tripStartDate?: string
  tripEndDate?: string
  tripStyle?: TripStyle
  ootdSlot?: ReactNode
  onCreditsChanged?: () => void
}

const MAX_MISSIONS_PER_DAY: Record<TripStyle, number> = {
  relaxed: 3,
  active: 5,
  full: 999,
}

function tripDateRange(start: string, end: string): string[] {
  if (!start || !end) return []
  const s = new Date(start)
  const e = new Date(end)
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return []
  const dates: string[] = []
  const cur = new Date(s)
  while (cur.getTime() <= e.getTime()) {
    const y = cur.getFullYear()
    const m = String(cur.getMonth() + 1).padStart(2, '0')
    const d = String(cur.getDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${d}`)
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

const TYPE_EMOJI: Record<ItemType, string> = {
  food: '🍜', stay: '🏯', quest: '⚔️', diy: '🏺',
  ootd: '👗', goods: '🛍️', transport: '🚄', surprise: '🎁',
}

// 아이템명 추출 (i18n 객체 / 문자열 / 번역키 모두 대응)
function itemName(item: PlanItem, locale: string): string {
  const data = item.item_data
  const name = data.name as Record<string, string> | string | undefined
  if (typeof name === 'string') return name
  if (name && typeof name === 'object') return name[locale] || name.ko || 'Item'
  if (data.kitName) return String(data.kitName)
  if (data.productName) return String(data.productName)
  return 'Item'
}

// 음식/스팟 아이템이 사이트인지 식당인지 추정 (kind 필드 또는 이름 키워드)
function isSightLike(item: PlanItem): boolean {
  const data = item.item_data
  if (data.kind === 'sight') return true
  const name = itemName(item, 'ko').toLowerCase()
  return (
    name.includes('한옥') ||
    name.includes('성당') ||
    name.includes('마을') ||
    name.includes('광장') ||
    name.includes('거리') ||
    name.includes('축제') ||
    name.includes('전망')
  )
}

function isNightMarketLike(item: PlanItem): boolean {
  const name = itemName(item, 'ko').toLowerCase()
  return name.includes('야시장') || name.includes('night')
}

interface TimeSlot {
  label: string
  timeRange: string
  emoji: string
  items: PlanItem[]
}

// 스마트 스케줄링 알고리즘
function buildSchedule(
  items: PlanItem[],
  t: (key: string) => string
): { slots: TimeSlot[]; unscheduled: PlanItem[] } {
  const foods: PlanItem[] = []
  const sights: PlanItem[] = []
  const nightMarkets: PlanItem[] = []
  const diys: PlanItem[] = []
  const quests: PlanItem[] = []
  const goods: PlanItem[] = []
  const surprises: PlanItem[] = []

  for (const item of items) {
    if (item.item_type === 'food') {
      if (isNightMarketLike(item)) nightMarkets.push(item)
      else if (isSightLike(item)) sights.push(item)
      else foods.push(item)
    } else if (item.item_type === 'diy') diys.push(item)
    else if (item.item_type === 'quest') quests.push(item)
    else if (item.item_type === 'goods') goods.push(item)
    else if (item.item_type === 'surprise') surprises.push(item)
  }

  // 각 슬롯에 배치 (합리적인 여행자 일정)
  const morning: PlanItem[] = []
  const lunch: PlanItem[] = []
  const afternoon: PlanItem[] = []
  const dinner: PlanItem[] = []
  const night: PlanItem[] = []

  // 오전: 첫 미션 + 첫 사이트
  if (quests[0]) morning.push(quests.shift()!)
  if (sights[0]) morning.push(sights.shift()!)

  // 점심: 첫 식당
  if (foods[0]) lunch.push(foods.shift()!)

  // 오후: 남은 미션 + DIY 하나 + 남은 사이트
  while (quests.length > 0) afternoon.push(quests.shift()!)
  if (diys[0]) afternoon.push(diys.shift()!)
  while (sights.length > 0) afternoon.push(sights.shift()!)
  // DIY 여러 개면 오후에 몰기
  while (diys.length > 0) afternoon.push(diys.shift()!)
  // 서프라이즈는 오후에
  while (surprises.length > 0) afternoon.push(surprises.shift()!)

  // 저녁: 저녁 식당
  if (foods[0]) dinner.push(foods.shift()!)

  // 밤: 야시장 + 남은 음식 + 굿즈쇼핑
  while (nightMarkets.length > 0) night.push(nightMarkets.shift()!)
  while (foods.length > 0) night.push(foods.shift()!)
  while (goods.length > 0) night.push(goods.shift()!)

  const slots: TimeSlot[] = [
    { label: t('final.morning'), timeRange: '09:00 – 12:00', emoji: '🌅', items: morning },
    { label: t('final.lunch'), timeRange: '12:00 – 14:00', emoji: '🍽️', items: lunch },
    { label: t('final.afternoon'), timeRange: '14:00 – 18:00', emoji: '☀️', items: afternoon },
    { label: t('final.dinner'), timeRange: '18:00 – 20:00', emoji: '🌆', items: dinner },
    { label: t('final.night'), timeRange: '20:00 – 22:00', emoji: '🌙', items: night },
  ]

  return { slots, unscheduled: [] }
}

export function PlannerFinalPlan({
  items,
  locale,
  hasMissionKit,
  cityId,
  tripStartDate,
  tripEndDate,
  tripStyle = 'active',
  ootdSlot,
  onCreditsChanged,
}: PlannerFinalPlanProps) {
  const t = useTranslations('planner')
  const [pdfState, setPdfState] = useState<'idle' | 'charging' | 'insufficient' | 'error'>('idle')

  // OOTD, transport, stay는 별도로 처리
  const ootdItems = items.filter((i) => i.item_type === 'ootd')
  const stayItems = items.filter((i) => i.item_type === 'stay')
  const transportItems = items.filter((i) => i.item_type === 'transport')
  const questItems = items.filter((i) => i.item_type === 'quest')
  // quest 아이템은 미션으로 펼칠 것이므로 scheduler에서 제외
  const schedulableItems = items.filter(
    (i) => !['ootd', 'stay', 'transport', 'quest'].includes(i.item_type)
  )

  // 여행 날짜 범위
  const dayDates = tripDateRange(tripStartDate ?? '', tripEndDate ?? '')
  const numDays = Math.max(1, dayDates.length)

  // 각 날짜별 날씨
  const dayWeather: CityWeatherDay[] = dayDates.length > 0
    ? getCityWeather(cityId, dayDates[0], dayDates.length)
    : []

  // quest 아이템의 courseId별 미션 목록 fetch
  const [missionsByCourse, setMissionsByCourse] = useState<Record<string, CourseMission[]>>({})

  useEffect(() => {
    let mounted = true
    const courseIds = Array.from(
      new Set(
        questItems
          .map((q) => q.item_data.courseId)
          .filter((id): id is string => typeof id === 'string')
      )
    )
    if (courseIds.length === 0) return

    async function loadMissions() {
      const results: Record<string, CourseMission[]> = {}
      for (const courseId of courseIds) {
        try {
          const res = await fetch(`/api/planner/course-missions?courseId=${courseId}`)
          if (res.ok) {
            const data = await res.json()
            results[courseId] = data.missions ?? []
          }
        } catch {
          // ignore
        }
      }
      if (mounted) setMissionsByCourse(results)
    }

    loadMissions()
    return () => { mounted = false }
    // questItems의 id 목록이 바뀔 때만 재조회
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questItems.map((q) => q.id).join(',')])

  // 모든 미션을 sequence 순으로 펼침
  const allMissions: CourseMission[] = questItems.flatMap((q) => {
    const courseId = q.item_data.courseId as string | undefined
    if (!courseId) return []
    return missionsByCourse[courseId] ?? []
  })

  // 여행 스타일별 하루 최대 미션 수
  const maxMissionsPerDay = MAX_MISSIONS_PER_DAY[tripStyle]

  // 미션을 numDays에 맞춰 분배 (스타일의 최대치까지)
  const missionsPerDay = Math.min(
    maxMissionsPerDay,
    Math.max(1, Math.ceil(allMissions.length / numDays))
  )

  // Day별 미션 배열
  const dayMissions: CourseMission[][] = []
  for (let d = 0; d < numDays; d++) {
    const start = d * missionsPerDay
    const end = Math.min(start + missionsPerDay, allMissions.length)
    dayMissions.push(allMissions.slice(start, end))
  }

  // 하루 안의 미션을 오전/오후/저녁에 분배 (40/40/20)
  function splitInDay(missions: CourseMission[]) {
    const total = missions.length
    if (total === 0) return { morning: [], afternoon: [], evening: [] as CourseMission[] }
    const morningCount = Math.max(1, Math.ceil(total * 0.4))
    const afternoonCount = Math.max(
      total - morningCount > 0 ? 1 : 0,
      Math.ceil(total * 0.4)
    )
    return {
      morning: missions.slice(0, morningCount),
      afternoon: missions.slice(morningCount, morningCount + afternoonCount),
      evening: missions.slice(morningCount + afternoonCount),
    }
  }

  // 일반 아이템을 Day별로 분배 — 현재는 Day 1에만 몰아서 표시
  // (Day 2 이후는 미션 + 식사만; 향후 사용자 요청 시 세분화)
  const dayItems: PlanItem[][] = Array.from({ length: numDays }, () => [])
  dayItems[0] = schedulableItems

  // 날씨 위젯에 전달할 날짜 배열
  const planDates = (() => {
    if (dayDates.length > 0) return dayDates
    const dates = new Set<string>()
    for (const o of ootdItems) {
      const d = o.item_data.date
      if (typeof d === 'string') dates.add(d)
    }
    for (const tr of transportItems) {
      const d = tr.item_data.date
      if (typeof d === 'string') dates.add(d)
    }
    if (dates.size === 0) {
      const today = new Date()
      const y = today.getFullYear()
      const m = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      dates.add(`${y}-${m}-${day}`)
    }
    return Array.from(dates).sort()
  })()

  function dayDateLabel(dateStr: string): string {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const month = d.getMonth() + 1
    const day = d.getDate()
    if (locale === 'en') return `${month}/${day}`
    if (locale === 'ja') return `${month}月${day}日`
    return `${month}월 ${day}일`
  }

  // 예상 LP — 실제 펼쳐진 미션의 lp_reward 합계 (fallback: 코스당 400)
  const estimatedLp = (() => {
    if (allMissions.length > 0) {
      return allMissions.reduce((sum, m) => sum + (m.lp_reward || 0), 0)
    }
    if (hasMissionKit || questItems.length > 0) {
      return questItems.length * 400
    }
    return 0
  })()

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-black text-[#111] mb-2">
        {t('final.title')}
      </h2>
      <p className="text-sm text-[#6B7280] mb-6">{t('final.subtitle')}</p>

      {/* 출발 (Transport) */}
      {transportItems.length > 0 && (
        <div className="bg-white rounded-2xl p-5 mb-4 border-l-4 border-[#9DD8CE]">
          <p className="text-[10px] font-black text-[#9DD8CE] uppercase tracking-widest mb-2">
            🚄 출발
          </p>
          {transportItems.map((t) => (
            <div key={t.id} className="text-sm text-[#374151]">
              {itemName(t, locale)}{' '}
              {typeof t.item_data.departureTime === 'string' && (
                <span className="text-[#9CA3AF] ml-1">
                  {String(t.item_data.departureTime)}
                  {typeof t.item_data.arrivalTime === 'string' && ` → ${String(t.item_data.arrivalTime)}`}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 숙소 (Stay) */}
      {stayItems.length > 0 && (
        <div className="bg-white rounded-2xl p-5 mb-4 border-l-4 border-blue-400">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
            🏨 숙소
          </p>
          {stayItems.map((s) => (
            <div key={s.id} className="text-sm font-bold text-[#111]">
              {itemName(s, locale)}
            </div>
          ))}
        </div>
      )}

      {/* 오늘의 코디 + 날씨 — 2열 그리드 (모바일 스택) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {ootdSlot ? ootdSlot : <div className="hidden md:block" />}
        <PlannerWeather cityId={cityId} dates={planDates} />
      </div>

      {/* Day별 스마트 스케줄 */}
      <div className="space-y-5">
        {Array.from({ length: numDays }).map((_, dayIdx) => {
          const daySchedulableItems = dayItems[dayIdx] ?? []
          const dayMissionList = dayMissions[dayIdx] ?? []
          const { slots } = buildSchedule(
            daySchedulableItems,
            t as unknown as (k: string) => string
          )
          const missionSlots = splitInDay(dayMissionList)
          const w = dayWeather[dayIdx]
          const dateLabel = dayDates[dayIdx] ? dayDateLabel(dayDates[dayIdx]) : ''

          return (
            <div
              key={dayIdx}
              className="bg-white rounded-3xl p-6 border border-[#E4E7EB]/40"
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-xs font-black text-[#9DD8CE] uppercase tracking-widest">
                  {t('final.day', { day: dayIdx + 1 })}
                  {dateLabel && (
                    <span className="ml-2 text-[#9CA3AF] font-bold normal-case">
                      {dateLabel}
                    </span>
                  )}
                </p>
                {w && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAFBFC] border border-[#9DD8CE]/20">
                    <span className="text-base leading-none">{w.icon}</span>
                    <span className="text-[11px] font-bold text-[#374151]">
                      {w.highTemp}° / {w.lowTemp}°
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {slots.map((slot, i) => {
                  let slotMissions: CourseMission[] = []
                  if (slot.label === t('final.morning')) slotMissions = missionSlots.morning
                  else if (slot.label === t('final.afternoon'))
                    slotMissions = missionSlots.afternoon
                  else if (slot.label === t('final.dinner'))
                    slotMissions = missionSlots.evening

                  const isEmpty = slot.items.length === 0 && slotMissions.length === 0

                  return (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-24 pt-0.5">
                        <p className="text-xs font-black text-[#111] flex items-center gap-1">
                          <span>{slot.emoji}</span>
                          <span>{slot.label}</span>
                        </p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                          {slot.timeRange}
                        </p>
                      </div>

                      <div className="flex-1 min-w-0 border-l-2 border-dashed border-[#E4E7EB] pl-4">
                        {isEmpty ? (
                          <p className="text-xs text-[#9CA3AF] italic">—</p>
                        ) : (
                          <ul className="space-y-2">
                            {slotMissions.map((m) => {
                              const missionNum = allMissions.indexOf(m) + 1
                              const locName = i18nText(m.location_name, locale)
                              const title = i18nText(m.title, locale)
                              return (
                                <li
                                  key={m.id}
                                  className="flex items-start gap-2 text-sm text-[#374151]"
                                >
                                  <span className="text-base shrink-0">📍</span>
                                  <div className="min-w-0">
                                    <span className="font-bold text-[#9DD8CE]">
                                      {t('mission.prefix', { n: missionNum })}:
                                    </span>{' '}
                                    <span className="font-semibold">
                                      {locName || title || `Mission ${missionNum}`}
                                    </span>
                                    {title && locName && title !== locName && (
                                      <span className="text-xs text-[#6B7280] block ml-0">
                                        — {title}
                                      </span>
                                    )}
                                  </div>
                                </li>
                              )
                            })}
                            {slot.items.map((it) => (
                              <li
                                key={it.id}
                                className="flex items-center gap-2 text-sm text-[#374151]"
                              >
                                <span className="text-base">{TYPE_EMOJI[it.item_type]}</span>
                                <span className="truncate">{itemName(it, locale)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#E4E7EB]/40 mt-5">
        {estimatedLp > 0 && (
          <div className="p-4 rounded-2xl bg-[#FAFBFC] border border-[#9DD8CE]/20 text-center">
            <p className="text-xs text-[#6B7280] mb-1">
              ⚔️ {t('final.missionIntegrated')}
            </p>
            <p className="text-sm font-black text-[#9DD8CE]">
              {t('final.estimatedLp')}: {estimatedLp.toLocaleString()} {t('final.lpUnit')}
            </p>
          </div>
        )}

        <button
          onClick={async () => {
            if (pdfState === 'charging') return
            setPdfState('charging')
            try {
              const res = await fetch('/api/credits/use', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feature: 'pdf' }),
              })
              if (res.status === 402) {
                setPdfState('insufficient')
                setTimeout(() => setPdfState('idle'), 3000)
                return
              }
              if (!res.ok) {
                setPdfState('error')
                setTimeout(() => setPdfState('idle'), 3000)
                return
              }
              if (onCreditsChanged) onCreditsChanged()
              setPdfState('idle')
              window.print()
            } catch {
              setPdfState('error')
              setTimeout(() => setPdfState('idle'), 3000)
            }
          }}
          disabled={pdfState === 'charging'}
          className="w-full mt-5 py-3 rounded-full bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-700 transition-colors disabled:opacity-60"
        >
          {pdfState === 'insufficient'
            ? `⚠ ${t('credits.insufficient')}`
            : pdfState === 'charging'
              ? '...'
              : pdfState === 'error'
                ? '⚠ Error'
                : `📄 ${t('final.downloadPdfWithCost')}`}
        </button>
      </div>

      <p className="text-[10px] text-[#9CA3AF] mt-3 text-center">
        ※ 시간대는 일반적인 여행자 기준 예시이며, 도보 이동 시간과 교통 상황에 따라 달라질 수 있습니다
      </p>
    </section>
  )
}
