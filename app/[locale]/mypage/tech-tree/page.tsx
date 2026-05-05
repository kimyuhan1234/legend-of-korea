export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserRank } from '@/lib/tiers/get-user-rank'
import { TechTreeView, type TechTreeNode } from '@/components/features/dashboard/TechTreeView'
import { AvatarUnlockMap } from '@/components/features/dashboard/AvatarUnlockMap'
import { isAvatarSystemV2 } from '@/lib/avatar/feature-flag'
import { loadAvatarCatalog, getAvatarUserState } from '@/lib/avatar/data'

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
  // v2 flag — 신규 K-콘텐츠 카테고리 해금 시스템
  if (isAvatarSystemV2()) {
    const userState = await getAvatarUserState()
    if (!userState) redirect(`/${params.locale}/auth/login?next=/${params.locale}/mypage/tech-tree`)
    const { categories, images } = await loadAvatarCatalog()
    return (
      <AvatarUnlockMap
        locale={params.locale}
        currentLevel={userState.current_level}
        selectedImageId={userState.selected_avatar_image_id}
        categories={categories}
        images={images}
      />
    )
  }

  // v1 — 기존 무관/문관 분기 시스템 (058 적용 + commit 5 cleanup 전까지 fallback)
  const rank = await getUserRank(params.locale)
  if (!rank) redirect(`/${params.locale}/auth/login?next=/${params.locale}/mypage/tech-tree`)

  const nodes = await loadAllNodes(params.locale)
  return <TechTreeView locale={params.locale} rank={rank} nodes={nodes} />
}
