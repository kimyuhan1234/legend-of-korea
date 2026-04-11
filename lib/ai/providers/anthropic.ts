// ─────────────────────────────────────────────
//  lib/ai/providers/anthropic.ts
//  Anthropic Claude 프로바이더 (스텁)
//
//  ⚠️ 배포 전까지 실제 호출하지 않음.
//  실제 활성화 시:
//  1. pnpm add @anthropic-ai/sdk
//  2. process.env.ANTHROPIC_API_KEY 설정
//  3. AI_CURATION_ENABLED=true 설정
//  4. 아래 callAnthropic 함수의 주석을 해제
// ─────────────────────────────────────────────

import { SYSTEM_PROMPT, buildUserPrompt } from '../planner-prompt'
import type { AiCurateRequest, AiCurateResponse, AiProviderClient } from './types'
import { getAiConfig } from '../config'

async function callAnthropic(_req: AiCurateRequest): Promise<AiCurateResponse> {
  // ⚠️ STUB — 배포 시 아래 코드의 주석 해제 후 사용
  //
  // const cfg = getAiConfig()
  // const { default: Anthropic } = await import('@anthropic-ai/sdk')
  // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  //
  // const message = await client.messages.create({
  //   model: cfg.model,
  //   max_tokens: cfg.maxTokens,
  //   temperature: cfg.temperature,
  //   system: SYSTEM_PROMPT,
  //   messages: [{ role: 'user', content: buildUserPrompt(_req) }],
  // })
  //
  // const block = message.content[0]
  // const text = block.type === 'text' ? block.text : '{}'
  // // Claude 응답은 가끔 markdown fence를 포함 → 정제
  // const jsonText = text.replace(/^```json\s*/, '').replace(/\s*```$/, '')
  // const parsed = JSON.parse(jsonText)
  // return { success: true, schedule: parsed.schedule }
  //
  // 임시 사용을 막기 위한 명시적 미구현 응답
  void SYSTEM_PROMPT
  void buildUserPrompt
  void getAiConfig
  return { success: false, error: 'Anthropic provider is stubbed (not yet enabled)' }
}

export const anthropicProvider: AiProviderClient = {
  name: 'anthropic',
  curate: callAnthropic,
}
