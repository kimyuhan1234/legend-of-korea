'use client'

import { useTranslations } from 'next-intl'
import { PlannerSurprise } from './PlannerSurprise'

type ItemType = 'food' | 'stay' | 'diy' | 'quest' | 'ootd' | 'goods' | 'transport' | 'surprise'

interface PlannerCurationProps {
  itemTypesInPlan: ItemType[]
}

export function PlannerCuration({ itemTypesInPlan }: PlannerCurationProps) {
  const t = useTranslations('planner')

  const missing: Array<{ emoji: string; messageKey: string }> = []

  if (!itemTypesInPlan.includes('stay')) {
    missing.push({ emoji: '🏯', messageKey: 'curation.missingStay' })
  }
  if (!itemTypesInPlan.includes('food')) {
    missing.push({ emoji: '🍜', messageKey: 'curation.missingFood' })
  }
  if (!itemTypesInPlan.includes('diy')) {
    missing.push({ emoji: '🏺', messageKey: 'curation.missingDiy' })
  }
  if (!itemTypesInPlan.includes('quest')) {
    missing.push({ emoji: '⚔️', messageKey: 'curation.missingQuest' })
  }

  if (missing.length === 0) return null

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-black text-[#111] mb-2">
        {t('curation.title')}
      </h2>
      <p className="text-sm text-[#6B7280] mb-6">{t('curation.subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missing.map((s, i) => (
          <PlannerSurprise key={i} emoji={s.emoji} messageKey={s.messageKey} />
        ))}
      </div>
    </section>
  )
}
