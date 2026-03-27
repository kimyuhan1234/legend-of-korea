import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legendofkorea.com'
  const locales = ['ko', 'en', 'ja']
  const supabase = await createClient()

  // Static routes
  const staticRoutes = ['', '/courses', '/community', '/shop', '/missions']
  const sitemap: MetadataRoute.Sitemap = []

  // Add static routes with locales
  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemap.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
      })
    }
  }

  // Fetch dynamic courses
  const { data: courses } = await supabase.from('courses').select('id')
  if (courses) {
    for (const course of courses) {
      for (const locale of locales) {
        sitemap.push({
          url: `${siteUrl}/${locale}/courses/${course.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  }

  return sitemap
}
