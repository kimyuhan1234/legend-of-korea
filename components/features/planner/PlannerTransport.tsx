'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface TransportItem {
  id: string
  item_type: string
  item_data: Record<string, unknown>
}

interface PlannerTransportProps {
  items: TransportItem[]
  locale: string
  onRemove: (itemId: string) => void
}

const TYPE_ICON: Record<string, string> = {
  ktx: '🚄', bus: '🚌', flight: '✈️', arex: '🚈', limousine: '🚐',
}

function getL(field: unknown, locale: string): string {
  if (typeof field === 'string') return field
  if (field && typeof field === 'object') {
    const obj = field as Record<string, string>
    return obj[locale] || obj.ko || ''
  }
  return ''
}

export function PlannerTransport({ items, locale, onRemove }: PlannerTransportProps) {
  const t = useTranslations('planner')

  const transportItems = items.filter((i) => i.item_type === 'transport')
  const goingItems = transportItems.filter((i) => i.item_data?.direction === 'going')
  const returningItems = transportItems.filter((i) => i.item_data?.direction === 'returning')

  const hasTransport = transportItems.length > 0

  return (
    <section>
      <div className="bg-white rounded-2xl border border-mist p-6">
        {hasTransport ? (
          <>
            <h3 className="text-lg font-bold text-ink mb-4">
              🚄 {t('transport.myTitle')}
            </h3>

            {/* 가는편 */}
            {goingItems.length > 0 ? (
              goingItems.map((item) => {
                const d = item.item_data
                const icon = TYPE_ICON[d.type as string] ?? '🚄'
                const typeName = typeof d.type === 'string' ? d.type.toUpperCase() : ''
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 mb-4 p-3 bg-mint-light/20 rounded-xl"
                  >
                    <span className="text-lg mt-0.5">✈️</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-mint-deep font-bold mb-1">
                        {t('transport.goingLabel')}{d.date ? ` ${d.date}` : ''}
                      </p>
                      <p className="text-sm text-ink font-medium">
                        {getL(d.from, locale)} → {getL(d.to, locale)}
                      </p>
                      <p className="text-xs text-slate">
                        {icon} {typeName}
                        {d.duration ? `, ${t('approx')} ${d.duration}` : ''}
                        {d.price ? `, ${d.price}` : ''}
                      </p>
                      {d.departureTime && (
                        <p className="text-xs text-mint-deep mt-1">
                          🕐 {t('transport.depart')} {d.departureTime as string}
                          {d.arrivalTime ? ` → ${t('transport.arrive')} ${t('approx')} ${d.arrivalTime as string}` : ''}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-stone hover:text-red-500 p-1 text-sm shrink-0"
                      aria-label={t('preview.remove')}
                    >
                      ✕
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="mb-4 p-3 bg-mist/30 rounded-xl">
                <p className="text-sm text-stone">✈️ {t('transport.goingEmpty')}</p>
              </div>
            )}

            {/* 오는편 */}
            {returningItems.length > 0 ? (
              returningItems.map((item) => {
                const d = item.item_data
                const icon = TYPE_ICON[d.type as string] ?? '🚄'
                const typeName = typeof d.type === 'string' ? d.type.toUpperCase() : ''
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 mb-4 p-3 bg-blossom/10 rounded-xl"
                  >
                    <span className="text-lg mt-0.5">🏠</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blossom-deep font-bold mb-1">
                        {t('transport.returningLabel')}{d.date ? ` ${d.date}` : ''}
                      </p>
                      <p className="text-sm text-ink font-medium">
                        {getL(d.from, locale)} → {getL(d.to, locale)}
                      </p>
                      <p className="text-xs text-slate">
                        {icon} {typeName}
                        {d.duration ? `, ${t('approx')} ${d.duration}` : ''}
                        {d.price ? `, ${d.price}` : ''}
                      </p>
                      {d.departureTime && (
                        <p className="text-xs text-blossom-deep mt-1">
                          🕐 {t('transport.depart')} {d.departureTime as string}
                          {d.arrivalTime ? ` → ${t('transport.arrive')} ${t('approx')} ${d.arrivalTime as string}` : ''}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-stone hover:text-red-500 p-1 text-sm shrink-0"
                      aria-label={t('preview.remove')}
                    >
                      ✕
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="mb-4 p-3 bg-mist/30 rounded-xl">
                <p className="text-sm text-stone">🏠 {t('transport.returningEmpty')}</p>
              </div>
            )}

            {/* TRAFFIC 변경 버튼 */}
            <Link
              href={`/${locale}/traffic`}
              className="block text-center bg-gradient-to-r from-mint to-blossom text-ink font-bold rounded-xl px-5 py-3 mt-2 hover:opacity-90 transition"
            >
              {t('transport.change')}
            </Link>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-ink mb-3">
              🚄 {t('transport.emptyTitle')}
            </h3>
            <p className="text-sm text-slate mb-4">
              {t('transport.emptyDesc')}
            </p>
            <Link
              href={`/${locale}/traffic`}
              className="block text-center bg-gradient-to-r from-mint to-blossom text-ink font-bold rounded-xl px-5 py-3 hover:opacity-90 transition"
            >
              {t('transport.goSelect')}
            </Link>
          </>
        )}
      </div>
    </section>
  )
}
