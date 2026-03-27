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
      .single();

    if (progress?.status === 'completed') {
      return NextResponse.json({ message: '이미 완료된 미션입니다.', alreadyCompleted: true });
    }

    // 3. 완료 처리 및 LP 지급 (Atomic Transaction or sequential updates)
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
    const newLp = (userData?.total_lp || 0) + mission.lp_reward;
    
    await supabase.from('users').update({ total_lp: newLp }).eq('id', user.id);

    // 3-3. LP 트랜잭션 기록
    await supabase.from('lp_transactions').insert({
      user_id: user.id,
      amount: mission.lp_reward,
      type: 'mission',
      reference_id: missionId,
      description: `${mission.title.ko} 완료`
    });

    // 3-4. 커뮤니티 동기화 (오픈형 등에서 체크 시)
    if (syncCommunity && (type === 'open' || type === 'boss' || type === 'photo')) {
      await supabase.from('community_posts').insert({
        user_id: user.id,
        course_id: mission.course_id,
        mission_id: missionId,
        photos: photoUrl ? [photoUrl] : [],
        text: answer || `${mission.title.ko} 미션 완료!`,
        is_spoiler: true
      });
    }

    // 4. 티어 재계산 및 보너스 체크 (간략 버전)
    const { data: nextTiers } = await supabase.from('tiers').select('*').lte('min_lp', newLp).order('level', { ascending: false }).limit(1);
    const newTier = nextTiers?.[0]?.level || 1;
    
    let tierUp = false;
    if (userData && userData.current_tier < newTier) {
       await supabase.from('users').update({ current_tier: newTier }).eq('id', user.id);
       tierUp = true;
    }

    // 5. 다음 미션 해제 (자동화)
    const nextSeq = mission.sequence + 1;
    const { data: nextMission } = await supabase.from('missions').select('id').eq('course_id', mission.course_id).eq('sequence', nextSeq).single();
    if (nextMission) {
      await supabase.from('mission_progress').upsert({
        user_id: user.id,
        mission_id: nextMission.id,
        status: 'unlocked'
      }, { onConflict: 'user_id, mission_id' });
    }

    // 6. 코스 완주 체크
    const { data: allCourseMissions } = await supabase.from('missions').select('id').eq('course_id', mission.course_id).eq('is_hidden', false);
    const totalMissions = allCourseMissions?.length || 0;
    
    const { data: completedMissions } = await supabase
        .from('mission_progress')
        .select('mission_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .in('mission_id', allCourseMissions?.map(m => m.id) || []);
    
    const isCourseCompleted = (completedMissions?.length || 0) === totalMissions;
    let bonusLp = 0;

    if (isCourseCompleted) {
        // 이미 완주 보너스를 받았는지 확인 필요 (여기서는 단순화)
        bonusLp = 500;
        const currentTotal = newLp + bonusLp;
        await supabase.from('users').update({ total_lp: currentTotal }).eq('id', user.id);
        
        await supabase.from('lp_transactions').insert({
            user_id: user.id,
            amount: bonusLp,
            type: 'mission',
            reference_id: mission.course_id,
            description: `코스 완주 보너스 (500 LP)`
        });
    }

    return NextResponse.json({
      success: true,
      lpEarned: mission.lp_reward,
      bonusLp,
      newTotalLp: newLp + bonusLp,
      tierUp,
      newTier,
      courseCompleted: isCourseCompleted
    });

  } catch (error) {
    console.error('Mission Complete Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
