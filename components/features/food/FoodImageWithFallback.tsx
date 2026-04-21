'use client'

import Image from 'next/image'
import { useFoodImage } from '@/hooks/useFoodImage'

interface FoodImageWithFallbackProps {
  foodNameKo: string
  tags?: string[]
  fallbackUrl?: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  placeholderEmoji?: string
}

export function FoodImageWithFallback({
  foodNameKo,
  tags,
  fallbackUrl,
  alt,
  className = 'object-cover',
  sizes,
  priority,
  placeholderEmoji = '🍽️',
}: FoodImageWithFallbackProps) {
  const { image, loading, error, triggerFetch } = useFoodImage({
    name: foodNameKo,
    tags,
    fallbackUrl,
  })

  // 플레이스홀더 (모든 소스 실패)
  if (error || (!image && !loading)) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blossom-light to-mint">
        <span className="text-4xl select-none">{placeholderEmoji}</span>
      </div>
    )
  }

  // 로딩 스켈레톤
  if (loading || !image) {
    return <div className="absolute inset-0 bg-mist animate-pulse" />
  }

  const isRemote = image.source !== 'tour_api'

  return (
    <>
      <Image
        src={image.url}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        onError={triggerFetch}
      />
      {/* Pexels/Unsplash 출처 표기 */}
      {isRemote && image.photographer && (
        <a
          href={image.photographerUrl ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1 right-1 z-10 text-[9px] text-white/70 hover:text-white bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full transition-colors leading-tight"
          onClick={(e) => e.stopPropagation()}
        >
          📷 {image.source === 'pexels' ? 'Pexels' : 'Unsplash'}
        </a>
      )}
    </>
  )
}
