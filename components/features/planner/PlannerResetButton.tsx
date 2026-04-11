'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface PlannerResetButtonProps {
  itemCount: number
  onReset: () => void
}

export function PlannerResetButton({ itemCount, onReset }: PlannerResetButtonProps) {
  const t = useTranslations('planner')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState(false)

  const handleConfirm = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/planner/items?all=true', { method: 'DELETE' })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setError(data?.error ?? 'Reset failed')
        return
      }
      setOpen(false)
      setToast(true)
      onReset()
      window.dispatchEvent(new Event('planner:refresh'))
      setTimeout(() => setToast(false), 2500)
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const disabled = itemCount === 0

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-bold transition-colors ${
          disabled
            ? 'border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
            : 'border-red-300 text-red-600 bg-white hover:bg-red-50'
        }`}
      >
        {t('reset.button')}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !loading && setOpen(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-[#e8ddd0]/40">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-black text-[#111] mb-2">
                {t('reset.title')}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {t('reset.description', { n: itemCount })}
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center mb-3">{error}</p>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 py-3 rounded-full border-2 border-[#e8ddd0] text-sm font-bold text-[#374151] hover:bg-[#FAFAF9] transition-colors disabled:opacity-50"
              >
                {t('reset.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 py-3 rounded-full bg-red-500 text-sm font-bold text-white hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {loading ? '...' : t('reset.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-full bg-emerald-500 text-white font-bold shadow-lg text-sm">
          ✓ {t('reset.done')}
        </div>
      )}
    </>
  )
}
