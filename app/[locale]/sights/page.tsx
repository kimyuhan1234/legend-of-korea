export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import Image from 'next/image'
import { SIGHTS, REGIONS, type SightCategory } from '@/lib/data/sights'

interface Props {
  params: { locale: string }
  searchParams: { region?: string; category?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'sights' })
  const tc = await getTranslations({ locale: params.locale, namespace: 'common' })
  return { title: `${t('title')} | ${tc('siteName')}` }
}

const CATEGORY_EMOJI: Record<SightCategory, string> = {
  hotspot: '🔥',
  landmark: '🏛️',
  festival: '🎉',
}

export default async function SightsPage({ params, searchParams }: Props) {
  const { locale } = params
  const region = searchParams.region || ''
  const category = searchParams.category || ''
  const t = await getTranslations({ locale, namespace: 'sights' })

  let filtered = SIGHTS
  if (region) filtered = filtered.filter(s => s.region === region)
  if (category) filtered = filtered.filter(s => s.category === category)

  const hasSights = filtered.length > 0

  const CATEGORY_LABELS: Record<SightCategory, string> = {
    hotspot: t('hotspot'),
    landmark: t('landmark'),
    festival: t('festival'),
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* 헤더 */}
      <div className="bg-[#2D1B69] text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-2">{t('title')}</h1>
        <p className="text-white/70">{t('subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 지역 필터 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <a href={`/${locale}/sights`} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${!region && !category ? 'bg-[#2D1B69] text-white border-[#2D1B69]' : 'bg-white text-[#3a3028] border-[#e8ddd0] hover:border-[#2D1B69]/40'}`}>
            {t('filterAll')}
          </a>
          {REGIONS.map(r => {
            const label = r[locale as 'ko' | 'ja' | 'en'] || r.ko
            return (
              <a key={r.code} href={`/${locale}/sights?region=${r.code}${category ? `&category=${category}` : ''}`}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${region === r.code ? 'bg-[#2D1B69] text-white border-[#2D1B69]' : 'bg-white text-[#3a3028] border-[#e8ddd0] hover:border-[#2D1B69]/40'}`}
              >
                {label}
              </a>
            )
          })}
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['hotspot', 'landmark', 'festival'] as SightCategory[]).map(cat => (
            <a key={cat} href={`/${locale}/sights?${region ? `region=${region}&` : ''}category=${cat}`}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${category === cat ? 'bg-[#FF6B35] text-white border-[#FF6B35]' : 'bg-white text-[#3a3028] border-[#e8ddd0] hover:border-[#FF6B35]/40'}`}
            >
              {CATEGORY_EMOJI[cat]} {CATEGORY_LABELS[cat]}
            </a>
          ))}
        </div>

        {/* 스팟 카드 */}
        {!hasSights ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="font-bold text-[#2D1B69] text-lg mb-2">{t('comingSoon')}</p>
            <p className="text-[#7a6a58]">{t('comingSoonDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(sight => (
              <div key={sight.id} className="bg-white rounded-2xl overflow-hidden border border-[#e8ddd0] shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="relative h-52 bg-[#F5F0E8]">
                  <Image
                    src={sight.image}
                    alt={sight.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-5xl opacity-20">{CATEGORY_EMOJI[sight.category]}</span>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#2D1B69] text-white">
                      📍 {REGIONS.find(r => r.code === sight.region)?.[locale as 'ko' | 'ja' | 'en'] || sight.region}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FF6B35] text-white">
                      {CATEGORY_EMOJI[sight.category]} {CATEGORY_LABELS[sight.category]}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#2D1B69] mb-2">{sight.name}</h3>
                  <p className="text-sm text-[#7a6a58] line-clamp-2">{sight.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
