'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/contexts/CartContext'
import { DeliveryAddressModal, type DeliveryAddress } from '@/components/shared/DeliveryAddressModal'

export function CartSidePanel() {
  const t = useTranslations('cart')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const {
    items, totalItems, totalPriceDisplay,
    isOpen, closeCart, removeItem, updateQuantity, clearCart,
  } = useCart()

  const [showDelivery, setShowDelivery] = useState(false)

  const handleOrder = (_address: DeliveryAddress) => {
    setShowDelivery(false)
    // TODO: 결제 연동 시 address + items 정보를 결제 API로 전달
    clearCart()
    closeCart()
  }

  const getLocaleName = (name: { ko: string; en: string; ja: string } | null | undefined) => {
    if (!name) return ''
    return (name as Record<string, string>)[locale] || name.en || name.ko || ''
  }

  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* 사이드 패널 */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-mist">
            <h2 className="text-lg font-bold text-ink">
              🛒 {t('title')} ({totalItems})
            </h2>
            <button
              type="button"
              onClick={closeCart}
              className="text-stone hover:text-ink p-1 text-lg"
            >
              ✕
            </button>
          </div>

          {/* 아이템 목록 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-12 text-stone">
                <span className="text-4xl block mb-3">🛒</span>
                <p className="text-sm">{t('empty')}</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-snow rounded-xl">
                  {item.emoji && (
                    <div className="w-12 h-12 rounded-lg bg-mint-light/30 flex items-center justify-center shrink-0">
                      <span className="text-2xl">{item.emoji}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">
                      {getLocaleName(item.name)}
                    </p>
                    <p className="text-sm text-mint-deep font-bold">
                      {item.priceDisplay}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-mist text-ink text-sm flex items-center justify-center hover:bg-stone/20"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-mist text-ink text-sm flex items-center justify-center hover:bg-stone/20"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-stone hover:text-red-500 text-sm self-start"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* 하단: 합계 + 주문 버튼 */}
          {items.length > 0 && (
            <div className="border-t border-mist p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate">{t('subtotal')}</span>
                <span className="font-bold text-ink">{totalPriceDisplay}</span>
              </div>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-stone hover:text-red-500 transition"
              >
                {t('clear')}
              </button>
              <button
                type="button"
                onClick={() => setShowDelivery(true)}
                className="w-full bg-gradient-to-r from-mint to-blossom text-ink font-bold rounded-xl px-4 py-3.5 text-sm hover:opacity-90 transition"
              >
                {t('order')} → {totalPriceDisplay}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 배송 주소 모달 */}
      <DeliveryAddressModal
        isOpen={showDelivery}
        onClose={() => setShowDelivery(false)}
        onConfirm={handleOrder}
        productName={items.map((i) => getLocaleName(i.name)).join(', ')}
        productPrice={totalPriceDisplay}
      />
    </>
  )
}
