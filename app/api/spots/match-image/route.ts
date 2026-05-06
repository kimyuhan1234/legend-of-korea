import { NextRequest, NextResponse } from 'next/server'
import { searchKeyword } from '@/lib/tour-api/searchKeyword'
import {
  buildSearchKeyword,
  isValidRegionId,
  isValidLocale,
} from '@/lib/data/spotMatchingPolicy'
import { rateLimitGuard } from '@/lib/security/rate-limit-guard'

/**
 * Phase 2 SPOT 이미지 자동 매칭 — TourAPI searchKeyword2 호출 endpoint.
 *
 * GET /api/spots/match-image?keyword={spotName}&regionId={regionId}&locale={locale}
 *
 * 흐름:
 *  1. Rate limit (PUBLIC = 60 req/분/IP, in-memory Map 자동 GC)
 *  2. 파라미터 검증 — keyword (1~100자) / regionId (9 region) / locale (5 locale)
 *  3. buildSearchKeyword 로 region prefix 보정 (Tier 1+2 11건 자동 부착)
 *  4. searchKeyword 호출 (numOfRows=1, top 1 결과만)
 *  5. items[0].firstimage 검사 — 비어있거나 0건이면 matched: false
 *  6. 응답 캐시: s-maxage=3600 (1시간 캐싱, 운영자 결정 B 런타임 매칭)
 *
 * 보안:
 *  - keyword 빈 문자열 / 공백만 / 100자 초과 → 400
 *  - regionId 9 region 외 → 400
 *  - locale 5 locale 외 → 400
 *  - rate limit 초과 → 429 (Retry-After 헤더)
 */

export const revalidate = 3600

const KEYWORD_MAX_LENGTH = 100

interface MatchedResponse {
  matched: true
  firstimage: string
  title: string
  contentid: string
}

interface UnmatchedResponse {
  matched: false
}

export async function GET(req: NextRequest) {
  // 1. Rate limit (per-IP 60 req/분, PUBLIC preset)
  const limited = rateLimitGuard(req, 'PUBLIC')
  if (limited) return limited

  try {
    const sp = req.nextUrl.searchParams
    const rawKeyword = sp.get('keyword')
    const rawRegionId = sp.get('regionId')
    const rawLocale = sp.get('locale')

    // 2. keyword 검증 (trim 후)
    const keyword = rawKeyword?.trim() ?? ''
    if (keyword.length === 0) {
      return NextResponse.json({ error: 'invalid_keyword' }, { status: 400 })
    }
    if (keyword.length > KEYWORD_MAX_LENGTH) {
      return NextResponse.json({ error: 'keyword_too_long' }, { status: 400 })
    }

    // 3. regionId enum 검증 (REGION_PREFIX 키 활용)
    if (!isValidRegionId(rawRegionId)) {
      return NextResponse.json({ error: 'invalid_region' }, { status: 400 })
    }

    // 4. locale enum 검증 (5 locale)
    if (!isValidLocale(rawLocale)) {
      return NextResponse.json({ error: 'invalid_locale' }, { status: 400 })
    }

    // 5. region prefix 보정 + TourAPI 호출
    const searchTerm = buildSearchKeyword(keyword, rawRegionId, rawLocale)
    const items = await searchKeyword(searchTerm, { numOfRows: 1, locale: rawLocale })

    const top = items[0]
    if (!top || !top.firstimage || top.firstimage.length === 0) {
      const unmatched: UnmatchedResponse = { matched: false }
      return NextResponse.json(unmatched, {
        headers: { 'Cache-Control': 'public, s-maxage=3600' },
      })
    }

    const matched: MatchedResponse = {
      matched: true,
      firstimage: top.firstimage,
      title: top.title ?? '',
      contentid: top.contentid ?? '',
    }
    return NextResponse.json(matched, {
      headers: { 'Cache-Control': 'public, s-maxage=3600' },
    })
  } catch (error) {
    console.error('Spot match-image API error:', error)
    return NextResponse.json(
      { error: 'internal_error', matched: false },
      { status: 500 },
    )
  }
}
