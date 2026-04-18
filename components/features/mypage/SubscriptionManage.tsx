'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Loader2, Sparkles, XCircle, AlertTriangle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface Props {
  locale: string
}

interface Subscription {
  id: string
  status: string
  current_period_end: string
  credits_remaining: number
  subscription_plans: {
    name: Record<string, string> | string
    price: number
    monthly_credits: number | null
  } | null
}

interface SubStatus {
  subscribed: boolean
  subscription?: Subscription
  freePlan?: { id: string; price: number; name: Record<string, string> | string }
}

function getI18n(v: Record<string, string> | string | undefined, locale: string): string {
  if (!v) return ''
  if (typeof v === 'string') return v
  return v[locale] || v.en || v.ko || ''
}

export function SubscriptionManage({ locale }: Props) {
  const t = useTranslations('mypage')
  const [status, setStatus] = useState<SubStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const load = () => {
    setLoading(true)
    fetch('/api/subscription/status')
      .then((r) => r.json())
      .then((data) => setStatus(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        toast({ title: t('settings.sub.cancelled') })
        load()
        setShowConfirm(false)
      } else {
        toast({ variant: 'destructive', title: data.error || 'Failed' })
      }
    } catch {
      toast({ variant: 'destructive', title: 'Failed' })
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
      </div>
    )
  }

  if (!status) return null

  const isActive = status.subscribed && status.subscription
  const sub = status.subscription

  return (
    <div className="p-5">
      {isActive && sub ? (
        <div className="bg-gradient-to-br from-mint-deep/5 to-sky/5 border border-mint-deep/20 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-mint-deep" />
            <span className="font-black text-slate-800">
              {getI18n(sub.subscription_plans?.name, locale)}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
              🟢 {t('settings.sub.active')}
            </span>
          </div>

          <div className="text-2xl font-black text-slate-800">
            ₩{(sub.subscription_plans?.price || 0).toLocaleString()}
            <span className="text-xs text-slate-400 font-bold ml-1">/ mo</span>
          </div>

          <div className="space-y-1.5 text-sm pt-2 border-t border-mint-deep/10">
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold">{t('settings.sub.nextBilling')}</span>
              <span className="text-slate-700 font-black">
                {new Date(sub.current_period_end).toLocaleDateString()}
              </span>
            </div>
            {sub.subscription_plans?.monthly_credits !== null && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">{t('settings.sub.credits')}</span>
                <span className="text-slate-700 font-black">
                  {sub.credits_remaining} / {sub.subscription_plans?.monthly_credits}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-full mt-3 py-2.5 rounded-xl border-2 border-rose-200 text-rose-500 font-bold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4" /> {t('settings.sub.cancel')}
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center space-y-3">
          <p className="text-sm text-slate-500 font-bold">{t('settings.sub.noSub')}</p>
          <div className="py-3">
            <div className="text-lg font-black text-slate-800 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-mint-deep" /> {t('digitalPass')}
            </div>
            <p className="text-2xl font-black text-mint-deep mt-1">
              ₩6,900<span className="text-xs text-slate-400 ml-1">/ mo</span>
            </p>
          </div>
          <Link
            href={`/${locale}/story`}
            className="inline-flex items-center gap-1.5 w-full justify-center py-2.5 rounded-xl bg-gradient-to-br from-mint to-blossom text-ink font-black text-sm hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" /> {t('settings.sub.start')}
          </Link>
        </div>
      )}

      {/* 해지 확인 모달 */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => !cancelling && setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <h3 className="font-black text-slate-800">{t('settings.sub.cancel')}</h3>
            </div>
            <p className="text-sm text-slate-500">
              {t('settings.sub.cancelConfirm')}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                {t('cancelButton')}
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl font-black text-sm hover:bg-rose-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
              >
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : t('settings.sub.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
