import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const COURSE_COMPLETE_BONUS = 500;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { missionId, type, answer, photoUrls, syncCommunity } = body;

    // ── 입력 검증 ─────────────────────────────────────────────
    if (!missionId || !type) {
      return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    if (type === 'photo') {
      if (!Array.isArray(photoUrls) || photoUrls.length === 0) {
        return NextResponse.json({ error: '사진을 1장 이상 업로드해야 합니다.' }, { status: 400 });
      }
      if (photoUrls.length > 3) {
        return NextResponse.json({ error: '사진은 최대 3장까지 업로드 가능합니다.' }, { status: 400 });
      }
      // 서버 소유 URL만 허용 (클라이언트 조작 방지)
      const storageOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
      const hasInvalidUrl = photoUrls.some(
        (url: unknown) => typeof url !== 'string' || !url.startsWith(storageOrigin)
      );
      if (hasInvalidUrl) {
        return NextResponse.json({ error: '유효하지 않은 이미지 URL입니다.' }, { status: 400 });
      }
    }

    // ── 인증 ──────────────────────────────────────────────────
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // ── 미션 조회 ─────────────────────────────────────────────
    const { data: mission, error: missionError } = await supabase
      .from('missions')
      .select('id, title, description, type, correct_answer, lp_reward, course_id, sequence, is_hidden')
      .eq('id', missionId)
      .single();

    if (missionError || !mission) {
      return NextResponse.json({ error: '미션을 찾을 수 없습니다.' }, { status: 404 });
    }

    // ── 정답 검증 ─────────────────────────────────────────────
    if (type === 'quiz') {
      if (!answer?.trim()) {
        return NextResponse.json({ error: '정답을 입력해주세요.' }, { status: 400 });
      }
      const normalizedInput   = answer.trim().toLowerCase().replace(/\s+/g, '');
      const normalizedCorrect = (mission.correct_answer ?? '').trim().toLowerCase().replace(/\s+/g, '');
      if (normalizedInput !== normalizedCorrect) {
        return NextResponse.json({ isCorrect: false, error: '정답이 아닙니다. 다시 도전해보세요!' });
      }
    }
    // photo / open / boss / hidden → 항상 통과

    // ── 원자적 중복 완료 방지 ─────────────────────────────────
    // 전략: UPDATE (status != 'completed') → 0 rows → INSERT → 23505(중복) 시 이미 완료
    const completionPayload = {
      user_id:      user.id,
      mission_id:   missionId,
      status:       'completed',
      answer_text:  answer ?? null,
      photo_url:    photoUrls?.[0] ?? null,
      lp_earned:    mission.lp_reward,
      completed_at: new Date().toISOString(),
    };

    const { data: updatedRows } = await supabase
      .from('mission_progress')
      .update(completionPayload)
      .eq('user_id',   user.id)
      .eq('mission_id', missionId)
      .neq('status', 'completed')
      .select('id');

    if (!updatedRows || updatedRows.length === 0) {
      // 기존 행 없음 → 신규 INSERT 시도
      const { error: insertError } = await supabase
        .from('mission_progress')
        .insert(completionPayload);

      if (insertError?.code === '23505') {
        // 동시 요청이 먼저 완료함 → 멱등 응답
        return NextResponse.json({ isCorrect: true, alreadyCompleted: true, lpEarned: mission.lp_reward });
      }
      if (insertError) throw insertError;
    }

    // ── 원자적 LP 지급 (Read-Modify-Write 금지) ───────────────
    const { error: rpcError } = await supabase.rpc('increment_user_lp', {
      uid:   user.id,
      delta: mission.lp_reward,
    });
    if (rpcError) throw rpcError;

    // ── LP 트랜잭션 기록 (auto-applied) ───────────────────────
    const lpType =
      type === 'boss'   ? 'MISSION_BOSS'   :
      type === 'hidden' ? 'MISSION_HIDDEN' :
      type === 'photo'  ? 'MISSION_PHOTO'  :
      type === 'open'   ? 'MISSION_OPEN'   : 'MISSION_QUIZ';

    await supabase.from('lp_transactions').insert({
      user_id:      user.id,
      amount:       mission.lp_reward,
      type:         lpType,
      reference_id: missionId,
      description:  `${mission.title?.ko ?? '미션'} 완료`,
      applied:      true,
      applied_at:   new Date().toISOString(),
    });

    // ── 커뮤니티 동기화 (선택) ────────────────────────────────
    if (syncCommunity && ['open', 'boss', 'photo', 'hidden'].includes(type)) {
      await supabase.from('community_posts').insert({
        user_id:    user.id,
        course_id:  mission.course_id,
        mission_id: missionId,
        photos:     photoUrls ?? [],
        text:       answer || `${mission.title?.ko ?? '미션'} 완료!`,
        is_spoiler: true,
      });
    }

    // ── 다음 미션 해제 ────────────────────────────────────────
    if (!mission.is_hidden) {
      const { data: nextMission } = await supabase
        .from('missions')
        .select('id')
        .eq('course_id', mission.course_id)
        .eq('sequence',  mission.sequence + 1)
        .eq('is_hidden', false)
        .maybeSingle();

      if (nextMission) {
        await supabase.from('mission_progress').upsert(
          { user_id: user.id, mission_id: nextMission.id, status: 'unlocked' },
          { onConflict: 'user_id,mission_id', ignoreDuplicates: true }
        );
      }
    }

    // ── 코스 완주 체크 ────────────────────────────────────────
    const { data: allNormal } = await supabase
      .from('missions').select('id').eq('course_id', mission.course_id).eq('is_hidden', false);

    const { data: completedList } = await supabase
      .from('mission_progress')
      .select('mission_id')
      .eq('user_id', user.id)
      .eq('status',  'completed')
      .in('mission_id', allNormal?.map((m: any) => m.id) ?? []);

    const courseCompleted =
      (allNormal?.length ?? 0) > 0 &&
      (completedList?.length ?? 0) >= (allNormal?.length ?? 0);

    let bonusLp = 0;
    if (courseCompleted) {
      // 완주 보너스 중복 방지
      const { data: existingBonus } = await supabase
        .from('lp_transactions')
        .select('id')
        .eq('user_id',      user.id)
        .eq('reference_id', mission.course_id)
        .eq('type',         'COURSE_COMPLETE')
        .maybeSingle();

      if (!existingBonus) {
        bonusLp = COURSE_COMPLETE_BONUS;
        const { error: bonusErr } = await supabase.rpc('increment_user_lp', {
          uid: user.id, delta: bonusLp,
        });
        if (!bonusErr) {
          await supabase.from('lp_transactions').insert({
            user_id:      user.id,
            amount:       bonusLp,
            type:         'COURSE_COMPLETE',
            reference_id: mission.course_id,
            description:  '코스 완주 보너스',
            applied:      true,
            applied_at:   new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({
      isCorrect:      true,
      lpEarned:       mission.lp_reward,
      bonusLp,
      courseCompleted,
    });

  } catch (error) {
    console.error('Mission Verify Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
