'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Camera, Share2, Loader2, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PassportStamp } from './PassportStamp'
import { toast } from '@/components/ui/use-toast'

interface Props {
  userId: string
  locale: string
}

const COURSES = [
  { id: '11111111-1111-1111-1111-000000000001', city: { ko: '전주', en: 'Jeonju', ja: '全州', 'zh-CN': '全州', 'zh-TW': '全州' }, emoji: '👹', legend: { ko: '도깨비의 선물', en: 'Gift of the Dokkaebi', ja: 'トッケビの贈り物', 'zh-CN': '鬼怪的礼物', 'zh-TW': '鬼怪的禮物' } },
  { id: '11111111-1111-1111-1111-000000000002', city: { ko: '통영', en: 'Tongyeong', ja: '統営', 'zh-CN': '统营', 'zh-TW': '統營' }, emoji: '🐢', legend: { ko: '별주부전', en: 'Tale of Byeoljubu', ja: '鼈主簿伝', 'zh-CN': '别主簿传', 'zh-TW': '別主簿傳' } },
  { id: '33333333-3333-3333-3333-000000000001', city: { ko: '경주', en: 'Gyeongju', ja: '慶州', 'zh-CN': '庆州', 'zh-TW': '慶州' }, emoji: '👑', legend: { ko: '신라의 보물', en: 'Treasures of Silla', ja: '新羅の宝物', 'zh-CN': '新罗的宝物', 'zh-TW': '新羅的寶物' } },
  { id: '33333333-3333-3333-3333-000000000002', city: { ko: '부산', en: 'Busan', ja: '釜山', 'zh-CN': '釜山', 'zh-TW': '釜山' }, emoji: '🧜‍♀️', legend: { ko: '인어공주', en: 'The Mermaid', ja: '人魚姫', 'zh-CN': '美人鱼', 'zh-TW': '美人魚' } },
  { id: '33333333-3333-3333-3333-000000000003', city: { ko: '서울', en: 'Seoul', ja: 'ソウル', 'zh-CN': '首尔', 'zh-TW': '首爾' }, emoji: '🦁', legend: { ko: '해태의 수호', en: 'Guardian Haetae', ja: '獬豸の守護', 'zh-CN': '獬豸的守护', 'zh-TW': '獬豸的守護' } },
  { id: '33333333-3333-3333-3333-000000000004', city: { ko: '제주', en: 'Jeju', ja: '済州', 'zh-CN': '济州', 'zh-TW': '濟州' }, emoji: '🌋', legend: { ko: '설문대할망', en: 'Grandmother Seolmundae', ja: '雪門大おばあさん', 'zh-CN': '雪门大奶奶', 'zh-TW': '雪門大奶奶' } },
  { id: '11111111-1111-1111-1111-000000000003', city: { ko: '천안', en: 'Cheonan', ja: '天安', 'zh-CN': '天安', 'zh-TW': '天安' }, emoji: '🌸', legend: { ko: '흥부와 놀부', en: 'Heungbu & Nolbu', ja: '興夫と遊夫', 'zh-CN': '兴夫与游夫', 'zh-TW': '興夫與遊夫' } },
  { id: '11111111-1111-1111-1111-000000000004', city: { ko: '용인', en: 'Yongin', ja: '龍仁', 'zh-CN': '龙仁', 'zh-TW': '龍仁' }, emoji: '📖', legend: { ko: '옛이야기 마을', en: 'Folk Tale Village', ja: '昔話の里', 'zh-CN': '古老故事村', 'zh-TW': '古老故事村' } },
  { id: '11111111-1111-1111-1111-000000000005', city: { ko: '이천', en: 'Icheon', ja: '利川', 'zh-CN': '利川', 'zh-TW': '利川' }, emoji: '🧚', legend: { ko: '선녀와 나무꾼', en: 'Fairy & Woodcutter', ja: '仙女と木こり', 'zh-CN': '仙女与樵夫', 'zh-TW': '仙女與樵夫' } },
]

interface CourseProgress {
  courseId: string
  completed: number
  total: number
  lastCompletedAt: string | null
}

