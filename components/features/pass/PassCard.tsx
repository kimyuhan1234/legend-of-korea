'use client'

import Image from 'next/image'
import { Check, Loader2 } from 'lucide-react'
import type { Pass } from '@/lib/data/passes'
import { formatPriceParts } from '@/lib/currency'
import { BetaPriceBadge } from '@/components/shared/BetaPriceBadge'

interface Props {
  pass: Pass
  locale: string
  isOwned: boolean
  isProcessing?: boolean
  disabled?: boolean
  savingsLabel?: string
  ownedLabel: string
  purchaseLabel: string
  onPurchase: (passId: string) => void
  layout?: 'horizontal' | 'vertical'
}

type I18nKey = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

function pick(obj: Record<string, string>, locale: string): string {
  const k = locale as I18nKey
  return obj[k] || obj.en || obj.ko || ''
}

const FEATURE_LABELS: Record<string, Record<I18nKey, string>> = {
  traffic: { ko: 'TRAFFIC 경로 최적화', ja: 'TRAFFICルート最適化', en: 'TRAFFIC route optimization', 'zh-CN': 'TRAFFIC 路线优化', 'zh-TW': 'TRAFFIC 路線優化' },
  spot: { ko: 'SPOT 추천', ja: 'SPOT推薦', en: 'SPOT picks', 'zh-CN': 'SPOT 推荐', 'zh-TW': 'SPOT 推薦' },
  ai_curation: { ko: 'AI 큐레이션', ja: 'AIキュレーション', en: 'AI curation', 'zh-CN': 'AI 精选', 'zh-TW': 'AI 精選' },
  kfood: { ko: 'K-Food 맛집', ja: 'K-Foodグルメ', en: 'K-Food spots', 'zh-CN': 'K-Food 美食', 'zh-TW': 'K-Food 美食' },
  stay: { ko: '숙소 추천', ja: '宿泊推薦', en: 'Stay picks', 'zh-CN': '住宿推荐', 'zh-TW': '住宿推薦' },
  ootd: { ko: 'OOTD 스타일', ja: 'OOTDスタイル', en: 'OOTD style', 'zh-CN': 'OOTD 穿搭', 'zh-TW': 'OOTD 穿搭' },
  quest: { ko: 'QUEST 미션', ja: 'QUESTミッション', en: 'QUEST missions', 'zh-CN': 'QUEST 任务', 'zh-TW': 'QUEST 任務' },
  diy: { ko: 'DIY 공방', ja: 'DIY工房', en: 'DIY workshops', 'zh-CN': 'DIY 工坊', 'zh-TW': 'DIY 工坊' },
  memories: { ko: 'MEMORIES 기록관', ja: 'MEMORIES記録室', en: 'MEMORIES archive', 'zh-CN': 'MEMORIES 记录室', 'zh-TW': 'MEMORIES 記錄室' },
  all: { ko: '전 기능 무제한', ja: '全機能無制限', en: 'All features unlimited', 'zh-CN': '全功能无限', 'zh-TW': '全功能無限' },
  vip_badge: { ko: 'VIP 뱃지', ja: 'VIPバッジ', en: 'VIP badge', 'zh-CN': 'VIP 徽章', 'zh-TW': 'VIP 徽章' },
  lp_multiplier_2x: { ko: '빗방울 2배 적립', ja: '雨滴2倍獲得', en: '2x Raindrops earning', 'zh-CN': '雨滴双倍积累', 'zh-TW': '雨滴雙倍累積' },
  monthly_credits_100: { ko: '매달 100 크레딧', ja: '毎月100クレジット', en: '100 credits / month', 'zh-CN': '每月 100 积分', 'zh-TW': '每月 100 積分' },
}

