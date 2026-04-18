import type { I18nString } from '@/lib/tour-api/types'

export interface SwipeQuestion {
  id: string
  optionA: { label: I18nString; icon: string; tags: string[] }
  optionB: { label: I18nString; icon: string; tags: string[] }
}

export interface UserPreference {
  tags: Record<string, number>
}

export interface CityScore {
  city: string
  score: number
  matchPercent: number
}
