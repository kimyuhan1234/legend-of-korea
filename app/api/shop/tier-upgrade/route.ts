import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { TIERS } from '@/lib/constants/tiers';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('current_tier, total_lp')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: '유저 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    const currentTierLevel = userData.current_tier || 1;
    const currentLP = userData.total_lp || 0;

    const nextTier = TIERS.find(t => t.level === currentTierLevel + 1);
    if (!nextTier) {
      return NextResponse.json({ error: '이미 최고 티어입니다.' }, { status: 400 });
    }

    if (currentLP < nextTier.requiredLP) {
      return NextResponse.json({
        error: `LP가 부족합니다. ${nextTier.requiredLP - currentLP} LP 더 필요합니다.`,
      }, { status: 400 });
    }

    const newLP = currentLP - nextTier.requiredLP;

    const { error: updateError } = await supabase
      .from('users')
      .update({
        current_tier: nextTier.level,
        total_lp: newLP,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    await supabase.from('lp_transactions').insert({
      user_id: user.id,
      amount: -nextTier.requiredLP,
      type: 'TIER_UPGRADE',
      description: `${nextTier.name.ko} 승급 (Lv.${nextTier.level})`,
      applied: true,
      applied_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      newTier: nextTier.level,
      newLP,
      tierName: nextTier.name,
      tierEmoji: nextTier.emoji,
      deducted: nextTier.requiredLP,
    });

  } catch (error) {
    console.error('Tier upgrade error:', error);
    return NextResponse.json({ error: '승급 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
