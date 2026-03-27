import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { CheckCircle2, Lock, QrCode, PlayCircle, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface CourseMapProps {
  params: {
    locale: string;
    courseId: string;
  };
}

export default async function CourseMapPage({ params }: CourseMapProps) {
  const { locale, courseId } = params;
  const supabase = await createClient();
  const t = await getTranslations('mission');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/missions/${courseId}`);

  // 1. 코스 정보 및 모든 미션(히든 포함) 조회
  const { data: missions, error: mError } = await supabase
    .from('missions')
    .select('*, mission_progress!left(*)')
    .eq('course_id', courseId)
    .order('sequence', { ascending: true });

  if (mError || !missions || missions.length === 0) notFound();

  // 2. 진행 상태 가공
  // 이전 미션이 완료되어야 다음 미션 해제 (sequential logic)
  let lastCompleted = true;
  const missionList = missions.map((m, idx) => {
    const progress = m.mission_progress?.[0]; // Filter by user_id in SQL if needed, but select from missions already filtered by userId? 
    // Wait, the SQL query above doesn't filter progress by user_id. Let's fix it.
    return m;
  });

  // Re-fetch with join filter if possible, or manual filter
  const { data: userProgress } = await supabase
    .from('mission_progress')
    .select('*')
    .eq('user_id', user.id);

  const progressMap = new Map(userProgress?.map(p => [p.mission_id, p.status]) || []);

  const visibleMissions = missions.filter(m => {
    const status = progressMap.get(m.id) || 'locked';
    // 히든 미션은 스캔 시에만 등장 (상태가 lock이면 안보임)
    if (m.is_hidden && status === 'locked') return false;
    return true;
  });

  const completedCount = missions.filter(m => !m.is_hidden && progressMap.get(m.id) === 'completed').length;
  const totalCount = missions.filter(m => !m.is_hidden).length;

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4 pb-32">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black mb-2">미션 맵</h1>
        <div className="flex items-center justify-center gap-4 text-muted-foreground font-medium">
           <div className="flex items-center gap-1.5">
             <Trophy className="w-4 h-4 text-primary" />
             {completedCount} / {totalCount} 미션 완료
           </div>
        </div>
        <div className="mt-4 h-3 bg-primary/10 rounded-full max-w-sm mx-auto overflow-hidden">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative space-y-12">
        {/* 점선 연결선 (배경) */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-primary/20 -translate-x-1/2 hidden md:block" />

        {visibleMissions.map((m, idx) => {
          const status = progressMap.get(m.id) || 'locked';
          const isCurrent = status === 'unlocked' || (idx > 0 && progressMap.get(visibleMissions[idx-1].id) === 'completed' && status === 'locked');
          const isCompleted = status === 'completed';
          const isBoss = m.type === 'boss';
          const isHidden = m.is_hidden;

          return (
            <div key={m.id} className={`relative flex flex-col md:flex-row items-center gap-6 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              
              {/* 타임라인 노드 */}
              <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 z-10 hidden md:block ${
                isCompleted ? 'bg-green-500 border-green-200' : isCurrent ? 'bg-primary border-primary/30' : 'bg-slate-300 border-slate-100'
              }`} />

              {/* 미션 카드 */}
              <div className={`w-full md:w-[45%] rounded-[2rem] p-6 border-2 transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-50/50 border-green-200 grayscale-[0.5]' 
                  : isCurrent 
                    ? 'bg-white border-primary shadow-[0_10px_40px_-10px_rgba(255,165,0,0.3)] scale-105 z-20' 
                    : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={isCompleted ? "secondary" : "outline"} className={isCompleted ? "bg-green-100 text-green-700 border-none" : ""}>
                    {isHidden ? (
                      <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> 히든</span>
                    ) : isBoss ? (
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> 보스</span>
                    ) : (
                      `Mission ${m.sequence}`
                    )}
                  </Badge>
                  <span className={`text-sm font-bold ${isCompleted ? 'text-green-600' : 'text-primary'}`}>
                    +{m.lp_reward} LP
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-4 line-clamp-1">
                  {status === 'locked' && !isCurrent ? '???' : (m.title[locale as 'ko'] || m.title.ko)}
                </h3>

                <div className="flex items-center justify-between">
                  {isCompleted ? (
                    <div className="flex items-center gap-1.5 text-green-600 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                      완료됨
                    </div>
                  ) : isCurrent ? (
                    <Button asChild className="rounded-full px-6 shadow-md hover:shadow-primary/30">
                      <Link href={`/${locale}/missions/${courseId}/${m.id}`}>수행하기</Link>
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <Lock className="w-4 h-4" />
                      잠김
                    </div>
                  )}
                </div>
              </div>
              
              <div className="hidden md:block w-0 md:w-[45%]" />
            </div>
          );
        })}
      </div>

      {/* Floating Scan Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Button asChild size="lg" className="rounded-full h-16 px-10 shadow-2xl hover:scale-105 transition-transform bg-black text-white hover:bg-black/90">
          <Link href={`/${locale}/missions/scan`} className="flex items-center gap-3 text-lg font-bold">
            <QrCode className="w-6 h-6" />
            QR 스캔하기
          </Link>
        </Button>
      </div>
    </div>
  );
}
