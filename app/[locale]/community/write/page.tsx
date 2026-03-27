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

  // Fetch all active courses
  const { data: coursesData } = await supabase
    .from('courses')
    .select('id, title')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const courses = (coursesData || []).map((c: any) => ({
    id: c.id,
    title: c.title?.[locale] || c.title?.ko || '알 수 없는 코스',
  }));

  return (
    <div className="px-4 py-12">
      <CommunityWriteForm locale={locale} courses={courses} />
    </div>
  );
}
