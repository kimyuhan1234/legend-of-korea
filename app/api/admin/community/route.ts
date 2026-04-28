import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient();

    // 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: posts, error } = await supabase
      .from('community_posts')
      .select('*, users(nickname, current_level), courses(title)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Admin Community GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { post_id, is_hidden } = await req.json();

    // 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: updatedPost, error } = await supabase
      .from('community_posts')
      .update({ is_hidden })
      .eq('id', post_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Admin Community PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
