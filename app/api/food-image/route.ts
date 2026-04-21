import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { searchPexels } from '@/lib/food-image/pexels-client'
import { searchUnsplash } from '@/lib/food-image/unsplash-client'
import { toEnglishQuery } from '@/lib/food-image/korean-to-english'
import type { FoodImageResult } from '@/lib/food-image/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  const tagsParam = searchParams.get('tags')

  if (!name) {
    return NextResponse.json({ error: 'name 파라미터가 필요합니다.' }, { status: 400 })
  }

  const tags = tagsParam ? tagsParam.split(',').map((t) => t.trim()).filter(Boolean) : []

  // 1. 캐시 조회
  try {
    const supabase = await createServiceClient()
    const { data: cached } = await supabase
      .from('food_image_cache')
      .select('image_url, source, photographer, photographer_url, query_used')
      .eq('food_name_ko', name)
      .single()

    if (cached) {
      const result: FoodImageResult = {
        url: cached.image_url,
        source: cached.source as FoodImageResult['source'],
        photographer: cached.photographer ?? undefined,
        photographerUrl: cached.photographer_url ?? undefined,
        queryUsed: cached.query_used ?? undefined,
      }
      return NextResponse.json(result)
    }
  } catch {
    // 캐시 미스 — 계속 진행
  }

  const query = toEnglishQuery(name, tags)

  // 2. Pexels 시도
  const pexelsResult = await searchPexels(query)
  if (pexelsResult) {
    const result: FoodImageResult = {
      url: pexelsResult.url,
      source: 'pexels',
      photographer: pexelsResult.photographer,
      photographerUrl: pexelsResult.photographerUrl,
      queryUsed: query,
    }
    await saveCache(name, result, query)
    return NextResponse.json(result)
  }

  // 3. Unsplash 시도
  const unsplashResult = await searchUnsplash(query)
  if (unsplashResult) {
    const result: FoodImageResult = {
      url: unsplashResult.url,
      source: 'unsplash',
      photographer: unsplashResult.photographer,
      photographerUrl: unsplashResult.photographerUrl,
      queryUsed: query,
    }
    await saveCache(name, result, query)
    return NextResponse.json(result)
  }

  // 4. Placeholder 반환 (캐시 저장 안 함 — 나중에 재시도 가능하도록)
  const placeholder: FoodImageResult = { url: null, source: 'placeholder', queryUsed: query }
  return NextResponse.json(placeholder)
}

async function saveCache(foodNameKo: string, result: FoodImageResult, query: string) {
  try {
    const supabase = await createServiceClient()
    await supabase.from('food_image_cache').upsert({
      food_name_ko: foodNameKo,
      image_url: result.url!,
      source: result.source,
      photographer: result.photographer ?? null,
      photographer_url: result.photographerUrl ?? null,
      query_used: query,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'food_name_ko' })
  } catch {
    // 캐시 저장 실패는 무시
  }
}
