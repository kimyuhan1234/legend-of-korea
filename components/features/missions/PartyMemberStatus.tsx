'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface Member {
  user_id: string
  nickname: string
  language: string
}

interface Props {
  partyId: string
  members: Member[]
  totalMissions: number
  currentUserId: string
}

const FLAG: Record<string, string> = {
  ko: '🇰🇷', ja: '🇯🇵', en: '🇺🇸', zh: '🇨🇳', fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸',
}

export function PartyMemberStatus({ partyId, members, totalMissions, currentUserId }: Props) {
  const t = useTranslations('mission')
  const [memberProgress, setMemberProgress] = useState<Record<string, number>>({})
  const [recentEvents, setRecentEvents] = useState<string[]>([])

  useEffect(() => {
    const supabase = createClient()

    // 초기 로드: 각 멤버의 완료 미션 수
    async function loadProgress() {
      const userIds = members.map(m => m.user_id)
      const { data } = await supabase
        .from('mission_progress')
        .select('user_id')
        .in('user_id', userIds)
        .eq('status', 'completed')

      if (data) {
        const counts: Record<string, number> = {}
        for (const row of data) {
          counts[row.user_id] = (counts[row.user_id] || 0) + 1
        }
        setMemberProgress(counts)
      }
    }

    loadProgress()

    // Realtime 구독: 파티원 미션 진행 변경 감지
    const memberIds = members.map(m => m.user_id)
    const channel = supabase
      .channel(`party-progress-${partyId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'mission_progress',
      }, (payload) => {
        const row = payload.new as { user_id: string; status: string }
        if (!memberIds.includes(row.user_id)) return

        if (row.status === 'completed') {
          setMemberProgress(prev => ({
            ...prev,
            [row.user_id]: (prev[row.user_id] || 0) + 1,
          }))
          const member = members.find(m => m.user_id === row.user_id)
          if (member) {
            setRecentEvents(prev => [
              `${member.nickname} completed a mission! 🎉`,
              ...prev.slice(0, 4),
            ])
          }
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [partyId, members])

  return (
    <div className="bg-white rounded-2xl border border-mist p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-ink">👥 {t('party.title')}</h3>
        <span className="text-xs font-bold text-mint-deep flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-mint-deep animate-pulse" />
          {t('party.live')}
        </span>
      </div>

      <div className="space-y-3">
        {members.map((m) => {
          const completed = memberProgress[m.user_id] || 0
          const pct = totalMissions > 0 ? Math.round((completed / totalMissions) * 100) : 0
          const isMe = m.user_id === currentUserId

          return (
            <div key={m.user_id} className="flex items-center gap-3">
              <span className="text-lg shrink-0">{FLAG[m.language] || '👤'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-ink truncate">
                    {isMe ? `👤 ${m.nickname}` : m.nickname}
                  </span>
                  <span className="text-xs text-slate shrink-0">{completed}/{totalMissions}</span>
                </div>
                <div className="h-2 bg-cloud rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-mint to-mint-deep transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 최근 이벤트 */}
      {recentEvents.length > 0 && (
        <div className="mt-4 pt-3 border-t border-mist space-y-1.5">
          {recentEvents.slice(0, 3).map((evt, i) => (
            <p key={i} className="text-xs text-slate">💬 {evt}</p>
          ))}
        </div>
      )}
    </div>
  )
}
