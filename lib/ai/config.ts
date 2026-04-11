// ─────────────────────────────────────────────
//  lib/ai/config.ts
//  AI 큐레이션 기능 플래그 + 프로바이더 선택
//
//  ⚠️ 배포 전 주의사항:
//  - 배포 전까지 AI_CURATION_ENABLED는 false 유지 (비용 발생 방지)
//  - 실제 활성화는 배포 직전에 env로만 켜는 구조
//  - 활성화 시 OPENAI_API_KEY 또는 ANTHROPIC_API_KEY 중 하나 필요
// ─────────────────────────────────────────────

export type AiProvider = 'openai' | 'anthropic' | 'disabled'

export interface AiConfig {
  enabled: boolean
  provider: AiProvider
  model: string
  maxTokens: number
  temperature: number
}

export function getAiConfig(): AiConfig {
  const enabled = process.env.AI_CURATION_ENABLED === 'true'

  if (!enabled) {
    return {
      enabled: false,
      provider: 'disabled',
      model: '',
      maxTokens: 0,
      temperature: 0,
    }
  }

  // 우선순위: Anthropic > OpenAI
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      enabled: true,
      provider: 'anthropic',
      model: process.env.AI_MODEL || 'claude-haiku-4-5-20251001',
      maxTokens: 2000,
      temperature: 0.4,
    }
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      enabled: true,
      provider: 'openai',
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      maxTokens: 2000,
      temperature: 0.4,
    }
  }

  // 플래그는 켜져 있는데 API 키가 없음 → 비활성화 상태로 안전 fallback
  return {
    enabled: false,
    provider: 'disabled',
    model: '',
    maxTokens: 0,
    temperature: 0,
  }
}
