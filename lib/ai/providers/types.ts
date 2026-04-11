// ─────────────────────────────────────────────
//  lib/ai/providers/types.ts
//  AI 프로바이더 공통 인터페이스
// ─────────────────────────────────────────────

export interface CuratedItem {
  planItemId: string
  timeSlot: 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'night'
  orderInSlot: number
  reason?: string
}

export interface CuratedSchedule {
  day: number
  items: CuratedItem[]
  tips?: string[]
}

export interface AiCurateRequest {
  cityId: string
  cityName: string
  hasMissionKit: boolean
  items: Array<{
    id: string
    type: string
    name: string
    meta?: Record<string, unknown>
  }>
}

export interface AiCurateResponse {
  success: boolean
  schedule?: CuratedSchedule[]
  error?: string
}

export interface AiProviderClient {
  name: 'openai' | 'anthropic'
  curate(req: AiCurateRequest): Promise<AiCurateResponse>
}
