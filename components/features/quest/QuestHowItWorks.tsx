'use client'

import { useTranslations } from 'next-intl'

export function QuestHowItWorks() {
  const t = useTranslations('quest')

  const steps = [
    { icon: '📦', titleKey: 'howItWorks.step1.title', descKey: 'howItWorks.step1.desc' },
    { icon: '🗺️', titleKey: 'howItWorks.step2.title', descKey: 'howItWorks.step2.desc' },
    { icon: '🏆', titleKey: 'howItWorks.step3.title', descKey: 'howItWorks.step3.desc' },
  ]

  return (
    <section className="bg-[#F5F3EF] py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-12">
          {t('howItWorks.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="bg-white rounded-3xl p-7 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
                <div className="text-5xl mb-4">{step.icon}</div>
                <p className="text-xs font-black text-[#FF6B35] uppercase tracking-widest mb-2">
                  Step {i + 1}
                </p>
                <h3 className="text-lg font-bold text-[#111] mb-2">
                  {t(step.titleKey as Parameters<typeof t>[0])}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {t(step.descKey as Parameters<typeof t>[0])}
                </p>
              </div>
              {i < 2 && (
                <>
                  <div className="hidden md:block absolute top-1/2 -right-4 text-2xl text-[#FF6B35]">→</div>
                  <div className="md:hidden text-center text-2xl text-[#FF6B35] py-2">↓</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
