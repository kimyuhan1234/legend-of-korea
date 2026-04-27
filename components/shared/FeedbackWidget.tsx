'use client'

import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { RaindropIcon } from '@/components/shared/icons/RaindropIcon'

const STORAGE_KEY = 'feedback-last-shown'
const COOLDOWN_HOURS = 24

interface Props {
  /** glob 비슷한 경로 패턴 — 매칭 시 FAB 숨김 (디자인팀 #7 권고) */
  hideOn?: string[]
}

function pathMatches(pathname: string, patterns: string[]): boolean {
  return patterns.some((p) => {
    if (p.includes('*')) {
      const re = new RegExp('^' + p.replace(/\*/g, '.*') + '$')
      return re.test(pathname)
    }
    return pathname === p || pathname.startsWith(p + '/')
  })
}

/**
 * 베타 피드백 위젯 — FAB + 모달.
 *
 * 정책:
 *  - 비로그인 도 제출 가능 (RLS allow insert)
 *  - 24시간 쿨다운 (localStorage)
 *  - hideOn 패턴 매칭 시 FAB 숨김 (Sticky CTA 충돌 회피)
 *  - 모달 오픈 시 FAB 자동 dim (opacity 0 + pointer-events:none)
 */
export function FeedbackWidget({ hideOn = [] }: Props) {
  const t = useTranslations('feedback')
  const locale = useLocale()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [canShow, setCanShow] = useState(false)

  useEffect(() => {
    try {
      const last = localStorage.getItem(STORAGE_KEY)
      if (!last || Date.now() - parseInt(last, 10) > COOLDOWN_HOURS * 3600 * 1000) {
        setCanShow(true)
      }
    } catch {
      // localStorage 불가 (iframe 등) — 표시 X
    }
  }, [])

  // 경로 매칭으로 숨김 (Sticky CTA 가 있는 페이지 등)
  const isHidden = hideOn.length > 0 && pathMatches(pathname, hideOn)

  if (!canShow || isHidden) return null

  const handleSubmit = async () => {
    if (!rating) return

    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_path: pathname,
        locale,
        rating,
        comment: comment || null,
      }),
    }).catch(() => { /* 조용한 실패 — 사용자에겐 thanks 화면 노출 */ })

    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()))
    } catch {
      // ignore
    }
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setSubmitted(false)
      setRating(null)
      setComment('')
    }, 2200)
  }

  return (
    <>
      {/* FAB — 56x56, 우하단. 모달 오픈 시 dim */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('label')}
        className={`fixed right-6 z-40 w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center text-mint-deep ${
          open ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          // safe area + Sticky CTA 높이 (--cta-height 변수 정의된 페이지면 그만큼 위로)
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + var(--cta-height, 0px) + 24px)',
          transitionDuration: '200ms',
          transitionTimingFunction: 'ease-out',
        }}
      >
        <RaindropIcon size={24} />
      </button>

      {/* 모달 */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[calc(100vh-2rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3" aria-hidden>🙏</div>
                <p className="text-base font-medium leading-relaxed">{t('thanks')}</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">{t('prompt')}</h3>

                {/* 5단계 이모지 — 디자인팀 시안 */}
                <div className="flex justify-between mb-4">
                  {[
                    { value: 5, emoji: '😍' },
                    { value: 4, emoji: '🙂' },
                    { value: 3, emoji: '🤔' },
                    { value: 2, emoji: '😕' },
                    { value: 1, emoji: '😞' },
                  ].map(({ value, emoji }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`text-3xl p-2 rounded-lg transition-all ${
                        rating === value ? 'bg-blue-100 scale-125' : 'hover:bg-gray-100'
                      }`}
                      aria-label={`${value}점`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('placeholder')}
                  className="w-full border rounded-lg p-2 mb-4 text-sm resize-none"
                  rows={3}
                  maxLength={500}
                />

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!rating}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  {t('submit')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
