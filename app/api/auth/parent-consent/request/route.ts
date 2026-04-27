import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * P0-5-C-2 — 법정대리인 동의 요청 인서트.
 *
 * 베타 단계: parent_consents 에 status='pending' 레코드만 생성 (메일 발송 X).
 * 정식 출시 시점: Resend 등으로 parent_email 에 동의 메일 발송 + 토큰 검증 페이지.
 *
 * 비로그인 허용 (RLS 'anyone can insert pending consent' 정책).
 * IP 는 SHA-256 32자리로 해시 저장 — PII 보호.
 *
 * 182 상담 (2026-04-27) 권고에 따라 베타 단계에 최소 플로우 즉시 구축.
 */
export async function POST(req: NextRequest) {
  let body: { parent_email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parent_email = body.parent_email?.trim() ?? ''

  if (!EMAIL_RE.test(parent_email) || parent_email.length > 320) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  // 토큰 생성 — 메일 링크용 (베타 단계에는 발송 안 됨)
  const token = crypto.randomBytes(32).toString('hex')

  // IP 해시 (PII 보호)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32)

  const supabase = await createClient()
  const { error } = await supabase.from('parent_consents').insert({
    parent_email,
    parent_consent_token: token,
    status: 'pending',
    ip_hash: ipHash,
  })

  if (error) {
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
  }

  // TODO (정식 출시): Resend 또는 Postmark 로 parent_email 에 동의 메일 발송.
  //   링크 형식: /auth/parent-consent/{token}
  //   베타 단계는 토큰만 DB 보존, 메일 미발송.

  return NextResponse.json({ ok: true })
}
