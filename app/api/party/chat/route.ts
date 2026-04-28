import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const partyId = req.nextUrl.searchParams.get('partyId')
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50')
    if (!partyId) return NextResponse.json({ error: 'partyId required' }, { status: 400 })

    // 멤버십 확인
    const { data: membership } = await supabase
      .from('quest_party_members')
      .select('id')
      .eq('party_id', partyId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!membership) return NextResponse.json({ error: 'Not a party member' }, { status: 403 })

    const { data: messages, error } = await supabase
      .from('party_chat')
      .select('*, users:user_id(nickname, language)')
      .eq('party_id', partyId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) throw error

    return NextResponse.json({ messages })
  } catch {
    console.error('Party chat GET error')
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { partyId, message, messageType, missionId } = await req.json()
    if (!partyId || !message) return NextResponse.json({ error: 'partyId and message required' }, { status: 400 })

    // 멤버십 확인
    const { data: membership } = await supabase
      .from('quest_party_members')
      .select('id')
      .eq('party_id', partyId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!membership) return NextResponse.json({ error: 'Not a party member' }, { status: 403 })

    const type = messageType || 'text'
    if (type === 'mission_complete' && !missionId) {
      return NextResponse.json({ error: 'missionId required for mission_complete' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('party_chat')
      .insert({
        party_id: partyId,
        user_id: user.id,
        message,
        message_type: type,
        mission_id: missionId || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, message: data })
  } catch {
    console.error('Party chat POST error')
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
