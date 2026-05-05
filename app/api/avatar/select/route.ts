import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/avatar/select
 * body: { image_id: uuid }
 *
 * 검증 (서버 사이드):
 *  1. 로그인 필수 — 401
 *  2. avatar_images 존재 + category 의 level_required 가 사용자 current_level 이하 — 403
 *  3. 통과 시 users.selected_avatar_image_id 갱신 — 200
 *
 * 057 미적용 / 컬럼 부재 환경에서는 503 반환 (운영자가 마이그레이션 적용 후 활성).
 */
export async function POST(req: Request) {
  let imageId: string | null = null
  try {
    const body = await req.json()
    if (typeof body?.image_id === 'string') imageId = body.image_id
  } catch {
    // ignore — imageId null 처리
  }

  if (!imageId) {
    return NextResponse.json({ error: 'MISSING_IMAGE_ID' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'LOGIN_REQUIRED' }, { status: 401 })
  }

  // 사용자 레벨 + 이미지 카테고리 level_required 조회
  const [{ data: userRow }, { data: imgRow }] = await Promise.all([
    supabase
      .from('users')
      .select('current_level')
      .eq('id', user.id)
      .maybeSingle<{ current_level: number | null }>(),
    supabase
      .from('avatar_images')
      .select('id, avatar_categories(level_required)')
      .eq('id', imageId)
      .maybeSingle<{ id: string; avatar_categories: { level_required: number } | null }>(),
  ])

  if (!imgRow || !imgRow.avatar_categories) {
    return NextResponse.json({ error: 'NOT_CONFIGURED' }, { status: 503 })
  }

  const userLevel = Math.min(Math.max(userRow?.current_level ?? 1, 1), 10)
  const required = imgRow.avatar_categories.level_required

  if (userLevel < required) {
    return NextResponse.json(
      { error: 'INSUFFICIENT_LEVEL', required, current: userLevel },
      { status: 403 },
    )
  }

  const { error: updateErr } = await supabase
    .from('users')
    .update({ selected_avatar_image_id: imgRow.id })
    .eq('id', user.id)

  if (updateErr) {
    return NextResponse.json({ error: 'UPDATE_FAILED' }, { status: 500 })
  }

  return NextResponse.json({ success: true, image_id: imgRow.id })
}
