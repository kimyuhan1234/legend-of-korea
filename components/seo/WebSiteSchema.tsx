/**
 * P3A-3: WebSite Schema.org JSON-LD with Sitelinks Searchbox.
 *
 * 5 로케일별 SearchAction URL 을 자동 생성 (locale prefix 포함).
 * /discover 의 q 쿼리 파라미터를 검색 진입점으로 사용 (PRD-3B 에서 실제
 * 검색 기능 구현 시 같은 path 활용 가능).
 */
interface Props {
  locale: string
}

export function WebSiteSchema({ locale }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Clouds with you',
    url: `${baseUrl}/${locale}`,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/discover?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  )
}
