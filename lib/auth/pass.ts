import { createClient } from '@/lib/supabase/server'
import type { PassType } from '@/lib/data/passes'

export interface ActivePass {
  id: string
  type: PassType
  expiresAt: string
  durationDays: 7 | 15 | 30
}

const isTestMode = () => process.env.TEST_MODE === 'true'

/**
 * TEST_MODE 가짜 활성 패스 — 베타 운영 중 모든 사용자 풀 액세스 부여.
 * 정식 출시 시 환경변수 false 로 토글 → 즉시 실 패스 체크 복원.
 */
function testModeFallback(): ActivePass {
  return {
    id: 'test-mode',
    type: 'long',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    durationDays: 30,
  }
}

/**
 * 활성 패스 조회 (PRD-PRICING-2026-001).
 *
 * 우선순위:
 *   1. TEST_MODE=true → 가짜 long 패스 반환 (베타 운영)
 *   2. 비로그인 → null
 *   3. passes 테이블 status='active' AND expires_at > now() 중 가장 늦게 만료되는 것 1 건
 */
export async function getActivePass(userId: string | null): Promise<ActivePass | null> {
  if (isTestMode()) return testModeFallback()
  if (!userId) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('passes')
    .select('id, type, expires_at, duration_days')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[getActivePass]', error.message)
    return null
  }
  if (!data) return null

  return {
    id: data.id,
    type: data.type as PassType,
    expiresAt: data.expires_at,
    durationDays: data.duration_days as 7 | 15 | 30,
  }
}

export async function hasActivePass(userId: string | null): Promise<boolean> {
  return (await getActivePass(userId)) !== null
}

/**
 * 미션 접근 가능 여부.
 * - is_free=true (서울 첫 미션) → 누구나 true
 * - 그 외 → 활성 패스 필요
 */
export async function canAccessMission(
  userId: string | null,
  missionId: string,
): Promise<boolean> {
  if (isTestMode()) return true

  const supabase = await createClient()
  const { data: mission, error } = await supabase
    .from('missions')
    .select('is_free')
    .eq('id', missionId)
    .single()

  if (error || !mission) return false
  if (mission.is_free) return true
  return await hasActivePass(userId)
}

/** K-Food 듀프매칭 / 뷰티푸드 / 퓨전 레시피 / SPOT 풀버전 — 활성 패스 필요 */
export async function canAccessPaidContent(userId: string | null): Promise<boolean> {
  return await hasActivePass(userId)
}
