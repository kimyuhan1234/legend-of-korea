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
    // 응답에 mission 정보가 흘러갈 수 있어 correct_answer 등 답안 필드는 제외.
    const { data: mission, error: missionError } = await supabase
      .from('missions')
      .select('id, course_id, sequence, type, title, lp_reward, is_hidden, location_name, location_description, latitude, longitude')
      .or(`qr_code.eq."${qrCode}",qr_code.eq."${qrCode.toUpperCase()}"`)
      .maybeSingle();

    if (missionError || !mission) {
      return NextResponse.json({ error: '유효하지 않은 QR 코드입니다.', success: false }, { status: 404 });
    }

    // 3. 사용자의 코스 참여 권한 확인 (결제 완료 여부)
    const { data: validOrders, error: veError } = await supabase
      .from('orders')
      .select(`
        id,
        kit_products!inner (
          course_id
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'paid') 
      .eq('kit_products.course_id', mission.course_id);

    if (veError || !validOrders || validOrders.length === 0) {
      return NextResponse.json({ 
        error: '해당 코스의 미션 키트를 구매해야 미션을 진행할 수 있습니다.',
        success: false
      }, { status: 403 });
    }

    // 4. 미션 상태 업데이트 (unlocked로 변경)
    const { error: progressError } = await supabase
      .from('mission_progress')
      .upsert({
        user_id: user.id,
        mission_id: mission.id,
        status: 'unlocked'
      }, { onConflict: 'user_id, mission_id' })
      .select()
      .single();

    if (progressError) {
      console.error('Progress update error:', progressError);
      return NextResponse.json({ error: '미션 상태 업데이트에 실패했습니다.', success: false }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      missionId: mission.id,
      courseId: mission.course_id,
      missionTitle: mission.title, // 클라이언트에서 locale에 맞춰 선택
      is_hidden: mission.is_hidden,
      status: 'unlocked'
    });

  } catch (error) {
    console.error('Scan API Error:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.', success: false }, { status: 500 });
  }
}
