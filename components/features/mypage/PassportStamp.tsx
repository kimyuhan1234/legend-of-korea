'use client'

import { Lock } from 'lucide-react'

interface Props {
  city: string
  emoji: string
  legendName: string
  isCompleted: boolean
  completedDate: string | null
  completedCount: number
  totalCount: number
  locale: string
  isAllCleared: boolean
}

const ROTATIONS = [-3, 2, -1, 3, -2, 1, -3, 2, -1]

const TEXTS: Record<string, { notCompleted: string; missions: string }> = {
  ko: { notCompleted: '미완료', missions: '미션' },
  en: { notCompleted: 'Not completed', missions: 'missions' },
  ja: { notCompleted: '未完了', missions: 'ミッション' },
  'zh-CN': { notCompleted: '未完成', missions: '任务' },
  'zh-TW': { notCompleted: '未完成', missions: '任務' },
}

export function PassportStamp({
  city,
  emoji,
  legendName,
  isCompleted,
  completedDate,
  completedCount,
  totalCount,
  locale,
  isAllCleared,
}: Props) {
  const tx = TEXTS[locale] ?? TEXTS.ko
  const rotation = ROTATIONS[city.length % ROTATIONS.length]

  if (!isCompleted) {
    return (
      <div className="aspect-square flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-3 opacity-60">
        <Lock size={18} className="text-slate-300 mb-1.5" />
        <p className="text-[10px] font-bold text-slate-300 text-center leading-tight">{city}</p>
        <p className="text-[9px] text-slate-300 mt-0.5">{tx.notCompleted}</p>
        <p className="text-[9px] text-slate-300">{completedCount}/{totalCount} {tx.missions}</p>
      </div>
    )
  }

  const dateStr = completedDate
    ? new Date(completedDate).toLocaleDateString(locale === 'ko' ? 'ko-KR' : locale === 'ja' ? 'ja-JP' : locale, {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : ''

  return (
    <div
      className={`aspect-square flex flex-col items-center justify-center rounded-2xl p-3 relative transition-transform hover:scale-105 ${
        isAllCleared
          ? 'border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 shadow-md shadow-amber-200/50'
          : 'border-2 border-red-300/70 bg-white shadow-sm'
      }`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <p className="text-[10px] font-black text-slate-500 mb-0.5 tracking-tight">{city}</p>
      <span className="text-2xl md:text-3xl mb-0.5">{emoji}</span>
      <p className="text-[9px] font-bold text-red-400/80 text-center leading-tight">{legendName}</p>
      {dateStr && (
        <p className="text-[8px] font-bold text-slate-400 mt-1">{dateStr}</p>
      )}
      <div className="absolute inset-0 rounded-2xl border border-red-300/30 pointer-events-none" style={{ margin: '3px' }} />
    </div>
  )
}
