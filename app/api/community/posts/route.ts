import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { VALID_THEME_IDS } from '@/lib/data/post-themes';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const region = searchParams.get('region');
    const theme = searchParams.get('theme');
    const sort = searchParams.get('sort');
    const limitParam = searchParams.get('limit');
    
    // Sort logic
    const limit = limitParam ? parseInt(limitParam) : 10;
    const isPopular = sort === 'popular';

    let query = supabase
      .from('community_posts')
      .select(`
        *,
        user:users (nickname, avatar_url, current_level)
      `);

    // Popular sort
    if (isPopular) {
      query = query.order('likes_count', { ascending: false }).order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    query = query.limit(limit);

    if (cursor && !isPopular) {
      query = query.lt('created_at', cursor);
    }

    if (region && region !== 'all') {
      query = query.eq('region', region);
    }

    if (theme && theme !== 'all' && VALID_THEME_IDS.has(theme)) {
      query = query.eq('theme', theme);
    }

    const { data: posts, error } = await query;

    if (error) throw error;

    // 2026-05 — 057 적용 상태 무관 동작 위해 avatar enrich 제거.
    // 클라이언트가 avatar_url fallback (resolveProfileAvatarSrc) 으로 처리.
    const safePosts = posts ?? [];
    const nextCursor = !isPopular && safePosts.length === limit ? (safePosts[safePosts.length - 1] as { created_at: string }).created_at : null;

    return NextResponse.json({
      success: true,
      posts: safePosts,
      nextCursor
    });
  } catch (error) {
    console.error('Community GET Error:', error);
    return NextResponse.json({ error: '데이터를 불러오는 중 오류가 발생했습니다.', success: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { title, text, photos, region, theme, tags } = await req.json();

    // theme 유효성 체크 (null 허용 — 레거시/미분류 글)
    const safeTheme = (typeof theme === 'string' && VALID_THEME_IDS.has(theme) && theme !== 'all')
      ? theme
      : null;

    if (!text || text.length < 5) {
      return NextResponse.json({ error: '내용을 5자 이상 입력해주세요.' }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: '내용은 5000자 이하로 입력해주세요.' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: '제목을 입력해주세요.' }, { status: 400 });
    }

    if (title.length > 100) {
      return NextResponse.json({ error: '제목은 100자 이하로 입력해주세요.' }, { status: 400 });
    }

    const { data: post, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        title,
        text,
        region: region || 'all',
        theme: safeTheme,
        tags: tags || [],
        photos: photos || [],
        likes_count: 0
      })
      .select()
      .single();

    if (error) throw error;

    // LP 지급 (사진 포함 여부에 따라 다름)
    const lpAmount = photos && photos.length > 0 ? 30 : 50; // COMMUNITY_PHOTO=30, COMMUNITY_REVIEW=50
    const lpType = photos && photos.length > 0 ? 'COMMUNITY_PHOTO' : 'COMMUNITY_REVIEW';

    // User LP 업데이트
    const { data: userData } = await supabase.from('users').select('total_lp').eq('id', user.id).single();
    const newLp = (userData?.total_lp || 0) + lpAmount;
    
    await supabase.from('users').update({ total_lp: newLp }).eq('id', user.id);
    
    // LP 트랜잭션 기록
    await supabase.from('lp_transactions').insert({
      user_id: user.id,
      amount: lpAmount,
      type: lpType,
      reference_id: post.id,
      description: '커뮤니티 기록 작성 보너스'
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Community POST Error:', error);
    return NextResponse.json({ error: '기록 등록 중 오류가 발생했습니다.', success: false }, { status: 500 });
  }
}
