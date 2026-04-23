'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { PassCard } from './PassCard'
import { CreditPackCard } from './CreditPackCard'
import { PASSES, ALLINONE_SAVINGS, type PassId } from '@/lib/data/passes'
import { CREDIT_PACKS, CREDIT_COSTS } from '@/lib/data/credit-packs'

interface Props {
  locale: string
}

interface PassStatus {
  authenticated: boolean
  passes: PassId[]
  hasAllInOne: boolean
  creditsRemaining: number
}

export function PassPricingSection({ locale }: Props) {
  const t = useTranslations('pass')
  const router = useRouter()
  const [status, setStatus] = useState<PassStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPass, setProcessingPass] = useState<string | null>(null)
  const [processingPack, setProcessingPack] = useState<string | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const loadStatus = useCallback(async () => {
    try {
      const passRes = await fetch('/api/passes/status')
      if (passRes.ok) {
        const data = await passRes.json()
        setStatus(data)
      }
    } catch {
      // noop — 비로그인/네트워크 오류는 비회원 상태로 렌더
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadStatus() }, [loadStatus])

  const handlePurchasePass = async (passId: string) => {
    if (!status?.authenticated) {
      router.push(`/${locale}/auth/login`)
      return
    }
    setProcessingPass(passId)
    try {
      const res = await fetch('/api/passes/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passId }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast({ title: t('purchaseSuccess') })
        loadStatus()
      } else {
        toast({ variant: 'destructive', title: data?.error || 'purchase_failed' })
      }
    } catch {
      toast({ variant: 'destructive', title: 'network_error' })
    } finally {
      setProcessingPass(null)
    }
  }

  const handlePurchasePack = async (packId: string) => {
    if (!status?.authenticated) {
      router.push(`/${locale}/auth/login`)
      return
    }
    setProcessingPack(packId)
    try {
      const res = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageKey: packId }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast({ title: t('purchaseSuccess') })
        loadStatus()
      } else {
        toast({ variant: 'destructive', title: data?.error || 'purchase_failed' })
      }
    } catch {
      toast({ variant: 'destructive', title: 'network_error' })
    } finally {
      setProcessingPack(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-mint-deep" />
      </div>
    )
  }

  const ownedSet = new Set(status?.passes ?? [])
  const hasAllInOne = status?.hasAllInOne ?? false
  const savingsLabel = t('savings', { amount: ALLINONE_SAVINGS.toLocaleString() })

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 md:py-16 space-y-12">
      {/* 헤더 */}
      <div className="text-center space-y-2">
        <div className="text-5xl mb-2">🎫</div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800">{t('title')}</h1>
        <p className="text-sm text-slate-500">{t('subtitle')}</p>
      </div>

      {/* 패스 4개 — 아코디언 호버 확장 */}
      <div>
        <h2 className="text-xs font-black text-mint-deep uppercase tracking-widest mb-4 text-center">
          {t('sectionPasses')}
        </h2>
        {/* 데스크탑: 가로 아코디언 / 모바일: 세로 스택 */}
        <div className="flex flex-col md:flex-row md:items-stretch gap-3">
          {PASSES.map((pass, i) => (
            <div
              key={pass.id}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="min-w-0"
              style={{
                flexBasis: hoveredIdx === null ? '25%' : hoveredIdx === i ? '43%' : '19%',
                flexShrink: 1,
                flexGrow: 0,
                transition: 'flex-basis 300ms ease-in-out',
              }}
            >
              <PassCard
                pass={pass}
                locale={locale}
                isOwned={hasAllInOne || ownedSet.has(pass.id)}
                isProcessing={processingPass === pass.id}
                disabled={!!processingPass}
                savingsLabel={pass.id === 'allinone' ? savingsLabel : undefined}
                ownedLabel={t('owned')}
                purchaseLabel={t('purchase')}
                onPurchase={handlePurchasePass}
                layout="vertical"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 크레딧 팩 */}
      <div>
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 text-center">
          {t('orCredits')}
        </h2>
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          {CREDIT_PACKS.map((pack) => (
            <CreditPackCard
              key={pack.id}
              pack={pack}
              locale={locale}
              isProcessing={processingPack === pack.id}
              disabled={!!processingPack}
              purchaseLabel={t('purchase')}
              onPurchase={handlePurchasePack}
            />
          ))}
        </div>

        {/* 크레딧 소모 표 */}
        <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-4 max-w-2xl mx-auto">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
            {t('creditCosts')}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 font-bold">
            <span>AI {t('feature_ai_curation')} {CREDIT_COSTS.ai_curation}</span>
            <span>{t('feature_mission_unlock')} {CREDIT_COSTS.mission_unlock}</span>
            <span>{t('feature_retro_camera')} {CREDIT_COSTS.retro_camera}</span>
            <span>DIY {CREDIT_COSTS.diy_workshop}</span>
            <span>K-Food {CREDIT_COSTS.kfood_dupe}</span>
          </div>
        </div>
      </div>

      {/* LP 교환 섹션은 크레딧 UI 제거 방침에 따라 숨김 (1720 크레딧 토스트 경로) */}

      {/* 무료 체험 */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200/60 p-5 max-w-2xl mx-auto text-center">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> {t('free')}
        </h2>
        <p className="text-sm text-slate-700 font-bold mb-3">🆓 {t('freeDesc')}</p>
        <Link
          href={`/${locale}/story`}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white border-2 border-slate-300 text-slate-700 font-black text-xs hover:border-mint-deep hover:text-mint-deep transition-colors"
        >
          {t('tryFree')}
        </Link>
      </div>
    </section>
  )
}
