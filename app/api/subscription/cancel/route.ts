import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const service = await createServiceClient()

    const { data: sub } = await service
      .from('user_subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!sub || sub.status !== 'active') {
      return NextResponse.json({ error: '활성 구독이 없습니다' }, { status: 404 })
    }

    const { error } = await service
      .from('user_subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', sub.id)

    if (error) {
      return NextResponse.json({ error: 'Cancel failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Subscription cancel error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
