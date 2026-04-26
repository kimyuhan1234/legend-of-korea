import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { partyId } = await req.json()
    if (!partyId) {
      return NextResponse.json({ error: 'Missing partyId' }, { status: 400 })
    }

    // 파티 정보 조회 — 가입 검증 후 current_members/max_members/status 사용
    const { data: party, error: fetchError } = await supabase
      .from('quest_parties')
      .select('id, course_id, adventure_date, current_members, max_members, status')
      .eq('id', partyId)
      .single()

    if (fetchError || !party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    if (party.status === 'full') {
      return NextResponse.json({ error: 'Party is full' }, { status: 400 })
    }

    if (party.status !== 'open') {
      return NextResponse.json({ error: 'Party is not open' }, { status: 400 })
    }

    // 이미 이 파티에 참여 중인지 확인
    const { data: existingMember } = await supabase
      .from('quest_party_members')
      .select('id')
      .eq('party_id', partyId)
      .eq('user_id', user.id)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: 'Already a member of this party' }, { status: 409 })
    }

    // 같은 코스+날짜에 이미 다른 파티 참여 중인지 확인
    const { data: conflictingMembership } = await supabase
      .from('quest_party_members')
      .select('id, quest_parties!inner(course_id, adventure_date, status)')
      .eq('user_id', user.id)
      .eq('quest_parties.course_id', party.course_id)
      .eq('quest_parties.adventure_date', party.adventure_date)
      .in('quest_parties.status', ['open', 'full'])
      .maybeSingle()

    if (conflictingMembership) {
      return NextResponse.json({ error: 'Already in another party for this date' }, { status: 409 })
    }

    // 멤버 추가
    const { error: insertError } = await supabase
      .from('quest_party_members')
      .insert({ party_id: partyId, user_id: user.id, role: 'member' })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to join party' }, { status: 500 })
    }

    // current_members +1, 꽉 찼으면 status='full'
    const newCount = party.current_members + 1
    const newStatus = newCount >= party.max_members ? 'full' : 'open'

    await supabase
      .from('quest_parties')
      .update({ current_members: newCount, status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', partyId)

    return NextResponse.json({ success: true, currentMembers: newCount })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
