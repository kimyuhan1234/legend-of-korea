import { MyPageClient } from './MyPageClient';
import { getUserRank } from '@/lib/tiers/get-user-rank';
import { isAvatarSystemV2 } from '@/lib/avatar/feature-flag';
import { loadAvatarCatalog } from '@/lib/avatar/data';

export const dynamic = 'force-dynamic';

export default async function MyPage({ params: { locale } }: { params: { locale: string } }) {
  const rank = await getUserRank(locale);

  // v2 — LevelCard 의 다음 레벨 카테고리 미리보기용 slug.
  // v1 / 057 미적용 환경에서는 null (LevelCard 미사용 → 영향 0).
  let nextCategorySlug: string | null = null;
  if (isAvatarSystemV2() && rank && !rank.isMaxLevel) {
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
