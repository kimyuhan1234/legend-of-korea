import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');

    let query = supabase
      .from('community_recipes')
      .select('*, user:users(nickname, avatar_url)')
      .order('created_at', { ascending: false });

    if (country && country !== 'all') {
      query = query.eq('country_code', country);
    }

    const { data: recipes, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, recipes });
  } catch (error) {
    console.error('Recipes GET Error:', error);
    return NextResponse.json({ error: '레시피를 불러오는 중 오류가 발생했습니다.', success: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const {
      name, country_code, difficulty, cooking_time, servings,
      description, photos, korean_ingredients, foreign_ingredients, steps,
    } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: '요리 이름을 입력해주세요.' }, { status: 400 });
    }

    const { data: recipe, error } = await supabase
      .from('community_recipes')
      .insert({
        user_id: user.id,
        name: name.trim(),
        country_code: country_code || 'JP',
        difficulty: difficulty || 'medium',
        cooking_time: cooking_time || 30,
        servings: servings || 2,
        description: description || '',
        photos: photos || [],
        korean_ingredients: korean_ingredients || [],
        foreign_ingredients: foreign_ingredients || [],
        steps: steps || [],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    console.error('Recipes POST Error:', error);
    return NextResponse.json({ error: '레시피 등록 중 오류가 발생했습니다.', success: false }, { status: 500 });
  }
}
