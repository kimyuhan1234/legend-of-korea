import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/features/auth/LogoutButton"
import { NavbarMobileMenu } from "@/components/shared/NavbarMobileMenu"
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher"
import { BackButton } from "@/components/shared/BackButton"
import { PlannerBadge } from "@/components/features/planner/PlannerBadge"
import { CartBadge } from "@/components/shared/CartBadge"
import { NavbarTabs } from "@/components/shared/NavbarTabs"

interface NavbarProps {
  locale: string
}

const NAV_LINKS = {
  ko: [
    { href: "/ootd",  label: "OOTD" },
    { href: "/food",  label: "K-Food" },
    { href: "/stay",    label: "STAY" },
    { href: "/traffic", label: "TRAFFIC" },
    { href: "/story",   label: "QUEST" },
    { href: "/sights",label: "SPOT" },
    { href: "/planner", label: "PLANNER" },
    { href: "/memories", label: "MEMORIES" },
    { href: "/diy",   label: "DIY" },
  ],
  ja: [
    { href: "/ootd",  label: "OOTD" },
    { href: "/food",  label: "K-Food" },
    { href: "/stay",    label: "STAY" },
    { href: "/traffic", label: "TRAFFIC" },
    { href: "/story",   label: "QUEST" },
    { href: "/sights",label: "SPOT" },
    { href: "/planner", label: "PLANNER" },
    { href: "/memories", label: "MEMORIES" },
    { href: "/diy",   label: "DIY" },
  ],
  en: [
    { href: "/ootd",  label: "OOTD" },
    { href: "/food",  label: "K-Food" },
    { href: "/stay",    label: "STAY" },
    { href: "/traffic", label: "TRAFFIC" },
    { href: "/story",   label: "QUEST" },
    { href: "/sights",label: "SPOT" },
    { href: "/planner", label: "PLANNER" },
    { href: "/memories", label: "MEMORIES" },
    { href: "/diy",   label: "DIY" },
  ],
}

const TEXT = {
  ko: {
    signup: "회원가입", login: "로그인", mypage: "마이페이지", logout: "로그아웃", lp: "빗방울",
    faq: "자주 묻는 질문", memories: "추억 남기기", points: "전설 상점", foodMatching: "음식 매칭",
    loginRequired: "로그인이 필요합니다", loginBtn: "로그인하기", pass: "패스",
  },
  ja: {
    signup: "新規登録", login: "ログイン", mypage: "マイページ", logout: "ログアウト", lp: "雨滴",
    faq: "よくある質問", memories: "記録館", points: "ポイント", foodMatching: "グルメマッチング",
    loginRequired: "ログインが必要です", loginBtn: "ログイン", pass: "パス",
  },
  en: {
    signup: "Sign Up", login: "Sign In", mypage: "My Page", logout: "Sign Out", lp: "Raindrops",
    faq: "FAQ", memories: "Gallery", points: "Points", foodMatching: "Food Matching",
    loginRequired: "Login required", loginBtn: "Log In", pass: "Pass",
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

  const links = NAV_LINKS[locale as keyof typeof NAV_LINKS] || NAV_LINKS.en || NAV_LINKS.ko
  const t = TEXT[locale as keyof typeof TEXT] || TEXT.en || TEXT.ko

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-mist">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* 뒤로가기 및 로고 */}
        <div className="flex items-center gap-2 shrink-0">
          <BackButton />
          <Link
            href={`/${locale}`}
            style={{
              fontFamily: "Georgia, 'Palatino', 'Times New Roman', serif",
              fontStyle: 'italic',
              fontSize: '22px',
              fontWeight: 400,
              letterSpacing: '2px',
              color: '#1F2937',
              textDecoration: 'none',
            }}
          >
            Cloud with you
          </Link>
        </div>

        {/* 데스크탑 네비게이션 — 호버 활성 + 좌우 화살표 스크롤 */}
        <NavbarTabs locale={locale} links={links} />

        {/* 우측 유저 영역 */}
        <div className="flex items-center gap-2">
          {/* 언어 전환 (데스크탑) */}
          <div className="hidden md:block">
            <LocaleSwitcher currentLocale={locale} />
          </div>
          {/* 장바구니 뱃지 */}
          <div className="hidden md:block">
            <CartBadge />
          </div>
          {/* 플래너 뱃지 (로그인 시에만 표시) */}
          {user && (
            <div className="hidden md:block">
              <PlannerBadge />
            </div>
          )}
          {user && profile ? (
            <div className="hidden md:flex items-center gap-3">
              {/* 패스 링크 — LP 뱃지 왼쪽 */}
              <Link
                href={`/${locale}/pass`}
                className="flex items-center gap-1 text-xs font-bold text-mint-deep hover:underline"
              >
                🎫 {t.pass}
              </Link>

              {/* LP 뱃지 */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F2937]/5 border border-ink/10">
                <span className="text-xs text-blossom-deep">⚡</span>
                <span className="text-xs font-bold text-ink">
                  {profile.total_lp.toLocaleString()} {t.lp}
                </span>
              </div>

              {/* 유저 드롭다운 */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-cloud transition-colors">
                  {/* 아바타 */}
                  <div className="w-7 h-7 rounded-full bg-[#1F2937] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
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
                  <span className="text-sm font-medium text-ink">{profile.nickname}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-stone">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* 드롭다운 메뉴 */}
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-lg shadow-[#1F2937]/10 border border-mist overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <Link
                    href={`/${locale}/mypage`}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-slate hover:bg-cloud transition-colors"
                  >
                    <span>👤</span> {t.mypage}
                  </Link>
                  <div className="h-px bg-mist mx-3" />
                  <div className="px-4 py-3">
                    <LogoutButton locale={locale} className="text-sm text-stone hover:text-red-500 transition-colors w-full text-left flex items-center gap-2" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href={`/${locale}/auth/login`}
                className="px-4 py-2 rounded-xl text-sm font-medium text-ink hover:bg-cloud transition-colors"
              >
                {t.login}
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-mint-deep text-white hover:bg-[#7BC8BC] transition-colors"
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