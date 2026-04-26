import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')
    const date = searchParams.get('date')

    if (!courseId) {
      return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })
    }

    let query = supabase
      .from('quest_parties')
      .select('id, course_id, leader_id, title, description, adventure_date, max_members, current_members, status, language, leader_nationality, created_at, updated_at')
      .eq('course_id', courseId)
      .eq('status', 'open')
      .order('adventure_date', { ascending: true })

    if (date) {
      query = query.eq('adventure_date', date)
    }

    const { data: parties, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch parties' }, { status: 500 })
    }

    return NextResponse.json({ parties: parties || [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
