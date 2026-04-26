'use client'

import { useTranslations } from 'next-intl'

/**
 * 가격 카드 옆에 노출되는 작은 베타 배지.
 * 마케팅팀 카피: "베타 · 지금은 무료" 류.
 */
export function BetaPriceBadge() {
  const t = useTranslations('beta.price_badge')
  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 whitespace-nowrap">
      {t('label')}
    </span>
  )
}
