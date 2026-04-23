import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    // 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // [PIPA 준수] 관리자 목록에서는 필요한 필드만 반환. shipping_address 는
    // 배송 상세 진입 시에만 별도 조회하도록 제외 — 목록 일괄 노출 방지.
    let query = supabase
      .from('orders')
      .select('id, created_at, total_price, payment_status, shipping_status, shipping_name, shipping_phone, tracking_number, coupon_id, kit_id')
      .order('created_at', { ascending: false });

    if (search) {
      // shipping_name 으로 검색 (customer_name 은 실제 DB 컬럼이 아님)
      query = query.or(`id.ilike.%${search}%,shipping_name.ilike.%${search}%`);
    }

    const { data: orders, error } = await query;
    if (error) throw error;

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Admin Orders GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { order_id, shipping_status, tracking_number } = await req.json();

    // 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const updates: any = {};
    if (shipping_status) updates.shipping_status = shipping_status;
    if (tracking_number !== undefined) updates.tracking_number = tracking_number;

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', order_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Admin Orders PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
