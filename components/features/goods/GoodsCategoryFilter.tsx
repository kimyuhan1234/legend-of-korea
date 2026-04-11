'use client'

import { useTranslations } from 'next-intl'
import { CATEGORIES, CATEGORY_EMOJI, type GoodsCategory } from '@/lib/data/goods-products'

interface GoodsCategoryFilterProps {
  selected: GoodsCategory | 'all'
  onSelect: (c: GoodsCategory | 'all') => void
}

export function GoodsCategoryFilter({ selected, onSelect }: GoodsCategoryFilterProps) {
  const t = useTranslations('goods')
  const options: (GoodsCategory | 'all')[] = ['all', ...CATEGORIES]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {options.map((c) => {
        const active = selected === c
        const emoji = c === 'all' ? '✨' : CATEGORY_EMOJI[c]
        return (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className={[
              'shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all',
              active
                ? 'bg-neutral-900 text-white shadow-md scale-105'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400',
            ].join(' ')}
          >
            {emoji} {t(`category.${c}` as Parameters<typeof t>[0])}
          </button>
        )
      })}
    </div>
  )
}
