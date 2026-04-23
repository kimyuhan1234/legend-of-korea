'use client'

import { useEffect, useState, useMemo, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { PlannerWeather } from './PlannerWeather'
import { getCityWeather, type CityWeatherDay } from '@/lib/data/city-weather-mock'
import { getItemName, filterItemsByCity, getFirstDayStartTime, getLastDayEndTime } from '@/lib/utils/planner-helpers'
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
  return (field as Record<string, string>)[locale] || field.en || field.ko || ''
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

// 상단 요약 아코디언 — 섹션별 접기/펴기
interface AccordionItemProps {
  title: string
  emoji: string
  accentClass: string  // 제목 색상 (mint-deep, rose-500, blue-600, amber-600)
  defaultOpen: boolean
  count: number
  children: ReactNode
}

function AccordionItem({ title, emoji, accentClass, defaultOpen, count, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-mist/40 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-snow transition-colors"
        aria-expanded={isOpen}
      >
        <span className={`text-[11px] font-black uppercase tracking-widest ${accentClass}`}>
          {emoji} {title}
        </span>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="text-[10px] font-black bg-mint-light/60 text-mint-deep px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-stone transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-mist/40">
          {children}
        </div>
      )}
    </div>
  )
}

// 상단 요약 라벨 (5개국어)
const SUMMARY_LABEL: Record<string, {
  dateOutfit: string; foodWish: string; foodEmpty: string
  hotelInfo: string; hotelEmpty: string; placesToGo: string; placesEmpty: string
}> = {
  ko: {
    dateOutfit: '날짜·코디·날씨',
    foodWish: '먹고 싶은 요리',
    foodEmpty: '아직 음식을 담지 않았어요',
    hotelInfo: '호텔 정보',
    hotelEmpty: '숙소를 담아보세요',
    placesToGo: '가야할 곳',
    placesEmpty: '일정을 담아보세요',
  },
  ja: {
    dateOutfit: '日付・コーデ・天気',
    foodWish: '食べたい料理',
    foodEmpty: 'まだ料理が登録されていません',
    hotelInfo: '宿泊情報',
    hotelEmpty: '宿泊先を登録してください',
    placesToGo: '訪問先',
    placesEmpty: '予定を登録してください',
  },
  en: {
    dateOutfit: 'Date · Outfit · Weather',
    foodWish: 'Foods to Try',
    foodEmpty: 'No foods picked yet',
    hotelInfo: 'Hotel Info',
    hotelEmpty: 'Add your stay',
    placesToGo: 'Places to Visit',
    placesEmpty: 'Add your plans',
  },
  'zh-CN': {
    dateOutfit: '日期·穿搭·天气',
    foodWish: '想吃的美食',
    foodEmpty: '尚未添加美食',
    hotelInfo: '酒店信息',
    hotelEmpty: '请添加住宿',
    placesToGo: '要去的地方',
    placesEmpty: '请添加行程',
  },
  'zh-TW': {
    dateOutfit: '日期·穿搭·天氣',
    foodWish: '想吃的美食',
    foodEmpty: '尚未添加美食',
    hotelInfo: '飯店資訊',
    hotelEmpty: '請添加住宿',
    placesToGo: '要去的地方',
    placesEmpty: '請添加行程',
  },
}

