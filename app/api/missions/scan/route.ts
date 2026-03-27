import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { qrCode } = await req.json();

    if (!qrCode) {
      return NextResponse.json({ error: 'QR 코드가 필요합니다.' }, { status: 400 });
    }

    // 1. 사용자 세션 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // 2. 미션 찾기 (QR 코드 또는 수동 입력 코드)
    const { data: mission, error: missionError } = await supabase
      .from('missions')
      .select('*')
      .or(`qr_code.eq."${qrCode}",qr_code.eq."${qrCode.toUpperCase()}"`)
      .single();

    if (missionError || !mission) {
      return NextResponse.json({ error: '유효하지 않은 QR 코드입니다.' }, { status: 404 });
    }

    // 3. 사용자의 코스 참여 권한 확인 (결제 완료 여부)
    // orders -> kit_products -> courses
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .eq('payment_status', 'paid')
      .innerJoin('kit_products', 'kit_id', 'id')
      .eq('kit_products.course_id', mission.course_id)
      .limit(1);

    // Note: If innerJoin is not supported directly in this version of supabase-js, 
    // we might need to query orders and then filter by kit_id. 
    // But usually standard join via select('..., kit_products!inner(course_id)') works.
    
    // Correct way for Supabase JS join with filter:
    const { data: validOrders, error: veError } = await supabase
      .from('orders')
      .select(`
        id,
        kit_products!inner (
          course_id
        )
      `)
      .eq('user_id', user.id)
      .eq('payment_status', 'paid')
      .eq('kit_products.course_id', mission.course_id);

    if (veError || !validOrders || validOrders.length === 0) {
      return NextResponse.json({ 
        error: '해당 코스의 미션 키트를 구매해야 미션을 진행할 수 있습니다.' 
      }, { status: 403 });
    }

    // 4. 미션 상태 업데이트 (unlocked로 변경)
    const { data: progress, error: progressError } = await supabase
      .from('mission_progress')
      .upsert({
        user_id: user.id,
        mission_id: mission.id,
        status: 'unlocked', // 스캔 시 일단 unlocked 또는 in_progress로 설정
        started_at: new Date().toISOString(),
      }, { onConflict: 'user_id, mission_id' })
      .select()
      .single();

    if (progressError) {
      console.error('Progress update error:', progressError);
      return NextResponse.json({ error: '미션 상태 업데이트에 실패했습니다.' }, { status: 500 });
    }

    // 5. 로그 기록 (Phase 7 제안 사항)
    await supabase.from('mission_logs').insert({
      user_id: user.id,
      mission_id: mission.id,
      action: 'scan',
      payload: { qrCode },
      is_success: true
    });

    return NextResponse.json({
      missionId: mission.id,
      missionTitle: mission.title.ko, // 기본으로 한국어 제목 반환 (클라이언트에서 처리 가능)
      status: 'unlocked'
    });

  } catch (error) {
    console.error('Scan API Error:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
