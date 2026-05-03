import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { getActivePass } from '@/lib/auth/pass'
import { GalleryClient } from '@/components/features/gallery/GalleryClient'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'gallery' })
  return {
    title: `${t('title')} | Clouds with you`,
    description: t('subtitle'),
  }
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'gallery' })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const activePass = await getActivePass(user?.id ?? null)
  const hasPass = activePass !== null

  return (
    <div className="min-h-screen bg-snow">
      {/* 히어로 */}
      <div className="bg-tier-soft border-b border-mist py-16 md:py-24 px-6 md:px-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white text-stone
                         text-xs font-bold uppercase tracking-widest mb-5 shadow-sm">
          GALLERY
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">
          {t('title')}
        </h1>
        <p className="text-stone text-base max-w-md mx-auto">{t('subtitle')}</p>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <GalleryClient locale={locale} initialHasPass={hasPass} />
      </div>
    </div>
  )
}
