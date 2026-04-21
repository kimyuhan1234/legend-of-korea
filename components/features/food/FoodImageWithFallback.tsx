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
  const { image, loading } = useFoodImage({ name: foodNameKo, tags, fallbackUrl })
  const [imgError, setImgError] = useState(false)

  if (loading) {
    return <div className="absolute inset-0 bg-mist animate-pulse" />
  }

  if (!image?.url || imgError) {
    return (
      <FoodImagePlaceholder
        name={foodNameKo}
        tags={tags}
        placeholderEmoji={placeholderEmoji}
      />
    )
  }

  const isRemote = image.source === 'pexels' || image.source === 'unsplash'

  return (
    <>
      <Image
        src={image.url}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        unoptimized={isRemote}
        onError={() => setImgError(true)}
      />
      <PhotoAttribution
        source={image.source}
        photographer={image.photographer}
        photographerUrl={image.photographerUrl}
      />
    </>
  )
}
