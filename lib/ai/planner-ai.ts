// ─────────────────────────────────────────────
//  lib/ai/planner-ai.ts
//  AI 큐레이션 Facade — 프로바이더 선택 + 실행
//
//  배포 전까지는 항상 { enabled: false }를 반환한다.
//  AI_CURATION_ENABLED=true 이고 API 키가 있으면 그때 활성화된다.
// ─────────────────────────────────────────────

import { getAiConfig } from './config'
import { openaiProvider } from './providers/openai'
import { anthropicProvider } from './providers/anthropic'
import type { AiCurateRequest, AiCurateResponse } from './providers/types'

export async function curatePlan(req: AiCurateRequest): Promise<AiCurateResponse> {
  const cfg = getAiConfig()

  if (!cfg.enabled) {
    return {
      success: false,
      error: 'AI curation is disabled. Set AI_CURATION_ENABLED=true to enable.',
    }
  }

  try {
    if (cfg.provider === 'anthropic') {
      return await anthropicProvider.curate(req)
    }
    if (cfg.provider === 'openai') {
      return await openaiProvider.curate(req)
    }
    return { success: false, error: 'Unknown provider' }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
