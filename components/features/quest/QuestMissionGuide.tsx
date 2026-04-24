'use client'

import { usePathname } from 'next/navigation'

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const UI: Record<Lang, {
  title: string
  step1Title: string
  step1Desc: string
  step2Title: string
  step2Desc: string
  step3Title: string
  step3Desc: string
  tipTitle: string
  tips: string[]
  stepLabel: string
}> = {
  ko: {
    title: '📱 미션 진행 방법',
    stepLabel: 'STEP',
    step1Title: '📍 목적지로 이동',
    step1Desc: '미션 장소까지 이동하세요. 지도에서 위치를 확인할 수 있습니다.',
    step2Title: '📸 GPS 체크인',
    step2Desc: '미션 장소 반경 100m 이내에 도착하면 체크인 버튼이 활성화됩니다.',
    step3Title: '✅ 미션 완료',
    step3Desc: '체크인 후 미션이 완료되고 빗방울이 적립됩니다.',
    tipTitle: '💡 TIP',
    tips: [
      '위치 서비스(GPS)를 켜주세요',
      '실내에서는 GPS 정확도가 떨어질 수 있습니다',
      'Wi-Fi를 함께 켜면 위치 정확도가 올라갑니다',
    ],
  },
  ja: {
    title: '📱 ミッション進行方法',
    stepLabel: 'STEP',
    step1Title: '📍 目的地へ移動',
    step1Desc: 'ミッションの場所まで移動してください。地図で位置を確認できます。',
    step2Title: '📸 GPSチェックイン',
    step2Desc: 'ミッション場所から半径100m以内に到着するとチェックインボタンが有効になります。',
    step3Title: '✅ ミッション完了',
    step3Desc: 'チェックイン後、ミッションが完了し雨粒が獲得されます。',
    tipTitle: '💡 TIP',
    tips: [
      '位置情報(GPS)をオンにしてください',
      '屋内ではGPS精度が低下することがあります',
      'Wi-Fiを併用すると位置精度が向上します',
    ],
  },
  en: {
    title: '📱 How Missions Work',
    stepLabel: 'STEP',
    step1Title: '📍 Head to the Spot',
    step1Desc: 'Travel to the mission location. Check the map for exact coordinates.',
    step2Title: '📸 GPS Check-in',
    step2Desc: 'The check-in button activates when you arrive within 100m of the mission spot.',
    step3Title: '✅ Mission Complete',
    step3Desc: 'Your mission is marked complete and raindrops are awarded.',
    tipTitle: '💡 TIPS',
    tips: [
      'Turn on location services (GPS)',
      'GPS accuracy can drop indoors',
      'Keep Wi-Fi on to improve location accuracy',
    ],
  },
  'zh-CN': {
    title: '📱 任务进行方式',
    stepLabel: 'STEP',
    step1Title: '📍 前往目的地',
    step1Desc: '前往任务地点,地图上可以查看具体位置。',
    step2Title: '📸 GPS 签到',
    step2Desc: '到达任务地点 100 米范围内时,签到按钮将被激活。',
    step3Title: '✅ 任务完成',
    step3Desc: '签到后任务完成,并累积雨滴奖励。',
    tipTitle: '💡 提示',
    tips: [
      '请打开定位服务(GPS)',
      '室内 GPS 精度可能下降',
      '同时开启 Wi-Fi 可以提升定位精度',
    ],
  },
  'zh-TW': {
    title: '📱 任務進行方式',
    stepLabel: 'STEP',
    step1Title: '📍 前往目的地',
    step1Desc: '前往任務地點,地圖上可以查看具體位置。',
    step2Title: '📸 GPS 簽到',
    step2Desc: '到達任務地點 100 公尺範圍內時,簽到按鈕將被啟用。',
    step3Title: '✅ 任務完成',
    step3Desc: '簽到後任務完成,並累積雨滴獎勵。',
    tipTitle: '💡 提示',
    tips: [
      '請開啟定位服務(GPS)',
      '室內 GPS 精確度可能下降',
      '同時開啟 Wi-Fi 可以提升定位精確度',
    ],
  },
}

export function QuestMissionGuide() {
  const pathname = usePathname()
  const rawLocale = pathname.split('/')[1] || 'ko'
  const locale: Lang = (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as const).includes(rawLocale as Lang)
    ? (rawLocale as Lang)
    : 'ko'
  const t = UI[locale]

  const steps = [
    { title: t.step1Title, desc: t.step1Desc },
    { title: t.step2Title, desc: t.step2Desc },
    { title: t.step3Title, desc: t.step3Desc },
  ]

  return (
    <section className="bg-gradient-to-br from-mint-light via-sky-50 to-cloud py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-10">
          {t.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="bg-white rounded-3xl p-6 md:p-7 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 h-full">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-mint-deep text-white text-base font-black mb-3">
                  {i + 1}
                </div>
                <p className="text-[10px] font-black text-mint-deep uppercase tracking-widest mb-2">
                  {t.stepLabel} {i + 1}
                </p>
                <h3 className="text-base md:text-lg font-bold text-[#111] mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {step.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <>
                  <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-2xl text-mint-deep z-10">→</div>
                  <div className="md:hidden text-center text-2xl text-mint-deep py-1">↓</div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* TIP 섹션 */}
        <div className="mt-10 bg-white/70 backdrop-blur-sm border border-mint-light rounded-2xl p-5 md:p-6">
          <p className="text-sm font-black text-mint-deep mb-3">{t.tipTitle}</p>
          <ul className="space-y-1.5">
            {t.tips.map((tip, i) => (
              <li key={i} className="text-sm text-[#6B7280] leading-relaxed flex gap-2">
                <span className="text-mint-deep shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
