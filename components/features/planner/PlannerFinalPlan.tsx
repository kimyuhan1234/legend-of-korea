'use client'

import { useTranslations } from 'next-intl'

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

export function PlannerFinalPlan({ items, locale, hasMissionKit }: PlannerFinalPlanProps) {
  const t = useTranslations('planner')

  // OOTD, transport, stay는 별도로 처리
  const ootdItems = items.filter((i) => i.item_type === 'ootd')
  const stayItems = items.filter((i) => i.item_type === 'stay')
  const transportItems = items.filter((i) => i.item_type === 'transport')
  const schedulableItems = items.filter(
    (i) => !['ootd', 'stay', 'transport'].includes(i.item_type)
  )

  const { slots } = buildSchedule(schedulableItems, t as unknown as (k: string) => string)

  // 예상 LP (미션키트 고객 기준)
  const estimatedLp = hasMissionKit
    ? items.filter((i) => i.item_type === 'quest').length * 400
    : 0

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

      {/* 오늘의 코디 (OOTD) — 스케줄 밖 별도 섹션 */}
      {ootdItems.length > 0 && (
        <div className="bg-pink-50 rounded-2xl p-5 mb-4 border border-pink-200">
          <p className="text-[10px] font-black text-pink-700 uppercase tracking-widest mb-2">
            👗 오늘의 코디
          </p>
          <div className="space-y-2">
            {ootdItems.map((o) => {
              const data = o.item_data
              const date = typeof data.date === 'string' ? String(data.date) : ''
              const checkedItems = (data.checkedItems as Array<{ name: string; icon: string }>) || []
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
      )}

      {/* 1일차 스마트 스케줄 */}
      <div className="bg-white rounded-3xl p-6 border border-[#e8ddd0]/40">
        <p className="text-xs font-black text-[#FF6B35] uppercase tracking-widest mb-4">
          {t('final.day', { day: 1 })}
        </p>

        <div className="space-y-4">
          {slots.map((slot, i) => (
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
                {slot.items.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] italic">—</p>
                ) : (
                  <ul className="space-y-2">
                    {slot.items.map((it) => (
                      <li key={it.id} className="flex items-center gap-2 text-sm text-[#374151]">
                        <span className="text-base">{TYPE_EMOJI[it.item_type]}</span>
                        <span className="truncate">{itemName(it, locale)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {hasMissionKit && estimatedLp > 0 && (
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
