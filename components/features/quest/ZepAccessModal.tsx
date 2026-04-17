'use client'

import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import type { ZepZone } from '@/lib/data/zep-spaces'
import { zepSpace } from '@/lib/data/zep-spaces'

interface ZepAccessModalProps {
  isOpen: boolean
  onClose: () => void
  zone: ZepZone
  locale: string
}

const LABEL = {
  ko: {
    howTo: "접속 방법",
    step1: "아래 버튼을 눌러 ZEP에 접속하세요",
    step2: "비밀번호를 입력하세요",
    step3: "아바타를 선택하고 입장!",
    step4: "구역으로 이동하세요",
    zoneLocation: "내 구역 위치",
    password: "비밀번호",
    copied: "복사되었습니다",
    copy: "복사",
    tip: "ZEP에서는 다른 모험가에게 다가가면 자동으로 음성/화상 대화가 시작됩니다. 마이크와 카메라를 켜주세요!",
    warning: "비밀번호를 다른 사람에게 공유하지 마세요. 구독자만 입장할 수 있는 공간입니다.",
    enterZep: "ZEP 입장하기",
  },
  en: {
    howTo: "How to Join",
    step1: "Click the button below to open ZEP",
    step2: "Enter the password",
    step3: "Choose your avatar and enter!",
    step4: "Head to your zone",
    zoneLocation: "Your Zone Location",
    password: "Password",
    copied: "Copied!",
    copy: "Copy",
    tip: "In ZEP, voice/video chat starts automatically when you approach other adventurers. Turn on your mic and camera!",
    warning: "Don't share the password. This space is only for subscribers.",
    enterZep: "Enter ZEP",
  },
  ja: {
    howTo: "接続方法",
    step1: "下のボタンを押してZEPに接続",
    step2: "パスワードを入力",
    step3: "アバターを選んで入場！",
    step4: "あなたのゾーンへ移動",
    zoneLocation: "ゾーンの場所",
    password: "パスワード",
    copied: "コピーしました",
    copy: "コピー",
    tip: "ZEPでは他の冒険者に近づくと自動的に音声/ビデオ通話が始まります。マイクとカメラをオンにしてください！",
    warning: "パスワードを他の人に共有しないでください。サブスクライバー専用スペースです。",
    enterZep: "ZEPに入場する",
  },
}

export function ZepAccessModal({ isOpen, onClose, zone, locale }: ZepAccessModalProps) {
  const l = LABEL[locale as keyof typeof LABEL] || LABEL.en || LABEL.ko
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const zoneName = zone.name[locale as keyof typeof zone.name] || zone.name.en || zone.name.ko
  const zoneDesc = zone.description[locale as keyof typeof zone.description] || zone.description.en || zone.description.ko
  const areaGuide = zone.areaGuide[locale as keyof typeof zone.areaGuide] || zone.areaGuide.en || zone.areaGuide.ko

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(zepSpace.password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API 미지원 환경 — 조용히 무시
    }
  }

  const handleEnter = () => {
    window.open(zepSpace.spaceUrl, '_blank', 'noopener,noreferrer')
  }

  const steps = [l.step1, l.step2, l.step3, l.step4]

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-sky to-mint p-6 text-ink relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-black/10 transition-colors"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
          <div className="text-4xl mb-2">{zone.emoji}</div>
          <h2 className="text-xl font-black pr-8">{zoneName}</h2>
          <p className="text-sm opacity-80 mt-1 pr-8">{zoneDesc}</p>
        </div>

        <div className="p-6 space-y-5">
          {/* 접속 방법 */}
          <div>
            <h3 className="text-sm font-black text-ink mb-3">📋 {l.howTo}</h3>
            <div className="space-y-2.5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-mint-light text-mint-deep font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 구역 위치 안내 */}
          <div className="bg-sky/10 rounded-xl px-4 py-3 border border-sky/20 flex items-center gap-3">
            <span className="text-2xl shrink-0">{zone.emoji}</span>
            <div>
              <p className="text-xs font-black text-ink mb-0.5">📍 {l.zoneLocation}</p>
              <p className="text-sm text-slate">{areaGuide}</p>
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <h3 className="text-sm font-black text-ink mb-2">🔑 {l.password}</h3>
            <div className="flex items-center gap-2 bg-cloud rounded-xl px-4 py-3 border border-mist">
              <code className="flex-1 font-mono text-sm font-bold text-ink tracking-wider select-all">
                {zepSpace.password}
              </code>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-bold text-blossom-deep hover:text-blossom transition-colors shrink-0"
              >
                {copied ? (
                  <><Check size={14} className="text-mint-deep" /> {l.copied}</>
                ) : (
                  <><Copy size={14} /> {l.copy}</>
                )}
              </button>
            </div>
          </div>

          {/* 팁 */}
          <div className="bg-mint-light rounded-xl p-4">
            <p className="text-xs text-mint-deep leading-relaxed">💡 {l.tip}</p>
          </div>

          {/* 경고 */}
          <div className="bg-blossom-light rounded-xl p-3">
            <p className="text-xs text-blossom-deep leading-relaxed">⚠️ {l.warning}</p>
          </div>

          {/* ZEP 입장 버튼 */}
          <button
            onClick={handleEnter}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky to-mint text-ink font-black text-sm hover:opacity-90 active:scale-95 transition-all"
          >
            {l.enterZep} →
          </button>
        </div>
      </div>
    </div>
  )
}
