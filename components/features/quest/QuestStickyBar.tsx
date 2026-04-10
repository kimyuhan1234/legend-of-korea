'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface QuestStickyBarProps {
  courseId: string
  title: string
  price: number
  locale: string
  isLoggedIn: boolean
  kitId?: string
}

export function QuestStickyBar({ courseId, title, price, locale, isLoggedIn, kitId }: QuestStickyBarProps) {
  const t = useTranslations('quest')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  const href = kitId
    ? (isLoggedIn
        ? `/${locale}/courses/${courseId}/purchase?kit=${kitId}`
        : `/${locale}/auth/login?next=/${locale}/courses/${courseId}/purchase?kit=${kitId}`)
    : '#kit-section'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#111] truncate">{title}</p>
          <p className="text-xs text-[#6B7280]">₩{price.toLocaleString()}~</p>
        </div>
        <Link
          href={href}
          className="shrink-0 px-6 py-2.5 rounded-full bg-[#FF6B35] text-white text-sm font-bold hover:bg-[#E55A2B] transition-colors"
        >
          {t('sticky.buy')}
        </Link>
      </div>
    </div>
  )
}
