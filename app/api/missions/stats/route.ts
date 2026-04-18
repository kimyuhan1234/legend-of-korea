import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 전체 미션 진행 (미션 타이틀/코스 정보 포함)
    const { data: progress } = await supabase
      .from('mission_progress')
      .select(`
        mission_id, status, lp_earned, completed_at, photo_url,
        missions ( id, title, type, course_id, courses ( id, title ) )
      `)
      .eq('user_id', user.id)

    const rows = progress || []

    // 집계
    const completed = rows.filter(p => p.status === 'completed').length
    const inProgress = rows.filter(p => p.status === 'in_progress').length
    const totalLp = rows.reduce((sum, p) => sum + (p.lp_earned || 0), 0)

    // 전체 미션 수: mission_progress에 없는 미션도 포함하기 위해 전체 조회
    const { count: totalMissionCount } = await supabase
      .from('missions')
      .select('id', { count: 'exact', head: true })
      .eq('is_hidden', false)
    const total = totalMissionCount ?? rows.length

    // 코스별 진행률
    const courseMap: Record<string, { total: number; completed: number; title: Record<string, string> }> = {}
    const { data: allMissions } = await supabase
      .from('missions')
      .select('id, course_id, is_hidden, courses ( id, title )')
      .eq('is_hidden', false)

    for (const m of allMissions || []) {
      const cid = m.course_id || 'unknown'
      if (!courseMap[cid]) {
        const courses = m.courses as unknown as { title: Record<string, string> } | null
        courseMap[cid] = { total: 0, completed: 0, title: courses?.title ?? { ko: '코스' } }
      }
      courseMap[cid].total++
    }
    for (const p of rows) {
      if (p.status !== 'completed') continue
      const mission = p.missions as unknown as { course_id: string } | null
      const cid = mission?.course_id || 'unknown'
      if (courseMap[cid]) courseMap[cid].completed++
    }

    // 최근 완료 미션 10개 (타임라인용)
    const recentCompleted = rows
      .filter(p => p.status === 'completed' && p.completed_at)
      .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
      .slice(0, 10)
      .map(p => {
        const mission = p.missions as unknown as {
          title?: Record<string, string>
          type?: string
          courses?: { title?: Record<string, string> }
        } | null
        return {
          missionId: p.mission_id,
          missionTitle: mission?.title ?? {},
          missionType: mission?.type ?? 'quiz',
          courseTitle: mission?.courses?.title ?? {},
          completedAt: p.completed_at,
          lpEarned: p.lp_earned,
          photoUrl: p.photo_url,
        }
      })

    // 연속 스트릭 (일 단위)
    const completedDates = rows
      .filter(p => p.completed_at)
      .map(p => new Date(p.completed_at!).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let streak = 0
    const today = new Date()
    for (let i = 0; i < completedDates.length; i++) {
      const expected = new Date(today)
      expected.setDate(expected.getDate() - i)
      if (completedDates[i] === expected.toDateString()) streak++
      else break
    }

    // 유저 프로필
    const { data: userData } = await supabase
      .from('users')
      .select('nickname, avatar_url, current_tier, total_lp')
      .eq('id', user.id)
      .single()

    // 다음 티어까지 필요한 LP
    const { data: nextTier } = await supabase
      .from('tiers')
      .select('level, name, min_lp')
      .gt('min_lp', userData?.total_lp ?? 0)
      .order('min_lp', { ascending: true })
      .limit(1)
      .maybeSingle()

    const lpToNextTier = nextTier ? nextTier.min_lp - (userData?.total_lp ?? 0) : 0

    return NextResponse.json({
      stats: { total, completed, inProgress, totalLp, streak, lpToNextTier },
      courseProgress: courseMap,
      recentCompleted,
      user: userData,
      nextTier,
    })
  } catch (err) {
    console.error('Mission stats error:', err)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
