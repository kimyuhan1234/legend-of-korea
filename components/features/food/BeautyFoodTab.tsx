'use client'

import { useState } from 'react'
import { BeautyFoodCard } from './BeautyFoodCard'
import type { FoodHealthData, HealthTag } from '@/lib/data/food-health'

interface BeautyFoodTabProps {
  locale: string
  data: FoodHealthData[]
}

type FilterTag = HealthTag | 'all'

const FILTER_CHIPS: Record<string, { tag: FilterTag; label: string }[]> = {
  ko: [
    { tag: 'all',       label: '✨ 전체' },
    { tag: 'skin',      label: '🧴 피부 미용' },
    { tag: 'antiAging', label: '✨ 항산화' },
    { tag: 'immunity',  label: '🛡️ 면역력' },
    { tag: 'digestion', label: '🫄 소화' },
    { tag: 'diet',      label: '🏋️ 다이어트' },
    { tag: 'bone',      label: '🦴 뼈/관절' },
  ],
  ja: [
    { tag: 'all',       label: '✨ すべて' },
    { tag: 'skin',      label: '🧴 美肌' },
    { tag: 'antiAging', label: '✨ 抗酸化' },
    { tag: 'immunity',  label: '🛡️ 免疫力' },
    { tag: 'digestion', label: '🫄 消化' },
    { tag: 'diet',      label: '🏋️ ダイエット' },
    { tag: 'bone',      label: '🦴 骨・関節' },
  ],
  en: [
    { tag: 'all',       label: '✨ All' },
    { tag: 'skin',      label: '🧴 Skin' },
    { tag: 'antiAging', label: '✨ Anti-aging' },
    { tag: 'immunity',  label: '🛡️ Immunity' },
    { tag: 'digestion', label: '🫄 Digestion' },
    { tag: 'diet',      label: '🏋️ Diet' },
    { tag: 'bone',      label: '🦴 Bone' },
  ],
  'zh-CN': [
    { tag: 'all',       label: '✨ 全部' },
    { tag: 'skin',      label: '🧴 护肤' },
    { tag: 'antiAging', label: '✨ 抗氧化' },
    { tag: 'immunity',  label: '🛡️ 免疫力' },
    { tag: 'digestion', label: '🫄 消化' },
    { tag: 'diet',      label: '🏋️ 减脂' },
    { tag: 'bone',      label: '🦴 骨骼' },
  ],
  'zh-TW': [
    { tag: 'all',       label: '✨ 全部' },
    { tag: 'skin',      label: '🧴 護膚' },
    { tag: 'antiAging', label: '✨ 抗氧化' },
    { tag: 'immunity',  label: '🛡️ 免疫力' },
    { tag: 'digestion', label: '🫄 消化' },
    { tag: 'diet',      label: '🏋️ 減脂' },
    { tag: 'bone',      label: '🦴 骨骼' },
  ],
}

const COUNT_LABEL: Record<string, (n: number) => string> = {
  ko: (n) => `${n}가지 음식`,
  ja: (n) => `${n}品`,
  en: (n) => `${n} foods`,
  'zh-CN': (n) => `${n} 种食物`,
  'zh-TW': (n) => `${n} 種食物`,
}

export function BeautyFoodTab({ locale, data }: BeautyFoodTabProps) {
  const [activeTag, setActiveTag] = useState<FilterTag>('all')

  const chips = FILTER_CHIPS[locale] ?? FILTER_CHIPS.en
  const countFn = COUNT_LABEL[locale] ?? COUNT_LABEL.en

  const filtered =
    activeTag === 'all'
      ? data
      : data.filter((f) => f.healthTags.includes(activeTag as HealthTag))

  return (
    <div>
      {/* Filter chips */}
      <div className="sticky top-[113px] z-30 bg-snow border-b border-cloud py-3">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {chips.map(({ tag, label }) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  activeTag === tag
                    ? 'bg-mint-deep text-white border-mint-deep shadow-sm'
                    : 'bg-white text-slate border-mist hover:border-mint-deep hover:text-mint-deep'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <p className="text-xs text-stone font-medium mb-6">
          {countFn(filtered.length)}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((food) => (
            <BeautyFoodCard key={food.foodId} food={food} locale={locale} />
          ))}
        </div>
      </div>
    </div>
  )
}
