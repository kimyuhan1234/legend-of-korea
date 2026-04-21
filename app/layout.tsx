import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

// 과거 next-pwa 로 등록됐던 service worker 와 workbox 캐시를 제거한다.
// inline script 로 직접 주입해 서버/클라이언트 컴포넌트 경계 없이 hydration 전에
// 실행되도록 한다. PWA 재활성화 시점에는 이 스크립트 블록을 제거.
const SW_CLEANUP_SCRIPT = `
(function(){
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.getRegistrations().then(function(regs){
    regs.forEach(function(reg){ reg.unregister().catch(function(){}); });
  }).catch(function(){});
  if (typeof caches !== 'undefined') {
    caches.keys().then(function(keys){
      keys.forEach(function(k){ caches.delete(k).catch(function(){}); });
    }).catch(function(){});
  }
})();
`.trim()

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" })

export const metadata: Metadata = {
  title: "Cloud with you | 한국의 전설을 따라서",
  description: "한국 전래동화 IP를 활용한 QR 기반 셀프 미션 여행 서비스",
  manifest: "/manifest.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Noto+Serif+KR:wght@400;700&family=Noto+Serif+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <script dangerouslySetInnerHTML={{ __html: SW_CLEANUP_SCRIPT }} />
        {children}
      </body>
    </html>
  )
}