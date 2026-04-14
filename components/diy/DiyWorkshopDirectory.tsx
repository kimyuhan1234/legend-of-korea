'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { CITY_WORKSHOPS, type CityWorkshop } from '@/lib/data/diy-workshops'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

const PLATFORMS = [
  { name: 'Klook', url: 'https://www.klook.com/en/experiences/list/south-korea-workshops/g10-cate25/', color: '#FF5722' },
  { name: 'Viator', url: 'https://www.viator.com/South-Korea/d972-ttd', color: '#00AA6C' },
  { name: 'Airbnb Experiences', url: 'https://www.airbnb.com/s/South-Korea/experiences', color: '#FF385C' },
  { name: 'GetYourGuide', url: 'https://www.getyourguide.com/south-korea-l228/', color: '#004FB4' },
]

function getL(field: { ko: string; en: string; ja: string }, locale: string): string {
  return field[locale as 'ko' | 'en' | 'ja'] || field.ko
}

function CityWorkshopCard({ workshop, locale }: { workshop: CityWorkshop; locale: string }) {
  const t = useTranslations('diy')

  return (
    <div className="bg-white rounded-2xl border border-mist p-6 hover:border-mint hover:shadow-md transition-all">
      {/* 도시명 + 설명 */}
      <h3 className="text-xl font-bold text-ink mb-1">{getL(workshop.cityName, locale)}</h3>
      <p className="text-sm text-slate mb-4">{getL(workshop.description, locale)}</p>

      {/* 체험 목록 — 2열 그리드 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {workshop.experiences.map((exp, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-ink">
            <span>{exp.icon}</span>
            <span>{getL(exp.name, locale)}</span>
          </div>
        ))}
      </div>

      {/* 가격 + 소요시간 */}
      <div className="flex gap-4 mb-5 text-sm">
        <span className="text-ink font-bold">💰 {workshop.priceRange}</span>
        <span className="text-slate">⏰ {workshop.duration}</span>
      </div>

      {/* 예약 버튼들 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {workshop.bookingLinks.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#B8E8E0] to-[#F5D0D0] text-ink font-bold rounded-xl px-4 py-2.5 text-sm hover:opacity-90 transition"
          >
            {link.icon} {link.platform} {t('book')} ↗
          </a>
        ))}
      </div>

      {/* 플래너 담기 */}
      <AddToPlannerButton
        itemType="diy"
        cityId={workshop.cityId}
        itemData={{
          cityId: workshop.cityId,
          name: workshop.cityName,
          description: workshop.description,
          priceRange: workshop.priceRange,
        }}
        size="sm"
      />
    </div>
  )
}

export function DiyWorkshopDirectory() {
  const t = useTranslations('diy')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'
  const [selectedCity, setSelectedCity] = useState<string | 'all'>('all')

  const filtered = selectedCity === 'all'
    ? CITY_WORKSHOPS
    : CITY_WORKSHOPS.filter((w) => w.cityId === selectedCity)

  return (
    <div className="min-h-screen bg-snow">
      {/* 히어로 */}
      <div className="bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-ink py-16 px-6 md:px-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest mb-4">
          DIY
        </span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-slate text-base">{t('subtitle')}</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8">
        {/* 도시 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCity('all')}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              selectedCity === 'all'
                ? 'bg-ink text-white shadow-md scale-105'
                : 'bg-white border border-mist text-slate hover:border-stone'
            }`}
          >
            {t('cities.all')}
          </button>
          {CITY_WORKSHOPS.map((ws) => (
            <button
              key={ws.cityId}
              onClick={() => setSelectedCity(ws.cityId)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedCity === ws.cityId
                  ? 'bg-ink text-white shadow-md scale-105'
                  : 'bg-white border border-mist text-slate hover:border-stone'
              }`}
            >
              {getL(ws.cityName, locale)}
            </button>
          ))}
        </div>

        {/* 도시별 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {filtered.map((ws) => (
            <CityWorkshopCard key={ws.cityId} workshop={ws} locale={locale} />
          ))}
        </div>

        {/* 예약 팁 */}
        <div className="bg-peach/30 border border-blossom rounded-2xl p-5 mb-8">
          <p className="text-sm font-bold text-ink mb-1">💡 {t('note')}</p>
          <p className="text-xs text-slate leading-relaxed">{t('noteText')}</p>
        </div>

        {/* 예약 플랫폼 바로가기 */}
        <div className="pb-12">
          <p className="text-xs font-bold text-stone uppercase tracking-widest mb-3">{t('external')}</p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-mist bg-white text-sm font-semibold text-ink hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                {p.name} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
