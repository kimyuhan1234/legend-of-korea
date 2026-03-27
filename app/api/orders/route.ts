import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      kitId,
      quantity,
      couponId,
      totalPrice,
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingAddressDetail,
      shippingZipcode,
    } = body

    // 입력 검증
    if (!kitId || !quantity || !shippingName || !shippingPhone || !shippingAddress) {
      return NextResponse.json({ error: "필수 항목을 입력하세요" }, { status: 400 })
    }

    // Service client로 금액 검증 (RLS 우회)
    const service = await createServiceClient()

    // 키트 정보 조회
    const { data: kit, error: kitError } = await service
      .from("kit_products")
      .select("id, price, stock, is_active")
      .eq("id", kitId)
      .single()

    if (kitError || !kit) {
      return NextResponse.json({ error: "유효하지 않은 키트입니다" }, { status: 400 })
    }

    if (!kit.is_active || kit.stock < quantity) {
      return NextResponse.json({ error: "재고가 부족합니다" }, { status: 400 })
    }

    // 쿠폰 검증
    let discountRate = 0
    if (couponId) {
      const { data: coupon } = await service
        .from("coupons")
        .select("id, discount_rate, is_used, expires_at, user_id")
        .eq("id", couponId)
        .single()

      if (!coupon || coupon.is_used || coupon.user_id !== user.id) {
        return NextResponse.json({ error: "유효하지 않은 쿠폰입니다" }, { status: 400 })
      }
      if (new Date(coupon.expires_at) < new Date()) {
        return NextResponse.json({ error: "만료된 쿠폰입니다" }, { status: 400 })
      }
      discountRate = coupon.discount_rate
    }

    // 서버 측 금액 계산 및 검증
    const subtotal = kit.price * quantity
    const discount = Math.floor(subtotal * (discountRate / 100))
    const expectedTotal = subtotal - discount

    if (Math.abs(expectedTotal - totalPrice) > 1) {
      return NextResponse.json({ error: "금액이 일치하지 않습니다" }, { status: 400 })
    }

    // 트랜잭션: 주문 생성 + 재고 차감
    const { data: order, error: orderError } = await service
      .from("orders")
      .insert({
        user_id: user.id,
        kit_id: kitId,
        quantity,
        total_price: expectedTotal,
        payment_status: "pending",
        shipping_name: shippingName,
        shipping_phone: shippingPhone,
        shipping_address: shippingAddress,
        shipping_address_detail: shippingAddressDetail || null,
        shipping_zipcode: shippingZipcode || null,
        shipping_status: "preparing",
        coupon_id: couponId || null,
      })
      .select("id")
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "주문 생성 실패", detail: orderError?.message }, { status: 500 })
    }

    // 재고 차감
    await service
      .from("kit_products")
      .update({ stock: kit.stock - quantity })
      .eq("id", kitId)

    return NextResponse.json({ orderId: order.id, amount: expectedTotal })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        kit_products (
          id,
          option_type,
          courses (
            id,
            title
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Orders Fetch Error:", error)
      return NextResponse.json({ error: "주문 내역을 불러오는데 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({ success: true, orders: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 })
  }
}
