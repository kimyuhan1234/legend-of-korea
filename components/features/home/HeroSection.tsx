import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface Props {
  locale: string
}

/**
 * 신규 가치 제안 히어로 (P1-1).
 * 외국인 페르소나 (Yuki/Mike/Lin) 첫 3초 룰 통과를 목표로
 * "Korea is not a destination. It's a quest." 형식의 헤드라인 + 서브카피 +
 * Primary/Secondary CTA + 트러스트 배지를 노출한다.
 *
 * 결제 동선 (패스 4개) 은 본 섹션 직하단의 <HeroPassButtons /> 가 담당.
 */
export function HeroSection({ locale }: Props) {
  const t = useTranslations('homeHero')

  return (
    <section className="relative overflow-hidden bg-snow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-12 md:pt-20 md:pb-16">
        {/* 트러스트 배지 — 영문 'Founding Members beta — limited to 50/day' 가 최장(45자).
            매우 좁은 뷰포트에서 wrap 가능하도록 max-w + whitespace-normal */}
        <div className="mb-5 md:mb-6 max-w-full">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[11px] md:text-xs font-medium leading-snug whitespace-normal">
            {t('trustBadge')}
          </span>
        </div>

        {/* 헤드라인 — 두 줄 명시적 동일 size/weight/leading.
            hotfix: 부모 cascade 의존 시 외부 CSS / 폰트 광학 효과로 시각 차이 보고됨.
            두 span 모두 동일 className 직접 명시 → 같은 specificity 보장. */}
        <h1 className="mb-3 md:mb-4 max-w-3xl">
          <span className="block text-4xl md:text-6xl font-black leading-[1.15] text-[#111]">
            {t('headline')}
          </span>
          <span className="block text-4xl md:text-6xl font-black leading-[1.15] text-mint-deep">
            {t('headlineEmphasis')}
          </span>
        </h1>

        {/* 서브 헤드라인 */}
        <p className="text-sm sm:text-base md:text-lg text-slate leading-relaxed mb-6 md:mb-8 max-w-2xl">
          {t('subheadline')}
        </p>

        {/* CTA 버튼 묶음 (위계 명확) */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href={`/${locale}/auth/signup`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-mint-deep text-white font-bold text-base hover:bg-[#7BC8BC] transition-colors min-h-[48px]"
          >
            {t('ctaPrimary')}
            <span className="ml-2" aria-hidden>→</span>
          </Link>

          <Link
            href={`/${locale}/pass`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-bold text-base hover:bg-slate-50 transition-colors min-h-[48px]"
          >
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  )
}
