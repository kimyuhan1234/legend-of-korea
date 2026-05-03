import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n.ts")

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  // Mixed Content fix: third-party SDK(특히 Kakao Map tiles)가 http:// 리소스 요청 시
  // 브라우저가 이미 자동 업그레이드 중이지만 콘솔에 경고 14건+ 출력됨.
  // CSP upgrade-insecure-requests 로 동작을 명시 → 경고 제거.
  // 서버 사이드 Next.js Image 프록시(/_next/image)는 영향 없음.
  { key: "Content-Security-Policy", value: "upgrade-insecure-requests" },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // hotfix v8: 정적 페이지 생성 timeout 60s → 180s.
  // 'use client' 페이지 (/traffic 등 28KB+ 모듈) 의 server-entry generation 여유 확보.
  staticPageGenerationTimeout: 180,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }]
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "isixbzxophgxrfgjesaa.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "k.kakaocdn.net" },
      { protocol: "https", hostname: "profile.line-scdn.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "tong.visitkorea.or.kr" },
      { protocol: "https", hostname: "tong.visitkorea.or.kr" },
      { protocol: "http", hostname: "cdn.visitkorea.or.kr" },
      { protocol: "https", hostname: "cdn.visitkorea.or.kr" },
      { protocol: "https", hostname: "www.welchon.com" },
      { protocol: "https", hostname: "welchon.com" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
  },
  // P3C-7: production 번들에서 console.log 자동 제거 (error / warn 보존).
  // 디버그 로그가 외국인 사용자 콘솔에 노출되는 보안/UX 위험 차단.
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000", "*.vercel.app"] },
    // P3C-7: lucide-react / next-intl 등 큰 패키지 tree-shake 강화.
    // 사용된 아이콘 / 함수만 번들 포함 — First Load JS 절감.
    optimizePackageImports: ["lucide-react", "next-intl"],
  },
}

export default withNextIntl(nextConfig)
