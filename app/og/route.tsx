import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

/**
 * P3B-1: 동적 OG 이미지 생성 라우트.
 *
 * URL 파라미터:
 *   - title (필수): 메인 타이틀
 *   - subtitle (선택): 서브타이틀
 *   - tier (선택): 'strong' | 'strong-stay' | 'soft' | 'plain' (기본 'soft')
 *   - category (선택): 우상단 배지 라벨 (예: 'STAY', 'OOTD')
 *   - imageUrl (선택): 배경 합성 이미지 절대 경로 (예: '/images/category-stay.png')
 *
 * 폰트: Noto Sans KR Bold — Google Fonts (fontsource jsdelivr CDN).
 * 한국어 / 일본어 / 중국어 간체·번체 모두 한 폰트로 렌더링.
 *
 * Edge runtime 동작 — Vercel Edge cold start 시 폰트 fetch 1 회, 이후 캐시.
 */

const TIER_GRADIENTS: Record<string, string> = {
  // Phase 2 토큰 (P1-4 정의) 그대로 사용
  strong: 'linear-gradient(135deg, #B8E8E0 0%, #E8C8D8 50%, #F5D0D0 100%)',
  'strong-stay': 'linear-gradient(to bottom right, #B8E8E0 0%, #F5D0D0 100%)',
  soft: 'linear-gradient(135deg, #D4F0EB 0%, #FFFFFF 100%)',
  plain: '#FFFFFF',
}

// Noto Sans KR Bold (700) — fontsource jsdelivr CDN.
// 안정적 URL 패턴, 버전 영향 적음 (latest 사용 가능).
const NOTO_SANS_KR_BOLD =
  'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.0.16/files/noto-sans-kr-korean-700-normal.woff2'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)

  const title = searchParams.get('title') || 'Cloud with you'
  const subtitle = searchParams.get('subtitle') || ''
  const tierKey = searchParams.get('tier') || 'soft'
  const tier = tierKey in TIER_GRADIENTS ? tierKey : 'soft'
  const category = searchParams.get('category') || ''
  const imagePath = searchParams.get('imageUrl') || ''

  // 폰트 fetch (Edge cold start 1 회)
  const fontData = await fetch(NOTO_SANS_KR_BOLD).then((res) => res.arrayBuffer())

  // 이미지 절대 URL 변환 — ImageResponse 가 절대 URL 만 허용
  const imageUrl = imagePath ? new URL(imagePath, origin).toString() : null

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
          fontFamily: 'Noto Sans KR',
          position: 'relative',
        }}
      >
        {/* 배경 이미지 (옵션) — Satori 엔진 요구사항으로 next/image 미사용 (HTML <img> 만 지원) */}
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

        {/* 헤더 — 카테고리 배지 + 브랜드 */}
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

        {/* 메인 카드 */}
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
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans KR',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  )
}
