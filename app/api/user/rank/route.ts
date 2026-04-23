import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateLevelFromRaindrops } from '@/lib/tiers/levels'

export const dynamic = 'force-dynamic'

/**
 * GET /api/user/rank?userId=...
 *
 * 공개 SELECT (RLS: users 본인만 읽기지만 nickname 같은 기본 필드는 공개 조회 가능).
 * 응답: { userId, level, route, name, emoji, isSpecial }
 *
 * RankBadge 클라이언트 컴포넌트가 호출. 소규모 엔드포인트라 N+1 리스크는
 * 리더보드/댓글 대량 렌더 시 주의 (추후 배치 조회로 최적화 가능).
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: userRow } = await supabase
    .from('users')
    .select('total_lp, tech_tree_route, current_level')
    .eq('id', userId)
    .maybeSingle<{ total_lp: number | null; tech_tree_route: string | null; current_level: number | null }>()

  const raindrops = userRow?.total_lp ?? 0
  const route = userRow?.tech_tree_route ?? null
  // [Day 4] current_level 우선, 없으면 자동 계산 fallback
  const level = typeof userRow?.current_level === 'number' && userRow.current_level >= 1
    ? Math.min(10, userRow.current_level)
    : calculateLevelFromRaindrops(raindrops)

  const routeKey = level <= 3 ? 'common' : (route === 'scholar' || route === 'warrior' ? route : null)
  if (!routeKey) {
    // Lv 4+ 인데 route 미선택 — 이름만 비워서 반환
    return NextResponse.json({
      userId, level, route, name: null, emoji: '❓', isSpecial: false, needsBranchSelection: true,
    })
  }

  const { data: title } = await supabase
    .from('tier_titles')
    .select('name_ko, name_en, name_ja, name_zh_cn, name_zh_tw, emoji, is_special')
    .eq('level', level)
    .eq('route', routeKey)
    .maybeSingle<{
      name_ko: string
      name_en: string
      name_ja: string
      name_zh_cn: string
      name_zh_tw: string
      emoji: string
      is_special: boolean
    }>()

  return NextResponse.json({
    userId,
    level,
    route: routeKey,
    names: title
      ? { ko: title.name_ko, en: title.name_en, ja: title.name_ja, 'zh-CN': title.name_zh_cn, 'zh-TW': title.name_zh_tw }
      : null,
    emoji: title?.emoji ?? '❓',
    isSpecial: title?.is_special ?? false,
    needsBranchSelection: false,
  })
}
