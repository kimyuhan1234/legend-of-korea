import { MyPageClient } from './MyPageClient';
import { getUserRank } from '@/lib/tiers/get-user-rank';
import { isAvatarSystemV2 } from '@/lib/avatar/feature-flag';
import { loadAvatarCatalog } from '@/lib/avatar/data';

export const dynamic = 'force-dynamic';

export default async function MyPage({ params: { locale } }: { params: { locale: string } }) {
  const rank = await getUserRank(locale);

  // server runtime 에서 평가 — Vercel env 변경 즉시 반영. webpack DefinePlugin 의 client
  // inline 함정 회피 ('use client' MyPageClient 에서 process.env 직접 read 시 빌드 시점 값
  // 으로 고정되는 문제). 결과만 prop 으로 내려준다.
  const isV2 = isAvatarSystemV2();

  // v2 — LevelCard 의 다음 레벨 카테고리 미리보기용 slug.
  // v1 / 057 미적용 환경에서는 null (LevelCard 미사용 → 영향 0).
  let nextCategorySlug: string | null = null;
  if (isV2 && rank && !rank.isMaxLevel) {
    const { categories } = await loadAvatarCatalog();
    const next = categories.find((c) => c.level_required === rank.level + 1);
    nextCategorySlug = next?.slug ?? null;
  }

  return (
    <MyPageClient
      locale={locale}
      initialRank={rank}
      isV2={isV2}
      nextCategorySlug={nextCategorySlug}
    />
  );
}
