import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAiConfig } from '@/lib/ai/config'
import { curatePlan } from '@/lib/ai/planner-ai'
import type { AiCurateRequest } from '@/lib/ai/providers/types'

// ─────────────────────────────────────────────
//  POST /api/planner/ai-curate
//  여행 아이템을 AI로 재배치 (실제 LLM 호출은 배포 전까지 비활성화)
//
//  활성화 조건:
//  - AI_CURATION_ENABLED=true 환경변수
//  - ANTHROPIC_API_KEY 또는 OPENAI_API_KEY 중 하나 설정
//
//  비활성화 상태에서는 { enabled: false } 로 응답하여
//  프론트는 기존 규칙 기반 스케쥴러를 계속 사용한다.
// ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const cfg = getAiConfig()

    // 기능 플래그 꺼져 있으면 즉시 반환 (DB 조회도 하지 않음)
    if (!cfg.enabled) {
      return NextResponse.json({
        enabled: false,
        message: 'AI curation is not enabled. Using rule-based fallback on client.',
      })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { planId } = body

    if (!planId) {
      return NextResponse.json({ error: 'planId 필수' }, { status: 400 })
    }

    // 본인 플랜인지 확인 + 아이템 로드
    const { data: plan, error: planErr } = await supabase
      .from('travel_plans')
      .select(`
        id,
        city_id,
        has_mission_kit,
        plan_items ( id, item_type, item_data )
      `)
      .eq('id', planId)
      .eq('user_id', user.id)
      .single()

    if (planErr || !plan) {
      return NextResponse.json({ error: '플랜을 찾을 수 없음' }, { status: 404 })
    }

    const items = (plan.plan_items as Array<{
      id: string
      item_type: string
      item_data: Record<string, unknown>
    }> ?? []).map((it) => {
      const data = it.item_data
      const nameField = data.name as Record<string, string> | string | undefined
      const name =
        typeof nameField === 'string'
          ? nameField
          : nameField?.ko || 'Item'
      return {
        id: it.id,
        type: it.item_type,
        name,
        meta: data,
      }
    })

    const aiReq: AiCurateRequest = {
      cityId: plan.city_id,
      cityName: plan.city_id,
      hasMissionKit: plan.has_mission_kit,
      items,
    }

    const result = await curatePlan(aiReq)

    return NextResponse.json({
      enabled: true,
      provider: cfg.provider,
      ...result,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
