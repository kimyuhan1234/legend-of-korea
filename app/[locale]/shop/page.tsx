export const dynamic = 'force-dynamic'

import { ShopClient } from './ShopClient';

export default function ShopPage({ params: { locale } }: { params: { locale: string } }) {
  return <ShopClient locale={locale} />;
}