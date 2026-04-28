import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Fetch only active banners, ordered by priority
    const { data: ads, error } = await supabase
      .from('ad_banners')
      .select('id, position, image, link, company, priority, created_at')
      .eq('active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, ads });
  } catch (error) {
    console.error('Community Ads GET Error:', error);
    return NextResponse.json({ error: '광고 배너를 불러오는 중 오류가 발생했습니다.', success: false }, { status: 500 });
  }
}
