import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { QuizMission } from '@/components/features/missions/QuizMission';
import { MissionCard } from '@/components/features/missions/MissionCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info } from 'lucide-react';
import Link from 'next/link';

interface MissionPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function MissionDetailPage({ params }: MissionPageProps) {
  const { locale, id } = params;
  const supabase = await createClient();
  const t = await getTranslations('mission');

  // 1. 사용자 확인
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/missions/${id}`);
  }

  // 2. 미션 및 진행 상태 데이터 가져오기
  const { data: mission, error } = await supabase
    .from('missions')
    .select('*, mission_progress!left(*)')
    .eq('id', id)
    .single();

  if (error || !mission) {
    notFound();
  }

  const progress = mission.mission_progress?.[0];
  const lang = locale as 'ko' | 'ja' | 'en';

  // 3. 미션 상태에 따른 접근 제어
  // locked 상태면 scan 페이지로 유도 (직접 접근 방지)
  if (!progress || progress.status === 'locked') {
    redirect(`/${locale}/missions/scan`);
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      {/* 뒤로가기 & 브레드크럼 */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent text-muted-foreground">
          <Link href={`/${locale}/missions`} className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            {t('back')}
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        {/* 미션 요약 카드 */}
        <MissionCard 
          mission={mission} 
          progress={progress} 
          locale={locale} 
        />

        {/* 미션 수행 구역 */}
        <div className="mt-10">
          {mission.type === 'quiz' ? (
            <QuizMission 
              missionId={mission.id}
              question={mission.description[lang] || mission.description.ko}
              hints={[
                mission.hint_1?.[lang] || mission.hint_1?.ko || '',
                mission.hint_2?.[lang] || mission.hint_2?.ko || '',
                mission.hint_3?.[lang] || mission.hint_3?.ko || '',
              ].filter(Boolean)}
              lpReward={mission.lp_reward}
              initialStatus={progress.status}
            />
          ) : (
            // Photo, Boss, Open 등 다른 타입은 일단 Placeholder 또는 각각의 컴포넌트로 연결
            <div className="p-10 border-2 border-dashed border-primary/20 rounded-3xl bg-primary/5 text-center">
              <Info className="w-12 h-12 text-primary/40 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('underDevelopment') || '준비 중인 미션 타입'}</h3>
              <p className="text-muted-foreground">
                이 미션({mission.type})은 곧 업데이트될 예정입니다.
              </p>
            </div>
          )}
        </div>

        {/* 하단 안내 */}
        <div className="bg-muted/30 p-4 rounded-xl text-xs text-muted-foreground flex gap-3">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            발견하신 정답이 작동하지 않거나 현장 QR 코드에 문제가 있는 경우 
            <Link href={`/${locale}/contact`} className="text-primary underline ml-1">고객센터</Link>로 문의해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
