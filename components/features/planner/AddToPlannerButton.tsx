'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { CrossTabToast } from './CrossTabToast'
import type { TabId } from '@/lib/data/cross-tab-recommendations'

interface AddToPlannerButtonProps {
  itemType: TabId | 'transport' | 'surprise'
  itemData: Record<string, unknown>
  cityId: string
  className?: string
  size?: 'sm' | 'md'
}

export function AddToPlannerButton({
  itemType,
  itemData,
  cityId,
  className = '',
  size = 'sm',
}: AddToPlannerButtonProps) {
  const t = useTranslations('planner')
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const [state, setState] = useState<'idle' | 'loading' | 'added' | 'removing' | 'login-required'>('idle')
  const [showToast, setShowToast] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [itemId, setItemId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (state === 'loading' || state === 'removing') return

    // 담김 상태에서 클릭 → 취소 확인 모달
    if (state === 'added') {
      setShowConfirm(true)
      return
    }

    setState('loading')
    try {
      const res = await fetch('/api/planner/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType, itemData, cityId }),
      })

      if (res.status === 401) {
        setState('login-required')
        setTimeout(() => {
          router.push(`/${locale}/auth/login?next=${pathname}`)
        }, 1200)
        return
      }

      if (!res.ok) {
        setState('idle')
        return
      }

      const data = (await res.json().catch(() => null)) as { itemId?: string } | null
      if (data?.itemId) setItemId(data.itemId)

      setState('added')
      window.dispatchEvent(new Event('planner:refresh'))
      if (['food', 'stay', 'diy', 'quest', 'ootd', 'goods'].includes(itemType)) {
        setShowToast(true)
      }
    } catch {
      setState('idle')
    }
  }

  const handleRemove = async () => {
    if (!itemId) {
      // itemId 없으면 그냥 idle 로 복귀 (UI 리셋)
      setState('idle')
      setShowConfirm(false)
      return
    }

    setState('removing')
    setShowConfirm(false)
    try {
      const res = await fetch(`/api/planner/items?itemId=${itemId}`, { method: 'DELETE' })
      if (res.ok) {
        setState('idle')
        setItemId(null)
        window.dispatchEvent(new Event('planner:refresh'))
      } else {
        setState('added')
      }
    } catch {
      setState('added')
    }
  }

  const baseClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs font-bold rounded-full'
      : 'px-4 py-2 text-sm font-bold rounded-full'

  const stateClasses = {
    idle: 'bg-mint-deep text-white hover:bg-[#7BC8BC]',
    loading: 'bg-mint text-white cursor-wait',
    added: hovered
      ? 'bg-blossom-light text-blossom-deep border border-blossom-deep'
      : 'bg-mint-light text-mint-deep border border-mint',
    removing: 'bg-mist text-stone cursor-wait',
    'login-required': 'bg-stone text-white',
  }

  const label = {
    idle: `+ ${t('addButton')}`,
    loading: t('adding'),
    added: hovered ? t('remove') : t('added'),
    removing: '...',
    'login-required': t('loginRequired'),
  }[state]

  return (
    <>
      <button
        onClick={handleAdd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={state === 'loading' || state === 'removing'}
        className={`${baseClasses} ${stateClasses[state]} transition-colors ${className}`}
      >
        {label}
      </button>

      {/* 취소 확인 모달 */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-xs w-full p-5 border border-mist">
            <p className="text-sm font-bold text-ink text-center mb-4">
              {t('removeConfirm')}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-full border border-mist text-sm font-bold text-slate hover:bg-cloud transition-colors"
              >
                {t('removeNo')}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex-1 py-2.5 rounded-full bg-red-500 text-sm font-bold text-white hover:bg-red-600 transition-colors"
              >
                {t('removeYes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && itemType !== 'transport' && itemType !== 'surprise' && (
        <CrossTabToast
          currentTab={itemType as TabId}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}
