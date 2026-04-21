'use client'

import { useTranslations } from 'next-intl'
import { type GoodsProduct } from '@/lib/data/goods-products'
import { useCart } from '@/lib/contexts/CartContext'

interface GoodsCardProps {
  product: GoodsProduct
  locale: string
}

export function GoodsCard({ product, locale }: GoodsCardProps) {
  const t = useTranslations('goods')
  const tCart = useTranslations('cart')
  const { addItem } = useCart()

  const name = (product.name as Record<string, string>)[locale] || product.name.en || product.name.ko
  const description = (product.description as Record<string, string>)[locale] || product.description.en || product.description.ko

  const handleAddToCart = () => {
    addItem({
      id: `goods-${product.id}`,
      type: 'goods',
      name: product.name,
      price: product.price,
      priceDisplay: `₩${product.price.toLocaleString()}`,
      emoji: product.emoji,
      cityId: product.cityId,
    })
  }

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-mist/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* 이모지 히어로 */}
      <div className="relative h-40 bg-gradient-to-br from-mint-light/40 to-mint/30 flex items-center justify-center">
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
            <p className="text-xs font-bold text-mint-deep">
              or {product.lpPrice} LP
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-mint to-blossom text-ink font-bold rounded-xl px-4 py-3 text-sm hover:opacity-90 transition"
        >
          🛒 {tCart('add')} · ₩{product.price.toLocaleString()}
        </button>
      </div>
    </div>
  )
}
