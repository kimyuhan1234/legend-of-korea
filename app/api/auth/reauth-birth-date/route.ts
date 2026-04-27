import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAtLeastMinimumAge } from '@/lib/validation/age'

export const dynamic = 'force-dynamic'

/**
 * P0F-2: 재인증 birth_date 입력 API.
 *
 * 인증된 사용자의 birth_date 를 업데이트하고 birth_date_deadline 을 해제.
 * 만 14세 미만이면 requiresParentConsent=true 응답 → 클라이언트가 부모 동의
 * 페이지 (P0-5-C-2) 로 redirect.
 *
 * 보안:
 *   - 본인 user 만 업데이트 (auth.uid() 와 비교)
 *   - 미래 날짜 차단
 *   - DB 트리거 (044) 가 INSERT 시점에도 차단 — 다중 안전망
 */
export async function POST(req: NextRequest) {
  let body: { birthDate?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const birthDate = body.birthDate?.trim() ?? ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return NextResponse.json({ error: 'invalid_format' }, { status: 400 })
  }

  // 미래 날짜 차단
  const birth = new Date(`${birthDate}T00:00:00Z`)
  if (Number.isNaN(birth.getTime()) || birth.getTime() > Date.now()) {
    return NextResponse.json({ error: 'future_date' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // 만 14세 이상 검증 — 14세 미만은 부모 동의 페이지로 보내야 하지만 birth_date
  // 자체는 입력 받음 (인지 시점 기록). DB 의 is_at_least_14 트리거 추가 가능.
  // 14세 이상 검증 — 두 번째 인자는 비교 기준 Date (default: now)
  const isOver14 = isAtLeastMinimumAge(birthDate)

  const { error: updateErr } = await supabase
    .from('users')
    .update({
      birth_date: birthDate,
      birth_date_verified_at: new Date().toISOString(),
      birth_date_deadline: null, // grace period 해제
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateErr) {
    console.error('[reauth] update failed:', updateErr.message)
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    requiresParentConsent: !isOver14,
  })
}
