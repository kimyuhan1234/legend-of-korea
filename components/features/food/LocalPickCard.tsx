import Link from 'next/link'
import Image from 'next/image'
import type { LocalPickItem } from '@/lib/data/local-picks'
import type { TourRestaurantDetail } from '@/lib/tour-api/restaurants'
import { KFOOD_CITY_TO_GROUP } from '@/lib/data/regions-hierarchy'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

interface Props {
  pick: LocalPickItem
  detail: TourRestaurantDetail
  city: string
  locale: string
}

export function LocalPickCard({ pick, detail, city, locale }: Props) {
  const lk: Locale = (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(locale as Locale)
    ? (locale as Locale)
    : 'ko'
  const tagline = pick.curation?.tagline?.[lk as 'ko' | 'ja' | 'en'] || pick.curation?.tagline?.ko
  const group = KFOOD_CITY_TO_GROUP[city]

  return (
    <Link
      href={`/${locale}/food/kfood-spot/${group}/${city}/local-pick/${pick.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-mist hover:border-mint-deep hover:shadow-md transition-all"
    >
      {detail.firstimage && (
        <div className="relative aspect-[16/9] bg-cloud">
          <Image
            src={detail.firstimage}
            alt={detail.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          <div className="absolute top-2 left-2 bg-ink/85 text-white px-2.5 py-1 rounded-full text-xs font-black">
            #{pick.rank}
          </div>
        </div>
      )}
      <div className="p-4 space-y-2">
        <h3 className="text-base font-black text-ink line-clamp-1">{detail.title}</h3>
        {tagline && <p className="text-sm text-stone line-clamp-2">{tagline}</p>}
        {pick.curation?.tags && pick.curation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {pick.curation.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-mint-light/40 text-mint-deep text-[11px] font-bold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        {detail.addr1 && <p className="text-xs text-stone line-clamp-1">{detail.addr1}</p>}
      </div>
    </Link>
  )
}
