import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { MyPageClient } from './MyPageClient';

export default function MyPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <Navbar locale={locale} />
      <MyPageClient locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
