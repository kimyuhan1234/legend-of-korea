/**
 * P3A-3: Organization Schema.org JSON-LD.
 *
 * 모든 페이지에서 단 1회만 노출되어야 함 — app/[locale]/layout.tsx 에 마운트.
 * Server component — DOM hydration 영향 없음.
 *
 * Google Rich Results Test 검증:
 *   https://search.google.com/test/rich-results
 */
export function OrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legendofkorea.com'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cloud with you',
    alternateName: 'Legend of Korea',
    url: baseUrl,
    logo: `${baseUrl}/images/dokkaebi-hero.jpg`,
    description:
      'Korea travel platform for foreigners — GPS mission-based exploration through Korean legends.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@cloudwithyou.com',
      contactType: 'customer support',
      availableLanguage: ['Korean', 'English', 'Japanese', 'Chinese'],
    },
  }

  return (
    <script
      type="application/ld+json"
      // 안전한 JSON 직렬화 — XSS 방지 위해 < / > 이스케이프
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  )
}
