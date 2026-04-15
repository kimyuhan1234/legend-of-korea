import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 내가 멤버로 참여 중인 파티 ID 목록
    const { data: memberships, error: memberError } = await supabase
      .from('quest_party_members')
      .select('party_id, role')
      .eq('user_id', user.id)

    if (memberError) {
      return NextResponse.json({ error: 'Failed to fetch memberships' }, { status: 500 })
    }

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ parties: [] })
    }

    const partyIds = memberships.map((m) => m.party_id)

    const { data: parties, error: partiesError } = await supabase
      .from('quest_parties')
      .select('*')
      .in('id', partyIds)
      .order('adventure_date', { ascending: true })

    if (partiesError) {
      return NextResponse.json({ error: 'Failed to fetch parties' }, { status: 500 })
    }

    return NextResponse.json({ parties: parties || [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
