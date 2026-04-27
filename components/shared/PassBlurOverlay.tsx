'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lock } from 'lucide-react'

interface Props {
  requiredPass: 'move' | 'live' | 'story'
  children: React.ReactNode
  blur?: boolean
  compact?: boolean  // true: 작은 오버레이 (목록 내 1개 항목용)
}

const PASS_NAMES: Record<string, string> = {
  move: 'Move',
  live: 'Live',
  story: 'Story',
}

type OverlayLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const OVERLAY_TEXT: Record<OverlayLocale, { title: string; cta: string }> = {
  ko: { title: '전체 결과를 보려면 {pass} 패스가 필요해요', cta: '패스 보러가기' },
  en: { title: 'Get {pass} pass to see full results', cta: 'View Passes' },
  ja: { title: '全結果を見るには{pass}パスが必要です', cta: 'パスを見る' },
  'zh-CN': { title: '查看完整结果需要{pass}通行证', cta: '查看通行证' },
  'zh-TW': { title: '查看完整結果需要{pass}通行證', cta: '查看通行證' },
}

export function PassBlurOverlay({ requiredPass, children, blur = true, compact = false }: Props) {
  const pathname = usePathname()
  const locale = (pathname.split('/')[1] || 'ko') as OverlayLocale
  const text = OVERLAY_TEXT[locale] ?? OVERLAY_TEXT.en
  const passName = PASS_NAMES[requiredPass]

  if (!blur) return <>{children}</>

  return (
    <div className="relative">
      {/* 블러 처리된 콘텐츠 — 접근성·상호작용 차단 */}
      <div className="blur-md pointer-events-none select-none" aria-hidden>
        {children}
      </div>

      {/* 오버레이 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl p-4">
        <Lock className={compact ? 'w-5 h-5 text-slate-500 mb-2' : 'w-8 h-8 text-slate-500 mb-3'} />
        <p
          className={[
            'font-bold text-slate-600 text-center mb-4',
            compact ? 'text-xs px-2' : 'text-sm px-4',
          ].join(' ')}
        >
          {text.title.replace('{pass}', passName)}
        </p>
        <Link
          href={`/${locale}/pass/${requiredPass}`}
          className={[
            'rounded-full bg-gradient-to-br from-mint to-blossom text-ink font-black hover:opacity-90 transition-opacity shadow-md',
            compact ? 'px-4 py-1.5 text-xs' : 'px-5 py-2.5 text-sm',
          ].join(' ')}
        >
          {text.cta}
        </Link>
      </div>
    </div>
  )
}
