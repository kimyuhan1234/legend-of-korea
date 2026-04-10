import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "isixbzxophgxrfgjesaa.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "k.kakaocdn.net" },
      { protocol: "https", hostname: "profile.line-scdn.net" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    quality: 90,
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
}

export default withNextIntl(nextConfig)
