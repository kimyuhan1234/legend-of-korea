'use client'

import { useTranslations } from 'next-intl'
import { GYEONGDO_KIT } from '@/lib/data/gyeongdo-events'

interface Props {
  locale: string
}

export function GyeongdoSharedInfo({ locale }: Props) {
  const t = useTranslations('quest.gyeongdo')
  const lk = locale as 'ko' | 'en' | 'ja'

  return (
    <div className="bg-white rounded-2xl border border-mist overflow-hidden p-5 md:p-7 flex flex-col gap-7">
      {/* 경도란? */}
      <div>
        <h3 className="text-base font-black text-ink mb-3">🎮 {t('whatIs')}</h3>
        <div className="bg-gradient-to-r from-mint/20 to-blossom/20 rounded-2xl p-5 space-y-3">
          <p className="text-sm text-slate leading-relaxed">{t('whatIsDesc')}</p>
          <div className="border-t border-mist pt-3">
            <p className="text-xs font-bold text-[#5BBDAD] mb-1">🇯🇵 {t('keydoro')}</p>
            <p className="text-xs text-slate">{t('keydoroDesc')}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { icon: '🚔', label: { ko: '경찰팀', en: 'Cops', ja: '警察チーム' } },
              { icon: '🏃', label: { ko: '도둑팀', en: 'Robbers', ja: '泥棒チーム' } },
              { icon: '🏛️', label: { ko: '감옥', en: 'Jail', ja: '牢屋' } },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-3 text-center border border-mist">
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-xs font-bold text-ink">{item.label[lk]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 키트 구성품 */}
      <div>
        <h3 className="text-base font-black text-ink mb-3">🎁 {t('includes')}</h3>
        <div className="space-y-2">
          {GYEONGDO_KIT.includes.map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-[#5BBDAD] font-bold mt-0.5">✓</span>
              <span className="text-slate">{item[lk] || item.ko}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 참여 흐름 3단계 */}
      <div>
        <h3 className="text-base font-black text-ink mb-3">👣 {t('howTo')}</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🛒', step: '1', label: t('step1'), sub: GYEONGDO_KIT.price.toLocaleString() + '원' },
            { icon: '📍', step: '2', label: t('step2'), sub: '' },
            { icon: '🏃', step: '3', label: t('step3'), sub: '' },
          ].map((s) => (
            <div key={s.step} className="bg-snow rounded-xl p-3 text-center border border-mist">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xs font-black text-[#5BBDAD] mb-0.5">Step {s.step}</div>
              <div className="text-xs font-bold text-ink leading-tight">{s.label}</div>
              {s.sub && <div className="text-xs text-slate mt-0.5 truncate">{s.sub}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-blossom/20 border border-blossom rounded-xl p-4">
        <p className="text-xs font-bold text-ink mb-2">⚠️ {lk === 'ko' ? '주의사항' : lk === 'ja' ? '注意事項' : 'Notice'}</p>
        <ul className="space-y-1">
          {[t('notice1'), t('notice2'), t('notice3')].map((notice, i) => (
            <li key={i} className="text-xs text-slate flex items-start gap-1.5">
              <span className="shrink-0 mt-0.5">·</span>
              <span>{notice}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
