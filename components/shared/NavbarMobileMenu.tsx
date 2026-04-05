"use client"

import { useState } from "react"
import Link from "next/link"
import { LogoutButton } from "@/components/features/auth/LogoutButton"

interface NavbarMobileMenuProps {
  locale: string
  user: { nickname?: string | null; lp?: number | null } | null
  t: {
    signup: string
    login: string
    faq: string
    memories: string
    points: string
    foodMatching: string
    mypage: string
    logout: string
    loginRequired: string
    loginBtn: string
  }
}

export function NavbarMobileMenu({ locale, user, t }: NavbarMobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[#F5F0E8] transition-colors"
        aria-label="메뉴"
      >
        <span className={`w-5 h-0.5 bg-[#2D1B69] transition-all duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`w-5 h-0.5 bg-[#2D1B69] transition-all duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`w-5 h-0.5 bg-[#2D1B69] transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* 오버레이 */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
      )}

      {/* 슬라이드 메뉴 */}
      <div
        className={`fixed top-16 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* 유저 정보 */}
          {user ? (
            <div className="px-6 py-5 bg-[#2D1B69] text-white">
              <p className="font-semibold">{user.nickname}</p>
              <p className="text-[#FF6B35] text-sm mt-1">⚡ {user.lp?.toLocaleString() ?? 0} LP</p>
            </div>
          ) : (
            <div className="px-6 py-5 bg-[#2D1B69] space-y-2">
              <Link
                href={`/${locale}/auth/login`}
                onClick={() => setOpen(false)}
                className="block text-center py-2 rounded-xl bg-white text-[#2D1B69] font-semibold text-sm"
              >
                {t.login}
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                onClick={() => setOpen(false)}
                className="block text-center py-2 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm"
              >
                {t.signup}
              </Link>
            </div>
          )}

          {/* 네비게이션 */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1">
            <Link
              href={`/${locale}/faq`}
              onClick={() => setOpen(false)}
              className="flex items-center px-4 py-3.5 rounded-xl text-[#3a3028] font-medium hover:bg-[#F5F0E8] transition-colors"
            >
              ❓ {t.faq}
            </Link>

            {user && (
              <>
                <div className="h-px bg-[#e8ddd0] my-2 mx-4" />
                <Link href={`/${locale}/community`} onClick={() => setOpen(false)} className="flex items-center px-4 py-3.5 rounded-xl text-[#3a3028] font-medium hover:bg-[#F5F0E8] transition-colors">
                  📸 {t.memories}
                </Link>
                <Link href={`/${locale}/mypage/points`} onClick={() => setOpen(false)} className="flex items-center px-4 py-3.5 rounded-xl text-[#3a3028] font-medium hover:bg-[#F5F0E8] transition-colors">
                  ⚡ {t.points}
                </Link>
                <Link href={`/${locale}/food/dupe`} onClick={() => setOpen(false)} className="flex items-center px-4 py-3.5 rounded-xl text-[#3a3028] font-medium hover:bg-[#F5F0E8] transition-colors">
                  🍽️ {t.foodMatching}
                </Link>
                <div className="h-px bg-[#e8ddd0] my-2 mx-4" />
                <Link href={`/${locale}/mypage`} onClick={() => setOpen(false)} className="flex items-center px-4 py-3.5 rounded-xl text-[#3a3028] font-medium hover:bg-[#F5F0E8] transition-colors">
                  👤 {t.mypage}
                </Link>
                <div className="px-4 py-3.5">
                  <LogoutButton locale={locale} className="text-sm text-red-500 font-medium" />
                </div>
              </>
            )}
          </nav>

          {/* 언어 전환 */}
          <div className="px-6 py-4 border-t border-[#e8ddd0]">
            <div className="flex gap-2">
              {["ko", "ja", "en"].map((lang) => (
                <Link
                  key={lang}
                  href={`/${lang}`}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    locale === lang
                      ? "bg-[#2D1B69] text-white"
                      : "bg-[#F5F0E8] text-[#7a6a58] hover:bg-[#e8ddd0]"
                  }`}
                >
                  {lang === "ko" ? "한국어" : lang === "ja" ? "日本語" : "English"}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
