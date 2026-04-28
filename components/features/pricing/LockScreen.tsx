'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Lock } from 'lucide-react'

export type LockType =
  | 'mission_second'
  | 'kfood_dupe_match'
  | 'kfood_beauty'
  | 'kfood_fusion'
  | 'spot_full'
  | 'generic'

interface Props {
  /** 어떤 잠금 화면 — i18n 카피가 messages.pricing.lockScreen.{type} 으로 분기 */
  type: LockType
}

/**
 * PRD-PRICING-2026-001 §6 — 잠금 화면 (6 종).
 *
 * - 모든 유료 콘텐츠 (K-Food 듀프매칭 / 뷰티푸드 / 퓨전 / SPOT 풀버전 / 두 번째 미션)
 *   에 패스 미보유 사용자가 도달했을 때 노출
 * - CTA → /pass 페이지
 * - 카피는 messages/{locale}.json 의 pricing.lockScreen 네임스페이스
 */
export function LockScreen({ type }: Props) {
  const t = useTranslations('pricing.lockScreen')
  const locale = useLocale()

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] p-8 bg-gradient-to-br from-blossom-light to-mint-light rounded-3xl">
      <Lock className="w-12 h-12 text-blossom-deep mb-4" aria-hidden />
      <h2 className="text-xl md:text-2xl font-black mb-3 text-center text-ink whitespace-pre-line">
        {t(`${type}.title`)}
      </h2>
      <p className="text-sm md:text-base text-stone mb-7 text-center whitespace-pre-line max-w-md leading-relaxed">
        {t(`${type}.description`)}
      </p>
      <Link
        href={`/${locale}/pass`}
        className="px-6 py-3 bg-blossom-deep text-white rounded-xl font-bold text-sm hover:bg-blossom transition-colors shadow-md"
      >
        {t('cta')}
      </Link>
    </div>
  )
}
