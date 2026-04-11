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

function itemName(item: PlanItem, locale: string): string {
  const data = item.item_data
  const name = data.name as Record<string, string> | string | undefined
  if (typeof name === 'string') return name
  if (name && typeof name === 'object') return name[locale] || name.ko || 'Item'
  if (data.kitName) return String(data.kitName)
  return 'Item'
}

export function PlannerFinalPlan({ items, locale, hasMissionKit }: PlannerFinalPlanProps) {
  const t = useTranslations('planner')

  // 아이템을 시간대별로 배치 (단순 그룹핑)
  const morning = items.filter((i) => ['stay', 'quest'].includes(i.item_type))
  const afternoon = items.filter((i) => ['diy', 'goods'].includes(i.item_type))
  const evening = items.filter((i) => i.item_type === 'food')
  const anytime = items.filter((i) => ['ootd', 'transport', 'surprise'].includes(i.item_type))

  // 예상 LP 적립 (미션키트 고객 기준: 미션 1개당 50LP)
  const estimatedLp = hasMissionKit
    ? items.filter((i) => i.item_type === 'quest').length * 400
    : 0

  const renderItems = (group: PlanItem[]) =>
    group.length === 0 ? (
      <p className="text-xs text-[#9CA3AF]">—</p>
    ) : (
      <ul className="space-y-2">
        {group.map((it) => (
          <li key={it.id} className="flex items-center gap-2 text-sm text-[#374151]">
            <span className="text-base">{TYPE_EMOJI[it.item_type]}</span>
            <span className="flex-1 truncate">{itemName(it, locale)}</span>
          </li>
        ))}
      </ul>
    )

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-black text-[#111] mb-2">
        {t('final.title')}
      </h2>
      <p className="text-sm text-[#6B7280] mb-6">{t('final.subtitle')}</p>

      <div className="bg-white rounded-3xl p-6 border border-[#e8ddd0]/40">
        <p className="text-xs font-black text-[#FF6B35] uppercase tracking-widest mb-4">
          {t('final.day', { day: 1 })}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">
              🌅 {t('final.morning')}
            </p>
            {renderItems(morning)}
          </div>
          <div>
            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">
              ☀️ {t('final.afternoon')}
            </p>
            {renderItems(afternoon)}
          </div>
          <div>
            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">
              🌙 {t('final.evening')}
            </p>
            {renderItems(evening)}
          </div>
          <div>
            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">
              ⏰ {t('final.anytime')}
            </p>
            {renderItems(anytime)}
          </div>
        </div>

        {hasMissionKit && (
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
    </section>
  )
}
