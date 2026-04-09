export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import Image from 'next/image'
import { STAYS, REGIONS } from '@/lib/data/stays'

interface Props {
  params: { locale: string }
  searchParams: { region?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'stay' })
  const tc = await getTranslations({ locale: params.locale, namespace: 'common' })
  return { title: `${t('title')} | ${tc('siteName')}` }
}

export default async function StayPage({ params, searchParams }: Props) {
  const { locale } = params
  const region = searchParams.region || ''
  const t = await getTranslations({ locale, namespace: 'stay' })

  const filtered = region ? STAYS.filter(s => s.region === region) : STAYS
  const hasStays = filtered.length > 0

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* 헤더 */}
      <div className="bg-[#FF6B35] text-white py-20 md:py-28 px-8 md:px-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-2">{t('title')}</h1>
        <p className="text-white/70">{t('subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-8 md:px-10 py-20 md:py-28">
        {/* 지역 필터 */}
        <div className="flex flex-wrap gap-2 mb-8">
          <a
            href={`/${locale}/stay`}
            className={`px-8 md:px-10 py-2 rounded-full text-sm font-medium border transition-colors ${
              !region ? 'bg-[#FF6B35] text-white border-[#2D1B69]' : 'bg-white text-[#3a3028] border-[#e8ddd0] hover:border-[#2D1B69]/40'
            }`}
          >
            {t('filterAll')}
          </a>
          {REGIONS.map(r => {
            const label = r[locale as 'ko' | 'ja' | 'en'] || r.ko
            return (
              <a
                key={r.code}
                href={`/${locale}/stay?region=${r.code}`}
                className={`px-8 md:px-10 py-2 rounded-full text-sm font-medium border transition-colors ${
                  region === r.code ? 'bg-[#FF6B35] text-white border-[#2D1B69]' : 'bg-white text-[#3a3028] border-[#e8ddd0] hover:border-[#2D1B69]/40'
                }`}
              >
                {label}
              </a>
            )
          })}
        </div>

        {/* 숙소 카드 그리드 */}
        {!hasStays ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏨</div>
            <p className="font-bold text-[#111] text-lg mb-2">{t('comingSoon')}</p>
            <p className="text-[#7a6a58]">{t('comingSoonDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(stay => (
              <div key={stay.id} className="bg-white rounded-2xl overflow-hidden border border-[#e8ddd0] shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-52 bg-[#F5F0E8]">
                  {/* TODO: 실제 숙소 이미지 */}
                  <Image
                    src={stay.image}
                    alt={stay.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-5xl opacity-20">🏨</span>
                  </div>
                  {/* 지역 배지 */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FF6B35] text-white">
                    📍 {REGIONS.find(r => r.code === stay.region)?.[locale as 'ko' | 'ja' | 'en'] || stay.region}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#111] mb-2">{stay.name}</h3>
                  <p className="text-sm text-[#7a6a58] mb-3 line-clamp-2">{stay.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {stay.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-[#FFF8F0] text-[#FF6B35] border border-[#FF6B35]/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={stay.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-2.5 rounded-xl bg-[#FF6B35] text-white text-sm font-bold hover:bg-[#E55A2B] transition-colors"
                  >
                    {t('bookNow')} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}