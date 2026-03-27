import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: b2bOrders, error } = await supabase
      .from('b2b_orders')
      .select('*, courses(title)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(b2bOrders);
  } catch (error) {
    console.error('Admin B2B GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    // 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const total_amount = body.quantity * body.unit_price;

    const { data: newB2B, error } = await supabase
      .from('b2b_orders')
      .insert({
        agency_name: body.agency_name,
        contact_person: body.contact_person,
        contact_phone: body.contact_phone,
        course_id: body.course_id,
        quantity: body.quantity,
        unit_price: body.unit_price,
        total_amount,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newB2B);
  } catch (error) {
    console.error('Admin B2B POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { order_id, status } = await req.json();

    // 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: updatedB2B, error } = await supabase
      .from('b2b_orders')
      .update({ status })
      .eq('id', order_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedB2B);
  } catch (error) {
    console.error('Admin B2B PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
