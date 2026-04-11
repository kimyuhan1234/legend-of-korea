'use client'

import { useTranslations } from 'next-intl'

const PLATFORMS = [
  { name: 'Booking.com', url: 'https://www.booking.com/', color: '#003580' },
  { name: 'Airbnb', url: 'https://www.airbnb.com/', color: '#FF5A5F' },
  { name: 'Trip.com', url: 'https://kr.trip.com/', color: '#287DFA' },
  { name: 'Agoda', url: 'https://www.agoda.com/', color: '#D91C5C' },
  { name: 'Yanolja', url: 'https://www.yanolja.com/', color: '#FF3E4D' },
]

export function StayPlatformLinks() {
  const t = useTranslations('stay')

  return (
    <div>
      <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">
        {t('platforms.title')}
      </p>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
            style={{ borderColor: p.color + '33' }}
          >
            <span style={{ color: p.color }}>●</span> {p.name} ↗
          </a>
        ))}
      </div>
    </div>
  )
}
