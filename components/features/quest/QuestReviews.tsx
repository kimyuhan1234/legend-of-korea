'use client'

import { useTranslations } from 'next-intl'

const REVIEWS = [
  { flag: '🇺🇸', name: 'Sarah M.', text: 'The dokkaebi mission was AMAZING! Found hidden spots I\'d never discover alone.', stars: 5 },
  { flag: '🇯🇵', name: 'Yuki T.', text: '전주で宝探しみたいな体験！最高の思い出ができました', stars: 5 },
  { flag: '🇫🇷', name: 'Pierre L.', text: 'Meilleure façon de découvrir la culture coréenne! Incroyable.', stars: 5 },
  { flag: '🇹🇭', name: 'Somchai K.', text: 'สนุกมาก! ได้สำรวจเมืองแบบไม่เคยทำมาก่อน', stars: 5 },
]

export function QuestReviews() {
  const t = useTranslations('quest')

  return (
    <section className="bg-cloud py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-10">
          {t('reviews.title')}
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="shrink-0 w-72 bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{review.flag}</span>
                <div>
                  <p className="font-bold text-sm text-[#111]">{review.name}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-mint-deep/10 text-[9px] font-bold text-mint-deep uppercase tracking-widest">
                    {t('reviews.verified')}
                  </span>
                </div>
              </div>
              <div className="text-yellow-400 text-sm mb-3">
                {'⭐'.repeat(review.stars)}
              </div>
              <p className="text-sm text-[#374151] leading-relaxed">&ldquo;{review.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
