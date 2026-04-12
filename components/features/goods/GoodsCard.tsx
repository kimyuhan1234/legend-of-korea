'use client'

import { useTranslations } from 'next-intl'
import { type GoodsProduct } from '@/lib/data/goods-products'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

interface GoodsCardProps {
  product: GoodsProduct
  locale: string
}

export function GoodsCard({ product, locale }: GoodsCardProps) {
  const t = useTranslations('goods')

  const name = product.name[locale as 'ko' | 'ja' | 'en'] || product.name.ko
  const description = product.description[locale as 'ko' | 'ja' | 'en'] || product.description.ko

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-[#E4E7EB]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* 이모지 히어로 */}
      <div className="relative h-40 bg-gradient-to-br from-[#9DD8CE]/10 to-[#9DD8CE]/30 flex items-center justify-center">
        <span className="text-6xl">{product.emoji}</span>
        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 text-[10px] font-black text-[#111] uppercase">
          {t(`category.${product.category}` as Parameters<typeof t>[0])}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-[#111] mb-1 leading-tight">{name}</h3>
        <p className="text-xs text-[#6B7280] mb-3 line-clamp-2">{description}</p>

        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-lg font-black text-[#111]">₩{product.price.toLocaleString()}</p>
          {product.lpPrice && (
            <p className="text-xs font-bold text-[#9DD8CE]">
              or {product.lpPrice} LP
            </p>
          )}
        </div>

        <AddToPlannerButton
          itemType="goods"
          cityId={product.cityId}
          itemData={{
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            emoji: product.emoji,
          }}
          size="md"
          className="w-full"
        />
      </div>
    </div>
  )
}
