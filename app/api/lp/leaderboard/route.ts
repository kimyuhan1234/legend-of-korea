import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const now = new Date()
    const monthParam =
      searchParams.get('month') ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const [year, month] = monthParam.split('-').map(Number)
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()

    const supabase = await createServiceClient()

    const { data: transactions, error } = await supabase
      .from('lp_transactions')
      .select('user_id, amount')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .gt('amount', 0)

    if (error) throw error

    // 유저별 합산
    const userLpMap: Record<string, number> = {}
    for (const tx of transactions || []) {
      userLpMap[tx.user_id] = (userLpMap[tx.user_id] || 0) + tx.amount
    }

    // 상위 20명
    const topUsers = Object.entries(userLpMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([userId, lp], index) => ({ userId, lp, rank: index + 1 }))

    if (topUsers.length === 0) {
      return NextResponse.json({ leaderboard: [], month: monthParam })
    }

    const userIds = topUsers.map(u => u.userId)
    const { data: profiles } = await supabase
      .from('users')
      .select('id, nickname, avatar_url, current_tier, language')
      .in('id', userIds)

    const profileMap = new Map((profiles || []).map(p => [p.id, p]))

    const leaderboard = topUsers.map(u => {
      const profile = profileMap.get(u.userId)
      return {
        rank: u.rank,
        userId: u.userId,
        nickname: profile?.nickname || 'Anonymous',
        avatarUrl: profile?.avatar_url || null,
        tier: profile?.current_tier || 1,
        language: profile?.language || 'en',
        monthlyLp: u.lp,
      }
    })

    return NextResponse.json({ leaderboard, month: monthParam })
  } catch (err) {
    console.error('Leaderboard error:', err)
    return NextResponse.json({ error: 'Failed to load leaderboard' }, { status: 500 })
  }
}
