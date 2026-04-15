export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { ShopClient } from './ShopClient';

interface Props {
  params: { locale: string }
}

const META: Record<string, { title: string; description: string }> = {
  ko: {
    title: '전설 상점 | Legend of Korea',
    description: '전래동화 테마 굿즈와 기념품을 만나보세요.',
  },
  en: {
    title: 'Legend Shop | Legend of Korea',
    description: 'Korean legend themed goods and souvenirs.',
  },
  ja: {
    title: '伝説ショップ | Legend of Korea',
    description: '韓国伝説テーマのグッズとお土産をご覧ください。',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: m.title, description: m.description },
  }
}

export default function ShopPage({ params: { locale } }: { params: { locale: string } }) {
  return <ShopClient locale={locale} />;
}