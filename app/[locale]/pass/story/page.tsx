import { PassHubPage } from '@/components/features/pass/PassHubPage'

export default async function StoryPassPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <PassHubPage passId="story" locale={locale} />
}
