'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Lock } from 'lucide-react'
import { AVATAR_PLACEHOLDER_SRC } from '@/lib/avatar/resolve'
import { AvatarSelectModal } from '@/components/features/mypage/AvatarSelectModal'
import type { AvatarCategory, AvatarImage } from '@/lib/avatar/data'

interface Props {
  locale: string
  currentLevel: number
  selectedImageId: string | null
  categories: AvatarCategory[]
  images: AvatarImage[]
}

/**
 * v2 성장 지도 — 10 레벨 단일 경로 카드 그리드.
 * 각 카드: 카테고리명 + 대표 이미지 (placeholder fallback) + 잠금/해금 표시.
 * 해금 카드 클릭 → AvatarSelectModal.
 */
export function AvatarUnlockMap({ locale, currentLevel, selectedImageId, categories, images }: Props) {
  const t = useTranslations('avatar')
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-snow">
      {/* 헤더 */}
      <div className="bg-tier-soft text-ink py-12 md:py-16 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-2">{t('title')}</h1>
        <p className="text-slate">{t('subtitle')}</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* 현재 레벨 표시 */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-deep text-white font-black text-sm">
            {t('level')} {currentLevel}
          </span>
        </div>

        {/* 10 레벨 그리드 (모바일 2-col / 데스크톱 5-col) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((cat) => {
            const isUnlocked = currentLevel >= cat.level_required
            const filename = cat.default_filename
            const imgSrc = filename && filename !== 'placeholder.svg'
              ? `/images/avatar/${cat.slug}/${filename}`
              : AVATAR_PLACEHOLDER_SRC
            const categoryName = t(`category.${cat.slug}` as never)

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => isUnlocked && setModalOpen(true)}
                disabled={!isUnlocked}
                className={`group block relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 text-left ${
                  isUnlocked
                    ? 'bg-white border-mint hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                    : 'bg-cloud border-mist cursor-not-allowed opacity-70'
                }`}
              >
                {/* 상단: 정사각 이미지 */}
                <div className="relative aspect-square">
                  <Image
                    src={imgSrc}
                    alt={categoryName}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className={`object-cover transition-transform duration-300 ${
                      isUnlocked ? 'group-hover:scale-105' : 'grayscale'
                    }`}
                  />
                  {/* 레벨 배지 — 좌상단 */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-black text-ink shadow-sm">
                    Lv {cat.level_required}
                  </span>
                  {/* 잠금 오버레이 */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white drop-shadow" aria-hidden />
                    </div>
                  )}
                </div>

                {/* 하단: 카테고리명 + 잠금 안내 */}
                <div className="p-2.5 md:p-3">
                  <p className="text-sm font-bold text-ink leading-snug truncate">
                    {categoryName}
                  </p>
                  <p className={`text-[11px] mt-0.5 font-bold ${isUnlocked ? 'text-mint-deep' : 'text-stone'}`}>
                    {isUnlocked
                      ? t('unlocked')
                      : t('unlockHint', { n: cat.level_required })}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* 빈 카탈로그 안내 (057 미적용 환경) */}
        {categories.length === 0 && (
          <div className="text-center py-12 text-sm text-stone">
            {/* 운영자 안내용 — 사용자에겐 거의 노출되지 않음 (057 적용 + flag v2 동시 활성 가정) */}
            Avatar catalog not configured. Apply 057_avatar_unlock_system.sql.
          </div>
        )}
      </div>

      {/* 사진 선택 모달 */}
      {modalOpen && (
        <AvatarSelectModal
          locale={locale}
          currentLevel={currentLevel}
          selectedImageId={selectedImageId}
          categories={categories}
          images={images}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
