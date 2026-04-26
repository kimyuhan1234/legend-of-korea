'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  /** 노출 시작 스크롤 (px). 기본 100px 이후 등장. */
  showAfter?: number
}

// Sticky CTA 미노출 경로 — 가입/로그인/마이페이지/결제/유지보수
const EXCLUDED_PATTERNS = ['/auth/', '/mypage', '/maintenance', '/beta-full', '/checkout']

/**
 * 모바일 전용 Sticky CTA (P1-2).
 *  - 100px 스크롤 후 슬라이드-업 애니메이션
 *  - 데스크톱(md+) 미노출 (헤더 CTA 로 충분)
 *  - 회원가입/로그인/마이페이지/결제 페이지 자동 숨김
 *  - safe-area-inset-bottom 적용 (iOS 홈 인디케이터 회피)
 *  - --cta-height 변수 활용으로 FeedbackWidget FAB 가 위로 자동 이동
 */
export function StickyCTA({ showAfter = 100 }: Props) {
  const t = useTranslations('homeHero')
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  // 첫 segment 의 locale 을 추출 (signup 링크용)
  const localeMatch = pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(\/|$)/)
  const locale = localeMatch?.[1] ?? 'ko'

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfter)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showAfter])

  const shouldHide = EXCLUDED_PATTERNS.some((p) => pathname.includes(p))
  if (shouldHide) return null

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="bg-white border-t border-mist shadow-lg p-3">
        <Link
          href={`/${locale}/auth/signup`}
          className="flex items-center justify-center w-full px-6 py-3 rounded-xl bg-mint-deep text-white font-bold text-base hover:bg-[#7BC8BC] transition-colors min-h-[48px]"
        >
          {t('ctaPrimary')}
          <span className="ml-2" aria-hidden>→</span>
        </Link>
      </div>
    </div>
  )
}
