import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { MemoriesClient } from '@/components/features/memories/MemoriesClient'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'memories' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default function MemoriesPage({ params }: Props) {
  return <MemoriesClient locale={params.locale} />
}
