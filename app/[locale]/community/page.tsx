export const dynamic = 'force-dynamic'

import { CommunityFeed } from '@/components/features/community/CommunityFeed';
import { CommunitySidebar } from '@/components/features/community/CommunitySidebar';

export default function CommunityPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main Feed Content */}
        <main className="w-full min-w-0">
          <CommunityFeed locale={locale} />
        </main>
        
        {/* Right Sidebar (Desktop) / Bottom Sidebar (Mobile) */}
        <div className="w-full hidden lg:block">
          <CommunitySidebar />
        </div>
      </div>
    </div>
  );
}
