'use client'

import { RETRO_FILTERS } from '@/lib/camera/filters'

interface Props {
  selectedFilter: string
  onSelect: (filterId: string) => void
  locale: string
}

export function FilterSelector({ selectedFilter, onSelect, locale }: Props) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
      <div className="flex gap-2 min-w-max py-1">
        {RETRO_FILTERS.map((f) => {
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
              <span className={`text-[10px] font-bold whitespace-nowrap ${
                isActive ? 'text-mint-deep' : 'text-slate-500'
              }`}>
                {f.name[locale] ?? f.name.ko}
              </span>
              {isActive && <span className="text-[8px] font-black text-mint-deep leading-none">&#10003;</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
