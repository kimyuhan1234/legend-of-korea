'use client'

import { useTranslations } from 'next-intl'
import { PlannerPricingCards } from './PlannerPricingCards'

interface Plan {
  id: string
  plan_type: 'free' | 'explorer' | 'legend'
  price: number
  features: { ko: string[]; ja: string[]; en: string[] }
  kit_discount_rate: number
  tier_levelup: boolean
}

interface PlannerSubscriptionWallProps {
  plans: Plan[]
  locale: string
  onSubscribe: (planId: string) => Promise<void>
}

export function PlannerSubscriptionWall({ plans, locale, onSubscribe }: PlannerSubscriptionWallProps) {
  const t = useTranslations('planner')

  return (
    <section className="bg-gradient-to-b from-[#FAFBFC] to-white rounded-3xl p-6 md:p-10 border border-[#9DD8CE]/20">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] mb-2">
          {t('subscription.title')}
        </h2>
        <p className="text-sm text-[#6B7280]">{t('subscription.subtitle')}</p>
      </div>

      <PlannerPricingCards plans={plans} locale={locale} onSubscribe={onSubscribe} />
    </section>
  )
}
