'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface PlannerSurpriseProps {
  emoji: string
  messageKey: string
}

export function PlannerSurprise({ emoji, messageKey }: PlannerSurpriseProps) {
  const t = useTranslations('planner')
  const [dismissed, setDismissed] = useState(false)
  const [added, setAdded] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-200 rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl shrink-0">{emoji}</span>
        <div className="flex-1">
          <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">
            🎁 {t('curation.surprise')}
          </p>
          <p className="text-sm text-[#374151] font-semibold leading-snug">
            {t(messageKey as Parameters<typeof t>[0])}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setAdded(true)}
          disabled={added}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-colors ${
            added ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'
          }`}
        >
          {added ? '✓' : t('curation.addSurprise')}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="px-4 py-2 rounded-full text-xs font-bold bg-white border border-amber-200 text-[#6B7280] hover:bg-amber-50"
        >
          {t('curation.skip')}
        </button>
      </div>
    </div>
  )
}
