'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  const t = useTranslations('quest')
  const tp = useTranslations('planner')
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [addState, setAddState] = useState<'idle' | 'loading' | 'added' | 'error'>('idle')

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

  if (!visible) return null

  const href = kitId
    ? (isLoggedIn
        ? `/${locale}/courses/${courseId}/purchase?kit=${kitId}`
        : `/${locale}/auth/login?next=/${locale}/courses/${courseId}/purchase?kit=${kitId}`)
    : '#kit-section'

  // 플래너 버튼 상태별 스타일
  const plannerBtn = {
    idle: {
      cls: 'border-[#9DD8CE] text-[#9DD8CE] hover:bg-[#FAFBFC]',
      label: tp('addToPlanner'),
      labelShort: tp('addShort'),
    },
    loading: {
      cls: 'border-[#B8E8E0] text-[#B8E8E0] cursor-wait',
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
      label: '⚠ 실패',
      labelShort: '⚠',
    },
  }[addState]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E4E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-shrink">
          <p className="text-sm font-bold text-[#111] truncate">{title}</p>
          <p className="text-xs text-[#6B7280]">₩{price.toLocaleString()}~</p>
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
          <Link
            href={href}
            className="shrink-0 px-4 sm:px-6 py-2.5 rounded-full bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-[#1F2937] text-xs sm:text-sm font-bold hover:bg-[#7BC8BC] transition-colors whitespace-nowrap"
          >
            {t('sticky.buy')}
          </Link>
        </div>
      </div>
    </div>
  )
}
