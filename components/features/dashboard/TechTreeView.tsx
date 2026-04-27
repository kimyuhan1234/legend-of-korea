'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LEVEL_THRESHOLDS, type UserRankResult } from '@/lib/tiers/levels'
import { RaindropIcon } from '@/components/shared/icons/RaindropIcon'

export interface TechTreeNode {
  level: number
  route: 'common' | 'scholar' | 'warrior'
  name: string
  emoji: string
  isSpecial: boolean
}

type TreeLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const UI: Record<TreeLocale, {
  title: string
  subtitle: string
  common: string
  scholar: string
  warrior: string
  branchPoint: string
  current: string
  completed: string
  locked: string
  specialPosition: string
  requiredRaindrops: (n: number) => string
  clickForDetail: string
  backToDashboard: string
  branchTitle: string
  branchLead: string
  scholarSuits: string
  scholarBullets: string[]
  warriorSuits: string
  warriorBullets: string[]
}> = {
  ko: {
    title: '전체 성장 지도',
    subtitle: '빗방울을 모아 나만의 길을 걷는다',
    common: '공통 구간',
    scholar: '문관의 길',
    warrior: '무관의 길',
    branchPoint: '⚡ Lv 4에서 분기',
    current: '현재 위치',
    completed: '달성',
    locked: '잠금',
    specialPosition: '✨ 특수 직위',
    requiredRaindrops: (n) => `필요 빗방울 ${n.toLocaleString()}`,
    clickForDetail: '노드를 누르면 상세 정보',
    backToDashboard: '← 대시보드로',
    branchTitle: '⚡ Lv 4에서 길이 나뉩니다',
    branchLead: '당신의 활동에 따라 어울리는 길이 다릅니다.',
    scholarSuits: '📖 문관의 길에 적합',
    scholarBullets: [
      '리뷰 작성을 즐기는 사람',
      '역사/문화 콘텐츠를 좋아하는 사람',
      '퀘스트 스토리를 깊이 탐험하는 사람',
    ],
    warriorSuits: '🥋 무관의 길에 적합',
    warriorBullets: [
      '다양한 장소를 방문하는 사람',
      '미션 클리어를 즐기는 사람',
      '액티비티 중심 여행자',
    ],
  },
  en: {
    title: 'Growth Map',
    subtitle: 'Collect raindrops, walk your own path',
    common: 'Common',
    scholar: 'Scholar Path',
    warrior: 'Warrior Path',
    branchPoint: '⚡ Branch at Lv 4',
    current: 'Current',
    completed: 'Completed',
    locked: 'Locked',
    specialPosition: '✨ Special Position',
    requiredRaindrops: (n) => `${n.toLocaleString()} raindrops`,
    clickForDetail: 'Tap a node for details',
    backToDashboard: '← Back to dashboard',
    branchTitle: '⚡ Paths diverge at Lv 4',
    branchLead: 'Your activities shape the path that suits you.',
    scholarSuits: '📖 Scholar path suits',
    scholarBullets: [
      'Those who enjoy writing reviews',
      'Those who love history/culture content',
      'Those who deeply explore quest stories',
    ],
    warriorSuits: '🥋 Warrior path suits',
    warriorBullets: [
      'Those who visit many places',
      'Those who enjoy mission clearing',
      'Activity-focused travelers',
    ],
  },
  ja: {
    title: '成長マップ',
    subtitle: '雨滴を集めて自分の道を歩む',
    common: '共通区間',
    scholar: '文官の道',
    warrior: '武官の道',
    branchPoint: '⚡ Lv 4で分岐',
    current: '現在',
    completed: '達成',
    locked: 'ロック',
    specialPosition: '✨ 特殊職',
    requiredRaindrops: (n) => `必要雨滴 ${n.toLocaleString()}`,
    clickForDetail: 'ノードを押すと詳細',
    backToDashboard: '← ダッシュボードへ',
    branchTitle: '⚡ Lv 4で道が分かれます',
    branchLead: 'あなたの活動によって合う道が異なります。',
    scholarSuits: '📖 文官の道に向いています',
    scholarBullets: [
      'レビューを書くのが好きな人',
      '歴史・文化コンテンツを好む人',
      'クエストのストーリーを深く探索する人',
    ],
    warriorSuits: '🥋 武官の道に向いています',
    warriorBullets: [
      '様々な場所を訪れる人',
      'ミッションクリアを楽しむ人',
      'アクティビティ中心の旅行者',
    ],
  },
  'zh-CN': {
    title: '成长地图',
    subtitle: '收集雨滴，走自己的路',
    common: '共通',
    scholar: '文官之路',
    warrior: '武官之路',
    branchPoint: '⚡ Lv 4 分岔',
    current: '当前',
    completed: '已达成',
    locked: '锁定',
    specialPosition: '✨ 特殊职位',
    requiredRaindrops: (n) => `需要 ${n.toLocaleString()} 雨滴`,
    clickForDetail: '点击节点查看详情',
    backToDashboard: '← 返回仪表板',
    branchTitle: '⚡ Lv 4 道路分岔',
    branchLead: '您的活动决定适合的道路。',
    scholarSuits: '📖 适合文官之路',
    scholarBullets: [
      '喜欢撰写评论的人',
      '喜爱历史/文化内容的人',
      '深入探索任务剧情的人',
    ],
    warriorSuits: '🥋 适合武官之路',
    warriorBullets: [
      '喜欢探访多地的人',
      '喜欢完成任务的人',
      '以活动为主的旅行者',
    ],
  },
  'zh-TW': {
    title: '成長地圖',
    subtitle: '收集雨滴，走自己的路',
    common: '共通',
    scholar: '文官之路',
    warrior: '武官之路',
    branchPoint: '⚡ Lv 4 分岔',
    current: '當前',
    completed: '已達成',
    locked: '鎖定',
    specialPosition: '✨ 特殊職位',
    requiredRaindrops: (n) => `需要 ${n.toLocaleString()} 雨滴`,
    clickForDetail: '點擊節點查看詳情',
    backToDashboard: '← 返回儀表板',
    branchTitle: '⚡ Lv 4 道路分岔',
    branchLead: '您的活動決定適合的道路。',
    scholarSuits: '📖 適合文官之路',
    scholarBullets: [
      '喜歡撰寫評論的人',
      '喜愛歷史/文化內容的人',
      '深入探索任務劇情的人',
    ],
    warriorSuits: '🥋 適合武官之路',
    warriorBullets: [
      '喜歡探訪多地的人',
      '喜歡完成任務的人',
      '以活動為主的旅行者',
    ],
  },
}

