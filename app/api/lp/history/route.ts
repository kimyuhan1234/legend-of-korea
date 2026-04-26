import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('lp_transactions')
      .select('id, user_id, amount, type, reference_id, description, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('LP History Error:', error);
      return NextResponse.json({ error: '내역을 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, history: data });
  } catch (error) {
    console.error('LP History API Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
