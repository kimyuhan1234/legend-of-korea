import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/features/auth/LogoutButton"
import { NavbarMobileMenu } from "@/components/shared/NavbarMobileMenu"
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher"

interface NavbarProps {
  locale: string
}

const T = {
  ko: {
    signup: "회원가입", login: "로그인", faq: "FAQ",
    memories: "추억남기기", points: "포인트", foodMatching: "푸드매칭",
    mypage: "마이페이지", logout: "로그아웃",
    loginRequired: "로그인이 필요합니다", loginBtn: "로그인하기",
  },
  ja: {
    signup: "会員登録", login: "ログイン", faq: "FAQ",
    memories: "思い出を残す", points: "ポイント", foodMatching: "フードマッチング",
    mypage: "マイページ", logout: "ログアウト",
    loginRequired: "ログインが必要です", loginBtn: "ログインする",
  },
  en: {
    signup: "Sign Up", login: "Sign In", faq: "FAQ",
    memories: "Memories", points: "Points", foodMatching: "Food Matching",
    mypage: "My Page", logout: "Sign Out",
    loginRequired: "Please sign in", loginBtn: "Sign In",
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

  const t = T[locale as keyof typeof T] || T.ko

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e8ddd0]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* 로고 */}
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#2D1B69] flex items-center justify-center">
            <span className="text-lg leading-none">👹</span>
          </div>
          <span className="font-bold text-[#2D1B69] text-base hidden sm:block">
            Legend of Korea
          </span>
        </Link>

        {/* 우측 영역 */}
        <div className="flex items-center gap-2">
          {/* 언어 전환 (데스크톱) */}
          <div className="hidden md:block">
            <LocaleSwitcher currentLocale={locale} />
          </div>

          {/* 비로그인 상태: 회원가입 / 로그인 */}
          {!user && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                href={`/${locale}/auth/login`}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[#3a3028] hover:bg-[#F5F0E8] transition-colors"
              >
                {t.login}
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#2D1B69] text-white hover:bg-[#3d2880] transition-colors"
              >
                {t.signup}
              </Link>
            </div>
          )}

          {/* FAQ */}
          <Link
            href={`/${locale}/faq`}
            className="hidden md:flex items-center px-3 py-2 rounded-lg text-sm font-medium text-[#3a3028] hover:bg-[#F5F0E8] transition-colors"
          >
            {t.faq}
          </Link>

          {/* 🔍 검색 */}
          {/* TODO: 검색 모달 연결 */}
          <button
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-[#3a3028] hover:bg-[#F5F0E8] transition-colors"
            aria-label="검색"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* 🛒 스타일(굿즈) */}
          <Link
            href={`/${locale}/goods`}
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-[#3a3028] hover:bg-[#F5F0E8] transition-colors"
            aria-label="스타일"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </Link>

          {/* 👤 프로필 드롭다운 */}
          <div className="hidden md:block relative group">
            <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-[#F5F0E8] transition-colors">
              <div className="w-7 h-7 rounded-full bg-[#2D1B69] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <span>{user ? (profile?.nickname?.[0]?.toUpperCase() || "U") : "👤"}</span>
                )}
              </div>
              {user && profile?.nickname && (
                <span className="text-sm font-medium text-[#2D1B69] max-w-[80px] truncate">{profile.nickname}</span>
              )}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#7a6a58] shrink-0">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* 드롭다운 */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg shadow-[#2D1B69]/10 border border-[#e8ddd0] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              {user ? (
                <>
                  <Link href={`/${locale}/community`} className="flex items-center gap-2 px-4 py-3 text-sm text-[#3a3028] hover:bg-[#F5F0E8] transition-colors">
                    <span>📸</span> {t.memories}
                  </Link>
                  <Link href={`/${locale}/mypage/points`} className="flex items-center gap-2 px-4 py-3 text-sm text-[#3a3028] hover:bg-[#F5F0E8] transition-colors">
                    <span>⚡</span> {t.points}
                  </Link>
                  <Link href={`/${locale}/food/dupe`} className="flex items-center gap-2 px-4 py-3 text-sm text-[#3a3028] hover:bg-[#F5F0E8] transition-colors">
                    <span>🍽️</span> {t.foodMatching}
                  </Link>
                  <div className="h-px bg-[#e8ddd0] mx-3" />
                  <Link href={`/${locale}/mypage`} className="flex items-center gap-2 px-4 py-3 text-sm text-[#3a3028] hover:bg-[#F5F0E8] transition-colors">
                    <span>👤</span> {t.mypage}
                  </Link>
                  <div className="h-px bg-[#e8ddd0] mx-3" />
                  <div className="px-4 py-3">
                    <LogoutButton locale={locale} className="text-sm text-[#7a6a58] hover:text-red-500 transition-colors w-full text-left flex items-center gap-2" />
                  </div>
                </>
              ) : (
                <div className="p-4">
                  <p className="text-xs text-[#7a6a58] mb-3">{t.loginRequired}</p>
                  <Link
                    href={`/${locale}/auth/login`}
                    className="block text-center py-2 rounded-xl bg-[#2D1B69] text-white text-sm font-semibold hover:bg-[#3d2880] transition-colors"
                  >
                    {t.loginBtn}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 모바일 햄버거 */}
          <NavbarMobileMenu
            locale={locale}
            user={user ? { nickname: profile?.nickname, lp: profile?.total_lp } : null}
            t={t}
          />
        </div>
      </div>
    </header>
  )
}
