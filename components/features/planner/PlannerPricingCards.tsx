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

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const hasAllInOne = ownedPassIds.includes('allinone')
  const ownedSet = new Set(ownedPassIds)
  const savingsLabel = t('savings', { amount: ALLINONE_SAVINGS.toLocaleString() })

  return (
    <div className="flex flex-col md:flex-row md:items-stretch gap-3">
      {PASSES.map((pass, i) => (
        <div
          key={pass.id}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
          className="min-w-0"
          style={{
            flexBasis: hoveredIdx === null ? '25%' : hoveredIdx === i ? '43%' : '19%',
            flexShrink: 1,
            flexGrow: 0,
            transition: 'flex-basis 300ms ease-in-out',
          }}
        >
          <PassCard
            pass={pass}
            locale={locale}
            isOwned={hasAllInOne || ownedSet.has(pass.id)}
            isProcessing={processingId === pass.id}
            disabled={!!processingId}
            savingsLabel={pass.id === 'allinone' ? savingsLabel : undefined}
            ownedLabel={t('owned')}
            purchaseLabel={t('purchase')}
            onPurchase={handleClick}
            layout="vertical"
          />
        </div>
      ))}
    </div>
  )
}
