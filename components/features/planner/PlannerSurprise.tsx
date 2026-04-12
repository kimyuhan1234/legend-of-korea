'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

interface PlannerSurpriseProps {
  emoji: string
  messageKey: string
  cityId: string
  suggestionKind: string
}

// 서프라이즈 종류 → 이동할 탭 경로
const KIND_TO_PATH: Record<string, string> = {
  stay: '/stay',
  food: '/food',
  diy: '/diy',
  quest: '/story',
  goods: '/goods',
  spot: '/sights',
}

export function PlannerSurprise({ emoji, messageKey, cityId, suggestionKind }: PlannerSurpriseProps) {
  const t = useTranslations('planner')
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleGo = () => {
    const path = KIND_TO_PATH[suggestionKind] ?? '/story'
    router.push(`/${locale}${path}`)
  }

  // cityId는 향후 도시별 필터링을 위해 유지 (현재는 탭 이동만)
  void cityId

  return (
    <div className="bg-peach border-2 border-blossom rounded-2xl p-5">
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
          onClick={handleGo}
          className="flex-1 py-2 rounded-full text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
        >
          {t('curation.goSee')} →
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="px-4 py-2 rounded-full text-xs font-bold bg-white border border-blossom text-[#6B7280] hover:bg-amber-50"
        >
          {t('curation.skip')}
        </button>
      </div>
    </div>
  )
}
