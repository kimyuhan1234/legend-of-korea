'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

interface Kit {
  id: string
  name: string
  price: number
  option_type?: string
}

interface QuestKitShowcaseProps {
  courseId: string
  kits: Kit[]
  region: string
  locale: string
  isLoggedIn: boolean
}

const KIT_ITEMS = [
  { icon: '🗺️', nameKey: 'kit.items.missionCard' },
  { icon: '📜', nameKey: 'kit.items.legendMap' },
  { icon: '🎭', nameKey: 'kit.items.stickers' },
  { icon: '📋', nameKey: 'kit.items.certificate' },
  { icon: '🎁', nameKey: 'kit.items.localGift' },
]

const KIT_IMAGE_MAP: Record<string, string> = {
  jeonju: '/images/kits/jeonju.png',
  seoul: '/images/kits/seoul.png',
  busan: '/images/kits/busan.png',
  jeju: '/images/kits/jeju.png',
  gyeongju: '/images/kits/gyeongju.png',
  tongyeong: '/images/kits/tongyeong.png',
  cheonan: '/images/kits/cheonan.png',
  icheon: '/images/kits/icheon.png',
  yongin: '/images/kits/yongin.png',
}

export function QuestKitShowcase({ courseId, kits, locale, isLoggedIn, region }: QuestKitShowcaseProps) {
  const t = useTranslations('quest')
  const kitImage = KIT_IMAGE_MAP[region] || '/images/kits/jeonju.png'

  return (
    <section id="kit-section" className="bg-white py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-4">
          {t('kit.title')}
        </h2>
        <p className="text-center text-[#6B7280] mb-10">{t('kit.subtitle')}</p>

        {/* 키트 실사 이미지 */}
        <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden mb-12 shadow-[0_12px_40px_rgba(0,0,0,0.12)] bg-[#F0F2F5]">
          <Image
            src={kitImage}
            alt="Mission Kit"
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            quality={90}
            className="object-contain"
          />
        </div>

        {/* 구성품 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {KIT_ITEMS.map((item) => (
            <div key={item.nameKey} className="bg-[#F0F2F5] rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm font-bold text-[#111]">
                {t(item.nameKey as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>

        {/* 키트 옵션 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {kits.map((kit) => {
            const isSolo = kit.option_type === 'solo' || kit.name?.includes('1인')
            const label = isSolo ? t('kit.solo') : t('kit.couple')
            const href = isLoggedIn
              ? `/${locale}/courses/${courseId}/purchase?kit=${kit.id}`
              : `/${locale}/auth/login?next=/${locale}/courses/${courseId}/purchase?kit=${kit.id}`

            return (
              <div key={kit.id} className="bg-white border-2 border-[#9DD8CE]/20 rounded-3xl p-7 text-center hover:border-[#9DD8CE] hover:shadow-lg transition-all duration-200">
                <p className="text-sm font-bold text-[#9DD8CE] uppercase tracking-widest mb-2">{label}</p>
                <p className="text-4xl font-black text-[#111] mb-1">
                  ₩{kit.price.toLocaleString()}
                </p>
                <p className="text-xs text-[#6B7280] mb-6">{t('kit.taxIncluded')}</p>
                <Link
                  href={href}
                  className="inline-block w-full py-3 rounded-full bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-[#1F2937] font-bold text-sm hover:bg-[#7BC8BC] transition-colors mb-2"
                >
                  {t('kit.buy')}
                </Link>
                <AddToPlannerButton
                  itemType="quest"
                  cityId={region}
                  itemData={{
                    courseId,
                    kitId: kit.id,
                    kitName: kit.name,
                    price: kit.price,
                    optionType: kit.option_type,
                  }}
                  className="w-full"
                  size="md"
                />
              </div>
            )
          })}
        </div>

        {/* 안심 메시지 */}
        <div className="flex flex-col md:flex-row gap-4 justify-center text-sm text-[#6B7280]">
          <span className="flex items-center gap-2 justify-center">✈️ {t('kit.delivery')}</span>
          <span className="flex items-center gap-2 justify-center">🌍 {t('kit.multilang')}</span>
        </div>
      </div>
    </section>
  )
}
