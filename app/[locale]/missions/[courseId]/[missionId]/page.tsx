import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { QuizMission } from '@/components/features/missions/QuizMission';
import { PhotoMission } from '@/components/features/missions/PhotoMission';
import { OpenMission } from '@/components/features/missions/OpenMission'; 
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface MissionExecutionPageProps {
  params: {
    locale: string;
    courseId: string;
    missionId: string;
  };
}

export default async function MissionExecutionPage({ params }: MissionExecutionPageProps) {
  const { locale, courseId, missionId } = params;
  const supabase = await createClient();
  const t = await getTranslations('mission');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/missions/${courseId}/${missionId}`);

  // 미션 및 코스 정보 조회
  const { data: mission, error } = await supabase
    .from('missions')
    .select(`
      *,
      mission_progress!left(*),
      courses!inner (
        title
      )
    `)
    .eq('id', missionId)
    .single();

  if (error || !mission) notFound();

  // 사용자 본인의 진행 상태만 필터링
  const progress = mission.mission_progress?.find((p: any) => p.user_id === user.id) || { status: 'locked' };
  const courseName = (mission.courses as any)?.title?.[locale] || (mission.courses as any)?.title?.ko || '코스';
  
  // 접근 제한: locked 상태면 맵으로 튕기기 (히든 미션은 예외로 스캔 직후엔 보임)
  if (progress.status === 'locked' && !mission.is_hidden) {
    redirect(`/${locale}/missions/${courseId}`);
  }

  const lang = locale as 'ko' | 'ja' | 'en';
  const isBoss = mission.type === 'boss';
  const isHidden = mission.is_hidden;

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 min-h-screen bg-slate-50/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent -ml-2 text-slate-600">
          <Link href={`/${locale}/missions/${courseId}`} className="flex items-center gap-1 font-bold">
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            {t('back')}
          </Link>
        </Button>
        
        <div className="flex gap-2">
          {isBoss && (
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-white text-xs font-black shadow-lg animate-bounce">
              <Trophy className="w-3.5 h-3.5" />
              보스 미션
            </div>
          )}
          {isHidden && (
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-black shadow-lg animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              히든 미션
            </div>
          )}
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-10">
         <h1 className="text-4xl font-black mb-4 tracking-tight text-slate-800">{mission.title[lang] || mission.title.ko}</h1>
         <p className="text-lg text-slate-500 font-bold leading-relaxed">
            {isBoss 
              ? '최종 관문을 통과하고 대량의 LP를 획득하세요!' 
              : isHidden 
                ? '비밀의 장소에서 특별한 보상을 발견했습니다.' 
                : (mission.description[lang] || mission.description.ko)}
         </p>
      </div>

      {/* Mission Content */}
      <div className="space-y-12">
        {mission.type === 'quiz' && (
          <QuizMission 
            missionId={mission.id}
            courseName={courseName}
            question={mission.title[lang] || mission.title.ko}
            hints={[
              mission.hint_1?.[lang] || mission.hint_1?.ko,
              mission.hint_2?.[lang] || mission.hint_2?.ko,
              mission.hint_3?.[lang] || mission.hint_3?.ko
            ].filter(Boolean)}
            lpReward={mission.lp_reward}
            initialStatus={progress.status}
            locale={locale}
          />
        )}

        {mission.type === 'photo' && (
          <PhotoMission 
            missionId={mission.id}
            courseName={courseName}
            description={mission.description[lang] || mission.description.ko}
            lpReward={mission.lp_reward}
            initialStatus={progress.status}
            isBoss={false}
            isHidden={false}
            locale={locale}
          />
        )}

        {(mission.type === 'open' || mission.type === 'boss' || mission.type === 'hidden') && (
          <OpenMission 
            missionId={mission.id}
            courseName={courseName}
            title={mission.title[lang] || mission.title.ko}
            description={mission.description[lang] || mission.description.ko}
            lpReward={mission.lp_reward}
            type={mission.type as 'open' | 'boss' | 'hidden'}
            initialStatus={progress.status}
            locale={locale}
          />
        )}

        {/* Info Box */}
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex items-start gap-5">
           <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
             <Info className="w-5 h-5 text-slate-400" />
           </div>
           <div className="text-sm text-slate-500 leading-relaxed font-bold">
             <p className="mb-3 text-slate-800 text-base">미션 가이드</p>
             <ul className="space-y-2 list-none">
                <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    미션 완료 시 자동으로 다음 단계가 해제됩니다.
                </li>
                <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    오답이나 업로드 오류 시에도 무제한 재시도가 가능합니다.
                </li>
                <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    획득한 LP는 실시간으로 마이페이지 티어에 반영됩니다.
                </li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
