import { PassPricingSection } from '@/components/features/pass/PassPricingSection'

// /pass 페이지 noindex — Vercel Hobby 상업용 판단 회피 + 베타 가격 SEO 인덱싱 방지
export const metadata = {
  title: 'Pass',
  robots: { index: false, follow: false },
}

export default async function PassPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <PassPricingSection locale={locale} />
}
