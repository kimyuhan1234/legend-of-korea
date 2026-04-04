import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json({ error: 'transactionId required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Check current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch the corresponding LP transaction
    const { data: transaction, error: txError } = await supabase
      .from('lp_transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('user_id', user.id)
      .single();

    if (txError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // 3. Check if already applied
    if (transaction.applied) {
      return NextResponse.json({ error: 'Already applied' }, { status: 409 });
    }

    // 4. Update transaction applied = true
    const { error: updateTxError } = await supabase
      .from('lp_transactions')
      .update({ applied: true, applied_at: new Date().toISOString() })
      .eq('id', transactionId);

    if (updateTxError) throw updateTxError;

    // 5. Add amount to user's total_lp
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('total_lp')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    const newBalance = (userData.total_lp || 0) + transaction.amount;

    const { error: updateUserError } = await supabase
      .from('users')
      .update({ total_lp: newBalance })
      .eq('id', user.id);

    if (updateUserError) throw updateUserError;

    // 6. Return new balance
    return NextResponse.json({
      success: true,
      newBalance,
      transactionId,
    });

  } catch (error) {
    console.error('LP apply error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
