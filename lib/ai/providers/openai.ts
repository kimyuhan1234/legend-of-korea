// ─────────────────────────────────────────────
//  lib/ai/providers/openai.ts
//  OpenAI 프로바이더 (스텁)
//
//  ⚠️ 배포 전까지 실제 호출하지 않음.
//  실제 활성화 시:
//  1. pnpm add openai
//  2. process.env.OPENAI_API_KEY 설정
//  3. AI_CURATION_ENABLED=true 설정
//  4. 아래 callOpenAI 함수의 주석을 해제
// ─────────────────────────────────────────────

import { SYSTEM_PROMPT, buildUserPrompt } from '../planner-prompt'
import type { AiCurateRequest, AiCurateResponse, AiProviderClient } from './types'
import { getAiConfig } from '../config'

async function callOpenAI(_req: AiCurateRequest): Promise<AiCurateResponse> {
  // ⚠️ STUB — 배포 시 아래 코드의 주석 해제 후 사용
  //
  // const cfg = getAiConfig()
  // const { default: OpenAI } = await import('openai')
  // const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  //
  // const completion = await client.chat.completions.create({
  //   model: cfg.model,
  //   messages: [
  //     { role: 'system', content: SYSTEM_PROMPT },
  //     { role: 'user', content: buildUserPrompt(_req) },
  //   ],
  //   max_tokens: cfg.maxTokens,
  //   temperature: cfg.temperature,
  //   response_format: { type: 'json_object' },
  // })
  //
  // const raw = completion.choices[0]?.message?.content ?? '{}'
  // const parsed = JSON.parse(raw)
  // return { success: true, schedule: parsed.schedule }
  //
  // 임시 사용을 막기 위한 명시적 미구현 응답
  void SYSTEM_PROMPT
  void buildUserPrompt
  void getAiConfig
  return { success: false, error: 'OpenAI provider is stubbed (not yet enabled)' }
}

export const openaiProvider: AiProviderClient = {
  name: 'openai',
  curate: callOpenAI,
}
