import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { missionId, answer, type } = await req.json();

    if (!missionId || !type) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // 1. 사용자 세션 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // 2. 미션 정보 및 현재 진행 상태 가져오기
    const { data: mission, error: missionError } = await supabase
      .from('missions')
      .select('*, mission_progress!left(*)')
      .eq('id', missionId)
      .eq('mission_progress.user_id', user.id)
      .single();

    if (missionError || !mission) {
      return NextResponse.json({ error: '미션을 찾을 수 없습니다.' }, { status: 404 });
    }

    const progress = mission.mission_progress?.[0];

    // 이미 완료된 미션인지 확인
    if (progress?.status === 'completed') {
      return NextResponse.json({ 
        isCorrect: true, 
        alreadyCompleted: true,
        lpEarned: progress.lp_earned 
      });
    }

    // 3. 타입별 검증 로직
    let isCorrect = false;
    if (type === 'quiz') {
      if (!answer) return NextResponse.json({ error: '정답을 입력하세요.' }, { status: 400 });
      
      // 정답 비교 (대소문자 무시, 공백 무시)
      const normalizedInput = answer.trim().toLowerCase().replace(/\s/g, '');
      const normalizedCorrect = mission.correct_answer?.trim().toLowerCase().replace(/\s/g, '');
      
      isCorrect = normalizedInput === normalizedCorrect;
    } else if (type === 'photo') {
      // 사진 미션은 업로드 성공 시 완료로 간주 (여기서는 일단 true)
      // 실제 구현에서는 Storage URL 확인 로직 등이 들어감
      isCorrect = true; 
    } else {
      isCorrect = true; // open type 등
    }

    // 4. 결과 처리 (트랜잭션처럼 처리)
    if (isCorrect) {
      // 4-1. 미션 진행 상태 업데이트
      const { error: upError } = await supabase
        .from('mission_progress')
        .update({
          status: 'completed',
          answer_text: type === 'quiz' ? answer : null,
          lp_earned: mission.lp_reward,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('mission_id', missionId);

      if (upError) throw upError;

      // 4-2. 사용자 LP 업데이트 (SQL function 호출 또는 직접 업데이트)
      // 여기서는 직접 업데이트 (RPC가 더 안전하지만 일단 라이브러리 방식 사용)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_lp')
        .eq('id', user.id)
        .single();
      
      if (!userError && userData) {
        const newTotalLp = userData.total_lp + mission.lp_reward;
        await supabase
          .from('users')
          .update({ total_lp: newTotalLp })
          .eq('id', user.id);
        
        // 4-3. LP 트랜잭션 기록
        await supabase.from('lp_transactions').insert({
          user_id: user.id,
          amount: mission.lp_reward,
          type: 'mission',
          reference_id: missionId,
          description: `${mission.title.ko} 완료`
        });
      }

      // 4-4. 로그 기록
      await supabase.from('mission_logs').insert({
        user_id: user.id,
        mission_id: missionId,
        action: `submit_${type}`,
        payload: { answer, isCorrect: true },
        is_success: true
      });

      return NextResponse.json({ 
        isCorrect: true, 
        lpEarned: mission.lp_reward,
        message: '미션 완료!' 
      });
    } else {
      // 틀린 경우 로그 기록
      await supabase.from('mission_logs').insert({
        user_id: user.id,
        mission_id: missionId,
        action: `submit_${type}`,
        payload: { answer, isCorrect: false },
        is_success: false
      });

      return NextResponse.json({ 
        isCorrect: false, 
        error: '정답이 아닙니다. 다시 시도해보세요!' 
      }, { status: 200 }); // 200으로 보내고 isCorrect로 판단
    }

  } catch (error) {
    console.error('Verify API Error:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
