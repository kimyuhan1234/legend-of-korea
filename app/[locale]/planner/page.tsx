import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PlannerPageClient } from '@/components/features/planner/PlannerPageClient'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'planner' })
  const tc = await getTranslations({ locale: params.locale, namespace: 'common' })
  return {
    title: `${t('hero.title')} | ${tc('siteName')}`,
    description: t('hero.subtitle'),
    openGraph: {
      title: `${t('hero.title')} | ${tc('siteName')}`,
      description: t('hero.subtitle'),
    },
  }
}

export default function PlannerPage({ params }: Props) {
  return <PlannerPageClient locale={params.locale} />
}
