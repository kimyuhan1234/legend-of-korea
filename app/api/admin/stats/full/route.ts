import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. 기간별 매출 (최근 30일)
    const { data: revenueData } = await supabase
      .from('orders')
      .select('created_at, total_price')
      .eq('payment_status', 'paid')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // 2. 코스별 판매량
    const { data: courseSales } = await supabase.rpc('get_course_sales_stats');
    // If RPC doesn't exist, we can do it manually or assume it exists. 
    // Let's do a manual join for now just in case.
    const { data: ordersWithCourses } = await supabase
      .from('orders')
      .select('id, total_price, courses(title)')
      .eq('payment_status', 'paid');

    // 3. 어필리에이트 클릭수
    const { data: affiliateStats } = await supabase
      .from('affiliate_clicks')
      .select('link_id, affiliate_links(title)')
      .gte('clicked_at', thirtyDaysAgo.toISOString());

    // 4. 언어별 사용자 분포
    const { data: langDist } = await supabase
      .from('users')
      .select('language');

    // 5. 미션 완료율
    const { data: missionStats } = await supabase
      .from('mission_progress')
      .select('status');

    return NextResponse.json({
      revenue: revenueData ?? [],
      courseSales: ordersWithCourses ?? [],
      affiliate: affiliateStats ?? [],
      languages: langDist ?? [],
      missions: missionStats ?? []
    });
  } catch (error) {
    console.error('Admin Full Stats API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
