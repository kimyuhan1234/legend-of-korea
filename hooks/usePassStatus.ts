'use client'

import { useState, useEffect } from 'react'

export interface PassStatus {
  authenticated: boolean
  passes: string[]
  hasAllInOne: boolean
  features: Record<string, boolean>
  creditsRemaining: number
}

// 모듈 수준 캐시 — 페이지 전환 시에도 유지, /api/passes/status 는 세션당 1회만 호출
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

  const hasPass = (passId: string): boolean => {
    if (!status) return false
    return status.hasAllInOne || status.passes.includes(passId)
  }

  const hasFeature = (featureId: string): boolean => {
    if (!status) return false
    return status.features?.[featureId] ?? false
  }

  return { status, loading, hasPass, hasFeature }
}

// 테스트·명시적 초기화용 (로그아웃 등)
export function invalidatePassStatusCache(): void {
  cachedStatus = null
  inFlight = null
}
