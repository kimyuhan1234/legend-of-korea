import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'; // Assuming standard shadcn Progress
import { BookOpen, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface MissionCenterProps {
  params: { locale: string };
}

export default async function MissionCenterPage({ params }: MissionCenterProps) {
  const { locale } = params;
  const supabase = await createClient();
  const t = await getTranslations('mission');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/missions`);

  // 1. 구매한 코스 조회 (kit_products -> courses 조인)
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      kit_products (
        course_id,
        courses (
          id,
          title
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('payment_status', 'paid');

  if (!orders || orders.length === 0) {
    // ... (same as before)
    return (
      <div className="container max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-4">아직 미션 키트가 없습니다.</h1>
        <p className="text-muted-foreground mb-8">코스를 둘러보고 전설의 주인공이 되어보세요!</p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href={`/${locale}/courses`}>코스 둘러보기</Link>
        </Button>
      </div>
    );
  }

  // 2. 유니크한 코스 ID 추출 및 통계 계산
  const courseMap = new Map();
  orders.forEach(order => {
    const kit = order.kit_products as any;
    const course = kit?.courses;
    if (course && !courseMap.has(course.id)) {
      courseMap.set(course.id, {
        id: course.id,
        title: course.title?.[locale] || course.title?.ko || '알 수 없는 코스'
      });
    }
  });

  const courseIds = Array.from(courseMap.keys());

  const { data: missions } = await supabase
    .from('missions')
    .select('id, course_id, is_hidden')
    .in('course_id', courseIds);

  const { data: progress } = await supabase
    .from('mission_progress')
    .select('mission_id, status')
    .eq('user_id', user.id)
    .eq('status', 'completed');

  const completedMissionIds = new Set(progress?.map(p => p.mission_id) || []);

  const courseStats = courseIds.map(cid => {
    const courseInfo = courseMap.get(cid);
    const courseMissions = missions?.filter(m => m.course_id === cid && !m.is_hidden) || [];
    const completed = courseMissions.filter(m => completedMissionIds.has(m.id)).length;
    
    return {
      id: cid,
      total: courseMissions.length || 1, // Avoid division by zero
      completed,
      title: courseInfo.title
    };
  });

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-8">{t('missionCenter')}</h1>
      
      <div className="grid gap-6">
        {courseStats.map(course => (
          <div key={course.id} className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-primary/10 shadow-lg flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            
            <div className="flex-1 w-full">
              <h2 className="text-xl font-bold mb-3">{course.title}</h2>
              <div className="flex justify-between text-sm mb-2 text-muted-foreground font-medium">
                <span>진행률</span>
                <span>{course.completed} / {course.total}</span>
              </div>
              <div className="h-3 bg-primary/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${(course.completed / course.total) * 100}%` }}
                />
              </div>
            </div>

            <Button asChild size="lg" className="rounded-2xl h-14 px-8 shrink-0 hover:scale-105 transition-transform">
              <Link href={`/${locale}/missions/${course.id}`} className="flex items-center gap-2">
                이어하기
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
