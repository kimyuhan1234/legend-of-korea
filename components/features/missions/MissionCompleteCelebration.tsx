'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface Props {
  isOpen: boolean
  onClose: () => void
  missionTitle: string
  lpEarned: number
  missionType: 'quiz' | 'photo' | 'open' | 'boss' | 'hidden'
  onNext?: () => void
}

export function MissionCompleteCelebration({ isOpen, onClose, missionTitle, lpEarned, missionType, onNext }: Props) {
  const t = useTranslations('mission')
  const [displayLp, setDisplayLp] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!isOpen) { setShow(false); setDisplayLp(0); return }
    setShow(true)

    // LP 카운트업 애니메이션
    let current = 0
    const step = Math.ceil(lpEarned / 20)
    const timer = setInterval(() => {
      current += step
      if (current >= lpEarned) {
        current = lpEarned
        clearInterval(timer)
      }
      setDisplayLp(current)
    }, 50)

    // 5초 후 자동 닫기
    const autoClose = setTimeout(() => setShow(false), 5000)

    return () => { clearInterval(timer); clearTimeout(autoClose) }
  }, [isOpen, lpEarned])

  useEffect(() => {
    if (!show && isOpen) {
      const t = setTimeout(onClose, 300)
      return () => clearTimeout(t)
    }
  }, [show, isOpen, onClose])

  if (!isOpen) return null

  const isBoss = missionType === 'boss'
  const isHidden = missionType === 'hidden'

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={() => setShow(false)}
    >
      <div className="absolute inset-0 bg-black/60" />

      {/* 색종이 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece absolute"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.5}s`,
              backgroundColor: ['#5BBDAD', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6', '#EF4444'][i % 6],
            }}
          />
        ))}
      </div>

      {/* 메인 카드 */}
      <div
        className={`relative bg-white rounded-3xl p-8 md:p-10 max-w-sm w-full text-center shadow-2xl transition-transform duration-500 ${show ? 'scale-100' : 'scale-90'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">
          {isBoss ? '🏆' : isHidden ? '⭐' : '🎉'}
        </div>

        <h2 className={`text-2xl font-black mb-2 ${isBoss ? 'text-amber-500' : isHidden ? 'text-violet-500' : 'text-ink'}`}>
          {isBoss ? t('celebrate.boss') : isHidden ? t('celebrate.hidden') : t('celebrate.title')}
        </h2>

        <p className="text-sm text-slate mb-4">&ldquo;{missionTitle}&rdquo;</p>

        <div className={`text-3xl font-black mb-6 ${isBoss ? 'text-amber-500' : 'text-mint-deep'}`}>
          💧 +{displayLp} 빗방울
        </div>

        {onNext && (
          <button
            onClick={() => { setShow(false); onNext() }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-mint to-mint-deep text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            {t('celebrate.next')} →
          </button>
        )}
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <style jsx>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          animation: confettiFall 3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
