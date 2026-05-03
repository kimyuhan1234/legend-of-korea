import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Clouds with you',
    short_name: 'LegendKR',
    description: '한국 전설을 따라가는 미션 어드벤처',
    theme_color: '#FF6B35',
    background_color: '#FFFFFF',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    start_url: '/ko',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}