import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'

// hotfix: 'edge' 에서 ImageResponse 가 image/png 0 bytes silent fail 발생.
// Node runtime 으로 전환 — cold start 느리지만 verbose 에러 출력 + Vercel Hobby
// Edge function 환경 제약 회피 (10MB Variable TTF fetch / Satori 메모리).
export const runtime = 'nodejs'

// 🎯 ROOT CAUSE FIX: Next.js 가 /og 를 build-time static prerender 시도하면서
// request.url 호출 throw → catch 블록의 빈 redirect 응답이 정적 자산으로 캐시 →
// production 에서 image/png 0 bytes 반환되는 silent fail.
// 'force-dynamic' 으로 prerender 차단 — 매 요청마다 동적 실행 보장.
export const dynamic = 'force-dynamic'

/**
 * P3B-1: 동적 OG 이미지 생성 라우트.
 * P3B-hotfix: 진단 로그 + 폰트 fetch fail-safe + ImageResponse 실패 시
 * 정적 폴백 redirect.
 *
 * URL 파라미터:
 *   - title (필수): 메인 타이틀
 *   - subtitle (선택): 서브타이틀
 *   - tier (선택): 'strong' | 'strong-stay' | 'soft' | 'plain' (기본 'soft')
 *   - category (선택): 우상단 배지 라벨 (예: 'STAY', 'OOTD')
 *   - imageUrl (선택): 배경 합성 이미지 절대 경로 (예: '/images/category-stay.png')
 *
 * 폰트: Noto Sans KR Bold — fontsource jsdelivr CDN.
 *  실패 시 폰트 없이 진행 (한글 깨짐 가능, 라우트는 작동).
 *
 * 전체 실패 시: /images/dokkaebi-hero.png 정적 이미지로 307 redirect.
 *  → SNS 공유 / 메타 OG 가 항상 무언가 노출 (사용자 신뢰도 보호).
 */

const TIER_GRADIENTS: Record<string, string> = {
  strong: 'linear-gradient(135deg, #B8E8E0 0%, #E8C8D8 50%, #F5D0D0 100%)',
  'strong-stay': 'linear-gradient(to bottom right, #B8E8E0 0%, #F5D0D0 100%)',
  soft: 'linear-gradient(135deg, #D4F0EB 0%, #FFFFFF 100%)',
  plain: '#FFFFFF',
}

// Google Fonts 의 Noto Sans KR Variable TTF — 10.4 MB, 모든 weight 포함.
// Satori 가 woff2 미지원 (Unsupported OpenType signature wOF2 에러) 해서 TTF 필수.
// fetch.cache='force-cache' 로 Edge Network 가 캐싱 — cold start 외엔 빠름.
const NOTO_SANS_KR_TTF_REMOTE =
  'https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf'

// 사용자가 직접 추가 가능한 로컬 자산 (선택). 있으면 1 순위 — 빠르고 안정적.
const NOTO_SANS_KR_TTF_LOCAL = '/fonts/NotoSansKR-Bold.ttf'

const FALLBACK_IMAGE_PATH = '/images/dokkaebi-hero.png'

/**
 * 폰트 로딩 다중 폴백:
 *   1. public/fonts/NotoSansKR-Bold.ttf (사용자 호스팅) — 빠름
 *   2. GitHub raw Noto Sans KR Variable TTF — 10MB, Edge cache 후 빠름
 *   3. null 반환 — sans-serif 폴백 (한글 깨짐 가능)
 */
async function loadFont(req: NextRequest): Promise<ArrayBuffer | null> {
  // 1. 로컬 정적 자산 시도 (사용자가 public/fonts/ 에 추가했을 경우)
  try {
    const localUrl = new URL(NOTO_SANS_KR_TTF_LOCAL, req.url)
    const res = await fetch(localUrl, { cache: 'force-cache' })
    if (res.ok) return await res.arrayBuffer()
  } catch {
    // 무시 — 다음 폴백 시도
  }

  // 2. GitHub raw Variable TTF (안정 동작 보장)
  try {
    const res = await fetch(NOTO_SANS_KR_TTF_REMOTE, { cache: 'force-cache' })
    if (!res.ok) {
      console.error(`[og] GitHub TTF fetch HTTP ${res.status}`)
      return null
    }
    return await res.arrayBuffer()
  } catch (err) {
    console.error('[og] GitHub TTF fetch threw:', err)
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams, origin } = new URL(req.url)

    const title = searchParams.get('title') || 'Cloud with you'
    const subtitle = searchParams.get('subtitle') || ''
    const tierKey = searchParams.get('tier') || 'soft'
    const tier = tierKey in TIER_GRADIENTS ? tierKey : 'soft'
    const category = searchParams.get('category') || ''
    const imagePath = searchParams.get('imageUrl') || ''

    const fontData = await loadFont(req)
    const imageUrl = imagePath ? new URL(imagePath, origin).toString() : null

    const imageOptions: ConstructorParameters<typeof ImageResponse>[1] = {
      width: 1200,
      height: 630,
    }
    if (fontData) {
      imageOptions.fonts = [
        { name: 'Noto Sans KR', data: fontData, style: 'normal', weight: 700 },
      ]
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 80,
            background: TIER_GRADIENTS[tier],
            fontFamily: fontData ? 'Noto Sans KR' : 'sans-serif',
            position: 'relative',
          }}
        >
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.5,
              }}
            />
          )}

          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 80,
              right: 80,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {category ? (
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#1F2937',
                  background: '#FFFFFF',
                  padding: '10px 22px',
                  borderRadius: 9999,
                  letterSpacing: 2,
                  display: 'flex',
                }}
              >
                {category}
              </div>
            ) : (
              <div style={{ display: 'flex' }} />
            )}
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: '#1F2937',
                letterSpacing: 1.5,
                display: 'flex',
              }}
            >
              Cloud with you
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.92)',
              padding: 44,
              borderRadius: 28,
              maxWidth: 940,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: '#1F2937',
                lineHeight: 1.15,
                marginBottom: subtitle ? 16 : 0,
                display: 'flex',
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#4B5563',
                  lineHeight: 1.4,
                  display: 'flex',
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        </div>
      ),
      imageOptions,
    )
  } catch (err) {
    // ImageResponse 자체가 throw 한 경우 (Satori 렌더 실패 / 메모리 부족 등)
    // → 정적 OG 이미지로 redirect. SNS / 검색엔진 메타 미리보기는 끊기지 않음.
    console.error('[og] ImageResponse failed:', err)
    const fallbackUrl = new URL(FALLBACK_IMAGE_PATH, req.url)
    return NextResponse.redirect(fallbackUrl, 307)
  }
}
