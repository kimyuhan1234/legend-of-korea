import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = await createClient();
    const { postId } = params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    // Use RPC for atomic increment
    const { error } = await supabase.rpc('increment_likes', { post_id: postId });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Like Error:', error);
    return NextResponse.json({ error: '좋아요 반영 중 오류가 발생했습니다.', success: false }, { status: 500 });
  }
}
