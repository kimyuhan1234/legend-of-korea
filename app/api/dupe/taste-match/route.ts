import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { regions } from '@/lib/data/food-dupes'
import { fusionRecipes } from '@/lib/data/flag-cooking'
import { getTopMatchingFoods, getSurpriseFlagCooking } from '@/lib/utils/taste-matching'
import type { TasteProfile } from '@/lib/data/food-dupes'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function isValidProfile(p: unknown): p is TasteProfile {
  if (!p || typeof p !== 'object') return false
  const obj = p as Record<string, unknown>
  for (const key of ['sweet', 'salty', 'spicy', 'umami', 'sour']) {
    if (typeof obj[key] !== 'number' || obj[key] < 0 || obj[key] > 100) return false
  }
  return true
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json().catch(() => null)) as { preference?: unknown } | null
    if (!body || !isValidProfile(body.preference)) {
      return NextResponse.json(
        { error: 'invalid_preference', message: 'TasteProfile with sweet/salty/spicy/umami/sour (0~100) required' },
        { status: 400 }
      )
    }

    const pref = body.preference as TasteProfile

    // [단일 화폐 통일] 크레딧 차감 제거 — 취향 매칭은 로그인만 요구

    // TOP 3 + 서프라이즈 2
    const topFoods = getTopMatchingFoods(pref, regions)
    const surprises = getSurpriseFlagCooking(pref, topFoods, fusionRecipes)

    // 직렬화 (RegionalFood 전체가 아닌 필요한 필드만)
    const topFoodsSerialized = topFoods.map((m) => ({
      foodId: m.food.id,
      foodName: m.food.name,
      foodImage: m.food.image,
      regionCode: m.regionCode,
      regionName: m.regionName,
      matchScore: m.matchScore,
      matchReason: m.matchReason,
    }))

    const surprisesSerialized = surprises.map((s) => ({
      recipeId: s.recipe.id,
      recipeName: s.recipe.name,
      recipeImage: s.recipe.image ?? '',
      countryCode: s.recipe.countryCode,
      emoji: s.recipe.emoji,
      koreanBase: s.recipe.koreanBase,
      connectionReason: s.connectionReason,
    }))

    return NextResponse.json({
      topFoods: topFoodsSerialized,
      surprises: surprisesSerialized,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
