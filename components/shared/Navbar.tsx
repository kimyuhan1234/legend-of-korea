import Link from "next/link"
import Image from "next/image"
import { RaindropIcon } from "@/components/shared/icons/RaindropIcon"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/features/auth/LogoutButton"
import { MobileHeader } from "@/components/shared/MobileHeader"
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher"
import { BackButton } from "@/components/shared/BackButton"
import { PlannerBadge } from "@/components/features/planner/PlannerBadge"
import { CartBadge } from "@/components/shared/CartBadge"
import { NavbarTabs } from "@/components/shared/NavbarTabs"

interface NavbarProps {
  locale: string
}

// P1-10: 헤더 4-메뉴 재편 (Discover/Quest/Pass/Community).
// 기존 9개 메뉴 (OOTD/K-Food/STAY/TRAFFIC/QUEST/SPOT/PLANNER/MEMORIES/DIY) 는
// /discover (Discover 허브) 와 /community (Community 허브) 로 흡수.
// PLANNER 는 헤더에서 제외 (필요 시 마이페이지/허브 카드로 진입).
const NAV_LINKS = {
  ko: [
    { href: "/discover",  label: "DISCOVER" },
    { href: "/story",     label: "QUEST" },
    { href: "/pass",      label: "PASS" },
    { href: "/community", label: "COMMUNITY" },
  ],
  ja: [
    { href: "/discover",  label: "DISCOVER" },
    { href: "/story",     label: "QUEST" },
    { href: "/pass",      label: "PASS" },
    { href: "/community", label: "COMMUNITY" },
  ],
  en: [
    { href: "/discover",  label: "DISCOVER" },
    { href: "/story",     label: "QUEST" },
    { href: "/pass",      label: "PASS" },
    { href: "/community", label: "COMMUNITY" },
  ],
  'zh-CN': [
    { href: "/discover",  label: "DISCOVER" },
    { href: "/story",     label: "QUEST" },
    { href: "/pass",      label: "PASS" },
    { href: "/community", label: "COMMUNITY" },
  ],
  'zh-TW': [
    { href: "/discover",  label: "DISCOVER" },
    { href: "/story",     label: "QUEST" },
    { href: "/pass",      label: "PASS" },
    { href: "/community", label: "COMMUNITY" },
  ],
}

// P1-13: P1-10 헤더 4-메뉴 재편 후 사용처가 사라진 키 (pass/logout/faq/memories/points/
// foodMatching/loginRequired/loginBtn) 5 로케일 일괄 제거. 실사용 키 (signup/login/mypage/lp/menu) 만 유지.
const TEXT = {
  ko: {
    signup: "회원가입", login: "로그인", mypage: "마이페이지", lp: "빗방울", menu: "메뉴",
  },
  ja: {
    signup: "新規登録", login: "ログイン", mypage: "マイページ", lp: "雨滴", menu: "メニュー",
  },
  en: {
    signup: "Sign Up", login: "Sign In", mypage: "My Page", lp: "Raindrops", menu: "Menu",
  },
  'zh-CN': {
    signup: "注册", login: "登录", mypage: "我的页面", lp: "雨滴", menu: "菜单",
  },
  'zh-TW': {
    signup: "註冊", login: "登入", mypage: "我的頁面", lp: "雨滴", menu: "選單",
  },
}

export async function Navbar({ locale }: NavbarProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("nickname, avatar_url, total_lp")
      .eq("id", user.id)
      .single()
    profile = data
  }

  const links = NAV_LINKS[locale as keyof typeof NAV_LINKS] || NAV_LINKS.en || NAV_LINKS.ko
  const t = TEXT[locale as keyof typeof TEXT] || TEXT.en || TEXT.ko

  // 모바일에 전달할 사용자 정보 (avatar 포함)
  const mobileUser = user
    ? {
        nickname: profile?.nickname,
        avatar_url: profile?.avatar_url,
        total_lp: profile?.total_lp,
      }
    : null

  return (
    <>
      {/* ── 모바일 헤더 (768px 미만) — 별도 client component ── */}
      <div className="md:hidden">
        <MobileHeader locale={locale} links={links} user={mobileUser} t={t} />
      </div>

      {/* ── 데스크탑 헤더 (768px 이상) — 기존 layout 그대로 보존 ── */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-mist">
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
            Clouds with you
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
              {/* P1-10: Pass 링크는 헤더 4-메뉴(PASS) 로 이동 — 중복 제거 */}

              {/* LP 뱃지 */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F2937]/5 border border-ink/10">
                <RaindropIcon size={14} className="text-mint-deep" />
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

        </div>
      </div>
    </header>
    </>
  )
}