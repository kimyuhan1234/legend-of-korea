import createNextIntlPlugin from "next-intl/plugin"
import withPWAInit from "next-pwa"

const withNextIntl = createNextIntlPlugin("./i18n.ts")
const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "isixbzxophgxrfgjesaa.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "k.kakaocdn.net" },
      { protocol: "https", hostname: "profile.line-scdn.net" },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
}

export default withNextIntl(withPWA(nextConfig))
