import { MyPageClient } from './MyPageClient';
import { getUserRank } from '@/lib/tiers/get-user-rank';
import { loadAvatarCatalog, getAvatarUserState } from '@/lib/avatar/data';

export const dynamic = 'force-dynamic';

export default async function MyPage({ params: { locale } }: { params: { locale: string } }) {
  const rank = await getUserRank(locale);

  // 아바타 정보 + catalog 미리 fetch — 마이페이지에서 직접 AvatarSelectModal 열기 위함.
  const [avatarState, catalog] = await Promise.all([
    getAvatarUserState(),
    loadAvatarCatalog(),
  ]);

  let nextCategorySlug: string | null = null;
  if (rank && !rank.isMaxLevel) {
    const next = catalog.categories.find((c) => c.level_required === rank.level + 1);
    nextCategorySlug = next?.slug ?? null;
  }

  return (
    <MyPageClient
      locale={locale}
      initialRank={rank}
      initialAvatarFilename={avatarState?.selected_avatar_filename ?? null}
      initialAvatarSlug={avatarState?.selected_avatar_slug ?? null}
      currentLevel={avatarState?.current_level ?? rank?.level ?? 1}
      selectedImageId={avatarState?.selected_avatar_image_id ?? null}
      avatarCategories={catalog.categories}
      avatarImages={catalog.images}
      nextCategorySlug={nextCategorySlug}
    />
  );
}
