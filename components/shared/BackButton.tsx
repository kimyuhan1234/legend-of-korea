"use client"

import { useRouter, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BackButton() {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("common")

  // Detect landing pages like /ko, /en, /ja
  const isLandingPage = /^\/[a-z]{2}\/?$/.test(pathname)

  if (isLandingPage) return null

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className={cn(
        "h-9 px-2 gap-1.5 rounded-xl bg-transparent hover:bg-cloud transition-all group shrink-0",
        "flex items-center"
      )}
    >
      <span className="text-lg font-bold text-mint-deep group-hover:-translate-x-0.5 transition-transform">
        &lt;
      </span>
      <span className="text-sm font-medium text-mint-deep">
        {t("back")}
      </span>
    </Button>
  )
}
