/**
 * 메모리 Map 기반 슬라이딩 윈도우 Rate Limiter.
 *
 * Vercel serverless는 인스턴스가 분산되므로 "인스턴스당 카운트"만 보장.
 * 전역 정확도가 필요하면 docs/RATE_LIMIT_UPGRADE.md 참고하여 Upstash로 교체.
 *
 * Edge Runtime 호환 (fs/path/node:crypto 미사용).
 */

export interface RateLimitOptions {
  /** 윈도우 길이 (ms) */
  windowMs: number
  /** 윈도우 내 최대 허용 요청 수 */
  max: number
}

export interface RateLimitResult {
  ok: boolean
  remaining: number
  /** 초 단위 — 다음 허용까지 대기 시간 (ok=true면 0) */
  retryAfter: number
}

// key → 최근 요청 타임스탬프 배열. module-scope라 동일 인스턴스 내에서 공유.
const buckets = new Map<string, number[]>()

// 확률적 GC용 카운터
let requestsSinceGc = 0

export function checkRateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const windowStart = now - opts.windowMs
  const existing = buckets.get(key) ?? []

  // 윈도우 밖 타임스탬프 제거
  const recent: number[] = []
  for (const t of existing) {
    if (t > windowStart) recent.push(t)
  }

  if (recent.length >= opts.max) {
    // 오래된 타임스탬프가 만료되면 다시 허용 → 그때까지 대기
    const oldest = recent[0]
    const retryAfter = Math.max(1, Math.ceil((oldest + opts.windowMs - now) / 1000))
    buckets.set(key, recent)
    return { ok: false, remaining: 0, retryAfter }
  }

  recent.push(now)
  buckets.set(key, recent)

  // 1% 확률로 만료 엔트리 일괄 GC (Map 무한 증가 방지)
  requestsSinceGc++
  if (requestsSinceGc % 100 === 0) {
    const toDelete: string[] = []
    const toUpdate: [string, number[]][] = []
    buckets.forEach((v, k) => {
      const filtered: number[] = []
      for (const t of v) if (t > windowStart) filtered.push(t)
      if (filtered.length === 0) toDelete.push(k)
      else if (filtered.length !== v.length) toUpdate.push([k, filtered])
    })
    for (const k of toDelete) buckets.delete(k)
    for (const [k, v] of toUpdate) buckets.set(k, v)
  }

  return { ok: true, remaining: opts.max - recent.length, retryAfter: 0 }
}
