import { createServiceClient } from '@/lib/supabase/server'
import { fetchStaysByArea, type NormalizedStay } from './stays'

export interface StaysCacheResult {
  stays: NormalizedStay[]
  source: 'cache' | 'tourapi' | 'stale-cache' | 'empty'
  count: number
  /** TourAPI 실패 원인 등 진단 */
  note?: string
}

interface CacheRow {
  data: NormalizedStay
}

const CACHE_TTL_HOURS = 24

/**
 * Read-through 캐싱:
 * 1) tour_stays_cache에서 유효 캐시(expires_at > now) 조회
 * 2) 있으면 반환 (source: 'cache')
 * 3) 없으면 TourAPI 호출 → upsert → 반환 (source: 'tourapi')
 * 4) TourAPI 실패 시 만료된 캐시라도 있으면 반환 (source: 'stale-cache')
 */
export async function getStaysWithCache(areaCode: number): Promise<StaysCacheResult> {
  const areaKey = String(areaCode)
  const supabase = await createServiceClient()

  // 1) 유효 캐시 조회
  const nowIso = new Date().toISOString()
  const { data: fresh, error: freshErr } = await supabase
    .from('tour_stays_cache')
    .select('data')
    .eq('area_code', areaKey)
    .gt('expires_at', nowIso)
    .returns<CacheRow[]>()

  if (!freshErr && fresh && fresh.length > 0) {
    console.log(`[StaysCache] Cache hit for area ${areaCode} (${fresh.length} items)`)
    return {
      stays: fresh.map((r) => r.data),
      source: 'cache',
      count: fresh.length,
    }
  }

  // 2) Cache miss → TourAPI
  console.log(`[StaysCache] Cache miss for area ${areaCode}, fetching from TourAPI`)
  const result = await fetchStaysByArea(areaCode, { numOfRows: 100 })

  if (result.resultCode === '0000' && result.stays.length > 0) {
    // 3) Upsert
    const nowDate = new Date()
    const expiresAt = new Date(nowDate.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000)
    const rows = result.stays.map((s) => ({
      id: s.id,
      data: s,
      area_code: areaKey,
      stay_type: s.stayType,
      cached_at: nowDate.toISOString(),
      expires_at: expiresAt.toISOString(),
    }))

    const { error: upsertErr } = await supabase
      .from('tour_stays_cache')
      .upsert(rows, { onConflict: 'id' })

    if (upsertErr) {
      console.error(`[StaysCache] Upsert failed for area ${areaCode}: ${upsertErr.message}`)
    } else {
      console.log(`[StaysCache] Cached ${rows.length} items for area ${areaCode}`)
    }

    return {
      stays: result.stays,
      source: 'tourapi',
      count: result.stays.length,
    }
  }

  // 4) TourAPI 실패 → stale cache fallback
  const { data: stale } = await supabase
    .from('tour_stays_cache')
    .select('data')
    .eq('area_code', areaKey)
    .returns<CacheRow[]>()

  if (stale && stale.length > 0) {
    console.warn(`[StaysCache] TourAPI failed, returning stale cache for area ${areaCode}`)
    return {
      stays: stale.map((r) => r.data),
      source: 'stale-cache',
      count: stale.length,
      note: `TourAPI ${result.resultCode}: ${result.resultMsg}`,
    }
  }

  return {
    stays: [],
    source: 'empty',
    count: 0,
    note: `TourAPI ${result.resultCode}: ${result.resultMsg}`,
  }
}

export interface RefreshAreaResult {
  count: number
  cached: boolean
  error?: string
}

/**
 * 단일 지역 강제 재조회 + 캐시 갱신.
 * refresh 엔드포인트에서 사용.
 */
export async function refreshAreaCache(areaCode: number): Promise<RefreshAreaResult> {
  const result = await fetchStaysByArea(areaCode, { numOfRows: 100 })

  if (result.resultCode !== '0000') {
    return {
      count: 0,
      cached: false,
      error: `${result.resultCode}: ${result.resultMsg}`,
    }
  }

  if (result.stays.length === 0) {
    return { count: 0, cached: false, error: 'No stays returned' }
  }

  const supabase = await createServiceClient()
  const nowDate = new Date()
  const expiresAt = new Date(nowDate.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000)
  const rows = result.stays.map((s) => ({
    id: s.id,
    data: s,
    area_code: String(areaCode),
    stay_type: s.stayType,
    cached_at: nowDate.toISOString(),
    expires_at: expiresAt.toISOString(),
  }))

  const { error } = await supabase
    .from('tour_stays_cache')
    .upsert(rows, { onConflict: 'id' })

  if (error) {
    console.error(`[StaysCache] Refresh upsert failed for area ${areaCode}: ${error.message}`)
    return { count: 0, cached: false, error: error.message }
  }

  console.log(`[StaysCache] Refreshed ${rows.length} items for area ${areaCode}`)
  return { count: rows.length, cached: true }
}
