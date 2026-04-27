'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, Flame, Map, Clock, Camera, CheckCircle2, Sparkles, Trophy } from 'lucide-react'
import Image from 'next/image'
import { MissionProgressRing } from './MissionProgressRing'
import { ProfileBadges } from '@/components/features/mypage/ProfileBadges'

interface Stats {
  total: number
  completed: number
  inProgress: number
  totalLp: number
  streak: number
  lpToNextTier: number
}

interface RecentItem {
  missionId: string
  missionTitle: Record<string, string>
  missionType: string
  courseTitle: Record<string, string>
  completedAt: string
  lpEarned: number
  photoUrl: string | null
}

interface NextTier {
  level: number
  name: Record<string, string>
  min_lp: number
}

interface Props {
  userId: string
  locale: string
}

function timeAgo(dateStr: string, locale: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const labels: Record<string, { just: string; mins: string; hrs: string; days: string }> = {
    ko: { just: '방금 전', mins: '분 전', hrs: '시간 전', days: '일 전' },
    en: { just: 'just now', mins: 'm ago', hrs: 'h ago', days: 'd ago' },
    ja: { just: 'たった今', mins: '分前', hrs: '時間前', days: '日前' },
    'zh-CN': { just: '刚刚', mins: '分钟前', hrs: '小时前', days: '天前' },
    'zh-TW': { just: '剛剛', mins: '分鐘前', hrs: '小時前', days: '天前' },
  }
  const lx = labels[locale] ?? labels.ko

  if (days >= 1) return `${days}${lx.days}`
  if (hours >= 1) return `${hours}${lx.hrs}`
  if (minutes >= 1) return `${minutes}${lx.mins}`
  return lx.just
}

function getI18n(field: Record<string, string> | null | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

const RAINDROPS_LABEL: Record<string, string> = {
  ko: '빗방울',
  ja: 'しずく',
  en: 'Raindrops',
  'zh-CN': '雨滴',
  'zh-TW': '雨滴',
}

function raindrops(locale: string): string {
  return RAINDROPS_LABEL[locale] ?? RAINDROPS_LABEL.ko
}

function missionTypeIcon(type: string): string {
  return type === 'boss' ? '👑' : type === 'hidden' ? '⭐' : type === 'photo' ? '📸' : type === 'open' ? '✍️' : '❓'
}

export function MissionDashboard({ userId, locale }: Props) {
  const t = useTranslations('mission')
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentItem[]>([])
  const [nextTier, setNextTier] = useState<NextTier | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'map' | 'timeline'>('map')

  useEffect(() => {
    fetch('/api/missions/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats)
        setRecent(data.recentCompleted || [])
        setNextTier(data.nextTier)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center py-10 text-slate-500 font-bold">{t('dashboard.loadError')}</div>
  }

  return (
    <div className="space-y-6">
      {/* 헤더 + 스트릭 */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-black text-[#111]">
          🎮 {t('dashboard.title')}
        </h3>
        {stats.streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border border-amber-300">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-black text-amber-700">
              {t('dashboard.streak', { n: stats.streak })}
            </span>
          </div>
        )}
      </div>

      {/* 통계 카드 4개 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 text-center border border-cloud">
          <div className="text-2xl mb-1">📋</div>
          <p className="text-[10px] font-bold text-stone uppercase">{t('dashboard.labelTotal')}</p>
          <p className="text-2xl font-black text-[#111]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center border border-cloud">
          <div className="text-2xl mb-1">🏆</div>
          <p className="text-[10px] font-bold text-stone uppercase">{t('dashboard.labelDone')}</p>
          <p className="text-2xl font-black text-mint-deep">{stats.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-mint-deep to-sky rounded-2xl p-4 text-center text-white">
          <div className="text-2xl mb-1">⚡</div>
          <p className="text-[10px] font-bold uppercase opacity-80">{t('dashboard.labelLp')}</p>
          <p className="text-2xl font-black">{stats.totalLp.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center border border-cloud">
          <div className="text-2xl mb-1">🎯</div>
          <p className="text-[10px] font-bold text-stone uppercase">{t('dashboard.labelInProgress')}</p>
          <p className="text-2xl font-black text-[#111]">{stats.inProgress}</p>
        </div>
      </div>

      {/* 원형 진행률 + 다음 티어 */}
      <MissionProgressRing
        completed={stats.completed}
        total={stats.total}
        lpEarned={stats.totalLp}
        nextMissionName={nextTier ? `${getI18n(nextTier.name, locale)} (+${stats.lpToNextTier.toLocaleString()} ${raindrops(locale)})` : undefined}
      />

      {/* 뷰 토글 */}
      <div className="flex gap-2 border-b border-slate-100">
        <button
          onClick={() => setView('map')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold text-sm transition-colors border-b-2 ${
            view === 'map' ? 'border-mint-deep text-mint-deep' : 'border-transparent text-slate-500 hover:text-slate-600'
          }`}
        >
          <Map className="w-4 h-4" /> {t('dashboard.mapView')}
        </button>
        <button
          onClick={() => setView('timeline')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold text-sm transition-colors border-b-2 ${
            view === 'timeline' ? 'border-mint-deep text-mint-deep' : 'border-transparent text-slate-500 hover:text-slate-600'
          }`}
        >
          <Clock className="w-4 h-4" /> {t('dashboard.timeline')}
        </button>
      </div>

      {/* 지도뷰: ProfileBadges 재사용 (9도시 진행률) */}
      {view === 'map' && <ProfileBadges userId={userId} />}

      {/* 타임라인뷰: 최근 활동 */}
      {view === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h4 className="text-sm font-black text-slate-700 mb-4">{t('dashboard.recentActivity')}</h4>
          {recent.length === 0 ? (
            <div className="text-center py-10 text-sm text-slate-500 font-bold">
              {t('dashboard.noRecentActivity')}
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((item) => {
                const isBoss = item.missionType === 'boss'
                const isHidden = item.missionType === 'hidden'
                return (
                  <div
                    key={item.missionId}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    {item.photoUrl ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                        <Image src={item.photoUrl} alt="" width={48} height={48} className="object-cover w-full h-full" unoptimized />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center bg-gradient-to-br from-mint to-blossom text-xl">
                        {missionTypeIcon(item.missionType)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {isBoss && <Trophy className="inline w-3 h-3 text-amber-500 mr-1" />}
                        {isHidden && <Sparkles className="inline w-3 h-3 text-violet-500 mr-1" />}
                        {getI18n(item.missionTitle, locale)}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {getI18n(item.courseTitle, locale)} · {timeAgo(item.completedAt, locale)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-mint-deep" />
                      <span className="text-sm font-black text-mint-deep">+{item.lpEarned} 빗방울</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 커뮤니티 자동 공유 안내 */}
      <div className="bg-gradient-to-r from-sky/10 to-mint/10 border border-sky/30 rounded-2xl p-4 flex items-center gap-3">
        <Camera className="w-5 h-5 text-sky flex-shrink-0" />
        <p className="text-xs text-slate-600 leading-relaxed">
          <span className="font-black text-sky">✨ {t('dashboard.autoShareTitle')}</span>
          <span className="block mt-0.5">{t('dashboard.autoShareDesc')}</span>
        </p>
      </div>
    </div>
  )
}
