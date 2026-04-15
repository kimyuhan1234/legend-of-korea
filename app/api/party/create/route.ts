import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { courseId, title, description, adventureDate, maxMembers, language, nationality } = body

    if (!courseId || !title || !adventureDate || !maxMembers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (new Date(adventureDate) < new Date(new Date().toDateString())) {
      return NextResponse.json({ error: 'Adventure date must be today or later' }, { status: 400 })
    }

    // 같은 코스+날짜에 이미 리더인 파티가 있으면 409
    const { data: existing } = await supabase
      .from('quest_parties')
      .select('id')
      .eq('course_id', courseId)
      .eq('leader_id', user.id)
      .eq('adventure_date', adventureDate)
      .in('status', ['open', 'full'])
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already have a party for this date' }, { status: 409 })
    }

    // 파티 생성
    const { data: party, error: partyError } = await supabase
      .from('quest_parties')
      .insert({
        course_id: courseId,
        leader_id: user.id,
        title,
        description: description || null,
        adventure_date: adventureDate,
        max_members: maxMembers,
        language: language || 'en',
        leader_nationality: nationality || null,
      })
      .select()
      .single()

    if (partyError || !party) {
      return NextResponse.json({ error: 'Failed to create party' }, { status: 500 })
    }

    // 리더를 멤버 테이블에도 추가
    const { error: memberError } = await supabase
      .from('quest_party_members')
      .insert({
        party_id: party.id,
        user_id: user.id,
        role: 'leader',
      })

    if (memberError) {
      // 파티 생성 롤백
      await supabase.from('quest_parties').delete().eq('id', party.id)
      return NextResponse.json({ error: 'Failed to add leader as member' }, { status: 500 })
    }

    return NextResponse.json({ party }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
