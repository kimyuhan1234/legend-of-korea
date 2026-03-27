import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json()

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: "필수 파라미터가 누락되었습니다" }, { status: 400 })
    }

    const secretKey = process.env.TOSS_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ error: "Toss 설정 오류" }, { status: 500 })
    }

    const service = await createServiceClient()

    // DB에서 주문 확인 및 금액 검증
    const { data: order, error: orderError } = await service
      .from("orders")
      .select("id, total_price, payment_status, coupon_id")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "주문을 찾을 수 없습니다" }, { status: 404 })
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ orderId, message: "이미 결제된 주문입니다" })
    }

    // 금액 이중 검증
    if (order.total_price !== amount) {
      return NextResponse.json({ error: "금액 불일치" }, { status: 400 })
    }

    // Toss Payments 결제 승인 API 호출
    const encodedKey = Buffer.from(`${secretKey}:`).toString("base64")
    const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })

    const tossData = await tossRes.json()

    if (!tossRes.ok) {
      return NextResponse.json(
        { error: tossData.message || "Toss 결제 승인 실패" },
        { status: 400 }
      )
    }

    // 주문 상태 업데이트
    await service
      .from("orders")
      .update({
        payment_status: "paid",
        payment_method: "toss",
      })
      .eq("id", orderId)

    // 쿠폰 사용 처리
    if (order.coupon_id) {
      await service
        .from("coupons")
        .update({ is_used: true })
        .eq("id", order.coupon_id)
    }

    return NextResponse.json({ orderId, success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 })
  }
}
