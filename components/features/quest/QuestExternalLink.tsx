'use client'

import { useTranslations } from 'next-intl'
import { ExternalLink, Globe } from 'lucide-react'

interface Props {
  url: string
  source: 'visitkorea' | 'koreanfolk'
}

/**
 * 외부 공식 코스 페이지 링크 카드.
 *
 * VisitKorea (한국관광공사) / 한국민속촌 등 공식 출처 링크 노출 — 사용자에게
 * "운영자 자체 큐레이션 + 공식 데이터 보완" 신뢰 신호 제공.
 *
 * 보안: target="_blank" rel="noopener noreferrer" 필수.
 * 디자인: 기존 quest 페이지 톤 매치 (mint 액센트).
 */
export function QuestExternalLink({ url, source }: Props) {
  const t = useTranslations('quest.externalLink')

  return (
    <section className="bg-snow py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white rounded-2xl border border-mist p-5 md:p-6 hover:border-mint hover:shadow-md transition-all group"
        >
          <div className="shrink-0 w-12 h-12 rounded-full bg-mint-light/40 flex items-center justify-center">
            <Globe className="w-6 h-6 text-mint-deep" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-stone uppercase tracking-wide mb-1">
              {t('title')}
            </p>
            <p className="text-sm md:text-base font-bold text-slate-700">
              {t(`source.${source}`)}
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-mint-deep text-white text-xs font-black group-hover:opacity-90 transition-opacity">
            {t('cta')} <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>
      </div>
    </section>
  )
}
