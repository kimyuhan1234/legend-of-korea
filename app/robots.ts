import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legendofkorea.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/*/admin', '/*/api'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
