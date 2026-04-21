'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useFoodImage } from '@/hooks/useFoodImage'
import { FoodImagePlaceholder } from '@/components/features/food/FoodImagePlaceholder'
import { PhotoAttribution } from '@/components/features/food/PhotoAttribution'

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
  placeholderEmoji,
}: FoodImageWithFallbackProps) {
  const [staticImageFailed, setStaticImageFailed] = useState(false)

  // 정적 이미지가 없거나 실패하면 Pexels API 호출
  const shouldUsePexels = !fallbackUrl || staticImageFailed

  const { image: pexelsImage, loading: pexelsLoading } = useFoodImage({
    name: foodNameKo,
    tags,
    enabled: shouldUsePexels,
  })

  const [pexelsImageFailed, setPexelsImageFailed] = useState(false)

  const resolvedSizes = sizes ?? '(max-width: 768px) 50vw, 25vw'

  // 1단계: 정적 이미지
  if (fallbackUrl && !staticImageFailed) {
    return (
      <Image
        src={fallbackUrl}
        alt={alt}
        fill
        className={className}
        sizes={resolvedSizes}
        priority={priority}
        onError={() => setStaticImageFailed(true)}
      />
    )
  }

  // 2단계: Pexels 로딩 중
  if (pexelsLoading) {
    return <div className="absolute inset-0 bg-mist animate-pulse" />
  }

  // 3단계: Pexels/Unsplash 이미지 표시
  if (pexelsImage?.url && !pexelsImageFailed) {
    const isRemote = pexelsImage.source === 'pexels' || pexelsImage.source === 'unsplash'
    return (
      <>
        <Image
          src={pexelsImage.url}
          alt={alt}
          fill
          className={className}
          sizes={resolvedSizes}
          priority={priority}
          unoptimized={isRemote}
          onError={() => setPexelsImageFailed(true)}
        />
        <PhotoAttribution
          source={pexelsImage.source}
          photographer={pexelsImage.photographer}
          photographerUrl={pexelsImage.photographerUrl}
        />
      </>
    )
  }

  // 4단계: 최종 플레이스홀더
  return (
    <FoodImagePlaceholder
      name={foodNameKo}
      tags={tags}
      placeholderEmoji={placeholderEmoji}
    />
  )
}
