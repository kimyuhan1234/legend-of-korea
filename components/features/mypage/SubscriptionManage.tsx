'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Loader2, Sparkles, XCircle, AlertTriangle, TrendingUp, Plus } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'
import { PASSES, type PassId, type PassI18n } from '@/lib/data/passes'
import { LP_TO_CREDIT_RATE } from '@/lib/data/credit-packs'

interface Props {
  locale: string
}

interface PassStatusResponse {
  authenticated: boolean
  passes: PassId[]
  hasAllInOne: boolean
  creditsRemaining: number
}

type I18nKey = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

function pickI18n(obj: PassI18n | Record<string, string>, locale: string): string {
  const k = locale as I18nKey
  return (obj as Record<string, string>)[k] || (obj as Record<string, string>).en || (obj as Record<string, string>).ko || ''
}

export function SubscriptionManage({ locale }: Props) {
  const t = useTranslations('mypage')
  const tPass = useTranslations('pass')
  const [status, setStatus] = useState<PassStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [userLp, setUserLp] = useState(0)
  const [cancelling, setCancelling] = useState(false)
  const [exchanging, setExchanging] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/passes/status')
      if (res.ok) {
        const data: PassStatusResponse = await res.json()
        setStatus(data)
        if (data.authenticated) {
          const sb = createClient()
          const { data: { user } } = await sb.auth.getUser()
          if (user) {
            const { data: row } = await sb
              .from('users')
              .select('total_lp')
              .eq('id', user.id)
              .single()
            setUserLp(row?.total_lp ?? 0)
          }
        }
      }
    } catch {
      // noop
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

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

  const handleExchange = async () => {
    if (userLp < LP_TO_CREDIT_RATE.lp) {
      toast({ variant: 'destructive', title: tPass('insufficientLp') })
      return
    }
    const batches = Math.floor(userLp / LP_TO_CREDIT_RATE.lp)
    const lpAmount = batches * LP_TO_CREDIT_RATE.lp
    setExchanging(true)
    try {
      const res = await fetch('/api/credits/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lpAmount }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast({ title: tPass('exchangeSuccess', { credits: data.creditsGained ?? 0 }) })
        load()
      } else {
        toast({ variant: 'destructive', title: data?.error || 'exchange_failed' })
      }
    } catch {
      toast({ variant: 'destructive', title: 'network_error' })
    } finally {
      setExchanging(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
      </div>
    )
  }

  if (!status || !status.authenticated) return null

  const ownedPasses = PASSES.filter((p) => status.passes.includes(p.id))
  const hasAny = ownedPasses.length > 0

  return (
    <div className="p-5">
      {hasAny ? (
        <div className="space-y-3">
          {/* 나의 패스 헤더 */}
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-mint-deep" />
            <span className="font-black text-slate-800">{tPass('myPasses')}</span>
          </div>

          {/* 활성 패스 목록 */}
          <div className="space-y-2">
            {ownedPasses.map((pass) => (
              <div
                key={pass.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-mint-deep/5 to-sky/5 border border-mint-deep/20"
              >
                <span className="text-2xl">{pass.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-800">{pass.name}</span>
                    <span className="inline-flex px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black">
                      {t('settings.sub.active')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic truncate">
                    {pickI18n(pass.tagline, locale)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-slate-700">
                    ₩{pass.price.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold">/ mo</p>
                </div>
              </div>
            ))}
          </div>

          {/* 크레딧 + LP */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                💎 {t('settings.sub.credits')}
              </p>
              <p className="text-lg font-black text-slate-800 mt-0.5">
                {status.creditsRemaining}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50/60 border border-amber-200/40 p-3">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
                💧 빗방울
              </p>
              <p className="text-lg font-black text-slate-800 mt-0.5">
                {userLp.toLocaleString()}
              </p>
            </div>
          </div>

          {/* LP 교환 버튼 */}
          {userLp >= LP_TO_CREDIT_RATE.lp && (
            <button
              onClick={handleExchange}
              disabled={exchanging}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 text-white font-black text-xs hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-1.5"
            >
              {exchanging ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TrendingUp className="w-3.5 h-3.5" />}
              {tPass('lpExchange')} ({LP_TO_CREDIT_RATE.lp} LP → {LP_TO_CREDIT_RATE.credits})
            </button>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-2">
            <Link
              href={`/${locale}/pass`}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-mint to-blossom text-ink font-black text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" /> {tPass('addMore')}
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex-1 py-2.5 rounded-xl border-2 border-rose-200 text-rose-500 font-bold text-xs hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" /> {t('settings.sub.cancel')}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center space-y-3">
          <p className="text-sm text-slate-500 font-bold">{t('settings.sub.noSub')}</p>
          <div className="py-3">
            <div className="text-lg font-black text-slate-800 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-mint-deep" /> {tPass('title')}
            </div>
            <p className="text-xs text-slate-500 mt-1">{tPass('subtitle')}</p>
          </div>
          <Link
            href={`/${locale}/pass`}
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
