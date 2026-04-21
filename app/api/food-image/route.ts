import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { searchPexels } from '@/lib/food-image/pexels-client'
import { searchUnsplash } from '@/lib/food-image/unsplash-client'
import { toEnglishQuery } from '@/lib/food-image/korean-to-english'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  const tagsParam = searchParams.get('tags')

  if (!name) {
    return NextResponse.json({ error: 'name required' }, { status: 400 })
  }

  const tags = tagsParam ? tagsParam.split(',').map((t) => t.trim()).filter(Boolean) : []
  const supabase = await createServiceClient()

  // 1. 캐시 조회
  const { data: cached } = await supabase
    .from('food_image_cache')
    .select('image_url, source, photographer, photographer_url, query_used')
    .eq('food_name_ko', name)
    .maybeSingle()

  if (cached) {
    return NextResponse.json({
      url: cached.image_url,
      source: cached.source,
      photographer: cached.photographer,
      photographerUrl: cached.photographer_url,
      cached: true,
    })
  }

  // 2. 쿼리 생성
  const query = toEnglishQuery(name, tags)

  // 3. Pexels → Unsplash 순으로 시도
  const result = (await searchPexels(query)) ?? (await searchUnsplash(query))

  // 4. 결과 있으면 캐시 저장 후 반환
  if (result) {
    await supabase.from('food_image_cache').insert({
      food_name_ko: name,
      image_url: result.url,
      source: result.source,
      photographer: result.photographer ?? null,
      photographer_url: result.photographerUrl ?? null,
      query_used: query,
    })
    return NextResponse.json({ ...result, cached: false })
  }

  // 5. 모든 소스 실패 — placeholder
  return NextResponse.json({ url: null, source: 'placeholder', cached: false })
}
