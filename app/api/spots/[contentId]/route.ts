import { NextRequest, NextResponse } from 'next/server'
import { fetchSpotDetail } from '@/lib/tour-api/client'
import { sanitizeTourHTML } from '@/lib/tour-api/sanitize'

export const revalidate = 86400

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'
const LOCALES: readonly Locale[] = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW']

interface Params { params: { contentId: string } }

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { contentId } = params
    const sp = req.nextUrl.searchParams
    const contentTypeId = sp.get('contentTypeId') || ''
    const rawLocale = sp.get('locale')
    const locale: Locale = LOCALES.includes(rawLocale as Locale) ? (rawLocale as Locale) : 'ko'

    if (!contentId || !contentTypeId) {
      return NextResponse.json(
        { error: 'contentId and contentTypeId required', common: null, intro: null },
        { status: 400 },
      )
    }

    const detail = await fetchSpotDetail(contentId, contentTypeId, locale)

    // overview/program HTML 필드는 서버에서 sanitize 후 전달 — 클라이언트가 dangerouslySetInnerHTML 로
    // 렌더하므로 XSS 방어는 서버에서 한 번 처리한다.
    if (detail.common?.overview) {
      detail.common.overview = sanitizeTourHTML(detail.common.overview)
    }
    if (detail.intro?.program) {
      detail.intro.program = sanitizeTourHTML(detail.intro.program)
    }
    if (detail.intro?.subevent) {
      detail.intro.subevent = sanitizeTourHTML(detail.intro.subevent)
    }

    if (!detail.common && !detail.intro) {
      return NextResponse.json(
        { common: null, intro: null, error: 'not_found' },
        { status: 404 },
      )
    }

    return NextResponse.json(detail)
  } catch (error) {
    console.error('Spot detail API error:', error)
    return NextResponse.json(
      { common: null, intro: null, error: 'internal_error' },
      { status: 500 },
    )
  }
}
