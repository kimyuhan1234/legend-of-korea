'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

// ─────────────────────────────────────────────
//  타입 & 데이터
// ─────────────────────────────────────────────
type Category = 'all' | 'pottery' | 'perfume' | 'leather' | 'candle' | 'ring' | 'art' | 'nature'

interface Workshop {
  id: string
  cityId: string
  nameKey: string
  descKey: string
  category: Category
  priceKey: string
  durationKey: string
  bookingUrl: string
}

const CITIES = [
  'jeonju', 'seoul', 'busan', 'jeju', 'gyeongju', 'tongyeong', 'cheonan', 'yongin', 'icheon',
] as const

const CATEGORIES: Category[] = ['all', 'pottery', 'perfume', 'leather', 'candle', 'ring', 'art', 'nature']

const CATEGORY_EMOJI: Record<Category, string> = {
  all: '✨', pottery: '🏺', perfume: '🌸', leather: '👜',
  candle: '🕯️', ring: '💍', art: '🎨', nature: '🌿',
}

const WORKSHOPS: Workshop[] = [
  // 전주 — Klook 검색 결과 (안전한 검색 URL)
  { id: 'jeonju-1', cityId: 'jeonju', nameKey: 'diy.workshops.jeonju1.name', descKey: 'diy.workshops.jeonju1.desc', category: 'art', priceKey: 'diy.workshops.jeonju1.price', durationKey: 'diy.workshops.jeonju1.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Jeonju+Hanbok+experience' },
  { id: 'jeonju-2', cityId: 'jeonju', nameKey: 'diy.workshops.jeonju2.name', descKey: 'diy.workshops.jeonju2.desc', category: 'pottery', priceKey: 'diy.workshops.jeonju2.price', durationKey: 'diy.workshops.jeonju2.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Jeonju+pottery+class' },
  { id: 'jeonju-3', cityId: 'jeonju', nameKey: 'diy.workshops.jeonju3.name', descKey: 'diy.workshops.jeonju3.desc', category: 'art', priceKey: 'diy.workshops.jeonju3.price', durationKey: 'diy.workshops.jeonju3.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Jeonju+traditional+craft' },
  { id: 'jeonju-4', cityId: 'jeonju', nameKey: 'diy.workshops.jeonju4.name', descKey: 'diy.workshops.jeonju4.desc', category: 'nature', priceKey: 'diy.workshops.jeonju4.price', durationKey: 'diy.workshops.jeonju4.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Jeonju+cultural+experience' },
  // 서울 (seoul-1 유지 — 실제 상품 URL)
  { id: 'seoul-1', cityId: 'seoul', nameKey: 'diy.workshops.seoul1.name', descKey: 'diy.workshops.seoul1.desc', category: 'pottery', priceKey: 'diy.workshops.seoul1.price', durationKey: 'diy.workshops.seoul1.duration', bookingUrl: 'https://experiences.myrealtrip.com/products/3828516' },
  { id: 'seoul-2', cityId: 'seoul', nameKey: 'diy.workshops.seoul2.name', descKey: 'diy.workshops.seoul2.desc', category: 'perfume', priceKey: 'diy.workshops.seoul2.price', durationKey: 'diy.workshops.seoul2.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Seoul+perfume+making+class' },
  { id: 'seoul-3', cityId: 'seoul', nameKey: 'diy.workshops.seoul3.name', descKey: 'diy.workshops.seoul3.desc', category: 'ring', priceKey: 'diy.workshops.seoul3.price', durationKey: 'diy.workshops.seoul3.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Seoul+ring+making+workshop' },
  { id: 'seoul-4', cityId: 'seoul', nameKey: 'diy.workshops.seoul4.name', descKey: 'diy.workshops.seoul4.desc', category: 'art', priceKey: 'diy.workshops.seoul4.price', durationKey: 'diy.workshops.seoul4.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Seoul+jewelry+making+class' },
  // 부산 (busan-1, busan-2 유지 — 실제 상품 URL)
  { id: 'busan-1', cityId: 'busan', nameKey: 'diy.workshops.busan1.name', descKey: 'diy.workshops.busan1.desc', category: 'pottery', priceKey: 'diy.workshops.busan1.price', durationKey: 'diy.workshops.busan1.duration', bookingUrl: 'https://www.umclass.com/plan/28' },
  { id: 'busan-2', cityId: 'busan', nameKey: 'diy.workshops.busan2.name', descKey: 'diy.workshops.busan2.desc', category: 'art', priceKey: 'diy.workshops.busan2.price', durationKey: 'diy.workshops.busan2.duration', bookingUrl: 'https://b2b.mochaclass.com/1112298f-4205-4b1e-a1f4-70e9430423db' },
  { id: 'busan-3', cityId: 'busan', nameKey: 'diy.workshops.busan3.name', descKey: 'diy.workshops.busan3.desc', category: 'art', priceKey: 'diy.workshops.busan3.price', durationKey: 'diy.workshops.busan3.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Busan+cooking+class' },
  // 제주 (jeju-1 유지 — 실제 상품 URL, jeju-3 유지 — 공식사이트)
  { id: 'jeju-1', cityId: 'jeju', nameKey: 'diy.workshops.jeju1.name', descKey: 'diy.workshops.jeju1.desc', category: 'pottery', priceKey: 'diy.workshops.jeju1.price', durationKey: 'diy.workshops.jeju1.duration', bookingUrl: 'https://www.klook.com/en/activity/39302-pottery-handbuilding-one-day-class-jeju/' },
  { id: 'jeju-2', cityId: 'jeju', nameKey: 'diy.workshops.jeju2.name', descKey: 'diy.workshops.jeju2.desc', category: 'perfume', priceKey: 'diy.workshops.jeju2.price', durationKey: 'diy.workshops.jeju2.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Jeju+perfume+making' },
  { id: 'jeju-3', cityId: 'jeju', nameKey: 'diy.workshops.jeju3.name', descKey: 'diy.workshops.jeju3.desc', category: 'leather', priceKey: 'diy.workshops.jeju3.price', durationKey: 'diy.workshops.jeju3.duration', bookingUrl: 'https://nujakda.wixsite.com/main' },
  // 경주 — Klook 검색 결과
  { id: 'gyeongju-1', cityId: 'gyeongju', nameKey: 'diy.workshops.gyeongju1.name', descKey: 'diy.workshops.gyeongju1.desc', category: 'art', priceKey: 'diy.workshops.gyeongju1.price', durationKey: 'diy.workshops.gyeongju1.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Gyeongju+Hanbok+experience' },
  { id: 'gyeongju-2', cityId: 'gyeongju', nameKey: 'diy.workshops.gyeongju2.name', descKey: 'diy.workshops.gyeongju2.desc', category: 'art', priceKey: 'diy.workshops.gyeongju2.price', durationKey: 'diy.workshops.gyeongju2.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Gyeongju+cultural+experience' },
  // 통영 — Klook 검색 결과
  { id: 'tongyeong-1', cityId: 'tongyeong', nameKey: 'diy.workshops.tongyeong1.name', descKey: 'diy.workshops.tongyeong1.desc', category: 'art', priceKey: 'diy.workshops.tongyeong1.price', durationKey: 'diy.workshops.tongyeong1.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Tongyeong+craft+experience' },
  { id: 'tongyeong-2', cityId: 'tongyeong', nameKey: 'diy.workshops.tongyeong2.name', descKey: 'diy.workshops.tongyeong2.desc', category: 'candle', priceKey: 'diy.workshops.tongyeong2.price', durationKey: 'diy.workshops.tongyeong2.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Tongyeong+candle+workshop' },
  // 천안 (cheonan-1 유지 — 실제 인스타그램)
  { id: 'cheonan-1', cityId: 'cheonan', nameKey: 'diy.workshops.cheonan1.name', descKey: 'diy.workshops.cheonan1.desc', category: 'ring', priceKey: 'diy.workshops.cheonan1.price', durationKey: 'diy.workshops.cheonan1.duration', bookingUrl: 'https://www.instagram.com/theonering2/' },
  { id: 'cheonan-2', cityId: 'cheonan', nameKey: 'diy.workshops.cheonan2.name', descKey: 'diy.workshops.cheonan2.desc', category: 'leather', priceKey: 'diy.workshops.cheonan2.price', durationKey: 'diy.workshops.cheonan2.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Cheonan+leather+craft+workshop' },
  // 용인 — Klook 검색 결과
  { id: 'yongin-1', cityId: 'yongin', nameKey: 'diy.workshops.yongin1.name', descKey: 'diy.workshops.yongin1.desc', category: 'art', priceKey: 'diy.workshops.yongin1.price', durationKey: 'diy.workshops.yongin1.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Korean+Folk+Village+Yongin' },
  { id: 'yongin-2', cityId: 'yongin', nameKey: 'diy.workshops.yongin2.name', descKey: 'diy.workshops.yongin2.desc', category: 'art', priceKey: 'diy.workshops.yongin2.price', durationKey: 'diy.workshops.yongin2.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Korean+Folk+Village+Hanbok' },
  // 이천 — Klook/Viator 검색 결과
  { id: 'icheon-1', cityId: 'icheon', nameKey: 'diy.workshops.icheon1.name', descKey: 'diy.workshops.icheon1.desc', category: 'pottery', priceKey: 'diy.workshops.icheon1.price', durationKey: 'diy.workshops.icheon1.duration', bookingUrl: 'https://www.klook.com/en/search/result/?query=Icheon+ceramics+experience' },
  { id: 'icheon-2', cityId: 'icheon', nameKey: 'diy.workshops.icheon2.name', descKey: 'diy.workshops.icheon2.desc', category: 'pottery', priceKey: 'diy.workshops.icheon2.price', durationKey: 'diy.workshops.icheon2.duration', bookingUrl: 'https://www.viator.com/searchResults/all?text=Icheon+pottery+workshop' },
]

