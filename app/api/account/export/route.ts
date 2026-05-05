import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GDPR Article 20 / PIPA — 개인정보 이동권 (Data Portability).
 *
 * 로그인 사용자의 개인 데이터를 단일 JSON 으로 묶어 반환한다.
 * 비밀번호 해시·세션 토큰·내부 ID 매핑 등 보안 민감 정보는 제외.
 *
 * 응답 헤더에 Content-Disposition 을 붙여 클라이언트에서 그대로
 * Blob URL → anchor download 패턴으로 다운로드 가능.
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await createServiceClient()
  const userId = user.id

  // 본인 데이터만 service_role 로 조회 (RLS 무관, 본인 ID 로 필터링).
  // 테이블 미존재 또는 권한 오류 시 해당 섹션은 빈 배열로 처리.
  const safeFetch = async <T>(promise: PromiseLike<{ data: T | null; error: unknown }>): Promise<T | []> => {
    try {
      const { data, error } = await promise
      if (error) return [] as unknown as []
      return (data ?? []) as T
    } catch {
      return [] as unknown as []
    }
  }

  const [profile, orders, missionProgress, lpTransactions, communityPosts, passes] = await Promise.all([
    safeFetch(admin.from('users').select('*').eq('id', userId).maybeSingle()),
    safeFetch(admin.from('orders').select('*').eq('user_id', userId)),
    safeFetch(admin.from('mission_progress').select('*').eq('user_id', userId)),
    safeFetch(admin.from('lp_transactions').select('*').eq('user_id', userId)),
    safeFetch(admin.from('community_posts').select('*').eq('user_id', userId)),
    safeFetch(admin.from('passes').select('*').eq('user_id', userId)),
  ])

  const exportPayload = {
    schema_version: 1,
    exported_at: new Date().toISOString(),
    user: {
      id: userId,
      email: user.email,
      created_at: user.created_at,
      profile,
    },
    purchases: {
      orders,
      passes,
    },
    activity: {
      mission_progress: missionProgress,
      lp_transactions: lpTransactions,
      community_posts: communityPosts,
    },
    note: 'GDPR Article 20 / PIPA data portability export. Sensitive fields (password hashes, session tokens) are excluded.',
  }

  const json = JSON.stringify(exportPayload, null, 2)
  const filename = `clouds-with-you-data-${userId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`

  return new NextResponse(json, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
