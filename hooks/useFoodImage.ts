'use client'

import { useEffect, useState } from 'react'
import type { FoodImageResult } from '@/lib/food-image/types'

interface UseFoodImageOptions {
  name: string
  tags?: string[]
  fallbackUrl?: string
  enabled?: boolean
}

export function useFoodImage({ name, tags, fallbackUrl, enabled = true }: UseFoodImageOptions) {
  const [image, setImage] = useState<FoodImageResult | null>(
    fallbackUrl ? { url: fallbackUrl, source: 'tour_api' } : null
  )
  const [loading, setLoading] = useState(!fallbackUrl && enabled)

  const tagsKey = tags?.join(',') ?? ''

  useEffect(() => {
    if (!enabled || fallbackUrl) return
    let cancelled = false
    setLoading(true)
    const params = new URLSearchParams({ name })
    if (tagsKey) params.set('tags', tagsKey)
    fetch(`/api/food-image?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.url) {
          setImage({
            url: data.url,
            source: data.source,
            photographer: data.photographer,
            photographerUrl: data.photographerUrl,
          })
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  // tagsKey is a serialized version of tags array for stable comparison
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, tagsKey, enabled, fallbackUrl])

  return { image, loading }
}
