'use client'

import { useState } from 'react'
import type { StayTags } from '@/lib/tour-api/stay-tags'
import { STAY_TAG_AXES } from '@/lib/tour-api/stay-tags'

type PrefLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const AXIS_LABELS: Record<keyof StayTags, Record<PrefLocale, { left: string; right: string; icon: string }>> = {
  'busy-quiet': {
    ko: { left: '번화', right: '조용', icon: '🏙️' },
    en: { left: 'Busy', right: 'Quiet', icon: '🏙️' },
    ja: { left: '賑やか', right: '静か', icon: '🏙️' },
    'zh-CN': { left: '繁华', right: '安静', icon: '🏙️' },
    'zh-TW': { left: '繁華', right: '安靜', icon: '🏙️' },
  },
  'modern-traditional': {
    ko: { left: '모던', right: '전통', icon: '✨' },
    en: { left: 'Modern', right: 'Traditional', icon: '✨' },
    ja: { left: 'モダン', right: '伝統', icon: '✨' },
    'zh-CN': { left: '现代', right: '传统', icon: '✨' },
    'zh-TW': { left: '現代', right: '傳統', icon: '✨' },
  },
  'budget-premium': {
    ko: { left: '경제', right: '프리미엄', icon: '💎' },
    en: { left: 'Budget', right: 'Premium', icon: '💎' },
    ja: { left: 'コスパ', right: 'プレミアム', icon: '💎' },
    'zh-CN': { left: '经济', right: '高端', icon: '💎' },
    'zh-TW': { left: '經濟', right: '高端', icon: '💎' },
  },
  'solo-family': {
    ko: { left: '혼자', right: '가족', icon: '👥' },
    en: { left: 'Solo', right: 'Family', icon: '👥' },
    ja: { left: 'ひとり', right: '家族', icon: '👥' },
    'zh-CN': { left: '独行', right: '家庭', icon: '👥' },
    'zh-TW': { left: '獨行', right: '家庭', icon: '👥' },
  },
  'short-long': {
    ko: { left: '단기', right: '장기', icon: '🗓️' },
    en: { left: 'Short', right: 'Long', icon: '🗓️' },
    ja: { left: '短期', right: '長期', icon: '🗓️' },
    'zh-CN': { left: '短期', right: '长期', icon: '🗓️' },
    'zh-TW': { left: '短期', right: '長期', icon: '🗓️' },
  },
  'indoor-outdoor': {
    ko: { left: '실내', right: '야외', icon: '🌿' },
    en: { left: 'Indoor', right: 'Outdoor', icon: '🌿' },
    ja: { left: '室内', right: '野外', icon: '🌿' },
    'zh-CN': { left: '室内', right: '户外', icon: '🌿' },
    'zh-TW': { left: '室內', right: '戶外', icon: '🌿' },
  },
  'urban-nature': {
    ko: { left: '도심', right: '자연', icon: '🌳' },
    en: { left: 'Urban', right: 'Nature', icon: '🌳' },
    ja: { left: '都市', right: '自然', icon: '🌳' },
    'zh-CN': { left: '都市', right: '自然', icon: '🌳' },
    'zh-TW': { left: '都市', right: '自然', icon: '🌳' },
  },
  'casual-luxury': {
    ko: { left: '캐주얼', right: '럭셔리', icon: '👑' },
    en: { left: 'Casual', right: 'Luxury', icon: '👑' },
    ja: { left: 'カジュアル', right: 'ラグジュアリー', icon: '👑' },
    'zh-CN': { left: '休闲', right: '奢华', icon: '👑' },
    'zh-TW': { left: '休閒', right: '奢華', icon: '👑' },
  },
  'insta-practical': {
    ko: { left: '감성', right: '실용', icon: '📸' },
    en: { left: 'Insta', right: 'Practical', icon: '📸' },
    ja: { left: '映え', right: '実用', icon: '📸' },
    'zh-CN': { left: '拍照', right: '实用', icon: '📸' },
    'zh-TW': { left: '拍照', right: '實用', icon: '📸' },
  },
}

