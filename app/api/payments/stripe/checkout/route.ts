import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ error: "Stripe 설정 오류" }, { status: 500 })
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2026-03-25.dahlia" })

    const body = await request.json()
    const { orderId, kitId, quantity, couponId, locale, courseId, successUrl, cancelUrl } = body

    if (!orderId || !kitId || !quantity || !successUrl || !cancelUrl) {
      return NextResponse.json({ error: "필수 파라미터 누락" }, { status: 400 })
    }

    const service = await createServiceClient()

    // 주문 & 키트 정보 조회
    const [{ data: order }, { data: kit }] = await Promise.all([
      service.from("orders").select("id, total_price, payment_status").eq("id", orderId).single(),
      service.from("kit_products").select("price, option_type").eq("id", kitId).single(),
    ])

    if (!order || !kit) {
      return NextResponse.json({ error: "주문 또는 키트를 찾을 수 없습니다" }, { status: 404 })
    }
    if (order.payment_status === "paid") {
      return NextResponse.json({ error: "이미 결제된 주문입니다" }, { status: 400 })
    }

    const kitName = kit.option_type === "solo"
      ? (locale === "ja" ? "1人キット" : locale === "en" ? "Solo Kit" : "1인 키트")
      : (locale === "ja" ? "2人キット" : locale === "en" ? "Couple Kit" : "2인 키트")

    // Stripe Checkout Session 생성
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "krw",
            product_data: {
              name: `Legend of Korea - ${kitName}`,
              description: `Course ID: ${courseId}`,
            },
            unit_amount: order.total_price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelUrl}`,
      metadata: {
        orderId,
        couponId: couponId || "",
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 })
  }
}
