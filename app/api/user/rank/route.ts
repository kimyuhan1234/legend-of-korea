import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateLevelFromRaindrops } from '@/lib/tiers/levels'

export const dynamic = 'force-dynamic'

/**
 * GET /api/user/rank?userId=...
 *
 * scholar/warrior 분기 폐기 후 단순 레벨 응답.
 * 응답: { userId, level }
 *
 * RankBadge 클라이언트 컴포넌트가 호출. 댓글/리더보드 대량 렌더 시 N+1 주의.
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: userRow } = await supabase
    .from('users')
    .select('total_lp, current_level')
    .eq('id', userId)
    .maybeSingle<{ total_lp: number | null; current_level: number | null }>()

  const raindrops = userRow?.total_lp ?? 0
  const level = typeof userRow?.current_level === 'number' && userRow.current_level >= 1
    ? Math.min(10, userRow.current_level)
    : calculateLevelFromRaindrops(raindrops)

  return NextResponse.json({ userId, level })
}
