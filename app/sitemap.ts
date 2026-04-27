import { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * P3A-4: 다국어 sitemap.xml 생성.
 * P3B-5: createServiceClient 로 전환 + is_active 필터 + course.created_at 활용.
 *
 * - 5 로케일 × 14 정적 routes = 70 entries (+ /pass noindex 제외)
 * - 각 entry 에 alternates.languages 5 로케일 자동 생성 (hreflang)
 * - dynamic courses 5 로케일 확장 (is_active = true 만)
 * - missions 는 비공개 (비로그인 차단) 이므로 sitemap 미포함 — 코스 페이지에서 link discovery
 * - /admin, /auth/parent-consent/[token] 등 비공개 path 는 sitemap 미포함
 */

// 매 1 시간마다 sitemap 재생성 (코스 추가/비활성 처리 반영)
export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'

const LOCALES = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as const

/**
 * 정적 path 화이트리스트 — sitemap 노출 대상.
 * /pass 는 robots noindex 의도라 제외.
 */
const STATIC_PATHS = [
  '',           // 메인
  '/discover',
  '/stay',
  '/community',
  '/story',
  '/food',
  '/ootd',
  '/traffic',
  '/sights',
  '/diy',
  '/memories',
  '/about',
  '/terms',
  '/privacy',
  '/partner',
] as const

function buildLanguageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`])
  )
}

function priorityFor(path: string): number {
  if (path === '') return 1.0
  if (path === '/discover') return 0.9
  if (path === '/community' || path === '/stay' || path === '/story') return 0.8
  if (path === '/terms' || path === '/privacy' || path === '/partner') return 0.4
  return 0.7
}

function changeFreqFor(path: string): MetadataRoute.Sitemap[number]['changeFrequency'] {
  if (path === '' || path === '/discover' || path === '/community') return 'daily'
  if (path === '/terms' || path === '/privacy' || path === '/about') return 'monthly'
  return 'weekly'
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  // 정적 routes × 5 로케일
  for (const path of STATIC_PATHS) {
    const altLangs = buildLanguageAlternates(path)
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: changeFreqFor(path),
        priority: priorityFor(path),
        alternates: { languages: altLangs },
      })
    }
  }

  // 동적 courses (Supabase) — service-role 클라이언트로 안정 접근.
  // is_active = true 만 노출 (비활성 / 준비 중 코스는 sitemap 제외).
  try {
    const supabase = await createServiceClient()
    const { data: courses } = await supabase
      .from('courses')
      .select('id, created_at')
      .eq('is_active', true)
    if (courses) {
      for (const course of courses) {
        const path = `/courses/${course.id}`
        const altLangs = buildLanguageAlternates(path)
        const lastModified = course.created_at ? new Date(course.created_at) : now
        for (const locale of LOCALES) {
          entries.push({
            url: `${BASE_URL}/${locale}${path}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
            alternates: { languages: altLangs },
          })
        }
      }
    }
  } catch {
    // Supabase 접근 실패 시 정적 routes 만 반환 — sitemap 자체는 정상 동작
  }

  return entries
}
