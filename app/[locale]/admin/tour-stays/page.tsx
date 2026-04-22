export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { PROVINCE_AREA_CODES } from '@/lib/tour-api/area-codes'
import { TourStaysActions } from '@/components/features/admin/TourStaysActions'

interface Props {
  params: { locale: string }
}

interface CacheRow {
  id: string
  area_code: string
  stay_type: string | null
  cached_at: string
  expires_at: string
  data: { tags?: unknown } | null
}

async function loadCacheStats() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tour_stays_cache')
    .select('id, area_code, stay_type, cached_at, expires_at, data')
    .returns<CacheRow[]>()

  if (error || !data) {
    return {
      error: error?.message ?? 'No data',
      total: 0,
      tagged: 0,
      byArea: {} as Record<string, number>,
      lastCachedAt: null as string | null,
      oldestExpiresAt: null as string | null,
    }
  }

  const byArea: Record<string, number> = {}
  let tagged = 0
  let lastCachedAt: string | null = null
  let oldestExpiresAt: string | null = null

  for (const row of data) {
    byArea[row.area_code] = (byArea[row.area_code] ?? 0) + 1
    if (row.data?.tags) tagged += 1
    if (!lastCachedAt || row.cached_at > lastCachedAt) lastCachedAt = row.cached_at
    if (!oldestExpiresAt || row.expires_at < oldestExpiresAt) oldestExpiresAt = row.expires_at
  }

  return { error: null, total: data.length, tagged, byArea, lastCachedAt, oldestExpiresAt }
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function AdminTourStaysPage(_props: Props) {
  const stats = await loadCacheStats()
  const codeToName = Object.fromEntries(
    Object.values(PROVINCE_AREA_CODES).map((p) => [String(p.areaCode), p.nameKo])
  )

  const sortedAreas = Object.entries(stats.byArea)
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#111]">TourAPI 숙박 관리</h1>
        <p className="text-slate-500 text-sm mt-1">
          한국관광공사 TourAPI searchStay2 캐시 현황과 운영 액션
        </p>
      </div>

      {stats.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-700">캐시 조회 실패</p>
          <p className="text-xs text-red-600 mt-1">{stats.error}</p>
        </div>
      )}

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-mist bg-white p-5">
          <p className="text-xs font-bold text-stone uppercase tracking-wider">총 숙소</p>
          <p className="text-3xl font-black text-[#111] mt-2">{stats.total.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-mist bg-white p-5">
          <p className="text-xs font-bold text-stone uppercase tracking-wider">태그 완료</p>
          <p className="text-3xl font-black text-mint-deep mt-2">
            {stats.tagged.toLocaleString()}
            <span className="text-sm text-stone font-bold ml-2">
              / {stats.total.toLocaleString()}
            </span>
          </p>
          <p className="text-xs text-stone mt-1">
            {stats.total > 0 ? Math.round((stats.tagged / stats.total) * 100) : 0}% 완료
          </p>
        </div>
        <div className="rounded-2xl border border-mist bg-white p-5">
          <p className="text-xs font-bold text-stone uppercase tracking-wider">가장 오래된 만료일</p>
          <p className="text-lg font-black text-[#111] mt-2">{formatDate(stats.oldestExpiresAt)}</p>
          <p className="text-xs text-stone mt-1">마지막 수집: {formatDate(stats.lastCachedAt)}</p>
        </div>
      </div>

      {/* 액션 버튼 (클라이언트 컴포넌트) */}
      <TourStaysActions />

      {/* 지역별 표 */}
      <div className="rounded-2xl border border-mist bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-mist">
          <h2 className="text-base font-black text-[#111]">지역별 분포</h2>
          <p className="text-xs text-stone mt-0.5">17개 광역시도 기준</p>
        </div>
        <div className="divide-y divide-mist">
          {sortedAreas.length === 0 ? (
            <p className="p-8 text-center text-sm text-stone">
              캐시된 숙소가 없습니다. 위의 &quot;전국 재수집&quot; 버튼을 눌러 수집하세요.
            </p>
          ) : (
            sortedAreas.map(([code, count]) => (
              <div key={code} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-mint-light text-mint-deep text-xs font-black">
                    {code}
                  </span>
                  <span className="text-sm font-bold text-[#111]">
                    {codeToName[code] ?? `지역 ${code}`}
                  </span>
                </div>
                <span className="text-sm font-mono text-slate">{count.toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
