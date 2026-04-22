'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ActionKey = 'refresh' | 'tag'
type Status = 'idle' | 'running' | 'success' | 'error'

interface Result {
  status: Status
  message: string
  detail?: string
}

const INITIAL: Record<ActionKey, Result> = {
  refresh: { status: 'idle', message: '' },
  tag: { status: 'idle', message: '' },
}

export function TourStaysActions() {
  const router = useRouter()
  const [results, setResults] = useState<Record<ActionKey, Result>>(INITIAL)

  const setState = (key: ActionKey, r: Result) =>
    setResults((prev) => ({ ...prev, [key]: r }))

  const run = async (key: ActionKey, url: string, okMessage: (json: unknown) => string) => {
    setState(key, { status: 'running', message: '실행 중…' })
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        const errMsg = typeof json === 'object' && json && 'error' in json ? String((json as { error: unknown }).error) : `HTTP ${res.status}`
        setState(key, { status: 'error', message: '실패', detail: errMsg })
        return
      }
      setState(key, { status: 'success', message: okMessage(json), detail: JSON.stringify(json, null, 2).slice(0, 400) })
      // 캐시 통계 갱신을 위해 서버 데이터 refresh
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setState(key, { status: 'error', message: '네트워크 오류', detail: msg })
    }
  }

  const onRefresh = () =>
    run('refresh', '/api/tour-stays/refresh', (j) => {
      const data = j as { totalStays?: number; successCount?: number; totalAreas?: number }
      return `전국 재수집 완료 — ${data.successCount ?? '?'}/${data.totalAreas ?? '?'} 지역, 총 ${data.totalStays ?? '?'}개 숙소`
    })

  const onTag = () =>
    run('tag', '/api/tour-stays/tag', (j) => {
      const data = j as { tagged?: number; skipped?: number; failed?: number; total?: number }
      return `태그 완료 — 신규 ${data.tagged ?? 0}, 스킵 ${data.skipped ?? 0}, 실패 ${data.failed ?? 0} / 총 ${data.total ?? 0}`
    })

  return (
    <div className="rounded-2xl border border-mist bg-white p-5 space-y-4">
      <div>
        <h2 className="text-base font-black text-[#111]">운영 액션</h2>
        <p className="text-xs text-stone mt-0.5">
          TourAPI 재수집은 1분 이상, 태그 부여는 30초 내외 소요됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 전국 재수집 */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={results.refresh.status === 'running'}
          className="text-left rounded-xl border border-mist hover:border-mint-deep transition-colors p-4 disabled:opacity-60 disabled:cursor-wait"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-black text-[#111]">🔄 전국 재수집</span>
            <StatusBadge status={results.refresh.status} />
          </div>
          <p className="text-xs text-stone">17개 광역 병렬 호출 (동시 5개 제한)</p>
          {results.refresh.message && (
            <p className={`text-xs font-bold mt-2 ${results.refresh.status === 'error' ? 'text-red-600' : 'text-mint-deep'}`}>
              {results.refresh.message}
            </p>
          )}
          {results.refresh.detail && results.refresh.status === 'error' && (
            <p className="text-[10px] text-red-500 mt-1 font-mono break-all">{results.refresh.detail}</p>
          )}
        </button>

        {/* 일괄 태그 */}
        <button
          type="button"
          onClick={onTag}
          disabled={results.tag.status === 'running'}
          className="text-left rounded-xl border border-mist hover:border-blossom-deep transition-colors p-4 disabled:opacity-60 disabled:cursor-wait"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-black text-[#111]">🏷️ 일괄 태그 부여</span>
            <StatusBadge status={results.tag.status} />
          </div>
          <p className="text-xs text-stone">태그 없는 숙소에만 9축 태그 자동 부여</p>
          {results.tag.message && (
            <p className={`text-xs font-bold mt-2 ${results.tag.status === 'error' ? 'text-red-600' : 'text-blossom-deep'}`}>
              {results.tag.message}
            </p>
          )}
          {results.tag.detail && results.tag.status === 'error' && (
            <p className="text-[10px] text-red-500 mt-1 font-mono break-all">{results.tag.detail}</p>
          )}
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const style: Record<Status, string> = {
    idle: 'bg-cloud text-stone',
    running: 'bg-mint-light text-mint-deep animate-pulse',
    success: 'bg-emerald-100 text-emerald-700',
    error: 'bg-red-100 text-red-700',
  }
  const label: Record<Status, string> = {
    idle: '대기',
    running: '진행중',
    success: '성공',
    error: '실패',
  }
  return (
    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${style[status]}`}>
      {label[status]}
    </span>
  )
}
