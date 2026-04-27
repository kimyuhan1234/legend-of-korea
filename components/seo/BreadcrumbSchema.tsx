/**
 * P3A-3: BreadcrumbList Schema.org JSON-LD.
 *
 * 각 페이지에 사용 — 페이지 path 와 사용자 가시 라벨 (locale 별) 을 props 로 전달.
 *
 * 예:
 *   <BreadcrumbSchema items={[
 *     { name: 'Home', url: `/${locale}` },
 *     { name: 'Discover', url: `/${locale}/discover` },
 *   ]} />
 */
export interface BreadcrumbItem {
  name: string
  url: string  // locale prefix 포함 path (예: '/ko/discover')
}

interface Props {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legendofkorea.com'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
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
