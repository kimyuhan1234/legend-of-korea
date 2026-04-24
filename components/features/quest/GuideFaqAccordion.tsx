'use client'

import { useState } from 'react'
import type { GuideFaq } from '@/lib/data/quest-guide'

interface Props {
  faqs: GuideFaq[]
}

export function GuideFaqAccordion({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <ul className="space-y-2">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <li key={i} className="bg-white rounded-2xl border border-mist overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-cloud/40 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="flex items-start gap-2 text-sm md:text-base font-bold text-[#111]">
                <span className="text-mint-deep shrink-0">Q.</span>
                <span>{item.q}</span>
              </span>
              <span
                className={`text-stone text-sm transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-0">
                <div className="bg-mint-light/40 rounded-xl p-4 flex items-start gap-2 text-sm text-slate leading-relaxed">
                  <span className="font-black text-mint-deep shrink-0">A.</span>
                  <span className="whitespace-pre-line">{item.a}</span>
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