// 아이템명 추출 — 공유 헬퍼 사용
function itemName(item: PlanItem, locale: string): string {
  return getItemName(item, locale)
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
  t: (key: string) => string,
  dayStartTime?: string,
  dayEndTime?: string,
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

  // 시작/종료 시간 동적 반영
  const start = dayStartTime ?? '09:00'
  const end = dayEndTime ?? '22:00'
  const startH = parseInt(start.split(':')[0], 10)
  const endH = parseInt(end.split(':')[0], 10)

  const allSlots: TimeSlot[] = [
    { label: t('final.morning'), timeRange: `${start} – 12:00`, emoji: '🌅', items: morning },
    { label: t('final.lunch'), timeRange: '12:00 – 14:00', emoji: '🍽️', items: lunch },
    { label: t('final.afternoon'), timeRange: '14:00 – 18:00', emoji: '☀️', items: afternoon },
    { label: t('final.dinner'), timeRange: '18:00 – 20:00', emoji: '🌆', items: dinner },
    { label: t('final.night'), timeRange: `20:00 – ${end}`, emoji: '🌙', items: night },
  ]

  // 시작 시간 이전 슬롯 제거 (예: 도착 13시면 오전/점심 스킵)
  // 종료 시간 이후 슬롯 제거
  const slotStartHours = [startH, 12, 14, 18, 20]
  const slots = allSlots.filter((_, i) => {
    const slotStart = slotStartHours[i]
    const slotEnd = i < 4 ? slotStartHours[i + 1] : (endH || 22)
    return slotStart < (endH || 22) && slotEnd > startH
  })

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
}: PlannerFinalPlanProps) {
  const t = useTranslations('planner')
  const [pdfState, setPdfState] = useState<'idle' | 'error'>('idle')

  // 도시 필터 — 선택한 도시 아이템만 (교통/OOTD는 도시 무관)
  const filteredItems = useMemo(
    () => filterItemsByCity(items, cityId),
    [items, cityId]
  )

  // OOTD, transport, stay는 별도로 처리
  const ootdItems = filteredItems.filter((i) => i.item_type === 'ootd')
  const stayItems = filteredItems.filter((i) => i.item_type === 'stay')
  const transportItems = filteredItems.filter((i) => i.item_type === 'transport')
  // 교통편 중복 제거: 같은 direction은 최신 1개만
  const goingTransport = transportItems.filter((i) => i.item_data?.direction === 'going').slice(-1)
  const returningTransport = transportItems.filter((i) => i.item_data?.direction === 'returning').slice(-1)
  const dedupedTransport = [...goingTransport, ...returningTransport]
  const questItems = filteredItems.filter((i) => i.item_type === 'quest')
  // quest 아이템은 미션으로 펼칠 것이므로 scheduler에서 제외
  const schedulableItems = filteredItems.filter(
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

  // 교통편 기반 1일차 시작 / 마지막날 종료 시간
  const firstDayStart = getFirstDayStartTime(dedupedTransport)
  const lastDayEnd = getLastDayEndTime(dedupedTransport)

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
    for (const tr of dedupedTransport) {
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

      {/* 상단 요약 — 세로 아코디언 (빈 섹션 기본 접힘, 데이터 있는 섹션 펼침) */}
      {(() => {
        const foods = filteredItems.filter((i) => i.item_type === 'food')
        const quests = filteredItems.filter((i) => i.item_type === 'quest')
        const surprises = filteredItems.filter((i) => i.item_type === 'surprise')
        const places = [...quests, ...surprises, ...dedupedTransport]
        const label = SUMMARY_LABEL[locale] || SUMMARY_LABEL.en

        return (
          <div className="space-y-2 mb-8">
            {/* 1. 📅 날짜·코디·날씨 — 기본 펼침 (날씨는 항상 있음) */}
            <AccordionItem
              title={label.dateOutfit}
              emoji="📅"
              accentClass="text-mint-deep"
              defaultOpen={true}
              count={ootdItems.length}
            >
              <div className="space-y-3">
                {ootdSlot}
                <PlannerWeather cityId={cityId} dates={planDates} />
              </div>
            </AccordionItem>

            {/* 2. 🍜 먹고 싶은 요리 */}
            <AccordionItem
              title={label.foodWish}
              emoji="🍜"
              accentClass="text-rose-500"
              defaultOpen={foods.length > 0}
              count={foods.length}
            >
              {foods.length === 0 ? (
                <p className="text-[11px] text-stone italic">{label.foodEmpty}</p>
              ) : (
                <ul className="space-y-1.5">
                  {foods.slice(0, 5).map((f) => {
                    const img = typeof f.item_data.image === 'string' ? f.item_data.image : null
                    return (
                      <li key={f.id} className="flex items-center gap-2 text-sm">
                        {img ? (
                          <span className="w-7 h-7 rounded-lg bg-cloud overflow-hidden shrink-0">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </span>
                        ) : (
                          <span className="text-base shrink-0">🍜</span>
                        )}
                        <span className="font-semibold text-[#111] truncate">{itemName(f, locale)}</span>
                      </li>
                    )
                  })}
                  {foods.length > 5 && (
                    <li className="text-[10px] text-stone">+{foods.length - 5}</li>
                  )}
                </ul>
              )}
            </AccordionItem>

            {/* 3. 🏨 호텔 정보 */}
            <AccordionItem
              title={label.hotelInfo}
              emoji="🏨"
              accentClass="text-blue-600"
              defaultOpen={stayItems.length > 0}
              count={stayItems.length}
            >
              {stayItems.length === 0 ? (
                <p className="text-[11px] text-stone italic">{label.hotelEmpty}</p>
              ) : (
                <ul className="space-y-2">
                  {stayItems.slice(0, 2).map((s) => {
                    const address = typeof s.item_data.address === 'string' ? s.item_data.address : ''
                    const checkIn = typeof s.item_data.checkIn === 'string' ? s.item_data.checkIn : ''
                    const checkOut = typeof s.item_data.checkOut === 'string' ? s.item_data.checkOut : ''
                    return (
                      <li key={s.id} className="text-sm">
                        <p className="font-bold text-[#111] truncate">{itemName(s, locale)}</p>
                        {address && (
                          <p className="text-[11px] text-stone truncate mt-0.5">📍 {address}</p>
                        )}
                        {(checkIn || checkOut) && (
                          <p className="text-[11px] text-stone mt-0.5">
                            🕐 {checkIn || '—'}
                            {checkOut && ` · 체크아웃 ${checkOut}`}
                          </p>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </AccordionItem>

            {/* 4. 🎯 가야할 곳 (quest + surprise + transport) */}
            <AccordionItem
              title={label.placesToGo}
              emoji="🎯"
              accentClass="text-amber-600"
              defaultOpen={places.length > 0}
              count={places.length}
            >
              {places.length === 0 ? (
                <p className="text-[11px] text-stone italic">{label.placesEmpty}</p>
              ) : (
                <ul className="space-y-1.5">
                  {places.slice(0, 5).map((it) => (
                    <li key={it.id} className="flex items-start gap-2 text-sm">
                      <span className="text-base shrink-0">{TYPE_EMOJI[it.item_type]}</span>
                      <span className="font-semibold text-[#111] truncate">{itemName(it, locale)}</span>
                    </li>
                  ))}
                  {places.length > 5 && (
                    <li className="text-[10px] text-stone">+{places.length - 5}</li>
                  )}
                </ul>
              )}
            </AccordionItem>
          </div>
        )
      })()}

      {/* 구분선 — 상단 요약과 스케줄 명확히 분리 */}
      <div className="h-px bg-mist/60 mb-6" />

      {/* Day별 스마트 스케줄 */}
      <div className="space-y-5">
        {Array.from({ length: numDays }).map((_, dayIdx) => {
          const daySchedulableItems = dayItems[dayIdx] ?? []
          const dayMissionList = dayMissions[dayIdx] ?? []
          const isFirstDay = dayIdx === 0
          const isLastDay = dayIdx === numDays - 1
          const dayStart = isFirstDay ? firstDayStart : undefined
          const dayEnd = isLastDay ? lastDayEnd : undefined
          const { slots } = buildSchedule(
            daySchedulableItems,
            t as unknown as (k: string) => string,
            dayStart,
            dayEnd,
          )
          const missionSlots = splitInDay(dayMissionList)
          const w = dayWeather[dayIdx]
          const dateLabel = dayDates[dayIdx] ? dayDateLabel(dayDates[dayIdx]) : ''

          return (
            <div
              key={dayIdx}
              className="bg-white rounded-3xl p-6 border border-mist/40"
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-xs font-black text-mint-deep uppercase tracking-widest">
                  {t('final.day', { day: dayIdx + 1 })}
                  {dateLabel && (
                    <span className="ml-2 text-stone font-bold normal-case">
                      {dateLabel}
                    </span>
                  )}
                </p>
                {w && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-snow border border-mint-deep/20">
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
                        <p className="text-[10px] text-stone mt-0.5">
                          {slot.timeRange}
                        </p>
                      </div>

                      <div className="flex-1 min-w-0 border-l-2 border-dashed border-mist pl-4">
                        {isEmpty ? (
                          <p className="text-xs text-stone italic">—</p>
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
                                    <span className="font-bold text-mint-deep">
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

      <div className="bg-white rounded-3xl p-6 border border-mist/40 mt-5">
        {estimatedLp > 0 && (
          <div className="p-4 rounded-2xl bg-snow border border-mint-deep/20 text-center">
            <p className="text-xs text-[#6B7280] mb-1">
              ⚔️ {t('final.missionIntegrated')}
            </p>
            <p className="text-sm font-black text-mint-deep">
              {t('final.estimatedLp')}: {estimatedLp.toLocaleString()} {t('final.lpUnit')}
            </p>
          </div>
        )}

        <button
          onClick={() => {
            try {
              window.print()
            } catch {
              setPdfState('error')
              setTimeout(() => setPdfState('idle'), 3000)
            }
          }}
          className="w-full mt-5 py-3 rounded-full bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-700 transition-colors"
        >
          {pdfState === 'error' ? '⚠ Error' : `📄 ${t('final.downloadPdf')}`}
        </button>
      </div>

      <p className="text-[10px] text-stone mt-3 text-center">
        ※ 시간대는 일반적인 여행자 기준 예시이며, 도보 이동 시간과 교통 상황에 따라 달라질 수 있습니다
      </p>
    </section>
  )
}
