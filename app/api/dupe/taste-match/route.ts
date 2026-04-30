import { NextResponse } from 'next/server'

// Phase 11 — food-dupes 데이터 진위 점검 + 농촌진흥청 OpenAPI 통합 준비.
// /food/dupe page 가 stub 된 동안 외부 fetch 누수 차단.

export async function POST() {
  return NextResponse.json(
    {
      error: 'Service temporarily unavailable',
      message: 'This endpoint is being redesigned in Phase 11.',
    },
    { status: 503 },
  )
}

export async function GET() {
  return NextResponse.json(
    { error: 'Service temporarily unavailable' },
    { status: 503 },
  )
}
