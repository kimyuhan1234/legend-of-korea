'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BranchSelectionModal } from './BranchSelectionModal'
import type { UserRankResult } from '@/lib/tiers/levels'

type CardLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const UI: Record<CardLocale, {
  level: string
  next: string
  toNext: (n: number) => string
  scholarBadge: string
  warriorBadge: string
  commonBadge: string
  branchNeeded: string
  branchBtn: string
  specialBadge: string
  maxLevel: string
  branchAnnouncement: string
  raindropUnit: string
  viewTree: string
}> = {
  ko: {
    level: '레벨',
    next: '다음',
    toNext: (n) => `다음 레벨까지 ${n.toLocaleString()} 빗방울`,
    scholarBadge: '문관의 길',
    warriorBadge: '무관의 길',
    commonBadge: '공통 구간',
    branchNeeded: '분기 선택 필요',
    branchBtn: '길 선택하기',
    specialBadge: '✨ 특수 직위',
    maxLevel: '최고 레벨 도달!',
    branchAnnouncement: '다음 레벨에서 문관/무관 분기!',
    raindropUnit: '빗방울',
    viewTree: '전체 성장 지도 보기 →',
  },
  en: {
    level: 'Level',
    next: 'Next',
    toNext: (n) => `${n.toLocaleString()} raindrops to next level`,
    scholarBadge: 'Scholar Path',
    warriorBadge: 'Warrior Path',
    commonBadge: 'Common',
    branchNeeded: 'Path selection required',
    branchBtn: 'Choose Path',
    specialBadge: '✨ Special Position',
    maxLevel: 'Max level reached!',
    branchAnnouncement: 'Branch at next level!',
    raindropUnit: 'raindrops',
    viewTree: 'View full growth map →',
  },
  ja: {
    level: 'レベル',
    next: '次',
    toNext: (n) => `次のレベルまで ${n.toLocaleString()} 雨滴`,
    scholarBadge: '文官の道',
    warriorBadge: '武官の道',
    commonBadge: '共通',
    branchNeeded: '道の選択が必要',
    branchBtn: '道を選ぶ',
    specialBadge: '✨ 特殊職',
    maxLevel: '最高レベル到達！',
    branchAnnouncement: '次のレベルで文官/武官分岐！',
    raindropUnit: '雨滴',
    viewTree: '全体の成長マップを見る →',
  },
  'zh-CN': {
    level: '等级',
    next: '下一级',
    toNext: (n) => `距下一级还需 ${n.toLocaleString()} 雨滴`,
    scholarBadge: '文官之路',
    warriorBadge: '武官之路',
    commonBadge: '共通',
    branchNeeded: '需要选择道路',
    branchBtn: '选择道路',
    specialBadge: '✨ 特殊职位',
    maxLevel: '已达最高等级！',
    branchAnnouncement: '下一级将分为文官/武官！',
    raindropUnit: '雨滴',
    viewTree: '查看完整成长地图 →',
  },
  'zh-TW': {
    level: '等級',
    next: '下一級',
    toNext: (n) => `距下一級還需 ${n.toLocaleString()} 雨滴`,
    scholarBadge: '文官之路',
    warriorBadge: '武官之路',
    commonBadge: '共通',
    branchNeeded: '需要選擇道路',
    branchBtn: '選擇道路',
    specialBadge: '✨ 特殊職位',
    maxLevel: '已達最高等級！',
    branchAnnouncement: '下一級將分為文官/武官！',
    raindropUnit: '雨滴',
    viewTree: '查看完整成長地圖 →',
  },
}

interface Props {
  locale: string
  rank: UserRankResult
}

function routeGradient(route: string | null, level: number): string {
  // 공통 구간: 초록 계열 (농부)
  if (level <= 3 || route === null) return 'from-emerald-400/80 via-emerald-500/70 to-teal-500/80'
  if (route === 'scholar') return 'from-blue-400/80 via-blue-500/70 to-indigo-500/80'
  if (route === 'warrior') return 'from-red-400/80 via-red-500/70 to-rose-500/80'
  return 'from-emerald-400/80 via-emerald-500/70 to-teal-500/80'
}

