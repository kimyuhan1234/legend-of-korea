/**
 * P3B-1 → rollback (4 hotfix 후 동적 OG 미해결): 정적 OG 이미지 URL 빌더.
 *
 * 동적 라우트 (/og?title=...) 가 Next.js build-time prerender + Satori
 * silent fail 등 다중 이슈로 미해결. 베타 단계 (외부 사용자 0명) 에 추가
 * 디버깅 비용 > 동적 OG 이득 → 정적 카테고리 이미지 매핑으로 회귀.
 *
 * 정식 출시 전 동적 OG 재시도 권장 — 현재 구조는 buildOgUrl 시그니처를
 * 유지하므로 향후 동적 라우트 복원 시 본 함수 한 곳만 수정하면 됨.
 *
 * 사용처에서 호출 패턴 (변경 없음):
 *   const og = buildOgUrl({
 *     baseUrl: siteUrl,
 *     title: m('title'),
 *     subtitle: m('description'),
 *     tier: 'strong-stay',
 *     category: 'STAY',
 *     imagePath: '/images/category-stay.png',
 *   })
 *
 * 반환: 절대 URL (SNS 미리보기 호환)
 *   - 1순위: imagePath 명시되면 그대로 사용
 *   - 2순위: category 가 매핑에 있으면 카테고리별 이미지
 *   - 3순위: category-story.png (기본 fallback — 사이트 브랜드 일반 OG)
 */

export type OgTier = 'strong' | 'strong-stay' | 'soft' | 'plain'

export interface OgUrlInput {
  baseUrl: string
  title: string
  subtitle?: string
  /** 동적 OG 회귀 후 무시됨 — 향후 재활성화 시 사용 */
  tier?: OgTier
  category?: string
  /** /public 기준 이미지 경로 (예: '/images/category-stay.png') */
  imagePath?: string
}

/**
 * 카테고리 → 정적 OG 이미지 매핑 (보유 자산 활용).
 * 신규 카테고리 추가 시 본 맵에 등록.
 */
const STATIC_OG_BY_CATEGORY: Record<string, string> = {
  STAY: '/images/category-stay.png',
  OOTD: '/images/category-fashion.png',
  'K-FOOD': '/images/category-food.png',
  SPOT: '/images/category-sights.png',
  QUEST: '/images/category-story.png',
  DIY: '/images/category-create.png',
  // DISCOVER / COMMUNITY / PASS / COURSE 는 매핑 미등록 → category-story fallback
}

const FALLBACK_IMAGE = '/images/category-story.png'

export function buildOgUrl(input: OgUrlInput): string {
  const path =
    input.imagePath
    ?? (input.category ? STATIC_OG_BY_CATEGORY[input.category] : undefined)
    ?? FALLBACK_IMAGE
  return new URL(path, input.baseUrl).toString()
}
