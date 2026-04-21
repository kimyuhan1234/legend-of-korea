export type FoodImageSource = 'pexels' | 'unsplash' | 'tour_api' | 'placeholder'

export interface FoodImageResult {
  url: string | null
  source: FoodImageSource
  photographer?: string
  photographerUrl?: string
  queryUsed?: string
}
