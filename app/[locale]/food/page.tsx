import { redirect } from "next/navigation"

interface Props {
  params: { locale: string }
}

export default function FoodPage({ params }: Props) {
  redirect(`/${params.locale}/food/dupe`)
}
