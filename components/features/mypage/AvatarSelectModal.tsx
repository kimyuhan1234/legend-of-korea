'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { X, Lock, Loader2, Check } from 'lucide-react'
import { AVATAR_PLACEHOLDER_SRC } from '@/lib/avatar/resolve'
import { toast } from '@/components/ui/use-toast'
import type { AvatarCategory, AvatarImage } from '@/lib/avatar/data'

interface Props {
  locale: string
  currentLevel: number
  selectedImageId: string | null
  categories: AvatarCategory[]
  images: AvatarImage[]
  onClose: () => void
}

/**
 * 카테고리 10개 세로 스크롤. 해금된 카테고리만 사진 그리드 클릭 활성.
 * 사진 클릭 → POST /api/avatar/select → 성공 시 router.refresh().
 */
export function AvatarSelectModal({
  locale: _locale,
  currentLevel,
  selectedImageId,
  categories,
  images,
  onClose,
}: Props) {
  const t = useTranslations('avatar')
  const router = useRouter()
  const [savingId, setSavingId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(selectedImageId)

  const imagesByCategory = new Map<string, AvatarImage[]>()
  for (const img of images) {
    const list = imagesByCategory.get(img.category_id) ?? []
    list.push(img)
    imagesByCategory.set(img.category_id, list)
  }

  const handleSelect = async (image: AvatarImage, categoryUnlocked: boolean) => {
    if (!categoryUnlocked || savingId) return
    setSavingId(image.id)
    try {
      const res = await fetch('/api/avatar/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: image.id }),
      })
      if (res.ok) {
        setActiveId(image.id)
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        toast({ variant: 'destructive', title: data.error || 'Failed' })
      }
    } catch {
      toast({ variant: 'destructive', title: 'Failed' })
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('selectImage')}
      className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-mist">
          <h2 className="font-black text-ink text-lg">{t('selectImage')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-stone hover:bg-cloud hover:text-ink transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 카테고리 세로 스크롤 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {categories.map((cat) => {
            const unlocked = currentLevel >= cat.level_required
            const catImages = imagesByCategory.get(cat.id) ?? []
            const catName = t(`category.${cat.slug}` as never)

            return (
              <section key={cat.id}>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    unlocked
                      ? 'bg-mint-light text-mint-deep'
                      : 'bg-cloud text-stone'
                  }`}>
                    Lv {cat.level_required}
                  </span>
                  <h3 className={`font-bold text-base ${unlocked ? 'text-ink' : 'text-stone'}`}>
                    {catName}
                  </h3>
                  {!unlocked && <Lock className="w-3.5 h-3.5 text-stone" aria-hidden />}
                </div>

                {!unlocked ? (
                  <p className="text-xs text-stone font-bold pl-1">
                    {t('unlockHint', { n: cat.level_required })}
                  </p>
                ) : catImages.length === 0 ? (
                  <p className="text-xs text-stone pl-1">
                    {/* 카테고리에 사진 0장 (운영자가 업로드 전) */}
                    —
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {catImages.map((img) => {
                      const isActive = activeId === img.id
                      const isSaving = savingId === img.id
                      const imgSrc = img.filename === 'placeholder.svg'
                        ? AVATAR_PLACEHOLDER_SRC
                        : `/images/avatar/${cat.slug}/${img.filename}`

                      return (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => handleSelect(img, unlocked)}
                          disabled={isSaving}
                          className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            isActive
                              ? 'border-mint-deep ring-2 ring-mint-deep/30'
                              : 'border-mist hover:border-mint'
                          } ${isSaving ? 'opacity-60 cursor-wait' : ''}`}
                        >
                          <Image
                            src={imgSrc}
                            alt={catName}
                            fill
                            sizes="(max-width: 640px) 33vw, 25vw"
                            className="object-cover"
                          />
                          {isActive && (
                            <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-mint-deep text-white flex items-center justify-center shadow">
                              <Check className="w-3 h-3" aria-hidden />
                            </span>
                          )}
                          {isSaving && (
                            <span className="absolute inset-0 bg-white/60 flex items-center justify-center">
                              <Loader2 className="w-5 h-5 animate-spin text-mint-deep" />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
