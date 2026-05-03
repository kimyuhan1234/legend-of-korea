import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Clock, CalendarOff, Car, Globe, Utensils } from 'lucide-react'
import type { TourRestaurantDetail, TourRestaurantImage } from '@/lib/tour-api/restaurants'
import type { KFoodCurationEntry } from '@/lib/data/kfood-curation'
import { KFOOD_CITY_TO_GROUP } from '@/lib/data/regions-hierarchy'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const LOCALE_TEXT: Record<
  Locale,
  {
    back: string
    info: string
    hours: string
    closed: string
    parking: string
    homepage: string
    menu: string
    mustTry: string
    overview: string
    map: string
    kakaoMap: string
    naverMap: string
    callTel: string
  }
> = {
  ko: {
    back: '← 식당 목록',
    info: '기본 정보',
    hours: '영업시간',
    closed: '휴무일',
    parking: '주차',
    homepage: '홈페이지',
    menu: '대표 메뉴',
    mustTry: '꼭 먹어볼 메뉴',
    overview: '소개',
    map: '지도',
    kakaoMap: '카카오맵 길찾기',
    naverMap: '네이버맵 길찾기',
    callTel: '전화 걸기',
  },
  ja: {
    back: '← 一覧に戻る',
    info: '基本情報',
    hours: '営業時間',
    closed: '定休日',
    parking: '駐車場',
    homepage: 'ホームページ',
    menu: '看板メニュー',
    mustTry: '必食メニュー',
    overview: '紹介',
    map: '地図',
    kakaoMap: 'カカオマップで道案内',
    naverMap: 'ネイバーマップで道案内',
    callTel: '電話する',
  },
  en: {
    back: '← Back to list',
    info: 'Info',
    hours: 'Hours',
    closed: 'Closed',
    parking: 'Parking',
    homepage: 'Website',
    menu: 'Signature menu',
    mustTry: 'Must try',
    overview: 'About',
    map: 'Map',
    kakaoMap: 'KakaoMap directions',
    naverMap: 'NaverMap directions',
    callTel: 'Call',
  },
  'zh-CN': {
    back: '← 返回列表',
    info: '基本信息',
    hours: '营业时间',
    closed: '休息日',
    parking: '停车',
    homepage: '官网',
    menu: '招牌菜',
    mustTry: '必吃推荐',
    overview: '介绍',
    map: '地图',
    kakaoMap: '在 KakaoMap 查路线',
    naverMap: '在 NaverMap 查路线',
    callTel: '拨打电话',
  },
  'zh-TW': {
    back: '← 返回列表',
    info: '基本資訊',
    hours: '營業時間',
    closed: '休息日',
    parking: '停車',
    homepage: '官網',
    menu: '招牌菜',
    mustTry: '必吃推薦',
    overview: '介紹',
    map: '地圖',
    kakaoMap: '在 KakaoMap 查路線',
    naverMap: '在 NaverMap 查路線',
    callTel: '撥打電話',
  },
}

interface Props {
  detail: TourRestaurantDetail
  images: TourRestaurantImage[]
  curation?: KFoodCurationEntry
  cityId: string
  locale: string
}

function stripHtml(s: string | undefined): string {
  if (!s) return ''
  return s.replace(/<[^>]+>/g, '').trim()
}

