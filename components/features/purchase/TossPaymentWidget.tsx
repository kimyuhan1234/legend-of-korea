"use client"

import { useEffect, useRef, useState } from "react"

interface TossPaymentWidgetProps {
  amount: number
  orderId: string
  orderName: string
  successUrl: string
  failUrl: string
  customerKey: string
  customerEmail?: string
  customerName?: string
  payLabel: string
  processingLabel: string
}

export function TossPaymentWidget({
  amount,
  orderId,
  orderName,
  successUrl,
  failUrl,
  customerKey,
  customerEmail,
  customerName,
  payLabel,
  processingLabel,
}: TossPaymentWidgetProps) {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const widgetsRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false

    async function initWidget() {
      try {
        const { loadTossPayments, ANONYMOUS } = await import(
          "@tosspayments/tosspayments-sdk"
        )
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
        if (!clientKey) throw new Error("Toss client key not set")

        const tossPayments = await loadTossPayments(clientKey)
        const widgets = tossPayments.widgets({
          customerKey: customerKey || ANONYMOUS,
        })

        await widgets.setAmount({ currency: "KRW", value: amount })

        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#toss-payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#toss-agreement",
            variantKey: "AGREEMENT",
          }),
        ])

        if (!cancelled) {
          widgetsRef.current = widgets
          setIsReady(true)
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Toss widget init error:", err)
        if (!cancelled) setIsLoading(false)
      }
    }

    initWidget()
    return () => {
      cancelled = true
    }
  }, [amount, customerKey])

  const handlePay = async () => {
    if (!widgetsRef.current || !isReady) return
    try {
      await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        successUrl,
        failUrl,
        customerEmail,
        customerName,
      })
    } catch (err: any) {
      // 사용자가 결제창을 닫은 경우 등 - 에러를 조용히 처리
      if (err?.code !== "USER_CANCEL") {
        console.error("Toss payment error:", err)
      }
    }
  }

  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-[#F0B8B8] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div id="toss-payment-method" />
      <div id="toss-agreement" />
      {!isLoading && (
        <button
          onClick={handlePay}
          disabled={!isReady}
          className="w-full mt-6 py-4 rounded-2xl bg-[#F0B8B8] text-[#111] font-black text-lg hover:bg-[#F5D0D0] disabled:opacity-50 transition-colors"
        >
          {isReady ? payLabel : processingLabel}
        </button>
      )}
    </div>
  )
}
