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

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`id.ilike.%${search}%,customer_name.ilike.%${search}%`);
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
