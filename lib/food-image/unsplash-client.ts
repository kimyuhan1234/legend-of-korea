interface UnsplashPhoto {
  urls: { regular: string; small: string }
  user: { name: string; links: { html: string } }
}

interface UnsplashResponse {
  results: UnsplashPhoto[]
}

interface ImageResult {
  url: string
  photographer: string
  photographerUrl: string
}

export async function searchUnsplash(query: string): Promise<ImageResult | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) return null

  try {
    const params = new URLSearchParams({ query, per_page: '5', orientation: 'landscape' })
    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      next: { revalidate: 86400 },
    })

    if (!res.ok) return null

    const data: UnsplashResponse = await res.json()
    const photo = data.results?.[0]
    if (!photo) return null

    return {
      url: photo.urls.regular || photo.urls.small,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    }
  } catch {
    return null
  }
}
