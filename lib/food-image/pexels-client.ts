interface PexelsPhoto {
  src: { large2x: string; large: string; medium: string }
  photographer: string
  photographer_url: string
}

interface PexelsResponse {
  photos: PexelsPhoto[]
}

interface ImageResult {
  url: string
  photographer: string
  photographerUrl: string
}

export async function searchPexels(query: string): Promise<ImageResult | null> {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return null

  try {
    const params = new URLSearchParams({ query, per_page: '5', orientation: 'landscape' })
    const res = await fetch(`https://api.pexels.com/v1/search?${params}`, {
      headers: { Authorization: apiKey },
      next: { revalidate: 86400 },
    })

    if (!res.ok) return null

    const data: PexelsResponse = await res.json()
    const photo = data.photos?.[0]
    if (!photo) return null

    return {
      url: photo.src.large2x || photo.src.large || photo.src.medium,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
    }
  } catch {
    return null
  }
}
