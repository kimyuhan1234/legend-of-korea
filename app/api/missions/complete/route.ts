import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { missionId, type, answer, photoUrl, syncCommunity } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    // 1. 미션 조회
    const { data: mission, error: mError } = await supabase
      .from('missions')
      .select('*')
      .eq('id', missionId)
      .single();

    if (mError || !mission) return NextResponse.json({ error: '미션을 찾을 수 없습니다.' }, { status: 404 });

    // 2. 이미 완료 여부 확인 (중복 보상 방지)
    const { data: progress } = await supabase
      .from('mission_progress')
      .select('status')
      .eq('user_id', user.id)
      .eq('mission_id', missionId)
      .maybeSingle();

    if (progress?.status === 'completed') {
      return NextResponse.json({ message: '이미 완료된 미션입니다.', alreadyCompleted: true, success: true });
    }

    // 2-1. 퀴즈 정답 검증 (퀴즈 타입인 경우)
    if (type === 'quiz' && mission.correct_answer) {
      const normalizedUserAnswer = (answer || '').replace(/\s+/g, '').toLowerCase();
      const normalizedCorrectAnswer = mission.correct_answer.replace(/\s+/g, '').toLowerCase();

      if (normalizedUserAnswer !== normalizedCorrectAnswer) {
        return NextResponse.json({ error: '정답이 아닙니다. 다시 시도해보세요.', success: false }, { status: 400 });
      }
    }

    // 3. 완료 처리 및 LP 지급
    // 3-1. progress 업데이트
    const { error: upError } = await supabase
      .from('mission_progress')
      .upsert({
        user_id: user.id,
        mission_id: missionId,
        status: 'completed',
        answer_text: answer || null,
        photo_url: photoUrl || null,
        lp_earned: mission.lp_reward,
        completed_at: new Date().toISOString()
      }, { onConflict: 'user_id, mission_id' });

    if (upError) throw upError;

    // 3-2. User LP 업데이트
    const { data: userData } = await supabase.from('users').select('total_lp, current_tier').eq('id', user.id).single();
    const currentLp = userData?.total_lp || 0;
    const addedLp = mission.lp_reward;
    let newLp = currentLp + addedLp;
    
    // 3-3. LP 트랜잭션 기록
    await supabase.from('lp_transactions').insert({
      user_id: user.id,
      amount: addedLp,
      type: 'mission',
      reference_id: missionId,
      description: `${mission.title.ko} 완료`
    });

    // 3-4. 커뮤니티 동기화 (오픈형 등에서 체크 시)
    if (syncCommunity && (type === 'open' || type === 'boss' || type === 'photo' || type === 'hidden')) {
      await supabase.from('community_posts').insert({
        user_id: user.id,
        course_id: mission.course_id,
        mission_id: missionId,
        photos: photoUrl ? [photoUrl] : [],
        text: answer || `${mission.title.ko} 미션 완료!`,
        is_spoiler: true
      });
    }

    // 4. 티어 재계산
    const { data: nextTiers } = await supabase.from('tiers').select('*').lte('min_lp', newLp).order('level', { ascending: false }).limit(1);
    const newTier = nextTiers?.[0]?.level || 1;
    
    let tierUp = false;
    if (userData && userData.current_tier < newTier) {
       await supabase.from('users').update({ current_tier: newTier }).eq('id', user.id);
       tierUp = true;
    }

    // 5. 다음 미션 해제 (is_hidden 제외한 순차적 미션 중 다음 단계)
    const nextSeq = mission.sequence + 1;
    const { data: nextMission } = await supabase
        .from('missions')
        .select('id')
        .eq('course_id', mission.course_id)
        .eq('sequence', nextSeq)
        .eq('is_hidden', false) // 히든 미션은 자동으로 해제되지 않음
        .maybeSingle();

    if (nextMission) {
      await supabase.from('mission_progress').upsert({
        user_id: user.id,
        mission_id: nextMission.id,
        status: 'unlocked'
      }, { onConflict: 'user_id, mission_id' });
    }

    // 6. 코스 완주 체크 (일반 미션 전체 완료 여부)
    const { data: allNormalMissions } = await supabase.from('missions').select('id').eq('course_id', mission.course_id).eq('is_hidden', false);
    const totalMissions = allNormalMissions?.length || 0;
    
    const { data: completedNormalProgress } = await supabase
        .from('mission_progress')
        .select('mission_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .in('mission_id', allNormalMissions?.map(m => m.id) || []);
    
    const isCourseCompleted = (completedNormalProgress?.length || 0) === totalMissions;
    let bonusLp = 0;

    if (isCourseCompleted) {
        // 완주 보너스 중복 지급 방지 (reference_id가 course_id인 트랜잭션 체크)
        const { data: existingBonus } = await supabase
            .from('lp_transactions')
            .select('id')
            .eq('user_id', user.id)
            .eq('reference_id', mission.course_id)
            .eq('description', '코스 완주 보너스 (500 LP)')
            .maybeSingle();

        if (!existingBonus) {
            bonusLp = 500;
            newLp += bonusLp;
            await supabase.from('users').update({ total_lp: newLp }).eq('id', user.id);
            
            await supabase.from('lp_transactions').insert({
                user_id: user.id,
                amount: bonusLp,
                type: 'mission',
                reference_id: mission.course_id,
                description: `코스 완주 보너스 (500 LP)`
            });
        }
    }

    // 최종 User LP 업데이트 (이미 부분적으로 업데이트했지만 동기화 보장)
    await supabase.from('users').update({ total_lp: newLp }).eq('id', user.id);

    return NextResponse.json({
      success: true,
      lpEarned: addedLp,
      bonusLp,
      newTotalLp: newLp,
      tierUp,
      newTier,
      courseCompleted: isCourseCompleted
    });

  } catch (error) {
    console.error('Mission Complete Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.', success: false }, { status: 500 });
  }
}
