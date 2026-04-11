// 서버 측 크레딧 차감 공용 헬퍼.
// API 라우트에서 재사용 — 잔액 확인 → 차감 → 사용 로그 기록을 한 번에 처리한다.
// 실패 시 명확한 에러 코드를 반환해 호출 쪽에서 UI 분기 가능.

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export type CreditFeature =
  | 'weather'
  | 'distance'
  | 'ai_curation'
  | 'pdf'
  | 'schedule_change'
  | 'companion_share'

// v1.2 스펙의 feature 별 고정 단가 — 서버에서만 신뢰된다.
export const CREDIT_COST: Record<CreditFeature, number> = {
  weather: 1,
  distance: 1,
  ai_curation: 3,
  pdf: 2,
  schedule_change: 2,
  companion_share: 1,
}

export type DeductCreditsResult =
  | { ok: true; remaining: number; used: number }
  | { ok: false; error: 'unauthorized' }
  | { ok: false; error: 'no_active_subscription' }
  | { ok: false; error: 'insufficient_credits'; remaining: number; required: number }
  | { ok: false; error: 'update_failed'; detail: string }

/**
 * 지정한 유저의 활성 구독에서 `feature` 에 해당하는 크레딧을 차감하고 credit_usage 에 로그를 남긴다.
 * - 구독이 없으면 no_active_subscription
 * - 잔액 부족이면 insufficient_credits + 현재 잔액 반환
 * - 성공 시 새 잔액 반환
 */
export async function deductCredits(
  supabase: SupabaseClient<Database>,
  userId: string,
  feature: CreditFeature,
  metadata?: Record<string, unknown>
): Promise<DeductCreditsResult> {
  const required = CREDIT_COST[feature]

  const { data: sub, error: subErr } = await supabase
    .from('user_subscriptions')
    .select('id, credits_remaining, status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

  if (subErr || !sub) {
    return { ok: false, error: 'no_active_subscription' }
  }

  if (sub.credits_remaining < required) {
    return {
      ok: false,
      error: 'insufficient_credits',
      remaining: sub.credits_remaining,
      required,
    }
  }

  const newBalance = sub.credits_remaining - required

  const { error: updateErr } = await supabase
    .from('user_subscriptions')
    .update({
      credits_remaining: newBalance,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sub.id)

  if (updateErr) {
    return { ok: false, error: 'update_failed', detail: updateErr.message }
  }

  // 사용 로그 — 실패해도 차감 자체는 이미 성공이므로 error 는 무시
  await supabase.from('credit_usage').insert({
    user_id: userId,
    feature,
    credits_used: required,
    metadata: metadata ?? null,
  })

  return { ok: true, remaining: newBalance, used: required }
}
