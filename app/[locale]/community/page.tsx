export const dynamic = 'force-dynamic'

import { CommunityFeed } from '@/components/features/community/CommunityFeed';

export default function CommunityPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="px-4 py-8">
      <CommunityFeed locale={locale} />
    </div>
  );
}
