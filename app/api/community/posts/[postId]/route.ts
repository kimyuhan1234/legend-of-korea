import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// DELETE — 게시물 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 본인 글인지 확인
    const { data: post } = await supabase
      .from('community_posts')
      .select('user_id, photos')
      .eq('id', params.postId)
      .single();

    if (!post || post.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 사진 삭제 (Storage)
    if (post.photos && post.photos.length > 0) {
      const paths = post.photos.map((url: string) => {
        // URL에서 storage path 추출
        const match = url.match(/community-photos\/(.+)/);
        return match ? match[1] : null;
      }).filter(Boolean) as string[];
      
      if (paths.length > 0) {
        await supabase.storage.from('community-photos').remove(paths);
      }
    }

    // 게시물 삭제
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', params.postId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Community DELETE Error:', err);
    return NextResponse.json({ error: err.message || '서버 오류' }, { status: 500 });
  }
}

// PATCH — 게시물 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: post } = await supabase
      .from('community_posts')
      .select('user_id')
      .eq('id', params.postId)
      .single();

    if (!post || post.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, text, region, tags, photos } = await request.json();

    const { data: updated, error } = await supabase
      .from('community_posts')
      .update({ title, text, region, tags, photos })
      .eq('id', params.postId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, post: updated });
  } catch (err: any) {
    console.error('Community PATCH Error:', err);
    return NextResponse.json({ error: err.message || '서버 오류' }, { status: 500 });
  }
}
