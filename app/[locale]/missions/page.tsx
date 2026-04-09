import { redirect } from 'next/navigation';

export default function MissionsPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/mypage`);
}