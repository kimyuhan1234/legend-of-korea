'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { GoodsHero } from './GoodsHero'
import { GoodsCategoryFilter } from './GoodsCategoryFilter'
import { GoodsCard } from './GoodsCard'
import { GOODS_PRODUCTS, type GoodsCategory } from '@/lib/data/goods-products'

interface GoodsGridProps {
  locale: string
}

export function GoodsGrid({ locale }: GoodsGridProps) {
  const t = useTranslations('goods')
  const [selected, setSelected] = useState<GoodsCategory | 'all'>('all')

  const filtered = useMemo(() => {
    if (selected === 'all') return GOODS_PRODUCTS
    return GOODS_PRODUCTS.filter((p) => p.category === selected)
  }, [selected])

  return (
    <div className="min-h-screen bg-snow">
      <GoodsHero />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-6">
        <GoodsCategoryFilter selected={selected} onSelect={setSelected} />

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-stone">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="text-sm">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <GoodsCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        )}
      </main>

      <div className="h-16" />
    </div>
  )
}
