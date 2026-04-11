'use client'

import { useTranslations } from 'next-intl'
import { HotelInputForm } from './HotelInputForm'
import { TransportInputForm } from './TransportInputForm'
import { PlannerResetButton } from './PlannerResetButton'

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

const TYPE_CONFIG: Record<ItemType, { emoji: string; color: string }> = {
  food: { emoji: '🍜', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  stay: { emoji: '🏯', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  quest: { emoji: '⚔️', color: 'bg-red-50 border-red-200 text-red-700' },
  diy: { emoji: '🏺', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  ootd: { emoji: '👗', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  goods: { emoji: '🛍️', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  transport: { emoji: '🚄', color: 'bg-gray-50 border-gray-200 text-gray-700' },
  surprise: { emoji: '🎁', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
}

const CITY_EMOJI: Record<string, string> = {
  jeonju: '🏯', seoul: '🏙️', busan: '🌊', jeju: '🌺',
  gyeongju: '🏛️', tongyeong: '⛵', cheonan: '🌳', yongin: '🎢', icheon: '🏺',
}

function getItemName(item: PlanItem, locale: string): string {
  const data = item.item_data
  const name = data.name as Record<string, string> | string | undefined
  if (typeof name === 'string') return name
  if (name && typeof name === 'object') return name[locale] || name.ko || 'Item'
  if (data.kitName) return String(data.kitName)
  if (data.nameKey) return String(data.nameKey).split('.').pop() || 'Item'
  return 'Item'
}

export function PlannerPreview({ plans, locale, isSubscribed, onRemoveItem, onHotelSaved, onResetAll }: PlannerPreviewProps) {
  const t = useTranslations('planner')

  const totalItemCount = plans.reduce((sum, p) => sum + p.plan_items.length, 0)

  if (plans.length === 0 || plans.every((p) => p.plan_items.length === 0)) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-[#e8ddd0]/40">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-[#6B7280]">{t('preview.empty')}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h2 className="text-xl md:text-2xl font-black text-[#111]">
          {t('preview.title')}{' '}
          <span className="text-sm font-bold text-[#9CA3AF]">
            ({totalItemCount})
          </span>
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

          return (
            <div key={plan.id} className="relative">
              <div className={`bg-white rounded-3xl p-6 border border-[#e8ddd0]/40 ${isBlurred ? 'blur-sm pointer-events-none select-none' : ''}`}>
                <h3 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                  <span className="text-2xl">{CITY_EMOJI[plan.city_id] || '📍'}</span>
                  <span>{plan.city_id}</span>
                </h3>

                {plan.plan_items.length === 0 ? (
                  <p className="text-sm text-[#9CA3AF]">—</p>
                ) : (
                  <ul className="space-y-2">
                    {plan.plan_items.map((item) => {
                      const cfg = TYPE_CONFIG[item.item_type]
                      return (
                        <li
                          key={item.id}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${cfg.color}`}
                        >
                          <span className="text-xl">{cfg.emoji}</span>
                          <span className="flex-1 text-sm font-semibold truncate">
                            {getItemName(item, locale)}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-xs text-[#9CA3AF] hover:text-red-500 transition-colors"
                          >
                            ✕
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}

                {/* 호텔 + 교통 입력 영역 (첫 도시만) */}
                {isFirstCity && (
                  <div className="mt-4 space-y-3">
                    {/* 호텔: 이미 있으면 카드, 없으면 입력 폼 */}
                    {plan.hotel_name ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">
                          🏨 Hotel
                        </p>
                        <p className="text-sm font-bold text-[#111]">{plan.hotel_name}</p>
                        <p className="text-xs text-[#6B7280] truncate">{plan.hotel_address}</p>
                      </div>
                    ) : (
                      <HotelInputForm planId={plan.id} onSaved={onHotelSaved} />
                    )}

                    {/* 교통편: 이미 transport 아이템 있으면 숨김 */}
                    {!plan.plan_items.some((i) => i.item_type === 'transport') && (
                      <TransportInputForm cityId={plan.city_id} locale={locale} />
                    )}
                  </div>
                )}
              </div>

              {isBlurred && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-gradient-to-b from-transparent to-white/80">
                  <div className="text-center p-6">
                    <div className="text-3xl mb-2">🔒</div>
                    <p className="text-sm font-bold text-[#111]">{t('preview.blur')}</p>
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
