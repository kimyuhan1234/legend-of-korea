'use client'

import { useEffect, useState } from 'react'

interface RankData {
  level: number
}

// 세션 단위 캐시 — 같은 userId 반복 조회 시 재요청 방지
const cache = new Map<string, RankData | null>()
const pending = new Map<string, Promise<RankData | null>>()

/**
 * 랭크 캐시 무효화 — 랭크업 등 current_level 이 바뀐 직후 호출.
 * userId 생략 시 전체 캐시 클리어.
 */
export function invalidateRankCache(userId?: string) {
  if (userId) {
    cache.delete(userId)
    pending.delete(userId)
  } else {
    cache.clear()
    pending.clear()
  }
}

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

interface Props {
  userId: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
  /**
   * 값이 바뀌면 useEffect 가 재실행되어 재조회.
   * 호출 측에서 invalidateRankCache(userId) 로 캐시를 비운 뒤 증가시키면 최신 데이터 보장.
   */
  refreshKey?: number | string
}

/**
 * 단순 레벨 뱃지. scholar/warrior 분기 폐기 (2026-05) 후 직책 이름/이모지 없음.
 * 'Lv N' 만 표시.
 */
export function RankBadge({ userId, size = 'md', showName: _showName = true, className = '', refreshKey }: Props) {
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
  }, [userId, refreshKey])

  if (!ready) {
    const h = size === 'sm' ? 'h-5 w-12' : size === 'lg' ? 'h-14 w-32' : 'h-6 w-16'
    return <span className={`inline-block animate-pulse rounded-full bg-slate-100 ${h} ${className}`} />
  }

  if (!rank) return null

  const baseColor = 'bg-mint-light text-mint-deep border-mint'

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black ${baseColor} ${className}`}>
        Lv {rank.level}
      </span>
    )
  }

  if (size === 'lg') {
    return (
      <div className={`rounded-2xl border-2 ${baseColor} ${className}`}>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest">Level</p>
            <p className="text-xl font-black tabular-nums">{rank.level}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-black ${baseColor} ${className}`}>
      Lv {rank.level}
    </span>
  )
}
