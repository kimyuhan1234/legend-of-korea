'use client'

interface Props {
  stayName: string
  address?: string
  tel?: string | null
  locale: string
  compact?: boolean
}

type LinkLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const LABEL_CALL: Record<LinkLocale, string> = {
  ko: '전화걸기',
  en: 'Call',
  ja: '電話',
  'zh-CN': '致电',
  'zh-TW': '致電',
}

interface LinkDef {
  key: string
  name: string
  emoji: string
  color: string
  buildUrl: (name: string, addr: string) => string
}

const LINKS: LinkDef[] = [
  {
    key: 'booking',
    name: 'Booking.com',
    emoji: '🅱️',
    color: 'bg-blue-600',
    buildUrl: (name) => `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(name)}`,
  },
  {
    key: 'agoda',
    name: 'Agoda',
    emoji: '🅰️',
    color: 'bg-red-500',
    buildUrl: (name) => `https://www.agoda.com/search?city=${encodeURIComponent(name)}&selectedproperty=0`,
  },
  {
    key: 'hotels',
    name: 'Hotels.com',
    emoji: '🏨',
    color: 'bg-rose-500',
    buildUrl: (name) => `https://kr.hotels.com/search.do?q-destination=${encodeURIComponent(name)}`,
  },
  {
    key: 'expedia',
    name: 'Expedia',
    emoji: '✈️',
    color: 'bg-yellow-500',
    buildUrl: (name) => `https://www.expedia.co.kr/Hotel-Search?destination=${encodeURIComponent(name)}`,
  },
  {
    key: 'naver',
    name: 'Naver',
    emoji: '🇳',
    color: 'bg-emerald-500',
    buildUrl: (name, addr) => {
      const q = addr ? `${name} ${addr.split(' ').slice(0, 2).join(' ')}` : name
      return `https://search.naver.com/search.naver?query=${encodeURIComponent(q)}`
    },
  },
]

export function BookingLinkButtons({ stayName, address = '', tel, locale, compact = false }: Props) {
  const callLabel = LABEL_CALL[locale as LinkLocale] ?? LABEL_CALL.en

  return (
    <div className={compact ? 'grid grid-cols-3 gap-1.5' : 'grid grid-cols-2 sm:grid-cols-3 gap-2'}>
      {LINKS.map((l) => (
        <a
          key={l.key}
          href={l.buildUrl(stayName, address)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`${compact ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-2 text-xs'} rounded-full ${l.color} text-white font-bold hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-1`}
        >
          <span>{l.emoji}</span>
          <span>{l.name}</span>
        </a>
      ))}
      {tel && (
        <a
          href={`tel:${tel}`}
          onClick={(e) => e.stopPropagation()}
          className={`${compact ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-2 text-xs'} rounded-full bg-stone text-white font-bold hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-1`}
        >
          <span>📞</span>
          <span>{callLabel}</span>
        </a>
      )}
    </div>
  )
}
