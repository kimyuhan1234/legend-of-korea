'use client'

import type { SVGProps } from 'react'

interface RaindropIconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number | string
  variant?: 'fill' | 'outline'
}

/**
 * P2-1: 빗방울 (Raindrop) 브랜드 아이콘.
 *
 * 기존에 분산되어 있던 💧 / 🌧️ 이모지 사용처를 단일 SVG 컴포넌트로 통일.
 * 시각 정체성 강화 + 시스템 폰트별 이모지 외형 차이 제거.
 *
 * 색상은 currentColor 사용 — 부모 className 의 text-* 토큰으로 제어.
 *   <RaindropIcon size={24} className="text-mint-deep" />
 *   <RaindropIcon size={32} className="text-blossom-deep" variant="outline" />
 *
 * lib/data 의 prose (미션 가이드 본문 등) 안 이모지는 PRD-2A 결정에 따라
 * 자연스러운 텍스트로 유지 — 이 컴포넌트는 UI chrome 전용.
 */
export function RaindropIcon({
  size = 24,
  variant = 'fill',
  className,
  ...rest
}: RaindropIconProps) {
  const isFill = variant === 'fill'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={isFill ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" />
    </svg>
  )
}
