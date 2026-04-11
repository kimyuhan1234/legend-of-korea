export const revalidate = 3600

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { StayPageClient } from '@/components/features/stay/StayPageClient'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'stay' })
  const tc = await getTranslations({ locale: params.locale, namespace: 'common' })
  return {
    title: `${t('title')} | ${tc('siteName')}`,
    description: t('hero.subline'),
    openGraph: {
      title: `${t('title')} | ${tc('siteName')}`,
      description: t('hero.subline'),
    },
  }
}

export default function StayPage({ params }: Props) {
  return <StayPageClient locale={params.locale} />
}
