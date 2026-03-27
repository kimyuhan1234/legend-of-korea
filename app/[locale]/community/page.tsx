import { CommunityFeed } from '@/components/features/community/CommunityFeed';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';

export default function CommunityPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <Navbar locale={locale} />
      <div className="flex-1 px-4 py-8">
        <CommunityFeed locale={locale} />
      </div>
      <Footer locale={locale} />
    </main>
  );
}
