"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher"
import { LogoutButton } from "@/components/features/auth/LogoutButton"
import { resolveAvatarSrc, hasAvatarSource } from "@/lib/avatar/resolve"

interface NavLink {
  href: string
  label: string
}

interface UserInfo {
  nickname?: string | null
  avatar_url?: string | null
  total_lp?: number | null
}

interface MobileHeaderProps {
  locale: string
  links: NavLink[]
  user: UserInfo | null
  t: {
    signup: string
    login: string
    mypage: string
    lp: string
    menu: string
  }
}

/**
 * Mobile-only header — client component.
 *
 * 단순 책임:
 *   - 상단 sticky 바: 로고 (좌) + 언어 선택 + 햄버거 (우)
 *   - 햄버거 클릭 → 우측 슬라이드 메뉴 (4 탭 + 로그인/회원가입 또는 마이페이지/로그아웃)
 *   - ESC / 외부 클릭 / 페이지 이동 시 자동 닫힘
 *   - 메뉴 열린 동안 body scroll 잠금
 *
 * Tailwind v4 호환성: transform 은 inline style 로 직접 명시 (legacy
 * translateX shorthand) — Samsung Internet 옛 버전 등 호환 보장.
 */
export function MobileHeader({ locale, links, user, t }: MobileHeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // 페이지 이동 시 자동 닫기
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // ESC 키 닫기
  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [open])

  // 메뉴 열린 동안 body scroll 잠금
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  return (
    <>
      {/* 상단 바 — sticky */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-mist">
        <div className="flex items-center justify-between px-4 h-14">
          {/* 로고 */}
          <Link
            href={`/${locale}`}
            style={{
              fontFamily: "Georgia, 'Palatino', 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: "20px",
              fontWeight: 400,
              letterSpacing: "1.5px",
              color: "#1F2937",
              textDecoration: "none",
            }}
          >
            Clouds with you
          </Link>

          {/* 우측: 언어 선택 + 햄버거 */}
          <div className="flex items-center gap-1">
            <LocaleSwitcher currentLocale={locale} />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="p-2 rounded-lg hover:bg-cloud transition-colors"
              aria-label={t.menu}
              aria-expanded={open}
            >
              <Menu className="w-6 h-6 text-mint-deep" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop — 메뉴 외부 클릭 닫기 */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in 메뉴 — 우측에서. inline transform 으로 호환성 보장 */}
      <nav
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 250ms ease-out",
        }}
      >
        {/* 헤더 — 닫기 버튼 + 유저 정보 */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-mist">
          {user ? (
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {hasAvatarSource(user) ? (
                <Image
                  src={resolveAvatarSrc(user)}
                  alt={user.nickname ?? ""}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-mint-deep text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user.nickname?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">
                  {user.nickname ?? ""}
                </p>
                <p className="text-[11px] text-stone">
                  {user.total_lp?.toLocaleString() ?? 0} {t.lp}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-sm font-semibold text-ink">
              {t.menu}
            </span>
          )}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 -mr-2 rounded-lg hover:bg-cloud transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-stone" strokeWidth={1.8} />
          </button>
        </div>

        {/* 메인 메뉴 — 4 탭 (Discover/Quest/Pass/Community) */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="flex items-center px-4 py-3.5 rounded-xl text-base font-semibold text-slate hover:bg-cloud transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 인증 메뉴 — 로그인 시 마이페이지/로그아웃 / 비로그인 시 로그인/회원가입 */}
          <div className="border-t border-mist mt-2 px-3 py-3 space-y-1">
            {user ? (
              <>
                <Link
                  href={`/${locale}/mypage`}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate hover:bg-cloud transition-colors"
                >
                  {t.mypage}
                </Link>
                <div className="px-4 py-3">
                  <LogoutButton
                    locale={locale}
                    className="text-sm text-red-500 font-medium"
                  />
                </div>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/auth/login`}
                  className="block text-center py-3 rounded-xl bg-mint-deep text-white font-semibold text-sm"
                >
                  {t.login}
                </Link>
                <Link
                  href={`/${locale}/auth/signup`}
                  className="block text-center py-3 rounded-xl border border-mint-deep text-mint-deep font-semibold text-sm"
                >
                  {t.signup}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
