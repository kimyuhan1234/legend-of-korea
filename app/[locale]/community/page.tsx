import { redirect } from 'next/navigation'

interface Props {
  params: { locale: string }
}

export default function CommunityPage({ params }: Props) {
  redirect(`/${params.locale}/memories`)
}
