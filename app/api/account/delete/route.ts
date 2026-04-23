import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = await createServiceClient()
    const userId = user.id
    const emailHash = createHash('sha256').update(user.email ?? userId).digest('hex')

    // 1. 커뮤니티 게시글 비공개 처리 (이력 보존)
    await admin.from('community_posts').update({ is_hidden: true }).eq('user_id', userId)

    // 2. 미션 진행 기록 삭제 (개인 달성 이력 — 법적 보존 의무 없음)
    await admin.from('mission_progress').delete().eq('user_id', userId)

    // 3. LP 트랜잭션 익명화 보관 (전자상거래법 제6조 — 5년 보존)
    //    user_id를 NULL로 대체해 원문 복원 불가 상태로 유지
    await admin
      .from('lp_transactions')
      .update({ user_id: null })
      .eq('user_id', userId)

    // 4. 주문 개인정보 익명화 보관 (전자상거래법 제6조 — 5년 보존)
    //    주문 금액·상태는 세금·정산 목적으로 보존, 개인 식별 정보만 삭제
    await admin
      .from('orders')
      .update({
        user_id: null,
        shipping_name: '(탈퇴 회원)',
        shipping_phone: '(삭제됨)',
        shipping_address: '(삭제됨)',
        shipping_address_detail: null,
        shipping_zipcode: null,
      })
      .eq('user_id', userId)

    // 5. 활성 구독 해지
    await admin
      .from('user_subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)

    // 6. 파티 멤버 탈퇴 (테이블 없을 수 있음 → 실패 무시)
    try {
      await admin.from('quest_party_members').delete().eq('user_id', userId)
    } catch {
      // ignore
    }

    // 7. 탈퇴 요청 기록 저장 (PIPA — 3년 보존)
    await admin.from('withdrawal_requests').insert({
      user_id: userId,
      email_hash: emailHash,
    })

    // 8. users 행 익명화 (완전 삭제 대신 — 연결된 FK 참조 보존)
    await admin
      .from('users')
      .update({
        nickname: 'deleted_user',
        avatar_url: null,
        total_lp: 0,
        current_level: 1,
      })
      .eq('id', userId)

    // 9. Supabase Auth 유저 삭제 (로그인 불가 처리)
    await admin.auth.admin.deleteUser(userId)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Account delete error:', err)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
