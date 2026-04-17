'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { HotelInputForm } from './HotelInputForm'
import { PlannerResetButton } from './PlannerResetButton'
import { PlannerEmptyGuide } from './PlannerEmptyGuide'
import { getItemName as sharedGetItemName } from '@/lib/utils/planner-helpers'

type ItemType = 'food' | 'stay' | 'diy' | 'quest' | 'ootd' | 'goods' | 'transport' | 'surprise'

interface PlanItem {
  id: string
  item_type: ItemType
  item_data: Record<string, unknown>
}

interface Plan {
  id: string
  city_id: string
  hotel_name?: string | null
  hotel_address?: string | null
  plan_items: PlanItem[]
}

interface PlannerPreviewProps {
  plans: Plan[]
  locale: string
  isSubscribed: boolean
  onRemoveItem: (itemId: string) => void
  onHotelSaved?: () => void
  onResetAll?: () => void
}

const CATEGORY_CONFIG: Record<ItemType, { icon: string; labelKey: string }> = {
  ootd: { icon: '👗', labelKey: 'category.ootd' },
  food: { icon: '🍜', labelKey: 'category.food' },
  stay: { icon: '🏯', labelKey: 'category.stay' },
  quest: { icon: '🎯', labelKey: 'category.quest' },
  diy: { icon: '🏺', labelKey: 'category.diy' },
  goods: { icon: '🛍️', labelKey: 'category.goods' },
  transport: { icon: '🚌', labelKey: 'category.transport' },
  surprise: { icon: '🎁', labelKey: 'category.surprise' },
}

const CITIES = [
  { code: 'jeonju', name: { ko: '전주', en: 'Jeonju', ja: '全州', 'zh-CN': '全州', 'zh-TW': '全州' } },
  { code: 'seoul', name: { ko: '서울', en: 'Seoul', ja: 'ソウル', 'zh-CN': '首尔', 'zh-TW': '首爾' } },
  { code: 'busan', name: { ko: '부산', en: 'Busan', ja: '釜山', 'zh-CN': '釜山', 'zh-TW': '釜山' } },
  { code: 'jeju', name: { ko: '제주', en: 'Jeju', ja: '済州', 'zh-CN': '济州', 'zh-TW': '濟州' } },
  { code: 'gyeongju', name: { ko: '경주', en: 'Gyeongju', ja: '慶州', 'zh-CN': '庆州', 'zh-TW': '慶州' } },
  { code: 'tongyeong', name: { ko: '통영', en: 'Tongyeong', ja: '統営', 'zh-CN': '统营', 'zh-TW': '統營' } },
  { code: 'cheonan', name: { ko: '천안', en: 'Cheonan', ja: '天安', 'zh-CN': '天安', 'zh-TW': '天安' } },
  { code: 'yongin', name: { ko: '용인', en: 'Yongin', ja: '龍仁', 'zh-CN': '龙仁', 'zh-TW': '龍仁' } },
  { code: 'icheon', name: { ko: '이천', en: 'Icheon', ja: '利川', 'zh-CN': '利川', 'zh-TW': '利川' } },
]

function getItemName(item: PlanItem, locale: string): string {
  return sharedGetItemName(item, locale)
}

function getCityLabel(code: string, locale: string): string {
  const city = CITIES.find((c) => c.code === code)
  if (!city) return code
  return city.name[locale as string] || city.name.en || city.name.ko
}

