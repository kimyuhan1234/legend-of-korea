'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { CITY_WORKSHOPS, type CityWorkshop, type CityWorkshopExperience } from '@/lib/data/diy-workshops'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

function getL(field: { ko: string; en: string; ja: string }, locale: string): string {
  return (field as Record<string, string>)[locale] || field.en || field.ko
}

// ── 오른쪽 상세 패널 (데스크톱 공용 / 모바일 아코디언 내부)
function ExperienceDetail({
  exp,
  locale,
  bookingLinks,
}: {
  exp: CityWorkshopExperience
  locale: string
  bookingLinks: CityWorkshop['bookingLinks']
}) {
  return (
    <div>
      {/* 영상 (있으면) 또는 이미지 */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-50 mb-4">
        {exp.videoSrc ? (
          <video
            key={exp.videoSrc}
            src={exp.videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
            aria-label={getL(exp.name, locale)}
          />
        ) : (
          <Image
            src={exp.image || '/images/diy/placeholder.jpg'}
            alt={getL(exp.name, locale)}
            fill
            className="object-contain"
            unoptimized
          />
        )}
        {/* 로드 실패 시 폴백 — 아이콘 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-br from-mint to-blossom flex items-center justify-center -z-10">
          <span className="text-6xl">{exp.icon}</span>
        </div>
      </div>

      {/* 제목 */}
      <h4 className="text-lg font-bold text-ink flex items-center gap-2 mb-3">
        <span>{exp.icon}</span>
        {getL(exp.name, locale)}
      </h4>

      {/* 상세 설명 */}
      <p className="text-sm text-slate leading-relaxed mb-4">
        {getL(exp.detailDesc, locale)}
      </p>

      {/* 가격 + 소요시간 + 위치 */}
      <div className="flex flex-wrap gap-2 mb-4 text-sm">
        <span className="bg-mint/40 text-ink font-bold px-3 py-1 rounded-full">
          💰 {exp.price}
        </span>
        <span className="bg-snow text-slate px-3 py-1 rounded-full border border-mist">
          ⏰ {exp.duration}
        </span>
        <span className="bg-snow text-slate px-3 py-1 rounded-full border border-mist">
          📍 {getL(exp.location, locale)}
        </span>
      </div>

      {/* 특징 태그 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {((exp.features as Record<string, string[]>)[locale] ?? exp.features.ko).map((f, i) => (
          <span
            key={i}
            className="text-xs bg-snow text-ink px-3 py-1.5 rounded-lg border border-mist"
          >
            ✅ {f}
          </span>
        ))}
      </div>

      {/* 예약 버튼 */}
      {bookingLinks.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 w-full justify-center
                     bg-gradient-to-r from-mint to-blossom
                     text-ink font-bold rounded-xl px-6 py-3 text-sm
                     hover:opacity-90 transition"
        >
          {link.icon} {link.platform}에서 예약하기 →
        </a>
      ))}
    </div>
  )
}

// ── 도시 카드 (2단 레이아웃)
function CityWorkshopCard({ workshop, locale }: { workshop: CityWorkshop; locale: string }) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  // 모바일 아코디언: 열린 인덱스 (-1이면 전부 닫힘)
  const [mobileOpenIdx, setMobileOpenIdx] = useState<number>(-1)

  const selected = workshop.experiences[selectedIdx]

  return (
    <div className="bg-white rounded-2xl border border-mist overflow-hidden">
      {/* 도시 헤더 */}
      <div className="px-6 pt-5 pb-3 border-b border-mist">
        <h3 className="text-xl font-bold text-ink">{getL(workshop.cityName, locale)}</h3>
        <p className="text-sm text-slate">{getL(workshop.description, locale)}</p>
      </div>

      {/* ── 데스크톱: 좌(메뉴) + 우(상세) ── */}
      <div className="hidden md:flex min-h-[480px]">
        {/* 왼쪽 메뉴 */}
        <div className="w-2/5 border-r border-mist p-4 space-y-1 overflow-y-auto">
          {workshop.experiences.map((exp, i) => (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                selectedIdx === i
                  ? 'bg-gradient-to-r from-mint/30 to-blossom/30 border border-mint'
                  : 'hover:bg-snow'
              }`}
            >
              <span className="text-lg shrink-0">{exp.icon}</span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm truncate ${
                    selectedIdx === i ? 'text-ink font-bold' : 'text-slate'
                  }`}
                >
                  {getL(exp.name, locale)}
                </p>
                <p className="text-xs text-stone">
                  {exp.price} · {exp.duration}
                </p>
              </div>
              {selectedIdx === i && (
                <span className="text-sm text-[#5BBDAD] shrink-0">→</span>
              )}
            </button>
          ))}
        </div>

        {/* 오른쪽 상세 */}
        <div className="w-3/5 p-6 overflow-y-auto">
          <ExperienceDetail
            exp={selected}
            locale={locale}
            bookingLinks={workshop.bookingLinks}
          />
        </div>
      </div>

      {/* ── 모바일: 아코디언 ── */}
      <div className="md:hidden divide-y divide-mist">
        {workshop.experiences.map((exp, i) => (
          <div key={i}>
            <button
              onClick={() => setMobileOpenIdx(mobileOpenIdx === i ? -1 : i)}
              className="w-full text-left px-4 py-3 flex items-center gap-3"
            >
              <span className="text-lg shrink-0">{exp.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">{getL(exp.name, locale)}</p>
                <p className="text-xs text-stone">
                  {exp.price} · {exp.duration}
                </p>
              </div>
              <span
                className={`text-slate text-xs transition-transform duration-200 ${
                  mobileOpenIdx === i ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>

            {mobileOpenIdx === i && (
              <div className="px-4 pb-5 bg-snow">
                <ExperienceDetail
                  exp={exp}
                  locale={locale}
                  bookingLinks={workshop.bookingLinks}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 플래너 담기 */}
      <div className="px-6 pb-5 pt-3 border-t border-mist">
        <AddToPlannerButton
          itemType="diy"
          cityId={workshop.cityId}
          itemData={{
            cityId: workshop.cityId,
            name: workshop.cityName,
            description: workshop.description,
          }}
          size="sm"
        />
      </div>
    </div>
  )
}

// ── 메인 디렉토리
export function DiyWorkshopDirectory() {
  const t = useTranslations('diy')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'
  const [selectedCity, setSelectedCity] = useState<string>('all')

  const filtered =
    selectedCity === 'all'
      ? CITY_WORKSHOPS
      : CITY_WORKSHOPS.filter((w) => w.cityId === selectedCity)

  return (
    <div className="min-h-screen bg-snow">
      {/* 히어로 */}
      <div className="bg-gradient-to-br from-mint to-blossom text-ink py-16 px-6 md:px-10 text-center">
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

        {/* 도시별 카드 목록 */}
        <div className="flex flex-col gap-8 pb-8">
          {filtered.map((ws) => (
            <CityWorkshopCard key={ws.cityId} workshop={ws} locale={locale} />
          ))}
        </div>

        {/* 예약 팁 */}
        <div className="bg-blossom/30 border border-blossom rounded-2xl p-5 mb-12">
          <p className="text-sm font-bold text-ink mb-1">💡 {t('note')}</p>
          <p className="text-xs text-slate leading-relaxed">{t('noteText')}</p>
        </div>
      </div>
    </div>
  )
}
