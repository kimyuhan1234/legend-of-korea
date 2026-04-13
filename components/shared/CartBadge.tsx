'use client'

import { useCart } from '@/lib/contexts/CartContext'

export function CartBadge() {
  const { totalItems, toggleCart } = useCart()

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative p-2 hover:bg-mist/30 rounded-lg transition"
      aria-label="Cart"
    >
      <span className="text-xl">🛒</span>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-blossom-deep text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