export function KFoodSpotDetail({ detail, images, curation, cityId, locale }: Props) {
  const lk: Locale = (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(locale as Locale)
    ? (locale as Locale)
    : 'ko'
  const t = LOCALE_TEXT[lk]

  const fullAddr = [detail.addr1, detail.addr2].filter(Boolean).join(' ').trim()
  const overview = stripHtml(curation?.customNote?.[lk as keyof typeof curation.customNote] || detail.overview)
  const homepageUrl = stripHtml(detail.homepage).match(/https?:\/\/\S+/)?.[0]

  const mustTryList =
    curation?.mustTry?.[lk as keyof typeof curation.mustTry] ||
    curation?.mustTry?.ko ||
    null

  // 카카오맵 / 네이버맵 외부 검색 링크 (제목 기준 — 좌표 정확도 X 한 사용자 도움)
  const queryTitle = encodeURIComponent(detail.title)
  const kakaoMapUrl = `https://map.kakao.com/?q=${queryTitle}`
  const naverMapUrl = `https://map.naver.com/v5/search/${queryTitle}`

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href={`/${locale}/food/kfood-spot/${KFOOD_CITY_TO_GROUP[cityId] ?? ''}/${cityId}/local-pick`}
        className="inline-flex items-center text-sm text-stone hover:text-ink transition-colors mb-6"
      >
        {t.back}
      </Link>

      {/* 히어로 이미지 */}
      {detail.firstimage && (
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-6 bg-cloud">
          <Image
            src={detail.firstimage}
            alt={detail.title}
            fill
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      )}

      {/* 제목 + 큐레이션 뱃지 */}
      <h1 className="text-3xl font-black text-ink mb-2">{detail.title}</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {curation?.priceRange && (
          <span className="px-2.5 py-1 rounded-full bg-mint-light/30 text-mint-deep text-xs font-bold">
            {curation.priceRange}
          </span>
        )}
        {curation?.tags?.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full bg-blossom/20 text-blossom-deep text-xs font-bold"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 기본 정보 */}
      <div className="bg-white rounded-2xl border border-mist p-5 space-y-3 mb-6">
        {fullAddr && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 mt-0.5 text-stone shrink-0" />
            <span className="text-ink">{fullAddr}</span>
          </div>
        )}
        {detail.tel && (
          <a href={`tel:${detail.tel}`} className="flex items-start gap-2 text-sm text-mint-deep hover:underline">
            <Phone className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              {detail.tel}
              <span className="text-xs text-stone ml-2">({t.callTel})</span>
            </span>
          </a>
        )}
        {detail.opentimefood && (
          <div className="flex items-start gap-2 text-sm">
            <Clock className="w-4 h-4 mt-0.5 text-stone shrink-0" />
            <span className="text-ink">
              <span className="text-stone mr-2">{t.hours}</span>
              {stripHtml(detail.opentimefood)}
            </span>
          </div>
        )}
        {detail.restdatefood && (
          <div className="flex items-start gap-2 text-sm">
            <CalendarOff className="w-4 h-4 mt-0.5 text-stone shrink-0" />
            <span className="text-ink">
              <span className="text-stone mr-2">{t.closed}</span>
              {stripHtml(detail.restdatefood)}
            </span>
          </div>
        )}
        {detail.parkingfood && (
          <div className="flex items-start gap-2 text-sm">
            <Car className="w-4 h-4 mt-0.5 text-stone shrink-0" />
            <span className="text-ink">
              <span className="text-stone mr-2">{t.parking}</span>
              {stripHtml(detail.parkingfood)}
            </span>
          </div>
        )}
        {homepageUrl && (
          <a
            href={homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 text-sm text-mint-deep hover:underline"
          >
            <Globe className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="break-all">{t.homepage}</span>
          </a>
        )}
      </div>

      {/* 메뉴 — 큐레이션 mustTry 우선, 없으면 TourAPI treatmenu/firstmenu */}
      {(mustTryList || detail.treatmenu || detail.firstmenu) && (
        <div className="bg-white rounded-2xl border border-mist p-5 mb-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink mb-3">
            <Utensils className="w-4 h-4 text-mint-deep" />
            {mustTryList ? t.mustTry : t.menu}
          </h2>
          {mustTryList ? (
            <ul className="list-disc list-inside text-sm text-ink space-y-1">
              {mustTryList.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink">{stripHtml(detail.treatmenu || detail.firstmenu)}</p>
          )}
        </div>
      )}

      {/* 갤러리 */}
      {images.length > 0 && (
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {images.map((img) => (
              <div
                key={img.serialnum}
                className="relative shrink-0 w-44 aspect-square rounded-2xl overflow-hidden bg-cloud"
              >
                <Image
                  src={img.smallimageurl || img.originimgurl}
                  alt={img.imgname || detail.title}
                  fill
                  sizes="176px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 소개 */}
      {overview && (
        <div className="bg-white rounded-2xl border border-mist p-5 mb-6">
          <h2 className="text-lg font-bold text-ink mb-3">{t.overview}</h2>
          <p className="text-sm text-ink leading-relaxed whitespace-pre-line">{overview}</p>
        </div>
      )}

      {/* 지도 — 외부 길찾기 링크 */}
      <div className="bg-white rounded-2xl border border-mist p-5">
        <h2 className="text-lg font-bold text-ink mb-3">{t.map}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={kakaoMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-ink text-sm font-bold transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {t.kakaoMap}
          </a>
          <a
            href={naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {t.naverMap}
          </a>
        </div>
      </div>
    </div>
  )
}
