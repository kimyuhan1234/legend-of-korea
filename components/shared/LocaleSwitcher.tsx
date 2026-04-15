"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"

const LOCALES = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "en", label: "English", flag: "🇺🇸" },
]

interface LocaleSwitcherProps {
  currentLocale: string
}

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  const current = LOCALES.find((l) => l.code === currentLocale) || LOCALES[0]

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function switchLocale(locale: string) {
    // 현재 경로에서 locale 부분만 교체
    const segments = pathname.split("/")
    segments[1] = locale
    const newPath = segments.join("/")

    // 쿠키에 선호 언어 저장 (30일)
    document.cookie = `preferred_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`

    router.push(newPath)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg
          text-sm text-slate hover:bg-cloud
          border border-transparent hover:border-mist
          transition-all duration-150
        "
        aria-label="언어 변경"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline font-medium">{current.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`text-stone transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="
          absolute right-0 top-full mt-1.5 z-50
          w-40 bg-white rounded-xl shadow-lg shadow-[#1F2937]/10
          border border-mist overflow-hidden
          animate-in fade-in slide-in-from-top-1 duration-150
        ">
          {LOCALES.map((locale) => (
            <button
              key={locale.code}
              onClick={() => switchLocale(locale.code)}
              className={`
                flex items-center gap-2.5 w-full px-4 py-2.5
                text-sm transition-colors text-left
                ${locale.code === currentLocale
                  ? "bg-cloud text-[#111] font-semibold"
                  : "text-slate hover:bg-cloud"
                }
              `}
            >
              <span className="text-base">{locale.flag}</span>
              <span>{locale.label}</span>
              {locale.code === currentLocale && (
                <span className="ml-auto text-blossom-deep">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
