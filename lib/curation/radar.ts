import { CITY_TAG_SCORES } from './scoring'
import type { UserPreference } from './types'

export interface RadarAxis {
  key: string
  label: string
  icon: string
  value: number // 0 ~ 1
}

export interface RadarLabels {
  tradition: string
  nature: string
  experience: string
  active: string
  nightlife: string
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

/** 유저 preference → 5축 레이더 */
export function preferenceToRadar(preference: UserPreference, labels: RadarLabels): RadarAxis[] {
  const t = preference.tags
  return [
    {
      key: 'tradition',
      label: labels.tradition,
      icon: '🏛️',
      value: clamp01(((t.traditional || 0) + (t.historic || 0) + (t.temple || 0)) / 3),
    },
    {
      key: 'nature',
      label: labels.nature,
      icon: '🌿',
      value: clamp01(((t.nature || 0) + (t.ocean || 0) + (t.hiking || 0)) / 3),
    },
    {
      key: 'experience',
      label: labels.experience,
      icon: '🎭',
      value: clamp01(((t.experience || 0) + (t.food || 0) + (t.workshop || 0)) / 3),
    },
    {
      key: 'active',
      label: labels.active,
      icon: '🏃',
      value: clamp01(((t.active || 0) + (t.adventure || 0) + (t.themepark || 0)) / 3),
    },
    {
      key: 'nightlife',
      label: labels.nightlife,
      icon: '🌙',
      value: clamp01(((t.nightlife || 0) + (t.sunset || 0) + (t['night-market'] || 0)) / 3),
    },
  ]
}

/** 도시 → 5축 레이더 (CITY_TAG_SCORES 기반) */
export function cityToRadar(region: string, labels: RadarLabels): RadarAxis[] {
  const t = CITY_TAG_SCORES[region] || {}
  return [
    {
      key: 'tradition',
      label: labels.tradition,
      icon: '🏛️',
      value: clamp01(((t.traditional || 0) + (t.historic || 0) + (t.temple || 0)) / 3),
    },
    {
      key: 'nature',
      label: labels.nature,
      icon: '🌿',
      value: clamp01(((t.nature || 0) + (t.ocean || 0) + (t.hiking || 0)) / 3),
    },
    {
      key: 'experience',
      label: labels.experience,
      icon: '🎭',
      value: clamp01(((t.experience || 0) + (t.food || 0)) / 2),
    },
    {
      key: 'active',
      label: labels.active,
      icon: '🏃',
      value: clamp01(((t.active || 0) + (t.adventure || 0) + (t.themepark || 0)) / 3),
    },
    {
      key: 'nightlife',
      label: labels.nightlife,
      icon: '🌙',
      value: clamp01(((t.nightlife || 0) + (t.sunset || 0) + (t['night-market'] || 0)) / 3),
    },
  ]
}