const UI_TEXT: Record<PrefLocale, { title: string; subtitle: string; apply: string; reset: string; expand: string; collapse: string }> = {
  ko: { title: '당신의 숙소 성향', subtitle: '9개 축을 조절하면 맞는 숙소를 추천해드려요', apply: '추천 받기', reset: '초기화', expand: '성향 설정 열기', collapse: '성향 접기' },
  en: { title: 'Your stay preferences', subtitle: 'Adjust 9 axes to get matching stays', apply: 'Get recommendations', reset: 'Reset', expand: 'Open preferences', collapse: 'Collapse' },
  ja: { title: 'あなたの宿泊傾向', subtitle: '9つの軸を調整すると合う宿を提案', apply: 'おすすめを見る', reset: 'リセット', expand: '設定を開く', collapse: '閉じる' },
  'zh-CN': { title: '您的住宿偏好', subtitle: '调整9个轴获取匹配住宿', apply: '获取推荐', reset: '重置', expand: '展开设置', collapse: '收起' },
  'zh-TW': { title: '您的住宿偏好', subtitle: '調整9個軸獲取匹配住宿', apply: '獲取推薦', reset: '重置', expand: '展開設定', collapse: '收起' },
}

const NEUTRAL: StayTags = {
  'busy-quiet': 0,
  'modern-traditional': 0,
  'budget-premium': 0,
  'solo-family': 0,
  'short-long': 0,
  'indoor-outdoor': 0,
  'urban-nature': 0,
  'casual-luxury': 0,
  'insta-practical': 0,
}

interface Props {
  locale: string
  onApply: (prefs: StayTags) => void
}

export function StayPreferencePanel({ locale, onApply }: Props) {
  const [prefs, setPrefs] = useState<StayTags>(NEUTRAL)
  const [open, setOpen] = useState(false)

  const t = UI_TEXT[locale as PrefLocale] ?? UI_TEXT.en
  const lc = (locale as PrefLocale) in AXIS_LABELS['busy-quiet'] ? (locale as PrefLocale) : 'en'

  const updateAxis = (axis: keyof StayTags, value: number) => {
    setPrefs((prev) => ({ ...prev, [axis]: value }))
  }

  return (
    <section className="bg-white rounded-3xl border border-mist/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-cloud/30 transition-colors"
      >
        <div className="text-left">
          <h2 className="text-lg font-black text-[#111]">{t.title}</h2>
          <p className="text-xs text-stone mt-0.5">{t.subtitle}</p>
        </div>
        <span className="text-xs font-bold text-mint-deep shrink-0 ml-4">
          {open ? t.collapse : t.expand} {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-4 border-t border-mist/40 pt-5">
          {STAY_TAG_AXES.map((axis) => {
            const label = AXIS_LABELS[axis][lc]
            const v = prefs[axis]
            return (
              <div key={axis}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#374151] flex items-center gap-1">
                    <span>{label.icon}</span>
                    <span>{label.left}</span>
                  </span>
                  <span className="text-xs font-mono text-mint-deep">{v > 0 ? `+${v}` : v}</span>
                  <span className="text-xs font-bold text-[#374151]">{label.right}</span>
                </div>
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={1}
                  value={v}
                  onChange={(e) => updateAxis(axis, parseInt(e.target.value, 10))}
                  className="w-full accent-mint-deep"
                  aria-label={`${label.left} – ${label.right}`}
                />
              </div>
            )
          })}

          <div className="flex gap-2 pt-3 border-t border-mist/40">
            <button
              type="button"
              onClick={() => setPrefs(NEUTRAL)}
              className="px-4 py-2.5 rounded-full border border-mist text-sm font-bold text-slate hover:bg-cloud transition-colors"
            >
              {t.reset}
            </button>
            <button
              type="button"
              onClick={() => onApply(prefs)}
              className="flex-1 py-2.5 rounded-full bg-gradient-to-br from-mint to-blossom text-ink font-black text-sm hover:opacity-90 transition"
            >
              {t.apply}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
