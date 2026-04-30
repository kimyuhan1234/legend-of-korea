import { Metadata } from "next"
import { Sparkles } from "lucide-react"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"

interface Props {
  params: { locale: string }
}

const META = {
  ko: { title: '듀프 — 준비 중 | Cloud with you', desc: '더 정확하고 깊이 있는 한식 큐레이션을 준비하고 있어요.' },
  ja: { title: 'デュープ — 準備中 | Cloud with you', desc: 'より正確で深みのある韓食キュレーションを準備中です。' },
  en: { title: 'Dupe — Coming soon | Cloud with you', desc: 'Preparing a more accurate, in-depth Korean food curation.' },
  'zh-CN': { title: '美食对比 — 准备中 | Cloud with you', desc: '正在准备更准确、更深度的韩食精选。' },
  'zh-TW': { title: '美食對比 — 準備中 | Cloud with you', desc: '正在準備更準確、更深度的韓食精選。' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] ?? META.ko
  return { title: m.title, description: m.desc }
}

const HERO = {
  ko: {
    badge: '🔗 듀프',
    title: '준비 중',
    body: '더 정확하고 깊이 있는 한식 큐레이션을 준비하고 있어요.\n곧 다시 만나요!',
  },
  ja: {
    badge: '🔗 デュープ',
    title: '準備中',
    body: 'より正確で深みのある韓食キュレーションを準備中です。\nまもなくお会いしましょう。',
  },
  en: {
    badge: '🔗 Dupe',
    title: 'Coming soon',
    body: "We're preparing a more accurate and in-depth Korean food curation.\nSee you soon!",
  },
  'zh-CN': {
    badge: '🔗 美食对比',
    title: '准备中',
    body: '正在准备更准确、更深度的韩食精选。\n敬请期待！',
  },
  'zh-TW': {
    badge: '🔗 美食對比',
    title: '準備中',
    body: '正在準備更準確、更深度的韓食精選。\n敬請期待！',
  },
}

export default function DupeStubPage({ params }: Props) {
  const { locale } = params
  const h = HERO[locale as keyof typeof HERO] ?? HERO.ko

  return (
    <div className="min-h-screen bg-snow">
      <FoodTabNav locale={locale} activeTab="dupe" />
      <section className="bg-gradient-to-br from-mint to-blossom text-ink py-20 md:py-28 px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-blossom-deep/30 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blossom-deep" strokeWidth={2} aria-hidden />
          <span className="text-blossom-deep text-sm font-bold">{h.badge}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">{h.title}</h1>
        <p className="text-base md:text-lg text-slate whitespace-pre-line max-w-md mx-auto leading-relaxed">{h.body}</p>
      </section>
    </div>
  )
}
