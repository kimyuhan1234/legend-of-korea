'use client'

import { useTranslations } from 'next-intl'
import { Route, Calendar, MapPin, Clock, Sparkles } from 'lucide-react'
import type { CourseHighlights } from '@/lib/data/courses'

interface Props {
  highlights: CourseHighlights
  locale: string
  difficulty?: 'easy' | 'medium' | 'hard' | string | null
  duration?: string
}

function getI18n(field: { [k: string]: string } | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

export function QuestHighlights({ highlights, locale, difficulty, duration }: Props) {
  const t = useTranslations('quest.highlights')
  const tCourse = useTranslations('course')

  const route = getI18n(highlights.recommendedRoute, locale)
  const season = getI18n(highlights.bestSeason, locale)
  const companion = getI18n(highlights.companionSpots, locale)

  // 5 항목 모두 비어있으면 섹션 자체 렌더 X (graceful)
  if (!route && !season && !companion && !duration && !difficulty) return null

  // difficulty 라벨 — 기존 course.{easy,medium,hard} 키 재사용
  const difficultyLabel = difficulty && ['easy', 'medium', 'hard'].includes(difficulty)
    ? tCourse(difficulty as 'easy' | 'medium' | 'hard')
    : null

  const items: Array<{ Icon: React.ComponentType<{ className?: string }>; label: string; value: string }> = []
  if (route) items.push({ Icon: Route, label: t('recommendedRoute'), value: route })
  if (duration) items.push({ Icon: Clock, label: t('duration'), value: duration })
  if (difficultyLabel) items.push({ Icon: Sparkles, label: t('difficulty'), value: difficultyLabel })
  if (season) items.push({ Icon: Calendar, label: t('bestSeason'), value: season })
  if (companion) items.push({ Icon: MapPin, label: t('companionSpots'), value: companion })

  return (
    <section className="bg-snow py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-8">
          {t('title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {items.map(({ Icon, label, value }, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-mist p-5 md:p-6 flex gap-3 hover:shadow-md transition-shadow"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-mint-light/40 flex items-center justify-center">
                <Icon className="w-5 h-5 text-mint-deep" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-stone uppercase tracking-wide mb-1">
                  {label}
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
