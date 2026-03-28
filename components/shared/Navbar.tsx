import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/features/auth/LogoutButton"
import { NavbarMobileMenu } from "@/components/shared/NavbarMobileMenu"
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher"

interface NavbarProps {
  locale: string
}

const NAV_LINKS = {
  ko: [
    { href: "/courses", label: "코스 탐색" },
    { href: "/food", label: "맛 연결" },
    { href: "/community", label: "기록관" },
    { href: "/shop", label: "전설 상점" },
  ],
  ja: [
    { href: "/courses", label: "コース探索" },
    { href: "/food", label: "味つながり" },
    { href: "/community", label: "記録館" },
    { href: "/shop", label: "伝説ショップ" },
  ],
  en: [
    { href: "/courses", label: "Courses" },
    { href: "/food", label: "Taste Link" },
    { href: "/community", label: "Gallery" },
    { href: "/shop", label: "Legend Shop" },
  ],
}

const TEXT = {
  ko: { login: "로그인", mypage: "마이페이지", logout: "로그아웃", lp: "LP" },
  ja: { login: "ログイン", mypage: "マイページ", logout: "ログアウト", lp: "LP" },
  en: { login: "Sign In", mypage: "My Page", logout: "Sign Out", lp: "LP" },
}

export async function Navbar({ locale }: NavbarProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("nickname, avatar_url, total_lp, current_tier")
      .eq("id", user.id)
      .single()
    profile = data
  }

  const links = NAV_LINKS[locale as keyof typeof NAV_LINKS] || NAV_LINKS.ko
  const t = TEXT[locale as keyof typeof TEXT] || TEXT.ko

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e8ddd0]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* 로고 */}
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#1B2A4A] flex items-center justify-center">
            <span className="text-lg leading-none">👹</span>
          </div>
          <span className="font-bold text-[#1B2A4A] text-base hidden sm:block">
            Legend of Korea
          </span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#3a3028] hover:bg-[#F5F0E8] hover:text-[#1B2A4A] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 우측 유저 영역 */}
        <div className="flex items-center gap-2">
          {/* 언어 전환 (데스크탑) */}
          <div className="hidden md:block">
            <LocaleSwitcher currentLocale={locale} />
          </div>
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {/* LP 뱃지 */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B2A4A]/5 border border-[#1B2A4A]/10">
                <span className="text-xs text-[#D4A843]">⚡</span>
                <span className="text-xs font-bold text-[#1B2A4A]">
                  {(profile?.total_lp ?? 0).toLocaleString()} {t.lp}
                </span>
              </div>

              {/* 유저 드롭다운 */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#F5F0E8] transition-colors">
                  {/* 아바타 */}
                  <div className="w-7 h-7 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white text-xs font-bold">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile?.nickname ?? ""}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      profile?.nickname?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#1B2A4A]">{profile?.nickname ?? t.mypage}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#7a6a58]">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* 드롭다운 메뉴 */}
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-lg shadow-[#1B2A4A]/10 border border-[#e8ddd0] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <Link
                    href={`/${locale}/mypage`}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#3a3028] hover:bg-[#F5F0E8] transition-colors"
                  >
                    <span>👤</span> {t.mypage}
                  </Link>
                  <div className="h-px bg-[#e8ddd0] mx-3" />
                  <div className="px-4 py-3">
                    <LogoutButton locale={locale} className="text-sm text-[#7a6a58] hover:text-red-500 transition-colors w-full text-left flex items-center gap-2" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href={`/${locale}/auth/login`}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#1B2A4A] hover:bg-[#F5F0E8] transition-colors"
              >
                {t.login}
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#1B2A4A] text-white hover:bg-[#243a63] transition-colors"
              >
                {locale === "ko" ? "시작하기" : locale === "ja" ? "始める" : "Get Started"}
              </Link>
            </div>
          )}

          {/* 모바일 햄버거 */}
          <NavbarMobileMenu
            locale={locale}
            links={links}
            user={user ? { nickname: profile?.nickname, lp: profile?.total_lp } : null}
            t={t}
          />
        </div>
      </div>
    </header>
  )
}
