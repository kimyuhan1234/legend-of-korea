import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const COUPON_COSTS: { [key: number]: number } = {
  10: 500,
  20: 1500,
  30: 3000
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { discountRate } = await req.json();
    const lpCost = COUPON_COSTS[discountRate];

    if (!lpCost) {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    // 1. LP 잔액 확인
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('total_lp')
      .eq('id', user.id)
      .single();

    if (userError || (userData?.total_lp || 0) < lpCost) {
      return NextResponse.json({ error: 'LP가 부족합니다.' }, { status: 400 });
    }

    // 2. LP 차감 및 쿠폰 생성 (Transaction)
    // Supabase JS에서는 트랜드잭션을 직접 하기 어려우므로 여러 단계를 거치거나 RPC 사용 권장.
    // 여기서는 간단하게 순차 처리 (실제 운영 시 RPC 추천)
    
    const newLp = userData.total_lp - lpCost;
    const { error: updateError } = await supabase
      .from('users')
      .update({ total_lp: newLp })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // 3. LP 트랜잭션 기록
    await supabase.from('lp_transactions').insert({
      user_id: user.id,
      amount: -lpCost,
      type: 'COUPON_EXCHANGE',
      description: `${discountRate}% 할인 쿠폰 교환`
    });

    // 4. 쿠폰 발급
    const couponCode = `SHOP-${discountRate}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .insert({
        user_id: user.id,
        code: couponCode,
        discount_rate: discountRate,
        lp_cost: lpCost,
        expires_at: expiresAt.toISOString(),
        is_used: false
      })
      .select()
      .single();

    if (couponError) throw couponError;

    return NextResponse.json({ 
      success: true, 
      coupon, 
      newTotalLp: newLp 
    });

  } catch (error) {
    console.error('Exchange Error:', error);
    return NextResponse.json({ error: '교환 중 오류가 발생했습니다.', success: false }, { status: 500 });
  }
}
