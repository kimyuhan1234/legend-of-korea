import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * 화이트리스트 방식 관리자 인증.
 * .env.local 에 ADMIN_EMAILS 를 콤마로 구분해 등록:
 *   ADMIN_EMAILS=admin@example.com,manager@example.com
 *
 * 리스트가 비어있거나 미설정이면 아무도 관리자로 통과하지 못함 (기본 deny).
 *
 * 기존 /api/admin/* 라우트는 users.role='admin' 방식을 쓰고 있어 건드리지 않음.
 * 이 유틸은 tour-stays/refresh, tag 같은 운영 전용 배치 API 보호용.
 */
export async function isAdmin(): Promise<boolean> {
  const raw = process.env.ADMIN_EMAILS
  if (!raw) return false

  const adminEmails = raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  if (adminEmails.length === 0) return false

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return false
  return adminEmails.includes(user.email.toLowerCase())
}

/**
 * 라우트 핸들러 첫 줄에 배치:
 *   const guard = await requireAdmin()
 *   if (guard) return guard
 *
 * - 비로그인: 401
 * - 로그인했지만 화이트리스트 미포함: 403
 * - 통과: null (그대로 진행)
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const raw = process.env.ADMIN_EMAILS
  const adminEmails = raw
    ? raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
    : []

  if (adminEmails.length === 0 || !user.email || !adminEmails.includes(user.email.toLowerCase())) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  return null
}
