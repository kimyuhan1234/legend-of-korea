'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { getZepSpaceByCourseId } from '@/lib/data/zep-spaces'
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
    locked: "키트를 구매하면 ZEP 가상 공간에서 파티원을 미리 만날 수 있어요!",
    buyFirst: "키트 구매하고 참여하기",
  },
  en: {
    title: "Meet Your Party",
    desc: "Meet fellow adventurers on ZEP",
    enter: "Enter Virtual Meeting",
    virtualSpace: "Virtual Space",
    locked: "Buy a kit to meet party members in the ZEP virtual space!",
    buyFirst: "Buy Kit & Join",
  },
  ja: {
    title: "パーティーメンバーに会う",
    desc: "ZEPで一緒に冒険する仲間に会おう",
    enter: "バーチャル集合場所に入る",
    virtualSpace: "バーチャルスペース",
    locked: "キットを購入するとZEPバーチャル空間でパーティーメンバーに事前に会えます！",
    buyFirst: "キット購入して参加する",
  },
}

export function ZepMeetingButton({ courseId, hasPurchased, locale }: ZepMeetingButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const space = getZepSpaceByCourseId(courseId)
  const l = LABEL[locale as keyof typeof LABEL] || LABEL.ko

  // 해당 코스에 ZEP 스페이스가 없으면 렌더링하지 않음
  if (!space) return null

  if (hasPurchased) {
    return (
      <>
        <div className="bg-gradient-to-r from-sky to-mint rounded-2xl p-5 text-ink">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl shrink-0">{space.backgroundEmoji}</span>
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

        <ZepAccessModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          space={space}
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
