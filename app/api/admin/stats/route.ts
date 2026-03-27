import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 관리자 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 1. 오늘 매출 & 이번 달 매출
    const { data: todayOrders } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', today.toISOString())
      .eq('payment_status', 'paid');
    
    const { data: monthOrders } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', firstDayOfMonth.toISOString())
      .eq('payment_status', 'paid');

    const todaySales = todayOrders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;
    const monthSales = monthOrders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;

    // 2. 총 주문 수 & 총 회원 수
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // 3. 최근 주문 5건
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('id, created_at, customer_name, total_amount, payment_status, shipping_status')
      .order('created_at', { ascending: false })
      .limit(5);

    // 4. 최근 커뮤니티 글 5건
    const { data: recentPosts } = await supabase
      .from('community_posts')
      .select('id, content, created_at, likes_count, is_hidden, users(nickname)')
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      summary: {
        todaySales,
        monthSales,
        totalOrders,
        totalUsers,
      },
      recentOrders,
      recentPosts,
    });
  } catch (error) {
    console.error('Admin Stats API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
