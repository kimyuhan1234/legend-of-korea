'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/contexts/CartContext'

/**
 * 헤더 우측 카트 아이콘.
 * P1-8: 베타 단계 (NEXT_PUBLIC_PAYMENTS_ENABLED !== 'true') 에는 미노출.
 * CartProvider 자체는 layout 에 그대로 두어 GoodsCard 의 useCart 가 깨지지 않음.
 * 결제 활성화 시 환경변수만 'true' 로 토글하면 즉시 복원.
 */
export function CartBadge() {
  const { totalItems, toggleCart } = useCart()

  // 결제 미활성 시 헤더 카트 아이콘 숨김
  if (process.env.NEXT_PUBLIC_PAYMENTS_ENABLED !== 'true') return null

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative p-2 hover:bg-mist/30 rounded-lg transition"
      aria-label="Cart"
    >
      <ShoppingCart className="w-5 h-5 text-mint-deep" strokeWidth={1.8} aria-hidden />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-blossom-deep text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
