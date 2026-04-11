'use client'

import { useTranslations } from 'next-intl'
import { StayCard } from './StayCard'
import type { StayRecommendation } from '@/lib/data/stay-recommendations'

interface StayGridProps {
  stays: StayRecommendation[]
  locale: string
}

export function StayGrid({ stays, locale }: StayGridProps) {
  const t = useTranslations('stay')

  if (stays.length === 0) {
    return (
      <div className="text-center py-20 text-[#9CA3AF]">
        <div className="text-5xl mb-4">🏯</div>
        <p className="text-sm">{t('empty')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stays.map((stay, i) => (
        <div
          key={stay.id}
          style={{ animationDelay: `${i * 60}ms` }}
          className="animate-fadeUp"
        >
          <StayCard stay={stay} locale={locale} />
        </div>
      ))}
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.5s ease-out backwards;
        }
      `}</style>
    </div>
  )
}
