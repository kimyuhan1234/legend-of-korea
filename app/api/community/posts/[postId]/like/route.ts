import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const postId = params.postId;

    // Check if like exists
    const { data: existingLike } = await supabase
      .from('community_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .single();

    if (existingLike) {
      // Unlike
      await supabase.from('community_likes').delete().eq('id', existingLike.id);
      
      const { data: post } = await supabase.from('community_posts').select('likes_count').eq('id', postId).single();
      const currentLikes = Math.max((post?.likes_count || 0) - 1, 0);
      await supabase.from('community_posts').update({ likes_count: currentLikes }).eq('id', postId);
      
      return NextResponse.json({ success: true, action: 'unliked', likes_count: currentLikes });
    } else {
      // Like
      await supabase.from('community_likes').insert({ user_id: user.id, post_id: postId });
      
      const { data: post } = await supabase.from('community_posts').select('likes_count').eq('id', postId).single();
      const currentLikes = (post?.likes_count || 0) + 1;
      await supabase.from('community_posts').update({ likes_count: currentLikes }).eq('id', postId);
      
      return NextResponse.json({ success: true, action: 'liked', likes_count: currentLikes });
    }
  } catch (err: any) {
    console.error('Like toggle error:', err);
    return NextResponse.json({ error: err.message || '서버 오류' }, { status: 500 });
  }
}
