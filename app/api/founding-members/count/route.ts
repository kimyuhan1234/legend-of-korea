import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const TARGET = 1000

/**
 * 베타 Founding Members 가입자 수 카운트.
 * users 테이블 RLS 가 anon 에게는 0 row 만 노출하므로 service-role 클라이언트로
 * count 만 조회 (개별 row 는 반환하지 않음).
 *
 * 캐시: 1 분 (가입 카운터는 분 단위 정확도면 충분).
 */
export async function GET() {
  try {
    const supabase = await createServiceClient()

    const { count, error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json(
        { error: 'count_failed', joined: 0, target: TARGET, remaining: TARGET, isFull: false },
        { status: 500 },
      )
    }

    const joined = count ?? 0
    const remaining = Math.max(0, TARGET - joined)

    return NextResponse.json(
      {
        joined,
        target: TARGET,
        remaining,
        isFull: joined >= TARGET,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
      },
    )
  } catch {
    return NextResponse.json(
      { error: 'internal', joined: 0, target: TARGET, remaining: TARGET, isFull: false },
      { status: 500 },
    )
  }
}
