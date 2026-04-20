'use client'

import { Check, Loader2 } from 'lucide-react'
import type { Pass } from '@/lib/data/passes'

interface Props {
  pass: Pass
  locale: string
  isOwned: boolean
  isProcessing?: boolean
  disabled?: boolean
  savingsLabel?: string  // 이미 번역된 문자열 (예: "₩3,800 절약")
  ownedLabel: string
  purchaseLabel: string
  onPurchase: (passId: string) => void
}

type I18nKey = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

function pick(obj: Record<string, string>, locale: string): string {
  const k = locale as I18nKey
  return obj[k] || obj.en || obj.ko || ''
}

// 피처 i18n — DB/코드 모두 문자열 키 사용, 5개 로케일 라벨
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
  lp_multiplier_2x: { ko: 'LP 2배 적립', ja: 'LP 2倍獲得', en: '2x LP earning', 'zh-CN': 'LP 双倍积累', 'zh-TW': 'LP 雙倍累積' },
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
}: Props) {
  const isAllInOne = pass.id === 'allinone'
  const tagline = pick(pass.tagline, locale)
  const description = pick(pass.description, locale)
  const badge = pass.badge ? pick(pass.badge, locale) : null

  return (
    <div
      className={[
        'relative rounded-2xl p-5 border-2 bg-white transition-all',
        'shadow-sm hover:shadow-lg',
        isAllInOne
          ? 'border-transparent bg-gradient-to-br from-amber-50 via-white to-rose-50'
          : 'border-mist/60 hover:border-mint-deep/40',
      ].join(' ')}
      style={
        isAllInOne
          ? { boxShadow: '0 0 0 2px rgba(234,179,8,0.4), 0 8px 24px rgba(239,68,68,0.08)' }
          : undefined
      }
    >
      {badge && (
        <span
          className={[
            'absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm',
            isAllInOne ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-white' : 'bg-mint-deep text-white',
          ].join(' ')}
        >
          {badge}
        </span>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-4xl leading-none">{pass.icon}</span>
          <span className="text-lg font-black text-slate-800">{pass.name}</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-800">
            ₩{pass.price.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 font-bold">/ mo</p>
        </div>
      </div>

      <p className="text-sm text-slate-500 italic leading-snug mb-3">
        &ldquo;{tagline}&rdquo;
      </p>

      {isAllInOne && savingsLabel && (
        <p className="text-xs font-black text-rose-500 mb-3">💰 {savingsLabel}</p>
      )}

      <ul className="space-y-1.5 mb-4 min-h-[100px]">
        {pass.features.map((fKey) => {
          const label = FEATURE_LABELS[fKey]
          const text = label ? pick(label, locale) : fKey
          return (
            <li key={fKey} className="flex items-start gap-1.5 text-xs text-slate-600">
              <Check className="w-3.5 h-3.5 text-mint-deep shrink-0 mt-0.5" />
              <span>{text}</span>
            </li>
          )
        })}
      </ul>

      <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">{description}</p>

      {isOwned ? (
        <button
          type="button"
          disabled
          className="w-full py-2.5 rounded-xl bg-mint/20 border-2 border-mint-deep text-mint-deep font-black text-sm flex items-center justify-center gap-1.5"
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
            'w-full py-2.5 rounded-xl font-black text-sm transition-opacity disabled:opacity-60 flex items-center justify-center gap-1.5',
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
  )
}
