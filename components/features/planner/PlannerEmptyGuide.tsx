'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { emoji: '👗', label: 'OOTD' },
  { emoji: '🍜', label: 'K-Food' },
  { emoji: '🏯', label: 'STAY' },
  { emoji: '⚔️', label: 'Legend of Korea' },
  { emoji: '📍', label: 'SPOT' },
  { emoji: '🛍️', label: 'GOODS' },
  { emoji: '🏺', label: 'DIY' },
]

const CTA_LINKS = [
  { key: 'browseOotd', href: '/ootd', emoji: '👗' },
  { key: 'browseFood', href: '/food', emoji: '🍜' },
  { key: 'browseQuest', href: '/story', emoji: '⚔️' },
  { key: 'browseAll', href: '/', emoji: '🗺️' },
]

export function PlannerEmptyGuide() {
  const t = useTranslations('planner')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const [step, setStep] = useState(0)
  const [highlight, setHighlight] = useState(0)

  // 3초마다 단계 전환
  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % 3), 3000)
    return () => clearInterval(timer)
  }, [])

  // Step 1 에서 탭 아이콘 순차 반짝임
  useEffect(() => {
    if (step !== 0) return
    const timer = setInterval(() => setHighlight((h) => (h + 1) % TABS.length), 400)
    return () => clearInterval(timer)
  }, [step])

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 border border-mist text-center">
      {/* 애니메이션 영역 */}
      <div className="relative h-48 md:h-56 flex items-center justify-center overflow-hidden mb-6">
        {/* Step 1: 탭 둘러보기 */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-500"
          style={{
            opacity: step === 0 ? 1 : 0,
            transform: step === 0 ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {TABS.map((tab, i) => (
              <div
                key={tab.label}
                className="flex flex-col items-center gap-1 transition-all duration-300"
                style={{
                  transform: highlight === i ? 'scale(1.3)' : 'scale(1)',
                  opacity: highlight === i ? 1 : 0.4,
                }}
              >
                <span className="text-3xl md:text-4xl">{tab.emoji}</span>
                <span className="text-[9px] font-bold text-stone">{tab.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: 담기 버튼 */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-500"
          style={{
            opacity: step === 1 ? 1 : 0,
            transform: step === 1 ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div className="bg-snow rounded-2xl border border-mist p-5 w-56 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-mint-light flex items-center justify-center text-xl">🍜</div>
              <div className="text-left">
                <p className="text-xs font-bold text-ink">콩나물국밥</p>
                <p className="text-[10px] text-stone">전주</p>
              </div>
            </div>
            <div
              className="px-4 py-2 rounded-full text-xs font-bold text-center transition-all duration-700"
              style={{
                backgroundColor: step === 1 ? '#D4F0EB' : '#9DD8CE',
                color: step === 1 ? '#1F2937' : '#fff',
              }}
            >
              {step === 1 ? '담김 ✓' : '+ 플래너에 담기'}
            </div>
          </div>
        </div>

        {/* Step 3: 타임라인 완성 */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-500"
          style={{
            opacity: step === 2 ? 1 : 0,
            transform: step === 2 ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div className="space-y-2 w-56">
            {['Day 1', 'Day 2', 'Day 3'].map((day, i) => (
              <div
                key={day}
                className="flex items-center gap-3 transition-all duration-500"
                style={{
                  opacity: step === 2 ? 1 : 0,
                  transform: step === 2 ? 'translateX(0)' : 'translateX(-20px)',
                  transitionDelay: `${i * 200}ms`,
                }}
              >
                <div className="w-8 h-8 rounded-full bg-mint-deep text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 h-8 bg-mint-light rounded-lg flex items-center px-3">
                  <span className="text-[10px] font-bold text-mint-deep">{day}</span>
                  <span className="ml-auto text-[10px] text-stone">
                    {['🍜🏯', '⚔️🏺', '📍👗'][i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 인디케이터 */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === step ? 'bg-mint-deep' : 'bg-mist'
            }`}
            aria-label={`Step ${i + 1}`}
          />
        ))}
      </div>

      {/* 단계 텍스트 */}
      <p className="text-base font-bold text-ink mb-6 h-6">
        {step === 0 && t('guide.step1')}
        {step === 1 && t('guide.step2')}
        {step === 2 && t('guide.step3')}
      </p>

      {/* CTA 버튼 그리드 */}
      <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
        {CTA_LINKS.map((link) => (
          <Link
            key={link.key}
            href={`/${locale}${link.href}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-mint-light text-mint-deep border border-mint text-xs font-bold hover:bg-mint hover:text-white transition-colors"
          >
            <span>{link.emoji}</span>
            {t(`guide.${link.key}` as Parameters<typeof t>[0]) as string}
          </Link>
        ))}
      </div>
    </div>
  )
}
