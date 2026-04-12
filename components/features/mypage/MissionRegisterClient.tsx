'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Trophy, Zap } from 'lucide-react';
import MissionProgress from './MissionProgress';
import MissionCard, {
  MissionStatus,
  MissionCardMission,
  MissionCardProgress,
} from './MissionCard';

interface CourseInfo {
  id: string;
  name: string;
  emoji: string;
  region: string;
  difficulty: string;
  totalMissions: number;
}

interface MissionItem {
  id: string;
  seq: number;
  title: string;
  location: string;
  lp: number;
  isBoss?: boolean;
}

interface ProgressRecord {
  mission_id: string;
  status: 'pending' | 'approved';
  photo_url?: string;
  registered_at?: string;
  lp_awarded: boolean;
}

interface MissionRegisterClientProps {
  locale: string;
  course: CourseInfo;
  missions: MissionItem[];
  initialProgress: ProgressRecord[];
}

const DIFFICULTY_LABELS: Record<string, Record<string, string>> = {
  easy: { ko: '초급', ja: '初級', en: 'Easy' },
  medium: { ko: '중급', ja: '中級', en: 'Medium' },
  hard: { ko: '고급', ja: '上級', en: 'Hard' },
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export default function MissionRegisterClient({
  locale,
  course,
  missions,
  initialProgress,
}: MissionRegisterClientProps) {
  const t = useTranslations('mypage');

  // Track progress as a map for easy lookups
  const [progressMap, setProgressMap] = useState<Record<string, ProgressRecord>>(() => {
    const map: Record<string, ProgressRecord> = {};
    for (const p of initialProgress) {
      map[p.mission_id] = p;
    }
    return map;
  });

  // Handle a new registration success (optimistic UI update)
  function handleRegistered(missionId: string) {
    setProgressMap((prev) => ({
      ...prev,
      [missionId]: {
        mission_id: missionId,
        status: 'pending',
        registered_at: new Date().toISOString(),
        lp_awarded: false,
      },
    }));
  }

  // Calculate completed count (both pending and approved count as "completed" for progress)
  const completedCount = Object.keys(progressMap).length;

  // Determine each mission's status
  function getMissionStatus(mission: MissionItem, index: number): MissionStatus {
    // Already registered
    if (progressMap[mission.id]) return 'registered';

    // First mission is always available
    if (index === 0) return 'available';

    // Available if the previous mission has been registered
    const prevMission = missions[index - 1];
    if (prevMission && progressMap[prevMission.id]) return 'available';

    // Otherwise locked
    return 'locked';
  }

  function getCardProgress(missionId: string): MissionCardProgress | undefined {
    const p = progressMap[missionId];
    if (!p) return undefined;
    return {
      photoUrl: p.photo_url,
      registeredAt: p.registered_at,
      reviewStatus: p.status,
      lpAwarded: p.lp_awarded,
    };
  }

  const totalLP = missions.reduce((sum, m) => sum + m.lp, 0);
  const earnedLP = Object.values(progressMap)
    .filter((p) => p.lp_awarded)
    .reduce((sum, p) => {
      const mission = missions.find((m) => m.id === p.mission_id);
      return sum + (mission?.lp ?? 0);
    }, 0);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      {/* ─── Header Section ─── */}
      <div className="bg-gradient-to-br from-[#1F2937] via-[#374151] to-[#1a0f44] text-white relative overflow-hidden">
        {/* decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#9DD8CE]/10 rounded-full -ml-16 -mb-16 blur-xl" />

        <div className="max-w-3xl mx-auto px-4 pt-8 pb-8 relative z-10">
          {/* back link */}
          <Link
            href={`/${locale}/mypage`}
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm
                       mb-6 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t('backToMissionCenter')}
          </Link>

          {/* course info header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center
                            text-4xl backdrop-blur-sm  border-0 border-white/10 shadow-lg">
              {course.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  DIFFICULTY_COLORS[course.difficulty] || 'bg-white/20 text-white'
                }`}>
                  {DIFFICULTY_LABELS[course.difficulty]?.[locale] ?? course.difficulty}
                </span>
                <span className="text-[10px] text-white/60">
                  📍 {course.region}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight">{course.name}</h1>
              <p className="text-xs text-white/50 mt-0.5">
                {t('missionCountLabel', { count: course.totalMissions })}
              </p>
            </div>
          </div>

          {/* progress bar */}
          <MissionProgress completed={completedCount} total={missions.length} />

          {/* stats row */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center  border-0 border-white/10">
              <p className="text-[10px] text-white/50 font-bold mb-0.5">📋 {t('totalMissions')}</p>
              <p className="text-lg font-black">{missions.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center  border-0 border-white/10">
              <p className="text-[10px] text-white/50 font-bold mb-0.5">🏆 {t('completedMissions')}</p>
              <p className="text-lg font-black">{completedCount}</p>
            </div>
            <div className="bg-[#9DD8CE]/20 backdrop-blur-sm rounded-xl p-3 text-center  border-0 border-[#9DD8CE]/20">
              <p className="text-[10px] text-white/50 font-bold mb-0.5">⚡ LP</p>
              <p className="text-lg font-black text-[#9DD8CE]">
                {earnedLP}<span className="text-[10px] text-white/40">/{totalLP}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mission List ─── */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <h2 className="text-base font-bold text-[#111] flex items-center gap-2">
          <Trophy size={18} className="text-[#9DD8CE]" />
          {t('missionListTitle')}
        </h2>

        {missions.map((mission, index) => {
          const s = getMissionStatus(mission, index);
          const cardMission: MissionCardMission = {
            id: mission.id,
            seq: mission.seq,
            title: mission.title,
            location: mission.location,
            lp: mission.lp,
            isBoss: mission.isBoss,
          };
          return (
            <MissionCard
              key={mission.id}
              mission={cardMission}
              status={s}
              courseId={course.id}
              progress={getCardProgress(mission.id)}
              onRegistered={handleRegistered}
            />
          );
        })}
      </div>

      {/* ─── Bottom Guide ─── */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#111] flex items-center gap-2">
            <Zap size={16} className="text-[#9DD8CE]" />
            {t('photoGuide')}
          </h3>
          <ul className="text-xs text-gray-500 space-y-2 pl-1">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📸</span>
              <span>{t('photoGuide1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">🔖</span>
              <span>{t('photoGuide2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📁</span>
              <span>{t('photoGuide3')}</span>
            </li>
          </ul>
          <div className="pt-2 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              ※ {t('photoGuideNotice')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
