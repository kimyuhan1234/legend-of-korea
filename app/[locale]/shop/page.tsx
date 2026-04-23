import { redirect } from 'next/navigation'

interface Props {
  params: { locale: string }
}

// Day 4 — 전설상점은 /memories 탭으로 이동함. 북마크 호환용 리다이렉트 유지.
export default function ShopPage({ params: { locale } }: Props) {
  redirect(`/${locale}/memories?tab=shop`)
}
