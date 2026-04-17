'use client'

import { useState, useEffect } from 'react'

interface ZepBannerProps {
  locale: string
}

const LABEL = {
  ko: {
    title: "여행 전에 파티원을 미리 만나세요!",
    desc: "가상 공간에서 음성·화상으로 대화하고 함께할 모험가를 확인하세요",
    buyFirst: "구독하고 참여하기",
    voice: "음성",
    video: "화상",
    avatar: "아바타",
  },
  en: {
    title: "Meet Your Party Before the Trip!",
    desc: "Chat by voice & video in virtual space — meet your fellow adventurers",
    buyFirst: "Subscribe & Join",
    voice: "Voice",
    video: "Video",
    avatar: "Avatar",
  },
  ja: {
    title: "旅行前にパーティーメンバーに会おう！",
    desc: "バーチャル空間で音声・ビデオ通話しながら仲間を確認しよう",
    buyFirst: "サブスクで参加する",
    voice: "音声",
    video: "ビデオ",
    avatar: "アバター",
  },
}

const CHAT_TEXTS = ["Hi! 👋", "같이 가자!", "Let's go!", "行こう！"]

export function ZepBanner({ locale }: ZepBannerProps) {
  const l = LABEL[locale as keyof typeof LABEL] || LABEL.ko
  const [chatIdx, setChatIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setChatIdx((i) => (i + 1) % CHAT_TEXTS.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">

      {/* ── 애니메이션 영역 ── */}
      <div className="relative h-44 overflow-hidden">

        {/* 도트 격자 배경 */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* 아바타 연결 점선 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.22 }}>
          <line
            x1="28%" y1="37%" x2="66%" y2="37%"
            stroke="#B8E8E0" strokeWidth="1.5" strokeDasharray="5 4"
            className="animate-pulse"
          />
          <line
            x1="46%" y1="37%" x2="46%" y2="70%"
            stroke="#A8D4F0" strokeWidth="1" strokeDasharray="4 4"
            style={{ opacity: 0.55 }}
          />
        </svg>

        {/* 아바타 1 — 왼쪽 (오른쪽으로 이동) */}
        <div className="absolute zep-avatar-1" style={{ top: '18%', left: '14%' }}>
          <div className="w-10 h-10 rounded-full bg-mint/25 border-2 border-mint/55 flex items-center justify-center text-2xl shadow-lg">
            🧑‍💻
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-mint-deep border border-[#1a1a2e]" />
        </div>

        {/* 아바타 2 — 오른쪽 (왼쪽으로 이동) */}
        <div className="absolute zep-avatar-2" style={{ top: '18%', right: '14%' }}>
          <div className="w-10 h-10 rounded-full bg-blossom/25 border-2 border-blossom/55 flex items-center justify-center text-2xl shadow-lg">
            👩‍🎨
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blossom-deep border border-[#1a1a2e]" />
        </div>

        {/* 아바타 3 — 하단 (표류) */}
        <div className="absolute zep-avatar-3" style={{ top: '57%', left: '38%' }}>
          <div className="w-9 h-9 rounded-full bg-sky/25 border-2 border-sky/55 flex items-center justify-center text-xl shadow-lg">
            🧑‍🚀
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky border border-[#1a1a2e]" />
        </div>

        {/* 대화 버블 — chatIdx가 바뀔 때마다 key로 재마운트해 fade-in 재실행 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none">
          <div
            key={chatIdx}
            className="zep-chat-bubble bg-white/92 text-ink text-xs px-3.5 py-1.5 rounded-full shadow-lg font-semibold whitespace-nowrap"
          >
            💬 {CHAT_TEXTS[chatIdx]}
          </div>
          <div className="w-2 h-2 bg-white/92 rotate-45 mx-auto -mt-1" />
        </div>

        {/* 기능 아이콘 (순차 글로우) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-5 items-center">
          <div className="flex flex-col items-center gap-0.5 zep-icon-0">
            <span className="text-xl">🎤</span>
            <span className="text-[9px] text-white/50 font-bold">{l.voice}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 zep-icon-1">
            <span className="text-xl">📹</span>
            <span className="text-[9px] text-white/50 font-bold">{l.video}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 zep-icon-2">
            <span className="text-xl">🕹️</span>
            <span className="text-[9px] text-white/50 font-bold">{l.avatar}</span>
          </div>
        </div>
      </div>

      {/* ── 텍스트 + CTA ── */}
      <div className="px-5 pb-5 text-center">
        <h3 className="text-white font-black text-base mb-1.5">🎮 {l.title}</h3>
        <p className="text-white/65 text-xs leading-relaxed mb-4">{l.desc}</p>
        <button
          onClick={() =>
            document.getElementById('kit-purchase')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="w-full bg-gradient-to-r from-mint to-mint-deep text-ink font-black rounded-xl px-6 py-3.5 text-sm hover:opacity-90 active:scale-95 transition-all"
          style={{ boxShadow: '0 4px 20px rgba(157,216,206,0.4)' }}
        >
          🔒 {l.buyFirst}
        </button>
      </div>

      {/* ── 컴포넌트 스코프 keyframes ── */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <style jsx>{`
        @keyframes zepFloatRight {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          40%       { transform: translateX(28px) translateY(-5px); }
          70%       { transform: translateX(18px) translateY(3px); }
        }
        @keyframes zepFloatLeft {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          40%       { transform: translateX(-28px) translateY(-5px); }
          70%       { transform: translateX(-18px) translateY(3px); }
        }
        @keyframes zepDrift {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50%       { transform: translateX(22px) translateY(-7px); }
        }
        @keyframes zepChatIn {
          0%   { opacity: 0; transform: translateY(6px) scale(0.9); }
          20%  { opacity: 1; transform: translateY(0) scale(1); }
          80%  { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-4px) scale(0.95); }
        }
        @keyframes zepIconGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
        .zep-avatar-1  { animation: zepFloatRight 6s ease-in-out infinite; }
        .zep-avatar-2  { animation: zepFloatLeft  6s ease-in-out infinite; }
        .zep-avatar-3  { animation: zepDrift      8s ease-in-out infinite 1s; }
        .zep-chat-bubble { animation: zepChatIn   2s ease-in-out forwards; }
        .zep-icon-0    { animation: zepIconGlow   2s ease-in-out infinite 0s; }
        .zep-icon-1    { animation: zepIconGlow   2s ease-in-out infinite 0.6s; }
        .zep-icon-2    { animation: zepIconGlow   2s ease-in-out infinite 1.2s; }
      `}</style>
    </div>
  )
}
