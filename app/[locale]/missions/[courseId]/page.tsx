import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { CheckCircle2, Lock, QrCode, PlayCircle, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import type { I18nText } from '@/lib/supabase/types';
import { MissionDashboardClient } from '@/components/features/missions/MissionDashboardClient';

interface CourseMapProps {
  params: {
    locale: string;
    courseId: string;
  };
}

export async function generateMetadata({ params }: CourseMapProps): Promise<Metadata> {
  const { locale, courseId } = params
  const supabase = await createClient()
  const { data: course } = await supabase
    .from('courses')
    .select('title')
    .eq('id', courseId)
    .single()

  const title = course?.title
    ? ((course.title as unknown as I18nText)[locale as keyof I18nText] || (course.title as unknown as I18nText).ko || 'Mission')
    : 'Mission'

  const siteName = locale === 'ja' ? 'Cloud with you' : locale === 'en' ? 'Cloud with you' : 'Cloud with you'
  const label = locale === 'ja' ? 'ミッション' : locale === 'en' ? 'Missions' : '미션'

  return {
    title: `${title} ${label} | ${siteName}`,
    openGraph: { title: `${title} ${label} | ${siteName}` },
  }
}

export default async function CourseMapPage({ params }: CourseMapProps) {
  const { locale, courseId } = params;
  const supabase = await createClient();
  const _t = await getTranslations('mission');

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
  const { data: userProgress } = await supabase
    .from('mission_progress')
    .select('*')
    .eq('user_id', user.id);

  const progressMap = new Map(userProgress?.map(p => [p.mission_id, p.status]) || []);

  // 파티 정보 조회
  let partyInfo = null;
  try {
    const { data: membership } = await supabase
      .from('quest_party_members')
      .select('party_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (membership) {
      const { data: partyMembers } = await supabase
        .from('quest_party_members')
        .select('user_id, users:user_id(nickname, language)')
        .eq('party_id', membership.party_id);

      partyInfo = {
        id: membership.party_id,
        members: (partyMembers || []).map((pm: Record<string, unknown>) => ({
          user_id: pm.user_id as string,
          nickname: (pm.users as Record<string, string>)?.nickname || '?',
          language: (pm.users as Record<string, string>)?.language || 'en',
        })),
      };
    }
  } catch {
    // 파티 조회 실패 시 무시
  }

  const visibleMissions = missions.filter(m => {
    const status = progressMap.get(m.id) || 'locked';
    // 히든 미션은 스캔 시에만 등장 (상태가 lock이면 안보임)
    if (m.is_hidden && status === 'locked') return false;
    return true;
  });

  const completedCount = missions.filter(m => !m.is_hidden && progressMap.get(m.id) === 'completed').length;
  const totalCount = missions.filter(m => !m.is_hidden).length;

  // 다음 수행할 미션 찾기 (is_hidden 제외한 순차적 미션 중 첫 번째 미완료)
  const firstIncomplete = missions.find(m => !m.is_hidden && progressMap.get(m.id) !== 'completed');

  // MissionDashboardClient에 전달할 progress 데이터
  const progressForClient = (userProgress || []).map((p: Record<string, unknown>) => ({
    mission_id: p.mission_id as string,
    status: p.status as string,
    lp_earned: (p.lp_earned as number) || 0,
  }));

  const missionsForClient = missions.map((m: Record<string, unknown>) => ({
    id: m.id as string,
    sequence: m.sequence as number,
    type: m.type as string,
    title: m.title as Record<string, string>,
    lp_reward: m.lp_reward as number,
    is_hidden: m.is_hidden as boolean,
  }));

  return (
    <div className="container max-w-3xl mx-auto py-20 md:py-28 px-8 md:px-10 pb-32 min-h-screen bg-slate-50/30">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black mb-4 tracking-tight">전설의 여정</h1>
      </div>

      {/* 게임형 대시보드 + 파티원 현황 + 채팅 */}
      <MissionDashboardClient
        missions={missionsForClient}
        progress={progressForClient}
        courseId={courseId}
        locale={locale}
        userId={user.id}
        party={partyInfo}
      />

      {/* 기존 타임라인 (MissionDashboardClient에서 timeline 뷰 선택 시 표시) */}
      <div className="mt-8">
      <div className="flex items-center justify-center gap-4 text-slate-500 font-bold mb-6">
           <Trophy className={`w-5 h-5 ${completedCount === totalCount ? 'text-blossom-deep' : 'text-primary'}`} />
           {completedCount} / {totalCount} 미션 완료
        </div>

      <div className="relative space-y-10">
        {/* Timeline Line */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent -translate-x-1/2 hidden md:block" />

        {visibleMissions.map((m, idx) => {
          const status = progressMap.get(m.id) || 'locked';
          const isCompleted = status === 'completed';
          const isCurrent = firstIncomplete?.id === m.id;
          const isLocked = !isCompleted && !isCurrent && !m.is_hidden;
          const isBoss = m.type === 'boss';
          const isHidden = m.is_hidden;

          const cardTheme = isCompleted 
            ? 'bg-green-50/80 border-green-200' 
            : isCurrent 
              ? 'bg-white border-blossom shadow-[0_20px_50px_-15px_rgba(251,191,36,0.2)]' 
              : 'bg-slate-100/50 border-slate-200 opacity-70';

          return (
            <div key={m.id} className={`relative flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              
              {/* Timeline Node */}
              <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 z-10 hidden md:block transition-colors duration-500 shadow-sm ${
                isCompleted ? 'bg-green-500 border-white' : isCurrent ? 'bg-blossom-deep border-white animate-pulse' : 'bg-slate-300 border-white'
              }`} />

              {/* Mission Card */}
              <div className={`w-full md:w-[46%] rounded-[2.5rem] p-8 border-2 transition-all duration-500 hover:translate-y-[-4px] ${cardTheme}`}>
                <div className="flex justify-between items-center mb-6">
                  <Badge variant="outline" className={`py-1 px-3 border-none font-black ${
                      isCompleted ? 'bg-green-100 text-green-700' : isCurrent ? 'bg-peach text-slate' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isHidden ? (
                      <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> HIDDEN</span>
                    ) : isBoss ? (
                      <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> BOSS</span>
                    ) : (
                      `Mission ${m.sequence}`
                    )}
                  </Badge>
                  <span className={`text-lg font-black ${isCompleted ? 'text-green-600' : 'text-slate-800'}`}>
                    +{m.lp_reward} 빗방울
                  </span>
                </div>

                <h3 className={`text-2xl font-black mb-6 leading-tight ${isLocked ? 'text-slate-400 italic' : 'text-slate-800'}`}>
                  {isLocked ? '잠겨있는 미션' : (m.title[locale] || m.title.en || m.title.ko)}
                </h3>

                <div className="flex items-center justify-between mt-auto">
                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-green-600 font-black text-lg">
                      <CheckCircle2 className="w-6 h-6" />
                      성공!
                    </div>
                  ) : isCurrent || isHidden ? (
                    <Button asChild size="lg" className="rounded-2xl h-14 px-10 shadow-xl hover:shadow-primary/30 font-black text-lg group">
                      <Link href={`/${locale}/missions/${courseId}/${m.id}`}>
                        미션 수행
                        <PlayCircle className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 font-bold">
                      <Lock className="w-5 h-5" />
                      이전 미션 완료 필요
                    </div>
                  )}
                </div>
              </div>
              
              <div className="hidden md:block w-0 md:w-[46%]" />
            </div>
          );
        })}
      </div>

      </div>{/* 기존 타임라인 래퍼 닫기 */}

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
