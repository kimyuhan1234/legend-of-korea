import { MyPageClient } from './MyPageClient';

export default function MyPage({ params: { locale } }: { params: { locale: string } }) {
  return <MyPageClient locale={locale} />;
}