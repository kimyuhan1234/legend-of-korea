'use client'

import { useTranslations } from 'next-intl'

export function QuestComparison() {
  const t = useTranslations('quest')

  const normalItems = [
    'comparison.normal.1', 'comparison.normal.2', 'comparison.normal.3',
    'comparison.normal.4', 'comparison.normal.5',
  ]
  const legendItems = [
    'comparison.legend.1', 'comparison.legend.2', 'comparison.legend.3',
    'comparison.legend.4', 'comparison.legend.5', 'comparison.legend.6',
  ]

  const tiers = [
    { emoji: '🌱', nameKey: 'comparison.tier.seed', lp: '0', benefit: '3%' },
    { emoji: '🌿', nameKey: 'comparison.tier.sprout', lp: '500', benefit: '5%' },
    { emoji: '👹', nameKey: 'comparison.tier.goblin', lp: '2,000', benefit: '8%' },
    { emoji: '🧚', nameKey: 'comparison.tier.fairy', lp: '5,000', benefit: '12%' },
    { emoji: '🏔️', nameKey: 'comparison.tier.sage', lp: '10,000', benefit: '15% + VIP' },
  ]

  const scrollToKit = () => {
    document.getElementById('kit-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="bg-[#F5F3EF] py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-12">
          {t('comparison.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 일반 관광 */}
          <div className="bg-white/60 rounded-3xl p-7 border border-[#E5E7EB]">
            <h3 className="text-lg font-bold text-[#6B7280] mb-5">{t('comparison.normalTitle')}</h3>
            <ul className="space-y-3">
              {normalItems.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm text-[#9CA3AF]">
                  <span className="shrink-0 mt-0.5">❌</span>
                  <span>{t(key as Parameters<typeof t>[0])}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legend of Korea */}
          <div className="bg-white rounded-3xl p-7 border-2 border-[#FF6B35] shadow-[0_12px_40px_rgba(255,107,53,0.15)]">
            <h3 className="text-lg font-bold text-[#FF6B35] mb-5">{t('comparison.legendTitle')}</h3>
            <ul className="space-y-3 mb-6">
              {legendItems.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm text-[#374151]">
                  <span className="shrink-0 mt-0.5">✅</span>
                  <span>{t(key as Parameters<typeof t>[0])}</span>
                </li>
              ))}
            </ul>

            {/* LP & 티어 인포그래픽 */}
            <div className="bg-[#F5F3EF] rounded-2xl p-5">
              <p className="text-xs font-bold text-[#FF6B35] uppercase tracking-widest mb-3">
                {t('comparison.legend.lp')}
              </p>
              <div className="flex items-center justify-between mb-2">
                {tiers.map((tier, i) => (
                  <div key={i} className="flex flex-col items-center text-center flex-1">
                    <span className="text-xl">{tier.emoji}</span>
                    <span className="text-[10px] font-bold text-[#111] mt-1">
                      {t(tier.nameKey as Parameters<typeof t>[0])}
                    </span>
                    <span className="text-[9px] text-[#6B7280]">{tier.lp} LP</span>
                    <span className="text-[9px] text-[#FF6B35] font-bold">{tier.benefit}</span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gradient-to-r from-green-300 via-yellow-300 via-orange-400 to-red-500 rounded-full mt-1" />
              <p className="text-[10px] text-[#6B7280] mt-2 text-center">
                {t('comparison.legend.tier')}
              </p>
            </div>

            <button
              onClick={scrollToKit}
              className="w-full mt-5 py-3 rounded-full bg-[#FF6B35] text-white font-bold text-sm hover:bg-[#E55A2B] transition-colors"
            >
              {t('comparison.cta')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
