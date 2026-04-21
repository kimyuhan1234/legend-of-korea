'use client'

import { useCallback, useEffect, useState } from 'react'
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
  const [error, setError] = useState(false)

  const doFetch = useCallback(async () => {
    setLoading(true)
    setError(false)
    const params = new URLSearchParams({ name })
    if (tags?.length) params.set('tags', tags.join(','))
    try {
      const res = await fetch(`/api/food-image?${params}`)
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      if (data?.url) {
        setImage({
          url: data.url,
          source: data.source,
          photographer: data.photographer,
          photographerUrl: data.photographerUrl,
        })
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  // tags는 배열이라 join으로 직렬화해 비교
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, tags?.join(',')])

  // fallbackUrl 없을 때만 마운트 시 자동 fetch
  useEffect(() => {
    if (!enabled || fallbackUrl) return
    doFetch()
  }, [enabled, fallbackUrl, doFetch])

  // 정적 이미지 404 시 컴포넌트가 호출할 함수
  const triggerFetch = useCallback(() => {
    doFetch()
  }, [doFetch])

  return { image, loading, error, triggerFetch }
}
