'use client'

interface ZepBannerProps {
  locale: string
}

const LABEL = {
  ko: {
    title: "여행 전에 미리 만나세요!",
    desc: "키트를 구매하면 ZEP 가상 공간에서 함께 모험할 파티원을 미리 만날 수 있어요.",
    voice: "음성 대화",
    video: "화상 대화",
    avatar: "아바타로 탐험",
  },
  en: {
    title: "Meet Before Your Trip!",
    desc: "Buy a kit to meet your party members in the ZEP virtual space before your trip.",
    voice: "Voice Chat",
    video: "Video Chat",
    avatar: "Explore with Avatar",
  },
  ja: {
    title: "旅行前に事前に会おう！",
    desc: "キットを購入するとZEPバーチャル空間で冒険パーティーメンバーに事前に会えます。",
    voice: "音声チャット",
    video: "ビデオチャット",
    avatar: "アバターで探検",
  },
}

export function ZepBanner({ locale }: ZepBannerProps) {
  const l = LABEL[locale as keyof typeof LABEL] || LABEL.ko

  return (
    <div className="rounded-2xl overflow-hidden border border-sky-light bg-gradient-to-r from-sky-light to-mint-light p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🎮</span>
        <h3 className="font-black text-ink text-sm">{l.title}</h3>
      </div>
      <p className="text-xs text-slate leading-relaxed mb-4">{l.desc}</p>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1.5 rounded-full bg-white/60 text-xs font-bold text-sky flex items-center gap-1">
          🎤 {l.voice}
        </span>
        <span className="px-3 py-1.5 rounded-full bg-white/60 text-xs font-bold text-sky flex items-center gap-1">
          📹 {l.video}
        </span>
        <span className="px-3 py-1.5 rounded-full bg-white/60 text-xs font-bold text-sky flex items-center gap-1">
          🕹️ {l.avatar}
        </span>
      </div>
    </div>
  )
}
