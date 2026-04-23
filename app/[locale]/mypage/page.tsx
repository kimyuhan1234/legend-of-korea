import { MyPageClient } from './MyPageClient';
import { getUserRank } from '@/lib/tiers/get-user-rank';

export const dynamic = 'force-dynamic';

export default async function MyPage({ params: { locale } }: { params: { locale: string } }) {
  const rank = await getUserRank(locale);
  return <MyPageClient locale={locale} initialRank={rank} />;
}
