import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json({ error: 'transactionId required' }, { status: 400 });
    }

    const supabase = await createClient();
    // increment_user_lp RPC 는 service_role 만 호출 가능 (Phase 2D 보안 정리)
    const service = await createServiceClient();

    // 1. 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. 본인 소유 트랜잭션 조회 (amount 확보)
    const { data: transaction, error: txError } = await supabase
      .from('lp_transactions')
      .select('id, amount, applied, user_id')
      .eq('id', transactionId)
      .eq('user_id', user.id)
      .single();

    if (txError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // 3. 낙관적 잠금: applied = false 조건을 UPDATE에 포함
    //    다른 동시 요청이 먼저 처리하면 0 rows 업데이트 → 409 반환
    const { data: updated } = await supabase
      .from('lp_transactions')
      .update({ applied: true, applied_at: new Date().toISOString() })
      .eq('id', transactionId)
      .eq('applied', false)
      .select('id');

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: 'Already applied' }, { status: 409 });
    }

    // 4. 원자적 LP 증가: RPC 사용 (Read-Modify-Write 방식 폐기)
    //    DB 함수: UPDATE users SET total_lp = total_lp + delta WHERE id = uid
    //    service_role 호출 (RLS 우회) — uid 는 위에서 검증된 본인 user.id
    const { error: rpcError } = await service.rpc('increment_user_lp', {
      uid: user.id,
      delta: transaction.amount,
    });

    if (rpcError) throw rpcError;

    // 5. 최신 잔액 조회 후 반환
    const { data: userData } = await supabase
      .from('users')
      .select('total_lp')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      newBalance: userData?.total_lp ?? 0,
      transactionId,
    });

  } catch (error) {
    console.error('LP apply error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