const PLATFORMS = [
  { name: 'Klook', url: 'https://www.klook.com/en/experiences/list/south-korea-workshops/g10-cate25/', color: '#FF5722' },
  { name: 'Viator', url: 'https://www.viator.com/South-Korea/d972-ttd', color: '#00AA6C' },
  { name: 'Airbnb Experiences', url: 'https://www.airbnb.com/s/South-Korea/experiences', color: '#FF385C' },
  { name: 'GetYourGuide', url: 'https://www.getyourguide.com/south-korea-l228/', color: '#004FB4' },
]

function getPlatformName(url: string): string {
  if (url.includes('klook')) return 'Klook'
  if (url.includes('viator')) return 'Viator'
  if (url.includes('airbnb')) return 'Airbnb'
  if (url.includes('myrealtrip')) return 'MyRealTrip'
  if (url.includes('instagram')) return 'Instagram'
  if (url.includes('umclass')) return 'Umclass'
  if (url.includes('mochaclass')) return 'Mochaclass'
  if (url.includes('nujakda') || url.includes('wixsite')) return 'Official'
  return 'Book'
}

// ─────────────────────────────────────────────
//  메인 컴포넌트
// ─────────────────────────────────────────────
export function DiyWorkshopDirectory() {
  const t = useTranslations('diy')
  const [selectedCity, setSelectedCity] = useState<string>('jeonju')
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')

  const filtered = WORKSHOPS.filter((w) => {
    if (w.cityId !== selectedCity) return false
    if (selectedCategory !== 'all' && w.category !== selectedCategory) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* ── 헤더 ─────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-[#1F2937] py-16 px-6 md:px-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest mb-4">
          DIY
        </span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-white/80 text-base">{t('subtitle')}</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8">
        {/* ── 도시 선택 ──────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={[
                'shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                selectedCity === city
                  ? 'bg-neutral-900 text-white shadow-md scale-105'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400',
              ].join(' ')}
            >
              {t(`cities.${city}`)}
            </button>
          ))}
        </div>

        {/* ── 카테고리 필터 ──────────────────── */}
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={[
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                selectedCategory === cat
                  ? 'bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-[#1F2937]'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
              ].join(' ')}
            >
              {CATEGORY_EMOJI[cat]} {t(`categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* ── 공방 카드 목록 ──────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
            {filtered.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl border border-neutral-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500 uppercase mb-2">
                      {CATEGORY_EMOJI[w.category]} {t(`categories.${w.category}`)}
                    </span>
                    <h3 className="text-base font-bold text-neutral-900">
                      {t(w.nameKey.replace('diy.', '') as Parameters<typeof t>[0])}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 mb-4 leading-relaxed">
                  {t(w.descKey.replace('diy.', '') as Parameters<typeof t>[0])}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-3 text-xs text-neutral-400">
                    <span>💰 {t(w.priceKey.replace('diy.', '') as Parameters<typeof t>[0])}</span>
                    <span>⏱ {t(w.durationKey.replace('diy.', '') as Parameters<typeof t>[0])}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={w.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 rounded-full bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-[#1F2937] text-xs font-bold hover:bg-[#7BC8BC] transition-colors"
                  >
                    {getPlatformName(w.bookingUrl)}에서 {t('book')} ↗
                  </a>
                  <AddToPlannerButton
                    itemType="diy"
                    cityId={w.cityId}
                    itemData={{
                      id: w.id,
                      nameKey: w.nameKey,
                      category: w.category,
                      priceKey: w.priceKey,
                      durationKey: w.durationKey,
                      bookingUrl: w.bookingUrl,
                    }}
                    className="shrink-0"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">{t('noResults')}</p>
          </div>
        )}

        {/* ── 예약 팁 안내 ──────────────────── */}
        <div className="bg-peach border border-blossom rounded-2xl p-5 mb-8">
          <p className="text-sm font-bold text-slate mb-1">💡 {t('note')}</p>
          <p className="text-xs text-slate leading-relaxed">{t('noteText')}</p>
        </div>

        {/* ── 예약 플랫폼 바로가기 ────────────── */}
        <div className="pb-12">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">{t('external')}</p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
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
