'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { X, Sprout } from 'lucide-react'

const SESSION_KEY = 'founding-banner-dismissed'

interface CountData {
  joined: number
  target: number
  remaining: number
  isFull: boolean
}

/**
 * 페이지 상단 노출되는 Founding Members 모집 배너.
 * - 정원 도달 (isFull) 시 자동 숨김
 * - 사용자 dismiss 시 sessionStorage 에 저장하여 동일 세션 재노출 방지
 * - count API 실패 시 조용히 숨김
 */
export function FoundingMembersBanner() {
  const t = useTranslations('beta.banner')

  const [count, setCount] = useState<CountData | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') {
        setDismissed(true)
        return
      }
    } catch {
      // sessionStorage 접근 실패 시 그냥 노출
    }

    fetch('/api/founding-members/count')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && typeof data.joined === 'number') setCount(data)
      })
      .catch(() => {
        // 조용히 숨김
      })
  }, [])

  if (dismissed || !count || count.isFull) return null

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // ignore
    }
    setDismissed(true)
  }

  return (
    <div className="bg-gradient-to-r from-sky-100 to-sky-50 border-b border-sky-200">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3 text-sm">
        <p className="flex items-center gap-2 min-w-0">
          <Sprout className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.8} aria-hidden />
          <span className="truncate">
            {t('message', { joined: count.joined, target: count.target })}
          </span>
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="opacity-60 hover:opacity-100 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
