import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CommunityWriteForm } from '@/components/features/community/CommunityWriteForm';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';

export default async function CommunityWritePage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/community/write`);
  }

  // Fetch purchased courses
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      kit_products (
        courses (
          id,
          title
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('payment_status', 'paid');

  const courseMap = new Map();
  orders?.forEach(order => {
    const kit = order.kit_products as any;
    const course = kit?.courses;
    if (course && !courseMap.has(course.id)) {
      courseMap.set(course.id, {
        id: course.id,
        title: course.title?.[locale] || course.title?.ko || '알 수 없는 코스'
      });
    }
  });

  const courses = Array.from(courseMap.values());

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <Navbar locale={locale} />
      <div className="flex-1 px-4 py-12">
        <CommunityWriteForm locale={locale} courses={courses} />
      </div>
      <Footer locale={locale} />
    </main>
  );
}
