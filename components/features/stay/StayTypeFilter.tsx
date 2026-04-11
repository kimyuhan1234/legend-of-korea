'use client'

import { useTranslations } from 'next-intl'
import { STAY_TYPE_EMOJI, VIBE_TAGS, type StayType, type VibeTag } from '@/lib/data/stay-recommendations'

interface StayTypeFilterProps {
  selectedType: StayType | 'all'
  selectedVibes: VibeTag[]
  onTypeChange: (type: StayType | 'all') => void
  onVibeToggle: (vibe: VibeTag) => void
}

const TYPES: (StayType | 'all')[] = ['all', 'hanok', 'hotel', 'guesthouse', 'pension', 'resort']

export function StayTypeFilter({
  selectedType,
  selectedVibes,
  onTypeChange,
  onVibeToggle,
}: StayTypeFilterProps) {
  const t = useTranslations('stay')

  return (
    <div className="space-y-4">
      {/* 유형 필터 */}
      <div>
        <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-2">
          {t('filter.typeLabel')}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TYPES.map((type) => {
            const active = selectedType === type
            const emoji = type === 'all' ? '✨' : STAY_TYPE_EMOJI[type]
            return (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className={[
                  'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                  active
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
                ].join(' ')}
              >
                {emoji} {t(`filter.${type}` as Parameters<typeof t>[0])}
              </button>
            )
          })}
        </div>
      </div>

      {/* 분위기 태그 필터 */}
      <div>
        <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-2">
          {t('filter.vibeLabel')}
        </p>
        <div className="flex flex-wrap gap-2">
          {VIBE_TAGS.map((vibe) => {
            const active = selectedVibes.includes(vibe)
            return (
              <button
                key={vibe}
                onClick={() => onVibeToggle(vibe)}
                className={[
                  'px-3 py-1 rounded-full text-xs font-semibold transition-all',
                  active
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-400',
                ].join(' ')}
              >
                #{t(`vibe.${vibe}` as Parameters<typeof t>[0])}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
