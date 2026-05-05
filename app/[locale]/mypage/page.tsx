import { MyPageClient } from './MyPageClient';
import { getUserRank } from '@/lib/tiers/get-user-rank';
import { loadAvatarCatalog, getAvatarUserState } from '@/lib/avatar/data';

export const dynamic = 'force-dynamic';

export default async function MyPage({ params: { locale } }: { params: { locale: string } }) {
  const rank = await getUserRank(locale);

  // 아바타 정보 + 다음 레벨 카테고리 slug 미리 fetch.
  // server runtime fetch → prop drilling → AvatarSelectModal 의 router.refresh()
  // 가 server 재실행하면 새 props 가 내려와 즉시 반영.
  const [avatarState, catalog] = await Promise.all([
    getAvatarUserState(),
    rank && !rank.isMaxLevel ? loadAvatarCatalog() : Promise.resolve({ categories: [], images: [] }),
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
      nextCategorySlug={nextCategorySlug}
    />
  );
}
