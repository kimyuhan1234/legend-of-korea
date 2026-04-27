import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

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

const NOTO_SANS_KR_BOLD =
  'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.0.16/files/noto-sans-kr-korean-700-normal.woff2'

const FALLBACK_IMAGE_PATH = '/images/dokkaebi-hero.png'

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(NOTO_SANS_KR_BOLD)
    if (!res.ok) {
      console.error(`[og] Font fetch HTTP ${res.status}`)
      return null
    }
    return await res.arrayBuffer()
  } catch (err) {
    console.error('[og] Font fetch threw:', err)
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

    const fontData = await loadFont()
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
