'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PASSES } from '@/lib/data/passes'

type I18nKey = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'
type I18nDict = Record<I18nKey, string>

interface FeatureLink {
  id: string
  icon: string
  name: I18nDict
  description: I18nDict
  href: string
  image: string
}

const PASS_FEATURES: Record<'move' | 'live' | 'story', FeatureLink[]> = {
  move: [
    {
      id: 'traffic',
      icon: '🚆',
      name: { ko: 'TRAFFIC', en: 'TRAFFIC', ja: 'TRAFFIC', 'zh-CN': 'TRAFFIC', 'zh-TW': 'TRAFFIC' },
      description: {
        ko: '교통 경로 최적화 — 어떻게 갈지 고민 끝',
        en: 'Route optimization — no more travel planning stress',
        ja: 'ルート最適化 — 移動の悩み解消',
        'zh-CN': '路线优化 — 不再为交通烦恼',
        'zh-TW': '路線優化 — 不再為交通煩惱',
      },
      href: '/traffic',
      image: '/images/explore/traffic.png',
    },
    {
      id: 'spot',
      icon: '📍',
      name: { ko: 'SPOT', en: 'SPOT', ja: 'SPOT', 'zh-CN': 'SPOT', 'zh-TW': 'SPOT' },
      description: {
        ko: '핫플, 명소, 축제 — 어디로 갈지 한눈에',
        en: 'Hot places, landmarks, festivals — all at a glance',
        ja: 'ホットスポット、名所、フェスティバル — 一目で',
        'zh-CN': '热门地点、景点、节日 — 一目了然',
        'zh-TW': '熱門地點、景點、節日 — 一目了然',
      },
      href: '/sights',
      image: '/images/explore/spot.png',
    },
    {
      id: 'ai-curation',
      icon: '🤖',
      name: { ko: 'AI 큐레이션', en: 'AI Curation', ja: 'AIキュレーション', 'zh-CN': 'AI策展', 'zh-TW': 'AI策展' },
      description: {
        ko: '나에게 맞는 여행지를 AI가 찾아드려요',
        en: 'AI finds the perfect destination for you',
        ja: 'AIがあなたにぴったりの旅先を見つけます',
        'zh-CN': 'AI为你找到最适合的旅行地',
        'zh-TW': 'AI為你找到最適合的旅行地',
      },
      href: '/sights',
      image: '/images/explore/spot.png',
    },
  ],
  live: [
    {
      id: 'kfood',
      icon: '🍜',
      name: { ko: 'K-Food', en: 'K-Food', ja: 'K-Food', 'zh-CN': 'K-Food', 'zh-TW': 'K-Food' },
      description: {
        ko: '낯선 요리가 두렵다면, 아는 맛으로 찾아드려요',
        en: "Afraid of unfamiliar food? We'll match flavors you know",
        ja: '知らない料理が怖い？知っている味でお探しします',
        'zh-CN': '害怕陌生料理？用你熟悉的味道找到它',
        'zh-TW': '害怕陌生料理？用你熟悉的味道找到它',
      },
      href: '/food/dupe',
      image: '/images/explore/kfood.png',
    },
    {
      id: 'stay',
      icon: '🏨',
      name: { ko: 'STAY', en: 'STAY', ja: 'STAY', 'zh-CN': 'STAY', 'zh-TW': 'STAY' },
      description: {
        ko: '한옥부터 호텔까지, 나에게 맞는 숙소 추천',
        en: 'From Hanok to hotels — stay recommendations for you',
        ja: '韓屋からホテルまで、あなたに合った宿泊推薦',
        'zh-CN': '从韩屋到酒店，为你推荐住宿',
        'zh-TW': '從韓屋到酒店，為你推薦住宿',
      },
      href: '/stay',
      image: '/images/explore/stay.png',
    },
    {
      id: 'ootd',
      icon: '👗',
      name: { ko: 'OOTD', en: 'OOTD', ja: 'OOTD', 'zh-CN': 'OOTD', 'zh-TW': 'OOTD' },
      description: {
        ko: '한국 날씨에 맞는 오늘의 코디 추천',
        en: "Today's outfit recommendation for Korean weather",
        ja: '韓国の天気に合った今日のコーデ推薦',
        'zh-CN': '适合韩国天气的今日穿搭推荐',
        'zh-TW': '適合韓國天氣的今日穿搭推薦',
      },
      href: '/ootd',
      image: '/images/explore/ootd.png',
    },
  ],
  story: [
    {
      id: 'quest',
      icon: '🎯',
      name: { ko: 'QUEST', en: 'QUEST', ja: 'QUEST', 'zh-CN': 'QUEST', 'zh-TW': 'QUEST' },
      description: {
        ko: '도시별 미션을 클리어하고 전설이 되세요',
        en: 'Clear city missions and become a legend',
        ja: '都市別ミッションをクリアして伝説になろう',
        'zh-CN': '完成城市任务，成为传说',
        'zh-TW': '完成城市任務，成為傳說',
      },
      href: '/story',
      image: '/images/explore/quest.png',
    },
    {
      id: 'diy',
      icon: '🎨',
      name: { ko: 'DIY', en: 'DIY', ja: 'DIY', 'zh-CN': 'DIY', 'zh-TW': 'DIY' },
      description: {
        ko: '도자기, 한지공예 등 직접 만드는 체험',
        en: 'Hands-on workshops — ceramics, hanji crafts & more',
        ja: '陶磁器、韓紙工芸など手作り体験',
        'zh-CN': '陶瓷、韩纸工艺等手工体验',
        'zh-TW': '陶瓷、韓紙工藝等手工體驗',
      },
      href: '/diy',
      image: '/images/explore/diy.png',
    },
    {
      id: 'memories',
      icon: '📸',
      name: { ko: 'MEMORIES', en: 'MEMORIES', ja: 'MEMORIES', 'zh-CN': 'MEMORIES', 'zh-TW': 'MEMORIES' },
      description: {
        ko: '사진, 후기, 랭킹 — 여행을 기록하고 공유하세요',
        en: 'Photos, reviews, rankings — record and share your trip',
        ja: '写真、レビュー、ランキング — 旅を記録してシェア',
        'zh-CN': '照片、评价、排名 — 记录并分享你的旅行',
        'zh-TW': '照片、評價、排名 — 記錄並分享你的旅行',
      },
      href: '/memories',
      image: '/images/home/memories-slide.png',
    },
  ],
}

