'use client'

import Link from 'next/link'
import { getVideoUrl } from '@/lib/utils/storage'

interface Props {
  cta: string
  locale: string
}

const PASS_BUTTONS = [
  { id: 'move', name: 'Move', icon: '🚗', price: '₩6,900', href: '/pass/move', special: false },
  { id: 'live', name: 'Live', icon: '🍜', price: '₩6,900', href: '/pass/live', special: false },
  { id: 'story', name: 'Story', icon: '📖', price: '₩9,900', href: '/pass/story', special: false },
  { id: 'allinone', name: 'All in One', icon: '👑', price: '₩19,900', href: '/pass', special: true },
]

const HERO_PASS_LABEL: Record<string, string> = {
  ko: '필요한 기능만 골라서, 부담 없이',
  en: 'Pick only what you need, hassle-free',
  ja: '必要な機能だけ選んで、気軽に',
  'zh-CN': '只选你需要的，轻松无负担',
  'zh-TW': '只選你需要的，輕鬆無負擔',
}

// (구) HeroSection — 풀스크린 비디오 + 패스 4개 버튼. P1-1 에서 신규 가치제안
// HeroSection 이 추가되면서 이 컴포넌트는 두번째 섹션 (결제 동선) 으로 이동했다.
// cta 는 하위 호환 유지를 위해 prop 시그니처에 남기지만 현재는 렌더링하지 않음.
export function HeroPassButtons({ locale }: Props) {
  const heroLabel = HERO_PASS_LABEL[locale] ?? HERO_PASS_LABEL.en
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#1F2937]">
      {/* 배경 영상 */}
      <video
        src={getVideoUrl('hero.mp4')}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/dokkaebi-hero.png"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 어두운 오버레이 — 버튼 가독성 확보 */}
      <div className="absolute inset-0 bg-black/25" />

      {/* 데스크탑: 오른쪽 세로 패스 버튼 */}
      <div className="hidden md:flex absolute right-8 lg:right-14 top-1/2 -translate-y-1/2 z-10 flex-col gap-3">
        <p className="text-white/80 text-xs font-bold text-center mb-1 drop-shadow-sm">
          {heroLabel}
        </p>
        {PASS_BUTTONS.map((pass) => (
          <Link
            key={pass.id}
            href={`/${locale}${pass.href}`}
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

      {/* 모바일: 하단 2x2 패스 버튼 */}
      <div className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm px-4">
        <p className="text-white/80 text-xs font-bold text-center mb-2 drop-shadow-sm">
          {heroLabel}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PASS_BUTTONS.map((pass) => (
            <Link
              key={pass.id}
              href={`/${locale}${pass.href}`}
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

    </section>
  )
}
