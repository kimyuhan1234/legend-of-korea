'use client'

import Link from 'next/link'
import { createPortal } from 'react-dom'

type PassModalLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const PASS_MODAL_TEXT: Record<PassModalLocale, { title: string; desc: string; cta: string; cancel: string }> = {
  ko: { title: '패스가 필요해요', desc: '이 기능을 사용하려면 {pass} 패스가 필요합니다', cta: '패스 보러가기', cancel: '닫기' },
  en: { title: 'Pass Required', desc: 'You need a {pass} pass to use this feature', cta: 'View Passes', cancel: 'Close' },
  ja: { title: 'パスが必要です', desc: 'この機能を使うには{pass}パスが必要です', cta: 'パスを見る', cancel: '閉じる' },
  'zh-CN': { title: '需要通行证', desc: '使用此功能需要{pass}通行证', cta: '查看通行证', cancel: '关闭' },
  'zh-TW': { title: '需要通行證', desc: '使用此功能需要{pass}通行證', cta: '查看通行證', cancel: '關閉' },
}

const PASS_NAMES: Record<string, string> = {
  move: 'Move',
  live: 'Live',
  story: 'Story',
}

interface PassRequiredModalProps {
  locale: string
  passId: string
  onClose: () => void
}

export function PassRequiredModal({ locale, passId, onClose }: PassRequiredModalProps) {
  const modalText = PASS_MODAL_TEXT[locale as PassModalLocale] ?? PASS_MODAL_TEXT.en
  const passName = PASS_NAMES[passId] ?? passId

  // 조상의 CSS transform(예: hover:scale-105)이 position:fixed containing block을 바꾸므로
  // 반드시 document.body 직하위에 포털로 렌더링한다.
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <span className="text-4xl mb-2 block">🎫</span>
          <h3 className="font-black text-slate-800 text-lg">{modalText.title}</h3>
          <p className="text-sm text-slate-500 mt-2">
            {modalText.desc.replace('{pass}', passName)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            {modalText.cancel}
          </button>
          <Link
            href={`/${locale}/pass/${passId}`}
            onClick={onClose}
            className="flex-1 py-2.5 bg-gradient-to-br from-mint to-blossom text-ink rounded-xl font-black text-sm text-center hover:opacity-90 transition-opacity"
          >
            {modalText.cta}
          </Link>
        </div>
      </div>
    </div>,
    document.body
  )
}
