'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { SwipeQuestion } from '@/lib/curation/types'

interface Props {
  questions: SwipeQuestion[]
  locale: string
  onComplete: (answers: Record<string, 'A' | 'B'>) => void
  onSkip: () => void
}

function getI18n(field: { [k: string]: string } | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

export function SwipeCard({ questions, locale, onComplete, onSkip }: Props) {
  const t = useTranslations('spots')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({})
  const [dragX, setDragX] = useState(0)
  const startX = useRef(0)
  const dragging = useRef(false)
  const [exiting, setExiting] = useState<'A' | 'B' | null>(null)

  const current = questions[index]
  if (!current) return null

  const handleAnswer = (choice: 'A' | 'B') => {
    if (exiting) return
    setExiting(choice)

    setTimeout(() => {
      const newAnswers = { ...answers, [current.id]: choice }
      setAnswers(newAnswers)

      if (index >= questions.length - 1) {
        onComplete(newAnswers)
      } else {
        setIndex(index + 1)
        setDragX(0)
        setExiting(null)
      }
    }, 300)
  }

  const handleStart = (clientX: number) => {
    dragging.current = true
    startX.current = clientX
  }

  const handleMove = (clientX: number) => {
    if (!dragging.current || exiting) return
    setDragX(clientX - startX.current)
  }

  const handleEnd = () => {
    if (!dragging.current || exiting) return
    dragging.current = false
    if (dragX < -120) handleAnswer('A')
    else if (dragX > 120) handleAnswer('B')
    else setDragX(0)
  }

  const rotation = dragX * 0.05
  const opacityA = dragX < 0 ? Math.min(1, -dragX / 150) : 0
  const opacityB = dragX > 0 ? Math.min(1, dragX / 150) : 0

  const exitTransform = exiting === 'A'
    ? 'translateX(-200%) rotate(-30deg)'
    : exiting === 'B'
      ? 'translateX(200%) rotate(30deg)'
      : `translateX(${dragX}px) rotate(${rotation}deg)`

  return (
    <div className="max-w-md mx-auto px-6 py-12 md:py-20">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-2">
          🎯 {t('swipe.title')}
        </h2>
        <p className="text-sm text-slate-400 font-bold">
          {t('swipe.progress', { n: index + 1, total: questions.length })}
        </p>
      </div>

      {/* 카드 */}
      <div className="relative" style={{ perspective: '1000px' }}>
        <div
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          style={{
            transform: exitTransform,
            transition: dragging.current ? 'none' : 'transform 0.3s ease-out',
            touchAction: 'pan-y',
          }}
        >
          {/* 좌우 선택 하이라이트 오버레이 */}
          <div
            className="absolute inset-0 bg-mint-deep/30 flex items-center justify-start pl-8 pointer-events-none z-10"
            style={{ opacity: opacityA }}
          >
            <span className="text-5xl">{current.optionA.icon}</span>
          </div>
          <div
            className="absolute inset-0 bg-sky/30 flex items-center justify-end pr-8 pointer-events-none z-10"
            style={{ opacity: opacityB }}
          >
            <span className="text-5xl">{current.optionB.icon}</span>
          </div>

          <div className="p-8 md:p-10 space-y-8 relative">
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="text-center space-y-3">
                <div className="text-6xl">{current.optionA.icon}</div>
                <p className="text-sm font-black text-slate-700 leading-tight">
                  {getI18n(current.optionA.label, locale)}
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="text-6xl">{current.optionB.icon}</div>
                <p className="text-sm font-black text-slate-700 leading-tight">
                  {getI18n(current.optionB.label, locale)}
                </p>
              </div>
            </div>

            <div className="relative border-t border-slate-100 pt-4 text-center">
              <p className="text-xs text-slate-400 font-bold">VS</p>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 (스와이프 대체) */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => handleAnswer('A')}
          disabled={!!exiting}
          className="flex-1 py-4 rounded-2xl bg-white border-2 border-mint-deep text-mint-deep font-black text-sm hover:bg-mint-deep hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xl">{current.optionA.icon}</span>
        </button>
        <button
          onClick={() => handleAnswer('B')}
          disabled={!!exiting}
          className="flex-1 py-4 rounded-2xl bg-white border-2 border-sky text-sky font-black text-sm hover:bg-sky hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span className="text-xl">{current.optionB.icon}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 진행 인디케이터 */}
      <div className="flex justify-center gap-2 mt-6">
        {questions.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-mint-deep' : i < index ? 'w-1.5 bg-mint-deep/50' : 'w-1.5 bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* 스킵 */}
      <div className="text-center mt-6">
        <button
          onClick={onSkip}
          className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
        >
          {t('swipe.skip')}
        </button>
      </div>
    </div>
  )
}
