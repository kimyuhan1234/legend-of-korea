import { NextResponse } from 'next/server'
import { PASSES, ALLINONE_SAVINGS } from '@/lib/data/passes'
import { CREDIT_PACKS, CREDIT_COSTS, LP_TO_CREDIT_RATE } from '@/lib/data/credit-packs'

// 정적 패스 메타데이터 반환 — DB의 UUID 대신 plan_type(id) 기반
// 이유: 5개 로케일 텍스트는 코드에 두는 편이 번역·검수 흐름이 간단함
export async function GET() {
  return NextResponse.json({
    passes: PASSES,
    allinoneSavings: ALLINONE_SAVINGS,
    creditPacks: CREDIT_PACKS,
    creditCosts: CREDIT_COSTS,
    lpExchangeRate: LP_TO_CREDIT_RATE,
  })
}
