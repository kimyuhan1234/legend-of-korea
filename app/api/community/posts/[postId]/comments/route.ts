import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { loadAvatarMap } from '@/lib/avatar/data';

interface CommentRow {
  user?: { selected_avatar_image_id?: string | null } | null;
  [k: string]: unknown;
}

async function enrichComments<T extends CommentRow>(comments: T[]): Promise<T[]> {
  const avatarMap = await loadAvatarMap(comments.map((c) => c.user?.selected_avatar_image_id));
  return comments.map((c) => {
    if (!c.user) return c;
    const av = c.user.selected_avatar_image_id ? avatarMap.get(c.user.selected_avatar_image_id) : null;
    return {
      ...c,
      user: {
        ...c.user,
        selected_avatar_filename: av?.filename ?? null,
        selected_avatar_slug: av?.slug ?? null,
      },
    };
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = await createClient();

    const { data: comments, error } = await supabase
      .from('community_comments')
      .select('*, user:users(nickname, avatar_url, selected_avatar_image_id)')
      .eq('post_id', params.postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const enriched = await enrichComments(comments as CommentRow[]);
    return NextResponse.json({ success: true, comments: enriched });
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
      .select('*, user:users(nickname, avatar_url, selected_avatar_image_id)')
      .single();

    if (error) throw error;

    const [enriched] = await enrichComments([comment as CommentRow]);

    // Update comments count
    const { data: post } = await supabase.from('community_posts').select('comments_count').eq('id', params.postId).single();
    const currentCount = (post?.comments_count || 0) + 1;
    await supabase.from('community_posts').update({ comments_count: currentCount }).eq('id', params.postId);

    return NextResponse.json({ success: true, comment: enriched });
  } catch (err: unknown) {
    console.error('Comments POST Error:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
