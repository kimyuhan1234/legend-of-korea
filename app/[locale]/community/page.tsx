export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { CommunityFeed } from '@/components/features/community/CommunityFeed';
import { CommunitySidebar } from '@/components/features/community/CommunitySidebar';
import { Leaderboard } from '@/components/features/community/Leaderboard';

interface Props {
  params: { locale: string }
}

const META: Record<string, { title: string; description: string }> = {
  ko: {
    title: '커뮤니티 | Legend of Korea',
    description: '모험가들의 여행 기록과 레시피를 공유하세요.',
  },
  en: {
    title: 'Community | Legend of Korea',
    description: 'Share travel stories and recipes with fellow adventurers.',
  },
  ja: {
    title: 'コミュニティ | Legend of Korea',
    description: '冒険者たちの旅の記録とレシピを共有しよう。',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: m.title, description: m.description },
  }
}

export default function CommunityPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="max-w-6xl mx-auto px-8 md:px-10 py-20 md:py-28">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main Feed Content */}
        <main className="w-full min-w-0">
          <CommunityFeed locale={locale} />
        </main>
        
        {/* Right Sidebar (Desktop) / Bottom Sidebar (Mobile) */}
        <div className="w-full hidden lg:block space-y-6">
          <Leaderboard locale={locale} />
          <CommunitySidebar />
        </div>
        {/* 모바일: 리더보드 하단 표시 */}
        <div className="w-full lg:hidden">
          <Leaderboard locale={locale} />
        </div>
      </div>
    </div>
  );
}
