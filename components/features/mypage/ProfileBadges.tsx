'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Lock, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
}

const COURSES = [
  { id: '11111111-1111-1111-1111-000000000001', city: 'jeonju', name: { ko: '전주', en: 'Jeonju', ja: '全州' }, emoji: '👹' },
  { id: '11111111-1111-1111-1111-000000000002', city: 'tongyeong', name: { ko: '통영', en: 'Tongyeong', ja: '統営' }, emoji: '🐢' },
  { id: '11111111-1111-1111-1111-000000000003', city: 'cheonan', name: { ko: '천안', en: 'Cheonan', ja: '天安' }, emoji: '🌸' },
  { id: '11111111-1111-1111-1111-000000000004', city: 'yongin', name: { ko: '용인', en: 'Yongin', ja: '龍仁' }, emoji: '📖' },
  { id: '11111111-1111-1111-1111-000000000005', city: 'icheon', name: { ko: '이천', en: 'Icheon', ja: '利川' }, emoji: '🧚' },
  { id: '33333333-3333-3333-3333-000000000001', city: 'gyeongju', name: { ko: '경주', en: 'Gyeongju', ja: '慶州' }, emoji: '👑' },
  { id: '33333333-3333-3333-3333-000000000002', city: 'busan', name: { ko: '부산', en: 'Busan', ja: '釜山' }, emoji: '🧜‍♀️' },
  { id: '33333333-3333-3333-3333-000000000003', city: 'seoul', name: { ko: '서울', en: 'Seoul', ja: 'ソウル' }, emoji: '🦁' },
  { id: '33333333-3333-3333-3333-000000000004', city: 'jeju', name: { ko: '제주', en: 'Jeju', ja: '済州' }, emoji: '🌋' },
]

interface CourseCompletion {
  courseId: string
  completed: number
  total: number
}

export function ProfileBadges({ userId }: Props) {
  const t = useTranslations('mypage')
  const pathname = usePathname()
  const locale = (pathname.split('/')[1] || 'ko') as 'ko' | 'en' | 'ja'
  const [completions, setCompletions] = useState<CourseCompletion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      // 전체 미션 수 (코스별, 히든 제외)
      const { data: allMissions } = await supabase
        .from('missions')
        .select('id, course_id, is_hidden')

      // 유저의 완료 미션
      const { data: progress } = await supabase
        .from('mission_progress')
        .select('mission_id')
        .eq('user_id', userId)
        .eq('status', 'completed')

      if (!allMissions) { setLoading(false); return }

      const completedIds = new Set((progress || []).map(p => p.mission_id))

      const result: CourseCompletion[] = COURSES.map(course => {
        const courseMissions = allMissions.filter(m => m.course_id === course.id && !m.is_hidden)
        const completedCount = courseMissions.filter(m => completedIds.has(m.id)).length
        return { courseId: course.id, completed: completedCount, total: courseMissions.length }
      })

      setCompletions(result)
      setLoading(false)
    }

    load()
  }, [userId])

  const completionMap = new Map(completions.map(c => [c.courseId, c]))
  const clearedCount = completions.filter(c => c.total > 0 && c.completed === c.total).length
  const isLegendary = clearedCount === COURSES.length

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-24 mb-4" />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-700 flex items-center gap-1.5">
          🎖️ {t('badges.title')}
        </h3>
        <span className="text-xs font-bold text-slate-400">
          {clearedCount}/{COURSES.length}
        </span>
      </div>

      {isLegendary && (
        <div className="mb-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" />
          <span className="text-sm font-black text-amber-700">{t('badges.legendaryTitle')} 🏆</span>
        </div>
      )}

      <div className="grid grid-cols-5 gap-2">
        {COURSES.map(course => {
          const c = completionMap.get(course.id)
          const isCleared = c && c.total > 0 && c.completed === c.total

          return (
            <div
              key={course.id}
              className={`relative flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                isCleared
                  ? 'bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200'
                  : 'bg-slate-50 border border-slate-100'
              }`}
            >
              <span className={`text-xl ${isCleared ? '' : 'opacity-25 grayscale'}`}>
                {course.emoji}
              </span>
              <span className={`text-[10px] font-bold leading-tight text-center ${
                isCleared ? 'text-amber-700' : 'text-slate-300'
              }`}>
                {course.name[locale]}
              </span>
              {!isCleared && (
                <Lock size={8} className="absolute top-1.5 right-1.5 text-slate-300" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
