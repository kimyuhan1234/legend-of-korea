import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { recipeId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: existing } = await supabase
      .from('community_recipes')
      .select('user_id')
      .eq('id', params.recipeId)
      .single();

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { data: updated, error } = await supabase
      .from('community_recipes')
      .update(body)
      .eq('id', params.recipeId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, recipe: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '서버 오류' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { recipeId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: existing } = await supabase
      .from('community_recipes')
      .select('user_id, photos')
      .eq('id', params.recipeId)
      .single();

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete photos from Storage
    if (existing.photos && existing.photos.length > 0) {
      const paths = (existing.photos as string[]).map((url: string) => {
        const match = url.match(/recipe-photos\/(.+)/);
        return match ? match[1] : null;
      }).filter(Boolean) as string[];
      if (paths.length > 0) {
        await supabase.storage.from('recipe-photos').remove(paths);
      }
    }

    const { error } = await supabase
      .from('community_recipes')
      .delete()
      .eq('id', params.recipeId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '서버 오류' }, { status: 500 });
  }
}
