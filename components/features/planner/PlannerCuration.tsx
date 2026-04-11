'use client'

import { useTranslations } from 'next-intl'
import { PlannerSurprise } from './PlannerSurprise'

type ItemType = 'food' | 'stay' | 'diy' | 'quest' | 'ootd' | 'goods' | 'transport' | 'surprise'

interface PlannerCurationProps {
  itemTypesInPlan: ItemType[]
  cityId: string
}

export function PlannerCuration({ itemTypesInPlan, cityId }: PlannerCurationProps) {
  const t = useTranslations('planner')

  const missing: Array<{ emoji: string; messageKey: string; kind: string }> = []

  if (!itemTypesInPlan.includes('stay')) {
    missing.push({ emoji: '🏯', messageKey: 'curation.missingStay', kind: 'stay' })
  }
  if (!itemTypesInPlan.includes('food')) {
    missing.push({ emoji: '🍜', messageKey: 'curation.missingFood', kind: 'food' })
  }
  if (!itemTypesInPlan.includes('diy')) {
    missing.push({ emoji: '🏺', messageKey: 'curation.missingDiy', kind: 'diy' })
  }
  if (!itemTypesInPlan.includes('quest')) {
    missing.push({ emoji: '⚔️', messageKey: 'curation.missingQuest', kind: 'quest' })
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
          <PlannerSurprise
            key={i}
            emoji={s.emoji}
            messageKey={s.messageKey}
            cityId={cityId}
            suggestionKind={s.kind}
          />
        ))}
      </div>
    </section>
  )
}
