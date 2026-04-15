import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const targetUserId = searchParams.get('userId')

    if (!targetUserId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const supabase = await createClient()

    // 블랙리스트 상태 조회
    const { data: blacklistEntry } = await supabase
      .from('blacklist')
      .select('is_active, reason, blocked_until, average_rating, total_reports')
      .eq('user_id', targetUserId)
      .eq('is_active', true)
      .maybeSingle()

    // 평균 별점 + 리뷰 수 집계
    const { data: reviews } = await supabase
      .from('participant_reviews')
      .select('rating')
      .eq('reviewee_id', targetUserId)

    const reviewCount = reviews?.length ?? 0
    const averageRating =
      reviewCount > 0
        ? Math.round((reviews!.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10
        : null

    return NextResponse.json({
      isBlacklisted: !!blacklistEntry,
      blacklistReason: blacklistEntry?.reason ?? null,
      blockedUntil: blacklistEntry?.blocked_until ?? null,
      reviewCount,
      averageRating,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
