import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { QuizMission } from '@/components/features/missions/QuizMission';
import { PhotoMission } from '@/components/features/missions/PhotoMission';
// import { OpenMission } from '@/components/features/missions/OpenMission'; 
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
    .select('*, mission_progress!left(*), kit_products!inner(title)')
    .eq('id', missionId)
    .single();

  if (error || !mission) notFound();

  const progress = mission.mission_progress?.[0];
  const courseName = (mission.kit_products as any)?.title?.[locale] || (mission.kit_products as any)?.title?.ko || '코스';
  
  // 접근 제한: locked 상태면 맵으로 튕기기 (히든 미션은 예외로 스캔 직후엔 보임)
  if (!progress || (progress.status === 'locked' && !mission.is_hidden)) {
    redirect(`/${locale}/missions/${courseId}`);
  }

  const lang = locale as 'ko' | 'ja' | 'en';
  const isBoss = mission.type === 'boss';
  const isHidden = mission.is_hidden;

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent -ml-2">
          <Link href={`/${locale}/missions/${courseId}`} className="flex items-center gap-1 font-bold">
            <ChevronLeft className="w-5 h-5" />
            {t('back')}
          </Link>
        </Button>
        
        <div className="flex gap-2">
          {isBoss && (
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-white text-xs font-black shadow-lg">
              <Trophy className="w-3.5 h-3.5" />
              보스 미션
            </div>
          )}
          {isHidden && (
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-black shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              히든 미션
            </div>
          )}
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-10">
         <h1 className="text-3xl font-black mb-2">{mission.title[lang] || mission.title.ko}</h1>
         <p className="text-muted-foreground font-medium">
            {isBoss ? '최종 관문을 통과하고 대량의 LP를 획득하세요!' : isHidden ? '비밀의 장소에서 특별한 보상을 발견했습니다.' : '미션을 수행하고 다음 단계로 나아가세요.'}
         </p>
      </div>

      {/* Mission Content */}
      <div className="space-y-12">
        {mission.type === 'quiz' && (
          <QuizMission 
            missionId={mission.id}
            courseName={courseName}
            question={mission.title}
            hints={[
              mission.quiz_hint_1,
              mission.quiz_hint_2,
              mission.quiz_hint_3
            ].filter(Boolean)}
            lpReward={mission.lp_reward}
            initialStatus={progress.status}
          />
        )}

        {(mission.type === 'photo' || mission.type === 'boss' || mission.type === 'hidden') && (
          <PhotoMission 
            missionId={mission.id}
            courseName={courseName}
            description={mission.description}
            lpReward={mission.lp_reward}
            initialStatus={progress.status}
            isBoss={mission.type === 'boss'}
            isHidden={mission.type === 'hidden'}
          />
        )}
        {!(mission.type === 'quiz' || mission.type === 'photo' || mission.type === 'boss' || mission.type === 'hidden') && (
          /* Open type placeholder */
          <div className="p-10 border-2 border-dashed border-primary/20 rounded-3xl bg-primary/5 text-center">
             <Info className="w-12 h-12 text-primary/40 mx-auto mb-4" />
             <h3 className="text-xl font-bold mb-2">오픈형 미션 준비 중</h3>
             <p className="text-muted-foreground">곧 업데이트될 예정입니다.</p>
          </div>
        )}

        {/* Info Box */}
        <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-start gap-4">
           <Info className="w-5 h-5 text-slate-400 mt-1" />
           <div className="text-sm text-slate-500 leading-relaxed font-medium">
             <p className="mb-2"><strong>미션 안내:</strong></p>
             <ul className="list-disc list-inside space-y-1">
                <li>미션 완료 시 자동으로 다음 미션이 활성화됩니다.</li>
                <li>오답이나 업로드 오류 시에도 여러 번 재시도가 가능합니다.</li>
                <li>획득한 LP는 마이페이지의 티어 반영에 즉시 사용됩니다.</li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
