import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { MissionExecutionClient } from '@/components/features/missions/MissionExecutionClient';
import { OfflineGuard } from '@/components/features/missions/OfflineGuard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Sparkles, Trophy } from 'lucide-react';
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
  if (!user) redirect(`/${locale}/auth/login?next=/${locale}/missions/${courseId}/${missionId}`);

  // 미션 + 진행 상태 + 코스명 조회
  const { data: mission, error } = await supabase
    .from('missions')
    .select(`
      *,
      mission_progress!left(*),
      courses!inner ( title )
    `)
    .eq('id', missionId)
    .single();

  if (error || !mission) notFound();

  const progress    = mission.mission_progress?.find((p: any) => p.user_id === user.id) ?? { status: 'locked' };
  const courseName  = (mission.courses as any)?.title?.[locale] ?? (mission.courses as any)?.title?.ko ?? '코스';
  type I18nKey = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW';
  const lang        = locale as I18nKey;
  const isBoss      = mission.type === 'boss';
  const isHidden    = mission.is_hidden;

  // locked 상태 접근 차단 (히든 미션 제외)
  if (progress.status === 'locked' && !isHidden) {
    redirect(`/${locale}/missions/${courseId}`);
  }

  return (
    <OfflineGuard locale={locale}>
      <div className="container max-w-2xl mx-auto py-20 md:py-28 px-8 md:px-10 min-h-screen bg-slate-50/20">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent -ml-2 text-slate-600">
            <Link href={`/${locale}/missions/${courseId}`} className="flex items-center gap-1 font-bold">
              <ChevronLeft className="w-5 h-5" />
              {t('back')}
            </Link>
          </Button>

          <div className="flex gap-2">
            {isBoss && (
              <div className="flex items-center gap-1.5 px-8 md:px-10 py-1.5 rounded-full bg-gradient-to-r from-blossom-deep to-blossom text-white text-xs font-black shadow-lg animate-bounce">
                <Trophy className="w-3.5 h-3.5" />
                {t('boss')}
              </div>
            )}
            {isHidden && (
              <div className="flex items-center gap-1.5 px-8 md:px-10 py-1.5 rounded-full bg-gradient-to-r from-sky to-mint-deep text-white text-xs font-black shadow-lg animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                {t('hidden')}
              </div>
            )}
          </div>
        </div>

        {/* 타이틀 (보스 제외 — BossMission 내부에 타이틀 포함) */}
        {!isBoss && (
          <div className="mb-10">
            <h1 className="text-4xl font-black mb-4 tracking-tight text-slate-800">
              {mission.title?.[lang] ?? mission.title?.ko ?? ''}
            </h1>
            <p className="text-lg text-slate-500 font-bold leading-relaxed">
              {isHidden
                ? t('hiddenDesc') ?? '비밀의 장소에서 특별한 보상을 발견했습니다.'
                : (mission.description?.[lang] ?? mission.description?.ko ?? '')}
            </p>
          </div>
        )}

        {/* ── 레고 블록 조립 (GPS 확인 → 미션 수행) ────────────── */}
        <MissionExecutionClient
          missionId={mission.id}
          courseName={courseName}
          locale={locale}
          missionType={mission.type}
          title={mission.title?.[lang] ?? mission.title?.ko ?? ''}
          description={mission.description?.[lang] ?? mission.description?.ko ?? ''}
          hints={[
            mission.hint_1?.[lang] ?? mission.hint_1?.ko,
            mission.hint_2?.[lang] ?? mission.hint_2?.ko,
            mission.hint_3?.[lang] ?? mission.hint_3?.ko,
          ].filter((h): h is string => Boolean(h))}
          lpReward={mission.lp_reward}
          initialStatus={progress.status}
          correctAnswer={mission.correct_answer ?? undefined}
          latitude={mission.latitude ?? null}
          longitude={mission.longitude ?? null}
          isBoss={isBoss}
        />
      </div>
    </OfflineGuard>
  );
}
