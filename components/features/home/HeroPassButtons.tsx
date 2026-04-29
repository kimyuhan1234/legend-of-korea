'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getVideoUrl } from '@/lib/utils/storage'

interface Props {
  cta: string
  locale: string
}

// PRD-PRICING-2026-001: 4 패스 구독 → 3 패스 1 회 구매 모델
const PASS_BUTTONS = [
  { id: 'short',    name: 'Short',    icon: '⚡', price: '₩2,900', href: '/pass', special: false },
  { id: 'standard', name: 'Standard', icon: '🌟', price: '₩4,900', href: '/pass', special: true  },
  { id: 'long',     name: 'Long',     icon: '🏆', price: '₩7,900', href: '/pass', special: false },
]

const HERO_PASS_LABEL: Record<string, string> = {
  ko: '여행 기간에 맞는 패스 하나만 고르세요',
  en: 'Pick the pass that matches your trip',
  ja: '旅行期間に合うパスを 1 つお選びください',
  'zh-CN': '根据行程长度选择一张通行证',
  'zh-TW': '根據行程長度選擇一張通行證',
}

// PRD-PASS-TOGGLE: 4 카드 토글 헤더 i18n. 인라인 객체 패턴 (HERO_PASS_LABEL 동일).
const TOGGLE_LABEL: Record<string, { open: string; close: string }> = {
  ko:     { open: '패스 옵션 보기',          close: '패스 옵션 닫기' },
  en:     { open: 'Show pass options',       close: 'Hide pass options' },
  ja:     { open: 'パスオプションを表示',     close: 'パスオプションを閉じる' },
  'zh-CN': { open: '显示通行证选项',          close: '关闭通行证选项' },
  'zh-TW': { open: '顯示通行證選項',          close: '關閉通行證選項' },
}

// (구) HeroSection — 풀스크린 비디오 + 패스 4개 버튼. P1-1 에서 신규 가치제안
// HeroSection 이 추가되면서 이 컴포넌트는 두번째 섹션 (결제 동선) 으로 이동했다.
// cta 는 하위 호환 유지를 위해 prop 시그니처에 남기지만 현재는 렌더링하지 않음.
//
// hotfix (모바일 viewport): 'h-screen' (100vh) 가 모바일에서 주소창 포함 영역
// 차지 → 헤더 가림 보고. 모바일은 60vh 로 축소하여 sticky 헤더 + 메뉴 시야 확보.
// 데스크탑 (lg+) 은 풀스크린 디자인 보존.
export function HeroPassButtons({ locale }: Props) {
  const heroLabel = HERO_PASS_LABEL[locale] ?? HERO_PASS_LABEL.en
  const toggle = TOGGLE_LABEL[locale] ?? TOGGLE_LABEL.en
  // PRD-PASS-TOGGLE: 4 카드 평소 닫힘 default. 사용자 클릭 시 펼침.
  const [isOpen, setIsOpen] = useState(false)
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] lg:h-screen overflow-hidden bg-[#1F2937]">
      {/* 배경 영상 */}
      <video
        src={getVideoUrl('hero.mp4')}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/dokkaebi-hero.png"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 어두운 오버레이 — 버튼 가독성 확보 */}
      <div className="absolute inset-0 bg-black/25" />

      {/* 데스크탑: 오른쪽 세로 패스 박스 — 헤더 + 토글 + 4 카드 */}
      <div className="hidden md:flex absolute right-8 lg:right-14 top-1/2 -translate-y-1/2 z-10 flex-col w-72 backdrop-blur-md bg-white/10 border border-white/15 rounded-2xl p-4 shadow-lg">
        {/* 헤더 — 라벨 + 토글 버튼 우상단 */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-white/90 text-xs font-bold drop-shadow-sm flex-1">
            {heroLabel}
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="pass-cards-desktop"
            aria-label={isOpen ? toggle.close : toggle.open}
            className="-mt-1 -mr-1 p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" strokeWidth={2.2} /> : <ChevronDown className="w-5 h-5" strokeWidth={2.2} />}
          </button>
        </div>

        {/* 4 카드 — 토글 펼침 */}
        <div
          id="pass-cards-desktop"
          aria-hidden={!isOpen}
          className="grid transition-all duration-300 ease-out overflow-hidden"
          style={{
            gridTemplateRows: isOpen ? '1fr' : '0fr',
            opacity: isOpen ? 1 : 0,
            marginTop: isOpen ? 12 : 0,
          }}
        >
          <div className="min-h-0 flex flex-col gap-3">
            {PASS_BUTTONS.map((pass) => (
              <Link
                key={pass.id}
                href={`/${locale}${pass.href}`}
                tabIndex={isOpen ? 0 : -1}
                className={[
                  'flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all backdrop-blur-md border',
                  pass.special
                    ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/25 border-amber-400/40 hover:from-amber-500/35 hover:to-rose-500/35'
                    : 'bg-white/15 border-white/20 hover:bg-white/25',
                ].join(' ')}
              >
                <span className="text-2xl">{pass.icon}</span>
                <div>
                  <p className="text-white font-black text-sm leading-tight">{pass.name}</p>
                  <p className={`text-[10px] font-bold ${pass.special ? 'text-amber-300' : 'text-white/60'}`}>
                    {pass.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 모바일: 하단 2x2 패스 박스 — 헤더 + 토글 + 4 카드.
          hotfix: 토글 버튼이 시각적 거슬림 보고 → 아이콘 / padding 축소 (옵션 C).
          박스 폭 max-w-sm → max-w-xs (384 → 320px) — 모바일 360px 에서 더 컴팩트. */}
      <div className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-10 w-full max-w-xs px-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/15 rounded-2xl p-3 shadow-lg">
          {/* 헤더 — 라벨 + 토글 버튼 우상단 (시각 부담 ↓) */}
          <div className="flex items-start justify-between gap-2">
            <p className="text-white/90 text-xs font-bold drop-shadow-sm flex-1">
              {heroLabel}
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="pass-cards-mobile"
              aria-label={isOpen ? toggle.close : toggle.open}
              className="-mt-0.5 -mr-0.5 p-1 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              {isOpen ? <ChevronUp className="w-4 h-4" strokeWidth={2.2} /> : <ChevronDown className="w-4 h-4" strokeWidth={2.2} />}
            </button>
          </div>

          {/* 4 카드 — 토글 펼침 (2 x 2) */}
          <div
            id="pass-cards-mobile"
            aria-hidden={!isOpen}
            className="grid transition-all duration-300 ease-out overflow-hidden"
            style={{
              gridTemplateRows: isOpen ? '1fr' : '0fr',
              opacity: isOpen ? 1 : 0,
              marginTop: isOpen ? 8 : 0,
            }}
          >
            <div className="min-h-0 grid grid-cols-2 gap-2">
              {PASS_BUTTONS.map((pass) => (
                <Link
                  key={pass.id}
                  href={`/${locale}${pass.href}`}
                  tabIndex={isOpen ? 0 : -1}
                  className={[
                    'flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all backdrop-blur-md border',
                    pass.special
                      ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/25 border-amber-400/40'
                      : 'bg-white/15 border-white/20',
                  ].join(' ')}
                >
                  <span className="text-lg">{pass.icon}</span>
                  <div>
                    <p className="text-white font-black text-xs leading-tight">{pass.name}</p>
                    <p className={`text-[9px] font-bold ${pass.special ? 'text-amber-300' : 'text-white/60'}`}>
                      {pass.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
