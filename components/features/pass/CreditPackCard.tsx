'use client'

import { Loader2 } from 'lucide-react'
import type { CreditPack } from '@/lib/data/credit-packs'
import { getTotalCredits } from '@/lib/data/credit-packs'

interface Props {
  pack: CreditPack
  locale: string
  isProcessing?: boolean
  disabled?: boolean
  purchaseLabel: string
  onPurchase: (packId: string) => void
}

type I18nKey = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

function pick(obj: Record<string, string> | undefined, locale: string): string {
  if (!obj) return ''
  const k = locale as I18nKey
  return obj[k] || obj.en || obj.ko || ''
}

export function CreditPackCard({
  pack,
  locale,
  isProcessing,
  disabled,
  purchaseLabel,
  onPurchase,
}: Props) {
  const label = pick(pack.label, locale)
  const badge = pack.badge ? pick(pack.badge, locale) : null
  const total = getTotalCredits(pack)

  return (
    <div className="relative rounded-2xl p-4 border-2 border-mist/60 bg-white shadow-sm hover:shadow-md hover:border-mint-deep/40 transition-all">
      {badge && (
        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-mint-deep text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
          {badge}
        </span>
      )}

      <div className="text-center mb-3">
        <div className="text-3xl mb-1.5">💎</div>
        <p className="text-sm font-black text-slate-700">{label}</p>
        {pack.bonus > 0 && (
          <p className="text-[10px] text-mint-deep font-bold mt-0.5">
            +{pack.bonus} BONUS
          </p>
        )}
      </div>

      <p className="text-center text-xl font-black text-slate-800 mb-3">
        ₩{pack.price.toLocaleString()}
      </p>

      <button
        type="button"
        onClick={() => onPurchase(pack.id)}
        disabled={disabled || isProcessing}
        className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
      >
        {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {purchaseLabel}
      </button>

      {/* 계산용 숨은 값 — total credits */}
      <span className="sr-only">{total} credits</span>
    </div>
  )
}
