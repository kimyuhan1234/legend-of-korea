export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserRank } from '@/lib/tiers/get-user-rank'
import { TechTreeView, type TechTreeNode } from '@/components/features/dashboard/TechTreeView'

interface Props {
  params: { locale: string }
}

interface TierTitleRow {
  level: number
  route: string
  name_ko: string
  name_en: string
  name_ja: string
  name_zh_cn: string
  name_zh_tw: string
  emoji: string
  is_special: boolean
}

function pickName(row: TierTitleRow, locale: string): string {
  switch (locale) {
    case 'en': return row.name_en
    case 'ja': return row.name_ja
    case 'zh-CN': return row.name_zh_cn
    case 'zh-TW': return row.name_zh_tw
    default: return row.name_ko
  }
}

async function loadAllNodes(locale: string): Promise<TechTreeNode[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tier_titles')
    .select('level, route, name_ko, name_en, name_ja, name_zh_cn, name_zh_tw, emoji, is_special')
    .returns<TierTitleRow[]>()

  if (error || !data) return []

  return data.map((r) => ({
    level: r.level,
    route: (r.route === 'common' || r.route === 'scholar' || r.route === 'warrior' ? r.route : 'common') as TechTreeNode['route'],
    name: pickName(r, locale),
    emoji: r.emoji,
    isSpecial: r.is_special,
  }))
}

export default async function TechTreePage({ params }: Props) {
  const rank = await getUserRank(params.locale)
  if (!rank) redirect(`/${params.locale}/auth/login?next=/${params.locale}/mypage/tech-tree`)

  const nodes = await loadAllNodes(params.locale)
  return <TechTreeView locale={params.locale} rank={rank} nodes={nodes} />
}
