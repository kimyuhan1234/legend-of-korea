import { SupabaseClient } from '@supabase/supabase-js';

interface Tier {
  level: number;
  name: { [key: string]: string };
  min_lp: number;
  discount_rate: number;
  badge_url?: string;
}

interface TierPromotionResult {
  tierUp: boolean;
  newTier?: Tier;
  previousTier?: number;
}

export async function checkAndPromoteTier(
  supabase: SupabaseClient, 
  userId: string, 
  currentLp: number, 
  currentTierLevel: number
): Promise<TierPromotionResult> {
  try {
    // 1. Get next tier info
    const { data: nextTier, error: tierError } = await supabase
      .from('tiers')
      .select('*')
      .eq('level', currentTierLevel + 1)
      .maybeSingle();

    if (tierError || !nextTier) return { tierUp: false };

    const tierData = nextTier as Tier;

    // 2. Check if LP is enough
    if (currentLp >= tierData.min_lp) {
      // 3. Promote!
      const { error: updateError } = await supabase
        .from('users')
        .update({ current_tier: tierData.level })
        .eq('id', userId);

      if (updateError) throw updateError;

      // 4. Issue reward coupon
      if (tierData.discount_rate > 0) {
        // Simple 8-char random code
        const couponCode = `TIER-${tierData.level}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 90); // 90 days

        await supabase.from('coupons').insert({
          user_id: userId,
          code: couponCode,
          discount_rate: tierData.discount_rate,
          lp_cost: 0, // Reward coupon
          expires_at: expiresAt.toISOString(),
          is_used: false
        });
      }

      // 5. Check if next tier is also reached (recursively)
      const furtherPromotion = await checkAndPromoteTier(supabase, userId, currentLp, tierData.level);
      
      if (furtherPromotion.tierUp) {
        return {
          tierUp: true,
          newTier: furtherPromotion.newTier,
          previousTier: currentTierLevel
        };
      }

      return {
        tierUp: true,
        newTier: tierData,
        previousTier: currentTierLevel
      };
    }

    return { tierUp: false };
  } catch (error) {
    console.error('Tier Promotion Error:', error);
    return { tierUp: false };
  }
}
