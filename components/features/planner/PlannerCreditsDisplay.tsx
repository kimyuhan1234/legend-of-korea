'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CREDIT_PACKS, getTotalCredits, type CreditPackId } from '@/lib/data/credit-packs'

interface PlannerCreditsDisplayProps {
  credits: number
  monthlyCredits: number
  resetAt: string | null
  locale: string
  onCreditsChanged: () => void
}

type I18nKey = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

function pickLabel(obj: Record<string, string>, locale: string): string {
  const k = locale as I18nKey
  return obj[k] || obj.en || obj.ko || ''
}

function formatResetDate(iso: string | null, locale: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const month = d.getMonth() + 1
  const day = d.getDate()
  if (locale === 'en') return `${month}/${day}`
  if (locale === 'ja') return `${month}月${day}日`
  return `${month}월 ${day}일`
}

export function PlannerCreditsDisplay({
  credits,
  monthlyCredits,
  resetAt,
  locale,
  onCreditsChanged,
}: PlannerCreditsDisplayProps) {
  const t = useTranslations('planner')
  const [modalOpen, setModalOpen] = useState(false)
  const [purchasingKey, setPurchasingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const low = monthlyCredits > 0 ? credits < Math.max(1, monthlyCredits * 0.2) : credits < 5
  const resetLabel = formatResetDate(resetAt, locale)

  const handlePurchase = async (packageKey: CreditPackId) => {
    setError(null)
    setPurchasingKey(packageKey)
    try {
      const res = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageKey }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setError(data?.error ?? 'purchase_failed')
        return
      }
      setModalOpen(false)
      onCreditsChanged()
    } catch {
      setError('network_error')
    } finally {
      setPurchasingKey(null)
    }
  }

  return (
    <>
      <section>
        <div
          className={`rounded-3xl p-5 border ${
            low
              ? 'bg-red-50 border-red-200'
              : 'bg-white border-mist/40'
          }`}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <p className="text-[10px] font-black text-mint-deep uppercase tracking-widest mb-1">
                🎫 {t('credits.title')}
              </p>
              <p className={`text-2xl font-black ${low ? 'text-red-600' : 'text-[#111]'}`}>
                {credits}
                <span className="text-sm font-bold text-stone ml-1">
                  / {t('credits.remaining', { n: credits })}
                </span>
              </p>
              {resetLabel && (
                <p className="text-[11px] text-[#6B7280] mt-1">
                  {t('credits.resetAt', { date: resetLabel })}
                </p>
              )}
              {low && (
                <p className="text-[11px] font-bold text-red-600 mt-1">
                  ⚠ {t('credits.insufficient')}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="shrink-0 px-4 py-2 rounded-full bg-gradient-to-br from-mint to-blossom text-ink text-xs font-bold hover:bg-[#7BC8BC] transition-colors"
            >
              {t('credits.buy')}
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !purchasingKey && setModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-mist/40">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">🎫</div>
              <h3 className="text-lg font-black text-[#111] mb-1">
                {t('credits.buy')}
              </h3>
              <p className="text-xs text-[#6B7280]">{t('credits.modalSub')}</p>
            </div>

            <div className="space-y-3 mb-4">
              {CREDIT_PACKS.map((pkg) => {
                const isPurchasing = purchasingKey === pkg.id
                const totalCredits = getTotalCredits(pkg)
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    disabled={!!purchasingKey}
                    onClick={() => handlePurchase(pkg.id)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-4 rounded-2xl border-2 border-mist bg-white hover:border-mint-deep hover:bg-snow transition-colors disabled:opacity-50 disabled:cursor-wait"
                  >
                    <div className="text-left">
                      <p className="text-base font-black text-[#111]">
                        {pickLabel(pkg.label, locale)}
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        {pkg.badge ? pickLabel(pkg.badge, locale) : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-mint-deep">
                        ₩{pkg.price.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-stone">
                        {totalCredits} {t('credits.unit')}
                        {isPurchasing && ` · ${t('credits.purchasing')}`}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center mb-3">
                {error === 'subscription_required'
                  ? t('credits.subRequired')
                  : t('credits.purchaseFailed')}
              </p>
            )}

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={!!purchasingKey}
              className="w-full py-3 rounded-full border-2 border-mist text-sm font-bold text-[#374151] hover:bg-snow transition-colors disabled:opacity-50"
            >
              {t('credits.close')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
