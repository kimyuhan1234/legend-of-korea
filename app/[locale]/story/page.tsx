export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { StoryClient } from './StoryClient'

interface Props {
  params: { locale: string }
  searchParams: { tab?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'story' })
  const tc = await getTranslations({ locale: params.locale, namespace: 'common' })
  return { title: `${t('title')} | ${tc('siteName')}` }
}

export default async function StoryPage({ params, searchParams }: Props) {
  const { locale } = params
  const tab = searchParams.tab || 'mission-kit'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('nickname, total_lp, current_tier')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <StoryClient
      locale={locale}
      initialTab={tab}
      user={user ? { id: user.id, ...profile } : null}
    />
  )
}
