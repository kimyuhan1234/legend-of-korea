import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 커뮤니티 게시글 댓글 GET / POST.
 *
 * 2026-05 — 057 마이그레이션 적용 상태에 무관 동작하도록 nested SELECT 에서
 * selected_avatar_image_id 컬럼 의존 제거. 컬럼 부재 시 PostgREST 가 "column does
 * not exist" 던져 500 발생하던 문제 해결. avatar 정보는 클라이언트 측에서
 * avatar_url fallback (직전 commit 7ee9ea8 의 resolveProfileAvatarSrc 가 처리).
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = await createClient();

    const { data: comments, error } = await supabase
      .from('community_comments')
      .select('*, user:users(nickname, avatar_url)')
      .eq('post_id', params.postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, comments: comments ?? [] });
  } catch (err: unknown) {
    console.error('Comments GET Error:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
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

    const { data: comment, error } = await supabase
      .from('community_comments')
      .insert({
        post_id: params.postId,
        user_id: user.id,
        text: text.trim()
      })
      .select('*, user:users(nickname, avatar_url)')
      .single();

    if (error) throw error;

    // Update comments count
    const { data: post } = await supabase.from('community_posts').select('comments_count').eq('id', params.postId).single();
    const currentCount = (post?.comments_count || 0) + 1;
    await supabase.from('community_posts').update({ comments_count: currentCount }).eq('id', params.postId);

    return NextResponse.json({ success: true, comment });
  } catch (err: unknown) {
    console.error('Comments POST Error:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
