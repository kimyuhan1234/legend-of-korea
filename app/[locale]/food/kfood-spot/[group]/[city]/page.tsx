import { redirect } from 'next/navigation'

interface Props {
  params: { locale: string; group: string; city: string }
}

/** /[group]/[city] 진입 시 /[group]/[city]/local-pick 로 자동 이동 (4 탭 첫 번째). */
export default function CityIndexPage({ params }: Props) {
  redirect(`/${params.locale}/food/kfood-spot/${params.group}/${params.city}/local-pick`)
}
