'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="text-8xl mb-8 grayscale hover:grayscale-0 transition-all duration-500">👹</div>
      <h1 className="text-3xl md:text-4xl font-bold text-[#1B2A4A] mb-4">
        {t('title')}
      </h1>
      <p className="text-lg text-[#3a3028] mb-12 max-w-md">
        {t('description')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button 
          onClick={() => reset()}
          variant="outline"
          className="h-14 px-10 text-lg font-bold rounded-2xl border-2 border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white transition-all shadow-sm"
        >
          {t('retry')}
        </Button>
        
        <Button 
          asChild
          className="bg-[#1B2A4A] hover:bg-[#243a63] text-white rounded-2xl h-14 px-10 text-lg font-bold border-none transition-all shadow-lg"
        >
          <Link href={`/${locale}`}>
            {t('goHome')}
          </Link>
        </Button>
      </div>

      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1B2A4A_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
    </div>
  )
}
