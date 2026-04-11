'use client'

import { useTranslations } from 'next-intl'
import { STAY_CITIES } from '@/lib/data/stay-recommendations'

interface StayCitySelectorProps {
  selected: string
  onSelect: (cityId: string) => void
}

const CITY_EMOJI: Record<string, string> = {
  all: '✨', jeonju: '🏯', seoul: '🏙️', busan: '🌊', jeju: '🌺',
  gyeongju: '🏛️', tongyeong: '⛵', cheonan: '🌳', yongin: '🎢', icheon: '🏺',
}

export function StayCitySelector({ selected, onSelect }: StayCitySelectorProps) {
  const t = useTranslations('stay')
  const options = ['all', ...STAY_CITIES] as const

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {options.map((cityId) => {
        const active = selected === cityId
        return (
          <button
            key={cityId}
            onClick={() => onSelect(cityId)}
            className={[
              'shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
              active
                ? 'bg-neutral-900 text-white shadow-md scale-105'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400',
            ].join(' ')}
          >
            {CITY_EMOJI[cityId]} {t(`cities.${cityId}` as Parameters<typeof t>[0])}
          </button>
        )
      })}
    </div>
  )
}
