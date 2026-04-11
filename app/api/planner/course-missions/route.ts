import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'courseId 필수' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('missions')
      .select(`
        id,
        course_id,
        sequence,
        type,
        title,
        description,
        location_name,
        location_description,
        latitude,
        longitude,
        lp_reward,
        is_hidden
      `)
      .eq('course_id', courseId)
      .order('sequence', { ascending: true })

    if (error) {
      return NextResponse.json({ error: '미션 조회 실패', detail: error.message }, { status: 500 })
    }

    // 히든 미션은 제외 (스케줄에는 일반 미션만 노출)
    const missions = (data ?? []).filter((m) => !m.is_hidden)

    return NextResponse.json({ missions })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