const GO_LABEL: I18nDict = {
  ko: '바로가기 →',
  en: 'Go →',
  ja: '行く →',
  'zh-CN': '前往 →',
  'zh-TW': '前往 →',
}

const CTA_LABEL: I18nDict = {
  ko: '{name} 패스로 위 기능을 모두 이용하세요',
  en: 'Use all features above with {name} pass',
  ja: '{name}パスで上記の機能をすべて利用しよう',
  'zh-CN': '使用{name}通行证享受以上所有功能',
  'zh-TW': '使用{name}通行證享受以上所有功能',
}

const BUY_LABEL: I18nDict = {
  ko: '{name} 패스 구매하기',
  en: 'Get {name} Pass',
  ja: '{name}パスを購入',
  'zh-CN': '购买{name}通行证',
  'zh-TW': '購買{name}通行證',
}

function pick(obj: Record<string, string>, locale: string): string {
  return obj[locale as I18nKey] || obj.en || obj.ko || ''
}

function fmt(template: string, name: string): string {
  return template.replace('{name}', name)
}

interface Props {
  passId: 'move' | 'live' | 'story'
  locale: string
}

export function PassHubPage({ passId, locale }: Props) {
  const pass = PASSES.find((p) => p.id === passId)
  const features = PASS_FEATURES[passId] || []

  if (!pass) return null

  const goLabel = pick(GO_LABEL, locale)
  const ctaLabel = fmt(pick(CTA_LABEL, locale), pass.name)
  const buyLabel = fmt(pick(BUY_LABEL, locale), pass.name)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
      {/* 헤더 */}
      <div className="text-center mb-10">
        <span className="text-5xl mb-3 block">{pass.icon}</span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
          {pass.name}
        </h1>
        <p className="text-sm text-slate-500 italic">
          &ldquo;{pick(pass.tagline, locale)}&rdquo;
        </p>
      </div>

      {/* 3개 기능 카드 — 지그재그 레이아웃 */}
      <div className="space-y-4">
        {features.map((feature, i) => {
          const reverse = i % 2 === 1
          return (
            <Link
              key={feature.id}
              href={`/${locale}${feature.href}`}
              className="group flex flex-col md:flex-row rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-mint-deep/40 shadow-sm hover:shadow-xl transition-all bg-white"
            >
              {/* 이미지 */}
              <div
                className={[
                  'relative w-full md:w-[40%] h-48 md:h-auto md:min-h-[200px]',
                  reverse ? 'md:order-2' : '',
                ].join(' ')}
              >
                <Image
                  src={feature.image}
                  alt={pick(feature.name, locale)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
              </div>

              {/* 텍스트 */}
              <div
                className={[
                  'flex-1 p-6 md:p-8 flex flex-col justify-center',
                  reverse ? 'md:order-1' : '',
                ].join(' ')}
              >
                <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2">
                  {pick(feature.name, locale)}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {pick(feature.description, locale)}
                </p>
                <span className="inline-flex items-center gap-1 text-mint-deep font-bold text-sm group-hover:gap-2 transition-all">
                  {goLabel}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* 하단 패스 구매 CTA */}
      <div className="text-center mt-10">
        <p className="text-sm text-slate-500 mb-3">{ctaLabel}</p>
        <Link
          href={`/${locale}/pass`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-mint to-blossom text-ink font-black text-sm hover:opacity-90 transition-opacity shadow-md"
        >
          {buyLabel} — ₩{pass.price.toLocaleString()}
        </Link>
      </div>
    </div>
  )
}
