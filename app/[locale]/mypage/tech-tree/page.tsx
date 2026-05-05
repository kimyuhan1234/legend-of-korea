export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { AvatarUnlockMap } from '@/components/features/dashboard/AvatarUnlockMap'
import { loadAvatarCatalog, getAvatarUserState } from '@/lib/avatar/data'

interface Props {
  params: { locale: string }
}

export default async function GrowthMapPage({ params }: Props) {
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