export function PassCard({
  pass,
  locale,
  isOwned,
  isProcessing,
  disabled,
  savingsLabel,
  ownedLabel,
  purchaseLabel,
  onPurchase,
  layout = 'horizontal',
}: Props) {
  const isAllInOne = pass.id === 'allinone'
  const isVertical = layout === 'vertical'
  const tagline = pick(pass.tagline, locale)
  const badge = pass.badge ? pick(pass.badge, locale) : null
  const price = formatPriceParts(pass.price, locale)

  return (
    <div
      className={[
        isVertical ? 'flex flex-col h-full' : 'flex flex-col md:flex-row',
        'rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all border',
        isAllInOne
          ? 'border-amber-400/40 ring-2 ring-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
          : 'border-slate-200/80',
      ].join(' ')}
    >
      {/* 이미지 */}
      <div className={
        isVertical
          ? 'relative w-full h-44 shrink-0'
          : 'relative w-full md:w-[45%] h-48 md:h-auto md:min-h-[220px] shrink-0'
      }>
        <Image
          src={`/images/pass/${pass.id}.png`}
          alt={pass.name}
          fill
          sizes={isVertical ? '(max-width: 768px) 100vw, 360px' : '(max-width: 768px) 100vw, 360px'}
          className="object-cover"
        />

        {/* 이미지 위 패스 이름 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{pass.icon}</span>
            <span className="text-white font-black text-xl drop-shadow-sm">{pass.name}</span>
          </div>
        </div>
      </div>

      {/* 절취선 */}
      {isVertical ? (
        <div className="relative h-0 border-t-2 border-dashed border-slate-200">
          <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-slate-50" aria-hidden />
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-50" aria-hidden />
        </div>
      ) : (
        <>
          {/* 데스크탑 세로선 */}
          <div className="hidden md:block relative w-0 border-l-2 border-dashed border-slate-200">
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-slate-50" aria-hidden />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-slate-50" aria-hidden />
          </div>
          {/* 모바일 가로선 */}
          <div className="block md:hidden relative h-0 border-t-2 border-dashed border-slate-200">
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-slate-50" aria-hidden />
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-50" aria-hidden />
          </div>
        </>
      )}

      {/* 오른쪽/하단: 설명 + 가격 + CTA */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* 가격 + 뱃지 (환산값은 한국어 외 로케일에서만 노출) */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              <span className="text-2xl font-black text-slate-800">
                {price.primary}
                <span className="text-[10px] text-slate-400 font-bold ml-1">/ mo</span>
              </span>
              {price.secondary && (
                <span className="block text-[13px] text-slate-400 leading-tight mt-0.5">
                  {price.secondary}
                </span>
              )}
            </div>
            {badge && (
              <span
                className={[
                  'px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 shadow-sm',
                  isAllInOne
                    ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-white'
                    : 'bg-mint-deep text-white',
                ].join(' ')}
              >
                {badge}
              </span>
            )}
          </div>

          {/* 베타 배지 */}
          <div className="mb-2">
            <BetaPriceBadge />
          </div>

          {/* 절약 뱃지 (All in One) */}
          {isAllInOne && savingsLabel && (
            <p className="text-xs font-black text-rose-500 mb-2">💰 {savingsLabel}</p>
          )}

          {/* tagline */}
          <p className="text-sm text-slate-500 italic leading-snug mb-3">
            &ldquo;{tagline}&rdquo;
          </p>

          {/* 피처 리스트 */}
          <div className="space-y-1.5">
            {pass.features.map((fKey) => {
              const label = FEATURE_LABELS[fKey]
              const text = label ? pick(label, locale) : fKey
              return (
                <div key={fKey} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Check className="w-3.5 h-3.5 text-mint-deep shrink-0" />
                  <span>{text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        {isOwned ? (
          <button
            type="button"
            disabled
            className="w-full mt-4 py-2.5 rounded-xl bg-mint/20 border-2 border-mint-deep text-mint-deep font-black text-sm flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {ownedLabel}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onPurchase(pass.id)}
            disabled={disabled || isProcessing}
            className={[
              'w-full mt-4 py-2.5 rounded-xl font-black text-sm transition-opacity disabled:opacity-60 flex items-center justify-center gap-1.5',
              isAllInOne
                ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-white hover:opacity-90'
                : 'bg-gradient-to-br from-mint to-blossom text-ink hover:opacity-90',
            ].join(' ')}
          >
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
            {purchaseLabel}
          </button>
        )}
      </div>
    </div>
  )
}
