import type { Metadata } from 'next'
import Link from 'next/link'
import { getGuide } from '@/lib/data/quest-guide'
import { GuideFaqAccordion } from '@/components/features/quest/GuideFaqAccordion'

interface Props {
  params: { locale: string }
}

const META: Record<string, { title: string; desc: string }> = {
  ko:      { title: 'Cloud with you 미션 가이드 | Cloud with you',       desc: '한국의 숨겨진 명소를 찾는 보물찾기 여행 — 처음이어도 괜찮아요!' },
  ja:      { title: 'Cloud with you ミッションガイド | Cloud with you',  desc: '韓国の隠れた名所を巡る宝探しの旅 — 初めてでも大丈夫!' },
  en:      { title: 'Cloud with you Mission Guide | Cloud with you',     desc: 'Treasure hunt across hidden Korean gems — first-timer friendly!' },
  'zh-CN': { title: 'Cloud with you 任务指南 | Cloud with you',           desc: '探访韩国隐藏名胜的寻宝之旅 — 新手也能轻松上手!' },
  'zh-TW': { title: 'Cloud with you 任務指南 | Cloud with you',           desc: '探訪韓國隱藏名勝的尋寶之旅 — 新手也能輕鬆上手!' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function QuestGuidePage({ params }: Props) {
  const { locale } = params
  const g = getGuide(locale)

  return (
    <div className="min-h-screen bg-snow">
      {/* Hero */}
      <section className="bg-gradient-to-br from-mint-light via-sky-50 to-blossom border-b border-mist py-16 md:py-24 px-6 md:px-10 text-center">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-[#111] leading-tight mb-4">
          {g.title}
        </h1>
        <p className="text-stone text-base md:text-lg max-w-2xl mx-auto">
          {g.subtitle}
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-10 md:space-y-14">

        {/* S1 — 미션이 뭔가요? */}
        <section className="bg-white rounded-3xl border border-mist p-6 md:p-8 shadow-sm">
          <h2 className="text-xl md:text-2xl font-black text-[#111] mb-4">
            💡 {g.s1Title}
          </h2>
          <p className="text-slate leading-relaxed whitespace-pre-line">{g.s1Body}</p>
        </section>

        {/* S2 — 시작하는 법 */}
        <section>
          <h2 className="text-xl md:text-2xl font-black text-[#111] mb-5 text-center">
            🚀 {g.s2Title}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: g.s2Step1Title, items: g.s2Step1Items, icon: '🗺️' },
              { title: g.s2Step2Title, items: g.s2Step2Items, icon: '🎟️' },
              { title: g.s2Step3Title, items: g.s2Step3Items, icon: '🎮' },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-3xl border border-mist p-5 md:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-mint-deep text-white text-sm font-black">
                    {i + 1}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-mint-deep">
                    {g.stepLabel} {i + 1}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-[#111] mb-3">
                  {step.icon} {step.title}
                </h3>
                <ul className="space-y-1.5 text-sm text-slate">
                  {step.items.map((it, j) => (
                    <li key={j} className="flex gap-2"><span className="text-mint-deep shrink-0">•</span><span>{it}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* S3 — 미션 장소 찾기 */}
        <section className="bg-white rounded-3xl border border-mist p-6 md:p-8 shadow-sm">
          <h2 className="text-xl md:text-2xl font-black text-[#111] mb-4">
            📍 {g.s3Title}
          </h2>
          <p className="text-slate mb-4">{g.s3Intro}</p>
          <div className="space-y-2 mb-5">
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-sm text-amber-800">{g.s3PinOrange}</div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm text-emerald-800">{g.s3PinGreen}</div>
            <div className="rounded-xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-sm text-slate-700">{g.s3PinGray}</div>
          </div>
          <p className="text-sm font-bold text-[#111] mb-2">{g.s3TapLabel}</p>
          <ul className="space-y-1.5 text-sm text-slate mb-5">
            {g.s3TapItems.map((it, i) => (
              <li key={i} className="flex gap-2"><span className="text-mint-deep shrink-0">•</span><span>{it}</span></li>
            ))}
          </ul>
          <div className="bg-mint-light/50 rounded-2xl p-4">
            <p className="text-sm font-black text-mint-deep mb-2">{g.s3Tip}</p>
            <ul className="space-y-1.5 text-sm text-slate">
              {g.s3TipItems.map((it, i) => (
                <li key={i} className="flex gap-2"><span className="text-mint-deep shrink-0">•</span><span>{it}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* S4 — GPS 체크인 */}
        <section className="bg-gradient-to-br from-sky-50 to-cloud rounded-3xl border border-sky-100 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-black text-[#111] mb-4">
            🛰️ {g.s4Title}
          </h2>
          <p className="text-slate mb-4">{g.s4Intro}</p>
          <ol className="space-y-2 mb-6">
            {g.s4Steps.map((step, i) => (
              <li key={i} className="flex gap-3 bg-white rounded-xl p-3 border border-white">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-black shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-slate leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-sm font-black text-amber-800 mb-2">{g.s4TroubleTitle}</p>
            <ul className="space-y-1.5 text-sm text-amber-900">
              {g.s4TroubleItems.map((it, i) => (
                <li key={i} className="flex gap-2"><span className="shrink-0">•</span><span>{it}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* S5 — 미션 수행 */}
        <section>
          <h2 className="text-xl md:text-2xl font-black text-[#111] mb-5 text-center">
            🎯 {g.s5Title}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: g.s5QuizTitle,  quote: g.s5QuizQuote,  body: g.s5QuizBody,  extra: g.s5QuizHints,   bg: 'from-emerald-50 to-mint-light' },
              { title: g.s5PhotoTitle, quote: g.s5PhotoQuote, body: g.s5PhotoBody, extra: null,            bg: 'from-sky-50 to-cloud' },
              { title: g.s5OpenTitle,  quote: g.s5OpenQuote,  body: g.s5OpenBody,  extra: null,            bg: 'from-peach to-blossom/40' },
              { title: g.s5BossTitle,  quote: g.s5BossQuote,  body: g.s5BossBody,  extra: null,            bg: 'from-rose-50 to-orange-100' },
            ].map((m, i) => (
              <div key={i} className={`bg-gradient-to-br ${m.bg} rounded-3xl border border-white/60 p-5 md:p-6 shadow-sm`}>
                <h3 className="text-base md:text-lg font-black text-[#111] mb-2">{m.title}</h3>
                <p className="text-sm text-slate italic mb-3">{m.quote}</p>
                <p className="text-sm text-slate leading-relaxed">{m.body}</p>
                {m.extra && (
                  <ul className="mt-3 space-y-1 text-xs text-slate">
                    {m.extra.map((h, j) => (
                      <li key={j} className="flex gap-2"><span className="shrink-0">•</span><span>{h}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* S6 — 보상 */}
        <section className="bg-white rounded-3xl border border-mist p-6 md:p-8 shadow-sm">
          <h2 className="text-xl md:text-2xl font-black text-[#111] mb-4">
            🎁 {g.s6Title}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-black text-[#111] mb-3">{g.s6RewardTitle}</p>
              <ul className="space-y-2 text-sm text-slate">
                {g.s6RewardItems.map((it, i) => (
                  <li key={i} className="bg-mint-light/40 rounded-xl px-3 py-2">{it}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-black text-[#111] mb-3">{g.s6SpendTitle}</p>
              <ul className="space-y-2 text-sm text-slate">
                {g.s6SpendItems.map((it, i) => (
                  <li key={i} className="bg-blossom/30 rounded-xl px-3 py-2">{it}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* S7 — 파티 플레이 */}
        <section className="bg-gradient-to-br from-blossom/40 to-peach rounded-3xl border border-white/60 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-black text-[#111] mb-3">
            🤝 {g.s7Title}
          </h2>
          <p className="text-slate mb-5">{g.s7Intro}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white rounded-2xl p-5 border border-white">
              <p className="text-sm font-black text-[#111] mb-3">{g.s7StepsTitle}</p>
              <ol className="space-y-2 text-sm text-slate">
                {g.s7Steps.map((it, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-mint-deep text-white text-[10px] font-black shrink-0 mt-0.5">{i + 1}</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-white">
              <p className="text-sm font-black text-[#111] mb-3">{g.s7BenefitsTitle}</p>
              <ul className="space-y-1.5 text-sm text-slate">
                {g.s7Benefits.map((it, i) => (
                  <li key={i} className="flex gap-2"><span className="text-mint-deep shrink-0">•</span><span>{it}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* S8 — FAQ */}
        <section>
          <h2 className="text-xl md:text-2xl font-black text-[#111] mb-5 text-center">
            ❓ {g.s8Title}
          </h2>
          <GuideFaqAccordion faqs={g.faq} />
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-mint to-blossom rounded-3xl p-8 md:p-10 text-center">
          <p className="text-lg md:text-xl font-black text-ink mb-5">{g.ctaText}</p>
          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-mint-deep text-white font-bold hover:bg-[#7BC8BC] transition-colors"
          >
            {g.ctaButton}
          </Link>
        </section>
      </div>
    </div>
  )
}
