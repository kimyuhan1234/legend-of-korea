import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/features/auth/LogoutButton"
import { NavbarMobileMenu } from "@/components/shared/NavbarMobileMenu"
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher"
import { BackButton } from "@/components/shared/BackButton"

interface NavbarProps {
  locale: string
}

const NAV_LINKS = {
  ko: [
    { href: "/courses", label: "코스 탐색" },
    { href: "/community", label: "추억 남기기" },
    { href: "/shop", label: "전설 상점" },
  ],
  ja: [
    { href: "/courses", label: "コース探索" },
    { href: "/community", label: "思い出残し" },
    { href: "/shop", label: "伝説の店" },
  ],
  en: [
    { href: "/courses", label: "Courses" },
    { href: "/community", label: "Gallery" },
    { href: "/shop", label: "Legend Shop" },
  ],
}

const TEXT = {
  ko: {
    signup: "회원가입", login: "로그인", mypage: "마이페이지", logout: "로그아웃", lp: "LP",
    faq: "자주 묻는 질문", memories: "추억 남기기", points: "전설 상점", foodMatching: "음식 매칭",
    loginRequired: "로그인이 필요합니다", loginBtn: "로그인하기",
  },
  ja: {
    signup: "新規登録", login: "ログイン", mypage: "マイページ", logout: "ログアウト", lp: "LP",
    faq: "よくある質問", memories: "記録館", points: "ポイント", foodMatching: "グルメマッチング",
    loginRequired: "ログインが必要です", loginBtn: "ログイン",
  },
  en: {
    signup: "Sign Up", login: "Sign In", mypage: "My Page", logout: "Sign Out", lp: "LP",
    faq: "FAQ", memories: "Gallery", points: "Points", foodMatching: "Food Matching",
    loginRequired: "Login required", loginBtn: "Log In",
  },
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
        {/* 뒤로가기 및 로고 */}
        <div className="flex items-center gap-2 shrink-0">
          <BackButton />
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1B2A4A] flex items-center justify-center">
              <span className="text-lg leading-none">👹</span>
            </div>
            <span className="font-bold text-[#1B2A4A] text-base hidden sm:block">
              Legend of Korea
            </span>
          </Link>
        </div>

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
          {user && profile ? (
            <div className="hidden md:flex items-center gap-3">
              {/* LP 뱃지 */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B2A4A]/5 border border-[#1B2A4A]/10">
                <span className="text-xs text-[#D4A843]">⚡</span>
                <span className="text-xs font-bold text-[#1B2A4A]">
                  {profile.total_lp.toLocaleString()} {t.lp}
                </span>
              </div>

              {/* 유저 드롭다운 */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#F5F0E8] transition-colors">
                  {/* 아바타 */}
                  <div className="w-7 h-7 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.nickname}
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profile.nickname?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#1B2A4A]">{profile.nickname}</span>
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
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A2B] transition-colors"
              >
                {t.signup}
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