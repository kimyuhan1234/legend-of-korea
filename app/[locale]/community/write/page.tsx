export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CommunityWriteForm } from '@/components/features/community/CommunityWriteForm';

export default async function CommunityWritePage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/community/write`);
  }

  return (
    <div className="px-8 md:px-10 py-20 md:py-28">
      <CommunityWriteForm locale={locale} />
    </div>
  );
}
