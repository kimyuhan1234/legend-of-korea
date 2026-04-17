'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Lock, CheckCircle2, Sparkles, Trophy, PlayCircle } from 'lucide-react'

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
}

interface Props {
  missions: Mission[]
  progress: Progress[]
  courseId: string
}

export function MissionMapDashboard({ missions, progress, courseId }: Props) {
  const t = useTranslations('mission')
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const progressMap = new Map(progress.map(p => [p.mission_id, p.status]))

  const firstIncomplete = missions.find(
    m => !m.is_hidden && progressMap.get(m.id) !== 'completed'
  )

  const handleClick = (m: Mission) => {
    const status = progressMap.get(m.id) || 'locked'
    const isCurrent = firstIncomplete?.id === m.id

    if (status === 'completed' || isCurrent || m.is_hidden) {
      router.push(`/${locale}/missions/${courseId}/${m.id}`)
    }
  }

  const visibleMissions = missions.filter(m => {
    const status = progressMap.get(m.id) || 'locked'
    if (m.is_hidden && status === 'locked') return false
    return true
  })

  return (
    <div className="bg-white rounded-2xl border border-mist p-5 md:p-7">
      {/* 범례 */}
      <div className="flex flex-wrap gap-4 text-xs text-slate mb-6">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400" /> {t('dashboard.completed', { n: '', total: '' }).replace('/', '').trim() || '완료'}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-mint-deep animate-pulse" /> {t('party.inProgress')}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-stone/40" /> {t('dashboard.locked')}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-400" /> {t('celebrate.hidden')}</span>
      </div>

      {/* 미션 맵 — 지그재그 그리드 */}
      <div className="grid grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
        {visibleMissions.map((m) => {
          const status = progressMap.get(m.id) || 'locked'
          const isCompleted = status === 'completed'
          const isCurrent = firstIncomplete?.id === m.id
          const isLocked = !isCompleted && !isCurrent && !m.is_hidden
          const isBoss = m.type === 'boss'
          const isHidden = m.is_hidden

          let bg = 'bg-stone/10 border-stone/20 cursor-not-allowed'
          let icon = <Lock size={16} className="text-stone/50" />

          if (isCompleted) {
            bg = 'bg-amber-50 border-amber-300 cursor-pointer hover:scale-105'
            icon = <CheckCircle2 size={16} className="text-amber-500" />
          } else if (isCurrent) {
            bg = 'bg-mint-deep/10 border-mint-deep cursor-pointer hover:scale-105 mission-pulse'
            icon = <PlayCircle size={16} className="text-mint-deep" />
          } else if (isHidden) {
            bg = 'bg-violet-50 border-violet-300 cursor-pointer hover:scale-105'
            icon = <Sparkles size={16} className="text-violet-500" />
          }

          return (
            <button
              key={m.id}
              onClick={() => handleClick(m)}
              disabled={isLocked}
              className={`relative flex flex-col items-center gap-1.5 p-3 md:p-4 rounded-xl border-2 transition-all duration-200 ${bg}`}
            >
              {/* 노드 */}
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg font-black ${
                isCompleted ? 'bg-amber-400 text-white' :
                isCurrent ? 'bg-mint-deep text-white' :
                isHidden ? 'bg-violet-400 text-white' :
                'bg-stone/20 text-stone/50'
              }`}>
                {isBoss ? <Trophy size={18} /> : isHidden ? '⭐' : m.sequence}
              </div>

              {/* 상태 아이콘 */}
              <div className="flex items-center gap-1">
                {icon}
              </div>

              {/* LP */}
              <span className={`text-[10px] font-bold ${isCompleted ? 'text-amber-600' : 'text-stone/50'}`}>
                +{m.lp_reward} LP
              </span>
            </button>
          )
        })}
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <style jsx>{`
        @keyframes missionPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(91,189,173,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(91,189,173,0); }
        }
        .mission-pulse { animation: missionPulse 2s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
