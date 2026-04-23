import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = await createServiceClient()
    const userId = user.id

    // 1. 커뮤니티 게시글 비공개 처리 (이력 보존)
    await admin.from('community_posts').update({ is_hidden: true }).eq('user_id', userId)

    // 2. 미션 진행 기록 삭제
    await admin.from('mission_progress').delete().eq('user_id', userId)

    // 3. LP 트랜잭션 삭제
    await admin.from('lp_transactions').delete().eq('user_id', userId)

    // 4. 활성 구독 해지
    await admin
      .from('user_subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)

    // 5. 파티 멤버 탈퇴 (테이블 없을 수 있음 → 실패 무시)
    try {
      await admin.from('quest_party_members').delete().eq('user_id', userId)
    } catch {
      // ignore
    }

    // 6. users 행 익명화 (완전 삭제 대신 이력 보존)
    await admin
      .from('users')
      .update({
        nickname: 'deleted_user',
        avatar_url: null,
        total_lp: 0,
        current_level: 1,
      })
      .eq('id', userId)

    // 7. Supabase Auth 유저 삭제
    await admin.auth.admin.deleteUser(userId)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Account delete error:', err)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
