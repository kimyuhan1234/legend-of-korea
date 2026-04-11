import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deductCredits, CREDIT_COST, type CreditFeature } from '@/lib/credits'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const VALID_FEATURES = Object.keys(CREDIT_COST) as CreditFeature[]

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json().catch(() => null)) as {
      feature?: string
      metadata?: Record<string, unknown>
    } | null

    const feature = body?.feature as CreditFeature | undefined
    if (!feature || !VALID_FEATURES.includes(feature)) {
      return NextResponse.json(
        { error: 'invalid_feature', valid: VALID_FEATURES },
        { status: 400 }
      )
    }

    const result = await deductCredits(supabase, user.id, feature, body?.metadata)

    if (!result.ok) {
      if (result.error === 'insufficient_credits') {
        return NextResponse.json(
          {
            error: 'insufficient_credits',
            remaining: result.remaining,
            required: result.required,
          },
          { status: 402 }
        )
      }
      if (result.error === 'no_active_subscription') {
        return NextResponse.json(
          { error: 'no_active_subscription' },
          { status: 403 }
        )
      }
      return NextResponse.json(
        { error: result.error, detail: 'detail' in result ? result.detail : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      feature,
      used: result.used,
      remaining: result.remaining,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
