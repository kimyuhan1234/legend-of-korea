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
    { emoji: '🏘️', nameKey: 'comparison.tier.lv1', lp: '0',      benefit: '-',           pos: 0 },
    { emoji: '🧳', nameKey: 'comparison.tier.lv2', lp: '500',    benefit: '3%',          pos: 10 },
    { emoji: '⚔️', nameKey: 'comparison.tier.lv3', lp: '2,000',  benefit: '5%',          pos: 30 },
    { emoji: '🦸', nameKey: 'comparison.tier.lv4', lp: '5,000',  benefit: '8%',          pos: 50 },
    { emoji: '👑', nameKey: 'comparison.tier.lv5', lp: '10,000', benefit: '12%',         pos: 75 },
    { emoji: '✨', nameKey: 'comparison.tier.lv6', lp: '20,000', benefit: '15% + VIP',   pos: 100 },
  ]

  const scrollToKit = () => {
    document.getElementById('kit-purchase')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="bg-cloud py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-12">
          {t('comparison.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 일반 관광 */}
          <div className="bg-white/60 rounded-3xl p-7 border border-mist">
            <h3 className="text-lg font-bold text-[#6B7280] mb-5">{t('comparison.normalTitle')}</h3>
            <ul className="space-y-3">
              {normalItems.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm text-stone">
                  <span className="shrink-0 mt-0.5">❌</span>
                  <span>{t(key as Parameters<typeof t>[0])}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legend of Korea */}
          <div className="bg-white rounded-3xl p-7 border-2 border-mint-deep shadow-[0_12px_40px_rgba(255,107,53,0.15)]">
            <h3 className="text-lg font-bold text-mint-deep mb-5">{t('comparison.legendTitle')}</h3>
            <ul className="space-y-3 mb-6">
              {legendItems.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm text-[#374151]">
                  <span className="shrink-0 mt-0.5">✅</span>
                  <span>{t(key as Parameters<typeof t>[0])}</span>
                </li>
              ))}
            </ul>

            {/* LP & 6단계 티어 인포그래픽 */}
            <div className="bg-cloud rounded-2xl p-5">
              <p className="text-xs font-bold text-mint-deep uppercase tracking-widest mb-4">
                {t('comparison.legend.lp')}
              </p>

              {/* 프로그레스 바 */}
              <div className="relative mb-2">
                <div className="h-3 bg-gradient-to-r from-mint via-blossom via-blossom-deep to-red-400 rounded-full" />
                {/* 티어 마커 */}
                {tiers.map((tier, i) => (
                  <div
                    key={i}
                    className="absolute -top-1"
                    style={{ left: `${tier.pos}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-mint-deep flex items-center justify-center text-[10px] shadow-sm">
                      {tier.emoji}
                    </div>
                  </div>
                ))}
              </div>

              {/* 티어 라벨 */}
              <div className="grid grid-cols-6 gap-1 mt-4">
                {tiers.map((tier, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <span className="text-lg leading-none">{tier.emoji}</span>
                    <span className="text-[9px] font-black text-[#111] mt-1 leading-tight">
                      Lv.{i + 1}
                    </span>
                    <span className="text-[8px] font-bold text-[#374151] leading-tight">
                      {t(tier.nameKey as Parameters<typeof t>[0])}
                    </span>
                    <span className="text-[8px] text-[#6B7280]">{tier.lp} 빗방울</span>
                    <span className="text-[8px] text-mint-deep font-bold">{tier.benefit}</span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-[#6B7280] mt-3 text-center">
                {t('comparison.legend.tier')}
              </p>
            </div>

            <button
              onClick={scrollToKit}
              className="w-full mt-5 py-3 rounded-full bg-gradient-to-br from-mint to-blossom text-ink font-bold text-sm hover:bg-[#7BC8BC] transition-colors"
            >
              {t('comparison.cta')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
