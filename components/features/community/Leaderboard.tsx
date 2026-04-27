'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, Gift, Trophy } from 'lucide-react'
import { RankBadge } from '@/components/features/rank/RankBadge'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Props {
  locale: string
}

interface LeaderboardEntry {
  rank: number
  userId: string
  nickname: string
  avatarUrl: string | null
  level: number
  language: string
  monthlyLp: number
}

const FLAG: Record<string, string> = {
  ko: '\u{1F1F0}\u{1F1F7}',
  ja: '\u{1F1EF}\u{1F1F5}',
  en: '\u{1F1FA}\u{1F1F8}',
  'zh-CN': '\u{1F1E8}\u{1F1F3}',
  'zh-TW': '\u{1F1F9}\u{1F1FC}',
}

const MEDAL = ['', '\u{1F947}', '\u{1F948}', '\u{1F949}']

const PRIZES: Record<string, { first: string; second: string; third: string }> = {
  ko: { first: '캐릭터 달력 + 스티커 세트', second: '전래동화 다이어리', third: '캐릭터 스티커 팩' },
  en: { first: 'Character Calendar + Sticker Set', second: 'Folktale Diary', third: 'Character Sticker Pack' },
  ja: { first: 'キャラクターカレンダー＋ステッカーセット', second: '昔話ダイアリー', third: 'キャラクターステッカーパック' },
  'zh-CN': { first: '角色日历 + 贴纸套装', second: '民间故事日记本', third: '角色贴纸包' },
  'zh-TW': { first: '角色日曆 + 貼紙套裝', second: '民間故事日記本', third: '角色貼紙包' },
}

function getMonthLabel(year: number, month: number, locale: string): string {
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : locale === 'ja' ? 'ja-JP' : locale === 'zh-CN' ? 'zh-CN' : locale === 'zh-TW' ? 'zh-TW' : 'en-US',
    { year: 'numeric', month: 'long' },
  )
}

export function Leaderboard({ locale }: Props) {
  const t = useTranslations('community')

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null)
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    const monthStr = `${year}-${String(month).padStart(2, '0')}`
    fetch(`/api/lp/leaderboard?month=${monthStr}`)
      .then(r => r.json())
      .then(data => setEntries(data.leaderboard || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false))
  }, [year, month])

  const goPrev = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }
  const goNext = () => {
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1
    if (isCurrentMonth) return
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)

  const prizes = PRIZES[locale] ?? PRIZES.ko
  const rankLabels = [
    '',
    t('leaderboard.first'),
    t('leaderboard.second'),
    t('leaderboard.third'),
  ]

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <h2 className="flex items-center gap-2 text-lg font-black text-slate-800">
          <Trophy className="w-5 h-5 text-amber-500" />
          {t('leaderboard.title')}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>
          <span className="text-sm font-bold text-slate-600 min-w-[110px] text-center">
            {getMonthLabel(year, month, locale)}
          </span>
          <button
            onClick={goNext}
            disabled={isCurrentMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* 로딩 */}
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-16 rounded-2xl bg-slate-50 animate-pulse" />
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && entries.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <div className="text-4xl">🏔️</div>
            <p className="text-sm font-bold text-slate-500">{t('leaderboard.empty')}</p>
            <p className="text-xs text-slate-300">{t('leaderboard.challenge')}</p>
          </div>
        )}

        {/* TOP 3 */}
        {!loading && top3.map(entry => {
          const isMe = entry.userId === currentUserId
          const bgMap = ['', 'bg-amber-50 border-amber-300', 'bg-slate-50 border-slate-300', 'bg-orange-50 border-orange-300']

          return (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                isMe ? 'ring-2 ring-mint-deep/40 ' : ''
              }${bgMap[entry.rank] || ''}`}
            >
              <span className="text-2xl w-8 text-center flex-shrink-0">{MEDAL[entry.rank]}</span>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                {entry.avatarUrl ? (
                  <Image src={entry.avatarUrl} alt="" width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-black text-slate-500">
                    {entry.nickname[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-800 truncate">{entry.nickname}</span>
                  <span className="text-sm">{FLAG[entry.language] || ''}</span>
                  {isMe && (
                    <span className="text-[10px] font-black text-mint-deep bg-mint-deep/10 px-1.5 py-0.5 rounded">
                      {t('leaderboard.you')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <RankBadge userId={entry.userId} size="sm" />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-black text-slate-800">{entry.monthlyLp.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">빗방울</p>
              </div>
            </div>
          )
        })}

        {/* 4위 이하 */}
        {!loading && rest.length > 0 && (
          <div className="space-y-1.5 pt-2">
            {rest.map(entry => {
              const isMe = entry.userId === currentUserId
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                    isMe ? 'bg-mint-deep/5 border border-mint-deep/20' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="w-6 text-center font-black text-slate-500">{entry.rank}</span>
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                    {entry.avatarUrl ? (
                      <Image src={entry.avatarUrl} alt="" width={28} height={28} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-500">
                        {entry.nickname[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-slate-700 flex-1 truncate">
                    {entry.nickname}
                    <span className="ml-1.5 text-xs">{FLAG[entry.language] || ''}</span>
                  </span>
                  {isMe && (
                    <span className="text-[10px] font-black text-mint-deep">← {t('leaderboard.you')}</span>
                  )}
                  <span className="font-black text-slate-600">{entry.monthlyLp.toLocaleString()} <span className="text-[10px] text-slate-500">빗방울</span></span>
                </div>
              )
            })}
          </div>
        )}

        {/* 이달의 상품 */}
        {!loading && entries.length > 0 && (
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60">
            <h3 className="flex items-center gap-2 text-sm font-black text-amber-700 mb-3">
              <Gift className="w-4 h-4" />
              {t('leaderboard.prize')}
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-center gap-2 text-amber-800">
                <span className="font-black">{rankLabels[1]}:</span> {prizes.first}
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <span className="font-black">{rankLabels[2]}:</span> {prizes.second}
              </li>
              <li className="flex items-center gap-2 text-orange-700">
                <span className="font-black">{rankLabels[3]}:</span> {prizes.third}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
