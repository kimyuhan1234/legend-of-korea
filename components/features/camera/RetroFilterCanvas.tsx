'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, Sparkles } from 'lucide-react'
import { FilterSelector } from './FilterSelector'
import { RETRO_FILTERS, applyFilterToCanvas } from '@/lib/camera/filters'

interface Props {
  imageFile: File
  onApply: (filterId: string) => void
  onSkip: () => void
  onCancel: () => void
  locale: string
}

export function RetroFilterCanvas({ imageFile, onApply, onSkip, onCancel, locale }: Props) {
  const t = useTranslations('camera')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [filterId, setFilterId] = useState('original')
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null)
  const [processing, setProcessing] = useState(false)

  // Load image from File
  useEffect(() => {
    const img = new globalThis.Image()
    const url = URL.createObjectURL(imageFile)
    img.src = url
    img.onload = () => setImageEl(img)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  // Redraw canvas when filter or image changes
  useEffect(() => {
    if (!imageEl || !canvasRef.current) return
    const filter = RETRO_FILTERS.find((f) => f.id === filterId) ?? RETRO_FILTERS[0]
    applyFilterToCanvas(canvasRef.current, imageEl, filter)
  }, [imageEl, filterId])

  const handleApply = () => {
    setProcessing(true)
    // Small delay so the UI shows processing state before heavy Canvas work in parent
    requestAnimationFrame(() => onApply(filterId))
  }

  return (
    <div className="space-y-4">
      {/* Canvas preview */}
      <div className="rounded-2xl overflow-hidden border-2 border-mist bg-slate-50 shadow-sm">
        {!imageEl ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-auto" />
        )}
      </div>

      {/* Filter selector */}
      <FilterSelector selectedFilter={filterId} onSelect={setFilterId} locale={locale} />

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-2xl border-2 border-mist bg-white text-[#111] font-bold text-sm hover:bg-slate-50 transition-colors"
        >
          {t('filter.cancel')}
        </button>
        <button
          onClick={onSkip}
          className="py-3 px-4 rounded-2xl text-sm font-bold text-stone hover:text-[#111] underline underline-offset-2 transition-colors"
        >
          {t('filter.skip')}
        </button>
        <button
          onClick={handleApply}
          disabled={processing}
          className="flex-[2] py-3 rounded-2xl bg-gradient-to-br from-mint to-blossom text-ink font-black text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
        >
          {processing ? (
            <><Loader2 className="w-4 h-4 animate-spin" />{t('filter.processing')}</>
          ) : (
            <><Sparkles className="w-4 h-4" />{t('filter.apply')}</>
          )}
        </button>
      </div>
    </div>
  )
}
