'use client'

import { useState } from 'react'

type ModalLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const UI: Record<ModalLocale, {
  title: string
  scholarName: string; scholarDesc: string; scholarPath: string; scholarBtn: string
  warriorName: string; warriorDesc: string; warriorPath: string; warriorBtn: string
  warning: string
  processing: string
  close: string
}> = {
  ko: {
    title: '당신의 길을 선택하세요',
    scholarName: '문관의 길',
    scholarDesc: '글과 지혜로 세상을 다스린다',
    scholarPath: '선비 → 암행어사 → 영의정',
    scholarBtn: '선비의 길',
    warriorName: '무관의 길',
    warriorDesc: '힘과 용맹으로 세상을 수호한다',
    warriorPath: '병사 → 왕실 근위대 → 대장군',
    warriorBtn: '무사의 길',
    warning: '⚠ 한 번 선택하면 변경이 어렵습니다',
    processing: '설정 중…',
    close: '닫기',
  },
  en: {
    title: 'Choose your path',
    scholarName: 'Path of the Scholar',
    scholarDesc: 'Rule the world with wisdom and letters',
    scholarPath: 'Scholar → Royal Inspector → Prime Minister',
    scholarBtn: 'Scholar Path',
    warriorName: 'Path of the Warrior',
    warriorDesc: 'Protect the world with strength and valor',
    warriorPath: 'Soldier → Royal Guard → Great General',
    warriorBtn: 'Warrior Path',
    warning: '⚠ Once chosen, it cannot be easily changed',
    processing: 'Saving…',
    close: 'Close',
  },
  ja: {
    title: 'あなたの道を選んでください',
    scholarName: '文官の道',
    scholarDesc: '文字と知恵で世を治める',
    scholarPath: '士 → 暗行御史 → 領議政',
    scholarBtn: '士の道',
    warriorName: '武官の道',
    warriorDesc: '力と勇気で世を守る',
    warriorPath: '兵士 → 王室近衛隊 → 大将軍',
    warriorBtn: '武士の道',
    warning: '⚠ 一度選ぶと変更は困難です',
    processing: '設定中…',
    close: '閉じる',
  },
  'zh-CN': {
    title: '请选择您的道路',
    scholarName: '文官之路',
    scholarDesc: '以文字与智慧治理天下',
    scholarPath: '士 → 暗行御史 → 领议政',
    scholarBtn: '士之路',
    warriorName: '武官之路',
    warriorDesc: '以力量与勇气守护天下',
    warriorPath: '士兵 → 王室近卫 → 大将军',
    warriorBtn: '武士之路',
    warning: '⚠ 一旦选择，难以更改',
    processing: '保存中…',
    close: '关闭',
  },
  'zh-TW': {
    title: '請選擇您的道路',
    scholarName: '文官之路',
    scholarDesc: '以文字與智慧治理天下',
    scholarPath: '士 → 暗行御史 → 領議政',
    scholarBtn: '士之路',
    warriorName: '武官之路',
    warriorDesc: '以力量與勇氣守護天下',
    warriorPath: '士兵 → 王室近衛 → 大將軍',
    warriorBtn: '武士之路',
    warning: '⚠ 一旦選擇，難以更改',
    processing: '儲存中…',
    close: '關閉',
  },
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (route: 'scholar' | 'warrior') => Promise<void>
  canClose: boolean
  locale: string
}

export function BranchSelectionModal({ isOpen, onClose, onSelect, canClose, locale }: Props) {
  const [submitting, setSubmitting] = useState<'scholar' | 'warrior' | null>(null)
  const lc = (['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const).includes(locale as ModalLocale) ? (locale as ModalLocale) : 'en'
  const t = UI[lc]

  if (!isOpen) return null

  const handle = async (route: 'scholar' | 'warrior') => {
    if (submitting) return
    setSubmitting(route)
    try {
      await onSelect(route)
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={canClose ? onClose : undefined}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-mist text-center">
          <h2 className="text-xl md:text-2xl font-black text-[#111]">{t.title}</h2>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 문관 */}
          <button
            type="button"
            disabled={submitting !== null}
            onClick={() => handle('scholar')}
            className="rounded-2xl border-2 border-mist hover:border-blue-400 hover:shadow-lg transition-all p-5 text-left disabled:opacity-60 disabled:cursor-wait group"
          >
            <div className="text-6xl mb-3">📖</div>
            <h3 className="text-lg font-black text-[#111]">{t.scholarName}</h3>
            <p className="text-xs text-stone mt-1">{t.scholarDesc}</p>
            <p className="text-[11px] text-blue-600 font-bold mt-3">{t.scholarPath}</p>
            <div className="mt-4 py-2.5 rounded-full bg-blue-500 text-white text-sm font-black text-center group-hover:bg-blue-600 transition-colors">
              {submitting === 'scholar' ? t.processing : t.scholarBtn}
            </div>
          </button>

          {/* 무관 */}
          <button
            type="button"
            disabled={submitting !== null}
            onClick={() => handle('warrior')}
            className="rounded-2xl border-2 border-mist hover:border-red-400 hover:shadow-lg transition-all p-5 text-left disabled:opacity-60 disabled:cursor-wait group"
          >
            <div className="text-6xl mb-3">🥋</div>
            <h3 className="text-lg font-black text-[#111]">{t.warriorName}</h3>
            <p className="text-xs text-stone mt-1">{t.warriorDesc}</p>
            <p className="text-[11px] text-red-600 font-bold mt-3">{t.warriorPath}</p>
            <div className="mt-4 py-2.5 rounded-full bg-red-500 text-white text-sm font-black text-center group-hover:bg-red-600 transition-colors">
              {submitting === 'warrior' ? t.processing : t.warriorBtn}
            </div>
          </button>
        </div>

        <div className="px-6 py-4 border-t border-mist bg-cloud/30">
          <p className="text-xs text-stone text-center">{t.warning}</p>
          {canClose && (
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full py-2 rounded-full bg-white border border-mist text-xs font-bold text-slate hover:bg-cloud transition-colors"
            >
              {t.close}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
