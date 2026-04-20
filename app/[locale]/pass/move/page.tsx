import { PassHubPage } from '@/components/features/pass/PassHubPage'

export default async function MovePassPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <PassHubPage passId="move" locale={locale} />
}
