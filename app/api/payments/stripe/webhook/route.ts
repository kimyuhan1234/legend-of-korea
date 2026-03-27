import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe 설정 오류" }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-03-25.dahlia" })

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Signature 누락" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature 검증 실패: ${err.message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId
    const couponId = session.metadata?.couponId

    if (!orderId) {
      return NextResponse.json({ error: "orderId 없음" }, { status: 400 })
    }

    const service = await createServiceClient()

    // 주문 상태 업데이트
    const { error: updateError } = await service
      .from("orders")
      .update({
        payment_status: "paid",
        payment_method: "stripe",
      })
      .eq("id", orderId)

    if (updateError) {
      console.error("Order update error:", updateError)
      return NextResponse.json({ error: "주문 업데이트 실패" }, { status: 500 })
    }

    // 쿠폰 사용 처리
    if (couponId) {
      await service
        .from("coupons")
        .update({ is_used: true })
        .eq("id", couponId)
    }
  }

  return NextResponse.json({ received: true })
}
