'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const

export function QuestFAQ() {
  const t = useTranslations('quest')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-10">
          {t('faq.title')}
        </h2>

        <div className="space-y-3">
          {FAQ_KEYS.map((key, i) => {
            const isOpen = openIndex === i
            return (
              <div key={key} className="bg-[#F5F3EF] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-bold text-sm text-[#111]">
                    {t(`faq.${key}` as Parameters<typeof t>[0])}
                  </span>
                  <span className={`text-[#FF6B35] text-xl transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {t(`faq.a${i + 1}` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
