'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'
import { AVATAR_PLACEHOLDER_SRC } from '@/lib/avatar/resolve'

interface Props {
  newLevel: number
  unlockedCategorySlug: string
  /** 카테고리 default 사진 path — placeholder fallback 가능 */
  categoryDefaultFilename?: string | null
  onClose: () => void
  onChangeAvatar: () => void
}

/**
 * 레벨업 직후 1회 노출되는 알림 모달.
 *  - scale-up + fade-in 등장 (200ms)
 *  - 해금된 카테고리 사진 + 카테고리명 강조
 *  - CTA: "아바타 변경하기" → AvatarSelectModal 열기
 *  - "나중에" → 닫기
 *
 * 1회 노출 보장: sessionStorage 의 lok_avatar_level_up_pending 키를 LegendShop 이 set,
 * MyPageClient 가 read 후 즉시 clear → 같은 레벨업으로 재노출 X.
 */
export function LevelUpModal({
  newLevel,
  unlockedCategorySlug,
  categoryDefaultFilename,
  onClose,
  onChangeAvatar,
}: Props) {
  const t = useTranslations('avatar')
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    // 다음 frame 에 animateIn=true 로 설정 → CSS transition 트리거
    const id = requestAnimationFrame(() => setAnimateIn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const categoryName = t(`category.${unlockedCategorySlug}` as never)
  const imgSrc = categoryDefaultFilename && categoryDefaultFilename !== 'placeholder.svg'
    ? `/images/avatar/${unlockedCategorySlug}/${categoryDefaultFilename}`
    : AVATAR_PLACEHOLDER_SRC

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-title"
      className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden transition-all duration-200 ease-out ${
          animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* 헤더 — 그라데이션 + sparkles */}
        <div className="relative bg-gradient-to-br from-mint-deep via-mint to-blossom px-6 py-8 text-center text-white">
          <Sparkles className="absolute top-4 left-4 w-5 h-5 opacity-60 animate-pulse" aria-hidden />
          <Sparkles className="absolute top-6 right-6 w-4 h-4 opacity-40 animate-pulse" aria-hidden />
          <Sparkles className="absolute bottom-3 right-10 w-3 h-3 opacity-50 animate-pulse" aria-hidden />
          <h2 id="level-up-title" className="text-xl md:text-2xl font-black drop-shadow">
            {t('levelUp.title', { n: newLevel })}
          </h2>
        </div>

        {/* 카테고리 사진 — 잠금 해제 transition */}
        <div className="px-6 pt-6 pb-2">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-cloud border-2 border-mint mx-auto max-w-[220px]">
            <Image
              src={imgSrc}
              alt={categoryName}
              fill
              sizes="220px"
              className={`object-cover transition-all duration-700 ease-out ${
                animateIn ? 'grayscale-0 scale-100' : 'grayscale scale-110'
              }`}
            />
          </div>
          <p className="text-center mt-3 text-base font-bold text-ink">
            {categoryName}
          </p>
          <p className="text-center text-sm text-stone mt-1 leading-relaxed">
            {t('levelUp.body', { category: categoryName })}
          </p>
        </div>

        {/* CTA */}
        <div className="p-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onChangeAvatar}
            className="w-full py-3 rounded-xl bg-mint-deep text-white font-black text-sm hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            {t('levelUp.cta')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-stone font-bold text-sm hover:bg-cloud transition"
          >
            {t('levelUp.later')}
          </button>
        </div>
      </div>
    </div>
  )
}
