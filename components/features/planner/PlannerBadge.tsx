'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

const REFRESH_EVENT = 'planner:refresh'

export function PlannerBadge() {
  const t = useTranslations('planner')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'
  const [count, setCount] = useState(0)

  const refresh = useCallback(() => {
    fetch('/api/planner/items')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.totalItems === 'number') {
          setCount(data.totalItems)
        }
      })
      .catch(() => {})
  }, [])

  // pathname 변경 시 재조회
  useEffect(() => {
    refresh()
  }, [pathname, refresh])

  // 담기 이벤트 리스너 (AddToPlannerButton에서 dispatchEvent로 호출)
  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener(REFRESH_EVENT, handler)
    return () => window.removeEventListener(REFRESH_EVENT, handler)
  }, [refresh])

  if (count === 0) return null

  return (
    <Link
      href={`/${locale}/planner`}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9DD8CE]/10 border border-[#9DD8CE]/20 hover:bg-[#9DD8CE]/15 transition-colors"
      title={t('badge')}
    >
      <span className="text-base">📋</span>
      <span className="text-xs font-black text-[#9DD8CE]">{count}</span>
    </Link>
  )
}
