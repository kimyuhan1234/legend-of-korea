'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const t = useTranslations('error')
  const params = useParams()
  const locale = params.locale as string
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="text-8xl mb-8 animate-bounce">👹</div>
      <h1 className="text-3xl md:text-4xl font-bold text-[#1B2A4A] mb-4">
        {t('notFound')}
      </h1>
      <p className="text-lg text-[#3a3028] mb-12 max-w-md">
        {t('notFoundDesc')}
      </p>
      
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#D4A843] to-[#1B2A4A] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <Button 
          asChild
          className="relative bg-[#1B2A4A] hover:bg-[#243a63] text-white rounded-2xl h-14 px-10 text-lg font-bold border-none transition-all hover:scale-105"
        >
          <Link href={`/${locale}`}>
            {t('goHome')}
          </Link>
        </Button>
      </div>
      
      {/* Decorative Hanji-style elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border-l border-t border-[#D4A843]/30 rounded-tl-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 border-r border-b border-[#D4A843]/30 rounded-br-3xl -z-10"></div>
    </div>
  )
}
