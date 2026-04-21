import type { FoodImageResult } from './types'

const PEXELS_API = 'https://api.pexels.com/v1/search'

export async function searchPexels(query: string): Promise<FoodImageResult | null> {
  const key = process.env.PEXELS_API_KEY
  if (!key) {
    console.warn('[pexels] PEXELS_API_KEY 미설정')
    return null
  }

  try {
    const res = await fetch(
      `${PEXELS_API}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: { Authorization: key },
        next: { revalidate: 86400 },
      }
    )

    if (!res.ok) {
      console.warn(`[pexels] ${res.status} ${res.statusText}`)
      return null
    }

    const data = await res.json()
    const photo = data.photos?.[0]
    if (!photo) return null

    return {
      url: photo.src.large2x || photo.src.large || photo.src.medium,
      source: 'pexels',
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
    }
  } catch (err) {
    console.error('[pexels] 검색 실패:', err)
    return null
  }
}
