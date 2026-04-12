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
  const defaultMethod = locale === "ko" ? "toss" : "stripe"
  const [paymentMethod, setPaymentMethod] = useState<"toss" | "stripe">(defaultMethod)
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

      if (paymentMethod === "stripe") {
        // Stripe Checkout Session 생성 후 리다이렉트
        const stripeRes = await fetch("/api/payments/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderId,
            kitId: kitSelection.kitId,
            quantity: kitSelection.quantity,
            couponId: kitSelection.couponId || null,
            locale,
            courseId,
            successUrl: `${window.location.origin}/${locale}/courses/${courseId}/purchase/success`,
            cancelUrl: `${window.location.origin}/${locale}/courses/${courseId}/purchase/fail`,
          }),
        })
        const stripeData = await stripeRes.json()
        if (!stripeRes.ok) throw new Error(stripeData.error || "Stripe 세션 생성 실패")
        window.location.href = stripeData.url
      } else {
        setOrderId(data.orderId)
      }
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
      <div className="bg-white rounded-2xl border border-[#E4E7EB] p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#9CA3AF]">{kitLabel} × {kitSelection.quantity}</span>
          <span className="font-medium text-[#111]">₩{subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>{t.discount} ({coupon?.discount_rate}%)</span>
            <span>−₩{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="h-px bg-[#E4E7EB]" />
        <div className="flex justify-between font-black text-[#111]">
          <span>{t.finalPrice}</span>
          <span className="text-xl">₩{finalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* 배송지 요약 */}
      <div className="bg-[#F0F2F5] rounded-2xl p-4 text-sm">
        <p className="font-semibold text-[#111] mb-1">📦 {shipping.name} ({shipping.phone})</p>
        <p className="text-[#9CA3AF]">[{shipping.zipcode}] {shipping.address} {shipping.addressDetail}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 결제 수단 선택 */}
      {!orderId && (
        <>
          <div>
            <p className="text-sm font-semibold text-[#111] mb-3">{t.paymentMethod}</p>
            <div className="grid grid-cols-2 gap-3">
              {(["toss", "stripe"] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === method
                      ? "border-[#F0B8B8] bg-[#F0B8B8]/5"
                      : "border-[#E4E7EB] bg-white hover:border-[#F0B8B8]/40"
                  }`}
                >
                  <div className="text-xl mb-1">{method === "toss" ? "🇰🇷" : "🌐"}</div>
                  <p className="text-xs font-bold text-[#111]">
                    {method === "toss" ? t.tossPay : t.stripePay}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onPrev}
              className="flex-1 py-4 rounded-2xl border border-[#E4E7EB] bg-white text-[#111] font-semibold hover:bg-[#F0F2F5] transition-colors"
            >
              ← {t.prev}
            </button>
            <button
              onClick={handlePrepareOrder}
              disabled={isCreatingOrder}
              className="flex-[2] py-4 rounded-2xl bg-[#F0B8B8] text-[#111] font-black text-lg hover:bg-[#F5D0D0] disabled:opacity-50 transition-colors"
            >
              {isCreatingOrder ? t.processing : t.payNow}
            </button>
          </div>
        </>
      )}

      {/* Toss 위젯 (주문 생성 후) */}
      {orderId && paymentMethod === "toss" && (
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
