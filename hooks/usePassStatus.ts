'use client'

import { useEffect, useState } from 'react'
import type { PassType } from '@/lib/data/passes'

export interface ActivePassClient {
  id: string
  type: PassType
  expiresAt: string
  durationDays: 7 | 15 | 30
}

export interface PassStatus {
  authenticated: boolean
  activePass: ActivePassClient | null
}

// 모듈 수준 캐시 — 페이지 전환 시 재호출 방지 (세션당 1 회)
let cachedStatus: PassStatus | null = null
let inFlight: Promise<PassStatus | null> | null = null

async function fetchPassStatus(): Promise<PassStatus | null> {
  if (cachedStatus) return cachedStatus
  if (inFlight) return inFlight

  inFlight = (async () => {
    try {
      const res = await fetch('/api/passes/status')
      if (!res.ok) return null
      const data = (await res.json()) as PassStatus
      cachedStatus = data
      return data
    } catch {
      return null
    } finally {
      inFlight = null
    }
  })()

  return inFlight
}

/**
 * PRD-PRICING-2026-001: 클라이언트 패스 상태 hook.
 *
 * 사용처:
 *   const { activePass, hasPass, loading } = usePassStatus()
 *   if (!hasPass) return <LockScreen type="kfood_dupe_match" />
 *
 * 서버 컴포넌트에서는 lib/auth/pass.ts 의 getActivePass / hasActivePass
 * 직접 호출 (round-trip 0).
 */
export function usePassStatus() {
  const [status, setStatus] = useState<PassStatus | null>(cachedStatus)
  const [loading, setLoading] = useState<boolean>(!cachedStatus)

  useEffect(() => {
    if (cachedStatus) {
      setStatus(cachedStatus)
      setLoading(false)
      return
    }
    let mounted = true
    fetchPassStatus()
      .then((data) => {
        if (mounted && data) setStatus(data)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return {
    activePass: status?.activePass ?? null,
    hasPass: status?.activePass !== null && status?.activePass !== undefined,
    authenticated: status?.authenticated ?? false,
    loading,
  }
}

/** 로그아웃 / 패스 구매 직후 캐시 무효화 */
export function invalidatePassStatusCache(): void {
  cachedStatus = null
  inFlight = null
}
