export type ImageSource = 'pexels' | 'unsplash' | 'tour_api' | 'placeholder'

export interface FoodImageResult {
  url: string
  source: ImageSource
  photographer?: string
  photographerUrl?: string
}
