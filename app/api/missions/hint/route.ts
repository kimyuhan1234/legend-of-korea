import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { missionId, hintLevel } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const costMap: Record<number, number> = {
      1: 0,
      2: 30,
      3: 50
    };

    const cost = costMap[hintLevel] || 0;

    if (cost > 0) {
      const { data: userData } = await supabase.from('users').select('total_lp').eq('id', user.id).single();
      if (!userData || userData.total_lp < cost) {
        return NextResponse.json({ error: 'LP가 부족합니다.' }, { status: 400 });
      }

      // LP 차감
      const newLp = userData.total_lp - cost;
      await supabase.from('users').update({ total_lp: newLp }).eq('id', user.id);

      // 트랜잭션 기록
      await supabase.from('lp_transactions').insert({
        user_id: user.id,
        amount: -cost,
        type: 'admin', // Or 'hint_use' if type added
        reference_id: missionId,
        description: `힌트 ${hintLevel}단계 사용`
      });
    }

    return NextResponse.json({ success: true, cost });

  } catch (error) {
    console.error('Hint API Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
