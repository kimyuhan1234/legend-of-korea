import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { regions } from '@/lib/data/food-dupes'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 90개 음식을 1줄 요약으로 압축해 AI 컨텍스트에 넣는다.
function buildFoodContext(): string {
  const lines: string[] = []
  for (const region of regions) {
    for (const food of region.foods) {
      const tp = food.tasteProfile
      const ingKo = food.ingredients.ko.slice(0, 4).join(',')
      lines.push(
        `${food.id} | ${region.code} | ${food.name.ko} | ${food.name.en} | ${food.name.ja} | sweet:${tp.sweet} salty:${tp.salty} spicy:${tp.spicy} umami:${tp.umami} sour:${tp.sour} | ${ingKo}`
      )
    }
  }
  return lines.join('\n')
}

const SYSTEM_PROMPT = `You are a Korean food expert. The user will give you a foreign food name, and you must find the most similar Korean foods from the database provided.

IMPORTANT RULES:
- Only recommend foods that exist in the database (match by id exactly)
- Return 1~3 matches maximum
- similarityPercent should be realistic (50~95)
- matchReason: 1~2 sentences explaining WHY they're similar (taste, texture, cooking method)
- tasteComparison: 1 sentence about the key taste DIFFERENCE

Respond ONLY with valid JSON in this exact format:
{
  "matches": [
    {
      "foodId": "exact-id-from-database",
      "regionCode": "city-code",
      "similarityPercent": 75,
      "matchReason": { "ko": "...", "en": "...", "ja": "..." },
      "tasteComparison": { "ko": "...", "en": "...", "ja": "..." }
    }
  ]
}

If no good match exists, return: { "matches": [] }`

interface AiMatch {
  foodId: string
  regionCode: string
  similarityPercent: number
  matchReason: { ko: string; en: string; ja: string }
  tasteComparison: { ko: string; en: string; ja: string }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json().catch(() => null)) as {
      query?: string
      locale?: string
    } | null

    const query = body?.query?.trim()
    if (!query || query.length < 2 || query.length > 100) {
      return NextResponse.json(
        { error: 'invalid_query', message: 'query must be 2~100 characters' },
        { status: 400 }
      )
    }

    // [단일 화폐 통일] 크레딧 차감 제거 — AI 매칭은 로그인만 요구

    // Anthropic API 호출
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ai_not_configured', message: 'ANTHROPIC_API_KEY is not set' },
        { status: 503 }
      )
    }

    const foodContext = buildFoodContext()
    const userMessage = `Input food: ${query}\n\nKorean food database:\n${foodContext}`

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!aiRes.ok) {
      const errText = await aiRes.text().catch(() => 'unknown')
      return NextResponse.json(
        { error: 'ai_error', message: `Anthropic API ${aiRes.status}`, detail: errText },
        { status: 502 }
      )
    }

    const aiData = (await aiRes.json()) as {
      content?: Array<{ type: string; text?: string }>
    }

    const textBlock = aiData.content?.find((c) => c.type === 'text')
    if (!textBlock?.text) {
      return NextResponse.json(
        { error: 'ai_error', message: 'Empty AI response' },
        { status: 502 }
      )
    }

    // JSON 파싱 — AI 가 ```json 감쌀 수 있음
    let parsed: { matches: AiMatch[] }
    try {
      const jsonStr = textBlock.text
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/, '')
        .trim()
      parsed = JSON.parse(jsonStr)
    } catch {
      return NextResponse.json(
        { error: 'ai_parse_error', message: 'Failed to parse AI response' },
        { status: 502 }
      )
    }

    // 유효성 검증 — DB 에 존재하는 foodId 만 반환
    const allFoodIds = new Set(regions.flatMap((r) => r.foods.map((f) => f.id)))
    const validMatches = (parsed.matches || [])
      .filter((m) => allFoodIds.has(m.foodId))
      .slice(0, 3)

    // 각 매치에 이미지 + 이름 정보 보강
    const enriched = validMatches.map((m) => {
      const region = regions.find((r) => r.code === m.regionCode)
      const food = region?.foods.find((f) => f.id === m.foodId)
      return {
        ...m,
        foodName: food?.name ?? { ko: m.foodId, en: m.foodId, ja: m.foodId },
        foodImage: food?.image ?? '',
        regionName: region?.name ?? { ko: m.regionCode, en: m.regionCode, ja: m.regionCode },
      }
    })

    return NextResponse.json({
      matches: enriched,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
