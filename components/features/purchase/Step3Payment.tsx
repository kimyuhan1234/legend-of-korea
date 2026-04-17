"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

const TossPaymentWidget = dynamic(
  () => import("./TossPaymentWidget").then((m) => m.TossPaymentWidget),
  { ssr: false }
)

interface Kit {
  id: string
  option_type: "solo" | "couple"
  price: number
}

interface Coupon {
  id: string
  discount_rate: number
  code: string
}

interface ShippingInfo {
  name: string
  phone: string
  zipcode: string
  address: string
  addressDetail: string
}

interface Step3Props {
  kitSelection: { kitId: string; quantity: number; couponId: string }
  shipping: ShippingInfo
  kits: Kit[]
  coupons: Coupon[]
  locale: string
  courseId: string
  courseName: string
  user: { id: string; email: string } | null
  t: Record<string, string>
  onPrev: () => void
}

export function Step3Payment({
  kitSelection,
  shipping,
  kits,
  coupons,
  locale,
  courseId,
  courseName,
  user,
  t,
  onPrev,
}: Step3Props) {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [error, setError] = useState("")

  const kit = kits.find((k) => k.id === kitSelection.kitId)
  const coupon = coupons.find((c) => c.id === kitSelection.couponId)
  const subtotal = (kit?.price || 0) * kitSelection.quantity
  const discount = coupon ? Math.floor(subtotal * (coupon.discount_rate / 100)) : 0
  const finalAmount = subtotal - discount

  const kitLabel =
    kit?.option_type === "solo" ? t.soloKit : t.coupleKit

  // 주문 생성 후 결제 진행
  const handlePrepareOrder = async () => {
    if (isCreatingOrder) return
    setIsCreatingOrder(true)
    setError("")

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitId: kitSelection.kitId,
          quantity: kitSelection.quantity,
          couponId: kitSelection.couponId || null,
          totalPrice: finalAmount,
          shippingName: shipping.name,
          shippingPhone: shipping.phone,
          shippingAddress: shipping.address,
          shippingAddressDetail: shipping.addressDetail,
          shippingZipcode: shipping.zipcode,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "주문 생성 실패")

      setOrderId(data.orderId)
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다")
      setIsCreatingOrder(false)
    }
  }

  const siteUrl = typeof window !== "undefined" ? window.location.origin : ""
  const successUrl = `${siteUrl}/${locale}/courses/${courseId}/purchase/success`
  const failUrl = `${siteUrl}/${locale}/courses/${courseId}/purchase/fail`

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#111]">{t.orderSummary}</h2>

      {/* 주문 요약 */}
      <div className="bg-white rounded-2xl border border-mist p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-stone">{kitLabel} × {kitSelection.quantity}</span>
          <span className="font-medium text-[#111]">₩{subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>{t.discount} ({coupon?.discount_rate}%)</span>
            <span>−₩{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="h-px bg-mist" />
        <div className="flex justify-between font-black text-[#111]">
          <span>{t.finalPrice}</span>
          <span className="text-xl">₩{finalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* 배송지 요약 — 배송 정보가 있을 때만 표시 */}
      {shipping.name && shipping.address && (
        <div className="bg-cloud rounded-2xl p-4 text-sm">
          <p className="font-semibold text-[#111] mb-1">📦 {shipping.name} ({shipping.phone})</p>
          <p className="text-stone">[{shipping.zipcode}] {shipping.address} {shipping.addressDetail}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 결제 진행 */}
      {!orderId && (
        <div className="flex gap-3">
          <button
            onClick={onPrev}
            className="flex-1 py-4 rounded-2xl border border-mist bg-white text-[#111] font-semibold hover:bg-cloud transition-colors"
          >
            ← {t.prev}
          </button>
          <button
            onClick={handlePrepareOrder}
            disabled={isCreatingOrder}
            className="flex-[2] py-4 rounded-2xl bg-[#F0B8B8] text-[#111] font-black text-lg hover:bg-blossom disabled:opacity-50 transition-colors"
          >
            {isCreatingOrder ? t.processing : t.payNow}
          </button>
        </div>
      )}

      {/* Toss 위젯 (주문 생성 후) */}
      {orderId && (
        <TossPaymentWidget
          amount={finalAmount}
          orderId={orderId}
          orderName={`${courseName} - ${kitLabel}`}
          successUrl={successUrl}
          failUrl={failUrl}
          customerKey={user?.id || "ANONYMOUS"}
          customerEmail={user?.email}
          customerName={shipping.name}
          payLabel={t.payNow}
          processingLabel={t.processing}
        />
      )}
    </div>
  )
}
