import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

/**
 * P3A-4: 다국어 sitemap.xml 생성.
 *
 * - 5 로케일 × 14 정적 routes = 70 entries (+ /pass noindex 제외)
 * - 각 entry 에 alternates.languages 5 로케일 자동 생성 (hreflang)
 * - dynamic courses 보존 (P0-4 이후 Supabase 쿼리 패턴)
 * - /admin, /auth/parent-consent/[token] 등 비공개 path 는 sitemap 미포함
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://legendofkorea.com'

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

  // 동적 courses (Supabase) — 이전 sitemap 패턴 보존, 5 로케일 확장
  try {
    const supabase = await createClient()
    const { data: courses } = await supabase.from('courses').select('id')
    if (courses) {
      for (const course of courses) {
        const path = `/courses/${course.id}`
        const altLangs = buildLanguageAlternates(path)
        for (const locale of LOCALES) {
          entries.push({
            url: `${BASE_URL}/${locale}${path}`,
            lastModified: now,
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
