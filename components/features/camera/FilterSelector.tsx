'use client'

import { useState, useMemo } from 'react'
import { RETRO_FILTERS, FILTER_CATEGORIES, type FilterCategoryId } from '@/lib/camera/filters'

interface Props {
  selectedFilter: string
  onSelect: (filterId: string) => void
  locale: string
}

export function FilterSelector({ selectedFilter, onSelect, locale }: Props) {
  const [category, setCategory] = useState<FilterCategoryId>('all')

  const filtered = useMemo(() => {
    if (category === 'all') return RETRO_FILTERS
    // 'original' 은 모든 카테고리에서 첫 번째로 노출 (필터 없음 옵션)
    const original = RETRO_FILTERS.find((f) => f.id === 'original')
    const rest = RETRO_FILTERS.filter((f) => f.category === category && f.id !== 'original')
    return original ? [original, ...rest] : rest
  }, [category])

  return (
    <div className="space-y-2">
      {/* 카테고리 탭 — 가로 스크롤 */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2">
        {FILTER_CATEGORIES.map((cat) => {
          const isActive = category === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-mint-deep text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name[locale] ?? cat.name.ko}</span>
            </button>
          )
        })}
      </div>

      {/* 필터 목록 — 가로 스크롤 */}
      <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
        <div className="flex gap-2 min-w-max py-1">
          {filtered.map((f) => {
            const isActive = f.id === selectedFilter
            return (
              <button
                key={f.id}
                onClick={() => onSelect(f.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all shrink-0 ${
                  isActive
                    ? 'bg-mint-deep/10 border-2 border-mint-deep scale-105'
                    : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                }`}
              >
                <span className="text-xl">{f.icon}</span>
                <span
                  className={`text-[10px] font-bold whitespace-nowrap ${
                    isActive ? 'text-mint-deep' : 'text-slate-500'
                  }`}
                >
                  {f.name[locale] ?? f.name.ko}
                </span>
                {isActive && (
                  <span className="text-[8px] font-black text-mint-deep leading-none">
                    &#10003;
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