interface Props {
  locale: string
  rank: UserRankResult
  nodes: TechTreeNode[]
}

type NodeState = 'completed' | 'current' | 'upcoming' | 'locked'

function nodeState(node: TechTreeNode, rank: UserRankResult): NodeState {
  const { level, route } = node

  // 공통 구간
  if (route === 'common') {
    if (level < rank.level) return 'completed'
    if (level === rank.level && rank.level <= 3) return 'current'
    return 'upcoming'
  }

  // 분기 경로
  const userRoute = rank.route
  if (!userRoute) return 'locked' // 분기 미선택 — 양쪽 모두 잠금
  if (userRoute !== route) return 'locked' // 반대 루트

  // 선택한 루트
  if (level < rank.level) return 'completed'
  if (level === rank.level) return 'current'
  return 'upcoming'
}

function requiredRaindrops(level: number): number {
  return LEVEL_THRESHOLDS[level - 1] ?? 0
}

function NodeBox({
  node,
  state,
  onClick,
  isSelected,
  currentLabel,
}: {
  node: TechTreeNode
  state: NodeState
  onClick: () => void
  isSelected: boolean
  currentLabel: string
}) {
  const baseClasses = 'w-full rounded-2xl border-2 p-3 md:p-4 transition-all duration-200 text-left'
  const stateClasses: Record<NodeState, string> = {
    completed: 'bg-white border-emerald-400 hover:border-emerald-500',
    current: 'bg-gradient-to-br from-mint to-blossom text-ink border-mint-deep animate-pulse',
    upcoming: 'bg-white border-mist hover:border-mint-deep opacity-80',
    locked: 'bg-cloud border-mist opacity-30 cursor-not-allowed',
  }
  const specialRing = node.isSpecial && state !== 'locked' ? ' ring-4 ring-yellow-300 ring-offset-1' : ''
  const selectedRing = isSelected ? ' ring-4 ring-blue-400 ring-offset-1' : ''

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === 'locked'}
      className={`${baseClasses} ${stateClasses[state]}${specialRing}${selectedRing}`}
    >
      <div className="flex items-start gap-2 md:gap-3">
        <span className="text-2xl md:text-3xl shrink-0">{node.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[10px] font-black opacity-70">Lv {node.level}</span>
            {node.isSpecial && state !== 'locked' && (
              <span className="text-[9px] text-yellow-600 font-black">✨</span>
            )}
            {state === 'completed' && <span className="text-[10px] text-emerald-600">✓</span>}
            {state === 'locked' && <span className="text-[10px]">🔒</span>}
            {state === 'current' && <span className="text-[10px] font-black">· {currentLabel}</span>}
          </div>
          <p className="text-xs md:text-sm font-black leading-tight truncate">{node.name}</p>
        </div>
      </div>
    </button>
  )
}

