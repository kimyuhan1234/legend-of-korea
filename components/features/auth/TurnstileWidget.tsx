'use client'

import { useEffect, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { TURNSTILE_DEV_SITE_KEY } from '@/lib/auth/turnstile'

interface TurnstileWidgetProps {
  onTokenChange: (token: string | null) => void
  locale: string
}

/**
 * Cloudflare Turnstile widget — signup / login 봇 방지.
 *
 * 운영자 site key 미설정 시 Cloudflare 공식 dev 키 (always pass) 사용.
 * Vercel 배포 시 NEXT_PUBLIC_TURNSTILE_SITE_KEY 환경변수 필수.
 */
export function TurnstileWidget({ onTokenChange, locale }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || TURNSTILE_DEV_SITE_KEY
  const lastTokenRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      lastTokenRef.current = null
    }
  }, [])

  const cfLanguage = mapLocaleToCfLang(locale)

  return (
    <div className="flex justify-center my-1">
      <Turnstile
        siteKey={siteKey}
        options={{ language: cfLanguage, theme: 'light', size: 'normal' }}
        onSuccess={(token) => {
          lastTokenRef.current = token
          onTokenChange(token)
        }}
        onError={() => {
          lastTokenRef.current = null
          onTokenChange(null)
        }}
        onExpire={() => {
          lastTokenRef.current = null
          onTokenChange(null)
        }}
      />
    </div>
  )
}

/** 5 locale → Cloudflare Turnstile 지원 언어 코드 매핑 (ja 미지원 → en fallback). */
function mapLocaleToCfLang(locale: string): string {
  switch (locale) {
    case 'ko':
      return 'ko'
    case 'ja':
      return 'ja'
    case 'zh-CN':
      return 'zh-cn'
    case 'zh-TW':
      return 'zh-tw'
    default:
      return 'en'
  }
}
