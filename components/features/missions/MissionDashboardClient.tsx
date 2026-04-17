'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { MissionProgressRing } from './MissionProgressRing'
import { MissionMapDashboard } from './MissionMapDashboard'
import { PartyMemberStatus } from './PartyMemberStatus'
import { PartyChat } from './PartyChat'

interface Mission {
  id: string
  sequence: number
  type: string
  title: Record<string, string>
  lp_reward: number
  is_hidden: boolean
}

interface Progress {
  mission_id: string
  status: string
  lp_earned: number
}

interface PartyMember {
  user_id: string
  nickname: string
  language: string
}

interface PartyInfo {
  id: string
  members: PartyMember[]
}

interface Props {
  missions: Mission[]
  progress: Progress[]
  courseId: string
  locale: string
  userId: string
  party: PartyInfo | null
}

export function MissionDashboardClient({ missions, progress, courseId, locale, userId, party }: Props) {
  const t = useTranslations('mission')
  const [view, setView] = useState<'map' | 'timeline'>('map')

  const progressMap = new Map(progress.map(p => [p.mission_id, p]))
  const normalMissions = missions.filter(m => !m.is_hidden)
  const completedCount = normalMissions.filter(m => progressMap.get(m.id)?.status === 'completed').length
  const totalCount = normalMissions.length
  const lpEarned = progress.reduce((sum, p) => sum + (p.lp_earned || 0), 0)

  const firstIncomplete = normalMissions.find(m => progressMap.get(m.id)?.status !== 'completed')
  const nextMissionName = firstIncomplete
    ? (firstIncomplete.title[locale] || firstIncomplete.title.en || firstIncomplete.title.ko)
    : undefined

  return (
    <div className="space-y-6">
      {/* 원형 진행률 */}
      <MissionProgressRing
        completed={completedCount}
        total={totalCount}
        lpEarned={lpEarned}
        nextMissionName={nextMissionName}
      />

      {/* 뷰 토글 */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('map')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            view === 'map'
              ? 'bg-mint-deep text-white'
              : 'bg-cloud text-slate hover:bg-mist'
          }`}
        >
          🗺️ {t('dashboard.mapView')}
        </button>
        <button
          onClick={() => setView('timeline')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            view === 'timeline'
              ? 'bg-mint-deep text-white'
              : 'bg-cloud text-slate hover:bg-mist'
          }`}
        >
          📋 {t('dashboard.timelineView')}
        </button>
      </div>

      {/* 지도 뷰 */}
      {view === 'map' && (
        <MissionMapDashboard
          missions={missions}
          progress={progress.map(p => ({ mission_id: p.mission_id, status: p.status }))}
          courseId={courseId}
        />
      )}

      {/* 타임라인 뷰: view === 'timeline' 일 때 기존 타임라인이 표시됨 (page.tsx에서 제어) */}
      {view === 'timeline' && (
        <div id="timeline-view" />
      )}

      {/* 파티원 현황 */}
      {party && (
        <PartyMemberStatus
          partyId={party.id}
          members={party.members}
          totalMissions={totalCount}
          currentUserId={userId}
        />
      )}

      {/* 파티 채팅 */}
      {party && (
        <PartyChat partyId={party.id} userId={userId} />
      )}

      {/* 파티 미가입 안내 */}
      {!party && (
        <div className="bg-cloud rounded-2xl p-5 text-center border border-mist">
          <p className="text-sm text-slate mb-3">👥 {t('party.noParty')}</p>
        </div>
      )}
    </div>
  )
}
