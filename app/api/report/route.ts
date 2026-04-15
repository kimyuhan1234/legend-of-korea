import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const REPORT_BLACKLIST_THRESHOLD = 3

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { eventType, eventId, reportedId, reason, detail } = body

    if (!eventType || !eventId || !reportedId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (user.id === reportedId) {
      return NextResponse.json({ error: 'Cannot report yourself' }, { status: 400 })
    }

    const validReasons = ['no_show', 'harassment', 'fraud', 'violence', 'inappropriate', 'other']
    if (!validReasons.includes(reason)) {
      return NextResponse.json({ error: 'Invalid reason' }, { status: 400 })
    }

    // 중복 신고 방지
    const { data: existing } = await supabase
      .from('user_reports')
      .select('id')
      .eq('event_id', eventId)
      .eq('reporter_id', user.id)
      .eq('reported_id', reportedId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Already reported this user for this event' }, { status: 409 })
    }

    // 신고 등록
    const { error: insertError } = await supabase
      .from('user_reports')
      .insert({
        event_type: eventType,
        event_id: eventId,
        reporter_id: user.id,
        reported_id: reportedId,
        reason,
        detail: detail || null,
        status: 'pending',
      })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
    }

    // 누적 신고 수 확인 → 임계값 초과 시 블랙리스트 upsert
    const { data: allReports } = await supabase
      .from('user_reports')
      .select('id')
      .eq('reported_id', reportedId)
      .neq('status', 'dismissed')

    const reportCount = allReports?.length ?? 0

    if (reportCount >= REPORT_BLACKLIST_THRESHOLD) {
      await supabase
        .from('blacklist')
        .upsert({
          user_id: reportedId,
          reason: 'reports',
          total_reports: reportCount,
          is_active: true,
        }, { onConflict: 'user_id' })
    }

    return NextResponse.json({ success: true, reportCount })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
