import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/user/select-route
 * body: { route: 'scholar' | 'warrior' }
 *
 * - 로그인 필수
 * - route 값 유효성 검증
 * - users.tech_tree_route 이미 설정돼 있으면 400 (재선택 금지)
 */
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as { route?: unknown }
  const route = body.route
  if (route !== 'scholar' && route !== 'warrior') {
    return NextResponse.json({ error: "route must be 'scholar' or 'warrior'" }, { status: 400 })
  }

  const { data: existing, error: readErr } = await supabase
    .from('users')
    .select('tech_tree_route')
    .eq('id', user.id)
    .maybeSingle<{ tech_tree_route: string | null }>()

  if (readErr) {
    console.error('[select-route] Read failed:', readErr.message)
    return NextResponse.json({ error: 'Database read failed' }, { status: 500 })
  }

  if (existing?.tech_tree_route) {
    return NextResponse.json(
      { error: 'Route already selected', current: existing.tech_tree_route },
      { status: 400 }
    )
  }

  const { error: updateErr } = await supabase
    .from('users')
    .update({ tech_tree_route: route })
    .eq('id', user.id)

  if (updateErr) {
    console.error('[select-route] Update failed:', updateErr.message)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true, route })
}
