-- ============================================================
--  034_orders_rpc.sql
--  Day 5: 결제 트랜잭션 원자화
--
--  기존 문제:
--    - /api/orders: orders INSERT + kit_products UPDATE(stock) 가 별도 쿼리 → race condition 시 재고 더블 차감 가능
--    - /api/payments/toss/confirm: orders UPDATE + coupons UPDATE 가 별도 쿼리 → 중간 실패 시 쿠폰 미표시로 재사용 가능
--
--  해결: SECURITY DEFINER plpgsql 함수로 묶어 단일 트랜잭션 + FOR UPDATE 락으로 원자화
-- ============================================================

-- ──────────────────────────────────────────
-- 1. 실물 키트 주문 생성 + 재고 차감 (원자화)
-- ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_order_with_inventory(
  p_user_id                  UUID,
  p_kit_id                   UUID,
  p_quantity                 INT,
  p_total_price              INT,
  p_shipping_name            TEXT,
  p_shipping_phone           TEXT,
  p_shipping_address         TEXT,
  p_shipping_address_detail  TEXT DEFAULT NULL,
  p_shipping_zipcode         TEXT DEFAULT NULL,
  p_coupon_id                UUID DEFAULT NULL
)
RETURNS TABLE (
  order_id       UUID,
  success        BOOLEAN,
  error_message  TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id      UUID;
  v_stock         INT;
  v_is_active     BOOLEAN;
  v_coupon_used   BOOLEAN;
  v_coupon_owner  UUID;
  v_coupon_expires TIMESTAMPTZ;
BEGIN
  -- 1. 키트 재고 조회 + FOR UPDATE 락 (동시 주문 race condition 차단)
  SELECT stock, is_active INTO v_stock, v_is_active
  FROM public.kit_products
  WHERE id = p_kit_id
  FOR UPDATE;

  IF v_stock IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, '유효하지 않은 키트입니다'::TEXT;
    RETURN;
  END IF;

  IF NOT v_is_active THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, '판매 중단된 키트입니다'::TEXT;
    RETURN;
  END IF;

  IF v_stock < p_quantity THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, '재고가 부족합니다'::TEXT;
    RETURN;
  END IF;

  -- 2. 쿠폰 락 + 검증 (동시 사용 차단)
  IF p_coupon_id IS NOT NULL THEN
    SELECT is_used, user_id, expires_at
      INTO v_coupon_used, v_coupon_owner, v_coupon_expires
    FROM public.coupons
    WHERE id = p_coupon_id
    FOR UPDATE;

    IF v_coupon_owner IS NULL THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, '유효하지 않은 쿠폰입니다'::TEXT;
      RETURN;
    END IF;

    IF v_coupon_owner <> p_user_id THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, '유효하지 않은 쿠폰입니다'::TEXT;
      RETURN;
    END IF;

    IF v_coupon_used THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, '이미 사용된 쿠폰입니다'::TEXT;
      RETURN;
    END IF;

    IF v_coupon_expires IS NOT NULL AND v_coupon_expires < NOW() THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, '만료된 쿠폰입니다'::TEXT;
      RETURN;
    END IF;
  END IF;

  -- 3. 주문 생성
  INSERT INTO public.orders (
    user_id, kit_id, quantity, total_price,
    payment_status,
    shipping_name, shipping_phone, shipping_address,
    shipping_address_detail, shipping_zipcode,
    shipping_status, coupon_id
  )
  VALUES (
    p_user_id, p_kit_id, p_quantity, p_total_price,
    'pending',
    p_shipping_name, p_shipping_phone, p_shipping_address,
    p_shipping_address_detail, p_shipping_zipcode,
    'preparing', p_coupon_id
  )
  RETURNING id INTO v_order_id;

  -- 4. 재고 차감 (같은 트랜잭션, 락이 유지된 상태)
  UPDATE public.kit_products
  SET stock = stock - p_quantity
  WHERE id = p_kit_id;

  RETURN QUERY SELECT v_order_id, TRUE, NULL::TEXT;
END;
$$;

COMMENT ON FUNCTION public.create_order_with_inventory IS
  '실물 키트 주문 생성 + 재고 차감을 단일 트랜잭션 + FOR UPDATE 락으로 원자화. 동시 주문 race condition 차단.';


-- ──────────────────────────────────────────
-- 2. Toss 결제 확정 + 쿠폰 사용 표시 (원자화)
-- ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.confirm_order_with_coupon(
  p_order_id  UUID,
  p_amount    INT
)
RETURNS TABLE (
  success        BOOLEAN,
  error_message  TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status      TEXT;
  v_coupon_id   UUID;
  v_total_price INT;
BEGIN
  -- 1. 주문 조회 + FOR UPDATE 락 (중복 확정 차단)
  SELECT payment_status, coupon_id, total_price
    INTO v_status, v_coupon_id, v_total_price
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF v_status IS NULL THEN
    RETURN QUERY SELECT FALSE, '주문을 찾을 수 없습니다'::TEXT;
    RETURN;
  END IF;

  IF v_status = 'paid' THEN
    RETURN QUERY SELECT FALSE, 'ALREADY_PAID'::TEXT;
    RETURN;
  END IF;

  IF v_status <> 'pending' THEN
    RETURN QUERY SELECT FALSE, ('잘못된 주문 상태: ' || v_status)::TEXT;
    RETURN;
  END IF;

  IF v_total_price <> p_amount THEN
    RETURN QUERY SELECT FALSE, '금액 불일치'::TEXT;
    RETURN;
  END IF;

  -- 2. 주문 확정
  UPDATE public.orders
  SET payment_status = 'paid',
      payment_method = 'toss',
      updated_at     = NOW()
  WHERE id = p_order_id;

  -- 3. 쿠폰 사용 표시 (있는 경우만)
  IF v_coupon_id IS NOT NULL THEN
    UPDATE public.coupons
    SET is_used = TRUE
    WHERE id = v_coupon_id;
  END IF;

  RETURN QUERY SELECT TRUE, NULL::TEXT;
END;
$$;

COMMENT ON FUNCTION public.confirm_order_with_coupon IS
  'Toss 결제 승인 후 주문 확정(paid) + 쿠폰 사용(is_used) 처리를 단일 트랜잭션으로 원자화. 중복 확정 및 쿠폰 재사용 차단.';


-- ──────────────────────────────────────────
-- 권한 부여 (API에서 service role이 호출)
-- ──────────────────────────────────────────
GRANT EXECUTE ON FUNCTION public.create_order_with_inventory TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_order_with_coupon TO service_role, authenticated;
