'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Calendar, Clock, MapPin, Phone, Globe, Users, Ticket, Map as MapIcon, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import type { NormalizedSpot, TourAPIDetailResponse } from '@/lib/tour-api/types'

interface Props {
  spot: NormalizedSpot | null
  locale: string
  onClose: () => void
}

function getI18n(field: { [k: string]: string } | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

/** YYYYMMDD → 로케일 포맷 날짜. */
function formatYMD(v: string | undefined, locale: string): string {
  if (!v) return ''
  const clean = v.replace(/-/g, '')
  if (clean.length !== 8) return v
  const y = parseInt(clean.slice(0, 4), 10)
  const m = parseInt(clean.slice(4, 6), 10) - 1
  const d = parseInt(clean.slice(6, 8), 10)
  const dt = new Date(y, m, d)
  if (isNaN(dt.getTime())) return v
  const localeKey =
    locale === 'ko' ? 'ko-KR'
    : locale === 'ja' ? 'ja-JP'
    : locale === 'zh-CN' ? 'zh-CN'
    : locale === 'zh-TW' ? 'zh-TW'
    : 'en-US'
  return dt.toLocaleDateString(localeKey, { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * 외부 지도 링크 — Google Maps universal URL.
 *
 * Naver/Kakao 대신 Google Maps 사용 이유:
 *  - 5 locale (ja/en/zh-CN/zh-TW) 외국인 사용자 대다수가 Google Maps 사용
 *  - 앱 설치 불필요 (브라우저 직접 열림)
 *  - lat/lng 좌표 보편 포맷 지원
 */
function googleMapsUrl(lat?: string, lng?: string, addr?: string): string | null {
  if (lat && lng) {
    const latNum = parseFloat(lat)
    const lngNum = parseFloat(lng)
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      return `https://www.google.com/maps/search/?api=1&query=${latNum},${lngNum}`
    }
  }
  if (addr) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`
  }
  return null
}

/** href 추출 — homepage 필드는 종종 <a href="..."> 래핑되어 옴. */
function extractHref(html: string | undefined): string | null {
  if (!html) return null
  const m = html.match(/href=["']([^"']+)["']/i)
  if (m) return m[1]
  // 평문 URL 패턴
  const u = html.match(/https?:\/\/\S+/i)
  return u ? u[0] : null
}

function isHttpsImage(src: string | undefined): boolean {
  return !!src && /^https?:\/\//.test(src)
}

interface InfoRowProps {
  Icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | undefined | null
}

function InfoRow({ Icon, label, value }: InfoRowProps) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-mint-deep" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-stone uppercase tracking-wide">{label}</p>
        <p className="text-sm text-slate-700 break-words">{value}</p>
      </div>
    </div>
  )
}

export function SpotDetailModal({ spot, locale, onClose }: Props) {
  const t = useTranslations('spots.detail')
  const [detail, setDetail] = useState<TourAPIDetailResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOpen = spot !== null
  const isStatic = spot?.source === 'static'
  const canFetch = spot?.source === 'tourapi' && !!spot.contentId && !!spot.contentTypeId

  useEffect(() => {
    if (!isOpen || !canFetch) {
      setDetail(null)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({
      contentTypeId: String(spot!.contentTypeId),
      locale,
    })
    fetch(`/api/spots/${encodeURIComponent(spot!.contentId!)}?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<TourAPIDetailResponse & { error?: string }>
      })
      .then((data) => {
        if (cancelled) return
        if (data.error) {
          setError(data.error)
          setDetail(null)
        } else {
          setDetail(data)
        }
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Spot detail fetch error:', err)
        setError('fetch_failed')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [isOpen, canFetch, spot, locale])

  if (!spot) return null

  const name = getI18n(spot.name, locale)
  const description = getI18n(spot.description, locale)
  const common = detail?.common ?? null
  const intro = detail?.intro ?? null
  const ctype = spot.contentTypeId

  // 이미지: detailCommon firstimage 우선, 없으면 spot.image
  const heroImage = (common?.firstimage && isHttpsImage(common.firstimage))
    ? common.firstimage
    : spot.image

  const hasRealImage = heroImage && !heroImage.includes('placeholder')

  // 주소: common.addr1 우선
  const fullAddr = common ? [common.addr1, common.addr2].filter(Boolean).join(' ') : spot.address

  // 지도 링크
  const mapUrl = googleMapsUrl(common?.mapx, common?.mapy, fullAddr)

  // homepage URL (HTML 형태로 옴)
  const homepageUrl = extractHref(common?.homepage)

  // 축제 일정 (intro 우선, 없으면 spot 의 startDate/endDate)
  const eventStart = intro?.eventstartdate || spot.startDate
  const eventEnd = intro?.eventenddate || spot.endDate
  const dateRange = eventStart
    ? (eventEnd && eventEnd !== eventStart
        ? `${formatYMD(eventStart, locale)} ~ ${formatYMD(eventEnd, locale)}`
        : formatYMD(eventStart, locale))
    : ''

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] max-h-[90vh] p-0 overflow-hidden flex flex-col gap-0 rounded-2xl">
        {/* sr-only title for a11y */}
        <DialogTitle className="sr-only">{name}</DialogTitle>

        {/* 스크롤 영역 */}
        <div className="overflow-y-auto flex-1">
          {/* 1) Cover */}
          <div className="relative aspect-[16/9] bg-cloud">
            {hasRealImage ? (
              <Image
                src={heroImage}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-cover"
                unoptimized={spot.source === 'tourapi'}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-mint-light to-blossom-light text-6xl">
                {spot.category === 'festival' ? '🎊' : spot.category === 'hotspot' ? '🔥' : '🏛️'}
              </div>
            )}
          </div>

          <div className="p-5 md:p-6 space-y-4">
            {/* 2) Title */}
            <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
              {name}
            </h2>

            {/* 로딩 / 에러 / static 안내 */}
            {loading && (
              <div className="flex items-center justify-center gap-2 py-3 text-stone">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-bold">{t('loading')}</span>
              </div>
            )}
            {error && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                {t('errorPartial')}
              </div>
            )}
            {isStatic && (
              <div className="rounded-xl bg-mint-light/30 border border-mint/30 p-3 text-xs text-slate-600">
                {t('staticHint')}
              </div>
            )}

            {/* 3) 축제 — 진행 기간 */}
            {ctype === '15' && dateRange && (
              <InfoRow Icon={Calendar} label={t('eventPeriod')} value={dateRange} />
            )}

            {/* 4) 축제 — 진행 시간 / 일반 — 운영시간 */}
            {ctype === '15' && intro?.playtime && (
              <InfoRow Icon={Clock} label={t('playtime')} value={intro.playtime} />
            )}
            {ctype === '12' && intro?.usetime && (
              <InfoRow Icon={Clock} label={t('usetime')} value={intro.usetime} />
            )}
            {ctype === '14' && intro?.usetimeculture && (
              <InfoRow Icon={Clock} label={t('usetime')} value={intro.usetimeculture} />
            )}
            {ctype === '28' && intro?.usetimeleports && (
              <InfoRow Icon={Clock} label={t('usetime')} value={intro.usetimeleports} />
            )}

            {/* 5) 휴무일 */}
            {ctype === '12' && intro?.restdate && (
              <InfoRow Icon={Calendar} label={t('restdate')} value={intro.restdate} />
            )}
            {ctype === '14' && intro?.restdateculture && (
              <InfoRow Icon={Calendar} label={t('restdate')} value={intro.restdateculture} />
            )}
            {ctype === '28' && intro?.restdateleports && (
              <InfoRow Icon={Calendar} label={t('restdate')} value={intro.restdateleports} />
            )}

            {/* 6) 장소 / 주소 */}
            <InfoRow
              Icon={MapPin}
              label={ctype === '15' ? t('eventPlace') : t('address')}
              value={(ctype === '15' ? intro?.eventplace : null) || fullAddr || null}
            />

            {/* 7) 요금 */}
            {ctype === '15' && (
              <InfoRow Icon={Ticket} label={t('fee')} value={intro?.usetimefestival || t('feeFree')} />
            )}
            {ctype === '14' && intro?.usefee && (
              <InfoRow Icon={Ticket} label={t('fee')} value={intro.usefee} />
            )}
            {ctype === '28' && intro?.usefeeleports && (
              <InfoRow Icon={Ticket} label={t('fee')} value={intro.usefeeleports} />
            )}

            {/* 8) 주최 (축제) */}
            {ctype === '15' && intro?.sponsor1 && (
              <InfoRow Icon={Users} label={t('sponsor')} value={intro.sponsor1} />
            )}

            {/* 9) 거리/소요시간 (코스) */}
            {ctype === '25' && intro?.distance && (
              <InfoRow Icon={MapIcon} label={t('distance')} value={intro.distance} />
            )}
            {ctype === '25' && intro?.taketime && (
              <InfoRow Icon={Clock} label={t('taketime')} value={intro.taketime} />
            )}
            {ctype === '25' && intro?.schedule && (
              <InfoRow Icon={Calendar} label={t('schedule')} value={intro.schedule} />
            )}

            {/* 10) 연락처 */}
            <InfoRow Icon={Phone} label={t('tel')} value={common?.tel || null} />

            {/* 11) 행사 프로그램 (축제) — HTML sanitize 됨 (서버에서) */}
            {ctype === '15' && intro?.program && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-stone uppercase tracking-wide mb-1.5">
                  {t('program')}
                </p>
                <div
                  className="text-sm text-slate-700 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: intro.program }}
                />
              </div>
            )}

            {/* 12) 상세 소개 (overview) */}
            {common?.overview ? (
              <div className="pt-2 border-t border-mist">
                <p className="text-[11px] font-bold text-stone uppercase tracking-wide mb-1.5">
                  {t('overview')}
                </p>
                <div
                  className="text-sm text-slate-700 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: common.overview }}
                />
              </div>
            ) : (isStatic && description) ? (
              <div className="pt-2 border-t border-mist">
                <p className="text-[11px] font-bold text-stone uppercase tracking-wide mb-1.5">
                  {t('overview')}
                </p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            ) : null}

            {/* 13) 외부 링크 */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-mist">
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-mint-deep text-white text-xs font-black shadow-sm hover:opacity-90 transition-opacity"
                >
                  <MapIcon className="w-3.5 h-3.5" /> {t('openMap')}
                </a>
              )}
              {homepageUrl && (
                <a
                  href={homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-mist text-slate-700 text-xs font-black hover:border-mint transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" /> {t('homepage')}
                </a>
              )}
              {common?.tel && (
                <a
                  href={`tel:${common.tel}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-mist text-slate-700 text-xs font-black hover:border-mint transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> {t('call')}
                </a>
              )}
            </div>

            {/* 14) source 출처 */}
            {spot.source === 'tourapi' && (
              <p className="text-[10px] text-stone/60 text-right pt-2">{t('source')}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