export function PlannerPreview({ plans, locale, isSubscribed, onRemoveItem, onHotelSaved, onResetAll }: PlannerPreviewProps) {
  const t = useTranslations('planner')
  const pathname = usePathname()

  const totalItemCount = plans.reduce((sum, p) => sum + p.plan_items.length, 0)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  if (plans.length === 0 || plans.every((p) => p.plan_items.length === 0)) {
    return <PlannerEmptyGuide />
  }

  const toggleCategory = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h2 className="text-xl md:text-2xl font-black text-ink">
          {t('preview.title')}{' '}
          <span className="text-sm font-bold text-stone">({totalItemCount})</span>
        </h2>
        <PlannerResetButton
          itemCount={totalItemCount}
          onReset={() => onResetAll?.()}
        />
      </div>

      <div className="space-y-6">
        {plans.map((plan, planIdx) => {
          const isFirstCity = planIdx === 0
          const isBlurred = !isSubscribed && !isFirstCity

          // 카테고리별 그룹핑
          const grouped = plan.plan_items.reduce<Record<string, PlanItem[]>>((acc, item) => {
            const key = item.item_type
            if (!acc[key]) acc[key] = []
            acc[key].push(item)
            return acc
          }, {})

          // 카테고리 순서 고정
          const categoryOrder: ItemType[] = ['ootd', 'food', 'stay', 'quest', 'diy', 'goods', 'transport', 'surprise']
          const sortedGroups = categoryOrder.filter((type) => grouped[type]?.length > 0)

          return (
            <div key={plan.id} className="relative">
              <div className={`bg-white rounded-3xl p-6 border border-mist ${isBlurred ? 'blur-sm pointer-events-none select-none' : ''}`}>
                {/* 도시 표시 */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-lg">📍</span>
                  <span className="text-base font-black text-ink">
                    {getCityLabel(plan.city_id, locale)}
                  </span>
                </div>

                {/* 카테고리별 그룹 */}
                {plan.plan_items.length === 0 ? (
                  <p className="text-sm text-stone">—</p>
                ) : (
                  <div className="space-y-3">
                    {sortedGroups.map((type) => {
                      const items = grouped[type]
                      const cat = CATEGORY_CONFIG[type]
                      const groupKey = `${plan.id}-${type}`
                      const isOpen = expanded[groupKey] ?? false

                      return (
                        <div key={type}>
                          {/* 카테고리 헤더 */}
                          <button
                            type="button"
                            onClick={() => toggleCategory(groupKey)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-snow border border-mist hover:border-mint transition-all"
                          >
                            <span className="text-lg">{cat.icon}</span>
                            <span className="font-bold text-ink text-sm">
                              {t(cat.labelKey as Parameters<typeof t>[0]) as string}
                            </span>
                            <span className="text-xs text-blossom-deep bg-blossom-light rounded-full px-2.5 py-0.5 font-bold">
                              {items.length}
                            </span>
                            <span
                              className="ml-auto text-stone text-xs transition-transform duration-200"
                              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            >
                              ▼
                            </span>
                          </button>

                          {/* 아이템 목록 */}
                          {isOpen && (
                            <div className="mt-1 ml-4 border-l-2 border-mint-light pl-4 space-y-1 py-2">
                              {items.map((item) => {
                                const name = getItemName(item, locale)
                                return (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-mint-light/20 transition-colors"
                                  >
                                    <span className="text-sm">{cat.icon}</span>
                                    <span className="flex-1 text-sm text-ink truncate">
                                      {name || t(cat.labelKey as Parameters<typeof t>[0]) as string}
                                    </span>
                                    <button
                                      onClick={() => onRemoveItem(item.id)}
                                      className="text-xs text-stone hover:text-red-500 transition-colors p-1"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* 호텔 + 교통 (첫 도시만) */}
                {isFirstCity && (
                  <div className="mt-4 space-y-3">
                    {plan.hotel_name ? (
                      <div className="bg-sky-light/30 border border-sky-light rounded-2xl p-4">
                        <p className="text-[10px] font-black text-sky uppercase tracking-widest mb-1">
                          🏨 Hotel
                        </p>
                        <p className="text-sm font-bold text-ink">{plan.hotel_name}</p>
                        <p className="text-xs text-stone truncate">{plan.hotel_address}</p>
                      </div>
                    ) : (
                      <HotelInputForm planId={plan.id} onSaved={onHotelSaved} />
                    )}
                  </div>
                )}
              </div>

              {isBlurred && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-gradient-to-b from-transparent to-white/80">
                  <div className="text-center p-6">
                    <div className="text-3xl mb-2">🔒</div>
                    <p className="text-sm font-bold text-ink">{t('preview.blur')}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
