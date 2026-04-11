'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { CROSS_TAB_MAP, type TabId } from '@/lib/data/cross-tab-recommendations'

interface CrossTabToastProps {
  currentTab: TabId
  onClose: () => void
}

export function CrossTabToast({ currentTab, onClose }: CrossTabToastProps) {
  const t = useTranslations('planner')
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const rec = CROSS_TAB_MAP[currentTab]

  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const handleGo = () => {
    router.push(`/${locale}${rec.primary.path}`)
    onClose()
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md animate-slideUp">
      <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-[#FF6B35]/20 p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl shrink-0">{rec.primary.emoji}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#FF6B35] uppercase tracking-widest mb-1">
              {t('toastTitle')}
            </p>
            <p className="text-sm text-[#111] font-semibold leading-snug">
              {t(`cross.${rec.primary.targetTab}` as Parameters<typeof t>[0])}
            </p>
          </div>
          <button
            onClick={handleGo}
            className="shrink-0 px-3 py-1.5 rounded-full bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E55A2B] transition-colors"
          >
            {t('toastGoTo')} →
          </button>
          <button
            onClick={onClose}
            className="shrink-0 w-6 h-6 rounded-full text-[#9CA3AF] hover:text-[#111] text-xs"
            aria-label={t('toastClose')}
          >
            ✕
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  )
}
