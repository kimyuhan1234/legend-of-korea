import type { FoodImageResult } from './types'

const UNSPLASH_API = 'https://api.unsplash.com/search/photos'

export async function searchUnsplash(query: string): Promise<FoodImageResult | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) return null

  try {
    const res = await fetch(
      `${UNSPLASH_API}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: { Authorization: `Client-ID ${key}` },
        next: { revalidate: 86400 },
      }
    )

    if (!res.ok) return null

    const data = await res.json()
    const photo = data.results?.[0]
    if (!photo) return null

    return {
      url: photo.urls.regular || photo.urls.small,
      source: 'unsplash',
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    }
  } catch {
    return null
  }
}
