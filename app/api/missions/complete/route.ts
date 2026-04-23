import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { LP_REWARDS } from '@/lib/constants/lp';
// [Day 4 디자인 B] 자동 승급 제거 — 레벨업은 상점에서 수동만 가능

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
    
    // LP 보상 결정 (미션 타입별)
    let addedLp = mission.lp_reward; // 기본값
    if (type === 'boss') addedLp = LP_REWARDS.MISSION_BOSS;
    else if (type === 'hidden') addedLp = LP_REWARDS.MISSION_HIDDEN;
    else addedLp = LP_REWARDS.MISSION_QUIZ; // 기본 퀴즈/사진/오픈형은 100

    let newLp = currentLp + addedLp;
    
    // 3-3. LP 트랜잭션 기록
    let lpType = 'MISSION_QUIZ';
    if (type === 'boss') lpType = 'MISSION_BOSS';
    else if (type === 'hidden') lpType = 'MISSION_HIDDEN';
    else if (type === 'photo') lpType = 'MISSION_PHOTO';
    else if (type === 'open') lpType = 'MISSION_OPEN';

    await supabase.from('lp_transactions').insert({
      user_id: user.id,
      amount: addedLp,
      type: lpType,
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

    // 4. [Day 4 디자인 B] 자동 승급 비활성. 레벨업은 /memories 상점에서 수동만 가능.
    const tierUp = false;
    const finalTier = userData?.current_tier || 1;

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
            .eq('description', `코스 완주 보너스 (${LP_REWARDS.COURSE_COMPLETE} LP)`)
            .maybeSingle();

        if (!existingBonus) {
            bonusLp = LP_REWARDS.COURSE_COMPLETE;
            newLp += bonusLp;
            
            await supabase.from('lp_transactions').insert({
                user_id: user.id,
                amount: bonusLp,
                type: 'COURSE_COMPLETE',
                reference_id: mission.course_id,
                description: `코스 완주 보너스 (${LP_REWARDS.COURSE_COMPLETE} LP)`
            });

            // [Day 4] 자동 승급 비활성 — 보너스 지급만 수행
        }
    }

    // 최종 User LP 업데이트 (이미 부분적으로 업데이트했지만 동기화 보장)
    await supabase.from('users').update({ total_lp: newLp }).eq('id', user.id);

    // 파티 채팅 자동 알림 — 파티에 소속된 경우 미션 완료 메시지 자동 전송
    try {
      const { data: membership } = await supabase
        .from('quest_party_members')
        .select('party_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (membership) {
        await supabase.from('party_chat').insert({
          party_id: membership.party_id,
          user_id: user.id,
          message: `미션 "${mission.title.ko}" 완료! 🎉`,
          message_type: 'mission_complete',
          mission_id: missionId,
        });
      }
    } catch {
      // 채팅 알림 실패는 미션 완료에 영향을 주지 않음
    }

    return NextResponse.json({
      success: true,
      lpEarned: addedLp,
      bonusLp,
      newTotalLp: newLp,
      tierUp,
      newTier: null,
      courseCompleted: isCourseCompleted
    });

  } catch (error) {
    console.error('Mission Complete Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.', success: false }, { status: 500 });
  }
}
