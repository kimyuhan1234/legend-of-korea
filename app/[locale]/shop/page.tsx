export const dynamic = 'force-dynamic'

import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { ShopClient } from './ShopClient';

export default function ShopPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <Navbar locale={locale} />
      <ShopClient locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
