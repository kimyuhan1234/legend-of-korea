'use client'

import type { ImageSource } from '@/lib/food-image/types'

interface PhotoAttributionProps {
  source: ImageSource
  photographer?: string
  photographerUrl?: string
}

export function PhotoAttribution({ source, photographer, photographerUrl }: PhotoAttributionProps) {
  if ((source !== 'pexels' && source !== 'unsplash') || !photographer) return null
  const platformName = source === 'pexels' ? 'Pexels' : 'Unsplash'
  return (
    <a
      href={photographerUrl ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-1 right-1 z-10 text-[9px] text-white/70 hover:text-white bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full transition-colors leading-tight"
      onClick={(e) => e.stopPropagation()}
    >
      📷 {platformName}
    </a>
  )
}
