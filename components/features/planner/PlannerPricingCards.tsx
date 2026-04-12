'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface Plan {
  id: string
  plan_type: 'free' | 'explorer' | 'legend'
  price: number
  features: { ko: string[]; ja: string[]; en: string[] }
  kit_discount_rate: number
  tier_levelup: boolean
}

interface PlannerPricingCardsProps {
  plans: Plan[]
  locale: string
  onSubscribe: (planId: string) => Promise<void>
}

export function PlannerPricingCards({ plans, locale, onSubscribe }: PlannerPricingCardsProps) {
  const t = useTranslations('planner')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleClick = async (planId: string, planType: string) => {
    if (planType === 'free') return
    setProcessingId(planId)
    try {
      await onSubscribe(planId)
    } finally {
      setProcessingId(null)
    }
  }

  const getFeatures = (plan: Plan): string[] => {
    return plan.features[locale as keyof typeof plan.features] || plan.features.ko
  }

  const getName = (plan: Plan): string => {
    return t(`subscription.${plan.plan_type}` as Parameters<typeof t>[0])
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => {
        const isLegend = plan.plan_type === 'legend'
        const isFree = plan.plan_type === 'free'
        const features = getFeatures(plan)
        const isProcessing = processingId === plan.id

        return (
          <div
            key={plan.id}
            className={`relative bg-white rounded-3xl p-6 border-2 transition-all ${
              isLegend
                ? 'border-[#9DD8CE] shadow-[0_12px_40px_rgba(255,107,53,0.15)] scale-[1.02]'
                : 'border-[#E4E7EB]/60 hover:border-[#9DD8CE]/40'
            }`}
          >
            {isLegend && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#9DD8CE] text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                {t('subscription.best')}
              </span>
            )}

            <div className="text-center mb-5">
              <p className="text-sm font-bold text-[#9DD8CE] uppercase tracking-widest mb-2">
                {getName(plan)}
              </p>
              <p className="text-3xl font-black text-[#111]">
                ₩{plan.price.toLocaleString()}
                <span className="text-xs font-normal text-[#9CA3AF] ml-1">
                  {t('subscription.perMonth')}
                </span>
              </p>
            </div>

            <ul className="space-y-2 mb-6 min-h-[180px]">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#374151]">
                  <span className="text-[#9DD8CE] shrink-0 mt-0.5">✓</span>
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            {plan.kit_discount_rate > 0 && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-[#FAFBFC] border border-[#9DD8CE]/20">
                <p className="text-[10px] font-black text-[#9DD8CE] text-center">
                  🎁 {t('subscription.kitDiscount')}
                </p>
              </div>
            )}

            {plan.tier_levelup && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-gradient-to-r from-mint-light/30 to-mint/20 border border-[#9DD8CE]/20">
                <p className="text-[10px] font-black text-[#9DD8CE] text-center">
                  👑 {t('subscription.tierUp')}
                </p>
              </div>
            )}

            <button
              onClick={() => handleClick(plan.id, plan.plan_type)}
              disabled={isFree || isProcessing}
              className={`w-full py-3 rounded-full font-bold text-sm transition-colors ${
                isFree
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : isLegend
                    ? 'bg-[#9DD8CE] text-white hover:bg-[#7BC8BC]'
                    : 'bg-neutral-900 text-white hover:bg-neutral-700'
              }`}
            >
              {isProcessing
                ? t('subscription.processing')
                : isFree
                  ? '—'
                  : t('subscription.subscribe')}
            </button>
          </div>
        )
      })}
    </div>
  )
}
