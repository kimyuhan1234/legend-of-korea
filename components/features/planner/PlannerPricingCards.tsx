'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PassCard } from '@/components/features/pass/PassCard'
import { PASSES, ALLINONE_SAVINGS, type PassId } from '@/lib/data/passes'

interface PlannerPricingCardsProps {
  locale: string
  ownedPassIds: PassId[]
  onSubscribe: (passId: string) => Promise<void>
}

export function PlannerPricingCards({ locale, ownedPassIds, onSubscribe }: PlannerPricingCardsProps) {
  const t = useTranslations('pass')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleClick = async (passId: string) => {
    setProcessingId(passId)
    try {
      await onSubscribe(passId)
    } finally {
      setProcessingId(null)
    }
  }

  const hasAllInOne = ownedPassIds.includes('allinone')
  const ownedSet = new Set(ownedPassIds)
  const savingsLabel = t('savings', { amount: ALLINONE_SAVINGS.toLocaleString() })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {PASSES.map((pass) => (
        <PassCard
          key={pass.id}
          pass={pass}
          locale={locale}
          isOwned={hasAllInOne || ownedSet.has(pass.id)}
          isProcessing={processingId === pass.id}
          disabled={!!processingId}
          savingsLabel={pass.id === 'allinone' ? savingsLabel : undefined}
          ownedLabel={t('owned')}
          purchaseLabel={t('purchase')}
          onPurchase={handleClick}
        />
      ))}
    </div>
  )
}
