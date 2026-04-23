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

    // 사전 체크 (RPC 호출 전 빠른 에러 경로) — 금액/상태 기본 검증
    const { data: order, error: orderError } = await service
      .from("orders")
      .select("id, total_price, payment_status")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "주문을 찾을 수 없습니다" }, { status: 404 })
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ orderId, message: "이미 결제된 주문입니다" })
    }

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

    // 주문 확정 + 쿠폰 사용 표시 (RPC로 트랜잭션 원자화 — 중간 실패 시 쿠폰 재사용 차단)
    const { data: rpcResult, error: rpcError } = await service.rpc(
      "confirm_order_with_coupon",
      {
        p_order_id: orderId,
        p_amount: amount,
      }
    )

    if (rpcError) {
      return NextResponse.json({ error: "주문 확정 실패", detail: rpcError.message }, { status: 500 })
    }

    const row = Array.isArray(rpcResult) ? rpcResult[0] : rpcResult
    if (!row?.success) {
      // ALREADY_PAID는 멱등 처리 (Toss 재시도로 인한 중복 호출 대비)
      if (row?.error_message === "ALREADY_PAID") {
        return NextResponse.json({ orderId, message: "이미 결제된 주문입니다" })
      }
      return NextResponse.json({ error: row?.error_message || "주문 확정 실패" }, { status: 400 })
    }

    return NextResponse.json({ orderId, success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 })
  }
}
