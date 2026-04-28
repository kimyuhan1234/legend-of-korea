'use client'

import { useTranslations, useLocale } from 'next-intl'
import { type Pass } from '@/lib/data/passes'
import { formatPriceParts } from '@/lib/currency'

interface Props {
  pass: Pass
}

/**
 * PRD-PRICING-2026-001 §8 — 3 패스 카드.
 * Standard 패스에만 most_popular 배지. KRW + 환산 표시는 lib/currency formatPriceParts.
 * 결제 흐름은 Phase G 의 /pricing/checkout 페이지 또는 직접 Toss Widget 마운트.
 */
export function PassCard({ pass }: Props) {
  const t = useTranslations('pricing')
  const locale = useLocale()
  const { primary, secondary } = formatPriceParts(pass.priceKrw, locale)

  const isPopular = pass.badge === 'most_popular'
  const dailyKrw = Math.round(pass.priceKrw / pass.durationDays)

  return (
    <div
      className={`relative p-6 rounded-3xl border transition-all ${
        isPopular
          ? 'bg-blossom-deep text-white border-blossom shadow-2xl scale-[1.02]'
          : 'bg-white text-ink border-mist'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-mint-deep text-white text-xs font-bold rounded-full">
          {t('badge.most_popular')}
        </div>
      )}

      <h3 className="text-xl font-black mb-1">{t(`passes.${pass.type}.name`)}</h3>
      <p className={`text-xs mb-4 ${isPopular ? 'text-white/80' : 'text-stone'}`}>
        {t(`passes.${pass.type}.target`)}
      </p>

      <div className="mb-5">
        <p className="text-3xl font-black">{primary}</p>
        {secondary && (
          <p className={`text-xs mt-0.5 ${isPopular ? 'text-white/70' : 'text-stone'}`}>
            {secondary}
          </p>
        )}
        <p className={`text-xs mt-2 ${isPopular ? 'text-white/80' : 'text-stone'}`}>
          {t('passes.duration', { days: pass.durationDays })} · {t('passes.daily', { daily: dailyKrw.toLocaleString() })}
        </p>
      </div>

      <ul className="space-y-1.5 mb-6">
        {pass.features.map((feat) => (
          <li key={feat} className={`flex items-start gap-2 text-xs ${isPopular ? 'text-white/90' : 'text-slate-700'}`}>
            <span aria-hidden>✓</span>
            <span>{t(`features.${feat}`)}</span>
          </li>
        ))}
      </ul>

      <a
        href={`/${locale}/pass/checkout?type=${pass.type}`}
        className={`block w-full py-3 rounded-xl font-bold text-center text-sm transition-colors ${
          isPopular
            ? 'bg-white text-blossom-deep hover:bg-cloud'
            : 'bg-blossom-deep text-white hover:bg-blossom'
        }`}
      >
        {t('cta_buy')}
      </a>
    </div>
  )
}
