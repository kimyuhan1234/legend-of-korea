import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/admin/courses
// 관리자 전용 — courses 테이블의 모든 코스 반환 (admin/b2b, admin/missions 페이지에서 드롭다운 소스로 사용).
// 응답 shape: { courses: [{ id, title, region, ... }, ...] }
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, title, region, difficulty, is_active, price, thumbnail_url')
      .order('region', { ascending: true })

    if (error) throw error

    return NextResponse.json({ courses: courses ?? [] })
  } catch (err) {
    console.error('Admin Courses GET Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