function Connector() {
  return (
    <div className="flex justify-center my-1">
      <span className="text-mint-deep text-lg leading-none">↓</span>
    </div>
  )
}

export function TechTreeView({ locale, rank, nodes }: Props) {
  const lc = (['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const).includes(locale as TreeLocale)
    ? (locale as TreeLocale)
    : 'en'
  const t = UI[lc]

  const common = nodes.filter((n) => n.route === 'common').sort((a, b) => a.level - b.level)
  const scholar = nodes.filter((n) => n.route === 'scholar').sort((a, b) => a.level - b.level)
  const warrior = nodes.filter((n) => n.route === 'warrior').sort((a, b) => a.level - b.level)

  const [selected, setSelected] = useState<TechTreeNode | null>(
    rank.currentTitle
      ? nodes.find(
          (n) => n.level === rank.currentTitle!.level && n.route === (rank.currentTitle!.route as TechTreeNode['route'])
        ) ?? null
      : null
  )

  const selectedState = selected ? nodeState(selected, rank) : null

  return (
    <div className="min-h-screen bg-snow pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8">
        <Link
          href={`/${locale}/mypage`}
          className="inline-block text-sm font-bold text-mint-deep hover:underline mb-4"
        >
          {t.backToDashboard}
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-[#111]">{t.title}</h1>
        <p className="text-sm text-stone mt-1">{t.subtitle}</p>
        <p className="text-[11px] text-stone/70 mt-1">💡 {t.clickForDetail}</p>
      </div>

      <div className="max-w-md mx-auto px-4 mt-8 space-y-2">
        {/* 공통 구간 배지 */}
        <div className="text-center">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            {t.common}
          </span>
        </div>

        {/* 공통 3개 세로 */}
        {common.map((node, i) => (
          <div key={`common-${node.level}`}>
            <NodeBox
              node={node}
              state={nodeState(node, rank)}
              onClick={() => setSelected(node)}
              isSelected={selected?.level === node.level && selected.route === node.route}
              currentLabel={t.current}
            />
            {i < common.length - 1 && <Connector />}
          </div>
        ))}

        {/* 분기점 */}
        <div className="relative py-5 text-center">
          <span className="inline-block text-xs font-black bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-white px-4 py-1.5 rounded-full shadow-lg">
            {t.branchPoint}
          </span>
        </div>
      </div>

      {/* 분기점 활동 가이드 설명 박스 */}
      <div className="max-w-3xl mx-auto px-4 mb-6">
        <div className="rounded-3xl border border-mist bg-white shadow-sm p-5 md:p-6">
          <div className="text-center mb-5">
            <p className="text-base md:text-lg font-black text-[#111]">{t.branchTitle}</p>
            <p className="text-xs text-stone mt-1">{t.branchLead}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 문관 */}
            <div className="rounded-2xl border-l-4 border-blue-400 bg-blue-50/40 p-4">
              <p className="text-sm font-black text-blue-700 mb-2">{t.scholarSuits}</p>
              <ul className="space-y-1">
                {t.scholarBullets.map((b, i) => (
                  <li key={i} className="text-xs text-slate flex gap-1.5">
                    <span className="text-blue-400 shrink-0">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* 무관 */}
            <div className="rounded-2xl border-l-4 border-red-400 bg-red-50/40 p-4">
              <p className="text-sm font-black text-red-700 mb-2">{t.warriorSuits}</p>
              <ul className="space-y-1">
                {t.warriorBullets.map((b, i) => (
                  <li key={i} className="text-xs text-slate flex gap-1.5">
                    <span className="text-red-400 shrink-0">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 문관/무관 좌우 분기 */}
      <div className="max-w-3xl mx-auto px-4 grid grid-cols-2 gap-3 md:gap-6">
        {/* 문관 */}
        <div className="space-y-2">
          <div className="text-center">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              📖 {t.scholar}
            </span>
          </div>
          {scholar.map((node, i) => (
            <div key={`scholar-${node.level}`}>
              <NodeBox
                node={node}
                state={nodeState(node, rank)}
                onClick={() => setSelected(node)}
                isSelected={selected?.level === node.level && selected.route === node.route}
                currentLabel={t.current}
              />
              {i < scholar.length - 1 && <Connector />}
            </div>
          ))}
        </div>

        {/* 무관 */}
        <div className="space-y-2">
          <div className="text-center">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 px-3 py-1 rounded-full">
              🥋 {t.warrior}
            </span>
          </div>
          {warrior.map((node, i) => (
            <div key={`warrior-${node.level}`}>
              <NodeBox
                node={node}
                state={nodeState(node, rank)}
                onClick={() => setSelected(node)}
                isSelected={selected?.level === node.level && selected.route === node.route}
                currentLabel={t.current}
              />
              {i < warrior.length - 1 && <Connector />}
            </div>
          ))}
        </div>
      </div>

      {/* 상세 패널 */}
      {selected && (
        <div className="max-w-3xl mx-auto px-4 mt-10">
          <div
            className={`rounded-3xl border-2 p-5 md:p-6 bg-white shadow-sm ${selected.isSpecial ? 'border-yellow-300' : 'border-mist'}`}
          >
            <div className="flex items-center gap-4 mb-3">
              <span className="text-5xl md:text-6xl">{selected.emoji}</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone">
                  Lv {selected.level} · {selected.route === 'common' ? t.common : selected.route === 'scholar' ? t.scholar : t.warrior}
                </p>
                <p className="text-xl md:text-2xl font-black text-[#111] mt-0.5">{selected.name}</p>
                {selected.isSpecial && (
                  <p className="text-xs font-black text-yellow-600 mt-1">{t.specialPosition}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate mt-4 pt-4 border-t border-mist">
              <span className="inline-flex items-center gap-1">
                <RaindropIcon size={12} className="text-mint-deep" />
                {t.requiredRaindrops(requiredRaindrops(selected.level))}
              </span>
              <span className="font-bold">
                {selectedState === 'completed' && `✓ ${t.completed}`}
                {selectedState === 'current' && `★ ${t.current}`}
                {selectedState === 'locked' && `🔒 ${t.locked}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
