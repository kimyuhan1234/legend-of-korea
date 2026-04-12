'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Lock, CheckCircle2, Clock, Star, MapPin, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import MissionPhotoUpload from './MissionPhotoUpload';

export type MissionStatus = 'available' | 'registered' | 'locked';
export type ReviewStatus = 'pending' | 'approved';

export interface MissionCardMission {
  id: string;
  seq: number;
  title: string;
  location: string;
  lp: number;
  isBoss?: boolean;
}

export interface MissionCardProgress {
  photoUrl?: string;
  registeredAt?: string;
  reviewStatus: ReviewStatus;
  lpAwarded: boolean;
}

interface MissionCardProps {
  mission: MissionCardMission;
  status: MissionStatus;
  courseId: string;
  progress?: MissionCardProgress;
  onRegistered: (missionId: string) => void;
}

export default function MissionCard({
  mission,
  status,
  courseId,
  progress,
  onRegistered,
}: MissionCardProps) {
  const t = useTranslations('mypage');
  const [expanded, setExpanded] = useState(false);

  // ---------- State A: Available ----------
  if (status === 'available') {
    return (
      <div className="rounded-2xl border-2 border-mist bg-white overflow-hidden
                      hover:border-[#1F2937] hover:shadow-lg transition-all duration-300 group">
        {/* header clickable area */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full p-5 text-left flex items-start gap-4"
        >
          {/* sequence badge */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F2937] to-sky
                          flex items-center justify-center text-white font-black text-lg
                          shadow-md shadow-mint-light shrink-0 group-hover:scale-110 transition-transform">
            {mission.seq}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {mission.isBoss && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-600
                                 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                  <Sparkles size={10} />
                  {t('bossMission')}
                </span>
              )}
            </div>
            <h3 className="font-bold text-[#111] text-sm md:text-base leading-snug">
              {mission.title}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-stone">
                <MapPin size={12} />
                {mission.location}
              </span>
              <span className="text-xs font-bold text-[#9DD8CE]">
                +{mission.lp} LP
              </span>
            </div>
          </div>

          {/* expand icon */}
          <div className="shrink-0 mt-1">
            {expanded ? (
              <ChevronUp size={20} className="text-[#111]" />
            ) : (
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] bg-[#9DD8CE] text-white px-2.5 py-1 rounded-full font-bold">
                  {t('uploadPhoto')}
                </span>
                <ChevronDown size={14} className="text-stone" />
              </div>
            )}
          </div>
        </button>

        {/* photo upload accordion */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-5 pb-5 border-t border-cloud">
            <MissionPhotoUpload
              missionId={mission.id}
              courseId={courseId}
              onSuccess={(id) => {
                setExpanded(false);
                onRegistered(id);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ---------- State B: Registered ----------
  if (status === 'registered' && progress) {
    return (
      <div className={`rounded-2xl border-2 overflow-hidden transition-all
        ${progress.reviewStatus === 'approved'
          ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50'
          : 'border-peach bg-peach'
        }`}
      >
        <div className="p-5 flex items-start gap-4">
          {/* completed badge */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md
            ${progress.reviewStatus === 'approved'
              ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
              : 'bg-gradient-to-br from-blossom-deep to-blossom text-white'
            }`}
          >
            <CheckCircle2 size={24} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold
                ${progress.reviewStatus === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {progress.reviewStatus === 'approved' ? (
                  <><CheckCircle2 size={10} /> {t('statusApproved')}</>
                ) : (
                  <><Clock size={10} /> {t('statusReviewing')}</>
                )}
              </span>
              {mission.isBoss && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-600
                                 px-2 py-0.5 rounded-full font-bold">
                  <Sparkles size={10} />
                  {t('bossMission')}
                </span>
              )}
            </div>

            <h3 className="font-bold text-[#111] text-sm md:text-base leading-snug">
              #{mission.seq} {mission.title}
            </h3>

            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-stone">
                <MapPin size={12} />
                {mission.location}
              </span>
            </div>

            {/* LP status */}
            <div className="mt-2">
              {progress.lpAwarded ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600">
                  <Star size={12} className="fill-green-500" />
                  +{mission.lp} {t('lpAwarded')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-stone">
                  <Clock size={12} />
                  +{mission.lp} {t('lpPending')}
                </span>
              )}
            </div>

            {/* registered date */}
            {progress.registeredAt && (
              <p className="text-[10px] text-stone mt-1">
                📅 {new Date(progress.registeredAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* thumbnail */}
          {progress.photoUrl && (
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-md shrink-0">
              <Image
                src={progress.photoUrl}
                alt="mission photo"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- State C: Locked ----------
  return (
    <div className="rounded-2xl border-0 bg-white overflow-hidden opacity-70
                    cursor-not-allowed select-none">
      <div className="p-5">
        {/* top: seq + title + lock icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* sequence number — grey circle */}
            <div className="w-10 h-10 rounded-full bg-mist text-white
                            flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
              {mission.seq}
            </div>
            <div className="min-w-0">
              {/* mission title — visible but greyed */}
              <h4 className="font-bold text-stone text-sm md:text-base leading-snug">
                {mission.title}
              </h4>
              {/* location + LP */}
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-stone">
                  <MapPin size={12} />
                  {mission.location}
                </span>
                <span className="text-xs text-stone font-medium">
                  🏆 {mission.lp} LP
                </span>
              </div>
              {/* boss mission badge */}
              {mission.isBoss && (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-cloud
                                 text-stone rounded-full text-[10px] font-bold">
                  <Sparkles size={10} />
                  {t('bossMission')}
                </span>
              )}
            </div>
          </div>

          {/* lock icon */}
          <span className="text-stone text-xl shrink-0 mt-1">🔒</span>
        </div>

        {/* locked notice bar */}
        <div className="mt-4 py-2.5 bg-snow rounded-xl flex items-center justify-center gap-2
                        border-0">
          <Lock size={14} className="text-stone" />
          <p className="text-xs text-stone font-medium">
            {t('lockedDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
