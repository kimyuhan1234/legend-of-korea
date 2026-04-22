export const revalidate = 3600

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { StayPageClient } from '@/components/features/stay/StayPageClient'
import { createServiceClient } from '@/lib/supabase/server'
import type { NormalizedStay } from '@/lib/tour-api/stays'

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

async function loadInitialStays(): Promise<{ stays: NormalizedStay[]; total: number }> {
  const supabase = await createServiceClient()
  const { data, error, count } = await supabase
    .from('tour_stays_cache')
    .select('data', { count: 'exact' })
    .limit(20)
    .returns<{ data: NormalizedStay }[]>()
  if (error) {
    console.error('[StayPage] Initial load failed:', error.message)
    return { stays: [], total: 0 }
  }
  return {
    stays: (data ?? []).map((r) => r.data),
    total: count ?? (data?.length ?? 0),
  }
}

export default async function StayPage({ params }: Props) {
  const { stays, total } = await loadInitialStays()
  return <StayPageClient locale={params.locale} initialStays={stays} initialTotal={total} />
}
