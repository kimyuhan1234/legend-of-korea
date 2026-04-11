import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { GoodsGrid } from "@/components/features/goods/GoodsGrid"

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "goods" })
  const tc = await getTranslations({ locale: params.locale, namespace: "common" })
  return {
    title: `${t("title")} | ${tc("siteName")}`,
    description: t("subtitle"),
  }
}

export default function GoodsPage({ params }: Props) {
  return <GoodsGrid locale={params.locale} />
}
