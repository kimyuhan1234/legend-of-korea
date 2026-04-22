'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { PassRequiredModal } from '@/components/shared/PassRequiredModal'

interface QuestStickyBarProps {
  courseId: string
  title: string
  price: number
  locale: string
  isLoggedIn: boolean
  kitId?: string
  cityId: string
}

export function QuestStickyBar({ courseId, title, price, locale, isLoggedIn, kitId, cityId }: QuestStickyBarProps) {
  const _t = useTranslations('quest')
  const tp = useTranslations('planner')
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [addState, setAddState] = useState<'idle' | 'loading' | 'added' | 'error'>('idle')
  const [showPassModal, setShowPassModal] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 이미 담긴 상태인지 초기 체크
  useEffect(() => {
    let mounted = true
    if (!isLoggedIn) return
    fetch('/api/planner/items')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!mounted || !data?.plans) return
        const alreadyAdded = (data.plans as Array<{ plan_items: Array<{ item_type: string; item_data: Record<string, unknown> }> }>)
          .some((p) =>
            p.plan_items?.some(
              (i) => i.item_type === 'quest' && i.item_data?.courseId === courseId
            )
          )
        if (alreadyAdded) setAddState('added')
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [isLoggedIn, courseId])

  const handleAddToPlanner = async () => {
    if (addState === 'loading' || addState === 'added') return
    if (!isLoggedIn) {
      router.push(`/${locale}/auth/login?next=/${locale}/courses/${courseId}`)
      return
    }

    setAddState('loading')
    try {
      const res = await fetch('/api/planner/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'quest',
          cityId,
          itemData: {
            courseId,
            courseName: title,
            price,
            kitId: kitId ?? null,
          },
        }),
      })
      if (res.status === 403) {
        setAddState('idle')
        setShowPassModal(true)
        return
      }
      if (!res.ok) {
        setAddState('error')
        setTimeout(() => setAddState('idle'), 2500)
        return
      }
      setAddState('added')
      window.dispatchEvent(new Event('planner:refresh'))
    } catch {
      setAddState('error')
      setTimeout(() => setAddState('idle'), 2500)
    }
  }

  const passModal = showPassModal ? (
    <PassRequiredModal
      locale={locale}
      passId="story"
      onClose={() => setShowPassModal(false)}
    />
  ) : null

  if (!visible) return passModal

  const subscribeLabel = locale === 'ko' ? '구독 시작' : locale === 'ja' ? 'サブスク開始' : 'Subscribe'
  const priceLabel = locale === 'ko' ? '₩6,900/월' : locale === 'ja' ? '¥750/月' : '$5/mo'

  // 플래너 버튼 상태별 스타일
  const plannerBtn = {
    idle: {
      cls: 'border-mint-deep text-mint-deep hover:bg-snow',
      label: tp('addToPlanner'),
      labelShort: tp('addShort'),
    },
    loading: {
      cls: 'border-mint text-mint cursor-wait',
      label: tp('adding'),
      labelShort: tp('adding'),
    },
    added: {
      cls: 'border-emerald-500 text-emerald-600 bg-emerald-50',
      label: tp('alreadyAdded'),
      labelShort: tp('alreadyAdded'),
    },
    error: {
      cls: 'border-red-500 text-red-500',
      label: '⚠',
      labelShort: '⚠',
    },
  }[addState]

  return (
    <>
      {passModal}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-mist shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-shrink">
          <p className="text-sm font-bold text-[#111] truncate">{title}</p>
          <p className="text-xs text-mint-deep font-bold">{priceLabel}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToPlanner}
            disabled={addState === 'loading' || addState === 'added'}
            className={`shrink-0 px-3 sm:px-5 py-2.5 rounded-full border-2 bg-white text-xs sm:text-sm font-bold transition-colors ${plannerBtn.cls}`}
          >
            <span className="hidden sm:inline">{plannerBtn.label}</span>
            <span className="sm:hidden">{plannerBtn.labelShort}</span>
          </button>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/courses/${courseId}/purchase`)}
            className="shrink-0 px-4 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-mint to-mint-deep text-white text-xs sm:text-sm font-bold hover:opacity-90 transition whitespace-nowrap"
          >
            {subscribeLabel}
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
