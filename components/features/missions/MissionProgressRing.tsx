'use client'

import { useTranslations } from 'next-intl'

interface Props {
  completed: number
  total: number
  lpEarned: number
  nextMissionName?: string
}

export function MissionProgressRing({ completed, total, lpEarned, nextMissionName }: Props) {
  const t = useTranslations('mission')
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  const isAllClear = completed === total && total > 0
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl p-6 border border-mist">
      {/* SVG 원형 프로그레스 */}
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="8" />
          <circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={isAllClear ? '#F59E0B' : '#5BBDAD'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{isAllClear ? '👑' : '🎯'}</span>
          <span className={`text-lg font-black ${isAllClear ? 'text-amber-500' : 'text-mint-deep'}`}>
            {pct}%
          </span>
        </div>
      </div>

      {/* 텍스트 정보 */}
      <div className="text-center sm:text-left space-y-2">
        <p className="text-sm font-bold text-ink">
          🏆 {t('dashboard.completed', { n: completed, total })}
        </p>
        <p className="text-sm font-bold text-ink">
          ⚡ {t('dashboard.lpEarned', { n: lpEarned })}
        </p>
        {nextMissionName && !isAllClear && (
          <p className="text-sm text-slate">
            📍 {t('dashboard.nextMission', { name: nextMissionName })}
          </p>
        )}
        {isAllClear && (
          <p className="text-sm font-black text-amber-500">
            {t('celebrate.allClear')}
          </p>
        )}
      </div>
    </div>
  )
}
