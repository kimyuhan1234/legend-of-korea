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

  const [state, setState] = useState<'idle' | 'loading' | 'added' | 'login-required'>('idle')
  const [showToast, setShowToast] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (state === 'added' || state === 'loading') return

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

      setState('added')
      // 크로스 탭 토스트는 itemType이 TabId인 경우만
      if (['food', 'stay', 'diy', 'quest', 'ootd', 'goods'].includes(itemType)) {
        setShowToast(true)
      }
    } catch {
      setState('idle')
    }
  }

  const baseClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs font-bold rounded-full'
      : 'px-4 py-2 text-sm font-bold rounded-full'

  const stateClasses = {
    idle: 'bg-[#FF6B35] text-white hover:bg-[#E55A2B]',
    loading: 'bg-[#FFA070] text-white cursor-wait',
    added: 'bg-emerald-500 text-white',
    'login-required': 'bg-[#9CA3AF] text-white',
  }

  const label = {
    idle: `+ ${t('addButton')}`,
    loading: t('adding'),
    added: t('added'),
    'login-required': t('loginRequired'),
  }[state]

  return (
    <>
      <button
        onClick={handleClick}
        disabled={state === 'loading' || state === 'added'}
        className={`${baseClasses} ${stateClasses[state]} transition-colors ${className}`}
      >
        {label}
      </button>

      {showToast && itemType !== 'transport' && itemType !== 'surprise' && (
        <CrossTabToast
          currentTab={itemType as TabId}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}
