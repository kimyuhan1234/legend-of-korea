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

    const service = await createServiceClient()

    // ─── 디지털 구독 주문 (kitId 없음) ───────────────────────────────
    if (!kitId) {
      const SUBSCRIPTION_PRICE = 6900

      let couponDiscountRate = 0
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
        couponDiscountRate = coupon.discount_rate
      }

      const discount = Math.floor(SUBSCRIPTION_PRICE * (couponDiscountRate / 100))
      const expectedTotal = SUBSCRIPTION_PRICE - discount

      if (Math.abs(expectedTotal - totalPrice) > 1) {
        return NextResponse.json({ error: "금액이 일치하지 않습니다" }, { status: 400 })
      }

      const { data: order, error: orderError } = await service
        .from("orders")
        .insert({
          user_id: user.id,
          kit_id: null,
          quantity: 1,
          total_price: expectedTotal,
          payment_status: "pending",
          // 디지털 구독은 배송 불필요 — DB NOT NULL 제약 충족용 플레이스홀더
          shipping_name: "디지털구독",
          shipping_phone: "-",
          shipping_address: "디지털구독",
          shipping_status: "delivered",
        })
        .select("id")
        .single()

      if (orderError || !order) {
        return NextResponse.json({ error: "주문 생성 실패", detail: orderError?.message }, { status: 500 })
      }

      return NextResponse.json({ orderId: order.id, amount: expectedTotal })
    }

    // ─── 실물 키트 주문 (kitId 있음) ─────────────────────────────────

    // 입력 검증
    if (!quantity || !shippingName || !shippingPhone || !shippingAddress) {
      return NextResponse.json({ error: "필수 항목을 입력하세요" }, { status: 400 })
    }

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
    let couponDiscountRate = 0
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
      couponDiscountRate = coupon.discount_rate
    }

    // 구독 할인 확인 (서버에서 직접 조회)
    let subscriptionDiscountRate = 0
    const { data: subscription } = await service
      .from("user_subscriptions")
      .select(`
        status,
        current_period_end,
        subscription_plans ( kit_discount_rate )
      `)
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle()

    if (subscription && new Date(subscription.current_period_end) > new Date()) {
      const plan = subscription.subscription_plans as unknown as { kit_discount_rate: number } | null
      if (plan?.kit_discount_rate) {
        subscriptionDiscountRate = plan.kit_discount_rate
      }
    }

    // 서버 측 금액 계산 및 검증 (쿠폰 할인 + 구독 할인 합산)
    const subtotal = kit.price * quantity
    const totalDiscountRate = couponDiscountRate + subscriptionDiscountRate
    const discount = Math.floor(subtotal * (totalDiscountRate / 100))
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
