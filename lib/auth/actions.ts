"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// ──────────────────────────────────────────
// 이메일 로그인
// ──────────────────────────────────────────
export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const locale = (formData.get("locale") as string) || "ko"
  const next = (formData.get("next") as string) || ""

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  // next가 있으면 해당 경로로, 없으면 홈으로
  const destination = next && next.startsWith("/") ? next : `/${locale}`
  redirect(destination)
}

// ──────────────────────────────────────────
// 이메일 회원가입
// ──────────────────────────────────────────
export async function signupWithEmail(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const nickname = formData.get("nickname") as string
  const language = (formData.get("language") as string) || "ko"
  const locale = (formData.get("locale") as string) || "ko"

  if (!email || !password || !nickname) {
    return { error: "모든 필드를 입력해주세요." }
  }
  if (nickname.length > 20) {
    return { error: "닉네임은 20자 이하로 입력해주세요." }
  }
  if (password.length < 8) {
    return { error: "비밀번호는 8자 이상이어야 합니다." }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname, language },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "이미 사용 중인 이메일입니다." }
    }
    return { error: error.message }
  }

  // 이메일 확인 불필요한 경우 바로 로그인 시도
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
  if (!loginError) {
    redirect(`/${locale}`)
  }

  return { success: "가입이 완료되었습니다." }
}

// ──────────────────────────────────────────
// 소셜 로그인 (카카오 / 구글 / LINE)
// ──────────────────────────────────────────
export async function loginWithSocial(provider: "kakao" | "google" | "line", locale: string) {
  const supabase = await createClient()

  // LINE은 Supabase가 지원하지만 타입 정의가 버전마다 다를 수 있어 캐스팅
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`,
      queryParams:
        provider === "kakao"
          ? { prompt: "select_account" }
          : undefined,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

// ──────────────────────────────────────────
// 로그아웃
// ──────────────────────────────────────────
export async function logout(locale: string = "ko") {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect(`/${locale}`)
}

// ──────────────────────────────────────────
// 현재 유저 프로필 조회
// ──────────────────────────────────────────
export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}
