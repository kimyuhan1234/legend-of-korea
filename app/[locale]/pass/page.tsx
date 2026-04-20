import { PassPricingSection } from '@/components/features/pass/PassPricingSection'

export const metadata = {
  title: 'Pass',
}

export default async function PassPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <PassPricingSection locale={locale} />
}
