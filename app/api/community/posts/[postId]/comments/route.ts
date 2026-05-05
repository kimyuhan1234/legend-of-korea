import { createClient, createServiceClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 커뮤니티 게시글 댓글 GET / POST.
 *
 * 2026-05 — RLS 우회 fix:
 *   POST 시 community_posts.comments_count UPDATE 가 RLS (본인 글만 UPDATE) 거부 → 500.
 *   service_role 로 우회 (server-side only, 안전).
 *   GET 의 nested user SELECT 도 RLS 영향 줄이기 위해 user_id batch fetch 패턴.
 */

export async function GET(
  _request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = await createClient();

    // 1. 댓글만 가져오기 (community_comments SELECT RLS = public, 통과)
    const { data: comments, error } = await supabase
      .from('community_comments')
      .select('id, post_id, user_id, text, created_at')
      .eq('post_id', params.postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const safeComments = comments ?? [];
    if (safeComments.length === 0) {
      return NextResponse.json({ success: true, comments: [] });
    }

    // 2. 작성자 정보 batch fetch — service_role 로 RLS 우회
    //    (users SELECT RLS 가 본인만 → 다른 댓글 작성자 nested embedding 시 null/error)
    const userIds = Array.from(new Set(safeComments.map((c) => c.user_id))).filter(Boolean);
    const admin = await createServiceClient();
    const { data: users } = await admin
      .from('users')
      .select('id, nickname, avatar_url')
      .in('id', userIds);

    const userMap = new Map<string, { nickname: string | null; avatar_url: string | null }>();
    for (const u of users ?? []) {
      userMap.set(u.id as string, {
        nickname: (u.nickname as string) ?? null,
        avatar_url: (u.avatar_url as string) ?? null,
      });
    }

    // 3. 합성
    const enriched = safeComments.map((c) => ({
      ...c,
      user: userMap.get(c.user_id) ?? null,
    }));

    return NextResponse.json({ success: true, comments: enriched });
  } catch (err) {
    console.error('Comments GET Error:', err);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      detail: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { text } = await request.json();
    if (!text || text.trim() === '') {
      return NextResponse.json({ error: '댓글 내용을 입력해주세요.' }, { status: 400 });
    }
    if (text.length > 1000) {
      return NextResponse.json({ error: '댓글은 1000자 이하로 입력해주세요.' }, { status: 400 });
    }

    // 1. 댓글 INSERT (RLS: auth.uid() = user_id 통과)
    const { data: comment, error } = await supabase
      .from('community_comments')
      .insert({
        post_id: params.postId,
        user_id: user.id,
        text: text.trim(),
      })
      .select('id, post_id, user_id, text, created_at')
      .single();

    if (error) throw error;

    // 2. 작성자 정보 — 본인이므로 RLS 통과하지만 일관성 위해 service_role 사용
    const admin = await createServiceClient();
    const { data: userRow } = await admin
      .from('users')
      .select('nickname, avatar_url')
      .eq('id', user.id)
      .maybeSingle<{ nickname: string | null; avatar_url: string | null }>();

    const enriched = {
      ...comment,
      user: userRow ?? null,
    };

    // 3. comments_count 동기화 — service_role 로 RLS 우회 (본인 글이 아니어도 UPDATE 가능)
    const { data: post } = await admin
      .from('community_posts')
      .select('comments_count')
      .eq('id', params.postId)
      .maybeSingle<{ comments_count: number | null }>();
    const currentCount = (post?.comments_count ?? 0) + 1;
    await admin
      .from('community_posts')
      .update({ comments_count: currentCount })
      .eq('id', params.postId);

    return NextResponse.json({ success: true, comment: enriched });
  } catch (err) {
    console.error('Comments POST Error:', err);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      detail: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    }, { status: 500 });
  }
}
