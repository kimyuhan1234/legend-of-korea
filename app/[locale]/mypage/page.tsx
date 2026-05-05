import { MyPageClient } from './MyPageClient';
import { getUserRank } from '@/lib/tiers/get-user-rank';
import { loadAvatarCatalog } from '@/lib/avatar/data';

export const dynamic = 'force-dynamic';

export default async function MyPage({ params: { locale } }: { params: { locale: string } }) {
  const rank = await getUserRank(locale);

  // LevelCard 의 다음 레벨 카테고리 미리보기용 slug.
  let nextCategorySlug: string | null = null;
  if (rank && !rank.isMaxLevel) {
    const { categories } = await loadAvatarCatalog();
    const next = categories.find((c) => c.level_required === rank.level + 1);
    nextCategorySlug = next?.slug ?? null;
  }

  return (
    <MyPageClient
      locale={locale}
      initialRank={rank}
      nextCategorySlug={nextCategorySlug}
    />
  );
}
