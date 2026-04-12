'use client'

import { useTranslations } from 'next-intl'

export function StayBookingTip() {
  const t = useTranslations('stay')

  const tips = [
    { icon: '💡', key: 'tip.discount' },
    { icon: '🏯', key: 'tip.hanok' },
    { icon: '📱', key: 'tip.app' },
  ]

  return (
    <div className="bg-amber-50 border border-blossom rounded-2xl p-5 md:p-6">
      <p className="text-sm font-black text-amber-800 mb-3">💡 {t('tip.title')}</p>
      <ul className="space-y-2">
        {tips.map(({ icon, key }) => (
          <li key={key} className="flex items-start gap-2 text-xs md:text-sm text-amber-700 leading-relaxed">
            <span className="shrink-0">{icon}</span>
            <span>{t(key as Parameters<typeof t>[0])}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
