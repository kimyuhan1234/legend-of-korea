import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MissionRegisterClient from '@/components/features/mypage/MissionRegisterClient';
import {
  getCourseById,
  getMissionsByCourse,
  DIFFICULTY_MISSION_COUNT,
  type MissionData,
} from '@/lib/data/missions';

interface PageProps {
  params: { locale: string; courseId: string };
}

export default async function MissionRegisterPage({ params }: PageProps) {
  const { locale, courseId } = params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // Get course metadata from local seed data
  const courseData = getCourseById(courseId);
  type I18nKey = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW';
  const lang = locale as I18nKey;

  const courseName = courseData?.name?.[lang] ?? courseData?.name?.['ko'] ?? courseId;
  const courseRegion = courseData?.region?.[lang] ?? courseData?.region?.['ko'] ?? '';
  const courseEmoji = courseData?.emoji ?? '🗺️';
  const courseDifficulty = courseData?.difficulty ?? 'easy';
  const totalMissions = DIFFICULTY_MISSION_COUNT[courseDifficulty] ?? 5;

  // Get local mission seed data
  const localMissions: MissionData[] = getMissionsByCourse(courseId);

  // Try fetching DB missions; fall back to local seed data
  let missionsForClient: Array<{
    id: string;
    seq: number;
    title: string;
    location: string;
    lp: number;
    isBoss?: boolean;
  }> = [];

  const { data: dbMissions } = await supabase
    .from('missions')
    .select('id, sequence, type, title, lp_reward, is_hidden')
    .eq('course_id', courseId)
    .order('sequence', { ascending: true });

  if (dbMissions && dbMissions.length > 0) {
    // Use DB missions
    missionsForClient = dbMissions.map((m) => ({
      id: m.id,
      seq: m.sequence,
      title:
        (m.title as Record<string, string> | null)?.[locale] ??
        (m.title as Record<string, string> | null)?.['ko'] ??
        `Mission #${m.sequence}`,
      location: '', // DB missions don't have location yet, TODO
      lp: m.lp_reward,
      isBoss: m.type === 'boss',
    }));
  } else {
    // Fallback to local seed data
    missionsForClient = localMissions.map((m) => ({
      id: m.id,
      seq: m.seq,
      title: m.title?.[lang] ?? m.title?.['ko'] ?? '',
      location: m.location?.[lang] ?? m.location?.['ko'] ?? '',
      lp: m.lp,
      isBoss: m.isBoss,
    }));
  }

  // Fetch user's progress for all missions in this course
  const missionIds = missionsForClient.map((m) => m.id);
  const { data: progressRows } =
    missionIds.length > 0
      ? await supabase
          .from('mission_progress')
          .select('mission_id, status, photo_url, started_at, lp_earned')
          .eq('user_id', user.id)
          .in('mission_id', missionIds)
      : { data: [] };

  const initialProgress = (progressRows ?? []).map((p) => ({
    mission_id: p.mission_id,
    status: (p.status === 'completed' ? 'approved' : 'pending') as 'pending' | 'approved',
    photo_url: p.photo_url ?? undefined,
    registered_at: p.started_at ?? undefined,
    lp_awarded: (p.lp_earned ?? 0) > 0,
  }));

  return (
    <MissionRegisterClient
      locale={locale}
      course={{
        id: courseId,
        name: courseName,
        emoji: courseEmoji,
        region: courseRegion,
        difficulty: courseDifficulty,
        totalMissions,
      }}
      missions={missionsForClient}
      initialProgress={initialProgress}
    />
  );
}
