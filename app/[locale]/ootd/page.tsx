import { Metadata } from 'next'
import { WeeklyOotdBoard } from '@/components/ootd/WeeklyOotdBoard'

interface Props {
  params: { locale: string }
}

const META: Record<string, { title: string; description: string }> = {
  ko: {
    title: '날씨 코디 추천 | Cloud with you',
    description: '도시 분위기에 맞는 7일치 날씨와 옷차림을 한눈에 확인하세요.',
  },
  en: {
    title: 'Weather Outfit Guide | Cloud with you',
    description: 'Check 7-day weather & outfit recommendations tailored to each Korean city vibe.',
  },
  ja: {
    title: '天気コーデ案内 | Cloud with you',
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
