import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
// /og 와 동일 사유 — build-time prerender 차단.
export const dynamic = 'force-dynamic'

/**
 * /og/diag — /og 라우트 진단 endpoint.
 *
 * production 에서 OG 이미지 0 bytes 응답 root cause 추적용.
 * 다음 항목을 차례로 검증해 JSON 으로 보고:
 *
 *   1. GitHub Variable TTF fetch — 도달 가능 여부 + 크기 + 소요 시간
 *   2. 로컬 정적 자산 (public/fonts/NotoSansKR-Bold.ttf) — 사용자 호스팅 여부
 *   3. next/og import — 모듈 로드 가능 여부
 *
 * 배포 후 https://legend-of-korea.vercel.app/og/diag 직접 접근 → 결과 JSON 확인.
 *
 * 진단 후 본 endpoint 는 제거 또는 비공개 처리 권장.
 */

interface DiagResult {
  runtime: string
  timestamp: string
  githubTtf: unknown
  localTtf: unknown
  nextOgImport: unknown
}

export async function GET(req: NextRequest) {
  const diag: DiagResult = {
    runtime: 'nodejs',
    timestamp: new Date().toISOString(),
    githubTtf: null,
    localTtf: null,
    nextOgImport: null,
  }

  // 1. GitHub Variable TTF fetch (현재 /og 의 2 순위 폰트 소스)
  try {
    const start = Date.now()
    const res = await fetch(
      'https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf',
      { cache: 'no-store' },
    )
    diag.githubTtf = {
      ok: res.ok,
      status: res.status,
      contentLength: res.headers.get('content-length'),
      contentType: res.headers.get('content-type'),
      elapsedMs: Date.now() - start,
    }
  } catch (err) {
    diag.githubTtf = { error: err instanceof Error ? err.message : String(err) }
  }

  // 2. 로컬 정적 자산 (사용자가 추가했다면)
  try {
    const localUrl = new URL('/fonts/NotoSansKR-Bold.ttf', req.url)
    const res = await fetch(localUrl, { cache: 'no-store' })
    diag.localTtf = {
      url: localUrl.toString(),
      ok: res.ok,
      status: res.status,
      contentLength: res.headers.get('content-length'),
    }
  } catch (err) {
    diag.localTtf = { error: err instanceof Error ? err.message : String(err) }
  }

  // 3. next/og import 가능 여부
  try {
    const mod = await import('next/og')
    diag.nextOgImport = { ok: !!mod.ImageResponse }
  } catch (err) {
    diag.nextOgImport = { error: err instanceof Error ? err.message : String(err) }
  }

  return Response.json(diag, {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  })
}
