'use client'

import { useTranslations } from 'next-intl'

export default function Loading() {
  const t = useTranslations('common')
  
  return (
    <div className="fixed inset-0 bg-[#F5F0E8] flex flex-col items-center justify-center z-50">
      <div className="relative">
        {/* Animated Dokkaebi Icon / Spinner */}
        <div className="w-24 h-24 border-4 border-[#1B2A4A]/20 border-t-[#1B2A4A] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
          👹
        </div>
      </div>
      <p className="mt-8 text-[#1B2A4A] font-bold text-xl tracking-widest animate-pulse">
        {t('loading')}
      </p>
      <div className="mt-4 flex space-x-2">
        <div className="w-2 h-2 bg-[#D4A843] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-[#D4A843] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-[#D4A843] rounded-full animate-bounce"></div>
      </div>
    </div>
  )
}
