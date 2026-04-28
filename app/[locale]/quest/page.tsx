import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import type { I18nText } from '@/lib/supabase/types'

interface Props {
  params: Promise<{ locale: string }>
}

function getI18n(field: I18nText | null | undefined, locale: string): string {
  if (!field) return ''
  return (field as unknown as Record<string, string>)[locale] || field.en || field.ko || ''
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'quest.hub' })
  return {
    title: `${t('meta_title')} | Cloud with you`,
    description: t('meta_description'),
  }
}

/**
 * /[locale]/quest — 9 개 도시 코스 hub.
 *
 * PRD-PRICING-2026-001: /pass/success 의 cta_start 가 본 페이지로 link.
 * 사용자는 코스 카드 클릭 → /courses/{courseId} 진입 → LockScreen 또는 미션 시작.
 */
export default async function QuestHubPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'quest.hub' })

  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('id, region, title, thumbnail_url, difficulty')
    .eq('is_active', true)
    .order('region')

  return (
    <main className="min-h-screen bg-cloud py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-ink mb-3">{t('title')}</h1>
          <p className="text-stone text-sm md:text-base">{t('subtitle')}</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {(courses ?? []).map((course) => {
            const c = course as { id: string; region: string | null; title: I18nText; thumbnail_url: string | null; difficulty: string | null }
            const title = getI18n(c.title, locale)
            const thumb = c.thumbnail_url || '/images/dokkaebi-hero.png'
            return (
              <Link
                key={c.id}
                href={`/${locale}/courses/${c.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-mist hover:border-mint transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={thumb}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-mint-deep mb-1">
                    {c.region ?? ''}
                  </p>
                  <h3 className="text-base font-black text-ink">{title}</h3>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${locale}/quest/guide`}
            className="text-blossom-deep underline text-sm hover:no-underline"
          >
            {t('guide_link')}
          </Link>
        </div>
      </div>
    </main>
  )
}
