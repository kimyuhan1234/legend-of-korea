export const revalidate = 3600

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { SpotsClient } from '@/components/features/spots/SpotsClient'
import { getAllSpots } from '@/lib/tour-api/spots'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'sights' })
  const tc = await getTranslations({ locale: params.locale, namespace: 'common' })
  return { title: `${t('title')} | ${tc('siteName')}` }
}

export default async function SightsPage({ params }: Props) {
  const { locale } = params
  const spots = await getAllSpots()
  return <SpotsClient initialSpots={spots} locale={locale} />
}
