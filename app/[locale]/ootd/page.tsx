import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const WeeklyOotdBoard = dynamic(() => import('@/components/ootd/WeeklyOotdBoard').then(m => ({ default: m.WeeklyOotdBoard })), { ssr: true })

interface Props {
  params: { locale: string }
}

const META: Record<string, { title: string; description: string }> = {
  ko: {
    title: '날씨 코디 추천 | Legend of Korea',
    description: '도시 분위기에 맞는 7일치 날씨와 옷차림을 한눈에 확인하세요.',
  },
  en: {
    title: 'Weather Outfit Guide | Legend of Korea',
    description: 'Check 7-day weather & outfit recommendations tailored to each Korean city vibe.',
  },
  ja: {
    title: '天気コーデ案内 | Legend of Korea',
    description: '都市の雰囲気に合わせた7日間の天気・コーデガイドをチェック。',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
    },
  }
}

export default function OotdPage() {
  return <WeeklyOotdBoard />
}
