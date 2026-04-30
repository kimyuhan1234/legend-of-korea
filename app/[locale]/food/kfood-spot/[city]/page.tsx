import { redirect } from 'next/navigation'

interface Props {
  params: { locale: string; city: string }
}

/** /[city] 진입 시 /[city]/local-pick 로 자동 이동 (4 탭 첫 번째). */
export default function CityIndexPage({ params }: Props) {
  redirect(`/${params.locale}/food/kfood-spot/${params.city}/local-pick`)
}
