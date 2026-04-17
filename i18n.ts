import { getRequestConfig } from "next-intl/server"
import { notFound } from "next/navigation"

export const locales = ["ko", "ja", "en", "zh-CN", "zh-TW"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "ko"

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl v4: requestLocale is a Promise
  const locale = await requestLocale

  if (!locale || !locales.includes(locale as Locale)) notFound()

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
