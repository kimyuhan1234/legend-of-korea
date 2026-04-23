'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type BadgeLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

interface RankData {
  level: number
  route: string | null
  names: Record<BadgeLocale, string> | null
  emoji: string
  isSpecial: boolean
  needsBranchSelection: boolean
}

// 세션 단위 캐시 — 같은 userId 반복 조회 시 재요청 방지
const cache = new Map<string, RankData | null>()
const pending = new Map<string, Promise<RankData | null>>()

async function fetchRank(userId: string): Promise<RankData | null> {
  if (cache.has(userId)) return cache.get(userId) ?? null
  let p = pending.get(userId)
  if (!p) {
    p = fetch(`/api/user/rank?userId=${encodeURIComponent(userId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        cache.set(userId, data)
        return data
      })
      .catch(() => null)
      .finally(() => {
        pending.delete(userId)
      })
    pending.set(userId, p)
  }
  return p
}

function routeColor(route: string | null, level: number): string {
  if (level <= 3 || route === null) return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  if (route === 'scholar') return 'bg-blue-100 text-blue-700 border-blue-200'
  if (route === 'warrior') return 'bg-red-100 text-red-700 border-red-200'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

interface Props {
  userId: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

export function RankBadge({ userId, size = 'md', showName = true, className = '' }: Props) {
  const pathname = usePathname()
  const locale = (pathname.split('/')[1] || 'ko') as BadgeLocale
  const [rank, setRank] = useState<RankData | null>(() => cache.get(userId) ?? null)
  const [ready, setReady] = useState<boolean>(cache.has(userId))

  useEffect(() => {
    let mounted = true
    fetchRank(userId).then((data) => {
      if (mounted) {
        setRank(data)
        setReady(true)
      }
    })
    return () => {
      mounted = false
    }
  }, [userId])

  if (!ready) {
    const h = size === 'sm' ? 'h-5 w-16' : size === 'lg' ? 'h-14 w-40' : 'h-6 w-20'
    return <span className={`inline-block animate-pulse rounded-full bg-slate-100 ${h} ${className}`} />
  }

  if (!rank) return null

  const name = rank.names?.[locale] ?? rank.names?.en ?? ''
  const specialRing = rank.isSpecial ? ' ring-2 ring-yellow-300 ring-offset-1' : ''

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black ${routeColor(rank.route, rank.level)}${specialRing} ${className}`}>
        <span>{rank.emoji}</span>
        {showName && name && <span className="truncate max-w-[80px]">{name}</span>}
      </span>
    )
  }

  if (size === 'lg') {
    // 대시보드·프로필 카드용 — 카드 형태
    return (
      <div className={`rounded-2xl border-2 ${routeColor(rank.route, rank.level)}${specialRing} ${className}`}>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-4xl">{rank.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest">
              Lv {rank.level} · {rank.route === 'common' ? 'Common' : rank.route === 'scholar' ? 'Scholar' : rank.route === 'warrior' ? 'Warrior' : '—'}
            </p>
            {name && <p className="text-base font-black truncate">{name}</p>}
            {rank.isSpecial && <p className="text-[10px] font-black text-yellow-600 mt-0.5">✨ Special</p>}
          </div>
        </div>
      </div>
    )
  }

  // md (default) — 커뮤니티 닉네임 옆 표준 뱃지
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-black ${routeColor(rank.route, rank.level)}${specialRing} ${className}`}>
      <span>{rank.emoji}</span>
      {showName && name && <span>{name}</span>}
    </span>
  )
}
