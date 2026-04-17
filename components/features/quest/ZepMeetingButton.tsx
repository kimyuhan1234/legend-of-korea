'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { getZepZoneByCourseId } from '@/lib/data/zep-spaces'
import { ZepAccessModal } from './ZepAccessModal'

interface ZepMeetingButtonProps {
  /** courses.region 값 또는 이벤트 식별자 (e.g. 'jeonju', 'gyeongdo-seoul') */
  courseId: string
  hasPurchased: boolean
  locale: string
}

const LABEL = {
  ko: {
    title: "파티원 만나기",
    desc: "ZEP에서 함께할 모험가를 만나보세요",
    enter: "가상 모임 입장하기",
    virtualSpace: "가상 모임 공간",
    locked: "구독하면 ZEP 가상 공간에서 파티원을 미리 만날 수 있어요!",
    buyFirst: "구독하고 참여하기",
  },
  en: {
    title: "Meet Your Party",
    desc: "Meet fellow adventurers on ZEP",
    enter: "Enter Virtual Meeting",
    virtualSpace: "Virtual Space",
    locked: "Subscribe to meet party members in the ZEP virtual space!",
    buyFirst: "Subscribe & Join",
  },
  ja: {
    title: "パーティーメンバーに会う",
    desc: "ZEPで一緒に冒険する仲間に会おう",
    enter: "バーチャル集合場所に入る",
    virtualSpace: "バーチャルスペース",
    locked: "サブスクリプションでZEPバーチャル空間でパーティーメンバーに事前に会えます！",
    buyFirst: "サブスクで参加する",
  },
}

export function ZepMeetingButton({ courseId, hasPurchased, locale }: ZepMeetingButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const space = getZepZoneByCourseId(courseId)
  const l = LABEL[locale as keyof typeof LABEL] || LABEL.en || LABEL.ko

  // 해당 코스에 ZEP 스페이스가 없으면 렌더링하지 않음
  if (!space) return null

  if (hasPurchased) {
    return (
      <>
        <div className="bg-gradient-to-r from-sky to-mint rounded-2xl overflow-hidden text-ink">
          {/* 미니 애니메이션 프리뷰 */}
          <div className="relative h-16 bg-black/10 overflow-hidden">
            {/* 연결 점선 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
              <line x1="25%" y1="50%" x2="75%" y2="50%"
                stroke="#fff" strokeWidth="1" strokeDasharray="4 3" className="animate-pulse" />
            </svg>
            {/* 아바타 A */}
            <div className="absolute top-1/2 -translate-y-1/2 zmb-avatar-a" style={{ left: '18%' }}>
              <div className="w-8 h-8 rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center text-lg">
                🧑‍💻
              </div>
            </div>
            {/* 아바타 B */}
            <div className="absolute top-1/2 -translate-y-1/2 zmb-avatar-b" style={{ right: '18%' }}>
              <div className="w-8 h-8 rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center text-lg">
                👩‍🎨
              </div>
            </div>
            {/* 대화 버블 */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 zmb-bubble">
              <span className="text-[10px] bg-white/85 text-ink px-2.5 py-1 rounded-full font-bold whitespace-nowrap shadow-sm">
                💬 Hi! 👋
              </span>
            </div>
            {/* 스페이스 이름 */}
            <div className="absolute bottom-1.5 right-3">
              <span className="text-[9px] text-white/50 font-bold uppercase tracking-wider">ZEP</span>
            </div>
          </div>

          {/* 텍스트 + 버튼 */}
          <div className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl shrink-0">{space.emoji}</span>
              <div>
                <h3 className="font-black text-base">🎮 {l.title}</h3>
                <p className="text-sm opacity-80 mt-0.5">{l.desc}</p>
              </div>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="w-full py-3 rounded-xl bg-white/30 hover:bg-white/50 text-ink font-bold text-sm transition-colors border border-white/40"
            >
              {l.enter} →
            </button>
          </div>
        </div>

        {/* 미니 애니메이션 keyframes */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <style jsx>{`
          @keyframes zmbRight {
            0%, 100% { transform: translateY(-50%) translateX(0); }
            50%       { transform: translateY(-50%) translateX(20px); }
          }
          @keyframes zmbLeft {
            0%, 100% { transform: translateY(-50%) translateX(0); }
            50%       { transform: translateY(-50%) translateX(-20px); }
          }
          @keyframes zmbBubble {
            0%, 100% { opacity: 0.4; transform: translateX(-50%) scale(0.95); }
            50%       { opacity: 1;   transform: translateX(-50%) scale(1); }
          }
          .zmb-avatar-a { animation: zmbRight  3s ease-in-out infinite; }
          .zmb-avatar-b { animation: zmbLeft   3s ease-in-out infinite; }
          .zmb-bubble   { animation: zmbBubble 3s ease-in-out infinite; }
        `}</style>

        <ZepAccessModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          zone={space}
          locale={locale}
        />
      </>
    )
  }

  // 비구매자 — 잠금 UI
  return (
    <div className="bg-cloud rounded-2xl p-5 border border-mist">
      <div className="flex items-start gap-3 mb-3">
        <Lock size={20} className="text-stone shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-slate text-sm">🎮 {l.virtualSpace}</h3>
          <p className="text-xs text-stone mt-1 leading-relaxed">{l.locked}</p>
        </div>
      </div>
      <button
        onClick={() =>
          document.getElementById('kit-purchase')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="w-full py-2.5 rounded-xl bg-mist hover:bg-blossom-light text-stone hover:text-blossom-deep font-semibold text-sm transition-colors"
      >
        {l.buyFirst} →
      </button>
    </div>
  )
}
