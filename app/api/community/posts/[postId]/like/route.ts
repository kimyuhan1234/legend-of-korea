import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 커뮤니티 게시글 좋아요 토글.
 *
 * 2026-05 — 트리거 충돌 fix:
 *   trg_community_likes_count (001:317) 가 INSERT/DELETE 시 likes_count 자동 동기화.
 *   기존 코드의 manual UPDATE 가 트리거와 중복되어 본인 글 토글 시 +2/-2 double-increment.
 *   manual UPDATE 제거 + 트리거가 동기화한 likes_count 를 SELECT 로 fetch 하여 server-truth 응답.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const postId = params.postId;

    // .single() → .maybeSingle() — 0 row 시 error throw 회피
    const { data: existingLike } = await supabase
      .from('community_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .maybeSingle();

    let action: 'liked' | 'unliked';
    if (existingLike) {
      const { error: delErr } = await supabase.from('community_likes').delete().eq('id', existingLike.id);
      if (delErr) throw delErr;
      action = 'unliked';
    } else {
      const { error: insErr } = await supabase.from('community_likes').insert({ user_id: user.id, post_id: postId });
      if (insErr) throw insErr;
      action = 'liked';
    }

    // 트리거가 동기화한 likes_count 를 SELECT 로 가져오기 (server-truth).
    // RLS (community_posts SELECT public read) 통과.
    const { data: post } = await supabase
      .from('community_posts')
      .select('likes_count')
      .eq('id', postId)
      .maybeSingle<{ likes_count: number | null }>();

    return NextResponse.json({
      success: true,
      action,
      likes_count: post?.likes_count ?? 0,
    });
  } catch (err) {
    console.error('Like toggle error:', err);
    const message = err instanceof Error ? err.message : '서버 오류';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

