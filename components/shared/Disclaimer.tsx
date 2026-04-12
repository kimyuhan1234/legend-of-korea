'use client'

interface DisclaimerProps {
  locale: string
  className?: string
}

const TEXT = {
  ko: "숙소·교통 예약은 외부 사이트에서 직접 진행되며, Legend of Korea는 해당 예약에 대한 책임을 지지 않습니다.",
  ja: "宿泊・交通の予約は外部サイトで直接行われ、Legend of Koreaは当該予約に関する責任を負いません。",
  en: "Accommodation and transport bookings are handled directly by external sites. Legend of Korea is not responsible for those reservations.",
}

export function Disclaimer({ locale, className = "" }: DisclaimerProps) {
  const text = TEXT[locale as keyof typeof TEXT] || TEXT.ko

  return (
    <p className={`text-xs text-[#9CA3AF] leading-relaxed ${className}`}>
      ⚠️ {text}
    </p>
  )
}
