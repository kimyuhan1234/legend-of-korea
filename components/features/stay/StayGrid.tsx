'use client'

import { useTranslations } from 'next-intl'
import { StayCard } from './StayCard'
import { PassBlurOverlay } from '@/components/shared/PassBlurOverlay'
import { usePassStatus } from '@/hooks/usePassStatus'
import type { StayRecommendation } from '@/lib/data/stay-recommendations'

interface StayGridProps {
  stays: StayRecommendation[]
  locale: string
}

export function StayGrid({ stays, locale }: StayGridProps) {
  const t = useTranslations('stay')
  const { hasPass } = usePassStatus()
  const unlocked = hasPass('live')

  if (stays.length === 0) {
    return (
      <div className="text-center py-20 text-stone">
        <div className="text-5xl mb-4">🏯</div>
        <p className="text-sm">{t('empty')}</p>
      </div>
    )
  }

  const freeFirst = stays.slice(0, 1)
  const blurredRest = stays.slice(1)

  return (
    <>
      {/* 첫 숙소 — 무료 공개 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {freeFirst.map((stay, i) => (
          <div
            key={stay.id}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-fadeUp"
          >
            <StayCard stay={stay} locale={locale} />
          </div>
        ))}
      </div>

      {/* 나머지 숙소 — live 패스 필요 시 블러 */}
      {blurredRest.length > 0 && (
        <div className="mt-6">
          <PassBlurOverlay requiredPass="live" blur={!unlocked}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blurredRest.map((stay, i) => (
                <div
                  key={stay.id}
                  style={{ animationDelay: `${(i + 1) * 60}ms` }}
                  className="animate-fadeUp"
                >
                  <StayCard stay={stay} locale={locale} />
                </div>
              ))}
            </div>
          </PassBlurOverlay>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.5s ease-out backwards;
        }
      `}</style>
    </>
  )
}
