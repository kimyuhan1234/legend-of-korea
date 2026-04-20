import { PassHubPage } from '@/components/features/pass/PassHubPage'

export default async function LivePassPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <PassHubPage passId="live" locale={locale} />
}