export function DigitalPassport({ userId, locale }: Props) {
  const t = useTranslations('mypage')
  const [progress, setProgress] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [nickname, setNickname] = useState('')
  const [tierLevel, setTierLevel] = useState(1)
  const [createdAt, setCreatedAt] = useState('')

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const [userRes, missionsRes, progressRes] = await Promise.all([
        supabase.from('users').select('nickname, current_tier, created_at').eq('id', userId).single(),
        supabase.from('missions').select('id, course_id, is_hidden'),
        supabase.from('mission_progress').select('mission_id, status, completed_at').eq('user_id', userId).eq('status', 'completed'),
      ])

      if (userRes.data) {
        setNickname(userRes.data.nickname || '')
        setTierLevel(userRes.data.current_tier || 1)
        setCreatedAt(userRes.data.created_at || '')
      }

      const allMissions = missionsRes.data || []
      const completedProgress = progressRes.data || []
      const completedMap = new Map(completedProgress.map(p => [p.mission_id, p.completed_at]))

      const result: CourseProgress[] = COURSES.map(course => {
        const courseMissions = allMissions.filter(m => m.course_id === course.id && !m.is_hidden)
        const completedMissions = courseMissions.filter(m => completedMap.has(m.id))
        const dates = completedMissions
          .map(m => completedMap.get(m.id))
          .filter(Boolean) as string[]
        const lastDate = dates.length > 0 ? dates.sort().reverse()[0] : null

        return {
          courseId: course.id,
          completed: completedMissions.length,
          total: courseMissions.length,
          lastCompletedAt: lastDate,
        }
      })

      setProgress(result)
      setLoading(false)
    }

    load()
  }, [userId])

  const progressMap = new Map(progress.map(p => [p.courseId, p]))
  const clearedCount = progress.filter(p => p.total > 0 && p.completed === p.total).length
  const isAllCleared = clearedCount === COURSES.length

  const TIER_NAMES: Record<string, Record<number, string>> = {
    ko: { 1: '초보 탐험가', 2: '숙련 모험가', 3: '전설의 여행자', 4: '신화의 수호자', 5: '레전드 마스터' },
    en: { 1: 'Novice Explorer', 2: 'Skilled Adventurer', 3: 'Legendary Traveler', 4: 'Mythic Guardian', 5: 'Legend Master' },
    ja: { 1: '初心者探検家', 2: '熟練冒険家', 3: '伝説の旅人', 4: '神話の守護者', 5: 'レジェンドマスター' },
    'zh-CN': { 1: '初级探险家', 2: '熟练冒险家', 3: '传说旅行者', 4: '神话守护者', 5: '传奇大师' },
    'zh-TW': { 1: '初級探險家', 2: '熟練冒險家', 3: '傳說旅行者', 4: '神話守護者', 5: '傳奇大師' },
  }
  const tierName = (TIER_NAMES[locale] ?? TIER_NAMES.ko)[tierLevel] ?? (TIER_NAMES.ko)[1]
  const TIER_EMOJIS: Record<number, string> = { 1: '🌿', 2: '⚔️', 3: '🏅', 4: '🔱', 5: '👑' }
  const tierEmoji = TIER_EMOJIS[tierLevel] ?? '🌿'

  const issuedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(locale === 'ko' ? 'ko-KR' : locale === 'ja' ? 'ja-JP' : locale, {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  const handleCapture = useCallback(() => {
    // 브라우저 내장 기능으로 스크린샷 안내
    toast({
      title: t('capturePassport'),
      description: locale === 'ko'
        ? '스크린샷 기능을 사용해주세요 (iOS: 전원+볼륨↑ / Android: 전원+볼륨↓)'
        : 'Use your device screenshot (iOS: Power+Volume Up / Android: Power+Volume Down)',
    })
  }, [locale, t])

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Cloud with you - Digital Passport',
      text: `${nickname} | ${clearedCount}/${COURSES.length} stamps collected!`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        toast({ title: t('linkCopied') || 'Link copied!' })
      }
    } catch {
      // user cancelled share
    }
  }, [nickname, clearedCount, t])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        {/* ── 여권 표지 ── */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1a2744] to-[#0f1b33] p-6 md:p-8 text-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />
          <div className="relative z-10 space-y-3">
            <p className="text-amber-400/80 text-xs font-bold tracking-[0.3em] uppercase">
              {t('passportTitle')}
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-amber-300 tracking-tight">
              {t('passportSubtitle')}
            </h2>
            <div className="w-16 h-0.5 bg-amber-400/30 mx-auto" />
            <div className="pt-3 space-y-1.5 text-sm">
              <p className="text-slate-300">
                <span className="text-amber-400/60 text-xs mr-2">NAME</span>
                <span className="font-bold text-white">{nickname || 'Traveler'}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-amber-400/60 text-xs mr-2">RANK</span>
                <span className="font-bold text-white">{tierEmoji} {tierName}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-amber-400/60 text-xs mr-2">STAMPS</span>
                <span className="font-bold text-white">{t('stampCount', { n: clearedCount, total: COURSES.length })}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-amber-400/60 text-xs mr-2">{t('issuedDate').toUpperCase()}</span>
                <span className="font-bold text-white">{issuedDate}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── 스탬프 그리드 ── */}
        <div className="mt-6 grid grid-cols-3 gap-3 md:gap-4">
          {COURSES.map(course => {
            const p = progressMap.get(course.id)
            const isCompleted = !!p && p.total > 0 && p.completed === p.total
            const cityName = (course.city as Record<string, string>)[locale] ?? course.city.ko

            return (
              <PassportStamp
                key={course.id}
                city={cityName}
                emoji={course.emoji}
                legendName={(course.legend as Record<string, string>)[locale] ?? course.legend.ko}
                isCompleted={isCompleted}
                completedDate={p?.lastCompletedAt ?? null}
                completedCount={p?.completed ?? 0}
                totalCount={p?.total ?? 0}
                locale={locale}
                isAllCleared={isAllCleared}
              />
            )
          })}
        </div>

        {/* ── 전설의 모험가 배너 ── */}
        {isAllCleared && (
          <div className="mt-6 flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
            <Trophy className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <p className="text-sm font-black text-amber-700">{t('legendaryAdventurer')}</p>
          </div>
        )}
      </div>

      {/* ── 버튼 영역 (캡처 제외) ── */}
      <div className="flex gap-3">
        <button
          onClick={handleCapture}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white border border-mist font-bold text-sm text-[#111] hover:bg-cloud transition-colors"
        >
          <Camera className="w-4 h-4" />
          {t('capturePassport')}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-mint text-ink font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <Share2 className="w-4 h-4" />
          {t('sharePassport')}
        </button>
      </div>
    </div>
  )
}
