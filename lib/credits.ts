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
  | 'ai_dupe'
  | 'taste_match'

// v1.2 스펙의 feature 별 고정 단가 — 서버에서만 신뢰된다.
export const CREDIT_COST: Record<CreditFeature, number> = {
  weather: 1,
  distance: 1,
  ai_curation: 3,
  pdf: 2,
  schedule_change: 2,
  companion_share: 1,
  ai_dupe: 3,
  taste_match: 3,
}

export type DeductCreditsResult =
  | { ok: true; remaining: number; used: number }
  | { ok: false; error: 'unauthorized' }
  | { ok: false; error: 'no_active_subscription' }
  | { ok: false; error: 'insufficient_credits'; remaining: number; required: number }
  | { ok: false; error: 'update_failed'; detail: string }

/**
 * [단일 화폐 통일 — 빗방울만 사용]
 *
 * 크레딧 UI 가 전수 제거됐기 때문에 서버 차감 로직도 no-op 으로 변경.
 * 항상 성공을 반환해 API 측 "insufficient_credits" / "no_active_subscription"
 * 분기가 트리거되지 않도록 한다.
 *
 * 시그니처·리턴 타입은 유지 — 호출 측(API routes) 코드를 변경하지 않아도
 * 모든 기능이 차단 해제되고, 나중에 크레딧 시스템을 부활시키려면 이 함수만 복원하면 된다.
 *
 * DB 테이블(user_subscriptions.credits_remaining, credit_usage) 및
 * /api/credits/* 엔드포인트는 데이터·이력 보존 목적으로 그대로 둔다.
 */
export async function deductCredits(
  _supabase: SupabaseClient<Database>,
  _userId: string,
  _feature: CreditFeature,
  _metadata?: Record<string, unknown>
): Promise<DeductCreditsResult> {
  return { ok: true, remaining: 0, used: 0 }
}
