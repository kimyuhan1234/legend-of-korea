import { MetadataRoute } from 'next'

/**
 * P3A-4: robots.txt 생성.
 *
 * - 비공개 경로 명시적 disallow (/admin, /api, parent-consent token 등)
 * - sitemap.xml URL 명시
 * - host 추가 (Yandex 등 일부 봇이 활용)
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legendofkorea.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/*/admin',
        '/api',
        '/*/api',
        // P3A-4: 부모 동의 토큰 페이지 — 검색 노출 금지 (URL 자체에 비밀 토큰)
        '/*/auth/parent-consent/',
        // 마이페이지 / 마이 데이터 — 로그인 필수, 인덱싱 의미 없음
        '/*/mypage',
        // /pass 는 robots noindex 페이지 메타로도 처리 중 — 명시적 disallow 추가
        '/*/pass',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
