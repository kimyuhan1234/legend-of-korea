import { redirect } from 'next/navigation'

interface Props {
  params: { locale: string; region: string; foodId: string }
}

/** Phase 11 준비 중 — hub 의 임시 안내 페이지로 redirect. */
export default function DupeFoodStubPage({ params }: Props) {
  redirect(`/${params.locale}/food/dupe`)
}
