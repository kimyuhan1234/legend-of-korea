'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Pass } from '@/lib/data/passes'
import { invalidatePassStatusCache } from '@/hooks/usePassStatus'

interface Props {
  pass: Pass
  userId: string
  userEmail: string | null
  userName: string
  locale: string
}

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm'

/**
 * PRD-PRICING-2026-001 Phase G — Toss 결제 위젯 + 패스 구매 wiring.
 *
 * TEST_MODE=true (NEXT_PUBLIC_TEST_MODE):
 *   - 결제 위젯 스킵 → 즉시 /api/passes/purchase 호출 (paymentKey=null)
 *   - 베타 운영 중 결제 흐름 검증용
 *
 * TEST_MODE=false (정식 출시):
 *   - Toss 위젯 마운트 → requestPayment → successUrl 진입
 *   - successUrl 측에서 /api/payments/toss/confirm 호출 (별도 흐름)
 */
export function CheckoutClient({ pass, userId, userEmail, userName, locale }: Props) {
  const t = useTranslations('pricing.checkout')
  const widgetsRef = useRef<unknown>(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  useEffect(() => {
    if (isTestMode) return

    let cancelled = false
    ;(async () => {
      try {
        const { loadTossPayments } = await import('@tosspayments/tosspayments-sdk')
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY)
        if (cancelled) return

        const widgets = tossPayments.widgets({ customerKey: userId })
        widgetsRef.current = widgets

        await widgets.setAmount({ value: pass.priceKrw, currency: 'KRW' })
        await widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' })
        await widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' })

        if (!cancelled) setReady(true)
      } catch (e) {
        console.error('[Toss init]', e)
        if (!cancelled) setError(t('error.init_failed'))
      }
    })()

    return () => { cancelled = true }
  }, [userId, pass.priceKrw, isTestMode, t])

  const handlePayment = async () => {
    setError(null)
    setLoading(true)

    // TEST_MODE — 즉시 패스 발급
    if (isTestMode) {
      try {
        const res = await fetch('/api/passes/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: pass.type, paymentKey: null }),
        })
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string }
          if (data.error === 'already_active') {
            setError(data.message ?? t('error.already_active'))
          } else {
            setError(t('error.purchase_failed'))
          }
          setLoading(false)
          return
        }
        invalidatePassStatusCache()
        window.location.href = `/${locale}/pass/success?type=${pass.type}`
      } catch (e) {
        console.error('[TEST_MODE purchase]', e)
        setError(t('error.purchase_failed'))
        setLoading(false)
      }
      return
    }

    // 실 결제 — Toss 위젯
    const widgets = widgetsRef.current as { requestPayment?: (params: Record<string, unknown>) => Promise<void> } | null
    if (!widgets?.requestPayment) {
      setError(t('error.not_ready'))
      setLoading(false)
      return
    }

    try {
      const orderId = `pass_${pass.type}_${userId}_${Date.now()}`
      await widgets.requestPayment({
        orderId,
        orderName: `Clouds with you ${pass.type.toUpperCase()} Pass (${pass.durationDays} days)`,
        customerName: userName,
        customerEmail: userEmail ?? undefined,
        successUrl: `${window.location.origin}/${locale}/pass/success?type=${pass.type}`,
        failUrl: `${window.location.origin}/${locale}/pass/fail`,
      })
    } catch (e) {
      console.error('[Toss requestPayment]', e)
      setError(e instanceof Error ? e.message : t('error.payment_failed'))
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
      <h1 className="text-2xl font-black mb-6">{t('title')}</h1>

      {/* 패스 요약 */}
      <div className="bg-cloud rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold">{t(`passes.${pass.type}.name`)}</span>
          <span className="text-2xl font-black">₩{pass.priceKrw.toLocaleString()}</span>
        </div>
        <p className="text-sm text-stone">{t('duration', { days: pass.durationDays })}</p>
      </div>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-red-700 text-sm">
          {error}
        </div>
      )}

      {isTestMode && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-5 text-amber-900 text-sm">
          🧪 {t('test_mode_notice')}
        </div>
      )}

      {!isTestMode && (
        <>
          <div id="payment-method" className="mb-4" />
          <div id="agreement" className="mb-6" />
        </>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading || (!ready && !isTestMode)}
        className="w-full py-4 rounded-xl bg-blossom-deep text-white font-bold text-base hover:bg-blossom transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t('processing') : isTestMode ? t('test_mode_cta') : t('cta')}
      </button>
    </div>
  )
}
