import { getFoodEmoji, type EmojiFoodLike } from '@/lib/data/food-emoji'

interface Props {
  food: EmojiFoodLike
  /** 텍스트 크기 Tailwind 클래스 — 기본 text-6xl */
  size?: string
  /** 컨테이너 추가 클래스 */
  className?: string
  /** 하단 구분선 표시 여부 (기본 true) */
  bordered?: boolean
}

/**
 * food-dupes 음식 카드용 썸네일.
 * Pexels API 이미지 불일치 문제로 이모지 + 흰 배경으로 통일.
 */
export function FoodEmojiThumb({ food, size = 'text-6xl', className = '', bordered = true }: Props) {
  return (
    <div
      className={`w-full h-full bg-white flex items-center justify-center ${bordered ? 'border-b border-mist' : ''} ${className}`}
      aria-hidden
    >
      <span className={`${size} select-none`}>{getFoodEmoji(food)}</span>
    </div>
  )
}