export function RankCard({ locale, rank }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(rank.needsBranchSelection)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const lc = (['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const).includes(locale as CardLocale) ? (locale as CardLocale) : 'en'
  const t = UI[lc]

  const handleSelect = async (route: 'scholar' | 'warrior') => {
    setErrorMsg(null)
    const res = await fetch('/api/user/select-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ route }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      setErrorMsg((json as { error?: string }).error ?? '설정 실패')
      return
    }
    setModalOpen(false)
    router.refresh()
  }

  const { currentTitle, nextTitle, level, route, raindrops, raindropsToNext, progressPercent, isMaxLevel } = rank
  const bgGradient = routeGradient(route, level)
  const routeBadge = level <= 3 ? t.commonBadge : route === 'scholar' ? t.scholarBadge : route === 'warrior' ? t.warriorBadge : t.branchNeeded
  const isSpecial = currentTitle?.isSpecial === true
  const nextIsSpecial = nextTitle?.isSpecial === true

  return (
    <>
      <div
        className={`relative rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br ${bgGradient} text-white ${isSpecial ? 'ring-4 ring-yellow-300 ring-offset-2 ring-offset-snow' : ''}`}
      >
        {isSpecial && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-yellow-400/90 text-yellow-900 text-[10px] font-black shadow-md">
            {t.specialBadge}
          </div>
        )}

        <div className="p-6 md:p-7">
          {/* 헤더: 레벨 + 루트 뱃지 */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              {t.level} {level}
            </span>
            <span className="text-[11px] font-bold bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              {routeBadge}
            </span>
          </div>

          {/* 현재 직책 */}
          {currentTitle ? (
            <div className="flex items-center gap-4 mb-5">
              <span className="text-6xl drop-shadow-md">{currentTitle.emoji}</span>
              <div>
                <p className="text-2xl md:text-3xl font-black leading-tight">{currentTitle.name}</p>
                {rank.needsBranchSelection ? (
                  <p className="text-xs opacity-90 mt-1">{t.branchNeeded}</p>
                ) : level === 3 && !isMaxLevel ? (
                  <p className="text-xs opacity-90 mt-1">{t.branchAnnouncement}</p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mb-5">
              <p className="text-sm opacity-90">{t.branchNeeded}</p>
            </div>
          )}

          {/* 빗방울 진행률 */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>💧 {raindrops.toLocaleString()} {t.raindropUnit}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {!isMaxLevel && (
              <p className="text-[11px] opacity-80 mt-1">{t.toNext(raindropsToNext)}</p>
            )}
            {isMaxLevel && (
              <p className="text-[11px] font-bold opacity-90 mt-1">🏆 {t.maxLevel}</p>
            )}
          </div>

          {/* 다음 직책 미리보기 */}
          {nextTitle && !rank.needsBranchSelection && (
            <div className={`mt-3 flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 ${nextIsSpecial ? 'ring-2 ring-yellow-300/60' : ''}`}>
              <span className="text-xs opacity-80">{t.next}:</span>
              <span className="text-base">{nextTitle.emoji}</span>
              <span className="text-sm font-bold">{nextTitle.name}</span>
              {nextIsSpecial && <span className="text-[10px] font-black text-yellow-200 ml-auto">✨</span>}
            </div>
          )}

          {/* 분기 선택 CTA (Lv 4+ route=null) */}
          {rank.needsBranchSelection && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-3 w-full py-3 rounded-full bg-white text-[#111] font-black text-sm hover:bg-white/90 transition-colors"
            >
              {t.branchBtn}
            </button>
          )}

          {errorMsg && (
            <p className="mt-3 text-xs text-yellow-100 font-bold">{errorMsg}</p>
          )}

          <Link
            href={`/${locale}/mypage/tech-tree`}
            className="mt-3 block text-center text-xs font-bold text-white/90 hover:text-white underline-offset-2 hover:underline"
          >
            {t.viewTree}
          </Link>
        </div>
      </div>

      <BranchSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelect}
        canClose={!rank.needsBranchSelection}
        locale={locale}
      />
    </>
  )
}
