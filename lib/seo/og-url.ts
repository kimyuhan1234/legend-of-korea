/**
 * P3B-1: 동적 OG 이미지 URL 빌더.
 *
 * /og 라우트에 type-safe 한 파라미터 전달.
 * 페이지 generateMetadata 에서 사용:
 *
 *   const og = buildOgUrl({
 *     baseUrl: siteUrl,
 *     title: m('title'),
 *     subtitle: m('description'),
 *     tier: 'strong-stay',
 *     category: 'STAY',
 *     imagePath: '/images/category-stay.png',
 *   })
 */

export type OgTier = 'strong' | 'strong-stay' | 'soft' | 'plain'

export interface OgUrlInput {
  baseUrl: string
  title: string
  subtitle?: string
  tier?: OgTier
  category?: string
  /** /public 기준 이미지 경로 (예: '/images/category-stay.png') */
  imagePath?: string
}

export function buildOgUrl(input: OgUrlInput): string {
  const url = new URL('/og', input.baseUrl)
  url.searchParams.set('title', input.title)
  if (input.subtitle) url.searchParams.set('subtitle', input.subtitle)
  if (input.tier) url.searchParams.set('tier', input.tier)
  if (input.category) url.searchParams.set('category', input.category)
  if (input.imagePath) url.searchParams.set('imageUrl', input.imagePath)
  return url.toString()
}
