'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const MESSAGES: Record<Lang, string[]> = {
  ko: [
    '구름이 여행을 준비하고 있어요...',
    '한국의 숨겨진 보물을 찾는 중...',
    '당신만을 위한 여행을 만들고 있어요...',
    '잠시만요, 구름 위를 걷는 중...',
  ],
  ja: [
    '雲があなたの旅を準備しています...',
    '韓国の隠れた宝物を探しています...',
    'あなただけの旅を作っています...',
    '少々お待ちを、雲の上を歩いています...',
  ],
  en: [
    'Clouds are preparing your journey...',
    'Searching for hidden Korean treasures...',
    'Crafting a trip just for you...',
    'One moment — walking above the clouds...',
  ],
  'zh-CN': [
    '云朵正在准备您的旅程...',
    '正在寻找韩国的隐藏宝藏...',
    '正在为您打造专属之旅...',
    '稍等片刻,漫步云端...',
  ],
  'zh-TW': [
    '雲朵正在準備您的旅程...',
    '正在尋找韓國的隱藏寶藏...',
    '正在為您打造專屬之旅...',
    '稍等片刻,漫步雲端...',
  ],
}

interface Props {
  /** compact 모드는 메시지 숨기고 작은 구름만 표시 (sub-route loading.tsx용) */
  compact?: boolean
  /** locale 수동 주입 (서버 컴포넌트용) — 미지정 시 pathname에서 자동 감지 */
  locale?: string
}

function resolveLocale(raw: string | undefined): Lang {
  const candidates: Lang[] = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW']
  return (candidates.includes(raw as Lang) ? (raw as Lang) : 'ko')
}

export function CloudLoader({ compact = false, locale }: Props) {
  const pathname = usePathname()
  const detected = locale ?? pathname?.split('/')[1] ?? 'ko'
  const lang = resolveLocale(detected)

  // 렌더마다 동일 메시지 유지 (useMemo), 새 로딩 인스턴스마다 랜덤
  const message = useMemo(() => {
    const pool = MESSAGES[lang] ?? MESSAGES.ko
    return pool[Math.floor(Math.random() * pool.length)]
  }, [lang])

  const cloudSize = compact ? 40 : 64

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${compact ? 'py-10' : 'min-h-[60vh] py-10'}`}>
      <div
        className="cloud-loader"
        style={{ fontSize: `${cloudSize}px`, lineHeight: 1 }}
        aria-hidden
      >
        ☁️
      </div>

      {!compact && (
        <p className="text-sm md:text-base text-slate-500 font-bold text-center animate-pulse max-w-[260px]">
          {message}
        </p>
      )}

      <style jsx>{`
        @keyframes cloud-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        .cloud-loader {
          animation: cloud-float 2.4s ease-in-out infinite;
          filter: drop-shadow(0 6px 12px rgba(157, 216, 206, 0.35));
        }
      `}</style>
    </div>
  )
}
