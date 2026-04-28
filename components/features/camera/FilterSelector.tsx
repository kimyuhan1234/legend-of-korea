'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { RETRO_FILTERS, FILTER_CATEGORIES, type FilterCategoryId } from '@/lib/camera/filters'
import { usePassStatus } from '@/hooks/usePassStatus'

interface Props {
  selectedFilter: string
  onSelect: (filterId: string) => void
  locale: string
}

type PassModalLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const LOCK_MODAL_TEXT: Record<PassModalLocale, { title: string; desc: string; cta: string; cancel: string }> = {
  ko: { title: '패스가 필요해요', desc: '이 필터를 사용하려면 Story 패스가 필요합니다', cta: '패스 보러가기', cancel: '닫기' },
  en: { title: 'Pass Required', desc: 'You need a Story pass to use this filter', cta: 'View Passes', cancel: 'Close' },
  ja: { title: 'パスが必要です', desc: 'このフィルターを使うにはStoryパスが必要です', cta: 'パスを見る', cancel: '閉じる' },
  'zh-CN': { title: '需要通行证', desc: '使用此滤镜需要Story通行证', cta: '查看通行证', cancel: '关闭' },
  'zh-TW': { title: '需要通行證', desc: '使用此濾鏡需要Story通行證', cta: '查看通行證', cancel: '關閉' },
}

export function FilterSelector({ selectedFilter, onSelect, locale }: Props) {
  const [category, setCategory] = useState<FilterCategoryId>('all')
  const [showLockModal, setShowLockModal] = useState(false)
  // PRD-PRICING-2026-001: 활성 패스 1 종 보유 시 모든 유료 콘텐츠 풀 액세스
  const { hasPass } = usePassStatus()
  const unlocked = hasPass

  const filtered = useMemo(() => {
    if (category === 'all') return RETRO_FILTERS
    // 'original' 은 모든 카테고리에서 첫 번째로 노출 (필터 없음 옵션)
    const original = RETRO_FILTERS.find((f) => f.id === 'original')
    const rest = RETRO_FILTERS.filter((f) => f.category === category && f.id !== 'original')
    return original ? [original, ...rest] : rest
  }, [category])

  const handleFilterClick = (id: string) => {
    if (id !== 'original' && !unlocked) {
      setShowLockModal(true)
      return
    }
    onSelect(id)
  }

  const modalText = LOCK_MODAL_TEXT[locale as PassModalLocale] ?? LOCK_MODAL_TEXT.en

  return (
    <div className="space-y-2">
      {/* 카테고리 탭 — 가로 스크롤 */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2">
        {FILTER_CATEGORIES.map((cat) => {
          const isActive = category === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-mint-deep text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name?.[locale] ?? cat.name?.ko ?? ''}</span>
            </button>
          )
        })}
      </div>

      {/* 필터 목록 — 가로 스크롤 */}
      <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
        <div className="flex gap-2 min-w-max py-1">
          {filtered.map((f) => {
            const isActive = f.id === selectedFilter
            const locked = f.id !== 'original' && !unlocked
            return (
              <button
                key={f.id}
                onClick={() => handleFilterClick(f.id)}
                className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all shrink-0 ${
                  isActive
                    ? 'bg-mint-deep/10 border-2 border-mint-deep scale-105'
                    : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                } ${locked ? 'opacity-55' : ''}`}
                aria-label={locked ? 'Locked' : undefined}
              >
                {locked && (
                  <span className="absolute top-1 right-1 bg-slate-600 text-white rounded-full p-0.5">
                    <Lock className="w-2.5 h-2.5" />
                  </span>
                )}
                <span className="text-xl">{f.icon}</span>
                <span
                  className={`text-[10px] font-bold whitespace-nowrap ${
                    isActive ? 'text-mint-deep' : 'text-slate-500'
                  }`}
                >
                  {f.name?.[locale] ?? f.name?.ko ?? ''}
                </span>
                {isActive && (
                  <span className="text-[8px] font-black text-mint-deep leading-none">
                    &#10003;
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 잠금 모달 */}
      {showLockModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50"
          onClick={() => setShowLockModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <span className="text-4xl mb-2 block">🎫</span>
              <h3 className="font-black text-slate-800 text-lg">{modalText.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{modalText.desc}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLockModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                {modalText.cancel}
              </button>
              <Link
                href={`/${locale}/pass/story`}
                onClick={() => setShowLockModal(false)}
                className="flex-1 py-2.5 bg-gradient-to-br from-mint to-blossom text-ink rounded-xl font-black text-sm text-center hover:opacity-90 transition-opacity"
              >
                {modalText.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
