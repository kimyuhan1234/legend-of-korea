'use client'

import { useTranslations } from 'next-intl'
import { PlannerPricingCards } from './PlannerPricingCards'
import type { PassId } from '@/lib/data/passes'

interface PlannerSubscriptionWallProps {
  locale: string
  ownedPassIds: PassId[]
  onSubscribe: (passId: string) => Promise<void>
}

export function PlannerSubscriptionWall({ locale, ownedPassIds, onSubscribe }: PlannerSubscriptionWallProps) {
  const t = useTranslations('planner')

  return (
    <section data-subscription-wall className="bg-snow rounded-3xl p-6 md:p-10 border border-mint-deep/20">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] mb-2">
          {t('subscription.title')}
        </h2>
        <p className="text-sm text-[#6B7280]">{t('subscription.subtitle')}</p>
      </div>

      <PlannerPricingCards locale={locale} ownedPassIds={ownedPassIds} onSubscribe={onSubscribe} />
    </section>
  )
}
