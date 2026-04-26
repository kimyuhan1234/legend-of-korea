import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

/**
 * 베타 피드백 인서트.
 * 비로그인 도 인서트 가능 (RLS 'anyone can insert feedback' 정책).
 * IP 는 SHA-256 16자리로 해시 저장 — PII 보호.
 */
export async function POST(req: NextRequest) {
  let body: { page_path?: string; locale?: string; rating?: number; comment?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const { page_path, locale, rating, comment } = body

  if (!page_path || !locale || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // IP 해시 (PII 보호)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16)

  const { error } = await supabase.from('feedback').insert({
    user_id: user?.id ?? null,
    page_path: page_path.slice(0, 200),
    locale,
    rating,
    comment: comment ? comment.slice(0, 1000) : null,
    user_agent: req.headers.get('user-agent')?.slice(0, 200) ?? null,
    ip_hash: ipHash,
  })

  if (error) {
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
