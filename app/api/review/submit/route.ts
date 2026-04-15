import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const BLACKLIST_MIN_REVIEWS = 3
const BLACKLIST_RATING_THRESHOLD = 1.0

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { eventType, eventId, revieweeId, rating, comment } = body

    if (!eventType || !eventId || !revieweeId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    if (user.id === revieweeId) {
      return NextResponse.json({ error: 'Cannot review yourself' }, { status: 400 })
    }

    // 중복 리뷰 방지
    const { data: existing } = await supabase
      .from('participant_reviews')
      .select('id')
      .eq('event_id', eventId)
      .eq('reviewer_id', user.id)
      .eq('reviewee_id', revieweeId)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already reviewed this participant for this event' }, { status: 409 })
    }

    // quest_party 이벤트의 경우: 둘 다 실제로 참여했는지 검증
    if (eventType === 'quest_party') {
      const { data: reviewerMember } = await supabase
        .from('quest_party_members')
        .select('id')
        .eq('party_id', eventId)
        .eq('user_id', user.id)
        .single()

      const { data: revieweeMember } = await supabase
        .from('quest_party_members')
        .select('id')
        .eq('party_id', eventId)
        .eq('user_id', revieweeId)
        .single()

      if (!reviewerMember || !revieweeMember) {
        return NextResponse.json({ error: 'Both users must be party members' }, { status: 403 })
      }
    }

    // 리뷰 등록
    const { error: insertError } = await supabase
      .from('participant_reviews')
      .insert({
        event_type: eventType,
        event_id: eventId,
        reviewer_id: user.id,
        reviewee_id: revieweeId,
        rating,
        comment: comment || null,
      })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
    }

    // 블랙리스트 자동 판단: reviewee의 전체 평균 별점 재계산
    const { data: allReviews } = await supabase
      .from('participant_reviews')
      .select('rating')
      .eq('reviewee_id', revieweeId)

    if (allReviews && allReviews.length >= BLACKLIST_MIN_REVIEWS) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

      if (avgRating <= BLACKLIST_RATING_THRESHOLD) {
        // 블랙리스트 추가 (upsert — 이미 있으면 업데이트)
        await supabase
          .from('blacklist')
          .upsert({
            user_id: revieweeId,
            reason: 'low_rating',
            average_rating: Math.round(avgRating * 10) / 10,
            total_reports: 0,
            is_active: true,
          }, { onConflict: 'user_id' })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
