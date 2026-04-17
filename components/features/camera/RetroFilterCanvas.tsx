'use client'

import { useEffect, useRef } from 'react'
import { RETRO_FILTERS, applyFilterToCanvas } from '@/lib/camera/filters'

interface Props {
  src: string
  filterId: string
  className?: string
}

export function RetroFilterCanvas({ src, filterId, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const filter = RETRO_FILTERS.find((f) => f.id === filterId) ?? RETRO_FILTERS[0]
    const img = new globalThis.Image()
    img.src = src

    img.onload = () => {
      applyFilterToCanvas(canvas, img, filter)
    }
  }, [src, filterId])

  return <canvas ref={canvasRef} className={`w-full h-auto ${className}`} />
}
