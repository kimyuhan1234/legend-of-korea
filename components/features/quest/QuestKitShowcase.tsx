'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
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

const DIGITAL_FEATURES = [
  { icon: '📱', nameKey: 'digitalFeatures.gps' },
  { icon: '📸', nameKey: 'digitalFeatures.camera' },
  { icon: '🛂', nameKey: 'digitalFeatures.passport' },
  { icon: '🎖️', nameKey: 'digitalFeatures.badge' },
  { icon: '🏆', nameKey: 'digitalFeatures.prize' },
]

export function QuestKitShowcase({ courseId, kits, locale: _locale, isLoggedIn: _isLoggedIn, region }: QuestKitShowcaseProps) {
  const t = useTranslations('quest')
  const router = useRouter()
  const pathname = usePathname()
  const lk = pathname.split('/')[1] || 'ko'

  const subscribeLabel = { ko: '구독 시작하기', en: 'Start Subscription', ja: 'サブスクリプション開始' }
  const priceLabel = { ko: '₩6,900/월', en: '$5/month', ja: '¥750/月' }
  const descLabel = { ko: '월 구독으로 모든 미션 해금', en: 'Unlock all missions with subscription', ja: 'サブスクリプションで全ミッション解除' }

  const handleSubscribe = () => {
    router.push(`/${lk}/courses/${courseId}/purchase`)
  }

  return (
    <section id="kit-section" className="bg-white py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-4">
          {t('digitalFeatures.title')}
        </h2>
        <p className="text-center text-[#6B7280] mb-10">{descLabel[lk as keyof typeof descLabel] || descLabel.en}</p>

        {/* 디지털 기능 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {DIGITAL_FEATURES.map((item) => (
            <div key={item.nameKey} className="bg-gradient-to-br from-mint-light/50 to-cloud rounded-2xl p-5 text-center border border-mist hover:border-mint-deep/30 transition-colors">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm font-bold text-[#111]">
                {t(item.nameKey as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>

        {/* 구독 카드 */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white border-2 border-mint-deep rounded-3xl p-8 text-center shadow-lg">
            <p className="text-sm font-bold text-mint-deep uppercase tracking-widest mb-3">DIGITAL QUEST PASS</p>
            <p className="text-4xl font-black text-[#111] mb-1">
              {priceLabel[lk as keyof typeof priceLabel] || priceLabel.en}
            </p>
            <p className="text-xs text-[#6B7280] mb-6">{descLabel[lk as keyof typeof descLabel] || descLabel.en}</p>

            <button
              onClick={handleSubscribe}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-mint to-mint-deep text-white font-bold text-sm hover:opacity-90 transition mb-3"
            >
              {subscribeLabel[lk as keyof typeof subscribeLabel] || subscribeLabel.en}
            </button>

            <AddToPlannerButton
              itemType="quest"
              cityId={region}
              itemData={{ courseId, kitId: kits[0]?.id, price: 6900 }}
              className="w-full"
              size="md"
            />
          </div>
        </div>

        {/* 안심 메시지 */}
        <div className="flex flex-col md:flex-row gap-4 justify-center text-sm text-[#6B7280]">
          <span className="flex items-center gap-2 justify-center">📱 {lk === 'ko' ? '즉시 이용 가능' : lk === 'ja' ? '即時利用可能' : 'Instant access'}</span>
          <span className="flex items-center gap-2 justify-center">🌍 {t('kit.multilang')}</span>
        </div>
      </div>
    </section>
  )
}
