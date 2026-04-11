'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { PlannerWeather } from './PlannerWeather'

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

export function PlannerFinalPlan({ items, locale, hasMissionKit, cityId }: PlannerFinalPlanProps) {
  const t = useTranslations('planner')

  // OOTD, transport, stay는 별도로 처리
  const ootdItems = items.filter((i) => i.item_type === 'ootd')
  const stayItems = items.filter((i) => i.item_type === 'stay')
  const transportItems = items.filter((i) => i.item_type === 'transport')
  const questItems = items.filter((i) => i.item_type === 'quest')
  // quest 아이템은 미션으로 펼칠 것이므로 scheduler에서 제외
  const schedulableItems = items.filter(
    (i) => !['ootd', 'stay', 'transport', 'quest'].includes(i.item_type)
  )

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

  // 미션을 오전/오후/저녁에 자동 분배 (개수 기반)
  const missionSlots = (() => {
    const total = allMissions.length
    if (total === 0) {
      return { morning: [], afternoon: [], evening: [] as CourseMission[] }
    }
    // 분배 비율: 오전 40%, 오후 40%, 저녁 20%
    const morningCount = Math.max(1, Math.ceil(total * 0.4))
    const afternoonCount = Math.max(
      total - morningCount > 0 ? 1 : 0,
      Math.ceil(total * 0.4)
    )
    const morning = allMissions.slice(0, morningCount)
    const afternoon = allMissions.slice(morningCount, morningCount + afternoonCount)
    const evening = allMissions.slice(morningCount + afternoonCount)
    return { morning, afternoon, evening }
  })()

  // 날씨 위젯에 전달할 날짜 배열 (OOTD 담긴 날짜들 + 오늘 기본값)
  const planDates = (() => {
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

  const { slots } = buildSchedule(schedulableItems, t as unknown as (k: string) => string)

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
        <div className="bg-white rounded-2xl p-5 mb-4 border-l-4 border-[#FF6B35]">
          <p className="text-[10px] font-black text-[#FF6B35] uppercase tracking-widest mb-2">
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
        {/* 오늘의 코디 */}
        {ootdItems.length > 0 ? (
          <div className="bg-pink-50 rounded-2xl p-5 border border-pink-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-pink-700 uppercase tracking-widest">
                👗 오늘의 코디
              </p>
              <a
                href={`/${locale}/ootd`}
                className="text-[10px] font-bold text-pink-700 hover:underline"
              >
                {t('weather.changeOutfit')} →
              </a>
            </div>
            <div className="space-y-2">
              {ootdItems.map((o) => {
                const data = o.item_data
                const date = typeof data.date === 'string' ? String(data.date) : ''
                const checkedItems =
                  (data.checkedItems as Array<{ name: string; icon: string }>) || []
                return (
                  <div key={o.id} className="text-sm">
                    {date && <p className="text-xs text-[#9CA3AF] mb-1">{date}</p>}
                    <div className="flex flex-wrap gap-2">
                      {checkedItems.length > 0 ? (
                        checkedItems.map((ci, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-pink-200 text-xs font-semibold text-[#374151]"
                          >
                            <span>{ci.icon}</span>
                            <span>{ci.name}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#9CA3AF]">—</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="hidden md:block" />
        )}

        {/* 날씨 위젯 */}
        <PlannerWeather cityId={cityId} dates={planDates} />
      </div>

      {/* 1일차 스마트 스케줄 */}
      <div className="bg-white rounded-3xl p-6 border border-[#e8ddd0]/40">
        <p className="text-xs font-black text-[#FF6B35] uppercase tracking-widest mb-4">
          {t('final.day', { day: 1 })}
        </p>

        <div className="space-y-4">
          {slots.map((slot, i) => {
            // 각 시간대에 해당하는 미션 (오전/오후/저녁 슬롯에만 펼쳐 배치)
            let slotMissions: CourseMission[] = []
            if (slot.label === t('final.morning')) slotMissions = missionSlots.morning
            else if (slot.label === t('final.afternoon')) slotMissions = missionSlots.afternoon
            else if (slot.label === t('final.dinner') || slot.label === t('final.night'))
              slotMissions = slot.label === t('final.dinner') ? missionSlots.evening : []

            const isEmpty = slot.items.length === 0 && slotMissions.length === 0

            return (
              <div key={i} className="flex gap-4">
                {/* 시간대 정보 */}
                <div className="shrink-0 w-24 pt-0.5">
                  <p className="text-xs font-black text-[#111] flex items-center gap-1">
                    <span>{slot.emoji}</span>
                    <span>{slot.label}</span>
                  </p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{slot.timeRange}</p>
                </div>

                {/* 일정 */}
                <div className="flex-1 min-w-0 border-l-2 border-dashed border-[#e8ddd0] pl-4">
                  {isEmpty ? (
                    <p className="text-xs text-[#9CA3AF] italic">—</p>
                  ) : (
                    <ul className="space-y-2">
                      {/* 미션 먼저 (시간대 시작 활동) */}
                      {slotMissions.map((m, mi) => {
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
                              <span className="font-bold text-[#FF6B35]">
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
                      {/* 고객 담은 일반 아이템 */}
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

        {estimatedLp > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-[#FFF8F0] border border-[#FF6B35]/20 text-center">
            <p className="text-xs text-[#6B7280] mb-1">
              ⚔️ {t('final.missionIntegrated')}
            </p>
            <p className="text-sm font-black text-[#FF6B35]">
              {t('final.estimatedLp')}: {estimatedLp.toLocaleString()} {t('final.lpUnit')}
            </p>
          </div>
        )}

        <button
          onClick={() => window.print()}
          className="w-full mt-5 py-3 rounded-full bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-700 transition-colors"
        >
          📄 {t('final.downloadPdf')}
        </button>
      </div>

      <p className="text-[10px] text-[#9CA3AF] mt-3 text-center">
        ※ 시간대는 일반적인 여행자 기준 예시이며, 도보 이동 시간과 교통 상황에 따라 달라질 수 있습니다
      </p>
    </section>
  )
}
