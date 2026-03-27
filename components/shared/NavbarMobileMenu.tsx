"use client"

import { useState } from "react"
import Link from "next/link"
import { LogoutButton } from "@/components/features/auth/LogoutButton"

interface NavbarMobileMenuProps {
  locale: string
  links: { href: string; label: string }[]
  user: { nickname?: string | null; lp?: number | null } | null
  t: { login: string; mypage: string; logout: string; lp: string }
}

export function NavbarMobileMenu({ locale, links, user, t }: NavbarMobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[#F5F0E8] transition-colors"
        aria-label="메뉴"
      >
        <span className={`w-5 h-0.5 bg-[#1B2A4A] transition-all duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`w-5 h-0.5 bg-[#1B2A4A] transition-all duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`w-5 h-0.5 bg-[#1B2A4A] transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 슬라이드 메뉴 */}
      <div
        className={`
          fixed top-16 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* 유저 정보 */}
          {user ? (
            <div className="px-6 py-5 bg-[#1B2A4A] text-white">
              <p className="font-semibold">{user.nickname}</p>
              <p className="text-[#D4A843] text-sm mt-1">
                ⚡ {user.lp?.toLocaleString() ?? 0} {t.lp}
              </p>
            </div>
          ) : (
            <div className="px-6 py-5 bg-[#1B2A4A]">
              <Link
                href={`/${locale}/auth/login`}
                onClick={() => setOpen(false)}
                className="block text-center py-2 rounded-xl bg-[#D4A843] text-[#1B2A4A] font-semibold text-sm"
              >
                {t.login}
              </Link>
            </div>
          )}

          {/* 네비게이션 */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                onClick={() => setOpen(false)}
                className="flex items-center px-4 py-3.5 rounded-xl text-[#3a3028] font-medium hover:bg-[#F5F0E8] transition-colors mb-1"
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <>
                <div className="h-px bg-[#e8ddd0] my-3 mx-4" />
                <Link
                  href={`/${locale}/mypage`}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3.5 rounded-xl text-[#3a3028] font-medium hover:bg-[#F5F0E8] transition-colors mb-1"
                >
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
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${locale === lang
                      ? "bg-[#1B2A4A] text-white"
                      : "bg-[#F5F0E8] text-[#7a6a58] hover:bg-[#e8ddd0]"
                    }
                  `}
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
