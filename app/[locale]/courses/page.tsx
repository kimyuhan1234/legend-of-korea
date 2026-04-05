// /courses → /story?tab=mission-kit 리다이렉트 (기존 링크 호환성 유지)
import { redirect } from 'next/navigation'

interface Props {
  params: { locale: string }
}

export default function CoursesRedirect({ params }: Props) {
  redirect(`/${params.locale}/story?tab=mission-kit`)
}
